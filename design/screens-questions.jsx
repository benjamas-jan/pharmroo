// Pharmroo screens — welcome, sections, result, consult

// ── Welcome ────────────────────────────────────────────────────────────────
function WelcomeScreen({ palette, onStart }) {
  return (
    <div style={{
      padding: '24px 20px 32px', display: 'flex', flexDirection: 'column',
      minHeight: '100%', boxSizing: 'border-box',
    }}>
      {/* Brand mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: palette.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: palette.primaryInk, fontWeight: 700, fontSize: 14,
          fontFamily: '"IBM Plex Sans", system-ui',
        }}>P</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: palette.ink, letterSpacing: '-0.01em' }}>
          Pharmroo
        </div>
        <div style={{ fontSize: 11, color: palette.inkMute, marginLeft: 'auto', letterSpacing: '0.05em' }}>
          ฟามรู้
        </div>
      </div>

      {/* Hero illustration — abstract shapes */}
      <div style={{
        position: 'relative', height: 180, marginBottom: 24,
        background: palette.primarySoft,
        borderRadius: 24, overflow: 'hidden',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"
             style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill={palette.primary} fillOpacity="0.18" />
            </pattern>
          </defs>
          <rect width="320" height="180" fill="url(#dots)" />
          <circle cx="80" cy="100" r="60" fill={palette.primary} fillOpacity="0.18" />
          <circle cx="220" cy="70" r="42" fill={palette.accent} fillOpacity="0.55" />
          <circle cx="240" cy="130" r="28" fill={palette.primary} fillOpacity="0.30" />
        </svg>
        <div style={{
          position: 'absolute', left: 20, bottom: 16,
          background: palette.card, padding: '6px 10px', borderRadius: 999,
          fontSize: 11, color: palette.inkSoft, fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          ⏱ ใช้เวลา 2 นาที
        </div>
      </div>

      <h1 style={{
        fontSize: 28, fontWeight: 700, color: palette.ink,
        letterSpacing: '-0.025em', lineHeight: 1.15, margin: 0,
      }}>
        เช็กความเสี่ยง<br/>โรค NCDs ของคุณ
      </h1>
      <p style={{
        fontSize: 15, color: palette.inkSoft, lineHeight: 1.55, marginTop: 12, marginBottom: 24,
      }}>
        ตอบคำถาม 15 ข้อ เกี่ยวกับร่างกาย เครื่องดื่ม อาหาร และไลฟ์สไตล์
        เพื่อรู้ระดับความเสี่ยงและจุดที่ควรปรับ
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {[
          ['15 คำถาม',          '4 หมวด · ใช้เวลาประมาณ 2 นาที'],
          ['เห็นผลทันที',         'รู้ระดับความเสี่ยงและคะแนนแต่ละด้าน'],
          ['ข้อมูลของคุณเป็นส่วนตัว', 'ไม่บันทึกผล ไม่แชร์ใคร'],
        ].map(([t, sub], i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '12px 14px', background: palette.card,
            border: `1px solid ${palette.line}`, borderRadius: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: palette.primarySoft,
              color: palette.primary, fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontFamily: '"IBM Plex Sans", system-ui',
            }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: palette.ink }}>{t}</div>
              <div style={{ fontSize: 12.5, color: palette.inkMute, marginTop: 1 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <PrimaryButton palette={palette} onClick={onStart}>เริ่มทำแบบประเมิน</PrimaryButton>
        <div style={{ fontSize: 11, color: palette.inkMute, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
          แบบประเมินนี้เป็นเพียงแนวทางเบื้องต้น<br/>ไม่ใช่การวินิจฉัยทางการแพทย์
        </div>
      </div>
    </div>
  );
}

// ── Section A: Body ────────────────────────────────────────────────────────
function SectionA({ palette, answers, setAnswer }) {
  const bmi = bmiValue(answers.weight, answers.height);
  const waistCutoff = answers.gender === 'male' ? 90 : answers.gender === 'female' ? 80 : null;
  return (
    <>
      <SectionHeader section={SECTIONS[0]} palette={palette} />

      <QHeader num="คำถามที่ 1" title="เพศของคุณ?" hint="เกณฑ์เสี่ยงเอวต่างกันตามเพศ (Thai CPG)" palette={palette} />
      <div style={{ display: 'flex', gap: 8 }}>
        {OPT.gender.map(o => (
          <PillChoice key={o.id} option={o} palette={palette}
            selected={answers.gender === o.id} onSelect={(v) => setAnswer('gender', v)} />
        ))}
      </div>

      <div style={{ height: 20 }} />
      <QHeader num="คำถามที่ 2" title="น้ำหนักของคุณเท่าไหร่?" palette={palette} />
      <NumberField
        label="น้ำหนัก" unit="กิโลกรัม" palette={palette}
        value={answers.weight} onChange={(v) => setAnswer('weight', v)}
        min={30} max={200} suggestion="30–200 kg"
      />
      <div style={{ height: 16 }} />
      <QHeader num="คำถามที่ 3" title="ส่วนสูงของคุณ?" palette={palette} />
      <NumberField
        label="ส่วนสูง" unit="เซนติเมตร" palette={palette}
        value={answers.height} onChange={(v) => setAnswer('height', v)}
        min={130} max={220} suggestion="130–220 cm"
      />
      {bmi && (
        <div style={{
          marginTop: 10, padding: '10px 14px', background: palette.primarySoft,
          borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: palette.inkSoft }}>BMI (เกณฑ์ไทย)</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: palette.primary, fontFamily: '"IBM Plex Sans", system-ui' }}>
            {bmi.toFixed(1)} <span style={{ fontWeight: 500, fontSize: 12, color: palette.inkSoft, marginLeft: 4 }}>{bmiLabel(bmi)}</span>
          </span>
        </div>
      )}
      <div style={{ height: 16 }} />
      <QHeader num="คำถามที่ 4" title="รอบเอวของคุณ?" hint={answers.waistUnknown ? 'จะประเมินจาก BMI แทน' : (waistCutoff ? `เกณฑ์เอเชีย: ${answers.gender === 'male' ? 'ชาย ≥90 ซม.' : 'หญิง ≥80 ซม.'} = เสี่ยงอ้วนลงพุง` : 'วัดที่ระดับสะดือ')} palette={palette} />
      <div style={{ opacity: answers.waistUnknown ? 0.4 : 1, pointerEvents: answers.waistUnknown ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
        <NumberField
          label="รอบเอว" unit="เซนติเมตร" palette={palette}
          value={answers.waist} onChange={(v) => setAnswer('waist', v)}
          min={50} max={150} suggestion="50–150 cm"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          const next = !answers.waistUnknown;
          setAnswer('waistUnknown', next);
          if (next) setAnswer('waist', null);
        }}
        style={{
          marginTop: 8, padding: '10px 12px', width: '100%',
          background: answers.waistUnknown ? palette.primarySoft : 'transparent',
          border: `1px dashed ${answers.waistUnknown ? palette.primary : palette.border}`,
          borderRadius: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: answers.waistUnknown ? palette.primary : palette.inkSoft,
          fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span>ไม่ทราบรอบเอว — ประเมินจาก BMI แทน</span>
        <span style={{
          width: 18, height: 18, borderRadius: 5,
          border: `1.5px solid ${answers.waistUnknown ? palette.primary : palette.border}`,
          background: answers.waistUnknown ? palette.primary : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: palette.primaryInk, fontSize: 11, fontWeight: 700,
        }}>{answers.waistUnknown ? '✓' : ''}</span>
      </button>
      <div style={{ height: 16 }} />
      <QHeader num="คำถามที่ 5" title="อายุของคุณ?" palette={palette} />
      <NumberField
        label="อายุ" unit="ปี" palette={palette}
        value={answers.age} onChange={(v) => setAnswer('age', v)}
        min={18} max={100} suggestion="18–100 ปี"
      />
    </>
  );
}

// ── Section B: Drinks (with sweet 2-step) ─────────────────────────────────
function SectionB({ palette, answers, setAnswer }) {
  const showLevel = (answers.sweetCount ?? 0) >= 1;
  return (
    <>
      <SectionHeader section={SECTIONS[1]} palette={palette} />

      <QHeader num="คำถามที่ 6" title="ดื่มน้ำเปล่ากี่แก้วต่อวัน?" hint="1 แก้ว ≈ 240 มล." palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.water.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.water === o.id} onSelect={(v) => setAnswer('water', v)} />
        ))}
      </div>

      <div style={{ height: 24 }} />
      <QHeader num="คำถามที่ 7" title="ดื่มเครื่องดื่มหวานกี่แก้วต่อวัน?" hint="ชา กาแฟ น้ำหวาน น้ำอัดลม" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.sweetCount.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.sweetCount === o.id}
            onSelect={(v) => {
              setAnswer('sweetCount', v);
              if (v === 0) setAnswer('sweetLevel', undefined);
            }} />
        ))}
      </div>

      {/* 2-step: sweet level — smooth height transition */}
      <div style={{
        overflow: 'hidden',
        maxHeight: showLevel ? 200 : 0,
        opacity: showLevel ? 1 : 0,
        transition: 'max-height 320ms cubic-bezier(.2,.7,.2,1), opacity 240ms 80ms',
      }}>
        <div style={{ paddingTop: 14 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: palette.inkSoft, marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 14, height: 1.5, background: palette.primary, borderRadius: 1 }} />
            ระดับความหวาน
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {OPT.sweetLevel.map(o => (
              <PillChoice key={o.id} option={o} palette={palette}
                selected={answers.sweetLevel === o.id}
                onSelect={(v) => setAnswer('sweetLevel', v)} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />
      <QHeader num="คำถามที่ 8" title="ดื่มเครื่องดื่มไม่หวานกี่แก้วต่อวัน?" hint="ชา/กาแฟดำ น้ำสมุนไพรไม่หวาน" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.unsweet.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.unsweet === o.id} onSelect={(v) => setAnswer('unsweet', v)} />
        ))}
      </div>

      <div style={{ height: 24 }} />
      <QHeader num="คำถามที่ 9" title="ดื่มแอลกอฮอล์บ่อยแค่ไหน?" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.alcohol.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.alcohol === o.id} onSelect={(v) => setAnswer('alcohol', v)} />
        ))}
      </div>
    </>
  );
}

