# Sales.BellaToka

## Overview
A React-based sales/landing page for Bella Toka, a premium craft cannabis brand. The site showcases the brand and invites potential distribution partners. Includes an admin dashboard at `/admin` for managing inquiries, viewing analytics, and troubleshooting with live console logs.

## Tech Stack
- **Framework**: React 19 (Create React App)
- **Language**: JavaScript
- **Package Manager**: npm
- **Routing**: react-router-dom
- **Icons**: lucide-react

## Project Structure
- `src/` - React source code
  - `App.js` - Main app component with routing (/ and /admin)
  - `index.js` - Entry point with BrowserRouter
  - `pages/SalesPage.js` - Primary sales/landing page
  - `pages/Admin.js` - Admin dashboard (login, profile, inquiries, analytics, console logs, settings)
  - `styles/SalesPage.css` - Sales page styles
  - `styles/Admin.css` - Admin dashboard styles (green theme, sidebar layout)
  - `styles/global.css` - Global styles
  - `utils/consoleCapture.js` - Console log interception utility for live troubleshooting
- `public/` - Static assets (images, favicon, index.html, _redirects for Netlify)
- `attached_assets/` - Reference files (original admin design)

## Admin Dashboard
- **URL**: `/admin`
- **Password**: Set via `REACT_APP_ADMIN_PASSWORD` environment variable (never hardcoded)
- **Dev shortcut**: In local development, "password" also works for quick access
- **Tabs**: Profile, Inquiries, Analytics, Console Logs, Settings
- **Data Storage**: localStorage (bt_inquiries, bt_profile, bt_settings)
- **Console Capture**: Intercepts console.log/warn/error/info + window errors + unhandled promise rejections
- **Design**: Cannabis green color scheme (#1a472a, #2d5a3f), sidebar navigation, responsive
- **Mock data**: Analytics tab shows demo data in development only; production shows "not connected" message

## Running
- **Dev server**: `npm start` (runs on port 5000, host 0.0.0.0)
- **Build**: `npm run build` (outputs to `build/` directory)

## Deployment

### Replit
- Static deployment using the `build/` directory
- Build command: `npm run build`
- Set `REACT_APP_ADMIN_PASSWORD` in environment variables

### Netlify
1. Connect your GitHub repo
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - Leave Base/Package directory blank
3. Set environment variable:
   - Go to Site configuration > Environment variables
   - Add `REACT_APP_ADMIN_PASSWORD` with your chosen production password
4. Deploy — the `_redirects` file in `public/` handles SPA routing automatically

## Environment Variables
- `PORT=5000` - Dev server port
- `HOST=0.0.0.0` - Dev server host
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Allow Replit proxy
- `BROWSER=none` - Prevent auto-opening browser
- `REACT_APP_ADMIN_PASSWORD` - Admin login password (required, set per environment)

## Security Notes
- Admin password is read from `REACT_APP_ADMIN_PASSWORD` env var at build time
- Never commit passwords to source code
- The dev-only "password" shortcut is stripped in production builds (NODE_ENV !== 'development')
- Note: CRA embeds env vars in the JS bundle at build time; for true server-side auth, add a backend

## Recent Changes
- 2026-02-13: SECURITY FIX — Moved admin password from hardcoded to REACT_APP_ADMIN_PASSWORD env var
- 2026-02-13: Added Netlify deployment support (_redirects file, deployment docs)
- 2026-02-13: Mock analytics data restricted to development mode only
- 2026-02-13: Added admin dashboard at /admin with full sidebar navigation, login system, and 5 tab panels
- 2026-02-13: Implemented console log capture system for live troubleshooting
- 2026-02-13: Wired sales page form to store inquiries in localStorage for admin panel
- 2026-02-13: Added react-router-dom for client-side routing between sales page and admin
