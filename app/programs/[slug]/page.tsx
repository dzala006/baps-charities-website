import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import { PROGRAMS, getProgramById } from "../../lib/programs-data";

const PROGRAM_IMAGES: Record<string, string> = {
  // Health: health awareness lecture (Detroit 2025)
  health: "https://media.bapscharities.org/2025/04/21194012/01.-detroit_anxiety_hlecture_2025-1620x1080.jpg",
  // Education: community education event
  education: "https://media.bapscharities.org/2026/01/15014851/DP1_6696-1024x683.jpg",
  // Environment: tree planting at Kinale Forest, Kenya — Earth Day 2026
  environment: "https://media.bapscharities.org/2026/04/25052608/NairobiKenya_Kinale_Tree_Planting_04_2026_06-1024x683.jpg",
  // Humanitarian: winter blanket / disaster relief drive
  humanitarian: "https://media.bapscharities.org/2023/07/23221910/ADL_Winter_Blanket_20230723_101154-1440x1080.jpg",
  // Community: community program / walkathon
  community: "https://media.bapscharities.org/2026/01/15014830/DP1_6670-1024x683.jpg",
  // Blood drives: blood donation drive event (2014 archive)
  "blood-drives": "https://media.bapscharities.org/2014/01/Blood-Donation-7-26-20097-1024x685.jpg",
  // Food drives: Cambridge food drive 2024
  "food-drives": "https://media.bapscharities.org/2024/12/25133554/Cambridge_Food-Drive_2024_01-1024x615.jpg",
  // Career & scholarship: community education event
  "career-education": "https://media.bapscharities.org/2026/01/15014851/DP1_6696-1024x683.jpg",
};

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramById(slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.name} Programs`,
    description: program.body,
    alternates: {
      canonical: `https://baps-charities-website.vercel.app/programs/${slug}`,
    },
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getProgramById(slug);
  if (!program) notFound();

  const otherPrograms = PROGRAMS.filter((p) => p.id !== program.id);

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ background: program.color, color: "#fff", padding: "96px 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Breadcrumb
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Programs", href: "/programs" },
              { label: program.name },
            ]}
          />
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginTop: 24, marginBottom: 16 }}>
            What We Do
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(40px, 5vw, 80px)", lineHeight: 1.05, margin: 0, letterSpacing: "-0.015em" }}>
            {program.name}
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 26, color: "rgba(255,255,255,0.85)", marginTop: 20, marginBottom: 0, maxWidth: 700 }}>
            {program.tagline}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "#2a241f" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px", display: "flex", gap: 48, flexWrap: "wrap" }}>
          {program.stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: program.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64 }}>
          <div>
            <div style={{ marginBottom: 48 }}>
              <div style={{ position: "relative", aspectRatio: "16/9", width: "100%", overflow: "hidden", borderRadius: 4 }}>
                <Image
                  src={PROGRAM_IMAGES[program.id] ?? "https://media.bapscharities.org/2026/01/15014830/DP1_6670-1024x683.jpg"}
                  alt={program.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 1280px"
                  priority
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {program.fullDescription.map((para, i) => (
                <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: "#4C4238", margin: 0 }}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Initiatives */}
            <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 16 }}>Key Initiatives</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {program.initiatives.map((item) => (
                  <div key={item} style={{ padding: "12px 0", borderBottom: "1px solid #f0ebe6", display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#2a241f" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: program.color, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Get involved CTA */}
            <div style={{ background: program.color, color: "#fff", borderRadius: 4, padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Get Involved</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, margin: "8px 0 12px", lineHeight: 1.2 }}>Volunteer with {program.name}</h3>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: 20 }}>
                All BAPS Charities programs are fully volunteer-driven. Find your nearest center and get involved today.
              </div>
              <Link
                href="/get-involved"
                style={{ display: "block", padding: "14px 0", background: "rgba(0,0,0,0.25)", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
              >
                Volunteer Now →
              </Link>
            </div>

            {/* Donate CTA */}
            <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 12 }}>Support {program.name}</div>
              <p style={{ fontSize: 13, color: "#4C4238", lineHeight: 1.65, marginBottom: 16 }}>
                Your donation directly funds {program.name.toLowerCase()} programs in communities across North America.
              </p>
              <Link
                href="/donate"
                style={{ display: "block", padding: "13px 0", background: "#2a241f", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", textAlign: "center" }}
              >
                Donate →
              </Link>
            </div>
          </aside>
        </div>

        {/* Other programs */}
        <div style={{ maxWidth: 1280, margin: "80px auto 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 24 }}>Other Programs</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {otherPrograms.map((p) => (
              <Link
                key={p.id}
                href={`/programs/${p.id}`}
                style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 20, textDecoration: "none", display: "block" }}
              >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, marginBottom: 12 }} />
                <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#7a716a", marginTop: 6, lineHeight: 1.5 }}>{p.tagline}</div>
                <div style={{ fontSize: 11, color: p.color, fontWeight: 600, marginTop: 12 }}>Learn more →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
