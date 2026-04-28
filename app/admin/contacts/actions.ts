"use server";

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function markContactRead(id: string): Promise<void> {
  const supabase = getAdminClient();
  await supabase
    .from("contact_submissions")
    .update({ read: true })
    .eq("id", id);
}
