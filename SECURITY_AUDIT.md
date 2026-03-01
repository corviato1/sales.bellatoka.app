# Bella Toka — Full-Scope Adversarial Security Audit

**Target:** sales.bellatoka.app  
**Audit Date:** March 1, 2026  
**Auditor Role:** Senior Offensive Security Engineer / Defensive Security Architect  
**Scope:** Frontend, Backend, Auth, APIs, Infrastructure, Data, Supply Chain, Advanced Vectors

---

## 1. Executive Risk Summary

### Overall Security Posture Score: 22 / 100 (Critical)

The application has fundamental architectural flaws that make it unsuitable for handling real user data in its current form. The entire "backend" is a client-side illusion — all data lives in the user's browser localStorage, all authentication is bypassable via browser DevTools, and the "encryption" layer is trivially reversible. The Netlify serverless functions provide a thin authentication gate, but the tokens they issue are never validated server-side after initial generation.

### Top 5 Critical Risks

| # | Risk | Exploitability | Business Impact |
|---|------|----------------|-----------------|
| 1 | **Admin panel bypass via localStorage injection** — Setting `bt_admin_token` to `"authenticated"` in DevTools grants full admin access | Trivial (30 seconds) | Complete admin compromise |
| 2 | **No server-side data store** — All inquiry data (PII, license numbers) stored exclusively in browser localStorage | Trivial | Total data loss on browser clear; no centralized data collection |
| 3 | **XOR "encryption" with co-located key** — Encryption key stored in same localStorage as encrypted data | Trivial (< 1 minute) | Full PII exposure |
| 4 | **Hardcoded dev passwords in production bundle** — `"password"` and `"420"` visible in compiled JavaScript | Easy (source inspection) | Credential disclosure; social engineering risk |
| 5 | **No Content Security Policy** — Zero restrictions on script loading/execution | Moderate (requires XSS vector) | Full application takeover via injected scripts |

### Exploitability Rating: **Very High**
Most critical vulnerabilities require only a web browser's DevTools — no specialized tools, network access, or technical sophistication needed.

### Business Impact Level: **Severe**
- Complete admin panel takeover
- Exposure of distributor PII (names, emails, license numbers, phone numbers)
- Data integrity destruction (anyone can delete/modify all inquiries)
- Reputational damage to a cannabis business operating in a regulated industry

---

## 2. Vulnerability Table

### CRITICAL Severity

#### V-001: Admin Authentication Bypass via localStorage Injection
- **Attack Type:** Broken Authentication / Client-Side Auth Bypass
- **Location:** `src/pages/Admin.js:858`
- **Description:** The Admin component checks if `localStorage.getItem('bt_admin_token') === 'authenticated'`. However, the actual login flow (line 60) sets the token to `'dev-authenticated'` in dev mode, and the production Netlify function sets it to a random 64-char hex string (line 73-74). The validation check on line 858 looks for the literal string `'authenticated'`, which is a value that **neither** login path ever sets. This means:
  - In production: Legitimate users who log in via the Netlify function get a random hex token, but the persistence check on page reload looks for `'authenticated'` — so legitimate logins don't persist across page refreshes.
  - Any user can open DevTools → Console → `localStorage.setItem('bt_admin_token', 'authenticated')` → refresh → full admin access.
- **Exploit Scenario:** Attacker opens browser DevTools, runs one localStorage command, refreshes the page, and has full admin access to view/delete all inquiries, modify brand profile, access analytics and console logs.
- **Business Impact:** Complete admin panel compromise. Attacker can view all distributor PII, delete inquiry records, and modify brand information.
- **Remediation:** 
  1. Immediate: Change the check to verify any truthy token exists (not a magic string)
  2. Long-term: Implement server-side session validation on every admin action
- **Fix Complexity:** Immediate fix: 5 minutes. Proper fix: 2-3 days.

#### V-002: Client-Side-Only Data Architecture
- **Attack Type:** Insecure Architecture / No Server-Side Storage
- **Location:** `src/pages/Contact.js:26-28`, `src/utils/storage.js`
- **Description:** Contact form submissions (containing business names, license numbers, emails, phone numbers) are stored exclusively in the submitting user's browser localStorage under key `bt_inquiries`. The "Admin panel" reads from the same browser's localStorage — meaning the admin can only see inquiries submitted from that same browser.
- **Exploit Scenario:** This isn't even an attack — it's a fundamental design flaw. No data ever reaches a server. If the user clears their browser data, all inquiries are permanently lost. The admin panel only shows inquiries submitted from the admin's own browser.
- **Business Impact:** The contact/inquiry system is non-functional as a business tool. No inquiries are actually collected centrally. Complete data loss on browser clear.
- **Remediation:** Implement a server-side database (PostgreSQL, Supabase, Firebase, etc.) and API endpoints for form submission and retrieval.
- **Fix Complexity:** High — requires architectural redesign (3-5 days).

