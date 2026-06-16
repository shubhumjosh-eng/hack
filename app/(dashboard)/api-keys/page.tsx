'use client';

import { useState, useEffect } from 'react';
import { PageTour } from '@/components/onboarding/page-tour';
import { API_KEYS_TOUR } from '@/components/onboarding/tour-configs';
import { Terminal, Plus, Copy, Trash2, ToggleLeft, ToggleRight, Check, ExternalLink, Code, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getApiKeys, createApiKey, deleteApiKey, toggleApiKey,
  getWebhooks, createWebhook, deleteWebhook, toggleWebhook,
  API_ENDPOINTS, type ApiKey, type Webhook, type WebhookEvent, WEBHOOK_EVENTS,
} from '@/lib/api-keys';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPerms, setNewKeyPerms] = useState<('read' | 'write' | 'admin')[]>(['read']);
  const [newWhName, setNewWhName] = useState('');
  const [newWhUrl, setNewWhUrl] = useState('');
  const [newWhEvents, setNewWhEvents] = useState<WebhookEvent[]>([]);
  const [showNewKey, setShowNewKey] = useState(false);
  const [showNewWh, setShowNewWh] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'keys' | 'webhooks' | 'docs'>('keys');
  const [showTour, setShowTour] = useState(false);

  function load() { setKeys(getApiKeys()); setWebhooks(getWebhooks()); }
  useEffect(() => { load(); }, []);

  function handleCreateKey() {
    if (!newKeyName.trim()) return;
    const k = createApiKey(newKeyName.trim(), newKeyPerms);
    setNewKeyName('');
    setShowNewKey(false);
    load();
    setCopiedId(k.id);
    setTimeout(() => setCopiedId(null), 3000);
  }

  function handleCreateWebhook() {
    if (!newWhName.trim() || !newWhUrl.trim() || newWhEvents.length === 0) return;
    createWebhook(newWhName.trim(), newWhUrl.trim(), newWhEvents);
    setNewWhName(''); setNewWhUrl(''); setNewWhEvents([]);
    setShowNewWh(false);
    load();
  }

  function togglePerm(p: 'read' | 'write' | 'admin') {
    setNewKeyPerms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  function toggleWhEvent(e: WebhookEvent) {
    setNewWhEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  }

  const tabs = [
    { id: 'keys' as const, label: 'API Keys', count: keys.length },
    { id: 'webhooks' as const, label: 'Webhooks', count: webhooks.length },
    { id: 'docs' as const, label: 'API Docs' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="terminal-panel">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>API & Webhook Management</span>
          <div className="ml-auto">
            <Button variant="secondary" size="sm" onClick={() => setShowTour(true)}>
              <HelpCircle className="h-3 w-3 mr-1" /> Guide
            </Button>
          </div>
        </div>
        <div className="terminal-content">
          <div className="flex gap-1 border-b border-emerald-800/20 pb-3 mb-4">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-[11px] font-mono transition-colors ${tab === t.id ? 'bg-emerald-700/20 text-emerald-300 border-b-2 border-emerald-500' : 'text-emerald-700 hover:text-emerald-500'}`}
              >
                {t.label}{t.count !== undefined ? ` (${t.count})` : ''}
              </button>
            ))}
          </div>

          {tab === 'keys' && (
            <div className="space-y-3" data-tour="apikeys-list">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-emerald-600">Manage API authentication keys for programmatic access.</p>
                <Button size="sm" onClick={() => setShowNewKey(!showNewKey)} data-tour="apikeys-create">
                  <Plus className="h-3 w-3" /> New Key
                </Button>
              </div>

              {showNewKey && (
                <div className="border border-emerald-800/30 bg-gray-900/50 p-3 space-y-3">
                  <Input label="Key Name" id="keyname" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g. Production CI" />
                  <div>
                    <p className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1.5">Permissions</p>
                    <div className="flex gap-2">
                      {(['read', 'write', 'admin'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => togglePerm(p)}
                          className={`px-3 py-1 text-[10px] uppercase border transition-colors ${newKeyPerms.includes(p) ? 'bg-emerald-700/30 text-emerald-300 border-emerald-600' : 'bg-transparent text-emerald-700 border-emerald-800/30 hover:text-emerald-500'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateKey} size="sm">Generate Key</Button>
                    <Button onClick={() => setShowNewKey(false)} variant="ghost" size="sm">Cancel</Button>
                  </div>
                </div>
              )}

              {keys.length === 0 && !showNewKey && (
                <p className="text-xs text-emerald-700 text-center py-6">No API keys yet. Generate one to get started.</p>
              )}

              {keys.map(k => (
                <div key={k.id} className="border border-emerald-800/20 bg-gray-900/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${k.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-emerald-300 font-mono">{k.name}</span>
                      <span className="text-[10px] text-emerald-700 uppercase">{k.permissions.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { navigator.clipboard.writeText(k.key); setCopiedId(k.id); setTimeout(() => setCopiedId(null), 2000); }}
                        className="p-1 text-emerald-700 hover:text-emerald-500"
                        title="Copy key"
                      >
                        {copiedId === k.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <button onClick={() => toggleApiKey(k.id)} className="p-1 text-emerald-700 hover:text-emerald-500" title={k.enabled ? 'Disable' : 'Enable'}>
                        {k.enabled ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                      </button>
                      <button onClick={() => { deleteApiKey(k.id); load(); }} className="p-1 text-red-700 hover:text-red-500" title="Delete">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-700">
                    <code className="bg-gray-950 px-2 py-0.5 border border-emerald-800/20 text-emerald-500">{k.prefix}...{k.key.slice(-6)}</code>
                    <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                    <span>Rate: {k.rateLimit}/hr</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'webhooks' && (
            <div className="space-y-3" data-tour="apikeys-webhooks">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-emerald-600">Configure webhook endpoints for event-driven integrations.</p>
                <Button size="sm" onClick={() => setShowNewWh(!showNewWh)}>
                  <Plus className="h-3 w-3" /> New Webhook
                </Button>
              </div>

              {showNewWh && (
                <div className="border border-emerald-800/30 bg-gray-900/50 p-3 space-y-3">
                  <Input label="Webhook Name" id="whname" value={newWhName} onChange={e => setNewWhName(e.target.value)} placeholder="e.g. Slack Notifier" />
                  <Input label="Endpoint URL" id="whurl" type="url" value={newWhUrl} onChange={e => setNewWhUrl(e.target.value)} placeholder="https://hooks.slack.com/..." />
                  <div>
                    <p className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1.5">Subscribe to Events</p>
                    <div className="flex flex-wrap gap-1.5">
                      {WEBHOOK_EVENTS.map(e => (
                        <button
                          key={e.value}
                          onClick={() => toggleWhEvent(e.value)}
                          className={`px-2 py-1 text-[10px] border transition-colors ${newWhEvents.includes(e.value) ? 'bg-emerald-700/30 text-emerald-300 border-emerald-600' : 'bg-transparent text-emerald-700 border-emerald-800/30 hover:text-emerald-500'}`}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateWebhook} size="sm">Create</Button>
                    <Button onClick={() => setShowNewWh(false)} variant="ghost" size="sm">Cancel</Button>
                  </div>
                </div>
              )}

              {webhooks.length === 0 && !showNewWh && (
                <p className="text-xs text-emerald-700 text-center py-6">No webhooks configured.</p>
              )}

              {webhooks.map(w => (
                <div key={w.id} className="border border-emerald-800/20 bg-gray-900/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${w.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-emerald-300">{w.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleWebhook(w.id)} className="p-1 text-emerald-700 hover:text-emerald-500">
                        {w.enabled ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                      </button>
                      <button onClick={() => { deleteWebhook(w.id); load(); }} className="p-1 text-red-700 hover:text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-700">
                    <code className="bg-gray-950 px-2 py-0.5 border border-emerald-800/20 text-emerald-500 truncate max-w-[200px]">{w.url}</code>
                    <span>{w.events.length} events</span>
                    {w.lastDelivery && <span>Last: {new Date(w.lastDelivery).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'docs' && (
            <div className="space-y-4">
              <p className="text-[11px] text-emerald-600">REST API endpoints — authenticate via <code className="text-emerald-400 bg-gray-900 px-1">Authorization: Bearer &lt;api_key&gt;</code></p>
              {API_ENDPOINTS.map((ep, i) => (
                <div key={i} className="border border-emerald-800/20 bg-gray-900/30 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 ${ep.method === 'GET' ? 'text-emerald-500 bg-emerald-900/30' : 'text-amber-400 bg-amber-900/30'}`}>{ep.method}</span>
                    <code className="text-xs text-emerald-300">{ep.path}</code>
                  </div>
                  <p className="text-[10px] text-emerald-600 mb-1">{ep.desc}</p>
                  {ep.body && (
                    <pre className="text-[9px] text-emerald-700 bg-gray-950 p-2 border border-emerald-800/10 overflow-x-auto">{ep.body}</pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showTour && <PageTour steps={API_KEYS_TOUR} pageId="api-keys" onComplete={() => setShowTour(false)} />}
    </div>
  );
}
