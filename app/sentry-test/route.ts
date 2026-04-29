import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // P4 (scoped roles): admin gate reads user_role_assignments
  const { data: assignment } = await supabase
    .from("user_role_assignments")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("role", "national_admin")
    .maybeSingle();

  if (!assignment) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Capture a test error to Sentry
  const testError = new Error("Sentry test error — triggered manually from /sentry-test");
  Sentry.captureException(testError);

  return NextResponse.json({
    ok: true,
    message: "Test error captured and sent to Sentry.",
    timestamp: new Date().toISOString(),
  });
}
