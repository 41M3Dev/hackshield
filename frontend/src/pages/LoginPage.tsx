import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const schema = z.object({
  login: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid credentials. Please try again.';
      toast.error('Login failed', msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-100">
              Hack<span className="text-primary-400">Shield</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 mt-2">Welcome back</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              {...register('login')}
              label="Email or Username"
              type="text"
              placeholder="you@company.com"
              autoComplete="username"
              error={errors.login?.message}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
