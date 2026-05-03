import type { RiskLevel } from "@/lib/assessment";
import { RISK_META } from "@/lib/assessment";

interface NotifyInput {
  name: string;
  phone: string;
  concern: string | null;
  riskLevel: RiskLevel;
  totalScore: number;
}

// Sends a lead notification email via Resend if RESEND_API_KEY is set.
// Recipient: LEAD_NOTIFICATION_EMAIL
// Sender:    LEAD_NOTIFICATION_FROM (default: onboarding@resend.dev — works
//            without domain verification but goes to spam more easily.
//            Verify pharmroo.com on Resend and switch to notify@pharmroo.com.)
export async function notifyNewLead(lead: NotifyInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

  const from =
    process.env.LEAD_NOTIFICATION_FROM ?? "Pharmroo <onboarding@resend.dev>";

  const meta = RISK_META[lead.riskLevel];
  const subject = `📩 Lead ใหม่ · ${meta.label} · ${lead.name}`;

  const text = [
    `Lead ใหม่จาก Pharmroo`,
    ``,
    `ชื่อ:        ${lead.name}`,
    `เบอร์:       ${lead.phone}`,
    `ความเสี่ยง:  ${meta.emoji} ${meta.label} (${lead.totalScore} คะแนน)`,
    lead.concern ? `เรื่อง:      ${lead.concern}` : null,
    ``,
    `ดูทั้งหมดที่ /admin/leads`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:-apple-system,system-ui,sans-serif;color:#1F2A24;max-width:480px">
      <h2 style="margin:0 0 12px;font-size:18px">📩 Lead ใหม่จาก Pharmroo</h2>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.6">
        <tr><td style="color:#8A988F;padding-right:12px">ชื่อ</td><td><strong>${escapeHtml(lead.name)}</strong></td></tr>
        <tr><td style="color:#8A988F;padding-right:12px">เบอร์</td><td><a href="tel:${escapeHtml(lead.phone)}" style="color:#3C5A48">${escapeHtml(lead.phone)}</a></td></tr>
        <tr><td style="color:#8A988F;padding-right:12px">ความเสี่ยง</td><td>${meta.emoji} ${meta.label} (${lead.totalScore} คะแนน)</td></tr>
        ${lead.concern ? `<tr><td style="color:#8A988F;padding-right:12px;vertical-align:top">เรื่อง</td><td>${escapeHtml(lead.concern)}</td></tr>` : ""}
      </table>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text, html }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn("[notifyNewLead] Resend returned", res.status, body);
    }
  } catch (e) {
    console.warn("[notifyNewLead] email failed:", e);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
