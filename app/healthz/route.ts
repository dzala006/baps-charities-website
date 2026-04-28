import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function checkSupabase(): Promise<{ ok: boolean; latencyMs: number }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return { ok: false, latencyMs: 0 };
  const start = Date.now();
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok || res.status === 400, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

async function checkStripe(): Promise<{ ok: boolean; latencyMs: number }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { ok: true, latencyMs: 0 }; // Stripe not configured — not an error
  const start = Date.now();
  try {
    const res = await fetch("https://api.stripe.com/v1/charges?limit=1", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

async function checkMailgun(): Promise<{ ok: boolean; latencyMs: number }> {
  const key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!key || !domain) return { ok: true, latencyMs: 0 }; // Not configured — not an error
  const start = Date.now();
  try {
    const credentials = Buffer.from(`api:${key}`).toString("base64");
    const res = await fetch(`https://api.mailgun.net/v3/domains/${domain}`, {
      headers: { Authorization: `Basic ${credentials}` },
      signal: AbortSignal.timeout(5000),
    });
    return { ok: res.ok, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}

export async function GET() {
  const [supabase, stripe, mailgun] = await Promise.all([
    checkSupabase(),
    checkStripe(),
    checkMailgun(),
  ]);

  const allOk = supabase.ok && stripe.ok && mailgun.ok;

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      checks: { supabase, stripe, mailgun },
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  );
}
