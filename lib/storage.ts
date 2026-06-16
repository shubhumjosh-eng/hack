const PREDICTIONS_KEY = 'ecoos-predictions';
const TRIAGES_KEY = 'ecoos-triages';
const SETTINGS_KEY = 'ecoos-settings';
const SEED_KEY = 'ecoos-seeded';

const DEMO_ENTRIES = [
  { id: 'demo-1', timestamp: '2026-06-16T08:00:00Z', input: { dayOfWeek: 'Monday', scheduledMenu: 'Pepperoni pizza with side salad', expectedAttendance: 520, weatherCondition: 'Sunny', temperature: 78 }, result: { predictedWasteKg: 42.3, actionableInterventions: ['Reduce pizza production by 15% on Mondays', 'Pre-slice pizzas to control portions', 'Offer salad-only option for lighter eaters'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'Review Monday production numbers with kitchen staff before adjusting supplier orders. Consider a 2-week trial of reduced pizza orders.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 847, processedAt: '2026-06-16T08:00:00Z', inputSnapshot: { dayOfWeek: 'Monday', scheduledMenu: 'Pepperoni pizza with side salad', expectedAttendance: 520, weatherCondition: 'Sunny', temperature: 78 } } } },
  { id: 'demo-2', timestamp: '2026-06-15T12:15:00Z', input: { dayOfWeek: 'Tuesday', scheduledMenu: 'Beef tacos with rice and beans', expectedAttendance: 410, weatherCondition: 'Cloudy', temperature: 65 }, result: { predictedWasteKg: 28.7, actionableInterventions: ['Reduce rice portions by 10% — consistently leftover', 'Add a salsa bar to increase taco appeal', 'Offer bean-only option for vegetarian students'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'Test reduced rice portions for one week and track waste changes before committing to permanent change.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 723, processedAt: '2026-06-15T12:15:00Z', inputSnapshot: { dayOfWeek: 'Tuesday', scheduledMenu: 'Beef tacos with rice and beans', expectedAttendance: 410, weatherCondition: 'Cloudy', temperature: 65 } } } },
  { id: 'demo-3', timestamp: '2026-06-14T11:45:00Z', input: { dayOfWeek: 'Wednesday', scheduledMenu: 'Grilled chicken with rice and vegetables', expectedAttendance: 380, weatherCondition: 'Rainy', temperature: 58 }, result: { predictedWasteKg: 35.1, actionableInterventions: ['Reduce vegetable portions — broccoli and carrots consistently left behind', 'Add dipping sauce station to increase vegetable consumption', 'Switch to roasted vegetables for better appeal in rainy weather'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'Conduct a 1-week taste test of roasted vs steamed vegetables to determine student preference before menu changes.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 691, processedAt: '2026-06-14T11:45:00Z', inputSnapshot: { dayOfWeek: 'Wednesday', scheduledMenu: 'Grilled chicken with rice and vegetables', expectedAttendance: 380, weatherCondition: 'Rainy', temperature: 58 } } } },
  { id: 'demo-4', timestamp: '2026-06-13T10:30:00Z', input: { dayOfWeek: 'Thursday', scheduledMenu: 'Fish filet with mashed potatoes', expectedAttendance: 290, weatherCondition: 'Windy', temperature: 62 }, result: { predictedWasteKg: 51.2, actionableInterventions: ['Fish filet has lowest consumption rate — consider alternating with chicken tenders', 'Reduce fish order by 30% on Thursdays', 'Offer mac and cheese as alternative entree'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'Survey students on fish vs chicken preference. Trial a 50/50 split for 2 weeks and compare waste data.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 756, processedAt: '2026-06-13T10:30:00Z', inputSnapshot: { dayOfWeek: 'Thursday', scheduledMenu: 'Fish filet with mashed potatoes', expectedAttendance: 290, weatherCondition: 'Windy', temperature: 62 } } } },
  { id: 'demo-5', timestamp: '2026-06-12T09:20:00Z', input: { dayOfWeek: 'Friday', scheduledMenu: 'Chicken tenders with french fries', expectedAttendance: 650, weatherCondition: 'Sunny', temperature: 85 }, result: { predictedWasteKg: 18.4, actionableInterventions: ['Popular menu — maintain current production levels', 'Consider adding a fruit cup option to improve nutrition', 'Monitor closely — high attendance days amplify any waste inefficiency'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'No action required at this time. Continue monitoring Friday production and track any attendance trends.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 812, processedAt: '2026-06-12T09:20:00Z', inputSnapshot: { dayOfWeek: 'Friday', scheduledMenu: 'Chicken tenders with french fries', expectedAttendance: 650, weatherCondition: 'Sunny', temperature: 85 } } } },
  { id: 'demo-6', timestamp: '2026-06-11T14:00:00Z', input: { dayOfWeek: 'Wednesday', scheduledMenu: 'Spaghetti with marinara and garlic bread', expectedAttendance: 445, weatherCondition: 'Cloudy', temperature: 70 }, result: { predictedWasteKg: 31.9, actionableInterventions: ['Garlic bread consistently overproduced — cut by 20%', 'Offer half-portion spaghetti option for smaller appetites', 'Add a side salad option to improve meal balance'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'Trial reduced garlic bread production for 1 week. Track waste difference and student feedback.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 734, processedAt: '2026-06-11T14:00:00Z', inputSnapshot: { dayOfWeek: 'Wednesday', scheduledMenu: 'Spaghetti with marinara and garlic bread', expectedAttendance: 445, weatherCondition: 'Cloudy', temperature: 70 } } } },
  { id: 'demo-7', timestamp: '2026-06-10T08:45:00Z', input: { dayOfWeek: 'Tuesday', scheduledMenu: 'Fresh salad bar with grilled chicken', expectedAttendance: 310, weatherCondition: 'Sunny', temperature: 82 }, result: { predictedWasteKg: 22.6, actionableInterventions: ['Salad bar items have even consumption — maintain current setup', 'Add seasonal fruits to keep the bar fresh and appealing', 'Consider pre-boxed salads for faster service'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'No immediate changes needed. Monitor salad bar waste weekly as seasons change.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 689, processedAt: '2026-06-10T08:45:00Z', inputSnapshot: { dayOfWeek: 'Tuesday', scheduledMenu: 'Fresh salad bar with grilled chicken', expectedAttendance: 310, weatherCondition: 'Sunny', temperature: 82 } } } },
  { id: 'demo-8', timestamp: '2026-06-09T11:30:00Z', input: { dayOfWeek: 'Thursday', scheduledMenu: 'Mac and cheese with broccoli', expectedAttendance: 495, weatherCondition: 'Rainy', temperature: 55 }, result: { predictedWasteKg: 26.3, actionableInterventions: ['Mac and cheese is popular — maintain portions', 'Broccoli waste is moderate — offer broccoli-cheese blend for better acceptance', 'Rainy days see higher comfort food consumption — slight production increase warranted'], riskWarning: 'Synthetic benchmark data — actual results vary by school district demographics and seasonal menu changes.', humanInTheLoopAction: 'Test broccoli-cheese blend for 2 weeks and compare waste with current steamed broccoli.', metadata: { modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 778, processedAt: '2026-06-09T11:30:00Z', inputSnapshot: { dayOfWeek: 'Thursday', scheduledMenu: 'Mac and cheese with broccoli', expectedAttendance: 495, weatherCondition: 'Rainy', temperature: 55 } } } },
];

export interface SavedSettings {
  apiKey: string;
  model: string;
  notifications: { label: string; enabled: boolean }[];
}

export function getPredictions(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PREDICTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPrediction(prediction: any): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getPredictions();
    existing.unshift(prediction);
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // storage full or unavailable
  }
}

export function seedDemoData(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(SEED_KEY) === 'true') return false;
    const existing = getPredictions();
    if (existing.length > 0) return false;
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(DEMO_ENTRIES));
    localStorage.setItem(SEED_KEY, 'true');
    return true;
  } catch {
    return false;
  }
}

export function getSettings(): SavedSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings: SavedSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // storage full or unavailable
  }
}

// --- Triage History ---

export function getTriages(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TRIAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTriage(entry: any): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getTriages();
    existing.unshift(entry);
    localStorage.setItem(TRIAGES_KEY, JSON.stringify(existing.slice(0, 50)));
  } catch {
    // storage full
  }
}

const DEMO_TRIAGES = [
  { id: 'tdemo-1', timestamp: '2026-06-16T08:30:00Z', input: { text: 'The school cafeteria throws away about 40 pounds of food every single day after lunch. Mostly untouched fruit and milk cartons.' }, result: { rawInput: 'The school cafeteria throws away about 40 pounds of food every single day after lunch. Mostly untouched fruit and milk cartons.', processedAt: '2026-06-16T08:30:00Z', environmentalIntent: { category: 'waste', confidence: 0.92, subcategory: 'Cafeteria post-consumer food waste — primarily untouched fruits and dairy' }, locations: [{ name: 'School cafeteria', type: 'school', estimatedScale: 'medium' }], actions: [{ id: 'a-1', description: 'Implement a share table for unopened fruit and milk', priority: 'high', environmentalImpact: 'Reduces food waste by 30% in pilot schools', estimatedSavings: '~$4,500/year', effort: 'quick' }, { id: 'a-2', description: 'Switch to served fruit cups instead of whole fruit', priority: 'medium', environmentalImpact: 'Students eat 60% more when fruit is pre-cut', estimatedSavings: '~$2,000/year', effort: 'moderate' }, { id: 'a-3', description: 'Start a composting program for unavoidable waste', priority: 'medium', environmentalImpact: 'Keeps 8 tonnes/year out of landfill', estimatedSavings: '~$1,200/year in disposal fees', effort: 'significant' }], recommendation: { summary: 'This is a classic post-consumer waste pattern with easy wins.', reasoning: ['Untouched fruit indicates portion size or presentation issue', 'Milk cartons suggest students want variety or lactose-free options', '40 lbs/day is moderate — share table could capture 50%+'], nextSteps: ['Launch share table trial (1 week)', 'Survey students on fruit/milk preferences', 'Track waste before/after for 2 weeks'], impactProjection: { wasteReduction: '30-50% reduction', costSavings: '$3,000-$5,000/year', co2Reduction: '2-4 tonnes CO₂e/year' } }, modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 934 } },
  { id: 'tdemo-2', timestamp: '2026-06-15T14:00:00Z', input: { text: 'Our hospital kitchen preps too much food — 60kg of sealed sandwiches and yogurt goes in the bin every evening.' }, result: { rawInput: 'Our hospital kitchen preps too much food — 60kg of sealed sandwiches and yogurt goes in the bin every evening.', processedAt: '2026-06-15T14:00:00Z', environmentalIntent: { category: 'waste', confidence: 0.88, subcategory: 'Hospital food service overproduction — sealed packaged goods' }, locations: [{ name: 'Hospital kitchen', type: 'hospital', estimatedScale: 'large' }], actions: [{ id: 'b-1', description: 'Implement just-in-time preparation based on patient census', priority: 'critical', environmentalImpact: 'Reduces overproduction by up to 40%', estimatedSavings: '~$18,000/year', effort: 'moderate' }, { id: 'b-2', description: 'Donate sealed untouched food to local shelters', priority: 'high', environmentalImpact: 'Keeps 10+ tonnes/year edible', estimatedSavings: 'Tax benefits ~$3,000/year', effort: 'quick' }], recommendation: { summary: 'Sealed packaged food has high recovery potential — donation is viable and cost-effective.', reasoning: ['Sealed sandwiches/yogurt are safely recoverable', 'Hospitals have predictable census data for JIT prep', 'Evening discard suggests poor demand forecasting'], nextSteps: ['Contact local food recovery org', 'Integrate census data with kitchen prep system', 'Set up donation pickup schedule'], impactProjection: { wasteReduction: '50-65% reduction', costSavings: '$15,000-$22,000/year', co2Reduction: '8-12 tonnes CO₂e/year' } }, modelUsed: 'meta-llama/Llama-3.1-8B-Instruct:fastest', latencyMs: 872 } },
];

export function seedDemoTriages(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('ecoos-triages-seeded') === 'true') return false;
    const existing = getTriages();
    if (existing.length > 0) return false;
    localStorage.setItem(TRIAGES_KEY, JSON.stringify(DEMO_TRIAGES));
    localStorage.setItem('ecoos-triages-seeded', 'true');
    return true;
  } catch {
    return false;
  }
}
