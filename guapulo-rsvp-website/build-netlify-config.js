#!/usr/bin/env node

/**
 * Build script to generate netlify.toml with email templates from content.json
 * This allows email content to be managed through the content.json file
 */

const fs = require('fs');
const path = require('path');

// Read content.json
const contentPath = path.join(__dirname, '_data', 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Get email templates from content
const emailTemplates = content.email_templates;
const notificationEmail = content.notification_email;

// Build auto-reply email body from JSON structure
function buildAutoReplyBody(templates) {
  const autoReply = templates.auto_reply;
  const eventDetails = autoReply.event_details;
  const confirmationDetails = autoReply.confirmation_details;
  const contactInfo = autoReply.contact_info;
  
  return `${autoReply.greeting}
  
  ${autoReply.confirmation_message}
  
  ${eventDetails.title}
  ${eventDetails.date}
  ${eventDetails.time}
  ${eventDetails.location}
  ${eventDetails.reminder}
  
  ${confirmationDetails.title}
  ${confirmationDetails.attendance}
  ${confirmationDetails.plus_one}
  ${confirmationDetails.guest_name}
  
  ${autoReply.closing_message}
  
  ${contactInfo.message}
  ${contactInfo.email}
  
  ${autoReply.farewell}
  
  ---
  ${autoReply.signature}
  
  ---
  📝 Email content managed via _data/content.json`;
}

// Build owner notification body
function buildOwnerNotificationBody(templates) {
  const ownerNotif = templates.owner_notification;
  const fields = ownerNotif.fields;
  
  return `${ownerNotif.intro}
  
  ${fields.name}
  ${fields.email}
  ${fields.phone}
  ${fields.attendance}
  ${fields.plus_one}
  ${fields.guest_name}
  ${fields.custom_question}
  ${fields.message}
  
  ${ownerNotif.timestamp}`;
}

// Generate the netlify.toml content
const netlifyTomlTemplate = `# Netlify Configuration for Parrillazo Guapulense RSVP Website
# Email templates managed via _data/content.json

[build]
  command = ""
  publish = "."
  environment = { NODE_VERSION = "18" }

[functions]
  directory = "netlify/functions"

[forms]
  enabled = true

# Form notifications and auto-replies (Generated from content.json)
[[forms.notifications]]
  form = "rsvp"
  to = "${notificationEmail}"
  subject = "${emailTemplates.owner_notification.subject}"
  body = """
  ${buildOwnerNotificationBody(emailTemplates)}
  """

[[forms.notifications]]
  form = "rsvp"
  to = "{{email}}"
  from = "noreply@guapuliza.netlify.app"
  subject = "${emailTemplates.auto_reply.subject}"
  body = """
  ${buildAutoReplyBody(emailTemplates)}
  """

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.png"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"

# Redirects
[[redirects]]
  from = "/rsvp"
  to = "/#rsvp"
  status = 301

[[redirects]]
  from = "/about"
  to = "/#about"
  status = 301

[[redirects]]
  from = "/details"
  to = "/#details"
  status = 301

[[redirects]]
  from = "/contact"
  to = "/#rsvp"
  status = 301

[[redirects]]
  from = "/404"
  to = "/404.html"
  status = 404

[[redirects]]
  from = "/success"
  to = "/thank-you.html"
  status = 200

[context.production]
  command = ""
  
[context.deploy-preview]
  command = ""
  
[context.branch-deploy]
  command = ""

[dev]
  command = ""
  port = 3000
  publish = "."
  autoLaunch = true

[template.environment]
  NETLIFY_SITE_NAME = "parrillazo-guapulense"
  NETLIFY_SITE_URL = "https://jpjacome.github.io/guapulo"

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true
`;

// Write the generated netlify.toml
fs.writeFileSync(path.join(__dirname, 'netlify.toml'), netlifyTomlTemplate);

console.log('✅ netlify.toml generated successfully from content.json email templates!');
console.log('📧 Email templates are now managed via _data/content.json');
