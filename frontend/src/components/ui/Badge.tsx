import type { Severity, ScanStatus, AttackStatus, Role, Plan, TargetType } from '../../types'

/* Mapping couleur par valeur — réutilisable partout dans l'app */
const styles: Record<string, string> = {
  /* Severity */
  CRITICAL: 'bg-accent/10 text-accent border-accent/20',
  HIGH: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  MEDIUM: 'bg-primary/10 text-primary border-primary/20',
  LOW: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  /* Scan/Attack status */
  PENDING: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  RUNNING: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  FINISHED: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  CANCELLED: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  FAILED: 'bg-red-400/10 text-red-400 border-red-400/20',
  SUCCESS: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  /* Role */
  ADMIN: 'bg-primary/10 text-primary border-primary/20',
  USER: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  /* Plan */
  FREE: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
  STARTER: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  PRO: 'bg-primary/10 text-primary border-primary/20',
  ENTERPRISE: 'bg-accent/10 text-accent border-accent/20',
  /* TargetType */
  WEBSITE: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  SSH: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  FTP: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  WORDPRESS: 'bg-primary/10 text-primary border-primary/20',
  /* Attack type */
  BRUTEFORCE: 'bg-red-400/10 text-red-400 border-red-400/20',
  SQLI: 'bg-accent/10 text-accent border-accent/20',
  XSS: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  UPLOAD: 'bg-primary/10 text-primary border-primary/20',
}

interface Props {
  value: string
  className?: string
}

export default function Badge({ value, className = '' }: Props) {
  const s = styles[value] || styles.LOW
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-md
      text-[11px] font-semibold border
      ${s} ${className}
    `}>
      {value}
    </span>
  )
}
