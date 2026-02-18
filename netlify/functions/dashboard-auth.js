const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
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

  const dashboardPassword = process.env.DASHBOARD_PASSWORD;
  if (!dashboardPassword) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server misconfigured. DASHBOARD_PASSWORD not set.' }),
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

  const inputBuf = Buffer.from(password);
  const correctBuf = Buffer.from(dashboardPassword);

  if (inputBuf.length !== correctBuf.length) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid password' }),
    };
  }

  try {
    const isValid = crypto.timingSafeEqual(inputBuf, correctBuf);
    if (isValid) {
      const token = generateToken();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, token }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Comparison error: ' + err.message }),
    };
  }

  return {
    statusCode: 401,
    headers,
    body: JSON.stringify({ error: 'Invalid password' }),
  };
};
