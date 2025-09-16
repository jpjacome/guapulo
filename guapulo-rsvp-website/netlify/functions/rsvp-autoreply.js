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
  // Only include fields that actually exist on the form (name, email, phone, plus_one, message).
      // Map `name` -> `to_name` for the greeting.
      // Minimal template parameters: include both `name` and explicit recipient fields
      // (EmailJS templates sometimes require `to_email`/`to_name` if the template's
      // To/recipient is parameterized). Keep `name` for template body interpolation.
      template_params: {
        // Recipient fields (required by template)
        to_name: name,
        to_email: email,
        
        // Form data fields (all form fields for template use)  
        name: name,
        email: email,
        phone: phone,
        plus_one: plus_one,
        message: message,
        
        // Common EmailJS template fields
        subject: `RSVP Confirmation - ${name}`,
        reply_to: email,
        from_name: 'Parrillazo Guapulense',
        from_email: 'noreply@guapuliza.netlify.app',
        
        // Event details (in case template references them)
        event_name: 'Parrillazo Guapulense',
        event_date: '19 de septiembre', 
        event_time: '6:00 pm',
        event_location: 'Lugar por confirmar'
      }
    };
    // If a private key is provided in env, include it in the payload (EmailJS strict mode)
    const privateKey = process.env.EMAILJS_PRIVATE_KEY || null;
    const hasPrivate = !!privateKey;
    // Masked preview: show first 4 and last 4 chars only
    const maskedPreview = hasPrivate ? `${privateKey.slice(0,4)}...${privateKey.slice(-4)}` : null;
    console.log('EmailJS private key presence:', { hasPrivate, maskedPreview });
    if (privateKey) {
      emailjsPayload.private_key = privateKey;
    }

    // If debug query flag is passed, return the prepared template_params and env presence
    const url = event.rawUrl || (event.path || '') + (event.queryStringParameters ? ('?' + Object.keys(event.queryStringParameters).map(k=>`${k}=${event.queryStringParameters[k]}`).join('&')) : '');
    const debugMode = (event.queryStringParameters && (event.queryStringParameters.debug === '1' || event.queryStringParameters.debug === 'true')) || (url && url.indexOf('?debug=1') !== -1);
    if (debugMode) {
      const maskedEnv = {
        hasService,
        hasTemplate,
        hasUser,
        hasPrivate,
        maskedPrivatePreview: maskedPreview
      };
      return { statusCode: 200, body: JSON.stringify({ template_params: emailjsPayload.template_params, env: maskedEnv }, null, 2) };
    }

    // Diagnostic: log template param keys and a masked sample of the payload (don't print private key)
    try {
      const paramKeys = Object.keys(emailjsPayload.template_params || {});
      const samplePayload = Object.assign({}, emailjsPayload.template_params || {});
      if (samplePayload.email) samplePayload.email = samplePayload.email.replace(/(.{2}).+(@.+)/, '$1***$2');
      console.log('EmailJS will send template_params keys:', paramKeys);
      console.log('EmailJS sample template_params (masked):', samplePayload);
    } catch (diagErr) {
      console.warn('Failed to log EmailJS payload diagnostic:', diagErr && diagErr.message);
    }

    // Attempt request to EmailJS with timeout
    let resp;
    try {
      resp = await Promise.race([
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, privateKey ? { 'Authorization': `Bearer ${privateKey}` } : {}),
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
      // Try to parse JSON response from EmailJS for more structured error info
      let parsed = null;
      try {
        parsed = respText ? JSON.parse(respText) : null;
      } catch (e) {
        parsed = null;
      }
      // collect headers
      const headersObj = {};
      try {
        resp.headers && resp.headers.forEach && resp.headers.forEach((v, k) => { headersObj[k] = v; });
      } catch (hErr) {
        // ignore header collection errors
      }
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'EmailJS send failed',
          status: resp.status,
          details_raw: respText,
          details_parsed: parsed,
          details_length: respText ? respText.length : 0,
          headers: headersObj
        }, null, 2)
      };
    }

    console.log('EmailJS response body:', respText);

    console.log(`Auto-reply (EmailJS) sent successfully to ${email}`);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Unhandled error in rsvp-autoreply:', error && error.stack ? error.stack : error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send auto-reply', details: error && error.message }) };
  }
};
