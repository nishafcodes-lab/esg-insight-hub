import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/supplier';

interface ESGScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', text: 'text-sm', label: 'text-xs' },
  md: { container: 'w-20 h-20', text: 'text-xl', label: 'text-xs' },
  lg: { container: 'w-28 h-28', text: 'text-2xl', label: 'text-sm' },
  xl: { container: 'w-40 h-40', text: 'text-4xl', label: 'text-base' },
};

function getScoreColor(score: number): string {
  if (score >= 70) return 'hsl(142, 71%, 45%)'; // Low risk - green
  if (score >= 40) return 'hsl(38, 92%, 50%)'; // Medium risk - amber
  return 'hsl(0, 84%, 60%)'; // High risk - red
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return 'Low';
  if (score >= 40) return 'Medium';
  return 'High';
}

export function ESGScoreCircle({ score, size = 'md', showLabel = true }: ESGScoreCircleProps) {
  const config = sizeConfig[size];
  const color = getScoreColor(score);
  const riskLevel = getRiskLevel(score);
  
  // Calculate the stroke dasharray for the progress ring
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn('relative flex items-center justify-center', config.container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', config.text)}>{score}</span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('font-medium text-muted-foreground', config.label)}>
          {riskLevel} Risk
        </span>
      )}
    </div>
  );
}