#### V-003: Trivially Reversible "Encryption"
- **Attack Type:** Weak Cryptography / Security Through Obscurity
- **Location:** `src/utils/storage.js:1-52`
- **Description:** The `secureSet`/`secureGet` functions use XOR cipher with a key generated from `Math.random().toString(36)` and stored in plaintext in localStorage under `bt_k`. The "encrypted" data is stored in the same localStorage, prefixed with `bt_enc:`. Any script or user with DevTools access can:
  1. Read `localStorage.getItem('bt_k')` to get the key
  2. Decode the Base64 data
  3. XOR with the key to get plaintext JSON
- **Exploit Scenario:** 
  ```javascript
  // Full decryption in DevTools console:
  const key = localStorage.getItem('bt_k');
  const raw = localStorage.getItem('bt_inquiries');
  const encoded = raw.slice(7); // remove 'bt_enc:'
  const decoded = atob(encoded);
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  console.log(JSON.parse(decodeURIComponent(result)));
  ```
- **Business Impact:** All "encrypted" PII (names, emails, license numbers) is trivially accessible. The encryption provides zero actual security.
- **Remediation:** If client-side storage is necessary, use the Web Crypto API with proper AES-GCM encryption. Ideally, move sensitive data to server-side storage.
- **Fix Complexity:** Medium (1-2 days for Web Crypto; included in V-002 fix if moving server-side).

### HIGH Severity

#### V-004: Hardcoded Development Passwords in Production Bundle
- **Attack Type:** Credential Exposure / Information Disclosure
- **Location:** `src/pages/Admin.js:59`, `src/pages/Dashboard.js:16`, `src/pages/Log.js:12`
- **Description:** Development bypass passwords are hardcoded in source:
  - Admin: `"password"` (Admin.js:59)
  - Dashboard: `"420"` (Dashboard.js:16)
  - Log: `"password"` (Log.js:12)
  
  While these bypasses only activate when `process.env.NODE_ENV === 'development'`, the string literals are compiled into the production JavaScript bundle and visible via source inspection or source maps.
- **Exploit Scenario:** Attacker inspects the production JavaScript bundle (or source maps if exposed), discovers the dev passwords. While they won't work directly in production mode, they provide intelligence about password patterns and development practices. Combined with V-001, the admin bypass is trivial anyway.
- **Business Impact:** Credential pattern disclosure. Social engineering ammunition. Indicates weak security culture.
- **Remediation:** Remove all hardcoded passwords. Use environment variables exclusively. Strip dev-only code from production builds.
- **Fix Complexity:** Low (1-2 hours).

