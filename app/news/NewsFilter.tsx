"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "../lib/news-data";

const CATS = ["All", "Health", "Environment", "Education", "Humanitarian", "Community", "Press"];

interface NewsFilterProps {
  articles: Article[];
}

export default function NewsFilter({ articles }: NewsFilterProps) {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? articles : articles.filter((a) => a.cat === cat);

  return (
    <>
      <div style={{ display: "flex", gap: 6, marginBottom: 40, flexWrap: "wrap" }}>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid #c9c2bb",
              background: cat === c ? "#2a241f" : "#fff",
              color: cat === c ? "#fff" : "#4C4238",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {filtered.map((a, i) => (
          <Link
            key={a.title}
            href={`/news/${a.slug}`}
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr auto",
              gap: 32,
              padding: "28px 0",
              borderTop: "1px solid #E4DFDA",
              borderBottom: i === filtered.length - 1 ? "1px solid #E4DFDA" : "none",
              textDecoration: "none",
              color: "inherit",
              alignItems: "start",
            }}
          >
            <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", borderRadius: "4px 4px 0 0", flexShrink: 0, width: 280 }}>
              <Image src={a.image} alt={a.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 400px" />
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  marginBottom: 12,
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#8E191D",
                  }}
                >
                  {a.cat}
                </span>
                <span style={{ color: "#7a716a" }}>·</span>
                <span style={{ color: "#7a716a" }}>{a.date}</span>
                <span style={{ color: "#7a716a" }}>·</span>
                <span style={{ color: "#7a716a" }}>{a.read}</span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: 1.15,
                  margin: 0,
                  color: "#2a241f",
                }}
              >
                {a.title}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#4C4238", marginTop: 12 }}>
                {a.excerpt}
              </p>
            </div>
            <div style={{ alignSelf: "center", fontSize: 20, color: "#8E191D" }}>→</div>
          </Link>
        ))}
      </div>
    </>
  );
}
