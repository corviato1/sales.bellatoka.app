const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const record = attempts.get(ip) || [];
  const recent = record.filter((t) => now - t < WINDOW_MS);
  attempts.set(ip, recent);
  if (recent.length >= MAX_ATTEMPTS) return true;
  recent.push(now);
  attempts.set(ip, recent);
  return false;
}

function safeCompare(input, correct) {
  const inputHash = crypto.createHash('sha256').update(input).digest();
  const correctHash = crypto.createHash('sha256').update(correct).digest();
  return crypto.timingSafeEqual(inputHash, correctHash);
}

function getAllowedOrigin(requestOrigin) {
  const siteUrl = process.env.URL;
  if (!siteUrl) return '*';
  if (requestOrigin && requestOrigin.replace(/\/$/, '') === siteUrl.replace(/\/$/, '')) {
    return requestOrigin;
  }
  return siteUrl;
}

exports.handler = async (event) => {
  const requestOrigin = event.headers['origin'] || event.headers['Origin'] || '';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': getAllowedOrigin(requestOrigin),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
    };
  }

  const dashboardPassword = process.env.DASHBOARD_PASSWORD;
  if (!dashboardPassword) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const { password } = body;
  if (!password) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Password required' }),
    };
  }

  if (safeCompare(password, dashboardPassword)) {
    const token = generateToken();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, token }),
    };
  }

  return {
    statusCode: 401,
    headers,
    body: JSON.stringify({ error: 'Invalid password' }),
  };
};
