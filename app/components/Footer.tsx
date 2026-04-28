import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import styles from "./Footer.module.css";

const NAV_COLS = [
  { title: "Explore", links: [["Global Home", "/"], ["What We Do", "/programs"], ["Get Involved", "/get-involved"], ["Events", "/events"], ["Find a Center", "/find-a-center"]] },
  { title: "Discover", links: [["News", "/news"], ["Gallery", "/gallery"], ["Reports", "/reports"], ["About Us", "/about"], ["Sponsorship", "/sponsorship"], ["Contact", "/contact"]] },
  { title: "Account", links: [["My Account", "/portal"], ["Donate", "/donate"], ["Find a Fundraiser", "/get-involved"], ["Find an Activity", "/events"]] },
];

const SOCIAL = [
  {
    label: "Facebook",
    href: "https://facebook.com/BAPSCharities",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/bapscharities",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@BAPSCharities",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/BAPSCharities",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.847L1.508 2.25H8.08l4.265 5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/baps-charities",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#2a241f", color: "#E4DFDA", padding: "80px 32px 32px", fontFamily: "var(--font-body)" }}>
      <div className={styles.grid}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Image
            src="/assets/logo-color.png"
            alt="BAPS Charities"
            width={200}
            height={55}
            style={{ filter: "brightness(0) invert(1) opacity(0.95)", marginBottom: 18, width: 200, height: "auto" }}
          />
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15, color: "#CF3728", marginBottom: 12 }}>In the Spirit of Service</div>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "#b1aca7", maxWidth: 360, margin: 0 }}>
            A global, volunteer-driven nonprofit serving humanity through health, education, environmental, and humanitarian initiatives across 12 countries.
          </p>
          <a href="tel:+18882273881" style={{ fontSize: 13, color: "#b1aca7", textDecoration: "none", display: "block", marginTop: 10 }}>
            1-888-227-3881
          </a>

          <div className={styles.social}>
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={styles.socialIcon}>
                {s.icon}
              </a>
            ))}
          </div>

          <NewsletterForm />
        </div>

        {NAV_COLS.map(col => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", marginBottom: 6 }}>{col.title}</div>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: 13, color: "#b1aca7", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <div>© 2026 BAPS Charities. A registered 501(c)(3) nonprofit.</div>
        <div className={styles.bottomLinks}>
          {[["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"], ["Legal Notice", "/terms"], ["Site Map", "/sitemap.xml"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: "#7a716a", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
