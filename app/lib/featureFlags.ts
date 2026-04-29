/**
 * Feature flags. Read from Next.js public env at build time.
 *
 * Defaults match the Person A demo (walkathon-only): the website does NOT
 * host the registration form — the portal does. See docs/FEATURE_FLAGS.md.
 */

function readBoolEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name]
  if (raw === undefined) return fallback
  if (raw === 'true') return true
  if (raw === 'false') return false
  return fallback
}

/**
 * When true, the website hosts the public walkathon registration form at
 * /register/:slug. Today (default false) the existing cross-domain Register
 * buttons point to walk2026.na.bapscharities.org (the portal) and that is
 * the only working flow.
 */
export const FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE = readBoolEnv(
  'NEXT_PUBLIC_FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE',
  false,
)
