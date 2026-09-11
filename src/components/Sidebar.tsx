import React from 'react';
import { PageId, LanguageCode } from '../types';
import { t, SUPPORTED_LANGUAGES } from '../services/localizationService';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Sparkles,
  Calculator,
  Compass,
  TrendingUp,
  FileCheck,
  HelpCircle,
  Globe,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenHelp: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  language,
  onLanguageChange,
  onOpenHelp,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: Array<{ id: PageId; labelKey: string; icon: React.ElementType; tag?: string }> = [
    { id: 'dashboard', labelKey: 'navDashboard', icon: LayoutDashboard },
    { id: 'assessment', labelKey: 'navAssessment', icon: FileText },
    { id: 'opportunity', labelKey: 'navOpportunity', icon: MapPin },
    { id: 'analysis', labelKey: 'navAnalysis', icon: Sparkles },
    { id: 'finance', labelKey: 'navFinance', icon: Calculator },
    { id: 'schemes', labelKey: 'navSchemes', icon: Compass },
    { id: 'growth', labelKey: 'navGrowth', icon: TrendingUp },
    { id: 'report', labelKey: 'navReport', icon: FileCheck },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#2B1B16]/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#2B1B16] text-[#FAF7F3] border-r border-[#4A2F24] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-[#4A2F24] flex items-center justify-between">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-3 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#B9825B] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:bg-[#8B5E47] transition-colors">
                N
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-[#FAF7F3] leading-none">
                  NIRNAY AI
                </h1>
                <span className="text-[10px] text-[#D9B99B] font-medium tracking-wide">
                  Hyper-Local Advisory
                </span>
              </div>
            </button>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded text-[#D9B99B] hover:text-white hover:bg-[#4A2F24]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#6B4535] text-white shadow-xs font-bold'
                      : 'text-[#D9B99B] hover:bg-[#4A2F24]/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#F3E8DC]' : 'text-[#8B5E47]'
                      }`}
                    />
                    <span>{t(item.labelKey, language)}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#D9B99B]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Language, Help, Credits */}
        <div className="p-4 border-t border-[#4A2F24] space-y-3 bg-[#241712]">
          {/* Language Selector */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#D9B99B]">
              <span className="flex items-center gap-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-[#8B5E47]" />
                Language / भाषा
              </span>
            </div>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="w-full bg-[#36231C] text-xs text-[#FAF7F3] border border-[#4A2F24] rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#B9825B]"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#2B1B16] text-white">
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* Help & Sources Button */}
          <button
            onClick={onOpenHelp}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#36231C] hover:bg-[#4A2F24] text-xs text-[#D9B99B] hover:text-white border border-[#4A2F24] transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#8B5E47]" />
            <span>Sources & Methodology</span>
          </button>

          {/* Subtle Team VYOMA Credits */}
          <div className="pt-2 text-center text-[10px] text-[#8B5E47] border-t border-[#36231C]/60 leading-tight">
            <p className="font-bold text-[#D9B99B]">Team VYOMA</p>
            <p>Smart India Hackathon 2026</p>
            <p className="text-[9px] text-[#8B5E47] mt-0.5">PS ID: SIH26091</p>
          </div>
        </div>
      </aside>
    </>
  );
};
