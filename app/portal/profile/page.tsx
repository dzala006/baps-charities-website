import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — BAPS Charities Portal",
  robots: { index: false, follow: false },
};

async function updateProfile(formData: FormData) {
  "use server";
  const fullName = formData.get("full_name") as string;
  const notificationsOptIn = formData.get("notifications_opt_in") === "on";

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

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, notifications_opt_in: notificationsOptIn },
  });

  if (error) {
    redirect(`/portal/profile?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/portal/profile?success=saved");
}

interface PageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error;
  const success = params.success;

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

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";
  const email = user?.email ?? "";
  const notificationsOptIn =
    (user?.user_metadata?.notifications_opt_in as boolean | undefined) ?? false;

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
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
          My Account
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.15,
            color: "#2a241f",
            margin: 0,
          }}
        >
          Profile Settings
        </h1>
      </div>

      <div style={{ maxWidth: 560 }}>
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

          {success === "saved" && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "#f1ede9",
                border: "1px solid #E4DFDA",
                borderRadius: 4,
                color: "#4C4238",
                fontSize: 14,
              }}
            >
              Profile updated successfully.
            </div>
          )}

          <form action={updateProfile} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                defaultValue={fullName}
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
              <div
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  border: "1px solid #E4DFDA",
                  borderRadius: 4,
                  fontSize: 15,
                  color: "#7a716a",
                  background: "#f1ede9",
                  boxSizing: "border-box",
                }}
              >
                {email}
              </div>
              <p style={{ fontSize: 12, color: "#b1aca7", marginTop: 6 }}>
                Email address cannot be changed here.
              </p>
            </div>

            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="notifications_opt_in"
                  defaultChecked={notificationsOptIn}
                  style={{ width: 18, height: 18, accentColor: "#8E191D", cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#2a241f" }}>
                    Email Notifications
                  </div>
                  <div style={{ fontSize: 13, color: "#7a716a", marginTop: 2 }}>
                    Receive updates about events, impact reports, and giving opportunities.
                  </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              style={{
                alignSelf: "flex-start",
                padding: "12px 28px",
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
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