// ── Section C: Diet ────────────────────────────────────────────────────────
function SectionC({ palette, answers, setAnswer }) {
  return (
    <>
      <SectionHeader section={SECTIONS[2]} palette={palette} />

      <QHeader num="คำถามที่ 10" title="กินข้าวเช้าบ่อยแค่ไหน?" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.breakfast.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.breakfast === o.id} onSelect={(v) => setAnswer('breakfast', v)} />
        ))}
      </div>

      <div style={{ height: 24 }} />
      <QHeader num="คำถามที่ 11" title="ในมื้ออาหาร มีผัก/ผลไม้ประมาณเท่าไหร่?" hint="คิดเป็นสัดส่วนของจาน" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.vegetable.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.vegetable === o.id} onSelect={(v) => setAnswer('vegetable', v)} />
        ))}
      </div>
      <QHeader num="คำถามที่ 12" title="กินอาหารเสริมเป็นประจำไหม?" hint="วิตามิน, แร่ธาตุ, สมุนไพร, น้ำมันปลา ฯลฯ" palette={palette} />
      <div style={{ display: 'flex', gap: 8 }}>
        {OPT.supplement.map(o => (
          <PillChoice key={o.id} option={o} palette={palette}
            selected={answers.supplement === o.id} onSelect={(v) => setAnswer('supplement', v)} />
        ))}
      </div>
    </>
  );
}
function SectionD({ palette, answers, setAnswer }) {
  return (
    <>
      <SectionHeader section={SECTIONS[3]} palette={palette} />

      <QHeader num="คำถามที่ 13" title="ออกกำลังกายต่อสัปดาห์?" hint="รวมเดินเร็ว วิ่ง ปั่นจักรยาน ฯลฯ" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.exercise.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.exercise === o.id} onSelect={(v) => setAnswer('exercise', v)} />
        ))}
      </div>

      <div style={{ height: 24 }} />
      <QHeader num="คำถามที่ 14" title="ปกติคุณนอนกี่ชั่วโมงต่อคืน?" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.sleep.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.sleep === o.id} onSelect={(v) => setAnswer('sleep', v)} />
        ))}
      </div>

      <div style={{ height: 24 }} />
      <QHeader num="คำถามที่ 15" title="ระดับความเครียดในช่วงนี้?" palette={palette} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPT.stress.map(o => (
          <ChoiceCard key={o.id} option={o} palette={palette}
            selected={answers.stress === o.id} onSelect={(v) => setAnswer('stress', v)} />
        ))}
      </div>
    </>
  );
}

// Section completeness check
function isSectionComplete(idx, answers) {
  if (idx === 1) return answers.gender && answers.weight && answers.height && (answers.waist || answers.waistUnknown) && answers.age;
  if (idx === 2) {
    if (!answers.water || !answers.unsweet || !answers.alcohol) return false;
    if (answers.sweetCount === undefined) return false;
    if (answers.sweetCount >= 1 && !answers.sweetLevel) return false;
    return true;
  }
  if (idx === 3) return answers.breakfast && answers.vegetable && answers.supplement;
  if (idx === 4) return answers.exercise && answers.sleep && answers.stress;
  return false;
}

Object.assign(window, {
  WelcomeScreen, SectionA, SectionB, SectionC, SectionD, isSectionComplete,
});
