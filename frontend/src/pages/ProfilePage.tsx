import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Lock,
  Key,
  Zap,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import userService from '../services/user.service';
import { formatDate } from '../utils/formatters';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Must include uppercase'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const PLAN_COLORS: Record<string, string> = {
  FREE: 'default',
  STARTER: 'primary',
  PRO: 'success',
  ENTERPRISE: 'warning',
};

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onChangePassword = async (data: PasswordForm) => {
    try {
      await userService.updatePassword(data);
      toast.success('Password updated', 'Your password has been changed successfully.');
      reset();
    } catch {
      toast.error('Update failed', 'Current password may be incorrect.');
    }
  };

  const handleGenerateApiKey = async () => {
    setApiKeyLoading(true);
    try {
      const { apiKey } = await userService.generateApiKey();
      if (user) setUser({ ...user, apiKey });
      toast.success('API key generated', 'Your new API key is ready.');
    } catch {
      toast.error('Failed', 'Could not generate API key.');
    } finally {
      setApiKeyLoading(false);
    }
  };

  const handleRevokeApiKey = async () => {
    setApiKeyLoading(true);
    try {
      await userService.revokeApiKey();
      if (user) setUser({ ...user, apiKey: undefined });
      toast.success('API key revoked');
    } catch {
      toast.error('Failed', 'Could not revoke API key.');
    } finally {
      setApiKeyLoading(false);
    }
  };

  const handleCopyApiKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      toast.success('Copied to clipboard');
    }
  };

  const handleLogoutAll = async () => {
    try {
      await userService.logoutAll();
      toast.success('Logged out from all devices');
    } catch {
      toast.error('Failed', 'Could not logout from all devices.');
    }
  };

  return (
    <DashboardLayout title="Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your account information and security settings
        </p>
      </div>

      <div className="max-w-3xl space-y-5">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <CardTitle>Account Information</CardTitle>
            </div>
            <Badge variant={PLAN_COLORS[user?.plan || 'FREE'] as 'default'} dot>
              <Zap className="w-3 h-3 mr-1" />
              {user?.plan} Plan
            </Badge>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Username</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.username}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.email}</p>
                {user?.isEmailVerified ? (
                  <Badge variant="success" size="sm">Verified</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Unverified</Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">First Name</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{user?.firstName || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Last Name</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{user?.lastName || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{user?.company || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Role</p>
              <Badge variant={user?.role === 'ADMIN' ? 'warning' : 'default'}>
                {user?.role}
              </Badge>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Member Since</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {user?.createdAt ? formatDate(user.createdAt) : '—'}
              </p>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <CardTitle>Change Password</CardTitle>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4" noValidate>
            <Input
              {...register('currentPassword')}
              label="Current Password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.currentPassword?.message}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button type="button" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register('newPassword')}
                label="New Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.newPassword?.message}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Input
                {...register('confirmPassword')}
                label="Confirm Password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" isLoading={isSubmitting} size="sm">
              Update Password
            </Button>
          </form>
        </Card>

        {/* API Key */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-slate-400" />
              <CardTitle>API Key</CardTitle>
            </div>
            <Badge variant={user?.apiKey ? 'success' : 'default'} dot>
              {user?.apiKey ? 'Active' : 'None'}
            </Badge>
          </CardHeader>

          {user?.apiKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 rounded-lg px-3 py-2.5 border border-slate-200 dark:border-slate-700">
                <code className="flex-1 text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                  {showApiKey ? user.apiKey : `${user.apiKey.substring(0, 8)}${'•'.repeat(24)}`}
                </code>
                <button
                  onClick={() => setShowApiKey((s) => !s)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopyApiKey}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  isLoading={apiKeyLoading}
                  onClick={handleGenerateApiKey}
                >
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  isLoading={apiKeyLoading}
                  onClick={handleRevokeApiKey}
                >
                  Revoke
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Generate an API key to integrate HackShield with your CI/CD pipeline.
              </p>
              <Button
                size="sm"
                leftIcon={<Key className="w-3.5 h-3.5" />}
                isLoading={apiKeyLoading}
                onClick={handleGenerateApiKey}
              >
                Generate API Key
              </Button>
            </div>
          )}
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-slate-400" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Sign out of all other active sessions on other devices.
            </p>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              onClick={handleLogoutAll}
              className="border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              Logout All Devices
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
