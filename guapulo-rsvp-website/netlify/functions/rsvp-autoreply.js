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
    
    // EmailJS service is in strict mode and requires private key
    if (privateKey) {
      emailjsPayload.private_key = privateKey;
    }
    
    // Add detailed logging of the exact payload being sent (mask sensitive data)
    const logPayload = {
      service_id: emailjsPayload.service_id ? `${emailjsPayload.service_id.slice(0,8)}...` : 'missing',
      template_id: emailjsPayload.template_id ? `${emailjsPayload.template_id.slice(0,8)}...` : 'missing', 
      user_id: emailjsPayload.user_id ? `${emailjsPayload.user_id.slice(0,8)}...` : 'missing',
      template_params_keys: Object.keys(emailjsPayload.template_params || {}),
      has_private_key: !!emailjsPayload.private_key,
      private_key_length: emailjsPayload.private_key ? emailjsPayload.private_key.length : 0
    };
    console.log('EmailJS payload being sent (masked):', logPayload);
    
    // Enhanced diagnostics: test different authentication modes if debug=auth
    const authDebugMode = (event.queryStringParameters && event.queryStringParameters.debug === 'auth');
    if (authDebugMode) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          diagnostics: {
            env_vars: {
              service_id_present: !!process.env.EMAILJS_SERVICE_ID,
              service_id_length: process.env.EMAILJS_SERVICE_ID ? process.env.EMAILJS_SERVICE_ID.length : 0,
              service_id_preview: process.env.EMAILJS_SERVICE_ID ? `${process.env.EMAILJS_SERVICE_ID.slice(0,8)}...` : 'missing',
              template_id_present: !!process.env.EMAILJS_TEMPLATE_ID,
              template_id_length: process.env.EMAILJS_TEMPLATE_ID ? process.env.EMAILJS_TEMPLATE_ID.length : 0,
              template_id_preview: process.env.EMAILJS_TEMPLATE_ID ? `${process.env.EMAILJS_TEMPLATE_ID.slice(0,8)}...` : 'missing',
              user_id_present: !!process.env.EMAILJS_USER_ID,
              user_id_length: process.env.EMAILJS_USER_ID ? process.env.EMAILJS_USER_ID.length : 0,
              user_id_preview: process.env.EMAILJS_USER_ID ? `${process.env.EMAILJS_USER_ID.slice(0,8)}...` : 'missing',
              private_key_present: !!process.env.EMAILJS_PRIVATE_KEY,
              private_key_length: process.env.EMAILJS_PRIVATE_KEY ? process.env.EMAILJS_PRIVATE_KEY.length : 0,
              private_key_preview: process.env.EMAILJS_PRIVATE_KEY ? `${process.env.EMAILJS_PRIVATE_KEY.slice(0,4)}...${process.env.EMAILJS_PRIVATE_KEY.slice(-4)}` : 'missing'
            },
            payload_structure: {
              service_id: typeof emailjsPayload.service_id,
              template_id: typeof emailjsPayload.template_id,
              user_id: typeof emailjsPayload.user_id,
              private_key: typeof emailjsPayload.private_key,
              template_params_count: Object.keys(emailjsPayload.template_params || {}).length,
              template_params_keys: Object.keys(emailjsPayload.template_params || {})
            },
            request_info: {
              emailjs_endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
              content_type: 'application/json',
              auth_header_included: !!emailjsPayload.private_key,
              payload_size_estimate: JSON.stringify(emailjsPayload).length
            }
          }
        }, null, 2)
      };
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
      
      // Enhanced error diagnostics
      const errorDiagnostics = {
        request_details: {
          url: 'https://api.emailjs.com/api/v1.0/email/send',
          method: 'POST',
          content_type: 'application/json',
          payload_keys: Object.keys(emailjsPayload),
          template_params_keys: Object.keys(emailjsPayload.template_params || {}),
          has_private_key: !!emailjsPayload.private_key,
          service_id_type: typeof emailjsPayload.service_id,
          template_id_type: typeof emailjsPayload.template_id,
          user_id_type: typeof emailjsPayload.user_id
        },
        response_analysis: {
          status_code: resp.status,
          status_text: resp.statusText || 'unknown',
          response_length: respText ? respText.length : 0,
          response_type: respText ? (respText.startsWith('{') ? 'json' : 'text') : 'empty',
          parsed_response: parsed
        }
      };
      
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'EmailJS send failed',
          status: resp.status,
          details_raw: respText,
          details_parsed: parsed,
          details_length: respText ? respText.length : 0,
          headers: headersObj,
          diagnostics: errorDiagnostics
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
