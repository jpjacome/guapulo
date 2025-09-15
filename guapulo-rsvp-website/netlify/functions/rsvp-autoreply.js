// Netlify Function: EmailJS-only auto-reply for RSVP submissions
// Expects EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID in env

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const formData = JSON.parse(event.body || '{}');
    console.log('Received form submission (rsvp-autoreply):', formData);

    const data = formData.data || formData;
    const name = data.name || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const plus_one = data.plus_one || '';
    const guest_name = data.guest_name || '';
    const message = data.message || '';

    if (!name || !email) {
      console.error('Missing required fields:', { name, email });
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    if (!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_USER_ID)) {
      console.error('EmailJS environment variables not configured');
      return { statusCode: 500, body: JSON.stringify({ error: 'EmailJS not configured' }) };
    }

    const emailjsPayload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      template_params: {
        name,
        email,
        phone,
        attendance: data.attendance || 'Sí',
        plus_one,
        guest_name,
        message
      }
    };

    const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailjsPayload)
    });

    if (!resp.ok) {
      const bodyText = await resp.text();
      console.error('EmailJS responded with non-OK:', resp.status, bodyText);
      return { statusCode: 502, body: JSON.stringify({ error: 'EmailJS send failed', details: bodyText }) };
    }

    console.log(`Auto-reply (EmailJS) sent successfully to ${email}`);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Error in rsvp-autoreply:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send auto-reply', details: error.message }) };
  }
};
