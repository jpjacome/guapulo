// Netlify Function to handle form submissions and send auto-reply emails via EmailJS
// Receives webhook notifications from Netlify Forms and sends styled confirmation emails

exports.handler = async (event, context) => {
  // Only respond to POST requests (webhook notifications)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form submission data from Netlify
    const formData = JSON.parse(event.body);
    console.log('Received form submission:', formData);

    // Extract form fields
    const {
      name,
      email,
      phone,
      attendance,
      plus_one,
      guest_name,
      custom_question,
      message
    } = formData.data;

    // Validate required fields
    if (!name || !email) {
      console.error('Missing required fields:', { name, email });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_skzxxs6';
    const EMAILJS_TEMPLATE_ID = 'template_5mp33rb';
    const EMAILJS_USER_ID = 'kgZlrpJKfDpOhLkvX';

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_name: name,
      to_email: email,
      attendance: attendance,
      plus_one: plus_one,
      guest_name: guest_name || '',
      // Add any other dynamic content needed
    };

    // Send email via EmailJS API
    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: templateParams
      })
    });

    if (emailResponse.ok) {
      console.log(`Auto-reply email sent successfully to ${email}`);
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: `Auto-reply sent to ${email}`,
          emailjs_response: 'Email sent successfully'
        })
      };
    } else {
      const errorText = await emailResponse.text();
      console.error('EmailJS API error:', errorText);
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to send email via EmailJS',
          details: errorText 
        })
      };
    }

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process form submission',
        details: error.message 
      })
    };
  }
};
