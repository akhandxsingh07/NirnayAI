import React from 'react';
import { FinancialStructureData, PageId, LanguageCode } from '../types';
import { SCHEME_OPTIONS, formatINR } from '../utils/financialCalculations';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import { Compass, CheckCircle2, ExternalLink, FileCheck, Building2, ArrowRight, ShieldAlert } from 'lucide-react';

interface SchemesPageProps {
  financialData: FinancialStructureData;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({ financialData, onNavigate, language }) => {
  const currentCost = financialData.totalProjectCost;
  const isTermLoan = currentCost > 140000;
  const requiredDocuments = [
    { name: 'Aadhaar & PAN', desc: 'Identity and KYC documents; lender requirements can vary.' },
    { name: 'Bank statement / passbook', desc: 'Keep recent account records ready for verification.' },
    { name: 'Supplier / equipment quotations', desc: 'Collect at least two current quotations for major purchases.' },
    { name: 'Premise / land proof', desc: 'Ownership, rent agreement or NOC where applicable.' },
    { name: 'Udyam registration', desc: 'Verify whether MSME registration is applicable to the selected enterprise.' },
    { name: 'Business-specific licences', desc: 'FSSAI, local trade, pollution, electrical or other permissions where applicable.' },
  ];

  const matchReason = isTermLoan
    ? `${formatINR(currentCost)} is above the prototype ₹1.40 lakh planning threshold, so NirnayAI models a longer-term debt route. This is not a statement of bank or government-scheme eligibility.`
    : `${formatINR(currentCost)} is within the prototype ₹1.40 lakh planning threshold, so NirnayAI models a smaller micro-finance route. This is not a statement of bank or government-scheme eligibility.`;

  return (
    <div className="space-y-8 py-2">
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50"><Compass className="w-5 h-5" /></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">{t('schemesTitle', language)}</h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1 max-w-3xl">Planning-route comparison for project cost <strong>{formatINR(currentCost)}</strong>. Actual government schemes, interest rates, subsidy rules and lender eligibility must be checked from official sources.</p>
        </div>
        <button onClick={() => onNavigate('growth')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"><span>View Growth Scenario</span><ArrowRight className="w-4 h-4" /></button>
      </div>

      <section className="bg-[#4A2F24] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#FAF7F3] text-xs font-bold"><CheckCircle2 className="w-4 h-4 text-[#B9825B]" /><span>Indicative Planning Match</span></div>
            <span className="text-xs text-[#D9B99B]">VERIFY WITH OFFICIAL LENDER / myScheme</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{financialData.recommendedScheme}</h2>
          <div className="p-4 rounded-xl bg-white/10 border border-white/15 max-w-3xl text-xs text-[#FAF7F3] leading-relaxed"><span className="font-bold text-[#D9B99B]">Why this planning route:</span> {matchReason}</div>
        </div>
      </section>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div><strong>No automatic eligibility claim:</strong> NirnayAI does not know the lender's current underwriting, subsidy budget, category reservation, collateral, credit history or scheme-specific documents. Treat this page as financial structuring guidance and verify the final route officially.</div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Planning Route Comparison</h2><EvidenceBadge type="VERIFY_LOCALLY" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCHEME_OPTIONS.map((scheme) => {
            const isSelected = scheme.id === (isTermLoan ? 'term-loan' : 'micro-finance');
            return (
              <div key={scheme.id} className={`rounded-3xl p-6 sm:p-7 transition-all flex flex-col justify-between ${isSelected ? 'bg-white border-2 border-[#6B4535] shadow-md ring-4 ring-[#6B4535]/10' : 'bg-white border border-[#D9B99B]/40 shadow-xs opacity-90'}`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div><span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/40">{scheme.code}</span><h3 className="text-lg font-bold text-[#2B1B16] mt-1.5">{scheme.name}</h3><span className="text-xs text-[#8B5E47]">{scheme.target}</span></div>
                    {isSelected && <span className="px-2.5 py-1 rounded-full bg-[#6F7655]/15 text-[#474e30] border border-[#6F7655]/30 text-xs font-bold shrink-0">Model Match</span>}
                  </div>
                  <div className="space-y-2.5 text-xs pt-2 border-t border-[#F3E8DC]">
                    <Row label="Project-cost rule" value={scheme.projectCostCeiling} />
                    <Row label="Debt assumption" value={scheme.maxAgencySupport} />
                    <Row label="Rate assumption" value={scheme.interestRate} />
                    <Row label="Tenure assumption" value={scheme.tenure} />
                    <Row label="Grace assumption" value={scheme.moratorium} />
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">Illustrative prototype assumptions only; do not present this card as a sanction letter or official scheme certificate.</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3"><div className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#8B5E47]" /><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Application Readiness Checklist</h2></div><EvidenceBadge type="VERIFY_LOCALLY" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {requiredDocuments.map((doc) => <div key={doc.name} className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1"><div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#6F7655] shrink-0 mt-0.5" /><span className="text-xs font-bold text-[#2B1B16]">{doc.name}</span></div><p className="text-[11px] text-[#8B5E47] pl-6">{doc.desc}</p></div>)}
        </div>
      </section>

      <section className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/50 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1"><div className="flex items-center gap-2 text-xs font-bold text-[#2B1B16]"><Building2 className="w-4 h-4 text-[#6B4535]" /><span>Official Verification Portals</span></div><p className="text-xs text-[#8B5E47]">Use official portals and the implementing bank/agency for current terms and eligibility.</p></div>
        <div className="flex flex-wrap items-center gap-2.5">
          <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9B99B]/70 text-xs font-bold text-[#4A2F24] hover:bg-[#F3E8DC] transition-colors"><span>myScheme</span><ExternalLink className="w-3.5 h-3.5 text-[#8B5E47]" /></a>
          <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9B99B]/70 text-xs font-bold text-[#4A2F24] hover:bg-[#F3E8DC] transition-colors"><span>Udyam Registration</span><ExternalLink className="w-3.5 h-3.5 text-[#8B5E47]" /></a>
          <a href="https://m.rbi.org.in/FinancialEducation/SmallEntrepreneurs.aspx#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9B99B]/70 text-xs font-bold text-[#4A2F24] hover:bg-[#F3E8DC] transition-colors"><span>RBI Entrepreneur Guide</span><ExternalLink className="w-3.5 h-3.5 text-[#8B5E47]" /></a>
        </div>
      </section>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 py-1.5 border-b border-[#FAF7F3] last:border-0"><span className="text-[#8B5E47]">{label}:</span><span className="font-bold text-right text-[#2B1B16]">{value}</span></div>;
}
