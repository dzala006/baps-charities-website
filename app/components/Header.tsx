"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  // Close the drawer on route change. Setting state during render (rather
  // than in an effect) is the React 19 idiom for derived state and avoids
  // the cascading-render lint warning.
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (!supabaseUrl || supabaseUrl === "https://placeholder.supabase.co") return;

    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (!supabaseUrl) return;
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.root}>
      <a href="#main-content" className="skip-link">Skip to content</a>
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
            {isLoggedIn ? (
              <>
                <Link href="/portal" className={styles.utilityLink}>My Account</Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={styles.utilityLink}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className={styles.utilityLink}>Sign in</Link>
            )}
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
            width={210}
            height={58}
            priority
            style={{ height: 58, width: "auto" }}
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

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.drawer} aria-label="Mobile navigation">
          <nav>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.drawerLink} ${pathname === item.href ? styles.drawerLinkActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className={styles.drawerFooter}>
            {isLoggedIn ? (
              <>
                <Link href="/portal" className={styles.drawerUtilLink} onClick={() => setMenuOpen(false)}>My Account</Link>
                <button type="button" className={styles.drawerUtilLink} onClick={() => { setMenuOpen(false); void handleSignOut(); }}>Sign out</button>
              </>
            ) : (
              <Link href="/login" className={styles.drawerUtilLink} onClick={() => setMenuOpen(false)}>Sign in</Link>
            )}
            <Link href="/donate" className={styles.drawerCta} onClick={() => setMenuOpen(false)}>Donate</Link>
          </div>
        </div>
      )}
    </div>
  );
}
