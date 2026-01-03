# Parrillazo Guapulense RSVP System - Copilot Instructions

## Architecture Overview
This is a Netlify-hosted RSVP system with serverless functions, EmailJS email integration, and Notion database storage. Key components:
- **Frontend**: Static HTML/CSS/JS with form validation and video autoplay
- **Backend**: Netlify Functions (`rsvp-autoreply.js`, `rsvp-to-notion.js`)
- **Email**: EmailJS with Gmail service (service_i6sqe7o, template_5mp33rb)
- **Database**: Notion API for RSVP storage
- **Config**: JSON files in `_data/` folder for event details and email templates

## Key Patterns & Conventions

### Environment Variables
Always use environment variables for API keys. Required variables:
- `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_USER_ID`, `EMAILJS_PRIVATE_KEY`
- `NOTION_API_KEY`

Example usage in functions:
```javascript
const serviceId = process.env.EMAILJS_SERVICE_ID;
```

### Configuration Management
Store event details, email templates, and settings in `_data/` JSON files:
- `event.json` - Event date, time, location, RSVP deadline
- `content.json` - Email templates, SEO settings, form configuration
- `settings.json` - UI theme and feature toggles

Update these files when changing event details or email content.

### Form Handling Pattern
RSVP form uses dual submission:
1. **Netlify Forms** - Automatic webhook triggers email confirmation
2. **JavaScript fetch** - Manual call to Notion storage function

Example from `script.js`:
```javascript
// Submit to Netlify (triggers email)
fetch('/', { method: 'POST', body: formData })

// Also send to Notion
fetch('/.netlify/functions/rsvp-to-notion', {
  method: 'POST',
  body: JSON.stringify(jsonData)
})
```

### Email Template Updates
Email content is managed in EmailJS dashboard, but parameters come from code. When updating email content:
1. Update EmailJS template HTML
2. Update template parameters in `rsvp-autoreply.js`
3. Test with debug mode: `?debug=1`

### Video Autoplay Pattern
Hero video uses comprehensive mobile fallback:
```javascript
function initializeVideoAutoplay() {
  const videos = document.querySelectorAll('.hero-video');
  videos.forEach(video => {
    const playPromise = video.play();
    playPromise?.catch(() => showOverlay());
  });
}
```

### Date Management
Event date appears in multiple places - update all when changing:
- `script.js` CONFIG object
- `_data/event.json`
- `rsvp-autoreply.js` template parameters
- HTML meta tags and display text

## Development Workflow

### Local Development
- Edit files directly in `guapulo-rsvp-website/` folder
- Test functions locally with `netlify dev`
- Use debug mode for functions: append `?debug=1`

### Deployment
```bash
git add .
git commit -m "description"
git push origin main  # Triggers Netlify rebuild
```

### Email Testing
Test email functions by submitting the form or calling functions directly:
```bash
curl -X POST /.netlify/functions/rsvp-autoreply \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

### Common Tasks
- **Change event date**: Update `script.js`, `event.json`, `rsvp-autoreply.js`, HTML
- **Update email content**: Modify EmailJS template + function parameters
- **Add images**: Place in `assets/imgs/`, update HTML references
- **Test mobile**: Check video autoplay and form responsiveness

## File Reference Guide
- `index.html` - Main form page with video hero
- `script.js` - Form validation, countdown, video handling
- `style.css` - Green theme (#D0FF00), mobile responsive
- `netlify/functions/rsvp-autoreply.js` - Email confirmation handler
- `netlify/functions/rsvp-to-notion.js` - Database storage
- `_data/event.json` - Event configuration
- `_data/content.json` - Email templates and content</content>
<parameter name="filePath">c:\Users\jpjac\OneDrive\Documents\jpj1\guapulo\parrillazo\dev\.github\copilot-instructions.md