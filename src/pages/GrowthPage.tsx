import React from 'react';
import { GrowthProjectionData, AssessmentFormData, PageId, LanguageCode } from '../types';
import { GrowthChart } from '../components/GrowthChart';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { formatINR } from '../utils/financialCalculations';
import { t } from '../services/localizationService';
import {
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Flag,
} from 'lucide-react';

interface GrowthPageProps {
  formData: AssessmentFormData;
  growthData: GrowthProjectionData;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const GrowthPage: React.FC<GrowthPageProps> = ({
  formData,
  growthData,
  onNavigate,
  language,
}) => {
  const milestones = [
    {
      period: 'Months 1 – 3',
      title: 'Infrastructure Setup & Moratorium Window',
      detail:
        'Procure milk chilling tank and fat-testing kit. Complete Udyam & FSSAI basic registration. Only simple interest serviced.',
      badge: 'Setup Phase',
    },
    {
      period: 'Months 4 – 6',
      title: 'Local Commercial Pilot & Tea Stall Contracts',
      detail:
        'Onboard 15–20 daily dairy farmers. Lock in supply agreements with 5 local tea stalls and sweets shops in 3 km radius.',
      badge: 'Customer Acquisition',
    },
    {
      period: 'Months 7 – 12',
      title: 'Full Production & Regular Principal EMI Begins',
      detail:
        'Transition out of moratorium into regular reducing EMI. Reach 150 liters/day capacity. Achieve unit operational break-even.',
      badge: 'Stabilization',
    },
    {
      period: 'Months 13 – 24',
      title: 'High-Margin Value Addition (Paneer & Curd)',
      detail:
        'Divert 30% of daily milk into packaged curd and fresh paneer. Boost gross product margin from 18% to 32%.',
      badge: 'Margin Expansion',
    },
    {
      period: 'Months 25 – 36',
      title: 'Cluster Radius Expansion (5 – 10 km)',
      detail:
        'Deploy small electric delivery vehicle to serve adjacent village weekly haats and institutional bulk buyers.',
      badge: 'Scale Phase',
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('growthTitle', language)}
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">
            Simulated 3-year performance forecast for{' '}
            <strong className="text-[#2B1B16]">{formData.businessIdea}</strong> under baseline rural absorption curves.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"
        >
          <span>Generate Final Business Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Chart Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
            Financial Trajectory Modeling (Month 1 – 36)
          </h2>
          <EvidenceBadge type="INDICATIVE" />
        </div>

        <GrowthChart data={growthData} />
      </section>

      {/* 36-Month Milestone Implementation Roadmap */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              Operational Roadmap & Milestone Milestones
            </h2>
          </div>
          <span className="text-xs text-[#8B5E47]">Phased Execution Strategy</span>
        </div>

        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#6B4535] transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#4A2F24] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#6B4535]">{m.period}:</span>
                    <h3 className="text-xs font-bold text-[#2B1B16]">{m.title}</h3>
                  </div>
                  <p className="text-xs text-[#4A2F24] mt-1 leading-relaxed max-w-2xl">
                    {m.detail}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white border border-[#D9B99B]/60 text-[#4A2F24] shrink-0 self-start sm:self-center">
                {m.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Mandatory Projection Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
        <div>
          <span className="font-bold">Important Notice on Projections:</span> All revenue, profit, and break-even figures are simulated indicative projections based on normative rural cost curves. Actual enterprise outcomes depend on climate fluctuations, feed costs, customer payment regularity, and on-ground execution.
        </div>
      </div>
    </div>
  );
};
