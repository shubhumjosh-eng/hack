'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/ui/metric-card';
import { formatCurrency, formatCo2, formatWeight } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const weeklyData = [
  { label: 'Week 1', waste: 2240, cost: 10080, co2: 5600 },
  { label: 'Week 2', waste: 2100, cost: 9450, co2: 5250 },
  { label: 'Week 3', waste: 1980, cost: 8910, co2: 4950 },
  { label: 'Week 4', waste: 1850, cost: 8325, co2: 4625 },
];

const topItems = [
  { name: 'Salad Bar', waste: 420, percentage: 28, trend: 'up' as const },
  { name: 'Pasta Station', waste: 340, percentage: 22, trend: 'down' as const },
  { name: 'Grilled Chicken', waste: 280, percentage: 18, trend: 'down' as const },
  { name: 'Sandwich Line', waste: 250, percentage: 16, trend: 'flat' as const },
  { name: 'Soup of Day', waste: 230, percentage: 15, trend: 'up' as const },
  { name: 'Pizza', waste: 190, percentage: 12, trend: 'down' as const },
];

const maxWaste = Math.max(...weeklyData.map((d) => d.waste));
const trendData = {
  waste: -12.4,
  cost: -8.2,
  co2: -15.1,
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-emerald-50">Analytics</h1>
          <p className="text-sm text-emerald-400/60">
            Deep dive into waste patterns and environmental impact
          </p>
        </div>
        <Badge variant="success">Auto-refreshing</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Waste Trend"
          value={`${Math.abs(trendData.waste)}%`}
          sublabel="Quarter-over-quarter"
          trend={{ value: Math.abs(trendData.waste), positive: trendData.waste < 0 }}
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <MetricCard
          label="Cost Trend"
          value={`${Math.abs(trendData.cost)}%`}
          sublabel="Quarter-over-quarter"
          trend={{ value: Math.abs(trendData.cost), positive: trendData.cost < 0 }}
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <MetricCard
          label="CO₂ Trend"
          value={`${Math.abs(trendData.co2)}%`}
          sublabel="Quarter-over-quarter"
          trend={{ value: Math.abs(trendData.co2), positive: trendData.co2 < 0 }}
          icon={<TrendingDown className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-emerald-50">Weekly Performance</h2>
                <p className="text-xs text-emerald-400/50">4-week waste reduction trend</p>
              </div>
              <BarChart3 className="h-4 w-4 text-emerald-500/40" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {weeklyData.map((week, i) => (
                <div key={week.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-300/80 font-medium">{week.label}</span>
                    <div className="flex items-center gap-3 text-emerald-400/50">
                      <span>{formatWeight(week.waste)}</span>
                      <span>{formatCurrency(week.cost)}</span>
                      <span>{formatCo2(week.co2)}</span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-emerald-900/50 overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${(week.waste / maxWaste) * 100}%` }}
                    />
                  </div>
                  {i < weeklyData.length - 1 && (
                    <div className="flex justify-end">
                      <span className="text-[10px] text-emerald-500/40">
                        {week.waste > weeklyData[i + 1].waste
                          ? `↓ ${Math.round(((week.waste - weeklyData[i + 1].waste) / week.waste) * 100)}%`
                          : `↑ ${Math.round(((weeklyData[i + 1].waste - week.waste) / week.waste) * 100)}%`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-emerald-50">Top Waste Items</h2>
                <p className="text-xs text-emerald-400/50">By volume (kg)</p>
              </div>
              <Clock className="h-4 w-4 text-emerald-500/40" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-emerald-50 min-w-[110px]">
                    {item.name}
                  </div>
                  <div className="text-xs text-emerald-400/50">{item.waste} kg</div>
                  <div className="h-1.5 w-16 rounded-full bg-emerald-900/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  {item.trend === 'up' ? (
                    <ArrowUp className="h-3.5 w-3.5 text-red-400" />
                  ) : item.trend === 'down' ? (
                    <ArrowDown className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-xs text-emerald-500/40">—</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-emerald-50">Insights</h2>
              <p className="text-xs text-emerald-400/50">AI-generated observations</p>
            </div>
            <Badge variant="info">Updated daily</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Friday Spike Detected',
                description:
                  'Waste volume increases 15% on Fridays. Consider reducing production by 10% on the last day of the week.',
                impact: 'Potential savings: $1,200/quarter',
              },
              {
                title: 'Salad Bar Optimization',
                description:
                  'Salad bar accounts for 28% of total waste. Implement a pre-order system to reduce overproduction.',
                impact: 'Potential savings: $2,400/quarter',
              },
              {
                title: 'Weather Correlation',
                description:
                  'Rainy days show 18% higher waste. Adjust preparation based on weather forecasts.',
                impact: 'Potential savings: $800/quarter',
              },
            ].map((insight, i) => (
              <div
                key={i}
                className="rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600/20">
                    <span className="text-[10px] font-bold text-emerald-400">{i + 1}</span>
                  </div>
                  <h3 className="text-sm font-medium text-emerald-50">{insight.title}</h3>
                </div>
                <p className="text-xs text-emerald-400/60">{insight.description}</p>
                <p className="text-xs text-emerald-400 font-medium">{insight.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
