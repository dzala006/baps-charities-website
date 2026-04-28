# BAPS Charities Website — Production Readiness Checklist

_Updated: 2026-04-27_

## Status Legend
- [ ] Pending
- [x] Complete
- [~] In Progress

---

## Checklist

- [~] **1. Sentry** — error monitoring, source maps, /sentry-test route
- [ ] **2. Stripe production hardening** — idempotency, UNIQUE constraint, Sentry logging
- [ ] **3. Mailgun production hardening** — DNS docs, test route
- [ ] **4. RLS audit** — script, policy fixes, docs
- [ ] **5. Rate limiting** — newsletter 5req/min, Stripe webhook logging
- [ ] **6. SEO sanity** — robots, sitemap, noindex on admin/portal
- [ ] **7. Tax receipt PDFs** — US + Canadian formats, portal download
- [ ] **8. Image optimization** — Next Image, Lighthouse 90+
- [ ] **9. Privacy + Terms** — real text, DRAFT disclaimer
- [ ] **10. Backup runbook** — PITR note, restore test
- [ ] **11. Accessibility** — axe AA pass, keyboard nav
- [ ] **12. Cross-browser + mobile** — Safari/Chrome/Firefox
- [ ] **13. UX polish** — 404, cookie banner, sticky Donate
- [ ] **14. /healthz endpoint** — Supabase+Stripe+Mailgun health check
- [ ] **15. Final** — all items checked, build clean, Lighthouse screenshots

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
