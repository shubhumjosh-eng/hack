export interface WasteCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  typicalPercentage: number;
  compostable: boolean;
  recyclable: boolean;
  interventions: string[];
}

export interface WasteStreamBreakdown {
  category: string;
  amountKg: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface WasteTrendPoint {
  date: string;
  total: number;
  categories: { name: string; amount: number }[];
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  { id: 'prep', name: 'Prep Waste', icon: '🔪', color: '#fbbf24', description: 'Food waste generated during meal preparation — peels, trimmings, spoiled ingredients', typicalPercentage: 0.30, compostable: true, recyclable: false, interventions: ['Reduce over-portioning in recipes', 'Train staff on trimming techniques', 'Use scraps for stock or compost', 'Implement just-in-time prep scheduling'] },
  { id: 'plate', name: 'Plate Waste', icon: '🍽️', color: '#f87171', description: 'Food served but not eaten by patrons — the largest source of waste in most cafeterias', typicalPercentage: 0.35, compostable: true, recyclable: false, interventions: ['Offer customizable portion sizes', 'Run taste-testing sessions', 'Implement trayless dining', 'Collect feedback on unpopular dishes'] },
  { id: 'spoilage', name: 'Spoilage', icon: '🧊', color: '#60a5fa', description: 'Food that expired or spoiled before use — often from over-ordering or poor inventory rotation', typicalPercentage: 0.15, compostable: true, recyclable: false, interventions: ['Implement FIFO inventory system', 'Reduce order quantities', 'Monitor temperature logs', 'Use smart inventory sensors'] },
  { id: 'packaging', name: 'Packaging', icon: '📦', color: '#a78bfa', description: 'Non-food waste from packaging — cardboard, plastic wrap, containers, utensils', typicalPercentage: 0.10, compostable: false, recyclable: true, interventions: ['Switch to bulk dispensers', 'Eliminate single-use plastics', 'Install recycling stations', 'Negotiate take-back programs with suppliers'] },
  { id: 'organic', name: 'Organic Non-Food', icon: '🌿', color: '#34d399', description: 'Non-food organic waste — napkins, paper towels, wooden utensils, compostable packaging', typicalPercentage: 0.07, compostable: true, recyclable: false, interventions: ['Switch to compostable serviceware', 'Train staff on compost sorting', 'Install compost bins', 'Partner with compost facility'] },
  { id: 'other', name: 'Other', icon: '🗑️', color: '#94a3b8', description: 'Miscellaneous waste — non-recyclable, non-compostable items', typicalPercentage: 0.03, compostable: false, recyclable: false, interventions: ['Audit waste stream to identify reduction opportunities', 'Work with vendors to reduce packaging', 'Educate staff on proper sorting'] },
];

export function computeWasteBreakdown(totalKg: number, seed?: number): WasteStreamBreakdown[] {
  const rng = seed ?? Math.random();
  return WASTE_CATEGORIES.map((cat, i) => {
    const variance = (Math.sin(rng * 100 + i * 7) * 0.3 + 1);
    const pct = Math.min(cat.typicalPercentage * variance, 0.6);
    const trendRand = Math.sin(rng * 200 + i * 13);
    return {
      category: cat.name,
      amountKg: Math.round(totalKg * pct * 100) / 100,
      percentage: Math.round(pct * 10000) / 100,
      trend: trendRand > 0.3 ? 'up' : trendRand < -0.3 ? 'down' : 'stable',
      trendPercent: Math.round(Math.abs(trendRand) * 15 * 10) / 10,
    };
  }).sort((a, b) => b.amountKg - a.amountKg);
}

export function generateTrendData(days: number): WasteTrendPoint[] {
  const data: WasteTrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const base = 50 + Math.sin(i * 0.3) * 20 + Math.random() * 15;
    data.push({
      date: d.toISOString().split('T')[0],
      total: Math.round(base * 10) / 10,
      categories: WASTE_CATEGORIES.map((cat, ci) => ({
        name: cat.name,
        amount: Math.round(base * cat.typicalPercentage * (0.8 + Math.random() * 0.4) * 10) / 10,
      })),
    });
  }
  return data;
}

export const MENU_TAGS: { tag: string; categories: string[] }[] = [
  { tag: 'soup', categories: ['Prep Waste'] },
  { tag: 'salad', categories: ['Prep Waste', 'Plate Waste'] },
  { tag: 'pasta', categories: ['Plate Waste'] },
  { tag: 'pizza', categories: ['Plate Waste'] },
  { tag: 'grill', categories: ['Prep Waste', 'Plate Waste'] },
  { tag: 'breakfast', categories: ['Plate Waste'] },
  { tag: 'vegetarian', categories: ['Prep Waste'] },
  { tag: 'seafood', categories: ['Spoilage'] },
  { tag: 'dairy', categories: ['Spoilage'] },
  { tag: 'frozen', categories: ['Packaging'] },
];
