import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const metadata = {
  title: "Admin Dashboard — BAPS Charities",
  robots: { index: false, follow: false },
};

async function getStats() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const [contactRes, donationRes, walkRes, interestRes] = await Promise.all([
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
    supabase.from("donations").select("amount_usd"),
    supabase
      .from("walk_cities")
      .select("id", { count: "exact", head: true })
      .eq("confirmed", true),
    supabase
      .from("walkathon_interest_2027")
      .select("id", { count: "exact", head: true }),
  ]);

  const totalDonations = (donationRes.data ?? []).reduce(
    (sum: number, row: { amount_usd: number | null }) =>
      sum + (row.amount_usd ?? 0),
    0
  );

  return {
    unreadContacts: contactRes.count ?? 0,
    totalDonations,
    confirmedCities: walkRes.count ?? 0,
    interestCount: interestRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Unread Contact Submissions",
      value: stats.unreadContacts.toLocaleString(),
      link: "/admin/contacts",
    },
    {
      label: "Total Donations Received",
      value: `$${stats.totalDonations.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      link: "/admin/donations",
    },
    {
      label: "Confirmed Walk Cities",
      value: stats.confirmedCities.toLocaleString(),
      link: "/admin/walk-cities",
    },
    {
      label: "2027 Interest Registrations",
      value: stats.interestCount.toLocaleString(),
      link: "/admin/interest-2027",
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#CF3728",
            marginBottom: 8,
          }}
        >
          Admin
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display, serif)",
            fontWeight: 400,
            fontSize: 36,
            color: "#2a241f",
            margin: 0,
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#7a716a", marginTop: 8 }}>
          Overview of site activity and data.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          maxWidth: 800,
        }}
      >
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.link}
            style={{
              background: "#ffffff",
              border: "1px solid #E4DFDA",
              borderRadius: 8,
              padding: 24,
              textDecoration: "none",
              display: "block",
              transition: "box-shadow 0.15s",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#7a716a",
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "#CF3728",
                fontFamily: "var(--font-display, serif)",
                letterSpacing: "-0.02em",
              }}
            >
              {card.value}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
