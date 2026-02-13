# Cheryl Newton Real Estate - Site Admin Guide

This guide covers everything you need to manage your website at **newton4.homes**.

---

## Table of Contents

1. [How the Site Works](#how-the-site-works)
2. [Deploying Updates](#deploying-updates)
3. [Logging Into the Admin Panel](#logging-into-the-admin-panel)
4. [Adding a New Listing](#adding-a-new-listing)
5. [Uploading Photos](#uploading-photos)
6. [Editing and Deleting Listings](#editing-and-deleting-listings)
7. [Viewing Messages and Leads](#viewing-messages-and-leads)
8. [Viewing Analytics](#viewing-analytics)
9. [Troubleshooting](#troubleshooting)
10. [Environment Variables Reference](#environment-variables-reference)

---

## How the Site Works

Your website has two parts:

- **Frontend** (what visitors see): A React app that shows listings, neighborhood guides, contact forms, etc. It's hosted on **Netlify** as static files.
- **Backend** (data and logic): Netlify Functions (serverless) that connect to your **Neon PostgreSQL** database. This stores your listings, leads, and analytics.

**Replit** is your development workspace where you edit code. It is NOT the live site. To make changes live, you deploy to Netlify.

**Data flow:**
```
Visitor loads newton4.homes
  -> Netlify serves the React app
  -> App calls /api/listings
  -> Netlify redirects to /.netlify/functions/listings
  -> Function queries Neon database
  -> Returns listings as JSON
  -> App displays them
```

---

## Deploying Updates

Every time code is changed in Replit, you need to deploy it to Netlify:

1. **Download from Replit**: Click the three dots menu in Replit > "Download as .zip"
2. **Extract the ZIP** on your computer
3. **Open your GitHub repo** in GitHub Desktop or VS Code
4. **Replace the files** in your local repo with the extracted files
5. **Commit and push** to GitHub
6. **Netlify auto-deploys** from your GitHub repo (usually takes 1-2 minutes)
7. **Verify** by visiting newton4.homes and checking the pages

**Important**: After deploying, if listings aren't showing, go to the Admin panel > Listings tab and click "Repair DB" once. This cleans up any data issues.

---

## Logging Into the Admin Panel

1. Go to **newton4.homes/admin**
2. Enter your admin password
3. You'll see the admin dashboard with tabs: Profile, Listings, Add Listing, Messages, Images, Settings, Analytics

Your admin password is stored as `ADMIN_PASSWORD_HASH` in Netlify's environment variables. The password you type must match this value exactly.

---

## Adding a New Listing

### Method 1: Web Listing Form (Recommended for most listings)

1. Go to **Admin > Add Listing** tab
2. Click **"Web Listing"**
3. Fill in the basic info:
   - **Address** (required): Street address
   - **City** (required): e.g., "Irvine"
   - **Price** (required): Numbers only, e.g., 1250000
   - **Beds, Baths, Sq Ft**: Numbers
   - **Status**: Active, Pending, Sold, etc.
   - **Description**: Property description text
4. Add photos (see [Uploading Photos](#uploading-photos))
5. Click **"Save Listing"**
6. You should see a green success message and the listing appears in the Listings tab

### Method 2: MLS Listing Form (For detailed MLS data)

1. Go to **Admin > Add Listing** tab
2. Click **"MLS Listing"**
3. This form has 10 tabs for detailed data entry: Basic Info, Location, Financial, Property Details, Interior, Exterior, HOA, Listing Info, Photos, Additional
4. Fill in as much detail as you have
5. Click **"Save Listing"**

### What happens after saving:

- The listing is stored in your Neon database
- It appears immediately in the Admin > Listings tab
- It appears on the public Listings page (newton4.homes/listings)
- It appears in the Home page Featured Properties section

---

## Uploading Photos

You have two ways to add photos to a listing:

### Option A: Upload Image Files (requires Cloudinary)

1. In any listing form, find the **Photos** section
2. Click **"Add Images"** to select files, or **"Add Folder"** to select an entire folder
3. Photos are uploaded to Cloudinary and URLs are stored with the listing
4. **Requires**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` set in Netlify environment variables

### Option B: Paste Image URLs (always works)

1. In any listing form, find the **Photos** section
2. Paste an image URL into the text field (must start with https://)
3. Click **"Add URL"**
4. The URL is stored directly with the listing
5. **This works without any Cloudinary setup**

### Photo tips:

- Upload supports JPG, PNG, GIF, WebP formats
- Images are automatically optimized and resized to max 1600px width
- You can add multiple photos - they'll display as a gallery on the listing page
- To remove a photo, click the X button on its thumbnail
- If upload fails, you'll see an amber warning message - you can still use the URL method as a fallback

---

## Editing and Deleting Listings

### Editing:

1. Go to **Admin > Listings** tab
2. Find the listing in the table
3. Click the **pencil/edit icon** on the right
4. The edit form opens with all existing data pre-filled
5. Make your changes
6. Click **"Save Listing"**

### Deleting:

1. Go to **Admin > Listings** tab
2. Find the listing in the table
3. Click the **trash/delete icon** on the right
4. Confirm the deletion
5. The listing is permanently removed

---

## Viewing Messages and Leads

When visitors fill out the Contact form or Home Valuation form on your site, their information is saved to the database.

1. Go to **Admin > Messages** tab
2. Click **"Load Messages"** to fetch the latest leads
3. You'll see each lead with: Name, Email, Phone, Message, Form Type, Date

---

## Viewing Analytics

1. Go to **Admin > Analytics** tab
2. You'll see:
   - Total page views, unique visitors
   - Views today, this week, this month
   - Top pages visited
   - Traffic chart (last 30 days)
   - Per-listing view analytics

**Note**: Analytics only track production (live site) visitors, not your own testing in Replit.

---

## Troubleshooting

### "Listings aren't showing up"

1. Go to **Admin > Listings** tab
2. Click **"Repair DB"** - this fixes any corrupted data in the database
3. Refresh the page
4. If still empty, check that your `NEON_DATABASE_URL` is set correctly in Netlify environment variables

### "I saved a listing but it disappeared"

This usually means a database error occurred during save. The "Repair DB" button will fix this:
1. Go to Admin > Listings tab
2. Click "Repair DB"
3. Your listings should reappear

### "Photo upload isn't working"

1. Check that all three Cloudinary variables are set in Netlify:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. As a workaround, use the "Add URL" button to paste image URLs directly
3. You can host images on any image hosting service and paste the URL

### "Admin login doesn't work"

1. Check that `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` are set in Netlify environment variables
2. Make sure you're typing the password exactly as stored in `ADMIN_PASSWORD_HASH`
3. The login token expires after 24 hours - you'll need to log in again

### "The site looks outdated after code changes"

1. Make sure you deployed the latest code to GitHub
2. Check Netlify dashboard > Deploys to see if the build succeeded
3. Try a hard refresh in your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. If using a custom domain, DNS changes can take a few minutes

### "Database error messages"

If you see any error about "NaN" or "invalid input":
1. Go to Admin > Listings tab
2. Click "Repair DB"
3. This automatically cleans up any corrupted data

---

## Environment Variables Reference

These must be set in your **Netlify dashboard** under Site settings > Environment variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEON_DATABASE_URL` | Connection string for your Neon PostgreSQL database | Yes |
| `ADMIN_PASSWORD_HASH` | Your admin login password | Yes |
| `SESSION_SECRET` | Secret key for admin session tokens (any random string) | Yes |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account cloud name | For photo uploads |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | For photo uploads |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | For photo uploads |
| `SPARK_API_KEY` | Bridge API token for MLS sync | Optional |

**Note**: `NETLIFY_DATABASE_URL` and `NETLIFY_DATABASE_URL_UNPOOLED` are automatically created by Netlify's Neon integration - don't modify these manually.

---

## Quick Reference: Common Tasks

| Task | Where to Go |
|------|-------------|
| Add a listing | Admin > Add Listing > Web Listing |
| Edit a listing | Admin > Listings > click pencil icon |
| Delete a listing | Admin > Listings > click trash icon |
| View leads | Admin > Messages > Load Messages |
| View analytics | Admin > Analytics |
| Fix database issues | Admin > Listings > Repair DB |
| Deploy code changes | Download ZIP > Push to GitHub > Auto-deploys |
