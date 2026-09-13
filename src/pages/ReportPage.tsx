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
import { formatINR, getCapitalDeploymentCopy } from '../utils/financialCalculations';
import {
  getLocalizedFeasibilityStatus,
  getReportCopy,
  getReportDateLocale,
  localizeCategory,
  localizeDemoBusinessIdea,
} from '../services/reportLocalization';
import { ArrowLeft, Printer, ShieldAlert } from 'lucide-react';

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

const LOAN_LABEL: Record<LanguageCode, string> = {
  en: 'Estimated Loan Requirement',
  hi: 'अनुमानित ऋण आवश्यकता',
  bn: 'আনুমানিক ঋণের প্রয়োজন',
  mr: 'अंदाजित कर्ज आवश्यकता',
  ta: 'மதிப்பிடப்பட்ட கடன் தேவை',
  te: 'అంచనా రుణ అవసరం',
  kn: 'ಅಂದಾಜು ಸಾಲದ ಅಗತ್ಯ',
  gu: 'અંદાજિત લોન જરૂરિયાત',
  pa: 'ਅਨੁਮਾਨਿਤ ਕਰਜ਼ੇ ਦੀ ਲੋੜ',
};

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
  const copy = getReportCopy(language);
  const businessIdea = localizeDemoBusinessIdea(formData.businessIdea || formData.ideaText, language);
  const category = localizeCategory(formData.category, language);
  const statusLabel = getLocalizedFeasibilityStatus(feasibilityScore.overallScore, language);
  const localizedRecommendation = language === 'en' ? recommendation : copy.genericRecommendation;
  const localizedSwot = {
    strengths: language === 'en' ? (swot?.strengths || []).join('; ') : copy.genericStrength,
    weaknesses: language === 'en' ? (swot?.weaknesses || []).join('; ') : copy.genericWeakness,
    opportunities: language === 'en' ? (swot?.opportunities || []).join('; ') : copy.genericOpportunity,
    threats: language === 'en' ? (swot?.threats || []).join('; ') : copy.genericThreat,
  };
  const deployment = getCapitalDeploymentCopy(formData.category);
  const breakEvenText = growthData.breakEvenMonths > 36 ? '>36 months / not reached in model' : `${growthData.breakEvenMonths} ${copy.months}`;
  const handlePrint = () => window.print();

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-2" lang={language}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#D9B99B]/40 bg-white p-6 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('dashboard')} aria-label="Back to dashboard" className="rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] p-2 text-[#4A2F24] transition-colors hover:bg-[#F3E8DC]"><ArrowLeft className="h-4 w-4" /></button>
          <div><h1 className="text-xl font-extrabold text-[#2B1B16]">{copy.reportTitle}</h1><span className="text-xs text-[#8B5E47]">{copy.reportSubtitle}</span></div>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 rounded-xl bg-[#4A2F24] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#2B1B16]"><Printer className="h-4 w-4 text-[#D9B99B]" /><span>{language === 'en' ? 'Print / Save PDF' : copy.reportTitle}</span></button>
      </div>

      <div className="space-y-8 rounded-3xl border border-[#D9B99B]/60 bg-white p-6 text-[#2B1B16] shadow-sm print:border-0 print:p-0 print:shadow-none sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#4A2F24] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2"><span className="rounded bg-[#4A2F24] px-2 py-0.5 text-xs font-black text-white">NIRNAY AI</span><span className="text-xs font-bold tracking-wider text-[#8B5E47]">{copy.dossierLabel}</span></div>
            <h2 className="font-serif text-2xl font-extrabold tracking-tight text-[#2B1B16] sm:text-3xl">{copy.documentTitle}</h2>
            <p className="text-xs text-[#6B4535]">{copy.project}: <span className="font-bold">{businessIdea}</span> • {copy.category}: {category}</p>
          </div>
          <div className="shrink-0 space-y-0.5 text-right text-xs text-[#8B5E47]">
            <p><strong className="text-[#2B1B16]">{copy.generatedFor}:</strong> {formData.location.village}, {formData.location.district}</p>
            <p><strong>{copy.state}:</strong> {formData.location.state}</p>
            <p><strong>{copy.date}:</strong> {new Date().toLocaleDateString(getReportDateLocale(language), { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <p className="text-[10px] text-[#8B5E47]">{copy.documentRef}: NAI-SIH26-091</p>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="border-b border-[#F3E8DC] pb-1 text-sm font-bold uppercase tracking-wider text-[#4A2F24]">{copy.section1}</h3>
          <p className="text-xs leading-relaxed text-[#2B1B16]">{copy.summaryA} <strong>{businessIdea}</strong> — <strong>{formData.location.village}</strong>, {copy.block} <strong>{formData.location.block}</strong>, {copy.district} <strong>{formData.location.district}</strong>. {copy.summaryB} <strong>{formatINR(financialData.totalProjectCost)}</strong>. The 10% / 90% structure shown below is an indicative prototype planning assumption, not a lender sanction.</p>
          <div className="rounded-xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-3 text-xs text-[#6B4535]"><strong>{copy.feasibilityVerdict}:</strong> {feasibilityScore.overallScore}/100 — “{statusLabel}”. {localizedRecommendation}</div>
        </section>

        <section className="space-y-3">
          <h3 className="border-b border-[#F3E8DC] pb-1 text-sm font-bold uppercase tracking-wider text-[#4A2F24]">{copy.section2}</h3>
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            {[
              [copy.entrepreneurMargin, formatINR(financialData.entrepreneurMargin)],
              [copy.totalProjectCost, formatINR(financialData.totalProjectCost)],
              [LOAN_LABEL[language], formatINR(financialData.loanRequirement)],
              [copy.monthlyDebtService, formatINR(financialData.monthlyEMI)],
            ].map(([label, value]) => <div key={label} className="rounded-xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-3"><span className="block text-[10px] text-[#8B5E47]">{label}</span><span className="text-base font-extrabold text-[#2B1B16]">{value}</span></div>)}
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-[#D9B99B]/50 text-xs">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-[#D9B99B]/50 bg-[#FAF7F3] text-[#4A2F24]"><tr><th className="p-2.5 font-bold">{copy.deploymentHead}</th><th className="p-2.5 font-bold">{copy.specification}</th><th className="p-2.5 text-right font-bold">{copy.estimatedAmount}</th></tr></thead>
              <tbody className="divide-y divide-[#F3E8DC]">
                <tr><td className="p-2.5 font-semibold">{copy.capex}</td><td className="p-2.5 text-[#4A2F24]">{deployment.capex}</td><td className="p-2.5 text-right font-bold">{formatINR(financialData.breakdown.capexMachinery)}</td></tr>
                <tr><td className="p-2.5 font-semibold">{copy.inventory}</td><td className="p-2.5 text-[#4A2F24]">{deployment.inventory}</td><td className="p-2.5 text-right font-bold">{formatINR(financialData.breakdown.initialInventory)}</td></tr>
                <tr><td className="p-2.5 font-semibold">{copy.workingCapital}</td><td className="p-2.5 text-[#4A2F24]">{deployment.workingCapital}</td><td className="p-2.5 text-right font-bold">{formatINR(financialData.breakdown.workingCapital)}</td></tr>
                <tr className="bg-[#FAF7F3] text-sm font-extrabold"><td className="p-2.5" colSpan={2}>{copy.totalOutlay}</td><td className="p-2.5 text-right text-[#6B4535]">{formatINR(financialData.totalProjectCost)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="border-b border-[#F3E8DC] pb-1 text-sm font-bold uppercase tracking-wider text-[#4A2F24]">{copy.section3}</h3>
          <div className="space-y-2 rounded-xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-bold text-[#2B1B16]">{financialData.recommendedScheme}</span><span className="rounded bg-[#6F7655]/15 px-2 py-0.5 font-bold text-[#474e30]">Illustrative {financialData.interestRate}% p.a. • {Math.round(financialData.tenureMonths / 12)} years</span></div>
            <p className="leading-relaxed text-[#4A2F24]">{financialData.schemeRationale}</p>
            <div className="flex flex-wrap gap-4 border-t border-[#D9B99B]/30 pt-2 text-[11px] font-semibold text-[#6B4535]"><span>{copy.moratorium}: {financialData.moratoriumMonths} {copy.monthsGrace}</span><span>•</span><span>{copy.estimatedBreakEven}: {breakEvenText}</span><span>•</span><span>{copy.monthlyNetProfit}: {formatINR(growthData.projectedMonthlyProfit)}</span></div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="border-b border-[#F3E8DC] pb-1 text-sm font-bold uppercase tracking-wider text-[#4A2F24]">{copy.section4}</h3>
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <SwotCard label={copy.strengths} text={localizedSwot.strengths} />
            <SwotCard label={copy.weaknesses} text={localizedSwot.weaknesses} />
            <SwotCard label={copy.opportunities} text={localizedSwot.opportunities} />
            <SwotCard label={copy.threats} text={localizedSwot.threats} />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="border-b border-[#F3E8DC] pb-1 text-sm font-bold uppercase tracking-wider text-[#4A2F24]">{copy.section5}</h3>
          <div className="space-y-2 text-xs">{copy.nextSteps.map((step, idx) => <div key={step.title} className="flex items-start gap-2.5 rounded-lg border border-[#D9B99B]/40 bg-[#FAF7F3] p-2.5"><div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#D9B99B]/70 bg-white text-[10px] font-bold text-[#4A2F24]">{idx + 1}</div><div><span className="font-bold text-[#2B1B16]">{step.title}</span><p className="mt-0.5 text-[11px] leading-relaxed text-[#4A2F24]">{step.desc}</p></div></div>)}</div>
        </section>

        <section className="space-y-2 rounded-xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-4 text-xs"><span className="block font-bold text-[#2B1B16]">{copy.referencesTitle}:</span><p className="leading-relaxed text-[#4A2F24]">{copy.referencesText}</p></section>

        <section className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div className="leading-relaxed"><span className="font-bold">{copy.disclaimerTitle}:</span> {copy.disclaimerText} This document does not represent sanctioned credit or guaranteed scheme eligibility.</div></section>

        <div className="grid grid-cols-1 gap-8 border-t border-[#D9B99B]/60 pt-8 text-xs text-[#8B5E47] sm:grid-cols-2">
          <div className="space-y-6"><p className="font-semibold text-[#2B1B16]">{copy.declaration}:</p><div className="w-48 border-b border-dashed border-[#8B5E47] pt-4" /><p>{copy.signature}</p></div>
          <div className="space-y-6 text-left sm:text-right"><p className="font-semibold text-[#2B1B16]">{copy.verification}:</p><p className="font-bold text-[#6B4535]">NIRNAY AI • Team VYOMA</p><p className="text-[10px]">{copy.prototype}</p></div>
        </div>
      </div>
    </div>
  );
};

const SwotCard: React.FC<{ label: string; text: string }> = ({ label, text }) => (
  <div className="space-y-1 rounded-xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-3"><span className="font-bold text-[#6B4535]">{label}:</span><p className="leading-relaxed text-[#4A2F24]">{text}</p></div>
);
