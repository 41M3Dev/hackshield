import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Loader2, Mail } from 'lucide-react'
import { toast } from '../components/ui/Toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    toast.success('Email de réinitialisation envoyé (mock)')
    setLoading(false)
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
          <h1 className="text-lg font-semibold text-txt mb-1">Mot de passe oublié</h1>
          <p className="text-xs text-txt-muted mb-6">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-txt-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt placeholder:text-txt-muted/40 outline-none focus:border-primary/40 transition-colors"
                  placeholder="admin@hackshield.dev"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Envoyer le lien
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail size={22} className="text-primary" />
              </div>
              <p className="text-sm text-txt mb-1">Email envoyé !</p>
              <p className="text-xs text-txt-muted mb-4">
                Vérifiez votre boîte de réception pour le lien de réinitialisation.
              </p>
              <Link
                to="/reset-password"
                className="text-xs text-primary hover:underline"
              >
                Simuler la réinitialisation (mode démo)
              </Link>
            </div>
          )}

          <p className="text-xs text-txt-muted text-center mt-5">
            <Link to="/login" className="text-primary hover:underline">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
