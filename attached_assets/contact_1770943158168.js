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

async function initLeadsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      phone VARCHAR(20),
      form_type VARCHAR(50),
      message TEXT,
      property_address VARCHAR(200),
      buying_timeline VARCHAR(100),
      price_range VARCHAR(100),
      source VARCHAR(200),
      visitor_ip VARCHAR(45),
      status VARCHAR(20) DEFAULT 'new',
      read_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS read_at TIMESTAMP`;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!DATABASE_URL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database not configured. Set NEON_DATABASE_URL in environment variables.' })
    };
  }

  const sql = neon(DATABASE_URL);

  try {
    await initLeadsTable(sql);

    if (event.httpMethod === 'GET') {
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }

      const result = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ leads: result })
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { name, email, phone, message, formType, propertyAddress, buyingTimeline, priceRange, source } = body;

      if (!name || !email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name and email are required' })
        };
      }

      if (name.length > 100 || email.length > 100) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid input length' })
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid email format' })
        };
      }

      const leadName = name.trim().substring(0, 100);
      const leadEmail = email.trim().toLowerCase().substring(0, 100);
      const leadPhone = phone ? phone.trim().substring(0, 20) : null;
      const leadFormType = formType || 'contact';
      const leadMessage = message ? message.trim().substring(0, 2000) : null;
      const leadPropertyAddress = propertyAddress ? propertyAddress.trim().substring(0, 200) : null;
      const leadBuyingTimeline = buyingTimeline || null;
      const leadPriceRange = priceRange || null;
      const leadSource = source || '/';
      const visitorIp = (event.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();

      await sql`
        INSERT INTO leads (name, email, phone, form_type, message, property_address, buying_timeline, price_range, source, visitor_ip)
        VALUES (${leadName}, ${leadEmail}, ${leadPhone}, ${leadFormType}, ${leadMessage}, ${leadPropertyAddress}, ${leadBuyingTimeline}, ${leadPriceRange}, ${leadSource}, ${visitorIp})
      `;

      console.log('NEW LEAD saved to database:', JSON.stringify({ name: leadName, email: leadEmail, formType: leadFormType }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Thank you! Your message has been received. I\'ll be in touch within 24 hours.'
        })
      };
    }

    if (event.httpMethod === 'PATCH') {
      if (!isAuthenticated(event)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      const patchPath = event.path || '';
      const patchSegments = patchPath.replace(/^\/?(\.netlify\/functions\/contact|api\/contact)\/?/, '').split('/').filter(Boolean);
      const patchLeadId = patchSegments[0];
      const patchAction = patchSegments[1];

      if (!patchLeadId || !/^\d+$/.test(patchLeadId) || patchAction !== 'read') {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request' }) };
      }

      const patchResult = await sql`UPDATE leads SET read_at = NOW() WHERE id = ${parseInt(patchLeadId)} RETURNING *`;
      if (patchResult.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Lead not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, lead: patchResult[0] }) };
    }

    if (event.httpMethod === 'DELETE') {
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }

      const path = event.path || '';
      const segments = path.replace(/^\/?(\.netlify\/functions\/contact|api\/contact)\/?/, '').split('/').filter(Boolean);
      const leadId = segments[0];

      if (!leadId || !/^\d+$/.test(leadId)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid lead ID' })
        };
      }

      await sql`DELETE FROM leads WHERE id = ${parseInt(leadId)}`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
