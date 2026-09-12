import React, { useEffect, useMemo, useState } from 'react';
import {
  PageId,
  LanguageCode,
  AssessmentFormData,
  FeasibilityScoreData,
  FinancialStructureData,
  GrowthProjectionData,
  SWOTData,
  LocalOpportunityData,
  CitizenSession,
} from './types';
import {
  DEMO_FEASIBILITY_SCORE,
  DEMO_SWOT,
  DEMO_AI_INSIGHTS,
} from './utils/demoData';
import {
  DEFAULT_DEMO_CITY,
  DemoCityId,
  buildDemoAssessment,
  buildDemoOpportunity,
  getDemoCity,
} from './utils/demoScenarios';
import {
  calculateFinancialStructure,
  generateGrowthProjections,
} from './utils/financialCalculations';
import { analyzeBusinessWithAI } from './services/aiService';
import { getCurrentCitizenSession, signOut } from './services/authService';
import { saveAssessmentBundle } from './services/backendService';
import { supabase } from './lib/supabase';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SourcesModal } from './components/SourcesModal';

import { LandingPage } from './pages/LandingPage';
import { CitizenLoginPage } from './pages/CitizenLoginPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { OpportunityPage } from './pages/OpportunityPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { FinancePage } from './pages/FinancePage';
import { SchemesPage } from './pages/SchemesPage';
import { GrowthPage } from './pages/GrowthPage';
import { ReportPage } from './pages/ReportPage';

