import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Edit } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/user.service';
import { User } from '../../types';
import { formatDate } from '../../utils/formatters';
import { PageSpinner } from '../../components/ui/Spinner';

const schema = z.object({
  role: z.enum(['USER', 'ADMIN']),
  plan: z.enum(['FREE', 'STARTER', 'PRO', 'ENTERPRISE']),
  isActive: z.enum(['true', 'false']),
});

type FormData = z.infer<typeof schema>;

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // We fetch all and find the user since there's no GET /users/:id endpoint
        const users = await userService.getAll();
        const found = users.find((u) => u.id === id);
        if (found) {
          setUser(found);
          reset({
            role: found.role,
            plan: found.plan,
            isActive: found.isActive ? 'true' : 'false',
          });
        }
      } catch {
        toast.error('Failed to load user');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id, reset, toast]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      await userService.update(id, {
        role: data.role,
        plan: data.plan,
        isActive: data.isActive === 'true',
      });
      toast.success('User updated');
      navigate('/admin/users');
    } catch {
      toast.error('Update failed');
    }
  };

  if (isLoading) return (
    <DashboardLayout title="Edit User">
      <PageSpinner />
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Edit User">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Edit User</h1>
        {user && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Modifying account for <strong>{user.username}</strong>
          </p>
        )}
      </div>

      <div className="max-w-2xl space-y-5">
        {/* User info summary */}
        {user && (
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/15 flex items-center justify-center">
                <span className="text-lg font-bold text-primary-400">
                  {(user.firstName?.[0] || user.username[0]).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username}
                </p>
                <p className="text-xs text-slate-400 font-mono">{user.email}</p>
                <p className="text-xs text-slate-500 mt-0.5">Joined {formatDate(user.createdAt)}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Badge variant={user.isEmailVerified ? 'success' : 'warning'}>
                  {user.isEmailVerified ? 'Email verified' : 'Email unverified'}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Edit form */}
        <Card>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700/50">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Account Settings</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
              label="Subscription Plan"
              options={[
                { value: 'FREE', label: 'Free' },
                { value: 'STARTER', label: 'Starter ($49/mo)' },
                { value: 'PRO', label: 'Pro ($149/mo)' },
                { value: 'ENTERPRISE', label: 'Enterprise' },
              ]}
            />
            <Select
              {...register('isActive')}
              label="Account Status"
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive (suspended)' },
              ]}
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
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

export default EditUserPage;
