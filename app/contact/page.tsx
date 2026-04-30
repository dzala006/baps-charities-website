import type { Metadata } from "next";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with BAPS Charities. We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>Contact</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", letterSpacing: "-0.01em", maxWidth: 900 }}>
            We&apos;d love to hear from you.
          </h1>
        </div>
      </section>

      <section style={{ padding: "64px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64 }}>
          {/* Contact info column */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 28, color: "#2a241f", margin: 0 }}>North America Headquarters</h3>
            <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.8, color: "#4C4238" }}>
              <div style={{ fontWeight: 600, color: "#2a241f" }}>BAPS Charities</div>
              <div>112 North Main Street, Suite 301</div>
              <div>Robbinsville, NJ 08561</div>
              <div style={{ marginTop: 8 }}><a href="tel:+18882273881" style={{ color: "#4C4238", textDecoration: "none" }}>1-888-227-3881</a></div>
              <div style={{ marginTop: 8 }}><a href="mailto:info@bapscharities.org" style={{ color: "#8E191D" }}>info@bapscharities.org</a></div>
            </div>

            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2a241f", marginBottom: 8 }}>Canada Office</div>
              <div style={{ fontSize: 15, lineHeight: 1.8, color: "#4C4238" }}>
                <div>61 Claireville Drive</div>
                <div>Toronto, Ontario M9W5Z7</div>
                <div style={{ marginTop: 8 }}>CRA Registration: 864015441RR0001</div>
              </div>
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

            <div style={{ marginTop: 40, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>Follow us</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Instagram", "@BAPSCharities", "https://instagram.com/BAPSCharities"],
                ["Facebook", "facebook.com/BAPScharities", "https://facebook.com/BAPScharities"],
                ["Twitter / X", "@bapscharities", "https://twitter.com/bapscharities"],
                ["YouTube", "youtube.com/bapscharities", "https://youtube.com/bapscharities"],
              ].map(([platform, handle, href]) => (
                <a key={platform} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#8E191D", textDecoration: "none", display: "flex", gap: 8 }}>
                  <span style={{ color: "#7a716a", minWidth: 90 }}>{platform}</span>
                  <span>{handle}</span>
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </PageShell>
  );
}
