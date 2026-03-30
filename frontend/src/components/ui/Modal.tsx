import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  wide?: boolean
}

export default function Modal({ open, onClose, title, children, wide }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  /* Fermer sur Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={ref}
        className={`
          bg-surface rounded-2xl border border-white/[0.06]
          shadow-[0_0_60px_rgba(0,0,0,0.5)]
          ${wide ? 'w-full max-w-2xl' : 'w-full max-w-md'}
          max-h-[90vh] overflow-y-auto
          animate-[scaleIn_0.2s_ease-out]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
          <h3 className="text-[15px] font-semibold text-txt">{title}</h3>
          <button onClick={onClose} className="text-txt-muted hover:text-txt transition-colors">
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
