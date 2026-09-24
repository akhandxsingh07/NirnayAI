import React from 'react';
import { AssessmentFormData, LocalOpportunityData, PageId, LanguageCode } from '../types';
import { LiveMarketMap } from '../components/LiveMarketMap';
import { LiveIntelligencePanel } from '../components/LiveIntelligencePanel';
import { EvidenceBadge, EvidenceLegendBar } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  MapPin,
  TrendingUp,
  Users2,
  AlertTriangle,
  Compass,
  ArrowRight,
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
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('navOpportunity', language)}
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

      <section className="space-y-3">
        <LiveMarketMap
          district={formData.location.district}
          state={formData.location.state}
          category={formData.category}
          language={language}
          latitude={formData.location.latitude}
          longitude={formData.location.longitude}
          village={formData.location.village}
        />
      </section>

      <LiveIntelligencePanel
        district={formData.location.district}
        state={formData.location.state}
        category={formData.category}
        latitude={formData.location.latitude}
        longitude={formData.location.longitude}
        language={language}
      />

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
          Market Intelligence Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              Source: local assessment model; verify demand with customer interviews and test sales.
            </div>
          </div>

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
                {opportunityData?.competitorDensity || opportunityData?.competition || 'Use the live map above to inspect mapped competitors, then verify informal businesses locally.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
              Live map coverage and informal-market reality can differ; field verification remains important.
            </div>
          </div>

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
                {opportunityData?.marketGap || 'Limited organized availability or service consistency may create a local gap to validate.'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#F3E8DC] text-[11px] text-[#8B5E47]">
              AI inference should be validated with mapped places, customer interviews and local supplier checks.
            </div>
          </div>

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
              Adjust the live map between 5 km and 10 km to compare market reach and competition.
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#6B4535]/15 text-[#6B4535] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <EvidenceBadge type="AI_INFERENCE" />
              </div>
              <h3 className="text-sm font-bold text-[#2B1B16]">Suggested Product / Service Mix</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {(opportunityData?.suggestedProductMix || [
                  'Core high-frequency offer',
                  'Value-added secondary offer',
                  'Bulk institutional package',
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
              Compare this AI-suggested mix with the live competitor and customer-hub map before investing.
            </p>
          </div>
        </div>
      </section>

      <EvidenceLegendBar />
    </div>
  );
};
