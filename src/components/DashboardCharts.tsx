import { Supplier, DashboardStats } from '@/types/supplier';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardChartsProps {
  suppliers: Supplier[];
  stats: DashboardStats;
}

const RISK_COLORS = {
  Low: 'hsl(142, 71%, 45%)',
  Medium: 'hsl(38, 92%, 50%)',
  High: 'hsl(0, 84%, 60%)',
};

export function DashboardCharts({ suppliers, stats }: DashboardChartsProps) {
  const pieData = [
    { name: 'Low Risk', value: stats.lowRisk, color: RISK_COLORS.Low },
    { name: 'Medium Risk', value: stats.mediumRisk, color: RISK_COLORS.Medium },
    { name: 'High Risk', value: stats.highRisk, color: RISK_COLORS.High },
  ].filter(d => d.value > 0);

  const barData = suppliers
    .slice(0, 8)
    .map(s => ({
      name: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
      score: s.esgScore,
      fill: RISK_COLORS[s.riskLevel],
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].name}: <span className="font-semibold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Distribution Pie Chart */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ESG Score Bar Chart */}
      <div className="card-elevated p-6">
        <h3 className="text-lg font-semibold mb-4">ESG Scores by Supplier</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
              />
              <Bar 
                dataKey="score" 
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
