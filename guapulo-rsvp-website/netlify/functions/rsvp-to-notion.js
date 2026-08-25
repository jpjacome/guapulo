const { Client } = require('@notionhq/client');
const eventConfig = require('../../_data/event-config.json');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
// Admin panel can override which database RSVPs go to (event-config.json,
// committed via admin-publish). Falls back to the env var for sites that
// haven't set it through the dashboard yet.
const databaseId = (eventConfig.notion && eventConfig.notion.database_id) || process.env.NOTION_DATABASE_ID;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Invalid JSON',
    };
  }

  // Extract RSVP fields
  const { name, email, phone, plus_one, message } = data;

  try {
    // Build Notion properties
    const notionProps = {
      'Name': { title: [{ text: { content: name || '' } }] },
      'Email': { email: email || '' },
  'Plus One': { select: { name: plus_one || 'No' } },
      'Message': { rich_text: [{ text: { content: message || '' } }] },
      'Timestamp': { date: { start: new Date().toISOString() } },
    };
    // Only add phone if present
    if (phone && phone.replace(/\D/g, '').length > 0) {
      notionProps['Phone'] = { phone_number: phone };
    }
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: notionProps,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    // A Notion failure here otherwise vanishes silently — the guest still
    // gets a "success" page and confirmation email regardless (see script.js),
    // so this is the only signal anyone gets that a real RSVP didn't land.
    await notifyAdminOfFailure({ name, email, phone, plus_one, message }, error).catch(() => {});
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function notifyAdminOfFailure(guest, error) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const userId = process.env.EMAILJS_USER_ID;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const to = eventConfig.email && eventConfig.email.notification_email;
  if (!serviceId || !templateId || !userId || !to) return; // best-effort only

  const html = `
    <p><strong>Falló el guardado en Notion de una confirmación RSVP.</strong></p>
    <p>Nombre: ${escapeHtml(guest.name)}<br>
    Email: ${escapeHtml(guest.email)}<br>
    Teléfono: ${escapeHtml(guest.phone || '(vacío)')}<br>
    +1: ${escapeHtml(guest.plus_one || '(vacío)')}<br>
    Mensaje: ${escapeHtml(guest.message || '(vacío)')}</p>
    <p>Error: ${escapeHtml(error.message)}</p>
    <p>Esta persona sí recibió su email de confirmación y aparece en el panel de Netlify &gt; Forms,
    pero no quedó registrada en la base de Notion. Puedes agregarla ahí manualmente.</p>
  `;

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: userId,
    template_params: {
      to_name: 'Admin',
      to_email: to,
      name: 'Admin',
      email: to,
      reply_to: to,
      subject: `⚠️ RSVP no se guardó en Notion: ${guest.name || guest.email}`,
      html_content: html
    }
  };
  if (privateKey) payload.accessToken = privateKey;

  await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
