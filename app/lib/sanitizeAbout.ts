// =============================================================================
// sanitizeAbout.ts — server-side HTML sanitizer for center_pages.about_html.
//
// Mirrors the allowlist in the portal repo at
//   ~/baps-walkathon-portal/src/lib/editor/sanitize.ts
// and documented in
//   ~/baps-walkathon-portal/docs/SANITIZE_ALLOWLIST.md
//
// Defense in depth: the portal sanitizes on save, the website sanitizes
// again at render. If either is bypassed, the other still holds.
//
// Any change to the allowlist MUST be made in both places at once. Drift
// is a security defect.
//
// Implementation note: this used to use isomorphic-dompurify, which pulls
// jsdom -> html-encoding-sniffer -> @exodus/bytes/encoding-lite.js (ESM).
// Next 16 + Vercel's serverless runtime cannot require() that ESM module
// from inside a CJS dependency, so /centers/[slug] crashed with
// ERR_REQUIRE_ESM in production whenever the page rendered server-side.
// sanitize-html is pure JS, no jsdom, no encoding-sniffer — safe in both
// build and runtime, on every Next.js render mode.
// =============================================================================

import sanitizeHtml, { type IOptions } from "sanitize-html";

const ALLOWED_TAGS = [
  "h2",
  "h3",
  "p",
  "strong",
  "em",
  "a",
  "ul",
  "ol",
  "li",
  "img",
  "br",
];

const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];

const SANITIZE_OPTIONS: IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "width", "height", "title"],
  },
  // No `style` attribute anywhere; sanitize-html drops it by default unless
  // listed. Same for any on* handlers — not in allowedAttributes => stripped.
  allowedSchemes: ALLOWED_SCHEMES,
  allowedSchemesByTag: {
    a: ALLOWED_SCHEMES,
    img: ["http", "https"],
  },
  // Drop disallowed tags' content too — `<style>x</style>` should not leave
  // "x" floating in the output. Matches DOMPurify's default behaviour for
  // FORBID_TAGS.
  disallowedTagsMode: "discard",
  // sanitize-html escapes any text content; `<script>` is dropped because
  // it's not in allowedTags. We additionally explicitly nuke its content
  // via nonTextTags so any text inside is not preserved.
  nonTextTags: ["script", "style", "textarea", "noscript", "iframe"],
  // Don't allow protocol-relative or scheme-less URLs that could be abused.
  allowProtocolRelative: false,
};

/** Sanitize a center_pages.about_html value before rendering. */
export function sanitizeAboutHtml(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "";
  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}

const ALLOWED_URL_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Same URL validator the portal uses on save. */
export function isSafeUrl(raw: string | null | undefined): boolean {
  if (raw == null) return false;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return false;
  let parsed: URL;
  try {
    parsed = new URL(trimmed, "https://relative.invalid");
  } catch {
    return false;
  }
  if (
    parsed.hostname === "relative.invalid" &&
    !/^[a-z][a-z0-9+.-]*:/i.test(trimmed)
  ) {
    return true;
  }
  return ALLOWED_URL_SCHEMES.has(parsed.protocol);
}
