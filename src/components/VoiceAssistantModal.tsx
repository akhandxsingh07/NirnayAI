import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Mic, MicOff, Send, Sparkles, Volume2, X } from 'lucide-react';
import type { LanguageCode } from '../types';
import {
  askNirnayQuestion,
  type ChatContext,
  type ChatHistoryMessage,
} from '../services/chatService';

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
  voiceFirst: string;
  subtitle: string;
  greeting: string;
  unsupported: string;
  loading: string;
  suggested: string;
  placeholder: string;
  listening: string;
  stop: string;
  readAloud: string;
  basis: string;
  fallbackBasis: string;
  error: string;
  prompts: string[];
};

const SPEECH_LOCALES: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
};

const UI_COPY: Record<LanguageCode, UiCopy> = {
  en: {
    title: 'Ask NIRNAY AI', voiceFirst: 'Voice + Text', subtitle: 'Hyper-local business, finance & scheme advisor',
    greeting: 'Namaste! I can use your district, skill, capital, land, experience and business plan to give a more specific answer. Ask me about business ideas, customers, pricing, finance, schemes, risks, licences or a 90-day action plan.',
    unsupported: 'Voice input is not supported in this browser. You can still type your question.',
    loading: 'NIRNAY AI is reasoning over your business context...', suggested: 'Suggested questions',
    placeholder: 'Ask about your business, finance, scheme or local market...', listening: 'Listening... speak now', stop: 'Stop',
    readAloud: 'Read answer aloud', basis: 'Basis', fallbackBasis: 'NIRNAY advisory context',
    error: 'I could not reach the advisory engine. Please try again or use one of the suggested questions.',
    prompts: ['Give me a 90-day action plan', 'How should I split my capital?', 'Which schemes should I verify?', 'How do I get my first 20 customers?'],
  },
  hi: {
    title: 'NIRNAY AI से पूछें', voiceFirst: 'आवाज़ + टेक्स्ट', subtitle: 'स्थानीय व्यवसाय, वित्त और योजना सलाहकार',
    greeting: 'नमस्ते! मैं आपके जिले, कौशल, पूंजी, जमीन, अनुभव और बिज़नेस प्लान के आधार पर अधिक सटीक सलाह दे सकता हूँ। बिज़नेस आइडिया, ग्राहक, कीमत, वित्त, सरकारी योजनाएं, जोखिम, लाइसेंस या 90-दिन की योजना पूछें।',
    unsupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। आप सवाल टाइप कर सकते हैं।',
    loading: 'NIRNAY AI आपके बिज़नेस संदर्भ का विश्लेषण कर रहा है...', suggested: 'सुझाए गए सवाल',
    placeholder: 'व्यवसाय, वित्त, योजना या स्थानीय बाजार के बारे में पूछें...', listening: 'सुन रहा हूँ... अब बोलें', stop: 'रोकें',
    readAloud: 'उत्तर सुनें', basis: 'आधार', fallbackBasis: 'NIRNAY सलाह संदर्भ',
    error: 'अभी सलाह इंजन से संपर्क नहीं हो पाया। दोबारा कोशिश करें या सुझाया गया सवाल चुनें।',
    prompts: ['90 दिन की कार्ययोजना बनाएं', 'मेरी पूंजी कैसे बांटूं?', 'कौन-सी योजनाएं जांचूं?', 'पहले 20 ग्राहक कैसे मिलेंगे?'],
  },
  bn: {
    title: 'NIRNAY AI-কে জিজ্ঞাসা করুন', voiceFirst: 'ভয়েস + টেক্সট', subtitle: 'স্থানীয় ব্যবসা, অর্থায়ন ও স্কিম পরামর্শ',
    greeting: 'নমস্কার! আপনার জেলা, দক্ষতা, মূলধন, জমি, অভিজ্ঞতা ও ব্যবসার পরিকল্পনা ব্যবহার করে আমি আরও নির্দিষ্ট পরামর্শ দিতে পারি। ব্যবসা, গ্রাহক, মূল্য, ঋণ, স্কিম, ঝুঁকি, লাইসেন্স বা ৯০ দিনের পরিকল্পনা সম্পর্কে জিজ্ঞাসা করুন।',
    unsupported: 'এই ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। আপনি প্রশ্ন টাইপ করতে পারেন।',
    loading: 'NIRNAY AI আপনার ব্যবসার প্রেক্ষাপট বিশ্লেষণ করছে...', suggested: 'প্রস্তাবিত প্রশ্ন',
    placeholder: 'ব্যবসা, অর্থায়ন, স্কিম বা স্থানীয় বাজার সম্পর্কে জিজ্ঞাসা করুন...', listening: 'শুনছি... এখন বলুন', stop: 'থামান',
    readAloud: 'উত্তর শুনুন', basis: 'ভিত্তি', fallbackBasis: 'NIRNAY পরামর্শ প্রসঙ্গ',
    error: 'এই মুহূর্তে পরামর্শ ইঞ্জিনে পৌঁছানো যায়নি। আবার চেষ্টা করুন।',
    prompts: ['৯০ দিনের কর্মপরিকল্পনা দিন', 'মূলধন কীভাবে ভাগ করব?', 'কোন স্কিম যাচাই করব?', 'প্রথম ২০ জন গ্রাহক কীভাবে পাব?'],
  },
  mr: {
    title: 'NIRNAY AI ला विचारा', voiceFirst: 'आवाज + मजकूर', subtitle: 'स्थानिक व्यवसाय, वित्त व योजना सल्लागार',
    greeting: 'नमस्कार! तुमचा जिल्हा, कौशल्य, भांडवल, जमीन, अनुभव आणि व्यवसाय योजना वापरून मी अधिक अचूक सल्ला देऊ शकतो. व्यवसाय, ग्राहक, किंमत, वित्त, योजना, जोखीम, परवाने किंवा 90 दिवसांची योजना विचारा.',
    unsupported: 'या ब्राउझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. प्रश्न टाइप करू शकता.',
    loading: 'NIRNAY AI तुमच्या व्यवसाय संदर्भाचा विचार करत आहे...', suggested: 'सुचवलेले प्रश्न',
    placeholder: 'व्यवसाय, वित्त, योजना किंवा स्थानिक बाजाराबद्दल विचारा...', listening: 'ऐकत आहे... आता बोला', stop: 'थांबा',
    readAloud: 'उत्तर ऐका', basis: 'आधार', fallbackBasis: 'NIRNAY सल्ला संदर्भ',
    error: 'सल्ला इंजिनशी संपर्क झाला नाही. पुन्हा प्रयत्न करा.',
    prompts: ['90 दिवसांची कृती योजना द्या', 'भांडवल कसे विभागू?', 'कोणत्या योजना तपासू?', 'पहिले 20 ग्राहक कसे मिळवू?'],
  },
  ta: {
    title: 'NIRNAY AI-யிடம் கேளுங்கள்', voiceFirst: 'குரல் + உரை', subtitle: 'உள்ளூர் வணிகம், நிதி & திட்ட ஆலோசகர்',
    greeting: 'வணக்கம்! உங்கள் மாவட்டம், திறன், முதல்தொகை, நிலம், அனுபவம் மற்றும் வணிகத் திட்டத்தை வைத்து மேலும் குறிப்பிட்ட ஆலோசனை வழங்க முடியும். வணிக யோசனை, வாடிக்கையாளர், விலை, நிதி, அரசு திட்டம், ஆபத்து, உரிமம் அல்லது 90 நாள் திட்டம் பற்றி கேளுங்கள்.',
    unsupported: 'இந்த உலாவியில் குரல் உள்ளீடு கிடைக்கவில்லை. கேள்வியை தட்டச்சு செய்யலாம்.',
    loading: 'NIRNAY AI உங்கள் வணிக சூழலை ஆய்வு செய்கிறது...', suggested: 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
    placeholder: 'வணிகம், நிதி, திட்டம் அல்லது உள்ளூர் சந்தை பற்றி கேளுங்கள்...', listening: 'கேட்கிறேன்... இப்போது பேசுங்கள்', stop: 'நிறுத்து',
    readAloud: 'பதிலை கேட்க', basis: 'அடிப்படை', fallbackBasis: 'NIRNAY ஆலோசனை சூழல்',
    error: 'ஆலோசனை இயந்திரத்தை அணுக முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    prompts: ['90 நாள் செயல் திட்டம் தரவும்', 'முதல்தொகையை எப்படி பிரிப்பது?', 'எந்த திட்டங்களை சரிபார்ப்பது?', 'முதல் 20 வாடிக்கையாளர்களை எப்படி பெறுவது?'],
  },
  te: {
    title: 'NIRNAY AIని అడగండి', voiceFirst: 'వాయిస్ + టెక్స్ట్', subtitle: 'స్థానిక వ్యాపారం, ఫైనాన్స్ & పథకాల సలహాదారు',
    greeting: 'నమస్తే! మీ జిల్లా, నైపుణ్యం, మూలధనం, భూమి, అనుభవం మరియు వ్యాపార ప్రణాళిక ఆధారంగా మరింత నిర్దిష్ట సలహా ఇవ్వగలను. వ్యాపారం, కస్టమర్లు, ధర, ఫైనాన్స్, పథకాలు, రిస్క్, లైసెన్సులు లేదా 90 రోజుల ప్రణాళిక గురించి అడగండి.',
    unsupported: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. మీరు టైప్ చేయవచ్చు.',
    loading: 'NIRNAY AI మీ వ్యాపార సందర్భాన్ని విశ్లేషిస్తోంది...', suggested: 'సూచించిన ప్రశ్నలు',
    placeholder: 'వ్యాపారం, ఫైనాన్స్, పథకం లేదా స్థానిక మార్కెట్ గురించి అడగండి...', listening: 'వింటున్నాను... ఇప్పుడు మాట్లాడండి', stop: 'ఆపు',
    readAloud: 'సమాధానం వినండి', basis: 'ఆధారం', fallbackBasis: 'NIRNAY సలహా సందర్భం',
    error: 'సలహా ఇంజిన్‌ను చేరుకోలేకపోయాను. మళ్లీ ప్రయత్నించండి.',
    prompts: ['90 రోజుల కార్యాచరణ ప్రణాళిక ఇవ్వండి', 'మూలధనాన్ని ఎలా విభజించాలి?', 'ఏ పథకాలు ధృవీకరించాలి?', 'మొదటి 20 కస్టమర్లను ఎలా పొందాలి?'],
  },
  kn: {
    title: 'NIRNAY AI ಅನ್ನು ಕೇಳಿ', voiceFirst: 'ಧ್ವನಿ + ಪಠ್ಯ', subtitle: 'ಸ್ಥಳೀಯ ವ್ಯವಹಾರ, ಹಣಕಾಸು & ಯೋಜನೆ ಸಲಹೆಗಾರ',
    greeting: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಜಿಲ್ಲೆ, ಕೌಶಲ್ಯ, ಬಂಡವಾಳ, ಭೂಮಿ, ಅನುಭವ ಮತ್ತು ವ್ಯವಹಾರ ಯೋಜನೆಯ ಆಧಾರದಲ್ಲಿ ಹೆಚ್ಚು ನಿರ್ದಿಷ್ಟ ಸಲಹೆ ನೀಡಬಹುದು. ವ್ಯವಹಾರ, ಗ್ರಾಹಕರು, ಬೆಲೆ, ಹಣಕಾಸು, ಯೋಜನೆಗಳು, ಅಪಾಯ, ಪರವಾನಗಿ ಅಥವಾ 90 ದಿನಗಳ ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ.',
    unsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು.',
    loading: 'NIRNAY AI ನಿಮ್ಮ ವ್ಯವಹಾರ ಸಂದರ್ಭವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...', suggested: 'ಸೂಚಿಸಿದ ಪ್ರಶ್ನೆಗಳು',
    placeholder: 'ವ್ಯವಹಾರ, ಹಣಕಾಸು, ಯೋಜನೆ ಅಥವಾ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಬಗ್ಗೆ ಕೇಳಿ...', listening: 'ಕೇಳುತ್ತಿದ್ದೇನೆ... ಈಗ ಮಾತನಾಡಿ', stop: 'ನಿಲ್ಲಿಸಿ',
    readAloud: 'ಉತ್ತರವನ್ನು ಕೇಳಿ', basis: 'ಆಧಾರ', fallbackBasis: 'NIRNAY ಸಲಹೆ ಸಂದರ್ಭ',
    error: 'ಸಲಹಾ ಎಂಜಿನ್‌ಗೆ ಸಂಪರ್ಕವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    prompts: ['90 ದಿನಗಳ ಕಾರ್ಯಯೋಜನೆ ನೀಡಿ', 'ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ಹಂಚಬೇಕು?', 'ಯಾವ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು?', 'ಮೊದಲ 20 ಗ್ರಾಹಕರನ್ನು ಹೇಗೆ ಪಡೆಯಬೇಕು?'],
  },
  gu: {
    title: 'NIRNAY AI ને પૂછો', voiceFirst: 'વૉઇસ + ટેક્સ્ટ', subtitle: 'સ્થાનિક બિઝનેસ, ફાઇનાન્સ અને યોજના સલાહકાર',
    greeting: 'નમસ્તે! તમારા જિલ્લો, કુશળતા, મૂડી, જમીન, અનુભવ અને બિઝનેસ પ્લાનના આધારે હું વધુ ચોક્કસ સલાહ આપી શકું છું. બિઝનેસ, ગ્રાહકો, ભાવ, ફાઇનાન્સ, યોજનાઓ, જોખમ, લાઇસન્સ અથવા 90 દિવસની યોજના વિશે પૂછો.',
    unsupported: 'આ બ્રાઉઝરમાં વૉઇસ ઇનપુટ ઉપલબ્ધ નથી. તમે પ્રશ્ન ટાઇપ કરી શકો છો.',
    loading: 'NIRNAY AI તમારા બિઝનેસ સંદર્ભનું વિશ્લેષણ કરી રહ્યું છે...', suggested: 'સૂચવેલા પ્રશ્નો',
    placeholder: 'બિઝનેસ, ફાઇનાન્સ, યોજના અથવા સ્થાનિક બજાર વિશે પૂછો...', listening: 'સાંભળી રહ્યો છું... હવે બોલો', stop: 'બંધ કરો',
    readAloud: 'જવાબ સાંભળો', basis: 'આધાર', fallbackBasis: 'NIRNAY સલાહ સંદર્ભ',
    error: 'સલાહ એન્જિન સુધી પહોંચી શકાયું નથી. ફરી પ્રયત્ન કરો.',
    prompts: ['90 દિવસની કાર્યયોજના આપો', 'મૂડી કેવી રીતે વહેંચું?', 'કઈ યોજનાઓ ચકાસવી?', 'પહેલા 20 ગ્રાહકો કેવી રીતે મેળવવા?'],
  },
  pa: {
    title: 'NIRNAY AI ਨੂੰ ਪੁੱਛੋ', voiceFirst: 'ਆਵਾਜ਼ + ਟੈਕਸਟ', subtitle: 'ਸਥਾਨਕ ਕਾਰੋਬਾਰ, ਵਿੱਤ ਅਤੇ ਯੋਜਨਾ ਸਲਾਹਕਾਰ',
    greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਡੇ ਜ਼ਿਲ੍ਹੇ, ਹੁਨਰ, ਪੂੰਜੀ, ਜ਼ਮੀਨ, ਤਜਰਬੇ ਅਤੇ ਕਾਰੋਬਾਰੀ ਯੋਜਨਾ ਦੇ ਆਧਾਰ ਤੇ ਮੈਂ ਹੋਰ ਖਾਸ ਸਲਾਹ ਦੇ ਸਕਦਾ ਹਾਂ। ਕਾਰੋਬਾਰ, ਗਾਹਕ, ਕੀਮਤ, ਵਿੱਤ, ਯੋਜਨਾਵਾਂ, ਖਤਰਾ, ਲਾਇਸੈਂਸ ਜਾਂ 90 ਦਿਨਾਂ ਦੀ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛੋ।',
    unsupported: 'ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਇਨਪੁੱਟ ਉਪਲਬਧ ਨਹੀਂ। ਤੁਸੀਂ ਸਵਾਲ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ।',
    loading: 'NIRNAY AI ਤੁਹਾਡੇ ਕਾਰੋਬਾਰੀ ਸੰਦਰਭ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...', suggested: 'ਸੁਝਾਏ ਸਵਾਲ',
    placeholder: 'ਕਾਰੋਬਾਰ, ਵਿੱਤ, ਯੋਜਨਾ ਜਾਂ ਸਥਾਨਕ ਮਾਰਕੀਟ ਬਾਰੇ ਪੁੱਛੋ...', listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਹੁਣ ਬੋਲੋ', stop: 'ਰੋਕੋ',
    readAloud: 'ਜਵਾਬ ਸੁਣੋ', basis: 'ਆਧਾਰ', fallbackBasis: 'NIRNAY ਸਲਾਹ ਸੰਦਰਭ',
    error: 'ਸਲਾਹ ਇੰਜਨ ਨਾਲ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    prompts: ['90 ਦਿਨਾਂ ਦੀ ਕਾਰਵਾਈ ਯੋਜਨਾ ਦਿਓ', 'ਪੂੰਜੀ ਕਿਵੇਂ ਵੰਡਾਂ?', 'ਕਿਹੜੀਆਂ ਯੋਜਨਾਵਾਂ ਜਾਂਚਾਂ?', 'ਪਹਿਲੇ 20 ਗਾਹਕ ਕਿਵੇਂ ਮਿਲਣਗੇ?'],
  },
};

