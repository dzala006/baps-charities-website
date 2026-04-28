import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Interest2027Client from "./Interest2027Client";

export const metadata = {
  title: "2027 Interest — Admin",
  robots: { index: false, follow: false },
};

type InterestRow = {
  id: string;
  full_name: string;
  email: string;
  city: string | null;
  registered_at: string;
};

async function getData() {
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

  const { data } = await supabase
    .from("walkathon_interest_2027")
    .select("*")
    .order("registered_at", { ascending: false });

  const rows = (data as InterestRow[]) ?? [];

  // Build city breakdown
  const cityCount: Record<string, number> = {};
  rows.forEach((r) => {
    const city = r.city ?? "Unknown";
    cityCount[city] = (cityCount[city] ?? 0) + 1;
  });

  const cityBreakdown = Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .map(([city, count]) => ({ city, count }));

  return { rows, cityBreakdown };
}

export default async function Interest2027Page() {
  const { rows, cityBreakdown } = await getData();
  const mailgunConfigured = !!process.env.MAILGUN_API_KEY;

  return (
    <Interest2027Client
      rows={rows}
      cityBreakdown={cityBreakdown}
      mailgunConfigured={mailgunConfigured}
    />
  );
}
