import React from 'react';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface NavbarProps {
  onToggleSidebar: () => void;
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, title }) => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex items-center px-4 gap-3 sticky top-0 z-30">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100 hidden sm:block">
          {title}
        </h1>
      )}

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-400 w-48 cursor-not-allowed">
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-xs">Search...</span>
        <span className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">⌘K</span>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </header>
  );
};

export default Navbar;
