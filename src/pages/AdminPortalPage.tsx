import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileText,
  Landmark,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  Sprout,
  UserRoundCog,
  Users,
} from 'lucide-react';
import type { LanguageCode, PageId } from '../types';
import { getCurrentRole, sendAdminMagicLink, signOut } from '../services/authService';
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
  email: string;
  send: string;
  sent: string;
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
};

const EN: Copy = {
  restricted: 'Restricted Access', title: 'Nirnay AI Admin Portal', body: 'Only the single database-authorised administrator can open this console.',
  email: 'Administrator email', send: 'Send secure admin sign-in link', sent: 'Secure sign-in link sent. Open the email, then return to the Admin portal.',
  unauthorized: 'This signed-in account is not the authorised Nirnay AI administrator.', console: 'Administration Console', subtitle: 'Live citizen, assessment and report activity from the production database.',
  citizens: 'Verified citizens', assessments: 'Saved assessments', reports: 'Generated reports', analyses: 'AI analyses', quick: 'Quick controls',
  dashboard: 'Open dashboard', report: 'Open report', schemes: 'Open schemes', signout: 'Sign out', back: 'Back to home',
};

const COPY: Record<LanguageCode, Copy> = {
  en: EN,
  hi: { ...EN, restricted:'प्रतिबंधित प्रवेश', title:'निर्णय AI एडमिन पोर्टल', body:'केवल डेटाबेस में अधिकृत एकमात्र एडमिन इस कंसोल को खोल सकता है।', email:'एडमिन ईमेल', send:'सुरक्षित एडमिन लिंक भेजें', sent:'सुरक्षित साइन-इन लिंक भेज दिया गया है। ईमेल खोलें और फिर एडमिन पोर्टल पर लौटें।', unauthorized:'यह खाता अधिकृत Nirnay AI एडमिन नहीं है।', console:'प्रशासन कंसोल', subtitle:'प्रोडक्शन डेटाबेस से लाइव नागरिक, आकलन और रिपोर्ट गतिविधि।', citizens:'सत्यापित नागरिक', assessments:'सहेजे गए आकलन', reports:'बनाई गई रिपोर्ट', analyses:'AI विश्लेषण', quick:'त्वरित नियंत्रण', dashboard:'डैशबोर्ड खोलें', report:'रिपोर्ट खोलें', schemes:'योजनाएँ खोलें', signout:'लॉगआउट', back:'होम पर वापस' },
  bn: { ...EN, restricted:'সীমিত প্রবেশ', title:'Nirnay AI অ্যাডমিন পোর্টাল', email:'অ্যাডমিন ইমেল', send:'নিরাপদ অ্যাডমিন লিংক পাঠান', unauthorized:'এই অ্যাকাউন্ট অনুমোদিত অ্যাডমিন নয়।', console:'অ্যাডমিন কনসোল', citizens:'যাচাইকৃত নাগরিক', assessments:'সংরক্ষিত মূল্যায়ন', reports:'রিপোর্ট', analyses:'AI বিশ্লেষণ', back:'হোমে ফিরুন' },
  mr: { ...EN, restricted:'मर्यादित प्रवेश', title:'Nirnay AI अॅडमिन पोर्टल', email:'अॅडमिन ईमेल', send:'सुरक्षित अॅडमिन लिंक पाठवा', unauthorized:'हे खाते अधिकृत अॅडमिन नाही.', console:'प्रशासन कन्सोल', citizens:'सत्यापित नागरिक', assessments:'जतन केलेले मूल्यांकन', reports:'अहवाल', analyses:'AI विश्लेषणे', back:'मुख्यपृष्ठावर परत' },
  ta: { ...EN, restricted:'கட்டுப்படுத்தப்பட்ட அணுகல்', title:'Nirnay AI நிர்வாக போர்டல்', email:'நிர்வாகி மின்னஞ்சல்', send:'பாதுகாப்பான நிர்வாக இணைப்பை அனுப்பவும்', unauthorized:'இந்த கணக்கு அங்கீகரிக்கப்பட்ட நிர்வாகி அல்ல.', console:'நிர்வாக கட்டுப்பாட்டு மையம்', citizens:'சரிபார்க்கப்பட்ட குடிமக்கள்', assessments:'சேமித்த மதிப்பீடுகள்', reports:'அறிக்கைகள்', analyses:'AI பகுப்பாய்வுகள்', back:'முகப்புக்கு' },
  te: { ...EN, restricted:'పరిమిత ప్రవేశం', title:'Nirnay AI అడ్మిన్ పోర్టల్', email:'అడ్మిన్ ఇమెయిల్', send:'సురక్షిత అడ్మిన్ లింక్ పంపండి', unauthorized:'ఈ ఖాతా అధీకృత అడ్మిన్ కాదు.', console:'అడ్మిన్ కన్సోల్', citizens:'ధృవీకరించిన పౌరులు', assessments:'సేవ్ చేసిన అంచనాలు', reports:'రిపోర్టులు', analyses:'AI విశ్లేషణలు', back:'హోమ్‌కు' },
  kn: { ...EN, restricted:'ನಿರ್ಬಂಧಿತ ಪ್ರವೇಶ', title:'Nirnay AI ಆಡ್ಮಿನ್ ಪೋರ್ಟಲ್', email:'ಆಡ್ಮಿನ್ ಇಮೇಲ್', send:'ಸುರಕ್ಷಿತ ಆಡ್ಮಿನ್ ಲಿಂಕ್ ಕಳುಹಿಸಿ', unauthorized:'ಈ ಖಾತೆ ಅಧಿಕೃತ ಆಡ್ಮಿನ್ ಅಲ್ಲ.', console:'ಆಡಳಿತ ಕನ್ಸೋಲ್', citizens:'ಪರಿಶೀಲಿತ ನಾಗರಿಕರು', assessments:'ಉಳಿಸಿದ ಮೌಲ್ಯಮಾಪನಗಳು', reports:'ವರದಿಗಳು', analyses:'AI ವಿಶ್ಲೇಷಣೆಗಳು', back:'ಮುಖಪುಟಕ್ಕೆ' },
  gu: { ...EN, restricted:'પ્રતિબંધિત પ્રવેશ', title:'Nirnay AI એડમિન પોર્ટલ', email:'એડમિન ઈમેલ', send:'સુરક્ષિત એડમિન લિંક મોકલો', unauthorized:'આ ખાતું અધિકૃત એડમિન નથી.', console:'એડમિન કન્સોલ', citizens:'ચકાસાયેલ નાગરિકો', assessments:'સાચવેલા મૂલ્યાંકન', reports:'રિપોર્ટ', analyses:'AI વિશ્લેષણ', back:'હોમ પર પાછા' },
  pa: { ...EN, restricted:'ਪਾਬੰਦੀਸ਼ੁਦਾ ਪਹੁੰਚ', title:'Nirnay AI ਐਡਮਿਨ ਪੋਰਟਲ', email:'ਐਡਮਿਨ ਈਮੇਲ', send:'ਸੁਰੱਖਿਅਤ ਐਡਮਿਨ ਲਿੰਕ ਭੇਜੋ', unauthorized:'ਇਹ ਖਾਤਾ ਅਧਿਕਾਰਤ ਐਡਮਿਨ ਨਹੀਂ ਹੈ।', console:'ਐਡਮਿਨ ਕਨਸੋਲ', citizens:'ਪੁਸ਼ਟੀ ਕੀਤੇ ਨਾਗਰਿਕ', assessments:'ਸੇਵ ਕੀਤੇ ਮੁਲਾਂਕਣ', reports:'ਰਿਪੋਰਟਾਂ', analyses:'AI ਵਿਸ਼ਲੇਸ਼ਣ', back:'ਹੋਮ ਤੇ ਵਾਪਸ' },
};

