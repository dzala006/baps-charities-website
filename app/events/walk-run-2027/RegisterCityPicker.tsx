"use client";

import { useMemo, useState } from "react";

type CenterOption = { slug: string; city: string; state: string };

export default function RegisterCityPicker({
  centers,
  registrationUrlTemplate,
}: {
  centers: CenterOption[];
  registrationUrlTemplate: string | null;
}) {
  const [slug, setSlug] = useState<string>("");

  const sortedCenters = useMemo(
    () => [...centers].sort((a, b) => a.city.localeCompare(b.city)),
    [centers],
  );

  const href = useMemo(() => {
    if (!slug || !registrationUrlTemplate) return null;
    return registrationUrlTemplate.replace("{slug}", slug);
  }, [slug, registrationUrlTemplate]);

  const inp: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #c9c2bb",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    background: "#fff",
  };
  const lbl: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#7a716a",
    display: "block",
    marginBottom: 8,
  };

  return (
    <div style={{ background: "#2a241f", borderRadius: 4, padding: 36 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#CF3728",
          marginBottom: 12,
        }}
      >
        2027 Registration
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: 28,
          color: "#fff",
          margin: "0 0 8px",
          lineHeight: 1.15,
        }}
      >
        Register for Walk | Run 2027.
      </h2>
      <p style={{ fontSize: 13, color: "#b1aca7", lineHeight: 1.65, marginBottom: 28 }}>
        Pick your city and we&apos;ll take you to the registration form on our portal.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label htmlFor="city" style={lbl}>
            Your city
          </label>
          <select
            id="city"
            name="city"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={inp}
          >
            <option value="">Select your city…</option>
            {sortedCenters.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.city}, {c.state}
              </option>
            ))}
          </select>
        </div>

        <a
          href={href ?? "#"}
          aria-disabled={!href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!href) {
              e.preventDefault();
            }
          }}
          style={{
            padding: "15px 0",
            background: href ? "#8E191D" : "#5c5249",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: href ? "pointer" : "not-allowed",
            marginTop: 4,
            textAlign: "center",
            textDecoration: "none",
            pointerEvents: href ? "auto" : "none",
          }}
        >
          {href ? "Register Now →" : "Pick a city to continue"}
        </a>
      </div>

      <p style={{ fontSize: 11, color: "#5c5249", marginTop: 16, lineHeight: 1.5 }}>
        Registration runs on our portal. Opens in a new tab.
      </p>
    </div>
  );
}
