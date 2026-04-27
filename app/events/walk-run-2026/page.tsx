"use client";

import { useState } from "react";
import PageShell from "../../components/PageShell";
import Breadcrumb from "../../components/Breadcrumb";
import PhotoPlaceholder from "../../components/PhotoPlaceholder";

const CONFIRMED_CITIES = [
  { city: "Irving (Dallas)", state: "TX", date: "Sun, May 31 · 8:00 AM", venue: "Levy Event Plaza, 501 E Las Colinas Blvd" },
  { city: "West Chicago", state: "IL", date: "Sat, May 30", venue: "McCaslin Park" },
  { city: "Boca Raton", state: "FL", date: "Sat, May 31", venue: "Mary Lou Berger Pavilion, South County Regional Park" },
  { city: "Sacramento", state: "CA", date: "Sat, Jun 6 · 9:00 AM", venue: "Stone Creek Community Park, Rancho Cordova" },
];

const ALL_CITIES: Record<string, string[]> = {
  "Alabama": ["Dothan", "Huntsville", "Montgomery"],
  "Arizona": ["Phoenix", "Tucson"],
  "Arkansas": ["Little Rock"],
  "California": ["Bakersfield", "Dublin", "Fresno", "Los Angeles", "Milpitas", "Sacramento", "San Diego", "San Francisco", "San Jose", "SF Valley", "Tracy"],
  "Colorado": ["Denver"],
  "Connecticut": ["Hartford", "New Haven"],
  "Delaware": ["Delaware"],
  "Florida": ["Jacksonville", "Melbourne", "Miami", "Orlando", "Tampa"],
  "Georgia": ["Albany", "Atlanta", "Augusta", "Calhoun", "Kennesaw", "Perry", "Savannah"],
  "Illinois": ["Bartlett", "Bloomington", "Chicago", "Crystal Lake", "West Chicago"],
  "Indiana": ["Evansville", "Indianapolis", "Munster"],
  "Kansas": ["Kansas City"],
  "Kentucky": ["Louisville"],
  "Louisiana": ["New Orleans"],
  "Maryland": ["Baltimore"],
  "Massachusetts": ["Boston", "South Boston", "Springfield", "Westborough"],
  "Michigan": ["Detroit", "Sterling Heights"],
  "Minnesota": ["Minneapolis"],
  "Mississippi": ["Jackson"],
  "Missouri": ["St. Louis"],
  "New Jersey": ["Atlantic City", "Bridgewater", "Cherry Hill", "Clifton", "Edison", "Jersey City", "Parsippany", "Robbinsville"],
  "New York": ["Albany", "Long Island", "New York City", "Syracuse", "Westchester"],
  "North Carolina": ["Charlotte", "Fayetteville", "Greensboro", "Raleigh"],
  "Ohio": ["Cincinnati", "Cleveland", "Columbus", "Dayton"],
  "Oregon": ["Portland"],
  "Pennsylvania": ["Allentown", "Downingtown", "Harrisburg", "Lansdale", "Philadelphia", "Pittsburgh", "Scranton", "Warrington"],
  "South Carolina": ["Columbia", "Florence", "Greenville", "Myrtle Beach"],
  "Tennessee": ["Chattanooga", "Knoxville", "Memphis", "Nashville"],
  "Texas": ["Austin", "Beaumont", "Corpus Christi", "Dallas/Irving", "Houston", "Lubbock", "San Antonio"],
  "Utah": ["Salt Lake City"],
  "Virginia": ["Chantilly", "Newport News", "Richmond", "Roanoke", "Staunton"],
  "Washington": ["Seattle"],
  "Washington D.C.": ["Washington D.C."],
  "West Virginia": ["Morgantown"],
  "Wisconsin": ["Milwaukee"],
};

const FAQS = [
  {
    q: "Why are you doing the Walk?",
    a: "The BAPS Charities Walk brings our community together for a greater purpose. It promotes health, unity, and selfless service while raising awareness about the positive impact we make locally and nationally.",
  },
  {
    q: "Who can participate?",
    a: "Anyone can join — it's open to the community.",
  },
  {
    q: "Where does the money go?",
    a: "Fundraising efforts support community initiatives by BAPS Charities and local beneficiaries in your city.",
  },
  {
    q: "How many walkers are expected?",
    a: "Close to 50,000 walkers across North America.",
  },
  {
    q: "What's unique about your walk?",
    a: "The BAPS Charities Walk is fully volunteer-driven. Thousands of volunteers organize and manage the event across cities in North America.",
  },
  {
    q: "What is the registration fee?",
    a: "$15 per person for individuals or teams.",
  },
  {
    q: "What is the event format?",
    a: "A 3K trail walk/run, open to all ages, with free parking at all venues.",
  },
];

