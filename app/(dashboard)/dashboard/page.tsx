'use client';

import { useState, useCallback, useEffect } from 'react';
import { ParameterControl } from '@/components/dashboard/parameter-control';
import { ResultsPanel } from '@/components/dashboard/results-panel';
import { PredictionInput, PredictionResult, DashboardHistoryEntry, computeLandfillMetric } from '@/lib/types';
import { Terminal, History, Download, Printer, AlertTriangle, HelpCircle } from 'lucide-react';
import { getPredictions, addPrediction, seedDemoData } from '@/lib/storage';
import { ReportView } from '@/components/dashboard/report-view';
import { EventLog } from '@/components/ui/event-log';
import { useEventLog } from '@/hooks/use-event-log';
import { useBeep } from '@/hooks/use-beep';
import { PageTour } from '@/components/onboarding/page-tour';
import { DASHBOARD_TOUR } from '@/components/onboarding/tour-configs';

function generateId(): string {
  return `pred-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

const DEFAULT_INPUT: PredictionInput = {
  dayOfWeek: 'Wednesday',
  scheduledMenu: 'Grilled chicken with rice and vegetables',
  expectedAttendance: 350,
  weatherCondition: 'Cloudy',
  temperature: 70,
};

export default function DashboardPage() {
  const [input, setInput] = useState<PredictionInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DashboardHistoryEntry[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [modelId, setModelId] = useState('rf-2026a');
  const [showTour, setShowTour] = useState(false);
  const { logs, addLog, clearLogs } = useEventLog();
  const beep = useBeep();

  useEffect(() => {
    seedDemoData();
    const stored = getPredictions();
    if (stored.length > 0) {
      setHistory(stored);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    addLog('info', 'submitting prediction', `${input.dayOfWeek} | ${input.expectedAttendance} students`);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const data: PredictionResult = await res.json();
      setResult(data);
      beep(880, 100);

      const entry: DashboardHistoryEntry = {
        id: generateId(),
        input: { ...input },
        result: data,
        timestamp: new Date().toISOString(),
      };

      setHistory((prev) => [entry, ...prev]);
      addPrediction(entry);
      addLog('success', 'prediction complete', `${data.predictedWasteKg.toFixed(1)} kg | ${data.metadata.latencyMs}ms`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      addLog('error', 'prediction failed', msg);
    } finally {
      setLoading(false);
    }
  }, [input, addLog, beep]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setError(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !loading) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSubmit, loading]);

  return (
    <>
      <div className="space-y-6 animate-fade-in pb-16 sm:pb-0">
      {showReport && result && (
        <ReportView result={result} input={input} onClose={() => setShowReport(false)} />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-50">Dashboard</h1>
          <p className="text-xs text-emerald-400/60">AI waste prediction engine</p>
        </div>
        <button
          onClick={() => setShowTour(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] border border-emerald-700/40 text-emerald-500 hover:border-emerald-500/60 hover:text-emerald-300 transition-all"
        >
          <HelpCircle className="h-3 w-3" />
          Guide me
        </button>
      </div>

      <div className="border border-emerald-800/30 bg-gradient-to-r from-emerald-950/40 to-gray-950 p-4 sm:p-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-600/40 bg-emerald-900/20">
            <AlertTriangle className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm font-bold text-emerald-200">
              Hong Kong Landfills <span className="text-amber-300">3,600 Tonnes</span> of Food Waste Daily
            </p>
            <p className="text-xs text-emerald-500/80 leading-relaxed">
              That&apos;s over <span className="text-emerald-300">30%</span> of all municipal solid waste — 
              <span className="text-emerald-300"> 446,000 tonnes</span> of CO₂e per year. 
              Every <span className="text-emerald-300">$1 HKD</span> invested in waste reduction saves 
              <span className="text-emerald-300">$7 HKD</span> in disposal and operational costs.
              EcoOS uses AI to predict waste before it happens, enabling precise production adjustments.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-700 shrink-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <span>SYSTEM ONLINE</span>
            <span className="text-emerald-800">|</span>
            <span>LLAMA-3-8B</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <ParameterControl
            dayOfWeek={input.dayOfWeek}
            scheduledMenu={input.scheduledMenu}
            expectedAttendance={input.expectedAttendance}
            weatherCondition={input.weatherCondition}
            temperature={input.temperature ?? 70}
            loading={loading}
            onDayChange={(val) => setInput((p) => ({ ...p, dayOfWeek: val }))}
            onMenuChange={(val) => setInput((p) => ({ ...p, scheduledMenu: val }))}
            onAttendanceChange={(val) => setInput((p) => ({ ...p, expectedAttendance: val }))}
            onWeatherChange={(val) => setInput((p) => ({ ...p, weatherCondition: val }))}
            onTemperatureChange={(val) => setInput((p) => ({ ...p, temperature: val }))}
            modelId={modelId}
            onModelChange={setModelId}
            onSubmit={handleSubmit}
          />

          <ResultsPanel
            result={result}
            loading={loading}
            error={error}
            input={input}
            onDismiss={handleDismissError}
          />

          {result && (() => {
            const annualKg = result.predictedWasteKg * 180;
            const annualCost = annualKg * 4.50;
            const annualCo2 = annualKg * 2.5;
            return (
            <div className="terminal-panel border-emerald-800/20 animate-fade-in">
              <div className="terminal-header flex items-center gap-2">
                <Download className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-600 text-[10px]">Impact Summary</span>
                <button
                  onClick={() => setShowReport(true)}
                  className="ml-auto terminal-btn text-[10px] px-2.5 py-1 h-auto"
                >
                  <Printer className="h-3 w-3" />
                  Report
                </button>
              </div>
              <div className="terminal-content space-y-4">
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                  <div className="border border-emerald-800/30 bg-gray-900 p-3 text-center">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Per Service</p>
                    <p className="text-lg font-bold text-emerald-300 tabular-nums">{result.predictedWasteKg.toFixed(1)} kg</p>
                    <p className="text-[9px] text-emerald-600">±{(result.predictedWasteKg * 0.1 + (result.metadata.inputSnapshot.expectedAttendance / 100) * result.predictedWasteKg * 0.005).toFixed(1)} kg</p>
                  </div>
                  <div className="border border-emerald-800/30 bg-gray-900 p-3 text-center">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Interventions</p>
                    <p className="text-lg font-bold text-emerald-300">{result.actionableInterventions.length}</p>
                  </div>
                  <div className="border border-amber-800/30 bg-gray-900 p-3 text-center">
                    <p className="text-[10px] text-amber-600 uppercase tracking-wider mb-1">Risk Level</p>
                    <p className="text-lg font-bold text-amber-400">MODERATE</p>
                  </div>
                  <div className="border border-emerald-800/30 bg-gray-900 p-3 text-center">
                    <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Menu</p>
                    <p className="text-sm font-bold text-emerald-300 truncate">{result.metadata.inputSnapshot.scheduledMenu.split(' ').slice(0, 3).join(' ')}</p>
                  </div>
                </div>
                <div className="border border-emerald-700/30 bg-emerald-900/20 p-4">
                  <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-3">Annual Projection (180 School Days)</p>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex items-center justify-center border border-emerald-700/40 bg-gray-900">
                        <span className="text-emerald-400 text-xs font-bold">W</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600">Total Waste</p>
                        <p className="text-sm font-bold text-emerald-300 tabular-nums">{(annualKg / 1000).toFixed(1)} <span className="text-[10px] text-emerald-600">tonnes</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex items-center justify-center border border-emerald-700/40 bg-gray-900">
                        <span className="text-amber-400 text-xs font-bold">$</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600">Financial Loss</p>
                        <p className="text-sm font-bold text-amber-400 tabular-nums">${annualCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex items-center justify-center border border-emerald-700/40 bg-gray-900">
                        <span className="text-red-400 text-xs font-bold">CO₂</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-emerald-600">Carbon Footprint</p>
                        <p className="text-sm font-bold text-red-400 tabular-nums">{(annualCo2 / 1000).toFixed(1)} <span className="text-[10px] text-emerald-600">t CO₂e</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(() => {
                    const m = computeLandfillMetric(annualKg);
                    return <>
                      <div className="border border-emerald-800/30 bg-gray-900/50 p-3 text-center">
                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Garbage Trucks</p>
                        <p className="text-lg font-bold text-emerald-300 tabular-nums">{m.trucks.toFixed(1)}</p>
                        <p className="text-[9px] text-emerald-700">10t trucks of waste/year</p>
                      </div>
                      <div className="border border-emerald-800/30 bg-gray-900/50 p-3 text-center">
                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Trees Absorbing</p>
                        <p className="text-lg font-bold text-emerald-300 tabular-nums">{m.trees.toLocaleString()}</p>
                        <p className="text-[9px] text-emerald-700">trees needed/year for CO₂</p>
                      </div>
                      <div className="border border-emerald-800/30 bg-gray-900/50 p-3 text-center">
                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Homes Powered</p>
                        <p className="text-lg font-bold text-emerald-300 tabular-nums">{m.homes.toLocaleString()}</p>
                        <p className="text-[9px] text-emerald-700">homes' energy equivalent</p>
                      </div>
                    </>;
                  })()}
                </div>
              </div>
            </div>
            );
          })()}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="terminal-panel">
            <div className="terminal-header flex items-center gap-2">
              <History className="h-3.5 w-3.5 text-emerald-500" />
              <span>Prediction History</span>
              {history.length > 0 && (
                <span className="ml-auto text-[10px] text-emerald-700">{history.length} entries</span>
              )}
            </div>
            <div className="terminal-content">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-emerald-700">
                    <span className="text-emerald-600">$</span> no predictions yet
                  </p>
                  <p className="text-[10px] text-emerald-800 mt-1">run a prediction to see history</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {history.map((entry, i) => (
                    <div
                      key={entry.id}
                      onClick={() => {
                        setInput(entry.input);
                        setResult(entry.result);
                        setError(null);
                      }}
                      className="border border-emerald-800/20 bg-gray-900/50 p-3 cursor-pointer
                                 hover:border-emerald-700/40 hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-emerald-400 font-mono">
                          {entry.result.predictedWasteKg.toFixed(1)} kg
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-600 flex items-center gap-2">
                        <span>{entry.input.dayOfWeek}</span>
                        <span>|</span>
                        <span className="truncate max-w-[120px]">{entry.input.scheduledMenu}</span>
                        <span>|</span>
                        <span>{entry.input.expectedAttendance}</span>
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {entry.result.actionableInterventions.slice(0, 2).map((_, idx) => (
                          <span key={idx} className="text-[8px] text-emerald-700 border border-emerald-800/30 px-1">
                            action {idx + 1}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <EventLog logs={logs} onClear={clearLogs} />

          <div className="flex items-center justify-between text-[10px] text-emerald-800">
            <span>EcoOS Core v2.5.0</span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-700" />
              edge runtime
            </span>
          </div>
        </div>
      </div>
    </div>
      {showTour && (
        <PageTour steps={DASHBOARD_TOUR} pageId="dashboard" onComplete={() => setShowTour(false)} />
      )}
    </>
  );
}
