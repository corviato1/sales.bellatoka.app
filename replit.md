# sales.bellatoka

A React-based sales page for Bella Toka cannabis crop futures distributors.

## Project Overview

This is a Create React App (CRA) project with client-side routing and an admin dashboard. It was originally designed to be deployed on Netlify with serverless functions for authentication.

## Architecture

- **Frontend**: React 19, React Router v7, Lucide React icons
- **Build System**: Create React App (react-scripts 5)
- **Auth (Netlify)**: Serverless functions in `netlify/functions/` (auth, dashboard-auth, log-auth)
- **State**: localStorage-based (inquiries, admin profile, tokens)

## Pages

- `/` — Main sales page (SalesPage)
- `/admin` — Admin panel with login, brand profile management, inquiries, analytics, console logs
- `/dashboard` — Dashboard view
- `/contact` — Contact form
- `/log` — Log viewer

## Dev Notes

- In development, the admin password is `password` (hardcoded bypass in Admin.js)
- The Netlify functions (`/.netlify/functions/auth`) won't work in Replit dev mode — the dev password bypass covers this
- The `ADMIN_PASSWORD` environment secret is used by Netlify functions in production
- Carousel images live in `public/images/carousel/` and a manifest is auto-generated on `npm start`/`npm run build`

## Replit Configuration

- **Dev server**: runs on `0.0.0.0:5000` via `npm start`
- **Env vars**: `HOST=0.0.0.0`, `PORT=5000`, `DANGEROUSLY_DISABLE_HOST_CHECK=true` (development)
- **Deployment**: Static site — `npm run build` → `build/` directory

## Key Files

- `src/App.js` — Router setup
- `src/pages/` — All page components
- `src/styles/` — CSS files
- `src/utils/` — consoleCapture, storage utilities
- `netlify/functions/` — Serverless auth functions
- `scripts/generate-carousel-manifest.js` — Auto-generates carousel image list
- `public/images/` — Static images including carousel assets
