import { useState } from 'react'
import { Globe, Plus, Trash2, Search, Server, Wifi, FileCode } from 'lucide-react'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import type { TargetType } from '../types'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { toast } from '../components/ui/Toast'

const typeIcons: Record<TargetType, React.ReactNode> = {
  WEBSITE: <Globe size={16} />,
  SSH: <Server size={16} />,
  FTP: <Wifi size={16} />,
  WORDPRESS: <FileCode size={16} />,
}

export default function TargetsPage() {
  const user = useAuthStore(s => s.user)
  const { targets, addTarget, deleteTarget } = useDataStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'WEBSITE' as TargetType, host: '', port: '' })

  const filtered = targets.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.host.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    addTarget(
      { name: form.name, type: form.type, host: form.host, port: form.port ? Number(form.port) : undefined },
      user.id
    )
    toast.success('Cible ajoutée')
    setModalOpen(false)
    setForm({ name: '', type: 'WEBSITE', host: '', port: '' })
  }

  const handleDelete = (id: string, name: string) => {
    deleteTarget(id)
    toast.success(`Cible "${name}" supprimée`)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-txt">Cibles</h1>
          <p className="text-xs text-txt-muted">{targets.length} cible(s) enregistrée(s)</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all"
        >
          <Plus size={16} />
          Nouvelle cible
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une cible..."
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-white/[0.06] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Nom</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Type</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Hôte</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Port</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Créée le</th>
              <th className="text-right px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(target => (
              <tr key={target.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-txt-muted">{typeIcons[target.type]}</span>
                    <span className="text-sm font-medium text-txt">{target.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3"><Badge value={target.type} /></td>
                <td className="px-5 py-3 text-sm text-txt-secondary font-mono">{target.host}</td>
                <td className="px-5 py-3 text-sm text-txt-muted">{target.port || '—'}</td>
                <td className="px-5 py-3 text-xs text-txt-muted">
                  {new Date(target.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(target.id, target.name)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-txt-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-txt-muted">
                  Aucune cible trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle cible">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"
              placeholder="Mon serveur web"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Type *</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as TargetType }))}
              className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"
            >
              <option value="WEBSITE">Website</option>
              <option value="SSH">SSH</option>
              <option value="FTP">FTP</option>
              <option value="WORDPRESS">WordPress</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Hôte *</label>
            <input
              type="text"
              value={form.host}
              onChange={e => setForm(f => ({ ...f, host: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt font-mono outline-none focus:border-primary/40 transition-colors"
              placeholder="example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Port</label>
            <input
              type="number"
              value={form.port}
              onChange={e => setForm(f => ({ ...f, port: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"
              placeholder="443"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-sm text-txt-secondary hover:text-txt transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all">
              Créer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
