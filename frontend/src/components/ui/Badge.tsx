import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
};

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  );
};

export const severityBadge = (severity: string) => {
  const map: Record<string, BadgeVariant> = {
    CRITICAL: 'danger',
    HIGH: 'danger',
    MEDIUM: 'warning',
    LOW: 'success',
  };
  return map[severity] || 'default';
};

export const statusBadge = (status: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    PENDING: 'warning',
    RUNNING: 'primary',
    FINISHED: 'success',
    FAILED: 'danger',
    ACTIVE: 'success',
    INACTIVE: 'default',
    SCANNING: 'primary',
  };
  return map[status] || 'default';
};

export default Badge;
