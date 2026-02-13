import express from 'express';
import cors from 'cors';
import pg from 'pg';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, '..', 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
const origLog = console.log;
const origError = console.error;
console.log = (...args) => {
  const msg = `[${new Date().toISOString()}] ${args.join(' ')}\n`;
  logStream.write(msg);
  origLog(...args);
};
console.error = (...args) => {
  const msg = `[${new Date().toISOString()}] ERROR: ${args.join(' ')}\n`;
  logStream.write(msg);
  origError(...args);
};

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split('/')[1]);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

app.use('/uploads', express.static(uploadsDir));

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

async function initDB() {
  await pool.query(`
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
    );
  `);
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS mls_data JSONB DEFAULT '{}';
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `);
  await pool.query(`
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
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
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
    );
  `);

  await pool.query(`
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
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      location VARCHAR(100),
      text TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      date VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(50) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE leads ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END $$;
  `);

  console.log('Database initialized - all tables ready');
}

app.post('/api/upload', upload.array('photos', 50), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      const urls = req.files.map(f => `/uploads/${f.filename}`);
      return res.json({ urls });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = req.files.map(f => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'newton-realty',
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 1600, crop: 'limit' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(f.buffer || fs.readFileSync(f.path));
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload files: ' + err.message });
  }
});

const NaN_INTEGER_FIELDS = [
  'beds', 'baths_full', 'baths_half', 'baths_three_quarter', 'sqft',
  'year_built', 'garage_spaces', 'days_on_mls', 'price', 'original_price'
];
const NaN_DECIMAL_FIELDS = ['association_fee', 'tax_annual_amount', 'price_per_sqft'];
const NaN_ALL_NUMERIC = [...NaN_INTEGER_FIELDS, ...NaN_DECIMAL_FIELDS];

function sanitizeRow(row) {
  if (!row) return row;
  for (const col of NaN_ALL_NUMERIC) {
    if (row[col] !== null && row[col] !== undefined) {
      const n = Number(row[col]);
      if (isNaN(n) || !isFinite(n)) {
        row[col] = null;
      }
    }
  }
  return row;
}

async function cleanupNaNInDB() {
  let fixed = 0;
  for (const col of NaN_ALL_NUMERIC) {
    try {
      const r = await pool.query(
        `UPDATE listings SET ${col} = NULL WHERE ${col}::text IN ('NaN', 'Infinity', '-Infinity', 'null', '')`
      );
      fixed += r.rowCount || 0;
    } catch (e) {
      console.error(`Cleanup error on column ${col}:`, e.message);
    }
  }
  return fixed;
}

app.get('/api/listings', async (req, res) => {
  try {
    if (req.query.action === 'diagnose') {
      const report = { columns: {}, errors: [], rowCount: 0, selectTests: {} };
      try {
        const countResult = await pool.query('SELECT COUNT(*) as count FROM listings');
        report.rowCount = parseInt(countResult.rows[0].count);
      } catch (e) { report.errors.push('COUNT failed: ' + e.message); }
      try {
        const colInfo = await pool.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'listings' ORDER BY ordinal_position");
        for (const c of colInfo.rows) {
          report.columns[c.column_name] = { type: c.data_type, nullable: c.is_nullable };
        }
      } catch (e) { report.errors.push('Column info failed: ' + e.message); }
      const ALL_NUMBER_FIELDS = ['beds', 'baths_full', 'baths_half', 'baths_three_quarter', 'sqft', 'year_built', 'garage_spaces', 'days_on_mls', 'price', 'original_price', 'association_fee', 'tax_annual_amount', 'price_per_sqft'];
      for (const col of ALL_NUMBER_FIELDS) {
        try {
          const r = await pool.query(`SELECT id, "${col}" FROM listings WHERE "${col}" IS NOT NULL LIMIT 3`);
          report.selectTests[col] = { status: 'OK', sampleCount: r.rows.length, samples: r.rows.map(row => ({ id: row.id, value: String(row[col]) })) };
        } catch (e) {
          report.selectTests[col] = { status: 'FAIL', error: e.message };
        }
      }
      try {
        await pool.query('SELECT * FROM listings LIMIT 1');
        report.selectTests['select_star'] = 'OK';
      } catch (e) { report.selectTests['select_star'] = 'FAIL: ' + e.message; }
      return res.json({ action: 'diagnose', report });
    }

    if (req.query.action === 'cleanup') {
      const fixed = await cleanupNaNInDB();
      const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
      const rows = result.rows.map(sanitizeRow);
      return res.json({ success: true, fixedValues: fixed, totalListings: rows.length, listings: rows });
    }

    if (req.query.action === 'fix') {
      const NUMERIC_FIELDS = ['association_fee', 'tax_annual_amount', 'price_per_sqft'];
      const INTEGER_FIELDS = ['beds', 'baths_full', 'baths_half', 'baths_three_quarter', 'sqft', 'year_built', 'garage_spaces', 'days_on_mls', 'price', 'original_price'];
      const results = [];
      for (const col of NUMERIC_FIELDS) {
        try {
          await pool.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE TEXT`);
          await pool.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}" IN ('NaN', 'Infinity', '-Infinity', 'null', 'undefined', '') OR "${col}" IS NULL`);
          await pool.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE NUMERIC(10,2) USING CASE WHEN "${col}" ~ '^-?[0-9]+(\\.[0-9]+)?$' THEN "${col}"::NUMERIC(10,2) ELSE NULL END`);
          results.push({ col, status: 'fixed_via_alter' });
        } catch (e) { results.push({ col, status: 'alter_failed', error: e.message }); }
      }
      for (const col of INTEGER_FIELDS) {
        try {
          await pool.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE TEXT`);
          await pool.query(`UPDATE listings SET "${col}" = NULL WHERE "${col}" IN ('NaN', 'Infinity', '-Infinity', 'null', 'undefined', '') OR "${col}" IS NULL`);
          await pool.query(`ALTER TABLE listings ALTER COLUMN "${col}" TYPE INTEGER USING CASE WHEN "${col}" ~ '^-?[0-9]+$' THEN "${col}"::INTEGER ELSE NULL END`);
          results.push({ col, status: 'fixed_via_alter' });
        } catch (e) { results.push({ col, status: 'alter_failed', error: e.message }); }
      }
      const result = await pool.query('SELECT COUNT(*) as count FROM listings');
      return res.json({ success: true, message: 'Nuclear fix completed', totalListings: result.rows[0].count, details: results });
    }

    let result;
    try {
      result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    } catch (selectErr) {
      console.log('SELECT failed, running auto-cleanup...');
      await cleanupNaNInDB();
      result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    }
    res.json({ listings: result.rows.map(sanitizeRow) });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(sanitizeRow(result.rows[0]));
  } catch (err) {
    console.error('Error fetching listing:', err);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

const INTEGER_FIELDS = [
  'beds', 'baths_full', 'baths_half', 'baths_three_quarter', 'sqft',
  'year_built', 'garage_spaces', 'days_on_mls', 'price', 'original_price'
];

const DECIMAL_FIELDS = [
  'association_fee', 'tax_annual_amount', 'price_per_sqft'
];

const ALL_NUMBER_FIELDS = [...INTEGER_FIELDS, ...DECIMAL_FIELDS];

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

app.post('/api/listings', async (req, res) => {
  try {
    const body = req.body;
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
      return res.status(400).json({ error: 'No valid fields provided' });
    }

    const placeholders = fields.map((col, i) => {
      if (col === 'photos') return `$${i + 1}::text[]`;
      if (col === 'mls_data') return `$${i + 1}::jsonb`;
      return `$${i + 1}`;
    });

    const query = `INSERT INTO listings (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const result = await pool.query(query, values);
    res.status(201).json(sanitizeRow(result.rows[0]));
  } catch (err) {
    console.error('Error creating listing:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: 'Failed to create listing: ' + err.message });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

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
      return res.status(400).json({ error: 'No fields to update' });
    }
    const setClauses = fields.map((col, i) => {
      if (col === 'photos') return `${col} = $${i + 1}::text[]`;
      if (col === 'mls_data') return `${col} = $${i + 1}::jsonb`;
      return `${col} = $${i + 1}`;
    });
    setClauses.push('updated_at = NOW()');
    values.push(id);

    const query = `UPDATE listings SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(sanitizeRow(result.rows[0]));
  } catch (err) {
    console.error('Error updating listing:', err.message);
    res.status(500).json({ error: 'Failed to update listing: ' + err.message });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM listings WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

function generateToken(payload) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET not configured');
  const data = JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 });
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const signature = hmac.digest('hex');
  return Buffer.from(data).toString('base64') + '.' + signature;
}

