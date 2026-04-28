# Deferred Integrations

These integrations are feature-flagged and will activate automatically when
the corresponding environment variables are set in Vercel.

---

## Stripe (Donations)

**Status:** Deferred — `/donate` shows a "coming soon" banner until keys are set.

### Env vars to set in Vercel

| Variable | Where to find it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys → Secret key (`sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys → Publishable key (`pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → your endpoint → Signing secret (`whsec_...`) |

### Vercel webhook endpoint

After setting keys, register the webhook in Stripe Dashboard:
- **Endpoint URL:** `https://your-domain.org/api/webhooks/stripe`
- **Events to listen for:** `payment_intent.succeeded`, `payment_intent.payment_failed`

### Smoke test plan (day Stripe goes live)

1. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` in Vercel → Redeploy.
2. Visit `/donate` — confirm form appears (not "coming soon").
3. Use a Stripe test card (`4242 4242 4242 4242`, any future expiry, any CVC) to complete a donation.
4. In Stripe Dashboard → Events, confirm `payment_intent.succeeded` fired.
5. In Supabase → `donations` table, confirm a row was inserted with the correct `stripe_payment_id`.
6. Check the donor email inbox for a receipt email (if Mailgun is also active).
7. Run: `stripe trigger payment_intent.succeeded` via Stripe CLI — confirm a second row is NOT inserted (idempotency via ON CONFLICT).

### Test commands

```bash
# Forward Stripe events to local dev server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger a test payment
stripe trigger payment_intent.succeeded
```

---

## Mailgun (Transactional Email)

**Status:** Deferred — newsletter signups are stored in Supabase but no email is sent. Welcome email is logged to console.

### Env vars to set in Vercel

| Variable | Where to find it |
|---|---|
| `MAILGUN_API_KEY` | Mailgun Dashboard → API Keys |
| `MAILGUN_DOMAIN` | Mailgun Dashboard → Sending → Domains (e.g. `mg.bapscharities.org`) |

### DNS records the org must add

Before activating Mailgun, add these DNS records to your domain registrar:

**SPF (TXT record on `bapscharities.org`):**
```
v=spf1 include:mailgun.org ~all
```

**DKIM (TXT record — Mailgun provides the exact value):**
```
Name:  krs._domainkey.mg.bapscharities.org
Value: (copy from Mailgun Dashboard → Sending → Domains → DNS Records)
```

**DMARC (TXT record on `_dmarc.bapscharities.org`):**
```
v=DMARC1; p=none; rua=mailto:info@bapscharities.org
```

**MX records (for `mg.bapscharities.org` subdomain):**
```
10  mxa.mailgun.org
10  mxb.mailgun.org
```

After adding DNS records, verify in Mailgun Dashboard → Sending → Domains → your domain → Verify DNS.

### Smoke test plan (day Mailgun goes live)

1. Set `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` in Vercel → Redeploy.
2. Submit a newsletter signup at `/` with a real email address.
3. Confirm the email is received within 2 minutes.
4. Check Mailgun Dashboard → Logs to confirm delivery status = `delivered`.
5. Hit `GET /api/admin/mailgun-test` (admin-only) to send a test email and see the delivery API response.

---

## Tax Receipts (Stripe + Mailgun + Supabase Storage)

**Status:** Deferred — receipt PDFs are not generated until Stripe is active.

Tax receipts activate automatically when `STRIPE_SECRET_KEY` is set. The webhook generates a PDF on `payment_intent.succeeded` and attaches it to the donor receipt email.

Two formats:
- **US donors:** EIN `26-1530694`, "no goods or services" disclosure
- **Canadian donors:** CRA registration `864015441RR0001`, eligible amount, official receipt number

No additional env vars beyond Stripe + Mailgun. Supabase Storage bucket (`donation-receipts`) must exist and be set to **private**. Create it in Supabase Dashboard → Storage before going live.

### Smoke test

1. Complete a test Stripe donation (see Stripe smoke test above).
2. Check `donations.receipt_url` for the donor row — should be a signed Supabase Storage URL.
3. Download the URL and verify the PDF renders with correct EIN/CRA number and amount.
4. Check the receipt email for a PDF attachment.
