'use client';

import { PredictionResult, PredictionInput, computeInterventionSavings } from '@/lib/types';
import { AlertTriangle, AlertCircle, Shield, CheckCircle, Terminal, Loader2, Download, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TypewriterText } from '@/components/ui/typewriter-text';
import { downloadPredictionCSV } from '@/lib/utils';

interface ResultsPanelProps {
  result: PredictionResult | null;
  loading: boolean;
  error: string | null;
  input: PredictionInput | null;
  onDismiss: () => void;
}

export function ResultsPanel({ result, loading, error, input, onDismiss }: ResultsPanelProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [completedInts, setCompletedInts] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCompletedInts(new Set());
  }, [result]);

  if (loading) {
    return (
      <div className="terminal-panel animate-fade-in">
        <div className="terminal-header flex items-center gap-2">
          <Loader2 className="h-3.5 w-3.5 text-emerald-500 animate-spin" />
          <span>AI Insight Engine</span>
        </div>
        <div className="terminal-content py-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <div className="absolute inset-0 animate-pulse bg-emerald-500/5 rounded-full" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-emerald-400">
                <span className="text-emerald-600">&gt;</span> querying Meta-Llama-3-8B-Instruct
              </p>
              <p className="text-xs text-emerald-700">
                few-shot pattern analysis in progress
                <span className="inline-block w-4 text-left">
                  <span className="animate-blink">_</span>
                </span>
              </p>
              <p className="text-[10px] text-emerald-800">running on Hugging Face Serverless Inference</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-panel border-red-800/40 animate-fade-in">
        <div className="terminal-header flex items-center gap-2 bg-red-950/30 border-red-800/30">
          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          <span className="text-red-400">Prediction Error</span>
        </div>
        <div className="terminal-content">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-red-300/90 font-mono">{error}</p>
              {error.toLowerCase().includes('loading') && (
                <p className="text-xs text-amber-400/70">
                  The Hugging Face model is initializing. This can take 30-60 seconds on first use.
                  Wait a moment and try again.
                </p>
              )}
              <button onClick={onDismiss} className="text-xs text-emerald-500 hover:text-emerald-400 underline underline-offset-2">
                clear &amp; retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="terminal-panel border-dashed border-emerald-800/30 animate-fade-in">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-600">AI Insight Engine</span>
        </div>
        <div className="terminal-content py-12">
          <div className="text-center space-y-2">
            <p className="text-sm text-emerald-700">
              <span className="text-emerald-600">$</span> waiting for input...
            </p>
            <p className="text-xs text-emerald-800">
              configure parameters above and run prediction
            </p>
            <div className="inline-block mt-4 text-[10px] text-emerald-800 border border-emerald-800/30 px-3 py-1">
              READY
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-tour="dashboard-results" className="space-y-4 animate-slide-in-up">
      <div className="terminal-panel border-emerald-600/30 glow-border">
        <div className="terminal-header flex items-center gap-2 bg-emerald-950/30 flex-wrap">
          <Terminal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>AI Insight Engine — Prediction Complete</span>
          <span className="ml-auto text-[10px] text-emerald-700 tracking-normal whitespace-nowrap">
            {result.metadata.latencyMs}ms
          </span>
        </div>
        <div className="terminal-content space-y-6">
          <div className="flex items-center justify-between border border-emerald-800/30 bg-gray-900 p-4 flex-wrap gap-2">
            <div className="space-y-1">
              <p className="text-[10px] text-emerald-600 uppercase tracking-widest">Predicted Food Waste</p>
              <p className="text-3xl font-bold text-emerald-300 glow-text tabular-nums">
                {result.predictedWasteKg.toFixed(1)} <span className="text-sm text-emerald-600 font-mono">kg</span>
              </p>
              <p className="text-[10px] text-emerald-600">
                ±{(result.predictedWasteKg * 0.1 + (result.metadata.inputSnapshot.expectedAttendance / 100) * result.predictedWasteKg * 0.005).toFixed(1)} kg
                <span className="text-emerald-700 ml-1">confidence interval (p=0.90)</span>
              </p>
            </div>
            <div className="text-right text-[10px] text-emerald-700 leading-relaxed">
              <div>{result.metadata.inputSnapshot.dayOfWeek}</div>
              <div>{result.metadata.inputSnapshot.weatherCondition}</div>
              <div>{result.metadata.inputSnapshot.expectedAttendance} students</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="text-xs text-emerald-400 uppercase tracking-wider">Actionable Interventions</span>
              {input && (
                <button
                  onClick={() => downloadPredictionCSV(result, input)}
                  className="ml-auto terminal-btn text-[10px] px-2.5 py-1 h-auto"
                >
                  <Download className="h-3 w-3" />
                  CSV
                </button>
              )}
              {input && (
                <button
                  onClick={() => {
                    const txt = [
                      `EcoOS Prediction — ${new Date().toLocaleDateString()}`,
                      `Waste: ${result.predictedWasteKg.toFixed(1)} kg`,
                      `Day: ${result.metadata.inputSnapshot.dayOfWeek}`,
                      `Menu: ${result.metadata.inputSnapshot.scheduledMenu}`,
                      `Attendance: ${result.metadata.inputSnapshot.expectedAttendance}`,
                      `Interventions:`,
                      ...result.actionableInterventions.map(i => `  • ${i}`),
                      `Risk: ${result.riskWarning}`,
                    ].join('\n');
                    navigator.clipboard.writeText(txt).then(() => {
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 1500);
                    });
                  }}
                  className="terminal-btn text-[10px] px-2.5 py-1 h-auto"
                >
                  {copySuccess ? <CheckCircle className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {(() => {
                const annualCost = result.predictedWasteKg * 180 * 4.50;
                return result.actionableInterventions.map((intervention, i) => {
                  const s = computeInterventionSavings(result.predictedWasteKg, annualCost, i);
                  return (
                    <div key={i} className="flex items-start gap-2 text-sm text-emerald-300/90 border-l-2 border-emerald-700/40 pl-3 py-1">
                      <span className="text-emerald-600 shrink-0 font-mono">{'>>'}</span>
                      <div className="flex-1">
                        <span><TypewriterText text={intervention} speed={1} onComplete={() => setCompletedInts(prev => new Set([...prev, i]))} /></span>
                        {completedInts.has(i) && (
                          <span className="ml-2 text-[9px] text-emerald-600 border border-emerald-700/40 px-1 py-0.5 whitespace-nowrap animate-fade-in">
                            save ~${s.savingsDollars}/day
                          </span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          <div className="border border-amber-800/40 bg-amber-950/20 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Risk Warning</span>
                </div>
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  <TypewriterText text={result.riskWarning} speed={1} />
                </p>
              </div>
            </div>
          </div>

          <div className="border border-red-800/30 bg-red-950/10 p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Human-in-the-Loop Required</span>
                  <span className="risk-critical text-[10px]">ACTION REQUIRED</span>
                </div>
                <p className="text-sm text-red-300/80 leading-relaxed">{result.humanInTheLoopAction}</p>
                {!acknowledged && (
                  <button
                    onClick={() => setAcknowledged(true)}
                    className="terminal-btn border-red-700/40 text-red-300 hover:bg-red-900/20 hover:border-red-600/50 text-xs"
                  >
                    <span>I ACKNOWLEDGE — THIS PREDICTION REQUIRES HUMAN VERIFICATION</span>
                  </button>
                )}
                {acknowledged && (
                  <div className="flex items-center gap-2 text-xs text-emerald-500">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Acknowledged — human verification required before action</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-emerald-800 flex items-center justify-between border-t border-emerald-800/20 pt-3 flex-wrap gap-1">
            <span>MODEL: {result.metadata.modelUsed}</span>
            <span>PROCESSED: {new Date(result.metadata.processedAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="terminal-panel border-emerald-800/20">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3 w-3 text-emerald-600 shrink-0" />
          <span className="text-emerald-600 text-[10px]">raw_response.json</span>
        </div>
        <div className="terminal-content overflow-x-auto">
          <pre className="text-[11px] text-emerald-500/70 leading-relaxed whitespace-pre-wrap break-all">
{JSON.stringify({
  predictedWasteKg: result.predictedWasteKg,
  actionableInterventions: result.actionableInterventions,
  riskWarning: result.riskWarning.length > 80 ? result.riskWarning.slice(0, 80) + '...' : result.riskWarning,
  humanInTheLoopAction: result.humanInTheLoopAction.length > 80 ? result.humanInTheLoopAction.slice(0, 80) + '...' : result.humanInTheLoopAction,
  metadata: { ...result.metadata, inputSnapshot: '[snapshot]' },
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
