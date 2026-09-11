import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Landmark,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Sprout,
  UserRoundCog,
  Users,
} from 'lucide-react';
import { LanguageCode, PageId } from '../types';

interface AdminPortalPageProps {
  language: LanguageCode;
  onBack: () => void;
  onNavigate: (page: PageId) => void;
  projectCost: number;
  feasibilityScore: number;
  citizenCount: number;
}

type AdminCopy = {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  passcode: string;
  signIn: string;
  invalid: string;
  security: string;
  back: string;
  portalTitle: string;
  portalSub: string;
  logout: string;
  users: string;
  projectCost: string;
  score: string;
  system: string;
  active: string;
  quick: string;
  openDashboard: string;
  openReport: string;
  openSchemes: string;
  audit: string;
  audit1: string;
  audit2: string;
  audit3: string;
};

const COPY: Record<LanguageCode, AdminCopy> = {
  en: { eyebrow:'Restricted Access', title:'Nirnay AI Admin Portal', body:'This area is reserved for the single authorised administrator.', email:'Administrator email', passcode:'Admin passcode', signIn:'Unlock Admin Portal', invalid:'Access denied. The administrator identity or passcode is incorrect.', security:'Only one exact administrator identity is accepted by this demo gate.', back:'Back to home', portalTitle:'Administration Console', portalSub:'System overview, citizen activity and project controls.', logout:'Logout', users:'Verified citizens', projectCost:'Current project cost', score:'Feasibility score', system:'System status', active:'Operational', quick:'Quick controls', openDashboard:'Open dashboard', openReport:'Open report', openSchemes:'Open schemes', audit:'Recent admin activity', audit1:'System configuration loaded successfully', audit2:'Citizen portal verification flow active', audit3:'Business advisory modules available' },
  hi: { eyebrow:'प्रतिबंधित प्रवेश', title:'निर्णय AI एडमिन पोर्टल', body:'यह क्षेत्र केवल एक अधिकृत प्रशासक के लिए आरक्षित है।', email:'प्रशासक ईमेल', passcode:'एडमिन पासकोड', signIn:'एडमिन पोर्टल खोलें', invalid:'प्रवेश अस्वीकृत। पहचान या पासकोड गलत है।', security:'इस डेमो गेट में केवल एक निश्चित एडमिन पहचान स्वीकार की जाती है।', back:'होम पर वापस', portalTitle:'प्रशासन कंसोल', portalSub:'सिस्टम, नागरिक गतिविधि और परियोजना नियंत्रण।', logout:'लॉगआउट', users:'सत्यापित नागरिक', projectCost:'वर्तमान परियोजना लागत', score:'व्यवहार्यता स्कोर', system:'सिस्टम स्थिति', active:'सक्रिय', quick:'त्वरित नियंत्रण', openDashboard:'डैशबोर्ड खोलें', openReport:'रिपोर्ट खोलें', openSchemes:'योजनाएँ खोलें', audit:'हाल की एडमिन गतिविधि', audit1:'सिस्टम कॉन्फ़िगरेशन सफलतापूर्वक लोड हुआ', audit2:'नागरिक सत्यापन प्रवाह सक्रिय है', audit3:'व्यवसाय सलाह मॉड्यूल उपलब्ध हैं' },
  bn: { eyebrow:'সীমিত প্রবেশ', title:'Nirnay AI অ্যাডমিন পোর্টাল', body:'এই অংশটি একমাত্র অনুমোদিত প্রশাসকের জন্য।', email:'অ্যাডমিন ইমেল', passcode:'অ্যাডমিন পাসকোড', signIn:'অ্যাডমিন পোর্টাল খুলুন', invalid:'প্রবেশ অনুমোদিত নয়। পরিচয় বা পাসকোড ভুল।', security:'এই ডেমো গেটে শুধুমাত্র একটি নির্দিষ্ট অ্যাডমিন পরিচয় গ্রহণ করা হয়।', back:'হোমে ফিরুন', portalTitle:'অ্যাডমিন কনসোল', portalSub:'সিস্টেম, নাগরিক কার্যকলাপ এবং প্রকল্প নিয়ন্ত্রণ।', logout:'লগআউট', users:'যাচাইকৃত নাগরিক', projectCost:'বর্তমান প্রকল্প ব্যয়', score:'সম্ভাব্যতা স্কোর', system:'সিস্টেম অবস্থা', active:'সক্রিয়', quick:'দ্রুত নিয়ন্ত্রণ', openDashboard:'ড্যাশবোর্ড খুলুন', openReport:'রিপোর্ট খুলুন', openSchemes:'স্কিম খুলুন', audit:'সাম্প্রতিক অ্যাডমিন কার্যকলাপ', audit1:'সিস্টেম কনফিগারেশন সফলভাবে লোড হয়েছে', audit2:'নাগরিক যাচাইকরণ সক্রিয়', audit3:'ব্যবসা পরামর্শ মডিউল উপলব্ধ' },
  mr: { eyebrow:'मर्यादित प्रवेश', title:'Nirnay AI अॅडमिन पोर्टल', body:'हा विभाग फक्त एका अधिकृत प्रशासकासाठी आहे.', email:'प्रशासक ईमेल', passcode:'अॅडमिन पासकोड', signIn:'अॅडमिन पोर्टल उघडा', invalid:'प्रवेश नाकारला. ओळख किंवा पासकोड चुकीचा आहे.', security:'या डेमो गेटमध्ये फक्त एक निश्चित अॅडमिन ओळख स्वीकारली जाते.', back:'मुख्यपृष्ठावर परत', portalTitle:'प्रशासन कन्सोल', portalSub:'सिस्टम, नागरिक क्रिया आणि प्रकल्प नियंत्रण.', logout:'लॉगआउट', users:'सत्यापित नागरिक', projectCost:'सध्याचा प्रकल्प खर्च', score:'व्यवहार्यता गुण', system:'सिस्टम स्थिती', active:'सक्रिय', quick:'जलद नियंत्रण', openDashboard:'डॅशबोर्ड उघडा', openReport:'रिपोर्ट उघडा', openSchemes:'योजना उघडा', audit:'अलीकडील अॅडमिन क्रिया', audit1:'सिस्टम कॉन्फिगरेशन यशस्वीरीत्या लोड', audit2:'नागरिक पडताळणी सक्रिय', audit3:'व्यवसाय सल्ला मॉड्यूल उपलब्ध' },
  ta: { eyebrow:'கட்டுப்படுத்தப்பட்ட அணுகல்', title:'Nirnay AI நிர்வாக போர்டல்', body:'இந்த பகுதி ஒரே அங்கீகரிக்கப்பட்ட நிர்வாகிக்காக மட்டுமே.', email:'நிர்வாகி மின்னஞ்சல்', passcode:'நிர்வாகி கடவுக்குறி', signIn:'நிர்வாக போர்டலை திறக்கவும்', invalid:'அணுகல் மறுக்கப்பட்டது. அடையாளம் அல்லது கடவுக்குறி தவறானது.', security:'இந்த டெமோ வாயில் ஒரு குறிப்பிட்ட நிர்வாகி அடையாளத்தை மட்டுமே ஏற்கிறது.', back:'முகப்புக்கு திரும்பவும்', portalTitle:'நிர்வாக கட்டுப்பாட்டு மையம்', portalSub:'அமைப்பு, குடிமக்கள் செயற்பாடு மற்றும் திட்ட கட்டுப்பாடு.', logout:'வெளியேறு', users:'சரிபார்க்கப்பட்ட குடிமக்கள்', projectCost:'தற்போதைய திட்ட செலவு', score:'சாத்தியக்கூறு மதிப்பெண்', system:'அமைப்பு நிலை', active:'செயலில்', quick:'விரைவு கட்டுப்பாடுகள்', openDashboard:'டாஷ்போர்டு திறக்கவும்', openReport:'அறிக்கை திறக்கவும்', openSchemes:'திட்டங்கள் திறக்கவும்', audit:'சமீபத்திய நிர்வாக செயற்பாடு', audit1:'அமைப்பு கட்டமைப்பு வெற்றிகரமாக ஏற்றப்பட்டது', audit2:'குடிமக்கள் சரிபார்ப்பு செயலில் உள்ளது', audit3:'வணிக ஆலோசனை தொகுதிகள் தயாராக உள்ளன' },
  te: { eyebrow:'పరిమిత ప్రవేశం', title:'Nirnay AI అడ్మిన్ పోర్టల్', body:'ఈ విభాగం ఒక్క అధీకృత నిర్వాహకుడికే.', email:'అడ్మిన్ ఇమెయిల్', passcode:'అడ్మిన్ పాస్‌కోడ్', signIn:'అడ్మిన్ పోర్టల్ తెరవండి', invalid:'ప్రవేశం నిరాకరించబడింది. గుర్తింపు లేదా పాస్‌కోడ్ తప్పు.', security:'ఈ డెమో గేట్ ఒకే నిర్వాహక గుర్తింపును మాత్రమే అనుమతిస్తుంది.', back:'హోమ్‌కు తిరిగి', portalTitle:'అడ్మిన్ కన్సోల్', portalSub:'సిస్టమ్, పౌర కార్యకలాపాలు మరియు ప్రాజెక్ట్ నియంత్రణ.', logout:'లాగౌట్', users:'ధృవీకరించిన పౌరులు', projectCost:'ప్రస్తుత ప్రాజెక్ట్ వ్యయం', score:'సాధ్యత స్కోర్', system:'సిస్టమ్ స్థితి', active:'సక్రియం', quick:'త్వరిత నియంత్రణలు', openDashboard:'డాష్‌బోర్డ్ తెరవండి', openReport:'రిపోర్ట్ తెరవండి', openSchemes:'పథకాలు తెరవండి', audit:'ఇటీవలి అడ్మిన్ కార్యకలాపాలు', audit1:'సిస్టమ్ కాన్ఫిగరేషన్ విజయవంతంగా లోడ్ అయింది', audit2:'పౌర ధృవీకరణ ప్రవాహం సక్రియం', audit3:'వ్యాపార సలహా మాడ్యూల్స్ అందుబాటులో ఉన్నాయి' },
  kn: { eyebrow:'ನಿಯಂತ್ರಿತ ಪ್ರವೇಶ', title:'Nirnay AI ಆಡ್ಮಿನ್ ಪೋರ್ಟಲ್', body:'ಈ ವಿಭಾಗವು ಒಬ್ಬ ಅಧಿಕೃತ ನಿರ್ವಾಹಕರಿಗೆ ಮಾತ್ರ.', email:'ಆಡ್ಮಿನ್ ಇಮೇಲ್', passcode:'ಆಡ್ಮಿನ್ ಪಾಸ್‌ಕೋಡ್', signIn:'ಆಡ್ಮಿನ್ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ', invalid:'ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಗುರುತು ಅಥವಾ ಪಾಸ್‌ಕೋಡ್ ತಪ್ಪಾಗಿದೆ.', security:'ಈ ಡೆಮೊ ಗೇಟ್ ಒಂದು ನಿರ್ದಿಷ್ಟ ಆಡ್ಮಿನ್ ಗುರುತನ್ನು ಮಾತ್ರ ಅನುಮತಿಸುತ್ತದೆ.', back:'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ', portalTitle:'ಆಡಳಿತ ಕನ್ಸೋಲ್', portalSub:'ಸಿಸ್ಟಮ್, ನಾಗರಿಕ ಚಟುವಟಿಕೆ ಮತ್ತು ಯೋಜನಾ ನಿಯಂತ್ರಣ.', logout:'ಲಾಗ್ ಔಟ್', users:'ಪರಿಶೀಲಿತ ನಾಗರಿಕರು', projectCost:'ಪ್ರಸ್ತುತ ಯೋಜನಾ ವೆಚ್ಚ', score:'ಸಾಧ್ಯತೆ ಅಂಕ', system:'ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ', active:'ಸಕ್ರಿಯ', quick:'ತ್ವರಿತ ನಿಯಂತ್ರಣಗಳು', openDashboard:'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ', openReport:'ವರದಿ ತೆರೆಯಿರಿ', openSchemes:'ಯೋಜನೆಗಳನ್ನು ತೆರೆಯಿರಿ', audit:'ಇತ್ತೀಚಿನ ಆಡ್ಮಿನ್ ಚಟುವಟಿಕೆ', audit1:'ಸಿಸ್ಟಮ್ ಕಾನ್ಫಿಗರೇಶನ್ ಯಶಸ್ವಿಯಾಗಿ ಲೋಡ್ ಆಯಿತು', audit2:'ನಾಗರಿಕ ಪರಿಶೀಲನೆ ಸಕ್ರಿಯವಾಗಿದೆ', audit3:'ವ್ಯಾಪಾರ ಸಲಹೆ ಘಟಕಗಳು ಲಭ್ಯವಿವೆ' },
  gu: { eyebrow:'મર્યાદિત પ્રવેશ', title:'Nirnay AI એડમિન પોર્ટલ', body:'આ વિભાગ માત્ર એક અધિકૃત એડમિન માટે છે.', email:'એડમિન ઈમેલ', passcode:'એડમિન પાસકોડ', signIn:'એડમિન પોર્ટલ ખોલો', invalid:'પ્રવેશ નકારાયો. ઓળખ અથવા પાસકોડ ખોટો છે.', security:'આ ડેમો ગેટ ફક્ત એક નિશ્ચિત એડમિન ઓળખ સ્વીકારે છે.', back:'હોમ પર પાછા', portalTitle:'એડમિન કન્સોલ', portalSub:'સિસ્ટમ, નાગરિક પ્રવૃત્તિ અને પ્રોજેક્ટ નિયંત્રણ.', logout:'લૉગઆઉટ', users:'ચકાસાયેલ નાગરિકો', projectCost:'વર્તમાન પ્રોજેક્ટ ખર્ચ', score:'વ્યવહાર્યતા સ્કોર', system:'સિસ્ટમ સ્થિતિ', active:'સક્રિય', quick:'ઝડપી નિયંત્રણ', openDashboard:'ડેશબોર્ડ ખોલો', openReport:'રિપોર્ટ ખોલો', openSchemes:'યોજનાઓ ખોલો', audit:'તાજેતરની એડમિન પ્રવૃત્તિ', audit1:'સિસ્ટમ કન્ફિગરેશન સફળતાપૂર્વક લોડ થયું', audit2:'નાગરિક ચકાસણી પ્રવાહ સક્રિય છે', audit3:'વ્યવસાય સલાહ મોડ્યુલો ઉપલબ્ધ છે' },
  pa: { eyebrow:'ਸੀਮਿਤ ਪਹੁੰਚ', title:'Nirnay AI ਐਡਮਿਨ ਪੋਰਟਲ', body:'ਇਹ ਹਿੱਸਾ ਸਿਰਫ਼ ਇੱਕ ਅਧਿਕਾਰਤ ਐਡਮਿਨ ਲਈ ਹੈ।', email:'ਐਡਮਿਨ ਈਮੇਲ', passcode:'ਐਡਮਿਨ ਪਾਸਕੋਡ', signIn:'ਐਡਮਿਨ ਪੋਰਟਲ ਖੋਲ੍ਹੋ', invalid:'ਪਹੁੰਚ ਰੱਦ। ਪਛਾਣ ਜਾਂ ਪਾਸਕੋਡ ਗਲਤ ਹੈ।', security:'ਇਹ ਡੈਮੋ ਗੇਟ ਸਿਰਫ਼ ਇੱਕ ਨਿਸ਼ਚਿਤ ਐਡਮਿਨ ਪਛਾਣ ਨੂੰ ਮਨਜ਼ੂਰ ਕਰਦਾ ਹੈ।', back:'ਹੋਮ ਤੇ ਵਾਪਸ', portalTitle:'ਐਡਮਿਨ ਕਨਸੋਲ', portalSub:'ਸਿਸਟਮ, ਨਾਗਰਿਕ ਗਤੀਵਿਧੀ ਅਤੇ ਪ੍ਰੋਜੈਕਟ ਕੰਟਰੋਲ।', logout:'ਲਾਗਆਉਟ', users:'ਪੁਸ਼ਟੀ ਕੀਤੇ ਨਾਗਰਿਕ', projectCost:'ਮੌਜੂਦਾ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ', score:'ਸੰਭਾਵਨਾ ਸਕੋਰ', system:'ਸਿਸਟਮ ਸਥਿਤੀ', active:'ਸਕ੍ਰਿਯ', quick:'ਤੁਰੰਤ ਕੰਟਰੋਲ', openDashboard:'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ', openReport:'ਰਿਪੋਰਟ ਖੋਲ੍ਹੋ', openSchemes:'ਯੋਜਨਾਵਾਂ ਖੋਲ੍ਹੋ', audit:'ਹਾਲੀਆ ਐਡਮਿਨ ਗਤੀਵਿਧੀ', audit1:'ਸਿਸਟਮ ਸੰਰਚਨਾ ਸਫਲਤਾਪੂਰਵਕ ਲੋਡ ਹੋਈ', audit2:'ਨਾਗਰਿਕ ਪੁਸ਼ਟੀ ਪ੍ਰਵਾਹ ਸਕ੍ਰਿਯ ਹੈ', audit3:'ਕਾਰੋਬਾਰੀ ਸਲਾਹ ਮੋਡੀਊਲ ਉਪਲਬਧ ਹਨ' },
};

