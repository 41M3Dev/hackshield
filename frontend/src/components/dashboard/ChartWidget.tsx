import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card, { CardHeader, CardTitle } from '../ui/Card';

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
};

// Mock data
const scansOverTime = [
  { month: 'Aug', scans: 12 },
  { month: 'Sep', scans: 19 },
  { month: 'Oct', scans: 8 },
  { month: 'Nov', scans: 25 },
  { month: 'Dec', scans: 31 },
  { month: 'Jan', scans: 27 },
  { month: 'Feb', scans: 18 },
];

const vulnsBySeverity = [
  { severity: 'Critical', count: 4, fill: COLORS.danger },
  { severity: 'High', count: 11, fill: '#f97316' },
  { severity: 'Medium', count: 23, fill: COLORS.warning },
  { severity: 'Low', count: 37, fill: COLORS.success },
];

const attackDistribution = [
  { name: 'SQL Injection', value: 28 },
  { name: 'XSS', value: 22 },
  { name: 'SSRF', value: 15 },
  { name: 'RCE', value: 8 },
  { name: 'Other', value: 27 },
];

const PIE_COLORS = [COLORS.danger, COLORS.warning, COLORS.primary, COLORS.purple, '#64748b'];

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(148,163,184,0.15)',
  borderRadius: '0.5rem',
  color: '#f1f5f9',
  fontSize: '12px',
};

export const ScansLineChart: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Scans Over Time</CardTitle>
      <span className="text-xs text-slate-500 dark:text-slate-400">Last 7 months</span>
    </CardHeader>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={scansOverTime}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="scans"
          stroke={COLORS.primary}
          strokeWidth={2.5}
          dot={{ r: 3, fill: COLORS.primary }}
          activeDot={{ r: 5, fill: COLORS.primary }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export const VulnsBarChart: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Vulnerabilities by Severity</CardTitle>
      <span className="text-xs text-slate-500 dark:text-slate-400">All time</span>
    </CardHeader>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={vulnsBySeverity} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
        <XAxis dataKey="severity" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {vulnsBySeverity.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export const AttackPieChart: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Attack Type Distribution</CardTitle>
      <span className="text-xs text-slate-500 dark:text-slate-400">All scans</span>
    </CardHeader>
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={attackDistribution}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {attackDistribution.map((_, index) => (
              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </Card>
);
