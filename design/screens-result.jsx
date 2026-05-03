// Result screen + Consult form

// ── Animated counter ──────────────────────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

// ── Risk Gauge (SVG arc) ──────────────────────────────────────────────────
function RiskGauge({ score, palette, riskLevel }) {
  // Arc spans 0..100; we show normalized [0..100] mapping the score (cap at 100)
  const norm = Math.max(0, Math.min(100, score));
  const animated = useCountUp(norm, 900);

  // Arc geometry
  const cx = 130, cy = 130, r = 100;
  const startA = Math.PI * 0.85; // bottom-left
  const endA   = Math.PI * 2.15; // bottom-right (going clockwise)
  const polar = (a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const arc = (from, to) => {
    const s = polar(from), e = polar(to);
    const large = (to - from) > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const fillTo = startA + (endA - startA) * (animated / 100);
  const riskColor = palette.risk[riskLevel];

  // Band thresholds 0-15 low, 15-35 moderate, 35-60 high, 60-100 very_high
  const bands = [
    { from: 0,  to: 15, color: palette.risk.low },
    { from: 15, to: 35, color: palette.risk.moderate },
    { from: 35, to: 60, color: palette.risk.high },
    { from: 60, to: 100, color: palette.risk.very_high },
  ];
  const bandArc = (from, to) => {
    const a1 = startA + (endA - startA) * (from / 100);
    const a2 = startA + (endA - startA) * (to / 100);
    return arc(a1, a2);
  };

  return (
    <div style={{ position: 'relative', width: 260, height: 200, margin: '0 auto' }}>
      <svg width="260" height="200" viewBox="0 0 260 200">
        {/* Background bands — colored track segments at higher opacity */}
        {bands.map((b, i) => (
          <path key={i} d={bandArc(b.from, b.to)} stroke={b.color} strokeOpacity="0.35"
                strokeWidth="14" fill="none" strokeLinecap="butt" />
        ))}
        {/* Tick marks for risk bands at 15, 35, 60 — colored dividers */}
        {[
          { v: 15, color: palette.risk.low },
          { v: 35, color: palette.risk.moderate },
          { v: 60, color: palette.risk.high },
        ].map(({ v, color }) => {
          const a = startA + (endA - startA) * (v / 100);
          const inner = { x: cx + (r - 16) * Math.cos(a), y: cy + (r - 16) * Math.sin(a) };
          const outer = { x: cx + (r + 16) * Math.cos(a), y: cy + (r + 16) * Math.sin(a) };
          return (
            <line key={v} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          );
        })}
        {/* Filled arc — entire fill matches result risk color */}
        <path d={arc(startA, fillTo)} stroke={riskColor} strokeWidth="14" fill="none" strokeLinecap="round"
              style={{ transition: 'stroke 320ms' }} />
      </svg>
      {/* Center label */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 60, fontWeight: 700, color: riskColor, letterSpacing: '-0.04em',
          fontFamily: '"IBM Plex Sans", system-ui', lineHeight: 1,
          transition: 'color 320ms',
        }}>{animated}</div>
        <div style={{ fontSize: 12, color: palette.inkMute, marginTop: 4, letterSpacing: '0.05em' }}>
          คะแนนความเสี่ยง
        </div>
      </div>
      {/* Band labels with risk-level legend */}
      <div style={{
        position: 'absolute', bottom: -2, left: 0, right: 0,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4,
        fontSize: 10, fontWeight: 700, textAlign: 'center',
      }}>
        <span style={{ color: palette.risk.low }}>ต่ำ</span>
        <span style={{ color: palette.risk.moderate }}>ปานกลาง</span>
        <span style={{ color: palette.risk.high }}>สูง</span>
        <span style={{ color: palette.risk.very_high }}>สูงมาก</span>
      </div>
    </div>
  );
}

// ── Section breakdown bar ─────────────────────────────────────────────────
function SectionBar({ id, score, max, palette }) {
  const meta = SECTION_META[id];
  // Display: clamp negative section B to 0 for the bar visualization
  const display = Math.max(0, score);
  const pct = Math.min(100, (display / max) * 100);
  // Color intensity by relative weight — represents RISK, not score
  const ratio = display / max;
  const fillColor = ratio < 0.25 ? palette.risk.low
                  : ratio < 0.50 ? palette.risk.moderate
                  : ratio < 0.75 ? palette.risk.high
                  : palette.risk.very_high;
  const riskLabel = ratio < 0.25 ? 'ต่ำ'
                  : ratio < 0.50 ? 'ปานกลาง'
                  : ratio < 0.75 ? 'สูง'
                  : 'สูงมาก';
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setW(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{
      padding: '12px 14px',
      background: palette.card,
      border: `1px solid ${palette.line}`,
      borderRadius: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: palette.primary, letterSpacing: '0.08em',
            background: palette.primarySoft, padding: '2px 6px', borderRadius: 4,
            fontFamily: '"IBM Plex Sans", system-ui',
          }}>{id}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: palette.ink }}>{meta.name}</span>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: fillColor,
          padding: '3px 10px', borderRadius: 999, background: `${fillColor}1A`,
        }}>
          {riskLabel}
        </div>
      </div>
      <div style={{ height: 6, background: palette.line, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          width: `${w}%`, height: '100%', background: fillColor,
          borderRadius: 999, transition: 'width 700ms cubic-bezier(.2,.7,.2,1)',
        }} />
      </div>
    </div>
  );
}

