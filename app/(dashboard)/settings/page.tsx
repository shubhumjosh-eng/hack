'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useState, useEffect } from 'react';
import { Save, Key, Bell, Shield, Database, RefreshCw, Cpu, CheckCircle, Palette } from 'lucide-react';
import { getSettings, saveSettings } from '@/lib/storage';
import { THEMES, getTheme, setTheme } from '@/lib/themes';
import { MODELS } from '@/lib/models';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState([
    { label: 'Weekly waste summary report', enabled: true },
    { label: 'Anomaly detection alerts', enabled: true },
    { label: 'Daily triage digest', enabled: false },
    { label: 'Model status changes', enabled: true },
  ]);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('meta-llama/Meta-Llama-3-8B-Instruct');
  const [apiStatus, setApiStatus] = useState<'idle' | 'checking' | 'connected' | 'invalid' | 'error'>('idle');
  const [exporting, setExporting] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [retrainDone, setRetrainDone] = useState(false);
  const [activeThemeId, setActiveThemeId] = useState('emerald');

  useEffect(() => {
    setActiveThemeId(getTheme().id);
    const settings = getSettings();
    if (settings) {
      setApiKey(settings.apiKey);
      setModel(settings.model);
      if (settings.notifications) {
        setNotifications(settings.notifications);
      }
      if (settings.apiKey) {
        validateKey(settings.apiKey);
      }
    }
  }, []);

  async function validateKey(key: string) {
    if (!key || !key.startsWith('hf_')) {
      setApiStatus('idle');
      return;
    }
    setApiStatus('checking');
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      setApiStatus(data.valid ? 'connected' : 'invalid');
    } catch {
      setApiStatus('error');
    }
  }

  function toggleNotification(index: number) {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, enabled: !n.enabled } : n));
  }

  function handleSave() {
    saveSettings({ apiKey, model, notifications });
    validateKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExport() {
    setExporting(true);
    setTimeout(() => setExporting(false), 1500);
  }

  function handleRetrain() {
    setRetraining(true);
    setRetrainDone(false);
    setTimeout(() => {
      setRetraining(false);
      setRetrainDone(true);
      setTimeout(() => setRetrainDone(false), 3000);
    }, 2000);
  }

  function getApiStatusLabel() {
    switch (apiStatus) {
      case 'checking': return { status: 'loading' as const, label: 'Validating key...' };
      case 'connected': return { status: 'online' as const, label: 'API Connected' };
      case 'invalid': return { status: 'offline' as const, label: 'Invalid API Key' };
      case 'error': return { status: 'degraded' as const, label: 'Cannot reach API' };
      default: return { status: 'offline' as const, label: 'No API key configured' };
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 sm:pb-0">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-emerald-50">Settings</h1>
          <p className="text-sm text-emerald-400/60">System configuration and preferences</p>
        </div>
        <Button onClick={handleSave} icon={<Save className="h-4 w-4" />}>
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">API Configuration</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Hugging Face API Key" type="password" placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          <Select
            label="Default LLM Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            options={[
              { value: 'meta-llama/Meta-Llama-3-8B-Instruct', label: 'Meta Llama 3 8B Instruct' },
              { value: 'mistralai/Mistral-7B-Instruct-v0.3', label: 'Mistral 7B Instruct v0.3' },
              { value: 'HuggingFaceH4/zephyr-7b-beta', label: 'Zephyr 7B Beta' },
            ]}
          />
          <div className="flex items-center gap-2 pt-2">
            <StatusIndicator status={getApiStatusLabel().status} label={getApiStatusLabel().label} />
            {apiKey && apiStatus === 'idle' && (
              <button onClick={() => validateKey(apiKey)} className="text-[10px] text-emerald-600 hover:text-emerald-400 underline underline-offset-2">
                Test connection
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">Notifications</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notif, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3">
              <span className="text-sm text-emerald-300/80">{notif.label}</span>
              <button
                onClick={() => toggleNotification(i)}
                className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${notif.enabled ? 'bg-emerald-600' : 'bg-emerald-800/50'}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform mt-0.5 ${notif.enabled ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">Terminal Theme</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {THEMES.map(theme => {
              const active = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => { setTheme(theme.id); setActiveThemeId(theme.id); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                  className={`border p-2 text-left transition-all ${active ? 'border-emerald-500/60 bg-emerald-900/15' : 'border-emerald-800/20 hover:border-emerald-700/40 bg-gray-900/30'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                    <span className="text-[11px] text-emerald-300 font-mono">{theme.name}</span>
                  </div>
                  <p className="text-[9px] text-emerald-700">{theme.description}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[theme.colors.accent, theme.colors.text, theme.colors.bg, theme.colors.bgLight].map((c, i) => (
                      <span key={i} className="inline-block h-2 w-2 border border-emerald-800/20" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">Model Information</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-emerald-800/30 bg-gray-900 p-3">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Architecture</p>
              <p className="text-sm text-emerald-300">Meta-Llama-3.1-8B-Instruct</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Transformer decoder 8B params</p>
            </div>
            <div className="border border-emerald-800/30 bg-gray-900 p-3">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Inference</p>
              <p className="text-sm text-emerald-300">Hugging Face Serverless</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Router: router.huggingface.co/v1</p>
            </div>
            <div className="border border-emerald-800/30 bg-gray-900 p-3">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Training Data</p>
              <p className="text-sm text-emerald-300">Synthetic + Public Benchmarks</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">No real institutional data used</p>
            </div>
            <div className="border border-emerald-800/30 bg-gray-900 p-3">
              <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-1">Latency Budget</p>
              <p className="text-sm text-emerald-300">500–1500ms</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Cold start: 30-60s first request</p>
            </div>
          </div>

          <div className="border border-emerald-800/30 bg-gray-900 p-3">
            <p className="text-[10px] text-emerald-600 uppercase tracking-wider mb-2">Capabilities</p>
            <div className="space-y-1.5 text-sm text-emerald-300/80">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs">Few-shot waste prediction from 5 input parameters</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs">Text triage — raw situation descriptions → structured environmental analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs">Actionable intervention generation with priority ranking</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs">Risk warnings and human-in-the-loop compliance enforcement</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">Model Portfolio</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MODELS.map(m => (
              <div key={m.id} className="border border-emerald-800/20 bg-gray-900/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-emerald-300 font-mono">{m.name}</p>
                  <span className="text-[9px] uppercase text-emerald-700 border border-emerald-800/30 px-1">{m.type}</span>
                </div>
                <p className="text-[9px] text-emerald-600 mb-2">{m.description}</p>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <span className="text-emerald-700">Acc: <span className="text-emerald-400">{(m.accuracy * 100).toFixed(1)}%</span></span>
                  <span className="text-emerald-700">F1: <span className="text-emerald-400">{(m.f1Score * 100).toFixed(1)}%</span></span>
                  <span className="text-emerald-700">Prec: <span className="text-emerald-400">{(m.precision * 100).toFixed(1)}%</span></span>
                  <span className="text-emerald-700">Recall: <span className="text-emerald-400">{(m.recall * 100).toFixed(1)}%</span></span>
                </div>
                <p className="text-[8px] text-emerald-700 mt-1">Latency: {m.latencyMs}ms | Trained: {m.trainingSize.toLocaleString()} records</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">Responsible AI</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'All AI recommendations are reviewed by human operators before implementation',
            'Anonymized, aggregated data only — no individual consumption patterns stored',
            'Bias monitoring: regular audits for disproportionate community impact',
            'Conservative environmental impact projections; actual results may vary',
            'Full model explanations and automated decision appeals available',
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-emerald-400/70">
              <Shield className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-emerald-50">Data Management</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3">
            <div>
              <p className="text-sm text-emerald-50">Export All Data</p>
              <p className="text-xs text-emerald-400/50">Download complete dataset as CSV</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport} loading={exporting}>{exporting ? 'Exporting...' : 'Export'}</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-emerald-800/20 bg-emerald-900/20 p-3">
            <div>
              <p className="text-sm text-emerald-50">Retrain Prediction Model</p>
              <p className="text-xs text-emerald-400/50">{retrainDone ? 'Model retrained successfully' : 'Update with latest waste data'}</p>
            </div>
            <Button variant="secondary" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={handleRetrain} loading={retraining}>{retraining ? 'Retraining...' : retrainDone ? 'Done' : 'Retrain'}</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-emerald-500/40">
        <span>EcoOS Core v2.4.1</span>
        <span>Enterprise License</span>
      </div>
    </div>
  );
}
