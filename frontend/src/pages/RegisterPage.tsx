import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from '../components/ui/Toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore(s => s.register)

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (key: string, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    setLoading(true)
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
      })
      toast.success('Compte créé avec succès')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-strong">
            <Shield size={20} className="text-white" />
          </div>
          <span className="text-xl font-semibold">
            <span className="text-txt">Sentinel</span>
            <span className="text-txt-secondary font-light">Nexus</span>
          </span>
        </div>

        <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 shadow-card">
          <h1 className="text-lg font-semibold text-txt mb-1">Créer un compte</h1>
          <p className="text-xs text-txt-muted mb-6">Rejoignez la plateforme SentinelNexus</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => set('firstName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                  placeholder="Alex"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => set('lastName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                  placeholder="Moreau"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nom d'utilisateur *</label>
              <input
                type="text"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                placeholder="johndoe"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Confirmer le mot de passe *</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Créer mon compte
            </button>
          </form>

          <p className="text-xs text-txt-muted text-center mt-5">
            Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
