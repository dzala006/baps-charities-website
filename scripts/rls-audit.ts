/**
 * RLS Audit — BAPS Charities Website
 *
 * Documents expected RLS policy state for all audited tables.
 * Run the verification query below in Supabase Dashboard → SQL Editor
 * (or via the Supabase MCP) to confirm live policy state matches expectations.
 *
 * Last audited: 2026-04-27
 * Migration applied: fix_rls_policies
 *
 * Admin check (inline subquery, no helper function):
 *   EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
 *
 * NOTE: The supabase client in app/lib/supabase.ts uses the ANON key.
 * Stripe webhook donations insert must use the SERVICE ROLE key server-side
 * (bypasses RLS). Confirm SUPABASE_SERVICE_ROLE_KEY is set in the Stripe
 * webhook handler environment.
 *
 * DO NOT TOUCH these tables (out of scope — Phase 4 walkathon portal):
 *   notifications, reports, audit_log, search_index,
 *   notification_preferences, scheduled_reports
 */

export const RLS_EXPECTATIONS = {
  centers: {
    rls_enabled: true,
    access_pattern: "public-read, admin-write",
    policies: [
      {
        name: "centers_public_select",
        cmd: "SELECT",
        roles: ["anon", "authenticated"],
        using: "true",
        with_check: null,
        note: "Anyone can read center listings",
      },
      {
        name: "centers_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Admins can insert, update, delete centers",
      },
    ],
  },

  regions: {
    rls_enabled: true,
    access_pattern: "public-read, admin-write",
    policies: [
      {
        name: "regions_public_select",
        cmd: "SELECT",
        roles: ["anon", "authenticated"],
        using: "true",
        with_check: null,
        note: "Anyone can read region data",
      },
      {
        name: "regions_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Admins can manage regions",
      },
    ],
  },

  walk_cities: {
    rls_enabled: true,
    access_pattern: "public-read, admin-write",
    policies: [
      {
        name: "walk_cities_public_select",
        cmd: "SELECT",
        roles: ["anon", "authenticated"],
        using: "true",
        with_check: null,
        note: "Anyone can read walk city listings",
      },
      {
        name: "walk_cities_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Admins can manage walk cities",
      },
    ],
  },

  contact_submissions: {
    rls_enabled: true,
    access_pattern: "public-insert, admin-read/manage",
    policies: [
      {
        name: "contact_submissions_public_insert",
        cmd: "INSERT",
        roles: ["anon", "authenticated"],
        using: null,
        with_check: "true",
        note: "Anyone (including unauthenticated visitors) can submit a contact form",
      },
      {
        name: "contact_submissions_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Only admins can read or manage submissions",
      },
    ],
  },

  donations: {
    rls_enabled: true,
    access_pattern: "donor-reads-own (by email), admin-all; Stripe inserts via service key",
    policies: [
      {
        name: "donations_own_select",
        cmd: "SELECT",
        roles: ["authenticated"],
        using: "donor_email = (auth.jwt() ->> 'email')",
        with_check: null,
        note: "Authenticated donors can read their own donation rows matched by email",
      },
      {
        name: "donations_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Admins have full access to all donation records",
      },
    ],
    service_key_note:
      "Stripe webhook must use SUPABASE_SERVICE_ROLE_KEY to insert donations. " +
      "The anon-key client in app/lib/supabase.ts does NOT have insert rights on donations.",
  },

  newsletter_subscribers: {
    rls_enabled: true,
    access_pattern: "public-insert (subscribe), admin-read/manage",
    policies: [
      {
        name: "newsletter_subscribers_public_insert",
        cmd: "INSERT",
        roles: ["anon", "authenticated"],
        using: null,
        with_check: "true",
        note: "Anyone can subscribe to the newsletter",
      },
      {
        name: "newsletter_subscribers_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Only admins can view the subscriber list or manage entries",
      },
    ],
  },

  user_roles: {
    rls_enabled: true,
    access_pattern: "own-row-read, admin-all",
    policies: [
      {
        name: "user_roles_own_select",
        cmd: "SELECT",
        roles: ["authenticated"],
        using: "user_id = auth.uid()",
        with_check: null,
        note: "Users can read their own role row",
      },
      {
        name: "user_roles_admin_all",
        cmd: "ALL",
        roles: ["authenticated"],
        using: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        with_check: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')",
        note: "Admins can manage all user role assignments",
      },
    ],
  },
} as const;

/**
 * Verification query — run in Supabase SQL Editor to confirm live state:
 *
 * SELECT tablename, policyname, cmd, roles
 * FROM pg_policies
 * WHERE schemaname = 'public'
 *   AND tablename IN (
 *     'centers','regions','walk_cities',
 *     'contact_submissions','donations',
 *     'newsletter_subscribers','user_roles'
 *   )
 * ORDER BY tablename, policyname;
 *
 * Expected: 14 rows — 2 policies per table.
 */
