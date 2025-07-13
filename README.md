# Parrillazo Guapulense 2025 🤖🔥

A complete, modern, responsive event RSVP website with content management system, featuring an 8-bit robot theme and professional corporate design.

## 🎯 Project Overview

This website was generated specifically for the **Parrillazo Guapulense** BBQ event on July 18, 2025, hosted by JP in Guápulo, Quito. It features:

- **Professional Corporate color scheme** with 8-bit pixel art elements
- **Responsive design** that works on all devices
- **Netlify Forms** integration for RSVP submissions
- **Netlify CMS (Decap CMS)** for easy content management
- **Countdown timer** to the event
- **Smooth animations** and interactive elements
- **SEO optimized** with meta tags and structured data

## 🚀 Quick Start

### Option 1: Simple PHP Server (Recommended)
1. Open terminal in the project directory
2. Run: `php -S localhost:3000`
3. Visit: `http://localhost:3000`

### Option 2: Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Node.js Development Server
```bash
npx serve -s . -l 3000
```

## 📁 Project Structure

```
guapulo-rsvp-website/
├── index.html              # Main website page
├── style.css               # Styles with Professional Corporate theme
├── script.js               # JavaScript for interactions and countdown
├── thank-you.html          # Post-RSVP confirmation page
├── netlify.toml            # Netlify deployment configuration
├── _data/                  # Data files (generated from your config)
│   ├── event.json          # Event details
│   ├── settings.json       # Design settings
│   └── content.json        # Website content
├── admin/                  # Netlify CMS (Content Management System)
│   ├── index.html          # CMS admin interface
│   └── config.yml          # CMS configuration
├── assets/                 # Static assets
│   ├── fonts/              # Custom fonts (if any)
│   └── imgs/               # Images and graphics
└── .vscode/                # VS Code workspace settings
    └── settings.json       # Editor configuration
```

## 🎨 Design Features

### Color Scheme: Professional Corporate
- **Primary**: #2E86AB (Professional Blue)
- **Secondary**: #F8F9FA (Light Gray)
- **Accent**: #343A40 (Dark Gray)
- **Text**: #343A40 (Dark Gray)
- **Background**: #FFFFFF (White)

### Theme: 8-bit Robots
- Pixel art elements and animations
- Robot mascot character
- Retro gaming aesthetic with modern design
- Smooth CSS animations and transitions

## 🔧 Configuration

Your website was generated with these settings:

### Event Details
- **Event**: Parrillazo Guapulense
- **Type**: BBQ
- **Date**: July 18, 2025
- **Time**: 6:00 PM
- **Location**: Guápulo, Quito
- **Host**: JP

### Custom Features
- Professional corporate color scheme
- 8-bit robot theme with pixel art elements
- Countdown timer to event date
- RSVP form with Netlify Forms integration
- Responsive design for all devices

## 📝 Content Management

### Using Netlify CMS
1. Deploy to Netlify (see deployment section)
2. Enable Netlify Identity in your Netlify dashboard
3. Visit `your-site.netlify.app/admin`
4. Create an admin account
5. Edit content through the visual interface

### Manual Editing
Edit the JSON files in the `_data/` folder:
- `event.json` - Event information
- `settings.json` - Design and website settings
- `content.json` - Website content and copy

## 🚀 Deployment

### Deploy to Netlify (Recommended)

1. **Create a GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Parrillazo Guapulense RSVP website"
   git branch -M main
   git remote add origin https://github.com/jpjacome/guapulo.git
   git push -u origin main
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Deploy with default settings

3. **Enable Features**:
   - **Forms**: Automatically enabled with `netlify.toml`
   - **Identity**: Enable in Site Settings → Identity
   - **CMS**: Access at `your-site.netlify.app/admin`

### Deploy to GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select source branch (main)
4. Your site will be available at `username.github.io/repository-name`

## 📧 Form Handling

### Netlify Forms (Default)
- Forms automatically work when deployed to Netlify
- View submissions in Netlify dashboard
- Email notifications available

