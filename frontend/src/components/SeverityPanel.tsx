import { MoreVertical } from 'lucide-react'

/**
 * Panneau "Severity Distribution" avec la forme triangulaire stylisée.
 * Reproduit la forme organique trilobée de la référence :
 * 3 branches arrondies fusionnées, labels de sévérité, point central lumineux.
 */
export default function SeverityPanel() {
  return (
    <div className="
      flex-[0.85] min-w-[320px]
      rounded-2xl border border-white/[0.05]
      bg-surface/40
      shadow-card
      flex flex-col
    ">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-[17px] font-semibold text-txt tracking-tight">
          Severity Distribution
        </h2>
        <button className="
          w-7 h-7 rounded-lg flex items-center justify-center
          bg-surface/70 border border-white/[0.06]
          text-txt-muted hover:text-txt transition-colors
        ">
          <MoreVertical size={14} />
        </button>
      </div>

      {/* ── Visualisation ──────────────────────────────────────── */}
      <div className="
        mx-4 mb-4 flex-1 rounded-xl overflow-hidden
        bg-[#0A0F1C] border border-white/[0.03]
        relative min-h-[280px]
        flex flex-col items-center justify-center
      ">
        <TriShapeViz />
        <p className="text-[11px] text-txt-muted mt-3 mb-3">
          Current threats by severity level
        </p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Forme trilobée stylisée (3 branches arrondies fusionnées).
   Chaque branche correspond à un niveau de sévérité.
   ──────────────────────────────────────────────────────────────── */
function TriShapeViz() {
  const W = 300
  const H = 240
  const cx = W / 2
  const cy = H / 2 + 5

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-[260px] h-[210px]">
      <defs>
        {/* Glow pour la forme */}
        <filter id="triGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient branche supérieure (Critical) */}
        <linearGradient id="gradCritical" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#EC4899" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
        </linearGradient>

        {/* Gradient branche gauche (High) */}
        <linearGradient id="gradHigh" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.4" />
        </linearGradient>

        {/* Gradient branche droite (Low) */}
        <linearGradient id="gradLow" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.3" />
        </linearGradient>

        <filter id="innerShadow">
          <feGaussianBlur stdDeviation="3" in="SourceAlpha" result="blur" />
          <feOffset dy="2" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadow" />
          <feFlood floodColor="#000" floodOpacity="0.3" />
          <feComposite in2="shadow" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Points lumineux de fond */}
      {[
        [45, 60], [260, 55], [70, 190], [240, 185],
        [150, 30], [90, 130], [220, 140], [150, 200],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.2} fill="#8B5CF6" opacity={0.2} />
      ))}

      {/* ── Branche supérieure (Critical) ─────────────────────── */}
      <path
        d={`
          M ${cx} ${cy - 15}
          Q ${cx - 15} ${cy - 55}, ${cx - 30} ${cy - 80}
          Q ${cx - 10} ${cy - 100}, ${cx} ${cy - 95}
          Q ${cx + 10} ${cy - 100}, ${cx + 30} ${cy - 80}
          Q ${cx + 15} ${cy - 55}, ${cx} ${cy - 15}
        `}
        fill="url(#gradCritical)"
        filter="url(#triGlow)"
        opacity={0.85}
      />

      {/* ── Branche gauche (High) ─────────────────────────────── */}
      <path
        d={`
          M ${cx - 10} ${cy + 5}
          Q ${cx - 45} ${cy + 20}, ${cx - 75} ${cy + 45}
          Q ${cx - 85} ${cy + 25}, ${cx - 70} ${cy + 10}
          Q ${cx - 55} ${cy - 15}, ${cx - 10} ${cy + 5}
        `}
        fill="url(#gradHigh)"
        filter="url(#triGlow)"
        opacity={0.75}
      />

      {/* ── Branche droite (Low) ──────────────────────────────── */}
      <path
        d={`
          M ${cx + 10} ${cy + 5}
          Q ${cx + 45} ${cy + 20}, ${cx + 75} ${cy + 45}
          Q ${cx + 85} ${cy + 25}, ${cx + 70} ${cy + 10}
          Q ${cx + 55} ${cy - 15}, ${cx + 10} ${cy + 5}
        `}
        fill="url(#gradLow)"
        filter="url(#triGlow)"
        opacity={0.7}
      />

      {/* ── Centre lumineux ────────────────────────────────────── */}
      <circle cx={cx} cy={cy} r={6} fill="#8B5CF6" opacity={0.25} filter="url(#triGlow)" />
      <circle cx={cx} cy={cy} r={2.5} fill="#A78BFA" opacity={0.8} />
      <circle cx={cx} cy={cy} r={1} fill="#fff" opacity={0.9} />

      {/* ── Labels ─────────────────────────────────────────────── */}
      {/* Critical */}
      <g>
        <rect x={cx - 32} y={cy - 88} width={64} height={20} rx={10} fill="#EC4899" opacity={0.2} />
        <text
          x={cx}
          y={cy - 74}
          textAnchor="middle"
          fill="#EC4899"
          fontSize={10}
          fontWeight={600}
          fontFamily="Inter, sans-serif"
        >
          Critical 25%
        </text>
      </g>

      {/* High */}
      <g>
        <rect x={cx - 90} y={cy + 32} width={56} height={20} rx={10} fill="#8B5CF6" opacity={0.2} />
        <text
          x={cx - 62}
          y={cy + 46}
          textAnchor="middle"
          fill="#A78BFA"
          fontSize={10}
          fontWeight={600}
          fontFamily="Inter, sans-serif"
        >
          High 40%
        </text>
      </g>

      {/* Low */}
      <g>
        <rect x={cx + 35} y={cy + 32} width={52} height={20} rx={10} fill="#8B5CF6" opacity={0.15} />
        <text
          x={cx + 61}
          y={cy + 46}
          textAnchor="middle"
          fill="#A78BFA"
          fontSize={10}
          fontWeight={600}
          fontFamily="Inter, sans-serif"
        >
          Low 15%
        </text>
      </g>
    </svg>
  )
}
