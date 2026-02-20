import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Target,
  Scan,
  User,
  Settings,
  Users,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import authService from '../../services/auth.service';
import { useToast } from '../../hooks/useToast';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Targets', to: '/targets', icon: <Target className="w-4 h-4" /> },
  { label: 'Scans', to: '/scans', icon: <Scan className="w-4 h-4" /> },
  { label: 'Profile', to: '/profile', icon: <User className="w-4 h-4" /> },
  { label: 'Settings', to: '/settings', icon: <Settings className="w-4 h-4" /> },
  { label: 'Users', to: '/admin/users', icon: <Users className="w-4 h-4" />, adminOnly: true },
];

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { refreshToken } = useAuthStore.getState();
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Silent
    }
    clearAuth();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const filteredNav = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  );

  return (
    <aside
      className={`
        flex flex-col h-full
        bg-slate-900 dark:bg-slate-950
        border-r border-slate-700/50
        transition-all duration-200
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-lg tracking-tight">
            Hack<span className="text-primary-400">Shield</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
        )}
        {filteredNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
              ${collapsed ? 'justify-center' : ''}
              ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-primary-400' : 'group-hover:text-slate-100'}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.adminOnly && (
                      <span className="text-xs bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded font-medium">
                        Admin
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-400">
                {(user.firstName?.[0] || user.username[0]).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">
                {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username}
              </p>
              <div className="flex items-center gap-1.5">
                <Zap className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-xs text-slate-400">{user.plan}</span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:text-red-400 hover:bg-red-500/10
            transition-all duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
