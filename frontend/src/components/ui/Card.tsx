import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glass?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  glass = false,
}) => {
  return (
    <div
      className={`
        rounded-xl border
        ${glass
          ? 'bg-white/5 dark:bg-slate-800/40 backdrop-blur-sm border-white/10 dark:border-slate-700/50'
          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60'
        }
        ${hover ? 'transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-base font-semibold text-slate-900 dark:text-slate-100 ${className}`}>
    {children}
  </h3>
);

export default Card;
