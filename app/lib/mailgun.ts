import "server-only";

/**
 * Mailgun helper. Single integration point for all transactional email
 * the website sends (newsletter welcome, walkathon registration
 * confirmation, future). Returns a clear `sent` flag so callers can
 * decide what to do when keys are missing — production registrations
 * still complete (row inserted) even without email; the missing-key
 * case is logged loudly. See docs/MAILGUN_ACTIVATION_RUNBOOK.md.
 */
export interface MailgunMessage {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string;
}

export interface MailgunResult {
  sent: boolean;
  reason?: "no_api_key" | "send_failed";
  status?: number;
}

export async function sendMailgunEmail(msg: MailgunMessage): Promise<MailgunResult> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    console.log(
      `[mailgun] MAILGUN_API_KEY or MAILGUN_DOMAIN missing — skipping email to ${msg.to} (subject: ${msg.subject})`,
    );
    return { sent: false, reason: "no_api_key" };
  }

  const form = new FormData();
  form.append("from", `BAPS Charities <noreply@${domain}>`);
  form.append("to", msg.to);
  form.append("subject", msg.subject);
  form.append("html", msg.html);
  if (msg.replyTo) form.append("h:Reply-To", msg.replyTo);
  if (msg.cc) form.append("cc", msg.cc);

  const credentials = Buffer.from(`api:${apiKey}`).toString("base64");

  try {
    const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
      body: form,
    });
    if (!res.ok) {
      console.warn(`[mailgun] non-OK status ${res.status} sending to ${msg.to}`);
      return { sent: false, reason: "send_failed", status: res.status };
    }
    return { sent: true, status: res.status };
  } catch (err) {
    console.error("[mailgun] fetch failed", err);
    return { sent: false, reason: "send_failed" };
  }
}
