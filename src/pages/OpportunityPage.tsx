import React from 'react';
import { AssessmentFormData, LocalOpportunityData, PageId, LanguageCode } from '../types';
import { LocalMapVisualization } from '../components/LocalMapVisualization';
import { EvidenceBadge, EvidenceLegendBar } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  MapPin,
  TrendingUp,
  Users2,
  AlertTriangle,
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface OpportunityPageProps {
  formData: AssessmentFormData;
  opportunityData: LocalOpportunityData;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const OpportunityPage: React.FC<OpportunityPageProps> = ({
  formData,
  opportunityData,
  onNavigate,
  language,
}) => {
  const locString = `${formData.location.village}, ${formData.location.block}, ${formData.location.district} (${formData.location.state})`;

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('oppTitle', language)}
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">
            Catchment mapping for <strong className="text-[#2B1B16]">{locString}</strong> across 5–10 km commercial radii.
          </p>
        </div>

        <button
          onClick={() => onNavigate('analysis')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"
        >
          <span>View Feasibility Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
            Hyper-Local Geospatial Intelligence
          </h2>
          <EvidenceBadge type="INDICATIVE" />
        </div>
        <LocalMapVisualization
          markers={opportunityData?.markers || []}
          userLocationName={formData?.location?.village || 'Your Location'}
          radiusKm={opportunityData?.radiusKm || 10}
        />
      </section>

      {/* 5 Core Market Opportunity Modules with Explicit Evidence Badges */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
          Market Intelligence Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Market Demand Signal */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#6F7655]/15 text-[#474e30] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <EvidenceBadge type="INDICATIVE" />
              </div>
              <h3 className="text-sm font-bold text-[#2B1B16]">Market Demand Signal</h3>
              <p className="text-xs text-[#4A2F24] leading-relaxed">
                {opportunityData?.demandSignal || 'Strong local recurring consumption with persistent commercial demand.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
              Source: Local trade surveys & household consumption patterns.
            </div>
          </div>

          {/* Card 2: Competitor Density */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#B9825B]/15 text-[#8B5E47] flex items-center justify-center">
                  <Users2 className="w-4 h-4" />
                </div>
                <EvidenceBadge type="VERIFY_LOCALLY" />
              </div>
              <h3 className="text-sm font-bold text-[#2B1B16]">Competitor Density</h3>
              <p className="text-xs text-[#4A2F24] leading-relaxed">
                {opportunityData?.competitorDensity || opportunityData?.competition || '2 informal collection points within 4 km, no chilling infrastructure'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
              Field verification needed with village Sarpanch & market traders.
            </div>
          </div>

          {/* Card 3: Market Gap */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <EvidenceBadge type="AI_INFERENCE" />
              </div>
              <h3 className="text-sm font-bold text-[#2B1B16]">Unmet Market Gap</h3>
              <p className="text-xs text-[#4A2F24] leading-relaxed">
                {opportunityData?.marketGap || 'Limited organized availability of tested, packaged goods within 5–10 km radius.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
              Synthesized opportunity based on dairy cold-chain absence.
            </div>
          </div>

          {/* Card 4: Recommended Operating Radius */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#4A2F24]/10 text-[#4A2F24] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <EvidenceBadge type="INDICATIVE" />
              </div>
              <h3 className="text-sm font-bold text-[#2B1B16]">Operating Radius</h3>
              <p className="text-xs text-[#4A2F24] leading-relaxed">
                {opportunityData?.recommendedRadius || `${opportunityData?.radiusKm || 10} km commercial radius (5 km core delivery)`}
              </p>
            </div>
            <div className="pt-2 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
              Optimizes logistics cost for perishable product handling.
            </div>
          </div>

          {/* Card 5: Suggested Product / Service Mix */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#6B4535]/15 text-[#6B4535] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <EvidenceBadge type="AI_INFERENCE" />
              </div>
              <h3 className="text-sm font-bold text-[#2B1B16]">Suggested High-Margin Product Mix</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {(opportunityData?.suggestedProductMix || [
                  'Chilled Pouch Milk (Cow & Buffalo)',
                  'Fresh Malai Paneer (200g/500g)',
                  'Set Curd / Dahi',
                  'Desi Ghee (Tin/Glass Pack)',
                ]).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-xs font-semibold text-[#2B1B16]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#8B5E47] pt-2 border-t border-[#F3E8DC]">
              Value-added products (e.g. Paneer and Curd) yield 25–40% higher gross margin than unprocessed raw milk.
            </p>
          </div>
        </div>
      </section>

      {/* Global Legend Bar */}
      <EvidenceLegendBar />
    </div>
  );
};
