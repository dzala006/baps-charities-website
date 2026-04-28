import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import AdminNav from "./AdminNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
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
        setAll() {
          // read-only in server component rendering — no-op
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // P4 (scoped roles): admin gate now reads user_role_assignments. The legacy
  // user_roles table is still present (bridge period) but unauthoritative.
  // See ../../baps-walkathon-portal/docs/SCOPED_ROLES_DESIGN.md.
  const { data: assignment } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "national_admin")
    .maybeSingle();

  if (!assignment) {
    redirect("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "var(--font-body, Inter, sans-serif)",
      }}
    >
      <AdminNav userEmail={user.email ?? ""} />

      <main
        style={{
          flex: 1,
          background: "#faf7f3",
          padding: 32,
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