// ── Insight item (recommendation) ─────────────────────────────────────────
function pickInsights(answers, score) {
  const tips = [];
  if (score.sections.A.parts.waist >= 8 && !answers.waistUnknown) {
    tips.push({ icon: '📏', title: 'ลดรอบเอว ลดอ้วนลงพุง',
      body: 'รอบเอวเกินเกณฑ์เอเชีย (ชาย ≥90, หญิง ≥80 ซม.) สัมพันธ์กับ metabolic syndrome และโรคหัวใจ — ลดเอวเพียง 5 ซม. ก็ช่วยลดความเสี่ยงได้มาก' });
  }
  if (answers.waistUnknown) {
    tips.push({ icon: '📏', title: 'ลองวัดรอบเอวสักครั้ง',
      body: 'รอบเอวเป็นตัวบ่งชี้อ้วนลงพุงที่ดีกว่า BMI วัดที่ระดับสะดือตอนเช้าก่อนกินข้าว — เกณฑ์: ชาย <90 ซม., หญิง <80 ซม.' });
  }
  if (score.sections.A.parts.bmi >= 12) {
    tips.push({ icon: '⚖️', title: 'ดูแลน้ำหนัก',
      body: 'BMI ในเกณฑ์อ้วน (≥25 kg/m² ตามเกณฑ์ไทย) เพิ่มความเสี่ยงเบาหวาน 2.4 เท่า การลดน้ำหนัก 5–10% ช่วยลดความเสี่ยงได้มาก' });
  }
  if (score.sections.B.parts.sweet >= 8) {
    tips.push({ icon: '🥤', title: 'ลดเครื่องดื่มหวาน',
      body: 'น้ำตาลในเครื่องดื่มเป็นปัจจัยใหญ่ของเบาหวานและน้ำหนักเกิน ลองสลับเป็นเวอร์ชันหวานน้อย หรือดื่มน้ำเปล่าแทน 1 แก้ว/วัน' });
  }
  if (score.sections.D.parts.exercise >= 10) {
    tips.push({ icon: '🚶', title: 'เคลื่อนไหวให้มากขึ้น',
      body: 'WHO แนะนำออกกำลังกายระดับปานกลางอย่างน้อย 150 นาที/สัปดาห์ ลองเริ่มจากเดินเร็ว 20 นาทีต่อวัน' });
  }
  if (score.sections.C.parts.vegetable >= 10) {
    tips.push({ icon: '🥬', title: 'เพิ่มผักให้มื้อหลัก',
      body: 'ตั้งเป้าให้ผัก/ผลไม้เป็นครึ่งหนึ่งของจาน ใยอาหารช่วยควบคุมน้ำตาลในเลือดและทำให้อิ่มนาน' });
  }
  if (score.sections.D.parts.sleep >= 10) {
    tips.push({ icon: '🌙', title: 'พักผ่อนให้ครบ',
      body: 'นอนน้อยกว่า 6 ชั่วโมงต่อคืนสัมพันธ์กับความดันและภาวะดื้ออินซูลิน ลองเข้านอนเร็วขึ้น 30 นาที' });
  }
  if (score.sections.B.parts.alcohol >= 6) {
    tips.push({ icon: '🍷', title: 'ลดแอลกอฮอล์',
      body: 'การดื่มเป็นประจำเพิ่มความเสี่ยงต่อตับและหัวใจ ลองตั้งวันงดดื่ม 2–3 วันต่อสัปดาห์' });
  }
  if (tips.length === 0) {
    tips.push({ icon: '✨', title: 'รักษาวินัยที่ดีนี้ไว้',
      body: 'พฤติกรรมโดยรวมของคุณสมดุลแล้ว ลองตั้งเป้าหมายเล็ก ๆ เพิ่ม เช่น เพิ่มการเคลื่อนไหวระหว่างวัน' });
  }
  return tips.slice(0, 3);
}

