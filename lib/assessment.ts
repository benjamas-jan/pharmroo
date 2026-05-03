// Assessment data + scoring logic. Ported 1:1 from design/assessment-data.jsx.
// Thai CPG Obesity 2568/2025 thresholds. Do not "simplify" the formulas.

export type Gender = "male" | "female" | "other";
export type Water = "0-2" | "3-5" | "6-8" | "8+";
export type SweetCount = 0 | 1 | 2 | 3;
export type SweetLevel = "low" | "normal" | "high";
export type Unsweet = "0" | "1-2" | "3-4" | "5+";
export type Alcohol = "none" | "social" | "regular" | "daily";
export type Breakfast = "daily" | "often" | "sometimes" | "never";
export type Vegetable = "half_plate" | "quarter" | "side" | "rarely";
export type Supplement = "yes" | "no";
export type Exercise = "150+" | "60-150" | "<60" | "none";
export type Sleep = "7-9" | "6-7" | "<6" | ">9";
export type Stress = "low" | "medium" | "high" | "very_high";
export type RiskLevel = "low" | "moderate" | "high" | "very_high";

export interface Answers {
  gender?: Gender;
  weight?: number;
  height?: number;
  age?: number;
  waist?: number;
  waistUnknown?: boolean;
  water?: Water;
  sweetCount?: SweetCount;
  sweetLevel?: SweetLevel;
  unsweet?: Unsweet;
  alcohol?: Alcohol;
  breakfast?: Breakfast;
  vegetable?: Vegetable;
  supplement?: Supplement;
  exercise?: Exercise;
  sleep?: Sleep;
  stress?: Stress;
}

export interface Option<T extends string | number = string> {
  id: T;
  label: string;
  sub?: string;
}

export interface Section {
  id: "A" | "B" | "C" | "D";
  title: string;
  subtitle: string;
  count: number;
}

export const SECTIONS: Section[] = [
  { id: "A", title: "ร่างกาย", subtitle: "ข้อมูลพื้นฐาน", count: 5 },
  { id: "B", title: "เครื่องดื่ม", subtitle: "สิ่งที่คุณดื่มในแต่ละวัน", count: 4 },
  { id: "C", title: "อาหาร", subtitle: "พฤติกรรมการกิน", count: 3 },
  { id: "D", title: "ไลฟ์สไตล์", subtitle: "การใช้ชีวิต", count: 3 },
];

export const SECTION_META: Record<Section["id"], { name: string; max: number }> = {
  A: { name: "ร่างกาย", max: 50 },
  B: { name: "เครื่องดื่ม", max: 30 },
  C: { name: "อาหาร", max: 20 },
  D: { name: "ไลฟ์สไตล์", max: 30 },
};

