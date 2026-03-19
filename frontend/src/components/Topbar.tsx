import { useLocation } from 'react-router-dom'
import { Home, Search, Bell, RefreshCw, ChevronDown } from 'lucide-react'

const pageTitles: Record<string, [string, string]> = {
  '/dashboard': ['Tableau de bord', 'Vue d\'ensemble des menaces en temps réel'],
  '/targets': ['Cibles', 'Gestion des cibles de pentest'],
  '/scans': ['Scans', 'Suivi des scans de sécurité'],
  '/profile': ['Profil', 'Gérez vos informations personnelles'],
  '/settings': ['Paramètres', 'Configuration de votre compte'],
  '/admin/users': ['Utilisateurs', 'Administration des utilisateurs'],
  '/admin/audit': ['Journal d\'audit', 'Historique des actions'],
}

export default function Topbar() {
  const location = useLocation()
  const [section, subtitle] = pageTitles[location.pathname] || ['Page', '']

  return (
    <header className="
      flex items-center justify-between gap-4
      px-6 py-3 min-h-[56px]
      border-b border-white/[0.04]
    ">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0 shrink">
        <Home size={14} className="text-txt-muted shrink-0" />
        <span className="text-txt-muted text-xs shrink-0">&gt;</span>
        <span className="text-txt-secondary text-xs shrink-0">{section}</span>
        {subtitle && (
          <span className="text-[13px] font-medium text-txt truncate">{subtitle}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="
          relative flex items-center
          bg-surface/60 rounded-lg
          border border-white/[0.06]
          px-3 py-1.5 w-[180px]
        ">
          <Search size={14} className="text-txt-muted mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Rechercher"
            className="bg-transparent outline-none border-none text-xs text-txt placeholder:text-txt-muted/50 w-full"
          />
        </div>

        <button className="
          w-8 h-8 rounded-lg flex items-center justify-center
          bg-surface/50 border border-white/[0.06]
          text-txt-muted hover:text-txt transition-colors duration-200 relative
        ">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_4px_rgba(236,72,153,0.6)]" />
        </button>

        <button className="
          flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-surface/50 border border-white/[0.06]
          text-xs font-medium text-txt-secondary
          hover:text-txt hover:border-primary/20 transition-all duration-200
        ">
          <RefreshCw size={13} className="text-primary" />
          <span>Actualiser</span>
          <ChevronDown size={12} className="text-txt-muted ml-0.5" />
        </button>
      </div>
    </header>
  )
}
