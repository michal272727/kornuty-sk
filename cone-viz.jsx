import React from 'react';

// Cone visualization — LIQUID LAYERS style (per reference screenshot)
// Each ingredient = a horizontal gradient band with subtle pattern texture,
// stacked bottom-up, filling the cone like layered liquid/sand.

const CAPACITY_TIERS = [500, 1000, 1500];

function getActiveCapacity(currentTier) {
  return CAPACITY_TIERS[Math.min(currentTier, CAPACITY_TIERS.length - 1)];
}

// Lighten a hex color by mixing with white
function lighten(hex, amt = 0.4) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * amt);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

// Pattern type per ingredient family — gives each band a distinct texture
function patternFor(id) {
  if (!id) return 'dots';
  if (id.includes('hady') || id.includes('cerviky') || id.includes('kysle_hus')) return 'wavy';
  if (id.includes('kysle_p') || id.includes('pendrek') || id.includes('lan')) return 'stripes';
  if (id === 'kysle_hv' || id.includes('hv')) return 'stars';
  if (id.includes('mandle') || id === 'pistacie' || id === 'slnecn' || id === 'tekvica' || id === 'pinia' || id === 'lieskove') return 'lozenges';
  if (id.includes('m') && (id.endsWith('_m') || id === 'banan_chips' || id === 'kokos_chips')) return 'pillows';
  return 'dots';
}

function PatternFill({ id, color, idSuffix }) {
  const kind = patternFor(id);
  const dark = color;
  const pid = `pat-${idSuffix}`;

  if (kind === 'wavy') {
    return (
      <pattern id={pid} width="14" height="8" patternUnits="userSpaceOnUse">
        <path d="M 0 4 Q 3.5 0 7 4 T 14 4" stroke={dark} strokeWidth="1.5" fill="none" opacity="0.5" />
      </pattern>
    );
  }
  if (kind === 'stripes') {
    return (
      <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
        <rect width="4" height="10" fill={dark} opacity="0.35" />
      </pattern>
    );
  }
  if (kind === 'stars') {
    return (
      <pattern id={pid} width="14" height="14" patternUnits="userSpaceOnUse">
        <path d="M 7 2 L 8.2 5.5 L 12 5.5 L 9 7.7 L 10 11.5 L 7 9.3 L 4 11.5 L 5 7.7 L 2 5.5 L 5.8 5.5 Z"
          fill={dark} opacity="0.4" />
      </pattern>
    );
  }
  if (kind === 'lozenges') {
    return (
      <pattern id={pid} width="12" height="10" patternUnits="userSpaceOnUse">
        <ellipse cx="6" cy="5" rx="4" ry="2.2" fill={dark} opacity="0.4" transform="rotate(-15 6 5)" />
      </pattern>
    );
  }
  if (kind === 'pillows') {
    return (
      <pattern id={pid} width="12" height="9" patternUnits="userSpaceOnUse">
        <rect x="2" y="2" width="8" height="5" rx="2.5" fill={dark} opacity="0.4" />
      </pattern>
    );
  }
  // dots
  return (
    <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="1.6" fill={dark} opacity="0.5" />
    </pattern>
  );
}

