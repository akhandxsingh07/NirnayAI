import React, { useEffect, useRef, useState } from 'react';
import { PageId, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../services/localizationService';
import { Hero } from '@/components/ui/animated-hero';
import { DepthShowcase } from '../components/landing/DepthShowcase';
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  Landmark,
  Lightbulb,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sprout,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  onTryDemo: () => void;
  onOpenHelp: () => void;
}

type LandingNavCopy = {
  home: string;
  solutions: string;
  resources: string;
  about: string;
  badge: string;
  watch: string;
  easy: string;
  data: string;
  bharat: string;
  smarterWords: string[];
  titleTail: string;
};

const NAV_COPY: Record<LanguageCode, LandingNavCopy> = {
  en: {
    home: 'Home',
    solutions: 'Solutions',
    resources: 'Resources',
    about: 'About',
    badge: 'Empowering Rural Entrepreneurs',
    watch: 'Watch Rural Story',
    easy: 'Easy to use',
    data: 'Backed by data',
    bharat: 'Built for Bharat',
    smarterWords: ['Smarter', 'Stronger', 'Local-first', 'Confident', 'Practical'],
    titleTail: 'Business Decisions for a Brighter Rural India.',
  },
  hi: {
    home: 'होम',
    solutions: 'समाधान',
    resources: 'संसाधन',
    about: 'हमारे बारे में',
    badge: 'ग्रामीण उद्यमियों को सशक्त बनाना',
    watch: 'ग्रामीण कहानी देखें',
    easy: 'उपयोग में आसान',
    data: 'डेटा पर आधारित',
    bharat: 'भारत के लिए बनाया गया',
    smarterWords: ['समझदार', 'मज़बूत', 'स्थानीय', 'विश्वसनीय', 'व्यावहारिक'],
    titleTail: 'व्यवसायिक निर्णय, उज्ज्वल ग्रामीण भारत के लिए।',
  },
  bn: {
    home: 'হোম',
    solutions: 'সমাধান',
    resources: 'সম্পদ',
    about: 'আমাদের সম্পর্কে',
    badge: 'গ্রামীণ উদ্যোক্তাদের ক্ষমতায়ন',
    watch: 'গ্রামীণ গল্প দেখুন',
    easy: 'ব্যবহার সহজ',
    data: 'তথ্যভিত্তিক',
    bharat: 'ভারতের জন্য তৈরি',
    smarterWords: ['স্মার্ট', 'শক্তিশালী', 'স্থানীয়', 'বিশ্বস্ত', 'ব্যবহারিক'],
    titleTail: 'ব্যবসায়িক সিদ্ধান্ত, উজ্জ্বল গ্রামীণ ভারতের জন্য।',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    solutions: 'उपाय',
    resources: 'संसाधने',
    about: 'आमच्याबद्दल',
    badge: 'ग्रामीण उद्योजकांना सक्षम बनवणे',
    watch: 'ग्रामीण कथा पहा',
    easy: 'वापरण्यास सोपे',
    data: 'डेटावर आधारित',
    bharat: 'भारतासाठी तयार',
    smarterWords: ['हुशार', 'मजबूत', 'स्थानिक', 'विश्वसनीय', 'व्यावहारिक'],
    titleTail: 'व्यावसायिक निर्णय, उज्ज्वल ग्रामीण भारतासाठी.',
  },
  ta: {
    home: 'முகப்பு',
    solutions: 'தீர்வுகள்',
    resources: 'வளங்கள்',
    about: 'எங்களை பற்றி',
    badge: 'கிராமப்புற தொழில்முனைவோருக்கு வலு சேர்ப்போம்',
    watch: 'கிராமிய கதையைப் பாருங்கள்',
    easy: 'பயன்படுத்த எளிது',
    data: 'தரவின் ஆதாரம்',
    bharat: 'இந்தியாவுக்காக உருவாக்கப்பட்டது',
    smarterWords: ['சிறந்த', 'வலுவான', 'உள்ளூர்', 'நம்பகமான', 'நடைமுறை'],
    titleTail: 'வணிக முடிவுகள், ஒளிமயமான கிராமிய இந்தியாவிற்காக.',
  },
  te: {
    home: 'హోమ్',
    solutions: 'పరిష్కారాలు',
    resources: 'వనరులు',
    about: 'మా గురించి',
    badge: 'గ్రామీణ వ్యాపారులను శక్తివంతం చేయడం',
    watch: 'గ్రామీణ కథ చూడండి',
    easy: 'ఉపయోగించడం సులభం',
    data: 'డేటా ఆధారితం',
    bharat: 'భారతదేశం కోసం రూపొందించబడింది',
    smarterWords: ['స్మార్ట్', 'బలమైన', 'స్థానిక', 'నమ్మకమైన', 'ప్రాక్టికల్'],
    titleTail: 'వ్యాపార నిర్ణయాలు, ప్రకాశవంతమైన గ్రామీణ భారతదేశం కోసం.',
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    solutions: 'ಪರಿಹಾರಗಳು',
    resources: 'ಸಂಪನ್ಮೂಲಗಳು',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    badge: 'ಗ್ರಾಮೀಣ ಉದ್ಯಮಿಗಳಿಗೆ ಶಕ್ತಿ ನೀಡುವುದು',
    watch: 'ಗ್ರಾಮೀಣ ಕಥೆ ನೋಡಿ',
    easy: 'ಬಳಸಲು ಸುಲಭ',
    data: 'ದತ್ತಾಂಶ ಆಧಾರಿತ',
    bharat: 'ಭಾರತಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ',
    smarterWords: ['ಚಾಣಾಕ್ಷ', 'ಬಲವಾದ', 'ಸ್ಥಳೀಯ', 'ವಿಶ್ವಾಸಾರ್ಹ', 'ಪ್ರಾಯೋಗಿಕ'],
    titleTail: 'ವ್ಯವಹಾರ ನಿರ್ಧಾರಗಳು, ಪ್ರಕಾಶಮಾನ ಗ್ರಾಮೀಣ ಭಾರತದಿಗಾಗಿ.',
  },
  gu: {
    home: 'હોમ',
    solutions: 'ઉકેલો',
    resources: 'સંસાધનો',
    about: 'અમારા વિશે',
    badge: 'ગ્રામ્ય ઉદ્યોગસાહસિકોને સશક્ત બનાવવું',
    watch: 'ગ્રામ્ય વાર્તા જુઓ',
    easy: 'વાપરવામાં સરળ',
    data: 'ડેટા આધારિત',
    bharat: 'ભારત માટે બનાવેલ',
    smarterWords: ['સ્માર્ટ', 'મજબૂત', 'સ્થાનિક', 'વિશ્વસનીય', 'વ્યવહારુ'],
    titleTail: 'વ્યવસાયિક નિર્ણયો, ઉજ્જવળ ગ્રામ્ય ભારત માટે.',
  },
  pa: {
    home: 'ਹੋਮ',
    solutions: 'ਹੱਲ',
    resources: 'ਸਰੋਤ',
    about: 'ਸਾਡੇ ਬਾਰੇ',
    badge: 'ਪੇਂਡੂ ਉਦਯੋਗਪਤੀਆਂ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ',
    watch: 'ਪੇਂਡੂ ਕਹਾਣੀ ਦੇਖੋ',
    easy: 'ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ',
    data: 'ਡਾਟਾ ਅਧਾਰਿਤ',
    bharat: 'ਭਾਰਤ ਲਈ ਬਣਾਇਆ',
    smarterWords: ['ਸਮਝਦਾਰ', 'ਮਜ਼ਬੂਤ', 'ਸਥਾਨਕ', 'ਭਰੋਸੇਯੋਗ', 'ਵਿਹਾਰਕ'],
    titleTail: 'ਕਾਰੋਬਾਰੀ ਫੈਸਲੇ, ਚਮਕਦਾਰ ਪੇਂਡੂ ਭਾਰਤ ਲਈ।',
  },
};

