import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";

export const metadata = { title: "Forgot Password — BAPS Charities" };

async function sendResetEmail(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  });

  // Always redirect to success state to prevent email enumeration
  redirect("/forgot-password?success=sent");
}

interface PageProps {
  searchParams: Promise<{ success?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const success = params.success;

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
            Reset your password
          </h1>
          <p style={{ fontSize: 15, color: "#7a716a", marginTop: 8 }}>
            Enter your email and we&apos;ll send a reset link
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
          {success === "sent" ? (
            <div
              style={{
                padding: "20px 16px",
                background: "#f1ede9",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
                color: "#2a241f",
                fontSize: 15,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              <strong>Check your inbox.</strong>
              <br />
              If that email is registered, you&apos;ll receive a password reset link shortly.
            </div>
          ) : (
            <form action={sendResetEmail} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  Email Address
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
                }}
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#7a716a" }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#8E191D", textDecoration: "none", fontWeight: 500 }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