export const OPT = {
  gender: [
    { id: "male", label: "ชาย", sub: "Male" },
    { id: "female", label: "หญิง", sub: "Female" },
    { id: "other", label: "ไม่ระบุ", sub: "Prefer not to say" },
  ] as Option<Gender>[],
  water: [
    { id: "0-2", label: "0–2 แก้ว", sub: "น้อยกว่าที่ร่างกายต้องการ" },
    { id: "3-5", label: "3–5 แก้ว", sub: "พอประมาณ" },
    { id: "6-8", label: "6–8 แก้ว", sub: "ดีตามคำแนะนำ" },
    { id: "8+", label: "8 แก้วขึ้นไป", sub: "ดื่มเยอะ" },
  ] as Option<Water>[],
  sweetCount: [
    { id: 0, label: "0 แก้ว", sub: "ไม่ดื่มเลย" },
    { id: 1, label: "1 แก้ว", sub: "นาน ๆ ครั้ง" },
    { id: 2, label: "2 แก้ว", sub: "เกือบทุกวัน" },
    { id: 3, label: "3 แก้วขึ้นไป", sub: "หลายแก้วต่อวัน" },
  ] as Option<SweetCount>[],
  sweetLevel: [
    { id: "low", label: "หวานน้อย", sub: "น้อยกว่าปกติ" },
    { id: "normal", label: "หวานปกติ", sub: "ระดับมาตรฐาน" },
    { id: "high", label: "หวานมาก", sub: "หวานจัด" },
  ] as Option<SweetLevel>[],
  unsweet: [
    { id: "0", label: "0 แก้ว", sub: "ไม่ดื่มเลย" },
    { id: "1-2", label: "1–2 แก้ว", sub: "พอเหมาะ" },
    { id: "3-4", label: "3–4 แก้ว", sub: "ค่อนข้างเยอะ" },
    { id: "5+", label: "5 แก้วขึ้นไป", sub: "ดื่มเยอะมาก" },
  ] as Option<Unsweet>[],
  alcohol: [
    { id: "none", label: "ไม่ดื่ม", sub: "งดแอลกอฮอล์" },
    { id: "social", label: "สังคม", sub: "1–2 ครั้ง/เดือน" },
    { id: "regular", label: "ประจำ", sub: "1–2 ครั้ง/สัปดาห์" },
    { id: "daily", label: "ทุกวัน", sub: "ทุกวัน" },
  ] as Option<Alcohol>[],
  breakfast: [
    { id: "daily", label: "กินทุกวัน", sub: "7 วันต่อสัปดาห์" },
    { id: "often", label: "บ่อย", sub: "4–6 วัน/สัปดาห์" },
    { id: "sometimes", label: "บ้าง", sub: "1–3 วัน/สัปดาห์" },
    { id: "never", label: "ไม่กิน", sub: "ข้ามมื้อเช้า" },
  ] as Option<Breakfast>[],
  vegetable: [
    { id: "half_plate", label: "มากกว่าครึ่งจาน", sub: "ผักเป็นพระเอก" },
    { id: "quarter", label: "ประมาณ 1/4 จาน", sub: "พอประมาณ" },
    { id: "side", label: "แค่เครื่องเคียง", sub: "น้อย" },
    { id: "rarely", label: "แทบไม่กิน", sub: "ไม่ค่อยมีผัก" },
  ] as Option<Vegetable>[],
  exercise: [
    { id: "150+", label: "150 นาทีขึ้นไป", sub: "ตามคำแนะนำ WHO" },
    { id: "60-150", label: "60–150 นาที", sub: "พอประมาณ" },
    { id: "<60", label: "น้อยกว่า 60 นาที", sub: "ไม่ค่อยขยับ" },
    { id: "none", label: "แทบไม่ออก", sub: "นิ่ง ๆ ทั้งสัปดาห์" },
  ] as Option<Exercise>[],
  sleep: [
    { id: "7-9", label: "7–9 ชั่วโมง", sub: "พอดี" },
    { id: "6-7", label: "6–7 ชั่วโมง", sub: "น้อยไปนิด" },
    { id: "<6", label: "น้อยกว่า 6 ชม.", sub: "พักผ่อนไม่พอ" },
    { id: ">9", label: "มากกว่า 9 ชม.", sub: "นอนเยอะเกินไป" },
  ] as Option<Sleep>[],
  stress: [
    { id: "low", label: "น้อย", sub: "สบาย ๆ" },
    { id: "medium", label: "ปานกลาง", sub: "พอรับได้" },
    { id: "high", label: "สูง", sub: "หนักหน่อย" },
    { id: "very_high", label: "สูงมาก", sub: "อึดอัด เครียดทุกวัน" },
  ] as Option<Stress>[],
  supplement: [
    { id: "yes", label: "กินประจำ", sub: "วิตามิน, น้ำมันปลา, ฯลฯ" },
    { id: "no", label: "ไม่กิน", sub: "ไม่ได้กินอาหารเสริม" },
  ] as Option<Supplement>[],
} as const;

// ── Scoring ──────────────────────────────────────────────────────────────
// Asian BMI: <18.5 underweight · 18.5–22.9 normal · 23–24.9 overweight
//            25–29.9 obese-1 · ≥30 obese-2 (Thai CPG Obesity 2568)
export function bmiScore(weight?: number, height?: number): number {
  if (!weight || !height) return 0;
  const bmi = weight / Math.pow(height / 100, 2);
  if (bmi < 18.5) return 5;
  if (bmi < 23) return 0;
  if (bmi < 25) return 5;
  if (bmi < 30) return 12;
  return 18;
}

