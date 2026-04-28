"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Hero.module.css";

const SLIDES = [
  {
    tag: "Walk-Run · USA",
    title: "Join Us for Walk 2026 in USA",
    cta: "Find an Event Near You",
    ctaHref: "/events",
    image: "https://media.bapscharities.org/2026/01/23113836/Embrace-the-Spirit-of-Service-Walk-for-Your-Community.jpg",
  },
  {
    tag: "Food Bank · Canada",
    title: "Over 662,000 Pounds of Food Donated to Food Banks Across Canada",
    cta: "Read the Story",
    ctaHref: "/news",
    image: "https://media.bapscharities.org/2025/12/30193436/00_BAPS-Charities-Food-Bank-2025.jpg",
  },
  {
    tag: "Disaster Relief · Tanzania",
    title: "Disaster Relief in Hanang, Tanzania",
    cta: "View Report",
    ctaHref: "/reports",
    image: "https://media.bapscharities.org/2023/07/23221910/ADL_Winter_Blanket_20230723_101154-1440x1080.jpg",
  },
  {
    tag: "Medical Camp · Uganda",
    title: "Free Medical Check-up Camp in Kampala",
    cta: "View Details",
    ctaHref: "/events",
    image: "https://media.bapscharities.org/2025/08/07101118/Uganda_Medical-Camp_07_2025_07.jpg",
  },
];

const ADVANCE_MS = 6000;

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const hovered = useRef(false);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  useEffect(() => {
    const tick = setInterval(() => {
      if (!hovered.current && !paused) {
        setIdx((i) => (i + 1) % SLIDES.length);
      }
    }, ADVANCE_MS);
    return () => clearInterval(tick);
  }, [paused]);

  const slide = SLIDES[idx];

  return (
    <section className={styles.section}>
      <div className={styles.eyebrowBar}>
        <span className={styles.tagline}>In the Spirit of Service</span>
        <span className={styles.divider} />
        <span className={styles.eyebrowMeta}>Featured Stories Around the World</span>
      </div>

      <div
        className={styles.stage}
        onMouseEnter={() => { hovered.current = true; }}
        onMouseLeave={() => { hovered.current = false; }}
      >
        {/* Image pane */}
        <div className={styles.imagePane}>
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: "cover" }}
            priority={idx === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={styles.imageOverlay} />
          <span className={styles.imageBadge}>{slide.tag}</span>
        </div>

        {/* Text pane */}
        <div className={styles.textPane}>
          <p className={styles.kicker}>Featured</p>
          <h1 className={styles.headline}>{slide.title}</h1>
          <p className={styles.lead}>
            BAPS Charities mobilizes volunteers across continents to deliver health,
            education, environmental, and humanitarian programs — sustained by the
            quiet, structured work of thousands.
          </p>
          <div className={styles.actions}>
            <Link href={slide.ctaHref} className={styles.primaryCta}>
              {slide.cta}
            </Link>
            <Link href="/get-involved" className={styles.secondaryCta}>
              Get Involved
            </Link>
          </div>

          <div className={styles.dots} role="tablist" aria-label="Slide navigation">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === idx}
                aria-label={`Go to slide ${i + 1}`}
                className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
                onClick={() => setIdx(i)}
              />
            ))}
            <button
              onClick={togglePause}
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              className={styles.pauseBtn}
            >
              {paused ? (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                  <path d="M0 0l10 6-10 6z" />
                </svg>
              ) : (
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="0" width="3" height="12" /><rect x="7" y="0" width="3" height="12" />
                </svg>
              )}
            </button>
            <span className={styles.counter} aria-hidden="true">
              {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