#### V-005: Missing Content Security Policy
- **Attack Type:** Missing Security Control / XSS Amplification
- **Location:** `public/_headers`, `public/index.html`
- **Description:** No `Content-Security-Policy` header or meta tag exists anywhere in the application. This means if any XSS vector is found (or introduced via a compromised dependency), the attacker has unrestricted ability to load external scripts, exfiltrate data, and fully control the page.
- **Exploit Scenario:** An XSS payload injected via a compromised npm dependency can load an external script from any domain, which then reads all localStorage data (auth tokens, "encrypted" inquiries, settings) and exfiltrates it.
- **Business Impact:** Amplifies any XSS vulnerability to full application compromise.
- **Remediation:** Add a strict CSP header. Example:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'
  ```
- **Fix Complexity:** Low (1-2 hours with testing).

#### V-006: No Server-Side Token Validation
- **Attack Type:** Broken Authentication / Stateless Token Abuse
- **Location:** `netlify/functions/auth.js`, `src/pages/Admin.js`, `src/pages/Dashboard.js`
- **Description:** The Netlify functions generate cryptographically random tokens on successful authentication, but these tokens are never stored or validated server-side. The client stores them in localStorage, and the React components check only for their existence (or in Admin's case, a specific magic string). There is no token expiration, revocation mechanism, or server-side session state.
- **Exploit Scenario:** A token, once issued, is valid forever. If an attacker obtains a valid token (via XSS, shared computer, shoulder surfing), it can never be revoked. For the Dashboard, any truthy value in `bt_dashboard_token` grants access on page load (line 450-451).
- **Business Impact:** Permanent session compromise. No ability to revoke access.
- **Remediation:** Implement JWT with expiration and server-side validation, or use a session store with token-to-session mapping.
- **Fix Complexity:** High (2-3 days).

#### V-007: CORS Wildcard Fallback
- **Attack Type:** CORS Misconfiguration
- **Location:** `netlify/functions/auth.js:29-35`, identical in `dashboard-auth.js` and `log-auth.js`
- **Description:** The `getAllowedOrigin` function returns `'*'` when `process.env.URL` is not set. On Netlify, the `URL` variable is auto-populated, but if the function is deployed elsewhere (or during a misconfiguration), all origins would be allowed, enabling cross-origin credential attacks.
- **Exploit Scenario:** If `URL` env var is unset, an attacker hosts a malicious page that makes cross-origin POST requests to the auth endpoints, attempting password brute-force from the victim's browser context.
- **Business Impact:** Cross-origin authentication attacks.
- **Remediation:** Never fall back to `'*'`. Use a hardcoded list of allowed origins. Return 403 if origin doesn't match.
- **Fix Complexity:** Low (30 minutes).

#### V-008: Ephemeral Rate Limiting (Serverless Cold Start Reset)
- **Attack Type:** Rate Limiting Bypass
- **Location:** `netlify/functions/auth.js:7-20`, identical in all auth functions
- **Description:** Rate limiting uses an in-memory `Map()` to track failed attempts per IP. Netlify Functions are stateless — each cold start creates a new Map. Under low traffic, functions spin down after ~5-15 minutes. An attacker simply waits for a cold start to reset the rate limiter, or makes requests slow enough to trigger new function instances.
- **Exploit Scenario:** Attacker sends 5 password attempts, waits 15-20 minutes for function cold start, repeats. Over 24 hours: ~480 attempts (far exceeding the intended 5/15min limit). With distributed IPs (proxy rotation), the rate limiter is entirely ineffective.
- **Business Impact:** Password brute-force is feasible against simple passwords.
- **Remediation:** Use a persistent rate limiting store (Redis, DynamoDB, Netlify Blobs) or a WAF-level rate limiter (Cloudflare, AWS WAF).
- **Fix Complexity:** Medium (1-2 days).

#### V-009: No CSRF Protection
- **Attack Type:** Cross-Site Request Forgery
- **Location:** All Netlify function endpoints
- **Description:** The auth endpoints accept POST requests with JSON bodies and have no CSRF token validation. While the `Content-Type: application/json` header provides some implicit protection (it triggers a CORS preflight), the CORS configuration's wildcard fallback (V-007) weakens this defense.
- **Exploit Scenario:** If CORS is misconfigured (V-007), an attacker's webpage can submit authentication requests on behalf of a user visiting the malicious page.
- **Business Impact:** Unauthorized authentication attempts using victim's IP/network context.
- **Remediation:** Implement CSRF tokens or validate the `Origin`/`Referer` headers strictly.
- **Fix Complexity:** Medium (1 day).

### MEDIUM Severity

#### V-010: Console Capture System Exposes Application State
- **Attack Type:** Information Disclosure
- **Location:** `src/utils/consoleCapture.js`, `src/pages/Admin.js` (ConsoleLogsTab), `src/pages/Log.js`
- **Description:** The `initConsoleCapture()` function intercepts all `console.log/warn/error/info` calls and stores them in an in-memory array (up to 500 entries). These logs are viewable on the `/admin` and `/log` routes. The logs may contain sensitive debugging information, error stack traces with file paths, or application state details.
- **Exploit Scenario:** Attacker gains admin access (trivial via V-001), navigates to Console Logs tab, and views captured error messages that may reveal internal application structure, API responses, or sensitive data that was accidentally logged.
- **Business Impact:** Information disclosure aiding further attacks.
- **Remediation:** Disable console capture in production. If needed for debugging, implement it behind a feature flag with proper authentication.
- **Fix Complexity:** Low (1 hour).

#### V-011: Diagnostics Page Probes Auth Endpoints
- **Attack Type:** Information Disclosure / Reconnaissance Tool
- **Location:** `src/pages/Log.js:72-129`
- **Description:** The `/log` diagnostics page includes a "Run Diagnostics" feature that actively probes all auth endpoints with test passwords and reports whether environment variables are configured, whether the endpoint crashes, and timing information. This is essentially a built-in reconnaissance tool.
- **Exploit Scenario:** Attacker accesses `/log` (password `"password"` in dev mode, or brute-forces the simple LOG_PASSWORD), runs diagnostics, and learns: which env vars are set, whether auth functions crash on edge cases, and endpoint response patterns.
- **Business Impact:** Provides attackers with detailed intelligence about server configuration.
- **Remediation:** Remove the diagnostics feature from production builds entirely. Use Netlify's built-in function logs instead.
- **Fix Complexity:** Low (30 minutes).

#### V-012: No Input Sanitization on Contact Form
- **Attack Type:** Stored XSS (Potential) / Data Integrity
- **Location:** `src/pages/Contact.js:18-41`
- **Description:** Contact form fields (businessName, contactName, email, message, licenseNumber) accept arbitrary input with no sanitization or validation beyond HTML5 `required` and `type="email"`. While React's JSX rendering provides automatic XSS escaping for rendered output, the data is stored raw in localStorage and could be dangerous if rendered in a non-React context or if `dangerouslySetInnerHTML` is ever used.
- **Exploit Scenario:** Attacker submits a form with `<script>alert(1)</script>` in the business name. Currently safe due to React's escaping, but a future code change rendering this data via `innerHTML` would create a stored XSS vulnerability.
- **Business Impact:** Low currently (React escapes output), but high risk if rendering approach changes.
- **Remediation:** Sanitize input server-side before storage. Validate field formats (license number format, phone number format). Add length limits.
- **Fix Complexity:** Low (1-2 hours).

#### V-013: Source Map Exposure Risk
- **Attack Type:** Information Disclosure
- **Location:** CRA build configuration
- **Description:** Create React App generates source maps by default in production builds (`GENERATE_SOURCEMAP` defaults to `true`). If deployed without setting `GENERATE_SOURCEMAP=false`, the full original source code (including hardcoded passwords from V-004 and business logic) is accessible by appending `.map` to any JavaScript bundle URL.
- **Exploit Scenario:** Attacker navigates to a JS bundle URL + `.map`, downloads the source map, and reconstructs the entire original source code including all hardcoded values, business logic, and internal comments.
- **Business Impact:** Full source code disclosure. Accelerates all other attacks.
- **Remediation:** Set `GENERATE_SOURCEMAP=false` in the build environment.
- **Fix Complexity:** Trivial (1 minute).

#### V-014: Plaintext Settings Storage
- **Attack Type:** Information Disclosure
- **Location:** `src/pages/Admin.js:633`, `src/pages/Admin.js:644`
- **Description:** Admin settings (`bt_settings`) and profile data (`bt_profile`) are stored in localStorage as plaintext JSON via `JSON.stringify`/`JSON.parse`, bypassing the XOR obfuscation used for inquiry data. While the obfuscation is weak (V-003), using no obfuscation at all is inconsistent and exposes brand profile information.
- **Exploit Scenario:** Any script or user with DevTools access can read `localStorage.getItem('bt_settings')` and `localStorage.getItem('bt_profile')` to see admin configuration and brand details.
- **Business Impact:** Brand configuration and admin preferences disclosed.
- **Remediation:** Use `secureSet`/`secureGet` consistently for all stored data.
- **Fix Complexity:** Low (30 minutes).

#### V-015: 31 Known NPM Dependency Vulnerabilities
- **Attack Type:** Supply Chain / Known CVEs
- **Location:** `package.json`, `node_modules/`
- **Description:** `npm audit` reports 31 vulnerabilities: 1 low, 3 moderate, 27 high. These primarily stem from `react-scripts@5.0.1` and its transitive dependencies (webpack, svgo, postcss, nth-check). Key vulnerable packages include:
  - `svgo` < 2.0.0 (prototype pollution)
  - `webpack` (multiple issues in dev dependency)
  - `postcss` (ReDoS)
  - `nth-check` (ReDoS)
  - `ajv` (ReDoS with `$data` option)
- **Exploit Scenario:** Most of these are build-time/dev dependencies that don't directly affect the production bundle. However, a compromised build pipeline could exploit these during `npm run build`.
- **Business Impact:** Moderate — primarily build-time risk, not runtime.
- **Remediation:** Upgrade `react-scripts` to v6+ or migrate to Vite. Run `npm audit fix` for non-breaking fixes.
- **Fix Complexity:** Medium (2-4 hours for audit fix; 1-2 days for CRA→Vite migration).

### LOW Severity

#### V-016: Deprecated X-XSS-Protection Header
- **Attack Type:** Misconfiguration
- **Location:** `public/_headers:4`
- **Description:** The `X-XSS-Protection: 1; mode=block` header is deprecated and can actually introduce vulnerabilities in some browsers. Modern browsers have removed their XSS auditors. The correct approach is to rely on CSP instead.
- **Remediation:** Remove `X-XSS-Protection` header. Replace with proper CSP (V-005).
- **Fix Complexity:** Trivial.

#### V-017: Predictable Inquiry IDs
- **Attack Type:** Insecure Direct Object Reference (Potential)
- **Location:** `src/pages/Contact.js:21`
- **Description:** Inquiry IDs are generated using `Date.now().toString()`, making them sequential and predictable. While currently inconsequential (data is client-side only), in a future server-side implementation, sequential IDs would enable enumeration attacks.
- **Remediation:** Use `crypto.randomUUID()` or a UUID library for ID generation.
- **Fix Complexity:** Trivial.

#### V-018: No Subresource Integrity (SRI)
- **Attack Type:** Supply Chain
- **Location:** `public/index.html`
- **Description:** While the application doesn't currently load external scripts/styles via CDN, if any are added in the future without `integrity` attributes, a compromised CDN could inject malicious code.
- **Remediation:** Add `integrity` and `crossorigin` attributes to any external resource loads.
- **Fix Complexity:** Trivial.

#### V-019: Hidden Admin Routes Discoverable
- **Attack Type:** Information Disclosure / Reconnaissance
- **Location:** `src/App.js:54-58`
- **Description:** Routes `/admin` and `/log` are not linked in the navigation but are fully functional and discoverable by anyone who inspects the JavaScript bundle or tries common paths.
- **Exploit Scenario:** Attacker navigates to `/admin`, discovers the login page, combines with V-001 to bypass authentication entirely.
- **Business Impact:** Low (security through obscurity is not a valid control).
- **Remediation:** These routes should require proper server-side authentication regardless of discoverability. Fix V-001 and V-006 first.
- **Fix Complexity:** N/A (addressed by fixing V-001 and V-006).

---

## 3. Attack Simulation

### Scenario 1: Complete Admin Takeover (Time to Breach: 30 seconds)

**Attack Chain:** V-001 only (no chaining needed)

1. Attacker navigates to `https://sales.bellatoka.app/admin`
2. Opens browser DevTools (F12)
3. Runs: `localStorage.setItem('bt_admin_token', 'authenticated')`
4. Refreshes the page
5. Full admin access granted

