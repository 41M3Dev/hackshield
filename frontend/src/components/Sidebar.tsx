import {
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  Globe,
  FileText,
  Fingerprint,
  AlertTriangle,
  Bot,
  Settings,
  Building2,
  Shield,
} from 'lucide-react'
import UpgradeCard from './UpgradeCard'

/* ── Types ─────────────────────────────────────────────────────── */
interface MenuItem {
  icon: React.ReactNode
  label: string
  active?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

/* ── Data ──────────────────────────────────────────────────────── */
const sections: MenuSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
      { icon: <BarChart3 size={18} />, label: 'Analytics' },
    ],
  },
  {
    title: 'Threats Intelligence',
    items: [
      { icon: <ShieldAlert size={18} />, label: 'Threats' },
      { icon: <Globe size={18} />, label: 'Sources' },
      { icon: <FileText size={18} />, label: 'Reports' },
      { icon: <Fingerprint size={18} />, label: 'Indicators' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { icon: <AlertTriangle size={18} />, label: 'Alerts' },
      { icon: <Bot size={18} />, label: 'SOCCo-Pilot' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { icon: <Settings size={18} />, label: 'Setting' },
      { icon: <Building2 size={18} />, label: 'Company Directory' },
    ],
  },
]

/* ── Component ─────────────────────────────────────────────────── */
export default function Sidebar() {
  return (
    <aside className="
      w-[230px] min-w-[230px] h-screen flex flex-col
      bg-[#0B1120] border-r border-white/[0.04]
      overflow-y-auto overflow-x-hidden
    ">
      {/* ── Logo ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="
          w-8 h-8 rounded-lg flex items-center justify-center
          bg-gradient-to-br from-primary to-accent
          shadow-[0_0_12px_rgba(139,92,246,0.3)]
        ">
          <Shield size={16} className="text-white" />
        </div>
        <div className="flex items-baseline gap-0.5 select-none">
          <span className="text-[15px] font-semibold tracking-tight text-txt">Sentinel</span>
          <span className="text-[15px] font-light tracking-tight text-txt-secondary">Nexus</span>
        </div>
      </div>

      {/* ── Sections ───────────────────────────────────────────── */}
      <nav className="flex-1 px-3 pb-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            {/* Titre de section */}
            <p className="
              px-2 mb-1.5 text-[10px] font-medium tracking-widest uppercase
              text-txt-muted/70 select-none
            ">
              {section.title}
            </p>

            {/* Items */}
            {section.items.map((item) => (
              <button
                key={item.label}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg
                  text-[13px] font-medium transition-all duration-200
                  ${item.active
                    ? `
                      bg-primary/[0.12] text-txt
                      border border-primary/20
                      shadow-[0_0_16px_rgba(139,92,246,0.08)]
                    `
                    : `
                      text-txt-secondary hover:text-txt/90
                      hover:bg-white/[0.03] border border-transparent
                    `
                  }
                `}
              >
                <span className={item.active ? 'text-primary' : 'text-txt-muted'}>{item.icon}</span>
                <span>{item.label}</span>
                {/* Point lumineux pour l'item actif */}
                {item.active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Upgrade Card en bas ────────────────────────────────── */}
      <div className="px-3 pb-4 mt-auto">
        <UpgradeCard />
      </div>
    </aside>
  )
}
