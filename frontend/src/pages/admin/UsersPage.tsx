import { useState } from 'react'
import { Search, UserPlus, Edit3, ToggleLeft, ToggleRight } from 'lucide-react'
import { mockUsers } from '../../lib/mockData'
import type { User, Role, Plan } from '../../types'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { toast } from '../../components/ui/Toast'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([...mockUsers])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER' as Role,
    plan: 'FREE' as Plan,
  })

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.firstName?.toLowerCase() || '').includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditUser(null)
    setForm({ username: '', email: '', firstName: '', lastName: '', role: 'USER', plan: 'FREE' })
    setModalOpen(true)
  }

  const openEdit = (u: User) => {
    setEditUser(u)
    setForm({
      username: u.username,
      email: u.email,
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      role: u.role,
      plan: u.plan,
    })
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? {
        ...u,
        ...form,
        updatedAt: new Date().toISOString(),
      } : u))
      toast.success('Utilisateur modifié')
    } else {
      const newUser: User = {
        id: 'u-admin-' + Date.now(),
        ...form,
        rateLimit: 1000,
        isActive: true,
        isDeleted: false,
        emailVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUsers(prev => [newUser, ...prev])
      toast.success('Utilisateur créé')
    }
    setModalOpen(false)
  }

  const toggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u))
    toast.info('Statut modifié')
  }

  const inputClass = "w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-txt">Utilisateurs</h1>
          <p className="text-xs text-txt-muted">{users.length} utilisateur(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all">
          <UserPlus size={16} />
          Nouvel utilisateur
        </button>
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

      <div className="bg-surface rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Utilisateur</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Rôle</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Plan</th>
              <th className="text-left px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Statut</th>
              <th className="text-right px-5 py-3 text-[11px] font-medium text-txt-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white text-xs font-bold">
                      {u.firstName?.[0] || u.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-txt">{u.firstName} {u.lastName}</p>
                      <p className="text-[11px] text-txt-muted">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-txt-secondary">{u.email}</td>
                <td className="px-5 py-3"><Badge value={u.role} /></td>
                <td className="px-5 py-3"><Badge value={u.plan} /></td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    {u.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-txt-muted hover:text-txt transition-colors">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => toggleActive(u.id)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-txt-muted hover:text-txt transition-colors">
                      {u.isActive ? <ToggleRight size={15} className="text-emerald-400" /> : <ToggleLeft size={15} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Prénom</label>
              <input type="text" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nom</label>
              <input type="text" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nom d'utilisateur *</label>
            <input type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className={inputClass} required />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Rôle</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))} className={inputClass}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Plan</label>
              <select value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value as Plan }))} className={inputClass}>
                <option value="FREE">Free</option>
                <option value="STARTER">Starter</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/[0.08] text-sm text-txt-secondary hover:text-txt transition-colors">
              Annuler
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all">
              {editUser ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
