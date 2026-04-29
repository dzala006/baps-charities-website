// =============================================================================
// /api/revalidate — on-demand ISR revalidation for center pages.
//
// The portal POSTs here after a coordinator saves their page:
//   POST /api/revalidate?secret=...&path=/centers/atlanta
//
// Auth model:
//   - Shared secret in the `secret` query param. Compared with timing-safe
//     equality against process.env.REVALIDATE_SECRET.
//   - GET is rejected (405) so the secret never appears in browser history
//     or accidental link previews.
//
// Path safety:
//   - Only paths matching ^/centers/[a-z0-9-]+$ are accepted. Any other path
//     is rejected so a leaked secret can't be used to invalidate the entire
//     site.
//
// Returns 200 on success with { revalidated: true, path }; 401/400 on auth or
// validation failure.
// =============================================================================

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Centers slug shape: lowercase letters, digits, hyphens. Same shape used
// by generateStaticParams in app/centers/[slug]/page.tsx.
const CENTER_PATH_RE = /^\/centers\/[a-z0-9-]+$/;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    // Misconfiguration: deny rather than silently accepting any caller.
    return NextResponse.json(
      { revalidated: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }

  const provided = req.nextUrl.searchParams.get("secret") ?? "";
  if (!timingSafeEqual(provided, expected)) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid secret" },
      { status: 401 },
    );
  }

  const path = req.nextUrl.searchParams.get("path") ?? "";
  if (!CENTER_PATH_RE.test(path)) {
    return NextResponse.json(
      { revalidated: false, error: "Invalid or unsupported path" },
      { status: 400 },
    );
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path });
}

// Reject GETs explicitly: secrets in query params are still preferable to
// JSON-body POSTs because the portal is a Vite SPA that POSTs cross-origin
// without preflight if no custom headers are attached. But we don't want
// the secret to be cacheable in browser history via GET.
export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
