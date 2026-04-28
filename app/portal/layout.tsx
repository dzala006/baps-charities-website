import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { signOutPortalAction } from "../actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/portal");
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Account";

  const NAV_LINKS = [
    { label: "Dashboard", href: "/portal" },
    { label: "Donations", href: "/portal/donations" },
    { label: "Profile", href: "/portal/profile" },
    { label: "Volunteer", href: "/portal/volunteer" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f3", display: "flex", flexDirection: "column" }}>
      {/* Portal top nav */}
      <nav
        style={{
          background: "#2a241f",
          borderBottom: "2px solid #8E191D",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#b1aca7",
              textDecoration: "none",
            }}
          >
            BAPS Charities
          </Link>
          <span style={{ color: "#4C4238", fontSize: 14, margin: "0 4px" }}>/</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#E4DFDA",
            }}
          >
            Donor Portal
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#b1aca7",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            style={{
              marginLeft: 8,
              paddingLeft: 16,
              borderLeft: "1px solid #4C4238",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13, color: "#7a716a" }}>{displayName}</span>
            <form action={signOutPortalAction}>
              <button
                type="submit"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#CF3728",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "48px 32px" }}>
        {children}
      </main>
    </div>
  );
}
