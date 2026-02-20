import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Target } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../hooks/useToast';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['WEB', 'API', 'NETWORK', 'MOBILE']),
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().min(1).max(65535).optional(),
  description: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

const NewTargetPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'WEB' },
  });

  const onSubmit = async (data: FormData) => {
    // Backend not ready — show mock success
    console.log('Create target:', data);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Target created', `${data.name} has been added successfully.`);
    navigate('/targets');
  };

  return (
    <DashboardLayout title="Add Target">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Targets
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Target</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Define a target to scan for vulnerabilities
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700/50">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Target Configuration</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Note: Scan execution is coming soon. Target will be saved.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              {...register('name')}
              label="Target Name"
              placeholder="e.g., Main API, Production App"
              error={errors.name?.message}
              hint="A friendly name to identify this target"
            />

            <Select
              {...register('type')}
              label="Target Type"
              options={[
                { value: 'WEB', label: 'Web Application' },
                { value: 'API', label: 'REST / GraphQL API' },
                { value: 'NETWORK', label: 'Network / IP Range' },
                { value: 'MOBILE', label: 'Mobile App Backend' },
              ]}
            />

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Input
                  {...register('host')}
                  label="Host / URL"
                  placeholder="e.g., api.example.com or 192.168.1.1"
                  error={errors.host?.message}
                />
              </div>
              <Input
                {...register('port')}
                label="Port (optional)"
                type="number"
                placeholder="443"
                error={errors.port?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description (optional)
              </label>
              <textarea
                {...register('description')}
                placeholder="Brief description of this target..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" isLoading={isSubmitting}>
                Add Target
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/targets')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewTargetPage;
