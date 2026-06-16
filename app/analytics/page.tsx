'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/ui/metric-card';
import { formatCurrency, formatCo2, formatWeight } from '@/lib/utils';
import { getPredictions } from '@/lib/storage';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import { DashboardHistoryEntry } from '@/lib/types';

function computeAnalytics(history: DashboardHistoryEntry[]) {
  if (history.length === 0) {
    return null;
  }

  const totalWaste = history.reduce((sum, h) => sum + h.result.predictedWasteKg, 0);
  const avgWaste = totalWaste / history.length;
  const latest = history[0].result.predictedWasteKg;
  const prev = history.length > 1 ? history[1].result.predictedWasteKg : latest;
  const wasteTrend = prev !== 0 ? ((latest - prev) / prev) * 100 : 0;

  const menuCounts: Record<string, { waste: number; count: number }> = {};
  history.forEach((h) => {
    const menu = h.input.scheduledMenu.split(' ').slice(0, 2).join(' ');
    if (!menuCounts[menu]) menuCounts[menu] = { waste: 0, count: 0 };
    menuCounts[menu].waste += h.result.predictedWasteKg;
    menuCounts[menu].count += 1;
  });
  const topItems = Object.entries(menuCounts)
    .map(([name, data]) => ({
      name,
      waste: data.waste,
      percentage: Math.round((data.waste / totalWaste) * 100),
      avgPerRun: data.waste / data.count,
    }))
    .sort((a, b) => b.waste - a.waste)
    .slice(0, 6);

  const maxTopWaste = topItems.length > 0 ? topItems[0].waste : 1;

  const weeklyLabels = ['Week 4', 'Week 3', 'Week 2', 'Week 1'];
  const weeklyData = weeklyLabels.map((label, i) => {
    const weekIndex = history.length - 1 - i;
    const entry = history[weekIndex] || history[history.length - 1];
    return {
      label,
      waste: entry.result.predictedWasteKg * 100,
      cost: entry.result.predictedWasteKg * 450,
      co2: entry.result.predictedWasteKg * 250,
    };
  }).reverse();
  const maxWaste = Math.max(...weeklyData.map((d) => d.waste));

  const dayCounts: Record<string, number> = {};
  history.forEach((h) => {
    const day = h.input.dayOfWeek;
    dayCounts[day] = (dayCounts[day] || 0) + h.result.predictedWasteKg;
  });
  const worstDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];

  const insights = [];
  if (worstDay) {
    insights.push({
      title: `${worstDay[0]} Spike Detected`,
      description: `Waste volume is highest on ${worstDay[0]}s. Consider reducing production or adjusting menu rotation.`,
      impact: `Potential savings: $${Math.round(worstDay[1] * 4.5)}/quarter`,
    });
  }
  const topItem = topItems[0];
  if (topItem) {
    insights.push({
      title: `${topItem.name} Optimization Needed`,
      description: `${topItem.name} accounts for ${topItem.percentage}% of tracked waste. Implement pre-order or portion control.`,
      impact: `Potential savings: $${Math.round(topItem.waste * 4.5)}/quarter`,
    });
  }
  if (history.length >= 3) {
    insights.push({
      title: 'Trend Direction',
      description: wasteTrend < 0
        ? `Waste is trending down ${Math.abs(wasteTrend).toFixed(0)}% — current interventions are working.`
        : `Waste is trending up ${wasteTrend.toFixed(0)}% — review portion sizes and menu planning.`,
      impact: wasteTrend < 0
        ? `Saving ~$${Math.round(Math.abs(wasteTrend) * 100)}/month`
        : `Losing ~$${Math.round(wasteTrend * 100)}/month`,
    });
  }

  return {
    totalPredictions: history.length,
    totalWaste,
    avgWaste,
    wasteTrend,
    weeklyData,
    maxWaste,
    topItems,
    maxTopWaste,
    latest,
    insights,
  };
}

export default function AnalyticsPage() {
  const [history, setHistory] = useState<DashboardHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getPredictions());
  }, []);

  const analytics = computeAnalytics(history);

  if (!analytics) {
    return (
      <div className="space-y-8 animate-fade-in pb-16 sm:pb-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-emerald-50">Analytics</h1>
            <p className="text-sm text-emerald-400/60">
              Deep dive into waste patterns and environmental impact
            </p>
          </div>
          <Badge variant="outline">No data</Badge>
        </div>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <BarChart3 className="h-12 w-12 text-emerald-700/50" />
              <div className="space-y-1">
                <p className="text-base font-medium text-emerald-50">No prediction data yet</p>
                <p className="text-sm text-emerald-400/50 max-w-md">
                  Run predictions from the Dashboard to see analytics and trends here.
                  Each prediction will populate this page with real data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 sm:pb-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-emerald-50">Analytics</h1>
          <p className="text-sm text-emerald-400/60">
            Deep dive into waste patterns and environmental impact
          </p>
        </div>
        <Badge variant="success">{analytics.totalPredictions} predictions</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Average Waste"
          value={`${analytics.avgWaste.toFixed(1)} kg`}
          sublabel="Per service period"
          trend={{ value: Math.abs(analytics.wasteTrend), positive: analytics.wasteTrend < 0 }}
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <MetricCard
          label="Latest Prediction"
          value={`${analytics.latest.toFixed(1)} kg`}
          sublabel="Most recent run"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          label="Total Analyzed"
          value={formatWeight(analytics.totalWaste)}
          sublabel="Across all predictions"
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-emerald-50">Weekly Performance</h2>
                <p className="text-xs text-emerald-400/50">Recent prediction trend</p>
              </div>
              <BarChart3 className="h-4 w-4 text-emerald-500/40" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics.weeklyData.map((week, i) => (
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
                      style={{ width: `${(week.waste / analytics.maxWaste) * 100}%` }}
                    />
                  </div>
                  {i < analytics.weeklyData.length - 1 && (
                    <div className="flex justify-end">
                      <span className="text-[10px] text-emerald-500/40">
                        {week.waste > analytics.weeklyData[i + 1].waste
                          ? `↓ ${Math.round(((week.waste - analytics.weeklyData[i + 1].waste) / week.waste) * 100)}%`
                          : `↑ ${Math.round(((analytics.weeklyData[i + 1].waste - week.waste) / week.waste) * 100)}%`}
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
                <p className="text-xs text-emerald-400/50">By tracked volume</p>
              </div>
              <Clock className="h-4 w-4 text-emerald-500/40" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.topItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-emerald-50 min-w-[90px] truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-emerald-400/50 whitespace-nowrap">{item.waste.toFixed(1)} kg</div>
                  <div className="h-1.5 w-16 rounded-full bg-emerald-900/50 overflow-hidden flex-shrink-0">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(item.waste / analytics.maxTopWaste) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-[10px] text-emerald-600 ml-2">{item.percentage}%</div>
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
              <p className="text-xs text-emerald-400/50">Generated from your prediction data</p>
            </div>
            <Badge variant="info">{analytics.totalPredictions} data points</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analytics.insights.map((insight, i) => (
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