function normalizeLanguage(value?: string): LanguageCode {
  return value && value in UI_COPY ? (value as LanguageCode) : 'en';
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose, context }) => {
  const language = normalizeLanguage(context.language);
  const copy = UI_COPY[language];
  const contextSignature = `${language}|${context.businessIdea || ''}|${context.district || ''}|${context.skill || ''}`;
  const previousContextRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isOpen) return;
    if (previousContextRef.current !== contextSignature) {
      setMessages([greeting]);
      setSuggestedPrompts(copy.prompts);
      previousContextRef.current = contextSignature;
    }
  }, [isOpen, contextSignature, greeting, copy.prompts]);

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
      const transcript = Array.from(event.results)
        .map((result: any) => result?.[0]?.transcript || '')
        .join('');
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

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

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

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const history: ChatHistoryMessage[] = messages.slice(-10).map((message) => ({
      role: message.role,
      text: message.text,
    }));

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askNirnayQuestion(query, { ...context, language }, history);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        text: response.answer,
        sources: response.sources,
        confidenceNote: response.confidenceNote,
      }]);
      if (response.followUps?.length) setSuggestedPrompts(response.followUps.slice(0, 4));
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: copy.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LOCALES[language];
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1B16]/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#D9B99B]/60 bg-white shadow-xl">
        <div className="flex items-center justify-between bg-[#4A2F24] px-5 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B9825B] text-sm font-extrabold text-white shadow-xs">N</div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold leading-none text-white">{copy.title}</h3>
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#F3E8DC]">{copy.voiceFirst}</span>
              </div>
              <span className="text-[11px] text-[#D9B99B]">{copy.subtitle}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-[#D9B99B] transition-colors hover:bg-white/10 hover:text-white" aria-label="Close chatbot">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-[#D9B99B]/40 bg-[#FFFDF8] px-4 py-2">
          {context.district && <span className="rounded-full bg-[#F3E8DC] px-2 py-1 text-[10px] font-bold text-[#6B4535]">{context.district}</span>}
          {context.skill && <span className="rounded-full bg-[#EEF0E3] px-2 py-1 text-[10px] font-bold text-[#56603F]">{context.skill}</span>}
          {context.margin ? <span className="rounded-full bg-[#FAF0E5] px-2 py-1 text-[10px] font-bold text-[#8B5E47]">₹{context.margin.toLocaleString('en-IN')}</span> : null}
          {context.experience && <span className="rounded-full bg-[#F4F0EA] px-2 py-1 text-[10px] font-bold text-[#6B4535]">{context.experience}</span>}
        </div>

        {!speechSupported && (
          <div className="flex items-center gap-1.5 border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[11px] text-amber-900">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span>{copy.unsupported}</span>
          </div>
        )}

        <div className="flex-1 space-y-3.5 overflow-y-auto bg-[#FAF7F3] p-4 text-xs">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${message.role === 'user' ? 'rounded-br-xs bg-[#6B4535] text-white' : 'rounded-bl-xs border border-[#D9B99B]/50 bg-white text-[#2B1B16] shadow-xs'}`}>
                {message.text}
                {message.role === 'assistant' && (
                  <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-[#F3E8DC] pt-2">
                    <div className="min-w-0">
                      <span className="block text-[10px] italic text-[#8B5E47]">
                        {copy.basis}: {message.sources?.length ? message.sources.join(' · ') : copy.fallbackBasis}
                      </span>
                      {message.confidenceNote && <span className="mt-0.5 block text-[10px] text-[#8B5E47]">{message.confidenceNote}</span>}
                    </div>
                    {'speechSynthesis' in window && (
                      <button onClick={() => speakText(message.text)} title={copy.readAloud} className="shrink-0 rounded p-1 text-[#8B5E47] transition-colors hover:bg-[#FAF7F3] hover:text-[#2B1B16]">
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#D9B99B]/40 bg-white/70 p-2 text-xs text-[#8B5E47]">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-[#6B4535]" />
              <span>{copy.loading}</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-[#D9B99B]/40 bg-white px-4 py-2.5">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#8B5E47]">{copy.suggested}</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedPrompts.map((prompt) => (
              <button key={prompt} onClick={() => void handleSendMessage(prompt)} disabled={isLoading} className="rounded-full border border-[#D9B99B]/60 bg-[#FAF7F3] px-2.5 py-1 text-left text-[11px] text-[#4A2F24] transition-colors hover:bg-[#F3E8DC] disabled:opacity-50">
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-[#D9B99B]/40 bg-white p-3.5">
          {isListening && (
            <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-700 animate-pulse">
              <span className="flex items-center gap-1.5 font-bold"><span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />{copy.listening}</span>
              <button onClick={toggleListening} className="text-[11px] font-extrabold underline hover:text-red-900">{copy.stop}</button>
            </div>
          )}

          <form onSubmit={(event) => { event.preventDefault(); void handleSendMessage(); }} className="flex items-center gap-2">
            {speechSupported && (
              <button type="button" onClick={toggleListening} className={`rounded-xl border p-2.5 transition-all ${isListening ? 'border-red-700 bg-red-600 text-white ring-2 ring-red-300' : 'border-[#D9B99B] bg-[#FAF7F3] text-[#6B4535] hover:bg-[#F3E8DC]'}`}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <input type="text" value={inputText} onChange={(event) => setInputText(event.target.value)} placeholder={copy.placeholder} disabled={isLoading} className="flex-1 rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-3.5 py-2 text-xs text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]" />
            <button type="submit" disabled={!inputText.trim() || isLoading} className="rounded-xl bg-[#4A2F24] p-2.5 text-white transition-colors hover:bg-[#2B1B16] disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
