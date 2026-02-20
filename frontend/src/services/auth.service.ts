import api from './api';
import { User } from '../types';

export interface LoginDto {
  login: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', dto);
    return res.data?.data || res.data;
  },

  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', dto);
    return res.data?.data || res.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data?.data || res.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/users/me');
    return res.data?.data || res.data;
  },
};

export default authService;
