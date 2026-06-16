'use client';

import { useEffect, useRef } from 'react';
import { PredictionResult, PredictionInput } from '@/lib/types';
import { X } from 'lucide-react';

interface ReportViewProps {
  result: PredictionResult;
  input: PredictionInput;
  onClose: () => void;
}

export function ReportView({ result, input, onClose }: ReportViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  const annualKg = result.predictedWasteKg * 180;
  const annualCost = annualKg * 4.50;
  const annualCo2 = annualKg * 2.5;

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-800/20 bg-gray-950 px-4 py-2 print:hidden">
        <span className="text-xs text-emerald-500 font-mono">Report Preview — press Ctrl+P or Cmd+P to save as PDF</span>
        <button onClick={onClose} className="text-emerald-600 hover:text-emerald-400 flex items-center gap-1 text-xs">
          <X className="h-3.5 w-3.5" /> Close
        </button>
      </div>

      <div ref={ref} className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8 text-emerald-300 font-mono">
        <div className="border border-emerald-700/40 p-6 text-center">
          <p className="text-[10px] text-emerald-600 uppercase tracking-[0.3em]">EcoOS Core v2.5.0</p>
          <h1 className="text-2xl font-bold text-emerald-200 mt-2">Food Waste Prediction Report</h1>
          <p className="text-xs text-emerald-600 mt-1">USAII Global AI Hackathon 2026 — Direction A: Food Waste Rescue Radar</p>
          <p className="text-[10px] text-emerald-700 mt-4">Generated: {new Date(result.metadata.processedAt).toLocaleString()}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-emerald-800/30 bg-gray-900/50 p-4">
            <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-2">Input Parameters</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-emerald-600">Day:</span><span>{input.dayOfWeek}</span></div>
              <div className="flex justify-between"><span className="text-emerald-600">Weather:</span><span>{input.weatherCondition}</span></div>
              <div className="flex justify-between"><span className="text-emerald-600">Temperature:</span><span>{input.temperature ?? 70}°F</span></div>
              <div className="flex justify-between"><span className="text-emerald-600">Attendance:</span><span>{input.expectedAttendance} students</span></div>
              <div className="flex justify-between"><span className="text-emerald-600">Menu:</span><span className="text-right max-w-[200px]">{input.scheduledMenu}</span></div>
            </div>
          </div>
          <div className="border border-emerald-800/30 bg-gray-900/50 p-4">
            <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-2">Prediction Result</p>
            <p className="text-3xl font-bold text-emerald-200">{result.predictedWasteKg.toFixed(1)} <span className="text-sm text-emerald-600">kg</span></p>
            <p className="text-xs text-emerald-600 mt-1">Model: {result.metadata.modelUsed}</p>
            <p className="text-[10px] text-emerald-700">Latency: {result.metadata.latencyMs}ms</p>
          </div>
        </div>

        <div className="border border-emerald-800/30 bg-gray-900/50 p-4">
          <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-3">Annual Projection (180 School Days)</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-emerald-600">Total Waste</p>
              <p className="text-lg font-bold text-emerald-200">{(annualKg / 1000).toFixed(1)} tonnes</p>
              <p className="text-[10px] text-emerald-700">{annualKg.toFixed(0)} kg</p>
            </div>
            <div>
              <p className="text-xs text-emerald-600">Financial Loss</p>
              <p className="text-lg font-bold text-amber-300">${annualCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-emerald-700">at $4.50/kg disposal cost</p>
            </div>
            <div>
              <p className="text-xs text-emerald-600">Carbon Footprint</p>
              <p className="text-lg font-bold text-red-300">{(annualCo2 / 1000).toFixed(1)} t CO₂e</p>
              <p className="text-[10px] text-emerald-700">2.5 kg CO₂e per kg waste</p>
            </div>
          </div>
        </div>

        <div className="border border-emerald-800/30 bg-gray-900/50 p-4">
          <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-2">Actionable Interventions</p>
          <div className="space-y-2">
            {result.actionableInterventions.map((intervention, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-emerald-300/80 border-l-2 border-emerald-700/40 pl-3 py-1">
                <span className="text-emerald-600 shrink-0">{'>>'}</span>
                <span>{intervention}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-amber-800/40 bg-amber-950/20 p-4">
          <p className="text-[10px] text-amber-500 uppercase tracking-wider mb-2">Risk Warning</p>
          <p className="text-xs text-amber-300/80">{result.riskWarning}</p>
        </div>

        <div className="border border-red-800/30 bg-red-950/10 p-4">
          <p className="text-[10px] text-red-400 uppercase tracking-wider mb-2">Human-in-the-Loop Action Required</p>
          <p className="text-xs text-red-300/80">{result.humanInTheLoopAction}</p>
        </div>

        <div className="border-t border-emerald-800/20 pt-4 text-[10px] text-emerald-700 text-center">
          <p>EcoOS Core v2.5.0 — Responsible AI Compliance: All predictions require human verification before action.</p>
          <p className="mt-1">This report contains AI-generated insights based on synthetic benchmark data.</p>
        </div>
      </div>
    </div>
  );
}
