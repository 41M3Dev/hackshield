import { ShieldAlert, Fingerprint, Target, Users } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import StatCard from './components/StatCard'
import ThreatTrendPanel from './components/ThreatTrendPanel'
import SeverityPanel from './components/SeverityPanel'
import ThreatTable from './components/ThreatTable'

/**
 * Dashboard principal « SentinelNexus » — Cyber Threat Intelligence.
 *
 * Layout :
 *  ┌────────────┬─────────────────────────────────────────┐
 *  │  Sidebar   │  Topbar                                 │
 *  │            ├─────────────────────────────────────────┤
 *  │            │  4 KPI Cards                            │
 *  │            ├───────────────────────┬─────────────────┤
 *  │            │  Threat Trend Panel   │ Severity Panel  │
 *  │            ├───────────────────────┴─────────────────┤
 *  │            │  Threat Table                           │
 *  │  Upgrade   │                                         │
 *  └────────────┴─────────────────────────────────────────┘
 */
export default function App() {
  return (
    <div className="
      h-screen w-screen overflow-hidden flex
      bg-[#080C18]
    ">
      {/* ── Coque globale avec bordure premium ─────────────────── */}
      <div className="
        flex flex-1 m-2 rounded-[20px] overflow-hidden
        bg-bg
        border border-white/[0.06]
        shadow-[0_0_60px_rgba(139,92,246,0.04),0_0_120px_rgba(0,0,0,0.5)]
      ">
        {/* ── Sidebar ──────────────────────────────────────────── */}
        <Sidebar />

        {/* ── Zone principale ──────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <Topbar />

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* ── Rangée des 4 KPI Cards ───────────────────────── */}
            <div className="flex gap-4 flex-wrap">
              <StatCard
                icon={<ShieldAlert size={18} />}
                title="Critical Treats"
                value="5–10"
                badge="+12%"
                badgeUp={true}
                subtitle="Active Critical Severity Threats"
              />
              <StatCard
                icon={<Fingerprint size={18} />}
                title="New IOCs"
                value="10–15"
                badge="+05 %"
                badgeUp={true}
                subtitle="Indicators In Last 24h"
                highlighted
              />
              <StatCard
                icon={<Target size={18} />}
                title="Active Campaigns"
                value="06–10"
                badge="03%"
                badgeUp={false}
                subtitle="Ongoing campaigns"
              />
              <StatCard
                icon={<Users size={18} />}
                title="Active Campaigns"
                value="7–09"
                badge="03%"
                badgeUp={false}
                subtitle="Ongoing campaigns"
              />
            </div>

            {/* ── Rangée analytique : Trend + Severity ──────────── */}
            <div className="flex gap-4 flex-wrap">
              <ThreatTrendPanel />
              <SeverityPanel />
            </div>

            {/* ── Tableau des menaces ──────────────────────────── */}
            <ThreatTable />

          </div>
        </main>
      </div>
    </div>
  )
}
