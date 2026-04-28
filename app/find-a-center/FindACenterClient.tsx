"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Center = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  region_id: string;
  address?: string | null;
};

type Region = {
  id: string;
  name: string;
};

type Props = {
  centers: Center[];
  regions: Region[];
  initialQuery?: string;
};

export default function FindACenterClient({ centers, regions, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return centers.filter((c) => {
      const matchesQuery =
        !q ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q);
      const matchesRegion = activeRegion === null || c.region_id === activeRegion;
      return matchesQuery && matchesRegion;
    });
  }, [centers, query, activeRegion]);

  return (
    <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Search + filter panel */}
        <div style={{ background: "#fff", border: "1px solid #E4DFDA", borderRadius: 8, padding: "28px 28px 24px", marginBottom: 36, boxShadow: "0 2px 12px rgba(42,36,31,0.06)" }}>
          {/* Search row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 300px", maxWidth: 520 }}>
              <svg
                style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#9c9189" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, state, or center name…"
                style={{
                  width: "100%",
                  padding: "13px 16px 13px 42px",
                  background: "#faf7f3",
                  border: "1px solid #c9c2bb",
                  borderRadius: 6,
                  fontSize: 15,
                  color: "#2a241f",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{ padding: "13px 22px", background: "#2a241f", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Clear ✕
              </button>
            )}
          </div>

          {/* Region pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, paddingTop: 20, borderTop: "1px solid #F0EBE6", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9c9189", marginRight: 4 }}>Region:</span>
            <button
              onClick={() => setActiveRegion(null)}
              style={{ padding: "7px 16px", background: activeRegion === null ? "#2a241f" : "transparent", color: activeRegion === null ? "#fff" : "#4C4238", border: "1.5px solid " + (activeRegion === null ? "#2a241f" : "#c9c2bb"), borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer" }}
            >
              All
            </button>
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)}
                style={{ padding: "7px 16px", background: activeRegion === r.id ? "#8E191D" : "transparent", color: activeRegion === r.id ? "#fff" : "#4C4238", border: "1.5px solid " + (activeRegion === r.id ? "#8E191D" : "#c9c2bb"), borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", cursor: "pointer" }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary */}
        <div style={{ fontSize: 13, color: "#7a716a", marginBottom: 24, fontWeight: 500 }}>
          {filtered.length === centers.length
            ? `${centers.length} centers across the United States`
            : `${filtered.length} center${filtered.length !== 1 ? "s" : ""} found`}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#7a716a" }}>
            <div style={{ width: 64, height: 64, background: "#E4DFDA", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7a716a" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "#2a241f", marginBottom: 10 }}>No centers found</div>
            <p style={{ fontSize: 15, maxWidth: 360, margin: "0 auto 24px", lineHeight: 1.6 }}>
              Try a different city or state name, or browse all regions.
            </p>
            <button
              onClick={() => { setQuery(""); setActiveRegion(null); }}
              style={{ padding: "13px 28px", background: "#8E191D", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Show all centers
            </button>
          </div>
        ) : (
          /* Center cards grid */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map((c) => {
              const isHovered = hoveredId === c.id;
              return (
                <Link
                  key={c.id}
                  href={`/centers/${c.slug}`}
                  style={{
                    display: "block",
                    background: "#fff",
                    border: "1px solid " + (isHovered ? "#c9c2bb" : "#E4DFDA"),
                    borderRadius: 8,
                    textDecoration: "none",
                    overflow: "hidden",
                    boxShadow: isHovered ? "0 6px 20px rgba(42,36,31,0.10)" : "none",
                    transform: isHovered ? "translateY(-2px)" : "none",
                    transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
                  }}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Card top accent */}
                  <div style={{ height: 4, background: "linear-gradient(90deg, #8E191D 0%, #CF3728 100%)" }} />

                  <div style={{ padding: "22px 22px 18px" }}>
                    {/* Icon + location */}
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ width: 42, height: 42, background: "#fdf2f2", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E191D" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 400, color: "#2a241f", lineHeight: 1.15 }}>
                          {c.city}
                        </div>
                        <div style={{ fontSize: 13, color: "#7a716a", fontWeight: 500, marginTop: 2 }}>{c.state}</div>
                        {c.name && c.name !== c.city && (
                          <div style={{ fontSize: 12, color: "#9c9189", marginTop: 3 }}>{c.name}</div>
                        )}
                      </div>
                    </div>

                    {/* Address line */}
                    {c.address && (
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 14, padding: "10px 12px", background: "#faf7f3", borderRadius: 6 }}>
                        <svg style={{ flexShrink: 0, marginTop: 1 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9c9189" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="13" y2="13" />
                        </svg>
                        <span style={{ fontSize: 12, color: "#7a716a", lineHeight: 1.5 }}>{c.address}</span>
                      </div>
                    )}

                    {/* CTA row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #F0EBE6" }}>
                      <span style={{ fontSize: 12, color: "#8E191D", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                        View center
                      </span>
                      <div style={{ width: 28, height: 28, background: isHovered ? "#8E191D" : "#fdf2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.18s" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "#fff" : "#8E191D"} strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
