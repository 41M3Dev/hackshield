import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, Lock, User, Mail, Building2, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const plans = [
  { id: 'FREE', name: 'Free', price: '$0/mo', desc: '5 scans/month' },
  { id: 'STARTER', name: 'Starter', price: '$49/mo', desc: '50 scans/month' },
  { id: 'PRO', name: 'Pro', price: '$149/mo', desc: 'Unlimited scans', popular: true },
];

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error('Registration failed', msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-lg">
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
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-400 mt-1">Free forever · No credit card required</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Row 1: Name */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register('firstName')}
                label="First Name"
                placeholder="John"
                leftIcon={<User className="w-3.5 h-3.5" />}
              />
              <Input
                {...register('lastName')}
                label="Last Name"
                placeholder="Doe"
              />
            </div>

            <Input
              {...register('username')}
              label="Username"
              placeholder="johndoe"
              error={errors.username?.message}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              {...register('email')}
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              {...register('company')}
              label="Company (optional)"
              placeholder="Acme Corp"
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <Input
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              hint="Min 8 chars, one uppercase, one number"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Plan selection */}
            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">Start with plan</p>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border p-3 cursor-pointer ${
                      plan.popular
                        ? 'border-primary-500/60 bg-primary-500/10'
                        : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </div>
                    )}
                    <p className={`text-xs font-bold ${plan.popular ? 'text-primary-300' : 'text-slate-200'}`}>
                      {plan.name}
                    </p>
                    <p className="text-xs font-semibold text-slate-100 mt-0.5">{plan.price}</p>
                    <p className="text-[11px] text-slate-400">{plan.desc}</p>
                    {plan.popular && (
                      <Check className="absolute top-2 right-2 w-3 h-3 text-primary-400" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">You can upgrade anytime from your dashboard</p>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create Account
            </Button>

            <p className="text-xs text-center text-slate-500">
              By creating an account you agree to our{' '}
              <a href="#" className="text-primary-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
