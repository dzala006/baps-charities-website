# Walkathon Registration — Website Testing Matrix

Local end-to-end checks for P6-NEW. Run against the website at
`localhost:3000` and the portal at `localhost:5173` simultaneously
(both point at the shared Supabase project — see
`~/baps-walkathon-portal/CLAUDE.md`).

## Setup

```sh
# Website (Next.js)
cd ~/baps-charities-website
NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=true \
TURNSTILE_DEV_BYPASS=true \
npm run dev    # → http://localhost:3000

# Portal (Vite SPA) — separate terminal
cd ~/baps-walkathon-portal
npm run dev    # → http://localhost:5173 (default flags = Person A)
```

Optional Mailgun: set `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` in
website `.env.local` to send real emails. Without them, the server
action logs `[mailgun] ... — skipping email` and the row still gets
inserted (registration completes).

## Test matrix — fill in pass/fail per row

### A. `NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=true` (website hosts form)

| # | Scenario | Expected | Actual | Pass? |
|---|---|---|---|:---:|
| A1 | `localhost:3000/register/atlanta` | Form renders with Atlanta name + walk date | | |
| A2 | A1 → register adult (DOB ≥18 yrs ago) | Redirect to `/register/atlanta/confirmed?id=…` | | |
| A3 | After A2: portal `localhost:5173` → coord_atlanta logs in → `/portal/center/registrations` | New row visible with **via website** badge | | |
| A4 | A1 → submit same email twice (re-submit form) | Redirect to `/register/atlanta/already-registered` | | |
| A5 | A1 → register a minor (DOB age 12) | Form reveals Guardian fields + COPPA banner with two checkboxes | | |
| A6 | A5 → submit with COPPA boxes ticked | Confirmed page; coordinator dashboard shows registration with guardian name visible | | |
| A7 | A5 → submit without COPPA boxes ticked | Form blocks submit with field-level errors; no DB row | | |
| A8 | `localhost:3000/events/walk-run-2026/atlanta` | "Register Now →" button visible, links to `/register/atlanta` (in-site, no `target=_blank`) | | |
| A9 | `localhost:3000/centers/atlanta-shanti-mandir` (or a real seeded center slug) | "Register Now →" links to `/register/<that-slug>` | | |

### B. `NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=false` (default)

| # | Scenario | Expected | Actual | Pass? |
|---|---|---|---|:---:|
| B1 | `localhost:3000/register/atlanta` | Next.js 404 (not-found page) | | |
| B2 | `localhost:3000/register/atlanta/confirmed` | 404 | | |
| B3 | `localhost:3000/register/atlanta/already-registered` | 404 | | |
| B4 | `localhost:3000/events/walk-run-2026/atlanta` | "Register Now" button still visible but points to `walk2026.na.bapscharities.org` (cross-domain, opens in new tab) | | |
| B5 | `localhost:3000/centers/<seeded-slug>` | "Register Now" → `walk2026.na.bapscharities.org` | | |

### C. `VITE_FEATURE_PUBLIC_REGISTRATION_ON_PORTAL=true` (default — portal hosts form)

| # | Scenario | Expected | Actual | Pass? |
|---|---|---|---|:---:|
| C1 | `localhost:5173/register/atlanta` | Portal `<Register>` form renders (today's behavior) | | |
| C2 | C1 → submit valid registration | Redirect to `localhost:5173/register/atlanta/confirmed?...` | | |
| C3 | After C2: portal coord dashboard | Row visible with **via portal** badge | | |

### D. `VITE_FEATURE_PUBLIC_REGISTRATION_ON_PORTAL=false` + website flag on (Person B cutover)

| # | Scenario | Expected | Actual | Pass? |
|---|---|---|---|:---:|
| D1 | Restart portal dev with `VITE_FEATURE_PUBLIC_REGISTRATION_ON_PORTAL=false VITE_WEBSITE_URL=http://localhost:3000 npm run dev` | New URL printed | | |
| D2 | `localhost:5173/register/atlanta` | Page shows "Redirecting…" then `window.location.replace`s to `localhost:3000/register/atlanta` | | |
| D3 | `localhost:5173/register/atlanta/confirmed` | Same — redirects to `localhost:3000/register/atlanta/confirmed` | | |
| D4 | Production smoke (after Phase D activation per `~/baps-walkathon-portal/docs/PORTAL_REDIRECT_ACTIVATION.md`): `curl -I https://walk2026.na.bapscharities.org/register/atlanta` | 301 (or 308) with `Location: https://bapscharities.org/register/atlanta` — edge-level redirect, never hits the SPA | | |

### E. Cross-app data flow

| # | Scenario | Expected | Actual | Pass? |
|---|---|---|---|:---:|
| E1 | Register on website (A2) and portal (C2) using DIFFERENT emails for the same center | Both rows appear in coordinator dashboard with respective source badges | | |
| E2 | Register on website with email X, then attempt portal registration with email X | Portal returns `409 / "already registered"` (DB UNIQUE) | | |
| E3 | RLS check: coord_atlanta sees Atlanta rows only — does NOT see Houston rows | Confirmed via dashboard for both source values | | |

### F. SEO

| # | Scenario | Expected | Actual | Pass? |
|---|---|---|---|:---:|
| F1 | View source on `localhost:3000/register/atlanta` | `<meta name="robots" content="noindex,nofollow">` present | | |
| F2 | View source on `/register/atlanta/confirmed` | Same noindex meta | | |
| F3 | View source on `/events/walk-run-2026/atlanta` | NO noindex (marketing page is indexable) | | |

## Known caveats

- The website `confirmed` page does not currently fetch the registration
  row to display walker details — it shows a generic "you're registered"
  message. Adding the fetch is a polish item for a later phase
  (the email contains the details).
- `MAILGUN_API_KEY` missing in dev → registration completes silently
  without an email. Documented behavior per
  `docs/MAILGUN_ACTIVATION_RUNBOOK.md`.
- Center slug matching the city slug holds for the seeded data today;
  multi-center cities (NJ/NY/TX/CA where multiple centers cover one
  city) will need a picker added in P7-MULTI-CENTER. For now,
  `/events/walk-run-2026/atlanta` → `/register/atlanta` works because
  Atlanta is 1:1.

## Filling this matrix

Each session that runs the matrix should append a dated section at the
bottom with the actual results, leaving the master matrix above
untouched as a reference. Example heading:

```
## Run 2026-04-29 (developer initials)

| # | Pass? | Notes |
| A1 | ✓ | |
| A2 | ✓ | row id e8a4… |
| ... |
```
