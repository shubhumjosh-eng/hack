'use client';

import { useState, useMemo } from 'react';
import { Terminal, MapPin, Crosshair, ZoomIn, ZoomOut, Info, HelpCircle } from 'lucide-react';
import { MOCK_SITES, computeClusters, getRiskColor, getTypeIcon, type WasteSite, type GeoCluster } from '@/lib/geo';

const SVG_W = 600;
const SVG_H = 400;
const PAD = 40;

function latLngToSvg(lat: number, lng: number, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }) {
  const x = PAD + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (SVG_W - 2 * PAD);
  const y = SVG_H - PAD - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (SVG_H - 2 * PAD);
  return { x, y };
}

export default function GeoMapPage() {
  const [selectedSite, setSelectedSite] = useState<WasteSite | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<GeoCluster | null>(null);
  const [showClusters, setShowClusters] = useState(true);
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const bounds = useMemo(() => ({
    minLat: Math.min(...MOCK_SITES.map(s => s.lat)) - 0.02,
    maxLat: Math.max(...MOCK_SITES.map(s => s.lat)) + 0.02,
    minLng: Math.min(...MOCK_SITES.map(s => s.lng)) - 0.02,
    maxLng: Math.max(...MOCK_SITES.map(s => s.lng)) + 0.02,
  }), []);

  const clusters = useMemo(() => computeClusters(MOCK_SITES), []);

  const filtered = MOCK_SITES.filter(s => filterRisk === 'all' || s.riskLevel === filterRisk);

  const totalWaste = MOCK_SITES.reduce((s, site) => s + site.estimatedWasteKg, 0);
  const totalSites = MOCK_SITES.length;
  const riskCounts = { critical: MOCK_SITES.filter(s => s.riskLevel === 'critical').length, high: MOCK_SITES.filter(s => s.riskLevel === 'high').length };

  const riskLevels = ['all', 'low', 'medium', 'high', 'critical'];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Purpose banner */}
      <div className="terminal-panel border-emerald-700/30">
        <div className="flex items-start gap-3 p-3 text-[11px] text-emerald-400/80">
          <HelpCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-emerald-300 font-semibold mb-1">Purpose — Waste Source Map</p>
            <p className="text-[10px] text-emerald-400 mb-2">
              Visualize all tracked waste sites across your organization on one map. Use it to quickly
              identify high-risk locations, spot clusters of waste-heavy areas, and decide where to deploy
              interventions for maximum impact.
            </p>
            <ul className="space-y-0.5 text-[10px] text-emerald-600">
              <li><span className="text-emerald-500">&bull;</span> <strong className="text-emerald-400">Click</strong> any dot on the map to see site details (name, waste amount, risk level, last audit)</li>
              <li><span className="text-emerald-500">&bull;</span> <strong className="text-emerald-400">Dashed circles</strong> show clusters of multiple nearby sites — click to expand</li>
              <li><span className="text-emerald-500">&bull;</span> <strong className="text-emerald-400">Filter</strong> by risk level using the buttons above the map</li>
              <li><span className="text-emerald-500">&bull;</span> Toggle <strong className="text-emerald-400">Clusters On/Off</strong> to group nearby sites or view individually</li>
              <li><span className="text-emerald-500">&bull;</span> Dot <strong className="text-emerald-400">size</strong> = estimated waste volume (larger = more waste)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-0">
          <div className="terminal-panel">
            <div className="terminal-header flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-500" />
              <span>Waste Source Map — San Francisco</span>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {riskLevels.map(r => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`px-2 py-1 text-[10px] uppercase border transition-colors ${filterRisk === r ? 'bg-emerald-700/30 text-emerald-300 border-emerald-600' : 'bg-transparent text-emerald-700 border-emerald-800/30 hover:text-emerald-500'}`}
                  >
                    {r}{r !== 'all' ? ` (${r === 'critical' ? riskCounts.critical : r === 'high' ? riskCounts.high : '-'})` : ''}
                  </button>
                ))}
                <button
                  onClick={() => setShowClusters(!showClusters)}
                  className={`ml-auto px-2 py-1 text-[10px] uppercase border transition-colors ${showClusters ? 'bg-emerald-700/30 text-emerald-300 border-emerald-600' : 'bg-transparent text-emerald-700 border-emerald-800/30'}`}
                >
                  {showClusters ? 'Clusters On' : 'Clusters Off'}
                </button>
              </div>

              <div className="border border-emerald-800/20 bg-gray-950 overflow-hidden">
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-auto">
                  {filtered.map(site => {
                    const pos = latLngToSvg(site.lat, site.lng, bounds);
                    const isSelected = selectedSite?.id === site.id;
                    const color = getRiskColor(site.riskLevel);
                    const r = site.estimatedWasteKg > 200 ? 8 : site.estimatedWasteKg > 100 ? 6 : 4;
                    return (
                      <g key={site.id} onClick={() => { setSelectedSite(site); setSelectedCluster(null); }} className="cursor-pointer">
                        <circle cx={pos.x} cy={pos.y} r={r + 3} fill="transparent" className="hover:fill-emerald-900/20" />
                        <circle cx={pos.x} cy={pos.y} r={r} fill={color} opacity={isSelected ? 1 : 0.7} stroke={isSelected ? '#34d399' : 'transparent'} strokeWidth={2} />
                        {isSelected && <circle cx={pos.x} cy={pos.y} r={r + 4} fill="none" stroke="#34d399" strokeWidth={1} opacity={0.5} />}
                        <text x={pos.x} y={pos.y - r - 4} textAnchor="middle" fill={color} fontSize="7" fontFamily="monospace" opacity={isSelected ? 1 : 0}>{site.name}</text>
                      </g>
                    );
                  })}

                  {showClusters && clusters.filter(c => c.count > 1).map(cluster => {
                    const pos = latLngToSvg(cluster.center.lat, cluster.center.lng, bounds);
                    const isSelected = selectedCluster?.id === cluster.id;
                    return (
                      <g key={cluster.id} onClick={() => { setSelectedCluster(cluster); setSelectedSite(null); }} className="cursor-pointer">
                        <circle cx={pos.x} cy={pos.y} r={14 + Math.min(cluster.count * 2, 10)} fill="none" stroke="#34d399" strokeWidth={1.5} opacity={isSelected ? 0.8 : 0.4} strokeDasharray="4 2" />
                        <circle cx={pos.x} cy={pos.y} r={6} fill={isSelected ? '#34d399' : '#065f46'} stroke="#34d399" strokeWidth={1} />
                        <text x={pos.x} y={pos.y + 1} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">{cluster.count}</text>
                      </g>
                    );
                  })}

                  {/* Grid lines */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <g key={i}>
                      <line x1={PAD} y1={PAD + (i / 4) * (SVG_H - 2 * PAD)} x2={SVG_W - PAD} y2={PAD + (i / 4) * (SVG_H - 2 * PAD)} stroke="#065f4620" strokeWidth={0.5} />
                      <line x1={PAD + (i / 4) * (SVG_W - 2 * PAD)} y1={PAD} x2={PAD + (i / 4) * (SVG_W - 2 * PAD)} y2={SVG_H - PAD} stroke="#065f4620" strokeWidth={0.5} />
                    </g>
                  ))}

                  <text x={SVG_W / 2} y={SVG_H - 5} textAnchor="middle" fill="#065f46" fontSize="7" fontFamily="monospace">San Francisco — Waste Source Map</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-80 space-y-3">
          <div className="terminal-panel">
            <div className="terminal-header flex items-center gap-2">
              <MapPin className="h-3 w-3 text-emerald-500" />
              <span>Summary</span>
            </div>
            <div className="p-3 space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-emerald-800/10 pb-1"><span className="text-emerald-600">Total Sites</span><span className="text-emerald-300">{totalSites}</span></div>
              <div className="flex justify-between border-b border-emerald-800/10 pb-1"><span className="text-emerald-600">Daily Waste</span><span className="text-emerald-300">{totalWaste} kg</span></div>
              <div className="flex justify-between border-b border-emerald-800/10 pb-1"><span className="text-emerald-600">Critical Risk</span><span className="text-red-400">{riskCounts.critical}</span></div>
              <div className="flex justify-between"><span className="text-emerald-600">Clusters</span><span className="text-emerald-300">{clusters.filter(c => c.count > 1).length}</span></div>
            </div>
          </div>

          {selectedSite && (
            <div className="terminal-panel animate-fade-in">
              <div className="terminal-header flex items-center gap-2">
                <Info className="h-3 w-3 text-emerald-500" />
                <span>Site Detail</span>
              </div>
              <div className="p-3 space-y-2 text-[11px]">
                <p className="text-sm text-emerald-300 font-mono">{selectedSite.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{getTypeIcon(selectedSite.type)}</span>
                  <span className="text-emerald-600 capitalize">{selectedSite.type}</span>
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] uppercase border" style={{ borderColor: getRiskColor(selectedSite.riskLevel), color: getRiskColor(selectedSite.riskLevel) }}>{selectedSite.riskLevel}</span>
                </div>
                <div className="border-t border-emerald-800/10 pt-2 space-y-1">
                  <div className="flex justify-between"><span className="text-emerald-600">Waste/day</span><span className="text-emerald-300 font-bold">{selectedSite.estimatedWasteKg} kg</span></div>
                  <div className="flex justify-between"><span className="text-emerald-600">Annual</span><span className="text-emerald-300">{selectedSite.estimatedWasteKg * 180} kg</span></div>
                  <div className="flex justify-between"><span className="text-emerald-600">Last Audit</span><span className="text-emerald-300">{selectedSite.lastAudit ? new Date(selectedSite.lastAudit).toLocaleDateString() : 'Never'}</span></div>
                </div>
              </div>
            </div>
          )}

          {selectedCluster && (
            <div className="terminal-panel animate-fade-in">
              <div className="terminal-header flex items-center gap-2">
                <Crosshair className="h-3 w-3 text-emerald-500" />
                <span>Cluster — {selectedCluster.count} sites</span>
              </div>
              <div className="p-3 space-y-2 text-[11px]">
                <div className="flex justify-between"><span className="text-emerald-600">Total Waste</span><span className="text-emerald-300 font-bold">{selectedCluster.totalWasteKg} kg/day</span></div>
                <div className="space-y-1">
                  {selectedCluster.sites.map(s => (
                    <button key={s.id} onClick={() => { setSelectedSite(s); setSelectedCluster(null); }} className="flex items-center gap-2 w-full text-left px-1 py-0.5 hover:bg-emerald-900/20 text-[10px]">
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getRiskColor(s.riskLevel) }} />
                      <span className="text-emerald-400">{s.name}</span>
                      <span className="ml-auto text-emerald-700">{s.estimatedWasteKg}kg</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="terminal-panel">
            <div className="terminal-header flex items-center gap-2">
              <Terminal className="h-3 w-3 text-emerald-500" />
              <span>Legend</span>
            </div>
            <div className="p-3 text-[10px] space-y-1">
              {[
                { label: 'Critical', color: '#f87171' },
                { label: 'High', color: '#fbbf24' },
                { label: 'Medium', color: '#60a5fa' },
                { label: 'Low', color: '#34d399' },
                { label: 'Cluster (2+)', color: '#34d399', dashed: true },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${l.dashed ? 'rounded-none border border-dashed' : 'rounded-full'}`} style={{ backgroundColor: l.dashed ? 'transparent' : l.color, borderColor: l.dashed ? l.color : undefined }} />
                  <span className="text-emerald-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
