export interface PredictionInput {
  dayOfWeek: string;
  scheduledMenu: string;
  expectedAttendance: number;
  weatherCondition: string;
  temperature?: number;
}

export interface PredictionResult {
  predictedWasteKg: number;
  actionableInterventions: string[];
  riskWarning: string;
  humanInTheLoopAction: string;
  metadata: {
    modelUsed: string;
    latencyMs: number;
    processedAt: string;
    inputSnapshot: PredictionInput;
  };
}

export interface EnvironmentalIntent {
  category: 'waste' | 'emission' | 'water' | 'energy' | 'biodiversity' | 'unknown';
  confidence: number;
  subcategory: string;
}

export interface GeoLocation {
  name: string;
  type: 'school' | 'hospital' | 'restaurant' | 'office' | 'warehouse' | 'home' | 'other';
  estimatedScale: 'small' | 'medium' | 'large';
}

export interface ActionItem {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  environmentalImpact: string;
  estimatedSavings: string;
  effort: 'quick' | 'moderate' | 'significant';
}

export interface AIRecommendation {
  summary: string;
  reasoning: string[];
  nextSteps: string[];
  impactProjection: {
    wasteReduction: string;
    costSavings: string;
    co2Reduction: string;
  };
}

export interface TriageResult {
  rawInput: string;
  processedAt: string;
  environmentalIntent: EnvironmentalIntent;
  locations: GeoLocation[];
  actions: ActionItem[];
  recommendation: AIRecommendation;
  modelUsed: string;
  latencyMs: number;
}

export interface TriageInput {
  text: string;
  source?: string;
}

export interface DashboardHistoryEntry {
  id: string;
  input: PredictionInput;
  result: PredictionResult;
  timestamp: string;
}
