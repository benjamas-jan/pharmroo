"use server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { notifyNewLead } from "@/lib/notify";
import type { RiskLevel } from "@/lib/assessment";

export interface SubmitLeadInput {
  name: string;
  phone: string;
  concern?: string;
  riskLevel: RiskLevel;
  totalScore: number;
}

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

const phoneRe = /^0[6-9]\d{8}$/;

export async function submitLead(input: SubmitLeadInput): Promise<SubmitLeadResult> {
  const name = input.name?.trim() ?? "";
  const phone = (input.phone ?? "").replace(/\D/g, "");
  const concern = input.concern?.trim() || null;

  if (name.length < 2) return { ok: false, error: "กรุณากรอกชื่อ" };
  if (!phoneRe.test(phone)) return { ok: false, error: "เบอร์โทรไม่ถูกต้อง" };

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      concern,
      risk_level: input.riskLevel,
      total_score: input.totalScore,
    });

    if (error) {
      console.error("[submitLead] Supabase error:", error);
      return { ok: false, error: "ไม่สามารถส่งข้อมูลได้ กรุณาลองอีกครั้ง" };
    }

    // Fire-and-forget — don't block the response on the webhook
    notifyNewLead({
      name,
      phone,
      concern,
      riskLevel: input.riskLevel,
      totalScore: input.totalScore,
    });

    return { ok: true };
  } catch (e) {
    console.error("[submitLead] Unexpected error:", e);
    return { ok: false, error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง" };
  }
}
