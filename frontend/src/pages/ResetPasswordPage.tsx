import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from '../components/ui/Toast'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Mot de passe réinitialisé avec succès')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
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
          <h1 className="text-lg font-semibold text-txt mb-1">Nouveau mot de passe</h1>
          <p className="text-xs text-txt-muted mb-6">Choisissez un nouveau mot de passe sécurisé</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
              <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Confirmer</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Réinitialiser
            </button>
          </form>

          <p className="text-xs text-txt-muted text-center mt-5">
            <Link to="/login" className="text-primary hover:underline">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
