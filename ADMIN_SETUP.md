# Admin Dashboard — Setup & How It Works

The site now has an admin panel at **`https://guapuliza.netlify.app/admin/`** where you can
change all event info (date, time, hero video/image, accent color, email texts) without touching
code. Publishing from the dashboard commits to GitHub, which triggers a normal Netlify deploy.

---

## One-time setup (do this after pushing)

### 1. Create a GitHub token

The dashboard needs a token to commit changes to `jpjacome/guapulo` on your behalf.

1. Go to <https://github.com/settings/personal-access-tokens/new>
2. **Token name:** `guapulo-admin`
3. **Expiration:** 1 year (you'll need to renew it after)
4. **Repository access:** *Only select repositories* → `jpjacome/guapulo`
5. **Permissions → Repository permissions → Contents:** `Read and write`
6. Click **Generate token** and copy it (starts with `github_pat_...`)

### 2. Add environment variables in Netlify

Go to your Netlify site → **Site configuration → Environment variables** and add:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | The password you'll use to log in to `/admin/`. Pick something long. |
| `GITHUB_TOKEN` | The token from step 1 |

Optional (defaults shown, only set them if something differs):

| Variable | Default |
|---|---|
| `GITHUB_REPO` | `jpjacome/guapulo` |
| `GITHUB_BRANCH` | `main` |
| `ADMIN_SESSION_SECRET` | derived from `ADMIN_PASSWORD` if unset |

Your existing EmailJS variables (`EMAILJS_SERVICE_ID`, etc.) stay as they are.

### 3. Push and deploy

Commit and push this branch. Netlify will pick up the new build command automatically
(it's in the root `netlify.toml`). After the deploy finishes, visit `/admin/` and log in.

---

## How to publish a new event

1. Open `https://guapuliza.netlify.app/admin/` and enter your password
2. Change the date, time, name, subtitle, color, video/image, email subject — whatever you need
3. To use a new video or image, click *Subir* and pick the file (big videos upload in parts automatically)
4. Click **PUBLICAR CAMBIOS**
5. The dashboard shows progress: *uploading → saving to GitHub → Netlify publishing → live ✓* (~1–2 min)

Every publish is a normal git commit (`admin: update event — ...`), so you can always see or
revert changes in the GitHub history.

---

## How the site is generated now

- **`guapulo-rsvp-website/_data/event-config.json`** — the single source of truth for the event
- **`guapulo-rsvp-website/build.js`** — runs on every Netlify deploy and generates:
  - `index.html` and `success.html` (from `templates/*.template.html`)
  - `generated-config.js` (countdown date for `script.js`)
  - `build-info.json` (lets the dashboard detect when a deploy is live)
- All dates/times shown anywhere (page, meta tags, WhatsApp preview, confirmation email) are
  **derived automatically** from the single `date` + `time` in the config — they can't drift apart.

⚠️ **Never edit `index.html` or `success.html` directly** — they are overwritten on every build.
Edit `templates/index.template.html` / `templates/success.template.html` instead.

To preview a config change locally: edit `_data/event-config.json`, run
`node guapulo-rsvp-website/build.js`, and open the site.

## Confirmation email (EmailJS as a "dumb pipe")

The full email HTML is rendered by the site from `event-config.json`
(`lib/email-template.js` + `lib/render-email.js`). EmailJS only delivers it.
All email texts are editable in `/admin/` → "Email de confirmación"; date, time,
hero image and accent color follow the event automatically.

**One-time EmailJS template change** (never needed again after this):

1. Go to <https://dashboard.emailjs.com> → **Email Templates** → open the template
   whose ID is in your `EMAILJS_TEMPLATE_ID` env var
2. **Subject:** replace with exactly: `{{subject}}`
3. **Content:** switch to code/HTML view (`</>` icon) and replace the ENTIRE body with exactly:
   `{{{html_content}}}`  ← triple braces, required so the HTML isn't escaped
4. **To Email** field: `{{to_email}}` (probably already set)
5. Save.

### Legacy files (no longer used, safe to delete later)

- `guapulo-rsvp-website/_data/event.json`, `content.json`, `settings.json` — replaced by `event-config.json`
- `guapulo-rsvp-website/build-netlify-config.js` — replaced by `build.js`
- `guapulo-rsvp-website/netlify.toml` — Netlify only reads the **root** `netlify.toml`

### New Netlify Functions

| Endpoint | Purpose |
|---|---|
| `admin-auth` | Password login → session token (12h) |
| `admin-config` | Reads current config + media list from GitHub |
| `admin-upload` | Stages large media uploads in chunks (Netlify Blobs) |
| `admin-publish` | Commits config + media to GitHub in one commit |

All admin endpoints require the session token; media paths and config values are validated
server-side before anything is committed.
