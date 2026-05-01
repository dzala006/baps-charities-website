"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export interface WalkathonOption {
  year: number;
  name: string;
}

export interface CenterOption {
  slug: string;
  city: string;
  state: string;
}

interface Props {
  walkathons: WalkathonOption[];
  centers: CenterOption[];
  selectedWalkathon: string | null;
  selectedCenter: string | null;
}

/**
 * URL-persisted filter dropdowns for /leaderboard. Selecting a value pushes a
 * new search-string onto the route; the server page re-renders with the new
 * filter applied. The component itself doesn't hold any UI state — it reads
 * the active filter directly from the URL via useSearchParams so back/forward
 * + refresh stay coherent.
 */
export default function LeaderboardFilters({
  walkathons,
  centers,
  selectedWalkathon,
  selectedCenter,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: "walkathon" | "center", value: string) {
    const next = new URLSearchParams(params?.toString() ?? "");
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    startTransition(() => {
      router.push(qs ? `/leaderboard?${qs}` : "/leaderboard");
    });
  }

  function clearAll() {
    startTransition(() => {
      router.push("/leaderboard");
    });
  }

  const hasFilters = Boolean(selectedWalkathon || selectedCenter);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "flex-end",
        marginBottom: 24,
        opacity: pending ? 0.6 : 1,
        transition: "opacity 120ms ease",
      }}
    >
      <label style={fieldStyle}>
        <span style={labelStyle}>Walkathon</span>
        <select
          value={selectedWalkathon ?? ""}
          onChange={(e) => update("walkathon", e.target.value)}
          style={selectStyle}
          aria-label="Filter by walkathon year"
        >
          <option value="">All walkathons</option>
          {walkathons.map((w) => (
            <option key={w.year} value={String(w.year)}>
              {w.name} ({w.year})
            </option>
          ))}
        </select>
      </label>

      <label style={fieldStyle}>
        <span style={labelStyle}>Center</span>
        <select
          value={selectedCenter ?? ""}
          onChange={(e) => update("center", e.target.value)}
          style={selectStyle}
          aria-label="Filter by center"
        >
          <option value="">All centers</option>
          {centers.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.city}, {c.state}
            </option>
          ))}
        </select>
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          style={clearButtonStyle}
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  minWidth: 220,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#7a716a",
};

const selectStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: 14,
  color: "#2a241f",
  background: "#fff",
  border: "1px solid #c9c2bb",
  borderRadius: 4,
  fontFamily: "inherit",
  appearance: "auto",
};

const clearButtonStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#8E191D",
  background: "transparent",
  border: "1px solid #c9c2bb",
  borderRadius: 4,
  cursor: "pointer",
  height: 40,
};
