import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, LockKeyhole, Mail, Phone, ShieldCheck, Sprout, UserRound } from 'lucide-react';
import { CitizenSession, LanguageCode } from '../types';

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
  continue: string;
  otpTitle: string;
  otpBody: string;
  verify: string;
  resend: string;
  change: string;
  secure: string;
  demo: string;
  invalidName: string;
  invalidMobile: string;
  invalidEmail: string;
  invalidOtp: string;
  success: string;
  back: string;
};

const COPY: Record<LanguageCode, Copy> = {
  en: { eyebrow:'Citizen Access', title:'Secure Citizen Login', body:'Sign in with your mobile number or email to continue your Nirnay AI journey.', name:'Your name', mobile:'Mobile number', email:'Email address', continue:'Send 4-digit OTP', otpTitle:'Verify your identity', otpBody:'Enter the 4-digit code generated for this demo session.', verify:'Verify & continue', resend:'Resend OTP', change:'Change mobile / email', secure:'Your session is stored only on this device.', demo:'Demo OTP', invalidName:'Please enter your name.', invalidMobile:'Enter a valid 10-digit Indian mobile number.', invalidEmail:'Enter a valid email address.', invalidOtp:'The OTP is incorrect.', success:'Verification successful.', back:'Back to home' },
  hi: { eyebrow:'नागरिक प्रवेश', title:'सुरक्षित नागरिक लॉगिन', body:'निर्णय AI जारी रखने के लिए मोबाइल नंबर या ईमेल से साइन इन करें।', name:'आपका नाम', mobile:'मोबाइल नंबर', email:'ईमेल पता', continue:'4-अंकीय OTP भेजें', otpTitle:'अपनी पहचान सत्यापित करें', otpBody:'इस डेमो सत्र के लिए बनाए गए 4-अंकीय कोड को दर्ज करें।', verify:'सत्यापित करें और आगे बढ़ें', resend:'OTP फिर भेजें', change:'मोबाइल / ईमेल बदलें', secure:'आपका सत्र केवल इसी डिवाइस पर सहेजा जाता है।', demo:'डेमो OTP', invalidName:'कृपया अपना नाम दर्ज करें।', invalidMobile:'मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।', invalidEmail:'मान्य ईमेल पता दर्ज करें।', invalidOtp:'OTP गलत है।', success:'सत्यापन सफल।', back:'होम पर वापस' },
  bn: { eyebrow:'নাগরিক প্রবেশ', title:'নিরাপদ নাগরিক লগইন', body:'Nirnay AI ব্যবহার চালিয়ে যেতে মোবাইল নম্বর বা ইমেল দিয়ে সাইন ইন করুন।', name:'আপনার নাম', mobile:'মোবাইল নম্বর', email:'ইমেল ঠিকানা', continue:'৪ সংখ্যার OTP পাঠান', otpTitle:'পরিচয় যাচাই করুন', otpBody:'এই ডেমো সেশনের ৪ সংখ্যার কোড লিখুন।', verify:'যাচাই করে এগিয়ে যান', resend:'OTP আবার পাঠান', change:'মোবাইল / ইমেল পরিবর্তন করুন', secure:'আপনার সেশন শুধু এই ডিভাইসে সংরক্ষিত হয়।', demo:'ডেমো OTP', invalidName:'নাম লিখুন।', invalidMobile:'সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।', invalidEmail:'সঠিক ইমেল দিন।', invalidOtp:'OTP সঠিক নয়।', success:'যাচাই সফল।', back:'হোমে ফিরুন' },
  mr: { eyebrow:'नागरिक प्रवेश', title:'सुरक्षित नागरिक लॉगिन', body:'Nirnay AI सुरू ठेवण्यासाठी मोबाइल किंवा ईमेलने साइन इन करा.', name:'तुमचे नाव', mobile:'मोबाइल क्रमांक', email:'ईमेल पत्ता', continue:'4-अंकी OTP पाठवा', otpTitle:'ओळख सत्यापित करा', otpBody:'या डेमो सत्रासाठी तयार केलेला 4-अंकी कोड टाका.', verify:'सत्यापित करा', resend:'OTP पुन्हा पाठवा', change:'मोबाइल / ईमेल बदला', secure:'तुमचे सत्र फक्त या डिव्हाइसवर जतन होते.', demo:'डेमो OTP', invalidName:'नाव टाका.', invalidMobile:'वैध 10-अंकी मोबाइल क्रमांक टाका.', invalidEmail:'वैध ईमेल टाका.', invalidOtp:'OTP चुकीचा आहे.', success:'सत्यापन यशस्वी.', back:'मुख्यपृष्ठावर परत' },
  ta: { eyebrow:'குடிமக்கள் அணுகல்', title:'பாதுகாப்பான குடிமக்கள் உள்நுழைவு', body:'Nirnay AI-ஐ தொடர உங்கள் மொபைல் எண் அல்லது மின்னஞ்சல் மூலம் உள்நுழையுங்கள்.', name:'உங்கள் பெயர்', mobile:'மொபைல் எண்', email:'மின்னஞ்சல் முகவரி', continue:'4 இலக்க OTP அனுப்பவும்', otpTitle:'உங்கள் அடையாளத்தை சரிபார்க்கவும்', otpBody:'இந்த டெமோ அமர்வுக்கான 4 இலக்க குறியீட்டை உள்ளிடவும்.', verify:'சரிபார்த்து தொடரவும்', resend:'OTP மீண்டும் அனுப்பவும்', change:'மொபைல் / மின்னஞ்சல் மாற்றவும்', secure:'உங்கள் அமர்வு இந்த சாதனத்தில் மட்டும் சேமிக்கப்படும்.', demo:'டெமோ OTP', invalidName:'உங்கள் பெயரை உள்ளிடவும்.', invalidMobile:'சரியான 10 இலக்க இந்திய மொபைல் எண்ணை உள்ளிடவும்.', invalidEmail:'சரியான மின்னஞ்சலை உள்ளிடவும்.', invalidOtp:'OTP தவறானது.', success:'சரிபார்ப்பு வெற்றி.', back:'முகப்புக்கு திரும்பவும்' },
  te: { eyebrow:'పౌర ప్రవేశం', title:'సురక్షిత పౌర లాగిన్', body:'Nirnay AI కొనసాగించడానికి మొబైల్ లేదా ఇమెయిల్‌తో సైన్ ఇన్ చేయండి.', name:'మీ పేరు', mobile:'మొబైల్ నంబర్', email:'ఇమెయిల్ చిరునామా', continue:'4 అంకెల OTP పంపండి', otpTitle:'మీ గుర్తింపును ధృవీకరించండి', otpBody:'ఈ డెమో సెషన్ కోసం రూపొందించిన 4 అంకెల కోడ్ నమోదు చేయండి.', verify:'ధృవీకరించి కొనసాగండి', resend:'OTP మళ్లీ పంపండి', change:'మొబైల్ / ఇమెయిల్ మార్చండి', secure:'మీ సెషన్ ఈ పరికరంలో మాత్రమే నిల్వ చేయబడుతుంది.', demo:'డెమో OTP', invalidName:'మీ పేరు నమోదు చేయండి.', invalidMobile:'చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.', invalidEmail:'చెల్లుబాటు అయ్యే ఇమెయిల్ నమోదు చేయండి.', invalidOtp:'OTP తప్పు.', success:'ధృవీకరణ విజయవంతం.', back:'హోమ్‌కు తిరిగి' },
  kn: { eyebrow:'ನಾಗರಿಕ ಪ್ರವೇಶ', title:'ಸುರಕ್ಷಿತ ನಾಗರಿಕ ಲಾಗಿನ್', body:'Nirnay AI ಮುಂದುವರಿಸಲು ಮೊಬೈಲ್ ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ಸೈನ್ ಇನ್ ಮಾಡಿ.', name:'ನಿಮ್ಮ ಹೆಸರು', mobile:'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', email:'ಇಮೇಲ್ ವಿಳಾಸ', continue:'4 ಅಂಕಿಯ OTP ಕಳುಹಿಸಿ', otpTitle:'ನಿಮ್ಮ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಿ', otpBody:'ಈ ಡೆಮೊ ಸೆಷನ್‌ಗೆ ರಚಿಸಿದ 4 ಅಂಕಿಯ ಕೋಡ್ ನಮೂದಿಸಿ.', verify:'ಪರಿಶೀಲಿಸಿ ಮುಂದುವರಿಸಿ', resend:'OTP ಮತ್ತೆ ಕಳುಹಿಸಿ', change:'ಮೊಬೈಲ್ / ಇಮೇಲ್ ಬದಲಿಸಿ', secure:'ನಿಮ್ಮ ಸೆಷನ್ ಈ ಸಾಧನದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ.', demo:'ಡೆಮೊ OTP', invalidName:'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ.', invalidMobile:'ಸರಿಯಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.', invalidEmail:'ಸರಿಯಾದ ಇಮೇಲ್ ನಮೂದಿಸಿ.', invalidOtp:'OTP ತಪ್ಪಾಗಿದೆ.', success:'ಪರಿಶೀಲನೆ ಯಶಸ್ವಿ.', back:'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' },
  gu: { eyebrow:'નાગરિક પ્રવેશ', title:'સુરક્ષિત નાગરિક લૉગિન', body:'Nirnay AI ચાલુ રાખવા માટે મોબાઇલ અથવા ઈમેલથી સાઇન ઇન કરો.', name:'તમારું નામ', mobile:'મોબાઇલ નંબર', email:'ઈમેલ સરનામું', continue:'4 અંકનો OTP મોકલો', otpTitle:'તમારી ઓળખ ચકાસો', otpBody:'આ ડેમો સત્ર માટે બનાવેલો 4 અંકનો કોડ દાખલ કરો.', verify:'ચકાસો અને આગળ વધો', resend:'OTP ફરી મોકલો', change:'મોબાઇલ / ઈમેલ બદલો', secure:'તમારું સત્ર ફક્ત આ ઉપકરણ પર જ સંગ્રહાય છે.', demo:'ડેમો OTP', invalidName:'તમારું નામ દાખલ કરો.', invalidMobile:'માન્ય 10 અંકનો મોબાઇલ નંબર દાખલ કરો.', invalidEmail:'માન્ય ઈમેલ દાખલ કરો.', invalidOtp:'OTP ખોટો છે.', success:'ચકાસણી સફળ.', back:'હોમ પર પાછા' },
  pa: { eyebrow:'ਨਾਗਰਿਕ ਪਹੁੰਚ', title:'ਸੁਰੱਖਿਅਤ ਨਾਗਰਿਕ ਲਾਗਇਨ', body:'Nirnay AI ਜਾਰੀ ਰੱਖਣ ਲਈ ਮੋਬਾਈਲ ਜਾਂ ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ।', name:'ਤੁਹਾਡਾ ਨਾਮ', mobile:'ਮੋਬਾਈਲ ਨੰਬਰ', email:'ਈਮੇਲ ਪਤਾ', continue:'4 ਅੰਕਾਂ ਦਾ OTP ਭੇਜੋ', otpTitle:'ਆਪਣੀ ਪਛਾਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', otpBody:'ਇਸ ਡੈਮੋ ਸੈਸ਼ਨ ਲਈ ਬਣਿਆ 4 ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਿਓ।', verify:'ਪੁਸ਼ਟੀ ਕਰਕੇ ਅੱਗੇ ਵਧੋ', resend:'OTP ਮੁੜ ਭੇਜੋ', change:'ਮੋਬਾਈਲ / ਈਮੇਲ ਬਦਲੋ', secure:'ਤੁਹਾਡਾ ਸੈਸ਼ਨ ਸਿਰਫ਼ ਇਸ ਡਿਵਾਈਸ ਤੇ ਸੰਭਾਲਿਆ ਜਾਂਦਾ ਹੈ।', demo:'ਡੈਮੋ OTP', invalidName:'ਆਪਣਾ ਨਾਮ ਦਿਓ।', invalidMobile:'ਸਹੀ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਿਓ।', invalidEmail:'ਸਹੀ ਈਮੇਲ ਦਿਓ।', invalidOtp:'OTP ਗਲਤ ਹੈ।', success:'ਪੁਸ਼ਟੀ ਸਫਲ।', back:'ਹੋਮ ਤੇ ਵਾਪਸ' },
};