export function waistScore(
  waist: number | undefined,
  gender: Gender | undefined,
  weight: number | undefined,
  height: number | undefined,
  unknown: boolean | undefined
): number {
  if (unknown || !waist) {
    if (!weight || !height) return 0;
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 23) return 0;
    if (bmi < 25) return 2;
    if (bmi < 30) return 5;
    return 8;
  }
  if (!gender || gender === "other") return 0;
  const cutoff = gender === "male" ? 90 : 80;
  if (waist < cutoff - 10) return 0;
  if (waist < cutoff) return 3;
  if (waist < cutoff + 10) return 8;
  return 12;
}

export function ageScore(age: number | undefined, gender: Gender | undefined): number {
  if (!age) return 0;
  let s: number;
  if (age < 30) s = 0;
  else if (age < 40) s = 2;
  else if (age < 50) s = 5;
  else if (age < 60) s = 7;
  else s = 10;
  if (gender === "male") s += 1;
  if (gender === "female" && age >= 55) s += 1;
  return s;
}

export function genderScore(gender: Gender | undefined): number {
  if (gender === "male") return 5;
  if (gender === "female") return 0;
  if (gender === "other") return 2;
  return 0;
}

export function bmiValue(weight?: number, height?: number): number | null {
  if (!weight || !height) return null;
  return weight / Math.pow(height / 100, 2);
}

export function bmiLabel(bmi: number | null): string {
  if (bmi == null) return "—";
  if (bmi < 18.5) return "น้ำหนักน้อย";
  if (bmi < 23) return "สมส่วน";
  if (bmi < 25) return "ท้วม";
  if (bmi < 30) return "อ้วน";
  return "อ้วนมาก";
}

const SCORES = {
  water: { "0-2": 3, "3-5": 0, "6-8": -3, "8+": -5 } as Record<Water, number>,
  sweetBase: { 0: 0, 1: 4, 2: 8, 3: 12 } as Record<SweetCount, number>,
  sweetMul: { low: 0.7, normal: 1.0, high: 1.5 } as Record<SweetLevel, number>,
  unsweet: { "0": 0, "1-2": -5, "3-4": -3, "5+": 3 } as Record<Unsweet, number>,
  alcohol: { none: 0, social: 2, regular: 6, daily: 12 } as Record<Alcohol, number>,
  breakfast: { daily: 0, often: 1, sometimes: 3, never: 5 } as Record<Breakfast, number>,
  vegetable: { half_plate: 0, quarter: 5, side: 10, rarely: 15 } as Record<Vegetable, number>,
  supplement: { yes: -3, no: 0 } as Record<Supplement, number>,
  exercise: { "150+": 0, "60-150": 5, "<60": 10, none: 15 } as Record<Exercise, number>,
  sleep: { "7-9": 0, "6-7": 3, "<6": 10, ">9": 5 } as Record<Sleep, number>,
  stress: { low: 0, medium: 2, high: 4, very_high: 5 } as Record<Stress, number>,
};

export function sweetDrinksScore(count: SweetCount, level: SweetLevel | undefined): number {
  const base = SCORES.sweetBase[count] ?? 0;
  if (count === 0 || !level) return base;
  return Math.min(20, Math.round(base * SCORES.sweetMul[level]));
}

export interface ScoreResult {
  total: number;
  sections: {
    A: { score: number; parts: { bmi: number; age: number; gender: number; waist: number } };
    B: { score: number; parts: { water: number; sweet: number; unsweet: number; alcohol: number } };
    C: { score: number; parts: { breakfast: number; vegetable: number; supplement: number } };
    D: { score: number; parts: { exercise: number; sleep: number; stress: number } };
  };
}

