# Registration Migration — Portal → Website (Design)

**Status:** DRAFT — awaiting user approval before any code is written.
**Phase:** P6-NEW — move public walkathon registration from the portal
to the website behind a feature flag, without disturbing the portal flow
that's currently live.
**Author:** Claude (Opus 4.7), 2026-04-28.
**Audience:** the next session, which will execute steps 2–7 of the
work order once items 1–7 in §13 are confirmed.

---

## 1. Goal

Today the public walkathon registration form lives at
`https://walk2026.na.bapscharities.org/register/[center-slug]` (the
portal). The "Person B" full-product demo wants the registration form
on the BAPS Charities website at
`https://bapscharities.org/register/[center-slug]` so it sits next to
event marketing copy and respects the new IA. Person A demo (internal
walkathon coordinator view) doesn't care where registration lives.

We migrate behind two flags so the cutover is reversible:

| Flag | Repo | Role |
|---|---|---|
| `NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE` | website | Mounts the registration form on the website. |
| `VITE_FEATURE_PUBLIC_REGISTRATION_ON_PORTAL` | portal | When false, portal `/register/*` returns a 301 to the website. Default still **true** today. |

Both default to the Person A configuration (form on portal, website
flag off). To run Person B: flip both flags. To roll back: flip them
back.

---

## 2. Architecture target

```
                                 WALK_REGISTRATIONS
                                 ▲   shared Supabase
                                 │   (single project)
            ┌────────────────────┴────────────────────┐
            │                                         │
            │  website server action                  │  portal Edge Function
            │  (Next.js, Mailgun email)               │  (register-walker)
            │  source = 'website'                     │  source = 'portal'
            │                                         │
   /register/[slug] (NEW)            ───▶───   /register/[slug] (EXISTING)
   anyone, anytime, any browser                redirect target when
                                               PORTAL flag is false
```

Both apps hit the **same** Supabase project — there is one
`walk_registrations` table, one `centers` table, one `walkathons`
table. Coordinators read either one through the same RLS-scoped
dashboard at `/portal/walkathon/registrants`. Provenance is tracked
via a new `source` column.

---

## 3. Migration plan — phased rollout (no in-flight loss)

The whole migration is a flag flip; the dangerous moment is between
"website goes live" and "portal stops serving". To avoid losing or
double-handling registrations during the cutover:

### Phase A — Build, deploy, but keep website flag OFF

- Ship the website registration code with
  `NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=false`.
- The website route returns `notFound()` for everyone.
- Portal continues serving registrations — zero behavior change for
  any user.

### Phase B — Apply DB migration `2210_walk_registrations_source.sql`

- Adds the `source text NOT NULL DEFAULT 'portal'` column with a CHECK
  on the four allowed values.