export const CitizenLoginPage: React.FC<CitizenLoginPageProps> = ({ language, onBack, onSuccess }) => {
  const c = COPY[language] || COPY.en;
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'identify' | 'otp'>('identify');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const maskedIdentifier = useMemo(() => {
    if (method === 'mobile') {
      const clean = identifier.replace(/\D/g, '');
      return clean.length >= 4 ? `+91 ${clean.slice(0, 2)}******${clean.slice(-2)}` : identifier;
    }
    const [local, domain] = identifier.split('@');
    if (!domain) return identifier;
    return `${(local || '').slice(0, 2)}***@${domain}`;
  }, [identifier, method]);

  const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

  const sendOtp = () => {
    setError('');
    if (!name.trim()) { setError(c.invalidName); return; }
    if (method === 'mobile') {
      const mobile = identifier.replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(mobile)) { setError(c.invalidMobile); return; }
      setIdentifier(mobile);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError(c.invalidEmail); return;
    }
    setGeneratedOtp(generateOtp());
    setOtp(['', '', '', '']);
    setStep('otp');
    setSeconds(30);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const verifyOtp = () => {
    setError('');
    if (otp.join('') !== generatedOtp) { setError(c.invalidOtp); return; }
    onSuccess({ displayName: name.trim(), identifier, method, verifiedAt: new Date().toISOString() });
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F8F2E8] text-[#281C13]" lang={language}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-24 top-28 h-80 w-80 rounded-full bg-[#D8B27A]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-[#8C9A6A]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 sm:px-8">
        <div className="grid w-full overflow-hidden rounded-[30px] border border-[#E1D4C2] bg-[#FFFDF8] shadow-[0_35px_90px_rgba(72,47,25,.14)] lg:grid-cols-[1.05fr_.95fr]">
          <section className="relative hidden min-h-[680px] overflow-hidden bg-[#5A3A1E] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-45"><source src="/rural-hero.mp4" type="video/mp4" /></video>
            <div className="absolute inset-0 bg-gradient-to-br from-[#3E2817]/90 via-[#5A3A1E]/65 to-[#8B5E2C]/55" />
            <div className="relative z-10">
              <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 backdrop-blur"><Sprout className="h-7 w-7 text-[#F0DFC3]" /></div><div><h1 className="font-serif text-2xl font-bold">Nirnay AI</h1><p className="text-xs text-white/70">Sahi Soch. Behtar Kal.</p></div></div>
              <div className="mt-16 max-w-lg"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#E8C998]">{c.eyebrow}</p><h2 className="mt-4 font-serif text-5xl font-bold leading-[1.05]">Your business journey, verified and personal.</h2><p className="mt-5 text-base leading-7 text-white/78">Secure access keeps your saved assessments, reports and action plans tied to your own device.</p></div>
            </div>
            <div className="relative z-10 grid gap-3 text-sm text-white/82"><div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#E8C998]" />Verified 4-digit OTP flow</div><div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-[#E8C998]" />Mobile or email sign-in</div><div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-[#E8C998]" />Local-session privacy for the demo build</div></div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#7A542A] transition hover:text-[#4E331C]"><ArrowLeft className="h-4 w-4" />{c.back}</button>

            <div className="mx-auto mt-10 max-w-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1E3CF] text-[#A97838]"><UserRound className="h-7 w-7" /></div>
              <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A6A31]">{c.eyebrow}</p>
              <h2 className="mt-2 font-serif text-4xl font-bold tracking-tight">{step === 'identify' ? c.title : c.otpTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-[#786B5F]">{step === 'identify' ? c.body : `${c.otpBody} ${maskedIdentifier}`}</p>

              {step === 'identify' ? (
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F2E7D7] p-1.5">
                    <button onClick={() => { setMethod('mobile'); setIdentifier(''); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${method === 'mobile' ? 'bg-[#FFFDF8] text-[#6D471F] shadow-sm' : 'text-[#7B6A5A]'}`}><Phone className="h-4 w-4" />{c.mobile}</button>
                    <button onClick={() => { setMethod('email'); setIdentifier(''); setError(''); }} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${method === 'email' ? 'bg-[#FFFDF8] text-[#6D471F] shadow-sm' : 'text-[#7B6A5A]'}`}><Mail className="h-4 w-4" />{c.email}</button>
                  </div>

                  <label className="mt-6 block text-sm font-bold">{c.name}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#DCCDBA] bg-white px-4 py-3.5 outline-none transition focus:border-[#A97838] focus:ring-4 focus:ring-[#A97838]/10" placeholder={c.name} />

                  <label className="mt-5 block text-sm font-bold">{method === 'mobile' ? c.mobile : c.email}</label>
                  <div className="relative mt-2">
                    {method === 'mobile' ? <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B7A56]" /> : <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B7A56]" />}
                    <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} inputMode={method === 'mobile' ? 'numeric' : 'email'} className="w-full rounded-xl border border-[#DCCDBA] bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-[#A97838] focus:ring-4 focus:ring-[#A97838]/10" placeholder={method === 'mobile' ? '9876543210' : 'name@example.com'} />
                  </div>

                  {error && <p className="mt-3 text-sm font-semibold text-[#A54837]">{error}</p>}

                  <button onClick={sendOtp} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A97838] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(169,120,56,.2)] transition hover:-translate-y-0.5 hover:bg-[#8D5D28]"><LockKeyhole className="h-4 w-4" />{c.continue}</button>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="rounded-2xl border border-[#E0CFB7] bg-[#F7EDDE] p-4 text-center"><p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#9A6A31]">{c.demo}</p><p className="mt-1 font-mono text-3xl font-black tracking-[0.35em] text-[#4B321D]">{generatedOtp}</p></div>
                  <div className="mt-6 flex justify-center gap-3">{otp.map((digit, index) => <input key={index} ref={(node) => { otpRefs.current[index] = node; }} value={digit} onChange={(e) => updateOtp(index, e.target.value)} onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1]?.focus(); }} inputMode="numeric" maxLength={1} className="h-16 w-14 rounded-2xl border border-[#D9C7AE] bg-white text-center text-2xl font-black outline-none transition focus:border-[#A97838] focus:ring-4 focus:ring-[#A97838]/10" />)}</div>
                  {error && <p className="mt-4 text-center text-sm font-semibold text-[#A54837]">{error}</p>}
                  <button onClick={verifyOtp} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A97838] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#8D5D28]"><CheckCircle2 className="h-4 w-4" />{c.verify}</button>
                  <div className="mt-4 flex items-center justify-center gap-3 text-sm"><button disabled={seconds > 0} onClick={sendOtp} className="font-bold text-[#8A5B27] disabled:cursor-not-allowed disabled:text-[#AFA092]">{seconds > 0 ? `${c.resend} (${seconds}s)` : c.resend}</button><span className="text-[#C5B6A4]">•</span><button onClick={() => { setStep('identify'); setError(''); setOtp(['','','','']); }} className="font-bold text-[#7B6A5A]">{c.change}</button></div>
                </div>
              )}

              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E6D8C6] bg-[#FBF6ED] p-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#72854F]" /><p className="text-xs leading-5 text-[#75675B]">{c.secure}</p></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
