import React from 'react';
import { X, ExternalLink, BookOpen, Layers, ShieldCheck, Award } from 'lucide-react';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sources = [
    {
      title: 'RBI – Financial Education for Small Entrepreneurs',
      url: 'https://m.rbi.org.in/FinancialEducation/SmallEntrepreneurs.aspx#',
      domain: 'Reserve Bank of India (RBI)',
      note: 'Foundational framework for debt-equity margins, working capital norms, and cash-flow literacy in rural micro-enterprises.',
    },
    {
      title: 'Udyam Registration Portal',
      url: 'https://udyamregistration.gov.in/',
      domain: 'Ministry of MSME, Govt. of India',
      note: 'Formal enterprise classification parameters (Micro, Small, Medium) and statutory scheme routing eligibility.',
    },
    {
      title: 'BHASHINI – National Language Translation Mission',
      url: 'https://bhashini.gov.in/',
      domain: 'Digital India / MeitY',
      note: 'Multilingual and voice-first accessibility reference architecture for vernacular Indian languages.',
    },
    {
      title: 'Haqdarshak Case Study — Acumen Social Impact',
      url: 'https://acumen.org/case-studies/haqdarshak/',
      domain: 'Acumen Fund',
      note: 'Demonstrates real-world assisted digital access model for government citizen welfare discovery.',
    },
    {
      title: 'WEF – The Art of AI for Impact: Haqdarshak 2026',
      url: 'https://reports.weforum.org/docs/WEF_The_Art_of_AI_for_Impact_Haqdarshak_2026.pdf',
      domain: 'World Economic Forum (WEF)',
      note: 'Analyzes scalable AI interventions in last-mile social security and welfare delivery mechanisms.',
    },
    {
      title: 'ACM Digital Library: Designing for Rural Financial Literacy',
      url: 'https://dl.acm.org/doi/10.1145/2676702.2677201',
      domain: 'ACM Digital Library',
      note: 'Human-Computer Interaction (HCI) research on visual numeric representations and voice interfaces for non-literate rural users.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B1B16]/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-[#D9B99B]/60 shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#4A2F24] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#D9B99B]" />
            <div>
              <h3 className="text-base font-bold text-white">
                Sources, Methodology & Case Reference
              </h3>
              <span className="text-xs text-[#D9B99B]">
                Team VYOMA • SIH 2026 Problem Statement SIH26091
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#D9B99B] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#4A2F24] bg-[#FAF7F3]">
          {/* Real-World Reference: Haqdarshak Card */}
          <div className="p-4 rounded-xl bg-white border border-[#D9B99B]/60 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#2B1B16] font-bold text-sm">
              <Award className="w-4 h-4 text-[#8B5E47]" />
              <h4>Real-World Research Reference: Haqdarshak</h4>
            </div>
            <p className="leading-relaxed text-[#4A2F24]">
              Haqdarshak demonstrates how localized, assisted digital access can help underserved communities discover and access government schemes.
            </p>
            <div className="p-3 rounded-lg bg-[#FAF7F3] border border-[#D9B99B]/40">
              <span className="font-bold text-[#2B1B16] block mb-1">
                How NIRNAY Extends This Direction Upstream:
              </span>
              <div className="flex flex-wrap items-center gap-2 font-bold text-[#6B4535]">
                <span>Business Opportunity</span>
                <span>→</span>
                <span>Feasibility</span>
                <span>→</span>
                <span>Finance</span>
                <span>→</span>
                <span>Scheme Guidance</span>
              </div>
              <p className="text-[11px] text-[#8B5E47] mt-1.5 leading-normal">
                While welfare discovery focuses downstream on entitlements, NIRNAY equips first-time micro-entrepreneurs to evaluate local commercial viability, structure their debt-equity ratio, and select the optimal lending pathway before committing capital.
              </p>
            </div>
          </div>

          {/* Evidence Distinction Notice */}
          <div className="p-3.5 rounded-xl bg-[#6F7655]/10 border border-[#6F7655]/30 flex items-start gap-2.5 text-[#474e30]">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#6F7655] mt-0.5" />
            <div>
              <span className="font-bold">Transparent Evidence Protocol:</span> Source-backed information (official scheme parameters, statutory ratios) is strictly distinguished from indicative prototype estimates (simulated radius demand, algorithmic feasibility scoring).
            </div>
          </div>

          {/* Cited Sources List */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#2B1B16] text-xs uppercase tracking-wider">
              Authoritative Reference Citations
            </h4>
            <div className="space-y-2.5">
              {sources.map((src, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-xl border border-[#D9B99B]/50 hover:border-[#8B5E47] transition-all space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#2B1B16] hover:text-[#6B4535] flex items-center gap-1 group"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-[#8B5E47] group-hover:text-[#6B4535]" />
                    </a>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F3] border border-[#D9B99B]/40 text-[#6B4535] shrink-0">
                      {src.domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B5E47] leading-relaxed">
                    {src.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-[#D9B99B]/40 flex items-center justify-between text-[11px] text-[#8B5E47]">
          <span>SIH26091 Prototype Benchmark</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#4A2F24] text-white hover:bg-[#2B1B16] transition-colors font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
