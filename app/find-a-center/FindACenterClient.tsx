"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Center = {
  id: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  region_id: number;
};

type Region = {
  id: number;
  name: string;
};

type Props = {
  centers: Center[];
  regions: Region[];
};

export default function FindACenterClient({ centers, regions }: Props) {
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return centers.filter((c) => {
      const matchesQuery = !q || c.city.toLowerCase().includes(q) || c.state.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      const matchesRegion = activeRegion === null || c.region_id === activeRegion;
      return matchesQuery && matchesRegion;
    });
  }, [centers, query, activeRegion]);

  const byState = useMemo(() => {
    const map: Record<string, Center[]> = {};
    for (const c of filtered) {
      if (!map[c.state]) map[c.state] = [];
      map[c.state].push(c);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <section style={{ background: "#faf7f3", padding: "64px 32px 96px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Search + filter bar */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40, alignItems: "center" }}>
          <div style={{ display: "flex", flex: "1 1 360px", maxWidth: 480 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, state, or center name…"
              style={{ flex: 1, padding: "14px 20px", background: "#fff", border: "1px solid #c9c2bb", borderRadius: "4px 0 0 4px", fontSize: 15, color: "#2a241f", outline: "none", fontFamily: "var(--font-body)" }}
            />
            <button
              onClick={() => setQuery("")}
              style={{ padding: "14px 18px", background: "#2a241f", color: "#fff", border: "none", borderRadius: "0 4px 4px 0", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              {query ? "✕" : "Search"}
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveRegion(null)}
              style={{ padding: "10px 18px", background: activeRegion === null ? "#2a241f" : "#fff", color: activeRegion === null ? "#fff" : "#4C4238", border: "1px solid #c9c2bb", borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              All Regions
            </button>
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)}
                style={{ padding: "10px 18px", background: activeRegion === r.id ? "#8E191D" : "#fff", color: activeRegion === r.id ? "#fff" : "#4C4238", border: "1px solid " + (activeRegion === r.id ? "#8E191D" : "#c9c2bb"), borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary */}
        <div style={{ fontSize: 13, color: "#7a716a", marginBottom: 32, fontWeight: 600, letterSpacing: "0.04em" }}>
          {filtered.length === centers.length
            ? `${centers.length} centers across the United States`
            : `${filtered.length} center${filtered.length !== 1 ? "s" : ""} found`}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#7a716a" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "#2a241f", marginBottom: 12 }}>No centers found</div>
            <p style={{ fontSize: 15 }}>Try a different city or state name.</p>
            <button onClick={() => { setQuery(""); setActiveRegion(null); }} style={{ marginTop: 20, padding: "12px 24px", background: "#8E191D", color: "#fff", border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {byState.map(([state, stateCenters]) => (
              <div key={state}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8E191D", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #E4DFDA" }}>{state}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {stateCenters.map((c) => (
                    <Link
                      key={c.id}
                      href={`/centers/${c.slug}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 4, color: "#2a241f", textDecoration: "none", background: "#fff", border: "1px solid #E4DFDA", fontSize: 14 }}
                    >
                      <span style={{ fontWeight: 500 }}>{c.city}</span>
                      <span style={{ fontSize: 11, color: "#8E191D", fontWeight: 600 }}>View →</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
