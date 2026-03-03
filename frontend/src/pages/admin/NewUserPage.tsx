import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, UserPlus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/user.service';

const schema = z.object({
  username: z.string().min(3, 'Min 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']),
  plan: z.enum(['FREE', 'STARTER', 'PRO', 'ENTERPRISE']),
});

type FormData = z.infer<typeof schema>;

const NewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'USER', plan: 'FREE' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await userService.create(data);
      toast.success('User created', `${data.username} has been added.`);
      navigate('/admin/users');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create user.';
      toast.error('Create failed', msg);
    }
  };

  return (
    <DashboardLayout title="New User">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create User</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Add a new user account to the platform
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700/50">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">User Details</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Input
                {...register('firstName')}
                label="First Name"
                placeholder="John"
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
            />

            <Input
              {...register('email')}
              label="Email"
              type="email"
              placeholder="john@company.com"
              error={errors.email?.message}
            />

            <Input
              {...register('company')}
              label="Company (optional)"
              placeholder="Acme Corp"
            />

            <Input
              {...register('password')}
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              hint="Min 8 characters"
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                {...register('role')}
                label="Role"
                options={[
                  { value: 'USER', label: 'User' },
                  { value: 'ADMIN', label: 'Admin' },
                ]}
              />
              <Select
                {...register('plan')}
                label="Plan"
                options={[
                  { value: 'FREE', label: 'Free' },
                  { value: 'STARTER', label: 'Starter' },
                  { value: 'PRO', label: 'Pro' },
                  { value: 'ENTERPRISE', label: 'Enterprise' },
                ]}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" isLoading={isSubmitting}>
                Create User
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewUserPage;
