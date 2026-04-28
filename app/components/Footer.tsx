import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer style={{ background: "#2a241f", color: "#E4DFDA", padding: "80px 32px 32px", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.8fr 1fr 1fr 1fr", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Image src="/assets/logo-color.png" alt="BAPS Charities" width={200} height={55} style={{ filter: "brightness(0) invert(1) opacity(0.95)", marginBottom: 18, width: 200, height: "auto" }} />
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "#CF3728", marginBottom: 12 }}>In the Spirit of Service</div>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "#b1aca7", maxWidth: 360 }}>A global, volunteer-driven nonprofit serving humanity through health, education, environmental, and humanitarian initiatives across 12 countries.</p>
          <a href="tel:+18882273881" style={{ fontSize: 13, color: "#b1aca7", textDecoration: "none", display: "block", marginTop: 8 }}>
            1-888-227-3881
          </a>
          <NewsletterForm />
        </div>
        {[
          { title: "Explore", links: [["Global Home", "/"], ["What We Do", "/programs"], ["Get Involved", "/get-involved"], ["Events", "/events"], ["Find a Center", "/find-a-center"]] },
          { title: "Discover", links: [["News", "/news"], ["Gallery", "/gallery"], ["Reports", "/reports"], ["About Us", "/about"], ["Sponsorship", "/sponsorship"], ["Contact", "/contact"]] },
          { title: "Account", links: [["My Account", "/portal"], ["Donate", "/donate"], ["Find a Fundraiser", "/get-involved"], ["Find an Activity", "/events"]] },
        ].map(col => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", marginBottom: 6 }}>{col.title}</div>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: 13, color: "#b1aca7", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: "64px auto 0", paddingTop: 24, borderTop: "1px solid #5c5249", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, fontSize: 12, color: "#7a716a" }}>
        <div>© 2026 BAPS Charities. A registered 501(c)(3) nonprofit.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Legal Notice", "/terms"], ["Site Map", "/sitemap.xml"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: "#7a716a", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
