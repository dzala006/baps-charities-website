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
// =============================================================================

import DOMPurify from "isomorphic-dompurify";

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

const ALLOWED_ATTR = [
  "href",
  "title",
  "rel",
  "target",
  "src",
  "alt",
  "width",
  "height",
];

const FORBID_TAGS = ["script", "style", "iframe", "form", "input", "object", "embed"];

const FORBID_ATTR = ["onerror", "onload", "onclick", "onmouseover"];

/** Sanitize a center_pages.about_html value before rendering. */
export function sanitizeAboutHtml(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "";
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS,
    FORBID_ATTR,
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    WHOLE_DOCUMENT: false,
    RETURN_TRUSTED_TYPE: false,
  });
}

const ALLOWED_SCHEMES = new Set(["http:", "https:", "mailto:", "tel:"]);

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
  return ALLOWED_SCHEMES.has(parsed.protocol);
}
