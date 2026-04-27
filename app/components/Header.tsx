"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "News", href: "/news" },
  { label: "Find a Center", href: "/find-a-center" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.utility}>
        <div className={styles.utilityInner}>
          <button className={styles.locPicker}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>North America</span>
            <span className={styles.locChange}>Change Location ▾</span>
          </button>

          <div className={styles.utilityLinks}>
            <Link href="/portal" className={styles.utilityLink}>My Account</Link>
            <Link href="/sponsorship" className={styles.utilityLink}>Sponsorship</Link>
            <Link href="/contact" className={styles.utilityLink}>Contact</Link>
            <button className={styles.utilityLink} aria-label="Search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <header className={`${styles.bar} ${scrolled ? styles.barScrolled : ""}`}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/assets/logo-color.png"
            alt="BAPS Charities"
            width={160}
            height={44}
            priority
            style={{ height: 44, width: "auto" }}
          />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.link} ${pathname === item.href ? styles.linkActive : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/donate" className={styles.cta}>
          Donate
        </Link>
      </header>
    </div>
  );
}
