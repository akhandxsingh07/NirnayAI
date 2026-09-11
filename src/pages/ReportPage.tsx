import React from 'react';
import {
  AssessmentFormData,
  FeasibilityScoreData,
  FinancialStructureData,
  GrowthProjectionData,
  SWOTData,
  LanguageCode,
  PageId,
} from '../types';
import { formatINR } from '../utils/financialCalculations';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  Printer,
  FileCheck,
  Building2,
  Calendar,
  CheckSquare,
  ShieldAlert,
  Award,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

interface ReportPageProps {
  formData: AssessmentFormData;
  feasibilityScore: FeasibilityScoreData;
  financialData: FinancialStructureData;
  growthData: GrowthProjectionData;
  swot: SWOTData;
  recommendation: string;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  formData,
  feasibilityScore,
  financialData,
  growthData,
  swot,
  recommendation,
  onNavigate,
  language,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const nextSteps = [
    {
      title: 'Complete Free Udyam MSME Registration',
      desc: 'Obtain statutory enterprise registration number on udyamregistration.gov.in using Aadhaar.',
    },
    {
      title: 'Open Dedicated Enterprise Current Bank Account',
      desc: 'Ensure all future business inflows and loan disbursements pass through a separate commercial account.',
    },
    {
      title: 'Obtain 2 Dealer Machinery Quotations',
      desc: 'Secure certified proforma invoices for the chilling unit, cans, and testing kit for bank appraisal.',
    },
    {
      title: 'Confirm 5 Local Commercial Supply Agreements',
      desc: 'Lock in informal written/verbal supply commitments with nearby tea stalls and sweet makers.',
    },
    {
      title: 'Submit Application under Term Loan Scheme',
      desc: 'Present this structured NIRNAY business plan to your local designated nodal agency or bank branch.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Top Action Header (hidden in print) */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-[#4A2F24] hover:bg-[#F3E8DC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[#2B1B16]">
              {t('reportTitle', language)}
            </h1>
            <span className="text-xs text-[#8B5E47]">
              Comprehensive Decision-Support & Financing Dossier
            </span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-md transition-all"
        >
          <Printer className="w-4 h-4 text-[#D9B99B]" />
          <span>{t('btnPrintPlan', language)}</span>
        </button>
      </div>

      {/* Printable Formal Document Sheet */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/60 p-6 sm:p-12 shadow-sm space-y-8 print:border-0 print:p-0 print:shadow-none text-[#2B1B16]">
        {/* Document Formal Header */}
        <div className="border-b-2 border-[#4A2F24] pb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#4A2F24] text-white text-xs font-black">
                NIRNAY AI
              </span>
              <span className="text-xs text-[#8B5E47] font-bold tracking-wider">
                SIH26091 ENTERPRISE ADVISORY DOSSIER
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2B1B16] font-serif">
              Comprehensive Rural Business Plan
            </h2>
            <p className="text-xs text-[#6B4535]">
              Project: <span className="font-bold">{formData.businessIdea}</span> • Category: {formData.category}
            </p>
          </div>

          <div className="text-right text-xs text-[#8B5E47] space-y-0.5 shrink-0">
            <p><strong className="text-[#2B1B16]">Generated For:</strong> {formData.location.village}, {formData.location.district}</p>
            <p><strong>State:</strong> {formData.location.state}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p className="text-[10px] text-[#8B5E47]">Document Ref: NAI-SIH26-091</p>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A2F24] border-b border-[#F3E8DC] pb-1">
            1. Executive Summary & Strategic Viability
          </h3>
          <p className="text-xs text-[#2B1B16] leading-relaxed">
            This business advisory report provides a structured appraisal for establishing a{' '}
            <strong>{formData.businessIdea}</strong> in <strong>{formData.location.village}</strong>, Block{' '}
            <strong>{formData.location.block}</strong>, District <strong>{formData.location.district}</strong>. The enterprise proposal requires an estimated total capital outlay of{' '}
            <strong>{formatINR(financialData.totalProjectCost)}</strong>, anchored by a committed 10% entrepreneur margin contribution of{' '}
            <strong>{formatINR(financialData.entrepreneurMargin)}</strong>, and supported by 90% debt financing of{' '}
            <strong>{formatINR(financialData.loanRequirement)}</strong> under the statutory{' '}
            <strong>{financialData.recommendedScheme}</strong>.
          </p>
          <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 text-xs text-[#6B4535]">
            <strong>Algorithmic Feasibility Verdict:</strong> {feasibilityScore.overallScore}/100 — &quot;{feasibilityScore.statusLabel}&quot;. {recommendation}
          </div>
        </div>

        {/* Section 2: Capital Architecture & Financing Structure */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A2F24] border-b border-[#F3E8DC] pb-1">
            2. Capital Structure & Loan Terms
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
              <span className="text-[10px] text-[#8B5E47] block">10% Entrepreneur Margin</span>
              <span className="text-base font-extrabold text-[#2B1B16]">
                {formatINR(financialData.entrepreneurMargin)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
              <span className="text-[10px] text-[#8B5E47] block">100% Total Project Cost</span>
              <span className="text-base font-extrabold text-[#6B4535]">
                {formatINR(financialData.totalProjectCost)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
              <span className="text-[10px] text-[#8B5E47] block">90% Sanctioned Loan</span>
              <span className="text-base font-extrabold text-[#474e30]">
                {formatINR(financialData.loanRequirement)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
              <span className="text-[10px] text-[#8B5E47] block">Monthly Debt Service</span>
              <span className="text-base font-extrabold text-[#2B1B16]">
                {formatINR(financialData.monthlyEMI)}
              </span>
            </div>
          </div>

          {/* Itemized Capital Deployment Table */}
          <div className="border border-[#D9B99B]/50 rounded-xl overflow-hidden text-xs mt-3">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAF7F3] text-[#4A2F24] border-b border-[#D9B99B]/50">
                <tr>
                  <th className="p-2.5 font-bold">Capital Deployment Head</th>
                  <th className="p-2.5 font-bold">Specification</th>
                  <th className="p-2.5 font-bold text-right">Estimated Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3E8DC]">
                <tr>
                  <td className="p-2.5 font-semibold text-[#2B1B16]">Capital Expenditure (Capex)</td>
                  <td className="p-2.5 text-[#4A2F24]">Machinery, chilling tanks, electronic fat testers, cans</td>
                  <td className="p-2.5 font-bold text-right text-[#2B1B16]">{formatINR(financialData.breakdown.capexMachinery)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-[#2B1B16]">Initial Inventory Stock</td>
                  <td className="p-2.5 text-[#4A2F24]">Raw milk procurement buffer, testing reagents, food-grade packing</td>
                  <td className="p-2.5 font-bold text-right text-[#2B1B16]">{formatINR(financialData.breakdown.initialInventory)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-[#2B1B16]">Working Capital Liquidity</td>
                  <td className="p-2.5 text-[#4A2F24]">45-day operational cash cushion, electricity & diesel backup reserve</td>
                  <td className="p-2.5 font-bold text-right text-[#2B1B16]">{formatINR(financialData.breakdown.workingCapital)}</td>
                </tr>
                <tr className="bg-[#FAF7F3] font-extrabold text-sm">
                  <td className="p-2.5" colSpan={2}>Total Estimated Project Outlay</td>
                  <td className="p-2.5 text-right text-[#6B4535]">{formatINR(financialData.totalProjectCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Scheme Recommendation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A2F24] border-b border-[#F3E8DC] pb-1">
            3. Statutory Scheme Recommendation
          </h3>
          <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2B1B16] text-sm">
                {financialData.recommendedScheme} (Option B)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#6F7655]/15 text-[#474e30] font-bold">
                8.0% p.a. • 7 Years Tenure
              </span>
            </div>
            <p className="text-[#4A2F24] leading-relaxed">
              {financialData.schemeRationale}
            </p>
            <div className="pt-2 border-t border-[#D9B99B]/30 flex flex-wrap gap-4 text-[#6B4535] text-[11px] font-semibold">
              <span>Moratorium: {financialData.moratoriumMonths} Months Grace</span>
              <span>•</span>
              <span>Estimated Break-even: {growthData.breakEvenMonths} Months</span>
              <span>•</span>
              <span>Monthly Net Profit: {formatINR(growthData.projectedMonthlyProfit)}</span>
            </div>
          </div>
        </div>

        {/* Section 4: SWOT Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A2F24] border-b border-[#F3E8DC] pb-1">
            4. SWOT Strategic Matrix
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1">
              <span className="font-bold text-[#474e30]">Strengths:</span>
              <p className="text-[#4A2F24] leading-relaxed">{(swot?.strengths || []).join('; ')}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1">
              <span className="font-bold text-[#8B5E47]">Weaknesses:</span>
              <p className="text-[#4A2F24] leading-relaxed">{(swot?.weaknesses || []).join('; ')}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1">
              <span className="font-bold text-[#6B4535]">Opportunities:</span>
              <p className="text-[#4A2F24] leading-relaxed">{(swot?.opportunities || []).join('; ')}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1">
              <span className="font-bold text-amber-800">Threats & Mitigations:</span>
              <p className="text-[#4A2F24] leading-relaxed">{(swot?.threats || []).join('; ')}</p>
            </div>
          </div>
        </div>

        {/* Section 5: Action Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A2F24] border-b border-[#F3E8DC] pb-1">
            5. Entrepreneur On-Ground Action Checklist
          </h3>
          <div className="space-y-2 text-xs">
            {nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#FAF7F3] border border-[#D9B99B]/40"
              >
                <div className="w-5 h-5 rounded-md bg-white border border-[#D9B99B]/70 flex items-center justify-center text-[10px] font-bold text-[#4A2F24] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="font-bold text-[#2B1B16]">{step.title}</span>
                  <p className="text-[11px] text-[#4A2F24] mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Research References */}
        <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 text-xs space-y-2">
          <span className="font-bold text-[#2B1B16] block">
            Institutional References & Methodology:
          </span>
          <p className="text-[#4A2F24] leading-relaxed">
            Data models adapted from Reserve Bank of India (RBI) Small Entrepreneur Guidelines, Ministry of MSME Udyam classification parameters, and Acumen/WEF research on assisted digital welfare discovery (Haqdarshak case benchmark).
          </p>
        </div>

        {/* Mandatory Prominent Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Official Disclaimer:</span> This report is an AI-assisted and rule-based decision-support prototype created by Team VYOMA for Smart India Hackathon 2026 (Problem Statement SIH26091). It does not constitute a legal loan sanction, formal credit endorsement, or financial guarantee. Actual credit terms and approvals remain solely subject to commercial underwriting by the lending financial institutions.
          </div>
        </div>

        {/* Signature & Endorsement Block for Print */}
        <div className="pt-8 border-t border-[#D9B99B]/60 grid grid-cols-2 gap-8 text-xs text-[#8B5E47]">
          <div className="space-y-6">
            <p className="font-semibold text-[#2B1B16]">Entrepreneur Declaration:</p>
            <div className="pt-4 border-b border-dashed border-[#8B5E47] w-48" />
            <p>Applicant Signature / Thumb Impression</p>
          </div>
          <div className="space-y-6 text-right">
            <p className="font-semibold text-[#2B1B16]">Advisory System Verification:</p>
            <p className="text-[#6B4535] font-bold">NIRNAY AI • Team VYOMA</p>
            <p className="text-[10px]">Smart India Hackathon 2026 Prototype</p>
          </div>
        </div>
      </div>
    </div>
  );
};
