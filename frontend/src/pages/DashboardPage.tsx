import { ShieldAlert, Fingerprint, Target, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import ThreatTrendPanel from '../components/ThreatTrendPanel'
import SeverityPanel from '../components/SeverityPanel'
import ThreatTable from '../components/ThreatTable'
import { useDataStore } from '../store/dataStore'

export default function DashboardPage() {
  const scans = useDataStore(s => s.scans)
  const targets = useDataStore(s => s.targets)

  const runningScans = scans.filter(s => s.status === 'RUNNING').length
  const finishedScans = scans.filter(s => s.status === 'FINISHED').length
  const criticalFindings = scans
    .flatMap(s => s.attacks || [])
    .filter(a => a.result?.severity === 'CRITICAL').length

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="flex gap-4 flex-wrap">
        <StatCard
          icon={<ShieldAlert size={18} />}
          title="Vulnérabilités critiques"
          value={String(criticalFindings).padStart(2, '0')}
          badge="+12%"
          badgeUp={true}
          subtitle="Trouvées dans les scans"
        />
        <StatCard
          icon={<Fingerprint size={18} />}
          title="Scans terminés"
          value={String(finishedScans).padStart(2, '0')}
          badge="+05%"
          badgeUp={true}
          subtitle="Scans complétés"
          highlighted
        />
        <StatCard
          icon={<Target size={18} />}
          title="Cibles actives"
          value={String(targets.length).padStart(2, '0')}
          badge="03%"
          badgeUp={false}
          subtitle="Cibles enregistrées"
        />
        <StatCard
          icon={<Users size={18} />}
          title="Scans en cours"
          value={String(runningScans).padStart(2, '0')}
          badge="03%"
          badgeUp={false}
          subtitle="Scans actifs"
        />
      </div>

      {/* Trend + Severity */}
      <div className="flex gap-4 flex-wrap">
        <ThreatTrendPanel />
        <SeverityPanel />
      </div>

      {/* Table */}
      <ThreatTable />
    </div>
  )
}
