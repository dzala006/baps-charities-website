import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Guard: createClient throws if url is empty — return a no-op client during local builds
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient("https://placeholder.supabase.co", "placeholder-key");

export type WalkCity = {
  id: number;
  city: string;
  state: string;
  slug: string;
  date_display: string | null;
  venue: string | null;
  beneficiary: string | null;
  confirmed: boolean;
  registration_url: string | null;
  lat: number | null;
  lng: number | null;
};

export type Center = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  region_id: number;
  address: string | null;
  phone: string | null;
  email: string | null;
};

export type Walkathon = {
  id: string;
  year: number;
  name: string;
  status: string;
  national_event_date: string;
  registration_url: string | null;
};
