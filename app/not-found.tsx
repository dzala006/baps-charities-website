import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "./components/PageShell";

export const metadata: Metadata = { title: "Page Not Found | BAPS Charities" };

export default function NotFound() {
  return (
    <PageShell>
      <section style={{ background: "#2a241f", color: "#fff", padding: "120px 32px 96px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 80, fontFamily: "var(--font-display)", color: "#CF3728", lineHeight: 1 }}>404</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(28px,3vw,42px)", margin: "16px 0 20px", color: "#fff" }}>
            Page not found
          </h1>
          <p style={{ fontSize: 16, color: "#b1aca7", lineHeight: 1.7, marginBottom: 40 }}>
            The page you are looking for may have moved or no longer exists.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/", label: "Home" },
              { href: "/donate", label: "Donate" },
              { href: "/find-a-center", label: "Find a Center" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ padding: "12px 28px", background: href === "/donate" ? "#8E191D" : "transparent", color: "#fff", border: "1px solid " + (href === "/donate" ? "#8E191D" : "#5a4e47"), borderRadius: 4, textDecoration: "none", fontSize: 14, fontWeight: 600, letterSpacing: "0.05em" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
