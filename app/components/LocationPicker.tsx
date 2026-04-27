import Link from "next/link";

const COUNTRIES = [
  { country: "United States", count: 92 },
  { country: "Canada", count: 16 },
  { country: "United Kingdom", count: 18 },
  { country: "Australia", count: 6 },
  { country: "Kenya", count: 2 },
  { country: "India", count: 1 },
];

export default function LocationPicker() {
  return (
    <section style={{ padding: "100px 32px", background: "#4C4238", color: "#E4DFDA" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#CF3728" }}>Find a Center Near You</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 48, color: "#fff", lineHeight: 1.1, margin: 0 }}>Service, in your community.</h2>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "#b1aca7", margin: "0 auto", maxWidth: 600 }}>BAPS Charities operates in over 140 cities across 11 countries. Find your local center to discover events, projects, and ways to volunteer near you.</p>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", background: "#fdfcfa", borderRadius: 8, padding: "6px 6px 6px 18px", gap: 10, maxWidth: 580, width: "100%", alignSelf: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7a716a" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-body)", fontSize: 15, color: "#2a241f", padding: "10px 0", background: "transparent" }} placeholder="Search for a city or country" />
          <button style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "12px 22px", background: "#8E191D", color: "#fff", borderRadius: 6, border: "none", cursor: "pointer" }}>Search</button>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
          {COUNTRIES.map(c => (
            <Link key={c.country} href="/find-a-center" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(228,223,218,0.08)", border: "1px solid rgba(228,223,218,0.2)", borderRadius: 999, color: "#E4DFDA", fontSize: 13, textDecoration: "none" }}>
              <span>{c.country}</span>
              <span style={{ fontSize: 11, color: "#b1aca7", background: "rgba(228,223,218,0.1)", padding: "2px 8px", borderRadius: 999 }}>{c.count}</span>
            </Link>
          ))}
          <Link href="/find-a-center" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(228,223,218,0.08)", border: "1px solid rgba(207,55,40,0.4)", borderRadius: 999, color: "#CF3728", fontSize: 13, textDecoration: "none" }}>View all 11 countries →</Link>
        </div>
      </div>
    </section>
  );
}