function ConeViz({ items, size = 'md', capacityTier = 0, lastAddedId = null }) {
  const total = items.reduce((s, i) => s + (i.weight || 0), 0);
  const capacity = getActiveCapacity(capacityTier);
  const fillPct = Math.min(total / capacity, 1);

  const tierScale = 1 + capacityTier * 0.10;
  const baseW = size === 'lg' ? 240 : size === 'sm' ? 160 : 220;
  const baseH = size === 'lg' ? 380 : size === 'sm' ? 240 : 340;
  const W = Math.round(baseW * (size === 'lg' ? 1 : tierScale * 0.95));
  const H = Math.round(baseH * (size === 'lg' ? 1 : tierScale * 0.95));

  const topY = 36;
  const bottomY = H - 30;
  const coneH = bottomY - topY;
  const halfW = (W - 32) / 2;

  const halfWAt = (y) => {
    const t = (bottomY - y) / coneH;
    return halfW * t;
  };

  // Build the cone path (clip)
  const conePath = `M 16 ${topY} L ${W - 16} ${topY} L ${W / 2 + 6} ${bottomY} Q ${W / 2} ${bottomY + 4} ${W / 2 - 6} ${bottomY} Z`;

  const fillBottomY = bottomY - 6;
  const fillTopY = topY + (1 - fillPct) * coneH;

  // Each item gets a horizontal band proportional to its weight share
  let cum = 0;
  const bands = items.map((it, idx) => {
    const share = total > 0 ? (it.weight || 0) / total : 0;
    const startY = fillBottomY - cum * (fillBottomY - fillTopY);
    cum += share;
    const endY = fillBottomY - cum * (fillBottomY - fillTopY);
    return { ...it, idx, top: endY, bot: startY, share };
  });

  const isFull = fillPct >= 0.98;
  const idBase = `${size}-${capacityTier}-${items.length}`;
  const clipId = `coneClip-${idBase}`;
  const meniscus = 4; // curved top of liquid

  // For animation of the most recently-added band
  const bandStyle = (bandId) => bandId === lastAddedId ? {
    animation: 'liquidPour 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) backwards',
    transformOrigin: 'center bottom',
  } : undefined;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id={clipId}>
          <path d={conePath} />
        </clipPath>
        {bands.map((b) => (
          <PatternFill key={b.id} id={b.id} color={b.color} idSuffix={`${idBase}-${b.id}`} />
        ))}
        {bands.map((b) => (
          <linearGradient key={`g-${b.id}`} id={`grad-${idBase}-${b.id}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={lighten(b.color, 0.55)} />
            <stop offset="0.5" stopColor={lighten(b.color, 0.25)} />
            <stop offset="1" stopColor={lighten(b.color, 0.55)} />
          </linearGradient>
        ))}
        <linearGradient id={`bag-${idBase}`} x1="0" x2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.95)" />
        </linearGradient>
      </defs>

      {/* Bow on top */}
      <g transform={`translate(${W / 2 - 26} ${topY - 28})`}>
        <path d="M 26 14 L 4 6 Q -2 14 4 22 L 26 14 Z" fill="#F4A8B8" stroke="#3D2B1F" strokeWidth="1.3" strokeLinejoin="round" opacity="0.92" />
        <path d="M 26 14 L 48 6 Q 54 14 48 22 L 26 14 Z" fill="#F4A8B8" stroke="#3D2B1F" strokeWidth="1.3" strokeLinejoin="round" opacity="0.92" />
        <ellipse cx="26" cy="14" rx="3.5" ry="5.5" fill="#E88AA0" stroke="#3D2B1F" strokeWidth="1.3" />
      </g>

      {/* Cellophane bag base */}
      <path
        d={conePath}
        fill={`url(#bag-${idBase})`}
        stroke="#3D2B1F"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* LIQUID LAYERS clipped to cone */}
      <g clipPath={`url(#${clipId})`}>
        {bands.map((b, i) => {
          const isTop = i === bands.length - 1;
          const bandH = b.bot - b.top;
          if (bandH <= 0) return null;

          // Build a "rectangle" that follows cone width at top/bot
          const tHw = halfWAt(b.top);
          const bHw = halfWAt(b.bot);
          const cx = W / 2;

          // Curved meniscus on top edge of last band (gives liquid feel)
          const topEdge = isTop
            ? `M ${cx - tHw} ${b.top} Q ${cx} ${b.top - meniscus} ${cx + tHw} ${b.top}`
            : `M ${cx - tHw} ${b.top} L ${cx + tHw} ${b.top}`;

          const bandPath = `${topEdge} L ${cx + bHw} ${b.bot} L ${cx - bHw} ${b.bot} Z`;

          return (
            <g key={b.id} style={bandStyle(b.id)}>
              {/* base solid color */}
              <path d={bandPath} fill={b.color} opacity="0.85" />
              {/* gradient highlight */}
              <path d={bandPath} fill={`url(#grad-${idBase}-${b.id})`} opacity="0.55" />
              {/* pattern texture overlay */}
              <path d={bandPath} fill={`url(#pat-${idBase}-${b.id})`} />
              {/* divider line between bands (thin) */}
              {!isTop && (
                <line
                  x1={cx - bHw} y1={b.bot} x2={cx + bHw} y2={b.bot}
                  stroke="#3D2B1F" strokeWidth="0.6" opacity="0.2"
                />
              )}
            </g>
          );
        })}

        {/* Subtle vertical highlight stripe inside */}
        <path
          d={`M ${W * 0.28} ${topY + 8} L ${W / 2 - 12} ${bottomY - 30}`}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Cone outline */}
      <path
        d={conePath}
        fill="none"
        stroke="#3D2B1F"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Cone tip (darker filled triangle) — like reference */}
      <path
        d={`M ${W / 2 - 10} ${bottomY - 18} L ${W / 2 + 10} ${bottomY - 18} L ${W / 2 + 6} ${bottomY} Q ${W / 2} ${bottomY + 4} ${W / 2 - 6} ${bottomY} Z`}
        fill="#5A3E2B"
        stroke="#3D2B1F"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Cellophane diagonal highlight */}
      <path
        d={`M ${W * 0.18} ${topY + 6} L ${W * 0.42} ${bottomY - 50}`}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Mouth / decorative rays at top */}
      <g stroke="#3D2B1F" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
        {[-3, -2, -1, 0, 1, 2, 3].map(i => (
          <line key={i}
            x1={W / 2 + i * 8} y1={topY - 4}
            x2={W / 2 + i * 9} y2={topY - 14} />
        ))}
      </g>

      {/* Sparkles when full */}
      {isFull && items.length > 0 && (
        <g>
          {[[20, 60], [W - 20, 70], [30, 110], [W - 30, 130]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`} style={{ animation: `sparkle 1.5s ${i * 0.2}s ease-in-out infinite` }}>
              <path d="M 0 -5 L 1.2 -1.2 L 5 0 L 1.2 1.2 L 0 5 L -1.2 1.2 L -5 0 L -1.2 -1.2 Z"
                fill="#F4C870" stroke="#3D2B1F" strokeWidth="0.8" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      )}

      {items.length === 0 && (
        <text x={W / 2} y={H / 2 + 10} textAnchor="middle" fill="#3D2B1F" opacity="0.4"
          fontFamily="ui-monospace, monospace" fontSize="11">prázdny kornút</text>
      )}
    </svg>
  );
}

export { ConeViz, CAPACITY_TIERS, getActiveCapacity };
