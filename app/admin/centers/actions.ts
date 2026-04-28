"use server";

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function saveCenter(
  id: number,
  data: {
    address: string | null;
    phone: string | null;
    email: string | null;
  }
): Promise<{ error?: string }> {
  const supabase = getAdminClient();
  const { error } = await supabase.from("centers").update(data).eq("id", id);
  if (error) return { error: error.message };
  return {};
}
