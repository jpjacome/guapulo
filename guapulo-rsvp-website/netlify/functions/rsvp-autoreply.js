// Netlify Function to handle form submissions and send auto-reply emails
// This function receives webhook notifications from Netlify Forms
// and sends confirmation emails to form submitters

const nodemailer = require('nodemailer');

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

    // Email configuration (you'll need to set these environment variables)
    // Basic environment checks to fail fast if email creds are missing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER, // your sending email
        pass: process.env.EMAIL_PASS  // your app password
      }
    });

    // Build the auto-reply email content
    const emailSubject = '✅ RSVP Confirmado - Parrillazo Guapulense 2025';
    
  const emailBody = `
¡Hola ${name}!

¡Genial! Tu confirmación para el Parrillazo Guapulense 2025 ha sido recibida exitosamente.

📅 DETALLES DEL EVENTO:
• Fecha: Viernes, 19 de septiembre de 2025
• Hora: 6:00 PM
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

    // Send the auto-reply email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>')
    });

    console.log(`Auto-reply sent successfully to ${email}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `Auto-reply sent to ${email}` 
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
