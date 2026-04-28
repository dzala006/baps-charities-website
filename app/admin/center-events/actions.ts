"use server";

import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function saveEvent(data: {
  id?: string;
  center_id: string;
  title: string;
  event_type: string;
  event_date: string;
  description: string;
  body: string;
  photo_url: string;
  external_url: string;
  is_published: boolean;
}): Promise<{ error?: string }> {
  const supabase = admin();
  const slug = slugify(data.title);
  if (data.id) {
    const { error } = await supabase
      .from("center_events")
      .update({ ...data, slug })
      .eq("id", data.id);
    return error ? { error: error.message } : {};
  }
  const { error } = await supabase
    .from("center_events")
    .insert({ ...data, slug, source: "admin" });
  return error ? { error: error.message } : {};
}

export async function deleteEvent(id: string): Promise<{ error?: string }> {
  const supabase = admin();
  const { error } = await supabase.from("center_events").delete().eq("id", id);
  return error ? { error: error.message } : {};
}
