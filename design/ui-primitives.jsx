// Shared UI primitives for Pharmroo — choice cards, buttons, headers, etc.

// ── Theme tokens ───────────────────────────────────────────────────────────
const PALETTES = {
  sage: {
    bg: '#F6F4EE',
    card: '#FFFFFF',
    ink: '#1F2A24',
    inkSoft: '#5C6B63',
    inkMute: '#8A988F',
    line: '#E5E2D8',
    primary: '#3C5A48',     // deep eucalyptus
    primarySoft: '#E7EDE6',
    primaryInk: '#FFFFFF',
    accent: '#C7B89E',       // warm sand
    risk: { low: '#5B8A6B', moderate: '#C9A24C', high: '#C26A3D', very_high: '#9C3D2E' },
  },
  ocean: {
    bg: '#F2F5F7',
    card: '#FFFFFF',
    ink: '#0F2330',
    inkSoft: '#476078',
    inkMute: '#8194A4',
    line: '#E1E7EC',
    primary: '#1F4E6B',
    primarySoft: '#E4ECF1',
    primaryInk: '#FFFFFF',
    accent: '#7FB7C2',
    risk: { low: '#3F8C8E', moderate: '#D2A24C', high: '#D26A4A', very_high: '#9F3D2E' },
  },
  butter: {
    bg: '#FBF7EE',
    card: '#FFFFFF',
    ink: '#2A2418',
    inkSoft: '#6B6151',
    inkMute: '#9A917E',
    line: '#EDE6D5',
    primary: '#B85C2E',     // terracotta
    primarySoft: '#F6E6DA',
    primaryInk: '#FFFFFF',
    accent: '#D9B45A',
    risk: { low: '#6B8A4D', moderate: '#D2A24C', high: '#C26A3D', very_high: '#9C3D2E' },
  },
};

function getPalette(name) {
  return PALETTES[name] || PALETTES.sage;
}

// ── Choice Card (radio-style large tap target) ────────────────────────────
function ChoiceCard({ option, selected, onSelect, palette, density = 'comfortable' }) {
  const pad = density === 'compact' ? '12px 14px' : '16px 16px';
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: pad,
        borderRadius: 14,
        border: `1.5px solid ${selected ? palette.primary : palette.line}`,
        background: selected ? palette.primarySoft : palette.card,
        color: palette.ink,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'all 160ms cubic-bezier(.2,.7,.2,1)',
        fontFamily: 'inherit',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: selected ? `0 1px 0 ${palette.primary}10, 0 6px 16px ${palette.primary}1A` : 'none',
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: 999,
        border: `2px solid ${selected ? palette.primary : palette.line}`,
        background: selected ? palette.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 160ms',
      }}>
        {selected && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.005em' }}>
          {option.label}
        </div>
        {option.sub && (
          <div style={{ fontSize: 12.5, color: palette.inkMute, marginTop: 2, lineHeight: 1.3 }}>
            {option.sub}
          </div>
        )}
      </span>
    </button>
  );
}

