import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Sprout,
  UserRound,
} from 'lucide-react';
import type { CitizenSession, LanguageCode } from '../types';
import {
  getCurrentCitizenSession,
  sendCitizenLogin,
  verifyCitizenPhoneOtp,
  type LoginMethod,
} from '../services/authService';

interface CitizenLoginPageProps {
  language: LanguageCode;
  onBack: () => void;
  onSuccess: (session: CitizenSession) => void;
}

type Copy = {
  eyebrow: string;
  title: string;
  body: string;
  name: string;
  mobile: string;
  email: string;
  send: string;
  otpTitle: string;
  otpBody: string;
  verify: string;
  emailSentTitle: string;
  emailSentBody: string;
  secure: string;
  back: string;
  resend: string;
};

const EN: Copy = {
  eyebrow: 'Citizen Access',
  title: 'Secure Citizen Login',
  body: 'Use your mobile number or email. Authentication is now handled securely by the Nirnay AI backend.',
  name: 'Your name', mobile: 'Mobile number', email: 'Email address', send: 'Continue securely',
  otpTitle: 'Verify mobile number', otpBody: 'Enter the 6-digit OTP sent to your mobile number.', verify: 'Verify & continue',
  emailSentTitle: 'Check your email', emailSentBody: 'We sent a secure sign-in link. Open it to finish signing in to Nirnay AI.',
  secure: 'Protected by Supabase Auth and database row-level security.', back: 'Back to home', resend: 'Send again',
};

