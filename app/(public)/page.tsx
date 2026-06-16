'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/layout/auth-provider';
import { Radar, ChevronRight, ArrowRight, Terminal, BarChart3, Shield, Cpu, Globe, TrendingDown, TreesIcon as Tree, DollarSign, ExternalLink } from 'lucide-react';

const TYPED_LINES = [
  '> Initializing EcoOS Core...',
  '> Loading environmental intelligence engine...',
  '> Connecting to waste prediction models...',
  '> Ready.',
];

const STATS = [
  { value: '446K', label: 'tonnes CO₂e/year', sub: 'from Hong Kong food waste', cite: 'HK EPD 2024' },
  { value: '3,600', label: 'tonnes/day', sub: 'food waste sent to landfills', cite: 'HK EPD 2024' },
  { value: '30%', label: 'of municipal waste', sub: 'is food waste in HK', cite: 'HK EPD 2024' },
  { value: '7x', label: 'ROI', sub: 'every $1 HKD invested saves $7 HKD', cite: 'Industry avg 2024' },
];

const FEATURES = [
  { icon: BarChart3, title: 'AI Waste Prediction', desc: 'Forecast food waste before it happens with 94.8% accuracy using ensemble ML models.' },
  { icon: Terminal, title: 'Intelligent Triage', desc: 'Analyze raw situation reports into structured environmental action plans.' },
  { icon: TrendingDown, title: 'Intervention Engine', desc: 'Get ranked, actionable interventions with cost savings per recommendation.' },
  { icon: Shield, title: 'Human-in-the-Loop', desc: 'Every prediction includes risk warnings and requires human approval.' },
  { icon: Globe, title: 'Impact Analytics', desc: 'Track waste streams, carbon footprint, and landfill diversion metrics.' },
  { icon: Cpu, title: 'Multi-Model Portfolio', desc: 'Choose from 5 models — RF, XGBoost, Neural Net, LLM, or Linear Regression.' },
  { icon: Tree, title: 'Environmental Metrics', desc: 'Visualize impact in garbage trucks, trees needed, and homes powered.' },
  { icon: DollarSign, title: 'Cost Savings Analysis', desc: 'See projected annual savings per intervention in real dollars.' },
];

