import React, { useEffect, useState } from 'react';
import {
  CloudRain,
  CloudSun,
  Database,
  Droplets,
  ExternalLink,
  Landmark,
  RefreshCw,
  Thermometer,
  Wheat,
  Wind,
} from 'lucide-react';
import type { LanguageCode } from '../types';
import {
  fetchLiveIntelligence,
  type LiveIntelligencePayload,
} from '../services/liveIntelligenceService';

interface LiveIntelligencePanelProps {
  district: string;
  state: string;
  category: string;
  latitude?: number;
  longitude?: number;
  language: LanguageCode;
}

type Copy = {
  title: string;
  subtitle: string;
  liveWeather: string;
  officialMandi: string;
  schemes: string;
  map: string;
  live: string;
  daily: string;
  verify: string;
  calculated: string;
  temperature: string;
  humidity: string;
  wind: string;
  rain: string;
  forecast: string;
  market: string;
  commodity: string;
  modal: string;
  noMandi: string;
  mandiNotConfigured: string;
  officialPortal: string;
  refresh: string;
  updated: string;
  loading: string;
  error: string;
  source: string;
  districtCoverage: string;
  stateCoverage: string;
  weatherClear: string;
  weatherCloudy: string;
  weatherRain: string;
  weatherStorm: string;
  weatherOther: string;
};

