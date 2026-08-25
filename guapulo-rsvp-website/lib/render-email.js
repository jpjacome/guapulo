// Renders the confirmation + invitation emails from event-config.json.
// Used by netlify/functions/rsvp-autoreply.js and admin-send-invite.js.
const template = require('./email-template');
const inviteTemplate = require('./invite-template');
const { deriveEventInfo } = require('./event-derive');
const { createGuestToken } = require('./guest-token');

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

  const html = renderTemplate(template, values);
  return { subject: email.subject || `Confirmación - ${config.event.name}`, html };
}

/**
 * Render the invitation email.
 * @param {object} config parsed event-config.json
 * @param {object} guest  { name }
 * @param {object} overrides optional { subject, message, cta_label } from the dashboard
 * @returns {{ subject: string, html: string }}
 */
function renderInvite(config, guest, overrides = {}) {
  const derived = deriveEventInfo(config);
  const invite = { ...(config.invite || {}), ...overrides };
  const siteUrl = (config.site_url || '').replace(/\/+$/, '');
  const subject = invite.subject || `Estás invitado - ${config.event.name}`;

  // Personalized link: carries a signed token so the homepage can prefill
  // this guest's known name/email/phone and skip straight to plus-one + message.
  const rsvpUrl = guest.email ? `${siteUrl}/?g=${createGuestToken(guest.email)}` : siteUrl;

  const values = {
    SUBJECT: escapeHtml(subject),
    EVENT_NAME: escapeHtml(config.event.name),
    EVENT_NAME_UPPER: escapeHtml(config.event.name.toUpperCase()),
    SUBTITLE: escapeHtml((config.event.subtitle || '').trim()),
    GUEST_NAME: escapeHtml(guest.name || ''),
    ACCENT_COLOR: config.appearance.accent_color,
    HERO_IMAGE_URL: `${siteUrl}/${config.hero.image}`,
    LONG_DATE: escapeHtml(derived.longDateEs),
    DISPLAY_TIME: escapeHtml(derived.displayTime),
    LOCATION: escapeHtml(config.event.location || ''),
    MESSAGE: text(invite.message),
    CTA_LABEL: escapeHtml(invite.cta_label || 'CONFIRMA TU ASISTENCIA'),
    SITE_URL: escapeHtml(siteUrl),
    SITE_HOST: escapeHtml(siteUrl.replace(/^https?:\/\//, '')),
    RSVP_URL: escapeHtml(rsvpUrl)
  };

  return { subject, html: renderTemplate(inviteTemplate, values) };
}

function renderTemplate(tpl, values) {
  let html = tpl;

  // Strip conditional blocks whose value is empty; keep contents otherwise.
  // Two passes so one level of nesting works (e.g. CAR_MAPS_URL inside CAR_DIRECTIONS).
  for (let pass = 0; pass < 2; pass++) {
    html = html.replace(
      /<!--IF:([A-Z_]+)-->([\s\S]*?)<!--\/IF:\1-->/g,
      (match, key, body) => (values[key] ? body : '')
    );
  }

  return html.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => {
    if (!(key in values)) throw new Error(`Unknown email placeholder ${match}`);
    return values[key];
  });
}

module.exports = { renderEmail, renderInvite };
