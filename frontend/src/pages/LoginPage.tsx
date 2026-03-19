import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from '../components/ui/Toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  const verifyTwoFactor = useAuthStore(s => s.verifyTwoFactor)

  const [form, setForm] = useState({ login: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [twoFactor, setTwoFactor] = useState<{ userId: string } | null>(null)
  const [code, setCode] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await login(form.login, form.password)
      if (result.requiresTwoFactor && result.userId) {
        setTwoFactor({ userId: result.userId })
        toast.info('Code 2FA envoyé (mock: 123456)')
      } else {
        toast.success('Connexion réussie')
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!twoFactor) return
    setLoading(true)
    try {
      await verifyTwoFactor(twoFactor.userId, code)
      toast.success('Connexion réussie')
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
          <h1 className="text-lg font-semibold text-txt mb-1">
            {twoFactor ? 'Vérification 2FA' : 'Connexion'}
          </h1>
          <p className="text-xs text-txt-muted mb-6">
            {twoFactor
              ? 'Entrez le code reçu par SMS'
              : 'Connectez-vous à votre tableau de bord'}
          </p>

          {!twoFactor ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Email ou nom d'utilisateur</label>
                <input
                  type="text"
                  value={form.login}
                  onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                  placeholder="admin@hackshield.dev"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-[11px] text-primary hover:underline">Mot de passe oublié ?</Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Se connecter
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FA} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Code à 6 chiffres</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt text-center tracking-[0.5em] font-mono outline-none focus:border-primary/40 transition-colors"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Vérifier
              </button>
              <button type="button" onClick={() => setTwoFactor(null)} className="w-full text-xs text-txt-muted hover:text-txt transition-colors">
                Retour
              </button>
            </form>
          )}

          <p className="text-xs text-txt-muted text-center mt-5">
            Pas de compte ? <Link to="/register" className="text-primary hover:underline">Créer un compte</Link>
          </p>
        </div>

        {/* Hint mock */}
        <div className="mt-4 p-3 rounded-xl bg-primary/[0.05] border border-primary/10 text-[11px] text-txt-muted">
          <p className="font-medium text-primary mb-1">Mode démo</p>
          <p>Login : <span className="text-txt">admin@hackshield.dev</span></p>
          <p>Mot de passe : <span className="text-txt">Admin@2026!</span></p>
          <p>Code 2FA : <span className="text-txt">123456</span></p>
        </div>
      </div>
    </div>
  )
}