**Assets Compromised:**
- All inquiry data (business names, contact names, emails, phone numbers, license numbers, messages)
- Brand profile configuration
- Admin settings
- Console log history

**Data Exfiltration Potential:** Complete. All data stored in localStorage is accessible.

### Scenario 2: Full Data Extraction Without Admin Access (Time: 2 minutes)

**Attack Chain:** V-003 → V-002

1. Attacker opens DevTools on any page of the site
2. Reads the XOR key: `localStorage.getItem('bt_k')`
3. Reads encrypted inquiries: `localStorage.getItem('bt_inquiries')`
4. Decrypts using the trivial XOR reversal (code in V-003)
5. Exports all PII in plaintext

**Important Note:** Due to V-002 (client-side-only architecture), the attacker can only access data from their own browser session. However, on a shared/public computer, all previously submitted inquiries from that browser are exposed.

### Scenario 3: Persistent Backdoor via XSS + No CSP (Time: 5 minutes)

**Attack Chain:** V-012 → V-005 → V-001 → V-003

1. If a future code change introduces `dangerouslySetInnerHTML` or if a dependency is compromised
2. Attacker submits a contact form with XSS payload in the message field
3. Absence of CSP (V-005) allows the payload to execute without restrictions
4. Payload reads all localStorage keys, decrypts inquiry data, and exfiltrates to attacker-controlled server
5. Payload installs a persistent localStorage entry for ongoing access

