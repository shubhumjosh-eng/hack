import { LayoutDashboard, Search, BarChart3, Layers, MapPin, Clock, Upload, Settings } from 'lucide-react'

export interface TourStep {
  id: string
  title: string
  description: string
  detail: string
  icon: React.ReactNode
  href: string
}

const iconClass = "h-5 w-5"

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard — AI Prediction Engine',
    description: 'Predict food waste before it happens.',
    detail: 'Select one of 5 ML models (Random Forest, XGBoost, Linear Regression, Neural Net, or LLM), enter 5 parameters (meal type, headcount, prep method, etc.), and get instant waste predictions with confidence scores and actionable interventions.',
    icon: <LayoutDashboard className={iconClass} />,
    href: '/dashboard',
  },
  {
    id: 'triage',
    title: 'Triage — Text Analysis',
    description: 'Turn raw reports into structured action plans.',
    detail: 'Paste any environmental situation report — cafeteria observations, waste audit notes, incident descriptions — and EcoOS will analyze it, extract key findings, assess risk, and generate ranked interventions with cost savings.',
    icon: <Search className={iconClass} />,
    href: '/triage',
  },
  {
    id: 'analytics',
    title: 'Analytics — Trends & Metrics',
    description: 'Visualize waste patterns over time.',
    detail: 'Track waste generation trends, carbon footprint (CO₂e), landfill diversion rates, and environmental impact in relatable metrics like garbage trucks, trees needed, and homes powered. Filter by date range and waste category.',
    icon: <BarChart3 className={iconClass} />,
    href: '/analytics',
  },
  {
    id: 'waste-streams',
    title: 'Waste Streams — Category Breakdown',
    description: 'See exactly what is being wasted.',
    detail: 'Break down waste by 6 categories: Pre-Consumer Food, Post-Consumer Food, Packaging, Compostable, Recyclables, and Landfill. Each category shows daily totals, trend direction, and recommended interventions.',
    icon: <Layers className={iconClass} />,
    href: '/waste-streams',
  },
  {
    id: 'geo-map',
    title: 'Geo Map — Spatial Waste View',
    description: 'Find high-risk sites across your facilities.',
    detail: 'A map of all tracked waste sites. Click dots for site details (name, waste amount, risk level, last audit). Dashed circles = clusters of nearby sites. Filter by risk level. Larger dots = more waste. Use it to decide where to deploy interventions.',
    icon: <MapPin className={iconClass} />,
    href: '/geo-map',
  },
  {
    id: 'schedules',
    title: 'Schedules — Automated Audits',
    description: 'Set recurring waste audits and alerts.',
    detail: 'Create cron-based audit schedules (daily, weekly, monthly), configure threshold alerts for anomalies, and route notifications via email, Slack, or webhook. Never miss a waste audit again.',
    icon: <Clock className={iconClass} />,
    href: '/schedules',
  },
  {
    id: 'import',
    title: 'Data Import — CSV Wizard',
    description: 'Bulk-import waste data from any source.',
    detail: 'A 4-step import wizard: upload CSV → auto-map column headers → preview records → complete import. Download a template to get started. Supports waste records, site data, and audit logs.',
    icon: <Upload className={iconClass} />,
    href: '/import',
  },
  {
    id: 'settings',
    title: 'Settings — Configure Everything',
    description: 'API keys, themes, notifications, and models.',
    detail: 'Connect your Hugging Face API key, choose from 6 terminal themes (Emerald, Amber, Blue, Red, Retro, High Contrast), toggle notification preferences, view model portfolio with accuracy metrics, export data, and retrain prediction models.',
    icon: <Settings className={iconClass} />,
    href: '/settings',
  },
]
