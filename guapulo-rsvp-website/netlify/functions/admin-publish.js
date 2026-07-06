// POST { config, media[] } -> commits the new event config (+ any uploaded media)
// to GitHub in a single commit. Netlify then auto-deploys the site.
//
// media items are either:
//   { path: "assets/vid8.mp4", inline: "<base64>" }                      (small files)
//   { path: "assets/vid8.mp4", uploadId: "...", totalChunks: 5 }         (staged via admin-upload)
const crypto = require('crypto');
const { requireAuth, unauthorized } = require('./lib/auth');
const { commitFiles } = require('./lib/github');
const { deriveEventInfo } = require('../../lib/event-derive');

const SITE_DIR = 'guapulo-rsvp-website';
const MEDIA_PATH_RE = /^assets\/(imgs\/)?[a-zA-Z0-9._-]+\.(png|jpe?g|webp|gif|mp4|webm)$/i;
const MAX_MEDIA_BYTES = 100 * 1024 * 1024;

function validateConfig(config) {
  const need = (cond, msg) => { if (!cond) throw new Error(`Invalid config: ${msg}`); };
  need(config && typeof config === 'object', 'not an object');
  need(config.event && typeof config.event.name === 'string' && config.event.name.trim(), 'event.name is required');
  need(/^\d{4}-\d{2}-\d{2}$/.test(config.event.date || ''), 'event.date must be YYYY-MM-DD');
  need(/^\d{2}:\d{2}$/.test(config.event.time || ''), 'event.time must be HH:MM (24h)');
  need(config.hero && MEDIA_PATH_RE.test(config.hero.image || ''), 'hero.image must be a valid assets path');
  need(config.hero.type === 'image' || MEDIA_PATH_RE.test(config.hero.video || ''), 'hero.video must be a valid assets path');
  need(/^#[0-9a-fA-F]{6}$/.test((config.appearance || {}).accent_color || ''), 'appearance.accent_color must be a hex color');
  need(config.email && typeof config.email.subject === 'string', 'email.subject is required');
  deriveEventInfo(config); // throws if the date/time combination is invalid
}

async function loadChunkedMedia(event, uploadId, totalChunks) {
  const { getStore, connectLambda } = require('@netlify/blobs');
  connectLambda(event); // classic functions need the Blobs context wired manually
  // strong consistency: chunks are read back immediately after being uploaded
  const store = getStore({ name: 'admin-uploads', consistency: 'strong' });
  const parts = [];
  for (let i = 0; i < totalChunks; i++) {
    const chunk = await store.get(`${uploadId}/${i}`);
    if (chunk == null) throw new Error(`Upload ${uploadId} is missing chunk ${i}`);
    parts.push(Buffer.from(chunk, 'base64'));
  }
  // best-effort cleanup
  for (let i = 0; i < totalChunks; i++) {
    try { await store.delete(`${uploadId}/${i}`); } catch { /* ignore */ }
  }
  return Buffer.concat(parts);
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!requireAuth(event)) return unauthorized();

  try {
    const { config, media = [] } = JSON.parse(event.body || '{}');
    validateConfig(config);

    // Serialize exactly once: this string is committed AND hashed, so the
    // dashboard can match it against /build-info.json to detect the deploy.
    const configJson = JSON.stringify(config, null, 2) + '\n';
    const configHash = crypto.createHash('sha256').update(configJson).digest('hex').slice(0, 16);

    const files = [
      { path: `${SITE_DIR}/_data/event-config.json`, content: Buffer.from(configJson, 'utf8') }
    ];

    for (const item of media) {
      if (!MEDIA_PATH_RE.test(item.path || '')) {
        throw new Error(`Invalid media path: ${item.path}`);
      }
      let buffer;
      if (typeof item.inline === 'string') {
        buffer = Buffer.from(item.inline, 'base64');
      } else if (item.uploadId) {
        buffer = await loadChunkedMedia(event, item.uploadId, item.totalChunks);
      } else {
        throw new Error(`Media item ${item.path} has no content`);
      }
      if (!buffer.length || buffer.length > MAX_MEDIA_BYTES) {
        throw new Error(`Media item ${item.path} has an invalid size`);
      }
      files.push({ path: `${SITE_DIR}/${item.path}`, content: buffer });
    }

    const derived = deriveEventInfo(config);
    const message = `admin: update event — ${config.event.name}, ${derived.longDateEs} ${derived.displayTime}`;
    const commitSha = await commitFiles(message, files);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, commit: commitSha, configHash })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
