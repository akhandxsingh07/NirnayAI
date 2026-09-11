import React, { useState } from 'react';
import {
  AssessmentFormData,
  FeasibilityScoreData,
  SWOTData,
  PageId,
  LanguageCode,
} from '../types';
import { FeasibilityScore } from '../components/FeasibilityScore';
import { EvidenceBadge, EvidenceLegendBar } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Flame,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface AnalysisPageProps {
  formData: AssessmentFormData;
  feasibilityScore: FeasibilityScoreData;
  swot: SWOTData;
  insights: Array<{ title: string; description: string; tag: string }>;
  recommendation: string;
  isAiGenerated: boolean;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  formData,
  feasibilityScore,
  swot,
  insights,
  recommendation,
  isAiGenerated,
  onNavigate,
  language,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const handleAudioPlayback = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${recommendation}. Feasibility score is ${feasibilityScore.overallScore} out of 100. Status: ${feasibilityScore.statusLabel}. Key strength: ${swot.strengths[0]}. Key operational priority: ${insights[0]?.title}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('analysisTitle', language)}
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">
            Synthesized commercial evaluation for{' '}
            <strong className="text-[#2B1B16]">{formData.businessIdea}</strong> in{' '}
            {formData.location.village}, {formData.location.district}.
          </p>
        </div>

        {/* Audio TTS CTA & Next Stage */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAudioPlayback}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isPlayingAudio
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-[#FAF7F3] text-[#4A2F24] border-[#D9B99B]/70 hover:bg-[#F3E8DC]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#B9825B]" />
                <span>Listen to Summary</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('finance')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"
          >
            <span>Proceed to Financial Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!speechSupported && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900">
          Audio summary text-to-speech is not supported in this browser environment.
        </div>
      )}

      {/* Top Feasibility Score Display */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
            Overall Enterprise Feasibility Score
          </h2>
          <EvidenceBadge type={isAiGenerated ? 'AI_INFERENCE' : 'INDICATIVE'} />
        </div>
        <FeasibilityScore data={feasibilityScore} />
      </section>

      {/* Plain Language Strategic Recommendation Banner */}
      <section className="p-6 rounded-3xl bg-[#FAF7F3] border border-[#D9B99B]/50 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B4535] uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-[#B9825B]" />
          <span>Strategic Decision Guidance</span>
        </div>
        <p className="text-sm text-[#2B1B16] font-medium leading-relaxed">
          {recommendation}
        </p>
      </section>

      {/* 4-Quadrant SWOT Analysis */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
            Structured SWOT Analysis
          </h2>
          <EvidenceBadge type="AI_INFERENCE" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#474e30] border-b border-[#F3E8DC] pb-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6F7655]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Internal Strengths (S)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#2B1B16]">
              {(swot?.strengths || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6F7655] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#8B5E47] border-b border-[#F3E8DC] pb-2.5">
              <AlertTriangle className="w-4 h-4 text-[#B9825B]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Internal Weaknesses (W)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#2B1B16]">
              {(swot?.weaknesses || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B9825B] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#6B4535] border-b border-[#F3E8DC] pb-2.5">
              <Zap className="w-4 h-4 text-[#6B4535]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                External Opportunities (O)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#2B1B16]">
              {(swot?.opportunities || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B4535] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-800 border-b border-[#F3E8DC] pb-2.5">
              <Flame className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                External Threats & Risks (T)
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-[#2B1B16]">
              {(swot?.threats || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Actionable Strategic Insight Cards */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
          Actionable Startup Tactics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(insights || []).map((insight, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-2.5 flex flex-col justify-between hover:border-[#6B4535] transition-colors"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50 w-fit block">
                  {insight.tag}
                </span>
                <h3 className="text-sm font-bold text-[#2B1B16]">
                  {insight.title}
                </h3>
                <p className="text-xs text-[#4A2F24] leading-relaxed">
                  {insight.description}
                </p>
              </div>
              <div className="pt-2 border-t border-[#F3E8DC] text-[10px] text-[#8B5E47] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#6F7655]" />
                <span>Pre-investment checkpoint</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Legend */}
      <EvidenceLegendBar />
    </div>
  );
};
