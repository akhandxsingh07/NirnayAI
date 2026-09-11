import React from 'react';
import {
  AssessmentFormData,
  FeasibilityScoreData,
  FinancialStructureData,
  GrowthProjectionData,
  PageId,
  LanguageCode,
} from '../types';
import { formatINR } from '../utils/financialCalculations';
import { EvidenceBadge, EvidenceLegendBar } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  Calculator,
  Compass,
  TrendingUp,
  FileCheck,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mic,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface DashboardPageProps {
  formData: AssessmentFormData;
  feasibilityScore: FeasibilityScoreData;
  financialData: FinancialStructureData;
  growthData: GrowthProjectionData;
  onNavigate: (page: PageId) => void;
  onTryDemo: () => void;
  onOpenVoice: () => void;
  onOpenHelp: () => void;
  language: LanguageCode;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  formData,
  feasibilityScore,
  financialData,
  growthData,
  onNavigate,
  onTryDemo,
  onOpenVoice,
  onOpenHelp,
  language,
}) => {
  const locString = `${formData.location.village}, ${formData.location.district} (${formData.location.state})`;

  return (
    <div className="space-y-8 py-2">
      {/* Executive Welcome Cockpit Banner */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('navDashboard', language)} Cockpit
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47]">
            Active Evaluation: <strong className="text-[#2B1B16]">{formData.businessIdea}</strong> in{' '}
            <span className="text-[#6B4535] font-semibold">{locString}</span>
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={onTryDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F3] hover:bg-[#F3E8DC] text-[#4A2F24] border border-[#D9B99B]/70 text-xs font-bold transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 text-[#B9825B] fill-[#B9825B]" />
            <span>Reset Demo (Rampur)</span>
          </button>

          <button
            onClick={onOpenVoice}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white text-xs font-bold transition-all shadow-xs"
          >
            <Mic className="w-3.5 h-3.5 text-[#D9B99B]" />
            <span>Ask NIRNAY</span>
          </button>

          <button
            onClick={() => onNavigate('report')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B4535] hover:bg-[#4A2F24] text-white text-xs font-bold transition-all shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#D9B99B]" />
            <span>View Plan</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Indicator Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Feasibility Score */}
        <div
          onClick={() => onNavigate('analysis')}
          className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs hover:border-[#6B4535] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
                Feasibility Score
              </span>
              <Sparkles className="w-4 h-4 text-[#6B4535] group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#2B1B16]">
                {feasibilityScore.overallScore}
              </span>
              <span className="text-xs text-[#8B5E47] font-semibold">/ 100</span>
            </div>
            <span className="inline-block text-[11px] font-bold text-[#474e30] bg-[#6F7655]/15 px-2 py-0.5 rounded">
              {feasibilityScore.statusLabel.split('—')[0]}
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-[#F3E8DC] text-[11px] font-bold text-[#6B4535] flex items-center justify-between">
            <span>Explore SWOT & metrics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Capital & Margin */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs hover:border-[#6B4535] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
                Capital Architecture
              </span>
              <Calculator className="w-4 h-4 text-[#6B4535] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-3xl font-black text-[#2B1B16]">
                {formatINR(financialData.totalProjectCost)}
              </span>
              <span className="block text-[11px] text-[#8B5E47] mt-0.5">
                From {formatINR(financialData.entrepreneurMargin)} margin
              </span>
            </div>
            <span className="inline-block text-[11px] font-bold text-[#6B4535] bg-[#FAF7F3] px-2 py-0.5 rounded border border-[#D9B99B]/50">
              Loan: {formatINR(financialData.loanRequirement)} (90%)
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-[#F3E8DC] text-[11px] font-bold text-[#6B4535] flex items-center justify-between">
            <span>View EMI & amortization</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Scheme Routing */}
        <div
          onClick={() => onNavigate('schemes')}
          className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs hover:border-[#6B4535] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
                Statutory Scheme
              </span>
              <Compass className="w-4 h-4 text-[#6B4535] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-base font-extrabold text-[#2B1B16] line-clamp-1">
                {financialData.recommendedScheme}
              </span>
              <span className="block text-[11px] text-[#474e30] font-bold mt-0.5">
                8% p.a. • 7 Years • 6M Grace
              </span>
            </div>
            <span className="inline-block text-[11px] font-bold text-[#4A2F24] bg-[#F3E8DC] px-2 py-0.5 rounded">
              Option B (Above ₹1.40L)
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-[#F3E8DC] text-[11px] font-bold text-[#6B4535] flex items-center justify-between">
            <span>Compare scheme options</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Break-even & Profit */}
        <div
          onClick={() => onNavigate('growth')}
          className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs hover:border-[#6B4535] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8B5E47] uppercase tracking-wider">
                Monthly Net Profit
              </span>
              <TrendingUp className="w-4 h-4 text-[#6B4535] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <span className="text-3xl font-black text-[#474e30]">
                {formatINR(growthData.projectedMonthlyProfit)}
              </span>
              <span className="block text-[11px] text-[#8B5E47] mt-0.5">
                After ₹{financialData.monthlyEMI.toLocaleString('en-IN')}/mo EMI
              </span>
            </div>
            <span className="inline-block text-[11px] font-bold text-[#6B4535] bg-[#FAF7F3] px-2 py-0.5 rounded border border-[#D9B99B]/50">
              Break-even in {growthData.breakEvenMonths} Months
            </span>
          </div>
          <div className="pt-3 mt-3 border-t border-[#F3E8DC] text-[11px] font-bold text-[#6B4535] flex items-center justify-between">
            <span>Inspect 3-yr growth curve</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Advisory Workflow Checklist */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#6F7655]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              SIH26091 End-to-End Decision Status
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#474e30] bg-[#6F7655]/10 px-2.5 py-1 rounded-full">
            All 5 Questions Resolved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          <div
            onClick={() => onNavigate('opportunity')}
            className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50 hover:border-[#6B4535] cursor-pointer space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B1B16]">Q1. Local Opportunity</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6F7655]" />
            </div>
            <p className="text-[11px] text-[#4A2F24]">
              High demand from tea stalls & 2 informal competitors within 5km.
            </p>
          </div>

          <div
            onClick={() => onNavigate('analysis')}
            className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50 hover:border-[#6B4535] cursor-pointer space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B1B16]">Q2. Idea Feasibility</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6F7655]" />
            </div>
            <p className="text-[11px] text-[#4A2F24]">
              Score 78/100 (Promising). Prioritize curd & paneer value addition.
            </p>
          </div>

          <div
            onClick={() => onNavigate('finance')}
            className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50 hover:border-[#6B4535] cursor-pointer space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B1B16]">Q3. Capital Outlay</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6F7655]" />
            </div>
            <p className="text-[11px] text-[#4A2F24]">
              Invest ₹50,000 margin for an eligible project cost of ₹5,00,000.
            </p>
          </div>

          <div
            onClick={() => onNavigate('finance')}
            className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50 hover:border-[#6B4535] cursor-pointer space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B1B16]">Q4. Loan Structure</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6F7655]" />
            </div>
            <p className="text-[11px] text-[#4A2F24]">
              ₹4,50,000 loan at 8% interest with 6-month moratorium grace.
            </p>
          </div>

          <div
            onClick={() => onNavigate('schemes')}
            className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50 hover:border-[#6B4535] cursor-pointer space-y-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B1B16]">Q5. Scheme Support</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6F7655]" />
            </div>
            <p className="text-[11px] text-[#4A2F24]">
              Routed to Term Loan Scheme (Option B) for projects exceeding ₹1.40L.
            </p>
          </div>

          <div
            onClick={() => onNavigate('report')}
            className="p-3.5 rounded-xl bg-[#4A2F24] text-white cursor-pointer space-y-1 hover:bg-[#2B1B16] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Full Business Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D9B99B]" />
            </div>
            <p className="text-[11px] text-[#D9B99B]">
              Print-ready institutional report with KYC checklist.
            </p>
          </div>
        </div>
      </section>

      {/* Global Evidence Legend */}
      <EvidenceLegendBar />
    </div>
  );
};
