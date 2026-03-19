import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ToastContainer from './components/ui/Toast'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import DashboardLayout from './components/layout/DashboardLayout'

/* Auth pages */
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

/* App pages */
import DashboardPage from './pages/DashboardPage'
import TargetsPage from './pages/TargetsPage'
import ScansPage from './pages/ScansPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'

/* Admin pages */
import UsersPage from './pages/admin/UsersPage'
import AuditLogPage from './pages/admin/AuditLogPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/targets" element={<TargetsPage />} />
          <Route path="/scans" element={<ScansPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin routes */}
          <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="/admin/audit" element={<AdminRoute><AuditLogPage /></AdminRoute>} />
        </Route>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
