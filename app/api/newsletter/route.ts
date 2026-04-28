import { supabase } from "@/app/lib/supabase";
import { getNewsletterRatelimit } from "@/app/lib/ratelimit";

async function sendWelcomeEmail(email: string): Promise<void> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) {
    console.log(`[newsletter] Mailgun not configured — skipping email to ${email}`);
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#8E191D;padding:24px 32px;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.04em;">BAPS Charities</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#333;">Welcome!</p>
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
              Thank you for signing up! We'll keep you informed about our walk/run events and programs.
            </p>
            <p style="margin:0;font-size:13px;color:#888;">
              With gratitude,<br>
              <strong style="color:#333;">BAPS Charities</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f4f4f4;padding:20px 32px;border-top:1px solid #e0e0e0;text-align:center;">
            <a href="https://bapscharities.org" style="color:#8E191D;text-decoration:none;font-size:12px;">bapscharities.org</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const form = new FormData();
  form.append("from", `BAPS Charities <noreply@${domain}>`);
  form.append("to", email);
  form.append("subject", "Welcome to BAPS Charities updates");
  form.append("html", html);

  const credentials = Buffer.from(`api:${apiKey}`).toString("base64");

  await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}` },
    body: form,
  });
}

export async function POST(req: Request): Promise<Response> {
  // Rate limit: 5 req/min per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  const limiter = getNewsletterRatelimit();
  if (limiter) {
    const { success, limit, remaining, reset } = await limiter.limit(ip);
    if (!success) {
      return Response.json(
        { error: "Too many requests. Please wait a minute and try again." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
            "Retry-After": "60",
          },
        }
      );
    }
  } else {
    console.warn("[newsletter] Rate limiter not configured — UPSTASH_REDIS_REST_URL/TOKEN missing");
  }

  let email: unknown;
  try {
    const body = await req.json();
    email = body?.email;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return Response.json(
      { error: "A valid email address is required" },
      { status: 400 }
    );
  }

  const { error: dbError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (dbError) {
    // Unique constraint violation — already subscribed
    if (
      dbError.code === "23505" ||
      dbError.message?.toLowerCase().includes("unique")
    ) {
      return Response.json({ message: "Already subscribed" });
    }
    console.error("Newsletter insert error:", dbError);
    return Response.json({ error: "Subscription failed. Please try again." }, { status: 500 });
  }

  try {
    await sendWelcomeEmail(email);
  } catch (mailErr) {
    console.error("Failed to send welcome email:", mailErr);
  }

  return Response.json({ success: true });
}
