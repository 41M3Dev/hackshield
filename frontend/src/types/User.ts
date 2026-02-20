export type UserRole = 'USER' | 'ADMIN';
export type PlanType = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role: UserRole;
  plan: PlanType;
  isActive: boolean;
  isEmailVerified: boolean;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
