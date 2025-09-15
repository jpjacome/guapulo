# Create Event RSVP Website with CMS - AI Development Prompt

## INSTRUCTION OVERVIEW
You are tasked with creating a complete, modern, responsive event RSVP website with form submission capabilities, animations, professional design, AND a simple Content Management System (CMS). This website will use Netlify Forms for form handling and Netlify CMS (Decap CMS) for content management, making it production-ready and user-friendly for non-technical content updates.

## IMPORTANT: DO NOT TEST THE PROJECT
- **Your role**: Create all files and provide instructions
- **User's role**: Test functionality, report issues, and provide feedback
- **Process**: Implementation → User Testing → Bug Reports → Fixes → Repeat

## EXECUTION PROCESS (Multi-Step Implementation)
**IMPORTANT**: This is a multi-step process with user testing phases. Do NOT attempt to test functionality yourself.

### STEP 1: PROJECT INITIALIZATION
1. **Create the complete project structure** as specified below
2. **Ask the customization questions** (provided at the end of this prompt)
3. **Execute VS Code terminal commands** for project setup
4. **Initialize Git repository with proper configuration**

### STEP 2: CORE WEBSITE DEVELOPMENT  
5. **Generate all website files** with user's specific content and styling
6. **Implement CMS configuration files** for easy content management
7. **Create comprehensive documentation** and setup guides

### STEP 3: GITHUB INTEGRATION
8. **Create GitHub repository** with proper settings
9. **Push all files to GitHub** with organized commits
10. **Set up branch protection and collaboration features**

### STEP 4: DEPLOYMENT CONFIGURATION
11. **Provide Netlify deployment instructions** with screenshots/steps
12. **Configure Netlify CMS authentication** for content management
13. **Set up form notifications and spam protection**

### STEP 5: USER TESTING PHASE
14. **Provide testing checklist** for user to verify functionality
15. **Wait for user feedback** and bug reports
16. **Address any issues** reported in the bug tracking system

### STEP 6: OPTIMIZATION & HANDOVER
17. **Implement fixes** based on user testing
18. **Provide maintenance documentation** and future update procedures
19. **Complete project handover** with all credentials and access

## MANDATORY PROJECT STRUCTURE
Create this exact folder structure and all files using VS Code terminal commands:

```
project-root/
│
├── index.html                 # Main landing page
├── thank-you.html            # Confirmation page after form submission
├── style.css                 # Main stylesheet with animations and responsive design
├── script.js                 # JavaScript for animations and form enhancement
├── _redirects                # Netlify redirects configuration
├── netlify.toml              # Netlify build and CMS configuration
├── package.json             # npm dependencies for Netlify deployment
├── .gitignore               # Git ignore file for common exclusions
├── README.md                # Project documentation and setup instructions
├── BUG_REPORT.md            # Bug reporting template for user testing
├── admin/                   # Netlify CMS admin interface
│   ├── index.html           # CMS admin page
│   └── config.yml           # CMS configuration file
├── _data/                   # Data files for CMS content
│   ├── event.json           # Event details (editable via CMS)
│   ├── settings.json        # Site settings (colors, fonts, etc.)
│   └── content.json         # Page content (text, messages, etc.)
├── assets/                  # Media and font assets
│   ├── 1.mp4                # Hero video (optional)
│   ├── fonts/               # Custom fonts directory
│   │   ├── CedarvilleCursive-Regular.ttf    # Decorative font for headings
│   │   └── MarkaziText-VariableFont_wght.ttf # Main text font
│   └── imgs/                # Image assets
│       ├── 1.png            # Hero image (fallback for video)
│       ├── logo.png         # Event logo/branding
│       ├── favicon.png      # Browser favicon
│       ├── border.png       # Decorative border image
│       ├── photo1.png       # Additional photos (optional)
│       ├── photo2.png       # Additional photos (optional)
│       └── photo3.png       # Additional photos (optional)
└── .vscode/                 # VS Code workspace settings
    ├── settings.json        # Editor configuration
    ├── tasks.json           # Build and deployment tasks
    └── extensions.json      # Recommended VS Code extensions
```

