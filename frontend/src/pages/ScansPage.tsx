import { useState } from 'react'
import { Play, StopCircle, Eye, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import type { AttackType } from '../types'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { toast } from '../components/ui/Toast'

export default function ScansPage() {
  const user = useAuthStore(s => s.user)
  const { scans, targets, createScan, cancelScan } = useDataStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState('')
  const [expandedScan, setExpandedScan] = useState<string | null>(null)

  const filtered = scans.filter(s => {
    const target = s.target
    return (
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      target?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.status.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedTarget) return
    createScan(selectedTarget, user.id)
    toast.success('Scan lancé')
    setModalOpen(false)
    setSelectedTarget('')
  }

  const handleCancel = (id: string) => {
    cancelScan(id)
    toast.info('Scan annulé')
  }

  const formatDate = (d?: string) => d ? new Date(d).toLocaleString('fr-FR') : '—'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-txt">Scans</h1>
          <p className="text-xs text-txt-muted">{scans.length} scan(s)</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all"
        >
          <Play size={16} />
          Nouveau scan
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un scan..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-white/[0.06] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Scan list */}
      <div className="space-y-3">
        {filtered.map(scan => (
          <div key={scan.id} className="bg-surface rounded-2xl border border-white/[0.06] overflow-hidden">
            {/* Scan row */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-txt truncate">{scan.target?.name || scan.targetId}</span>
                  <Badge value={scan.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-txt-muted">
                  <span>ID: {scan.id.slice(0, 12)}</span>
                  <span>Début: {formatDate(scan.startedAt)}</span>
                  <span>Fin: {formatDate(scan.finishedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(scan.status === 'PENDING' || scan.status === 'RUNNING') && (
                  <button
                    onClick={() => handleCancel(scan.id)}
                    className="p-2 rounded-lg hover:bg-red-400/10 text-txt-muted hover:text-red-400 transition-colors"
                    title="Annuler"
                  >
                    <StopCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-txt-muted hover:text-txt transition-colors"
                  title="Détails"
                >
                  {expandedScan === scan.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Expanded: attacks + results */}
            {expandedScan === scan.id && (
              <div className="border-t border-white/[0.04] px-5 py-4">
                {scan.attacks && scan.attacks.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-txt-secondary uppercase tracking-wider">Attaques ({scan.attacks.length})</p>
                    {scan.attacks.map(attack => (
                      <div key={attack.id} className="bg-bg rounded-xl border border-white/[0.04] p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge value={attack.type} />
                          <Badge value={attack.status} />
                          <span className="text-xs text-txt-muted ml-auto">Outil: {attack.tool}</span>
                        </div>
                        {attack.result && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge value={attack.result.severity} />
                              <span className="text-xs text-txt-secondary">
                                {attack.result.success ? 'Vulnérabilité trouvée' : 'Pas de vulnérabilité'}
                              </span>
                            </div>
                            {attack.result.recommendation && (
                              <p className="text-xs text-txt-muted bg-primary/[0.04] rounded-lg p-2.5 border border-primary/10">
                                {attack.result.recommendation}
                              </p>
                            )}
                            {attack.result.output && (
                              <pre className="text-xs text-txt-muted bg-bg rounded-lg p-2.5 border border-white/[0.04] overflow-x-auto font-mono">
                                {JSON.stringify(attack.result.output, null, 2)}
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-txt-muted text-center py-4">Aucune attaque associée</p>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-surface rounded-2xl border border-white/[0.06] px-5 py-10 text-center text-sm text-txt-muted">
            Aucun scan trouvé
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau scan">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Cible *</label>
            <select
              value={selectedTarget}
              onChange={e => setSelectedTarget(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"
              required
            >
              <option value="">Sélectionner une cible</option>
              {targets.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.host})</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-txt-muted">
            Le scan lancera automatiquement les tests de sécurité sur la cible sélectionnée.
          </p>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-sm text-txt-secondary hover:text-txt transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all">
              Lancer le scan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
