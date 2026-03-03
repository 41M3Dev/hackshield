import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scan, Search, Filter, Clock } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import DataTable, { Column } from '../components/tables/DataTable';
import Badge, { statusBadge } from '../components/ui/Badge';
import { formatDateTime, formatDuration } from '../utils/formatters';

interface ScanRow {
  id: string;
  target: string;
  status: string;
  criticals: number;
  highs: number;
  duration: number;
  createdAt: string;
}

const mockScans: ScanRow[] = [
  { id: '1', target: 'api.example.com', status: 'FINISHED', criticals: 2, highs: 4, duration: 342, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: '2', target: 'app.startup.io', status: 'RUNNING', criticals: 0, highs: 0, duration: 0, createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: '3', target: 'dashboard.corp.com', status: 'FINISHED', criticals: 1, highs: 2, duration: 518, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: '4', target: 'staging.myapp.io', status: 'FAILED', criticals: 0, highs: 0, duration: 45, createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString() },
  { id: '5', target: 'admin.internal.net', status: 'PENDING', criticals: 0, highs: 0, duration: 0, createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: '6', target: 'api.example.com', status: 'FINISHED', criticals: 0, highs: 1, duration: 278, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

const statusOptions = ['ALL', 'PENDING', 'RUNNING', 'FINISHED', 'FAILED'];

const ScansPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = mockScans.filter(
    (s) =>
      (statusFilter === 'ALL' || s.status === statusFilter) &&
      s.target.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<ScanRow>[] = [
    {
      key: 'target',
      header: 'Target',
      render: (row) => (
        <Link to={`/scans/${row.id}`} className="font-mono text-sm text-primary-400 hover:text-primary-300 font-medium">
          {row.target}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={statusBadge(row.status)} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'criticals',
      header: 'Critical',
      render: (row) =>
        row.criticals > 0 ? (
          <Badge variant="danger">{row.criticals}</Badge>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        ),
    },
    {
      key: 'highs',
      header: 'High',
      render: (row) =>
        row.highs > 0 ? (
          <Badge variant="warning">{row.highs}</Badge>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <Clock className="w-3 h-3" />
          {row.status === 'RUNNING' ? (
            <span className="text-primary-400 font-medium animate-pulse">Running...</span>
          ) : (
            formatDuration(row.duration)
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Started',
      render: (row) => (
        <span className="text-sm text-slate-400">{formatDateTime(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <DashboardLayout title="Scans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Scan History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track and analyze all your security scans
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-60"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-1">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        emptyMessage="No scans found"
        emptyIcon={<Scan className="w-10 h-10" />}
      />
    </DashboardLayout>
  );
};

export default ScansPage;