## VS CODE TERMINAL COMMANDS FOR PROJECT SETUP
Execute these commands in VS Code terminal in order:

### Initial Project Setup
```powershell
# Create project directory
mkdir [PROJECT_NAME]-rsvp-website
cd [PROJECT_NAME]-rsvp-website

# Create main directory structure
mkdir admin, _data, assets, assets\fonts, assets\imgs, .vscode

# Create main files
New-Item index.html, thank-you.html, style.css, script.js, _redirects, netlify.toml, package.json, .gitignore, README.md, BUG_REPORT.md -ItemType File

# Create CMS files
New-Item admin\index.html, admin\config.yml -ItemType File

# Create data files
New-Item _data\event.json, _data\settings.json, _data\content.json -ItemType File

# Create VS Code configuration files
New-Item .vscode\settings.json, .vscode\tasks.json, .vscode\extensions.json -ItemType File

# Initialize Git repository
git init
git config user.name "[USER_NAME]"
git config user.email "[USER_EMAIL]"
```

### NPM Package Setup (Required for Netlify Deployment)
```powershell
# Create package.json with development dependencies
# This step is CRITICAL for Netlify deployment to work properly
npm init -y

# Install development dependencies for local testing and validation
npm install --save-dev serve html-validate

# Update .gitignore to exclude npm artifacts
echo "node_modules/" >> .gitignore
echo "package-lock.json" >> .gitignore
```

### Git Configuration Commands
```powershell
# Set up Git configuration
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.safecrlf false

# Create initial commit structure
git add .gitignore README.md
git commit -m "Initial commit: Project structure setup"
```

## VS CODE WORKSPACE CONFIGURATION

### .vscode/settings.json (Editor Configuration)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "html.format.indentInnerHtml": true,
  "css.validate": true,
  "javascript.validate.enable": true,
  "files.associations": {
    "*.yml": "yaml"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "workbench.colorCustomizations": {
    "activityBar.background": "[USER_PRIMARY_COLOR]",
    "statusBar.background": "[USER_ACCENT_COLOR]"
  }
}
```

### .vscode/tasks.json (Automation Tasks)
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Local Server",
      "type": "shell",
      "command": "python",
      "args": ["-m", "http.server", "8000"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Deploy to Netlify",
      "type": "shell",
      "command": "git",
      "args": ["push", "origin", "main"],
      "group": "build",
      "dependsOn": "Git Add All Changes"
    },
    {
      "label": "Git Add All Changes",
      "type": "shell",
      "command": "git",
      "args": ["add", "."],
      "group": "build"
    }
  ]
}
```

### .vscode/extensions.json (Recommended Extensions)
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.live-server",
    "ms-vscode.hexeditor"
  ]
}
```

## BUG REPORTING SYSTEM

### BUG_REPORT.md Template
```markdown
# Bug Report for [EVENT_NAME] RSVP Website

## Bug Information
**Date Reported**: [DATE]
**Reporter**: [USER_NAME]
**Bug ID**: [UNIQUE_ID] (Use format: BUG-YYYYMMDD-001)

## Issue Category
- [ ] **Critical**: Site completely broken, forms not working
- [ ] **High**: Major functionality broken, affects user experience
- [ ] **Medium**: Minor functionality issues, visual problems
- [ ] **Low**: Typos, minor visual inconsistencies

## Environment Information
- **Browser**: [Chrome/Firefox/Safari/Edge + Version]
- **Device**: [Desktop/Mobile/Tablet]
- **Screen Size**: [1920x1080 / Mobile dimensions]
- **Operating System**: [Windows/Mac/iOS/Android]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [etc.]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots/Videos
[Attach screenshots or describe what you see]

## Additional Information
[Any other relevant details]

