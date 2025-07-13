# Netlify Auth0 Extension Setup Guide
## Official Integration for Parrillazo Guapulense CMS

✅ **You've already installed the Auth0 extension!** Now follow these steps:

## Step 1: Connect Your Auth0 Tenant
1. In your Netlify dashboard, go to your **guapulo** site
2. Navigate to **Site Settings** → **Access & security** → scroll to **Auth0 extension settings**
3. Click **"Link an Auth0 tenant"**
4. Follow the prompts to authorize Netlify to access your Auth0 account
5. If you don't have an Auth0 account, click **"Sign up with Auth0"**

## Step 2: Configure Auth0 for Your Site
1. Under **Site tenants**, click **"Add a tenant"**
2. Select your Auth0 tenant
3. Click **"Create new application"** (this creates a Single Page App optimized for Netlify)
4. Optionally click **"Create new API"** (for backend functions)
5. Select **"Production"** as the deploy context
6. Leave the environment variable prefix blank (or choose a preset if needed)

## Step 3: Verify the Setup
The extension automatically:
- ✅ Creates Auth0 Single Page Application
- ✅ Sets up proper callback URLs for your Netlify site
- ✅ Configures CORS settings
- ✅ Generates environment variables (`AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, etc.)
- ✅ Optimizes security settings (RS256, proper scopes)

## Step 4: Test Your CMS
1. Wait for Netlify to redeploy your site (1-2 minutes)
2. Go to: `https://guapuliza.netlify.app/admin/`
3. You should be redirected to Auth0 login
4. Create an account or sign in
5. You'll be redirected back to your CMS

## What the Extension Handles Automatically:
- **Application Type**: Single Page Application (SPA)
- **Callback URLs**: Your Netlify site URLs + `/admin/`
- **CORS Settings**: Proper origins for your domain
- **JWT Algorithm**: RS256 (recommended by Auth0)
- **Environment Variables**: Automatically injected into your builds

## Benefits:
- ✅ **Zero manual configuration** needed
- ✅ **Automatic security optimization**
- ✅ **Local development support**
- ✅ **Team collaboration** features
- ✅ **Production-ready** out of the box

## Troubleshooting:
- **CMS won't load**: Check that extension is configured for "Production" deploy context
- **Auth redirect fails**: Verify your site URL matches the configured domain
- **Permission denied**: Make sure you're the site owner or have proper team access

Your CMS should now work seamlessly with Auth0 authentication!
