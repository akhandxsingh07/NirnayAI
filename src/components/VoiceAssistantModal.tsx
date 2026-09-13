import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, X } from 'lucide-react';
import type { LanguageCode } from '../types';
import {
  askNirnayQuestion,
  type ChatContext,
  type ChatHistoryMessage,
} from '../services/chatService';
import { requestNirnayVoice } from '../services/voiceService';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ChatContext;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
  confidenceNote?: string;
}

type UiCopy = {
  title: string;
  subtitle: string;
  greeting: string;
  unsupported: string;
  loading: string;
  suggested: string;
  placeholder: string;
  listening: string;
  stop: string;
  readAloud: string;
  error: string;
  voiceOn: string;
  voiceOff: string;
  speaking: string;
  prompts: string[];
};

const SPEECH_LOCALES: Record<LanguageCode, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', mr: 'mr-IN', ta: 'ta-IN',
  te: 'te-IN', kn: 'kn-IN', gu: 'gu-IN', pa: 'pa-IN',
};

const VOICE_NAME_HINTS: Record<LanguageCode, string[]> = {
  en: ['english india', 'english (india)', 'en-in'],
  hi: ['hindi', 'हिन्दी', 'हिंदी', 'hi-in'],
  bn: ['bengali', 'bangla', 'বাংলা', 'bn-in'],
  mr: ['marathi', 'मराठी', 'mr-in'],
  ta: ['tamil', 'தமிழ்', 'ta-in'],
  te: ['telugu', 'తెలుగు', 'te-in'],
  kn: ['kannada', 'ಕನ್ನಡ', 'kn-in'],
  gu: ['gujarati', 'ગુજરાતી', 'gu-in'],
  pa: ['punjabi', 'ਪੰਜਾਬੀ', 'pa-in'],
};