### Scenario 4: Brute-Force Dashboard Password (Time: 24-48 hours)

**Attack Chain:** V-008 → V-007

1. Attacker targets `/.netlify/functions/dashboard-auth`
2. Sends 5 password attempts, waits for serverless cold start (~15 min)
3. Repeats across 24 hours (~480 attempts)
4. With IP rotation via proxy list, rate limiting is completely ineffective
5. Simple passwords (like the dev password `"420"`) would be cracked quickly
6. If `URL` env var is unset, CORS allows cross-origin attacks from any domain

---

## 4. Hardening Recommendations

### Immediate Fixes (24-Hour Window)

1. **Fix Admin Auth Bypass (V-001)**
   ```javascript
   // src/pages/Admin.js:858 — Change from:
   if (token === 'authenticated') {
   // To:
   if (token) {
   ```

2. **Add Content Security Policy (V-005)**
   ```
   // public/_headers — Add under /*:
   Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' *.netlify.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
   ```

3. **Remove Deprecated Header (V-016)**
   ```
   // public/_headers — Remove:
   X-XSS-Protection: 1; mode=block
   ```

4. **Disable Source Maps in Production (V-013)**
   ```
   // netlify.toml — Add to build environment:
   GENERATE_SOURCEMAP = "false"
   ```

5. **Fix CORS Wildcard Fallback (V-007)**
   ```javascript
   // In all netlify/functions/*.js:
   function getAllowedOrigin(requestOrigin) {
     const siteUrl = process.env.URL;
     if (!siteUrl) return null; // Return null, handle in headers
     // ... rest of logic
   }
   ```

