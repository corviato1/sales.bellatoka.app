# Sales.BellaToka

## Overview
A React-based sales/landing page for Bella Toka, a premium craft cannabis brand. The site showcases the brand and invites potential distribution partners.

## Tech Stack
- **Framework**: React 19 (Create React App)
- **Language**: JavaScript
- **Package Manager**: npm

## Project Structure
- `src/` - React source code
  - `App.js` - Main app component
  - `pages/SalesPage.js` - Primary sales/landing page
  - `styles/` - CSS stylesheets (SalesPage.css, global.css)
- `public/` - Static assets (images, favicon, index.html)

## Running
- **Dev server**: `npm start` (runs on port 5000, host 0.0.0.0)
- **Build**: `npm run build` (outputs to `build/` directory)

## Deployment
- Static deployment using the `build/` directory
- Build command: `npm run build`

## Environment Variables
- `PORT=5000` - Dev server port
- `HOST=0.0.0.0` - Dev server host
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Allow Replit proxy
- `BROWSER=none` - Prevent auto-opening browser
