import React from 'react';
import { FinancialStructureData, SchemeOption, PageId, LanguageCode } from '../types';
import { SCHEME_OPTIONS, formatINR } from '../utils/financialCalculations';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  Compass,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Building2,
  Clock,
  Percent,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SchemesPageProps {
  financialData: FinancialStructureData;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const SchemesPage: React.FC<SchemesPageProps> = ({
  financialData,
  onNavigate,
  language,
}) => {
  const currentCost = financialData.totalProjectCost;
  const isTermLoan = currentCost > 140000;

  const requiredDocuments = [
    { name: 'Aadhaar Card & PAN Card', desc: 'Primary identity & KYC verification' },
    { name: 'Bank Account Passbook / 6 Months Statement', desc: 'Proof of operational bank account' },
    { name: 'Machinery Quotation / Equipment Proforma Invoice', desc: 'From authorized supplier/dealer' },
    { name: 'Land / Premise Rent Agreement or NOC', desc: 'For enterprise operational unit' },
    { name: 'Udyam Registration Certificate', desc: 'Free online registration under Ministry of MSME' },
    { name: 'Electricity Bill or Utility Proof', desc: 'Valid address proof of workplace' },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('schemesTitle', language)}
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">
            Rule-based threshold router mapping your project cost of{' '}
            <strong className="text-[#2B1B16]">{formatINR(currentCost)}</strong> to statutory credit facilities.
          </p>
        </div>

        <button
          onClick={() => onNavigate('growth')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"
        >
          <span>View Growth Projections</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Eligible Scheme Highlight Card */}
      <section className="bg-[#4A2F24] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[#FAF7F3] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#B9825B]" />
              <span>Matched Statutory Option</span>
            </div>
            <span className="text-xs text-[#D9B99B]">
              Deterministic Threshold Rule
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Eligible: {isTermLoan ? 'Term Loan Scheme (Option B)' : 'Micro Finance Scheme (Option A)'}
          </h2>

          <div className="p-4 rounded-xl bg-white/10 border border-white/15 max-w-2xl text-xs text-[#FAF7F3] leading-relaxed">
            <span className="font-bold text-[#D9B99B]">Qualification Reason:</span>{' '}
            {financialData.schemeRationale} Because your estimated project cost is {formatINR(currentCost)}, it exceeds the ₹1.40 Lakh threshold and qualifies for 90% debt financing up to 7 years with 6 months grace.
          </div>
        </div>
      </section>

      {/* Side-by-Side Scheme Comparison Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
            Statutory Scheme Comparison Matrix
          </h2>
          <EvidenceBadge type="SOURCE_BACKED" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SCHEME_OPTIONS.map((scheme) => {
            const isSelected = scheme.id === (isTermLoan ? 'term-loan' : 'micro-finance');
            return (
              <div
                key={scheme.id}
                className={`rounded-3xl p-6 sm:p-7 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-[#6B4535] shadow-md ring-4 ring-[#6B4535]/10'
                    : 'bg-white border border-[#D9B99B]/40 shadow-xs opacity-85'
                }`}
              >
                <div className="space-y-4">
                  {/* Scheme Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/40">
                        {scheme.code}
                      </span>
                      <h3 className="text-lg font-bold text-[#2B1B16] mt-1.5">
                        {scheme.name}
                      </h3>
                      <span className="text-xs text-[#8B5E47]">{scheme.target}</span>
                    </div>

                    {isSelected && (
                      <span className="px-2.5 py-1 rounded-full bg-[#6F7655]/15 text-[#474e30] border border-[#6F7655]/30 text-xs font-bold shrink-0">
                        Active Match
                      </span>
                    )}
                  </div>

                  {/* Scheme Parameter Grid */}
                  <div className="space-y-2.5 text-xs pt-2 border-t border-[#F3E8DC]">
                    <div className="flex justify-between py-1.5 border-b border-[#FAF7F3]">
                      <span className="text-[#8B5E47]">Project Cost Ceiling:</span>
                      <span className="font-bold text-[#2B1B16]">{scheme.projectCostCeiling}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#FAF7F3]">
                      <span className="text-[#8B5E47]">Max Agency Support:</span>
                      <span className="font-bold text-[#2B1B16]">{scheme.maxAgencySupport}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#FAF7F3]">
                      <span className="text-[#8B5E47]">Subsidized Interest Rate:</span>
                      <span className="font-bold text-[#6B4535]">{scheme.interestRate}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#FAF7F3]">
                      <span className="text-[#8B5E47]">Standard Tenure:</span>
                      <span className="font-bold text-[#2B1B16]">{scheme.tenure}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#8B5E47]">Repayment Moratorium:</span>
                      <span className="font-bold text-[#474e30]">{scheme.moratorium}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
                  {scheme.id === 'micro-finance'
                    ? 'Best suited for low-capex roadside kiosks, tailoring units, and tiny rural artisans.'
                    : 'Engineered for machinery-driven enterprises requiring substantial capital setup.'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mandatory Statutory Checklist */}
      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              Application Documentation Checklist
            </h2>
          </div>
          <span className="text-xs text-[#8B5E47]">Pre-submission readiness</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {requiredDocuments.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-1"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6F7655] shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-[#2B1B16]">{doc.name}</span>
              </div>
              <p className="text-[11px] text-[#8B5E47] pl-6">{doc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Official Government Portals */}
      <section className="p-5 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/50 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2B1B16]">
            <Building2 className="w-4 h-4 text-[#6B4535]" />
            <span>Official Government Enterprise Portals</span>
          </div>
          <p className="text-xs text-[#8B5E47]">
            Register your enterprise formally to unlock priority lending and interest subsidies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://udyamregistration.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9B99B]/70 text-xs font-bold text-[#4A2F24] hover:bg-[#F3E8DC] transition-colors"
          >
            <span>Udyam Registration Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8B5E47]" />
          </a>

          <a
            href="https://m.rbi.org.in/FinancialEducation/SmallEntrepreneurs.aspx#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9B99B]/70 text-xs font-bold text-[#4A2F24] hover:bg-[#F3E8DC] transition-colors"
          >
            <span>RBI Entrepreneur Guide</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8B5E47]" />
          </a>
        </div>
      </section>
    </div>
  );
};
