/**
 * app/lib/auth.ts — server-side auth helpers reading user_role_assignments.
 *
 * P4 (scoped roles) — see ../../baps-walkathon-portal/docs/SCOPED_ROLES_DESIGN.md.
 * The legacy public.user_roles table is still present (bridge period) but the
 * admin gate now reads from user_role_assignments.
 *
 * NOTE: this file uses anon client + cookie session, so RLS still applies.
 * Each authenticated user can SELECT their own user_role_assignments rows
 * via the ura_self_select policy.
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export type ScopedRole =
  | "national_admin"
  | "regional_coordinator"
  | "kothari"
  | "center_coordinator"
  | "vicharan_swami"
  | "viewer"
  | "donor"
  | "volunteer";

export interface RoleAssignment {
  id: string;
  role: ScopedRole;
  scopeType: "national" | "region" | "center" | null;
  scopeId: string | null;
  grantedAt: string;
}

export interface UserScope {
  isNationalAdmin: boolean;
  centers: string[];
  regions: string[];
  roles: ScopedRole[];
}

async function serverClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // read-only in server components
        },
      },
    },
  );
}

export async function getRoleAssignments(
  authUserId: string,
): Promise<RoleAssignment[]> {
  const supabase = await serverClient();
  const { data, error } = await supabase
    .from("user_role_assignments")
    .select("id, role, scope_type, scope_id, granted_at")
    .eq("user_id", authUserId);

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    role: row.role as ScopedRole,
    scopeType: row.scope_type as RoleAssignment["scopeType"],
    scopeId: (row.scope_id as string | null) ?? null,
    grantedAt: (row.granted_at as string | null) ?? "",
  }));
}

export async function getUserScope(authUserId: string): Promise<UserScope> {
  const assignments = await getRoleAssignments(authUserId);
  const centers = new Set<string>();
  const regions = new Set<string>();
  let isNationalAdmin = false;
  const roles = new Set<ScopedRole>();

  for (const a of assignments) {
    roles.add(a.role);
    if (a.role === "national_admin") isNationalAdmin = true;
    if (a.scopeType === "center" && a.scopeId) centers.add(a.scopeId);
    if (a.scopeType === "region" && a.scopeId) regions.add(a.scopeId);
  }

  return {
    isNationalAdmin,
    centers: [...centers],
    regions: [...regions],
    roles: [...roles],
  };
}

/**
 * True if the authenticated user has a national_admin assignment.
 * Used by the /admin gate.
 */
export async function isNationalAdmin(authUserId: string): Promise<boolean> {
  const supabase = await serverClient();
  const { data, error } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("user_id", authUserId)
    .eq("role", "national_admin")
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}
