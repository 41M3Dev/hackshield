import { useState } from 'react'
import { Shield, Bell, Palette, Globe } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { toast } from '../components/ui/Toast'

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore()
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false)
  const [notifications, setNotifications] = useState({
    scanComplete: true,
    criticalVuln: true,
    weeklyReport: false,
    newLogin: true,
  })
  const [language, setLanguage] = useState('fr')

  if (!user) return null

  const toggle2FA = () => {
    const next = !twoFactor
    setTwoFactor(next)
    updateProfile({ twoFactorEnabled: next })
    toast.success(next ? '2FA activé' : '2FA désactivé')
  }

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.info('Préférence mise à jour')
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative ${
        checked ? 'bg-primary' : 'bg-white/[0.1]'
      }`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
        checked ? 'left-[22px]' : 'left-0.5'
      }`} />
    </button>
  )

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-txt">Paramètres</h1>
        <p className="text-xs text-txt-muted">Configurez votre expérience</p>
      </div>

      {/* Sécurité */}
      <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-txt">Sécurité</h2>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
          <div>
            <p className="text-sm text-txt">Authentification à deux facteurs</p>
            <p className="text-xs text-txt-muted">Sécurisez votre compte avec un code SMS</p>
          </div>
          <Toggle checked={twoFactor} onChange={toggle2FA} />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm text-txt">Sessions actives</p>
            <p className="text-xs text-txt-muted">1 session active</p>
          </div>
          <button
            onClick={() => toast.info('Toutes les autres sessions ont été déconnectées (mock)')}
            className="text-xs text-red-400 hover:underline"
          >
            Déconnecter tout
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-txt">Notifications</h2>
        </div>

        {([
          { key: 'scanComplete' as const, label: 'Scan terminé', desc: 'Notification quand un scan est terminé' },
          { key: 'criticalVuln' as const, label: 'Vulnérabilité critique', desc: 'Alerte immédiate pour les sévérités critiques' },
          { key: 'weeklyReport' as const, label: 'Rapport hebdomadaire', desc: 'Résumé de la semaine par email' },
          { key: 'newLogin' as const, label: 'Nouvelle connexion', desc: 'Alerte lors d\'une connexion depuis un nouvel appareil' },
        ]).map((item, i, arr) => (
          <div key={item.key} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div>
              <p className="text-sm text-txt">{item.label}</p>
              <p className="text-xs text-txt-muted">{item.desc}</p>
            </div>
            <Toggle checked={notifications[item.key]} onChange={() => toggleNotif(item.key)} />
          </div>
        ))}
      </div>

      {/* Préférences */}
      <div className="bg-surface rounded-2xl border border-white/[0.06] p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-txt">Préférences</h2>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm text-txt">Langue</p>
            <p className="text-xs text-txt-muted">Langue de l'interface</p>
          </div>
          <select
            value={language}
            onChange={e => { setLanguage(e.target.value); toast.info('Langue mise à jour') }}
            className="px-3 py-1.5 rounded-lg bg-bg border border-white/[0.08] text-sm text-txt outline-none focus:border-primary/40 transition-colors"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  )
}
