import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "../components/PageShell";
import Breadcrumb from "../components/Breadcrumb";
import { PROGRAMS } from "../lib/programs-data";

const PROGRAM_IMAGES: Record<string, string> = {
  health: "https://media.bapscharities.org/2025/04/21194012/01.-detroit_anxiety_hlecture_2025-1620x1080.jpg",
  education: "https://media.bapscharities.org/2026/01/15014841/DP1_6642-1024x683.jpg",
  environment: "https://media.bapscharities.org/2021/04/20210313-Sat-015740-PM-001-1280x720.jpg",
  humanitarian: "https://media.bapscharities.org/2023/07/23221910/ADL_Winter_Blanket_20230723_101154-1440x1080.jpg",
  community: "https://media.bapscharities.org/2026/01/15014830/DP1_6670-1024x683.jpg",
};

export const metadata: Metadata = {
  title: "Programs",
  description: "BAPS Charities delivers health, education, environmental, humanitarian, and community empowerment programs across North America.",
};

export default function ProgramsPage() {
  return (
    <PageShell>
      <section style={{ background: "#faf7f3", padding: "88px 32px 56px", borderBottom: "1px solid #E4DFDA" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 16 }}>What We Do</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px,5vw,68px)", lineHeight: 1.05, margin: 0, color: "#2a241f", maxWidth: 1000 }}>Five pillars of service. One unbroken thread.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#4C4238", maxWidth: 720, marginTop: 24 }}>Health, education, environment, humanitarian relief, and community empowerment. Each program operates independently — and every one is rooted in the same principle: service is the highest form of worship.</p>
        </div>
      </section>
      <section style={{ padding: "64px 32px 96px", background: "#faf7f3" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {PROGRAMS.map((p, i) => (
            <article key={p.id} style={{ background: "#fff", borderRadius: 4, overflow: "hidden", display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 1.4fr" : "1.4fr 1fr", boxShadow: "0 2px 6px rgba(76,66,56,0.08)" }}>
              <div style={{ order: i % 2 === 0 ? 0 : 1, position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                <Image src={PROGRAM_IMAGES[p.id] ?? PROGRAM_IMAGES.community} alt={`${p.name} program`} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 400px" />
              </div>
              <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: p.color, borderRadius: 4 }} />
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: p.color }}>0{i + 1} · {p.name}</div>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, lineHeight: 1.1, margin: 0, color: "#2a241f" }}>{p.tagline}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4C4238", marginTop: 18 }}>{p.body}</p>
                <div style={{ display: "flex", gap: 32, marginTop: 28, paddingTop: 24, borderTop: "1px solid #E4DFDA" }}>
                  {p.stats.map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: p.color, lineHeight: 1 }}>{s.num}</div>
                      <div style={{ fontSize: 11, color: "#7a716a", marginTop: 6, letterSpacing: "0.04em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Initiatives</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    {p.initiatives.map(it => <span key={it} style={{ fontSize: 12, padding: "6px 12px", background: "#faf7f3", color: "#4C4238", borderRadius: 999 }}>{it}</span>)}
                  </div>
                  <Link href={`/programs/${p.id}`} style={{ fontSize: 13, color: p.color, fontWeight: 700, letterSpacing: "0.04em", textDecoration: "none" }}>
                    Learn more about {p.name} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
