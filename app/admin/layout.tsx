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
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  if (!roleRow || roleRow.role !== "admin") {
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
      <AdminNav userEmail={session.user.email ?? ""} />

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
