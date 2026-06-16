import type { TourStep } from './page-tour'

// Tour configs for each page
// Each step's `selector` is a CSS selector that targets an element on the page.
// Add `data-tour="step-id"` attributes to elements to make them easy to target.

export const DASHBOARD_TOUR: TourStep[] = [
  {
    selector: '[data-tour="dashboard-meal"]',
    title: 'Meal Type',
    description: 'Select the type of meal you are predicting — breakfast, lunch, or dinner. This affects portion sizes and waste patterns.',
    placement: 'right',
  },
  {
    selector: '[data-tour="dashboard-headcount"]',
    title: 'Expected Attendance',
    description: 'Enter the number of people expected to be served. More people means more potential waste to predict and prevent.',
    placement: 'right',
  },
  {
    selector: '[data-tour="dashboard-model"]',
    title: 'Choose a Prediction Model',
    description: 'Pick from 5 ML models: Random Forest (best accuracy), XGBoost, Neural Net, LLM, or Linear Regression. Higher accuracy models take longer to run.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="dashboard-predict-btn"]',
    title: 'Run Prediction',
    description: 'Click to run the AI prediction. The model will analyze your inputs and forecast waste amounts, confidence scores, and interventions.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="dashboard-results"]',
    title: 'Prediction Results',
    description: 'Your results appear here: predicted waste (kg), confidence score, CO₂ impact, and ranked interventions with cost savings. Review and approve before acting.',
    placement: 'left',
  },
]

export const TRIAGE_TOUR: TourStep[] = [
  {
    selector: '[data-tour="triage-input"]',
    title: 'Situation Report Input',
    description: 'Paste or type any environmental situation report — cafeteria observations, waste audit notes, or incident descriptions. The AI will analyze it.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="triage-analyze-btn"]',
    title: 'Analyze Button',
    description: 'Click to submit your text for AI analysis. EcoOS will extract key findings, assess risk levels, and generate ranked interventions.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="triage-results"]',
    title: 'Analysis Results',
    description: 'View structured environmental analysis: detected issues, risk levels, impact scores, and actionable interventions with priority rankings.',
    placement: 'left',
  },
]

export const ANALYTICS_TOUR: TourStep[] = [
  {
    selector: '[data-tour="analytics-filters"]',
    title: 'Date Range & Filters',
    description: 'Filter analytics by date range and waste category. Narrow down to see trends for specific periods or waste types.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="analytics-chart"]',
    title: 'Waste Trend Chart',
    description: 'Visualize waste generation over time. The chart shows daily totals, trend lines, and seasonal patterns to help identify peak waste periods.',
    placement: 'left',
  },
  {
    selector: '[data-tour="analytics-metrics"]',
    title: 'Environmental Metrics',
    description: 'See your impact in relatable terms: CO₂ emissions, landfill diversion rate, garbage trucks worth of waste, and trees needed to offset your footprint.',
    placement: 'top',
  },
]

export const WASTE_STREAMS_TOUR: TourStep[] = [
  {
    selector: '[data-tour="waste-categories"]',
    title: 'Waste Categories',
    description: 'Browse waste broken down by 6 categories: Pre-Consumer Food, Post-Consumer Food, Packaging, Compostable, Recyclables, and Landfill.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="waste-trends"]',
    title: 'Category Trends',
    description: 'Each category shows a trend bar indicating whether waste is increasing or decreasing. Green = improving, red = worsening.',
    placement: 'left',
  },
  {
    selector: '[data-tour="waste-interventions"]',
    title: 'Recommended Interventions',
    description: 'For each waste stream, see targeted interventions with estimated cost savings and environmental impact.',
    placement: 'top',
  },
]

export const GEO_MAP_TOUR: TourStep[] = [
  {
    selector: '[data-tour="geo-map-container"]',
    title: 'Hong Kong Waste Map',
    description: 'This map shows all tracked waste sites across Hong Kong. Each dot represents a location generating waste — hover to see name, click for details.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="geo-filter"]',
    title: 'Risk Filter & Clusters',
    description: 'Filter sites by risk level (low, medium, high, critical). Toggle clusters on/off to group nearby sites or view them individually.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="geo-detail"]',
    title: 'Site Detail Panel',
    description: 'Click a dot on the map to see site details: waste amount, risk level, last audit date, and annual projections. Use this to decide where to act.',
    placement: 'left',
  },
]

export const SCHEDULES_TOUR: TourStep[] = [
  {
    selector: '[data-tour="schedules-list"]',
    title: 'Audit Schedules',
    description: 'View all your recurring waste audit schedules. Each entry shows frequency (daily/weekly/monthly), last run time, and next scheduled run.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="schedules-create"]',
    title: 'Create Schedule',
    description: 'Set up a new cron-based audit schedule. Choose frequency, time of day, and which waste streams to audit automatically.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="schedules-alerts"]',
    title: 'Threshold Alerts',
    description: 'Configure alerts that fire when waste exceeds a threshold. Notifications can be sent via email, Slack, or webhook.',
    placement: 'left',
  },
]

export const IMPORT_TOUR: TourStep[] = [
  {
    selector: '[data-tour="import-upload"]',
    title: 'File Upload',
    description: 'Upload a CSV file containing waste data. The wizard supports waste records, site data, and audit logs.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="import-map"]',
    title: 'Column Mapping',
    description: 'Map your CSV columns to EcoOS fields. The system auto-detects common column names to save you time.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="import-preview"]',
    title: 'Preview & Complete',
    description: 'Review a sample of your imported data before committing. Check for errors, then click Complete to save everything.',
    placement: 'top',
  },
]

export const API_KEYS_TOUR: TourStep[] = [
  {
    selector: '[data-tour="apikeys-list"]',
    title: 'Your API Keys',
    description: 'Manage API keys for programmatic access. Each key has a name, masked value, and creation date. Keys grant access to the EcoOS API.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="apikeys-create"]',
    title: 'Create New Key',
    description: 'Generate a new API key. Give it a descriptive name so you know which service uses it. Keys are shown once — copy and store them securely.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="apikeys-webhooks"]',
    title: 'Webhook Configuration',
    description: 'Set up webhooks to receive real-time notifications when predictions complete, anomalies are detected, or schedules run.',
    placement: 'left',
  },
]

export const SETTINGS_TOUR: TourStep[] = [
  {
    selector: '[data-tour="settings-api"]',
    title: 'API Configuration',
    description: 'Enter your Hugging Face API key to enable LLM-based predictions and triage. The key starts with "hf_". Test connection to verify it works.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="settings-themes"]',
    title: 'Terminal Themes',
    description: 'Choose from 6 visual themes for the terminal interface: Emerald, Amber, Blue, Red, Retro CRT, or High Contrast. Click any theme to apply it instantly.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="settings-notifications"]',
    title: 'Notification Preferences',
    description: 'Toggle which alerts you receive: weekly waste summaries, anomaly detection, daily digest, and model status changes.',
    placement: 'left',
  },
  {
    selector: '[data-tour="settings-export"]',
    title: 'Data Management',
    description: 'Export all your data as CSV for external analysis, or retrain the prediction model with your latest waste data to improve accuracy.',
    placement: 'top',
  },
]
