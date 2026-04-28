export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { supabase } from "@/app/lib/supabase";

// ---------------------------------------------------------------------------
// Lazy Stripe instance — only constructed on first request, not at build time
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

// ---------------------------------------------------------------------------
// Mailgun receipt email
// ---------------------------------------------------------------------------

async function sendReceiptEmail(params: {
  donorEmail: string;
  donorName: string;
  amountUsd: number;
  designation: string;
  stripePaymentId: string;
}): Promise<void> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return;

  const { donorEmail, donorName, amountUsd, designation, stripePaymentId } = params;
  const receiptNumber = `BC-${new Date().getFullYear()}-${stripePaymentId
    .slice(-6)
    .toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Donation Receipt</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#8E191D;padding:24px 32px;">
            <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.04em;">BAPS Charities</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#333;">Dear ${donorName || "Valued Donor"},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
              Thank you for your generous gift to BAPS Charities. Please find your official donation receipt below.
            </p>
            <!-- Receipt table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;border-radius:4px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f9f9f9;">
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#777;border-bottom:1px solid #e0e0e0;">Receipt #</td>
                <td style="padding:12px 16px;font-size:13px;color:#333;border-bottom:1px solid #e0e0e0;">${receiptNumber}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#777;border-bottom:1px solid #e0e0e0;">Amount</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#333;border-bottom:1px solid #e0e0e0;">$${amountUsd.toFixed(2)}</td>
              </tr>
              <tr style="background:#f9f9f9;">
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#777;border-bottom:1px solid #e0e0e0;">Designation</td>
                <td style="padding:12px 16px;font-size:13px;color:#333;border-bottom:1px solid #e0e0e0;">${designation}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#777;">EIN</td>
                <td style="padding:12px 16px;font-size:13px;color:#333;">26-1530694</td>
              </tr>
            </table>
            <p style="margin:0 0 24px;font-size:13px;color:#555;line-height:1.6;background:#fff8e1;border-left:3px solid #f9a825;padding:12px 16px;border-radius:2px;">
              Your gift is fully tax-deductible to the extent allowed by law. No goods or services were provided in exchange for this contribution.
            </p>
            <p style="margin:0;font-size:13px;color:#888;">
              With gratitude,<br>
              <strong style="color:#333;">BAPS Charities</strong>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f4;padding:20px 32px;border-top:1px solid #e0e0e0;text-align:center;">
            <a href="https://bapscharities.org" style="color:#8E191D;text-decoration:none;font-size:12px;">bapscharities.org</a>
            <span style="color:#bbb;font-size:12px;margin:0 8px;">|</span>
            <span style="color:#aaa;font-size:12px;">BAPS Charities, Inc. &mdash; EIN 26-1530694</span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const form = new FormData();
  form.append("from", `BAPS Charities <noreply@${domain}>`);
  form.append("to", donorEmail);
  form.append("subject", "Your gift to BAPS Charities — receipt enclosed");
  form.append("html", html);

  const credentials = Buffer.from(`api:${apiKey}`).toString("base64");

  await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}` },
    body: form,
  });
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

export async function POST(req: Request): Promise<Response> {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new Response("Stripe not configured", { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    const stripeClient = getStripe();
    event = stripeClient.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return new Response(`Webhook verification failed: ${message}`, {
      status: 400,
    });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;

    const donorEmail = pi.metadata?.donor_email ?? "";
    const donorName = pi.metadata?.donor_name ?? "";
    const designation = pi.metadata?.designation ?? "General";
    const amountUsd = pi.amount / 100;

    const { error: dbError } = await supabase
      .from("donations")
      .upsert(
        {
          stripe_payment_id: pi.id,
          amount_cents: pi.amount,
          amount_usd: amountUsd,
          currency: pi.currency,
          designation,
          donor_email: donorEmail,
          donor_name: donorName,
          created_at: new Date().toISOString(),
        },
        { onConflict: "stripe_payment_id", ignoreDuplicates: true }
      );

    if (dbError) {
      console.error("Failed to insert donation into Supabase:", dbError);
      // Don't return an error response — Stripe should not retry for a DB error
    }

    if (donorEmail) {
      try {
        await sendReceiptEmail({
          donorEmail,
          donorName,
          amountUsd,
          designation,
          stripePaymentId: pi.id,
        });
      } catch (mailErr) {
        console.error("Failed to send receipt email:", mailErr);
      }
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.error(
      "PaymentIntent failed:",
      pi.id,
      pi.last_payment_error?.message
    );
  }

  return Response.json({ received: true });
}
