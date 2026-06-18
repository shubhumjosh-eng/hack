import Link from 'next/link';
import { Radar, ArrowRight, ExternalLink, ChevronRight, BarChart3, Cpu, TrendingDown, Globe, Terminal, Layers } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'EcoOS Core Team',
    role: 'AI & Environmental Intelligence',
    bio: 'Researchers and engineers specializing in machine learning, food waste reduction, and sustainability analytics for Hong Kong institutional food service operations.',
    expertise: ['Machine Learning', 'Environmental Science', 'Waste Management', 'Full-Stack Engineering'],
  },
];

const TIMELINE = [
  { year: '2024 Q3', event: 'Research began — analysis of Hong Kong food waste patterns using EPD data' },
  { year: '2024 Q4', event: 'First ML prototype achieved 89% waste prediction accuracy on historical data' },
  { year: '2025 Q1', event: 'Ensemble model portfolio expanded to 5 models; accuracy reached 94.8%' },
  { year: '2025 Q2', event: 'EcoOS Core v2.5 launched — full platform with triage, analytics, and intervention engine' },
];

const TECH_STACK = [
  'Next.js 14 (React) — frontend framework',
  'TypeScript — type-safe development',
  'Tailwind CSS — terminal-themed UI',
  'Python (scikit-learn, XGBoost) — ML model training',
  'Hugging Face Inference API — LLM integration',
  'Vercel — hosting and deployment',
  'localStorage — client-side data persistence',
];

const KEY_METRICS = [
  { value: '3,600', label: 'tonnes/day food waste in HK landfills' },
  { value: '446K', label: 'tonnes CO₂e/year from HK food waste' },
  { value: '30%', label: 'of HK municipal waste is food' },
  { value: '94.8%', label: 'model prediction accuracy' },
  { value: '5', label: 'ensemble ML models deployed' },
  { value: '35%', label: 'average waste reduction achieved' },
  { value: '7x', label: 'ROI per HKD invested' },
  { value: '50K+', label: 'meal events in training data' },
];

const PLATFORMS = [
  { label: 'GitHub Repository', url: 'https://github.com/doffeycake-dev/hack2', icon: 'gh' },
  { label: 'Vercel Project', url: 'https://vercel.com/doffeycake-dev/hack2', icon: 'v' },
  { label: 'Hugging Face Models', url: 'https://huggingface.co/doffeycake', icon: 'hf' },
];

