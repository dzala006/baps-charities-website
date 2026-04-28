import Link from "next/link";
import Image from "next/image";

export default function SpiritOfService() {
  return (
    <section style={{ padding: "100px 32px", background: "#faf7f3" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8E191D" }}>Our Mission</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 52, color: "#4C4238", lineHeight: 1.1, margin: 0 }}>The Spirit of Service</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#2a241f", margin: 0, maxWidth: 540 }}>The spirit of BAPS Charities is expressed through the selfless service of our volunteers across the globe. This spirit is integral to creating better communities, nations, and ultimately a more peaceful and just world.</p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#2a241f", margin: 0, maxWidth: 540 }}>We invite you to explore the Spirit of Service in action and learn about the activities of our volunteers around the world.</p>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <Link href="/about" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "13px 26px", background: "#8E191D", color: "#fff", borderRadius: 4, textDecoration: "none" }}>About Us</Link>
            <Link href="/programs" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "13px 8px", color: "#4C4238", textDecoration: "none" }}>What We Do →</Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", boxShadow: "0 14px 36px rgba(76,66,56,0.18)" }}>
            <Image
              src="https://media.bapscharities.org/2026/01/15014830/DP1_6670-1024x683.jpg"
              alt="The Spirit of Service"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
          <div style={{ fontSize: 12, color: "#7a716a", fontStyle: "italic" }}>The Spirit of Service</div>
        </div>
      </div>
    </section>
  );
}