import { LogOut, Mic, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react';

const ACCESS_LABELS: Record<LanguageCode, { citizen: string; admin: string; account: string; logout: string }> = {
  en: { citizen: 'Citizen Login', admin: 'Admin', account: 'Citizen Account', logout: 'Logout' },
  hi: { citizen: 'नागरिक लॉगिन', admin: 'एडमिन', account: 'नागरिक खाता', logout: 'लॉगआउट' },
  bn: { citizen: 'নাগরিক লগইন', admin: 'অ্যাডমিন', account: 'নাগরিক অ্যাকাউন্ট', logout: 'লগআউট' },
  mr: { citizen: 'नागरिक लॉगिन', admin: 'अॅडमिन', account: 'नागरिक खाते', logout: 'लॉगआउट' },
  ta: { citizen: 'குடிமக்கள் உள்நுழைவு', admin: 'நிர்வாகி', account: 'குடிமக்கள் கணக்கு', logout: 'வெளியேறு' },
  te: { citizen: 'పౌర లాగిన్', admin: 'అడ్మిన్', account: 'పౌర ఖాతా', logout: 'లాగౌట్' },
  kn: { citizen: 'ನಾಗರಿಕ ಲಾಗಿನ್', admin: 'ಅಡ್ಮಿನ್', account: 'ನಾಗರಿಕ ಖಾತೆ', logout: 'ಲಾಗ್ ಔಟ್' },
  gu: { citizen: 'નાગરિક લૉગિન', admin: 'એડમિન', account: 'નાગરિક ખાતું', logout: 'લૉગઆઉટ' },
  pa: { citizen: 'ਨਾਗਰਿਕ ਲਾਗਇਨ', admin: 'ਐਡਮਿਨ', account: 'ਨਾਗਰਿਕ ਖਾਤਾ', logout: 'ਲਾਗਆਉਟ' },
};

const CITIZEN_SESSION_KEY = 'nirnay-citizen-session';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [selectedDemoCity, setSelectedDemoCity] = useState<DemoCityId>(DEFAULT_DEMO_CITY);
  const [citizenSession, setCitizenSession] = useState<CitizenSession | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(CITIZEN_SESSION_KEY) || 'null') as CitizenSession | null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState<AssessmentFormData>(() => buildDemoAssessment(DEFAULT_DEMO_CITY, 'en'));
  const [feasibilityScore, setFeasibilityScore] = useState<FeasibilityScoreData>(DEMO_FEASIBILITY_SCORE);
  const [swot, setSwot] = useState<SWOTData>(DEMO_SWOT);
  const [insights, setInsights] = useState(DEMO_AI_INSIGHTS);
  const [opportunityData, setOpportunityData] = useState<LocalOpportunityData>(() => buildDemoOpportunity(DEFAULT_DEMO_CITY));
  const [recommendation, setRecommendation] = useState<string>(
    'This demo business shows promising recurring local demand. Validate supplier reliability, customer contracts and cold-chain costs before investing.'
  );
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const financialData: FinancialStructureData = useMemo(() => {
    return calculateFinancialStructure(formData.availableMargin || formData.marginCapital || 50000);
  }, [formData.availableMargin, formData.marginCapital]);

  const growthData: GrowthProjectionData = useMemo(() => {
    return generateGrowthProjections(formData.availableMargin || formData.marginCapital || 50000);
  }, [formData.availableMargin, formData.marginCapital]);

  useEffect(() => {
    let active = true;
    const syncCitizen = async () => {
      const session = await getCurrentCitizenSession();
      if (!active) return;
      setCitizenSession(session);
      if (session) localStorage.setItem(CITIZEN_SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(CITIZEN_SESSION_KEY);
    };

    void syncCitizen();
    const { data } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void syncCitizen(), 0);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryDemo = (cityId: DemoCityId = selectedDemoCity) => {
    const city = getDemoCity(cityId);
    setSelectedDemoCity(cityId);
    setFormData(buildDemoAssessment(cityId, language));
    setFeasibilityScore(DEMO_FEASIBILITY_SCORE);
    setSwot(DEMO_SWOT);
    setInsights(DEMO_AI_INSIGHTS);
    setOpportunityData(buildDemoOpportunity(cityId));
    setRecommendation(
      `The ${city.district} demo shows promising recurring local demand for organized dairy supply. Validate customer contracts, supplier reliability and operating costs through a field survey before investing.`
    );
    setIsAiGenerated(false);
    navigateTo('dashboard');
  };

  const handleDemoCityChange = (cityId: DemoCityId) => {
    setSelectedDemoCity(cityId);
    handleTryDemo(cityId);
  };

  const handleAssessmentSubmit = async (newForm: AssessmentFormData) => {
    setFormData({ ...newForm, preferredLanguage: language });
    setIsAnalyzing(true);
    navigateTo('opportunity');

    try {
      const result = await analyzeBusinessWithAI({ ...newForm, preferredLanguage: language });
      setFeasibilityScore(result.feasibilityScore);
      setSwot(result.swot);
      setInsights(result.insights);
      setRecommendation(result.recommendation);
      setOpportunityData(result.localOpportunity);
      setIsAiGenerated(result.isAiGenerated);

      const calculatedFinance = calculateFinancialStructure(
        newForm.availableMargin || newForm.marginCapital || 50000
      );
      void saveAssessmentBundle(newForm, result, calculatedFinance);
    } catch {
      // aiService contains its own fallback behavior.
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCitizenLogin = (session: CitizenSession) => {
    localStorage.setItem(CITIZEN_SESSION_KEY, JSON.stringify(session));
    setCitizenSession(session);
    navigateTo('dashboard');
  };

  const handleCitizenLogout = async () => {
    await signOut();
    localStorage.removeItem(CITIZEN_SESSION_KEY);
    setCitizenSession(null);
    navigateTo('landing');
  };

  const isLanding = currentPage === 'landing';
  const isStandalone = currentPage === 'landing' || currentPage === 'citizen-login' || currentPage === 'admin';
  const accessCopy = ACCESS_LABELS[language] || ACCESS_LABELS.en;

  return (
    <div className="min-h-screen bg-[#F8F2E8] text-[#281C13] font-sans antialiased selection:bg-[#A97838]/20 selection:text-[#281C13]">
      {!isStandalone && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigateTo}
          language={language}
          onLanguageChange={setLanguage}
          onOpenHelp={() => setIsHelpOpen(true)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`${isStandalone ? '' : 'lg:pl-64'} flex min-h-screen flex-col`}>
        {!isStandalone && (
          <Header
            currentPage={currentPage}
            onNavigate={navigateTo}
            language={language}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onTryDemo={handleTryDemo}
            selectedDemoCity={selectedDemoCity}
            onDemoCityChange={handleDemoCityChange}
            onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        )}

        {isAnalyzing && !isStandalone && (
          <div className="flex items-center justify-center gap-2 border-b border-[#A97838] bg-[#8B5E2C] px-4 py-2 text-xs text-[#FFFDF8]">
            <Sparkles className="h-4 w-4 animate-spin text-[#F0DFC3]" />
            <span>NIRNAY AI is computing hyper-local feasibility and structuring models...</span>
          </div>
        )}

        <main className={isStandalone ? 'flex-1 w-full' : 'mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8'}>
          {currentPage === 'landing' && (
            <LandingPage
              onNavigate={navigateTo}
              language={language}
              onLanguageChange={setLanguage}
              onTryDemo={() => handleTryDemo(selectedDemoCity)}
              onOpenHelp={() => setIsHelpOpen(true)}
            />
          )}

          {currentPage === 'citizen-login' && (
            <CitizenLoginPage language={language} onBack={() => navigateTo('landing')} onSuccess={handleCitizenLogin} />
          )}

          {currentPage === 'admin' && (
            <AdminPortalPage
              language={language}
              onBack={() => navigateTo('landing')}
              onNavigate={navigateTo}
              projectCost={financialData.totalProjectCost}
              feasibilityScore={feasibilityScore.overallScore}
              citizenCount={citizenSession ? 1 : 0}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage
              formData={formData}
              feasibilityScore={feasibilityScore}
              financialData={financialData}
              growthData={growthData}
              onNavigate={navigateTo}
              onTryDemo={handleTryDemo}
              selectedDemoCity={selectedDemoCity}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenHelp={() => setIsHelpOpen(true)}
              language={language}
            />
          )}

          {currentPage === 'assessment' && (
            <AssessmentPage initialData={formData} onSubmit={handleAssessmentSubmit} language={language} onOpenVoice={() => setIsVoiceOpen(true)} />
          )}

          {currentPage === 'opportunity' && (
            <OpportunityPage formData={formData} opportunityData={opportunityData} onNavigate={navigateTo} language={language} />
          )}

          {currentPage === 'analysis' && (
            <AnalysisPage
              formData={formData}
              feasibilityScore={feasibilityScore}
              swot={swot}
              insights={insights}
              recommendation={recommendation}
              isAiGenerated={isAiGenerated}
              onNavigate={navigateTo}
              language={language}
            />
          )}

          {currentPage === 'finance' && (
            <FinancePage formData={formData} financialData={financialData} onNavigate={navigateTo} language={language} />
          )}

          {currentPage === 'schemes' && (
            <SchemesPage financialData={financialData} onNavigate={navigateTo} language={language} />
          )}

          {currentPage === 'growth' && (
            <GrowthPage formData={formData} growthData={growthData} onNavigate={navigateTo} language={language} />
          )}

          {currentPage === 'report' && (
            <ReportPage
              formData={formData}
              feasibilityScore={feasibilityScore}
              financialData={financialData}
              growthData={growthData}
              swot={swot}
              recommendation={recommendation}
              onNavigate={navigateTo}
              language={language}
            />
          )}
        </main>
      </div>

      {isLanding && (
        <div className="fixed right-4 top-[84px] z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-2xl border border-[#DDCFBC] bg-[#FFFDF8]/92 p-2 shadow-[0_16px_40px_rgba(72,47,25,.12)] backdrop-blur-xl sm:right-6">
          {citizenSession ? (
            <>
              <button onClick={() => navigateTo('dashboard')} className="flex min-w-0 items-center gap-2 rounded-xl bg-[#F1E5D4] px-3 py-2 text-xs font-extrabold text-[#6E4A24] transition hover:bg-[#EAD9C0]">
                <UserRoundCheck className="h-4 w-4 shrink-0" />
                <span className="max-w-28 truncate">{citizenSession.displayName || accessCopy.account}</span>
              </button>
              <button onClick={handleCitizenLogout} title={accessCopy.logout} className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7E6D5F] transition hover:bg-[#F1E5D4] hover:text-[#5D3D20]"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <button onClick={() => navigateTo('citizen-login')} className="flex items-center gap-2 rounded-xl bg-[#A97838] px-3.5 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#8D5D28]"><UserRoundCheck className="h-4 w-4" />{accessCopy.citizen}</button>
          )}
          <button onClick={() => navigateTo('admin')} className="flex items-center gap-2 rounded-xl border border-[#D7C4AA] bg-white px-3.5 py-2.5 text-xs font-extrabold text-[#59402A] transition hover:bg-[#F4E9DA]"><ShieldCheck className="h-4 w-4" />{accessCopy.admin}</button>
        </div>
      )}

      {!isStandalone && (
        <div className="fixed bottom-5 right-5 z-40 print:hidden">
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="group flex items-center gap-2.5 rounded-full border border-[#C8A77C]/60 bg-[#8B5E2C] px-4 py-3 text-xs font-extrabold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#6F471F] hover:shadow-xl"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E1BF8F] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#E1BF8F]" />
            </span>
            <Mic className="h-4 w-4 text-[#F0DFC3] transition-transform group-hover:rotate-12" />
            <span className="tracking-wide">Ask NIRNAY</span>
          </button>
        </div>
      )}

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        context={{
          businessIdea: formData.businessIdea,
          category: formData.category,
          margin: formData.availableMargin,
          projectCost: financialData.totalProjectCost,
          loan: financialData.loanRequirement,
          scheme: financialData.recommendedScheme,
          language,
        }}
      />

      <SourcesModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