export default function WalkRun2026Page() {
  const [tab, setTab] = useState("about");

  return (
    <PageShell>
      {/* Hero */}
      <section style={{ position: "relative", height: 560, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "#4C4238" }}>
          <PhotoPlaceholder label="community walkers at sunrise — BAPS Charities Walk | Run" full />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(42,36,31,0.2) 0%, rgba(42,36,31,0.85) 70%, rgba(42,36,31,0.95) 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "64px 32px 56px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff" }}>
          <Breadcrumb tone="light" items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: "Walk | Run 2026" }]} />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <span style={{ padding: "6px 14px", background: "#8E191D", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", borderRadius: 4 }}>Annual Event</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "#E4DFDA" }}>Spring 2026 · 50+ Cities Nationwide</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(48px, 6vw, 88px)", lineHeight: 1, margin: 0, letterSpacing: "-0.015em", maxWidth: 1100 }}>
            BAPS Charities Walk | Run 2026
          </h1>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 26, color: "#E4DFDA", marginTop: 16, marginBottom: 0 }}>The Spirit of Service</p>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: "#2a241f", borderBottom: "1px solid #3a322b" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "flex", gap: 48, flexWrap: "wrap" }}>
          {[
            ["50,000+", "walkers nationwide"],
            ["50+", "cities"],
            ["35+", "states"],
            ["$15", "registration per person"],
            ["20+", "years running"],
          ].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#CF3728", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7a716a", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky action bar */}
      <div style={{ position: "sticky", top: 64, zIndex: 40, background: "#fff", borderBottom: "1px solid #E4DFDA", boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#4C4238" }}>3K walk/run · All ages · Free parking</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ padding: "12px 22px", background: "#fff", border: "1px solid #c9c2bb", color: "#2a241f", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 4 }}>↗ Share</button>
            <a href="https://walk2026.na.bapscharities.org" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 22px", background: "#8E191D", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", borderRadius: 4, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Register Now →
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #E4DFDA", marginBottom: 48 }}>
            {[["about", "About the Walk"], ["cities", "Cities & Dates"], ["experience", "Event Experience"], ["faq", "FAQ"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{ padding: "14px 20px", background: "transparent", border: "none", borderBottom: tab === k ? "3px solid #8E191D" : "3px solid transparent", color: tab === k ? "#8E191D" : "#4C4238", fontSize: 13, fontWeight: tab === k ? 700 : 500, letterSpacing: "0.04em", cursor: "pointer", marginBottom: -1 }}>
                {l}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64 }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1.45, color: "#2a241f", margin: 0, fontStyle: "italic", maxWidth: 720 }}>
                  An annual volunteer-driven event uniting communities across North America for over 20 years — raising funds for local beneficiaries while promoting health and selfless service.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238", marginTop: 28 }}>
                  The BAPS Charities Walk | Run is fully volunteer-driven. Thousands of volunteers organize and manage the event across cities in North America. Every city has its own local beneficiaries — from children's hospitals to homelessness support organizations — selected by the community.
                </p>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238", marginTop: 16 }}>
                  Bring your family. Bring your team. Walk for someone you love. At 3K, the trail is welcoming for all ages and abilities.
                </p>

                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, color: "#2a241f", marginTop: 48, marginBottom: 16 }}>What to expect</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                  {[
                    ["Volunteer welcome table", "Name tag, t-shirt pickup, and registration on arrival"],
                    ["Opening ceremony", "Speeches from the stage, ribbon cutting, and community celebration"],
                    ["3K Walk / Run", "Trail through your local park — all ages, all abilities"],
                    ["Sponsor booths", "Local partners and community organizations along the route"],
                    ["Oversized check presentation", "Beneficiary receives funds on stage during the walk"],
                    ["Post-walk family festival", "Community celebration after the walk"],
                  ].map(([h, d]) => (
                    <div key={h} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #E4DFDA" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#8E191D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✓</div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 15 }}>{h}</div>
                        <div style={{ fontSize: 13, color: "#7a716a", marginTop: 2 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "#2a241f", color: "#fff", borderRadius: 4, padding: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#CF3728" }}>Register</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 24, margin: "8px 0 16px", lineHeight: 1.2 }}>Walk with us</h3>
                  <div style={{ fontSize: 15, color: "#b1aca7", lineHeight: 1.6, marginBottom: 20 }}>
                    $15 per person · All ages · 3K trail walk/run · Free parking
                  </div>
                  <a href="https://walk2026.na.bapscharities.org" target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", padding: "16px 0", background: "#CF3728", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
                    Register at walk2026.na.bapscharities.org →
                  </a>
                  <div style={{ fontSize: 11, color: "#b1aca7", marginTop: 12, textAlign: "center" }}>Registration opens per city — check your city's date</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 14 }}>Sample local beneficiaries</div>
                  <div style={{ fontSize: 14, color: "#4C4238", lineHeight: 1.7 }}>
                    <p style={{ margin: 0 }}>Each city supports its own local organizations. In Irving, TX for example:</p>
                    <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
                      <li><strong style={{ color: "#2a241f" }}>Children's Health</strong> — North Texas pediatric healthcare</li>
                      <li><strong style={{ color: "#2a241f" }}>The Main Place</strong> — clothing for teens experiencing homelessness</li>
                    </ul>
                    <p style={{ margin: "10px 0 0 0", fontSize: 13, color: "#7a716a" }}>Local beneficiaries vary by city.</p>
                  </div>
                </div>

                <div style={{ background: "#faf7f3", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a716a", marginBottom: 14 }}>Press & media</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <a href="https://baps.sl/walk-pressrelease" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#8E191D", textDecoration: "none", fontWeight: 600 }}>Download press release →</a>
                    <a href="https://baps.sl/walk-photo-video-guide" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#8E191D", textDecoration: "none", fontWeight: 600 }}>Photo & video guide →</a>
                    <a href="mailto:archive.media@na.baps.org" style={{ fontSize: 13, color: "#8E191D", textDecoration: "none", fontWeight: 600 }}>Media archive: archive.media@na.baps.org</a>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {tab === "cities" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, color: "#2a241f", margin: "0 0 8px" }}>Confirmed 2026 Dates</h2>
              <p style={{ fontSize: 15, color: "#7a716a", marginTop: 0, marginBottom: 40 }}>More cities and dates being added — check <a href="https://walk2026.na.bapscharities.org" target="_blank" rel="noopener noreferrer" style={{ color: "#8E191D" }}>walk2026.na.bapscharities.org</a> for the latest.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 64 }}>
                {CONFIRMED_CITIES.map((c) => (
                  <div key={c.city} style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4, padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 18, color: "#2a241f" }}>{c.city}, {c.state}</div>
                        <div style={{ fontSize: 13, color: "#8E191D", fontWeight: 600, marginTop: 4 }}>{c.date}</div>
                        <div style={{ fontSize: 13, color: "#7a716a", marginTop: 6 }}>{c.venue}</div>
                      </div>
                      <a href="https://walk2026.na.bapscharities.org" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 14px", background: "#8E191D", color: "#fff", borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>Register</a>
                    </div>
                  </div>
                ))}
              </div>

              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, color: "#2a241f", margin: "0 0 32px" }}>All 50+ Host Cities</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                {Object.entries(ALL_CITIES).map(([state, cities]) => (
                  <div key={state}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 8 }}>{state}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {cities.map((city) => (
                        <div key={city} style={{ fontSize: 14, color: "#4C4238" }}>{city}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "experience" && (
            <div style={{ maxWidth: 900 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, color: "#2a241f", margin: "0 0 16px" }}>What Happens at the Walk</h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#4C4238", marginTop: 0, marginBottom: 48 }}>
                Every BAPS Charities Walk | Run follows the same beloved format — built entirely by volunteers in each city.
              </p>
              <div style={{ display: "grid", gap: 0 }}>
                {[
                  ["Arrival & check-in", "Volunteer registration table with name tag and t-shirt pickup for all registered participants."],
                  ["Balloon arch at the start line", "The iconic arch marks the start of the walk — perfect for photos with your team."],
                  ["Opening ceremony", "Speeches from local leaders and BAPS Charities representatives from the main stage."],
                  ["Ribbon cutting", "Official start of the 3K walk/run with a ribbon-cutting ceremony."],
                  ["The walk", "A 3K trail through a local park — walkers, joggers, and families side by side."],
                  ["Sponsor booths along the route", "Local business partners and community organizations set up along the trail."],
                  ["Oversized check presentation", "The highlight: a symbolic check presented to the local beneficiary organization on stage."],
                  ["Post-walk family festival", "Community celebration with activities for all ages after crossing the finish line."],
                ].map(([title, desc], i) => (
                  <div key={title} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 24, padding: "24px 0", borderBottom: "1px solid #E4DFDA" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#8E191D", lineHeight: 1, paddingTop: 4 }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#2a241f", fontSize: 16 }}>{title}</div>
                      <div style={{ fontSize: 14, color: "#7a716a", marginTop: 4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 48 }}>
                <PhotoPlaceholder label="Walk | Run 2026 — event photography placeholder (request originals from media archive)" ratio="16/9" />
                <div style={{ fontSize: 12, color: "#7a716a", marginTop: 8 }}>Photo: request originals from archive.media@na.baps.org</div>
              </div>
            </div>
          )}

          {tab === "faq" && (
            <div style={{ maxWidth: 800 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, color: "#2a241f", margin: "0 0 32px" }}>Common Questions</h2>
              <div>
                {FAQS.map((item, i) => (
                  <details key={i} style={{ borderBottom: "1px solid #E4DFDA", padding: "20px 0" }}>
                    <summary style={{ fontWeight: 600, color: "#2a241f", fontSize: 16, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between" }}>
                      <span>{item.q}</span>
                      <span style={{ color: "#8E191D", flexShrink: 0 }}>+</span>
                    </summary>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: "#4C4238", marginTop: 12, marginBottom: 0 }}>{item.a}</p>
                  </details>
                ))}
              </div>
              <div style={{ marginTop: 40, padding: 28, background: "#fff", border: "1px solid #E4DFDA", borderRadius: 4 }}>
                <div style={{ fontSize: 14, color: "#4C4238" }}>More questions? Email <a href="mailto:info@bapscharities.org" style={{ color: "#8E191D" }}>info@bapscharities.org</a> or visit the official registration site at <a href="https://walk2026.na.bapscharities.org" target="_blank" rel="noopener noreferrer" style={{ color: "#8E191D" }}>walk2026.na.bapscharities.org</a>.</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
