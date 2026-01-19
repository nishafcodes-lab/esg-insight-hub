import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'low' | 'medium' | 'high';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  low: {
    iconBg: 'bg-risk-low-bg',
    iconColor: 'text-risk-low',
  },
  medium: {
    iconBg: 'bg-risk-medium-bg',
    iconColor: 'text-risk-medium',
  },
  high: {
    iconBg: 'bg-risk-high-bg',
    iconColor: 'text-risk-high',
  },
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn('text-xs font-medium', trend.positive ? 'text-risk-low' : 'text-risk-high')}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', styles.iconBg)}>
          <Icon className={cn('w-6 h-6', styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
