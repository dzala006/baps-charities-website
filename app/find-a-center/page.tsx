import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import LocationPicker from "../components/LocationPicker";

export const metadata: Metadata = { title: "Find a Center — BAPS Charities" };

export default function FindACenterPage() {
  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#fff", padding: "96px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 16 }}>Locations</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, margin: 0, color: "#fff", letterSpacing: "-0.01em", maxWidth: 900 }}>
            Find a BAPS center near you.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#b1aca7", maxWidth: 640, marginTop: 24 }}>
            BAPS has centers in 12 countries across five continents. Find your nearest location to connect with your local community.
          </p>
          <div style={{ marginTop: 40, display: "flex", gap: 0, maxWidth: 640 }}>
            <input
              type="text"
              placeholder="Enter city, state, or zip code"
              style={{ flex: 1, padding: "18px 24px", background: "#fff", border: "none", borderRadius: "4px 0 0 4px", fontSize: 16, color: "#2a241f", outline: "none" }}
            />
            <button style={{ padding: "18px 28px", background: "#CF3728", color: "#fff", border: "none", borderRadius: "0 4px 4px 0", fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
              Search
            </button>
          </div>
        </div>
      </section>

      <LocationPicker />
    </PageShell>
  );
}
