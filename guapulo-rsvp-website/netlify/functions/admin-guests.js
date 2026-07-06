// Guest list CRUD. Stored in Netlify Blobs (NOT the public git repo — personal data).
//
// Each guest is its OWN blob (key "guest:<email>") so adds/deletes never
// rewrite a shared list — this avoids read-modify-write races entirely,
// which matters because this environment only supports eventually-consistent
// reads (strong consistency is unavailable in classic functions).
//
//   GET              -> { guests: [{ name, email, invited_at }] }
//   POST   { name, email }  -> adds a guest (email is the unique key)
//   PUT    { email, name? } -> updates a guest's name
//   DELETE { email }        -> removes a guest
const { getStore, connectLambda } = require('@netlify/blobs');
const { requireAuth, unauthorized } = require('./lib/auth');

const PREFIX = 'guest:';
const LEGACY_KEY = 'guests.json';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function listGuests(store) {
  // One-time migration from the old single-JSON format
  const legacy = await store.get(LEGACY_KEY);
  if (legacy) {
    const oldGuests = JSON.parse(legacy);
    await Promise.all(oldGuests.map((g) => store.set(PREFIX + g.email, JSON.stringify(g))));
    await store.delete(LEGACY_KEY);
  }

  const { blobs } = await store.list({ prefix: PREFIX });
  const guests = await Promise.all(
    blobs.map(async (b) => {
      const raw = await store.get(b.key);
      return raw ? JSON.parse(raw) : null;
    })
  );
  return guests
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

exports.handler = async (event) => {
  if (!requireAuth(event)) return unauthorized();

  try {
    connectLambda(event); // classic functions need the Blobs context wired manually
    const store = getStore('admin-data');

    if (event.httpMethod === 'GET') {
      return { statusCode: 200, body: JSON.stringify({ guests: await listGuests(store) }) };
    }

    const body = JSON.parse(event.body || '{}');
    const email = String(body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email inválido' }) };
    }
    const key = PREFIX + email;

    let changed = null; // the guest after this operation (null if deleted)

    if (event.httpMethod === 'POST') {
      const name = String(body.name || '').trim();
      if (!name) return { statusCode: 400, body: JSON.stringify({ error: 'El nombre es obligatorio' }) };
      if (await store.get(key)) {
        return { statusCode: 409, body: JSON.stringify({ error: 'Ese email ya está en la lista' }) };
      }
      changed = { name, email, invited_at: null };
      await store.set(key, JSON.stringify(changed));
    } else if (event.httpMethod === 'PUT') {
      const raw = await store.get(key);
      if (!raw) return { statusCode: 404, body: JSON.stringify({ error: 'Invitado no encontrado' }) };
      changed = JSON.parse(raw);
      if (body.name) changed.name = String(body.name).trim();
      await store.set(key, JSON.stringify(changed));
    } else if (event.httpMethod === 'DELETE') {
      await store.delete(key);
    } else {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    // Return the list merged with the change we just made, since the
    // eventually-consistent list() may not reflect it yet.
    let guests = (await listGuests(store)).filter((g) => g.email !== email);
    if (changed) guests.push(changed);
    guests.sort((a, b) => a.name.localeCompare(b.name, 'es'));

    return { statusCode: 200, body: JSON.stringify({ guests }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
