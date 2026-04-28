import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "My Donations — BAPS Charities Portal",
  robots: { index: false, follow: false },
};

export default async function DonationsPage() {
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

  const userEmail = user?.email ?? "";

  const { data: donations } = userEmail
    ? await supabase
        .from("donations")
        .select("stripe_payment_id, amount_usd, designation, created_at")
        .eq("donor_email", userEmail)
        .order("created_at", { ascending: false })
    : { data: [] };

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
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
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
            Donation History
          </h1>
          <PrintButton />
        </div>
      </div>

      {donations && donations.length > 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 140px",
              padding: "12px 24px",
              background: "#f1ede9",
              borderBottom: "1px solid #E4DFDA",
            }}
          >
            {["Designation", "Date", "Amount"].map((col) => (
              <div
                key={col}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7a716a",
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Table rows */}
          {donations.map((d, i) => (
            <div
              key={d.stripe_payment_id ?? i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 140px",
                padding: "16px 24px",
                borderBottom: i < donations.length - 1 ? "1px solid #E4DFDA" : "none",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 15, color: "#2a241f", fontWeight: 500 }}>
                {d.designation ?? "General Fund"}
              </div>
              <div style={{ fontSize: 14, color: "#7a716a" }}>
                {d.created_at
                  ? new Date(d.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#2a241f" }}>
                ${d.amount_usd != null ? Number(d.amount_usd).toFixed(2) : "—"}
              </div>
            </div>
          ))}

          {/* Total */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 140px",
              padding: "14px 24px",
              background: "#f1ede9",
              borderTop: "2px solid #E4DFDA",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#2a241f",
                gridColumn: "1 / 3",
              }}
            >
              Total Donated
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#8E191D" }}>
              $
              {donations
                .reduce((sum, d) => sum + (d.amount_usd != null ? Number(d.amount_usd) : 0), 0)
                .toFixed(2)}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid #E4DFDA",
            borderRadius: 6,
            padding: 48,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 16, color: "#7a716a" }}>
            No donations found for this account.
          </p>
          <a
            href="/donate"
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "12px 28px",
              background: "#8E191D",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Make a Gift
          </a>
        </div>
      )}

      <p style={{ fontSize: 13, color: "#b1aca7", marginTop: 20 }}>
        For tax receipts or questions about your giving history, please{" "}
        <a href="/contact" style={{ color: "#8E191D", textDecoration: "none" }}>
          contact us
        </a>
        .
      </p>
    </div>
  );
}