// ── Result Screen ─────────────────────────────────────────────────────────
function ResultScreen({ palette, answers, onConsult, onRestart }) {
  const score = computeScore(answers);
  const riskLevel = classifyRisk(score.total);
  const meta = RISK_META[riskLevel];
  const tips = pickInsights(answers, score);

  const riskColor = palette.risk[riskLevel];

  return (
    <div style={{ padding: '20px 20px 32px' }}>
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
        fontSize: 13, fontWeight: 700, color: palette.inkMute,
        letterSpacing: '0.18em', marginBottom: 8,
      }}>
        <span style={{ width: 18, height: 1, background: palette.line }} />
        ผลประเมินของคุณ
        <span style={{ width: 18, height: 1, background: palette.line }} />
      </div>

      {/* Risk hero — framed in level color */}
      <div style={{
        marginTop: 8, padding: '20px 16px 22px',
        background: `${riskColor}0D`,
        border: `2px solid ${riskColor}`,
        borderRadius: 20,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          background: riskColor, color: '#fff',
          padding: '4px 12px', borderRadius: 999,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
        }}>
          {meta.label}
        </div>
        <RiskGauge score={score.total} palette={palette} riskLevel={riskLevel} />
        <div style={{
          textAlign: 'center', marginTop: 12,
          fontSize: 28, fontWeight: 700, color: palette.ink,
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          {meta.headline}
        </div>
        <div style={{
          textAlign: 'center', fontSize: 15, color: palette.inkSoft,
          marginTop: 10, lineHeight: 1.55, padding: '0 4px',
        }}>
          {meta.body}
        </div>
      </div>

      <div style={{
        marginTop: 28, marginBottom: 12,
        fontSize: 18, fontWeight: 700, color: palette.ink,
        letterSpacing: '-0.01em',
      }}>
        ความเสี่ยงแต่ละด้าน
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {['A','B','C','D'].map(id => (
          <SectionBar key={id} id={id} score={score.sections[id].score} max={SECTION_META[id].max} palette={palette} />
        ))}
      </div>

      <div style={{
        marginTop: 28, marginBottom: 12,
        fontSize: 18, fontWeight: 700, color: palette.ink, letterSpacing: '-0.01em',
      }}>
        คำแนะนำสำหรับคุณ
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '14px',
            background: palette.card, border: `1px solid ${palette.line}`,
            borderRadius: 12, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: palette.primarySoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>{tip.icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: palette.ink, marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 14, color: palette.inkSoft, lineHeight: 1.55 }}>{tip.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton palette={palette} onClick={onConsult}>
          ปรึกษาผู้เชี่ยวชาญ →
        </PrimaryButton>
        <PrimaryButton palette={palette} variant="ghost" onClick={onRestart}>
          ทำแบบประเมินใหม่
        </PrimaryButton>
      </div>

      <div style={{ marginTop: 18, fontSize: 12, color: palette.inkMute, textAlign: 'center', lineHeight: 1.55 }}>
        ผลลัพธ์นี้เป็นเพียงแนวทางเบื้องต้น<br/>หากกังวลควรพบแพทย์เพื่อตรวจสุขภาพ
      </div>
    </div>
  );
}

