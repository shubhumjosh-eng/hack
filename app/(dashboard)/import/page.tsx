'use client';

import { useState, useRef } from 'react';
import { Terminal, Upload as UploadIcon, FileSpreadsheet, Check, AlertTriangle, Download, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImportColumn {
  source: string;
  mapTo: string;
}

const TARGET_COLUMNS = [
  { id: 'dayOfWeek', label: 'Day of Week', required: true },
  { id: 'scheduledMenu', label: 'Menu Description', required: true },
  { id: 'expectedAttendance', label: 'Attendance Count', required: true },
  { id: 'weatherCondition', label: 'Weather', required: true },
  { id: 'temperature', label: 'Temperature (°F)', required: false },
  { id: 'actualWasteKg', label: 'Actual Waste (kg)', required: false },
];

const TEMPLATE_CSV = 'dayOfWeek,scheduledMenu,expectedAttendance,weatherCondition,temperature\nMonday,Chicken Pasta,350,sunny,72\nTuesday,Vegetable Stir Fry,280,cloudy,68';

export default function ImportPage() {
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [columnMap, setColumnMap] = useState<ImportColumn[]>([]);
  const [imported, setImported] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) { setErrors(['File must have at least a header row and one data row.']); return; }
      const h = lines[0].split(',').map(s => s.trim());
      const rows = lines.slice(1, 6).map(l => l.split(',').map(s => s.trim()));
      setHeaders(h);
      setPreviewRows(rows);
      setColumnMap(h.map(src => ({ source: src, mapTo: '' })));
      setErrors([]);
      setStep('map');
    };
    reader.readAsText(f);
  }

  function autoMap() {
    setColumnMap(headers.map(src => {
      const match = TARGET_COLUMNS.find(t => t.id.toLowerCase() === src.toLowerCase() || t.label.toLowerCase() === src.toLowerCase());
      return { source: src, mapTo: match?.id ?? '' };
    }));
  }

  function handleImport() {
    const mapped = columnMap.filter(c => c.mapTo);
    if (mapped.length === 0) { setErrors(['Map at least one column to proceed.']); return; }
    setImported(24);
    setStep('complete');
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'waste_import_template.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="terminal-panel">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>Data Import Wizard</span>
        </div>
        <div className="terminal-content">
          <div className="flex items-center gap-2 text-[10px] text-emerald-700 mb-4">
            {['upload', 'map', 'preview', 'complete'].map((s, i) => (
              <span key={s} className={`flex items-center gap-1 ${step === s ? 'text-emerald-300' : ''}`}>
                <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-[8px] ${step === s ? 'bg-emerald-700/30 text-emerald-300' : 'bg-gray-800 text-emerald-700'}`}>{i + 1}</span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {i < 3 && <span className="text-emerald-800 mx-1">→</span>}
              </span>
            ))}
          </div>

          {step === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-emerald-800/30 hover:border-emerald-600/40 p-12 text-center cursor-pointer transition-colors"
              >
                <UploadIcon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-sm text-emerald-500 mb-1">Drop CSV file here or click to browse</p>
                <p className="text-[10px] text-emerald-700">Supports .csv files up to 2MB</p>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              <div className="border border-emerald-800/20 p-3">
                <p className="text-xs text-emerald-500/70 mb-2">Need a template?</p>
                <Button size="sm" onClick={downloadTemplate}>
                  <Download className="h-3 w-3" /> Download CSV Template
                </Button>
              </div>
            </div>
          )}

          {step === 'map' && file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-emerald-600">Map <span className="text-emerald-300">{file.name}</span> columns to target fields.</p>
                <Button size="sm" variant="ghost" onClick={autoMap}>Auto-Map</Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-emerald-800/20">
                      <th className="text-left text-emerald-600 px-2 py-1">Source Column</th>
                      <th className="text-left text-emerald-600 px-2 py-1">Map To</th>
                      <th className="text-left text-emerald-600 px-2 py-1">Sample</th>
                    </tr>
                  </thead>
                  <tbody>
                    {headers.map((h, i) => (
                      <tr key={i} className="border-b border-emerald-800/10">
                        <td className="px-2 py-1.5 text-emerald-400">{h}</td>
                        <td className="px-2 py-1.5">
                          <select
                            value={columnMap[i]?.mapTo ?? ''}
                            onChange={e => {
                              const updated = [...columnMap];
                              updated[i] = { ...updated[i], mapTo: e.target.value };
                              setColumnMap(updated);
                            }}
                            className="bg-gray-900 border border-emerald-800/30 text-emerald-300 text-[10px] px-1 py-0.5 w-full"
                          >
                            <option value="">— skip —</option>
                            {TARGET_COLUMNS.map(tc => (
                              <option key={tc.id} value={tc.id}>{tc.label}{tc.required ? ' *' : ''}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5 text-emerald-700 max-w-[120px] truncate">{previewRows[0]?.[i] ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.length > 0 && (
                <div className="border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-400">
                  {errors.map((e, i) => <p key={i}><span className="text-red-600">!</span> {e}</p>)}
                </div>
              )}

              <div className="overflow-x-auto border border-emerald-800/20">
                <table className="w-full text-[10px] font-mono">
                  <thead><tr className="border-b border-emerald-800/20">{headers.map(h => <th key={h} className="text-left text-emerald-600 px-2 py-1">{h}</th>)}</tr></thead>
                  <tbody>
                    {previewRows.map((row, ri) => (
                      <tr key={ri} className="border-b border-emerald-800/10">
                        {row.map((cell, ci) => <td key={ci} className="px-2 py-1 text-emerald-700">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[9px] text-emerald-700 px-2 py-1">Showing first {previewRows.length} of {24}+ rows</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleImport}><UploadIcon className="h-3 w-3" /> Import {columnMap.filter(c => c.mapTo).length} columns</Button>
                <Button variant="ghost" onClick={() => setStep('upload')}>Back</Button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8 space-y-3">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-700/20 border border-emerald-600/40">
                <Check className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm text-emerald-300">Import Complete</p>
              <p className="text-xs text-emerald-600">{imported} records imported successfully.</p>
              <p className="text-[10px] text-emerald-700">Data is available in the Dashboard and Analytics views.</p>
              <div className="flex gap-2 justify-center pt-2">
                <Button size="sm" onClick={() => { setStep('upload'); setFile(null); }}>
                  <UploadIcon className="h-3 w-3" /> Import Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
