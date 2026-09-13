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
import { Sparkles, Volume2, VolumeX, ArrowRight, AlertTriangle, Lightbulb, CheckCircle2, Flame, Zap } from 'lucide-react';

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

const SPEECH_LOCALE: Record<LanguageCode, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', gu: 'gu-IN', pa: 'pa-IN',
};

const SPEECH_COPY: Record<LanguageCode, { score: string; status: string; strength: string; priority: string }> = {
  en: { score: 'Feasibility score', status: 'Status', strength: 'Key strength', priority: 'Key operational priority' },
  hi: { score: 'व्यवहार्यता स्कोर', status: 'स्थिति', strength: 'मुख्य ताकत', priority: 'मुख्य संचालन प्राथमिकता' },
  bn: { score: 'সম্ভাব্যতা স্কোর', status: 'অবস্থা', strength: 'মূল শক্তি', priority: 'প্রধান পরিচালন অগ্রাধিকার' },
  mr: { score: 'व्यवहार्यता गुण', status: 'स्थिती', strength: 'मुख्य ताकद', priority: 'मुख्य कार्यकारी प्राधान्य' },
  ta: { score: 'சாத்தியக்கூறு மதிப்பெண்', status: 'நிலை', strength: 'முக்கிய பலம்', priority: 'முக்கிய செயல்பாட்டு முன்னுரிமை' },
  te: { score: 'సాధ్యత స్కోరు', status: 'స్థితి', strength: 'ప్రధాన బలం', priority: 'ప్రధాన ఆపరేషన్ ప్రాధాన్యం' },
  kn: { score: 'ಸಾಧ್ಯತಾ ಅಂಕ', status: 'ಸ್ಥಿತಿ', strength: 'ಮುಖ್ಯ ಬಲ', priority: 'ಮುಖ್ಯ ಕಾರ್ಯಾಚರಣಾ ಆದ್ಯತೆ' },
  gu: { score: 'વ્યવહાર્યતા સ્કોર', status: 'સ્થિતિ', strength: 'મુખ્ય શક્તિ', priority: 'મુખ્ય કામગીરી પ્રાથમિકતા' },
  pa: { score: 'ਵਿਵਹਾਰਯੋਗਤਾ ਸਕੋਰ', status: 'ਸਥਿਤੀ', strength: 'ਮੁੱਖ ਤਾਕਤ', priority: 'ਮੁੱਖ ਕਾਰਜਕਾਰੀ ਤਰਜੀਹ' },
};

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
      return;
    }

    window.speechSynthesis.cancel();
    const c = SPEECH_COPY[language];
    const textToRead = `${recommendation}. ${c.score}: ${feasibilityScore.overallScore} / 100. ${c.status}: ${feasibilityScore.statusLabel}. ${c.strength}: ${swot.strengths?.[0] || ''}. ${c.priority}: ${insights[0]?.title || ''}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = SPEECH_LOCALE[language];
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => voice.lang.toLowerCase() === SPEECH_LOCALE[language].toLowerCase())
      || voices.find((voice) => voice.lang.toLowerCase().startsWith(language.toLowerCase()));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="space-y-8 py-2">
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50"><Sparkles className="w-5 h-5" /></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">{t('analysisTitle', language)}</h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">Evaluation for <strong className="text-[#2B1B16]">{formData.businessIdea || formData.ideaText}</strong> in {formData.location.village}, {formData.location.district}.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button onClick={handleAudioPlayback} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${isPlayingAudio ? 'bg-red-600 text-white border-red-700' : 'bg-[#FAF7F3] text-[#4A2F24] border-[#D9B99B]/70 hover:bg-[#F3E8DC]'}`}>
            {isPlayingAudio ? <><VolumeX className="w-4 h-4" /><span>Stop Audio</span></> : <><Volume2 className="w-4 h-4 text-[#B9825B]" /><span>Listen</span></>}
          </button>
          <button onClick={() => onNavigate('finance')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all"><span>Financial Plan</span><ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>

      {!speechSupported && <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900">Text-to-speech is not supported in this browser. The NIRNAY voice assistant can still use Gemini TTS when configured and signed in.</div>}

      <section className="space-y-3">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Overall Enterprise Feasibility</h2><EvidenceBadge type={isAiGenerated ? 'AI_INFERENCE' : 'INDICATIVE'} /></div>
        <FeasibilityScore data={feasibilityScore} />
      </section>

      <section className="p-6 rounded-3xl bg-[#FAF7F3] border border-[#D9B99B]/50 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B4535] uppercase tracking-wider"><Lightbulb className="w-4 h-4 text-[#B9825B]" /><span>Strategic Decision Guidance</span></div>
        <p className="text-sm text-[#2B1B16] font-medium leading-relaxed">{recommendation}</p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Structured SWOT Analysis</h2><EvidenceBadge type="AI_INFERENCE" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SwotCard title="Strengths" icon={CheckCircle2} items={swot?.strengths || []} />
          <SwotCard title="Weaknesses" icon={AlertTriangle} items={swot?.weaknesses || []} />
          <SwotCard title="Opportunities" icon={Zap} items={swot?.opportunities || []} />
          <SwotCard title="Threats & Risks" icon={Flame} items={swot?.threats || []} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Actionable Startup Tactics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(insights || []).map((insight, idx) => (
            <div key={`${insight.title}-${idx}`} className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50 w-fit block">{insight.tag}</span>
              <h3 className="text-sm font-bold text-[#2B1B16]">{insight.title}</h3>
              <p className="text-xs text-[#4A2F24] leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <EvidenceLegendBar />
    </div>
  );
};

function SwotCard({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: string[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 border-b border-[#F3E8DC] pb-2.5"><Icon className="w-4 h-4 text-[#6B4535]" /><h3 className="text-sm font-bold uppercase tracking-wider text-[#2B1B16]">{title}</h3></div>
      <ul className="space-y-2 text-xs text-[#2B1B16]">{items.map((item, idx) => <li key={idx} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#6B4535] shrink-0 mt-1.5" /><span className="leading-relaxed">{item}</span></li>)}</ul>
    </div>
  );
}