const COPY: Record<LanguageCode, Copy> = {
  en: {
    title: 'Live Data Intelligence', subtitle: 'Fresh external signals are separated from AI estimates and calculated values.', liveWeather: 'Live Weather', officialMandi: 'Official Mandi Prices', schemes: 'Government Schemes', map: 'Market Map', live: 'LIVE', daily: 'DAILY OFFICIAL', verify: 'OFFICIAL VERIFY', calculated: 'CALCULATED', temperature: 'Temperature', humidity: 'Humidity', wind: 'Wind', rain: 'Rain', forecast: '3-day forecast', market: 'Market', commodity: 'Commodity', modal: 'Modal price', noMandi: 'No recent local mandi records were returned. Verify the nearest mandi directly.', mandiNotConfigured: 'The official mandi connector is ready, but the server administrator must add a free data.gov.in API key.', officialPortal: 'Open official myScheme portal', refresh: 'Refresh live feeds', updated: 'Updated', loading: 'Loading live data...', error: 'Live data could not be loaded right now.', source: 'Source', districtCoverage: 'District coverage', stateCoverage: 'State-level fallback', weatherClear: 'Clear', weatherCloudy: 'Cloudy', weatherRain: 'Rain', weatherStorm: 'Storm', weatherOther: 'Variable',
  },
  hi: {
    title: 'लाइव डेटा इंटेलिजेंस', subtitle: 'लाइव बाहरी डेटा को AI अनुमान और गणना किए गए मानों से अलग दिखाया जाता है।', liveWeather: 'लाइव मौसम', officialMandi: 'आधिकारिक मंडी भाव', schemes: 'सरकारी योजनाएँ', map: 'मार्केट मैप', live: 'लाइव', daily: 'दैनिक आधिकारिक', verify: 'आधिकारिक सत्यापन', calculated: 'गणना आधारित', temperature: 'तापमान', humidity: 'नमी', wind: 'हवा', rain: 'बारिश', forecast: '3-दिन का पूर्वानुमान', market: 'मंडी', commodity: 'वस्तु', modal: 'मोडल भाव', noMandi: 'हाल के स्थानीय मंडी रिकॉर्ड नहीं मिले। नजदीकी मंडी से सीधे सत्यापित करें।', mandiNotConfigured: 'आधिकारिक मंडी कनेक्टर तैयार है, लेकिन सर्वर एडमिन को data.gov.in की मुफ्त API key जोड़नी होगी।', officialPortal: 'आधिकारिक myScheme पोर्टल खोलें', refresh: 'लाइव डेटा रीफ्रेश करें', updated: 'अपडेट', loading: 'लाइव डेटा लोड हो रहा है...', error: 'अभी लाइव डेटा लोड नहीं हो पाया।', source: 'स्रोत', districtCoverage: 'जिला कवरेज', stateCoverage: 'राज्य-स्तरीय बैकअप', weatherClear: 'साफ', weatherCloudy: 'बादल', weatherRain: 'बारिश', weatherStorm: 'तूफान', weatherOther: 'परिवर्तनशील',
  },
  bn: {
    title: 'লাইভ ডেটা ইন্টেলিজেন্স', subtitle: 'লাইভ বাহ্যিক ডেটা AI অনুমান ও হিসাব করা মান থেকে আলাদা দেখানো হয়।', liveWeather: 'লাইভ আবহাওয়া', officialMandi: 'সরকারি মান্ডি মূল্য', schemes: 'সরকারি স্কিম', map: 'মার্কেট ম্যাপ', live: 'লাইভ', daily: 'দৈনিক সরকারি', verify: 'সরকারি যাচাই', calculated: 'হিসাবকৃত', temperature: 'তাপমাত্রা', humidity: 'আর্দ্রতা', wind: 'বাতাস', rain: 'বৃষ্টি', forecast: '৩ দিনের পূর্বাভাস', market: 'বাজার', commodity: 'পণ্য', modal: 'মোডাল মূল্য', noMandi: 'সাম্প্রতিক স্থানীয় মান্ডি রেকর্ড পাওয়া যায়নি। নিকটবর্তী বাজারে যাচাই করুন।', mandiNotConfigured: 'সরকারি মান্ডি কানেক্টর প্রস্তুত, তবে সার্ভার অ্যাডমিনকে data.gov.in API key যোগ করতে হবে।', officialPortal: 'সরকারি myScheme পোর্টাল খুলুন', refresh: 'লাইভ ডেটা রিফ্রেশ', updated: 'আপডেট', loading: 'লাইভ ডেটা লোড হচ্ছে...', error: 'এখন লাইভ ডেটা লোড করা যায়নি।', source: 'উৎস', districtCoverage: 'জেলা কভারেজ', stateCoverage: 'রাজ্য-স্তরের বিকল্প', weatherClear: 'পরিষ্কার', weatherCloudy: 'মেঘলা', weatherRain: 'বৃষ্টি', weatherStorm: 'ঝড়', weatherOther: 'পরিবর্তনশীল',
  },
  mr: {
    title: 'लाइव्ह डेटा इंटेलिजन्स', subtitle: 'लाइव्ह बाह्य डेटा AI अंदाज व गणिती मूल्यांपासून वेगळा दाखवला जातो.', liveWeather: 'लाइव्ह हवामान', officialMandi: 'अधिकृत मंडी भाव', schemes: 'सरकारी योजना', map: 'मार्केट मॅप', live: 'लाइव्ह', daily: 'दैनिक अधिकृत', verify: 'अधिकृत पडताळणी', calculated: 'गणना आधारित', temperature: 'तापमान', humidity: 'आर्द्रता', wind: 'वारा', rain: 'पाऊस', forecast: '3 दिवसांचा अंदाज', market: 'बाजार', commodity: 'माल', modal: 'मोडल भाव', noMandi: 'अलीकडील स्थानिक मंडी नोंदी मिळाल्या नाहीत. जवळच्या मंडीत पडताळा.', mandiNotConfigured: 'अधिकृत मंडी कनेक्टर तयार आहे; सर्व्हर प्रशासकाने data.gov.in API key जोडावी.', officialPortal: 'अधिकृत myScheme पोर्टल उघडा', refresh: 'लाइव्ह डेटा रीफ्रेश', updated: 'अपडेट', loading: 'लाइव्ह डेटा लोड होत आहे...', error: 'सध्या लाइव्ह डेटा लोड झाला नाही.', source: 'स्रोत', districtCoverage: 'जिल्हा कव्हरेज', stateCoverage: 'राज्य-स्तरीय पर्याय', weatherClear: 'स्वच्छ', weatherCloudy: 'ढगाळ', weatherRain: 'पाऊस', weatherStorm: 'वादळ', weatherOther: 'बदलते',
  },
  ta: {
    title: 'நேரடி தரவு நுண்ணறிவு', subtitle: 'நேரடி வெளிப்புற தரவு AI மதிப்பீடுகள் மற்றும் கணக்கீடுகளிலிருந்து தனியாக காட்டப்படுகிறது.', liveWeather: 'நேரடி வானிலை', officialMandi: 'அதிகாரப்பூர்வ மண்டி விலை', schemes: 'அரசுத் திட்டங்கள்', map: 'சந்தை வரைபடம்', live: 'நேரடி', daily: 'தினசரி அதிகாரப்பூர்வ', verify: 'அதிகாரப்பூர்வ சரிபார்ப்பு', calculated: 'கணக்கிடப்பட்டது', temperature: 'வெப்பநிலை', humidity: 'ஈரப்பதம்', wind: 'காற்று', rain: 'மழை', forecast: '3 நாள் முன்னறிவிப்பு', market: 'சந்தை', commodity: 'பொருள்', modal: 'மோடல் விலை', noMandi: 'சமீபத்திய உள்ளூர் மண்டி பதிவுகள் கிடைக்கவில்லை. அருகிலுள்ள மண்டியில் சரிபார்க்கவும்.', mandiNotConfigured: 'அதிகாரப்பூர்வ மண்டி இணைப்பு தயாராக உள்ளது; சர்வர் நிர்வாகி data.gov.in API key சேர்க்க வேண்டும்.', officialPortal: 'அதிகாரப்பூர்வ myScheme தளத்தைத் திறக்கவும்', refresh: 'நேரடி தரவை புதுப்பிக்கவும்', updated: 'புதுப்பிப்பு', loading: 'நேரடி தரவு ஏற்றப்படுகிறது...', error: 'இப்போது நேரடி தரவை ஏற்ற முடியவில்லை.', source: 'மூலம்', districtCoverage: 'மாவட்ட தரவு', stateCoverage: 'மாநில மாற்று தரவு', weatherClear: 'தெளிவு', weatherCloudy: 'மேகமூட்டம்', weatherRain: 'மழை', weatherStorm: 'புயல்', weatherOther: 'மாறுபடும்',
  },
  te: {
    title: 'లైవ్ డేటా ఇంటెలిజెన్స్', subtitle: 'లైవ్ బాహ్య డేటాను AI అంచనాలు మరియు లెక్కించిన విలువల నుండి వేరుగా చూపిస్తాం.', liveWeather: 'లైవ్ వాతావరణం', officialMandi: 'అధికారిక మార్కెట్ ధరలు', schemes: 'ప్రభుత్వ పథకాలు', map: 'మార్కెట్ మ్యాప్', live: 'లైవ్', daily: 'రోజువారీ అధికారిక', verify: 'అధికారిక ధృవీకరణ', calculated: 'లెక్కించినది', temperature: 'ఉష్ణోగ్రత', humidity: 'తేమ', wind: 'గాలి', rain: 'వర్షం', forecast: '3 రోజుల అంచనా', market: 'మార్కెట్', commodity: 'వస్తువు', modal: 'మోడల్ ధర', noMandi: 'తాజా స్థానిక మార్కెట్ రికార్డులు లభించలేదు. సమీప మార్కెట్‌లో ధృవీకరించండి.', mandiNotConfigured: 'అధికారిక మార్కెట్ కనెక్టర్ సిద్ధంగా ఉంది; సర్వర్ అడ్మిన్ data.gov.in API key జోడించాలి.', officialPortal: 'అధికారిక myScheme పోర్టల్ తెరవండి', refresh: 'లైవ్ డేటాను రిఫ్రెష్ చేయండి', updated: 'అప్డేట్', loading: 'లైవ్ డేటా లోడ్ అవుతోంది...', error: 'ప్రస్తుతం లైవ్ డేటా లోడ్ కాలేదు.', source: 'మూలం', districtCoverage: 'జిల్లా కవరేజ్', stateCoverage: 'రాష్ట్ర స్థాయి ప్రత్యామ్నాయం', weatherClear: 'స్పష్టంగా', weatherCloudy: 'మేఘావృతం', weatherRain: 'వర్షం', weatherStorm: 'తుఫాను', weatherOther: 'మార్పులతో',
  },
  kn: {
    title: 'ಲೈವ್ ಡೇಟಾ ಇಂಟೆಲಿಜೆನ್ಸ್', subtitle: 'ಲೈವ್ ಹೊರಗಿನ ಡೇಟಾವನ್ನು AI ಅಂದಾಜು ಮತ್ತು ಲೆಕ್ಕಿಸಿದ ಮೌಲ್ಯಗಳಿಂದ ಪ್ರತ್ಯೇಕವಾಗಿ ತೋರಿಸಲಾಗುತ್ತದೆ.', liveWeather: 'ಲೈವ್ ಹವಾಮಾನ', officialMandi: 'ಅಧಿಕೃತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ', schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', map: 'ಮಾರ್ಕೆಟ್ ನಕ್ಷೆ', live: 'ಲೈವ್', daily: 'ದೈನಂದಿನ ಅಧಿಕೃತ', verify: 'ಅಧಿಕೃತ ಪರಿಶೀಲನೆ', calculated: 'ಲೆಕ್ಕಿಸಿದ', temperature: 'ತಾಪಮಾನ', humidity: 'ಆದ್ರತೆ', wind: 'ಗಾಳಿ', rain: 'ಮಳೆ', forecast: '3 ದಿನಗಳ ಮುನ್ಸೂಚನೆ', market: 'ಮಾರುಕಟ್ಟೆ', commodity: 'ಸರಕು', modal: 'ಮೋಡಲ್ ಬೆಲೆ', noMandi: 'ಇತ್ತೀಚಿನ ಸ್ಥಳೀಯ ಮಂಡಿ ದಾಖಲೆಗಳು ಸಿಗಲಿಲ್ಲ. ಹತ್ತಿರದ ಮಂಡಿಯಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.', mandiNotConfigured: 'ಅಧಿಕೃತ ಮಂಡಿ ಕನೆಕ್ಟರ್ ಸಿದ್ಧವಾಗಿದೆ; ಸರ್ವರ್ ಆಡ್ಮಿನ್ data.gov.in API key ಸೇರಿಸಬೇಕು.', officialPortal: 'ಅಧಿಕೃತ myScheme ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ', refresh: 'ಲೈವ್ ಡೇಟಾ ರಿಫ್ರೆಶ್', updated: 'ನವೀಕರಣ', loading: 'ಲೈವ್ ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', error: 'ಈಗ ಲೈವ್ ಡೇಟಾ ಲೋಡ್ ಆಗಲಿಲ್ಲ.', source: 'ಮೂಲ', districtCoverage: 'ಜಿಲ್ಲಾ ವ್ಯಾಪ್ತಿ', stateCoverage: 'ರಾಜ್ಯ ಮಟ್ಟದ ಪರ್ಯಾಯ', weatherClear: 'ಸ್ವಚ್ಛ', weatherCloudy: 'ಮೋಡ', weatherRain: 'ಮಳೆ', weatherStorm: 'ಬಿರುಗಾಳಿ', weatherOther: 'ಬದಲಾವಣೆ',
  },
  gu: {
    title: 'લાઇવ ડેટા ઇન્ટેલિજન્સ', subtitle: 'લાઇવ બાહ્ય ડેટાને AI અંદાજ અને ગણતરી કરેલા મૂલ્યોથી અલગ બતાવવામાં આવે છે.', liveWeather: 'લાઇવ હવામાન', officialMandi: 'સત્તાવાર મંડી ભાવ', schemes: 'સરકારી યોજનાઓ', map: 'માર્કેટ મેપ', live: 'લાઇવ', daily: 'દૈનિક સત્તાવાર', verify: 'સત્તાવાર ચકાસણી', calculated: 'ગણતરી આધારિત', temperature: 'તાપમાન', humidity: 'ભેજ', wind: 'પવન', rain: 'વરસાદ', forecast: '3 દિવસનું અનુમાન', market: 'માર્કેટ', commodity: 'વસ્તુ', modal: 'મોડલ ભાવ', noMandi: 'તાજેતરના સ્થાનિક મંડી રેકોર્ડ મળ્યા નથી. નજીકની મંડીમાં ચકાસો.', mandiNotConfigured: 'સત્તાવાર મંડી કનેક્ટર તૈયાર છે; સર્વર એડમિનને data.gov.in API key ઉમેરવી પડશે.', officialPortal: 'સત્તાવાર myScheme પોર્ટલ ખોલો', refresh: 'લાઇવ ડેટા રિફ્રેશ', updated: 'અપડેટ', loading: 'લાઇવ ડેટા લોડ થઈ રહ્યું છે...', error: 'હમણાં લાઇવ ડેટા લોડ થઈ શક્યું નથી.', source: 'સ્ત્રોત', districtCoverage: 'જિલ્લા કવરેજ', stateCoverage: 'રાજ્ય સ્તરનું વિકલ્પ', weatherClear: 'સાફ', weatherCloudy: 'વાદળછાયું', weatherRain: 'વરસાદ', weatherStorm: 'તોફાન', weatherOther: 'બદલાતું',
  },
  pa: {
    title: 'ਲਾਈਵ ਡਾਟਾ ਇੰਟੈਲੀਜੈਂਸ', subtitle: 'ਲਾਈਵ ਬਾਹਰੀ ਡਾਟਾ AI ਅੰਦਾਜ਼ਿਆਂ ਅਤੇ ਗਿਣਤੀ ਕੀਤੀਆਂ ਕਦਰਾਂ ਤੋਂ ਵੱਖ ਦਿਖਾਇਆ ਜਾਂਦਾ ਹੈ।', liveWeather: 'ਲਾਈਵ ਮੌਸਮ', officialMandi: 'ਸਰਕਾਰੀ ਮੰਡੀ ਭਾਅ', schemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', map: 'ਮਾਰਕੀਟ ਨਕਸ਼ਾ', live: 'ਲਾਈਵ', daily: 'ਰੋਜ਼ਾਨਾ ਸਰਕਾਰੀ', verify: 'ਸਰਕਾਰੀ ਜਾਂਚ', calculated: 'ਗਿਣਤੀ ਅਧਾਰਿਤ', temperature: 'ਤਾਪਮਾਨ', humidity: 'ਨਮੀ', wind: 'ਹਵਾ', rain: 'ਮੀਂਹ', forecast: '3 ਦਿਨਾਂ ਦੀ ਭਵਿੱਖਬਾਣੀ', market: 'ਮੰਡੀ', commodity: 'ਵਸਤੂ', modal: 'ਮੋਡਲ ਭਾਅ', noMandi: 'ਤਾਜ਼ਾ ਸਥਾਨਕ ਮੰਡੀ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲੇ। ਨੇੜਲੀ ਮੰਡੀ ਵਿੱਚ ਜਾਂਚ ਕਰੋ।', mandiNotConfigured: 'ਸਰਕਾਰੀ ਮੰਡੀ ਕਨੇਕਟਰ ਤਿਆਰ ਹੈ; ਸਰਵਰ ਐਡਮਿਨ ਨੂੰ data.gov.in API key ਜੋੜਨੀ ਪਵੇਗੀ।', officialPortal: 'ਸਰਕਾਰੀ myScheme ਪੋਰਟਲ ਖੋਲ੍ਹੋ', refresh: 'ਲਾਈਵ ਡਾਟਾ ਰਿਫਰੈਸ਼', updated: 'ਅਪਡੇਟ', loading: 'ਲਾਈਵ ਡਾਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...', error: 'ਇਸ ਵੇਲੇ ਲਾਈਵ ਡਾਟਾ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕਿਆ।', source: 'ਸਰੋਤ', districtCoverage: 'ਜ਼ਿਲ੍ਹਾ ਕਵਰੇਜ', stateCoverage: 'ਰਾਜ ਪੱਧਰੀ ਵਿਕਲਪ', weatherClear: 'ਸਾਫ', weatherCloudy: 'ਬੱਦਲ', weatherRain: 'ਮੀਂਹ', weatherStorm: 'ਤੂਫ਼ਾਨ', weatherOther: 'ਬਦਲਦਾ',
  },
};

