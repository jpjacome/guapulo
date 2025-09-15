# Setting Up Auto-Reply Emails in Netlify

🚨 **IMPORTANT**: Auto-reply emails to form submitters CANNOT be configured via `netlify.toml`. They must be set up through the Netlify UI.

## 📧 How to Set Up Auto-Reply Emails

### Step 1: Access Form Settings
1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your "guapuliza" site
3. Navigate to **Site settings** → **Forms**
4. Click on **Form notifications**

### Step 2: Add Auto-Reply Notification
1. Click **Add notification**
2. Select **Email notification**
3. Configure the notification:

**Form**: `rsvp` (your form name)

**Event**: `Form submission`

**Recipients**: `{{email}}` (this sends to the form submitter)

**Subject**: `✅ RSVP Confirmado - Parrillazo Guapulense 2025`

**Message template**:
```
¡Hola {{name}}!

¡Genial! Tu confirmación para el Parrillazo Guapulense 2025 ha sido recibida exitosamente.

📅 DETALLES DEL EVENTO:
• Fecha: Viernes, 18 de julio de 2025
• Hora: 7:00 PM
• Lugar: Barrio Guápulo, Quito
• Recordatorio: BYOB (Trae tu propia bebida)

🤖 TU CONFIRMACIÓN:
• Asistencia: {{attendance}}
• Acompañante: {{plus_one}}
<!-- guest_name removed from form -->

¡Te esperamos para una noche increíble de parrilla, buena música y excelente compañía!

Si tienes alguna pregunta, no dudes en contactar a JP directamente:
📧 jpjacome@yahoo.com

¡Nos vemos en Guápulo! 🔥🤖

---
Parrillazo Guapulense 2025
```

### Step 3: Save and Test
1. Click **Save**
2. Test by submitting your form
3. Check that both you (owner) and the submitter receive emails

## 🎯 What's Already Working

✅ **Owner notifications**: Configured via `netlify.toml` - you receive detailed submission info
✅ **Form setup**: Form has proper `name="email"` field for reply-to functionality
✅ **Subject field**: Added hidden subject field for better email organization
✅ **Success page**: Users see confirmation page after submission

## 🔧 Current Form Configuration

The form is set up with:
- `name="rsvp"` - Form identifier
- `data-netlify="true"` - Enables Netlify Forms
- `name="email"` field - Sets reply-to address
- Hidden subject field - Organizes notifications
- Proper field names for all form data

## 📬 Available Template Variables

Use these in your auto-reply email template:
Use these in your auto-reply email template:
 - `{{name}}` - Submitter's name
 - `{{email}}` - Submitter's email
 - `{{phone}}` - Phone number
 - `{{attendance}}` - Yes/No attendance
 - `{{plus_one}}` - Plus one selection
 - `{{custom_question}}` - Custom question answer
 - `{{message}}` - Additional message
## ⚠️ Important Notes

- Auto-reply setup must be done manually in Netlify UI
- Changes to email templates require updating in Netlify UI, not code
- Test the auto-reply after any changes
- Form submissions will work immediately, but auto-replies need UI setup

## 🆘 Troubleshooting

If auto-replies aren't working:
1. Verify the notification is active in Netlify UI
2. Check that the form name matches (`rsvp`)
3. Ensure `{{email}}` is in the Recipients field
4. Test with a real email address
5. Check spam folder for auto-replies
