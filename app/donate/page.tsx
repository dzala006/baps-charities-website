import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import DonateForm from "./DonateForm";

export const metadata: Metadata = {
  title: "Donate | BAPS Charities",
  description:
    "100% volunteer-run. Your donation goes directly to programs — health, education, environment, and humanitarian relief.",
};

export default function DonatePage() {
  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;

  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#E4DFDA", padding: "64px 32px 80px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Donate" }]} />
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728", marginBottom: 16 }}>Donate</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(36px,4vw,56px)", lineHeight: 1.1, margin: 0, color: "#fff" }}>
                Every dollar serves. <em style={{ color: "#CF3728", fontStyle: "italic" }}>Zero overhead.</em>
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "#b1aca7", marginTop: 24 }}>
                BAPS Charities is 100% volunteer-run. Your donation goes directly to programs — not to fundraising consultants, executive salaries, or office leases.
              </p>
              <div style={{ marginTop: 40, padding: 28, background: "#3d3530", borderLeft: "3px solid #CF3728" }}>
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 20, lineHeight: 1.5, color: "#fff" }}>
                  &ldquo;$108 funds a free health screening for one family of four — including labs and a primary-care consult.&rdquo;
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 32 }}>
                {[
                  { n: "95¢", l: "of every $1 to programs" },
                  { n: "4-Star", l: "Charity Navigator rating" },
                  { n: "501(c)(3)", l: "Tax-deductible gifts" },
                ].map((b) => (
                  <div key={b.l}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728" }}>{b.n}</div>
                    <div style={{ fontSize: 12, color: "#b1aca7", marginTop: 4 }}>{b.l}</div>
                  </div>
                ))}
              </div>
            </div>
            {stripeConfigured ? (
              <DonateForm />
            ) : (
              <div style={{
                background: "#3d3530",
                borderRadius: 4,
                padding: 40,
                textAlign: "center",
                border: "1px solid #5a4e47"
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>🤲</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#fff", fontWeight: 400, margin: "0 0 12px" }}>
                  Donations coming soon
                </h2>
                <p style={{ color: "#b1aca7", fontSize: 15, lineHeight: 1.6, margin: "0 0 24px" }}>
                  We are finalizing our secure payment setup. In the meantime, please contact us at{" "}
                  <a href="mailto:info@bapscharities.org" style={{ color: "#CF3728" }}>info@bapscharities.org</a>{" "}
                  to arrange a donation.
                </p>
                <div style={{ fontSize: 12, color: "#7a716a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  EIN 26-1530694 · 501(c)(3) nonprofit
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
