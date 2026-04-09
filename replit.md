# sales.bellatoka

A React-based sales page for Bella Toka cannabis crop futures distributors.

## Project Overview

This is a Create React App (CRA) project with client-side routing and an admin dashboard. It runs on Replit with an Express auth server handling authentication endpoints.

## Architecture

- **Frontend**: React 19, React Router v7, Lucide React icons
- **Build System**: Create React App (react-scripts 5)
- **Auth Server**: Express server (`server.js`) running on port 3001, proxied by the React dev server
- **State**: localStorage-based (inquiries, admin profile, tokens)

## Pages

- `/` — Main sales page (SalesPage)
- `/admin` — Admin panel with login, brand profile management, inquiries, analytics, console logs
- `/dashboard` — Dashboard view
- `/contact` — Contact form
- `/log` — Log viewer

## Dev Notes

- In development, admin password is `password` (hardcoded bypass in Admin.js, and also the Express server default)
- In development, dashboard/inventory password is `420` (Express server default)
- The `ADMIN_PASSWORD`, `DASHBOARD_PASSWORD`, `INVENTORY_PASSWORD`, `LOG_PASSWORD` environment variables can be set to override defaults in production
- The React dev server proxies `/.netlify/functions/*` requests to the Express auth server on port 3001
- Carousel images live in `src/media/carousel/` (webpack-bundled), named Bella Toka 1.jpg through Bella Toka 14.jpg in numeric order
- A manifest is auto-generated on `npm start`/`npm run build` via `scripts/generate-carousel-manifest.js` and written to `src/media/carousel/manifest.json`

## Running the App

Two workflows run in parallel:
1. **Auth Server** — `node server.js` on port 3001
2. **Start application** — `npm start` (React CRA) on port 5000

## Security

- Express auth server uses rate limiting (5 attempts per 15 minutes per IP)
- Timing-safe password comparison via `crypto.timingSafeEqual`
- Auth passwords are stored as environment secrets

## Key Files

- `src/App.js` — Router setup
- `src/pages/` — All page components
- `src/styles/` — CSS files
- `src/utils/` — consoleCapture, storage utilities
- `src/utils/storage.js` — XOR-based obfuscation for localStorage data
- `server.js` — Express auth server (replaces Netlify functions for Replit)
- `netlify/functions/` — Original Netlify serverless auth functions (kept for reference)
- `scripts/generate-carousel-manifest.js` — Auto-generates carousel image list
- `public/images/` — Static images (blackandwhite, cursor, mockups, Group 1)
- `src/media/carousel/` — Carousel images (Bella Toka 1–14.jpg) + manifest.json
- `public/_headers` — Security headers for Netlify (CSP, HSTS, X-Frame-Options, etc.)
- `netlify.toml` — Netlify build and redirect configuration
