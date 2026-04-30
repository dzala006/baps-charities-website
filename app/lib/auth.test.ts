/**
 * auth.test.ts — covers the pure helpers in app/lib/auth.ts.
 *
 * The session-bound helpers (getCurrentUser, getServerSupabase,
 * getRoleAssignments, getUserScope, isNationalAdmin) read cookies + hit
 * Supabase and are exercised through the integration smoke tests; here we
 * lock down the pure-function security guard for post-login redirects.
 */
import { describe, it, expect } from "vitest";
import { safeNextPath } from "./auth";

describe("safeNextPath", () => {
  it("returns the fallback when input is missing", () => {
    expect(safeNextPath(null)).toBe("/portal");
    expect(safeNextPath(undefined)).toBe("/portal");
    expect(safeNextPath("")).toBe("/portal");
  });

  it("respects a custom fallback", () => {
    expect(safeNextPath(null, "/")).toBe("/");
    expect(safeNextPath(undefined, "/login")).toBe("/login");
  });

  it("accepts a same-origin path", () => {
    expect(safeNextPath("/my-walks")).toBe("/my-walks");
    expect(safeNextPath("/register/lilburn-ga")).toBe("/register/lilburn-ga");
  });

  it("rejects protocol-relative URLs", () => {
    expect(safeNextPath("//evil.example/")).toBe("/portal");
  });

  it("rejects absolute URLs", () => {
    expect(safeNextPath("https://evil.example/")).toBe("/portal");
    expect(safeNextPath("http://evil.example/")).toBe("/portal");
  });

  it("rejects javascript:, data:, vbscript: schemes", () => {
    expect(safeNextPath("javascript:alert(1)")).toBe("/portal");
    expect(safeNextPath("/javascript:alert(1)")).toBe("/portal");
    expect(safeNextPath("data:text/html,<h1>x")).toBe("/portal");
    expect(safeNextPath("vbscript:msgbox")).toBe("/portal");
  });

  it("rejects bare relative paths", () => {
    expect(safeNextPath("relative/path")).toBe("/portal");
    expect(safeNextPath("portal")).toBe("/portal");
  });

  it("rejects non-string input", () => {
    // safeNextPath is typed as `string | null | undefined`, but the param
    // can come from FormData / searchParams — runtime guard verifies the
    // string check fires for non-strings too.
    expect(safeNextPath(123 as unknown as string)).toBe("/portal");
    expect(safeNextPath({} as unknown as string)).toBe("/portal");
  });
});
