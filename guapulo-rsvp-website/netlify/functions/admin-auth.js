// POST { password } -> { token } for the admin dashboard.
const { createToken, timingSafeEqualStr } = require('./lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ADMIN_PASSWORD is not configured in Netlify env vars' }) };
  }

  let password = '';
  try {
    password = JSON.parse(event.body || '{}').password || '';
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!timingSafeEqualStr(password, adminPassword)) {
    // Small delay to slow down brute-force attempts
    await new Promise((r) => setTimeout(r, 750));
    return { statusCode: 401, body: JSON.stringify({ error: 'Contraseña incorrecta' }) };
  }

  return { statusCode: 200, body: JSON.stringify({ token: createToken() }) };
};
