const crypto = require('crypto');
const { v2: cloudinary } = require('cloudinary');

const SESSION_SECRET = process.env.SESSION_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!isAuthenticated(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Cloudinary not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' })
    };
  }

  try {
    const contentType = event.headers['content-type'] || '';

    if (contentType.includes('application/json')) {
      const body = JSON.parse(event.body);
      const { images } = body;

      if (!images || !Array.isArray(images) || images.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No images provided. Send { "images": ["data:image/...base64string", ...] }' })
        };
      }

      const uploadPromises = images.map((base64Image) =>
        cloudinary.uploader.upload(base64Image, {
          folder: 'newton-realty',
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1600, crop: 'limit' }
          ]
        })
      );

      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.secure_url);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ urls })
      };
    }

    if (contentType.includes('multipart/form-data')) {
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid multipart boundary' }) };
      }

      const bodyBuffer = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body);

      const parts = parseMultipart(bodyBuffer, boundary);

      if (parts.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No files found in upload' }) };
      }

      const uploadPromises = parts.map((part) => {
        const base64Data = `data:${part.contentType};base64,${part.data.toString('base64')}`;
        return cloudinary.uploader.upload(base64Data, {
          folder: 'newton-realty',
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1600, crop: 'limit' }
          ]
        });
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map(r => r.secure_url);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ urls })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Unsupported content type. Use application/json with base64 images or multipart/form-data.' })
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to upload images: ' + err.message })
    };
  }
};

function parseMultipart(body, boundary) {
  const parts = [];
  const delimiter = `--${boundary}`;
  const endDelimiter = `--${boundary}--`;
  const bodyStr = body.toString('binary');

  const segments = bodyStr.split(delimiter);

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];

    if (segment.startsWith('--')) break;

    const headerEnd = segment.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;

    const headerStr = segment.substring(0, headerEnd);
    const dataStr = segment.substring(headerEnd + 4);

    const trimmedData = dataStr.endsWith('\r\n') ? dataStr.slice(0, -2) : dataStr;

    const contentTypeMatch = headerStr.match(/Content-Type:\s*(.+)/i);
    const filenameMatch = headerStr.match(/filename="([^"]+)"/i);

    if (contentTypeMatch && filenameMatch && contentTypeMatch[1].trim().startsWith('image/')) {
      parts.push({
        filename: filenameMatch[1],
        contentType: contentTypeMatch[1].trim(),
        data: Buffer.from(trimmedData, 'binary')
      });
    }
  }

  return parts;
}
