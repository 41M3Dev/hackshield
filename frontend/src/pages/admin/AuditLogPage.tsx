import { useState } from 'react'
import { Search, Clock, User, Globe } from 'lucide-react'
import type { AuditLog } from '../../types'

const mockLogs: AuditLog[] = [
  { id: 'log1', userId: 'u1-admin-0001', action: 'LOGIN', target: 'auth', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', createdAt: '2026-03-19T08:30:00Z' },
  { id: 'log2', userId: 'u1-admin-0001', action: 'CREATE_TARGET', target: 'Production API', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', createdAt: '2026-03-19T08:35:00Z' },
  { id: 'log3', userId: 'u1-admin-0001', action: 'START_SCAN', target: 's1-scan-0001', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', createdAt: '2026-03-19T08:40:00Z' },
  { id: 'log4', userId: 'u2-user-0002', action: 'LOGIN', target: 'auth', ipAddress: '10.0.0.5', userAgent: 'Firefox/121', createdAt: '2026-03-18T14:20:00Z' },
  { id: 'log5', userId: 'u1-admin-0001', action: 'UPDATE_USER', target: 'u3-user-0003', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', createdAt: '2026-03-18T10:00:00Z' },
  { id: 'log6', userId: 'u3-user-0003', action: 'LOGIN_FAILED', target: 'auth', ipAddress: '172.16.0.1', userAgent: 'Safari/17', createdAt: '2026-03-17T22:15:00Z' },
  { id: 'log7', userId: 'u1-admin-0001', action: 'DELETE_TARGET', target: 'Old FTP Server', ipAddress: '192.168.1.1', userAgent: 'Chrome/120', createdAt: '2026-03-17T09:00:00Z' },
  { id: 'log8', apiKeyId: 'k1', action: 'API_REQUEST', target: '/api/targets', ipAddress: '203.0.113.10', userAgent: 'curl/8.0', createdAt: '2026-03-16T16:30:00Z' },
]

const actionColors: Record<string, string> = {
  LOGIN: 'text-emerald-400',
  LOGIN_FAILED: 'text-red-400',
  CREATE_TARGET: 'text-blue-400',
  START_SCAN: 'text-primary',
  UPDATE_USER: 'text-amber-400',
  DELETE_TARGET: 'text-red-400',
  API_REQUEST: 'text-slate-400',
}

export default function AuditLogPage() {
  const [search, setSearch] = useState('')

  const filtered = mockLogs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.target?.toLowerCase().includes(search.toLowerCase()) ||
    l.userId?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-txt">Journal d'audit</h1>
        <p className="text-xs text-txt-muted">Historique de toutes les actions</p>
      </div>

      <div className="relative w-full max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-white/[0.06] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(log => (
          <div key={log.id} className="bg-surface rounded-xl border border-white/[0.06] px-5 py-3 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-txt-muted">
              {log.userId ? <User size={14} /> : <Globe size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${actionColors[log.action] || 'text-txt'}`}>
                  {log.action}
                </span>
                {log.target && (
                  <span className="text-xs text-txt-muted truncate">— {log.target}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-txt-muted mt-0.5">
                {log.userId && <span>{log.userId.slice(0, 12)}</span>}
                {log.apiKeyId && <span>API Key: {log.apiKeyId}</span>}
                {log.ipAddress && <span>{log.ipAddress}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-txt-muted shrink-0">
              <Clock size={12} />
              {new Date(log.createdAt).toLocaleString('fr-FR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
