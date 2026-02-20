import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Target,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Badge, { statusBadge, severityBadge } from '../components/ui/Badge';
import { formatDateTime, formatDuration } from '../utils/formatters';

interface MockAttack {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  recommendation: string;
  endpoint: string;
  expanded?: boolean;
}

const mockAttacks: MockAttack[] = [
  {
    id: '1',
    type: 'SQL_INJECTION',
    severity: 'CRITICAL',
    title: 'SQL Injection in /api/users endpoint',
    description: 'The `id` parameter in GET /api/users?id= is vulnerable to SQL injection. An attacker can extract the entire database or execute arbitrary SQL commands.',
    recommendation: 'Use parameterized queries or prepared statements. Never concatenate user input directly into SQL queries. Implement input validation and sanitization.',
    endpoint: 'GET /api/users?id=1',
  },
  {
    id: '2',
    type: 'XSS',
    severity: 'HIGH',
    title: 'Reflected XSS in search parameter',
    description: 'The `q` parameter in the search functionality reflects user input without proper encoding, enabling script injection.',
    recommendation: 'Encode all user-controlled output. Use Content Security Policy (CSP) headers. Implement strict input validation on the server side.',
    endpoint: 'GET /search?q=<payload>',
  },
  {
    id: '3',
    type: 'SSRF',
    severity: 'HIGH',
    title: 'Server-Side Request Forgery via webhook',
    description: 'The webhook URL parameter can be set to internal addresses, allowing an attacker to make requests to internal services.',
    recommendation: 'Implement a whitelist of allowed domains. Use a dedicated egress proxy. Validate and sanitize all URL inputs. Block requests to private IP ranges.',
    endpoint: 'POST /api/webhooks',
  },
  {
    id: '4',
    type: 'OPEN_REDIRECT',
    severity: 'MEDIUM',
    title: 'Open Redirect on /callback route',
    description: 'The `redirect_to` parameter is not validated, allowing redirects to arbitrary external domains.',
    recommendation: 'Validate redirect URLs against a whitelist. Use relative paths for redirects when possible. Implement CSRF protection.',
    endpoint: 'GET /callback?redirect_to=https://evil.com',
  },
];

const ScanDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState<string | null>(null);

  // Mock scan data
  const scan = {
    id,
    target: 'api.example.com',
    status: 'FINISHED',
    startedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    finishedAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    duration: 342,
    criticalCount: 1,
    highCount: 2,
    mediumCount: 1,
    lowCount: 0,
    attacksCount: 4,
  };

  const severityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sorted = [...mockAttacks].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <DashboardLayout title="Scan Details">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scans
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {scan.target}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <Badge variant={statusBadge(scan.status)} dot>
                {scan.status}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {formatDateTime(scan.startedAt)}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(scan.duration)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Critical', count: scan.criticalCount, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'High', count: scan.highCount, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Medium', count: scan.mediumCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Low', count: scan.lowCount, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
          </Card>
        ))}
      </div>

      {/* Findings */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700/50">
          <CardHeader className="mb-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <CardTitle>Vulnerabilities Found ({scan.attacksCount})</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-mono text-slate-400">{scan.target}</span>
            </div>
          </CardHeader>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
          {sorted.map((attack) => (
            <div key={attack.id} className="group">
              <button
                onClick={() => setExpanded(expanded === attack.id ? null : attack.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge variant={severityBadge(attack.severity)} dot>
                    {attack.severity}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {attack.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                      <code className="text-xs text-slate-400 font-mono">{attack.endpoint}</code>
                    </div>
                  </div>
                </div>
                {expanded === attack.id ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {expanded === attack.id && (
                <div className="px-5 pb-5 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Description
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {attack.description}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                        Recommendation
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {attack.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ScanDetailPage;