### Short-Term Fixes (7-Day Window)

6. **Implement Persistent Rate Limiting (V-008)** — Use Netlify Blobs or an external store (Upstash Redis) for rate limit state that persists across cold starts.

7. **Remove Hardcoded Dev Passwords (V-004)** — Extract dev authentication to environment variables:
   ```javascript
   const devPassword = process.env.REACT_APP_DEV_ADMIN_PASSWORD;
   if (isDev && devPassword && password === devPassword) { ... }
   ```

8. **Remove Diagnostics Page from Production (V-011)** — Conditionally render the `/log` route only in development:
   ```javascript
   {process.env.NODE_ENV === 'development' && <Route path="/log" element={<Log />} />}
   ```

9. **Consistent Storage Encryption (V-014)** — Migrate `bt_settings` and `bt_profile` to use `secureSet`/`secureGet`.

10. **Input Validation (V-012)** — Add field-level validation:
    - License number: alphanumeric pattern validation
    - Phone: phone number format
    - All fields: maximum length (e.g., 500 chars for message, 100 for names)

### Long-Term Architectural Improvements

11. **Server-Side Data Storage (V-002)** — Implement a real backend:
    - PostgreSQL or similar database for inquiry storage
    - API endpoints for CRUD operations on inquiries
    - Server-side rendering or API calls for admin data retrieval

12. **Proper Authentication System (V-006)** — Implement:
    - JWT with short expiration (15-30 min) and refresh tokens
    - Server-side session store for token validation
    - Token revocation capability
    - Role-based access control

13. **Migrate Off CRA (V-015)** — Move to Vite for:
    - Faster builds
    - Smaller bundle size
    - Better security update cadence
    - Modern dependency tree

14. **Real Encryption (V-003)** — If client-side storage remains necessary:
    - Use Web Crypto API with AES-256-GCM
    - Derive keys from user password via PBKDF2
    - Never store raw encryption keys in localStorage

### Defensive Monitoring Recommendations

- **WAF Deployment:** Place Cloudflare or AWS WAF in front of the site for DDoS protection, bot mitigation, and request filtering
- **Log Aggregation:** Send Netlify Function logs to a centralized logging service (Datadog, Sentry) for anomaly detection
- **Dependency Scanning:** Enable GitHub Dependabot or Snyk for automated vulnerability alerts on npm dependencies
- **Uptime Monitoring:** Configure health checks for auth endpoints
- **Audit Logging:** Log all authentication attempts (success/failure) with IP, timestamp, and user-agent to a persistent store

---

## 5. Compliance Assessment

### OWASP Top 10 (2021)

