import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  FileText,
  Landmark,
  Loader2,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Sprout,
  UserRoundCog,
  Users,
} from 'lucide-react';
import type { LanguageCode, PageId } from '../types';
import { getCurrentRole, signInAdminWithIdPassword, signOut } from '../services/authService';
import { getAdminStats, getRecentAdminActivity } from '../services/backendService';
import { supabase } from '../lib/supabase';

interface AdminPortalPageProps {
  language: LanguageCode;
  onBack: () => void;
  onNavigate: (page: PageId) => void;
  projectCost: number;
  feasibilityScore: number;
  citizenCount: number;
}

type Copy = {
  restricted: string;
  title: string;
  body: string;
  loginId: string;
  password: string;
  send: string;
  unauthorized: string;
  console: string;
  subtitle: string;
  citizens: string;
  assessments: string;
  reports: string;
  analyses: string;
  quick: string;
  dashboard: string;
  report: string;
  schemes: string;
  signout: string;
  back: string;
  activity: string;
  security: string;
};

const EN: Copy = {
  restricted: 'Restricted Access',
  title: 'Nirnay AI Admin Portal',
  body: 'One administrator only. Sign in with the configured Admin ID and password.',
  loginId: 'Admin ID',
  password: 'Password',
  send: 'Sign in securely',
  unauthorized: 'This account is not the authorised Nirnay AI administrator.',
  console: 'Administration Console',
  subtitle: 'Live citizen, assessment and report activity from the protected database.',
  citizens: 'Verified citizens', assessments: 'Saved assessments', reports: 'Generated reports', analyses: 'AI analyses',
  quick: 'Quick controls', dashboard: 'Open dashboard', report: 'Open report', schemes: 'Open schemes', signout: 'Sign out', back: 'Back to home',
  activity: 'Recent database activity', security: 'Admin ID is mapped server-side to the single database-authorised admin account. The password is verified by Supabase Auth and is never stored in frontend code.',
};

