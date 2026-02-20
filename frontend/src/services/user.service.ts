import api from './api';
import { User } from '../types';

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminUpdateUserDto {
  role?: 'USER' | 'ADMIN';
  plan?: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  company?: string;
}

export interface AdminCreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: 'USER' | 'ADMIN';
  plan?: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
}

const userService = {
  getMe: async (): Promise<User> => {
    const res = await api.get('/users/me');
    return res.data?.data || res.data;
  },

  updatePassword: async (dto: UpdatePasswordDto): Promise<void> => {
    await api.put('/users/me/password', dto);
  },

  generateApiKey: async (): Promise<{ apiKey: string }> => {
    const res = await api.post('/users/me/api-key');
    return res.data?.data || res.data;
  },

  revokeApiKey: async (): Promise<void> => {
    await api.delete('/users/me/api-key');
  },

  logoutAll: async (): Promise<void> => {
    await api.post('/users/me/logout-all');
  },

  // Admin endpoints
  getAll: async (): Promise<User[]> => {
    const res = await api.get('/users');
    return res.data?.data || res.data;
  },

  create: async (dto: AdminCreateUserDto): Promise<User> => {
    const res = await api.post('/users', dto);
    return res.data?.data || res.data;
  },

  update: async (id: string, dto: AdminUpdateUserDto): Promise<User> => {
    const res = await api.put(`/users/${id}/admin`, dto);
    return res.data?.data || res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default userService;
