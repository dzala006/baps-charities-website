import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";
import { safeNextPath } from "@/app/lib/auth";

export const metadata = { title: "Sign In — BAPS Charities" };

async function signIn(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Validate the post-login redirect is a same-origin path to prevent
  // open-redirect abuse via a crafted `next=https://evil.example`.
  const next = safeNextPath(formData.get("next") as string | null, "/portal");

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

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

interface PageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/portal");
  const error = params.error;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const googleAuthUrl = supabaseUrl
    ? `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=${encodeURIComponent(next)}`
      )}`
    : "#";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf7f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo / brand lockup */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8E191D",
              marginBottom: 12,
            }}
          >
            BAPS Charities
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: 32,
              lineHeight: 1.15,
              color: "#2a241f",
              margin: 0,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: "#7a716a", marginTop: 8 }}>
            Sign in to your donor portal
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            padding: "36px 32px",
          }}
        >
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "#f9e2dd",
                border: "1px solid #CF3728",
                borderRadius: 4,
                color: "#8E191D",
                fontSize: 14,
              }}
            >
              {decodeURIComponent(error)}
            </div>
          )}

          {/* Google sign-in */}
          <a
            href={googleAuthUrl}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              padding: "12px 16px",
              background: "#fff",
              border: "1px solid #E4DFDA",
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              color: "#2a241f",
              textDecoration: "none",
              marginBottom: 24,
              boxSizing: "border-box",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#E4DFDA" }} />
            <span style={{ fontSize: 12, color: "#b1aca7", flexShrink: 0 }}>
              or sign in with email
            </span>
            <div style={{ flex: 1, height: 1, background: "#E4DFDA" }} />
          </div>

          <form action={signIn} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input type="hidden" name="next" value={next} />

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4C4238",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  fontSize: 15,
                  color: "#2a241f",
                  background: "#faf7f3",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#4C4238",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  fontSize: 15,
                  color: "#2a241f",
                  background: "#faf7f3",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <Link
                  href="/forgot-password"
                  style={{ fontSize: 12, color: "#8E191D", textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px 16px",
                background: "#8E191D",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              Sign In
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#7a716a" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#8E191D", textDecoration: "none", fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
