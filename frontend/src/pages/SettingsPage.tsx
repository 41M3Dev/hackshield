import React from 'react';
import { Moon, Sun, Bell, Shield, Palette } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { useThemeStore } from '../store/themeStore';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        checked ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  </div>
);

const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = React.useState({
    scanComplete: true,
    criticalVuln: true,
    weeklyReport: false,
    marketing: false,
  });

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize your HackShield experience
        </p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-400" />
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => !isDark && toggleTheme()}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                isDark
                  ? 'border-primary-500 bg-primary-500/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Moon className="w-5 h-5 text-slate-300" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
              {isDark && <span className="text-xs text-primary-400 font-semibold">Active</span>}
            </button>

            <button
              onClick={() => isDark && toggleTheme()}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                !isDark
                  ? 'border-primary-500 bg-primary-500/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Light Mode</span>
              {!isDark && <span className="text-xs text-primary-400 font-semibold">Active</span>}
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-400" />
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>

          <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
            <Toggle
              checked={notifications.scanComplete}
              onChange={(v) => setNotifications((n) => ({ ...n, scanComplete: v }))}
              label="Scan Completed"
              description="Get notified when a scan finishes"
            />
            <Toggle
              checked={notifications.criticalVuln}
              onChange={(v) => setNotifications((n) => ({ ...n, criticalVuln: v }))}
              label="Critical Vulnerabilities"
              description="Immediate alert for CRITICAL severity findings"
            />
            <Toggle
              checked={notifications.weeklyReport}
              onChange={(v) => setNotifications((n) => ({ ...n, weeklyReport: v }))}
              label="Weekly Security Report"
              description="Summary of your security posture every Monday"
            />
            <Toggle
              checked={notifications.marketing}
              onChange={(v) => setNotifications((n) => ({ ...n, marketing: v }))}
              label="Product Updates"
              description="New features and platform announcements"
            />
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add an extra layer of security
                </p>
              </div>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                Coming soon
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Session Timeout
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Auto-logout after inactivity
                </p>
              </div>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full font-medium">
                Coming soon
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
