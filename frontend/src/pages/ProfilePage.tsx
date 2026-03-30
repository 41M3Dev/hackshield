import { useState } from 'react'
import { User, Key, Copy, Plus, Trash2, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import Badge from '../components/ui/Badge'
import { toast } from '../components/ui/Toast'

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuthStore()
  const [tab, setTab] = useState<'profile' | 'password' | 'apikeys'>('profile')
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
    phoneNumber: user?.phoneNumber || '',
  })

  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' })

  const [apiKeys, setApiKeys] = useState([
    { id: 'k1', key: 'hs_live_a1b2c3d4e5f6g7h8i9j0', scopes: ['read', 'write'], createdAt: '2026-03-01T10:00:00Z' },
    { id: 'k2', key: 'hs_test_z9y8x7w6v5u4t3s2r1q0', scopes: ['read'], createdAt: '2026-03-10T15:00:00Z' },
  ])

  if (!user) return null

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    updateProfile(profile)
    toast.success('Profil mis à jour')
    setLoading(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pw.newPw !== pw.confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      await updatePassword(pw.current, pw.newPw)
      toast.success('Mot de passe modifié')
      setPw({ current: '', newPw: '', confirm: '' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const random = Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const newKey = {
      id: 'k-' + Date.now(),
      key: `hs_live_${random}`,
      scopes: ['read', 'write'],
      createdAt: new Date().toISOString(),
    }
    setApiKeys(prev => [...prev, newKey])
    toast.success('Clé API générée')
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id))
    toast.success('Clé API supprimée')
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.info('Clé copiée')
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: <User size={15} /> },
    { id: 'password' as const, label: 'Mot de passe', icon: <Key size={15} /> },
    { id: 'apikeys' as const, label: 'Clés API', icon: <Key size={15} /> },
  ]

  const inputClass = "w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-txt">Mon profil</h1>
        <p className="text-xs text-txt-muted">Gérez vos informations personnelles</p>
      </div>

      {/* User summary */}
      <div className="bg-surface rounded-2xl border border-white/[0.06] p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold">
          {user.firstName?.[0] || user.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-txt">{user.firstName} {user.lastName || user.username}</p>
          <p className="text-xs text-txt-muted">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Badge value={user.role} />
          <Badge value={user.plan} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl border border-white/[0.06] p-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id
                ? 'bg-primary/[0.12] text-txt border border-primary/20'
                : 'text-txt-muted hover:text-txt border border-transparent'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-surface rounded-2xl border border-white/[0.06] p-6">
        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Prénom</label>
                <input type="text" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nom</label>
                <input type="text" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Entreprise</label>
              <input type="text" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Téléphone</label>
              <input type="text" value={profile.phoneNumber} onChange={e => setProfile(p => ({ ...p, phoneNumber: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Email</label>
              <input type="email" value={user.email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader2 size={15} className="animate-spin" />}
              Enregistrer
            </button>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Mot de passe actuel</label>
              <input type="password" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nouveau mot de passe</label>
              <input type="password" value={pw.newPw} onChange={e => setPw(p => ({ ...p, newPw: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Confirmer</label>
              <input type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} className={inputClass} required />
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader2 size={15} className="animate-spin" />}
              Modifier le mot de passe
            </button>
          </form>
        )}

        {tab === 'apikeys' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-txt-muted">Gérez vos clés d'accès API</p>
              <button onClick={generateApiKey} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                <Plus size={14} /> Générer
              </button>
            </div>
            <div className="space-y-2">
              {apiKeys.map(k => (
                <div key={k.id} className="flex items-center gap-3 bg-bg rounded-xl border border-white/[0.04] p-3">
                  <code className="flex-1 text-xs text-txt-secondary font-mono truncate">{k.key}</code>
                  <span className="text-[10px] text-txt-muted">{k.scopes.join(', ')}</span>
                  <button onClick={() => copyKey(k.key)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-txt-muted hover:text-txt transition-colors">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => deleteApiKey(k.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-txt-muted hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
