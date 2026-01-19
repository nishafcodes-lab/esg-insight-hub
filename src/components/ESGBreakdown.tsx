import { ESGBreakdown as ESGBreakdownType } from '@/types/supplier';
import { Check, X, Leaf, Users, Shield, Factory, Heart, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ESGBreakdownProps {
  breakdown: ESGBreakdownType;
  showPoints?: boolean;
}

const breakdownItems = [
  {
    key: 'environmentalPolicy' as keyof ESGBreakdownType,
    label: 'Environmental Policy',
    description: 'Documented environmental management policy',
    icon: Leaf,
    points: 15,
    category: 'Environmental',
  },
  {
    key: 'carbonEmissions' as keyof ESGBreakdownType,
    label: 'Carbon Emissions Tracking',
    description: 'Monitors and reports carbon footprint',
    icon: Factory,
    points: 20,
    category: 'Environmental',
  },
  {
    key: 'iso14001' as keyof ESGBreakdownType,
    label: 'ISO 14001 Certification',
    description: 'Environmental management system certified',
    icon: Shield,
    points: 15,
    category: 'Environmental',
  },
  {
    key: 'labourRights' as keyof ESGBreakdownType,
    label: 'Labour & Human Rights',
    description: 'Compliant with ILO standards',
    icon: Users,
    points: 20,
    category: 'Social',
  },
  {
    key: 'healthSafety' as keyof ESGBreakdownType,
    label: 'Health & Safety',
    description: 'Workplace safety protocols in place',
    icon: Heart,
    points: 15,
    category: 'Social',
  },
  {
    key: 'antiCorruption' as keyof ESGBreakdownType,
    label: 'Anti-Corruption Policy',
    description: 'Anti-bribery and ethics policies',
    icon: Scale,
    points: 15,
    category: 'Governance',
  },
];

export function ESGBreakdown({ breakdown, showPoints = true }: ESGBreakdownProps) {
  const totalPoints = breakdownItems.reduce((acc, item) => {
    return acc + (breakdown[item.key] ? item.points : 0);
  }, 0);

  const groupedItems = {
    Environmental: breakdownItems.filter(item => item.category === 'Environmental'),
    Social: breakdownItems.filter(item => item.category === 'Social'),
    Governance: breakdownItems.filter(item => item.category === 'Governance'),
  };

  const categoryColors = {
    Environmental: 'text-esg-environmental',
    Social: 'text-esg-social',
    Governance: 'text-esg-governance',
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="space-y-2">
          <h4 className={cn('text-sm font-semibold uppercase tracking-wider', categoryColors[category as keyof typeof categoryColors])}>
            {category}
          </h4>
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const passed = breakdown[item.key];
              
              return (
                <div key={item.key} className="esg-item">
                  <div className="flex items-center gap-3">
                    <div className={cn('esg-item-check', passed ? 'passed' : 'failed')}>
                      {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  {showPoints && (
                    <span className={cn(
                      'text-sm font-medium',
                      passed ? 'text-risk-low' : 'text-muted-foreground line-through'
                    )}>
                      +{item.points} pts
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {showPoints && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total ESG Score</span>
            <span className="text-2xl font-bold">{totalPoints} / 100</span>
          </div>
        </div>
      )}
    </div>
  );
}
