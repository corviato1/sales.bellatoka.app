import { neon } from '@netlify/neon';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET;

function verifyToken(token) {
  if (!SESSION_SECRET) return null;
  try {
    const [dataB64, signature] = token.split('.');
    if (!dataB64 || !signature) return null;
    const data = Buffer.from(dataB64, 'base64').toString('utf8');
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
    const payload = JSON.parse(data);
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function isAuthenticated(event) {
  const authHeader = event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return verifyToken(token) !== null;
}

function getVisitorIP(event) {
  const ip = event.headers['x-nf-client-connection-ip']
    || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || event.headers['client-ip']
    || null;
  return ip;
}

async function getGeoLocation(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    return { city: null, region: null, country: null };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { city: null, region: null, country: null };
    const data = await res.json();
    return {
      city: data.city || null,
      region: data.region || null,
      country: data.country_name || null
    };
  } catch {
    return { city: null, region: null, country: null };
  }
}

async function initTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      page_path VARCHAR(500) NOT NULL,
      visitor_ip VARCHAR(45),
      user_agent TEXT,
      referrer TEXT,
      city VARCHAR(100),
      region VARCHAR(100),
      country VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS listing_views (
      id SERIAL PRIMARY KEY,
      listing_id VARCHAR(50) NOT NULL,
      listing_address VARCHAR(500),
      listing_city VARCHAR(100),
      visitor_ip VARCHAR(45),
      time_spent_seconds INTEGER DEFAULT 0,
      city VARCHAR(100),
      region VARCHAR(100),
      country VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

async function handlePost(event, sql) {
  const body = JSON.parse(event.body || '{}');
  const { action } = body;
  const visitorIP = getVisitorIP(event);
  const geo = await getGeoLocation(visitorIP);

  if (action === 'pageview') {
    const { path, referrer, userAgent } = body;
    if (!path || typeof path !== 'string' || path.length > 500) {
      return { error: 'Invalid path' };
    }
    await sql`
      INSERT INTO page_views (page_path, visitor_ip, user_agent, referrer, city, region, country)
      VALUES (${path.slice(0, 500)}, ${visitorIP}, ${(userAgent || '').slice(0, 500)}, ${(referrer || '').slice(0, 500) || null}, ${geo.city}, ${geo.region}, ${geo.country})
    `;
    return { success: true, message: 'Page view recorded' };
  }

  if (action === 'listing_view') {
    const { listingId, listingAddress, listingCity, timeSpent } = body;
    if (!listingId) {
      return { error: 'Invalid listingId' };
    }
    const sanitizedTime = Math.max(0, Math.min(Number(timeSpent) || 0, 3600));
    await sql`
      INSERT INTO listing_views (listing_id, listing_address, listing_city, visitor_ip, time_spent_seconds, city, region, country)
      VALUES (${String(listingId).slice(0, 50)}, ${(listingAddress || '').slice(0, 500) || null}, ${(listingCity || '').slice(0, 100) || null}, ${visitorIP}, ${sanitizedTime}, ${geo.city}, ${geo.region}, ${geo.country})
    `;
    return { success: true, message: 'Listing view recorded' };
  }

  return { error: 'Invalid action' };
}

async function handleGetSummary(sql) {
  const [totalResult] = await sql`SELECT COUNT(*) as total FROM page_views`;
  const [uniqueResult] = await sql`SELECT COUNT(DISTINCT visitor_ip) as total FROM page_views WHERE visitor_ip IS NOT NULL`;
  const [todayResult] = await sql`SELECT COUNT(*) as total FROM page_views WHERE created_at >= CURRENT_DATE`;
  const [weekResult] = await sql`SELECT COUNT(*) as total FROM page_views WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`;
  const [monthResult] = await sql`SELECT COUNT(*) as total FROM page_views WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'`;

  const topPages = await sql`
    SELECT page_path, COUNT(*) as views
    FROM page_views
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10
  `;

  const trafficByDay = await sql`
    SELECT DATE(created_at) as date, COUNT(*) as views
    FROM page_views
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  return {
    totalPageViews: Number(totalResult.total),
    uniqueVisitors: Number(uniqueResult.total),
    viewsToday: Number(todayResult.total),
    viewsThisWeek: Number(weekResult.total),
    viewsThisMonth: Number(monthResult.total),
    topPages,
    trafficByDay
  };
}

async function handleGetListings(sql) {
  const listings = await sql`
    SELECT
      listing_id,
      MAX(listing_address) as listing_address,
      MAX(listing_city) as listing_city,
      COUNT(*) as total_views,
      COUNT(DISTINCT visitor_ip) as unique_viewers,
      ROUND(AVG(time_spent_seconds)) as avg_time_spent
    FROM listing_views
    GROUP BY listing_id
    ORDER BY total_views DESC
  `;

  const result = [];
  for (const listing of listings) {
    const locations = await sql`
      SELECT city, region, country, COUNT(*) as count
      FROM listing_views
      WHERE listing_id = ${listing.listing_id} AND city IS NOT NULL
      GROUP BY city, region, country
      ORDER BY count DESC
      LIMIT 5
    `;
    result.push({
      ...listing,
      total_views: Number(listing.total_views),
      unique_viewers: Number(listing.unique_viewers),
      avg_time_spent: Number(listing.avg_time_spent),
      top_viewer_locations: locations
    });
  }

  return { listings: result };
}

async function handleGetListingDetail(sql, listingId) {
  const [summary] = await sql`
    SELECT
      COUNT(*) as total_views,
      COUNT(DISTINCT visitor_ip) as unique_viewers,
      ROUND(AVG(time_spent_seconds)) as avg_time_spent
    FROM listing_views
    WHERE listing_id = ${listingId}
  `;

  const viewsByDay = await sql`
    SELECT DATE(created_at) as date, COUNT(*) as views
    FROM listing_views
    WHERE listing_id = ${listingId} AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  const locations = await sql`
    SELECT city, region, country, COUNT(*) as count
    FROM listing_views
    WHERE listing_id = ${listingId} AND city IS NOT NULL
    GROUP BY city, region, country
    ORDER BY count DESC
  `;

  return {
    totalViews: Number(summary.total_views),
    uniqueViewers: Number(summary.unique_viewers),
    avgTimeSpent: Number(summary.avg_time_spent),
    viewsByDay,
    viewerLocations: locations
  };
}

const BOT_PATTERNS = [
  { pattern: /GPTBot/i, name: 'GPTBot (OpenAI)' },
  { pattern: /ChatGPT/i, name: 'ChatGPT (OpenAI)' },
  { pattern: /OpenAI/i, name: 'OpenAI' },
  { pattern: /ClaudeBot/i, name: 'ClaudeBot (Anthropic)' },
  { pattern: /Anthropic/i, name: 'Anthropic' },
  { pattern: /Google-Extended/i, name: 'Google-Extended' },
  { pattern: /Googlebot/i, name: 'Googlebot' },
  { pattern: /Bingbot/i, name: 'Bingbot' },
  { pattern: /PerplexityBot/i, name: 'PerplexityBot' },
  { pattern: /Applebot/i, name: 'Applebot' },
  { pattern: /Bytespider/i, name: 'Bytespider' },
  { pattern: /PetalBot/i, name: 'PetalBot' },
  { pattern: /YandexBot/i, name: 'YandexBot' },
  { pattern: /Baiduspider/i, name: 'Baiduspider' },
  { pattern: /FacebookBot/i, name: 'FacebookBot' },
  { pattern: /facebookexternalhit/i, name: 'Facebook' },
  { pattern: /Twitterbot/i, name: 'Twitterbot' },
  { pattern: /LinkedInBot/i, name: 'LinkedInBot' },
  { pattern: /Slurp/i, name: 'Yahoo Slurp' },
  { pattern: /bot/i, name: 'Bot' },
  { pattern: /crawler/i, name: 'Crawler' },
  { pattern: /spider/i, name: 'Spider' },
  { pattern: /scraper/i, name: 'Scraper' },
  { pattern: /curl\//i, name: 'curl' },
  { pattern: /wget\//i, name: 'wget' },
  { pattern: /python-requests/i, name: 'python-requests' },
  { pattern: /axios\//i, name: 'axios' },
  { pattern: /node-fetch/i, name: 'node-fetch' },
  { pattern: /Go-http-client/i, name: 'Go-http-client' },
];

async function handleGetUsers(sql) {
  const usersResult = await sql`
    SELECT 
      visitor_ip,
      COUNT(*) as total_views,
      COUNT(DISTINCT page_path) as unique_pages,
      MIN(created_at) as first_visit,
      MAX(created_at) as last_visit,
      ARRAY_AGG(DISTINCT page_path) as pages_visited,
      (ARRAY_AGG(DISTINCT user_agent))[1:3] as user_agents,
      (ARRAY_AGG(DISTINCT city) FILTER (WHERE city IS NOT NULL))[1] as city,
      (ARRAY_AGG(DISTINCT region) FILTER (WHERE region IS NOT NULL))[1] as region,
      (ARRAY_AGG(DISTINCT country) FILTER (WHERE country IS NOT NULL))[1] as country
    FROM page_views
    WHERE visitor_ip IS NOT NULL
    GROUP BY visitor_ip
    ORDER BY total_views DESC
  `;

  const users = usersResult.map(row => {
    const allAgents = (row.user_agents || []).join(' ');
    let is_bot = false;
    let bot_name = null;
    for (const bp of BOT_PATTERNS) {
      if (bp.pattern.test(allAgents)) {
        is_bot = true;
        bot_name = bp.name;
        break;
      }
    }
    return {
      visitor_ip: row.visitor_ip,
      total_views: Number(row.total_views),
      unique_pages: Number(row.unique_pages),
      first_visit: row.first_visit,
      last_visit: row.last_visit,
      pages_visited: row.pages_visited || [],
      user_agents: row.user_agents || [],
      city: row.city || null,
      region: row.region || null,
      country: row.country || null,
      is_bot,
      bot_name,
    };
  });

  return { users };
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let sql;
  try {
    sql = neon(process.env.NETLIFY_DATABASE_URL);
  } catch {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Database not available' })
    };
  }

  try {
    await initTables(sql);

    if (event.httpMethod === 'POST') {
      const result = await handlePost(event, sql);
      const statusCode = result.error ? 400 : 200;
      return { statusCode, headers, body: JSON.stringify(result) };
    }

    if (event.httpMethod === 'GET') {
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }

      const params = event.queryStringParameters || {};
      const action = params.action;

      if (action === 'summary') {
        const data = await handleGetSummary(sql);
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      if (action === 'listings') {
        const data = await handleGetListings(sql);
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      if (action === 'listing_detail') {
        const listingId = params.listingId;
        if (!listingId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'listingId parameter required' })
          };
        }
        const data = await handleGetListingDetail(sql, listingId);
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      if (action === 'users') {
        const data = await handleGetUsers(sql);
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action. Use: summary, listings, listing_detail, or users' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Analytics error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