const COPY: Record<LanguageCode, Copy> = {
  en: EN,
  hi: { ...EN, restricted:'प्रतिबंधित प्रवेश', title:'निर्णय AI एडमिन पोर्टल', body:'केवल एक एडमिन। कॉन्फ़िगर किए गए एडमिन ID और पासवर्ड से लॉगिन करें।', loginId:'एडमिन ID', password:'पासवर्ड', send:'सुरक्षित लॉगिन', unauthorized:'यह खाता अधिकृत Nirnay AI एडमिन नहीं है।', console:'प्रशासन कंसोल', subtitle:'सुरक्षित डेटाबेस से लाइव नागरिक, आकलन और रिपोर्ट गतिविधि।', citizens:'सत्यापित नागरिक', assessments:'सहेजे गए आकलन', reports:'बनाई गई रिपोर्ट', analyses:'AI विश्लेषण', quick:'त्वरित नियंत्रण', dashboard:'डैशबोर्ड खोलें', report:'रिपोर्ट खोलें', schemes:'योजनाएँ खोलें', signout:'लॉगआउट', back:'होम पर वापस', activity:'हाल की डेटाबेस गतिविधि', security:'एडमिन ID सर्वर पर एकमात्र अधिकृत डेटाबेस एडमिन से मैप होती है। पासवर्ड Supabase Auth से सत्यापित होता है और फ्रंटएंड कोड में सेव नहीं होता।' },
  bn: { ...EN, restricted:'সীমিত প্রবেশ', title:'Nirnay AI অ্যাডমিন পোর্টাল', body:'শুধু একজন অ্যাডমিন। কনফিগার করা Admin ID ও পাসওয়ার্ড দিয়ে সাইন ইন করুন।', loginId:'অ্যাডমিন ID', password:'পাসওয়ার্ড', send:'নিরাপদে সাইন ইন', console:'অ্যাডমিন কনসোল', citizens:'যাচাইকৃত নাগরিক', assessments:'সংরক্ষিত মূল্যায়ন', reports:'রিপোর্ট', analyses:'AI বিশ্লেষণ', back:'হোমে ফিরুন', activity:'সাম্প্রতিক ডেটাবেস কার্যকলাপ' },
  mr: { ...EN, restricted:'मर्यादित प्रवेश', title:'Nirnay AI अॅडमिन पोर्टल', body:'फक्त एक अॅडमिन. कॉन्फिगर केलेल्या Admin ID आणि पासवर्डने साइन इन करा.', loginId:'अॅडमिन ID', password:'पासवर्ड', send:'सुरक्षित साइन इन', console:'प्रशासन कन्सोल', citizens:'सत्यापित नागरिक', assessments:'जतन केलेले मूल्यांकन', reports:'अहवाल', analyses:'AI विश्लेषणे', back:'मुख्यपृष्ठावर परत', activity:'अलीकडील डेटाबेस क्रिया' },
  ta: { ...EN, restricted:'கட்டுப்படுத்தப்பட்ட அணுகல்', title:'Nirnay AI நிர்வாக போர்டல்', body:'ஒரே ஒரு நிர்வாகி. அமைக்கப்பட்ட Admin ID மற்றும் கடவுச்சொல்லால் உள்நுழையவும்.', loginId:'நிர்வாக ID', password:'கடவுச்சொல்', send:'பாதுகாப்பாக உள்நுழை', console:'நிர்வாக கட்டுப்பாட்டு மையம்', citizens:'சரிபார்க்கப்பட்ட குடிமக்கள்', assessments:'சேமித்த மதிப்பீடுகள்', reports:'அறிக்கைகள்', analyses:'AI பகுப்பாய்வுகள்', back:'முகப்புக்கு', activity:'சமீபத்திய தரவுத்தள செயல்பாடு' },
  te: { ...EN, restricted:'పరిమిత ప్రవేశం', title:'Nirnay AI అడ్మిన్ పోర్టల్', body:'ఒక అడ్మిన్ మాత్రమే. కాన్ఫిగర్ చేసిన Admin ID మరియు పాస్‌వర్డ్‌తో లాగిన్ అవ్వండి.', loginId:'అడ్మిన్ ID', password:'పాస్‌వర్డ్', send:'సురక్షిత లాగిన్', console:'అడ్మిన్ కన్సోల్', citizens:'ధృవీకరించిన పౌరులు', assessments:'సేవ్ చేసిన అంచనాలు', reports:'రిపోర్టులు', analyses:'AI విశ్లేషణలు', back:'హోమ్‌కు', activity:'ఇటీవలి డేటాబేస్ కార్యకలాపం' },
  kn: { ...EN, restricted:'ನಿರ್ಬಂಧಿತ ಪ್ರವೇಶ', title:'Nirnay AI ಆಡ್ಮಿನ್ ಪೋರ್ಟಲ್', body:'ಒಬ್ಬ ಆಡ್ಮಿನ್ ಮಾತ್ರ. ಕಾನ್ಫಿಗರ್ ಮಾಡಿದ Admin ID ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್‌ನೊಂದಿಗೆ ಲಾಗಿನ್ ಮಾಡಿ.', loginId:'ಆಡ್ಮಿನ್ ID', password:'ಪಾಸ್‌ವರ್ಡ್', send:'ಸುರಕ್ಷಿತ ಲಾಗಿನ್', console:'ಆಡಳಿತ ಕನ್ಸೋಲ್', citizens:'ಪರಿಶೀಲಿತ ನಾಗರಿಕರು', assessments:'ಉಳಿಸಿದ ಮೌಲ್ಯಮಾಪನಗಳು', reports:'ವರದಿಗಳು', analyses:'AI ವಿಶ್ಲೇಷಣೆಗಳು', back:'ಮುಖಪುಟಕ್ಕೆ', activity:'ಇತ್ತೀಚಿನ ಡೇಟಾಬೇಸ್ ಚಟುವಟಿಕೆ' },
  gu: { ...EN, restricted:'પ્રતિબંધિત પ્રવેશ', title:'Nirnay AI એડમિન પોર્ટલ', body:'માત્ર એક એડમિન. કૉન્ફિગર કરેલા Admin ID અને પાસવર્ડથી લૉગિન કરો.', loginId:'એડમિન ID', password:'પાસવર્ડ', send:'સુરક્ષિત લૉગિન', console:'એડમિન કન્સોલ', citizens:'ચકાસાયેલ નાગરિકો', assessments:'સાચવેલા મૂલ્યાંકન', reports:'રિપોર્ટ', analyses:'AI વિશ્લેષણ', back:'હોમ પર પાછા', activity:'તાજેતરની ડેટાબેસ પ્રવૃત્તિ' },
  pa: { ...EN, restricted:'ਪਾਬੰਦੀਸ਼ੁਦਾ ਪਹੁੰਚ', title:'Nirnay AI ਐਡਮਿਨ ਪੋਰਟਲ', body:'ਸਿਰਫ਼ ਇੱਕ ਐਡਮਿਨ। ਕਨਫਿਗਰ ਕੀਤੇ Admin ID ਅਤੇ ਪਾਸਵਰਡ ਨਾਲ ਲਾਗਇਨ ਕਰੋ।', loginId:'ਐਡਮਿਨ ID', password:'ਪਾਸਵਰਡ', send:'ਸੁਰੱਖਿਅਤ ਲਾਗਇਨ', console:'ਐਡਮਿਨ ਕਨਸੋਲ', citizens:'ਪੁਸ਼ਟੀ ਕੀਤੇ ਨਾਗਰਿਕ', assessments:'ਸੇਵ ਕੀਤੇ ਮੁਲਾਂਕਣ', reports:'ਰਿਪੋਰਟਾਂ', analyses:'AI ਵਿਸ਼ਲੇਸ਼ਣ', back:'ਹੋਮ ਤੇ ਵਾਪਸ', activity:'ਹਾਲੀਆ ਡੇਟਾਬੇਸ ਗਤੀਵਿਧੀ' },
};

