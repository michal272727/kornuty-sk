// Reusable SVG illustration components - pastel, hand-drawn line-art style
// All illustrations are 64x64 viewBox, designed to nest inside circular tiles

const STROKE = '#3D2B1F';

// Generic ingredient pill/blob — used as fallback when no specific illustration exists
function GenericNut({ color = '#D4A878' }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="34" rx="18" ry="22" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M22 28 Q32 18 42 28" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// Category icons - simple, recognizable
function IconFruit() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="32" cy="36" r="20" fill="#F8A88E" stroke={STROKE} strokeWidth="2.5" />
      <path d="M32 16 Q34 10 40 8" stroke="#7A9A4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="10" rx="5" ry="3" fill="#9AC56A" stroke={STROKE} strokeWidth="2" transform="rotate(20 38 10)" />
      <circle cx="26" cy="32" r="2" fill="#fff" opacity="0.6" />
    </svg>
  );
}
function IconNuts() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="34" rx="16" ry="20" fill="#D4A878" stroke={STROKE} strokeWidth="2.5" />
      <path d="M32 16 L32 52" stroke={STROKE} strokeWidth="2" />
      <path d="M22 24 Q32 22 42 24" stroke={STROKE} strokeWidth="1.5" fill="none" />
      <path d="M22 36 Q32 34 42 36" stroke={STROKE} strokeWidth="1.5" fill="none" />
    </svg>
  );
}
function IconChoc() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect x="14" y="14" width="36" height="36" rx="3" fill="#7A4A2A" stroke={STROKE} strokeWidth="2.5" />
      <line x1="26" y1="14" x2="26" y2="50" stroke={STROKE} strokeWidth="1.5" />
      <line x1="38" y1="14" x2="38" y2="50" stroke={STROKE} strokeWidth="1.5" />
      <line x1="14" y1="26" x2="50" y2="26" stroke={STROKE} strokeWidth="1.5" />
      <line x1="14" y1="38" x2="50" y2="38" stroke={STROKE} strokeWidth="1.5" />
    </svg>
  );
}
function IconCandy() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="32" rx="14" ry="10" fill="#F58AA0" stroke={STROKE} strokeWidth="2.5" />
      <path d="M18 32 L8 24 L12 32 L8 40 Z" fill="#F58AA0" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M46 32 L56 24 L52 32 L56 40 Z" fill="#F58AA0" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M26 28 Q32 32 38 28" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function IconSalty() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M14 26 L50 26 L46 50 Q32 56 18 50 Z" fill="#F4DA9C" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="34" r="2" fill={STROKE} />
      <circle cx="32" cy="40" r="2" fill={STROKE} />
      <circle cx="40" cy="34" r="2" fill={STROKE} />
      <path d="M14 26 L50 26" stroke={STROKE} strokeWidth="2.5" />
      <path d="M22 18 Q32 12 42 18 L46 26 L18 26 Z" fill="#F8E8C0" stroke={STROKE} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
function IconSeed() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="22" cy="28" rx="6" ry="10" fill="#C89860" stroke={STROKE} strokeWidth="2" transform="rotate(-25 22 28)" />
      <ellipse cx="38" cy="36" rx="6" ry="10" fill="#A88858" stroke={STROKE} strokeWidth="2" transform="rotate(20 38 36)" />
      <ellipse cx="32" cy="22" rx="5" ry="8" fill="#D8B888" stroke={STROKE} strokeWidth="2" />
      <ellipse cx="44" cy="22" rx="4" ry="6" fill="#C89860" stroke={STROKE} strokeWidth="2" transform="rotate(30 44 22)" />
    </svg>
  );
}
function IconFreezeDried() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M32 12 L36 20 L44 18 L40 26 L48 30 L40 34 L44 42 L36 40 L32 48 L28 40 L20 42 L24 34 L16 30 L24 26 L20 18 L28 20 Z"
        fill="#F4A8B8" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="30" r="4" fill="#fff" opacity="0.7" />
    </svg>
  );
}

