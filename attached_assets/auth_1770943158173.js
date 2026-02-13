const crypto = require('crypto');

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const SESSION_SECRET = process.env.SESSION_SECRET;

function generateToken(payload) {
  if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET not configured');
  }
  const data = JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  return Buffer.from(data).toString('base64') + '.' + signature;
}

function verifyToken(token) {
  if (!SESSION_SECRET) {
    return null;
  }
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
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!SESSION_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error: SESSION_SECRET not set' })
    };
  }

  if (!ADMIN_PASSWORD_HASH) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server configuration error: ADMIN_PASSWORD_HASH not set' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, password, token } = body;

    if (action === 'login') {
      if (!password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Password required' })
        };
      }

      if (password === ADMIN_PASSWORD_HASH) {
        const authToken = generateToken({ admin: true, loginAt: Date.now() });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, token: authToken })
        };
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid password' })
      };
    }

    if (action === 'verify') {
      const payload = verifyToken(token);
      if (payload) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ valid: true })
        };
      }
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ valid: false })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