type Status = 'checking' | 'signed-out' | 'unauthorized' | 'admin';

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ language, onBack, onNavigate, projectCost, feasibilityScore }) => {
  const c = COPY[language] || EN;
  const [status, setStatus] = useState<Status>('checking');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ citizens: 0, assessments: 0, reports: 0, analyses: 0 });
  const [activity, setActivity] = useState<Array<{ action: string; entity_type: string | null; created_at: string }>>([]);

  const currency = useMemo(
    () => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(projectCost),
    [projectCost]
  );

  const loadAdminData = async () => {
    const [liveStats, recent] = await Promise.all([getAdminStats(), getRecentAdminActivity()]);
    setStats(liveStats);
    setActivity(recent);
  };

  const checkAccess = async () => {
    setStatus('checking');
    setError('');
    const role = await getCurrentRole();
    if (!role) return setStatus('signed-out');
    if (role !== 'admin') return setStatus('unauthorized');
    setStatus('admin');
    try { await loadAdminData(); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load admin data.'); }
  };

  useEffect(() => {
    void checkAccess();
    const { data } = supabase.auth.onAuthStateChange(() => window.setTimeout(() => void checkAccess(), 0));
    return () => data.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!loginId.trim() || !password) return setError('Admin ID and password are required.');
    setLoading(true);
    setError('');
    try {
      await signInAdminWithIdPassword(loginId, password);
      setPassword('');
      setStatus('admin');
      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin sign-in failed.');
      setStatus('signed-out');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setPassword('');
    setStatus('signed-out');
  };

  if (status === 'checking') {
    return <div className="min-h-screen bg-[#F8F2E8] flex items-center justify-center text-[#6B4535]"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (status !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F2E8] px-4 py-8 text-[#281C13] sm:px-6">
        <div className="mx-auto max-w-5xl">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-[#76532C]"><ArrowLeft className="h-4 w-4" /> {c.back}</button>
          <div className="mx-auto mt-10 max-w-md rounded-[30px] border border-[#DFD2C1] bg-[#FFFDF8] p-7 shadow-[0_28px_80px_rgba(72,47,25,.12)] sm:p-9">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E1CA] text-[#7A4D32]"><LockKeyhole className="h-7 w-7" /></div>
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-[#9A6A31]">{c.restricted}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">{c.title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#75675B]">{status === 'unauthorized' ? c.unauthorized : c.body}</p>

            {status === 'unauthorized' && (
              <button onClick={handleSignOut} className="mt-5 w-full rounded-xl border border-[#D7C4AA] bg-white px-4 py-3 text-sm font-bold text-[#6B4535]">{c.signout}</button>
            )}

            {status !== 'unauthorized' && (
              <>
                <label className="mt-6 block text-sm font-bold">{c.loginId}</label>
                <input value={loginId} onChange={(e) => setLoginId(e.target.value)} autoComplete="username" className="mt-2 w-full rounded-xl border border-[#DCCFBE] bg-white px-4 py-3 outline-none focus:border-[#A97838]" />
                <label className="mt-5 block text-sm font-bold">{c.password}</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" onKeyDown={(e) => { if (e.key === 'Enter') void handleLogin(); }} className="mt-2 w-full rounded-xl border border-[#DCCFBE] bg-white px-4 py-3 outline-none focus:border-[#A97838]" />
                {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <button onClick={handleLogin} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A2F24] px-5 py-3.5 font-bold text-white transition hover:bg-[#2B1B16] disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />} {c.send}</button>
              </>
            )}

            <div className="mt-6 flex items-start gap-2 border-t border-[#E9DED0] pt-5 text-xs leading-5 text-[#837366]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9C6A30]" />{c.security}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F2E8] px-4 py-7 text-[#281C13] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-[#76532C]"><ArrowLeft className="h-4 w-4" /> {c.back}</button>
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl border border-[#D7C4AA] bg-white px-4 py-2.5 text-xs font-extrabold text-[#59402A]"><LogOut className="h-4 w-4" /> {c.signout}</button>
        </div>

        <section className="rounded-3xl bg-[#3F2A21] p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><div className="flex items-center gap-2 text-[#DFC6A8]"><UserRoundCog className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-widest">{c.console}</span></div><h1 className="mt-2 font-serif text-3xl font-bold">NIRNAY AI</h1><p className="mt-2 max-w-2xl text-sm text-white/75">{c.subtitle}</p></div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-right"><div className="text-[10px] uppercase tracking-wider text-white/60">Current demo project</div><div className="text-xl font-black">{currency}</div><div className="text-xs text-white/70">Feasibility {feasibilityScore}/100</div></div>
          </div>
        </section>

        {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Users} label={c.citizens} value={stats.citizens} />
          <Stat icon={Sprout} label={c.assessments} value={stats.assessments} />
          <Stat icon={FileText} label={c.reports} value={stats.reports} />
          <Stat icon={BarChart3} label={c.analyses} value={stats.analyses} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-[#DFD2C1] bg-[#FFFDF8] p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#6B4535]">{c.activity}</h2>
            <div className="mt-4 space-y-2">
              {activity.length ? activity.map((item, index) => (
                <div key={`${item.created_at}-${index}`} className="flex items-center justify-between gap-4 rounded-xl border border-[#E8D9C8] bg-white px-4 py-3 text-xs"><div><div className="font-extrabold text-[#2B1B16]">{item.action.replaceAll('_', ' ')}</div><div className="text-[#8B5E47]">{item.entity_type || 'system'}</div></div><div className="text-right text-[10px] text-[#8B5E47]">{new Date(item.created_at).toLocaleString()}</div></div>
              )) : <p className="text-sm text-[#8B5E47]">No recent activity.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-[#DFD2C1] bg-[#FFFDF8] p-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#6B4535]">{c.quick}</h2>
            <div className="mt-4 space-y-2">
              <Quick icon={BarChart3} label={c.dashboard} onClick={() => onNavigate('dashboard')} />
              <Quick icon={FileText} label={c.report} onClick={() => onNavigate('report')} />
              <Quick icon={Landmark} label={c.schemes} onClick={() => onNavigate('schemes')} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return <div className="rounded-2xl border border-[#DFD2C1] bg-[#FFFDF8] p-5"><Icon className="h-5 w-5 text-[#8B5E47]" /><div className="mt-3 text-3xl font-black text-[#2B1B16]">{value}</div><div className="mt-1 text-xs font-bold text-[#8B5E47]">{label}</div></div>;
}

function Quick({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-[#E8D9C8] bg-white px-4 py-3 text-left text-xs font-extrabold text-[#4A2F24] transition hover:bg-[#F4E9DA]"><Icon className="h-4 w-4 text-[#8B5E47]" />{label}</button>;
}
