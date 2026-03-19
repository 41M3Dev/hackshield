import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  badge: string
  badgeUp: boolean
  subtitle: string
  /** Si true, la carte est visuellement mise en avant (glow + gradient) */
  highlighted?: boolean
}

/**
 * Carte KPI reproduisant fidèlement le design de la référence :
 * icône centrée, titre, valeur large, badge + subtitle en footer.
 */
export default function StatCard({
  icon,
  title,
  value,
  badge,
  badgeUp,
  subtitle,
  highlighted = false,
}: StatCardProps) {
  return (
    <div
      className={`
        relative flex-1 min-w-[200px] rounded-2xl
        px-5 py-5
        flex flex-col items-center text-center
        border transition-all duration-300
        ${highlighted
          ? `
            bg-gradient-to-b from-primary/[0.08] to-surface/90
            border-primary/20
            shadow-[0_0_30px_rgba(139,92,246,0.12),0_4px_24px_rgba(0,0,0,0.3)]
          `
          : `
            bg-surface/60
            border-white/[0.05]
            shadow-card
          `
        }
      `}
    >
      {/* Halo lumineux derrière la carte highlighted */}
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-20 bg-primary/[0.08] blur-3xl rounded-full pointer-events-none" />
      )}

      {/* ── Icône ──────────────────────────────────────────────── */}
      <div className={`
        w-10 h-10 rounded-full mb-3
        flex items-center justify-center
        ${highlighted
          ? 'bg-primary/15 text-primary shadow-[0_0_12px_rgba(139,92,246,0.15)]'
          : 'bg-white/[0.04] text-txt-muted border border-white/[0.06]'
        }
      `}>
        {icon}
      </div>

      {/* ── Titre ──────────────────────────────────────────────── */}
      <p className="text-[12px] font-medium text-txt-secondary mb-1.5 tracking-wide">
        {title}
      </p>

      {/* ── Valeur large ───────────────────────────────────────── */}
      <p className={`
        text-[28px] font-bold leading-none mb-4 tracking-tight
        ${highlighted ? 'text-primary' : 'text-txt'}
      `}>
        {value}
      </p>

      {/* ── Footer: badge + subtitle ───────────────────────────── */}
      <div className="flex items-center gap-2 text-[11px]">
        {/* Badge pourcentage */}
        <span className={`
          inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full
          font-medium
          ${badgeUp
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
            : 'bg-accent/10 text-accent border border-accent/15'
          }
        `}>
          {badgeUp
            ? <ArrowUp size={10} strokeWidth={2.5} />
            : <ArrowDown size={10} strokeWidth={2.5} />
          }
          {badge}
        </span>
        {/* Texte descriptif */}
        <span className="text-txt-muted">{subtitle}</span>
      </div>
    </div>
  )
}
