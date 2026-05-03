import { getSupabaseAdmin } from "@/lib/supabase";
import { RISK_META, type RiskLevel } from "@/lib/assessment";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  concern: string | null;
  risk_level: RiskLevel;
  total_score: number;
  created_at: string;
}

const RISK_BG: Record<RiskLevel, string> = {
  low: "#5B8A6B",
  moderate: "#C9A24C",
  high: "#C26A3D",
  very_high: "#9C3D2E",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminLeadsPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const leads = (data ?? []) as LeadRow[];

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] px-4 py-6 md:px-8 md:py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-ink)] tracking-tight">
            Leads
          </h1>
          <div className="text-sm text-[var(--color-ink-mute)]">
            {leads.length} รายการล่าสุด
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-[var(--color-risk-high)] text-[var(--color-risk-high)] text-sm">
            ผิดพลาด: {error.message}
          </div>
        )}

        {leads.length === 0 && !error && (
          <div className="p-8 text-center bg-[var(--color-card)] border border-[var(--color-line)] rounded-xl text-[var(--color-ink-mute)]">
            ยังไม่มี lead เข้ามา
          </div>
        )}

        <div className="bg-[var(--color-card)] border border-[var(--color-line)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg)] text-[var(--color-ink-soft)] text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">วันที่</th>
                  <th className="text-left px-4 py-3 font-semibold">ชื่อ</th>
                  <th className="text-left px-4 py-3 font-semibold">เบอร์</th>
                  <th className="text-left px-4 py-3 font-semibold">ความเสี่ยง</th>
                  <th className="text-right px-4 py-3 font-semibold">คะแนน</th>
                  <th className="text-left px-4 py-3 font-semibold">เรื่อง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {leads.map((lead) => {
                  const meta = RISK_META[lead.risk_level];
                  const bg = RISK_BG[lead.risk_level];
                  return (
                    <tr key={lead.id} className="align-top">
                      <td className="px-4 py-3 text-[var(--color-ink-mute)] whitespace-nowrap">
                        {fmtDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink)] font-medium">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-soft)] font-[var(--font-latin)]">
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                          style={{ background: bg }}
                        >
                          {meta.short}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-ink)] font-bold font-[var(--font-latin)]">
                        {lead.total_score}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-ink-soft)] max-w-md">
                        {lead.concern ?? <span className="text-[var(--color-ink-mute)]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-xs text-[var(--color-ink-mute)] text-center">
          แสดง 500 รายการล่าสุด · ข้อมูลแบบ realtime (ไม่มี cache)
        </div>
      </div>
    </main>
  );
}
