# RLS Policies — BAPS Charities Website

Last audited: 2026-04-27
Migration applied: `fix_rls_policies`

## Summary

Row-Level Security is enabled on all public tables. The patterns are:

- **Public content** (`centers`, `regions`, `walk_cities`): readable by anyone (anon + authenticated), writable only by admins
- **Submissions** (`contact_submissions`, `newsletter_subscribers`): insertable by anyone (anon + authenticated), readable/manageable only by admins
- **Private data** (`donations`): readable only by the donor (matched by JWT email) or admins; Stripe webhook inserts via service role key
- **Auth data** (`user_roles`): users can read their own row; admins can manage all rows

## How Admin Is Determined

There is no `is_admin()` helper function. All admin checks use an inline subquery:

```sql
EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
```

The `user_roles` table has columns: `user_id uuid`, `role text`. Admin email: dzala1234567@gmail.com.

## Tables

### centers

| Operation | Anon | Authenticated | Admin |
|---|---|---|---|
| SELECT | yes | yes | yes |
| INSERT | no | no | yes |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `centers_public_select` — SELECT, USING `true`
- `centers_admin_all` — ALL, USING/WITH CHECK admin subquery

---

### regions

| Operation | Anon | Authenticated | Admin |
|---|---|---|---|
| SELECT | yes | yes | yes |
| INSERT | no | no | yes |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `regions_public_select` — SELECT, USING `true`
- `regions_admin_all` — ALL, USING/WITH CHECK admin subquery

---

### walk_cities

| Operation | Anon | Authenticated | Admin |
|---|---|---|---|
| SELECT | yes | yes | yes |
| INSERT | no | no | yes |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `walk_cities_public_select` — SELECT, USING `true`
- `walk_cities_admin_all` — ALL, USING/WITH CHECK admin subquery

---

### contact_submissions

| Operation | Anon | Authenticated | Admin |
|---|---|---|---|
| SELECT | no | no | yes |
| INSERT | yes | yes | yes |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `contact_submissions_public_insert` — INSERT, WITH CHECK `true`
- `contact_submissions_admin_all` — ALL, USING/WITH CHECK admin subquery

---

### donations

| Operation | Anon | Authenticated (own) | Admin |
|---|---|---|---|
| SELECT | no | own rows only | yes |
| INSERT | no | no | yes (or service key) |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `donations_own_select` — SELECT, USING `donor_email = (auth.jwt() ->> 'email')`
- `donations_admin_all` — ALL, USING/WITH CHECK admin subquery

**Stripe webhook note:** The Stripe webhook must use the Supabase **service role key** (`SUPABASE_SERVICE_ROLE_KEY`) to insert donation rows. The service role bypasses RLS entirely. The anon-key client in `app/lib/supabase.ts` does NOT have insert permission on this table — this is intentional. Verify the webhook handler initializes a separate service-role Supabase client using `SUPABASE_SERVICE_ROLE_KEY`.

---

### newsletter_subscribers

| Operation | Anon | Authenticated | Admin |
|---|---|---|---|
| SELECT | no | no | yes |
| INSERT | yes | yes | yes |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `newsletter_subscribers_public_insert` — INSERT, WITH CHECK `true`
- `newsletter_subscribers_admin_all` — ALL, USING/WITH CHECK admin subquery

---

### user_roles

| Operation | Anon | Authenticated (own) | Admin |
|---|---|---|---|
| SELECT | no | own row only | yes |
| INSERT | no | no | yes |
| UPDATE | no | no | yes |
| DELETE | no | no | yes |

Policies:
- `user_roles_own_select` — SELECT, USING `user_id = auth.uid()`
- `user_roles_admin_all` — ALL, USING/WITH CHECK admin subquery

---

## Verification Query

Run in Supabase SQL Editor to confirm live state:

```sql
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'centers','regions','walk_cities',
    'contact_submissions','donations',
    'newsletter_subscribers','user_roles'
  )
ORDER BY tablename, policyname;
```

Expected: 14 rows — exactly 2 policies per table.

## Do Not Touch

The following tables are NOT managed by this audit (Phase 4 walkathon portal work in flight):

- `notifications`
- `reports`
- `audit_log`
- `search_index`
- `notification_preferences`
- `scheduled_reports`

## Pre-Existing State (before this migration)

RLS was already ENABLED on all 7 tables. The prior policies were designed for an internal staff portal with roles: `national_admin`, `kothari`, `regional_coordinator`, `coordinator`, `vicharan_swami`, `viewer`. These relied on helper functions `auth_user_is_active()`, `auth_user_role()`, `auth_user_center_id()`, `auth_user_region_id()` — all of which still exist in the database but are no longer referenced by the policies above.

Tables with no prior policies: `contact_submissions` (no policies at all), `walk_cities` (SELECT-only, no admin write).

The migration dropped all prior policies on the 7 audited tables and replaced them with the simpler two-policy pattern documented above.
