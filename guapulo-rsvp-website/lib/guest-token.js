// Signs a guest's email into a compact token so personalized invite links
// (?g=<token>) can be resolved back to a known guest without exposing raw
// PII in the URL. The token only unlocks a READ (admin-guests lookup via
// rsvp-guest-lookup.js) — it never triggers an RSVP by itself, so opening
// the link (e.g. an email client or security scanner prefetching it) can't
// accidentally confirm anyone.
const crypto = require('crypto');

function getSecret() {
  if (process.env.GUEST_TOKEN_SECRET) return process.env.GUEST_TOKEN_SECRET;
  // Fallback: derive a stable secret so no extra env var is required to work
  return crypto
    .createHash('sha256')
    .update('guapulo-guest-token:' + (process.env.ADMIN_PASSWORD || ''))
    .digest('hex');
}

function sign(email) {
  return crypto.createHmac('sha256', getSecret()).update(email).digest('base64url');
}

function createGuestToken(email) {
  const payload = Buffer.from(email, 'utf8').toString('base64url');
  return `${payload}.${sign(email)}`;
}

/** Returns the email the token was signed for, or null if invalid/tampered. */
function verifyGuestToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  let email;
  try {
    email = Buffer.from(payload, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expected = sign(email);
  const bufA = Buffer.from(sig);
  const bufB = Buffer.from(expected);
  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) return null;
  return email;
}

module.exports = { createGuestToken, verifyGuestToken };
