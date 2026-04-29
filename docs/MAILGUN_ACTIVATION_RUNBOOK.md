# Mailgun Activation Runbook

The website uses Mailgun for two transactional flows:

1. Newsletter welcome (`app/api/newsletter/route.ts`).
2. Walkathon registration confirmation (`app/register/[centerSlug]/actions.ts`).

Both share `app/lib/mailgun.ts`. When keys are missing, both flows
log loudly and proceed without sending — the user-facing operation
(subscription / registration row insert) still completes.

## Required environment

| Var | Where set | Notes |
|---|---|---|
| `MAILGUN_API_KEY` | Vercel Project Settings → Environment Variables (Production + Preview) | Mailgun → Sending → API Keys → "Mailgun API key" |
| `MAILGUN_DOMAIN` | Same | Verified sending domain, e.g. `mg.bapscharities.org` |

`From` header is hardcoded as `BAPS Charities <noreply@${MAILGUN_DOMAIN}>`.

## Activation steps (one-time)

1. **Verify the sending domain in Mailgun**: add the four DNS records
   (SPF TXT, DKIM TXT, MX record, MX record) per Mailgun's guide. Use
   the `mg.` subdomain to keep marketing email separate from
   transactional.

2. **Confirm DNS propagation** in Mailgun's control panel — all rows
   should turn green.

3. **Set Vercel env vars** for both Production and Preview
   environments. Redeploy.

4. **Smoke test newsletter**: subscribe with a test email; check
   inbox.

5. **Smoke test registration**: complete the matrix in
   `docs/REGISTRATION_TESTING_WEBSITE.md` rows A2 / A6 with a real
   email; confirm receipt.

6. **Set up Mailgun webhooks** (optional, recommended): bounce +
   complaint webhooks pointed at a future endpoint. Out of scope for
   P6-NEW.

## Degraded-mode behavior

When `MAILGUN_API_KEY` or `MAILGUN_DOMAIN` is missing:

- Newsletter route logs `[newsletter] Mailgun not configured —
  skipping email to <addr>`. Subscription row still inserted.
- Registration server action logs `[mailgun] MAILGUN_API_KEY or
  MAILGUN_DOMAIN missing — skipping email to <addr> (subject: ...)`.
  Registration row still inserted.

In production we accept this fallback so a misconfigured deploy
doesn't silently lose registration data. Operationally we treat
"Mailgun missing in production" as a P1 incident — email is the only
signal a registrant gets that they were registered.

To enforce email-must-send in a future stricter mode, change
`app/register/[centerSlug]/actions.ts` to refuse to insert when
`MAILGUN_API_KEY` is unset. Not done in P6-NEW because the row is
the source of truth and coordinators can re-trigger an email from
the dashboard (future feature; P7-NOTIFICATIONS).

## Rotating the API key

1. Mailgun → API Keys → Create new key.
2. Update Vercel Production + Preview env vars to the new key.
3. Redeploy.
4. Wait for the next deploy to complete + a smoke send.
5. Revoke the old key in Mailgun.

Do NOT rotate during a high-traffic registration window — emails
in-flight at the moment of rotation may fail silently.