const UI_COPY: Record<LanguageCode, UiCopy> = {
  en: { title: 'Ask NIRNAY AI', subtitle: 'Multilingual voice + hyper-local business advisor', greeting: 'Namaste! I can speak with you and answer using your district, skill, capital, land, experience and business plan. Ask about customers, pricing, finance, schemes, risks, licences or a 90-day action plan.', unsupported: 'Voice input is not supported in this browser. You can still type your question.', loading: 'NIRNAY AI is analysing your business context...', suggested: 'Suggested questions', placeholder: 'Ask or speak about your business...', listening: 'Listening... speak now', stop: 'Stop', readAloud: 'Play this answer', error: 'I could not reach the advisory engine. Please try again.', voiceOn: 'AI voice ON', voiceOff: 'AI voice OFF', speaking: 'Speaking...', prompts: ['Give me a 90-day action plan', 'How should I split my capital?', 'Which schemes should I verify?', 'How do I get my first 20 customers?'] },
  hi: { title: 'NIRNAY AI से पूछें', subtitle: 'बहुभाषी वॉइस + हाइपर-लोकल बिज़नेस सलाहकार', greeting: 'नमस्ते! मैं आपसे आवाज़ में बात कर सकता हूँ और आपके जिले, कौशल, पूंजी, जमीन, अनुभव और बिज़नेस प्लान के आधार पर जवाब दे सकता हूँ। ग्राहक, कीमत, वित्त, योजना, जोखिम, लाइसेंस या 90-दिन की योजना पूछें।', unsupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। आप सवाल टाइप कर सकते हैं।', loading: 'NIRNAY AI आपके बिज़नेस संदर्भ का विश्लेषण कर रहा है...', suggested: 'सुझाए गए सवाल', placeholder: 'अपने बिज़नेस के बारे में पूछें या बोलें...', listening: 'सुन रहा हूँ... अब बोलें', stop: 'रोकें', readAloud: 'यह उत्तर सुनें', error: 'अभी सलाह इंजन से संपर्क नहीं हो पाया। दोबारा कोशिश करें।', voiceOn: 'AI आवाज़ चालू', voiceOff: 'AI आवाज़ बंद', speaking: 'जवाब बोल रहा है...', prompts: ['90 दिन की कार्ययोजना बनाएं', 'मेरी पूंजी कैसे बांटूं?', 'कौन-सी योजनाएं जांचूं?', 'पहले 20 ग्राहक कैसे मिलेंगे?'] },
  bn: { title: 'NIRNAY AI-কে জিজ্ঞাসা করুন', subtitle: 'বহুভাষী ভয়েস + স্থানীয় ব্যবসা পরামর্শ', greeting: 'নমস্কার! আমি আপনার জেলা, দক্ষতা, মূলধন, জমি, অভিজ্ঞতা ও ব্যবসার পরিকল্পনা ব্যবহার করে কণ্ঠে উত্তর দিতে পারি। গ্রাহক, মূল্য, অর্থায়ন, স্কিম, ঝুঁকি, লাইসেন্স বা ৯০ দিনের পরিকল্পনা সম্পর্কে জিজ্ঞাসা করুন।', unsupported: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। আপনি টাইপ করতে পারেন।', loading: 'NIRNAY AI আপনার ব্যবসার প্রেক্ষাপট বিশ্লেষণ করছে...', suggested: 'প্রস্তাবিত প্রশ্ন', placeholder: 'ব্যবসা সম্পর্কে জিজ্ঞাসা করুন বা বলুন...', listening: 'শুনছি... এখন বলুন', stop: 'থামান', readAloud: 'উত্তর শুনুন', error: 'এই মুহূর্তে পরামর্শ ইঞ্জিনে পৌঁছানো যায়নি। আবার চেষ্টা করুন।', voiceOn: 'AI ভয়েস চালু', voiceOff: 'AI ভয়েস বন্ধ', speaking: 'উত্তর বলা হচ্ছে...', prompts: ['৯০ দিনের পরিকল্পনা দিন', 'মূলধন কীভাবে ভাগ করব?', 'কোন স্কিম যাচাই করব?', 'প্রথম ২০ জন গ্রাহক কীভাবে পাব?'] },
  mr: { title: 'NIRNAY AI ला विचारा', subtitle: 'बहुभाषिक आवाज + स्थानिक व्यवसाय सल्लागार', greeting: 'नमस्कार! तुमचा जिल्हा, कौशल्य, भांडवल, जमीन, अनुभव आणि व्यवसाय योजना वापरून मी आवाजात उत्तर देऊ शकतो. ग्राहक, किंमत, वित्त, योजना, जोखीम, परवाने किंवा 90 दिवसांची योजना विचारा.', unsupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. प्रश्न टाइप करू शकता.', loading: 'NIRNAY AI तुमच्या व्यवसाय संदर्भाचे विश्लेषण करत आहे...', suggested: 'सुचवलेले प्रश्न', placeholder: 'व्यवसायाबद्दल विचारा किंवा बोला...', listening: 'ऐकत आहे... आता बोला', stop: 'थांबा', readAloud: 'उत्तर ऐका', error: 'सल्ला इंजिनशी संपर्क झाला नाही. पुन्हा प्रयत्न करा.', voiceOn: 'AI आवाज सुरू', voiceOff: 'AI आवाज बंद', speaking: 'उत्तर बोलत आहे...', prompts: ['90 दिवसांची कृती योजना द्या', 'भांडवल कसे विभागू?', 'कोणत्या योजना तपासू?', 'पहिले 20 ग्राहक कसे मिळवू?'] },
  ta: { title: 'NIRNAY AI-யிடம் கேளுங்கள்', subtitle: 'பலமொழி குரல் + உள்ளூர் வணிக ஆலோசகர்', greeting: 'வணக்கம்! உங்கள் மாவட்டம், திறன், முதல்தொகை, நிலம், அனுபவம் மற்றும் வணிகத் திட்டத்தின் அடிப்படையில் குரலில் பதிலளிக்க முடியும். வாடிக்கையாளர், விலை, நிதி, திட்டம், ஆபத்து, உரிமம் அல்லது 90 நாள் திட்டம் பற்றி கேளுங்கள்.', unsupported: 'இந்த உலாவியில் குரல் உள்ளீடு கிடைக்கவில்லை. தட்டச்சு செய்யலாம்.', loading: 'NIRNAY AI உங்கள் வணிக சூழலை ஆய்வு செய்கிறது...', suggested: 'பரிந்துரைக்கப்பட்ட கேள்விகள்', placeholder: 'வணிகம் பற்றி கேளுங்கள் அல்லது பேசுங்கள்...', listening: 'கேட்கிறேன்... இப்போது பேசுங்கள்', stop: 'நிறுத்து', readAloud: 'பதிலை கேளுங்கள்', error: 'ஆலோசனை இயந்திரத்தை அணுக முடியவில்லை. மீண்டும் முயற்சிக்கவும்.', voiceOn: 'AI குரல் இயக்கம்', voiceOff: 'AI குரல் நிறுத்தம்', speaking: 'பதில் பேசப்படுகிறது...', prompts: ['90 நாள் செயல் திட்டம் தரவும்', 'முதல்தொகையை எப்படி பிரிப்பது?', 'எந்த திட்டங்களை சரிபார்ப்பது?', 'முதல் 20 வாடிக்கையாளர்களை எப்படி பெறுவது?'] },
  te: { title: 'NIRNAY AIని అడగండి', subtitle: 'బహుభాషా వాయిస్ + స్థానిక వ్యాపార సలహాదారు', greeting: 'నమస్తే! మీ జిల్లా, నైపుణ్యం, మూలధనం, భూమి, అనుభవం మరియు వ్యాపార ప్రణాళిక ఆధారంగా వాయిస్‌లో సమాధానం ఇవ్వగలను. కస్టమర్లు, ధర, ఫైనాన్స్, పథకాలు, రిస్క్, లైసెన్సులు లేదా 90 రోజుల ప్రణాళిక గురించి అడగండి.', unsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. మీరు టైప్ చేయవచ్చు.', loading: 'NIRNAY AI మీ వ్యాపార సందర్భాన్ని విశ్లేషిస్తోంది...', suggested: 'సూచించిన ప్రశ్నలు', placeholder: 'వ్యాపారం గురించి అడగండి లేదా మాట్లాడండి...', listening: 'వింటున్నాను... ఇప్పుడు మాట్లాడండి', stop: 'ఆపు', readAloud: 'సమాధానం వినండి', error: 'సలహా ఇంజిన్‌ను చేరుకోలేకపోయాను. మళ్లీ ప్రయత్నించండి.', voiceOn: 'AI వాయిస్ ఆన్', voiceOff: 'AI వాయిస్ ఆఫ్', speaking: 'సమాధానం చెబుతోంది...', prompts: ['90 రోజుల కార్యాచరణ ప్రణాళిక ఇవ్వండి', 'మూలధనాన్ని ఎలా విభజించాలి?', 'ఏ పథకాలు ధృవీకరించాలి?', 'మొదటి 20 కస్టమర్లను ఎలా పొందాలి?'] },
  kn: { title: 'NIRNAY AI ಅನ್ನು ಕೇಳಿ', subtitle: 'ಬಹುಭಾಷಾ ಧ್ವನಿ + ಸ್ಥಳೀಯ ವ್ಯವಹಾರ ಸಲಹೆಗಾರ', greeting: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಜಿಲ್ಲೆ, ಕೌಶಲ್ಯ, ಬಂಡವಾಳ, ಭೂಮಿ, ಅನುಭವ ಮತ್ತು ವ್ಯವಹಾರ ಯೋಜನೆಯ ಆಧಾರದಲ್ಲಿ ಧ್ವನಿಯಲ್ಲಿ ಉತ್ತರಿಸಬಹುದು. ಗ್ರಾಹಕರು, ಬೆಲೆ, ಹಣಕಾಸು, ಯೋಜನೆಗಳು, ಅಪಾಯ, ಪರವಾನಗಿ ಅಥವಾ 90 ದಿನಗಳ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.', unsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ಟೈಪ್ ಮಾಡಬಹುದು.', loading: 'NIRNAY AI ನಿಮ್ಮ ವ್ಯವಹಾರ ಸಂದರ್ಭವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...', suggested: 'ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು', placeholder: 'ವ್ಯವಹಾರ ಬಗ್ಗೆ ಕೇಳಿ ಅಥವಾ ಮಾತನಾಡಿ...', listening: 'ಕೇಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ', stop: 'ನಿಲ್ಲಿಸಿ', readAloud: 'ಉತ್ತರ ಕೇಳಿ', error: 'ಸಲಹಾ ಎಂಜಿನ್‌ಗೆ ಸಂಪರ್ಕವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.', voiceOn: 'AI ಧ್ವನಿ ಆನ್', voiceOff: 'AI ಧ್ವನಿ ಆಫ್', speaking: 'ಉತ್ತರ ಮಾತನಾಡುತ್ತಿದೆ...', prompts: ['90 ದಿನಗಳ ಕಾರ್ಯಯೋಜನೆ ನೀಡಿ', 'ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ಹಂಚಬೇಕು?', 'ಯಾವ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು?', 'ಮೊದಲ 20 ಗ್ರಾಹಕರನ್ನು ಹೇಗೆ ಪಡೆಯಬೇಕು?'] },
  gu: { title: 'NIRNAY AI ને પૂછો', subtitle: 'બહુભાષી અવાજ + સ્થાનિક બિઝનેસ સલાહકાર', greeting: 'નમસ્તે! તમારા જિલ્લો, કુશળતા, મૂડી, જમીન, અનુભવ અને બિઝનેસ પ્લાનના આધારે હું અવાજમાં જવાબ આપી શકું છું. ગ્રાહકો, ભાવ, ફાઇનાન્સ, યોજનાઓ, જોખમ, લાઇસન્સ અથવા 90 દિવસની યોજના વિશે પૂછો.', unsupported: 'આ બ્રાઉઝરમાં વૉઇસ ઇનપુટ ઉપલબ્ધ નથી. તમે ટાઇપ કરી શકો છો.', loading: 'NIRNAY AI તમારા બિઝનેસ સંદર્ભનું વિશ્લેષણ કરી રહ્યું છે...', suggested: 'સૂચવેલા પ્રશ્નો', placeholder: 'બિઝનેસ વિશે પૂછો અથવા બોલો...', listening: 'સાંભળી રહ્યો છું... હવે બોલો', stop: 'બંધ કરો', readAloud: 'જવાબ સાંભળો', error: 'સલાહ એન્જિન સુધી પહોંચી શકાયું નથી. ફરી પ્રયત્ન કરો.', voiceOn: 'AI અવાજ ચાલુ', voiceOff: 'AI અવાજ બંધ', speaking: 'જવાબ બોલાઈ રહ્યો છે...', prompts: ['90 દિવસની કાર્યયોજના આપો', 'મૂડી કેવી રીતે વહેંચું?', 'કઈ યોજનાઓ ચકાસવી?', 'પહેલા 20 ગ્રાહકો કેવી રીતે મેળવવા?'] },
  pa: { title: 'NIRNAY AI ਨੂੰ ਪੁੱਛੋ', subtitle: 'ਬਹੁਭਾਸ਼ੀ ਆਵਾਜ਼ + ਸਥਾਨਕ ਕਾਰੋਬਾਰ ਸਲਾਹਕਾਰ', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੇ ਜ਼ਿਲ੍ਹੇ, ਹੁਨਰ, ਪੂੰਜੀ, ਜ਼ਮੀਨ, ਤਜਰਬੇ ਅਤੇ ਕਾਰੋਬਾਰੀ ਯੋਜਨਾ ਦੇ ਆਧਾਰ ਤੇ ਮੈਂ ਆਵਾਜ਼ ਵਿੱਚ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ। ਗਾਹਕ, ਕੀਮਤ, ਵਿੱਤ, ਯੋਜਨਾ, ਖਤਰਾ, ਲਾਇਸੈਂਸ ਜਾਂ 90 ਦਿਨਾਂ ਦੀ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛੋ।', unsupported: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਇਨਪੁਟ ਉਪਲਬਧ ਨਹੀਂ। ਤੁਸੀਂ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ।', loading: 'NIRNAY AI ਤੁਹਾਡੇ ਕਾਰੋਬਾਰੀ ਸੰਦਰਭ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...', suggested: 'ਸੁਝਾਏ ਸਵਾਲ', placeholder: 'ਕਾਰੋਬਾਰ ਬਾਰੇ ਪੁੱਛੋ ਜਾਂ ਬੋਲੋ...', listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਹੁਣ ਬੋਲੋ', stop: 'ਰੋਕੋ', readAloud: 'ਜਵਾਬ ਸੁਣੋ', error: 'ਸਲਾਹ ਇੰਜਨ ਨਾਲ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', voiceOn: 'AI ਆਵਾਜ਼ ਚਾਲੂ', voiceOff: 'AI ਆਵਾਜ਼ ਬੰਦ', speaking: 'ਜਵਾਬ ਬੋਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...', prompts: ['90 ਦਿਨਾਂ ਦੀ ਕਾਰਵਾਈ ਯੋਜਨਾ ਦਿਓ', 'ਪੂੰਜੀ ਕਿਵੇਂ ਵੰਡਾਂ?', 'ਕਿਹੜੀਆਂ ਯੋਜਨਾਵਾਂ ਜਾਂਚਾਂ?', 'ਪਹਿਲੇ 20 ਗਾਹਕ ਕਿਵੇਂ ਮਿਲਣਗੇ?'] },
};

function normalizeLanguage(value?: string): LanguageCode {
  return value && value in UI_COPY ? (value as LanguageCode) : 'en';
}

function pickVoice(language: LanguageCode, voices: SpeechSynthesisVoice[]) {
  const locale = SPEECH_LOCALES[language].toLowerCase();
  const base = locale.split('-')[0];
  const hints = VOICE_NAME_HINTS[language];

  const exactLocale = voices.find((voice) => voice.lang.toLowerCase() === locale);
  if (exactLocale) return exactLocale;

  const hinted = voices.find((voice) => {
    const haystack = `${voice.name} ${voice.lang}`.toLowerCase();
    return hints.some((hint) => haystack.includes(hint.toLowerCase()));
  });
  if (hinted) return hinted;

  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith(`${base}-`)) ||
    voices.find((voice) => voice.lang.toLowerCase() === base)
  );
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose, context }) => {
  const language = normalizeLanguage(context.language);
  const copy = UI_COPY[language];
  const contextSignature = `${language}|${context.businessIdea || ''}|${context.district || ''}|${context.skill || ''}`;
  const previousContextRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastAutoSpokenRef = useRef(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speechRequestRef = useRef(0);

  const greeting = useMemo<Message>(() => ({
    role: 'assistant',
    text: copy.greeting,
    sources: [context.district ? `${context.district} profile` : 'NIRNAY AI advisory profile'],
  }), [copy.greeting, context.district]);

  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(copy.prompts);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);

  const clearCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const cancelVoiceOutput = () => {
    speechRequestRef.current += 1;
    clearCurrentAudio();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakWithBrowser = (text: string, requestId: number) => {
    if (!('speechSynthesis' in window) || requestId !== speechRequestRef.current) {
      setIsSpeaking(false);
      return;
    }

    const synth = window.speechSynthesis;
    const voices = browserVoices.length ? browserVoices : synth.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LOCALES[language];
    utterance.rate = 0.9;
    utterance.pitch = 1;
    const voice = pickVoice(language, voices);
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  const speakText = async (text: string) => {
    if (!text.trim()) return;

    const requestId = speechRequestRef.current + 1;
    speechRequestRef.current = requestId;
    clearCurrentAudio();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const nativeVoice = await requestNirnayVoice(text, language);
    if (requestId !== speechRequestRef.current) return;

    if (nativeVoice) {
      const url = URL.createObjectURL(nativeVoice.blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        if (requestId === speechRequestRef.current) setIsSpeaking(false);
        clearCurrentAudio();
      };
      audio.onerror = () => {
        clearCurrentAudio();
        speakWithBrowser(text, requestId);
      };
      try {
        await audio.play();
        return;
      } catch {
        clearCurrentAudio();
      }
    }

    speakWithBrowser(text, requestId);
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const refreshVoices = () => setBrowserVoices(synth.getVoices());
    refreshVoices();
    synth.addEventListener('voiceschanged', refreshVoices);
    const timer = window.setTimeout(refreshVoices, 350);
    return () => {
      window.clearTimeout(timer);
      synth.removeEventListener('voiceschanged', refreshVoices);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cancelVoiceOutput();
      return;
    }
    if (previousContextRef.current !== contextSignature) {
      cancelVoiceOutput();
      setMessages([greeting]);
      setSuggestedPrompts(copy.prompts);
      previousContextRef.current = contextSignature;
      lastAutoSpokenRef.current = -1;
    }
  }, [isOpen, contextSignature, greeting, copy.prompts]);

  useEffect(() => {
    if (!isOpen || !autoSpeak || !messages.length) return;
    const index = messages.length - 1;
    const latest = messages[index];
    if (latest.role !== 'assistant' || lastAutoSpokenRef.current === index) return;
    lastAutoSpokenRef.current = index;
    const timer = window.setTimeout(() => void speakText(latest.text), 120);
    return () => window.clearTimeout(timer);
  }, [messages, autoSpeak, isOpen, language]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = SPEECH_LOCALES[language];
    recognition.onresult = (event: any) => {
      if (!event?.results) return;
      const transcript = Array.from(event.results).map((result: any) => result?.[0]?.transcript || '').join('');
      setInputText(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => {
      try { recognition.abort(); } catch { /* browser-specific */ }
    };
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => () => cancelVoiceOutput(), []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    cancelVoiceOutput();
    setInputText('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    cancelVoiceOutput();
    if (isListening && recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);

    const history: ChatHistoryMessage[] = messages.slice(-10).map((message) => ({ role: message.role, text: message.text }));
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askNirnayQuestion(query, { ...context, language }, history);
      setMessages((prev) => [...prev, { role: 'assistant', text: response.answer, sources: response.sources, confidenceNote: response.confidenceNote }]);
      if (response.followUps?.length) setSuggestedPrompts(response.followUps.slice(0, 4));
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: copy.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoSpeak = () => {
    setAutoSpeak((value) => {
      const next = !value;
      if (!next) cancelVoiceOutput();
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1B16]/55 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[#D9B99B]/60 bg-white shadow-[0_30px_100px_rgba(43,27,22,.28)]">
        <div className="flex items-center justify-between bg-[linear-gradient(135deg,#3C251D,#6B4535)] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-[#B9825B] text-sm font-extrabold shadow-inner ${isSpeaking ? 'ring-4 ring-[#EBC8A8]/30' : ''}`}>
              N
              {isSpeaking && <span className="absolute inset-0 animate-ping rounded-full border border-[#F3E8DC]/50" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold leading-none text-white">{copy.title}</h3>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#F3E8DC]">Voice AI</span>
              </div>
              <span className="mt-1 block text-[11px] text-[#E6CDB7]">{copy.subtitle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleAutoSpeak} title={autoSpeak ? copy.voiceOn : copy.voiceOff} className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[10px] font-extrabold transition ${autoSpeak ? 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-300/25' : 'bg-white/10 text-[#E6CDB7]'}`}>
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden sm:inline">{autoSpeak ? copy.voiceOn : copy.voiceOff}</span>
            </button>
            <button onClick={onClose} className="rounded-xl p-2 text-[#E6CDB7] transition hover:bg-white/10 hover:text-white" aria-label="Close chatbot">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-[#D9B99B]/40 bg-[#FFFDF8] px-4 py-2.5">
          {context.district && <span className="rounded-full bg-[#F3E8DC] px-2.5 py-1 text-[10px] font-bold text-[#6B4535]">{context.district}</span>}
          {context.skill && <span className="rounded-full bg-[#EEF0E3] px-2.5 py-1 text-[10px] font-bold text-[#56603F]">{context.skill}</span>}
          {context.margin ? <span className="rounded-full bg-[#FAF0E5] px-2.5 py-1 text-[10px] font-bold text-[#8B5E47]">₹{context.margin.toLocaleString('en-IN')}</span> : null}
          {context.experience && <span className="rounded-full bg-[#F4F0EA] px-2.5 py-1 text-[10px] font-bold text-[#6B4535]">{context.experience}</span>}
          {isSpeaking && <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800"><Sparkles className="h-3 w-3 animate-pulse" />{copy.speaking}</span>}
        </div>

        {!speechSupported && (
          <div className="flex items-center gap-1.5 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[11px] text-amber-900">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-700" /><span>{copy.unsupported}</span>
          </div>
        )}

        <div className="flex-1 space-y-3.5 overflow-y-auto bg-[radial-gradient(circle_at_top,#FFFDF8_0,#FAF7F3_55%,#F4ECE2_100%)] p-4 text-xs">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${message.role === 'user' ? 'rounded-br-sm bg-[#6B4535] text-white shadow-sm' : 'rounded-bl-sm border border-[#D9B99B]/50 bg-white text-[#2B1B16] shadow-[0_8px_24px_rgba(75,48,35,.06)]'}`}>
                {message.text}
                {message.role === 'assistant' && (
                  <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-[#F3E8DC] pt-2">
                    <div className="min-w-0 text-[10px] text-[#8B5E47]">
                      {message.sources?.length ? message.sources.join(' · ') : 'NIRNAY AI advisory context'}
                      {message.confidenceNote && <span className="mt-0.5 block">{message.confidenceNote}</span>}
                    </div>
                    <button onClick={() => void speakText(message.text)} title={copy.readAloud} className="shrink-0 rounded-lg border border-[#E8D9C8] bg-[#FFFDF8] p-1.5 text-[#8B5E47] transition hover:bg-[#F3E8DC] hover:text-[#2B1B16]">
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#D9B99B]/40 bg-white/90 p-2.5 text-xs text-[#8B5E47] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-[#6B4535]" /><span>{copy.loading}</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-[#D9B99B]/40 bg-white px-4 py-2.5">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8B5E47]">{copy.suggested}</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt) => (
              <button key={prompt} onClick={() => void handleSendMessage(prompt)} disabled={isLoading} className="rounded-full border border-[#D9B99B]/60 bg-[#FAF7F3] px-2.5 py-1.5 text-left text-[11px] text-[#4A2F24] transition hover:-translate-y-0.5 hover:bg-[#F3E8DC] disabled:opacity-50">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-[#D9B99B]/40 bg-white p-3.5">
          {isListening && (
            <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-700 animate-pulse">
              <span className="flex items-center gap-1.5 font-bold"><span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />{copy.listening}</span>
              <button onClick={toggleListening} className="text-[11px] font-extrabold underline hover:text-red-900">{copy.stop}</button>
            </div>
          )}

          <form onSubmit={(event) => { event.preventDefault(); void handleSendMessage(); }} className="flex items-center gap-2">
            {speechSupported && (
              <button type="button" onClick={toggleListening} className={`rounded-xl border p-3 transition-all ${isListening ? 'border-red-700 bg-red-600 text-white ring-4 ring-red-300/30' : 'border-[#D9B99B] bg-[#FAF7F3] text-[#6B4535] hover:bg-[#F3E8DC]'}`}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <input type="text" value={inputText} onChange={(event) => setInputText(event.target.value)} placeholder={copy.placeholder} disabled={isLoading} className="flex-1 rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-3.5 py-3 text-xs text-[#2B1B16] focus:outline-hidden focus:ring-2 focus:ring-[#B9825B]/30" />
            <button type="submit" disabled={!inputText.trim() || isLoading} className="rounded-xl bg-[#4A2F24] p-3 text-white transition hover:bg-[#2B1B16] disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
