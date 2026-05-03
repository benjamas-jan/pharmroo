// Pharmroo main app — orchestrates state and screen flow

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sage",
  "showFrame": true,
  "density": "comfortable"
}/*EDITMODE-END*/;

// Step model:
//  0 = welcome
//  1..4 = section A..D
//  5 = result
//  6 = consult
function PharmrooApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = getPalette(tweaks.palette);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const scrollRef = useRef(null);

  const setAnswer = (key, value) => setAnswers(prev => {
    const next = { ...prev, [key]: value };
    return next;
  });

  // Scroll to top whenever step changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  const sectionStep = step >= 1 && step <= 4 ? step : null;
  const inSection = sectionStep !== null;
  const canProceed = inSection ? isSectionComplete(sectionStep, answers) : true;

  const goNext = () => {
    if (step >= 1 && step <= 3) setStep(step + 1);
    else if (step === 4) setStep(5); // -> result
  };
  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };
  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  // Body content per step
  let body;
  if (step === 0) {
    body = <WelcomeScreen palette={palette} onStart={() => setStep(1)} />;
  } else if (step === 1) {
    body = <SectionA palette={palette} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 2) {
    body = <SectionB palette={palette} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 3) {
    body = <SectionC palette={palette} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 4) {
    body = <SectionD palette={palette} answers={answers} setAnswer={setAnswer} />;
  } else if (step === 5) {
    body = <ResultScreen palette={palette} answers={answers}
              onConsult={() => setStep(6)} onRestart={restart} />;
  } else if (step === 6) {
    body = <ConsultScreen palette={palette} onBack={() => setStep(5)} />;
  }

  // iOS status bar reserve (when inside iPhone frame)
  const statusBarH = tweaks.showFrame ? 54 : 0;

  // ── LINE-style header (when inside a section or on result) ───────────────
  const showLineHeader = step > 0;
  const lineHeader = showLineHeader && (
    <div style={{
      position: 'sticky', top: 0, zIndex: 5,
      background: palette.bg,
      borderBottom: `1px solid ${palette.line}`,
      padding: `${8 + statusBarH}px 12px 8px`,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <button type="button" onClick={goBack} disabled={step === 0}
        style={{
          width: 32, height: 32, borderRadius: 999, border: 'none',
          background: 'transparent', color: palette.ink, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11.5 3L5.5 9L11.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: palette.ink, letterSpacing: '-0.005em' }}>
          Pharmroo
        </div>
        <div style={{ fontSize: 10.5, color: palette.inkMute, marginTop: 1 }}>
          {step >= 1 && step <= 4 && 'แบบประเมินความเสี่ยง'}
          {step === 5 && 'ผลประเมิน'}
          {step === 6 && 'ปรึกษาผู้เชี่ยวชาญ'}
        </div>
      </div>
      <button type="button" onClick={() => {}} aria-label="ปิด"
        style={{
          width: 32, height: 32, borderRadius: 999, border: 'none',
          background: 'transparent', color: palette.inkSoft, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );

  // Section progress bar
  const showProgress = inSection;
  const progressBar = showProgress && (
    <div style={{
      padding: '14px 16px 8px', background: palette.bg,
      borderBottom: `1px solid ${palette.line}`,
    }}>
      <SectionProgress
        current={sectionStep} palette={palette}
        onJump={(idx) => {
          // Only allow jumping to a previous section
          if (idx <= sectionStep) setStep(idx);
        }}
      />
    </div>
  );

  // Footer with continue button
  const showFooter = inSection;
  const footer = showFooter && (
    <div style={{
      position: 'sticky', bottom: 0, zIndex: 5,
      background: `linear-gradient(to top, ${palette.bg} 70%, ${palette.bg}00)`,
      padding: '14px 20px 18px',
    }}>
      <PrimaryButton palette={palette} onClick={goNext} disabled={!canProceed}>
        {step === 4 ? 'ดูผลประเมิน' : 'ถัดไป'}
      </PrimaryButton>
    </div>
  );

  // Content area (everything between header and footer)
  const contentEl = (
    <div ref={scrollRef} data-screen-label={
      step === 0 ? '01 Welcome'
      : step === 1 ? '02 Section A — Body'
      : step === 2 ? '03 Section B — Drinks'
      : step === 3 ? '04 Section C — Diet'
      : step === 4 ? '05 Section D — Lifestyle'
      : step === 5 ? '06 Result'
      : '07 Consult'
    } style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      background: palette.bg, color: palette.ink,
      WebkitOverflowScrolling: 'touch',
      // Ensure footer doesn't overlap content
      paddingBottom: showFooter ? 0 : 0,
    }}>
      {/* iOS status bar spacer for screens that lack the LINE header (welcome) */}
      {step === 0 && statusBarH > 0 && <div style={{ height: statusBarH }} />}
      {step > 0 && step <= 4 && (
        <div style={{ padding: '8px 20px 24px' }}>{body}</div>
      )}
      {(step === 0 || step === 5 || step === 6) && body}
    </div>
  );

  // Stack layout (header → progress → content → footer) inside the device
  const inner = (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: palette.bg,
      fontFamily: '"IBM Plex Sans Thai", "IBM Plex Sans", system-ui, sans-serif',
      color: palette.ink,
    }}>
      {lineHeader}
      {progressBar}
      {contentEl}
      {footer}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: tweaks.showFrame
        ? `radial-gradient(circle at 30% 0%, ${palette.primarySoft} 0%, ${palette.bg} 50%)`
        : palette.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: tweaks.showFrame ? '32px 16px' : 0,
      boxSizing: 'border-box',
    }}>
      {tweaks.showFrame ? (
        <div style={{ position: 'relative' }}>
          <IOSDevice width={390} height={812}>
            {inner}
          </IOSDevice>
        </div>
      ) : (
        <div style={{
          width: '100%', maxWidth: 480, height: '100vh',
          background: palette.bg, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {inner}
        </div>
      )}

      <TweaksPanel title="Pharmroo · Tweaks">
        <TweakSection label="THEME">
          <TweakRadio
            label="Palette" value={tweaks.palette}
            options={[
              { value: 'sage', label: 'Sage' },
              { value: 'ocean', label: 'Ocean' },
              { value: 'butter', label: 'Butter' },
            ]}
            onChange={(v) => setTweak('palette', v)}
          />
          <TweakRadio
            label="Density" value={tweaks.density}
            options={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
            onChange={(v) => setTweak('density', v)}
          />
        </TweakSection>
        <TweakSection label="DISPLAY">
          <TweakToggle
            label="Show iPhone frame"
            value={tweaks.showFrame}
            onChange={(v) => setTweak('showFrame', v)}
          />
        </TweakSection>
        <TweakSection label="DEMO">
          <TweakButton onClick={() => {
            setAnswers({
              gender: 'male',
              weight: 78, height: 170, waist: 92, age: 42,
              water: '3-5', sweetCount: 2, sweetLevel: 'normal',
              unsweet: '1-2', alcohol: 'social',
              breakfast: 'sometimes', vegetable: 'side',
              exercise: '<60', sleep: '6-7', stress: 'high',
            });
            setStep(5);
          }}>Jump to result (demo data)</TweakButton>
          <TweakButton onClick={restart}>Reset</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PharmrooApp />);
