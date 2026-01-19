import { RiskLevel } from '@/types/supplier';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const riskConfig = {
  Low: {
    className: 'badge-risk-low',
    icon: CheckCircle,
    label: 'Low Risk',
  },
  Medium: {
    className: 'badge-risk-medium',
    icon: AlertCircle,
    label: 'Medium Risk',
  },
  High: {
    className: 'badge-risk-high',
    icon: AlertTriangle,
    label: 'High Risk',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export function RiskBadge({ level, showIcon = true, size = 'md' }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span className={cn(config.className, sizeClasses[size])}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
}
