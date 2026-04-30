import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE } from "@/app/lib/featureFlags";
import { getCenterWalkathonMode } from "@/app/lib/walkathon";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register — BAPS Walkathon",
  description: "Register for the BAPS Charities Walkathon at your local center.",
  robots: { index: false, follow: false },
};

interface CenterCtx {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
}

interface WalkathonCtx {
  id: string;
  year: number;
  name: string;
  nationalEventDate: string;
}

async function loadContext(centerSlug: string): Promise<{
  center: CenterCtx;
  walkathon: WalkathonCtx;
} | null> {
  const [{ data: center }, { data: walkathon }] = await Promise.all([
    supabase
      .from("centers")
      .select("id, name, slug, city, state")
      .eq("slug", centerSlug)
      .maybeSingle(),
    supabase
      .from("walkathons")
      .select("id, year, name, national_event_date")
      .eq("status", "Open")
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!center || !walkathon) return null;

  return {
    center: {
      id: String(center.id),
      name: center.name,
      slug: center.slug,
      city: center.city ?? null,
      state: center.state ?? null,
    },
    walkathon: {
      id: String(walkathon.id),
      year: walkathon.year,
      name: walkathon.name,
      nationalEventDate: walkathon.national_event_date,
    },
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ centerSlug: string }>;
}) {
  if (!FEATURE_PUBLIC_REGISTRATION_ON_WEBSITE) notFound();

  const { centerSlug } = await params;
  const ctx = await loadContext(centerSlug);
  if (!ctx) notFound();

  // Honor per-center opt-out: don't let users land on the form for a center
  // that has chosen not to host this year.
  const mode = await getCenterWalkathonMode(ctx.center.id);
  if (mode === "opt_out") notFound();

  return <RegisterForm center={ctx.center} walkathon={ctx.walkathon} />;
}
