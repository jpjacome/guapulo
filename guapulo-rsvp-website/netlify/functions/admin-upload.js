// POST { uploadId, chunkIndex, totalChunks, data } -> stages one base64 chunk in Netlify Blobs.
// Large media (videos > ~3.5MB) can't fit in a single function request (6MB limit),
// so the dashboard slices files into chunks; admin-publish reassembles them.
const { getStore } = require('@netlify/blobs');
const { requireAuth, unauthorized } = require('./lib/auth');

const UPLOAD_ID_RE = /^[a-zA-Z0-9-]{8,64}$/;
const MAX_CHUNKS = 40; // 40 x ~3MB = plenty for a hero video

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!requireAuth(event)) return unauthorized();

  try {
    const { uploadId, chunkIndex, totalChunks, data } = JSON.parse(event.body || '{}');

    if (!UPLOAD_ID_RE.test(uploadId || '')) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid uploadId' }) };
    }
    if (
      !Number.isInteger(chunkIndex) || !Number.isInteger(totalChunks) ||
      chunkIndex < 0 || totalChunks < 1 || totalChunks > MAX_CHUNKS || chunkIndex >= totalChunks
    ) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid chunk numbering' }) };
    }
    if (typeof data !== 'string' || !data) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing chunk data' }) };
    }

    const store = getStore('admin-uploads');
    await store.set(`${uploadId}/${chunkIndex}`, data);

    return { statusCode: 200, body: JSON.stringify({ ok: true, chunkIndex }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