// ── Consult Screen ────────────────────────────────────────────────────────
function ConsultScreen({ palette, onBack, onSubmit }) {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [concern, setConcern] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const valid = name.trim().length >= 2 && phone.replace(/\D/g, '').length >= 9;

  if (submitted) {
    return (
      <div style={{
        padding: 24, height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 999, background: palette.primarySoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M6 16L13 23L26 9" stroke={palette.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: palette.ink, letterSpacing: '-0.02em' }}>
          ส่งคำขอเรียบร้อย
        </div>
        <div style={{ fontSize: 14, color: palette.inkSoft, marginTop: 10, lineHeight: 1.55, maxWidth: 260 }}>
          ทีมงานจะติดต่อกลับภายใน 24 ชม.<br/>ขอบคุณที่ใส่ใจสุขภาพของตัวเองนะ 💚
        </div>
        <div style={{ marginTop: 28, width: '100%', maxWidth: 280 }}>
          <PrimaryButton palette={palette} variant="ghost" onClick={onBack}>กลับหน้าผลลัพธ์</PrimaryButton>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    border: `1.5px solid ${palette.line}`, borderRadius: 12,
    background: palette.card, color: palette.ink,
    fontFamily: 'inherit', fontSize: 15, outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: palette.ink,
    marginBottom: 6, display: 'block',
  };

  return (
    <div style={{ padding: '20px 20px 32px' }}>
      <button type="button" onClick={onBack} style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        color: palette.inkSoft, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
        fontFamily: 'inherit', marginBottom: 16,
      }}>← กลับ</button>

      <div style={{ fontSize: 26, fontWeight: 700, color: palette.ink, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        ปรึกษากับเรา
      </div>
      <div style={{ fontSize: 14, color: palette.inkSoft, marginTop: 8, lineHeight: 1.5, marginBottom: 24 }}>
        กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับ พร้อมคำแนะนำที่เหมาะกับคุณ
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>ชื่อเล่น<span style={{ color: palette.risk.high, marginLeft: 3 }}>*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="เช่น ก้อย" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>เบอร์โทรศัพท์<span style={{ color: palette.risk.high, marginLeft: 3 }}>*</span></label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            inputMode="tel" placeholder="08X-XXX-XXXX" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>เรื่องที่อยากปรึกษา</label>
          <textarea value={concern} onChange={(e) => setConcern(e.target.value)}
            rows={4} placeholder="เช่น อยากลดน้ำตาลในเลือด นอนไม่หลับ..."
            style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />
        </div>
        <div style={{
          padding: 12, background: palette.primarySoft, borderRadius: 10,
          fontSize: 12, color: palette.inkSoft, lineHeight: 1.5,
        }}>
          🔒 ข้อมูลของคุณจะใช้สำหรับการติดต่อกลับเท่านั้น และเก็บเป็นความลับ
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <PrimaryButton palette={palette} onClick={() => setSubmitted(true)} disabled={!valid}>
          ส่งคำขอปรึกษา
        </PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { ResultScreen, ConsultScreen });
