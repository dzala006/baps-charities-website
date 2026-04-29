/**
 * sanitizeAbout.test.ts — XSS-critical tests for the website-side sanitizer.
 *
 * Mirrors tests/unit/centerPagesSanitize.test.ts in the portal repo. Both
 * MUST pass; they're the canary for allowlist drift between the two sides.
 */
import { describe, it, expect } from "vitest";
import { sanitizeAboutHtml, isSafeUrl } from "./sanitizeAbout";

describe("sanitizeAboutHtml — XSS payloads", () => {
  it("strips <script>", () => {
    const out = sanitizeAboutHtml('<p>hi</p><script>alert(1)</script>');
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/alert\(1\)/);
  });

  it("strips img onerror", () => {
    const out = sanitizeAboutHtml('<img src="x" onerror="alert(1)">');
    expect(out).not.toMatch(/onerror/i);
  });

  it("strips javascript: hrefs", () => {
    const out = sanitizeAboutHtml('<a href="javascript:alert(1)">click</a>');
    expect(out).not.toMatch(/javascript:/i);
  });

  it("strips data: hrefs", () => {
    const out = sanitizeAboutHtml('<a href="data:text/html,<h1>x">click</a>');
    expect(out).not.toMatch(/data:/i);
  });

  it("strips iframes", () => {
    const out = sanitizeAboutHtml('<iframe src="https://evil.com"></iframe>');
    expect(out).not.toMatch(/<iframe/i);
  });

  it("strips style blocks and inline style", () => {
    const out = sanitizeAboutHtml('<style>x</style><p style="color:red">hi</p>');
    expect(out).not.toMatch(/<style/i);
    expect(out).not.toMatch(/style=/);
  });

  it("strips form elements", () => {
    const out = sanitizeAboutHtml('<form><input></form>');
    expect(out).not.toMatch(/<form/i);
    expect(out).not.toMatch(/<input/i);
  });
});

describe("sanitizeAboutHtml — allowed content survives", () => {
  it("preserves bold/italic/link/list", () => {
    const out = sanitizeAboutHtml(
      '<p><strong>b</strong> <em>i</em></p><ul><li><a href="https://example.com">x</a></li></ul>',
    );
    expect(out).toContain('<strong>');
    expect(out).toContain('<em>');
    expect(out).toContain('href="https://example.com"');
  });

  it("preserves h2 and h3", () => {
    expect(sanitizeAboutHtml('<h2>A</h2>')).toContain('<h2>');
    expect(sanitizeAboutHtml('<h3>B</h3>')).toContain('<h3>');
  });

  it("preserves images with src and alt", () => {
    const out = sanitizeAboutHtml('<img src="https://example.com/a.jpg" alt="a">');
    expect(out).toContain('src="https://example.com/a.jpg"');
    expect(out).toContain('alt="a"');
  });

  it("returns empty for null/undefined/empty", () => {
    expect(sanitizeAboutHtml(null)).toBe("");
    expect(sanitizeAboutHtml(undefined)).toBe("");
    expect(sanitizeAboutHtml("")).toBe("");
  });
});

describe("isSafeUrl", () => {
  it.each([
    ["https://example.com", true],
    ["http://example.com", true],
    ["mailto:a@b.com", true],
    ["tel:+15551234", true],
    ["/relative/path", true],
  ])("accepts %s", (url, expected) => {
    expect(isSafeUrl(url)).toBe(expected);
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "data:text/html,<h1>x",
    "vbscript:msgbox",
    "file:///etc/passwd",
    "",
  ])("rejects %s", url => {
    expect(isSafeUrl(url)).toBe(false);
  });

  it("rejects null and undefined", () => {
    expect(isSafeUrl(null)).toBe(false);
    expect(isSafeUrl(undefined)).toBe(false);
  });
});
