/* ──────────────────────────────────────────────────────────────────
   Types miroir des modèles Prisma du backend.
   Alignés sur schema.prisma pour faciliter la future intégration API.
   ──────────────────────────────────────────────────────────────── */

export type Role = 'USER' | 'ADMIN'
export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'
export type TargetType = 'WEBSITE' | 'SSH' | 'FTP' | 'WORDPRESS'
export type ScanStatus = 'PENDING' | 'RUNNING' | 'FINISHED' | 'CANCELLED' | 'FAILED'
export type AttackType = 'BRUTEFORCE' | 'SQLI' | 'XSS' | 'UPLOAD'
export type AttackStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  role: Role
  plan: Plan
  rateLimit: number
  isActive: boolean
  isDeleted: boolean
  lastLogin?: string
  emailVerified: boolean
  phoneNumber?: string
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiKey {
  id: string
  key: string
  scopes: string[]
  userId: string
  createdAt: string
}

export interface Target {
  id: string
  name: string
  type: TargetType
  host: string
  port?: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Scan {
  id: string
  status: ScanStatus
  userId: string
  targetId: string
  target?: Target
  attacks?: Attack[]
  startedAt?: string
  finishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Attack {
  id: string
  type: AttackType
  tool: string
  status: AttackStatus
  config?: Record<string, unknown>
  scanId: string
  result?: Result
  createdAt: string
  updatedAt: string
}

export interface Result {
  id: string
  success: boolean
  severity: Severity
  output?: Record<string, unknown>
  recommendation?: string
  attackId: string
  createdAt: string
}

export interface AuditLog {
  id: string
  userId?: string
  apiKeyId?: string
  action: string
  target?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

/* ── Types d'API (request/response) ────────────────────────────── */
export interface LoginRequest {
  login: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  company?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface TwoFactorResponse {
  requiresTwoFactor: true
  userId: string
}

export interface CreateTargetRequest {
  name: string
  type: TargetType
  host: string
  port?: number
}

export interface CreateScanRequest {
  targetId: string
  attacks: { type: AttackType; tool: string; config?: Record<string, unknown> }[]
}
