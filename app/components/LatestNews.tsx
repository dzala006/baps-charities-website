import Link from "next/link";

const NEWS = [
  { date: "Apr 2026", loc: "Kinale Forest, Kenya", title: "BAPS Charities marked Earth Day 2026 by planting 2,000 trees at Kinale Forest.", tag: "Environment" },
  { date: "Apr 2026", loc: "Cambridge, ON", title: "Health lecture in Cambridge, ON raised awareness on Sleep health.", tag: "Health" },
  { date: "Apr 2026", loc: "Regina, SK", title: "Health lecture in Regina, SK raised awareness on Sleep health.", tag: "Health" },
  { date: "Apr 2026", loc: "Toronto, ON", title: "Health lecture in Toronto raised awareness on Sleep and Heart health.", tag: "Health" },
  { date: "Mar 2026", loc: "Brandon, MB", title: "Women's health lecture in Brandon, MB on Sleep awareness.", tag: "Health" },
  { date: "Mar 2026", loc: "Scarborough, ON", title: "Health lecture in Scarborough, ON on Sleep & wellness.", tag: "Health" },
];

export default function LatestNews() {
  return (
    <section style={{ padding: "100px 32px", background: "#fdfcfa", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8E191D", marginBottom: 10 }}>From The Field</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, color: "#4C4238", margin: 0, lineHeight: 1.1 }}>Latest News</h2>
        </div>
        <Link href="/news" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8E191D", textDecoration: "none", paddingBottom: 10 }}>More News →</Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {NEWS.map((n, i) => (
          <Link key={i} href="/news" style={{ display: "grid", gridTemplateColumns: "180px 1fr 24px", gap: 32, alignItems: "center", padding: "22px 4px", borderTop: "1px solid #E4DFDA", textDecoration: "none", color: "#2a241f" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8E191D" }}>{n.date}</span>
              <span style={{ fontSize: 13, color: "#7a716a" }}>{n.loc}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a" }}>{n.tag}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#4C4238", lineHeight: 1.35 }}>{n.title}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E191D" strokeWidth="1.6"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
