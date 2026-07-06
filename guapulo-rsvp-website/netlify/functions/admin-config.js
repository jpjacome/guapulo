// GET -> current event-config.json (from GitHub, the source of truth) + available media assets.
const { requireAuth, unauthorized } = require('./lib/auth');
const { getFile, listDir } = require('./lib/github');

const SITE_DIR = 'guapulo-rsvp-website';
const IMAGE_EXT = /\.(png|jpe?g|webp|gif)$/i;
const VIDEO_EXT = /\.(mp4|webm)$/i;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!requireAuth(event)) return unauthorized();

  try {
    const [configFile, assetsRoot, assetImgs] = await Promise.all([
      getFile(`${SITE_DIR}/_data/event-config.json`),
      listDir(`${SITE_DIR}/assets`),
      listDir(`${SITE_DIR}/assets/imgs`)
    ]);

    const videos = assetsRoot
      .filter((f) => VIDEO_EXT.test(f.name))
      .map((f) => ({ path: `assets/${f.name}`, size: f.size }));
    const images = assetImgs
      .filter((f) => IMAGE_EXT.test(f.name))
      .map((f) => ({ path: `assets/imgs/${f.name}`, size: f.size }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        config: JSON.parse(configFile.content),
        assets: { videos, images }
      })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
