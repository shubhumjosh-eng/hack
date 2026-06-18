'use client';

import { useState, useEffect } from 'react';
import { PageTour } from '@/components/onboarding/page-tour';
import { SCHEDULES_TOUR } from '@/components/onboarding/tour-configs';
import { Terminal, Plus, Trash2, ToggleLeft, ToggleRight, Bell, Mail, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  getSchedules, createSchedule, toggleSchedule, deleteSchedule,
  getThresholds, createThreshold, toggleThreshold, deleteThreshold,
  type ScheduledAudit, type ThresholdAlert,
} from '@/lib/scheduler';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEATHERS = ['sunny', 'cloudy', 'rainy', 'snowy', 'humid'];

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduledAudit[]>([]);
  const [thresholds, setThresholds] = useState<ThresholdAlert[]>([]);
  const [tab, setTab] = useState<'schedules' | 'thresholds'>('schedules');

  const [showNewSched, setShowNewSched] = useState(false);
  const [newSched, setNewSched] = useState({ name: '', description: '', schedule: 'daily' as const, dayOfWeek: 'Monday', menu: 'standard menu', attendance: 300, weather: 'sunny', temp: 72, channels: [] as string[], targets: '' });

  const [showNewThresh, setShowNewThresh] = useState(false);
  const [newThresh, setNewThresh] = useState({ name: '', metric: 'predictedWasteKg' as ThresholdAlert['metric'], condition: 'above' as ThresholdAlert['condition'], value: 100, cooldown: 60, channels: [] as string[] });
  const [showTour, setShowTour] = useState(false);
  const [confirmDelSched, setConfirmDelSched] = useState<{ id: string; name: string } | null>(null);
  const [confirmDelThresh, setConfirmDelThresh] = useState<{ id: string; name: string } | null>(null);

  function load() { setSchedules(getSchedules()); setThresholds(getThresholds()); }
  useEffect(() => { load(); }, []);

  function handleCreateSched() {
    if (!newSched.name.trim()) return;
    createSchedule({
      name: newSched.name.trim(),
      description: newSched.description,
      schedule: newSched.schedule,
      cronExpression: '0 8 * * 1-5',
      inputTemplate: {
        dayOfWeek: newSched.dayOfWeek,
        scheduledMenu: newSched.menu,
        expectedAttendance: newSched.attendance,
        weatherCondition: newSched.weather,
        temperature: newSched.temp,
      },
      enabled: true,
      notificationChannels: newSched.channels as any,
      notificationTargets: newSched.targets ? newSched.targets.split(',').map(s => s.trim()) : [],
    });
    setShowNewSched(false);
    load();
  }

  function handleCreateThresh() {
    if (!newThresh.name.trim()) return;
    createThreshold({
      name: newThresh.name.trim(),
      metric: newThresh.metric,
      condition: newThresh.condition,
      value: newThresh.value,
      enabled: true,
      cooldownMinutes: newThresh.cooldown,
      notificationChannels: newThresh.channels as any,
    });
    setShowNewThresh(false);
    load();
  }

  function toggleChannel(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  const tabs = [
    { id: 'schedules' as const, label: 'Scheduled Audits', count: schedules.length },
    { id: 'thresholds' as const, label: 'Threshold Alerts', count: thresholds.length },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="terminal-panel">
        <div className="terminal-header flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>Schedule & Automation</span>
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
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          {tab === 'schedules' && (
            <div className="space-y-3" data-tour="schedules-list">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-emerald-600">Automate recurring waste audits on a cron schedule.</p>
                <Button size="sm" onClick={() => setShowNewSched(!showNewSched)} data-tour="schedules-create"><Plus className="h-3 w-3" /> New Schedule</Button>
              </div>

              {showNewSched && (
                <div className="border border-emerald-800/30 bg-gray-900/50 p-3 space-y-3">
                  <Input label="Schedule Name" id="schedname" value={newSched.name} onChange={e => setNewSched(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Morning Prep Audit" />
                  <Input label="Description" id="scheddesc" value={newSched.description} onChange={e => setNewSched(p => ({ ...p, description: e.target.value }))} placeholder="Optional description" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="terminal-label" htmlFor="sched-freq">Frequency</label>
                      <select id="sched-freq" value={newSched.schedule} onChange={e => setNewSched(p => ({ ...p, schedule: e.target.value as any }))} className="terminal-select">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="terminal-label" htmlFor="sched-day">Day Pattern</label>
                      <select id="sched-day" value={newSched.dayOfWeek} onChange={e => setNewSched(p => ({ ...p, dayOfWeek: e.target.value }))} className="terminal-select">
                        {WEEKDAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <Input label="Default Menu" id="sched-menu" value={newSched.menu} onChange={e => setNewSched(p => ({ ...p, menu: e.target.value }))} />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="terminal-label" htmlFor="sched-att">Attendance</label>
                      <input id="sched-att" type="number" value={newSched.attendance} onChange={e => setNewSched(p => ({ ...p, attendance: +e.target.value }))} className="terminal-input" />
                    </div>
                    <div>
                      <label className="terminal-label" htmlFor="sched-temp">Temperature °F</label>
                      <input id="sched-temp" type="number" value={newSched.temp} onChange={e => setNewSched(p => ({ ...p, temp: +e.target.value }))} className="terminal-input" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1.5">Notify via</p>
                    <div className="flex gap-2">
                      {['email', 'slack', 'webhook'].map(ch => (
                        <button key={ch} onClick={() => setNewSched(p => ({ ...p, channels: toggleChannel(p.channels, ch) }))}
                          className={`px-2 py-1 text-[10px] uppercase border transition-colors ${newSched.channels.includes(ch) ? 'bg-emerald-700/30 text-emerald-300 border-emerald-600' : 'bg-transparent text-emerald-700 border-emerald-800/30 hover:text-emerald-500'}`}
                        >
                          {ch === 'email' ? <Mail className="h-3 w-3 inline mr-1" /> : ch === 'slack' ? <Bell className="h-3 w-3 inline mr-1" /> : <Globe className="h-3 w-3 inline mr-1" />}
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input label="Notification Targets (comma-separated)" id="sched-targets" value={newSched.targets} onChange={e => setNewSched(p => ({ ...p, targets: e.target.value }))} placeholder="admin@org.edu, #waste-alerts" />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateSched} size="sm">Create Schedule</Button>
                    <Button onClick={() => setShowNewSched(false)} variant="ghost" size="sm">Cancel</Button>
                  </div>
                </div>
              )}

              {schedules.length === 0 && !showNewSched && (
                <p className="text-xs text-emerald-700 text-center py-6">No schedules configured. Create one to automate waste audits.</p>
              )}

              {schedules.map(s => (
                <div key={s.id} className="border border-emerald-800/20 bg-gray-900/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${s.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-emerald-300">{s.name}</span>
                      <span className="text-[10px] text-emerald-700 uppercase border border-emerald-800/30 px-1">{s.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { toggleSchedule(s.id); load(); }} className="p-1 text-emerald-700 hover:text-emerald-500">
                        {s.enabled ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                      </button>
                      <button onClick={() => setConfirmDelSched({ id: s.id, name: s.name })} className="p-1 text-red-700 hover:text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-700 flex flex-wrap gap-x-3 gap-y-0.5">
                    {s.description && <span>{s.description}</span>}
                    <span>Menu: {s.inputTemplate.scheduledMenu}</span>
                    <span>Attendance: {s.inputTemplate.expectedAttendance}</span>
                    <span>Created: {new Date(s.createdAt).toLocaleDateString()}</span>
                    {s.notificationChannels.length > 0 && <span>Notify: {s.notificationChannels.join(', ')}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'thresholds' && (
            <div className="space-y-3" data-tour="schedules-alerts">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-emerald-600">Get notified when waste metrics cross defined thresholds.</p>
                <Button size="sm" onClick={() => setShowNewThresh(!showNewThresh)}><Plus className="h-3 w-3" /> New Threshold</Button>
              </div>

              {showNewThresh && (
                <div className="border border-emerald-800/30 bg-gray-900/50 p-3 space-y-3">
                  <Input label="Alert Name" id="thrname" value={newThresh.name} onChange={e => setNewThresh(p => ({ ...p, name: e.target.value }))} placeholder="e.g. High Waste Alert" />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="terminal-label" htmlFor="thr-metric">Metric</label>
                      <select id="thr-metric" value={newThresh.metric} onChange={e => setNewThresh(p => ({ ...p, metric: e.target.value as any }))} className="terminal-select text-[11px]">
                        <option value="predictedWasteKg">Waste (kg)</option>
                        <option value="wastePerAttendee">Waste/Attendee</option>
                        <option value="annualProjection">Annual Projection</option>
                        <option value="cost">Cost ($)</option>
                      </select>
                    </div>
                    <div>
                      <label className="terminal-label" htmlFor="thr-cond">Condition</label>
                      <select id="thr-cond" value={newThresh.condition} onChange={e => setNewThresh(p => ({ ...p, condition: e.target.value as any }))} className="terminal-select">
                        <option value="above">Above</option>
                        <option value="below">Below</option>
                      </select>
                    </div>
                    <div>
                      <label className="terminal-label" htmlFor="thr-val">Value</label>
                      <input id="thr-val" type="number" value={newThresh.value} onChange={e => setNewThresh(p => ({ ...p, value: +e.target.value }))} className="terminal-input" />
                    </div>
                  </div>
                  <Input label="Cooldown (minutes)" id="thr-cool" type="number" value={String(newThresh.cooldown)} onChange={e => setNewThresh(p => ({ ...p, cooldown: +e.target.value }))} />
                  <div>
                    <p className="text-xs text-emerald-500/70 uppercase tracking-wider mb-1.5">Notify via</p>
                    <div className="flex gap-2">
                      {['email', 'slack', 'webhook'].map(ch => (
                        <button key={ch} onClick={() => setNewThresh(p => ({ ...p, channels: toggleChannel(p.channels, ch) }))}
                          className={`px-2 py-1 text-[10px] uppercase border transition-colors ${newThresh.channels.includes(ch) ? 'bg-emerald-700/30 text-emerald-300 border-emerald-600' : 'bg-transparent text-emerald-700 border-emerald-800/30 hover:text-emerald-500'}`}
                        >{ch}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateThresh} size="sm">Create Alert</Button>
                    <Button onClick={() => setShowNewThresh(false)} variant="ghost" size="sm">Cancel</Button>
                  </div>
                </div>
              )}

              {thresholds.length === 0 && !showNewThresh && (
                <p className="text-xs text-emerald-700 text-center py-6">No threshold alerts configured.</p>
              )}

              {thresholds.map(t => (
                <div key={t.id} className="border border-emerald-800/20 bg-gray-900/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${t.enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-emerald-300">{t.name}</span>
                      <span className="text-[10px] text-emerald-700">{t.metric} {t.condition === 'above' ? '>' : '<'} {t.value}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { toggleThreshold(t.id); load(); }} className="p-1 text-emerald-700 hover:text-emerald-500">
                        {t.enabled ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                      </button>
                      <button onClick={() => setConfirmDelThresh({ id: t.id, name: t.name })} className="p-1 text-red-700 hover:text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">Cooldown: {t.cooldownMinutes}m {t.lastTriggered && `| Last triggered: ${new Date(t.lastTriggered).toLocaleString()}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showTour && <PageTour steps={SCHEDULES_TOUR} pageId="schedules" onComplete={() => setShowTour(false)} />}

      {confirmDelSched && (
        <ConfirmDialog
          open={!!confirmDelSched}
          title="Delete Schedule"
          message={`Permanently delete the schedule "${confirmDelSched.name}"? This will stop all automated audits for this schedule.`}
          confirmLabel="delete"
          onConfirm={() => { deleteSchedule(confirmDelSched.id); load(); setConfirmDelSched(null); }}
          onCancel={() => setConfirmDelSched(null)}
        />
      )}
      {confirmDelThresh && (
        <ConfirmDialog
          open={!!confirmDelThresh}
          title="Delete Threshold Alert"
          message={`Permanently delete the threshold alert "${confirmDelThresh.name}"? You will no longer be notified when this threshold is crossed.`}
          confirmLabel="delete"
          onConfirm={() => { deleteThreshold(confirmDelThresh.id); load(); setConfirmDelThresh(null); }}
          onCancel={() => setConfirmDelThresh(null)}
        />
      )}
    </div>
  );
}
