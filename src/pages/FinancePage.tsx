import React from 'react';
import { FinancialStructureData, AssessmentFormData, PageId, LanguageCode } from '../types';
import { formatINR, getCapitalDeploymentCopy } from '../utils/financialCalculations';
import { EMICalculator } from '../components/EMICalculator';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import { Calculator, Briefcase, Layers, ArrowRight } from 'lucide-react';

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
  const deployment = getCapitalDeploymentCopy(formData.category);
  const routeLabel = financialData.recommendedScheme.includes('Term Loan')
    ? 'Long-term financing planning route'
    : 'Micro-enterprise financing planning route';

  return (
    <div className="space-y-8 py-2">
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">{t('financeTitle', language)}</h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1 max-w-3xl">
            Minimum viable plan for <strong>{formData.category}</strong>: available capital {formatINR(financialData.entrepreneurMargin)} ({financialData.marginPercentage}%) and an estimated funding gap of {formatINR(financialData.loanRequirement)} ({financialData.loanPercentage}%). Verify the setup cost with current supplier quotations.
          </p>
        </div>

        <button onClick={() => onNavigate('schemes')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all">
          <span>Explore Financing & Scheme Checks</span><ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#8B5E47] uppercase tracking-wider">Entrepreneur Margin</span>
            <EvidenceBadge type="INDICATIVE" showIcon={false} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B1B16]">{formatINR(financialData.entrepreneurMargin)}</div>
          <p className="text-[11px] text-[#8B5E47]">User-entered self-contribution used for the prototype planning model.</p>
        </div>

        <div className="bg-[#4A2F24] text-white rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#D9B99B] uppercase tracking-wider">Planning Project Envelope</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] text-[#F3E8DC] font-bold">Minimum viable estimate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{formatINR(financialData.totalProjectCost)}</div>
          <p className="text-[11px] text-[#D9B99B]">Category baseline for planning. Replace it with verified supplier quotations before investment.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#6F7655] uppercase tracking-wider">Estimated Debt Requirement</span>
            <EvidenceBadge type="VERIFY_LOCALLY" showIcon={false} />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#474e30]">{formatINR(financialData.loanRequirement)}</div>
          <p className="text-[11px] text-[#8B5E47]">Planning estimate only. Loan sanction, rate and lender share require official verification.</p>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-[#8B5E47]" /><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Business-Specific Capital Deployment</h2></div>
          <EvidenceBadge type="INDICATIVE" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CapitalCard title="Equipment / Setup" amount={financialData.breakdown.capexMachinery} description={deployment.capex} />
          <CapitalCard title="Opening Inventory / Inputs" amount={financialData.breakdown.initialInventory} description={deployment.inventory} />
          <CapitalCard title="Working-Capital Buffer" amount={financialData.breakdown.workingCapital} description={deployment.workingCapital} />
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#8B5E47]" /><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Indicative Financing Route</h2></div>
          <EvidenceBadge type="VERIFY_LOCALLY" />
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#6B4535] text-white text-xs font-bold uppercase tracking-wider">{financialData.recommendedScheme}</span>
            <h3 className="text-lg font-bold text-[#2B1B16]">{routeLabel}</h3>
            <p className="text-xs text-[#4A2F24] max-w-xl leading-relaxed">{financialData.schemeRationale}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center shrink-0">
            <TermCard label="Planning Rate" value={`${financialData.interestRate}% p.a.`} />
            <TermCard label="Planning Tenure" value={`${Math.round(financialData.tenureMonths / 12)} years`} />
            <TermCard label="Planning Grace" value={`${financialData.moratoriumMonths} months`} />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Repayment Scenario Calculator</h2>
          <EvidenceBadge type="INDICATIVE" />
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

function CapitalCard({ title, amount, description }: { title: string; amount: number; description: string }) {
  return (
    <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1.5">
      <span className="text-xs font-semibold text-[#8B5E47] block">{title}</span>
      <div className="text-xl font-extrabold text-[#2B1B16]">{formatINR(amount)}</div>
      <p className="text-[11px] text-[#8B5E47] leading-relaxed">{description}</p>
    </div>
  );
}

function TermCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-white border border-[#D9B99B]/60">
      <span className="text-[10px] text-[#8B5E47] block">{label}</span>
      <span className="text-xs font-bold text-[#2B1B16]">{value}</span>
    </div>
  );
}
