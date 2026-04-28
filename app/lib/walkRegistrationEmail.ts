import "server-only";

/**
 * Confirmation email HTML for walkathon registration. Themed for the
 * BAPS Charities website (red brand, not portal's orange). Adapted
 * from the portal's renderConfirmationHtml in
 * supabase/functions/register-walker/index.ts.
 */

export const REGISTRATION_SUBJECT = "Your BAPS Walk 2026 registration is confirmed";

export interface ConfirmationEmailArgs {
  participantName: string;
  centerName: string;
  centerCity: string | null;
  centerState: string | null;
  walkathonName: string;
  walkDate: string; // ISO date string
  shirtSize: string;
  guardianName: string | null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderConfirmationHtml(args: ConfirmationEmailArgs): string {
  const {
    participantName,
    centerName,
    centerCity,
    centerState,
    walkathonName,
    walkDate,
    shirtSize,
    guardianName,
  } = args;

  const cityState =
    centerCity && centerState
      ? `${centerCity}, ${centerState}`
      : centerCity ?? centerState ?? "";

  const greeting = guardianName
    ? `Dear ${escapeHtml(guardianName)} — thank you for registering ${escapeHtml(participantName)}.`
    : `Dear ${escapeHtml(participantName)} — thank you for registering.`;

  let walkDateNice = walkDate;
  try {
    walkDateNice = new Date(walkDate + "T00:00:00Z").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    // fall back to ISO
  }

  const guardianBlock = guardianName
    ? `<hr style="border-color:#E4DFDA;margin:20px 0;" />
       <p style="color:#7a716a;font-size:12px;line-height:18px;margin:0 0 12px;">This registration was completed by ${escapeHtml(guardianName)} on behalf of ${escapeHtml(participantName)}. To remove this registration at any time, contact your local BAPS Charities center.</p>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#faf7f3;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
  <div style="border-bottom:2px solid #8E191D;margin-bottom:24px;padding-bottom:12px;">
    <p style="color:#8E191D;font-weight:700;font-size:18px;margin:0;letter-spacing:0.04em;">BAPS Charities</p>
  </div>
  <h1 style="color:#2a241f;font-size:22px;margin:0 0 16px;font-weight:700;">Registration confirmed</h1>
  <p style="color:#4C4238;font-size:14px;line-height:22px;margin:0 0 12px;">${greeting}</p>
  <p style="color:#4C4238;font-size:14px;line-height:22px;margin:0 0 12px;">You are registered for ${escapeHtml(walkathonName)} with BAPS Charities ${escapeHtml(centerName)}${cityState ? ` (${escapeHtml(cityState)})` : ""}. We look forward to walking with you.</p>
  <hr style="border-color:#E4DFDA;margin:20px 0;" />
  <p style="color:#7a716a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Walker</p>
  <p style="color:#2a241f;font-size:15px;margin:0 0 12px;font-weight:500;">${escapeHtml(participantName)}</p>
  <p style="color:#7a716a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Walk date</p>
  <p style="color:#2a241f;font-size:15px;margin:0 0 12px;font-weight:500;">${escapeHtml(walkDateNice)}</p>
  <p style="color:#7a716a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Center</p>
  <p style="color:#2a241f;font-size:15px;margin:0 0 12px;font-weight:500;">${escapeHtml(centerName)}${cityState ? ` — ${escapeHtml(cityState)}` : ""}</p>
  <p style="color:#7a716a;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Shirt size</p>
  <p style="color:#2a241f;font-size:15px;margin:0 0 12px;font-weight:500;">${escapeHtml(shirtSize)}</p>
  <hr style="border-color:#E4DFDA;margin:20px 0;" />
  <h2 style="color:#2a241f;font-size:16px;margin:0 0 16px;font-weight:700;">What to bring</h2>
  <p style="color:#4C4238;font-size:14px;line-height:22px;margin:0 0 12px;">Comfortable shoes, a refillable water bottle, sunscreen, and a positive spirit. Shirt pickup details will be sent closer to the event.</p>
  ${guardianBlock}
  <hr style="border-color:#E4DFDA;margin:20px 0;" />
  <p style="color:#7a716a;font-size:11px;line-height:18px;margin:0;">BAPS Charities is a registered 501(c)(3) nonprofit. For questions about your registration, reply to this email.</p>
</div>
</body></html>`;
}
