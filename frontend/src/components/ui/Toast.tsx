import { create } from 'zustand'
import { useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'

/* ── Store ─────────────────────────────────────────────────────── */
type ToastType = 'success' | 'error' | 'warning' | 'info'
interface Toast { id: number; type: ToastType; message: string }
interface ToastStore {
  toasts: Toast[]
  add: (type: ToastType, message: string) => void
  remove: (id: number) => void
}
let _id = 0
export const useToastStore = create<ToastStore>()((set) => ({
  toasts: [],
  add: (type, message) => {
    const id = ++_id
    set(s => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 4000)
  },
  remove: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

/* Shortcut global */
export const toast = {
  success: (m: string) => useToastStore.getState().add('success', m),
  error: (m: string) => useToastStore.getState().add('error', m),
  warning: (m: string) => useToastStore.getState().add('warning', m),
  info: (m: string) => useToastStore.getState().add('info', m),
}

/* ── Icons par type ────────────────────────────────────────────── */
const icons = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <XCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-primary" />,
}
const borders = {
  success: 'border-emerald-500/20',
  error: 'border-red-500/20',
  warning: 'border-amber-500/20',
  info: 'border-primary/20',
}

/* ── Composant Container ───────────────────────────────────────── */
export default function ToastContainer() {
  const { toasts, remove } = useToastStore()
  if (!toasts.length) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`
            flex items-start gap-2.5 px-4 py-3 rounded-xl
            bg-surface border ${borders[t.type]}
            shadow-card text-sm text-txt
            animate-[slideIn_0.25s_ease-out]
          `}
        >
          <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
          <span className="flex-1 text-[13px]">{t.message}</span>
          <button onClick={() => remove(t.id)} className="text-txt-muted hover:text-txt shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
