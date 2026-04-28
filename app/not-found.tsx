import Link from "next/link";
import PageShell from "./components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", minHeight: "70vh", display: "flex", alignItems: "center", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(80px, 15vw, 160px)", lineHeight: 1, color: "#E4DFDA", fontWeight: 400, letterSpacing: "-0.03em" }}>404</div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16, marginTop: 8 }}>Page not found</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.1, margin: 0, color: "#2a241f" }}>
                We couldn&apos;t find that page.
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#4C4238", marginTop: 20, maxWidth: 480 }}>
                The page you&apos;re looking for may have moved or no longer exists. Use the links below to find what you need.
              </p>
              <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href="/"
                  style={{ padding: "14px 28px", background: "#8E191D", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  Go Home
                </Link>
                <Link
                  href="/find-a-center"
                  style={{ padding: "14px 28px", background: "#fff", color: "#2a241f", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  Find a Center
                </Link>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "About Us", href: "/about", desc: "Our mission and history" },
                { label: "Programs", href: "/programs", desc: "5 pillars of service" },
                { label: "Events", href: "/events", desc: "Walk | Run 2026 and more" },
                { label: "Donate", href: "/donate", desc: "Support our mission" },
                { label: "Get Involved", href: "/get-involved", desc: "9 ways to help" },
                { label: "Contact", href: "/contact", desc: "Get in touch" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: "18px 20px", textDecoration: "none", display: "block" }}
                >
                  <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#7a716a", marginTop: 4 }}>{item.desc}</div>
                  <div style={{ fontSize: 11, color: "#8E191D", fontWeight: 600, marginTop: 8 }}>→</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
