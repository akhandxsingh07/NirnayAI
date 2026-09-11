import React, { useState, useMemo } from 'react';
import {
  PageId,
  LanguageCode,
  AssessmentFormData,
  FeasibilityScoreData,
  FinancialStructureData,
  GrowthProjectionData,
  SWOTData,
  LocalOpportunityData,
} from './types';
import {
  DEMO_ASSESSMENT_DATA,
  DEMO_FEASIBILITY_SCORE,
  DEMO_SWOT,
  DEMO_AI_INSIGHTS,
  DEMO_LOCAL_OPPORTUNITY,
} from './utils/demoData';
import {
  calculateFinancialStructure,
  generateGrowthProjections,
} from './utils/financialCalculations';
import { analyzeBusinessWithAI } from './services/aiService';

// Layout & Global Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SourcesModal } from './components/SourcesModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { OpportunityPage } from './pages/OpportunityPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { FinancePage } from './pages/FinancePage';
import { SchemesPage } from './pages/SchemesPage';
import { GrowthPage } from './pages/GrowthPage';
import { ReportPage } from './pages/ReportPage';

import { Mic, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Enterprise Domain State
  const [formData, setFormData] = useState<AssessmentFormData>(DEMO_ASSESSMENT_DATA);
  const [feasibilityScore, setFeasibilityScore] = useState<FeasibilityScoreData>(DEMO_FEASIBILITY_SCORE);
  const [swot, setSwot] = useState<SWOTData>(DEMO_SWOT);
  const [insights, setInsights] = useState(DEMO_AI_INSIGHTS);
  const [opportunityData, setOpportunityData] = useState<LocalOpportunityData>(DEMO_LOCAL_OPPORTUNITY);
  const [recommendation, setRecommendation] = useState<string>(
    'Your proposed dairy business in Rampur shows strong fundamentals. Daily recurring household demand and tea stall contracts provide resilient cash velocity, provided you maintain disciplined cold storage and upfront milk fat testing.'
  );
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Modals & Mobile Drawer
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Deterministic financial calculations strictly synchronized with formData.availableMargin
  const financialData: FinancialStructureData = useMemo(() => {
    return calculateFinancialStructure(formData.availableMargin || 50000);
  }, [formData.availableMargin]);

  const growthData: GrowthProjectionData = useMemo(() => {
    return generateGrowthProjections(formData.availableMargin || 50000);
  }, [formData.availableMargin]);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryDemo = () => {
    setFormData(DEMO_ASSESSMENT_DATA);
    setFeasibilityScore(DEMO_FEASIBILITY_SCORE);
    setSwot(DEMO_SWOT);
    setInsights(DEMO_AI_INSIGHTS);
    setOpportunityData(DEMO_LOCAL_OPPORTUNITY);
    setRecommendation(
      'Your proposed dairy business in Rampur shows strong fundamentals. Daily recurring household demand and tea stall contracts provide resilient cash velocity, provided you maintain disciplined cold storage and upfront milk fat testing.'
    );
    setIsAiGenerated(false);
    navigateTo('dashboard');
  };

  const handleAssessmentSubmit = async (newForm: AssessmentFormData) => {
    setFormData(newForm);
    setIsAnalyzing(true);
    navigateTo('opportunity');

    try {
      const result = await analyzeBusinessWithAI(newForm);
      setFeasibilityScore(result.feasibilityScore);
      setSwot(result.swot);
      setInsights(result.insights);
      setRecommendation(result.recommendation);
      setOpportunityData(result.localOpportunity);
      setIsAiGenerated(result.isAiGenerated);
    } catch {
      // Fallback already handled inside aiService
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] text-[#2B1B16] font-sans antialiased selection:bg-[#B9825B]/20 selection:text-[#2B1B16]">
      {/* Sidebar for Navigation (visible across all pages or desktop) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={navigateTo}
        language={language}
        onLanguageChange={setLanguage}
        onOpenHelp={() => setIsHelpOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <Header
          currentPage={currentPage}
          onNavigate={navigateTo}
          language={language}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onTryDemo={handleTryDemo}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Global Analyzing Banner if AI is running in background */}
        {isAnalyzing && (
          <div className="bg-[#4A2F24] text-[#FAF7F3] text-xs px-4 py-2 flex items-center justify-center gap-2 border-b border-[#6B4535]">
            <Sparkles className="w-4 h-4 text-[#D9B99B] animate-spin" />
            <span>NIRNAY AI is computing hyper-local feasibility and structuring models...</span>
          </div>
        )}

        {/* Page Container */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
          {currentPage === 'landing' && (
            <LandingPage
              onNavigate={navigateTo}
              language={language}
              onTryDemo={handleTryDemo}
              onOpenHelp={() => setIsHelpOpen(true)}
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
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenHelp={() => setIsHelpOpen(true)}
              language={language}
            />
          )}

          {currentPage === 'assessment' && (
            <AssessmentPage
              initialData={formData}
              onSubmit={handleAssessmentSubmit}
              language={language}
              onOpenVoice={() => setIsVoiceOpen(true)}
            />
          )}

          {currentPage === 'opportunity' && (
            <OpportunityPage
              formData={formData}
              opportunityData={opportunityData}
              onNavigate={navigateTo}
              language={language}
            />
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
            <FinancePage
              formData={formData}
              financialData={financialData}
              onNavigate={navigateTo}
              language={language}
            />
          )}

          {currentPage === 'schemes' && (
            <SchemesPage
              financialData={financialData}
              onNavigate={navigateTo}
              language={language}
            />
          )}

          {currentPage === 'growth' && (
            <GrowthPage
              formData={formData}
              growthData={growthData}
              onNavigate={navigateTo}
              language={language}
            />
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

      {/* Persistent Floating "Ask NIRNAY" Voice Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        <button
          onClick={() => setIsVoiceOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#4A2F24] hover:bg-[#2B1B16] text-white text-xs font-extrabold shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-[#B9825B]/40 group"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9825B] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B9825B]" />
          </span>
          <Mic className="w-4 h-4 text-[#D9B99B] group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Ask NIRNAY</span>
        </button>
      </div>

      {/* Voice Assistant Modal */}
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
          language: language,
        }}
      />

      {/* Sources & Case Study Modal */}
      <SourcesModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