const LOCALES: Record<LanguageCode, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', gu: 'gu-IN', pa: 'pa-IN',
};

function weatherLabel(code: number | null | undefined, c: Copy) {
  if (code == null) return c.weatherOther;
  if (code === 0 || code === 1) return c.weatherClear;
  if (code === 2 || code === 3 || code === 45 || code === 48) return c.weatherCloudy;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return c.weatherRain;
  if (code >= 95) return c.weatherStorm;
  return c.weatherOther;
}

function value(value: number | null | undefined, suffix = '') {
  return value == null ? '—' : `${Math.round(value * 10) / 10}${suffix}`;
}

export const LiveIntelligencePanel: React.FC<LiveIntelligencePanelProps> = ({
  district,
  state,
  category,
  latitude,
  longitude,
  language,
}) => {
  const [data, setData] = useState<LiveIntelligencePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const c = COPY[language] || COPY.en;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchLiveIntelligence({ district, state, category, latitude, longitude })
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : c.error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [district, state, category, latitude, longitude, refreshKey, c.error]);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#D9B99B]/40 bg-white shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0E3D6] p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-[#2B1B16]">
            <Database className="h-5 w-5 text-[#6F7655]" />
            <h2 className="text-lg font-black">{c.title}</h2>
          </div>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#765849]">{c.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshKey((v) => v + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-3 py-2 text-xs font-extrabold text-[#6B4535] transition hover:bg-[#F3E8DC] disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> {c.refresh}
        </button>
      </div>

      {loading && !data ? (
        <div className="p-8 text-center text-sm font-semibold text-[#765849]">{c.loading}</div>
      ) : error && !data ? (
        <div className="p-8 text-center text-sm font-semibold text-red-700">{c.error}</div>
      ) : data ? (
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 text-[10px] font-extrabold tracking-wide">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">{c.map}: {c.live}</span>
            <span className={`rounded-full px-3 py-1.5 ${data.weather.available ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>{c.liveWeather}: {data.weather.available ? c.live : '—'}</span>
            <span className={`rounded-full px-3 py-1.5 ${data.mandi.available ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{c.officialMandi}: {data.mandi.available ? c.daily : data.mandi.configured ? '—' : 'SETUP'}</span>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-800">{c.schemes}: {c.verify}</span>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-[#8B5E47]" />
                  <h3 className="text-sm font-black text-[#2B1B16]">{c.liveWeather}</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800">{data.weather.available ? c.live : '—'}</span>
              </div>

              {data.weather.available && data.weather.current ? (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl bg-white p-3"><Thermometer className="h-4 w-4 text-[#8B5E47]" /><div className="mt-2 text-lg font-black text-[#2B1B16]">{value(data.weather.current.temperatureC, '°C')}</div><div className="text-[10px] text-[#765849]">{c.temperature}</div></div>
                    <div className="rounded-xl bg-white p-3"><Droplets className="h-4 w-4 text-[#8B5E47]" /><div className="mt-2 text-lg font-black text-[#2B1B16]">{value(data.weather.current.humidityPct, '%')}</div><div className="text-[10px] text-[#765849]">{c.humidity}</div></div>
                    <div className="rounded-xl bg-white p-3"><Wind className="h-4 w-4 text-[#8B5E47]" /><div className="mt-2 text-lg font-black text-[#2B1B16]">{value(data.weather.current.windSpeedKmh, ' km/h')}</div><div className="text-[10px] text-[#765849]">{c.wind}</div></div>
                    <div className="rounded-xl bg-white p-3"><CloudRain className="h-4 w-4 text-[#8B5E47]" /><div className="mt-2 text-lg font-black text-[#2B1B16]">{value(data.weather.current.precipitationMm, ' mm')}</div><div className="text-[10px] text-[#765849]">{c.rain}</div></div>
                  </div>
                  <div className="mt-3 text-xs font-bold text-[#59603F]">{weatherLabel(data.weather.current.weatherCode, c)}</div>
                  <div className="mt-4">
                    <div className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#8B5E47]">{c.forecast}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {data.weather.forecast.map((day) => (
                        <div key={day.date} className="rounded-xl border border-[#EADBCB] bg-white p-3 text-center">
                          <div className="text-[10px] font-bold text-[#765849]">{new Intl.DateTimeFormat(LOCALES[language], { weekday: 'short' }).format(new Date(`${day.date}T12:00:00`))}</div>
                          <div className="mt-1 text-sm font-black text-[#2B1B16]">{value(day.maxTempC, '°')} / {value(day.minTempC, '°')}</div>
                          <div className="mt-1 text-[10px] text-[#8B5E47]">{value(day.precipitationProbability, '%')} {c.rain}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : <p className="mt-4 text-xs text-[#765849]">{data.weather.note}</p>}
              <p className="mt-4 border-t border-[#EADBCB] pt-3 text-[10px] leading-relaxed text-[#765849]">{data.weather.note}</p>
              <p className="mt-1 text-[10px] font-semibold text-[#8B5E47]">{c.source}: {data.weather.source}</p>
            </div>

            <div className="rounded-2xl border border-[#D9B99B]/40 bg-[#FAF7F3] p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-[#6F7655]" />
                  <h3 className="text-sm font-black text-[#2B1B16]">{c.officialMandi}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${data.mandi.available ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{data.mandi.available ? c.daily : data.mandi.configured ? 'CHECK' : 'SETUP'}</span>
              </div>

              {!data.mandi.configured ? (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{c.mandiNotConfigured}</p>
              ) : data.mandi.records.length ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wider text-[#8B5E47]"><tr><th className="pb-2 pr-3">{c.commodity}</th><th className="pb-2 pr-3">{c.market}</th><th className="pb-2 pr-3">{c.modal}</th><th className="pb-2">Date</th></tr></thead>
                    <tbody className="divide-y divide-[#EADBCB]">
                      {data.mandi.records.slice(0, 6).map((record, index) => (
                        <tr key={`${record.market}-${record.commodity}-${record.arrivalDate}-${index}`}>
                          <td className="py-2 pr-3 font-bold text-[#2B1B16]">{record.commodity}{record.variety ? ` · ${record.variety}` : ''}</td>
                          <td className="py-2 pr-3 text-[#765849]">{record.market}</td>
                          <td className="py-2 pr-3 font-extrabold text-[#59603F]">{record.modalPrice == null ? '—' : `₹${record.modalPrice.toLocaleString('en-IN')}`}</td>
                          <td className="py-2 text-[#765849]">{record.arrivalDate || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="mt-4 text-xs leading-relaxed text-[#765849]">{c.noMandi}</p>}

              <p className="mt-4 border-t border-[#EADBCB] pt-3 text-[10px] leading-relaxed text-[#765849]">{data.mandi.note}</p>
              <p className="mt-1 text-[10px] font-semibold text-[#8B5E47]">{c.source}: {data.mandi.source} · {data.mandi.coverage === 'district' ? c.districtCoverage : data.mandi.coverage === 'state' ? c.stateCoverage : '—'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="flex gap-3">
              <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
              <div>
                <div className="text-sm font-black text-blue-950">{c.schemes} · {c.verify}</div>
                <p className="mt-1 text-xs leading-relaxed text-blue-900">{data.schemes.note}</p>
              </div>
            </div>
            <a href={data.schemes.verificationUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-xs font-extrabold text-white sm:mt-0">
              {c.officialPortal} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="text-[10px] text-[#8B5E47]">{c.updated}: {new Intl.DateTimeFormat(LOCALES[language], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.updatedAt))}</div>
        </div>
      ) : null}
    </section>
  );
};
