import { Home, Search, Bell, RefreshCw, ChevronDown } from 'lucide-react'

/**
 * Barre supérieure du dashboard.
 * Breadcrumb | Search | Notification | Refresh button
 */
export default function Topbar() {
  return (
    <header className="
      flex items-center justify-between gap-4
      px-6 py-3 min-h-[56px]
      border-b border-white/[0.04]
    ">
      {/* ── Breadcrumb / Titre ─────────────────────────────────── */}
      <div className="flex items-center gap-2 min-w-0 shrink">
        <Home size={14} className="text-txt-muted shrink-0" />
        <span className="text-txt-muted text-xs shrink-0">&gt;</span>
        <span className="text-txt-secondary text-xs shrink-0">Dashboard</span>
        <span className="text-[13px] font-medium text-txt truncate">
          Real-Time Threat Intelligence Overview
        </span>
      </div>

      {/* ── Actions droite ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="
          relative flex items-center
          bg-surface/60 rounded-lg
          border border-white/[0.06]
          px-3 py-1.5
          w-[180px]
        ">
          <Search size={14} className="text-txt-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="
              bg-transparent outline-none border-none
              text-xs text-txt placeholder:text-txt-muted/50
              w-full
            "
          />
        </div>

        {/* Notification */}
        <button className="
          w-8 h-8 rounded-lg flex items-center justify-center
          bg-surface/50 border border-white/[0.06]
          text-txt-muted hover:text-txt
          transition-colors duration-200
          relative
        ">
          <Bell size={15} />
          {/* Petit dot notification */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
        </button>

        {/* Refresh Data */}
        <button className="
          flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-surface/50 border border-white/[0.06]
          text-xs font-medium text-txt-secondary
          hover:text-txt hover:border-primary/20
          transition-all duration-200
        ">
          <RefreshCw size={13} className="text-primary" />
          <span>Refresh Data</span>
          <ChevronDown size={12} className="text-txt-muted ml-0.5" />
        </button>
      </div>
    </header>
  )
}
