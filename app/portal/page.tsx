import type { Metadata } from "next";
import PageShell from "../components/PageShell";

export const metadata: Metadata = { title: "Donor Portal — BAPS Charities" };

export default function PortalPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 32px" }}>
        <div style={{ maxWidth: 560, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>Donor Portal</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1, margin: 0, color: "#2a241f" }}>
            Your giving dashboard lives here.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "#4C4238", marginTop: 24 }}>
            Track your donations, download tax receipts, manage recurring gifts, and see the impact of your contributions — all in one place.
          </p>
          <div style={{ marginTop: 40, padding: 28, background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>You're being redirected to</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, background: "#CF3728", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, flexShrink: 0 }}>🏃</div>
              <div>
                <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 16 }}>BAPS Walkathon Portal</div>
                <div style={{ fontSize: 13, color: "#7a716a", marginTop: 2 }}>Manage your Walk | Run 2026 registration, fundraising page, and team.</div>
              </div>
            </div>
          </div>
          <a
            href="https://baps-walkathon-portal.vercel.app"
            style={{ display: "inline-block", marginTop: 32, padding: "16px 40px", background: "#8E191D", color: "#fff", textDecoration: "none", borderRadius: 4, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}
          >
            Go to Walkathon Portal →
          </a>
          <div style={{ marginTop: 16, fontSize: 13, color: "#7a716a" }}>
            Need help? <a href="/contact" style={{ color: "#8E191D", textDecoration: "none" }}>Contact us</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
