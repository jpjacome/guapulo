// Public lookup for the homepage's personalized-invite prefill.
// GET ?t=<token> -> { found: true, name, email, phone } | { found: false }
//
// No admin auth here on purpose: the signed token IS the authorization
// (only a valid invite link can resolve to a guest), and it only exposes
// that one guest's own contact info back to whoever is holding their link.
const { getStore, connectLambda } = require('@netlify/blobs');
const { verifyGuestToken } = require('../../lib/guest-token');

const PREFIX = 'guest:';

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = (event.queryStringParameters || {}).t || '';
  const email = verifyGuestToken(token);
  if (!email) {
    return { statusCode: 200, body: JSON.stringify({ found: false }) };
  }

  try {
    connectLambda(event); // classic functions need the Blobs context wired manually
    const store = getStore('admin-data');
    const raw = await store.get(PREFIX + email);
    if (!raw) return { statusCode: 200, body: JSON.stringify({ found: false }) };

    const guest = JSON.parse(raw);
    return {
      statusCode: 200,
      body: JSON.stringify({ found: true, name: guest.name, email: guest.email, phone: guest.phone || '' })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
