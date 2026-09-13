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
import { demoT } from '../services/demoLocalization';
import {
  DEMO_BUSINESSES,
  DEMO_CITIES,
  DemoBusinessId,
  DemoCityId,
  getDemoBusinessLabel,
} from '../utils/demoScenarios';
import {
  LayoutDashboard,
  Sparkles,
  Calculator,
  Compass,
  TrendingUp,
  FileCheck,
  Play,
  ArrowRight,
  Mic,
  MapPin,
  Lightbulb,
  ShieldCheck,
  BriefcaseBusiness,
} from 'lucide-react';

interface DashboardPageProps {
  formData: AssessmentFormData;
  feasibilityScore: FeasibilityScoreData;
  financialData: FinancialStructureData;
  growthData: GrowthProjectionData;
  onNavigate: (page: PageId) => void;
  onTryDemo: (cityId?: DemoCityId, businessId?: DemoBusinessId) => void;
  selectedDemoCity: DemoCityId;
  selectedDemoBusiness: DemoBusinessId;
  onDemoCityChange: (cityId: DemoCityId) => void;
  onDemoBusinessChange: (businessId: DemoBusinessId) => void;
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
  selectedDemoCity,
  selectedDemoBusiness,
  onDemoCityChange,
  onDemoBusinessChange,
  onOpenVoice,
  language,
}) => {
  const locString = `${formData.location.village}, ${formData.location.district} (${formData.location.state})`;
  const selectedCity = DEMO_CITIES.find((city) => city.id === selectedDemoCity) || DEMO_CITIES[0];
  const selectedBusinessLabel = getDemoBusinessLabel(selectedDemoBusiness, language);

  const cards = [
    {
      label: demoT('feasibilityScore', language),
      value: `${feasibilityScore.overallScore}/100`,
      meta: feasibilityScore.statusLabel.split('—')[0],
      action: demoT('exploreMetrics', language),
      icon: Sparkles,
      page: 'analysis' as PageId,
    },
    {
      label: demoT('capitalArchitecture', language),
      value: formatINR(financialData.totalProjectCost),
      meta: `${demoT('fromMargin', language)} ${formatINR(financialData.entrepreneurMargin)}`,
      action: demoT('viewEmi', language),
      icon: Calculator,
      page: 'finance' as PageId,
    },
    {
      label: demoT('statutoryScheme', language),
      value: financialData.recommendedScheme,
      meta: financialData.schemeRationale || demoT('schemeSupport', language),
      action: demoT('compareSchemes', language),
      icon: Compass,
      page: 'schemes' as PageId,
    },
    {
      label: demoT('monthlyNetProfit', language),
      value: formatINR(growthData.projectedMonthlyProfit),
      meta: `${demoT('breakEven', language)} ${growthData.breakEvenMonths} ${demoT('months', language)}`,
      action: demoT('inspectGrowth', language),
      icon: TrendingUp,
      page: 'growth' as PageId,
    },
  ];

  return (
    <div className="space-y-6 py-2">
      <section className="overflow-hidden rounded-3xl border border-[#D9B99B]/40 bg-white shadow-xs">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_300px] lg:items-center">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4E9DA] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#6B4535]">
                <LayoutDashboard className="h-3.5 w-3.5" />
                {demoT('executiveCockpit', language)}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF1E5] px-3 py-1 text-[11px] font-bold text-[#59603F]">
                <MapPin className="h-3.5 w-3.5" /> {formData.location.district}
              </span>
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F5EEE6] px-3 py-1 text-[11px] font-bold text-[#6B4535]">
                <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{formData.category}</span>
              </span>
            </div>

            <h1 className="max-w-4xl text-2xl font-black leading-tight text-[#2B1B16] sm:text-3xl">
              {formData.businessIdea || formData.ideaText}
            </h1>
            <p className="mt-2 text-sm text-[#765849]">
              {demoT('activeEvaluation', language)}: <span className="font-extrabold text-[#2B1B16]">{locString}</span>
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('assessment')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B4535] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#503126]"
              >
                <Lightbulb className="h-4 w-4" /> {demoT('businessAssessment', language)}
              </button>
              <button
                onClick={onOpenVoice}
                className="inline-flex items-center gap-2 rounded-xl bg-[#4A2F24] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#2B1B16]"
              >
                <Mic className="h-4 w-4" /> {demoT('askNirnay', language)}
              </button>
              <button
                onClick={() => onNavigate('report')}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D9B99B]/70 bg-[#FAF7F3] px-4 py-2.5 text-xs font-extrabold text-[#4A2F24] transition hover:bg-[#F3E8DC]"
              >
                <FileCheck className="h-4 w-4" /> {demoT('viewPlan', language)}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D9B99B]/60 bg-[#FAF7F3] p-4">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8B5E47]">{demoT('tryDemo', language)}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-[#765849]">{demoT('cityDemoHint', language)}</p>

            <div className="mt-3 space-y-2.5">
              <label className="block">
                <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-[#8B5E47]">{demoT('selectCity', language)}</span>
                <div className="flex items-center gap-2 rounded-xl border border-[#D9B99B]/70 bg-white px-3 py-2.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B9825B]" />
                  <select
                    value={selectedDemoCity}
                    onChange={(e) => onDemoCityChange(e.target.value as DemoCityId)}
                    className="w-full bg-transparent text-xs font-extrabold text-[#4A2F24] outline-none"
                  >
                    {DEMO_CITIES.map((city) => <option key={city.id} value={city.id}>{city.label}</option>)}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-[10px] font-extrabold uppercase tracking-wider text-[#8B5E47]">{demoT('selectBusiness', language)}</span>
                <div className="flex items-center gap-2 rounded-xl border border-[#D9B99B]/70 bg-white px-3 py-2.5">
                  <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-[#6F7655]" />
                  <select
                    value={selectedDemoBusiness}
                    onChange={(e) => onDemoBusinessChange(e.target.value as DemoBusinessId)}
                    className="w-full bg-transparent text-xs font-extrabold text-[#4A2F24] outline-none"
                  >
                    {DEMO_BUSINESSES.map((business) => (
                      <option key={business.id} value={business.id}>{business.labels[language] || business.labels.en}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <div className="mt-3 rounded-xl bg-[#EEF1E5] px-3 py-2 text-[11px] font-bold leading-relaxed text-[#59603F]">
              {selectedCity.label} · {selectedBusinessLabel}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-[#8B6D5D]">{demoT('businessDemoHint', language)}</p>

            <button
              onClick={() => onTryDemo(selectedDemoCity, selectedDemoBusiness)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9B99B]/70 bg-white px-3 py-2 text-xs font-extrabold text-[#6B4535] transition hover:bg-[#F3E8DC]"
            >
              <Play className="h-3.5 w-3.5 fill-[#B9825B] text-[#B9825B]" />
              {demoT('resetDemo', language)}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.page)}
              className="group rounded-2xl border border-[#D9B99B]/40 bg-white p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-[#8B5E47]/70 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B5E47]">{card.label}</span>
                <Icon className="h-4 w-4 text-[#6B4535] transition group-hover:scale-110" />
              </div>
              <div className="mt-3 line-clamp-2 text-2xl font-black text-[#2B1B16]">{card.value}</div>
              <div className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-relaxed text-[#765849]">{card.meta}</div>
              <div className="mt-4 flex items-center justify-between border-t border-[#F3E8DC] pt-3 text-[11px] font-extrabold text-[#6B4535]">
                <span>{card.action}</span>
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <button onClick={() => onNavigate('opportunity')} className="rounded-2xl border border-[#D9B99B]/40 bg-white p-5 text-left transition hover:border-[#8B5E47]/70">
          <MapPin className="h-5 w-5 text-[#8B5E47]" />
          <h3 className="mt-3 text-sm font-black text-[#2B1B16]">{demoT('localOpportunityCard', language)}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#765849]">{formData.targetMarket || `${formData.location.district} local customer demand and competition analysis.`}</p>
        </button>

        <button onClick={() => onNavigate('schemes')} className="rounded-2xl border border-[#D9B99B]/40 bg-white p-5 text-left transition hover:border-[#8B5E47]/70">
          <ShieldCheck className="h-5 w-5 text-[#6F7655]" />
          <h3 className="mt-3 text-sm font-black text-[#2B1B16]">{demoT('schemeSupport', language)}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#765849]">{financialData.recommendedScheme} · {formatINR(financialData.loanRequirement)} {demoT('loan', language)}</p>
        </button>

        <button onClick={() => onNavigate('report')} className="rounded-2xl border border-[#D9B99B]/40 bg-[#4A2F24] p-5 text-left text-white transition hover:bg-[#2B1B16]">
          <FileCheck className="h-5 w-5 text-[#D9B99B]" />
          <h3 className="mt-3 text-sm font-black">{demoT('report', language)}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#E8D8CA]">{demoT('viewPlan', language)} →</p>
        </button>
      </section>
    </div>
  );
};
