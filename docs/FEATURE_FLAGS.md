# Feature Flags

Build-time Next.js public env vars to gate WIP IA changes so the
charities website can ship without breaking ongoing portal coordination.

Source of truth: `app/lib/featureFlags.ts`.

## Flags

| Variable | Default | Effect when `true` |
|---|---|---|
| `NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE` | `false` | Website hosts the public walkathon registration form (route added in a follow-up phase). When `false`, the existing cross-domain Register links to `walk2026.na.bapscharities.org` (the portal) remain authoritative. |

This file is intentionally minimal — only one flag exists today. As the
new IA migrates surfaces from the portal to the website, additional
flags will be added here in lockstep with their portal counterparts.

## Demo presets

### Person A — walkathon-only

```
NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=false
```

### Person B — full product

```
NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=true
```

Pair with the portal flag `VITE_FEATURE_PUBLIC_REGISTRATION_ON_PORTAL=false`.

## Reading flags in code

```ts
import { FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE } from '@/app/lib/featureFlags'
```

Flags resolve at build time via `process.env.NEXT_PUBLIC_*`. A change
requires `next dev` restart or a fresh deploy.

## .env.example entries (add manually if not already present)

```
# Feature flags (see docs/FEATURE_FLAGS.md)
# Defaults match Person A demo (registration stays on portal).
NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE=false
```

## Note: registration route not yet built

The flag is scaffolded but no `/register/:slug` route exists on the
website yet. Adding the route is the next prompt (P6-NEW). The flag
will gate that route when it lands.
