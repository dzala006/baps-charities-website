import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import Link from "next/link";

export const metadata = { title: "Create Account — BAPS Charities" };

async function signUp(formData: FormData) {
  "use server";
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/signup?success=check_email");
}

interface PageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error;
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
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: "#7a716a", marginTop: 8 }}>
            Join the BAPS Charities donor community
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

          {success === "check_email" ? (
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
              <strong>Almost there!</strong>
              <br />
              Check your email and click the confirmation link to activate your account.
            </div>
          ) : (
            <form action={signUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label
                  htmlFor="full_name"
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
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  autoComplete="name"
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
                  minLength={8}
                  autoComplete="new-password"
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
                <p style={{ fontSize: 12, color: "#b1aca7", marginTop: 6 }}>
                  Minimum 8 characters
                </p>
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
                Create Account
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#7a716a" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#8E191D", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