type Status = 'checking' | 'signed-out' | 'link-sent' | 'unauthorized' | 'admin';

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  language,
  onBack,
  onNavigate,
  projectCost,
  feasibilityScore,
}) => {
  const c = COPY[language] || EN;
  const [status, setStatus] = useState<Status>('checking');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ citizens: 0, assessments: 0, reports: 0, analyses: 0 });
  const [activity, setActivity] = useState<Array<{ action: string; entity_type: string | null; created_at: string }>>([]);
  const [currentEmail, setCurrentEmail] = useState('');

  const currency = useMemo(
    () => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(projectCost),
    [projectCost]
  );

  const checkAccess = async () => {
    setStatus('checking');
    setError('');
    const { data: userData } = await supabase.auth.getUser();
    setCurrentEmail(userData.user?.email || '');
    const role = await getCurrentRole();

    if (!role) {
      setStatus('signed-out');
      return;
    }
    if (role !== 'admin') {
      setStatus('unauthorized');
      return;
    }

    setStatus('admin');
    try {
      const [liveStats, recent] = await Promise.all([getAdminStats(), getRecentAdminActivity()]);
      setStats(liveStats);
      setActivity(recent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin data.');
    }
  };

  useEffect(() => {
    void checkAccess();
    const { data } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void checkAccess(), 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleSendLink = async () => {
    setLoading(true);
    setError('');
    try {
      await sendAdminMagicLink(email);
      setStatus('link-sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send admin sign-in link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setStatus('signed-out');
    setCurrentEmail('');
  };

  if (status === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-[#F8F2E8]"><Loader2 className="h-8 w-8 animate-spin text-[#A97838]" /></div>;
  }

  if (status !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F2E8] px-4 py-8 text-[#281C13]">
        <div className="mx-auto max-w-xl">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#76532C]"><ArrowLeft className="h-4 w-4" />{c.back}</button>
          <div className="mt-8 rounded-[28px] border border-[#DFD2C1] bg-[#FFFDF8] p-7 shadow-[0_25px_70px_rgba(72,47,25,.12)] sm:p-9">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E1CA] text-[#8D5D28]"><LockKeyhole className="h-7 w-7" /></div>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.16em] text-[#9A6A31]">{c.restricted}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold">{c.title}</h1>
            <p className="mt-3 text-sm leading-7 text-[#75675B]">{c.body}</p>

            {status === 'unauthorized' ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
                <strong>{c.unauthorized}</strong>
                {currentEmail && <div className="mt-2 text-xs">{currentEmail}</div>}
                <button onClick={handleSignOut} className="mt-4 flex items-center gap-2 font-bold"><LogOut className="h-4 w-4" />{c.signout}</button>
              </div>
            ) : status === 'link-sent' ? (
              <div className="mt-6 rounded-2xl border border-[#D9C7AE] bg-[#F7EDDF] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8D4B6] text-[#8D5D28]"><Mail className="h-5 w-5" /></div>
                <p className="mt-4 text-sm leading-7 text-[#6D5E51]">{c.sent}</p>
                <button onClick={() => setStatus('signed-out')} className="mt-4 text-sm font-bold text-[#80572A]">Try another email</button>
              </div>
            ) : (
              <div className="mt-6">
                <label className="text-sm font-bold">{c.email}</label>
                <div className="mt-2 flex items-center rounded-xl border border-[#DCCFBE] bg-white px-4 focus-within:border-[#A97838]"><Mail className="h-4 w-4 text-[#9A6A31]" /><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-3 outline-none" placeholder="admin@example.com" /></div>
                {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <button onClick={handleSendLink} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#281C13] px-5 py-3.5 font-bold text-white disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{c.send}</button>
              </div>
            )}

            <div className="mt-6 flex gap-2 border-t border-[#E9DED0] pt-5 text-xs leading-5 text-[#837366]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#9C6A30]" />Role access is verified from PostgreSQL, not from browser-side credentials.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F2E8] px-4 py-7 text-[#281C13] sm:px-7">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#281C13] text-white"><UserRoundCog className="h-6 w-6" /></div><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#9A6A31]">Nirnay AI</p><h1 className="font-serif text-3xl font-bold">{c.console}</h1><p className="mt-1 text-sm text-[#75675B]">{c.subtitle}</p></div></div>
          <div className="flex gap-2"><button onClick={onBack} className="rounded-xl border border-[#D7C4AA] bg-white px-4 py-2.5 text-sm font-bold">{c.back}</button><button onClick={handleSignOut} className="flex items-center gap-2 rounded-xl bg-[#281C13] px-4 py-2.5 text-sm font-bold text-white"><LogOut className="h-4 w-4" />{c.signout}</button></div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={<Users />} label={c.citizens} value={String(stats.citizens)} />
          <Stat icon={<BarChart3 />} label={c.assessments} value={String(stats.assessments)} />
          <Stat icon={<FileText />} label={c.reports} value={String(stats.reports)} />
          <Stat icon={<Sprout />} label={c.analyses} value={String(stats.analyses)} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-3xl border border-[#DFD2C1] bg-[#FFFDF8] p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold">{c.quick}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Quick icon={<BarChart3 />} label={c.dashboard} onClick={() => onNavigate('dashboard')} />
              <Quick icon={<FileText />} label={c.report} onClick={() => onNavigate('report')} />
              <Quick icon={<Landmark />} label={c.schemes} onClick={() => onNavigate('schemes')} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F7EDDF] p-5"><p className="text-xs text-[#806F62]">Current project cost</p><strong className="mt-1 block text-2xl">{currency}</strong></div>
              <div className="rounded-2xl bg-[#F7EDDF] p-5"><p className="text-xs text-[#806F62]">Feasibility score</p><strong className="mt-1 block text-2xl">{feasibilityScore}/100</strong></div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#DFD2C1] bg-[#FFFDF8] p-6 shadow-sm">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-[#678046]" /><h2 className="font-serif text-xl font-bold">Backend status</h2></div>
            <div className="mt-5 space-y-3 text-sm">
              <StatusRow label="Supabase Auth" />
              <StatusRow label="PostgreSQL + RLS" />
              <StatusRow label="Single-admin role constraint" />
              <StatusRow label="Persistent assessments" />
            </div>
            {activity.length > 0 && <div className="mt-6 border-t border-[#E9DED0] pt-5"><p className="text-xs font-bold uppercase tracking-[.12em] text-[#9A6A31]">Recent activity</p>{activity.map((item, index) => <div key={`${item.created_at}-${index}`} className="mt-3 text-xs text-[#6D5E51]">{item.action} · {new Date(item.created_at).toLocaleString()}</div>)}</div>}
            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-[#DFD2C1] bg-[#FFFDF8] p-5 shadow-sm"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E1CA] text-[#9A6A31]">{icon}</div><p className="mt-4 text-xs text-[#7E6D5F]">{label}</p><strong className="mt-1 block text-3xl">{value}</strong></div>
);

const Quick: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-[#E2D6C6] bg-white p-4 text-left text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#CBAA80] hover:shadow-md"><span className="text-[#9A6A31]">{icon}</span>{label}</button>
);

const StatusRow: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center justify-between rounded-xl bg-[#F8F0E5] px-4 py-3"><span>{label}</span><span className="flex items-center gap-1 text-xs font-bold text-[#617B42]"><CheckCircle2 className="h-4 w-4" />Active</span></div>
);
