// Assessment data — questions, options, and scoring logic for Pharmroo
// All Thai copy. Pure data + pure functions, no React.

const SECTIONS = [
  { id: 'A', title: 'ร่างกาย', subtitle: 'ข้อมูลพื้นฐาน', count: 5 },
  { id: 'B', title: 'เครื่องดื่ม', subtitle: 'สิ่งที่คุณดื่มในแต่ละวัน', count: 4 },
  { id: 'C', title: 'อาหาร', subtitle: 'พฤติกรรมการกิน', count: 3 },
  { id: 'D', title: 'ไลฟ์สไตล์', subtitle: 'การใช้ชีวิต', count: 3 },
];

// Option lists (id, label, sublabel?)
const OPT = {
  gender: [
    { id: 'male',   label: 'ชาย',     sub: 'Male' },
    { id: 'female', label: 'หญิง',    sub: 'Female' },
    { id: 'other',  label: 'ไม่ระบุ', sub: 'Prefer not to say' },
  ],
  water: [
    { id: '0-2', label: '0–2 แก้ว', sub: 'น้อยกว่าที่ร่างกายต้องการ' },
    { id: '3-5', label: '3–5 แก้ว', sub: 'พอประมาณ' },
    { id: '6-8', label: '6–8 แก้ว', sub: 'ดีตามคำแนะนำ' },
    { id: '8+',  label: '8 แก้วขึ้นไป', sub: 'ดื่มเยอะ' },
  ],
  sweetCount: [
    { id: 0, label: '0 แก้ว', sub: 'ไม่ดื่มเลย' },
    { id: 1, label: '1 แก้ว', sub: 'นาน ๆ ครั้ง' },
    { id: 2, label: '2 แก้ว', sub: 'เกือบทุกวัน' },
    { id: 3, label: '3 แก้วขึ้นไป', sub: 'หลายแก้วต่อวัน' },
  ],
  sweetLevel: [
    { id: 'low',    label: 'หวานน้อย',  sub: 'น้อยกว่าปกติ' },
    { id: 'normal', label: 'หวานปกติ',  sub: 'ระดับมาตรฐาน' },
    { id: 'high',   label: 'หวานมาก',   sub: 'หวานจัด' },
  ],
  unsweet: [
    { id: '0',   label: '0 แก้ว',   sub: 'ไม่ดื่มเลย' },
    { id: '1-2', label: '1–2 แก้ว', sub: 'พอเหมาะ' },
    { id: '3-4', label: '3–4 แก้ว', sub: 'ค่อนข้างเยอะ' },
    { id: '5+',  label: '5 แก้วขึ้นไป', sub: 'ดื่มเยอะมาก' },
  ],
  alcohol: [
    { id: 'none',    label: 'ไม่ดื่ม',           sub: 'งดแอลกอฮอล์' },
    { id: 'social',  label: 'สังคม',             sub: '1–2 ครั้ง/เดือน' },
    { id: 'regular', label: 'ประจำ',             sub: '1–2 ครั้ง/สัปดาห์' },
    { id: 'daily',   label: 'ทุกวัน',            sub: 'ทุกวัน' },
  ],
  breakfast: [
    { id: 'daily',     label: 'กินทุกวัน',     sub: '7 วันต่อสัปดาห์' },
    { id: 'often',     label: 'บ่อย',           sub: '4–6 วัน/สัปดาห์' },
    { id: 'sometimes', label: 'บ้าง',           sub: '1–3 วัน/สัปดาห์' },
    { id: 'never',     label: 'ไม่กิน',         sub: 'ข้ามมื้อเช้า' },
  ],
  vegetable: [
    { id: 'half_plate', label: 'มากกว่าครึ่งจาน', sub: 'ผักเป็นพระเอก' },
    { id: 'quarter',    label: 'ประมาณ 1/4 จาน', sub: 'พอประมาณ' },
    { id: 'side',       label: 'แค่เครื่องเคียง', sub: 'น้อย' },
    { id: 'rarely',     label: 'แทบไม่กิน',       sub: 'ไม่ค่อยมีผัก' },
  ],
  exercise: [
    { id: '150+',    label: '150 นาทีขึ้นไป', sub: 'ตามคำแนะนำ WHO' },
    { id: '60-150',  label: '60–150 นาที',    sub: 'พอประมาณ' },
    { id: '<60',     label: 'น้อยกว่า 60 นาที', sub: 'ไม่ค่อยขยับ' },
    { id: 'none',    label: 'แทบไม่ออก',       sub: 'นิ่ง ๆ ทั้งสัปดาห์' },
  ],
  sleep: [
    { id: '7-9', label: '7–9 ชั่วโมง',  sub: 'พอดี' },
    { id: '6-7', label: '6–7 ชั่วโมง',  sub: 'น้อยไปนิด' },
    { id: '<6',  label: 'น้อยกว่า 6 ชม.', sub: 'พักผ่อนไม่พอ' },
    { id: '>9',  label: 'มากกว่า 9 ชม.', sub: 'นอนเยอะเกินไป' },
  ],
  stress: [
    { id: 'low',       label: 'น้อย',     sub: 'สบาย ๆ' },
    { id: 'medium',    label: 'ปานกลาง',  sub: 'พอรับได้' },
    { id: 'high',      label: 'สูง',      sub: 'หนักหน่อย' },
    { id: 'very_high', label: 'สูงมาก',   sub: 'อึดอัด เครียดทุกวัน' },
  ],
  supplement: [
    { id: 'yes', label: 'กินประจำ',     sub: 'วิตามิน, น้ำมันปลา, ฯลฯ' },
    { id: 'no',  label: 'ไม่กิน',       sub: 'ไม่ได้กินอาหารเสริม' },
  ],
};

