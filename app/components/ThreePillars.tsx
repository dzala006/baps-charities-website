import Link from "next/link";

const ITEMS = [
  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Upcoming Events", body: "BAPS Charities has an active calendar of events throughout the year and at centers across the world. Take a moment to explore our various events and find one to participate in near you.", cta: "View Events", href: "/events" },
  { icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", title: "Ongoing Projects", body: "BAPS Charities has initiated several ongoing projects to serve our communities such as educational scholarships. Learn about these projects and how they are designed to serve.", cta: "View Projects", href: "/programs" },
  { icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9", title: "Global Partner Efforts", body: "BAPS Charities has formally partnered with charitable institutions globally to support a variety of initiatives in the areas we serve. Learn more about the work of the charities we support.", cta: "View Partners", href: "/get-involved" },
];

export default function ThreePillars() {
  return (
    <section style={{ padding: "100px 32px", background: "#E4DFDA" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto 56px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8E191D" }}>How To Engage</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, color: "#4C4238", lineHeight: 1.1, margin: 0 }}>Three ways to take part</h2>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {ITEMS.map(item => (
          <article key={item.title} style={{ background: "#fdfcfa", border: "1px solid #d4ccc4", borderRadius: 12, padding: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 999, background: "#f1dcdd", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E191D" strokeWidth="1.6"><path d={item.icon}/></svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 26, color: "#4C4238", margin: 0 }}>{item.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "#2a241f", margin: 0, flex: 1 }}>{item.body}</p>
            <Link href={item.href} style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8E191D", textDecoration: "none", marginTop: 8 }}>{item.cta} →</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
