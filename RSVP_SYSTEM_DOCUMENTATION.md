# Parrillazo Guapulense RSVP System - Complete Documentation

## Overview
This is a complete RSVP system for the "Parrillazo Guapulense" event, built on Netlify with integrated email notifications and database storage. The system handles event invitations, RSVP collection, automated email confirmations, and data management.

## System Architecture

### Core Components
1. **Frontend Website** - Static HTML/CSS/JS site hosted on Netlify
2. **Netlify Forms** - Built-in form handling and spam protection
3. **Netlify Functions** - Serverless backend for email and database operations
4. **EmailJS** - Email service for automated RSVP confirmations
5. **Notion** - Database for storing RSVP data
6. **GitHub** - Version control and deployment triggers

### Data Flow
```
User submits RSVP form
    ↓
Netlify Forms captures submission
    ↓
Netlify webhook triggers rsvp-autoreply function
    ↓
EmailJS sends confirmation email to user
    ↓
rsvp-to-notion function stores data in Notion database
    ↓
Success page displayed to user
```

## File Structure

```
guapulo-rsvp-website/
├── index.html              # Main RSVP form page
├── success.html            # Confirmation page after RSVP
├── style.css              # Styling and responsive design
├── script.js              # Frontend JavaScript (form validation, countdown, video)
├── netlify.toml           # Netlify configuration
├── _data/                 # Configuration JSON files
│   ├── content.json       # Email templates and content settings
│   ├── event.json         # Event details and settings
│   └── settings.json      # UI theme and feature settings
├── assets/                # Static assets
│   ├── imgs/             # Images (backgrounds, favicons)
│   └── vid5.mp4          # Hero background video
└── netlify/
    └── functions/         # Serverless functions
        ├── rsvp-autoreply.js    # Email confirmation handler
        └── rsvp-to-notion.js    # Database storage handler
```

## Frontend Components

### index.html
- **Purpose**: Main landing page with RSVP form
- **Key Features**:
  - Hero section with background video
  - Countdown timer to event date
  - RSVP form with validation
  - Mobile-responsive design
  - Video autoplay with fallback overlay

### script.js
- **Configuration**: Event date, timezone, form settings
- **Functions**:
  - `initializeCountdown()` - Updates countdown timer
  - `handleFormSubmit()` - Processes form submission
  - `initializeVideoAutoplay()` - Handles video playback
  - Form validation and error handling
  - Local storage for form persistence

