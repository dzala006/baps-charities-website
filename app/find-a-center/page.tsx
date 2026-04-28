import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import FindACenterClient from "./FindACenterClient";
import { supabase } from "../lib/supabase";

export const metadata: Metadata = {
  title: "Find a Center",
  description: "Find your nearest BAPS center across 12 countries and 140+ cities worldwide.",
};

export const dynamic = "force-dynamic";

async function getCenters() {
  const { data, error } = await supabase
    .from("centers")
    .select("id, name, slug, city, state, region_id")
    .order("state", { ascending: true })
    .order("city", { ascending: true });
  if (error) console.error("[find-a-center] getCenters error:", error.message);
  return data ?? [];
}

async function getRegions() {
  const { data, error } = await supabase
    .from("regions")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) console.error("[find-a-center] getRegions error:", error.message);
  return data ?? [];
}

export default async function FindACenterPage() {
  const [centers, regions] = await Promise.all([getCenters(), getRegions()]);

  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 16 }}>Locations</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, margin: 0, color: "#fff", letterSpacing: "-0.01em", maxWidth: 900 }}>
            Find a BAPS center near you.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#b1aca7", maxWidth: 640, marginTop: 24 }}>
            BAPS has {centers.length > 0 ? `${centers.length}+` : "over 100"} centers across the United States and beyond. Find your nearest location to connect with your local community.
          </p>
        </div>
      </section>

      <FindACenterClient centers={centers} regions={regions} />
    </PageShell>
  );
}