// Specific illustrations (a curated subset — others fall back to colored generic)
const ILLUS = {
  // FRUIT
  ananas: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect x="22" y="28" width="20" height="22" rx="3" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M22 34 L42 38 M22 42 L42 46 M22 38 L42 34 M22 46 L42 42" stroke={STROKE} strokeWidth="1" opacity="0.5" />
      <path d="M26 28 L24 16 L30 22 L32 12 L34 22 L40 16 L38 28" fill="#9AC56A" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  banan_chips: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="22" cy="28" r="9" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="22" cy="28" r="2" fill={STROKE} opacity="0.5" />
      <circle cx="42" cy="36" r="10" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="42" cy="36" r="2" fill={STROKE} opacity="0.5" />
      <circle cx="30" cy="46" r="8" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="30" cy="46" r="1.5" fill={STROKE} opacity="0.5" />
    </svg>
  ),
  brusnice: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="22" cy="28" r="8" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="40" cy="24" r="9" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="32" cy="42" r="10" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="20" cy="26" r="2" fill="#fff" opacity="0.5" />
      <circle cx="38" cy="22" r="2" fill="#fff" opacity="0.5" />
      <circle cx="30" cy="40" r="2.5" fill="#fff" opacity="0.5" />
    </svg>
  ),
  goji: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="22" cy="34" rx="6" ry="10" fill={color} stroke={STROKE} strokeWidth="2" />
      <ellipse cx="36" cy="28" rx="6" ry="10" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(20 36 28)" />
      <ellipse cx="44" cy="42" rx="5" ry="9" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(-15 44 42)" />
    </svg>
  ),
  kokos_chips: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M14 32 Q24 18 38 22 Q42 38 30 46 Q18 44 14 32 Z" fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 24 Q52 30 50 42 Q44 46 38 42" fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 32 Q24 18 38 22" stroke="#8B6F47" strokeWidth="2" fill="none" />
    </svg>
  ),
  // NUTS
  arasid: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M32 12 Q42 14 42 22 Q42 28 38 32 Q42 36 42 42 Q42 50 32 52 Q22 50 22 42 Q22 36 26 32 Q22 28 22 22 Q22 14 32 12 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 32 L42 32" stroke={STROKE} strokeWidth="1.5" opacity="0.5" />
      <path d="M28 18 Q32 16 36 18 M28 46 Q32 48 36 46" stroke={STROKE} strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  ),
  mandle: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M32 12 Q44 22 44 38 Q44 50 32 52 Q20 50 20 38 Q20 22 32 12 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 16 L32 48" stroke={STROKE} strokeWidth="1.5" opacity="0.4" />
    </svg>
  ),
  lieskove: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="32" cy="36" r="18" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M32 18 L28 14 L36 14 Z" fill="#D4A878" stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 38 Q32 34 42 38" stroke={STROKE} strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  ),
  vlasske: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="32" cy="32" r="20" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M32 14 Q24 24 24 32 Q24 40 32 50 Q40 40 40 32 Q40 24 32 14"
        stroke={STROKE} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M14 32 Q24 28 32 32 Q40 36 50 32" stroke={STROKE} strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
  ),
  pistacie: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="34" rx="14" ry="18" fill="#D4A878" stroke={STROKE} strokeWidth="2" />
      <path d="M32 22 Q26 28 26 36 Q26 44 32 48 Q38 44 38 36 Q38 28 32 22 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  // CHOCOLATE - generic chocolate-coated ball
  chocBall: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="22" cy="28" r="9" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="40" cy="36" r="10" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="28" cy="46" r="7" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="20" cy="26" r="2" fill="#fff" opacity="0.4" />
      <circle cx="38" cy="34" r="2.5" fill="#fff" opacity="0.4" />
    </svg>
  ),
  kavove: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="32" rx="14" ry="20" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M32 14 L32 50" stroke="#fff" strokeWidth="2" opacity="0.4" />
    </svg>
  ),
  // CANDY
  mega_med: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <circle cx="32" cy="38" r="14" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="32" cy="22" r="9" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="22" cy="16" r="4" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="42" cy="16" r="4" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="20" cy="40" r="4" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="44" cy="40" r="4" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="29" cy="21" r="1.2" fill={STROKE} />
      <circle cx="35" cy="21" r="1.2" fill={STROKE} />
    </svg>
  ),
  mini_med: ({ color }) => ILLUS.mega_med({ color }),
  cola: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M26 14 L26 18 L24 18 L24 22 L22 22 L22 50 Q22 54 26 54 L38 54 Q42 54 42 50 L42 22 L40 22 L40 18 L38 18 L38 14 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 30 L42 30" stroke="#fff" strokeWidth="2" opacity="0.4" />
    </svg>
  ),
  zabky: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="38" rx="18" ry="14" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="22" cy="22" r="6" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="42" cy="22" r="6" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="22" cy="22" r="2" fill={STROKE} />
      <circle cx="42" cy="22" r="2" fill={STROKE} />
      <path d="M26 42 Q32 46 38 42" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  hady: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M14 40 Q22 28 32 40 Q42 52 50 40" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M14 40 Q22 28 32 40 Q42 52 50 40" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="38" r="1.5" fill={STROKE} />
    </svg>
  ),
  cerviky: ({ color }) => ILLUS.hady({ color }),
  pendrek: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <rect x="14" y="22" width="36" height="20" rx="4" fill={color} stroke={STROKE} strokeWidth="2" />
      <line x1="22" y1="22" x2="22" y2="42" stroke="#fff" strokeWidth="1.5" opacity="0.3" />
      <line x1="32" y1="22" x2="32" y2="42" stroke="#fff" strokeWidth="1.5" opacity="0.3" />
      <line x1="42" y1="22" x2="42" y2="42" stroke="#fff" strokeWidth="1.5" opacity="0.3" />
    </svg>
  ),
  zuby: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M14 32 Q14 24 22 24 L42 24 Q50 24 50 32 L50 42 L42 50 L34 44 L30 44 L22 50 L14 42 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 24 L22 42 M30 24 L30 44 M34 24 L34 44 M42 24 L42 42" stroke={STROKE} strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  vajicka: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="22" cy="32" rx="9" ry="12" fill={color} stroke={STROKE} strokeWidth="2" />
      <ellipse cx="42" cy="36" rx="10" ry="13" fill={color} stroke={STROKE} strokeWidth="2" />
    </svg>
  ),
  sovicky: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="36" rx="16" ry="18" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M16 22 L24 30 M48 22 L40 30" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="32" r="5" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="38" cy="32" r="5" fill="#fff" stroke={STROKE} strokeWidth="1.5" />
      <circle cx="26" cy="33" r="2" fill={STROKE} />
      <circle cx="38" cy="33" r="2" fill={STROKE} />
      <path d="M30 40 L32 43 L34 40 Z" fill="#FFA840" stroke={STROKE} strokeWidth="1" />
    </svg>
  ),
  // FREEZE-DRIED
  jahody_m: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M32 14 Q44 16 46 30 Q46 46 32 52 Q18 46 18 30 Q20 16 32 14 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="26" cy="26" r="1.5" fill="#fff" />
      <circle cx="36" cy="28" r="1.5" fill="#fff" />
      <circle cx="30" cy="36" r="1.5" fill="#fff" />
      <circle cx="38" cy="40" r="1.5" fill="#fff" />
      <path d="M28 14 L26 8 L34 12 L38 6 L40 14" stroke="#7A9A4A" strokeWidth="2" fill="#9AC56A" strokeLinejoin="round" />
    </svg>
  ),
  maliny_m: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <g stroke={STROKE} strokeWidth="1.5">
        <circle cx="26" cy="26" r="5" fill={color} />
        <circle cx="36" cy="26" r="5" fill={color} />
        <circle cx="22" cy="34" r="5" fill={color} />
        <circle cx="32" cy="34" r="5" fill={color} />
        <circle cx="42" cy="34" r="5" fill={color} />
        <circle cx="26" cy="42" r="5" fill={color} />
        <circle cx="36" cy="42" r="5" fill={color} />
      </g>
    </svg>
  ),
  mango_m: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <path d="M20 28 Q14 36 18 46 Q26 52 36 50 Q48 46 48 32 Q44 22 32 22 Q24 22 20 28 Z"
        fill={color} stroke={STROKE} strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 28 Q34 32 38 38" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  ),
  dracie: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="32" cy="34" rx="16" ry="20" fill={color} stroke={STROKE} strokeWidth="2" />
      <circle cx="26" cy="28" r="1.5" fill={STROKE} />
      <circle cx="36" cy="32" r="1.5" fill={STROKE} />
      <circle cx="28" cy="38" r="1.5" fill={STROKE} />
      <circle cx="38" cy="42" r="1.5" fill={STROKE} />
      <circle cx="32" cy="34" r="1.5" fill={STROKE} />
      <path d="M22 18 L26 14 L28 20 M40 18 L44 14 L42 20" stroke={STROKE} strokeWidth="1.5" fill="#9AC56A" strokeLinejoin="round" />
    </svg>
  ),
  // SEEDS
  slnecn: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="22" cy="32" rx="5" ry="9" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(-25 22 32)" />
      <ellipse cx="40" cy="34" rx="5" ry="9" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(15 40 34)" />
      <ellipse cx="32" cy="22" rx="5" ry="8" fill={color} stroke={STROKE} strokeWidth="2" />
      <ellipse cx="32" cy="44" rx="4" ry="7" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(40 32 44)" />
    </svg>
  ),
  tekvica: ({ color }) => (
    <svg viewBox="0 0 64 64" width="100%" height="100%">
      <ellipse cx="22" cy="32" rx="6" ry="10" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(-20 22 32)" />
      <ellipse cx="40" cy="36" rx="6" ry="10" fill={color} stroke={STROKE} strokeWidth="2" transform="rotate(15 40 36)" />
      <ellipse cx="32" cy="22" rx="5" ry="9" fill={color} stroke={STROKE} strokeWidth="2" />
    </svg>
  ),
};

