const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

const SESSION_SECRET = process.env.SESSION_SECRET;
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

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

const COLUMNS = [
  'address', 'city', 'state', 'zip', 'price', 'status', 'property_type',
  'property_sub_type', 'beds', 'baths_full', 'baths_half', 'baths_three_quarter',
  'sqft', 'price_per_sqft', 'year_built', 'listing_id', 'days_on_mls',
  'subdivision', 'lot_size', 'garage_spaces', 'levels', 'description',
  'directions', 'parking', 'laundry', 'cooling', 'heating', 'fireplace',
  'patio_porch', 'pool', 'view_description', 'sewer', 'eating_area',
  'appliances', 'interior_features', 'flooring', 'association_fee',
  'association_fee_frequency', 'high_school_district', 'mls_area', 'county',
  'assessments', 'tax_annual_amount', 'listing_agent', 'listing_office',
  'special_conditions', 'open_house_date', 'open_house_time', 'is_new_listing',
  'photos', 'original_price', 'land_lease', 'mls_data'
];

const INTEGER_FIELDS = [
  'beds', 'baths_full', 'baths_half', 'baths_three_quarter', 'sqft',
  'year_built', 'garage_spaces', 'days_on_mls', 'price', 'original_price'
];

const NUMERIC_FIELDS = [
  'association_fee', 'tax_annual_amount', 'price_per_sqft'
];

const ALL_NUMBER_FIELDS = [...INTEGER_FIELDS, ...NUMERIC_FIELDS];

function cleanValue(col, val) {
  if (val === null || val === undefined) return undefined;
  if (val === '' || val === 'NaN' || val === 'null' || val === 'undefined') return undefined;
  if (typeof val === 'number' && (isNaN(val) || !isFinite(val))) return undefined;

  if (col === 'photos') {
    if (Array.isArray(val) && val.length === 0) return undefined;
    if (Array.isArray(val)) return val;
    return undefined;
  }
  if (col === 'mls_data') {
    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
    if (typeof val === 'string') return val;
    return undefined;
  }
  if (col === 'is_new_listing') {
    return val === true || val === 'true';
  }
  if (ALL_NUMBER_FIELDS.includes(col)) {
    const num = Number(val);
    if (isNaN(num) || !isFinite(num)) return undefined;
    if (INTEGER_FIELDS.includes(col)) return Math.round(num);
    return num;
  }
  if (typeof val === 'string' && val.trim() === '') return undefined;
  return val;
}

function sanitizeValues(fields, values) {
  const cleanFields = [];
  const cleanVals = [];
  for (let i = 0; i < fields.length; i++) {
    const v = values[i];
    if (v === undefined || v === null) continue;
    if (typeof v === 'number' && (isNaN(v) || !isFinite(v))) continue;
    if (v === 'NaN' || v === 'Infinity' || v === '-Infinity') continue;
    cleanFields.push(fields[i]);
    cleanVals.push(v);
  }
  return { fields: cleanFields, values: cleanVals };
}

function sanitizeRow(row) {
  if (!row) return row;
  const cleaned = { ...row };
  for (const col of ALL_NUMBER_FIELDS) {
    if (cleaned[col] !== null && cleaned[col] !== undefined) {
      const num = Number(cleaned[col]);
      if (isNaN(num) || !isFinite(num)) {
        cleaned[col] = null;
      }
    }
  }
  return cleaned;
}