const ruralVideoSources = ['/rural-hero.mp4', 'https://www.pexels.com/download/video/37664921/'];

const MOTION_COPY: Record<LanguageCode, { pause: string; play: string; reduced: string; demo: string }> = {
  en: { pause: 'Pause motion', play: 'Play motion', reduced: 'Reduced motion', demo: 'Illustrative preview' },
  hi: { pause: 'एनीमेशन रोकें', play: 'एनीमेशन चलाएं', reduced: 'कम एनीमेशन', demo: 'उदाहरण पूर्वावलोकन' },
  bn: { pause: 'অ্যানিমেশন থামান', play: 'অ্যানিমেশন চালান', reduced: 'কম অ্যানিমেশন', demo: 'উদাহরণ প্রিভিউ' },
  mr: { pause: 'ॲनिमेशन थांबवा', play: 'ॲनिमेशन सुरू करा', reduced: 'कमी ॲनिमेशन', demo: 'उदाहरण पूर्वावलोकन' },
  ta: { pause: 'அசைவை நிறுத்து', play: 'அசைவை இயக்கு', reduced: 'குறைந்த அசைவு', demo: 'எடுத்துக்காட்டு முன்னோட்டம்' },
  te: { pause: 'యానిమేషన్ ఆపు', play: 'యానిమేషన్ ప్రారంభించు', reduced: 'తగ్గిన కదలిక', demo: 'ఉదాహరణ ప్రివ్యూ' },
  kn: { pause: 'ಚಲನೆ ನಿಲ್ಲಿಸಿ', play: 'ಚಲನೆ ಪ್ರಾರಂಭಿಸಿ', reduced: 'ಕಡಿಮೆ ಚಲನೆ', demo: 'ಉದಾಹರಣೆ ಮುನ್ನೋಟ' },
  gu: { pause: 'એનિમેશન રોકો', play: 'એનિમેશન શરૂ કરો', reduced: 'ઓછું એનિમેશન', demo: 'ઉદાહરણ પૂર્વાવલોકન' },
  pa: { pause: 'ਐਨੀਮੇਸ਼ਨ ਰੋਕੋ', play: 'ਐਨੀਮੇਸ਼ਨ ਚਲਾਓ', reduced: 'ਘੱਟ ਐਨੀਮੇਸ਼ਨ', demo: 'ਉਦਾਹਰਨ ਝਲਕ' },
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  language,
  onLanguageChange,
  onTryDemo,
  onOpenHelp,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [finePointer, setFinePointer] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState !== 'hidden');
  const [storyOpen, setStoryOpen] = useState(false);
  const copy = NAV_COPY[language] || NAV_COPY.en;
  const motionCopy = MOTION_COPY[language] || MOTION_COPY.en;
  const featureBody = t('heroSupporting', language);
  const motionEnabled = !isPaused && !reducedMotion;
  const heroMotionEnabled = motionEnabled && heroVisible && pageVisible && !storyOpen;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const videoAllowed = finePointer && !reducedMotion && !saveData;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const preferencesChanged = () => { setReducedMotion(reduced.matches); setFinePointer(pointer.matches); };
    const visibilityChanged = () => setPageVisible(document.visibilityState !== 'hidden');
    reduced.addEventListener('change', preferencesChanged);
    pointer.addEventListener('change', preferencesChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.05 });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => {
      reduced.removeEventListener('change', preferencesChanged);
      pointer.removeEventListener('change', preferencesChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (heroMotionEnabled && videoAllowed) void video.play().catch(() => { /* The decorative background may be unavailable. */ });
    else video.pause();
  }, [heroMotionEnabled, videoAllowed]);

  const scrollToSolutions = () => {
    document.getElementById('solutions')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto' });
  };

  return (
    <div className="nirnay-landing min-h-screen overflow-hidden bg-[#FBF7EF] text-[#281C13]" data-motion={motionEnabled && pageVisible ? 'running' : 'paused'}>
      <header className="sticky top-0 z-40 border-b border-[#E7DDCF]/80 bg-[#FBF7EF]/92 shadow-[0_8px_30px_rgba(73,48,28,.04)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-5 px-5 py-3.5 sm:px-8 lg:px-10">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E1CBA8] bg-[#F3E4CD] text-[#9C6A30] shadow-inner">
              <Sprout className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-display text-[29px] leading-none tracking-[-0.02em] text-[#25170D]">Nirnay AI</h1>
              <p className="mt-1.5 text-[10px] font-semibold tracking-[0.1em] text-[#7A6C5F]">SAHI SOCH. BEHTAR KAL.</p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#564B40] xl:flex">
            <button onClick={() => onNavigate('landing')} className="border-b-2 border-[#A97838] py-2 text-[#281C13]">{copy.home}</button>
            <button onClick={scrollToSolutions} className="py-2 transition hover:text-[#281C13]">{copy.solutions}</button>
            <button onClick={() => onNavigate('schemes')} className="py-2 transition hover:text-[#281C13]">{t('navSchemes', language)}</button>
            <button onClick={onOpenHelp} className="py-2 transition hover:text-[#281C13]">{copy.resources}</button>
            <button onClick={onOpenHelp} className="py-2 transition hover:text-[#281C13]">{copy.about}</button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96652D]" />
              <select
                value={language}
                onChange={(event) => onLanguageChange(event.target.value as LanguageCode)}
                className="h-11 rounded-xl border border-[#D8C5AA] bg-[#FFFDF8]/90 pl-9 pr-8 text-xs font-semibold text-[#5B4632] outline-none transition hover:border-[#B98B52] focus:border-[#A97838]"
                aria-label="Select language"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code}>{item.nativeLabel}</option>
                ))}
              </select>
            </div>
            <button onClick={onOpenHelp} className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#4D4238] transition hover:bg-[#F1E6D6] sm:flex" aria-label="Search resources"><Search className="h-5 w-5" /></button>
            <button onClick={onTryDemo} className="hidden rounded-xl border border-[#CDB18C] bg-[#FFFDF8] px-4 py-2.5 text-sm font-bold text-[#49311E] transition hover:bg-[#F3E8D9] lg:block">{t('btnTryDemo', language)}</button>
            <button onClick={() => onNavigate('assessment')} className="rounded-xl bg-[#A97838] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(169,120,56,.18)] transition hover:-translate-y-0.5 hover:bg-[#8D5D28]">{t('btnStartAssessment', language)}</button>
          </div>
        </div>
      </header>

      <main>
        <section ref={heroRef} className="nirnay-hero relative isolate overflow-hidden border-b border-[#E7DDCF]" data-motion={heroMotionEnabled ? 'running' : 'paused'}>
          <video ref={videoRef} key={String(videoAllowed)} muted loop playsInline preload={videoAllowed ? 'metadata' : 'none'} aria-hidden="true" className="nirnay-hero-video pointer-events-none absolute inset-0 h-full w-full object-cover">
            {videoAllowed && ruralVideoSources.map((source) => <source key={source} src={source} type="video/mp4" />)}
          </video>
          <div className="pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0" />
          <div className="nirnay-video-grain pointer-events-none absolute inset-0" />
          <div className="nirnay-rural-scene pointer-events-none absolute inset-x-0 bottom-0 h-64" />

          <button type="button" onClick={() => setIsPaused((paused) => !paused)} disabled={reducedMotion} aria-pressed={isPaused || reducedMotion} className="absolute bottom-3 right-5 z-20 flex items-center gap-2 rounded-full border border-[#D6C2A4] bg-[#FFFDF8]/95 px-4 py-3 text-xs font-bold text-[#6D4B27] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D5D28] disabled:opacity-70">
            {isPaused && !reducedMotion ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}
            {reducedMotion ? motionCopy.reduced : isPaused ? motionCopy.play : motionCopy.pause}
          </button>

          <div className="relative z-10 mx-auto grid min-h-[680px] max-w-[1380px] items-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
            <div>
              <Hero
                eyebrow={copy.badge}
                titleLead=""
                titles={copy.smarterWords}
                titleTail={copy.titleTail}
                description={t('heroSupporting', language)}
                primaryLabel={t('btnStartAssessment', language)}
                secondaryLabel={copy.watch}
                onPrimary={() => onNavigate('assessment')}
                onSecondary={() => setStoryOpen(true)}
                align="left"
                motionEnabled={heroMotionEnabled}
              />

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#605449]">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />{copy.easy}</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />{copy.data}</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />{copy.bharat}</span>
              </div>
            </div>

            <DepthShowcase motionEnabled={heroMotionEnabled && finePointer}>
              <DashboardPreview language={language} onNavigate={onNavigate} onTryDemo={onTryDemo} onOpenHelp={onOpenHelp} />
            </DepthShowcase>
          </div>
        </section>

        <section id="solutions" className="border-t border-[#E7DDCF] bg-[#FFFDF8]/94 px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto mb-7 max-w-[1380px]">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A6A31]">NIRNAY AI</p>
            <h2 className="mt-2 font-display text-3xl text-[#2A1A10] sm:text-4xl">{t('appSubtitle', language)}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#796B5E]">{featureBody}</p>
          </div>

          <div className="mx-auto grid max-w-[1380px] gap-5 md:grid-cols-3">
            <FeatureCard icon={<Landmark className="h-6 w-6" />} title={t('navSchemes', language)} text={featureBody} onClick={() => onNavigate('schemes')} />
            <FeatureCard icon={<FileText className="h-6 w-6" />} title={t('navReport', language)} text={featureBody} onClick={() => onNavigate('report')} />
            <FeatureCard icon={<Lightbulb className="h-6 w-6" />} title={t('navAnalysis', language)} text={featureBody} onClick={() => onNavigate('analysis')} />
          </div>
        </section>

        <section className="border-t border-[#EAE0D4] bg-[#FFFDF9] px-5 py-7 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1380px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={<Users className="h-7 w-7" />} value="User-led" label="Entrepreneur Profile" />
            <Metric icon={<BarChart3 className="h-7 w-7" />} value="Explainable" label="Business Fit Scoring" />
            <Metric icon={<Landmark className="h-7 w-7" />} value="Verified links" label="Government Support Paths" />
            <Metric icon={<Sprout className="h-7 w-7" />} value="Stronger Villages" label="Brighter India" />
          </div>
        </section>
      </main>

      {storyOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#20150D]/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="w-full max-w-5xl overflow-hidden rounded-[26px] border border-[#D8C6AA] bg-[#FFFDF8] shadow-[0_35px_100px_rgba(28,18,10,.35)]">
            <div className="flex items-center justify-between border-b border-[#E8DDCF] px-5 py-4 sm:px-6">
              <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A6A31]">Nirnay AI</p><h3 className="mt-1 font-display text-2xl text-[#281C13]">{copy.badge}</h3></div>
              <button onClick={() => setStoryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E7D7] text-[#5F4630]" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid lg:grid-cols-[1.45fr_.55fr]">
              <div className="bg-[#20150D]"><video autoPlay muted controls loop playsInline className="aspect-video h-full w-full object-cover">{ruralVideoSources.map((source) => <source key={source} src={source} type="video/mp4" />)}</video></div>
              <div className="flex flex-col justify-between p-6 sm:p-7">
                <div><p className="text-sm leading-7 text-[#6D5E51]">{featureBody}</p><div className="mt-5 space-y-3 text-sm text-[#5F5145]"><div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" />{t('navOpportunity', language)}</div><div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" />{t('navFinance', language)}</div><div className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" />{t('navSchemes', language)}</div></div></div>
                <button onClick={() => { setStoryOpen(false); onNavigate('assessment'); }} className="mt-7 rounded-xl bg-[#A97838] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#8D5D28]">{t('btnStartAssessment', language)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardPreview: React.FC<{
  language: LanguageCode;
  onNavigate: (page: PageId) => void;
  onTryDemo: () => void;
  onOpenHelp: () => void;
}> = ({ language, onNavigate, onTryDemo, onOpenHelp }) => (
  <div className="nirnay-dashboard-shell overflow-hidden rounded-[24px] border border-[#DED2C1] bg-[#FFFDF8]/92 backdrop-blur-md">
    <div className="flex items-center justify-between border-b border-[#E9DFD1] bg-[#FFFDF8]/80 px-5 py-4">
      <div className="flex items-center gap-2 font-display text-2xl text-[#2A1A10]"><Sprout className="h-5 w-5 text-[#9D6A30]" /> Nirnay AI</div>
      <span className="nirnay-preview-label rounded-full border border-[#DCCAAF] bg-[#F8F0E4] px-2.5 py-1 text-[10px] font-semibold text-[#756047]">{MOTION_COPY[language].demo}</span>
    </div>

    <div className="grid min-h-[445px] md:grid-cols-[145px_1fr]">
      <aside className="hidden border-r border-[#EBE1D5] bg-[#FFFDF9]/82 p-3 md:block">
        <SideButton active icon={<BarChart3 className="h-4 w-4" />} label={t('navDashboard', language)} onClick={onTryDemo} />
        <SideButton icon={<FileText className="h-4 w-4" />} label={t('navReport', language)} onClick={() => onNavigate('report')} />
        <SideButton icon={<Landmark className="h-4 w-4" />} label={t('navSchemes', language)} onClick={() => onNavigate('schemes')} />
        <SideButton icon={<Lightbulb className="h-4 w-4" />} label={t('navAnalysis', language)} onClick={() => onNavigate('analysis')} />
        <SideButton icon={<FileText className="h-4 w-4" />} label="Learning" onClick={onOpenHelp} />
        <SideButton icon={<User className="h-4 w-4" />} label={t('navAssessment', language)} onClick={() => onNavigate('assessment')} />
      </aside>

      <div className="p-4 sm:p-5">
        <div><h3 className="text-lg font-extrabold text-[#24170D]">Welcome back, Ramesh!</h3><p className="mt-1 text-xs text-[#827366]">Good decisions today, a better tomorrow.</p></div>

        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <MiniStat icon={<span className="text-lg font-bold">₹</span>} label="Investment" value="₹2,50,000" />
          <MiniStat icon={<TrendingUp className="h-4 w-4" />} label="Monthly Profit" value="₹45,000" />
          <MiniStat icon={<BarChart3 className="h-4 w-4" />} label="Business Score" value="78/100" />
          <MiniStat icon={<ShieldCheck className="h-4 w-4" />} label="Risk Level" value="Low" valueClass="text-[#648044]" />
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.18fr_.82fr]">
          <div className="rounded-2xl border border-[#E5DACB] bg-white/92 p-4 shadow-[0_4px_14px_rgba(74,48,25,.035)]">
            <div className="flex items-center justify-between"><div><div className="text-sm font-bold">Profit Projection</div><div className="mt-1 text-[11px] text-[#807165]">6 Month Growth</div></div><span className="rounded-full border border-[#E4D8C7] px-3 py-1 text-[10px] text-[#746558]">6 Months</span></div>
            <div className="relative mt-5 h-32 border-b border-l border-[#E9E1D6]"><svg viewBox="0 0 420 130" className="absolute inset-0 h-full w-full overflow-visible"><defs><linearGradient id="areaFillV2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C89450" stopOpacity="0.3" /><stop offset="100%" stopColor="#C89450" stopOpacity="0.02" /></linearGradient></defs><path d="M0,112 L70,88 L140,72 L210,64 L280,48 L350,26 L420,12 L420,130 L0,130 Z" fill="url(#areaFillV2)" /><polyline points="0,112 70,88 140,72 210,64 280,48 350,26 420,12" fill="none" stroke="#A97838" strokeWidth="3" /></svg></div>
          </div>
          <div className="rounded-2xl border border-[#E0D1BA] bg-gradient-to-br from-[#F8F0E5] to-[#E7D4B5] p-5"><p className="font-display text-2xl leading-[1.05] text-[#3A291B]">Bigger Opportunities for Brighter Tomorrows</p><p className="mt-3 text-[11px] leading-5 text-[#76604B]">Practical local insight, structured finance and a clearer path to action.</p><div className="mt-5 flex justify-end"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9B18D]/45 text-3xl">👨🏽‍🌾</div></div></div>
        </div>
      </div>
    </div>
  </div>
);

const SideButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }> = ({ icon, label, onClick, active }) => (
  <button onClick={onClick} className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs transition ${active ? 'bg-[#F0E1CA] font-bold text-[#775122]' : 'text-[#625548] hover:bg-[#F6ECDE]'}`}>{icon}{label}</button>
);

const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: string; valueClass?: string }> = ({ icon, label, value, valueClass = '' }) => (
  <div className="rounded-2xl border border-[#E7DDCF] bg-white/95 p-3 shadow-[0_3px_12px_rgba(65,42,20,.04)]"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E1C8] text-[#A26D2C]">{icon}</div><p className="mt-3 text-[10px] text-[#817267]">{label}</p><strong className={`mt-1 block text-base font-extrabold ${valueClass}`}>{value}</strong></div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; text: string; onClick: () => void }> = ({ icon, title, text, onClick }) => (
  <button onClick={onClick} className="nirnay-feature-card group rounded-2xl border border-[#E0D4C4] bg-[#FFFDF8] p-5 text-left shadow-[0_5px_18px_rgba(70,45,25,.04)] transition hover:border-[#CFAE80] hover:shadow-[0_16px_38px_rgba(70,45,25,.10)]"><div className="flex items-start justify-between gap-3"><div className="nirnay-feature-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E6D1] to-[#EAD5B5] text-[#98652A]">{icon}</div><ChevronRight className="h-5 w-5 text-[#96652D]" /></div><h3 className="mt-4 font-display text-2xl text-[#25170D]">{title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#75675B]">{text}</p></button>
);

const Metric: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="flex items-center gap-4 lg:border-r lg:border-[#DED4C6] lg:last:border-r-0"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E5D2] text-[#A67334]">{icon}</div><div><strong className="block text-xl font-extrabold text-[#2A1A10]">{value}</strong><p className="mt-1 text-[11px] text-[#796C60]">{label}</p></div></div>
);