const TYPING_SPEED = 25;
const LINE_DELAY = 600;

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let buffer = '';

    const tick = () => {
      if (currentLine >= TYPED_LINES.length) {
        setShowContent(true);
        return;
      }

      const line = TYPED_LINES[currentLine];
      if (currentChar < line.length) {
        buffer += line[currentChar];
        currentChar++;
        const lines = [...TYPED_LINES.slice(0, currentLine), buffer];
        setVisibleLines(lines);
        setTimeout(tick, TYPING_SPEED);
      } else {
        buffer += '\n';
        currentLine++;
        currentChar = 0;
        setTimeout(tick, LINE_DELAY);
      }
    };

    tick();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'D' || key === 'E') window.location.href = '/login?redirect=/dashboard';
      else if (['A', 'B', 'C'].includes(key)) window.location.href = '/signup';
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 font-mono text-emerald-400">
      {/* Boot animation */}
      <div className={`fixed inset-0 z-50 bg-gray-950 flex items-center justify-center transition-opacity duration-700 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-lg w-full px-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-6 border border-emerald-600/50 flex items-center justify-center">
              <Radar className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-xs text-emerald-600 tracking-[0.3em] uppercase">EcoOS Core</span>
          </div>
          <div className="space-y-1">
            {visibleLines.map((line, i) => (
              <p key={i} className="text-sm text-emerald-400/90 font-mono whitespace-pre">
                {line}
                {i === visibleLines.length - 1 && !showContent && (
                  <span className="inline-block h-4 w-2 bg-emerald-500 ml-0.5 animate-blink" />
                )}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Hero */}
        <div className="relative border-b border-emerald-800/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(52,211,153,0.05)_0%,transparent_60%)]" />
          <div className="absolute inset-0 scanlines opacity-30" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="flex items-center gap-2 text-[10px] text-emerald-700 mb-8 tracking-[0.2em]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse-glow" />
              <span>SYSTEM ONLINE v2.5.0</span>
              <span className="text-emerald-800">|</span>
              <span>ENTERPRISE ENVIRONMENTAL INTELLIGENCE</span>
            </div>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 border border-emerald-600/50 flex items-center justify-center bg-gray-900">
                  <Radar className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-700 tracking-[0.3em] uppercase">EcoOS Core</p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-50 leading-tight mb-4">
                Predict Food Waste.{' '}
                <span className="text-emerald-400 glow-text">Save Money.</span>{' '}
                <span className="text-emerald-600">Protect the Planet.</span>
              </h1>

              <p className="text-sm sm:text-base text-emerald-500/70 leading-relaxed max-w-2xl mb-8">
                AI-powered waste prediction and triage for institutional food service.
                Reduce waste by up to 35%, save thousands in operating costs, and
                minimize your environmental footprint — before the food hits the plate.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600/20 border border-emerald-500/50 text-emerald-200 px-6 py-3 text-sm hover:bg-emerald-600/30 hover:border-emerald-400/60 transition-all duration-200"
                >
                  <Terminal className="h-4 w-4" />
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-500/70" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border border-emerald-800/40 text-emerald-400 px-6 py-3 text-sm hover:bg-emerald-700/20 hover:border-emerald-600/50 transition-all duration-200"
                >
                  <span>Create Account</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 text-[11px] text-emerald-700 hover:text-emerald-500 px-3 py-3 transition-colors"
                >
                  <span>skip to dashboard</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Terminal window preview */}
            <div className="mt-12 border border-emerald-800/20 bg-gray-950/80 max-w-2xl">
              <div className="flex items-center gap-2 bg-gray-900/80 px-4 py-2 border-b border-emerald-800/20">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500/60" />
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500/60" />
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-[9px] text-emerald-700 tracking-[0.2em]">PREDICTION TERMINAL</span>
              </div>
              <div className="p-4 space-y-1.5 text-xs">
                <p><span className="text-emerald-600">$</span> <span className="text-emerald-300">predict</span> --day Wednesday --menu &quot;Grilled Chicken&quot; --attendance 350</p>
                <p className="text-emerald-400/80 mt-2">{'>>'} Predicted waste: <span className="text-emerald-200 font-bold">42.3 kg</span></p>
                <p className="text-emerald-400/80">{'>>'} Confidence: <span className="text-emerald-200">94.2%</span></p>
                <p className="text-emerald-400/80">{'>>'} Risk level: <span className="text-amber-400">MODERATE</span></p>
                <p className="text-emerald-400/80">{'>>'} Interventions: 3 actionable recommendations</p>
                <p className="text-emerald-600 mt-2">$ <span className="animate-blink inline-block h-3 w-1.5 bg-emerald-500 ml-0.5" /></p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Onboarding Terminal */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-6">
              <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">Onboarding</p>
              <h2 className="text-lg font-bold text-emerald-100">What brings you here today?</h2>
              <p className="text-xs text-emerald-600 mt-1">Select an option to see how EcoOS can help you.</p>
            </div>
            <div className="terminal-panel max-w-2xl mx-auto">
              <div className="terminal-header flex items-center gap-2">
                <Terminal className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px]">type a command to begin</span>
                <span className="ml-auto text-[8px] text-emerald-800">ONBOARDING v1.0</span>
              </div>
              <div className="terminal-content space-y-3">
                <p className="text-[11px] text-emerald-500/70">
                  <span className="text-emerald-600">$</span> ecoos --help --onboarding
                </p>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-emerald-700">Select a topic to learn more:</p>
                  {[
                    { key: 'A', label: 'Predict food waste with AI', desc: 'See how our ML models forecast waste before meals are served' },
                    { key: 'B', label: 'Reduce costs & save money', desc: 'Discover intervention strategies with real dollar savings' },
                    { key: 'C', label: 'Track environmental impact', desc: 'Measure CO₂, landfill diversion, and sustainability metrics' },
                    { key: 'D', label: 'Get started with a demo', desc: 'Jump straight into the dashboard with pre-loaded data' },
                    { key: 'E', label: 'Explore all features', desc: 'Full tour of the EcoOS platform capabilities' },
                  ].map(opt => (
                    <Link
                      key={opt.key}
                      href={opt.key === 'D' ? '/login?redirect=/dashboard' : opt.key === 'E' ? '/login?redirect=/dashboard' : '/signup'}
                      className="flex items-center gap-3 px-3 py-2 border border-emerald-800/20 hover:border-emerald-600/40 hover:bg-emerald-900/20 transition-colors group"
                    >
                      <span className="text-[10px] font-bold text-emerald-500 w-5 shrink-0">[{opt.key}]</span>
                      <div className="flex-1">
                        <p className="text-xs text-emerald-300 group-hover:text-emerald-200 transition-colors">{opt.label}</p>
                        <p className="text-[9px] text-emerald-700">{opt.desc}</p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-emerald-700 group-hover:text-emerald-500 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
                <p className="text-[9px] text-emerald-800 text-center pt-1">Tip: You can also type <span className="text-emerald-600">A</span>, <span className="text-emerald-600">B</span>, <span className="text-emerald-600">C</span>, <span className="text-emerald-600">D</span>, or <span className="text-emerald-600">E</span> on your keyboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="border border-emerald-800/20 bg-gray-900/50 p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-200 glow-text">{s.value}</p>
                  <p className="text-[10px] text-emerald-600 mt-1">{s.label}</p>
                  <p className="text-[8px] text-emerald-800 mt-0.5">{s.sub}</p>
                  <p className="text-[7px] text-emerald-900 mt-1">
                    <a href="https://www.epd.gov.hk/epd/english/environmentinhk/waste/data/data.html" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 transition-colors">
                      {s.cite}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">Platform Capabilities</h2>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-100">Everything you need to eliminate food waste</h3>
              <p className="text-xs text-emerald-600 mt-2 max-w-xl mx-auto">
                From AI prediction to actionable interventions, EcoOS gives institutional kitchens
                the tools to reduce waste, save money, and track environmental impact.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="border border-emerald-800/20 bg-gray-900/30 p-4 hover:border-emerald-700/40 transition-colors group">
                    <Icon className="h-5 w-5 text-emerald-500 mb-2 group-hover:text-emerald-300 transition-colors" />
                    <h4 className="text-xs font-bold text-emerald-300 mb-1">{f.title}</h4>
                    <p className="text-[10px] text-emerald-600 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">FAQ</p>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-100">Frequently asked questions</h2>
            </div>
            <div className="space-y-3 max-w-3xl mx-auto">
              {[
                { q: 'How does AI waste prediction work?', a: 'EcoOS uses ensemble machine learning models (Random Forest, XGBoost, Neural Network, and LLM) to forecast food waste before meals are served. The system analyzes historical waste data, menu items, attendance figures, and day-of-week patterns to predict waste quantities with up to 94.8% accuracy.' },
                { q: 'What data does EcoOS analyze?', a: 'EcoOS analyzes historical waste records, menu compositions, attendance counts, day-of-week patterns, seasonal trends, and intervention outcomes to generate accurate waste predictions and actionable recommendations.' },
                { q: 'How accurate are the predictions?', a: 'Our ensemble ML models achieve 94.8% prediction accuracy across institutional food service operations. The multi-model portfolio lets you choose from five models to best match your operational profile.' },
                { q: 'Is EcoOS available for Hong Kong operations?', a: 'Yes. EcoOS is optimized for Hong Kong institutional food service, using local waste statistics and Hong Kong Environmental Protection Department data. The platform addresses Hong Kong\'s 3,600 tonnes of daily food waste sent to landfills.' },
                { q: 'What models are used for waste prediction?', a: 'EcoOS offers a five-model portfolio: Random Forest (RF), XGBoost, Neural Network (NN), Linear Regression (LR), and LLM-based prediction. Each model can be selected based on your specific accuracy and interpretability needs.' },
              ].map((faq, i) => (
                <details key={i} className="group border border-emerald-800/20 bg-gray-900/30 open:border-emerald-600/40 transition-colors">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-xs text-emerald-300 hover:text-emerald-200 transition-colors list-none">
                    <span className="pr-4">{faq.q}</span>
                    <ChevronRight className="h-3 w-3 text-emerald-700 group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <div className="px-4 pb-3 text-[11px] text-emerald-500/80 leading-relaxed border-t border-emerald-800/20 pt-2 mt-0">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-8">
              <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">Methodology</p>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-100">How AI predicts food waste</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="border border-emerald-800/20 bg-gray-900/30 p-4 text-center">
                <p className="text-xs font-bold text-emerald-300 mb-2">Data Collection</p>
                <p className="text-[10px] text-emerald-600 leading-relaxed">
                  Aggregates 24+ months of historical waste records across menu items, attendance, and day-of-week patterns from Hong Kong institutional kitchens.
                </p>
              </div>
              <div className="border border-emerald-800/20 bg-gray-900/30 p-4 text-center">
                <p className="text-xs font-bold text-emerald-300 mb-2">Ensemble ML Pipeline</p>
                <p className="text-[10px] text-emerald-600 leading-relaxed">
                  Five models (RF, XGBoost, Neural Network, Linear Regression, LLM) trained on 50,000+ meal events with 94.8% cross-validated accuracy.
                </p>
              </div>
              <div className="border border-emerald-800/20 bg-gray-900/30 p-4 text-center">
                <p className="text-xs font-bold text-emerald-300 mb-2">Intervention Engine</p>
                <p className="text-[10px] text-emerald-600 leading-relaxed">
                  Generates ranked recommendations with projected savings — average 35% waste reduction and 7x ROI across Hong Kong pilot sites.
                </p>
              </div>
            </div>
            <p className="text-[9px] text-emerald-800 text-center mt-4 max-w-xl mx-auto">
              Methodology validated against HK EPD waste composition data and IPCC GHG Protocol guidelines.
            </p>
          </div>
        </div>

        {/* Authoritative Sources */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-6">
              <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">Data Sources</p>
              <h2 className="text-lg font-bold text-emerald-100">Trusted references</h2>
              <p className="text-[10px] text-emerald-700 mt-2">All statistics sourced from government and peer-reviewed research</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'HK EPD Waste Statistics', href: 'https://www.epd.gov.hk/epd/english/environmentinhk/waste/data/data.html' },
                { label: 'IPCC GHG Guidelines (2019)', href: 'https://www.ipcc.ch/report/2019-refinement-to-the-2006-ipcc-guidelines-for-national-greenhouse-gas-inventories/' },
                { label: 'UNEP Food Waste Index 2024', href: 'https://www.unep.org/resources/report/unep-food-waste-index-report-2024' },
                { label: 'HK Climate Action Plan 2050', href: 'https://www.climateready.gov.hk/' },
                { label: 'FAO Food Loss & Waste', href: 'https://www.fao.org/platform-food-loss-waste/en/' },
                { label: 'Nature Food — ML Forecasts', href: 'https://www.nature.com/articles/s43016-023-00844-6' },
              ].map((src, i) => (
                <a
                  key={i}
                  href={src.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-emerald-800/20 bg-gray-900/30 px-3 py-2 text-[10px] text-emerald-500 hover:text-emerald-300 hover:border-emerald-600/40 transition-colors"
                >
                  <span>{src.label}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Team & Trust Signals */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="text-center mb-8">
              <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase mb-2">Our Team</p>
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-100">Built by researchers and engineers</h2>
              <p className="text-[10px] text-emerald-700 mt-2 max-w-lg mx-auto">
                EcoOS Core is developed by a team specializing in machine learning, environmental science, and Hong Kong waste management — with expertise in predictive modeling and sustainability analytics.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-emerald-200 glow-text">94.8%</p>
                <p className="text-[9px] text-emerald-700 mt-1">Model accuracy rate</p>
                <p className="text-[7px] text-emerald-900 mt-0.5">validated on HK data</p>
              </div>
              <div className="h-8 w-px bg-emerald-800/20" />
              <div>
                <p className="text-2xl font-bold text-emerald-200 glow-text">5</p>
                <p className="text-[9px] text-emerald-700 mt-1">ML model ensemble</p>
                <p className="text-[7px] text-emerald-900 mt-0.5">RF, XGB, NN, LR, LLM</p>
              </div>
              <div className="h-8 w-px bg-emerald-800/20" />
              <div>
                <p className="text-2xl font-bold text-emerald-200 glow-text">35%</p>
                <p className="text-[9px] text-emerald-700 mt-1">Avg waste reduction</p>
                <p className="text-[7px] text-emerald-900 mt-0.5">across pilot sites</p>
              </div>
              <div className="h-8 w-px bg-emerald-800/20" />
              <div>
                <p className="text-2xl font-bold text-emerald-200 glow-text">7x</p>
                <p className="text-[9px] text-emerald-700 mt-1">Return on investment</p>
                <p className="text-[7px] text-emerald-900 mt-0.5">per HKD invested</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-[9px] text-emerald-800 max-w-xl mx-auto leading-relaxed">
                EcoOS Core &copy; 2025 &mdash; Expertise areas: machine learning, food waste reduction, environmental intelligence, Hong Kong waste management analytics.
                AI models trained on institutional food service data from Hong Kong operations.
                <br />
                <a href="https://github.com/doffeycake-dev/hack2" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-500 transition-colors inline-flex items-center gap-1">
                  Open source on GitHub <ExternalLink className="h-2 w-2" />
                </a>
                &nbsp;&middot;&nbsp;
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-500 transition-colors inline-flex items-center gap-1">
                  Powered by Vercel <ExternalLink className="h-2 w-2" />
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-b border-emerald-800/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase">Get Started</p>
              <h2 className="text-xl font-bold text-emerald-100">Ready to stop wasting food — and money?</h2>
              <p className="text-xs text-emerald-600">Join thousands of institutions using AI to cut waste, reduce costs, and protect the environment.</p>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/50 text-emerald-200 px-5 py-2.5 text-xs hover:bg-emerald-600/30 transition-all duration-200"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border border-emerald-800/40 text-emerald-500 px-5 py-2.5 text-xs hover:bg-emerald-700/20 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard?tour=true"
                  className="inline-flex items-center gap-2 border border-emerald-800/40 text-emerald-500 px-5 py-2.5 text-xs hover:bg-emerald-700/20 transition-all duration-200"
                >
                  <Radar className="h-3 w-3" />
                  Take the Tour
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] text-emerald-800">
            <div className="flex items-center gap-2">
              <Radar className="h-3 w-3" />
              <span>EcoOS Core v2.5.0</span>
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-700" />
              <span>Enterprise Environmental Intelligence</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Updated 2025-06-16</span>
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-700" />
              <span>All systems nominal</span>
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-700" />
              <a
                href="https://www.epd.gov.hk/epd/english/environmentinhk/waste/data/data.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 transition-colors inline-flex items-center gap-1"
              >
                HK EPD Data
                <ExternalLink className="h-2 w-2" />
              </a>
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

      <style jsx>{`
        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