// ── Pill Choice (smaller, for sweet level row) ────────────────────────────
function PillChoice({ option, selected, onSelect, palette }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      style={{
        flex: 1,
        padding: '12px 8px',
        borderRadius: 12,
        border: `1.5px solid ${selected ? palette.primary : palette.line}`,
        background: selected ? palette.primarySoft : palette.card,
        color: palette.ink,
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'center',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 160ms cubic-bezier(.2,.7,.2,1)',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>{option.label}</div>
      {option.sub && (
        <div style={{ fontSize: 11, color: palette.inkMute, marginTop: 3, lineHeight: 1.2 }}>
          {option.sub}
        </div>
      )}
    </button>
  );
}

// ── Number Stepper ─────────────────────────────────────────────────────────
function NumberField({ label, unit, value, onChange, min, max, palette, suggestion }) {
  const ref = React.useRef(null);
  const handle = (delta) => {
    const cur = value ?? min;
    const next = Math.max(min, Math.min(max, cur + delta));
    onChange(next);
  };
  return (
    <div style={{
      background: palette.card,
      border: `1.5px solid ${palette.line}`,
      borderRadius: 16,
      padding: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: palette.ink, whiteSpace: 'nowrap' }}>{label}</span>
        {suggestion && (
          <span style={{ fontSize: 12, color: palette.inkMute, whiteSpace: 'nowrap' }}>{suggestion}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={() => handle(-1)}
          aria-label="ลด"
          style={{
            width: 40, height: 40, borderRadius: 999,
            border: `1.5px solid ${palette.line}`, background: palette.card,
            color: palette.ink, cursor: 'pointer', fontSize: 22, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}
        >−</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <input
            ref={ref}
            type="number"
            inputMode="numeric"
            value={value ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '') return onChange(undefined);
              const n = parseInt(v, 10);
              if (!isNaN(n)) onChange(n);
            }}
            placeholder="—"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              textAlign: 'center',
              fontFamily: 'inherit',
              fontSize: 32,
              fontWeight: 700,
              color: palette.ink,
              letterSpacing: '-0.02em',
              padding: 0,
            }}
          />
          <div style={{ fontSize: 12, color: palette.inkMute, marginTop: -2 }}>{unit}</div>
        </div>
        <button
          type="button"
          onClick={() => handle(+1)}
          aria-label="เพิ่ม"
          style={{
            width: 40, height: 40, borderRadius: 999,
            border: `1.5px solid ${palette.line}`, background: palette.card,
            color: palette.ink, cursor: 'pointer', fontSize: 22, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}
        >+</button>
      </div>
    </div>
  );
}

// ── Primary Button ─────────────────────────────────────────────────────────
function PrimaryButton({ children, onClick, disabled, palette, variant = 'primary' }) {
  const isPrimary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: 52,
        borderRadius: 14,
        border: isPrimary ? 'none' : `1.5px solid ${palette.line}`,
        background: disabled ? palette.line : (isPrimary ? palette.primary : palette.card),
        color: isPrimary ? palette.primaryInk : palette.ink,
        fontFamily: 'inherit',
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: '-0.005em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 160ms',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: disabled || !isPrimary ? 'none' : `0 8px 20px ${palette.primary}33`,
      }}
    >
      {children}
    </button>
  );
}

// ── Section progress badges (A · B · C · D) ────────────────────────────────
function SectionProgress({ current, palette, onJump }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
      {SECTIONS.map((s, i) => {
        const idx = i + 1;
        const state = idx < current ? 'done' : idx === current ? 'active' : 'pending';
        const bg = state === 'active' ? palette.primary : state === 'done' ? palette.primary : 'transparent';
        const border = state === 'pending' ? palette.line : palette.primary;
        const color = state === 'pending' ? palette.inkMute : palette.primaryInk;
        return (
          <React.Fragment key={s.id}>
            <button
              type="button"
              onClick={() => onJump && onJump(idx)}
              style={{
                width: state === 'active' ? 'auto' : 28,
                minWidth: 28,
                height: 28,
                padding: state === 'active' ? '0 12px' : 0,
                borderRadius: 999,
                background: bg,
                border: `1.5px solid ${border}`,
                color, fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: onJump ? 'pointer' : 'default',
                transition: 'all 220ms cubic-bezier(.2,.7,.2,1)',
                WebkitTapHighlightColor: 'transparent',
                gap: 6,
              }}
            >
              {state === 'done' ? (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : s.id}
              {state === 'active' && <span style={{ fontSize: 12, fontWeight: 600 }}>{s.title}</span>}
            </button>
            {i < SECTIONS.length - 1 && (
              <div style={{
                width: 14, height: 1.5, background: idx < current ? palette.primary : palette.line,
                borderRadius: 1, transition: 'all 220ms',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Question label header ─────────────────────────────────────────────────
function QHeader({ num, title, hint, palette }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: palette.primary,
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
        fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
      }}>
        {num}
      </div>
      <div style={{ fontSize: 18, fontWeight: 600, color: palette.ink, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
        {title}
      </div>
      {hint && (
        <div style={{ fontSize: 13, color: palette.inkSoft, marginTop: 4, lineHeight: 1.4 }}>{hint}</div>
      )}
    </div>
  );
}

// ── Section opener (when transitioning into a new section) ────────────────
function SectionHeader({ section, palette }) {
  return (
    <div style={{ padding: '4px 0 16px' }}>
      <div style={{
        fontSize: 11, fontWeight: 600, color: palette.primary,
        letterSpacing: '0.12em', fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
      }}>
        SECTION {section.id}
      </div>
      <div style={{
        fontSize: 26, fontWeight: 700, color: palette.ink,
        letterSpacing: '-0.02em', marginTop: 4, lineHeight: 1.1,
      }}>
        {section.title}
      </div>
      <div style={{ fontSize: 14, color: palette.inkSoft, marginTop: 6 }}>
        {section.subtitle}
      </div>
    </div>
  );
}

Object.assign(window, {
  PALETTES, getPalette,
  ChoiceCard, PillChoice, NumberField, PrimaryButton,
  SectionProgress, QHeader, SectionHeader,
});
