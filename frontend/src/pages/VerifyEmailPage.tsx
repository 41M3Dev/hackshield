import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Loader2, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from '../components/ui/Toast'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    updateProfile({ emailVerified: true })
    setVerified(true)
    toast.success('Email vérifié avec succès')
    setLoading(false)
    setTimeout(() => navigate('/dashboard'), 1500)
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

        <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 shadow-card text-center">
          {!verified ? (
            <>
              <h1 className="text-lg font-semibold text-txt mb-1">Vérification d'email</h1>
              <p className="text-xs text-txt-muted mb-6">
                {user ? `Un email a été envoyé à ${user.email}` : 'Cliquez pour simuler la vérification'}
              </p>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-dim text-white text-sm font-semibold border border-primary/30 shadow-glow hover:shadow-glow-strong transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Vérifier mon email (mode démo)
              </button>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h1 className="text-lg font-semibold text-txt mb-1">Email vérifié !</h1>
              <p className="text-xs text-txt-muted">Redirection vers le tableau de bord...</p>
            </>
          )}

          <p className="text-xs text-txt-muted mt-5">
            <Link to="/dashboard" className="text-primary hover:underline">Aller au tableau de bord</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
