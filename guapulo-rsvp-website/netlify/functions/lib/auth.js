// Admin session tokens: HMAC-signed payload, no external deps.
// Env vars:
//   ADMIN_PASSWORD        (required) — the dashboard login password
//   ADMIN_SESSION_SECRET  (optional) — HMAC key; derived from the password if unset
const crypto = require('crypto');

const SESSION_HOURS = 12;

function getSecret() {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  // Fallback: derive a stable secret from the password so setup only needs one env var
  return crypto
    .createHash('sha256')
    .update('guapulo-admin-session:' + (process.env.ADMIN_PASSWORD || ''))
    .digest('hex');
}

function hmac(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function timingSafeEqualStr(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function createToken() {
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_HOURS * 3600 * 1000 })
  ).toString('base64url');
  return `${payload}.${hmac(payload)}`;
}

function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!timingSafeEqualStr(sig, hmac(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

/** Returns the session payload, or null (caller should respond 401). */
function requireAuth(event) {
  const header = event.headers.authorization || event.headers.Authorization || '';
  const match = header.match(/^Bearer (.+)$/);
  return match ? verifyToken(match[1]) : null;
}

const unauthorized = () => ({
  statusCode: 401,
  body: JSON.stringify({ error: 'Unauthorized' })
});

module.exports = { createToken, verifyToken, requireAuth, unauthorized, timingSafeEqualStr };
