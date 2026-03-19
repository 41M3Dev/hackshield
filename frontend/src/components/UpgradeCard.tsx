import { Sparkles } from 'lucide-react'

/**
 * Carte promotionnelle "Go Premium Now!" affichée en bas de la sidebar.
 * Reproduit fidèlement le design de la référence :
 * avatar en losange, texte centré, bouton gradient.
 */
export default function UpgradeCard() {
  return (
    <div className="
      relative rounded-xl overflow-hidden
      border border-primary/15
      bg-gradient-to-b from-surface/80 to-[#0B1120]
      shadow-[0_0_24px_rgba(139,92,246,0.06)]
      px-4 pt-8 pb-4 text-center
    ">
      {/* Halo décoratif subtil en haut */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-16 bg-primary/[0.07] blur-2xl rounded-full pointer-events-none" />

      {/* ── Avatar en losange ──────────────────────────────────── */}
      <div className="mx-auto mb-4 relative w-14 h-14">
        {/* Cadre losange */}
        <div className="
          absolute inset-0 rotate-45
          rounded-lg border border-primary/25
          bg-surface/60
          shadow-[0_0_12px_rgba(139,92,246,0.1)]
        " />
        {/* Cercle avatar au centre */}
        <div className="
          absolute inset-1.5 rounded-full overflow-hidden
          bg-gradient-to-br from-primary/30 to-accent/20
          flex items-center justify-center
        ">
          <Sparkles size={18} className="text-primary" />
        </div>
      </div>

      {/* ── Texte ──────────────────────────────────────────────── */}
      <h4 className="text-[13px] font-semibold text-txt mb-1">Go Premium Now!</h4>
      <p className="text-[11px] text-txt-secondary/70 leading-relaxed mb-4">
        Upgrade to pro<br />for unlimited features!
      </p>

      {/* ── Bouton ─────────────────────────────────────────────── */}
      <button className="
        w-full py-2 rounded-lg text-[12px] font-semibold
        bg-gradient-to-r from-primary to-primary-dim
        text-white
        border border-primary/30
        shadow-[0_0_16px_rgba(139,92,246,0.15)]
        hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]
        transition-all duration-300
        active:scale-[0.98]
      ">
        Upgrade Now
      </button>
    </div>
  )
}
