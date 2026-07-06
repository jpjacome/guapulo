// Renders the confirmation email from event-config.json + the guest's form data.
// Used by netlify/functions/rsvp-autoreply.js.
const template = require('./email-template');
const { deriveEventInfo } = require('./event-derive');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Escaped text with newlines converted to <br> (for multiline config fields)
const text = (str) => escapeHtml(str || '').replace(/\r?\n/g, '<br>');

/**
 * @param {object} config parsed event-config.json
 * @param {object} guest  { name }
 * @returns {{ subject: string, html: string }}
 */
function renderEmail(config, guest) {
  const derived = deriveEventInfo(config);
  const email = config.email || {};
  const siteUrl = (config.site_url || '').replace(/\/+$/, '');

  const values = {
    SUBJECT: escapeHtml(email.subject || `Confirmación - ${config.event.name}`),
    EVENT_NAME: escapeHtml(email.event_name || config.event.name),
    GUEST_NAME: escapeHtml(guest.name || ''),
    ACCENT_COLOR: config.appearance.accent_color,
    HERO_IMAGE_URL: `${siteUrl}/${config.hero.image}`,
    LONG_DATE: escapeHtml(derived.longDateEs),
    DISPLAY_TIME: escapeHtml(derived.displayTime),
    TITLE_LINE: text(email.title_line),
    INTRO: text(email.intro),
    NOTE_BOX: text(email.note_box),
    CAR_DIRECTIONS: text(email.car_directions),
    CAR_MAPS_URL: escapeHtml(email.car_maps_url || ''),
    WALK_DIRECTIONS: text(email.walk_directions),
    WALK_MAPS_URL: escapeHtml(email.walk_maps_url || ''),
    CONTACT_TEXT: text(email.contact_text),
    CONTACT_EMAIL: escapeHtml(email.contact_email || ''),
    CONTACT_PHONE: escapeHtml(email.contact_phone || ''),
    CONTACT_PHONE_TEL: escapeHtml((email.contact_phone || '').replace(/[^+\d]/g, ''))
  };

  let html = template;

  // Strip conditional blocks whose value is empty; keep contents otherwise.
  html = html.replace(
    /<!--IF:([A-Z_]+)-->([\s\S]*?)<!--\/IF:\1-->/g,
    (match, key, body) => (values[key] ? body : '')
  );
  // Nested conditionals (e.g. CAR_MAPS_URL inside CAR_DIRECTIONS) need a second pass.
  html = html.replace(
    /<!--IF:([A-Z_]+)-->([\s\S]*?)<!--\/IF:\1-->/g,
    (match, key, body) => (values[key] ? body : '')
  );

  html = html.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Unknown email placeholder ${match}`);
    return values[key];
  });

  return { subject: email.subject || `Confirmación - ${config.event.name}`, html };
}

module.exports = { renderEmail };