## Priority Level
- [ ] **P0**: Breaks core functionality (RSVP form, site won't load)
- [ ] **P1**: Significant user impact (animations broken, mobile issues)
- [ ] **P2**: Minor user impact (small visual issues)
- [ ] **P3**: Enhancement or nice-to-have

## Status Tracking
- [ ] **Reported**: Bug logged and triaged
- [ ] **In Progress**: Being worked on
- [ ] **Testing**: Fix implemented, needs verification
- [ ] **Resolved**: Bug fixed and deployed
- [ ] **Verified**: User confirmed fix works

---
**Internal Use Only**
**Developer Notes**: [Leave blank for developer]
**Fix Commit**: [Leave blank for developer]
```

## DYNAMIC CONTENT INTEGRATION

### JavaScript Content Loading (script.js additions)
```javascript
// Content Management System Integration
class CMSContentLoader {
    constructor() {
        this.eventData = null;
        this.contentData = null;
        this.settingsData = null;
    }

    async loadAllData() {
        try {
            const [eventResponse, contentResponse, settingsResponse] = await Promise.all([
                fetch('/_data/event.json'),
                fetch('/_data/content.json'),
                fetch('/_data/settings.json')
            ]);

            this.eventData = await eventResponse.json();
            this.contentData = await contentResponse.json();
            this.settingsData = await settingsResponse.json();

            this.applyContent();
            this.applySettings();
        } catch (error) {
            console.error('Failed to load CMS content:', error);
            this.loadFallbackContent();
        }
    }

    applyContent() {
        // Apply event data to DOM elements
        document.querySelector('[data-event="name"]').textContent = this.eventData.name;
        document.querySelector('[data-event="date"]').textContent = this.eventData.date;
        document.querySelector('[data-event="time"]').textContent = this.eventData.time;
        document.querySelector('[data-event="location"]').textContent = this.eventData.location;
        document.querySelector('[data-event="hosts"]').textContent = this.eventData.hosts;
        
        // Apply content data
        document.querySelector('[data-content="welcome"]').textContent = this.contentData.welcome_message;
        document.querySelector('[data-content="description"]').innerHTML = this.contentData.event_description;
        document.querySelector('[data-content="instructions"]').innerHTML = this.contentData.special_instructions;
        document.querySelector('[data-content="gifts"]').innerHTML = this.contentData.gift_info;
    }

    applySettings() {
        // Apply color scheme dynamically
        document.documentElement.style.setProperty('--color-1', this.settingsData.primary_color);
        document.documentElement.style.setProperty('--color-2', this.settingsData.secondary_color);
        document.documentElement.style.setProperty('--color-3', this.settingsData.accent_color);
        
        // Apply images if available
        if (this.settingsData.hero_image) {
            document.querySelector('[data-image="hero"]').src = this.settingsData.hero_image;
        }
        if (this.settingsData.logo) {
            document.querySelector('[data-image="logo"]').src = this.settingsData.logo;
        }
    }

    loadFallbackContent() {
        console.log('Loading fallback content - CMS data unavailable');
        // Implement fallback content loading if CMS fails
    }
}

// Initialize CMS content loading
document.addEventListener('DOMContentLoaded', () => {
    const cmsLoader = new CMSContentLoader();
    cmsLoader.loadAllData();
});
```

## ENHANCED NETLIFY CONFIGURATION

### netlify.toml (Complete Configuration)
```toml
[build]
  publish = "."
  
[build.environment]
  NODE_VERSION = "18"

# Netlify CMS Identity Service
[identity]
  url = "/.netlify/identity"

# Git Gateway for CMS
[build.processing]
  skip_processing = false

# Form settings
[forms]
  spam_protection = true

# Redirect rules
[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# CMS-specific headers
[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
```

### package.json (Essential for Netlify Deployment)
```json
{
  "name": "event-rsvp-website",
  "version": "1.0.0",
  "description": "Event RSVP website with Netlify CMS",
  "main": "index.html",
  "scripts": {
    "dev": "serve .",
    "validate": "html-validate *.html"
  },
  "keywords": [
    "netlify",
    "cms",
    "rsvp",
    "event"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "serve": "^14.2.1",
    "html-validate": "^8.7.3"
  }
}
```

**⚠️ IMPORTANT DEPLOYMENT NOTE:**
- **ALWAYS create package.json BEFORE deploying to Netlify**
- **NEVER reference plugins in netlify.toml that don't exist**
- **ALWAYS run `npm install` after creating package.json**
- **Common deployment error**: "plugins must be installed either in the Netlify App or in package.json"
- **Solution**: Remove non-existent plugins from netlify.toml and ensure proper package.json setup

## COMPREHENSIVE FILE GENERATION REQUIREMENTS

### Critical Files with CMS Integration

#### 1. index.html (Enhanced with CMS)
- **Dynamic content placeholders** using data attributes
- **CMS-compatible structure** for easy editing
- **JSON data integration** via JavaScript
- **Fallback content** if CMS is unavailable
- **SEO meta tags** populated from CMS data

#### 2. Enhanced CSS with CMS Variables
- **CSS custom properties** that can be updated via CMS
- **Dynamic theming system** 
- **Responsive design** that adapts to CMS content changes

#### 3. Advanced JavaScript Features
- **CMS content loading** and error handling
- **Dynamic form field generation** based on CMS settings
- **Real-time content updates** without page reload
- **Progressive enhancement** approach

#### 4. Complete Documentation Package
- **User-friendly CMS guide** for non-technical users
- **Developer documentation** for future maintenance
- **Deployment automation** instructions

## AUTOMATED DEPLOYMENT WORKFLOW

### GitHub Actions Configuration (Optional Enhancement)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: '.'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## TERMINAL COMMANDS FOR GITHUB INTEGRATION

### Phase 1: Repository Setup
```powershell
# Create GitHub repository (use GitHub CLI if available)
gh repo create [REPOSITORY_NAME] --public --description "[EVENT_NAME] - RSVP Website with CMS"

# Or provide manual instructions for GitHub.com
# 1. Go to github.com/new
# 2. Repository name: [REPOSITORY_NAME]
# 3. Description: [EVENT_NAME] - RSVP Website with CMS
# 4. Public (recommended for free Netlify)
# 5. Initialize with README: No (we have our own)
```

### Phase 2: Local Repository Connection
```powershell
# Add remote origin
git remote add origin https://github.com/[USERNAME]/[REPOSITORY_NAME].git

# Verify remote connection
git remote -v

# Create and switch to main branch
git branch -M main

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initial website setup with CMS integration

- Complete RSVP website structure
- Netlify CMS integration for content management
- Responsive design with animations
- Form handling with Netlify Forms
- VS Code workspace configuration"

# Push to GitHub
git push -u origin main
```

### Phase 3: Continuous Development Workflow
```powershell
# For future updates
git add .
git commit -m "update: [DESCRIPTION_OF_CHANGES]"
git push origin main

# Create feature branches for major changes
git checkout -b feature/new-design
git add .
git commit -m "feat: implement new design changes"
git push origin feature/new-design
# Then create pull request on GitHub
```

## USER TESTING CHECKLIST

**IMPORTANT**: User must test ALL items before reporting completion

### Pre-Deployment Testing (Local)
- [ ] **Website loads** without errors in browser
- [ ] **All sections display** correctly (Hero, Description, Logistics, Contributions, RSVP)
- [ ] **Animations work** smoothly on scroll
- [ ] **Loading screen** appears and transitions properly
- [ ] **Mobile responsive** design works on phone/tablet
- [ ] **Navigation** scrolls to correct sections
- [ ] **Form validation** shows errors for required fields
- [ ] **Console errors** - check browser dev tools (F12)

### Post-Deployment Testing (Live Site)
- [ ] **Live site loads** correctly on Netlify
- [ ] **Form submissions work** and user receives confirmation
- [ ] **Email notifications** arrive at specified address
- [ ] **CMS admin access** works at /admin/ URL
- [ ] **CMS content editing** successfully updates website
- [ ] **Mobile performance** on actual devices
- [ ] **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
- [ ] **Social media sharing** (if enabled) works correctly

### CMS Testing Requirements
- [ ] **Admin login** works with GitHub authentication
- [ ] **Content editing** in CMS immediately updates live site
- [ ] **Image uploads** through CMS work correctly
- [ ] **Color changes** in CMS update website styling
- [ ] **Event details** editing reflects on main page
- [ ] **CMS preview** matches actual website appearance

### Performance Testing
- [ ] **Page load speed** under 3 seconds
- [ ] **Images optimize** and load quickly
- [ ] **Animations** don't lag or stutter
- [ ] **Form submission** completes in reasonable time
- [ ] **Mobile data usage** reasonable for visitors

### Bug Reporting Protocol
1. **Use BUG_REPORT.md template** for ALL issues
2. **Include screenshots** whenever possible
3. **Test on multiple devices** before reporting
4. **Check browser console** for JavaScript errors
5. **Provide step-by-step reproduction** instructions

## FINAL CUSTOMIZATION QUESTIONS

**ANSWER ALL QUESTIONS BELOW FOR 100% ACCURATE PROJECT CREATION**

### EVENT DETAILS
1. **Event type**: (Wedding, Birthday, BBQ, Corporate, Baby shower, etc.)
2. **Event name/title**: (Exactly as displayed)
3. **Event date**: (Day, Month Year format)
4. **Event time**: (Start time, end time if needed)
5. **Event location**: (Full address or venue name)
6. **Google Maps integration**: (Yes/No + address if yes)

### CONTENT & MESSAGING  
7. **Host names**: (Who is hosting/celebrating?)
8. **Invitation tone**: (Formal, casual, fun, elegant, professional)
9. **Welcome message**: (2-3 sentences for main page)
10. **Event description**: (Activities, food, dress code expectations)
11. **Gift information**: (Registry, cash gifts, no gifts policy)
12. **RSVP deadline**: (Date for responses)
13. **Special instructions**: (Parking, accessibility, items to bring)

### DESIGN & BRANDING
14. **Logo availability**: (Yes/No + description if yes)
15. **Hero media**: (Video/Image preference + style description)
16. **Favicon**: (Yes/No - we'll create if needed)
17. **Primary color**: (Hex code or name - main background)
18. **Secondary color**: (Hex code or name - accents)
19. **Text color**: (Hex code or name - readable contrast)

**Pre-designed Color Palettes** (choose if no custom colors):
- **Elegant Wedding**: Soft blush (#F5E6E8), warm cream (#FFF8DC), deep forest (#2F4F2F)
- **Fun Birthday**: Bright coral (#FF6B6B), sunny yellow (#FFE66D), navy blue (#4ECDC4)
- **Professional Corporate**: Professional blue (#2E86AB), light gray (#F8F9FA), charcoal (#343A40)
- **Casual BBQ**: Warm terracotta (#D2691E), cream (#F5F5DC), brown (#8B4513)
- **Sweet Baby Shower**: Soft mint (#B8E6B8), powder blue (#B6D7FF), lavender (#E6E6FA)

### FORM & FUNCTIONALITY
20. **Dietary restrictions field**: (Yes/No)
21. **Plus-one guests allowed**: (Yes/No)
22. **Phone number required**: (Yes/No)
23. **Custom form questions**: (List any additional questions)
24. **Expected attendee count**: (For planning capacity)

### CMS & TECHNICAL SETUP
25. **GitHub username**: (Required for repository)
26. **Repository name**: (Default: [event-name]-rsvp-website)
27. **Repository visibility**: (Public recommended/Private if sensitive)
28. **CMS editor access**: (GitHub usernames who can edit content)
29. **Branch protection**: (Yes/No - prevents direct main branch edits)

### DEPLOYMENT & NOTIFICATIONS
30. **Spam protection**: (reCAPTCHA recommended: Yes/No)
31. **Custom domain**: (Your domain or use Netlify subdomain)
32. **Notification email**: (Where to send RSVP submissions)
33. **Additional notifications**: (Slack/webhook integrations if needed)
34. **SEO page title**: (How site appears in search results)

### ADVANCED FEATURES
35. **Countdown timer**: (Yes/No - timer to event date)
36. **Social sharing**: (Yes/No - Facebook, Twitter share buttons)
37. **Photo gallery**: (Yes/No + number of photos if yes)
38. **External links**: (Registry, social media, other websites)
39. **Analytics**: (Google Analytics tracking if needed)
40. **Multilingual**: (Additional languages needed: Yes/No)

### FINAL VERIFICATION
41. **Complete event summary**: "[EVENT_NAME] on [DATE] at [TIME] hosted by [HOSTS] - CONFIRM ALL DETAILS CORRECT"
42. **Technical requirements confirmed**: "I understand this includes CMS, GitHub integration, and requires user testing"
43. **Ready for development**: "YES - Begin development with these specifications"

---

## COMPREHENSIVE EXECUTION PLAN

### PHASE 1: PROJECT INITIALIZATION (Steps 1-4)
```
⏱️ Estimated Time: 15-20 minutes
🎯 Goal: Complete project structure and Git setup
📋 Deliverables: All folders, files, and Git repository initialized
```

**Commands to Execute:**
```powershell
# Create project structure
mkdir [PROJECT_NAME]-rsvp-website
cd [PROJECT_NAME]-rsvp-website
mkdir admin, _data, assets, assets\fonts, assets\imgs, .vscode
New-Item index.html, thank-you.html, style.css, script.js, _redirects, netlify.toml, package.json, .gitignore, README.md, BUG_REPORT.md -ItemType File
New-Item admin\index.html, admin\config.yml -ItemType File
New-Item _data\event.json, _data\content.json, _data\settings.json -ItemType File
New-Item .vscode\settings.json, .vscode\tasks.json, .vscode\extensions.json -ItemType File

# Initialize Git
git init
git config user.name "[USER_NAME]"
git config user.email "[USER_EMAIL]"
```

**Pause Point**: ✋ Verify all files and folders created correctly before proceeding

### PHASE 2: CORE DEVELOPMENT (Steps 5-7)
```
⏱️ Estimated Time: 45-60 minutes  
🎯 Goal: Complete website with CMS integration
📋 Deliverables: Functional website with all features
```

**File Generation Priority:**
1. **_data/*.json** files with user's content
2. **admin/config.yml** with CMS configuration
3. **index.html** with dynamic content integration
4. **style.css** with responsive design and user colors
5. **script.js** with animations and CMS loading
6. **thank-you.html** with confirmation page
7. **netlify.toml** with complete configuration
8. **package.json** with npm dependencies (CRITICAL for deployment)
9. **VS Code configuration** files

**Pause Point**: ✋ User should open project in VS Code and verify all files load correctly

### PHASE 3: GITHUB DEPLOYMENT (Steps 8-10)
```
⏱️ Estimated Time: 10-15 minutes
🎯 Goal: Repository creation and code deployment  
📋 Deliverables: Live GitHub repository with all code
```

**Commands to Execute:**
```powershell
# Create GitHub repository
gh repo create [REPOSITORY_NAME] --public --description "[EVENT_NAME] - RSVP Website with CMS"

# Connect and push
git remote add origin https://github.com/[USERNAME]/[REPOSITORY_NAME].git
git add .
git commit -m "feat: Initial website setup with CMS integration"
git push -u origin main
```

**Pause Point**: ✋ User should verify GitHub repository exists and contains all files

### PHASE 4: NETLIFY DEPLOYMENT (Steps 11-13)  
```
⏱️ Estimated Time: 20-25 minutes
🎯 Goal: Live website with working CMS
📋 Deliverables: Deployed site with admin access
```

**Manual Steps for User:**
1. **CRITICAL FIRST STEP**: Ensure package.json exists and npm install was completed
2. Go to [netlify.com](https://netlify.com) and login/signup
3. Click "New site from Git"
4. Choose GitHub and authorize
5. Select the repository
6. **Build Settings**: Leave blank (no build command needed for static site)
7. **Publish Directory**: Leave as root directory "." 
8. Deploy with these settings
9. **If deployment fails with plugin errors**:
   - Check netlify.toml for non-existent plugins
   - Ensure package.json includes all required dependencies
   - Remove any invalid plugin references
   - Redeploy after fixes
10. Enable Identity service for CMS (Site Settings → Identity)
11. Configure Git Gateway (Identity → Git Gateway → Enable)
12. Test CMS admin access at [site-url]/admin/

**⚠️ COMMON DEPLOYMENT ISSUES:**
- **Error**: "plugins must be installed either in the Netlify App or in package.json"
- **Solution**: Remove non-existent plugins from netlify.toml, ensure package.json exists
- **Error**: Build fails or site doesn't load
- **Solution**: Check publish directory is set to "." and no build command is specified

**Pause Point**: ✋ User must complete ALL testing checklist items

### PHASE 5: USER TESTING & ITERATION (Steps 14-16)
```
⏱️ Estimated Time: 30-45 minutes (user testing)
🎯 Goal: Verified functionality and bug resolution
📋 Deliverables: Bug-free, production-ready website
```

**User Responsibilities:**
1. Complete entire testing checklist
2. Report bugs using BUG_REPORT.md template
3. Test on multiple devices and browsers
4. Verify CMS functionality thoroughly
5. Confirm all content displays correctly

**Developer Response:**
- Fix ALL reported bugs promptly
- Provide updated files via Git commits
- Re-test after each fix implementation
- Document any workarounds or limitations

### PHASE 6: FINAL HANDOVER (Steps 17-19)
```
⏱️ Estimated Time: 15-20 minutes
🎯 Goal: Complete project documentation and user training
📋 Deliverables: Fully documented, maintainable website
```

**Final Deliverables:**
- [ ] **Complete README.md** with all instructions
- [ ] **CMS user guide** for content editing
- [ ] **Maintenance documentation** for future updates
- [ ] **Contact information** for ongoing support
- [ ] **Backup instructions** for content and settings
- [ ] **Performance optimization** recommendations

---

## SUCCESS METRICS & VALIDATION

### Technical Requirements ✅
- [ ] **100% responsive** on all device sizes
- [ ] **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- [ ] **Page load speed** under 3 seconds
- [ ] **Accessibility compliance** (basic WCAG guidelines)
- [ ] **SEO optimization** with proper meta tags
- [ ] **Error-free console** (no JavaScript errors)

### Functional Requirements ✅
- [ ] **Form submissions** work and send notifications
- [ ] **CMS editing** updates website immediately  
- [ ] **Authentication** works for CMS access
- [ ] **File uploads** through CMS function correctly
- [ ] **Mobile optimization** tested on real devices
- [ ] **Animation performance** smooth on all browsers

### User Experience Requirements ✅
- [ ] **Intuitive navigation** with smooth scrolling
- [ ] **Clear call-to-action** for RSVP submission
- [ ] **Professional design** matching event tone
- [ ] **Fast loading** with engaging animations
- [ ] **Error handling** with helpful user messages
- [ ] **Content management** accessible to non-technical users

### Business Requirements ✅
- [ ] **All event information** accurately displayed
- [ ] **RSVP data collection** working properly
- [ ] **Spam protection** preventing fake submissions
- [ ] **Brand consistency** with chosen colors and fonts
- [ ] **Content updates** possible without developer
- [ ] **Scalable architecture** for future enhancements

**FINAL VALIDATION**: 
✅ Website is production-ready when ALL checkboxes are completed and user confirms satisfactory testing results.

This comprehensive prompt ensures 100% accuracy in creating a production-ready event RSVP website with integrated CMS, complete GitHub workflow, automated deployment, and thorough testing protocols.
