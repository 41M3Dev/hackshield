import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Trash2, Edit, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable, { Column } from '../../components/tables/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { User } from '../../types';
import userService from '../../services/user.service';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatters';

const planColors: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  FREE: 'default',
  STARTER: 'primary',
  PRO: 'success',
  ENTERPRISE: 'warning',
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await userService.delete(deleteTarget.id);
      setUsers((u) => u.filter((x) => x.id !== deleteTarget.id));
      toast.success('User deleted', `${deleteTarget.username} has been removed.`);
      setDeleteTarget(null);
    } catch {
      toast.error('Delete failed', 'Could not delete user.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.company || '').toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<User>[] = [
    {
      key: 'username',
      header: 'User',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{row.username}</p>
          <p className="text-xs text-slate-400 font-mono">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      render: (row) => (
        <span className="text-slate-500 dark:text-slate-400">{row.company || '—'}</span>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (row) => (
        <Badge variant={planColors[row.plan] || 'default'}>{row.plan}</Badge>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge variant={row.role === 'ADMIN' ? 'warning' : 'default'}>{row.role}</Badge>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'default'} dot>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => (
        <span className="text-sm text-slate-400">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link to={`/admin/users/${row.id}`}>
            <Button size="sm" variant="ghost" leftIcon={<Edit className="w-3.5 h-3.5" />}>
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="User Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage all user accounts — {users.length} total
          </p>
        </div>
        <Link to="/admin/users/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add User</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        keyExtractor={(row) => row.id}
        emptyMessage="No users found"
        emptyIcon={<Users className="w-10 h-10" />}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete{' '}
          <strong className="text-slate-900 dark:text-slate-100">{deleteTarget?.username}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