| # | Category | Status | Findings |
|---|----------|--------|----------|
| A01 | Broken Access Control | **FAIL** | V-001 (admin bypass), V-006 (no token validation), V-019 (hidden route exposure) |
| A02 | Cryptographic Failures | **FAIL** | V-003 (XOR cipher), V-014 (plaintext storage), V-004 (hardcoded credentials) |
| A03 | Injection | **PARTIAL** | React's JSX escaping prevents most XSS. No server-side injection surface currently (no database). V-012 is a latent risk. |
| A04 | Insecure Design | **FAIL** | V-002 (client-side-only architecture), V-011 (built-in recon tool) |
| A05 | Security Misconfiguration | **FAIL** | V-005 (no CSP), V-007 (CORS wildcard), V-013 (source maps), V-016 (deprecated header) |
| A06 | Vulnerable Components | **FAIL** | V-015 (31 npm vulnerabilities, 27 high) |
| A07 | Auth Failures | **FAIL** | V-001 (magic string bypass), V-006 (no session management), V-008 (bypassable rate limiting) |
| A08 | Data Integrity Failures | **FAIL** | V-002 (client-side data easily modified), no integrity checks on stored data |
| A09 | Logging & Monitoring | **PARTIAL** | Console capture exists (V-010) but is client-side only. No server-side audit logging. |
| A10 | SSRF | **PASS** | No server-side URL fetching. N/A for current architecture. |

**OWASP Compliance: 1/10 categories pass. 1/10 partial. 8/10 fail.**

### SOC 2

| Trust Criteria | Status | Notes |
|---------------|--------|-------|
| Security | **FAIL** | Broken authentication (V-001), no access controls, no encryption |
| Availability | **PARTIAL** | Netlify provides infrastructure availability, but client-side data is ephemeral |
| Processing Integrity | **FAIL** | Data can be modified by any user via DevTools |
| Confidentiality | **FAIL** | PII stored in browser with trivially reversible encryption |
| Privacy | **FAIL** | PII handling violates all data protection principles |

### GDPR (Applicable — site collects EU-accessible PII)

| Requirement | Status | Notes |
|------------|--------|-------|
| Lawful Basis for Processing | **FAIL** | No privacy policy, no consent mechanism, no data processing agreement |
| Data Minimization | **PARTIAL** | Form collects only business-relevant fields, but stores indefinitely |
| Right to Erasure | **FAIL** | No mechanism for data subjects to request deletion (data in random browsers' localStorage) |
| Data Protection by Design | **FAIL** | XOR cipher is not "appropriate technical measures" |
| Breach Notification | **FAIL** | No breach detection capability exists |
| Privacy Policy | **FAIL** | No privacy policy published on the site |

### CCPA (Applicable — California business collecting personal information)

| Requirement | Status | Notes |
|------------|--------|-------|
| Right to Know | **FAIL** | No mechanism to inform consumers what data is collected |
| Right to Delete | **FAIL** | No deletion mechanism |
| Right to Opt-Out | **FAIL** | No opt-out mechanism |
| Privacy Notice | **FAIL** | No California-specific privacy notice |

### PCI DSS

**N/A** — The application does not process, store, or transmit payment card data. No payment functionality exists.

---

## Appendix: Files Audited

| File | Security Relevance |
|------|-------------------|
| `src/pages/Admin.js` | Auth bypass (line 858), hardcoded password (line 59), console log exposure |
| `src/pages/Dashboard.js` | Hardcoded password (line 16), client-side auth check (line 450) |
| `src/pages/Log.js` | Hardcoded password (line 12), endpoint probing tool (lines 72-129) |
| `src/pages/Contact.js` | Client-side-only data storage (lines 26-28), no input validation |
| `src/pages/SalesPage.js` | External links (terpene URLs), PDF document reference |
| `src/utils/storage.js` | XOR encryption with co-located key (entire file) |
| `src/utils/consoleCapture.js` | Console interception and storage (entire file) |
| `src/App.js` | Route definitions including hidden routes |
| `netlify/functions/auth.js` | In-memory rate limiting, CORS wildcard, token generation |
| `netlify/functions/dashboard-auth.js` | Same patterns as auth.js |
| `netlify/functions/log-auth.js` | Same patterns as auth.js |
| `public/_headers` | Security headers (missing CSP, deprecated X-XSS-Protection) |
| `public/index.html` | Meta tags, no CSP meta tag |
| `netlify.toml` | Build config, SPA redirects |
| `package.json` | Dependencies with known vulnerabilities |