// Render an ingredient — prefers real photo from IMAGE_MAP, falls back to SVG illustration
function IngIllus({ id, color, size = '100%' }) {
  // Re-render when image map finishes loading
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const handler = () => force(x => x + 1);
    window.addEventListener('imagemap-loaded', handler);
    return () => window.removeEventListener('imagemap-loaded', handler);
  }, []);

  const photoUrl = window.IMAGE_MAP && window.IMAGE_MAP[id];
  if (photoUrl) {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '50%' }}>
        <img
          src={photoUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    );
  }

  // chocolate-coated items use the chocBall variant
  let Component = ILLUS[id];
  if (!Component) {
    if (id && id.includes('_ml') || id && id.includes('_h') || id && id.includes('_jog') || id && id.includes('_kar') || id && id.includes('_sk') || id && id.includes('_jah')) {
      Component = ILLUS.chocBall;
    } else {
      Component = ({ color }) => <GenericNut color={color} />;
    }
  }
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Component color={color} />
    </div>
  );
}

function CategoryIcon({ id }) {
  const map = {
    ovocie: IconFruit, orechy: IconNuts, cokolada: IconChoc,
    cukrovinky: IconCandy, slane: IconSalty, semienka: IconSeed, mrazom: IconFreezeDried,
  };
  const C = map[id] || IconFruit;
  return <C />;
}

Object.assign(window, { IngIllus, CategoryIcon, GenericNut });
