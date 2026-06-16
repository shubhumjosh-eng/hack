'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useState } from 'react';
import { Save, Key, Bell, Shield, Database, RefreshCw } from 'lucide-react';

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
  const [exporting, setExporting] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [retrainDone, setRetrainDone] = useState(false);

  function toggleNotification(index: number) {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, enabled: !n.enabled } : n));
  }

  function handleSave() {
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

  return (
    <div className="space-y-8 animate-fade-in">
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
            <StatusIndicator status="online" label="API Connected" />
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