async function initDB(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      address TEXT,
      city TEXT,
      state TEXT DEFAULT 'CA',
      zip TEXT,
      price INTEGER,
      status TEXT DEFAULT 'Active',
      property_type TEXT DEFAULT 'Residential',
      property_sub_type TEXT,
      beds INTEGER,
      baths_full INTEGER DEFAULT 0,
      baths_half INTEGER DEFAULT 0,
      baths_three_quarter INTEGER DEFAULT 0,
      sqft INTEGER,
      price_per_sqft NUMERIC(10,2),
      year_built INTEGER,
      listing_id TEXT,
      days_on_mls INTEGER DEFAULT 0,
      subdivision TEXT,
      lot_size TEXT,
      garage_spaces INTEGER DEFAULT 0,
      levels TEXT,
      description TEXT,
      directions TEXT,
      parking TEXT,
      laundry TEXT,
      cooling TEXT,
      heating TEXT,
      fireplace TEXT,
      patio_porch TEXT,
      pool TEXT,
      view_description TEXT,
      sewer TEXT,
      eating_area TEXT,
      appliances TEXT,
      interior_features TEXT,
      flooring TEXT,
      association_fee NUMERIC(10,2),
      association_fee_frequency TEXT,
      high_school_district TEXT,
      mls_area TEXT,
      county TEXT DEFAULT 'Orange',
      assessments TEXT,
      tax_annual_amount NUMERIC(10,2),
      listing_agent TEXT,
      listing_office TEXT,
      special_conditions TEXT,
      open_house_date TEXT,
      open_house_time TEXT,
      is_new_listing BOOLEAN DEFAULT false,
      photos TEXT[] DEFAULT '{}',
      original_price INTEGER,
      land_lease TEXT,
      mls_data JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

async function cleanupNaNValues(sql) {
  const results = [];

  for (const col of NUMERIC_FIELDS) {
    try {
      const r = await sql.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}" IN ('NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric)`);
      results.push({ col, method: 'numeric_special', rows: r?.rowCount || 0 });
    } catch (e1) {
      results.push({ col, method: 'numeric_special', error: e1.message });
      try {
        const r = await sql.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}"::text IN ('NaN', 'Infinity', '-Infinity')`);
        results.push({ col, method: 'text_cast', rows: r?.rowCount || 0 });
      } catch (e2) {
        results.push({ col, method: 'text_cast', error: e2.message });
      }
    }
  }

  for (const col of INTEGER_FIELDS) {
    try {
      const r = await sql.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}"::text IN ('NaN', 'Infinity', '-Infinity', 'null', '')`);
      results.push({ col, method: 'text_in', rows: r?.rowCount || 0 });
    } catch (e1) {
      results.push({ col, method: 'text_in', error: e1.message });
      try {
        const r = await sql.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}"::text = 'NaN'`);
        results.push({ col, method: 'text_eq', rows: r?.rowCount || 0 });
      } catch (e2) {
        results.push({ col, method: 'text_eq', error: e2.message });
      }
    }
  }

  return results;
}

async function diagnoseDatabase(sql) {
  const report = { columns: {}, errors: [], rowCount: 0, selectTests: {} };

  try {
    const countResult = await sql`SELECT COUNT(*) as count FROM listings`;
    report.rowCount = parseInt(countResult[0].count);
  } catch (e) {
    report.errors.push('COUNT failed: ' + e.message);
  }

  try {
    const colInfo = await sql`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'listings' ORDER BY ordinal_position`;
    for (const c of colInfo) {
      report.columns[c.column_name] = { type: c.data_type, nullable: c.is_nullable };
    }
  } catch (e) {
    report.errors.push('Column info failed: ' + e.message);
  }

  try {
    await sql`SELECT id FROM listings LIMIT 1`;
    report.selectTests['id_only'] = 'OK';
  } catch (e) {
    report.selectTests['id_only'] = 'FAIL: ' + e.message;
  }

  try {
    await sql`SELECT id, address, city FROM listings LIMIT 1`;
    report.selectTests['text_cols'] = 'OK';
  } catch (e) {
    report.selectTests['text_cols'] = 'FAIL: ' + e.message;
  }

  for (const col of ALL_NUMBER_FIELDS) {
    try {
      const r = await sql.query(`SELECT id, "${col}" FROM listings WHERE "${col}" IS NOT NULL LIMIT 3`);
      report.selectTests[col] = { status: 'OK', sampleCount: r.length, samples: r.map(row => ({ id: row.id, value: String(row[col]) })) };
    } catch (e) {
      report.selectTests[col] = { status: 'FAIL', error: e.message };
    }
  }

  try {
    await sql`SELECT * FROM listings LIMIT 1`;
    report.selectTests['select_star'] = 'OK';
  } catch (e) {
    report.selectTests['select_star'] = 'FAIL: ' + e.message;
  }

  return report;
}

