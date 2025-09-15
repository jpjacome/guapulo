// Netlify Function to handle form submissions and send auto-reply emails
// This function receives webhook notifications from Netlify Forms
// and sends confirmation emails to form submitters

const nodemailer = require('nodemailer');
let sendgrid;
try {
  sendgrid = require('@sendgrid/mail');
} catch (e) {
  // If @sendgrid/mail is not installed, we'll fall back to nodemailer below
  sendgrid = null;
}

exports.handler = async (event, context) => {
  // Only respond to POST requests (webhook notifications)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form submission data from Netlify or client
    const formData = JSON.parse(event.body || '{}');
    console.log('Received form submission (rsvp-autoreply):', formData);

    // Support both Netlify webhook shape and direct client payloads
    const data = formData.data || formData;

    const name = data.name || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const plus_one = data.plus_one || '';
    const guest_name = data.guest_name || '';
    const message = data.message || '';

    // Validate required fields
    if (!name || !email) {
      console.error('Missing required fields:', { name, email });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Build the email subject and both text and HTML bodies
    const emailSubject = '✅ RSVP Confirmado - Parrillazo Guapulense 2025';

    const textBody = [
      `¡Hola ${name}!`,
      '',
      '¡Genial! Tu confirmación para el Parrillazo Guapulense 2025 ha sido recibida exitosamente.',
      '',
      'DETALLES DEL EVENTO:',
      '• Fecha: Viernes, 19 de septiembre de 2025',
      '• Hora: 6:00 PM',
      '• Lugar: Barrio Guápulo, Quito',
      '• Recordatorio: BYOB (Trae tu propia bebida)',
      '',
      'TU CONFIRMACIÓN:',
      `• Asistencia: ${data.attendance || 'Sí'}`,
      plus_one === 'yes' ? `• Acompañante: ${plus_one}` : '',
      guest_name ? `• Nombre del acompañante: ${guest_name}` : '',
      '',
      '¡Te esperamos para una noche increíble de parrilla, buena música y excelente compañía!',
      '',
      'Si tienes alguna pregunta, no dudes en contactar a JP directamente:',
      '📧 jpjacome@yahoo.com',
      '',
      '¡Nos vemos en Guápulo! 🔥🤖',
      '---',
      'Parrillazo Guapulense 2025'
    ].filter(Boolean).join('\n');

    const htmlBody = `
      <div style="font-family: Inter, Arial, sans-serif; color:#111; line-height:1.4;">
        <h2 style="color:#0d6efd;">¡Hola ${escapeHtml(name)}!</h2>
        <p>¡Genial! Tu confirmación para el <strong>Parrillazo Guapulense 2025</strong> ha sido recibida exitosamente.</p>
        <h3>Detalles del evento</h3>
        <ul>
          <li><strong>Fecha:</strong> Viernes, 19 de septiembre de 2025</li>
          <li><strong>Hora:</strong> 6:00 PM</li>
          <li><strong>Lugar:</strong> Barrio Guápulo, Quito</li>
        </ul>
        <h3>Tu confirmación</h3>
        <ul>
          <li><strong>Asistencia:</strong> ${escapeHtml(data.attendance || 'Sí')}</li>
          ${plus_one === 'yes' ? `<li><strong>Acompañante:</strong> ${escapeHtml(plus_one)}</li>` : ''}
          ${guest_name ? `<li><strong>Nombre del acompañante:</strong> ${escapeHtml(guest_name)}</li>` : ''}
        </ul>
        ${message ? `<h4>Mensaje</h4><p>${escapeHtml(message)}</p>` : ''}
        <p>Si tienes alguna pregunta, responde a este correo o contacta a JP: <a href="mailto:jpjacome@yahoo.com">jpjacome@yahoo.com</a></p>
        <p style="margin-top:1.5rem; font-size:0.9rem; color:#666;">Parrillazo Guapulense 2025</p>
      </div>
    `;

    // Prefer SendGrid if present
    if (sendgrid && process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM) {
      try {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: process.env.EMAIL_FROM,
          subject: emailSubject,
          text: textBody,
          html: htmlBody
        };
        await sendgrid.send(msg);
        console.log(`Auto-reply (SendGrid) sent successfully to ${email}`);
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
      } catch (err) {
        console.error('SendGrid send error:', err && err.message ? err.message : err);
        // fall through to nodemailer fallback
      }
    }

    // Nodemailer fallback (EMAIL_USER/EMAIL_PASS)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS environment variables for nodemailer fallback');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailSubject,
      text: textBody,
      html: htmlBody
    });

    console.log(`Auto-reply (nodemailer) sent successfully to ${email}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Error processing form submission in rsvp-autoreply:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process form submission', details: error.message })
    };
  }
};

// Simple HTML escaping helper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
