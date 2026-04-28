"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Contacts", href: "/admin/contacts" },
  { label: "Donations", href: "/admin/donations" },
  { label: "Walk Cities", href: "/admin/walk-cities" },
  { label: "Centers", href: "/admin/centers" },
  { label: "Center Events", href: "/admin/center-events" },
  { label: "2027 Interest", href: "/admin/interest-2027" },
  { label: "Sponsorship", href: "/admin/sponsorship" },
];

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 220,
        flexShrink: 0,
        background: "#2a241f",
        display: "flex",
        flexDirection: "column",
        padding: "32px 0",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          padding: "0 24px 28px",
          borderBottom: "1px solid #3d342d",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#CF3728",
            marginBottom: 4,
          }}
        >
          BAPS Charities
        </div>
        <div style={{ fontSize: 14, color: "#b1aca7", fontWeight: 500 }}>
          Admin Console
        </div>
      </div>

      <div style={{ marginTop: 16, flex: 1 }}>
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: 0,
                background: isActive ? "#CF3728" : "transparent",
                color: isActive ? "#ffffff" : "#b1aca7",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          padding: "16px 24px 0",
          borderTop: "1px solid #3d342d",
          fontSize: 12,
          color: "#7a716a",
        }}
      >
        Logged in as
        <br />
        <span style={{ color: "#b1aca7", wordBreak: "break-all" }}>
          {userEmail}
        </span>
      </div>
    </nav>
  );
}
