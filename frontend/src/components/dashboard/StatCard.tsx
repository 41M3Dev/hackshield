import React from 'react';
import Card from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconBg = 'bg-primary-500/10',
  subtitle,
}) => {
  const changeColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-slate-500',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {value}
          </p>
          {(change || subtitle) && (
            <p className={`text-xs mt-1 font-medium ${changeColors[changeType]}`}>
              {change || subtitle}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
      {/* Subtle gradient decoration */}
      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
        <div className="w-full h-full bg-gradient-radial from-primary-500 to-transparent rounded-full" />
      </div>
    </Card>
  );
};

export default StatCard;
