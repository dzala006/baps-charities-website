"use server";

/**
 * /my-walks server actions.
 *
 * The team_name update goes through the anon client (cookie-bound) so
 * RLS policies enforce the own-row scope. Migration 2620 added:
 *
 *   walk_registrations_user_team_name (UPDATE WHERE user_id = auth.uid())
 *     - per-column grant: only team_name is updatable
 *
 * If the row's user_id does not match auth.uid() the update silently
 * affects 0 rows; we revalidate /my-walks either way so the UI stays
 * consistent with whatever the DB ended up holding.
 */

import { revalidatePath } from "next/cache";
import { getCurrentUser, getServerSupabase } from "@/app/lib/auth";
import { TEAM_NAME_MAX_LENGTH } from "@/app/lib/registrationValidation";

export async function updateMyTeamName(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    // Caller should never reach this without a session; bail quietly.
    return;
  }

  const registrationId = (formData.get("registrationId") as string | null) ?? "";
  const rawTeamName = (formData.get("teamName") as string | null) ?? "";
  // UUID v4-ish guard. Tightened beyond a length check so a tampered form
  // payload can't smuggle SQL.
  if (!/^[0-9a-fA-F-]{32,40}$/.test(registrationId)) {
    return;
  }

  const trimmed = rawTeamName.trim().slice(0, TEAM_NAME_MAX_LENGTH);
  // Convert empty string to null so the leaderboard doesn't pick up a row
  // with an empty team name.
  const teamName = trimmed.length > 0 ? trimmed : null;

  const supabase = await getServerSupabase();
  const { error } = await supabase
    .from("walk_registrations")
    .update({ team_name: teamName })
    .eq("id", registrationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[my-walks] team_name update failed", error);
  }

  revalidatePath("/my-walks");
  revalidatePath("/leaderboard");
}
