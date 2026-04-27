"use client";

import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";

export default function ContactPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>Contact</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", letterSpacing: "-0.01em", maxWidth: 900 }}>
            We'd love to hear from you.
          </h1>
        </div>
      </section>

      <section style={{ padding: "64px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64 }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, color: "#2a241f", margin: 0 }}>North America Headquarters</h3>
            <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.8, color: "#4C4238" }}>
              <div style={{ fontWeight: 600, color: "#2a241f" }}>BAPS Charities</div>
              <div>112 North Main Street, Suite 301</div>
              <div>Robbinsville, NJ 08561</div>
              <div style={{ marginTop: 16 }}>📞 +1 (732) 803‑XXXX</div>
              <div>✉ info@bapscharities.org</div>
            </div>

            <div style={{ marginTop: 40, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>Specific inquiries</div>
            {[
              { l: "Donations & Receipts", e: "donate@bapscharities.org" },
              { l: "Volunteer Coordination", e: "volunteer@bapscharities.org" },
              { l: "Press & Media", e: "press@bapscharities.org" },
              { l: "Corporate Partnerships", e: "partners@bapscharities.org" },
            ].map((c) => (
              <div key={c.l} style={{ padding: "12px 0", borderBottom: "1px solid #E4DFDA", display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "#2a241f", fontWeight: 500 }}>{c.l}</span>
                <a href={`mailto:${c.e}`} style={{ color: "#8E191D", textDecoration: "none" }}>{c.e}</a>
              </div>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ background: "#fff", padding: 40, borderRadius: 4, border: "1px solid #E4DFDA" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, color: "#2a241f", margin: 0 }}>Send us a message</h3>
            {[["Full name", "text"], ["Email", "email"], ["Subject", "text"]].map(([l, t]) => (
              <div key={l} style={{ marginTop: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a716a", display: "block", marginBottom: 8 }}>{l}</label>
                <input type={t} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14 }} />
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a716a", display: "block", marginBottom: 8 }}>Message</label>
              <textarea rows={6} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 14, resize: "vertical" }} />
            </div>
            <button type="submit" style={{ marginTop: 24, padding: "14px 32px", background: "#8E191D", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>Send Message</button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