// ── Scoring ────────────────────────────────────────────────────────────────
// ── Scoring (Thai CPG Obesity 2568/2025 thresholds) ────────────────────────
// Ref: ชมรมโรคอ้วนแห่งประเทศไทย — แนวทางการวินิจฉัยและรักษาโรคอ้วน พ.ศ. 2568
// Asian BMI: <18.5 น้ำหนักน้อย · 18.5–22.9 ปกติ · 23–24.9 น้ำหนักเกิน
//            25–29.9 อ้วนระดับ 1 · ≥30 อ้วนระดับ 2
function bmiScore(weight, height) {
  if (!weight || !height) return 0;
  const bmi = weight / Math.pow(height / 100, 2);
  if (bmi < 18.5) return 5;       // underweight (still unhealthy)
  if (bmi < 23)   return 0;       // ปกติ
  if (bmi < 25)   return 5;       // น้ำหนักเกิน (Asian threshold)
  if (bmi < 30)   return 12;      // อ้วนระดับ 1 — Thai data: 2.4× DM risk
  return 18;                      // อ้วนระดับ 2
}
// Waist circumference — central obesity (Asian threshold)
// Men ≥90cm, Women ≥80cm = metabolic risk (Thai CPG, IDF Asia-Pacific)
// If user doesn't know their waist, estimate from BMI as a proxy
// (correlated but weaker — we under-weight to avoid false alarms)
function waistScore(waist, gender, weight, height, unknown) {
  if (unknown || !waist) {
    if (!weight || !height) return 0;
    const bmi = weight / Math.pow(height / 100, 2);
    if (bmi < 23) return 0;
    if (bmi < 25) return 2;
    if (bmi < 30) return 5;
    return 8;
  }
  if (!gender || gender === 'other') return 0;
  const cutoff = gender === 'male' ? 90 : 80;
  if (waist < cutoff - 10) return 0;
  if (waist < cutoff)      return 3;
  if (waist < cutoff + 10) return 8;
  return 12;
}
function ageScore(age, gender) {
  if (!age) return 0;
  // Base age score (per spec)
  let s;
  if (age < 30) s = 0;
  else if (age < 40) s = 2;
  else if (age < 50) s = 5;
  else if (age < 60) s = 7;
  else s = 10;
  // Gender-adjusted age risk:
  // Men have higher CVD/NCDs risk earlier; postmenopausal women catch up after ~55.
  // (Refs: WHO HEARTS, Framingham, Thai Heart Foundation guideline)
  if (gender === 'male') s += 1;            // earlier-onset risk
  if (gender === 'female' && age >= 55) s += 1; // post-menopause adjustment
  return s;
}

// Gender base score (men: higher baseline NCDs risk per WHO/Thai NCD guidelines)
function genderScore(gender) {
  if (gender === 'male') return 5;
  if (gender === 'female') return 0;
  if (gender === 'other') return 2;
  return 0;
}
function bmiValue(weight, height) {
  if (!weight || !height) return null;
  return weight / Math.pow(height / 100, 2);
}
function bmiLabel(bmi) {
  if (bmi == null) return '—';
  if (bmi < 18.5) return 'น้ำหนักน้อย';
  if (bmi < 23)   return 'สมส่วน';
  if (bmi < 25)   return 'ท้วม';
  if (bmi < 30)   return 'อ้วน';
  return 'อ้วนมาก';
}

const SCORES = {
  water:     { '0-2': 3, '3-5': 0, '6-8': -3, '8+': -5 },
  sweetBase: { 0: 0, 1: 4, 2: 8, 3: 12 },
  sweetMul:  { low: 0.7, normal: 1.0, high: 1.5 },
  unsweet:   { '0': 0, '1-2': -5, '3-4': -3, '5+': 3 },
  alcohol:   { none: 0, social: 2, regular: 6, daily: 12 },
  breakfast: { daily: 0, often: 1, sometimes: 3, never: 5 },
  vegetable: { half_plate: 0, quarter: 5, side: 10, rarely: 15 },
  supplement:{ yes: -3, no: 0 },
  exercise:  { '150+': 0, '60-150': 5, '<60': 10, none: 15 },
  sleep:     { '7-9': 0, '6-7': 3, '<6': 10, '>9': 5 },
  stress:    { low: 0, medium: 2, high: 4, very_high: 5 },
};

