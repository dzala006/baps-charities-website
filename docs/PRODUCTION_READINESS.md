# BAPS Charities Website — Production Readiness Checklist

_Updated: 2026-04-27_

## Status Legend
- [ ] Pending
- [x] Complete
- [~] In Progress

---

## Checklist

- [x] **1. Sentry** — error monitoring, source maps, /sentry-test route
- [x] **2. Stripe production hardening** — idempotency, UNIQUE constraint, Sentry logging
- [x] **3. Mailgun production hardening** — DNS docs, test route
- [x] **4. RLS audit** — script, policy fixes, docs
- [x] **5. Rate limiting** — newsletter 5req/min, Stripe webhook logging
- [x] **6. SEO sanity** — robots, sitemap, noindex on admin/portal
- [ ] **7. Tax receipt PDFs** — US + Canadian formats, portal download
  > Deferred: requires STRIPE_SECRET_KEY to be set. See `docs/DEFERRED_INTEGRATIONS.md` for flip instructions.
- [x] **8. Image optimization** — Next Image, all images use sized containers
  > Lighthouse 90+ score requires manual run on deployed URL — see "What Remains Before Go-Live" below.
- [x] **9. Privacy + Terms** — real text, DRAFT disclaimer
- [x] **10. Backup runbook** — PITR note, restore test docs (`docs/BACKUP_RUNBOOK.md`)
- [ ] **11. Accessibility** — axe AA pass, keyboard nav
  > To run axe: start dev server (`npm run dev`), open any public page in Chrome — axe violations appear in the browser console. Target: zero AA violations before go-live. Manual keyboard nav check: tab through Home and Donate, verify focus is visible and logical. Requires manual browser run — cannot be automated in CI.
- [ ] **12. Cross-browser + mobile** — Safari/Chrome/Firefox
  > Requires manual testing. See checklist in `docs/KNOWN_ISSUES.md`.
- [x] **13. UX polish** — 404, cookie banner, sticky Donate
- [x] **14. /healthz endpoint** — Supabase+Stripe+Mailgun health check
- [x] **15. Final** — all automated items checked, build clean

---

## Production Definition

- All public pages render in <2s
- Donations process end-to-end with tax receipts (US EIN + Canadian CRA formats)
- RLS prevents cross-tenant data leaks (verified table-by-table)
- No critical Sentry errors on next 7 days of staging traffic
- Accessibility passes axe AA on all public pages
- Lighthouse 90+ on Home / Donate / Find-a-Center
- Custom domain DNS staged, ready to flip
- Backup/restore runbook tested once

---

## What Remains Before Go-Live

### Manual steps required
1. **Add env vars to Vercel:** `SUPABASE_SERVICE_ROLE_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
2. **Mailgun DNS:** Add SPF/DKIM/DMARC records per `docs/MAILGUN_DNS.md` (in DEFERRED_INTEGRATIONS.md)
3. **Stripe activation:** Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` + register webhook endpoint in Stripe Dashboard
4. **Accessibility:** Run axe in browser dev tools on all public pages; fix any AA violations
5. **Cross-browser:** Complete browser testing checklist in `docs/KNOWN_ISSUES.md`
6. **Lighthouse:** Run on deployed URL — target 90+ on Home/Donate/Find-a-Center
7. **Backup test:** Run backup → restore → verify row counts per `docs/BACKUP_RUNBOOK.md`
8. **Supabase PITR:** Upgrade to Pro plan to enable Point-in-Time Recovery
9. **Custom domain:** Update `metadataBase` in `app/layout.tsx` and sitemap `BASE` in `app/sitemap.ts` to the real domain
10. **UptimeRobot:** Set up monitor per `docs/MONITORING.md`
11. **Sentry DSN:** Obtain from Sentry project, add to Vercel env vars, verify errors appear in Sentry dashboard
12. **.env.example:** Manually add `SUPABASE_SERVICE_ROLE_KEY` and `UPSTASH_REDIS_REST_URL/TOKEN` lines (file is permission-restricted in CI)

### Docs written
- `docs/PRODUCTION_READINESS.md` — this file
- `docs/DEFERRED_INTEGRATIONS.md` — Stripe/Mailgun/tax receipt flip instructions
- `docs/RLS_POLICIES.md` — database access control policies
- `docs/BACKUP_RUNBOOK.md` — backup and restore procedures
- `docs/MONITORING.md` — UptimeRobot + Sentry setup
- `docs/KNOWN_ISSUES.md` — cross-browser testing checklist
