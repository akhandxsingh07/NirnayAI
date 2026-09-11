import React from 'react';
import { FinancialStructureData, AssessmentFormData, PageId, LanguageCode } from '../types';
import { formatINR } from '../utils/financialCalculations';
import { EMICalculator } from '../components/EMICalculator';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface FinancePageProps {
  formData: AssessmentFormData;
  financialData: FinancialStructureData;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const FinancePage: React.FC<FinancePageProps> = ({
  formData,
  financialData,
  onNavigate,
  language,
}) => {
  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('financeTitle', language)}
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">
            Deterministic capital allocation: 10% Margin ({formatINR(financialData.entrepreneurMargin)}) → 100% Project Cost ({formatINR(financialData.totalProjectCost)}) → 90% Loan ({formatINR(financialData.loanRequirement)}).
          </p>
        </div>

        <button
          onClick={() => onNavigate('schemes')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"
        >
          <span>Explore Scheme Eligibility</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Capital Architecture Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Margin 10% */}
        <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#8B5E47] uppercase tracking-wider">
              10% Entrepreneur Margin
            </span>
            <EvidenceBadge type="SOURCE_BACKED" showIcon={false} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B1B16]">
            {formatINR(financialData.entrepreneurMargin)}
          </div>
          <p className="text-[11px] text-[#8B5E47]">
            Committed personal equity / self-contribution to anchor financing.
          </p>
        </div>

        {/* Total Project Cost */}
        <div className="bg-[#4A2F24] text-white rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#D9B99B] uppercase tracking-wider">
              100% Eligible Project Cost
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] text-[#F3E8DC] font-bold">
              Margin ÷ 10%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatINR(financialData.totalProjectCost)}
          </div>
          <p className="text-[11px] text-[#D9B99B]">
            Maximum allowable project capital under SIH26091 guidelines.
          </p>
        </div>

        {/* 90% Loan Requirement */}
        <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#6F7655] uppercase tracking-wider">
              90% Debt Financing
            </span>
            <EvidenceBadge type="SOURCE_BACKED" showIcon={false} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#474e30]">
            {formatINR(financialData.loanRequirement)}
          </div>
          <p className="text-[11px] text-[#8B5E47]">
            Sanctioned under {financialData.recommendedScheme}.
          </p>
        </div>
      </section>

      {/* Project Cost Itemized Breakdown */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              Itemized Capital Deployment Breakdown
            </h2>
          </div>
          <EvidenceBadge type="INDICATIVE" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1.5">
            <span className="text-xs font-semibold text-[#8B5E47] block">
              Capital Expenditure (Machinery & Assets)
            </span>
            <div className="text-xl font-extrabold text-[#2B1B16]">
              {formatINR(financialData.breakdown.capexMachinery)}
            </div>
            <p className="text-[11px] text-[#8B5E47]">
              Milk chilling tanks, fat testing units, stainless steel cans & processing equipment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1.5">
            <span className="text-xs font-semibold text-[#8B5E47] block">
              Initial Working Inventory / Raw Material
            </span>
            <div className="text-xl font-extrabold text-[#2B1B16]">
              {formatINR(financialData.breakdown.initialInventory)}
            </div>
            <p className="text-[11px] text-[#8B5E47]">
              Farmer procurement advances, milk testing chemicals & food-grade packaging.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1.5">
            <span className="text-xs font-semibold text-[#8B5E47] block">
              Working Capital Liquidity Buffer
            </span>
            <div className="text-xl font-extrabold text-[#2B1B16]">
              {formatINR(financialData.breakdown.workingCapital)}
            </div>
            <p className="text-[11px] text-[#8B5E47]">
              Utility charges, diesel generator reserve, and 45-day operational cash cushion.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Scheme Summary Card */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              Recommended Statutory Financing Route
            </h2>
          </div>
          <EvidenceBadge type="SOURCE_BACKED" />
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#6B4535] text-white text-xs font-bold uppercase tracking-wider">
              {financialData.recommendedScheme}
            </span>
            <h3 className="text-lg font-bold text-[#2B1B16]">
              {financialData.recommendedScheme === 'Term Loan Scheme'
                ? 'Option B: Long-Term Enterprise Credit Facility'
                : 'Option A: Micro Enterprise Credit Facility'}
            </h3>
            <p className="text-xs text-[#4A2F24] max-w-xl leading-relaxed">
              {financialData.schemeRationale}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center shrink-0">
            <div className="p-2.5 rounded-xl bg-white border border-[#D9B99B]/60">
              <span className="text-[10px] text-[#8B5E47] block">Interest Rate</span>
              <span className="text-xs font-bold text-[#2B1B16]">
                {financialData.interestRate}% p.a.
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#D9B99B]/60">
              <span className="text-[10px] text-[#8B5E47] block">Tenure</span>
              <span className="text-xs font-bold text-[#2B1B16]">
                {Math.round(financialData.tenureMonths / 12)} Years ({financialData.tenureMonths} Mo)
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#D9B99B]/60">
              <span className="text-[10px] text-[#8B5E47] block">Moratorium</span>
              <span className="text-xs font-bold text-[#474e30]">
                {financialData.moratoriumMonths} Months
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded EMI Calculator with Interactive Sliders */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
            Repayment Schedule & Amortization Calculator
          </h2>
          <EvidenceBadge type="SOURCE_BACKED" />
        </div>

        <EMICalculator
          initialLoanAmount={financialData.loanRequirement}
          initialRate={financialData.interestRate}
          initialTenureMonths={financialData.tenureMonths}
          initialMoratorium={financialData.moratoriumMonths}
        />
      </section>
    </div>
  );
};
