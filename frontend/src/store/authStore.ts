/* ──────────────────────────────────────────────────────────────────
   Store d'authentification Zustand.
   Simule le flow complet du backend (login, register, logout, 2FA)
   avec des données mockées. Prêt à brancher sur l'API réelle.
   ──────────────────────────────────────────────────────────────── */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { mockUsers, MOCK_PASSWORD } from '../lib/mockData'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  /* Actions */
  login: (login: string, password: string) => Promise<{ requiresTwoFactor?: boolean; userId?: string }>
  register: (data: { username: string; email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>
  logout: () => void
  verifyTwoFactor: (userId: string, code: string) => Promise<void>
  updateProfile: (data: Partial<User>) => void
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

/* Délai simulé pour rendre le UX réaliste */
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (login, password) => {
        await delay()
        const user = mockUsers.find(
          u => (u.email === login || u.username === login) && !u.isDeleted
        )
        if (!user) throw new Error('Identifiants invalides')
        if (!user.isActive) throw new Error('Compte désactivé')
        if (password !== MOCK_PASSWORD) throw new Error('Identifiants invalides')

        /* Simule 2FA si activé */
        if (user.twoFactorEnabled) {
          return { requiresTwoFactor: true, userId: user.id }
        }

        set({ user, token: 'mock-jwt-' + user.id, isAuthenticated: true })
        return {}
      },

      register: async (data) => {
        await delay()
        if (mockUsers.some(u => u.email === data.email)) {
          throw new Error('Cet email est déjà utilisé')
        }
        if (mockUsers.some(u => u.username === data.username)) {
          throw new Error('Ce nom d\'utilisateur est déjà pris')
        }
        const newUser: User = {
          id: 'u-new-' + Date.now(),
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'USER',
          plan: 'FREE',
          rateLimit: 1000,
          isActive: true,
          isDeleted: false,
          emailVerified: false,
          twoFactorEnabled: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        mockUsers.push(newUser)
        set({ user: newUser, token: 'mock-jwt-' + newUser.id, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      verifyTwoFactor: async (userId, code) => {
        await delay()
        if (code !== '123456') throw new Error('Code invalide')
        const user = mockUsers.find(u => u.id === userId)
        if (!user) throw new Error('Utilisateur introuvable')
        set({ user, token: 'mock-jwt-' + user.id, isAuthenticated: true })
      },

      updateProfile: (data) => {
        const current = get().user
        if (!current) return
        const updated = { ...current, ...data, updatedAt: new Date().toISOString() }
        set({ user: updated })
      },

      updatePassword: async (_currentPassword, _newPassword) => {
        await delay()
        /* En mode mock, on accepte toujours */
      },
    }),
    {
      name: 'hackshield-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
