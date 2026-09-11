import React, { useEffect, useRef, useState } from 'react';
import { PageId, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../services/localizationService';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  Landmark,
  Lightbulb,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sprout,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  onTryDemo: () => void;
  onOpenHelp: () => void;
}

const ruralVideoSources = [
  '/rural-hero.mp4',
  'https://www.pexels.com/download/video/37664921/',
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language,
  onLanguageChange,
  onTryDemo,
  onOpenHelp,
}) => {
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      heroVideoRef.current?.pause();
      setIsVideoPaused(true);
    }
  }, []);

  const scrollToSolutions = () => {
    document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleHeroVideo = () => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsVideoPaused(false);
    } else {
      video.pause();
      setIsVideoPaused(true);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FBF7EF] text-[#281C13]">
      <header className="sticky top-0 z-40 border-b border-[#E7DDCF]/80 bg-[#FBF7EF]/90 shadow-[0_8px_30px_rgba(73,48,28,.04)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-5 px-5 py-3.5 sm:px-8 lg:px-10">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0E1CA] text-[#9C6A30] shadow-[inset_0_0_0_1px_rgba(169,120,56,.12)]">
              <Sprout className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight sm:text-[28px]">Nirnay AI</h1>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.08em] text-[#7A6C5F]">SAHI SOCH. BEHTAR KAL.</p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#564B40] xl:flex">
            <button onClick={() => onNavigate('landing')} className="border-b-2 border-[#A97838] py-2 text-[#281C13]">Home</button>
            <button onClick={scrollToSolutions} className="py-2 transition hover:text-[#281C13]">Solutions</button>
            <button onClick={() => onNavigate('schemes')} className="py-2 transition hover:text-[#281C13]">Government Schemes</button>
            <button onClick={onOpenHelp} className="py-2 transition hover:text-[#281C13]">Resources</button>
            <button onClick={onOpenHelp} className="py-2 transition hover:text-[#281C13]">About</button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96652D]" />
              <select
                value={language}
                onChange={(event) => onLanguageChange(event.target.value as LanguageCode)}
                aria-label="Select language"
                className="h-10 rounded-xl border border-[#D8C5AA] bg-[#FFFDF8]/90 pl-9 pr-8 text-xs font-semibold text-[#5B4632] outline-none transition hover:border-[#B98B52] focus:border-[#A97838]"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={onOpenHelp} aria-label="Search resources" className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#4D4238] transition hover:bg-[#F1E6D6] sm:flex">
              <Search className="h-5 w-5" />
            </button>

            <button onClick={onTryDemo} className="hidden rounded-xl border border-[#CDB18C] bg-[#FFFDF8] px-4 py-2.5 text-sm font-bold text-[#49311E] transition hover:bg-[#F3E8D9] lg:block">
              Try Demo
            </button>

            <button onClick={() => onNavigate('assessment')} className="rounded-xl bg-[#A97838] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(169,120,56,.18)] transition hover:-translate-y-0.5 hover:bg-[#8D5D28]">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-[#E7DDCF]">
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="nirnay-hero-video pointer-events-none absolute inset-0 h-full w-full object-cover"
          >
            {ruralVideoSources.map((source) => (
              <source key={source} src={source} type="video/mp4" />
            ))}
          </video>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,239,.98)_0%,rgba(251,247,239,.93)_38%,rgba(251,247,239,.78)_68%,rgba(251,247,239,.68)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,248,.18),rgba(242,229,210,.38))]" />
          <div className="nirnay-video-grain pointer-events-none absolute inset-0" />
          <div className="nirnay-rural-scene pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-70" />

          <button
            type="button"
            onClick={toggleHeroVideo}
            className="absolute bottom-5 right-5 z-20 hidden items-center gap-2 rounded-full border border-[#D6C2A4] bg-[#FFFDF8]/85 px-3 py-2 text-[11px] font-bold text-[#6D4B27] shadow-sm backdrop-blur-md transition hover:bg-white md:flex"
            aria-label={isVideoPaused ? 'Play background video' : 'Pause background video'}
          >
            {isVideoPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}
            {isVideoPaused ? 'Play scene' : 'Pause scene'}
          </button>

          <div className="pointer-events-none absolute right-5 top-36 hidden rotate-[-5deg] whitespace-pre-line font-serif text-lg italic leading-7 text-[#8A6841]/70 2xl:block">
            {'Stronger\nVillages\nBrighter India'}
          </div>

          <div className="relative z-10 mx-auto grid min-h-[640px] max-w-[1380px] items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DEC8A7] bg-[#F6EBDD]/90 px-4 py-2 text-sm font-bold text-[#775328] shadow-[0_6px_20px_rgba(91,62,30,.05)] backdrop-blur-sm">
                <Sprout className="h-4 w-4" />
                Empowering Rural Entrepreneurs
              </div>

              <h2 className="mt-5 max-w-[690px] font-serif text-[46px] font-bold leading-[1.03] tracking-[-2px] text-[#21150C] sm:text-[58px] lg:text-[68px]">
                Smarter Business<br />
                Decisions for a<br />
                Brighter Rural India.
              </h2>

              <p className="mt-5 max-w-[610px] text-base leading-7 text-[#66594D] sm:text-[17px]">
                Nirnay AI helps rural entrepreneurs plan, analyze and grow their businesses with AI-powered local insights, practical financial structuring and relevant government scheme guidance.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('assessment')} className="flex items-center gap-3 rounded-xl bg-[#A97838] px-7 py-4 text-sm font-bold text-white shadow-[0_12px_26px_rgba(169,120,56,.22)] transition hover:-translate-y-0.5 hover:bg-[#8D5D28]">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button onClick={() => setIsStoryOpen(true)} className="flex items-center gap-3 rounded-xl border border-[#C8A77C] bg-[#FFFDF8]/88 px-7 py-4 text-sm font-bold text-[#49311E] shadow-[0_6px_18px_rgba(72,47,25,.05)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B98B52] bg-[#F7EBDD]">
                    <Play className="h-4 w-4 fill-[#A97838] text-[#A97838]" />
                  </span>
                  Watch Rural Story
                </button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#605449]">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />Easy to use</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />Backed by data</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />Built for Bharat</span>
              </div>
            </div>

            <div className="nirnay-dashboard-shell overflow-hidden rounded-[24px] border border-[#DED2C1] bg-[#FFFDF8]/92 shadow-[0_28px_70px_rgba(78,52,28,.13)] backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#E9DFD1] bg-[#FFFDF8]/80 px-5 py-4">
                <div className="flex items-center gap-2 font-serif text-xl font-bold"><Sprout className="h-5 w-5 text-[#9D6A30]" /> Nirnay AI</div>
                <div className="flex items-center gap-3 text-[#75675B]"><span className="h-2 w-2 rounded-full bg-[#6E844C] shadow-[0_0_0_4px_rgba(110,132,76,.10)]" /><User className="h-5 w-5" /></div>
              </div>

              <div className="grid min-h-[435px] md:grid-cols-[142px_1fr]">
                <aside className="hidden border-r border-[#EBE1D5] bg-[#FFFDF9]/80 p-3 md:block">
                  <button onClick={onTryDemo} className="mb-1 flex w-full items-center gap-2 rounded-xl bg-[#F0E1CA] px-3 py-3 text-left text-xs font-bold text-[#775122]"><BarChart3 className="h-4 w-4" /> Dashboard</button>
                  <button onClick={() => onNavigate('report')} className="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs text-[#625548] hover:bg-[#F6ECDE]"><FileText className="h-4 w-4" /> Business Plan</button>
                  <button onClick={() => onNavigate('schemes')} className="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs text-[#625548] hover:bg-[#F6ECDE]"><Landmark className="h-4 w-4" /> Schemes</button>
                  <button onClick={() => onNavigate('analysis')} className="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs text-[#625548] hover:bg-[#F6ECDE]"><Lightbulb className="h-4 w-4" /> AI Advisor</button>
                  <button onClick={onOpenHelp} className="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs text-[#625548] hover:bg-[#F6ECDE]"><FileText className="h-4 w-4" /> Learning</button>
                  <button onClick={() => onNavigate('assessment')} className="mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs text-[#625548] hover:bg-[#F6ECDE]"><User className="h-4 w-4" /> Profile</button>
                </aside>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#24170D]">Welcome back, Ramesh!</h3>
                      <p className="mt-1 text-xs text-[#827366]">Good decisions today, a better tomorrow.</p>
                    </div>
                    <div className="hidden rounded-full bg-[#F3E8D9] px-3 py-1.5 text-[10px] font-semibold text-[#7A5A37] sm:block">Growth begins locally 🌱</div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                    <MiniStat icon={<span className="text-lg font-bold">₹</span>} label="Investment" value="₹2,50,000" />
                    <MiniStat icon={<TrendingUp className="h-4 w-4" />} label="Monthly Profit" value="₹45,000" />
                    <MiniStat icon={<BarChart3 className="h-4 w-4" />} label="Business Score" value="78/100" />
                    <MiniStat icon={<ShieldCheck className="h-4 w-4" />} label="Risk Level" value="Low" valueClass="text-[#648044]" />
                  </div>

                  <div className="mt-3 grid gap-3 lg:grid-cols-[1.18fr_.82fr]">
                    <div className="rounded-2xl border border-[#E5DACB] bg-white/90 p-4 shadow-[0_4px_14px_rgba(74,48,25,.035)]">
                      <div className="flex items-center justify-between gap-3">
                        <div><div className="text-sm font-bold">Profit Projection</div><div className="mt-1 text-[11px] text-[#807165]">6 Month Growth</div></div>
                        <span className="rounded-full border border-[#E4D8C7] bg-[#FFFDF8] px-3 py-1 text-[10px] text-[#746558]">6 Months</span>
                      </div>
                      <div className="relative mt-5 h-32 border-b border-l border-[#E9E1D6]">
                        <svg viewBox="0 0 420 130" className="absolute inset-0 h-full w-full overflow-visible">
                          <defs>
                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C89450" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#C89450" stopOpacity="0.02" />
                            </linearGradient>
                          </defs>
                          <path d="M0,112 L70,88 L140,72 L210,64 L280,48 L350,26 L420,12 L420,130 L0,130 Z" fill="url(#areaFill)" />
                          <polyline points="0,112 70,88 140,72 210,64 280,48 350,26 420,12" fill="none" stroke="#A97838" strokeWidth="3" />
                          {[['0','112'],['70','88'],['140','72'],['210','64'],['280','48'],['350','26'],['420','12']].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#A97838" />)}
                        </svg>
                      </div>
                      <div className="mt-2 grid grid-cols-6 text-center text-[10px] text-[#847469]"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-[#E0D1BA] bg-gradient-to-br from-[#F8F0E5] to-[#E7D4B5] p-5 shadow-[0_4px_14px_rgba(74,48,25,.04)]">
                      <div className="pointer-events-none absolute -bottom-8 -right-5 h-28 w-28 rounded-full bg-[#A8A57E]/20" />
                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <div>
                          <p className="font-serif text-xl font-bold leading-tight text-[#3A291B]">Bigger<br />Opportunities<br />for Brighter<br />Tomorrows</p>
                          <p className="mt-3 text-[11px] leading-5 text-[#76604B]">Practical local insight, structured finance and a clearer path to action.</p>
                        </div>
                        <div className="mt-5 flex justify-end"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9B18D]/45 text-3xl shadow-inner">👨🏽‍🌾</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="border-t border-[#E7DDCF] bg-[#FFFDF8]/92 px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto mb-6 flex max-w-[1380px] flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A6A31]">One platform, practical decisions</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#2A1A10] sm:text-3xl">From opportunity to execution</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#796B5E]">Nirnay keeps local opportunity, financial planning and government support connected in one decision flow.</p>
          </div>

          <div className="mx-auto grid max-w-[1380px] gap-5 md:grid-cols-3">
            <FeatureCard icon={<Landmark className="h-6 w-6" />} title="Government Schemes" text="Discover relevant schemes and support options for your business." footer="Scheme-aware guidance" onClick={() => onNavigate('schemes')} />
            <FeatureCard icon={<FileText className="h-6 w-6" />} title="Action Plan" text="Turn your assessment into a clear, practical path to launch and grow." footer="From idea to implementation" onClick={() => onNavigate('report')} />
            <FeatureCard icon={<Lightbulb className="h-6 w-6" />} title="AI Recommendation" text="Get personalized feasibility guidance based on your business idea and location." footer="AI-assisted, data-grounded" onClick={() => onNavigate('analysis')} />
          </div>
        </section>

        <section className="border-t border-[#EAE0D4] bg-[#FFFDF9] px-5 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1380px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={<Users className="h-7 w-7" />} value="10,000+" label="Rural Entrepreneurs" />
            <Metric icon={<BarChart3 className="h-7 w-7" />} value="500+" label="Business Ideas Analyzed" />
            <Metric icon={<Landmark className="h-7 w-7" />} value="200+" label="Government Support Paths" />
            <Metric icon={<Sprout className="h-7 w-7" />} value="Stronger Villages" label="Brighter India" />
          </div>
        </section>

        <footer className="border-t border-[#E9DED0] bg-[#FAF6EE] px-5 py-6 text-center text-[11px] text-[#837366]">
          <p className="font-semibold text-[#5D4C3F]">NIRNAY AI — Team VYOMA · Smart India Hackathon 2026</p>
          <p className="mt-1">PS SIH26091 · Hyper-Local Business Advisory & Financial Structuring for Rural Micro-Entrepreneurs</p>
          <p className="mx-auto mt-1 max-w-2xl italic">{t('disclaimerText', language)}</p>
        </footer>
      </main>

      {isStoryOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#20150D]/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Rural India story video">
          <div className="w-full max-w-5xl overflow-hidden rounded-[26px] border border-[#D8C6AA] bg-[#FFFDF8] shadow-[0_35px_100px_rgba(28,18,10,.35)]">
            <div className="flex items-center justify-between border-b border-[#E8DDCF] px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A6A31]">Nirnay AI</p>
                <h3 className="mt-1 font-serif text-xl font-bold text-[#281C13]">Built around real rural aspirations</h3>
              </div>
              <button onClick={() => setIsStoryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E7D7] text-[#5F4630] transition hover:bg-[#E8D8C0]" aria-label="Close video">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid lg:grid-cols-[1.45fr_.55fr]">
              <div className="bg-[#20150D]">
                <video autoPlay muted controls loop playsInline className="aspect-video h-full w-full object-cover">
                  {ruralVideoSources.map((source) => (
                    <source key={source} src={source} type="video/mp4" />
                  ))}
                </video>
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#F1E4D1] px-3 py-1.5 text-xs font-bold text-[#775328]"><Sprout className="h-3.5 w-3.5" /> Rural-first design</div>
                  <p className="mt-5 text-sm leading-7 text-[#6D5E51]">The visual language stays familiar and grounded in village life while the product experience remains modern, simple and professional.</p>
                  <div className="mt-5 space-y-3 text-sm text-[#5F5145]">
                    <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" /> Local opportunity intelligence</div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" /> Financial structuring in plain language</div>
                    <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" /> Relevant scheme and growth guidance</div>
                  </div>
                </div>
                <button onClick={() => { setIsStoryOpen(false); onNavigate('assessment'); }} className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#A97838] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#8D5D28]">Start Assessment <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}> = ({ icon, label, value, valueClass = '' }) => (
  <div className="rounded-2xl border border-[#E7DDCF] bg-white/95 p-3 shadow-[0_3px_12px_rgba(65,42,20,.04)] transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E1C8] text-[#A26D2C]">{icon}</div>
    <p className="mt-3 text-[10px] text-[#817267]">{label}</p>
    <strong className={`mt-1 block text-base font-extrabold ${valueClass}`}>{value}</strong>
  </div>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
  footer: string;
  onClick: () => void;
}> = ({ icon, title, text, footer, onClick }) => (
  <button onClick={onClick} className="group rounded-2xl border border-[#E0D4C4] bg-[#FFFDF8] p-5 text-left shadow-[0_5px_18px_rgba(70,45,25,.04)] transition hover:-translate-y-1 hover:border-[#CFAE80] hover:shadow-[0_16px_38px_rgba(70,45,25,.10)]">
    <div className="flex items-start justify-between gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E6D1] to-[#EAD5B5] text-[#98652A] shadow-inner">{icon}</div>
      <ChevronRight className="h-5 w-5 text-[#96652D] transition group-hover:translate-x-0.5" />
    </div>
    <h3 className="mt-4 font-serif text-lg font-bold text-[#25170D]">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-[#75675B]">{text}</p>
    <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F2E6D3] px-3 py-2 text-[11px] font-semibold text-[#77542D]">
      <span>{footer}</span><ChevronRight className="h-4 w-4" />
    </div>
  </button>
);

const Metric: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex items-center gap-4 lg:border-r lg:border-[#DED4C6] lg:last:border-r-0">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E5D2] text-[#A67334]">{icon}</div>
    <div><strong className="block text-xl font-extrabold text-[#2A1A10]">{value}</strong><p className="mt-1 text-[11px] text-[#796C60]">{label}</p></div>
  </div>
);