const COPY: Record<LanguageCode, Copy> = {
  en: EN,
  hi: { ...EN, eyebrow:'नागरिक प्रवेश', title:'सुरक्षित नागरिक लॉगिन', body:'मोबाइल नंबर या ईमेल से लॉगिन करें। अब सत्यापन सुरक्षित Nirnay AI बैकएंड से होता है।', name:'आपका नाम', mobile:'मोबाइल नंबर', email:'ईमेल पता', send:'सुरक्षित रूप से आगे बढ़ें', otpTitle:'मोबाइल सत्यापित करें', otpBody:'मोबाइल पर भेजा गया 6-अंकीय OTP दर्ज करें।', verify:'सत्यापित करें', emailSentTitle:'अपना ईमेल देखें', emailSentBody:'हमने सुरक्षित साइन-इन लिंक भेजा है। लॉगिन पूरा करने के लिए उसे खोलें।', secure:'Supabase Auth और डेटाबेस सुरक्षा द्वारा संरक्षित।', back:'होम पर वापस', resend:'फिर भेजें' },
  bn: { ...EN, eyebrow:'নাগরিক প্রবেশ', title:'নিরাপদ নাগরিক লগইন', name:'আপনার নাম', mobile:'মোবাইল নম্বর', email:'ইমেল ঠিকানা', send:'নিরাপদে এগিয়ে যান', otpTitle:'মোবাইল যাচাই করুন', otpBody:'মোবাইলে পাঠানো ৬ সংখ্যার OTP লিখুন।', verify:'যাচাই করুন', emailSentTitle:'ইমেল দেখুন', emailSentBody:'আমরা একটি নিরাপদ সাইন-ইন লিংক পাঠিয়েছি।', secure:'Supabase Auth দ্বারা সুরক্ষিত।', back:'হোমে ফিরুন', resend:'আবার পাঠান' },
  mr: { ...EN, eyebrow:'नागरिक प्रवेश', title:'सुरक्षित नागरिक लॉगिन', name:'तुमचे नाव', mobile:'मोबाइल क्रमांक', email:'ईमेल पत्ता', send:'सुरक्षितपणे पुढे जा', otpTitle:'मोबाइल सत्यापित करा', otpBody:'मोबाइलवर आलेला 6-अंकी OTP टाका.', verify:'सत्यापित करा', emailSentTitle:'ईमेल तपासा', emailSentBody:'आम्ही सुरक्षित साइन-इन लिंक पाठवली आहे.', secure:'Supabase Auth द्वारे सुरक्षित.', back:'मुख्यपृष्ठावर परत', resend:'पुन्हा पाठवा' },
  ta: { ...EN, eyebrow:'குடிமக்கள் அணுகல்', title:'பாதுகாப்பான குடிமக்கள் உள்நுழைவு', name:'உங்கள் பெயர்', mobile:'மொபைல் எண்', email:'மின்னஞ்சல்', send:'பாதுகாப்பாக தொடரவும்', otpTitle:'மொபைலை சரிபார்க்கவும்', otpBody:'மொபைலுக்கு அனுப்பிய 6 இலக்க OTP-ஐ உள்ளிடவும்.', verify:'சரிபார்க்கவும்', emailSentTitle:'மின்னஞ்சலை பார்க்கவும்', emailSentBody:'பாதுகாப்பான உள்நுழைவு இணைப்பை அனுப்பியுள்ளோம்.', secure:'Supabase Auth மூலம் பாதுகாக்கப்படுகிறது.', back:'முகப்புக்கு திரும்பவும்', resend:'மீண்டும் அனுப்பவும்' },
  te: { ...EN, eyebrow:'పౌర ప్రవేశం', title:'సురక్షిత పౌర లాగిన్', name:'మీ పేరు', mobile:'మొబైల్ నంబర్', email:'ఇమెయిల్', send:'సురక్షితంగా కొనసాగండి', otpTitle:'మొబైల్ ధృవీకరించండి', otpBody:'మొబైల్‌కు వచ్చిన 6 అంకెల OTP నమోదు చేయండి.', verify:'ధృవీకరించండి', emailSentTitle:'ఇమెయిల్ చూడండి', emailSentBody:'సురక్షిత సైన్-ఇన్ లింక్ పంపాం.', secure:'Supabase Auth ద్వారా రక్షితం.', back:'హోమ్‌కు తిరిగి', resend:'మళ్లీ పంపండి' },
  kn: { ...EN, eyebrow:'ನಾಗರಿಕ ಪ್ರವೇಶ', title:'ಸುರಕ್ಷಿತ ನಾಗರಿಕ ಲಾಗಿನ್', name:'ನಿಮ್ಮ ಹೆಸರು', mobile:'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', email:'ಇಮೇಲ್', send:'ಸುರಕ್ಷಿತವಾಗಿ ಮುಂದುವರಿಸಿ', otpTitle:'ಮೊಬೈಲ್ ಪರಿಶೀಲಿಸಿ', otpBody:'ಮೊಬೈಲ್‌ಗೆ ಬಂದ 6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ.', verify:'ಪರಿಶೀಲಿಸಿ', emailSentTitle:'ಇಮೇಲ್ ನೋಡಿ', emailSentBody:'ಸುರಕ್ಷಿತ ಸೈನ್-ಇನ್ ಲಿಂಕ್ ಕಳುಹಿಸಿದ್ದೇವೆ.', secure:'Supabase Auth ಮೂಲಕ ರಕ್ಷಿಸಲಾಗಿದೆ.', back:'ಮುಖಪುಟಕ್ಕೆ', resend:'ಮತ್ತೆ ಕಳುಹಿಸಿ' },
  gu: { ...EN, eyebrow:'નાગરિક પ્રવેશ', title:'સુરક્ષિત નાગરિક લૉગિન', name:'તમારું નામ', mobile:'મોબાઇલ નંબર', email:'ઈમેલ', send:'સુરક્ષિત રીતે આગળ વધો', otpTitle:'મોબાઇલ ચકાસો', otpBody:'મોબાઇલ પર આવેલો 6 અંકનો OTP દાખલ કરો.', verify:'ચકાસો', emailSentTitle:'ઈમેલ જુઓ', emailSentBody:'અમે સુરક્ષિત સાઇન-ઇન લિંક મોકલી છે.', secure:'Supabase Auth દ્વારા સુરક્ષિત.', back:'હોમ પર પાછા', resend:'ફરી મોકલો' },
  pa: { ...EN, eyebrow:'ਨਾਗਰਿਕ ਪਹੁੰਚ', title:'ਸੁਰੱਖਿਅਤ ਨਾਗਰਿਕ ਲਾਗਇਨ', name:'ਤੁਹਾਡਾ ਨਾਮ', mobile:'ਮੋਬਾਈਲ ਨੰਬਰ', email:'ਈਮੇਲ', send:'ਸੁਰੱਖਿਅਤ ਤਰੀਕੇ ਨਾਲ ਅੱਗੇ ਵਧੋ', otpTitle:'ਮੋਬਾਈਲ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', otpBody:'ਮੋਬਾਈਲ ਤੇ ਆਇਆ 6 ਅੰਕਾਂ ਦਾ OTP ਦਾਖਲ ਕਰੋ।', verify:'ਪੁਸ਼ਟੀ ਕਰੋ', emailSentTitle:'ਈਮੇਲ ਵੇਖੋ', emailSentBody:'ਅਸੀਂ ਸੁਰੱਖਿਅਤ ਸਾਈਨ-ਇਨ ਲਿੰਕ ਭੇਜਿਆ ਹੈ।', secure:'Supabase Auth ਦੁਆਰਾ ਸੁਰੱਖਿਅਤ।', back:'ਹੋਮ ਤੇ ਵਾਪਸ', resend:'ਫਿਰ ਭੇਜੋ' },
};

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({ language, onBack, onSuccess }) => {
  const c = COPY[language] || EN;
  const [method, setMethod] = useState<LoginMethod>('email');
  const [displayName, setDisplayName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [normalizedIdentifier, setNormalizedIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'input' | 'otp' | 'email-sent'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    void getCurrentCitizenSession().then((session) => {
      if (session) onSuccess(session);
    });
  }, [onSuccess]);

  const maskedDestination = useMemo(() => {
    if (!normalizedIdentifier) return '';
    if (method === 'mobile') return `${normalizedIdentifier.slice(0, 5)}*****${normalizedIdentifier.slice(-2)}`;
    const [local, domain] = normalizedIdentifier.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  }, [method, normalizedIdentifier]);

  const handleSend = async () => {
    setError('');
    if (displayName.trim().length < 2) {
      setError(language === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const result = await sendCitizenLogin(method, identifier, displayName.trim(), language);
      setNormalizedIdentifier(result.normalizedIdentifier);
      setStage(result.delivery === 'otp' ? 'otp' : 'email-sent');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to start secure login.';
      setError(
        method === 'mobile' && /sms|phone|provider/i.test(message)
          ? `${message} Phone OTP also requires an SMS provider to be enabled in Supabase.`
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError(language === 'hi' ? '6-अंकीय OTP दर्ज करें।' : 'Enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const session = await verifyCitizenPhoneOtp(normalizedIdentifier, otp);
      onSuccess(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F2E8] px-4 py-7 text-[#281C13] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-[#76532C]">
          <ArrowLeft className="h-4 w-4" /> {c.back}
        </button>

        <div className="mt-6 grid overflow-hidden rounded-[30px] border border-[#DFD2C1] bg-[#FFFDF8] shadow-[0_28px_80px_rgba(72,47,25,.12)] lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative hidden min-h-[620px] overflow-hidden bg-gradient-to-br from-[#6F471F] via-[#9C6A30] to-[#C9A777] p-9 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"><Sprout className="h-8 w-8" /></div>
              <h2 className="mt-6 font-serif text-4xl font-bold leading-tight">Nirnay AI<br />Secure Citizen Access</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">Real authentication, persistent accounts and protected rural business data.</p>
            </div>
            <div className="relative z-10 space-y-3 text-sm text-white/85">
              <div className="flex gap-2"><CheckCircle2 className="h-4 w-4" /> Secure identity verification</div>
              <div className="flex gap-2"><CheckCircle2 className="h-4 w-4" /> PostgreSQL-backed user profiles</div>
              <div className="flex gap-2"><CheckCircle2 className="h-4 w-4" /> Row-level data protection</div>
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0E1CA] text-[#9C6A30]"><UserRound className="h-6 w-6" /></div>
              <div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#9A6A31]">{c.eyebrow}</p><h1 className="mt-1 font-serif text-3xl font-bold">{stage === 'input' ? c.title : stage === 'otp' ? c.otpTitle : c.emailSentTitle}</h1></div>
            </div>

            {stage === 'input' && (
              <div className="mt-7">
                <p className="text-sm leading-6 text-[#75675B]">{c.body}</p>
                <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#F1E6D6] p-1">
                  <button onClick={() => { setMethod('email'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold ${method === 'email' ? 'bg-white text-[#6F471F] shadow-sm' : 'text-[#75675B]'}`}><Mail className="h-4 w-4" /> Email</button>
                  <button onClick={() => { setMethod('mobile'); setError(''); }} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold ${method === 'mobile' ? 'bg-white text-[#6F471F] shadow-sm' : 'text-[#75675B]'}`}><Phone className="h-4 w-4" /> Mobile</button>
                </div>

                <label className="mt-5 block text-sm font-bold">{c.name}</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#DCCFBE] bg-white px-4 py-3 outline-none focus:border-[#A97838]" />

                <label className="mt-5 block text-sm font-bold">{method === 'mobile' ? c.mobile : c.email}</label>
                <div className="mt-2 flex overflow-hidden rounded-xl border border-[#DCCFBE] bg-white focus-within:border-[#A97838]">
                  {method === 'mobile' && <span className="border-r border-[#E5D9C9] bg-[#F7EFE4] px-4 py-3 font-bold text-[#6F5338]">+91</span>}
                  <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} inputMode={method === 'mobile' ? 'numeric' : 'email'} className="min-w-0 flex-1 px-4 py-3 outline-none" placeholder={method === 'mobile' ? '9876543210' : 'name@gmail.com'} />
                </div>

                {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <button onClick={handleSend} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A97838] px-5 py-3.5 font-bold text-white transition hover:bg-[#8D5D28] disabled:opacity-60">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}{c.send}
                </button>
              </div>
            )}

            {stage === 'otp' && (
              <div className="mt-8">
                <p className="text-sm leading-6 text-[#75675B]">{c.otpBody}<br /><strong className="text-[#5E4125]">{maskedDestination}</strong></p>
                <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoFocus className="mt-6 w-full rounded-2xl border border-[#DCCFBE] bg-white px-4 py-4 text-center text-3xl font-black tracking-[.45em] outline-none focus:border-[#A97838]" placeholder="••••••" />
                {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <button onClick={handleVerify} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A97838] px-5 py-3.5 font-bold text-white disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />}{c.verify}</button>
                <button onClick={() => { setStage('input'); setOtp(''); setError(''); }} className="mt-3 w-full py-2 text-sm font-bold text-[#80572A]">{c.resend}</button>
              </div>
            )}

            {stage === 'email-sent' && (
              <div className="mt-8 rounded-2xl border border-[#DFD2C1] bg-[#F8F0E5] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8D4B6] text-[#8D5D28]"><Mail className="h-6 w-6" /></div>
                <p className="mt-4 text-sm leading-7 text-[#6E5D4D]">{c.emailSentBody}</p>
                <p className="mt-2 text-sm font-bold text-[#5E4125]">{maskedDestination}</p>
                {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
                <button onClick={() => setStage('input')} className="mt-5 rounded-xl border border-[#CBAA80] bg-white px-4 py-2.5 text-sm font-bold text-[#684720]">{c.resend}</button>
              </div>
            )}

            <div className="mt-7 flex items-start gap-2 border-t border-[#E9DED0] pt-5 text-xs leading-5 text-[#837366]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9C6A30]" />{c.secure}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
