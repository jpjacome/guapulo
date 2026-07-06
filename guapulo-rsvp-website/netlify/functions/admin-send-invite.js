// Sends ONE invitation email (the dashboard loops over selected guests,
// one request per guest, so long lists can't hit the function timeout).
// POST { email, overrides?: { subject, message, cta_label } }
// Renders lib/invite-template.js from event-config.json and delivers it
// through the same EmailJS shell template used by rsvp-autoreply
// ({{subject}} + {{{html_content}}}).
const { getStore } = require('@netlify/blobs');
const { requireAuth, unauthorized } = require('./lib/auth');
const eventConfig = require('../../_data/event-config.json');
const { renderInvite } = require('../../lib/render-email');

const KEY = 'guests.json';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!requireAuth(event)) return unauthorized();

  try {
    const { email, overrides = {} } = JSON.parse(event.body || '{}');

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const userId = process.env.EMAILJS_USER_ID;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;
    if (!serviceId || !templateId || !userId) {
      return { statusCode: 500, body: JSON.stringify({ error: 'EmailJS no está configurado' }) };
    }

    const store = getStore('admin-data');
    const raw = await store.get(KEY);
    const guests = raw ? JSON.parse(raw) : [];
    const guest = guests.find((g) => g.email === String(email || '').trim().toLowerCase());
    if (!guest) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Invitado no encontrado' }) };
    }

    // Only allow the whitelisted override fields (all plain text, escaped on render)
    const safeOverrides = {};
    for (const key of ['subject', 'message', 'cta_label']) {
      if (typeof overrides[key] === 'string' && overrides[key].trim()) {
        safeOverrides[key] = overrides[key].trim();
      }
    }

    const rendered = renderInvite(eventConfig, guest, safeOverrides);

    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: {
        to_name: guest.name,
        to_email: guest.email,
        reply_to: eventConfig.email.notification_email || '',
        subject: rendered.subject,
        html_content: rendered.html
      }
    };
    if (privateKey) payload.accessToken = privateKey;

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const details = await response.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ error: `EmailJS falló (${response.status}): ${details.slice(0, 200)}` })
      };
    }

    // Mark as invited
    guest.invited_at = new Date().toISOString();
    await store.set(KEY, JSON.stringify(guests));

    return { statusCode: 200, body: JSON.stringify({ ok: true, email: guest.email, invited_at: guest.invited_at }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
