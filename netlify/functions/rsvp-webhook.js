// Netlify Function to handle form submissions and send auto-reply emails
// Using EmailJS for free email sending (no SMTP credentials needed)

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

    // Build the auto-reply email content
    const emailBody = `
¡Hola ${name}!

¡Genial! Tu confirmación para el Parrillazo Guapulense 2025 ha sido recibida exitosamente.

📅 DETALLES DEL EVENTO:
• Fecha: Viernes, 18 de julio de 2025
• Hora: 7:00 PM
• Lugar: Barrio Guápulo, Quito
• Recordatorio: BYOB (Trae tu propia bebida)

🤖 TU CONFIRMACIÓN:
• Asistencia: ${attendance}
${plus_one === 'yes' ? `• Acompañante: ${plus_one}` : ''}
${guest_name ? `• Nombre del acompañante: ${guest_name}` : ''}

¡Te esperamos para una noche increíble de parrilla, buena música y excelente compañía!

Si tienes alguna pregunta, no dudes en contactar a JP directamente:
📧 jpjacome@yahoo.com

¡Nos vemos en Guápulo! 🔥🤖

---
Parrillazo Guapulense 2025
    `.trim();

    // For now, just log the email that would be sent
    // You can implement actual email sending using:
    // 1. EmailJS API
    // 2. SendGrid API
    // 3. Mailgun API
    // 4. Or any other email service
    
    console.log(`Would send auto-reply to: ${email}`);
    console.log('Email content:', emailBody);

    // TODO: Implement actual email sending
    // Example with fetch to external email service:
    /*
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'your_service_id',
        template_id: 'your_template_id',
        user_id: 'your_user_id',
        template_params: {
          to_email: email,
          to_name: name,
          message: emailBody
        }
      })
    });
    */

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `Auto-reply logged for ${email}`,
        webhook_received: true
      })
    };

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