### Custom Form Handling
To use a different form service, modify the form action in `index.html`:
```html
<form action="your-form-endpoint" method="POST" data-netlify="false">
```

## 🎯 SEO & Performance

### Included Optimizations
- Meta tags for search engines
- Open Graph tags for social media
- Responsive images
- Minified CSS and JavaScript
- Cache headers in `netlify.toml`
- Structured data markup

### Page Speed
- Optimized CSS with custom properties
- Minimal JavaScript footprint
- Compressed images (add your own)
- Preloaded critical fonts

## 📱 Browser Support

- **Chrome** 60+
- **Firefox** 60+
- **Safari** 12+
- **Edge** 79+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🛠️ Development

### Prerequisites
- Any modern web browser
- Text editor (VS Code recommended)
- PHP (for local server) or Node.js

### VS Code Setup
1. Open folder in VS Code
2. Install recommended extensions (auto-prompted)
3. Use Ctrl+Shift+P → "Tasks: Run Task" → "Start Local Server"

### Available VS Code Tasks
- **Start Local Server** - Launches PHP development server
- **Open in Browser** - Opens website in default browser
- **Open CMS Admin** - Opens content management interface
- **Validate HTML** - Checks HTML syntax
- **Deploy to Netlify** - Deploys site to production

## 🎨 Customization

### Changing Colors
Edit `style.css` CSS custom properties:
```css
:root {
  --color-primary: #2E86AB;
  --color-secondary: #F8F9FA;
  --color-accent: #343A40;
  /* ... more colors */
}
```

### Adding Content
1. Edit `_data/content.json` for text content
2. Edit `_data/event.json` for event details
3. Use Netlify CMS for visual editing

### Custom Styling
- Add styles to `style.css`
- Modify animations and transitions
- Customize the pixel art elements

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form submission works
- [ ] Countdown timer displays correctly
- [ ] Responsive design on mobile
- [ ] All links work
- [ ] Images load properly
- [ ] Animations are smooth

### Automated Testing
```bash
# Validate HTML (requires html-validate)
npx html-validate *.html

# Check for broken links
npx broken-link-checker http://localhost:3000
```

## 📊 Analytics

### Google Analytics
Add your tracking code to `index.html` and `thank-you.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Event Tracking
The JavaScript includes event tracking for:
- RSVP form submissions
- Button clicks
- Page navigation
- Error events

## 🔐 Security

### Included Security Features
- Content Security Policy headers
- XSS protection
- CSRF protection for forms
- Safe external link handling

### Best Practices
- Keep dependencies updated
- Use HTTPS (automatic with Netlify)
- Validate all form inputs
- Sanitize user content

## 📞 Support

### Common Issues

**Q: Form submissions aren't working**
A: Ensure you're using Netlify hosting or configure alternative form handler

**Q: Countdown timer shows wrong time**
A: Check the event date in `script.js` and `_data/event.json`

**Q: CMS admin not loading**
A: Enable Netlify Identity in your site settings

**Q: Website looks broken on mobile**
A: Clear browser cache and test on actual devices

### Getting Help
- Check the browser console for JavaScript errors
- Validate HTML and CSS syntax
- Test on different browsers and devices
- Review Netlify deploy logs for errors

## 🎉 Event Day

### Final Checklist
- [ ] Test RSVP form one last time
- [ ] Verify event details are correct
- [ ] Check countdown timer accuracy
- [ ] Ensure contact information is up to date
- [ ] Share the website link with invitees

## 📜 License

This project was generated specifically for the Parrillazo Guapulense event. Feel free to modify and use for your own events.

## 🙏 Credits

- Built with love for JP's Parrillazo Guapulense 2025
- Design inspired by 8-bit gaming and modern web standards
- Powered by Netlify, Netlify CMS, and modern web technologies

---

**¡Que disfrutes tu Parrillazo Guapulense! 🤖🔥**

For questions about this website, contact JP or modify the contact information in the event details.