export function computeScore(answers: Answers): ScoreResult {
  const A_bmi = bmiScore(answers.weight, answers.height);
  const A_age = ageScore(answers.age, answers.gender);
  const A_gender = genderScore(answers.gender);
  const A_waist = waistScore(
    answers.waist,
    answers.gender,
    answers.weight,
    answers.height,
    answers.waistUnknown
  );
  const A = A_bmi + A_age + A_gender + A_waist;

  const B_water = answers.water ? SCORES.water[answers.water] : 0;
  const B_sweet = sweetDrinksScore(answers.sweetCount ?? 0, answers.sweetLevel);
  const B_unsweet = answers.unsweet ? SCORES.unsweet[answers.unsweet] : 0;
  const B_alcohol = answers.alcohol ? SCORES.alcohol[answers.alcohol] : 0;
  const B = B_water + B_sweet + B_unsweet + B_alcohol;

  const C_break = answers.breakfast ? SCORES.breakfast[answers.breakfast] : 0;
  const C_veg = answers.vegetable ? SCORES.vegetable[answers.vegetable] : 0;
  const C_sup = answers.supplement ? SCORES.supplement[answers.supplement] : 0;
  const C = C_break + C_veg + C_sup;

  const D_ex = answers.exercise ? SCORES.exercise[answers.exercise] : 0;
  const D_sleep = answers.sleep ? SCORES.sleep[answers.sleep] : 0;
  const D_str = answers.stress ? SCORES.stress[answers.stress] : 0;
  const D = D_ex + D_sleep + D_str;

  return {
    total: A + B + C + D,
    sections: {
      A: { score: A, parts: { bmi: A_bmi, age: A_age, gender: A_gender, waist: A_waist } },
      B: { score: B, parts: { water: B_water, sweet: B_sweet, unsweet: B_unsweet, alcohol: B_alcohol } },
      C: { score: C, parts: { breakfast: C_break, vegetable: C_veg, supplement: C_sup } },
      D: { score: D, parts: { exercise: D_ex, sleep: D_sleep, stress: D_str } },
    },
  };
}

export function classifyRisk(score: number): RiskLevel {
  if (score < 15) return "low";
  if (score < 35) return "moderate";
  if (score < 60) return "high";
  return "very_high";
}

export const RISK_META: Record<
  RiskLevel,
  { label: string; short: string; emoji: string; headline: string; body: string }
> = {
  low: {
    label: "ความเสี่ยงต่ำ",
    short: "ต่ำ",
    emoji: "🟢",
    headline: "สุขภาพอยู่ในเกณฑ์ที่ดี",
    body: "พฤติกรรมโดยรวมของคุณช่วยลดความเสี่ยงโรค NCDs รักษาวินัยนี้ต่อไปนะ",
  },
  moderate: {
    label: "ความเสี่ยงปานกลาง",
    short: "ปานกลาง",
    emoji: "🟡",
    headline: "ยังพอปรับได้ทันเวลา",
    body: "มีบางพฤติกรรมที่อาจเพิ่มความเสี่ยง ลองปรับทีละข้อจะช่วยได้มาก",
  },
  high: {
    label: "ความเสี่ยงสูง",
    short: "สูง",
    emoji: "🟠",
    headline: "ควรเริ่มดูแลตัวเองจริงจัง",
    body: "พฤติกรรมหลายข้อกำลังสะสมความเสี่ยง แนะนำปรึกษาผู้เชี่ยวชาญและเริ่มเปลี่ยนแปลง",
  },
  very_high: {
    label: "ความเสี่ยงสูงมาก",
    short: "สูงมาก",
    emoji: "🔴",
    headline: "ถึงเวลาดูแลสุขภาพอย่างจริงจัง",
    body: "ความเสี่ยงต่อโรค NCDs อยู่ในระดับสูง ควรปรึกษาผู้เชี่ยวชาญเพื่อวางแผนสุขภาพ",
  },
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: "#5B8A6B",
  moderate: "#C9A24C",
  high: "#C26A3D",
  very_high: "#9C3D2E",
};

export interface Insight {
  icon: string;
  title: string;
  body: string;
}

