const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.AUTH_PORT || 3001;

app.use(express.json());

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

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

function authHandler(passwordEnvKey, fallbackDevPassword) {
  return (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    if (isRateLimited(clientIp)) {
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const configuredPassword = process.env[passwordEnvKey];
    const effectivePassword = configuredPassword || (isDev ? fallbackDevPassword : null);

    if (!effectivePassword) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    if (safeCompare(password, effectivePassword)) {
      const token = generateToken();
      return res.json({ success: true, token });
    }

    return res.status(401).json({ error: 'Invalid password' });
  };
}

app.post('/.netlify/functions/auth', authHandler('ADMIN_PASSWORD', 'password'));
app.post('/.netlify/functions/dashboard-auth', authHandler('DASHBOARD_PASSWORD', '420'));
app.post('/.netlify/functions/inventory-auth', authHandler('INVENTORY_PASSWORD', '420'));
app.post('/.netlify/functions/log-auth', authHandler('LOG_PASSWORD', 'password'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth server running on port ${PORT}`);
});
