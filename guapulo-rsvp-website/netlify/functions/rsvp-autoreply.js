// Clean EmailJS Auto-Reply Function
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    let formData = {};
    try {
      formData = JSON.parse(event.body || '{}');
    } catch (e) {
      const parsed = {};
      (event.body || '').split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        if (k) parsed[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
      });
      formData = parsed;
    }

    const data = formData.data || formData;
    const name = data.name || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const plus_one = data.plus_one || '';
    const message = data.message || '';

    if (!name || !email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Name and email required' }) };
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const userId = process.env.EMAILJS_USER_ID;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !userId) {
      return { statusCode: 500, body: JSON.stringify({ error: 'EmailJS not configured' }) };
    }

    const emailjsPayload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: {
        to_name: name,
        to_email: email,
        name: name,
        email: email,
        phone: phone || 'No proporcionado',
        plus_one: plus_one || 'No',
        message: message || 'Sin mensaje',
        subject: 'Confirmación RSVP - Parrillazo Guapulense',
        reply_to: email,
        event_name: 'Parrillazo Guapulense',
        event_date: '13 de diciembre, 2025',
        event_time: '6:00 PM',
        event_location: 'Guápulo, Quito'
      }
    };

    if (privateKey) {
      emailjsPayload.accessToken = privateKey;
    }

    const isDebug = event.queryStringParameters?.debug === '1';
    if (isDebug) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          template_params: emailjsPayload.template_params,
          config: { has_service: !!serviceId, has_template: !!templateId, has_user: !!userId, has_private_key: !!privateKey }
        }, null, 2)
      };
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailjsPayload)
    });

    const responseText = await response.text();

    if (!response.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'EmailJS failed', status: response.status, details: responseText })
      };
    }

    // Return detailed success response
    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        success: true, 
        recipient: email,
        emailjs_response: responseText,
        status: response.status
      }) 
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', details: error.message }) };
  }
};
