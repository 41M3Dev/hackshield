import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  Target,
  ShieldAlert,
  TrendingUp,
  Plus,
  ArrowRight,
  Activity,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import { ScansLineChart, VulnsBarChart, AttackPieChart } from '../components/dashboard/ChartWidget';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Badge, { statusBadge, severityBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { formatRelativeTime } from '../utils/formatters';

// Mock recent scans data
const recentScans = [
  { id: '1', host: 'api.example.com', status: 'FINISHED', criticals: 2, time: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '2', host: 'app.startup.io', status: 'RUNNING', criticals: 0, time: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '3', host: 'dashboard.corp.com', status: 'FINISHED', criticals: 1, time: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '4', host: 'staging.myapp.io', status: 'FAILED', criticals: 0, time: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
  { id: '5', host: 'admin.internal.net', status: 'PENDING', criticals: 0, time: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];

// Mock recent vulns
const recentVulns = [
  { id: '1', title: 'SQL Injection in /api/users', severity: 'CRITICAL', host: 'api.example.com' },
  { id: '2', title: 'Reflected XSS in search param', severity: 'HIGH', host: 'app.startup.io' },
  { id: '3', title: 'SSRF via webhook endpoint', severity: 'HIGH', host: 'dashboard.corp.com' },
  { id: '4', title: 'Open Redirect on /callback', severity: 'MEDIUM', host: 'api.example.com' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <DashboardLayout title="Dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.firstName || user?.username}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's happening with your security posture
          </p>
        </div>
        <Link to="/targets/new">
          <Button leftIcon={<Plus className="w-4 h-4" />} size="sm">
            New Scan
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Scans"
          value="247"
          change="+18 this month"
          changeType="positive"
          icon={<Scan className="w-5 h-5 text-primary-500" />}
          iconBg="bg-primary-500/10"
        />
        <StatCard
          title="Active Targets"
          value="18"
          change="3 scanning now"
          changeType="neutral"
          icon={<Target className="w-5 h-5 text-green-500" />}
          iconBg="bg-green-500/10"
        />
        <StatCard
          title="Critical Vulns"
          value="4"
          change="-2 from last week"
          changeType="positive"
          icon={<ShieldAlert className="w-5 h-5 text-red-500" />}
          iconBg="bg-red-500/10"
        />
        <StatCard
          title="Success Rate"
          value="94%"
          change="+2% from last month"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
          iconBg="bg-amber-500/10"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <ScansLineChart />
        </div>
        <AttackPieChart />
      </div>

      <div className="mb-6">
        <VulnsBarChart />
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Scans */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50">
            <CardHeader className="mb-0">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <CardTitle>Recent Scans</CardTitle>
              </div>
              <Link to="/scans" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {recentScans.map((scan) => (
              <Link
                key={scan.id}
                to={`/scans/${scan.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">
                      {scan.host}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-400">{formatRelativeTime(scan.time)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {scan.criticals > 0 && (
                    <Badge variant="danger" size="sm" dot>
                      {scan.criticals} critical
                    </Badge>
                  )}
                  <Badge variant={statusBadge(scan.status)} size="sm" dot>
                    {scan.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Vulnerabilities */}
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50">
            <CardHeader className="mb-0">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <CardTitle>Recent Vulnerabilities</CardTitle>
              </div>
              <Link to="/scans" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </CardHeader>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {recentVulns.map((vuln) => (
              <div key={vuln.id} className="flex items-start justify-between px-5 py-3.5">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {vuln.title}
                  </p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">{vuln.host}</p>
                </div>
                <Badge variant={severityBadge(vuln.severity)} size="sm" dot>
                  {vuln.severity}
                </Badge>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700/50">
            <p className="text-xs text-slate-400 text-center">
              Connect a target to see real vulnerabilities
            </p>
          </div>
        </Card>
      </div>

      {/* Empty state CTA if no targets */}
      <Card className="mt-4 text-center bg-gradient-to-br from-primary-500/5 to-purple-500/5 border-primary-500/20">
        <div className="py-4">
          <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-primary-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Add your first target
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
            Start by adding a web app or API to scan. It only takes 30 seconds.
          </p>
          <Link to="/targets/new">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Target
            </Button>
          </Link>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardPage;
