'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

interface HealthCheck {
  status: string;
  supabase: string;
  huggingface: string;
  timestamp: string;
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({
    'Auth API': true,
    'Admin API': true,
    'Audit API': true,
    'Invite API': true,
    'Health API': true,
  });

  useEffect(() => {
    checkHealth();
    const timer = setInterval(() => {
      checkHealth();
      checkServices();
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  async function checkHealth() {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch {}
    setLoading(false);
  }

  async function checkServices() {
    const routes = ['/api/health', '/api/auth/error-log', '/api/admin/users', '/api/audit', '/api/invite'];
    const results: Record<string, boolean> = {};
    for (const route of routes) {
      try {
        const res = await fetch(route);
        results[route] = res.status < 500;
      } catch {
        results[route] = false;
      }
    }
    setServiceStatus({
      'Auth API': results['/api/auth/error-log'],
      'Admin API': results['/api/admin/users'],
      'Audit API': results['/api/audit'],
      'Invite API': results['/api/invite'],
      'Health API': results['/api/health'],
    });
  }

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-mono flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            System Status
          </h1>
          <p className="text-[10px] text-emerald-700">Real-time monitoring and service health</p>
        </div>
        <button
          onClick={() => { setLoading(true); checkHealth(); checkServices(); }}
          className="flex items-center gap-1 text-[10px] text-emerald-500/50 hover:text-emerald-400 font-mono"
        >
          <RefreshCw className="h-3 w-3" />
          refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          <div className="terminal-panel p-4">
            <h2 className="text-xs font-mono text-emerald-400 mb-3">Backend Services</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(serviceStatus).map(([name, ok], i) => (
                <div key={name} className={`border border-emerald-800/20 p-3 flex items-center gap-2 ${Object.entries(serviceStatus).length - 1 === i ? 'col-span-2 sm:col-span-1' : ''}`}>
                  {ok ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] text-emerald-300">{name}</p>
                    <p className={`text-[8px] ${ok ? 'text-emerald-600' : 'text-red-600'}`}>
                      {ok ? 'operational' : 'error'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {health && (
            <div className="terminal-panel p-4">
              <h2 className="text-xs font-mono text-emerald-400 mb-3">Health Endpoint</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600">Status</span>
                  <span className={`${health.status === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>{health.status}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600">Supabase</span>
                  <span className="text-emerald-400">{health.supabase}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600">Hugging Face</span>
                  <span className="text-emerald-400">{health.huggingface}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600">Last Check</span>
                  <span className="text-emerald-500/70">{new Date(health.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="terminal-panel p-4">
            <h2 className="text-xs font-mono text-emerald-400 mb-3">Rate Limiting</h2>
            <div className="text-[10px] text-emerald-700 space-y-1">
              <p>Auth API routes: 10 requests/minute per IP</p>
              <p>Admin API routes: 10 requests/minute per IP</p>
              <p>Rate limits reset every 60 seconds</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
