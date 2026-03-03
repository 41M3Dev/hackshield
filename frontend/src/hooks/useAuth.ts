import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import authService, { LoginDto, RegisterDto } from '../services/auth.service';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setUser, setLoading } = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(
    async (dto: LoginDto) => {
      setLoading(true);
      try {
        const data = await authService.login(dto);
        setAuth(data.user, data.accessToken, data.refreshToken);
        navigate('/dashboard');
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, navigate]
  );

  const register = useCallback(
    async (dto: RegisterDto) => {
      setLoading(true);
      try {
        const data = await authService.register(dto);
        setAuth(data.user, data.accessToken, data.refreshToken);
        navigate('/dashboard');
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth, setLoading, navigate]
  );

  const logout = useCallback(async () => {
    const { refreshToken } = useAuthStore.getState();
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Silent fail on logout errors
    } finally {
      clearAuth();
      navigate('/login');
    }
  }, [clearAuth, navigate]);

  const refreshProfile = useCallback(async () => {
    try {
      const updatedUser = await authService.getMe();
      setUser(updatedUser);
      return updatedUser;
    } catch {
      // Profile refresh failed silently
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };
};
