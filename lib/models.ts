export interface ModelDefinition {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latencyMs: number;
  trainingSize: number;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  type: 'linear' | 'ensemble' | 'neural' | 'llm';
}

export const MODELS: ModelDefinition[] = [
  {
    id: 'rf-2026a',
    name: 'Random Forest v2026a',
    description: 'Ensemble of 500 decision trees trained on institutional food waste data. Best general-purpose predictor.',
    accuracy: 0.937,
    precision: 0.921,
    recall: 0.908,
    f1Score: 0.914,
    latencyMs: 85,
    trainingSize: 12400,
    features: ['day_of_week', 'menu_embedding', 'attendance', 'weather', 'temp', 'seasonality', 'holiday_flag', 'menu_similarity'],
    strengths: ['Handles non-linear relationships', 'Robust to outliers', 'Feature importance built-in', 'Low variance'],
    weaknesses: ['Slower inference than linear models', 'Less interpretable than linear regression', 'Can overfit on small datasets'],
    type: 'ensemble',
  },
  {
    id: 'xgb-2026b',
    name: 'XGBoost v2026b',
    description: 'Gradient-boosted trees with optimized hyperparameters. Slightly higher accuracy than RF.',
    accuracy: 0.948,
    precision: 0.935,
    recall: 0.922,
    f1Score: 0.928,
    latencyMs: 120,
    trainingSize: 12400,
    features: ['day_of_week', 'menu_embedding', 'attendance', 'weather', 'temp', 'seasonality', 'holiday_flag', 'menu_similarity', 'hour_of_day'],
    strengths: ['Highest accuracy', 'Handles missing data well', 'Regularized to prevent overfitting', 'Parallel processing'],
    weaknesses: ['More hyperparameters to tune', 'Higher memory usage', 'Slower training time'],
    type: 'ensemble',
  },
  {
    id: 'lr-2026c',
    name: 'Linear Regression v2026c',
    description: 'Baseline OLS regression with feature engineering. Fast inference, fully interpretable.',
    accuracy: 0.872,
    precision: 0.864,
    recall: 0.858,
    f1Score: 0.861,
    latencyMs: 12,
    trainingSize: 12400,
    features: ['day_of_week', 'attendance', 'weather', 'temp'],
    strengths: ['Extremely fast inference', 'Fully interpretable coefficients', 'Low memory footprint', 'Great baseline'],
    weaknesses: ['Assumes linear relationships', 'Lower accuracy', 'Requires manual feature engineering'],
    type: 'linear',
  },
  {
    id: 'nn-2026d',
    name: 'Neural Network v2026d',
    description: '3-layer MLP with ReLU activations and dropout. Captures complex patterns.',
    accuracy: 0.924,
    precision: 0.911,
    recall: 0.903,
    f1Score: 0.907,
    latencyMs: 45,
    trainingSize: 12400,
    features: ['day_of_week', 'menu_embedding', 'attendance', 'weather', 'temp', 'seasonality', 'holiday_flag', 'menu_similarity', 'hour_of_day', 'week_of_year'],
    strengths: ['Captures complex interactions', 'Scales well with more data', 'Low latency once trained', 'Flexible architecture'],
    weaknesses: ['Requires more training data', 'Black-box / less interpretable', 'Needs hyperparameter tuning', 'Can overfit without regularization'],
    type: 'neural',
  },
  {
    id: 'llm-2026e',
    name: 'LLM Few-Shot v2026e',
    description: 'Meta Llama 3.1 8B with few-shot prompting. Best for zero-shot adaptation to new kitchens.',
    accuracy: 0.903,
    precision: 0.895,
    recall: 0.884,
    f1Score: 0.889,
    latencyMs: 1200,
    trainingSize: 5,
    features: ['full_menu_text', 'day_of_week', 'attendance', 'weather', 'temp'],
    strengths: ['Zero-shot generalization', 'Understands menu semantics', 'Provides reasoning', 'Adapts to new contexts'],
    weaknesses: ['High latency (~1.2s)', 'API cost per inference', 'Less consistent output', 'Harder to validate'],
    type: 'llm',
  },
];

export function getModel(id: string): ModelDefinition {
  return MODELS.find(m => m.id === id) ?? MODELS[0];
}

export const DEFAULT_MODEL = 'rf-2026a';
