// Guest list CRUD. Stored in Netlify Blobs (NOT the public git repo — personal data).
//   GET              -> { guests: [{ name, email, invited_at }] }
//   POST   { name, email }          -> adds a guest (email is the unique key)
//   PUT    { email, name? }         -> updates a guest's name
//   DELETE { email }                -> removes a guest
const { getStore } = require('@netlify/blobs');
const { requireAuth, unauthorized } = require('./lib/auth');

const KEY = 'guests.json';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function loadGuests(store) {
  const raw = await store.get(KEY);
  return raw ? JSON.parse(raw) : [];
}

exports.handler = async (event) => {
  if (!requireAuth(event)) return unauthorized();

  try {
    const store = getStore('admin-data');
    const guests = await loadGuests(store);

    if (event.httpMethod === 'GET') {
      return { statusCode: 200, body: JSON.stringify({ guests }) };
    }

    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email inválido' }) };
    }

    if (event.httpMethod === 'POST') {
      const name = String(body.name || '').trim();
      if (!name) return { statusCode: 400, body: JSON.stringify({ error: 'El nombre es obligatorio' }) };
      if (guests.some((g) => g.email === email)) {
        return { statusCode: 409, body: JSON.stringify({ error: 'Ese email ya está en la lista' }) };
      }
      guests.push({ name, email, invited_at: null });
      guests.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    } else if (event.httpMethod === 'PUT') {
      const guest = guests.find((g) => g.email === email);
      if (!guest) return { statusCode: 404, body: JSON.stringify({ error: 'Invitado no encontrado' }) };
      if (body.name) guest.name = String(body.name).trim();
    } else if (event.httpMethod === 'DELETE') {
      const index = guests.findIndex((g) => g.email === email);
      if (index === -1) return { statusCode: 404, body: JSON.stringify({ error: 'Invitado no encontrado' }) };
      guests.splice(index, 1);
    } else {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    await store.set(KEY, JSON.stringify(guests));
    return { statusCode: 200, body: JSON.stringify({ guests }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
