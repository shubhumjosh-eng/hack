export interface WasteSite {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'restaurant' | 'office' | 'warehouse' | 'home' | 'other';
  lat: number;
  lng: number;
  estimatedWasteKg: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAudit: string | null;
  clusterId?: number;
}

export interface GeoCluster {
  id: number;
  center: { lat: number; lng: number };
  count: number;
  totalWasteKg: number;
  sites: WasteSite[];
}

export const MOCK_SITES: WasteSite[] = [
  { id: 's-1', name: 'Lincoln High School', type: 'school', lat: 37.7749, lng: -122.4194, estimatedWasteKg: 145, riskLevel: 'high', lastAudit: '2026-05-20T10:00:00Z' },
  { id: 's-2', name: 'Jefferson Middle School', type: 'school', lat: 37.7849, lng: -122.4094, estimatedWasteKg: 98, riskLevel: 'medium', lastAudit: '2026-05-18T14:00:00Z' },
  { id: 's-3', name: 'Washington Elementary', type: 'school', lat: 37.7649, lng: -122.4294, estimatedWasteKg: 62, riskLevel: 'low', lastAudit: null },
  { id: 's-4', name: 'Mercy General Hospital', type: 'hospital', lat: 37.7549, lng: -122.4394, estimatedWasteKg: 320, riskLevel: 'critical', lastAudit: '2026-06-01T08:00:00Z' },
  { id: 's-5', name: 'Café Verde Downtown', type: 'restaurant', lat: 37.7740, lng: -122.4180, estimatedWasteKg: 85, riskLevel: 'medium', lastAudit: null },
  { id: 's-6', name: 'Corporate Tower Bistro', type: 'restaurant', lat: 37.7790, lng: -122.4150, estimatedWasteKg: 120, riskLevel: 'high', lastAudit: '2026-05-25T11:00:00Z' },
  { id: 's-7', name: 'Westside Distribution Hub', type: 'warehouse', lat: 37.7690, lng: -122.4250, estimatedWasteKg: 450, riskLevel: 'high', lastAudit: '2026-05-10T09:00:00Z' },
  { id: 's-8', name: 'Pacific Heights Prep', type: 'school', lat: 37.7910, lng: -122.4360, estimatedWasteKg: 88, riskLevel: 'low', lastAudit: '2026-05-30T13:00:00Z' },
  { id: 's-9', name: 'St. Francis Medical Center', type: 'hospital', lat: 37.7600, lng: -122.4450, estimatedWasteKg: 280, riskLevel: 'critical', lastAudit: '2026-06-02T10:00:00Z' },
  { id: 's-10', name: 'Bayview Office Park', type: 'office', lat: 37.7850, lng: -122.4050, estimatedWasteKg: 55, riskLevel: 'low', lastAudit: null },
  { id: 's-11', name: 'Mission District Kitchen', type: 'restaurant', lat: 37.7640, lng: -122.4160, estimatedWasteKg: 42, riskLevel: 'low', lastAudit: null },
  { id: 's-12', name: 'Richmond Senior Center', type: 'other', lat: 37.7800, lng: -122.4400, estimatedWasteKg: 35, riskLevel: 'low', lastAudit: '2026-04-15T10:00:00Z' },
];

const EARTH_RADIUS_KM = 6371;

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function computeClusters(sites: WasteSite[], radiusKm = 1.5): GeoCluster[] {
  const remaining = [...sites];
  const clusters: GeoCluster[] = [];
  let clusterId = 0;

  while (remaining.length > 0) {
    const seed = remaining.shift()!;
    const members: WasteSite[] = [seed];
    for (let i = remaining.length - 1; i >= 0; i--) {
      if (haversine(seed.lat, seed.lng, remaining[i].lat, remaining[i].lng) <= radiusKm) {
        members.push(remaining.splice(i, 1)[0]);
      }
    }
    if (members.length > 1) {
      const avgLat = members.reduce((s, m) => s + m.lat, 0) / members.length;
      const avgLng = members.reduce((s, m) => s + m.lng, 0) / members.length;
      members.forEach(m => m.clusterId = clusterId);
      clusters.push({
        id: clusterId++,
        center: { lat: avgLat, lng: avgLng },
        count: members.length,
        totalWasteKg: members.reduce((s, m) => s + m.estimatedWasteKg, 0),
        sites: members,
      });
    } else {
      seed.clusterId = -1;
    }
  }
  return clusters;
}

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'critical': return '#f87171';
    case 'high': return '#fbbf24';
    case 'medium': return '#60a5fa';
    default: return '#34d399';
  }
}

export function getTypeIcon(type: string): string {
  switch (type) {
    case 'school': return '🏫';
    case 'hospital': return '🏥';
    case 'restaurant': return '🍽️';
    case 'office': return '🏢';
    case 'warehouse': return '🏭';
    case 'home': return '🏠';
    default: return '📍';
  }
}
