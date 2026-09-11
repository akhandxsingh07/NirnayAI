import React from 'react';
import { PageId, LanguageCode } from '../types';
import { t } from '../services/localizationService';
import {
  MapPin,
  Briefcase,
  Calculator,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Compass,
  FileCheck,
  Layers,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onTryDemo: () => void;
  onOpenHelp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language,
  onTryDemo,
  onOpenHelp,
}) => {
  const fiveQuestions = [
    {
      num: '1',
      question: 'What business opportunity makes sense in my local area?',
      detail: 'Hyper-local demand analysis, competitor density & service gaps within 5–10 km radius.',
      icon: MapPin,
    },
    {
      num: '2',
      question: 'Is my business idea feasible?',
      detail: 'Algorithmic 5-pillar feasibility score, domain-vetted SWOT analysis & operational risks.',
      icon: Sparkles,
    },
    {
      num: '3',
      question: 'How much should I invest?',
      detail: 'Transparent 10% Margin Capital to 100% Project Cost structuring (e.g. ₹50k margin → ₹5L project).',
      icon: Calculator,
    },
    {
      num: '4',
      question: 'What loan/finance structure fits my situation?',
      detail: '90% debt financing with deterministic EMI calculations, tenure selection, and grace moratorium.',
      icon: Compass,
    },
    {
      num: '5',
      question: 'Which government scheme/support option may be relevant?',
      detail: 'Rule-based scheme router comparing Micro Finance Scheme (≤₹1.4L) vs Term Loan Scheme (>₹1.4L).',
      icon: FileCheck,
    },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#4A2F24] via-[#36231C] to-[#2B1B16] text-[#FAF7F3] p-6 sm:p-12 border border-[#6B4535]/40 shadow-lg">
        {/* Subtle decorative topo pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topo" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 60 M 0 0 L 60 60" fill="none" stroke="#FAF7F3" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9825B]/20 text-[#D9B99B] border border-[#B9825B]/40 text-xs font-bold tracking-wide">
            <span>NIRNAY AI</span>
            <span>•</span>
            <span>Team VYOMA • SIH 2026 (PS SIH26091)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-serif">
            {t('heroHeading', language)}
          </h1>

          <p className="text-sm sm:text-base text-[#D9B99B] leading-relaxed max-w-2xl font-normal">
            {t('heroSupporting', language)}
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('assessment')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#B9825B] hover:bg-[#8B5E47] text-white font-bold text-sm shadow-md transition-all hover:gap-3"
            >
              <span>{t('btnStartAssessment', language)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onTryDemo}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F3] border border-white/20 font-bold text-sm transition-all"
            >
              <span>{t('btnTryDemo', language)}</span>
            </button>
          </div>

          {/* 3 Small Trust Indicators */}
          <div className="pt-6 border-t border-[#4A2F24] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#D9B99B]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#B9825B]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Hyper-Local Insights</span>
                <span className="text-[11px] text-[#D9B99B]/80">5–10 km catchment signals</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#B9825B]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Financial Planning</span>
                <span className="text-[11px] text-[#D9B99B]/80">Deterministic EMI & Margins</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#B9825B]">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Scheme Guidance</span>
                <span className="text-[11px] text-[#D9B99B]/80">Rule-based SIH26091 router</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Advisory Journey: Location -> Business -> Finance -> Growth */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E47]">
            Integrated Decision Support Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-[#2B1B16]">
            The 4-Pillar End-to-End Enterprise Journey
          </h2>
          <p className="text-xs text-[#8B5E47]">
            Not an isolated chatbot, but an interconnected advisory platform bridging local geography to sustainable business viability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-3 relative group hover:border-[#6B4535] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#6B4535] text-white flex items-center justify-center font-bold shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
              Step 01
            </div>
            <h3 className="text-base font-bold text-[#2B1B16]">Location Context</h3>
            <p className="text-xs text-[#4A2F24] leading-relaxed">
              Maps your specific Village, Block, and District to analyze 5–10 km market demand, local clusters, and competitor footprints.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-3 relative group hover:border-[#6B4535] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#8B5E47] text-white flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
              Step 02
            </div>
            <h3 className="text-base font-bold text-[#2B1B16]">Business Feasibility</h3>
            <p className="text-xs text-[#4A2F24] leading-relaxed">
              NIRNAY AI calculates a transparent 5-metric feasibility score (0–100), domain SWOT, and operational risk factors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-3 relative group hover:border-[#6B4535] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#B9825B] text-white flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
              Step 03
            </div>
            <h3 className="text-base font-bold text-[#2B1B16]">Financial Structuring</h3>
            <p className="text-xs text-[#4A2F24] leading-relaxed">
              Converts your margin into total project cost (Margin ÷ 10%), pairs with 90% debt, and recommends the matching scheme.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-3 relative group hover:border-[#6B4535] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#6F7655] text-white flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
              Step 04
            </div>
            <h3 className="text-base font-bold text-[#2B1B16]">Growth & Execution</h3>
            <p className="text-xs text-[#4A2F24] leading-relaxed">
              Provides a 36-month revenue & cash trajectory, break-even estimate, and a downloadable formal Business Plan report.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Questions Answered Section */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="border-b border-[#D9B99B]/30 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E47] block">
            Core Mandate (Problem Statement SIH26091)
          </span>
          <h2 className="text-2xl font-extrabold text-[#2B1B16] mt-1">
            Five Essential Questions Answered for Rural Entrepreneurs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fiveQuestions.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.num}
                className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-[#4A2F24] text-white text-xs font-extrabold flex items-center justify-center">
                      Q{q.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#8B5E47]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#2B1B16] leading-snug">
                    {q.question}
                  </h3>
                </div>
                <p className="text-xs text-[#4A2F24] leading-relaxed pt-2 border-t border-[#D9B99B]/30">
                  {q.detail}
                </p>
              </div>
            );
          })}

          {/* Quick Action Card */}
          <div className="p-5 rounded-2xl bg-[#4A2F24] text-white flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#D9B99B] font-bold">
                Live Prototype
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                Experience the Complete Assessment Flow
              </h3>
              <p className="text-xs text-[#D9B99B] mt-2 leading-relaxed">
                Test with our pre-populated Rampur rural dairy scenario (₹50k margin) or enter your own business idea.
              </p>
            </div>
            <button
              onClick={onTryDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-[#B9825B] hover:bg-[#8B5E47] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Load Rampur Scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Subtle Team VYOMA SIH Footer */}
      <footer className="pt-6 pb-2 text-center text-xs text-[#8B5E47] space-y-2 border-t border-[#D9B99B]/40">
        <p className="font-semibold text-[#4A2F24]">
          NIRNAY AI — Built by Team VYOMA for Smart India Hackathon 2026
        </p>
        <p className="text-[11px] text-[#8B5E47]">
          Problem Statement PS SIH26091: AI-Driven Hyper-Local Business Advisory & Financial Structuring Assistant for Rural Micro-Entrepreneurs
        </p>
        <p className="text-[10px] text-[#8B5E47]/80 max-w-xl mx-auto italic">
          {t('disclaimerText', language)}
        </p>
      </footer>
    </div>
  );
};
