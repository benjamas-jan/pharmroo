import type { RiskLevel } from "@/lib/assessment";
import { RISK_META } from "@/lib/assessment";

interface NotifyInput {
  name: string;
  phone: string;
  concern: string | null;
  riskLevel: RiskLevel;
  totalScore: number;
}

// Posts a lead to LEAD_NOTIFICATION_WEBHOOK if configured.
// Payload format covers Slack (`text`) and Discord (`content`) at once,
// so a single webhook URL works for either.
export async function notifyNewLead(lead: NotifyInput): Promise<void> {
  const url = process.env.LEAD_NOTIFICATION_WEBHOOK;
  if (!url) return;

  const meta = RISK_META[lead.riskLevel];
  const lines = [
    `📩 *Lead ใหม่จาก Pharmroo*`,
    `ชื่อ: ${lead.name}`,
    `เบอร์: ${lead.phone}`,
    `ความเสี่ยง: ${meta.emoji} ${meta.label} (${lead.totalScore} คะแนน)`,
    lead.concern ? `เรื่อง: ${lead.concern}` : null,
  ].filter(Boolean);

  const text = lines.join("\n");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, content: text }),
    });
    if (!res.ok) {
      console.warn("[notifyNewLead] webhook returned", res.status);
    }
  } catch (e) {
    console.warn("[notifyNewLead] webhook failed:", e);
  }
}
