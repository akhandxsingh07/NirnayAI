import React from 'react';
import { PageId, LanguageCode } from '../types';
import { t } from '../services/localizationService';
import { Menu, Mic, Sparkles, HelpCircle, RotateCcw, Play } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onOpenVoice: () => void;
  onOpenHelp: () => void;
  onTryDemo: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  language,
  onOpenVoice,
  onOpenHelp,
  onTryDemo,
  onToggleMobileMenu,
}) => {
  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'landing':
        return 'Overview';
      case 'dashboard':
        return 'Executive Cockpit';
      case 'assessment':
        return 'Business Assessment';
      case 'opportunity':
        return 'Local Market Opportunity';
      case 'analysis':
        return 'NIRNAY AI Feasibility';
      case 'finance':
        return 'Financial Structuring & EMI';
      case 'schemes':
        return 'Scheme & Support Router';
      case 'growth':
        return '36-Month Growth Projection';
      case 'report':
        return 'Final Business Plan';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F3]/90 backdrop-blur-md border-b border-[#D9B99B]/40 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white border border-[#D9B99B]/60 text-[#4A2F24] hover:bg-[#F3E8DC]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8B5E47] block">
              NIRNAY AI • {getPageTitle(currentPage)}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#2B1B16] leading-tight hidden sm:block">
              {t('appSubtitle', language)}
            </h2>
          </div>
        </div>

        {/* Right: Quick Demo button, Voice Assistant CTA, Sources */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Try Demo scenario */}
          <button
            onClick={onTryDemo}
            title="Load Rampur, UP Demo Dairy Scenario"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3E8DC] text-[#4A2F24] border border-[#D9B99B]/60 text-xs font-bold transition-all shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 text-[#B9825B] fill-[#B9825B]" />
            <span className="hidden sm:inline">Try Demo (Rampur, UP)</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Ask NIRNAY Voice Trigger */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white text-xs font-bold transition-all shadow-xs group"
          >
            <Mic className="w-3.5 h-3.5 text-[#D9B99B] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Ask NIRNAY</span>
            <span className="sm:hidden">Voice</span>
          </button>

          {/* Sources trigger */}
          <button
            onClick={onOpenHelp}
            title="View citations and methodology"
            className="p-2 rounded-xl bg-white border border-[#D9B99B]/60 text-[#8B5E47] hover:text-[#2B1B16] hover:bg-[#F3E8DC] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
