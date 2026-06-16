'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingDots } from '@/components/ui/loading-dots';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { TriageResult, ActionItem } from '@/lib/types';
import {
  Search,
  Zap,
  MapPin,
  AlertTriangle,
  TrendingDown,
  ArrowRight,
  Lightbulb,
  Leaf,
  CheckCircle2,
  Loader2,
  Target,
} from 'lucide-react';

const EXAMPLE_TEXTS = [
  'The school cafeteria throws away about 40 pounds of food every single day after lunch. Mostly untouched fruit and milk cartons.',
  'Our hospital kitchen preps too much food — 60kg of sealed sandwiches and yogurt goes in the bin every evening.',
  'Office building goes through 300+ disposable coffee cups daily and catering meetings always leave half the food uneaten.',
];

const ACTION_EFFORT_COLORS: Record<string, 'success' | 'info' | 'medium'> = {
  quick: 'success',
  moderate: 'info',
  significant: 'medium',
};

const PRIORITY_VARIANTS: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
  critical: 'critical',
  high: 'high',
  medium: 'medium',
  low: 'low',
};

export default function TriagePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(text: string) {
    const textToAnalyze = text || input;
    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16 sm:pb-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-emerald-50">Waste Triage</h1>
          <p className="text-sm text-emerald-400/60">
            Describe a waste situation for AI-powered analysis and recommendations
          </p>
        </div>
        <StatusIndicator
          status="online"
          label="Hugging Face LLM"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              label="Describe the waste situation"
              placeholder="e.g., Our school cafeteria throws away about 40 pounds of food every day after lunch. Mostly untouched fruit and milk cartons..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              maxLength={10000}
            />

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_TEXTS.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(text)}
                    className="rounded-full border border-emerald-800/30 px-3 py-1 text-xs text-emerald-400/60 hover:text-emerald-300 hover:border-emerald-600/50 transition-colors"
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => handleSubmit(input)}
                disabled={!input.trim() || loading}
                loading={loading}
                icon={<Search className="h-4 w-4" />}
              >
                {loading ? 'Analyzing' : 'Analyze Waste Stream'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-emerald-50">
                  Analyzing waste stream with LLM
                </p>
                <p className="text-xs text-emerald-400/50">
                  Processing through Meta-Llama-3-8B-Instruct
                  <LoadingDots />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-800/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-300">Analysis Error</p>
                <p className="text-xs text-red-400/70">{error}</p>
                <Button variant="secondary" size="sm" onClick={() => handleSubmit(input)} className="mt-2">
                  Retry Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-slide-in-up">
          <Card className="border-emerald-700/30 bg-gradient-to-r from-emerald-950 via-emerald-900/30 to-emerald-950">
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20">
                  <Target className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-emerald-50">Environmental Intent</h3>
                    <Badge variant="success">{result.environmentalIntent.category}</Badge>
                    <Badge variant="outline">
                      {Math.round(result.environmentalIntent.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-300/80">
                    {result.environmentalIntent.subcategory}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {result.locations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-emerald-50">Detected Locations</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.locations.map((loc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-emerald-50">{loc.name}</p>
                        <p className="text-xs text-emerald-400/50 capitalize">{loc.type}</p>
                      </div>
                      <Badge variant="outline">{loc.estimatedScale}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {result.recommendation && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-emerald-50">AI Recommendation</h2>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-emerald-50 font-medium">
                    {result.recommendation.summary}
                  </p>
                  <div className="space-y-1">
                    {result.recommendation.reasoning.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-emerald-400/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {result.actions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-emerald-50">Action Items</h2>
                  </div>
                  <Badge variant="outline">{result.actions.length} actions</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.actions.map((action) => (
                  <div
                    key={action.id}
                    className="rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-4 transition-colors hover:bg-emerald-900/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-emerald-50">
                            {action.description}
                          </span>
                          <Badge variant={PRIORITY_VARIANTS[action.priority] || 'medium'}>
                            {action.priority}
                          </Badge>
                          <Badge variant={ACTION_EFFORT_COLORS[action.effort] || 'info'}>
                            {action.effort}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-2 text-xs text-emerald-400/60">
                        <Leaf className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{action.environmentalImpact}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-emerald-400/60">
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{action.estimatedSavings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {result.recommendation?.nextSteps && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-emerald-50">Next Steps</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {result.recommendation.nextSteps.map((step, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3 text-center"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold mx-auto mb-2">
                        {i + 1}
                      </div>
                      <p className="text-xs text-emerald-300/80">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {result.recommendation?.impactProjection && (
            <Card className="border-emerald-700/30 bg-gradient-to-r from-emerald-950 via-emerald-900/30 to-emerald-950">
              <CardContent className="py-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-emerald-50">Projected Impact</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-emerald-900/30 p-3 text-center">
                    <p className="text-xs text-emerald-400/50 mb-1">Waste Reduction</p>
                    <p className="text-sm font-bold text-emerald-300">
                      {result.recommendation.impactProjection.wasteReduction}
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-900/30 p-3 text-center">
                    <p className="text-xs text-emerald-400/50 mb-1">Cost Savings</p>
                    <p className="text-sm font-bold text-emerald-300">
                      {result.recommendation.impactProjection.costSavings}
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-900/30 p-3 text-center">
                    <p className="text-xs text-emerald-400/50 mb-1">CO₂ Reduction</p>
                    <p className="text-sm font-bold text-emerald-300">
                      {result.recommendation.impactProjection.co2Reduction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between text-xs text-emerald-500/40">
            <span>
              Processed in {result.latencyMs}ms via {result.modelUsed}
            </span>
            <span>EcoOS Core v2.4.1</span>
          </div>
        </div>
      )}
    </div>
  );
}
