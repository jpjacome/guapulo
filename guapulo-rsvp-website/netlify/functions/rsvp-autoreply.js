// Netlify Function: EmailJS-only auto-reply for RSVP submissions
// Expects EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID in env

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    console.warn('Non-POST request to rsvp-autoreply');
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    // Parse body robustly
    let formData = {};
    try {
      formData = JSON.parse(event.body || '{}');
    } catch (e) {
      // If body isn't JSON, try urlencoded parsing
      const parsed = {};
      (event.body || '').split('&').forEach(pair => {
        const [k,v] = pair.split('=');
        if (k) parsed[decodeURIComponent(k)] = decodeURIComponent((v||'').replace(/\+/g,' '));
      });
      formData = parsed;
    }

    console.log('Received form submission (rsvp-autoreply) headers:', event.headers || {});
    console.log('Received form submission (rsvp-autoreply) body parsed keys:', Object.keys(formData));

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

    // Log presence of env vars (masked)
    const hasService = !!process.env.EMAILJS_SERVICE_ID;
    const hasTemplate = !!process.env.EMAILJS_TEMPLATE_ID;
    const hasUser = !!process.env.EMAILJS_USER_ID;
    console.log('EmailJS env presence:', { hasService, hasTemplate, hasUser });
    if (!(hasService && hasTemplate && hasUser)) {
      console.error('EmailJS environment variables not configured or missing');
      return { statusCode: 500, body: JSON.stringify({ error: 'EmailJS not configured', env: { hasService, hasTemplate, hasUser } }) };
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

    // Attempt request to EmailJS with timeout
    let resp;
    try {
      resp = await Promise.race([
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailjsPayload)
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000))
      ]);
    } catch (networkError) {
      console.error('Network or timeout error when calling EmailJS:', networkError && networkError.message);
      return { statusCode: 502, body: JSON.stringify({ error: 'EmailJS network error', details: networkError && networkError.message }) };
    }

    const respText = await resp.text().catch(() => null);
    if (!resp.ok) {
      console.error('EmailJS responded with non-OK:', resp.status, respText);
      return { statusCode: 502, body: JSON.stringify({ error: 'EmailJS send failed', status: resp.status, details: respText }) };
    }

    console.log('EmailJS response body:', respText);

    console.log(`Auto-reply (EmailJS) sent successfully to ${email}`);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Unhandled error in rsvp-autoreply:', error && error.stack ? error.stack : error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send auto-reply', details: error && error.message }) };
  }
};