### style.css
- **Theme**: Corporate green (#D0FF00) color scheme
- **Responsive**: Mobile-first design with breakpoints
- **Components**: Form styling, video controls, animations

## Backend Components

### Netlify Functions

#### rsvp-autoreply.js
- **Trigger**: POST request from Netlify Forms webhook
- **Purpose**: Send automated email confirmation to RSVP submitters
- **Environment Variables**:
  - `EMAILJS_SERVICE_ID`
  - `EMAILJS_TEMPLATE_ID`
  - `EMAILJS_USER_ID`
  - `EMAILJS_PRIVATE_KEY`
- **EmailJS Template Parameters**:
  - `to_name`: Guest name
  - `to_email`: Guest email
  - `event_date`: "sábado 13 de diciembre"
  - `event_time`: "5:00 pm"
  - `event_location`: "Guápulo, Quito"

#### rsvp-to-notion.js
- **Trigger**: POST request from frontend JavaScript
- **Purpose**: Store RSVP data in Notion database
- **Data Stored**:
  - Name, email, phone, plus_one status
  - Message, timestamp
  - Event name

### Netlify Configuration (netlify.toml)
```toml
[build]
  publish = "guapulo-rsvp-website"
  functions = "guapulo-rsvp-website/netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## Email System (EmailJS)

### Service Configuration
- **Service**: Gmail API
- **Service ID**: service_i6sqe7o
- **Template ID**: template_5mp33rb
- **User ID**: Configured via environment variable

### Email Template Structure
```html
<div style="background-color: black; font-family: Courier New, sans-serif; max-width: 100%; margin: 0px; color: white;">
  <img src="https://guapuliza.netlify.app/assets/imgs/bg1.png" alt="">
  <div style="margin: 2rem">
    <h2 style="color: #D0FF00; margin-bottom: 2rem;">🎉 ¡Confirmación - Parrillazo Guapulense!</h2>
    <p>¡Hola {{to_name}}!</p>
    <p>¡Gracias por confirmar tu asistencia al <strong>Parrillazo Guapulense</strong>!</p>
    <p style="font-size: 18px; line-height: 2rem">🤖 <strong>¡Nos vemos pronto!<br> Te esperamos el {{event_date}} desde las {{event_time}}</strong></p>
    <p style="border: 1px solid #D0FF00; padding: 1rem"><strong>BYOB</strong> (Bring Your Own Beer 🍻 o booze 🥃)</p>
    <h3 style="color: #D0FF00;">🚘 Si vienes en auto</h3>
    <p>El ingreso es por la <strong>Av. de los Conquistadores</strong>.</p>
    <p>Recomendaciones: sube con viada (el primer tramo es sin miedo), sigue todo el camino por la derecha hasta pasar los tres rompe velocidades y continúa hasta el final de la calle.</p>
    <p><a href="https://maps.app.goo.gl/itHgPxDoDTRuH93v6?g_st=ipc">📍 Ver ubicación en Google Maps</a></p>
    <h3 style="color: #D0FF00;">👣 Si vienes a pie</h3>
    <p>El ingreso es por la <strong>puerta metálica junto al Ananké</strong>.</p>
    <p><a href="https://maps.app.goo.gl/CigdSuXcNm4jqZg77?g_st=ipc">📍 Ver ubicación en Google Maps</a></p>
    <p style="margin-top: 2rem">Si tienes preguntas, contacta a JP: <a href="mailto:jpjacome@yahoo.com">jpjacome@yahoo.com</a>, <a href="tel:+593979136467">+593 97 913 6467</a></p>
  </div>
</div>
```

## Database Integration (Notion)

### Database Structure
- **Database ID**: Configured in rsvp-to-notion.js
- **Fields**:
  - Name (title)
  - Email
  - Phone
  - Plus One
  - Message
  - Timestamp
  - Event

### API Integration
- Uses Notion API v1
- Requires `NOTION_API_KEY` environment variable
- Database ID hardcoded in function

## Configuration Files

### _data/event.json
```json
{
  "name": "Parrillazo Guapulense",
  "date": "2025-12-13",
  "formatted_date": "Saturday, December 13, 2025",
  "time": "6:00 pm",
  "location": "Guapulo",
  "rsvp_deadline": "2025-12-11",
  "expected_attendees": 15
}
```

### _data/content.json
Contains email templates, SEO settings, and UI content.

### _data/settings.json
UI theme settings, color schemes, and feature toggles.

## Environment Variables

### Required Variables
```
EMAILJS_SERVICE_ID=service_i6sqe7o
EMAILJS_TEMPLATE_ID=template_5mp33rb
EMAILJS_USER_ID=[configured in EmailJS dashboard]
EMAILJS_PRIVATE_KEY=[access token from EmailJS]
NOTION_API_KEY=[Notion integration token]
```

## Deployment Process

### Automatic Deployment
1. Push to `main` branch on GitHub
2. Netlify detects changes and rebuilds
3. Functions are deployed to `.netlify/functions/`
4. Site goes live at configured domain

### Manual Deployment
```bash
git add .
git commit -m "Update RSVP system"
git push origin main
```

## Form Submission Flow

### Step 1: Frontend Validation
- JavaScript validates required fields
- Real-time validation feedback
- Phone field is optional (no validation)

### Step 2: Netlify Forms
- Form data sent to Netlify Forms
- Spam protection via honeypot field
- Data stored temporarily

### Step 3: Webhook Trigger
- Netlify automatically calls `/.netlify/functions/rsvp-autoreply`
- Passes form data as POST body

### Step 4: Email Confirmation
- Function parses form data
- Calls EmailJS API with template parameters
- Email sent to guest

### Step 5: Database Storage
- Frontend JavaScript calls `/.netlify/functions/rsvp-to-notion`
- Data stored in Notion database
- User redirected to success page

## Video System

### Hero Video Configuration
- **File**: `assets/vid5.mp4`
- **Attributes**: autoplay, muted, loop, playsinline, webkit-playsinline
- **Poster**: `assets/imgs/bg3.png`
- **Fallback**: Custom play overlay for mobile

### JavaScript Controls
- `initializeVideoAutoplay()` function
- Handles autoplay blocking on mobile
- Visibility change resume
- Loop restart on video end

## Mobile Optimization

### Video Playback
- `playsinline` and `webkit-playsinline` attributes
- Custom overlay button when autoplay blocked
- Touch gesture handling

### Form Design
- Responsive input fields
- Touch-friendly button sizes
- Mobile-first CSS approach

## Error Handling

### Frontend Errors
- Form validation messages
- Network error handling
- Loading states and feedback

### Backend Errors
- Function error logging
- Email delivery failure handling
- Database connection error handling

## Maintenance Tasks

### Regular Updates
1. **Event Date**: Update in `script.js` CONFIG and JSON files
2. **Email Content**: Modify EmailJS template for content changes
3. **Images**: Replace assets in `/assets/` folder
4. **Styling**: Update `style.css` for design changes

### Monitoring
1. **Netlify Dashboard**: Check function logs and form submissions
2. **EmailJS Dashboard**: Monitor email delivery and template usage
3. **Notion Database**: Review RSVP data and responses

### Troubleshooting

#### Email Not Sending
1. Check EmailJS dashboard for errors
2. Verify environment variables
3. Test function with debug mode: `?debug=1`

#### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify Netlify Forms configuration
3. Test function endpoints directly

#### Video Not Playing
1. Check file paths and formats
2. Verify autoplay attributes
3. Test on different devices/browsers

## Security Considerations

### Environment Variables
- Never commit secrets to repository
- Use Netlify's encrypted environment variables
- Rotate API keys regularly

### Spam Protection
- Honeypot field in forms
- Email validation
- Rate limiting via Netlify

### Data Privacy
- Minimal data collection (name, email, phone optional)
- Secure storage in Notion
- No third-party tracking

## Future Enhancements

### Potential Features
1. **Reminder Emails**: Automated emails 24 hours before event
2. **Guest Management**: Admin panel for RSVP management
3. **Analytics**: Track form conversions and user behavior
4. **Multi-language**: Support for additional languages
5. **Photo Gallery**: Post-event photo sharing

### Technical Improvements
1. **Database Migration**: Move from Notion to dedicated database
2. **Email Templates**: Dynamic template selection
3. **API Versioning**: Versioned function endpoints
4. **Testing**: Automated test suite for functions

## Support and Contact

For technical issues or questions about this system:
- Check Netlify function logs
- Review EmailJS delivery reports
- Test functions with debug parameters
- Contact: jpjacome@yahoo.com

---

**Last Updated**: December 30, 2025
**System Version**: 1.0.0
**Event Date**: December 13, 2025