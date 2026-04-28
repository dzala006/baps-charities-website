import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = { title: "Sponsorship — BAPS Charities" };

const TIERS = [
  { name: "Community", amt: "$2,500", perks: ["Logo on event signage", "Newsletter recognition", "2 event tickets"] },
  { name: "Patron", amt: "$10,000", perks: ["Top‑tier event signage", "Dedicated impact report", "Table for 8", "Website partner page"], featured: true },
  { name: "Visionary", amt: "$50,000+", perks: ["Named program initiative", "Annual report feature", "CEO‑level engagement", "Custom volunteer day for your team", "Multi‑year giving plan"] },
];

export default function SponsorshipPage() {
  return (
    <PageShell>
      <section style={{ background: "#4C4238", color: "#E4DFDA", padding: "88px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Sponsorship" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 16 }}>Corporate Sponsorship</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 64px)", lineHeight: 1.1, margin: 0, color: "#fff", letterSpacing: "-0.01em", maxWidth: 1000 }}>
            Partner with a 100%‑volunteer movement.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#b1aca7", maxWidth: 720, marginTop: 24 }}>
            Your sponsorship dollars don&apos;t pay for executive salaries or office space. They go directly to programs — measurable, traceable, reportable.
          </p>
        </div>
      </section>

      <section style={{ padding: "80px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TIERS.map((t) => (
              <div key={t.name} style={{ background: t.featured ? "#2a241f" : "#fff", color: t.featured ? "#fff" : "#2a241f", padding: 40, borderRadius: 4, border: t.featured ? "none" : "1px solid #E4DFDA", position: "relative" }}>
                {t.featured && (
                  <div style={{ position: "absolute", top: -12, left: 24, padding: "4px 12px", background: "#CF3728", color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", borderRadius: 4 }}>Most Popular</div>
                )}
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: t.featured ? "#CF3728" : "#8E191D" }}>{t.name}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1, marginTop: 16 }}>{t.amt}</div>
                <ul style={{ marginTop: 24, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {t.perks.map((p) => (
                    <li key={p} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5 }}>
                      <span style={{ color: "#CF3728" }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
                <button style={{ width: "100%", padding: "14px 0", marginTop: 32, background: t.featured ? "#CF3728" : "#2a241f", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>Become a sponsor</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64, padding: 48, background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 12 }}>Custom partnership</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, color: "#2a241f", margin: 0 }}>Need something tailored?</h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", marginTop: 12, maxWidth: 640 }}>Multi-year commitments, naming rights, employee volunteer days, cause-marketing programs — we&apos;ll build the right package for your goals. Contact our partnerships team.</p>
            </div>
            <a href="/contact" style={{ padding: "16px 32px", background: "#2a241f", color: "#fff", textDecoration: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Get in touch →</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
