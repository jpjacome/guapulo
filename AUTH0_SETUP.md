# Auth0 Setup Guide for Parrillazo Guapulense CMS

## Step 1: Create Auth0 Account
1. Go to [auth0.com](https://auth0.com) and sign up for a free account
2. Choose "Personal" for account type
3. Select your region (closest to your users)

## Step 2: Create Auth0 Application
1. In Auth0 Dashboard, go to **Applications**
2. Click **"Create Application"**
3. Name: `Parrillazo Guapulense CMS`
4. Type: **Single Page Application (SPA)**
5. Click **Create**

## Step 3: Configure Application Settings
In your new application settings:

### Allowed Callback URLs:
```
https://guapuliza.netlify.app/admin/,
http://localhost:3000/admin/
```

### Allowed Logout URLs:
```
https://guapuliza.netlify.app/,
http://localhost:3000/
```

### Allowed Web Origins:
```
https://guapuliza.netlify.app,
http://localhost:3000
```

### Allowed Origins (CORS):
```
https://guapuliza.netlify.app,
http://localhost:3000
```

## Step 4: Get Your Credentials
From the application settings, copy these values:
- **Domain**: `your-tenant.auth0.com`
- **Client ID**: `aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`

## Step 5: Create Auth0 API (for backend access)
1. Go to **APIs** in Auth0 Dashboard
2. Click **"Create API"**
3. Name: `Parrillazo CMS API`
4. Identifier: `https://guapuliza.netlify.app/api`
5. Signing Algorithm: **RS256**
6. Click **Create**

## Step 6: Update CMS Configuration
Replace the placeholders in `/admin/config.yml` and `/admin/index.html`:

```yaml
# In admin/config.yml
auth0:
  domain: YOUR_ACTUAL_DOMAIN.auth0.com
  client_id: YOUR_ACTUAL_CLIENT_ID
  audience: https://guapuliza.netlify.app/api
```

```javascript
// In admin/index.html
const auth0Config = {
  domain: 'YOUR_ACTUAL_DOMAIN.auth0.com',
  clientId: 'YOUR_ACTUAL_CLIENT_ID',
  audience: 'https://guapuliza.netlify.app/api'
};
```

## Step 7: Test the Setup
1. Deploy your changes to Netlify
2. Go to `https://guapuliza.netlify.app/admin/`
3. You should be redirected to Auth0 login
4. Create an account or login
5. You should be redirected back to the CMS

## Benefits of Auth0 over Netlify Identity:
- ✅ **Active support** and regular updates
- ✅ **Better security** with modern auth standards
- ✅ **Social logins** (Google, Facebook, etc.)
- ✅ **Multi-factor authentication** support
- ✅ **Better user management** tools
- ✅ **Free tier** supports up to 7,000 active users

## Troubleshooting:
- If login fails, check your callback URLs match exactly
- If CORS errors occur, verify your allowed origins
- Make sure your Auth0 domain and client ID are correct

Let me know when you've set up Auth0 and I'll help you configure the final details!
