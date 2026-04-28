# Monitoring — BAPS Charities Website

## Health Check Endpoint

**URL:** `https://your-domain.org/healthz`

Returns `200 {"status":"ok"}` when all services are reachable.
Returns `503 {"status":"degraded"}` when any required service is down.

Unconfigured optional services (Stripe, Mailgun) are skipped and do not affect health status.

## UptimeRobot Setup

1. Create a free account at https://uptimerobot.com
2. Add new monitor: **HTTP(S)**
   - Friendly name: `BAPS Charities — Health Check`
   - URL: `https://your-domain.org/healthz`
   - Monitoring interval: **5 minutes**
   - Alert when status is not `200`
3. Add alert contact (email or Slack webhook)
4. Optionally add a second monitor for the homepage: `https://your-domain.org/`

## Sentry

Error monitoring is configured via `NEXT_PUBLIC_SENTRY_DSN`. Set up alert rules in:
Sentry Dashboard → Alerts → Create Alert Rule:
- **Condition:** Number of errors > 5 in 1 hour
- **Action:** Email team@bapscharities.org

## Vercel

Vercel provides built-in deployment and function monitoring at:
- Vercel Dashboard → Project → Analytics
- Vercel Dashboard → Project → Functions (serverless function logs)
