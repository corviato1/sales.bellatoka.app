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

async function initSettingsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(50) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!DATABASE_URL) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database not configured.' }) };
  }

  const sql = neon(DATABASE_URL);

  try {
    await initSettingsTable(sql);

    if (event.httpMethod === 'GET') {
      const result = await sql`SELECT key, value FROM settings`;
      const settings = {};
      result.forEach(row => { settings[row.key] = row.value; });
      return { statusCode: 200, headers, body: JSON.stringify({ settings }) };
    }

    if (event.httpMethod === 'PUT') {
      if (!isAuthenticated(event)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
      }

      const body = JSON.parse(event.body || '{}');
      const { key, value } = body;

      if (!key || typeof value === 'undefined') {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Key and value are required' }) };
      }

      await sql`
        INSERT INTO settings (key, value, updated_at)
        VALUES (${key.substring(0, 50)}, ${String(value).substring(0, 500)}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${String(value).substring(0, 500)}, updated_at = NOW()
      `;

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Settings error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