function sweetDrinksScore(count, level) {
  const base = SCORES.sweetBase[count] ?? 0;
  if (count === 0 || !level) return base;
  return Math.min(20, Math.round(base * SCORES.sweetMul[level]));
}

// Compute a per-section breakdown + total
function computeScore(answers) {
  const A_bmi    = bmiScore(answers.weight, answers.height);
  const A_age    = ageScore(answers.age, answers.gender);
  const A_gender = genderScore(answers.gender);
  const A_waist  = waistScore(answers.waist, answers.gender, answers.weight, answers.height, answers.waistUnknown);
  const A        = A_bmi + A_age + A_gender + A_waist;

  const B_water   = SCORES.water[answers.water] ?? 0;
  const B_sweet   = sweetDrinksScore(answers.sweetCount ?? 0, answers.sweetLevel);
  const B_unsweet = SCORES.unsweet[answers.unsweet] ?? 0;
  const B_alcohol = SCORES.alcohol[answers.alcohol] ?? 0;
  const B = B_water + B_sweet + B_unsweet + B_alcohol;

  const C_break = SCORES.breakfast[answers.breakfast] ?? 0;
  const C_veg   = SCORES.vegetable[answers.vegetable] ?? 0;
  const C_sup   = SCORES.supplement[answers.supplement] ?? 0;
  const C = C_break + C_veg + C_sup;

  const D_ex    = SCORES.exercise[answers.exercise] ?? 0;
  const D_sleep = SCORES.sleep[answers.sleep] ?? 0;
  const D_str   = SCORES.stress[answers.stress] ?? 0;
  const D = D_ex + D_sleep + D_str;

  const total = A + B + C + D;
  return {
    total,
    sections: {
      A: { score: A, parts: { bmi: A_bmi, age: A_age, gender: A_gender, waist: A_waist } },
      B: { score: B, parts: { water: B_water, sweet: B_sweet, unsweet: B_unsweet, alcohol: B_alcohol } },
      C: { score: C, parts: { breakfast: C_break, vegetable: C_veg, supplement: C_sup } },
      D: { score: D, parts: { exercise: D_ex, sleep: D_sleep, stress: D_str } },
    },
  };
}

function classifyRisk(score) {
  if (score < 15) return 'low';
  if (score < 35) return 'moderate';
  if (score < 60) return 'high';
  return 'very_high';
}

const RISK_META = {
  low:       { label: 'ความเสี่ยงต่ำ',     short: 'ต่ำ',     emoji: '🟢',
               headline: 'สุขภาพอยู่ในเกณฑ์ที่ดี',
               body: 'พฤติกรรมโดยรวมของคุณช่วยลดความเสี่ยงโรค NCDs รักษาวินัยนี้ต่อไปนะ' },
  moderate:  { label: 'ความเสี่ยงปานกลาง',  short: 'ปานกลาง', emoji: '🟡',
               headline: 'ยังพอปรับได้ทันเวลา',
               body: 'มีบางพฤติกรรมที่อาจเพิ่มความเสี่ยง ลองปรับทีละข้อจะช่วยได้มาก' },
  high:      { label: 'ความเสี่ยงสูง',      short: 'สูง',     emoji: '🟠',
               headline: 'ควรเริ่มดูแลตัวเองจริงจัง',
               body: 'พฤติกรรมหลายข้อกำลังสะสมความเสี่ยง แนะนำปรึกษาผู้เชี่ยวชาญและเริ่มเปลี่ยนแปลง' },
  very_high: { label: 'ความเสี่ยงสูงมาก',   short: 'สูงมาก',  emoji: '🔴',
               headline: 'ถึงเวลาดูแลสุขภาพอย่างจริงจัง',
               body: 'ความเสี่ยงต่อโรค NCDs อยู่ในระดับสูง ควรปรึกษาผู้เชี่ยวชาญเพื่อวางแผนสุขภาพ' },
};

const SECTION_META = {
  A: { name: 'ร่างกาย',     max: 50 },
  B: { name: 'เครื่องดื่ม', max: 30 },
  C: { name: 'อาหาร',       max: 20 },
  D: { name: 'ไลฟ์สไตล์',   max: 30 },
};

Object.assign(window, {
  SECTIONS, OPT, SCORES, SECTION_META, RISK_META,
  bmiScore, ageScore, genderScore, waistScore, bmiValue, bmiLabel,
  sweetDrinksScore, computeScore, classifyRisk,
});
