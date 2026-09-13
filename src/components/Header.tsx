import React from 'react';
import { PageId, LanguageCode } from '../types';
import { t } from '../services/localizationService';
import { demoT } from '../services/demoLocalization';
import {
  DEMO_BUSINESSES,
  DEMO_CITIES,
  DemoBusinessId,
  DemoCityId,
  getDemoBusinessLabel,
} from '../utils/demoScenarios';
import { Menu, Mic, HelpCircle, Play, MapPin, BriefcaseBusiness } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onOpenVoice: () => void;
  onOpenHelp: () => void;
  onTryDemo: (cityId?: DemoCityId, businessId?: DemoBusinessId) => void;
  selectedDemoCity: DemoCityId;
  selectedDemoBusiness: DemoBusinessId;
  onDemoCityChange: (cityId: DemoCityId) => void;
  onDemoBusinessChange: (businessId: DemoBusinessId) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  language,
  onOpenVoice,
  onOpenHelp,
  onTryDemo,
  selectedDemoCity,
  selectedDemoBusiness,
  onDemoCityChange,
  onDemoBusinessChange,
  onToggleMobileMenu,
}) => {
  const pageTitleMap: Record<PageId, string> = {
    landing: 'dashboard',
    'citizen-login': 'dashboard',
    admin: 'dashboard',
    dashboard: 'executiveCockpit',
    assessment: 'businessAssessment',
    opportunity: 'localOpportunity',
    analysis: 'feasibility',
    finance: 'finance',
    schemes: 'schemes',
    growth: 'growth',
    report: 'report',
  };

  const selectedCity = DEMO_CITIES.find((city) => city.id === selectedDemoCity) || DEMO_CITIES[0];
  const selectedBusinessLabel = getDemoBusinessLabel(selectedDemoBusiness, language);

  return (
    <header className="sticky top-0 z-30 border-b border-[#D9B99B]/40 bg-[#FAF7F3]/95 px-4 py-3 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="rounded-xl border border-[#D9B99B]/60 bg-white p-2 text-[#4A2F24] hover:bg-[#F3E8DC] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <span className="block truncate text-[10px] font-extrabold uppercase tracking-wider text-[#8B5E47]">
              NIRNAY AI • {demoT(pageTitleMap[currentPage], language)}
            </span>
            <h2 className="hidden truncate text-sm font-extrabold leading-tight text-[#2B1B16] sm:block sm:text-base">
              {t('appSubtitle', language)}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 xl:flex">
            <div className="flex items-center gap-2 rounded-xl border border-[#D9B99B]/60 bg-white px-2.5 py-1.5 shadow-2xs">
              <MapPin className="h-3.5 w-3.5 text-[#B9825B]" />
              <select
                value={selectedDemoCity}
                onChange={(e) => onDemoCityChange(e.target.value as DemoCityId)}
                aria-label={demoT('selectCity', language)}
                className="max-w-32 bg-transparent text-xs font-bold text-[#4A2F24] outline-none"
              >
                {DEMO_CITIES.map((city) => (
                  <option key={city.id} value={city.id}>{city.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#D9B99B]/60 bg-white px-2.5 py-1.5 shadow-2xs">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-[#6F7655]" />
              <select
                value={selectedDemoBusiness}
                onChange={(e) => onDemoBusinessChange(e.target.value as DemoBusinessId)}
                aria-label={demoT('selectBusiness', language)}
                className="max-w-48 bg-transparent text-xs font-bold text-[#4A2F24] outline-none"
              >
                {DEMO_BUSINESSES.map((business) => (
                  <option key={business.id} value={business.id}>{business.labels[language] || business.labels.en}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => onTryDemo(selectedDemoCity, selectedDemoBusiness)}
            title={`${demoT('tryDemo', language)} — ${selectedCity.label} · ${selectedBusinessLabel}`}
            className="flex items-center gap-1.5 rounded-xl border border-[#D9B99B]/60 bg-white px-3 py-1.5 text-xs font-bold text-[#4A2F24] shadow-2xs transition-all hover:bg-[#F3E8DC]"
          >
            <Play className="h-3.5 w-3.5 fill-[#B9825B] text-[#B9825B]" />
            <span className="hidden lg:inline">{demoT('tryDemo', language)} · {selectedCity.label}</span>
            <span className="lg:hidden">{demoT('demo', language)}</span>
          </button>

          <button
            onClick={onOpenVoice}
            className="group flex items-center gap-2 rounded-xl bg-[#4A2F24] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#2B1B16]"
          >
            <Mic className="h-3.5 w-3.5 text-[#D9B99B] transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">{demoT('askNirnay', language)}</span>
            <span className="sm:hidden">{demoT('voice', language)}</span>
          </button>

          <button
            onClick={onOpenHelp}
            title={demoT('methodology', language)}
            className="rounded-xl border border-[#D9B99B]/60 bg-white p-2 text-[#8B5E47] transition-colors hover:bg-[#F3E8DC] hover:text-[#2B1B16]"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-2 grid max-w-7xl grid-cols-1 gap-2 xl:hidden sm:grid-cols-2">
        <label className="flex items-center gap-2 rounded-xl border border-[#D9B99B]/60 bg-white px-3 py-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B9825B]" />
          <select
            value={selectedDemoCity}
            onChange={(e) => onDemoCityChange(e.target.value as DemoCityId)}
            aria-label={demoT('selectCity', language)}
            className="w-full bg-transparent text-xs font-bold text-[#4A2F24] outline-none"
          >
            {DEMO_CITIES.map((city) => (
              <option key={city.id} value={city.id}>{city.label}</option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-xl border border-[#D9B99B]/60 bg-white px-3 py-2">
          <BriefcaseBusiness className="h-3.5 w-3.5 shrink-0 text-[#6F7655]" />
          <select
            value={selectedDemoBusiness}
            onChange={(e) => onDemoBusinessChange(e.target.value as DemoBusinessId)}
            aria-label={demoT('selectBusiness', language)}
            className="w-full bg-transparent text-xs font-bold text-[#4A2F24] outline-none"
          >
            {DEMO_BUSINESSES.map((business) => (
              <option key={business.id} value={business.id}>{business.labels[language] || business.labels.en}</option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};
