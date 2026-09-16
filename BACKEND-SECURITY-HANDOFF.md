# Backend Security Handoff — IEEE Al-Azhar API

> Frontend repo: `IEEE-Website` (React SPA, no backend code here).
> The frontend team has **no access** to this API repo, so all items below
> need verification / implementation on the backend side.
> Live API: `https://ieee-alazhar-api.vercel.app` — docs: `/api/docs`.

## P0 — Must verify before next release

### 1. Authorization is client-side only on the frontend
- `src/components/ProtectedRoute.tsx` only checks `better-auth useSession()`
  and redirects to `/login`. There is **no role/admin check** in the SPA.
- **Required on backend:** every state-changing route MUST enforce an
  authenticated admin session server-side, regardless of what the UI does:
  - `POST / PATCH / DELETE /api/v1/board/*`
  - `GET / PATCH / DELETE /api/v1/feedback/*` (list + status + delete)
  - All `/api/v1/admin/forms/*` (CRUD, fields, submissions, export)
- Test with `curl` **without cookies** — all of the above must return
  `401/403`, not data. прямой `curl` today bypasses `ProtectedRoute` entirely.
- Consider an explicit `role: "admin"` claim; plain "logged in" should not
  be enough for board/feedback/forms admin endpoints.

### 2. CSRF / CORS / cookie settings (better-auth)
- Frontend sends `credentials: "include"` on all mutations and
  `credentials: "omit"` on public form fetch/submit (correct).
  There is **no custom CSRF header** from the SPA.
- **Required on backend:**
  - Session cookie: `HttpOnly; Secure; SameSite=Lax` (or `Strict`).
    Do NOT use `SameSite=None` unless cross-site is truly required.
  - CORS: allow only the two frontend origins (prod + preview), and only
    send `Access-Control-Allow-Credentials: true` for those exact origins
    (never `*`).
  - Keep better-auth's built-in CSRF protection enabled; do not disable
    origin checking.
  - Add rate limiting on `/api/auth/*` (login) and public
    `POST /api/v1/forms/:slug/submissions` + `POST /api/v1/feedback`
    (brute-force / spam / ballot-stuffing).

### 3. Auth error messages (user enumeration)
- Frontend now shows a generic "Invalid email or password" on login failure.
- **Required on backend:** login / password-reset responses must NOT
  distinguish "user not found" vs "wrong password" (same message + same
  timing). Generic `401` for both.

### 4. File upload validation (board avatar `avatar` field)
- Frontend now validates `image/*` MIME + 10 MB cap client-side, but this is
  **bypassable with curl** — advisory only.
- **Required on backend:**
  - Verify magic bytes + MIME (`image/jpeg/png/webp`), max size 10 MB
    (or lower, e.g. 2–5 MB), and max dimensions.
  - **Reject SVG** (or sanitize + serve with
    `Content-Type: image/svg+xml` + `Content-Disposition: attachment`,
    never inline HTML-capable content).
  - Store outside webroot / via Cloudinary unsigned preset with
    restrictions; serve avatars with `Content-Disposition: inline` only for
    raster images.
  - `JoinUs` CV upload (when wired): allow only
    `pdf/msword/vnd.openxmlformats-officedocument.wordprocessingml.document`,
    5 MB cap, scan, store outside webroot, serve as `attachment`.

## P1 — Stored-XSS / injection (server is source of truth)

### 5. Sanitize / validate all CMS- and admin-controlled strings
- React escapes text nodes, so the SPA is safe for plain rendering — but the
  API serves other consumers too.
- **Required on backend:** strip HTML/script on write for:
  `event.title/subtitle/venueDetails.note/mapLink/registrationLink`,
  `speaker.*`, board `name/title/bio/social links`, form
  `title/description/field.label/placeholder/helpText/options`,
  feedback `name/email/message`, submissions payloads.
- Enforce length caps (e.g. title ≤ 200, message ≤ 5000, option ≤ 200,
  max N options/fields) to prevent stored-payload bloat.

### 6. URL + slug allowlists
- Frontend now only renders `https:` links and validates slugs against
  `^[a-z0-9-]+$`, but the API must enforce the same:
  - `mapLink`, `registrationLink`, social links: must match `https://`
    (optionally restrict socials to their domains).
  - `coverImage/speaker.photo/memory.photo` URLs: `https://` only.
  - Slugs (`event.slug`, `form.slug`): charset `^[a-z0-9-]+$`, max length,
    unique. Reject `/ ? #` so path injection is impossible.
  - IDs in `/board/:id`, `/feedback/:id`: validate ObjectId/UUID format,
    return `400` on garbage instead of passing to DB.

### 7. Dynamic-form regex safety (ReDoS)
- Frontend now compiles `field.validation.pattern` in `try/catch`, caps
  pattern length (200 chars), and rejects nested quantifiers — but the
  authoritative check is yours.
- **Required on backend:** validate `pattern` at field-creation time
  (compile once, reject invalid / evil patterns such as `(a+)+$`),
  cap pattern length, and **re-run all validations server-side**
  (required, min/max, minLength/maxLength, pattern, date min/max) —
  client checks are bypassable. Never trust `Number()` on dates.

## P2 — Error + header hygiene

### 8. Do not leak internals in API errors
- Frontend now maps errors to generic messages and only shows
  `body.message` for trusted `400` validation cases.
- **Required on backend:** error bodies must never contain `stack`, SQL,
  file paths, or driver errors. Shape: `{ message: "<safe>" }` only.
  Log details server-side with request IDs.

### 9. Security headers on the API origin
- The SPA (Vercel) now sends CSP / `nosniff` / `frame-ancestors` /
  `Referrer-Policy` / `Permissions-Policy` / HSTS. Please mirror on the API:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - No `X-Powered-By` disclosure.

## Acceptance checklist (for backend dev)
- [ ] Unauthenticated `curl` to board/feedback/admin-forms → `401/403`
- [ ] Non-admin session (if roles exist) → `403` on admin routes
- [ ] Login with bad email vs bad password → identical `401` body
- [ ] `POST` avatar with `.svg` / 50 MB / `text/html` → `400/413` rejected
- [ ] `mapLink: "javascript:alert(1)"` rejected at write time
- [ ] `slug: "../../etc"` / `"a/b?c"` rejected at write time
- [ ] `pattern: "(a+)+$"` / invalid regex rejected at field creation
- [ ] Oversized / HTML-containing feedback rejected or sanitized
- [ ] Error for broken request contains no `stack` / path / SQL
- [ ] Rate limit: 10 bad logins → throttled; spam burst to public form → `429`
