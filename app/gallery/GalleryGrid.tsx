"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY_IMAGES, GALLERY_CATEGORIES, type GalleryCategory } from "../lib/gallery-images";

export default function GalleryGrid() {
  const [active, setActive] = useState<GalleryCategory>("All");

  const filtered =
    active === "All"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === active);

  return (
    <>
      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat as GalleryCategory)}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid #c9c2bb",
              background: active === cat ? "#2a241f" : "#fff",
              color: active === cat ? "#fff" : "#4C4238",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {filtered.map((img) => (
          <div
            key={img.url}
            style={{
              position: "relative",
              aspectRatio: "4/3",
              overflow: "hidden",
              borderRadius: 4,
              background: "#e8e2db",
            }}
          >
            <Image
              src={img.url}
              alt={img.caption}
              fill
              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.72))",
                padding: "28px 16px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#CF3728",
                  marginBottom: 4,
                }}
              >
                {img.category}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: "#fff" }}>{img.caption}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, fontSize: 13, color: "#7a716a", textAlign: "center" }}>
        Showing {filtered.length} of {GALLERY_IMAGES.length} photos
      </div>
    </>
  );
}