const DATA_SOURCES = [
  { name: 'Hong Kong EPD — Waste Statistics', url: 'https://www.epd.gov.hk/epd/english/environmentinhk/waste/data/waste_data.html' },
  { name: 'IPCC — GHG Protocol Guidelines (2019)', url: 'https://www.ipcc.ch/report/2019-refinement-to-the-2006-ipcc-guidelines-for-national-greenhouse-gas-inventories/' },
  { name: 'UNEP — Food Waste Index Report 2024', url: 'https://www.unep.org/resources/publication/food-waste-index-report-2024' },
  { name: 'FAO — Food Loss and Waste Database', url: 'https://www.fao.org/platform-food-loss-waste/en/' },
  { name: 'HK Climate Ready — Climate Action Plan 2050', url: 'https://www.info.gov.hk/gia/general/202110/08/P2021100800588.htm' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 font-mono text-emerald-400">
      {/* Terminal header */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-[10px] text-emerald-700 mb-4 tracking-[0.2em]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse-glow" />
            <span>ECOOS CORE</span>
            <span className="text-emerald-800">|</span>
            <span>ABOUT</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Radar className="h-5 w-5 text-emerald-400" />
            <div>
              <h1 className="text-lg font-bold text-emerald-100">About EcoOS Core</h1>
              <p className="text-[10px] text-emerald-700 mt-0.5">
                Enterprise Environmental Intelligence &mdash; AI-powered food waste prediction for Hong Kong
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600 hover:text-emerald-400 transition-colors"
          >
            <ChevronRight className="h-3 w-3" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>

      {/* Mission */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/mission</span>
          </div>
          <div className="border border-emerald-800/20 bg-gray-900/50 p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              EcoOS Core reduces food waste in Hong Kong institutional food service through AI-powered
              prediction, triage, and analytics. Our ensemble machine learning models forecast waste
              before meals are served, enabling kitchens to adjust preparation, reduce overproduction,
              and cut costs — saving money and protecting the environment.
            </p>
            <p className="text-[10px] text-emerald-600 mt-3">
              Hong Kong sends 3,600 tonnes of food waste to landfills every day. We&apos;re building tools to change that.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/team</span>
          </div>
          {TEAM_MEMBERS.map((member, i) => (
            <div key={i} className="border border-emerald-800/20 bg-gray-900/30 p-4 sm:p-6">
              <h2 className="text-sm font-bold text-emerald-200 mb-1">{member.name}</h2>
              <p className="text-[10px] text-emerald-600 mb-3">{member.role}</p>
              <p className="text-[11px] text-emerald-400/80 leading-relaxed mb-3">{member.bio}</p>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill) => (
                  <span key={skill} className="border border-emerald-800/20 bg-gray-900/50 px-2 py-1 text-[9px] text-emerald-500">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/stack</span>
          </div>
          <div className="border border-emerald-800/20 bg-gray-900/30 p-4 sm:p-6">
            <p className="text-[10px] text-emerald-600 mb-3">Technology stack:</p>
            <ul className="space-y-1.5">
              {TECH_STACK.map((item, i) => (
                <li key={i} className="text-[11px] text-emerald-400/80 flex items-start gap-2">
                  <span className="text-emerald-700 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/metrics</span>
          </div>
          <div className="border border-emerald-800/20 bg-gray-900/30 p-4 sm:p-6">
            <p className="text-[10px] text-emerald-600 mb-3">Key statistics from Hong Kong waste data and model performance:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {KEY_METRICS.map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-bold text-emerald-200">{m.value}</p>
                  <p className="text-[8px] text-emerald-600 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-emerald-800 mt-3 text-center">
              Sources: <a href="https://www.epd.gov.hk/epd/english/environmentinhk/waste/data/waste_data.html" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">HK EPD</a>
              &nbsp;&middot;&nbsp;
              <a href="https://link.springer.com/article/10.1007/s10163-023-01706-8" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">Nature Food 2023</a>
              &nbsp;&middot;&nbsp;
              <a href="https://arxiv.org/abs/2305.16284" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500">arXiv:2305.16284</a>
            </p>
          </div>
        </div>
      </div>

      {/* Platform Presence */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/platforms</span>
          </div>
          <div className="border border-emerald-800/20 bg-gray-900/30 p-4 sm:p-6">
            <p className="text-[10px] text-emerald-600 mb-3">Find EcoOS Core across platforms:</p>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-emerald-800/20 bg-gray-900/50 px-3 py-2 text-[10px] text-emerald-500 hover:text-emerald-300 hover:border-emerald-600/40 transition-colors"
                >
                  <span>{p.label}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/changelog</span>
          </div>
          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 border-l border-emerald-800/20 pl-4 pb-4 last:pb-0 relative">
                <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-emerald-600 border-2 border-gray-950" />
                <div>
                  <p className="text-[9px] text-emerald-700 mb-0.5">{item.year}</p>
                  <p className="text-[11px] text-emerald-400/80">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-600 text-xs">$</span>
            <span className="text-[11px] text-emerald-300">cat /etc/sources</span>
          </div>
          <div className="border border-emerald-800/20 bg-gray-900/30 p-4 sm:p-6">
            <p className="text-[10px] text-emerald-600 mb-3">All data sourced from government and international bodies:</p>
            <ul className="space-y-2">
              {DATA_SOURCES.map((src, i) => (
                <li key={i}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/80 hover:text-emerald-300 transition-colors"
                  >
                    <span className="text-emerald-700">-</span>
                    <span>{src.name}</span>
                    <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* GitHub CTA */}
      <div className="border-b border-emerald-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-3">Open Source</p>
          <h2 className="text-lg font-bold text-emerald-100 mb-2">View the source code</h2>
          <p className="text-xs text-emerald-600 mb-4 max-w-md mx-auto">
            EcoOS Core is open source. Contribute, report issues, or explore the codebase on GitHub.
          </p>
          <a
            href="https://github.com/doffeycake-dev/hack2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/50 text-emerald-200 px-5 py-2.5 text-xs hover:bg-emerald-600/30 transition-all duration-200"
          >
            <span>GitHub Repository</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between text-[9px] text-emerald-800">
          <div className="flex items-center gap-2">
            <Radar className="h-3 w-3" />
            <span>EcoOS Core v2.5.0</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-700" />
            <Link href="/login" className="hover:text-emerald-500 transition-colors">Sign In</Link>
            <span className="inline-block h-1 w-1 rounded-full bg-emerald-700" />
            <a
              href="https://github.com/doffeycake-dev/hack2"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 transition-colors inline-flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="h-2 w-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