const ADMIN_EMAIL = String(import.meta.env.VITE_NIRNAY_ADMIN_EMAIL || 'admin@nirnay.ai').trim().toLowerCase();
const ADMIN_PASSCODE = String(import.meta.env.VITE_NIRNAY_ADMIN_PASSCODE || '26091');
const SESSION_KEY = 'nirnay-admin-session';

const formatINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ language, onBack, onNavigate, projectCost, feasibilityScore, citizenCount }) => {
  const c = COPY[language] || COPY.en;
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'verified');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const systemCards = useMemo(() => [
    { icon: <Users className="h-5 w-5" />, label: c.users, value: String(citizenCount), tone: 'text-[#8B5E2C]' },
    { icon: <BarChart3 className="h-5 w-5" />, label: c.projectCost, value: formatINR(projectCost), tone: 'text-[#8B5E2C]' },
    { icon: <ClipboardCheck className="h-5 w-5" />, label: c.score, value: `${feasibilityScore}/100`, tone: 'text-[#6A7E4A]' },
    { icon: <ShieldCheck className="h-5 w-5" />, label: c.system, value: c.active, tone: 'text-[#6A7E4A]' },
  ], [c, citizenCount, feasibilityScore, projectCost]);

  const login = () => {
    setError('');
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || passcode !== ADMIN_PASSCODE) {
      setError(c.invalid);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, 'verified');
    setAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setEmail('');
    setPasscode('');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#21160F] text-[#281C13]" lang={language}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(169,120,56,.24),transparent_30%),linear-gradient(135deg,#1E140E,#3A2517_55%,#24170F)]" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-5 py-10 sm:px-8">
          <div className="grid w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#FFFDF8] shadow-[0_40px_110px_rgba(0,0,0,.38)] lg:grid-cols-[.82fr_1.18fr]">
            <section className="bg-[#2F1F15] p-8 text-white sm:p-10 lg:p-12">
              <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-[#E5C697] transition hover:text-white"><ArrowLeft className="h-4 w-4" />{c.back}</button>
              <div className="mt-14 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A97838]/18 text-[#E4C18B]"><UserRoundCog className="h-7 w-7" /></div>
              <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-[#D8B27A]">{c.eyebrow}</p>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight">{c.title}</h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/68">{c.body}</p>
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D8B27A]" /><p className="text-xs leading-6 text-white/68">{c.security}</p></div></div>
            </section>

            <section className="p-7 sm:p-10 lg:p-14">
              <div className="mx-auto max-w-md">
                <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0E1CA] text-[#9A682F]"><Sprout className="h-7 w-7" /></div><div><h2 className="font-serif text-2xl font-bold">Nirnay AI</h2><p className="text-xs text-[#807165]">Single Administrator Console</p></div></div>

                <div className="mt-10">
                  <label className="block text-sm font-bold">{c.email}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[#DCCDBA] bg-white px-4 py-3.5 outline-none transition focus:border-[#A97838] focus:ring-4 focus:ring-[#A97838]/10" placeholder="admin@nirnay.ai" />

                  <label className="mt-5 block text-sm font-bold">{c.passcode}</label>
                  <div className="relative mt-2"><LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9B7A56]" /><input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') login(); }} className="w-full rounded-xl border border-[#DCCDBA] bg-white py-3.5 pl-11 pr-4 outline-none transition focus:border-[#A97838] focus:ring-4 focus:ring-[#A97838]/10" placeholder="•••••" /></div>

                  {error && <p className="mt-3 text-sm font-semibold text-[#A54837]">{error}</p>}

                  <button onClick={login} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6F471F] px-5 py-4 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(60,38,20,.22)] transition hover:-translate-y-0.5 hover:bg-[#543417]"><LockKeyhole className="h-4 w-4" />{c.signIn}</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F2E8] text-[#281C13]" lang={language}>
      <header className="border-b border-[#E4D8C8] bg-[#FFFDF8]/95 px-5 py-4 shadow-[0_7px_28px_rgba(73,48,28,.05)] backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F1F15] text-[#E4C18B]"><UserRoundCog className="h-6 w-6" /></div><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A6A31]">Nirnay AI</p><h1 className="font-serif text-xl font-bold">{c.portalTitle}</h1></div></div>
          <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-[#D7C6AE] bg-white px-4 py-2.5 text-sm font-bold text-[#684725] transition hover:bg-[#F3E7D7]"><LogOut className="h-4 w-4" />{c.logout}</button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A6A31]">{c.eyebrow}</p><h2 className="mt-2 font-serif text-4xl font-bold">{c.portalTitle}</h2><p className="mt-2 text-sm text-[#786A5D]">{c.portalSub}</p></div><div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C8D0B5] bg-[#EFF3E7] px-4 py-2 text-xs font-extrabold text-[#66794A]"><span className="h-2 w-2 rounded-full bg-[#6A7E4A]" />{c.active}</div></div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{systemCards.map((card) => <div key={card.label} className="rounded-2xl border border-[#E0D4C4] bg-[#FFFDF8] p-5 shadow-[0_5px_18px_rgba(70,45,25,.04)]"><div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1E3CF] ${card.tone}`}>{card.icon}</div><p className="mt-4 text-xs text-[#7E7064]">{card.label}</p><strong className={`mt-1 block text-2xl font-extrabold ${card.tone}`}>{card.value}</strong></div>)}</div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <section className="rounded-3xl border border-[#E0D4C4] bg-[#FFFDF8] p-6 shadow-[0_8px_28px_rgba(70,45,25,.05)]"><h3 className="font-serif text-2xl font-bold">{c.quick}</h3><div className="mt-5 grid gap-3 sm:grid-cols-3"><AdminAction icon={<BarChart3 className="h-5 w-5" />} label={c.openDashboard} onClick={() => onNavigate('dashboard')} /><AdminAction icon={<FileText className="h-5 w-5" />} label={c.openReport} onClick={() => onNavigate('report')} /><AdminAction icon={<Landmark className="h-5 w-5" />} label={c.openSchemes} onClick={() => onNavigate('schemes')} /></div></section>

          <section className="rounded-3xl border border-[#E0D4C4] bg-[#FFFDF8] p-6 shadow-[0_8px_28px_rgba(70,45,25,.05)]"><h3 className="font-serif text-2xl font-bold">{c.audit}</h3><div className="mt-5 space-y-3"><AuditItem text={c.audit1} /><AuditItem text={c.audit2} /><AuditItem text={c.audit3} /></div></section>
        </div>
      </main>
    </div>
  );
};

const AdminAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => <button onClick={onClick} className="group rounded-2xl border border-[#E3D7C7] bg-[#FBF6ED] p-4 text-left transition hover:-translate-y-1 hover:border-[#CDAA78] hover:bg-[#FFFDF8] hover:shadow-md"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E1CA] text-[#9A682F]">{icon}</div><p className="mt-3 text-sm font-bold">{label}</p></button>;
const AuditItem: React.FC<{ text: string }> = ({ text }) => <div className="flex items-start gap-3 rounded-xl border border-[#E8DED1] bg-[#FBF7F0] p-3.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6A7E4A]" /><span className="text-sm leading-6 text-[#6C5D51]">{text}</span></div>;
