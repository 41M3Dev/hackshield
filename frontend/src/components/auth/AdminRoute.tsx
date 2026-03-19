import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/** Redirige vers /dashboard si non admin */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  if (!user || user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
