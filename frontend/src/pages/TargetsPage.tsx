import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target as TargetIcon, Globe, Server, Smartphone, Search, Trash2, Play } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Badge, { statusBadge } from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { formatRelativeTime } from '../utils/formatters';

const typeIcons: Record<string, React.ReactNode> = {
  WEB: <Globe className="w-4 h-4" />,
  API: <Server className="w-4 h-4" />,
  NETWORK: <TargetIcon className="w-4 h-4" />,
  MOBILE: <Smartphone className="w-4 h-4" />,
};

const mockTargets = [
  {
    id: '1', name: 'Main API', type: 'API', host: 'api.example.com', port: 443,
    status: 'ACTIVE', scansCount: 12, lastScanAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2', name: 'Marketing Site', type: 'WEB', host: 'www.example.com', port: 443,
    status: 'ACTIVE', scansCount: 7, lastScanAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '3', name: 'Admin Panel', type: 'WEB', host: 'admin.example.com', port: 8080,
    status: 'SCANNING', scansCount: 3, lastScanAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '4', name: 'Internal Network', type: 'NETWORK', host: '192.168.1.0/24', port: undefined,
    status: 'INACTIVE', scansCount: 1, lastScanAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

const TargetsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = mockTargets.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.host.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Targets">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Targets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your scan targets — web apps, APIs, and network infrastructure
          </p>
        </div>
        <Link to="/targets/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Target</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search targets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <TargetIcon className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">No targets found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {search ? 'Try a different search term' : 'Add your first scan target to get started'}
          </p>
          <Link to="/targets/new">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Target</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((target) => (
            <Card key={target.id} hover className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-400">
                    {typeIcons[target.type]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {target.name}
                    </h3>
                    <Badge variant="default" size="sm" className="mt-0.5">
                      {target.type}
                    </Badge>
                  </div>
                </div>
                <Badge variant={statusBadge(target.status)} size="sm" dot>
                  {target.status}
                </Badge>
              </div>

              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
                {target.host}{target.port ? `:${target.port}` : ''}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700/50 pt-3">
                <span>{target.scansCount} scans</span>
                <span>Last: {target.lastScanAt ? formatRelativeTime(target.lastScanAt) : 'Never'}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" className="flex-1" leftIcon={<Play className="w-3 h-3" />}>
                  Start Scan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  leftIcon={<Trash2 className="w-3 h-3" />}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TargetsPage;
