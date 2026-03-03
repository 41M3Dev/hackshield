import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700/60 ${className}`}
    aria-hidden="true"
  />
);

export const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-1/2 mb-2" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const SkeletonRow: React.FC = () => (
  <tr>
    {[1, 2, 3, 4, 5].map((i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
