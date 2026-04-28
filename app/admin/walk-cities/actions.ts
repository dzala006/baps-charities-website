"use server";

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function saveWalkCity(
  id: number,
  data: {
    city: string;
    state: string;
    date_display: string | null;
    venue: string | null;
    beneficiary: string | null;
    confirmed: boolean;
    registration_url: string | null;
  }
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("walk_cities")
    .update(data)
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}
