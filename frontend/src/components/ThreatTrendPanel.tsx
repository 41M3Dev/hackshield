import { CalendarDays, ChevronDown } from 'lucide-react'

/**
 * Panneau "Threat Trend by Severity" avec un graphe SVG futuriste.
 * Le graphe imite un écran cyber analytique : grille de fond, points lumineux,
 * labels techniques flottants, ligne principale avec glow néon.
 */
export default function ThreatTrendPanel() {
  return (
    <div className="
      flex-[1.15] min-w-[400px]
      rounded-2xl border border-white/[0.05]
      bg-surface/40
      shadow-card
      flex flex-col
    ">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-[17px] font-semibold text-txt tracking-tight">
          Tendance des menaces par sévérité
        </h2>
        <button className="
          flex items-center gap-1.5 px-3 py-1.5 rounded-lg
          bg-surface/70 border border-white/[0.06]
          text-[11px] font-medium text-txt-secondary
          hover:text-txt transition-colors
        ">
          <CalendarDays size={12} className="text-primary" />
          7 derniers jours
          <ChevronDown size={11} className="text-txt-muted" />
        </button>
      </div>

      {/* ── Zone graphique SVG ──────────────────────────────────── */}
      <div className="
        mx-4 mb-4 flex-1 rounded-xl overflow-hidden
        bg-[#0A0F1C] border border-white/[0.03]
        relative min-h-[280px]
      ">
        <CyberChart />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Graphe SVG « futuriste » — reproduit l'ambiance de la référence :
   grille de fond, points lumineux dispersés, labels techniques,
   ligne principale avec glow néon violet.
   ──────────────────────────────────────────────────────────────── */
function CyberChart() {
  const W = 700
  const H = 280

  /* Points de la ligne principale (zigzag avec montée forte) */
  const linePoints: [number, number][] = [
    [30, 230],
    [80, 210],
    [120, 195],
    [160, 180],
    [200, 170],
    [230, 120],
    [260, 80],
    [300, 55],
    [340, 50],
    [380, 60],
    [420, 75],
    [460, 90],
    [500, 100],
    [530, 85],
    [560, 70],
    [600, 95],
    [640, 110],
    [670, 130],
  ]

  const linePath = linePoints
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(' ')

  /* Zone remplie sous la courbe */
  const areaPath = `${linePath} L${linePoints[linePoints.length - 1][0]},${H} L${linePoints[0][0]},${H} Z`

  /* Labels techniques flottants */
  const floatingLabels = [
    { x: 55, y: 40, text: '054' },
    { x: 180, y: 55, text: '41.0093' },
    { x: 300, y: 30, text: '73.3312' },
    { x: 430, y: 45, text: '92.5218' },
    { x: 560, y: 55, text: '63.0002' },
    { x: 140, y: 125, text: '29.6784' },
    { x: 350, y: 100, text: '55.4137' },
    { x: 510, y: 130, text: '40.8178' },
    { x: 620, y: 240, text: '29.6784·4.0924' },
  ]

  /* Points lumineux aléatoires dispersés dans le fond */
  const scatterDots = [
    { x: 60, y: 80 }, { x: 95, y: 150 }, { x: 130, y: 60 },
    { x: 170, y: 200 }, { x: 210, y: 45 }, { x: 250, y: 160 },
    { x: 290, y: 110 }, { x: 310, y: 200 }, { x: 350, y: 140 },
    { x: 380, y: 220 }, { x: 410, y: 70 }, { x: 440, y: 180 },
    { x: 480, y: 50 }, { x: 510, y: 160 }, { x: 540, y: 230 },
    { x: 580, y: 100 }, { x: 610, y: 180 }, { x: 650, y: 60 },
    { x: 100, y: 240 }, { x: 200, y: 250 }, { x: 330, y: 260 },
    { x: 470, y: 250 }, { x: 580, y: 260 }, { x: 660, y: 240 },
    { x: 45, y: 170 }, { x: 680, y: 150 },
  ]

  /* Segments verticaux lumineux (tirets) */
  const verticalSegments = [
    { x: 230, y1: 100, y2: 130 },
    { x: 300, y1: 35, y2: 65 },
    { x: 380, y1: 45, y2: 70 },
    { x: 530, y1: 65, y2: 95 },
    { x: 160, y1: 160, y2: 190 },
    { x: 460, y1: 70, y2: 100 },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Glow pour la ligne principale */}
        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Glow doux pour les points */}
        <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>

        {/* Gradient vertical pour le fill sous la courbe */}
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>

        {/* Gradient pour la ligne */}
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* ── Grille de fond ─────────────────────────────────────── */}
      {Array.from({ length: 15 }).map((_, i) => (
        <line
          key={`vg-${i}`}
          x1={i * 50}
          y1={0}
          x2={i * 50}
          y2={H}
          stroke="rgba(139,92,246,0.04)"
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`hg-${i}`}
          x1={0}
          y1={i * 40}
          x2={W}
          y2={i * 40}
          stroke="rgba(139,92,246,0.04)"
          strokeWidth={0.5}
        />
      ))}

      {/* ── Tirets horizontaux courts (détails techniques) ──── */}
      {[90, 150, 200, 250].map((y) =>
        Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`ht-${y}-${i}`}
            x1={40 + i * 55}
            y1={y}
            x2={48 + i * 55}
            y2={y}
            stroke="rgba(139,92,246,0.08)"
            strokeWidth={0.5}
          />
        ))
      )}

      {/* ── Points lumineux dispersés ──────────────────────────── */}
      {scatterDots.map((dot, i) => (
        <g key={`sd-${i}`}>
          <circle cx={dot.x} cy={dot.y} r={3} fill="#8B5CF6" opacity={0.06} filter="url(#dotGlow)" />
          <circle cx={dot.x} cy={dot.y} r={1} fill="#8B5CF6" opacity={0.35} />
        </g>
      ))}

      {/* ── Segments verticaux lumineux ────────────────────────── */}
      {verticalSegments.map((seg, i) => (
        <line
          key={`vs-${i}`}
          x1={seg.x}
          y1={seg.y1}
          x2={seg.x}
          y2={seg.y2}
          stroke="#8B5CF6"
          strokeWidth={1}
          opacity={0.12}
        />
      ))}

      {/* ── Labels techniques flottants ────────────────────────── */}
      {floatingLabels.map((lbl, i) => (
        <text
          key={`fl-${i}`}
          x={lbl.x}
          y={lbl.y}
          fill="#8B5CF6"
          opacity={0.18}
          fontSize={9}
          fontFamily="monospace"
        >
          {lbl.text}
        </text>
      ))}

      {/* ── Zone remplie sous la courbe ────────────────────────── */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* ── Ligne principale avec glow ─────────────────────────── */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#lineGlow)"
      />

      {/* ── Points sur la courbe ───────────────────────────────── */}
      {linePoints.filter((_, i) => i % 2 === 0).map((p, i) => (
        <g key={`lp-${i}`}>
          <circle cx={p[0]} cy={p[1]} r={5} fill="#8B5CF6" opacity={0.12} filter="url(#dotGlow)" />
          <circle cx={p[0]} cy={p[1]} r={2.5} fill="#A78BFA" />
          <circle cx={p[0]} cy={p[1]} r={1} fill="#fff" />
        </g>
      ))}
    </svg>
  )
}
