# Email Template Management

The email templates for Netlify Forms are now managed through the `_data/content.json` file!

## 📧 How It Works

1. **Edit email content** in `_data/content.json` under the `email_templates` section
2. **Run build script** to generate `netlify.toml` with your changes
3. **Deploy** to apply the new email templates

## 🔧 Commands

```bash
# Generate netlify.toml from content.json
npm run build:emails

# Or run the script directly
node build-netlify-config.js

# Deploy with updated emails
npm run deploy
```

## 📝 Email Template Structure

### Auto-Reply Email (to form submitters)
Edit in `content.json` under `email_templates.auto_reply`:

```json
{
  "subject": "✅ RSVP Confirmado - Parrillazo Guapulense 2025",
  "greeting": "¡Hola {{name}}!",
  "confirmation_message": "¡Genial! Tu confirmación...",
  "event_details": {
    "title": "📅 DETALLES DEL EVENTO:",
    "date": "• Fecha: Viernes, 18 de julio de 2025",
    // ... more fields
  }
}
```

### Owner Notification (to you)
Edit in `content.json` under `email_templates.owner_notification`:

```json
{
  "subject": "Nueva confirmación RSVP - Parrillazo Guapulense 2025",
  "intro": "Nueva confirmación recibida...",
  // ... more fields
}
```

## 🚀 Workflow

1. **Update content**: Edit `_data/content.json`
2. **Build config**: `npm run build:emails`
3. **Deploy**: `npm run deploy`
4. **Test**: Submit a form to see your changes!

## 📬 Available Template Variables

Use these Netlify form variables in your email templates:

- `{{name}}` - Form submitter's name
- `{{email}}` - Form submitter's email
- `{{phone}}` - Phone number
- `{{attendance}}` - Yes/No attendance
- `{{plus_one}}` - Plus one selection
- `{{guest_name}}` - Guest name (if provided)
- `{{custom_question}}` - Custom question answer
- `{{message}}` - Additional message
- `{{created_at}}` - Submission timestamp

## 🎯 Benefits

- ✅ **No more manual netlify.toml editing**
- ✅ **Centralized content management**
- ✅ **Version controlled email templates**
- ✅ **Easy to update for future events**