export function pickInsights(answers: Answers, score: ScoreResult): Insight[] {
  const tips: Insight[] = [];
  if (score.sections.A.parts.waist >= 8 && !answers.waistUnknown) {
    tips.push({
      icon: "📏",
      title: "ลดรอบเอว ลดอ้วนลงพุง",
      body: "รอบเอวเกินเกณฑ์เอเชีย (ชาย ≥90, หญิง ≥80 ซม.) สัมพันธ์กับ metabolic syndrome และโรคหัวใจ — ลดเอวเพียง 5 ซม. ก็ช่วยลดความเสี่ยงได้มาก",
    });
  }
  if (answers.waistUnknown) {
    tips.push({
      icon: "📏",
      title: "ลองวัดรอบเอวสักครั้ง",
      body: "รอบเอวเป็นตัวบ่งชี้อ้วนลงพุงที่ดีกว่า BMI วัดที่ระดับสะดือตอนเช้าก่อนกินข้าว — เกณฑ์: ชาย <90 ซม., หญิง <80 ซม.",
    });
  }
  if (score.sections.A.parts.bmi >= 12) {
    tips.push({
      icon: "⚖️",
      title: "ดูแลน้ำหนัก",
      body: "BMI ในเกณฑ์อ้วน (≥25 kg/m² ตามเกณฑ์ไทย) เพิ่มความเสี่ยงเบาหวาน 2.4 เท่า การลดน้ำหนัก 5–10% ช่วยลดความเสี่ยงได้มาก",
    });
  }
  if (score.sections.B.parts.sweet >= 8) {
    tips.push({
      icon: "🥤",
      title: "ลดเครื่องดื่มหวาน",
      body: "น้ำตาลในเครื่องดื่มเป็นปัจจัยใหญ่ของเบาหวานและน้ำหนักเกิน ลองสลับเป็นเวอร์ชันหวานน้อย หรือดื่มน้ำเปล่าแทน 1 แก้ว/วัน",
    });
  }
  if (score.sections.D.parts.exercise >= 10) {
    tips.push({
      icon: "🚶",
      title: "เคลื่อนไหวให้มากขึ้น",
      body: "WHO แนะนำออกกำลังกายระดับปานกลางอย่างน้อย 150 นาที/สัปดาห์ ลองเริ่มจากเดินเร็ว 20 นาทีต่อวัน",
    });
  }
  if (score.sections.C.parts.vegetable >= 10) {
    tips.push({
      icon: "🥬",
      title: "เพิ่มผักให้มื้อหลัก",
      body: "ตั้งเป้าให้ผัก/ผลไม้เป็นครึ่งหนึ่งของจาน ใยอาหารช่วยควบคุมน้ำตาลในเลือดและทำให้อิ่มนาน",
    });
  }
  if (score.sections.D.parts.sleep >= 10) {
    tips.push({
      icon: "🌙",
      title: "พักผ่อนให้ครบ",
      body: "นอนน้อยกว่า 6 ชั่วโมงต่อคืนสัมพันธ์กับความดันและภาวะดื้ออินซูลิน ลองเข้านอนเร็วขึ้น 30 นาที",
    });
  }
  if (score.sections.B.parts.alcohol >= 6) {
    tips.push({
      icon: "🍷",
      title: "ลดแอลกอฮอล์",
      body: "การดื่มเป็นประจำเพิ่มความเสี่ยงต่อตับและหัวใจ ลองตั้งวันงดดื่ม 2–3 วันต่อสัปดาห์",
    });
  }
  if (tips.length === 0) {
    tips.push({
      icon: "✨",
      title: "รักษาวินัยที่ดีนี้ไว้",
      body: "พฤติกรรมโดยรวมของคุณสมดุลแล้ว ลองตั้งเป้าหมายเล็ก ๆ เพิ่ม เช่น เพิ่มการเคลื่อนไหวระหว่างวัน",
    });
  }
  return tips.slice(0, 3);
}

export function isSectionComplete(idx: 1 | 2 | 3 | 4, answers: Answers): boolean {
  if (idx === 1) {
    return Boolean(
      answers.gender &&
        answers.weight &&
        answers.height &&
        (answers.waist || answers.waistUnknown) &&
        answers.age
    );
  }
  if (idx === 2) {
    if (!answers.water || !answers.unsweet || !answers.alcohol) return false;
    if (answers.sweetCount === undefined) return false;
    if (answers.sweetCount >= 1 && !answers.sweetLevel) return false;
    return true;
  }
  if (idx === 3) {
    return Boolean(answers.breakfast && answers.vegetable && answers.supplement);
  }
  if (idx === 4) {
    return Boolean(answers.exercise && answers.sleep && answers.stress);
  }
  return false;
}