function verifyToken(token) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  try {
    const [dataB64, signature] = token.split('.');
    if (!dataB64 || !signature) return null;
    const data = Buffer.from(dataB64, 'base64').toString('utf8');
    const hmac = crypto.createHmac('sha256', secret);
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

function isAuthenticated(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return verifyToken(token) !== null;
}

app.post('/api/auth', async (req, res) => {
  try {
    const { action, password, token } = req.body;
    const SESSION_SECRET = process.env.SESSION_SECRET;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    if (!SESSION_SECRET) {
      return res.status(500).json({ error: 'Server configuration error: SESSION_SECRET not set' });
    }
    if (!ADMIN_PASSWORD_HASH) {
      return res.status(500).json({ error: 'Server configuration error: ADMIN_PASSWORD_HASH not set' });
    }

    if (action === 'login') {
      if (!password) {
        return res.status(400).json({ error: 'Password required' });
      }
      if (password === ADMIN_PASSWORD_HASH) {
        const authToken = generateToken({ admin: true, loginAt: Date.now() });
        return res.json({ success: true, token: authToken });
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (action === 'verify') {
      const payload = verifyToken(token);
      if (payload) {
        return res.json({ valid: true });
      }
      return res.status(401).json({ valid: false });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, formType, propertyAddress, buyingTimeline, priceRange, source } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (name.length > 100 || email.length > 100) {
      return res.status(400).json({ error: 'Invalid input length' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
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
    const visitorIp = (req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim();

    await pool.query(
      `INSERT INTO leads (name, email, phone, form_type, message, property_address, buying_timeline, price_range, source, visitor_ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [leadName, leadEmail, leadPhone, leadFormType, leadMessage, leadPropertyAddress, leadBuyingTimeline, leadPriceRange, leadSource, visitorIp]
    );

    console.log('NEW LEAD saved:', JSON.stringify({ name: leadName, email: leadEmail, formType: leadFormType }));

    res.json({
      success: true,
      message: 'Thank you! Your message has been received. I\'ll be in touch within 24 hours.'
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json({ leads: result.rows });
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.delete('/api/contact/:id', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json({ testimonials: result.rows });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { name, location, text, rating, date } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: 'Name and testimonial text are required' });
    }
    const result = await pool.query(
      `INSERT INTO testimonials (name, location, text, rating, date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name.trim().substring(0, 100), (location || '').trim().substring(0, 100) || null, text.trim().substring(0, 2000), Math.min(Math.max(parseInt(rating) || 5, 1), 5), (date || new Date().getFullYear().toString()).substring(0, 20)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const result = await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

app.post('/api/analytics', async (req, res) => {
  try {
    const { action } = req.body;
    const visitorIp = (req.headers['x-forwarded-for'] || req.ip || 'unknown').split(',')[0].trim();

    if (action === 'pageview') {
      const { path: pagePath, referrer, userAgent } = req.body;
      if (!pagePath || typeof pagePath !== 'string' || pagePath.length > 500) {
        return res.status(400).json({ error: 'Invalid path' });
      }
      await pool.query(
        `INSERT INTO page_views (page_path, visitor_ip, user_agent, referrer)
         VALUES ($1, $2, $3, $4)`,
        [pagePath.slice(0, 500), visitorIp, (userAgent || '').slice(0, 500), (referrer || '').slice(0, 500) || null]
      );
      return res.json({ success: true, message: 'Page view recorded' });
    }

    if (action === 'listing_view') {
      const { listingId, listingAddress, listingCity, timeSpent } = req.body;
      if (!listingId) {
        return res.status(400).json({ error: 'Invalid listingId' });
      }
      const sanitizedTime = Math.max(0, Math.min(Number(timeSpent) || 0, 3600));
      await pool.query(
        `INSERT INTO listing_views (listing_id, listing_address, listing_city, visitor_ip, time_spent_seconds)
         VALUES ($1, $2, $3, $4, $5)`,
        [String(listingId).slice(0, 50), (listingAddress || '').slice(0, 500) || null, (listingCity || '').slice(0, 100) || null, visitorIp, sanitizedTime]
      );
      return res.json({ success: true, message: 'Listing view recorded' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    console.error('Analytics POST error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const action = req.query.action;

    if (action === 'summary') {
      const totalResult = await pool.query('SELECT COUNT(*) as total FROM page_views');
      const uniqueResult = await pool.query('SELECT COUNT(DISTINCT visitor_ip) as total FROM page_views WHERE visitor_ip IS NOT NULL');
      const todayResult = await pool.query('SELECT COUNT(*) as total FROM page_views WHERE created_at >= CURRENT_DATE');
      const weekResult = await pool.query("SELECT COUNT(*) as total FROM page_views WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'");
      const monthResult = await pool.query("SELECT COUNT(*) as total FROM page_views WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'");

      const topPages = await pool.query(`
        SELECT page_path, COUNT(*) as views
        FROM page_views
        GROUP BY page_path
        ORDER BY views DESC
        LIMIT 10
      `);

      const trafficByDay = await pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as views
        FROM page_views
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      return res.json({
        totalPageViews: Number(totalResult.rows[0].total),
        uniqueVisitors: Number(uniqueResult.rows[0].total),
        viewsToday: Number(todayResult.rows[0].total),
        viewsThisWeek: Number(weekResult.rows[0].total),
        viewsThisMonth: Number(monthResult.rows[0].total),
        topPages: topPages.rows,
        trafficByDay: trafficByDay.rows
      });
    }

    if (action === 'listings') {
      const listingsResult = await pool.query(`
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
      `);

      const result = [];
      for (const listing of listingsResult.rows) {
        const locations = await pool.query(
          `SELECT city, region, country, COUNT(*) as count
           FROM listing_views
           WHERE listing_id = $1 AND city IS NOT NULL
           GROUP BY city, region, country
           ORDER BY count DESC
           LIMIT 5`,
          [listing.listing_id]
        );
        result.push({
          ...listing,
          total_views: Number(listing.total_views),
          unique_viewers: Number(listing.unique_viewers),
          avg_time_spent: Number(listing.avg_time_spent),
          top_viewer_locations: locations.rows
        });
      }

      return res.json({ listings: result });
    }

    if (action === 'listing_detail') {
      const listingId = req.query.listingId;
      if (!listingId) {
        return res.status(400).json({ error: 'listingId required' });
      }

      const summaryResult = await pool.query(
        `SELECT COUNT(*) as total_views, COUNT(DISTINCT visitor_ip) as unique_viewers, ROUND(AVG(time_spent_seconds)) as avg_time_spent
         FROM listing_views WHERE listing_id = $1`,
        [listingId]
      );

      const viewsByDay = await pool.query(
        `SELECT DATE(created_at) as date, COUNT(*) as views
         FROM listing_views
         WHERE listing_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`,
        [listingId]
      );

      const locations = await pool.query(
        `SELECT city, region, country, COUNT(*) as count
         FROM listing_views
         WHERE listing_id = $1 AND city IS NOT NULL
         GROUP BY city, region, country
         ORDER BY count DESC`,
        [listingId]
      );

      const summary = summaryResult.rows[0];
      return res.json({
        totalViews: Number(summary.total_views),
        uniqueViewers: Number(summary.unique_viewers),
        avgTimeSpent: Number(summary.avg_time_spent),
        viewsByDay: viewsByDay.rows,
        viewerLocations: locations.rows
      });
    }

    if (action === 'users') {
      const usersResult = await pool.query(`
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
      `);

      const botPatterns = [
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

      const users = usersResult.rows.map(row => {
        const allAgents = (row.user_agents || []).join(' ');
        let is_bot = false;
        let bot_name = null;
        for (const bp of botPatterns) {
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

      return res.json({ users });
    }

    return res.status(400).json({ error: 'Invalid action. Use action=summary, action=listings, action=listing_detail, or action=users' });
  } catch (err) {
    console.error('Analytics GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(row => { settings[row.key] = row.value; });
    res.json({ settings });
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { key, value } = req.body;
    if (!key || typeof value === 'undefined') {
      return res.status(400).json({ error: 'Key and value are required' });
    }
    await pool.query(
      `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key.substring(0, 50), String(value).substring(0, 500)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving setting:', err);
    res.status(500).json({ error: 'Failed to save setting' });
  }
});

app.patch('/api/contact/:id/read', async (req, res) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id || !/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid lead ID' });
    }
    const result = await pool.query('UPDATE leads SET read_at = NOW() WHERE id = $1 RETURNING *', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ success: true, lead: result.rows[0] });
  } catch (err) {
    console.error('Error marking lead as read:', err);
    res.status(500).json({ error: 'Failed to mark lead as read' });
  }
});

initDB().then(() => {
  app.listen(3001, '0.0.0.0', () => {
    console.log('API server running on port 3001');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
