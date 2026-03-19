import { ChevronDown, Eye } from 'lucide-react'

/* ── Data mockée ───────────────────────────────────────────────── */
interface Threat {
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  title: string
  type: string
  date: string
  source: string
  detected: string
  detectedHighlight: boolean
}

const threats: Threat[] = [
  {
    severity: 'Critical',
    title: 'Ransomware Attack',
    type: 'Malware',
    date: '29 Oct 2026',
    source: 'External Ip192.168',
    detected: 'Real-Time',
    detectedHighlight: true,
  },
  {
    severity: 'High',
    title: 'Phishing Attempt',
    type: 'Email THREAT',
    date: '31 Oct 2026',
    source: 'mail.security.net',
    detected: '2 hrs age',
    detectedHighlight: false,
  },
  {
    severity: 'High',
    title: 'Phishing Attempt',
    type: 'Email THREAT',
    date: '31 Oct 2026',
    source: 'mail.security.net',
    detected: '2 hrs age',
    detectedHighlight: false,
  },
]

/* ── Couleurs de sévérité ──────────────────────────────────────── */
const severityStyles: Record<string, string> = {
  Critical: 'text-accent bg-accent/10 border-accent/15',
  High: 'text-amber-400 bg-amber-400/10 border-amber-400/15',
  Medium: 'text-primary bg-primary/10 border-primary/15',
  Low: 'text-txt-muted bg-white/5 border-white/10',
}

/* ── Colonnes du tableau ───────────────────────────────────────── */
const columns = [
  { key: 'severity', label: 'Severity' },
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'date', label: 'Date' },
  { key: 'source', label: 'Source' },
  { key: 'detected', label: 'Detected' },
  { key: 'action', label: 'Action', sortable: true },
]

/**
 * Tableau de menaces premium dark reproduisant fidèlement la référence.
 * En-tête discret, lignes « row card », badges, boutons View.
 */
export default function ThreatTable() {
  return (
    <div className="
      rounded-2xl border border-white/[0.05]
      bg-surface/30 shadow-card
      overflow-hidden
    ">
      {/* ── En-tête du tableau ──────────────────────────────────── */}
      <div className="grid grid-cols-[100px_1fr_130px_120px_160px_120px_80px] gap-2 px-5 py-3 border-b border-white/[0.04]">
        {columns.map((col) => (
          <div key={col.key} className="flex items-center gap-1 text-[11px] font-semibold text-txt-secondary/70 uppercase tracking-wider">
            {col.label}
            {col.sortable && <ChevronDown size={10} className="text-txt-muted" />}
          </div>
        ))}
      </div>

      {/* ── Lignes ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 p-2">
        {threats.map((threat, idx) => (
          <div
            key={idx}
            className="
              grid grid-cols-[100px_1fr_130px_120px_160px_120px_80px] gap-2
              items-center
              px-4 py-3 rounded-xl
              bg-surface/50
              border border-white/[0.03]
              hover:border-primary/10 hover:bg-surface/70
              transition-all duration-200
            "
          >
            {/* Severity */}
            <div>
              <span className={`
                inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold
                border ${severityStyles[threat.severity]}
              `}>
                {threat.severity}
              </span>
            </div>

            {/* Title */}
            <span className="text-[13px] font-medium text-txt truncate">{threat.title}</span>

            {/* Type */}
            <span className="text-[12px] text-txt-secondary">{threat.type}</span>

            {/* Date */}
            <span className="text-[12px] text-txt-muted">{threat.date}</span>

            {/* Source */}
            <span className="text-[12px] text-txt-secondary truncate">{threat.source}</span>

            {/* Detected */}
            <div>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
                border
                ${threat.detectedHighlight
                  ? 'bg-primary/12 text-primary border-primary/20 shadow-[0_0_8px_rgba(139,92,246,0.1)]'
                  : 'bg-accent/8 text-accent/80 border-accent/15'
                }
              `}>
                {threat.detected}
              </span>
            </div>

            {/* Action */}
            <button className="
              flex items-center gap-1 text-[12px] text-txt-muted
              hover:text-primary transition-colors
            ">
              <Eye size={13} />
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
