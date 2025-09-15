// Netlify Function to handle form submissions and send auto-reply emails
// This function receives webhook notifications from Netlify Forms
// and sends confirmation emails to form submitters

const nodemailer = require('nodemailer');
let sendgrid;
try {
  // optional: only use sendgrid if installed and configured
  sendgrid = require('@sendgrid/mail');
} catch (e) {
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

    // Prefer EmailJS REST API when configured (no external package required)
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_USER_ID) {
      try {
        const emailjsPayload = {
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_USER_ID,
          template_params: {
            name: name,
            email: email,
            phone: phone,
            attendance: data.attendance || 'Sí',
            plus_one: plus_one,
            guest_name: guest_name,
            message: message
          }
        };

        const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailjsPayload)
        });

        if (!resp.ok) {
          const bodyText = await resp.text();
          throw new Error(`EmailJS error ${resp.status}: ${bodyText}`);
        }

        console.log(`Auto-reply (EmailJS) sent successfully to ${email}`);
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
      } catch (err) {
        console.error('EmailJS send error:', err && err.message ? err.message : err);
        // fall through to other providers
      }
    }

    // Prefer nodemailer (Gmail with app password) when configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
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
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
      } catch (err) {
        console.error('Nodemailer send error:', err && err.message ? err.message : err);
        // fall through to try SendGrid if available
      }
    }

    // If nodemailer wasn't configured or failed, try SendGrid if configured
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
      }
    }

    console.error('No email provider configured: set EMAILJS_SERVICE_ID/TEMPLATE_ID/USER_ID for EmailJS, or EMAIL_USER/EMAIL_PASS for Gmail, or SENDGRID_API_KEY/EMAIL_FROM for SendGrid');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email service not configured' })
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