async function nuclearFix(sql) {
  const results = [];

  for (const col of NUMERIC_FIELDS) {
    try {
      await sql.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE TEXT`);
      await sql.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}" IN ('NaN', 'Infinity', '-Infinity', 'null', 'undefined', '') OR "${col}" IS NULL`);
      await sql.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE NUMERIC(10,2) USING CASE WHEN "${col}" ~ '^-?[0-9]+(\\.[0-9]+)?$' THEN "${col}"::NUMERIC(10,2) ELSE NULL END`);
      results.push({ col, status: 'fixed_via_alter' });
    } catch (e) {
      results.push({ col, status: 'alter_failed', error: e.message });
    }
  }

  for (const col of INTEGER_FIELDS) {
    try {
      await sql.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE TEXT`);
      await sql.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}" IN ('NaN', 'Infinity', '-Infinity', 'null', 'undefined', '') OR "${col}" IS NULL`);
      await sql.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE INTEGER USING CASE WHEN "${col}" ~ '^-?[0-9]+$' THEN "${col}"::INTEGER ELSE NULL END`);
      results.push({ col, status: 'fixed_via_alter' });
    } catch (e) {
      results.push({ col, status: 'alter_failed', error: e.message });
    }
  }

  return results;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!DATABASE_URL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database not configured. Set NEON_DATABASE_URL in Netlify environment variables.' })
    };
  }

  const sql = neon(DATABASE_URL);

  if (['POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
    if (!isAuthenticated(event)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }
  }

  try {
    await initDB(sql);

    let cleanPath = event.path
      .replace('/.netlify/functions/listings', '')
      .replace('/api/listings', '');
    const pathParts = cleanPath.split('/').filter(Boolean);
    const rawId = pathParts[0] || null;
    const listingId = rawId && /^\d+$/.test(rawId) ? rawId : null;

    const params = event.queryStringParameters || {};

    if (params.action === 'diagnose') {
      try {
        const report = await diagnoseDatabase(sql);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ action: 'diagnose', report })
        };
      } catch (diagErr) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Diagnose failed: ' + diagErr.message })
        };
      }
    }

    if (params.action === 'cleanup') {
      try {
        const cleanupResults = await cleanupNaNValues(sql);
        const result = await sql`SELECT COUNT(*) as count FROM listings`;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Database cleaned up successfully', totalListings: result[0].count, details: cleanupResults })
        };
      } catch (cleanErr) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Cleanup failed: ' + cleanErr.message })
        };
      }
    }

    if (params.action === 'fix') {
      if (!isAuthenticated(event)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized - admin auth required for deep repair' }) };
      }
      try {
        const fixResults = await nuclearFix(sql);
        const result = await sql`SELECT COUNT(*) as count FROM listings`;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: 'Deep repair completed', totalListings: result[0].count, details: fixResults })
        };
      } catch (fixErr) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Deep repair failed: ' + fixErr.message })
        };
      }
    }

    if (event.httpMethod === 'GET') {
      if (listingId) {
        try {
          const result = await sql`SELECT * FROM listings WHERE id = ${parseInt(listingId)}`;
          if (result.length === 0) {
            return { statusCode: 404, headers, body: JSON.stringify({ error: 'Listing not found' }) };
          }
          return { statusCode: 200, headers, body: JSON.stringify(sanitizeRow(result[0])) };
        } catch (singleErr) {
          console.log('Single listing SELECT failed, attempting cleanup:', String(singleErr));
          try {
            await cleanupNaNValues(sql);
            const result = await sql`SELECT * FROM listings WHERE id = ${parseInt(listingId)}`;
            if (result.length === 0) {
              return { statusCode: 404, headers, body: JSON.stringify({ error: 'Listing not found' }) };
            }
            return { statusCode: 200, headers, body: JSON.stringify(sanitizeRow(result[0])) };
          } catch (retryErr) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to load listing: ' + (retryErr.message || String(retryErr)) }) };
          }
        }
      }

      try {
        const result = await sql`SELECT * FROM listings ORDER BY created_at DESC`;
        const cleanedListings = result.map(sanitizeRow);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ listings: cleanedListings })
        };
      } catch (selectErr) {
        console.log('Listings SELECT failed, attempting auto-cleanup. Error:', String(selectErr), JSON.stringify(selectErr));
        try {
          await cleanupNaNValues(sql);
          const result = await sql`SELECT * FROM listings ORDER BY created_at DESC`;
          const cleanedListings = result.map(sanitizeRow);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ listings: cleanedListings })
          };
        } catch (retryErr) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Database recovery failed: ' + (retryErr.message || String(retryErr)) })
          };
        }
      }
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');

      const p = Number(body.price), s = Number(body.sqft);
      if (p > 0 && s > 0 && !body.price_per_sqft) {
        const pps = p / s;
        if (isFinite(pps) && !isNaN(pps)) {
          body.price_per_sqft = pps.toFixed(2);
        }
      }

      const cleanBody = {};
      for (const col of COLUMNS) {
        if (body[col] !== undefined) {
          const cleaned = cleanValue(col, body[col]);
          if (cleaned !== undefined) {
            cleanBody[col] = cleaned;
          }
        }
      }

      let { fields, values } = sanitizeValues(Object.keys(cleanBody), Object.values(cleanBody));

      if (fields.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No valid fields provided' }) };
      }

      const placeholders = fields.map((_, i) => `$${i + 1}`);
      const photosIdx = fields.indexOf('photos');
      if (photosIdx !== -1) {
        placeholders[photosIdx] = `$${photosIdx + 1}::text[]`;
      }
      const mlsDataIdx = fields.indexOf('mls_data');
      if (mlsDataIdx !== -1) {
        placeholders[mlsDataIdx] = `$${mlsDataIdx + 1}::jsonb`;
      }

      const query = `INSERT INTO listings (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
      const result = await sql.query(query, values);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(sanitizeRow(result[0]))
      };
    }

    if (event.httpMethod === 'PUT') {
      if (!listingId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Listing ID required' }) };
      }

      const body = JSON.parse(event.body || '{}');

      const p = Number(body.price), s = Number(body.sqft);
      if (p > 0 && s > 0) {
        const pps = p / s;
        if (isFinite(pps) && !isNaN(pps)) {
          body.price_per_sqft = pps.toFixed(2);
        }
      }

      const cleanBody = {};
      for (const col of COLUMNS) {
        if (body[col] !== undefined) {
          const cleaned = cleanValue(col, body[col]);
          cleanBody[col] = cleaned !== undefined ? cleaned : null;
        }
      }

      let { fields, values } = sanitizeValues(Object.keys(cleanBody), Object.values(cleanBody));

      if (fields.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No fields to update' }) };
      }

      const setClauses = fields.map((col, i) => {
        if (col === 'photos') return `${col} = $${i + 1}::text[]`;
        if (col === 'mls_data') return `${col} = $${i + 1}::jsonb`;
        return `${col} = $${i + 1}`;
      });
      setClauses.push('updated_at = NOW()');
      values.push(parseInt(listingId));

      const query = `UPDATE listings SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const result = await sql.query(query, values);

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Listing not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(sanitizeRow(result[0])) };
    }

    if (event.httpMethod === 'DELETE') {
      if (!listingId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Listing ID required' }) };
      }
      await sql`DELETE FROM listings WHERE id = ${parseInt(listingId)}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (error) {
    console.error('Listings error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Database error: ' + error.message })
    };
  }
};
