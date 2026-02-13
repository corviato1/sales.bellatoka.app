const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

const SESSION_SECRET = process.env.SESSION_SECRET;
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

function verifyToken(token) {
  if (!SESSION_SECRET) return null;
  try {
    const [dataB64, signature] = token.split('.');
    if (!dataB64 || !signature) return null;
    const data = Buffer.from(dataB64, 'base64').toString('utf8');
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
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

async function initTestimonialsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      location VARCHAR(100),
      text TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      date VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!DATABASE_URL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database not configured.' })
    };
  }

  const sql = neon(DATABASE_URL);

  try {
    await initTestimonialsTable(sql);

    if (event.httpMethod === 'GET') {
      const result = await sql`SELECT * FROM testimonials ORDER BY created_at DESC`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ testimonials: result })
      };
    }

    if (event.httpMethod === 'POST') {
      if (!isAuthenticated(event)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      const body = JSON.parse(event.body || '{}');
      const { name, location, text, rating, date } = body;

      if (!name || !text) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name and testimonial text are required' }) };
      }

      const tName = name.trim().substring(0, 100);
      const tLocation = (location || '').trim().substring(0, 100) || null;
      const tText = text.trim().substring(0, 2000);
      const tRating = Math.min(Math.max(parseInt(rating) || 5, 1), 5);
      const tDate = (date || new Date().getFullYear().toString()).substring(0, 20);

      const result = await sql`
        INSERT INTO testimonials (name, location, text, rating, date)
        VALUES (${tName}, ${tLocation}, ${tText}, ${tRating}, ${tDate})
        RETURNING *
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(result[0])
      };
    }

    if (event.httpMethod === 'DELETE') {
      if (!isAuthenticated(event)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      let rawPath = event.path || '';
      rawPath = rawPath.replace(/^\/?\.netlify\/functions\/testimonials\/?/, '');
      rawPath = rawPath.replace(/^\/?api\/testimonials\/?/, '');
      const pathParts = rawPath.split('/').filter(Boolean);
      const id = pathParts[0];

      if (!id || !/^\d+$/.test(id)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid testimonial ID required' }) };
      }

      const result = await sql`DELETE FROM testimonials WHERE id = ${parseInt(id)}`;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Testimonials error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
