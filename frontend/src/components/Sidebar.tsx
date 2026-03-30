import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  Crosshair,
  Scan,
  User,
  Settings,
  Users,
  FileText,
  Shield,
  LogOut,
} from 'lucide-react'
import UpgradeCard from './UpgradeCard'
import { useAuthStore } from '../store/authStore'

interface MenuItem {
  icon: React.ReactNode
  label: string
  path: string
  adminOnly?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const sections: MenuSection[] = [
  {
    title: 'VUE D\'ENSEMBLE',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Tableau de bord', path: '/dashboard' },
    ],
  },
  {
    title: 'Opérations',
    items: [
      { icon: <Crosshair size={18} />, label: 'Cibles', path: '/targets' },
      { icon: <Scan size={18} />, label: 'Scans', path: '/scans' },
    ],
  },
  {
    title: 'Compte',
    items: [
      { icon: <User size={18} />, label: 'Profil', path: '/profile' },
      { icon: <Settings size={18} />, label: 'Paramètres', path: '/settings' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { icon: <Users size={18} />, label: 'Utilisateurs', path: '/admin/users', adminOnly: true },
      { icon: <FileText size={18} />, label: 'Journal d\'audit', path: '/admin/audit', adminOnly: true },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="
      w-[230px] min-w-[230px] h-screen flex flex-col
      bg-[#0B1120] border-r border-white/[0.04]
      overflow-y-auto overflow-x-hidden
    ">
      {/* Logo */}
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

      {/* Sections */}
      <nav className="flex-1 px-3 pb-4">
        {sections.map((section) => {
          const visibleItems = section.items.filter(
            item => !item.adminOnly || user?.role === 'ADMIN'
          )
          if (visibleItems.length === 0) return null

          return (
            <div key={section.title} className="mb-4">
              <p className="
                px-2 mb-1.5 text-[10px] font-medium tracking-widest uppercase
                text-txt-muted/70 select-none
              ">
                {section.title}
              </p>

              {visibleItems.map((item) => {
                const active = location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg
                      text-[13px] font-medium transition-all duration-200
                      ${active
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
                    <span className={active ? 'text-primary' : 'text-txt-muted'}>{item.icon}</span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-3 pb-4 mt-auto space-y-3">
        <UpgradeCard />

        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white text-[11px] font-bold">
              {user.firstName?.[0] || user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-txt truncate">{user.firstName || user.username}</p>
              <p className="text-[10px] text-txt-muted truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-txt-muted hover:text-red-400 transition-colors" title="Déconnexion">
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
