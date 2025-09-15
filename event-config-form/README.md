k# Event RSVP Website Configuration Form

This PHP application provides a comprehensive form interface for collecting all the customization details needed to generate a complete Event RSVP website with CMS integration.

## 🚀 Features

- **Complete Question Coverage**: All 43 customization questions from the reference document
- **Interactive UI**: Modern, responsive form with real-time validation
- **Auto-save**: Draft saving to prevent data loss
- **Progress Tracking**: Visual progress indicator
- **Color Palette Selector**: Pre-designed color schemes with live preview
- **Configuration Preview**: Review settings before submission
- **Export Options**: Download configuration as JSON
- **Print Support**: Printable configuration summary

## 📁 File Structure

```
event-config-form/
├── index.php           # Main configuration form
├── success.php         # Success page after form submission
├── view-config.php     # Display configuration details
├── download.php        # Download configuration as JSON
├── style.css           # Modern CSS styling
├── script.js           # Interactive JavaScript functionality
├── saved_configs/      # Directory for saved configurations
│   ├── latest_config.json    # Most recent configuration
│   └── config_YYYY-MM-DD_HH-mm-ss.json  # Timestamped configs
└── README.md           # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- PHP 7.4+ with JSON extension
- Web server (Apache, Nginx, or PHP built-in server)
- Write permissions for `saved_configs/` directory

### Quick Start
1. Ensure web server is running
2. Navigate to the form directory
3. Open `index.php` in your browser
4. Complete the configuration form
5. Download the generated JSON file

### Using PHP Built-in Server
```bash
cd event-config-form
php -S localhost:8000
```
Then open: http://localhost:8000

## 📋 Form Sections

### 1. Event Details (6 questions)
- Event type, name, date, time, location
- Google Maps integration options

### 2. Content & Messaging (7 questions)
- Host information, tone, welcome message
- Event description, gift info, RSVP deadline

### 3. Design & Branding (6 questions)
- Logo, hero media, favicon options
- Color scheme selection (5 pre-designed palettes + custom)

### 4. Form & Functionality (5 questions)
- Dietary restrictions, plus-one guests
- Phone requirements, custom questions

### 5. CMS & Technical Setup (5 questions)
- GitHub configuration, repository settings
- CMS editor access, branch protection

### 6. Deployment & Notifications (5 questions)
- Spam protection, domain settings
- Email notifications, SEO configuration

### 7. Advanced Features (6 questions)
- Countdown timer, social sharing
- Photo gallery, external links, analytics

### 8. Final Verification (3 questions)
- Event summary confirmation
- Technical requirements acknowledgment

## 🎨 Pre-designed Color Palettes

1. **Elegant Wedding**: Soft blush, warm cream, deep forest
2. **Fun Birthday**: Bright coral, sunny yellow, navy blue
3. **Professional Corporate**: Professional blue, light gray, charcoal
4. **Casual BBQ**: Warm terracotta, cream, brown
5. **Sweet Baby Shower**: Soft mint, powder blue, lavender
6. **Custom Colors**: User-defined hex values

## 💾 Data Storage

- **Auto-save**: Form data saved to localStorage every 2 seconds
- **Persistent Storage**: Submitted configurations saved as JSON files
- **Timestamped Backups**: Each submission creates a unique timestamped file
- **Latest Config**: Always maintains the most recent configuration

## 🔧 JavaScript Features

- **Real-time Validation**: Immediate feedback on required fields
- **Progress Tracking**: Visual progress bar based on completion
- **Auto-generation**: Event summary automatically created
- **Color Sync**: Color picker and hex input synchronization
- **Preview Modal**: Complete configuration preview before submission
- **Loading States**: User feedback during form processing

## 📱 Responsive Design

- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Large touch targets and intuitive navigation
- **Fast Loading**: Optimized CSS and JavaScript
- **Cross-Browser**: Compatible with all modern browsers

## 🔒 Security Features

- **Input Validation**: Server-side and client-side validation
- **XSS Protection**: Proper input sanitization
- **File Security**: Secure file handling for configurations
- **Error Handling**: Graceful error management

## 📊 Output Format

Generated JSON includes all configuration data organized by sections:

```json
{
    "event_type": "Wedding",
    "event_name": "Sarah & John's Wedding",
    "event_date": "2025-08-15",
    "color_scheme": "elegant_wedding",
    "github_username": "johndoe",
    "notification_email": "sarah@example.com",
    // ... all other configuration options
}
```

## 🎯 Integration with Website Generator

This configuration file is designed to work seamlessly with the Event RSVP Website Generator that:

1. **Reads the JSON configuration**
2. **Generates complete project structure**
3. **Creates all necessary files** (HTML, CSS, JS, CMS config)
4. **Sets up GitHub repository**
5. **Configures Netlify deployment**
6. **Implements all requested features**

## 🐛 Troubleshooting

### Common Issues

**Form won't submit:**
- Check all required fields are filled
- Ensure JavaScript is enabled
- Verify write permissions on `saved_configs/` directory

**Auto-save not working:**
- Check browser localStorage support
- Clear browser cache and reload

**Download not working:**
- Ensure configuration was saved successfully
- Check PHP file permissions
- Verify JSON file exists in `saved_configs/`

### Debug Mode
Add `?debug=1` to URL for additional console logging and error information.

## 🔄 Version History

- **v1.0**: Initial release with all 43 configuration questions
- Complete form validation and auto-save functionality
- Responsive design and color palette selection
- JSON export and configuration preview

## 📞 Support

For technical support or questions about the configuration form:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Review browser console for JavaScript errors
4. Contact your developer with the generated JSON file

---

**Note**: This form is designed to be used by end users to configure their event websites. The generated JSON file should be provided to developers who will use it to create the complete RSVP website with CMS integration.