- Backfill: existing rows → `'portal'` automatically (column default).
- Idempotent (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`).

### Phase C — Flip website flag ON, leave portal flag ON

- Both apps serve the form simultaneously for a short window
  (hours/days, depending on confidence).
- Race condition analysis: a registrant can hit either one. If the
  same email is submitted to both within the cache TTL, the second
  request loses on the DB UNIQUE `(walkathon_id, email)` and is
  surfaced as "already registered" — same UX the portal has today.
- Coordinator dashboard now shows a mix of `source='portal'` and
  `source='website'` rows; both pass the same RLS check.

### Phase D — Flip portal flag OFF

- Portal `/register/*` route now returns a redirect (see §5).
- Any in-flight portal session that already loaded the form will
  successfully POST to the Edge Function (the Edge Function itself is
  not behind the flag — see §6) and complete. Only fresh visits
  redirect.
- Website is the canonical entry. Portal page is a thin redirect.

### Rollback

- Roll back is symmetric: flip portal flag ON (back to serving the
  form), flip website flag OFF. The DB migration stays — the `source`
  column is harmless when only the portal is writing (rows continue to
  default to `'portal'`).
- No data is lost in either direction; both paths feed the same table.

### What the design explicitly does NOT do

- It does **not** remove the portal `Register.tsx` component, the
  portal `/register/*` routes, or the `register-walker` Edge Function.
  Those stay deployed. The flag controls whether the portal route
  *renders the form* vs. *renders a redirect*.
- It does **not** change `walk_registrations` columns beyond adding
  `source`. No schema break.
- It does **not** touch the coordinator dashboard's RLS — the dashboard
  already filters by `can_user_edit('center', center_id)`, which is
  source-agnostic.

---

## 4. URL strategy

### 4.1 Path layout

| Surface | Path | Behavior with both flags off (Person A default) | Behavior with website flag on (Person B) |
|---|---|---|---|
| Marketing landing | `bapscharities.org/events/walk-run-2026/[city]` | Today's page (no Register button) | Adds prominent Register button → website `/register/[centerSlug]` |
| Public form | `bapscharities.org/register/[centerSlug]` | `notFound()` (Next.js 404) | Renders the form |
| Confirmation | `bapscharities.org/register/[centerSlug]/confirmed?id=...` | 404 | Renders post-submit confirmation |
| Already-registered | `bapscharities.org/register/[centerSlug]/already-registered` | 404 | Renders "we already have a registration for this email" page |
| Portal entry (legacy) | `walk2026.na.bapscharities.org/register/[slug]` | Renders the form (today's behavior) | 301 to website (only when portal flag is **false**) |

### 4.2 Center slug → URL

The website page expects a `centerSlug`. The portal already uses the
same `centers.slug` value (e.g. `atlanta`, `parsippany`,
`robbinsville`). Because both apps read the same `centers` table,
slugs are identical — no translation is needed. The website's existing
`/centers/[slug]` route already proves this works.

### 4.3 City pages have a Register button

`app/events/walk-run-2026/[city]/page.tsx` currently renders a
hardcoded button to `https://walk2026.na.bapscharities.org`. The
migration replaces that hardcoded URL with a flag-aware link:

```tsx
const registerHref = FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE
  ? `/register/${city.slug}` // assumes city.slug == center.slug; see §4.4
  : (city.registration_url ?? 'https://walk2026.na.bapscharities.org')
```

When the flag is off, the button looks the same as today (cross-domain
to the portal). When the flag is on, the button is in-site.

If `FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=false`, the existing
hardcoded buttons in `WalkContent.tsx` and `centers/[slug]/page.tsx`
also remain intact (they fall through to the same `else` branch).

### 4.4 Multi-center cities — out of scope for P6-NEW

Some cities cover multiple centers (NJ, NY, TX, CA). The original P6
design proposed a `walk_cities.center_slugs jsonb` column for this;
that column was never created. P6-NEW assumes 1:1 city-to-center
mapping, which holds for the seeded `walk_cities` rows today
(`registration_url` already encodes the deep link). Multi-center
selectors are deferred to **P7-MULTI-CENTER**, tracked in
`docs/DEFERRED_INTEGRATIONS.md` after this migration ships.

---

## 5. Portal redirect — the 301 problem

The portal is a Vite SPA. React Router cannot return an HTTP 301 from
the client — `<Navigate>` only changes the in-app history. For SEO
and crawler hygiene we want a real 301 (so `walk2026.na.bapscharities.org/register/atlanta`
permanently points to `bapscharities.org/register/atlanta`).

### 5.1 Recommended: `vercel.json` redirects (production)

Add to the **portal** `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/register/:slug",
      "destination": "https://bapscharities.org/register/:slug",
      "permanent": true,
      "has": [
        { "type": "header", "key": "x-portal-public-registration", "value": "off" }
      ]
    }
  ]
}
```

…but Vercel rewrite/redirect conditions can't directly read a Vite
build-time env var, so we instead use a **build-time conditional**:
the Vercel build script picks one of two `vercel.json` flavors based
on the `VITE_FEATURE_PUBLIC_REGISTRATION_ON_PORTAL` env var, OR we
embed the redirect rule unconditionally and gate at the application
layer for dev. Two options:

| Option | Production 301? | Dev parity? | Verdict |
|---|---|---|---|
| **A.** Static `vercel.json` redirects always on, `Register.tsx` checks the flag and re-renders form when flag is true | Always 301 if user hits `/register/*`. Form is never delivered from `walk2026.*` to anon visitors. | Dev `npm run dev` ignores `vercel.json`; flag-on serves form, flag-off serves a `<RegisterRedirect>` component that calls `window.location.replace`. | ✅ if we accept that `vercel.json` 301 trumps the flag in production. |
| **B.** Build script copies one of two `vercel.json` files (`vercel.redirect.json` vs `vercel.no-redirect.json`) based on env | Conditional 301. | Same dev fallback. | ❌ Adds build-script complexity; redirect state is non-obvious in the repo. |
| **C.** Every visit to `/register/*` renders a small client-side component that reads the flag and either shows the form or `window.location.replace`s. No `vercel.json` redirect. | Never a real 301 — only a 200 + JS redirect. SEO-imperfect. | Same in dev and prod. | ❌ Browsers and crawlers see a 200 first; not what we want when portal stops being canonical. |

**Recommendation: Option A.** When the user decides to flip the
portal flag to `false`, they're committing to "portal is no longer the
canonical registration surface." The static `vercel.json` redirect
captures that commitment cleanly. The application-layer fallback
handles dev. The flag continues to gate dev/preview behavior so the
toggle is still meaningful locally.

For dev / `npm run dev`, the application gate is:

```tsx
// portal src/App.tsx (P-INTERIM-FIX already wired the routes)
{
  path: '/register/:centerSlug',
  element: gate(
    FEATURE_PUBLIC_REGISTRATION_ON_PORTAL,
    <Register />,
    `${WEBSITE_URL}/register/${... slug ...}`,  // see below
  ),
},
```

Because `<Navigate>` in React Router doesn't redirect to external URLs
(it builds an in-app path), we'll add a tiny helper component
`<ExternalRedirect>` that reads `useParams` and calls
`window.location.replace`. This is a 200+JS redirect (acceptable for
dev), and the production 301 is handled by `vercel.json`.

### 5.2 `VITE_WEBSITE_URL` env

Add `VITE_WEBSITE_URL` to portal `.env.example`:

```
# When portal-public-registration flag is false, /register/* redirects here.
VITE_WEBSITE_URL=https://bapscharities.org
```

Default empty — the redirect target falls back to
`https://bapscharities.org` if unset.

---

## 6. Server action vs Edge Function — single source of truth

Two valid implementation paths for the website's POST handler:

### 6.1 Path α — Website calls existing `register-walker` Edge Function

Pros:
- Zero duplicate logic. COPPA validation, Turnstile verify,
  idempotency cache, source-of-truth INSERT all stay in one place.
- DB-side CHECK constraints + RLS are the only authoritative gate;
  whatever calls the Edge Function gets the same answer.
- Email continues going through `send-email` Edge Function (Resend).
- Adding a `source: 'website'` field to the request body is a
  one-liner.

Cons:
- Email goes via Resend, **not** Mailgun. Mismatch with the work
  order's "website version sends via Mailgun." 
- Cross-app HTTP hop adds ~100ms latency (Vercel → Supabase Edge).
- The website becomes dependent on a portal-owned Edge Function.

### 6.2 Path β — Website server action does its own insert + Mailgun email

Pros:
- Email goes via Mailgun (matches work order).
- Simpler topology: website → Supabase directly, no Edge Function hop.
- Website team owns the full path.

Cons:
- COPPA logic, Turnstile verification, slug resolution, idempotency
  cache must be **duplicated** in the server action. Drift risk is
  real (the original P6 design notes COPPA non-compliance as
  catastrophic — see `~/baps-walkathon-portal/docs/REGISTRATION_DESIGN.md` §15).
- Two confirmation-email templates to maintain (Resend HTML + Mailgun
  HTML).
- Stripe upgrade path later requires implementing it twice.

### 6.3 Recommendation: hybrid

Implement **Path β**, but lift the COPPA and validation logic into a
shared TypeScript module under `~/baps-charities-website/app/lib/registrationValidation.ts`
that:

- Runs the same age-classification function as the portal.
- Validates the same field set.
- Computes `age_group`, guardian-fields-required, two-checkbox-required-for-under-13.
- Has unit-test parity with the portal's `Register.tsx`'s `validateForm`
  (literally copy the test cases).

The DB CHECK constraint on `walk_registrations` is the
non-bypassable backstop — even if drift occurs, Postgres rejects.

Confirmation email goes through Mailgun (matches work order). The
template HTML is copied from the portal's `register-walker/index.ts`
`renderConfirmationHtml` and adapted. Subject line stays
`Your BAPS Walk 2026 registration is confirmed`.

This is a STOP CONDITION trigger — see §11.

---

## 7. SEO

The website's `/register/[centerSlug]` is transactional and should
not be indexed.

```tsx
// app/register/[centerSlug]/page.tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Register — BAPS Walkathon',
}
```

Same for `/confirmed` and `/already-registered`.

The marketing pages (`/events/walk-run-2026/[city]`) stay indexable —
they're discovery surfaces. Only the form-and-receipt funnel is
noindex.

After Phase D (portal flag off), the portal `/register/*` returns a
permanent 301 — search engines will redistribute any backlinks
pointing at the portal to the website over time. We don't currently
list the portal `/register/*` URL in any sitemap, so there's nothing
to remove.

---

## 8. Email — Mailgun

The website already has Mailgun wired for the newsletter. From
`app/api/newsletter/route.ts`:

```ts
const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN
if (!apiKey || !domain) {
  console.log(`[newsletter] Mailgun not configured — skipping email to ${email}`)
}
await fetch(`https://api.mailgun.net/v3/${domain}/messages`, ...)
```

### 8.1 Re-use the same pattern

Add `app/lib/mailgun.ts` exporting `sendMailgunEmail({ to, subject, html, replyTo? })`.
The newsletter route refactors to call this helper too — single Mailgun
integration.

### 8.2 Confirmation template

Copy the portal's `renderConfirmationHtml` from
`~/baps-walkathon-portal/supabase/functions/register-walker/index.ts`
into `app/lib/walkRegistrationEmail.ts`. Adapt the brand colors to
match the website's color palette (`#8E191D` red instead of `#D97706`
orange — the portal still uses the legacy orange).

### 8.3 SPF/DKIM/DMARC

Mailgun for `bapscharities.org` is already configured (newsletter
works). No DNS changes needed. The portal's Resend sender uses a
different sender domain (`walk2026.na.bapscharities.org`) and is
unrelated.

### 8.4 Activation runbook

Add `~/baps-charities-website/docs/MAILGUN_ACTIVATION_RUNBOOK.md` (new)
with:

1. Verify `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` Vercel env vars set.
2. Send test registration; confirm email arrives.
3. Check Mailgun logs for delivery rate.

If Mailgun isn't configured at production deploy time, the website
follows the same fallback pattern as newsletter: log the email and
proceed. Document this in `docs/DEFERRED_INTEGRATIONS.md`.

---

## 9. Captcha — keep Turnstile, not hCaptcha

The work order says hCaptcha. The portal currently uses Cloudflare
Turnstile (which the portal's REGISTRATION_DESIGN.md §10 picked
deliberately over hCaptcha for GDPR + UX reasons). Switching to
hCaptcha on the website only would mean:

- Two captcha providers to maintain (operational drag).
- Different UX (image puzzles on website, invisible challenge on portal).
- Different env vars and DNS setup per provider.

**Recommendation: use Turnstile on the website too.** Add
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to website
env. Verify token in the server action via the same
`siteverify` endpoint the Edge Function uses today.

If the user prefers hCaptcha specifically, we'll add it; flagged in
§13.

---

## 10. Coordinator dashboard — surface `source`

`/portal/walkathon/registrants` (which is the existing
`/portal/center/registrations` route — P5.5-FRAME hasn't renamed it
yet) reads `walk_registrations` via Supabase client with RLS-scoped
SELECT. It already shows participant_name, email (PII-tiered),
shirt_size, age_group, fundraising_target, payment_status,
shirt_received toggle.

Migration adds:

- A "Source" column showing a small badge — `via portal` (light
  background) or `via website` (primary background) — for easy
  spot-checking during the rollout window.
- The badge is non-functional UI; just provenance.

The RLS policy (`walk_reg_auth_select USING can_user_edit('center', center_id)`)
is **source-independent**. Coordinators see all rows for centers they
own, regardless of where the row came from. Cross-app read-after-write
is enforced by Supabase replication of the single project — no
eventual consistency.

---

## 11. STOP CONDITIONS — items requiring user sign-off

> **STOP — confirm before code.**
>
> 1. **Server action vs Edge Function (§6).** The work order specifies
>    "server action inserts walk_registrations with payment_status='free'
>    and source='website'" → Path β (website does its own insert +
>    Mailgun). This is what's specced. Confirming we accept the
>    duplicated COPPA logic risk, mitigated by the shared validation
>    module + DB CHECK constraint. **Decision needed.**
>
> 2. **Captcha provider (§9).** Work order says hCaptcha, recommendation
>    is Turnstile (parity with portal). **Decision needed.**
>
> 3. **`source` column addition.** Migration `2210_walk_registrations_source.sql`
>    adds `source text NOT NULL DEFAULT 'portal' CHECK (source IN
>    ('portal','website','admin','import'))`. Idempotent
>    (`ADD COLUMN IF NOT EXISTS`). **Confirm scope OK.**
>
> 4. **Portal redirect mechanism (§5).** Recommendation: static
>    `vercel.json` 301 + dev application gate. Alternative B (build-script
>    swap of vercel.json) was considered and rejected. **Confirm OK.**
>
> 5. **City→center mapping for marketing pages (§4.4).** Assume 1:1 in
>    P6-NEW; defer multi-center selectors to P7. **Confirm scope.**
>
> 6. **Email branding (§8.2).** Confirmation email re-themes to website
>    colors (`#8E191D` red, font stack). Different from portal's
>    confirmation email which stays orange. **Confirm OK or unify
>    branding.**
>
> 7. **Mailgun degraded mode (§8.4).** When Mailgun keys are missing,
>    the website logs and proceeds (registration row still inserted,
>    just no email sent). Same as newsletter today. **Confirm
>    acceptable for production registration emails, or block-on-no-key.**

If any answer above is uncertain, the implementation pauses.

---

## 12. COPPA parity check (STOP gate)

The work order explicitly lists "COPPA logic differs between portal
and website implementations → STOP and align before continuing" as a
hard stop. Before code:

| Rule | Portal source | Website source (proposed) |
|---|---|---|
| Age classification (`adult` / `youth` / `child`) | `~/baps-walkathon-portal/src/pages/Register.tsx:81–97` (`ageFromDob` + `classifyMinor`) | Copy verbatim into `~/baps-charities-website/app/lib/registrationValidation.ts`. Unit-test parity. |
| Under-18 reveal of guardian fields | Portal logic at lines 184–185 (`isMinor`, `isUnder13`) | Same logic, same flag wiring. |
| Under-13 dual-checkbox banner | Portal `Register.tsx` lines 460–489 with privacy-policy link to `/portal/legal/privacy` | Website version links to `bapscharities.org/privacy` (the existing public privacy policy at `app/privacy/page.tsx`); **the privacy page must already cover under-13 data collection — confirm before launch.** |
| DB CHECK constraint | `walk_reg_minor_requires_guardian` on `walk_registrations` (migration 2200) | Unchanged — same DB. The website inherits the constraint for free. |
| "Manage this registration" tokenized link | Portal P6 deferred to P7 (per `REGISTRATION_DESIGN.md` §13.5) | Same deferral. Coordinator-mediated deletion path remains. |

**Action item before code:** read
`~/baps-charities-website/app/privacy/page.tsx` and confirm it covers
the five COPPA pillars. If not, the privacy update lands in this
phase, **before** the form goes live. (The portal's
`docs/PRIVACY.md` covers it; the website's may not yet.)

---

## 13. Open questions / required confirmations

Numbered for easy reply:

1. **Server action vs Edge Function** — accept Path β (work order
   spec)? §6, §11.1.
2. **Captcha provider** — Turnstile (recommended, parity with portal)
   or hCaptcha (work order spec)? §9, §11.2.
3. **`source` column addition** — migration `2210` OK as designed?
   §3, §11.3.
4. **Portal redirect mechanism** — static `vercel.json` 301 +
   application-gate dev fallback (Option A in §5.1)? §11.4.
5. **Multi-center cities** — defer to P7? §4.4, §11.5.
6. **Email branding** — re-themed to website colors, or unified
   branding across both? §8.2, §11.6.
7. **Mailgun missing-key fallback** — log-and-proceed, or
   block-and-retry? §8.4, §11.7.
8. **Privacy page coverage of COPPA** — confirm
   `~/baps-charities-website/app/privacy/page.tsx` already covers the
   five pillars, or schedule a privacy update inside this phase. §12.
9. **`bapscharities.org` apex domain** — confirm production website
   serves at this exact origin, so the portal redirect target and
   `metadata.alternates.canonical` URLs are correct. (The
   `app/events/walk-run-2026/[city]/page.tsx` currently uses
   `https://baps-charities-website.vercel.app` as the canonical;
   needs aligning before P6-NEW ships.)

Items 1–4 are blockers. Items 5–9 should be resolved before that
subsection of work begins but won't block scaffolding.

---

## 14. File plan (what gets written when work resumes)

### Website repo (`~/baps-charities-website`)

| Path | Status | Notes |
|---|---|---|
| `app/lib/registrationValidation.ts` | new | Shared age/COPPA logic, lifted from portal `Register.tsx`. |
| `app/lib/mailgun.ts` | new | Mailgun helper (refactored from `app/api/newsletter/route.ts`). |
| `app/lib/walkRegistrationEmail.ts` | new | HTML template, themed for website. |
| `app/register/[centerSlug]/page.tsx` | new | Form (server-rendered shell + client form). Gated by flag → `notFound()` when off. |
| `app/register/[centerSlug]/actions.ts` | new | Server action: validate → captcha verify → insert → email → return id. |
| `app/register/[centerSlug]/confirmed/page.tsx` | new | Post-submit confirmation. |
| `app/register/[centerSlug]/already-registered/page.tsx` | new | Duplicate-email landing. |
| `app/events/walk-run-2026/[city]/page.tsx` | modify | Register button reads flag. |
| `app/events/walk-run-2026/WalkContent.tsx` | modify | Same. |
| `app/centers/[slug]/page.tsx` | modify | Same. |
| `docs/REGISTRATION_TESTING_WEBSITE.md` | new | Local end-to-end results (work-order step 7). |
| `docs/MAILGUN_ACTIVATION_RUNBOOK.md` | new | Activation steps + degraded-mode behavior. |
| `docs/DEFERRED_INTEGRATIONS.md` | append | Note Mailgun production setup, multi-center selectors. |
| `app/lib/featureFlags.ts` | already exists | `FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE` already wired by P-INTERIM. |

### Portal repo (`~/baps-walkathon-portal`)

| Path | Status | Notes |
|---|---|---|
| `vercel.json` | modify | Add `redirects[]` rule for `/register/:slug`. Always-on in production; activates only when portal env doesn't override. (See §5.1 Option A.) |
| `src/components/ExternalRedirect.tsx` | new | Tiny `useEffect → window.location.replace` helper for dev fallback when portal flag is off. |
| `src/App.tsx` | modify | Replace the existing `<Register />` route element with `gate(FEATURE_PUBLIC_REGISTRATION_ON_PORTAL, <Register />, <ExternalRedirect base={WEBSITE_URL} suffix="/register" />)`. |
| `.env.example` | append | `VITE_WEBSITE_URL=` with empty default. |
| `docs/FEATURE_FLAGS.md` | modify | Document the portal-flag-off behavior. |

### Shared (database)

| Path | Status | Notes |
|---|---|---|
| `~/baps-walkathon-portal/supabase/migrations/2210_walk_registrations_source.sql` | new | Idempotent ADD COLUMN, CHECK, default `'portal'`. |
| `~/baps-walkathon-portal/docs/SCHEMA.md` | modify | Update §23 (walk_registrations) to include the `source` column. |

---

## 15. Tests planned

### 15.1 Website unit tests — `app/register/[centerSlug]/page.test.tsx`

- Adult happy path: form renders, server action inserts, redirect to /confirmed.
- Minor (DOB age 12): guardian fields render, COPPA banner visible.
- Minor without guardian fields: server action returns validation error.
- Duplicate email: server action returns "already registered", redirects to /already-registered.
- Flag off: route returns 404 (notFound).

### 15.2 Website e2e — `e2e/register-website.spec.ts` (new test dir if needed)

- Navigate to `/register/atlanta` → form mounts.
- Submit valid registration → confirmation page.
- `/events/walk-run-2026/atlanta` → Register button visible (with flag on).

### 15.3 Portal e2e — `tests/e2e/portal-register-redirect.spec.ts` (new)

- With portal flag off (env override at dev-server start),
  `/register/atlanta` → external redirect to `${VITE_WEBSITE_URL}/register/atlanta`.
- With portal flag on, `/register/atlanta` → form renders (today's behavior).

### 15.4 Cross-app data flow — manual + tracked in `REGISTRATION_TESTING_WEBSITE.md`

- Register on website → row appears in portal coordinator dashboard
  with `source='website'` badge.
- Register on portal → row appears with `source='portal'` badge.
- Same email submitted to both (race-condition smoke) → second submit
  → "already registered."

### 15.5 RLS

No new RLS test — existing `tests/rls/walk_registrations.test.ts` (if
it exists, otherwise `tests/rls/rls.test.ts`) already verifies that
`anon INSERT` works and `authenticated SELECT` is `can_user_edit`-scoped.
The new `source` column has no RLS implications.

---

## 16. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| COPPA logic drift between portal and website | Medium | Catastrophic | Shared validation module (§6.3) + DB CHECK + parity test |
| Portal redirect breaks SEO during cutover | Low | Medium | `vercel.json` 301 (proper signal); portal `/register/*` was never sitemapped |
| Mailgun missing in production | Medium | Medium | Log-and-proceed fallback (§8.4); MAILGUN_ACTIVATION_RUNBOOK gates production cutover |
| Cross-app dupe race during Phase C | Low | Low | DB UNIQUE constraint already returns 23505 → friendly error |
| Multi-center city user picks wrong center | Medium | Low | Person A demo doesn't see this surface; defer to P7 |
| Privacy page on website doesn't cover under-13 yet | Unknown | Catastrophic | §13.8 — read and confirm before code, otherwise add update to phase scope |

---

## 17. Out of scope (explicit)

- Multi-center city selectors (P7-MULTI-CENTER).
- Stripe activation on the website (still gated by `STRIPE_SECRET_KEY`,
  same path as portal).
- Migration of the coordinator dashboard from `/portal/center/registrations`
  to `/portal/walkathon/registrants` (P5.5-RENAME).
- Fundraising-page public surface (P7+).
- Removing the portal `Register.tsx` component (only de-prioritizing it
  via flag; deletion is a future cleanup phase).
- Native mobile registration app (never).

---

## 18. Acceptance criteria (P6-NEW result == GREEN)

- [ ] Migration `2210_walk_registrations_source.sql` applied; `source`
      column live with `'portal'` backfill.
- [ ] Website `/register/[centerSlug]` renders for all seeded center
      slugs when flag on; returns `notFound()` when flag off.
- [ ] Adult happy path on website: register → row in DB with
      `source='website'` → confirmation email sent (or logged if Mailgun
      missing) → confirmation page renders.
- [ ] Minor + guardian path: COPPA logic matches portal byte-for-byte
      (parity test passes).
- [ ] Duplicate email on website: redirects to /already-registered.
- [ ] Portal `/register/*` with portal flag off: redirects to website
      (301 in production via vercel.json; dev fallback via
      ExternalRedirect).
- [ ] Coordinator dashboard shows mixed-source rows; "Source" badge
      visible per row.
- [ ] City pages: Register button visible only when website flag is on,
      links to website route.
- [ ] All flag combinations from work-order step 7 verified and
      documented in `REGISTRATION_TESTING_WEBSITE.md`.
- [ ] No new lint errors; existing 305 portal unit tests still pass;
      website lint clean.

---

## STOP — design ready for review

Engineering has paused per the work-order's "STOP after design doc for
user review" instruction. Please respond with:

- ✓ for items 1–9 in §13 you accept as proposed, or
- ✗ + replacement direction for any you want changed.

After your reply, the next step is the migration in §3 Phase B —
applied via the Supabase MCP — followed by the website registration
page, server action, and email helper. No code is being written until
items 1–4 (blockers) and item 8 (COPPA privacy-page coverage) are
confirmed.
