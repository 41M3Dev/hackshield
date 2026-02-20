import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/auth.service';
import { useToast } from '../hooks/useToast';

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Min 8 characters')
      .regex(/[A-Z]/, 'Must include uppercase')
      .regex(/[0-9]/, 'Must include a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

const ResetPasswordPage: React.FC = () => {
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('Invalid link', 'Reset token is missing.');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, data.newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      toast.error('Reset failed', 'The link may be expired. Request a new one.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-100">
              Hack<span className="text-primary-400">Shield</span>
            </span>
          </Link>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">Password reset!</h2>
              <p className="text-sm text-slate-400">
                You're being redirected to login...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-100 mb-1">Set new password</h2>
                <p className="text-sm text-slate-400">Choose a strong password for your account.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                  {...register('newPassword')}
                  label="New Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.newPassword?.message}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPw((s) => !s)}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <Input
                  {...register('confirmPassword')}
                  label="Confirm Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  leftIcon={<Lock className="w-4 h-4" />}
                />
                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
