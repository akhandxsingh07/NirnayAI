import type { LanguageCode } from '../types';
import { supabase } from '../lib/supabase';

export interface ChatContext {
  businessIdea?: string;
  category?: string;
  margin?: number;
  projectCost?: number;
  loan?: number;
  scheme?: string;
  language?: LanguageCode | string;
  district?: string;
  state?: string;
  skill?: string;
  landAcres?: number;
  experience?: string;
  risk?: string;
  targetMarket?: string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
  followUps?: string[];
  confidenceNote?: string;
}

const FALLBACK: Record<LanguageCode, (context: ChatContext) => ChatResponse> = {
  en: (c) => ({
    answer: `For ${c.businessIdea || c.category || 'your business'} in ${c.district || 'your district'}, I would first validate the local customer route${c.targetMarket ? ` (${c.targetMarket})` : ''}. Your selected skill is ${c.skill || 'not yet specified'} and available margin is ₹${(c.margin || 50000).toLocaleString('en-IN')}. Start with the smallest workable setup, keep a working-capital buffer, and test repeat demand before scaling. Scheme and loan eligibility should be verified on the official portal or with the lender before committing money.`,
    followUps: ['Give me a 90-day action plan', 'How should I split my capital?', 'Which schemes should I verify?'],
  }),
  hi: (c) => ({
    answer: `${c.district || 'आपके जिले'} में ${c.businessIdea || c.category || 'आपके व्यवसाय'} के लिए पहले स्थानीय ग्राहक और मांग की जांच करें${c.targetMarket ? ` — खासकर ${c.targetMarket}` : ''}। आपका चुना कौशल ${c.skill || 'अभी तय नहीं'} है और उपलब्ध मार्जिन ₹${(c.margin || 50000).toLocaleString('en-IN')} है। छोटे व्यवहारिक सेटअप से शुरू करें, वर्किंग कैपिटल बचाकर रखें और दोहराई मांग मिलने पर ही विस्तार करें। योजना और ऋण की अंतिम पात्रता आधिकारिक पोर्टल या बैंक से सत्यापित करें।`,
    followUps: ['90 दिन की कार्ययोजना बताएं', 'पूंजी कैसे बांटूं?', 'कौन-सी योजनाएं जांचूं?'],
  }),
  bn: (c) => ({
    answer: `${c.district || 'আপনার জেলায়'} ${c.businessIdea || c.category || 'আপনার ব্যবসা'} শুরু করার আগে স্থানীয় গ্রাহক ও চাহিদা যাচাই করুন। আপনার দক্ষতা ${c.skill || 'এখনও নির্ধারিত নয়'} এবং উপলব্ধ মার্জিন ₹${(c.margin || 50000).toLocaleString('en-IN')}। ছোট কার্যকর সেটআপ দিয়ে শুরু করুন, ওয়ার্কিং ক্যাপিটাল সংরক্ষণ করুন এবং পুনরাবৃত্ত চাহিদা প্রমাণ হলে তবেই বাড়ান। স্কিম ও ঋণের চূড়ান্ত যোগ্যতা অফিসিয়াল পোর্টাল বা ঋণদাতার কাছে যাচাই করুন।`,
    followUps: ['৯০ দিনের পরিকল্পনা দিন', 'মূলধন কীভাবে ভাগ করব?', 'কোন স্কিম যাচাই করব?'],
  }),
  mr: (c) => ({
    answer: `${c.district || 'तुमच्या जिल्ह्यात'} ${c.businessIdea || c.category || 'तुमच्या व्यवसायासाठी'} आधी स्थानिक ग्राहक व मागणी तपासा. तुमचे कौशल्य ${c.skill || 'अजून निवडलेले नाही'} आहे आणि उपलब्ध मार्जिन ₹${(c.margin || 50000).toLocaleString('en-IN')} आहे. लहान व्यवहार्य सेटअपने सुरुवात करा, वर्किंग कॅपिटल राखून ठेवा आणि पुनरावृत्ती मागणी सिद्ध झाल्यावरच विस्तार करा. योजना व कर्ज पात्रता अधिकृत पोर्टल किंवा बँकेकडून तपासा.`,
    followUps: ['90 दिवसांची कृती योजना द्या', 'भांडवल कसे विभागू?', 'कोणत्या योजना तपासू?'],
  }),
  ta: (c) => ({
    answer: `${c.district || 'உங்கள் மாவட்டத்தில்'} ${c.businessIdea || c.category || 'உங்கள் வணிகத்தை'} தொடங்குவதற்கு முன் உள்ளூர் வாடிக்கையாளர்கள் மற்றும் தேவையை சரிபார்க்கவும். உங்கள் திறன் ${c.skill || 'இன்னும் தேர்வு செய்யப்படவில்லை'}; கிடைக்கும் மார்ஜின் ₹${(c.margin || 50000).toLocaleString('en-IN')}. சிறிய செயல்பாட்டு அமைப்பில் தொடங்கி, பணிச்சுழற்சி நிதியை பாதுகாத்து, மீண்டும் வரும் தேவை நிரூபிக்கப்பட்ட பிறகே விரிவுபடுத்தவும். திட்டம் மற்றும் கடன் தகுதியை அதிகாரப்பூர்வ தளம் அல்லது வங்கியில் உறுதி செய்யவும்.`,
    followUps: ['90 நாள் செயல் திட்டம் தரவும்', 'முதல்தொகையை எப்படி பிரிப்பது?', 'எந்த திட்டங்களை சரிபார்க்க வேண்டும்?'],
  }),
  te: (c) => ({
    answer: `${c.district || 'మీ జిల్లాలో'} ${c.businessIdea || c.category || 'మీ వ్యాపారం'} ప్రారంభించే ముందు స్థానిక కస్టమర్లు మరియు డిమాండ్‌ను ధృవీకరించండి. మీ నైపుణ్యం ${c.skill || 'ఇంకా ఎంపిక కాలేదు'}; అందుబాటులో మార్జిన్ ₹${(c.margin || 50000).toLocaleString('en-IN')}. చిన్న పని చేయగల సెటప్‌తో ప్రారంభించి, వర్కింగ్ క్యాపిటల్‌ను కాపాడి, పునరావృత డిమాండ్ నిరూపితమైన తర్వాతే విస్తరించండి. పథకం మరియు రుణ అర్హతను అధికారిక పోర్టల్ లేదా బ్యాంకుతో ధృవీకరించండి.`,
    followUps: ['90 రోజుల కార్యాచరణ ప్రణాళిక ఇవ్వండి', 'మూలధనాన్ని ఎలా విభజించాలి?', 'ఏ పథకాలు ధృవీకరించాలి?'],
  }),
  kn: (c) => ({
    answer: `${c.district || 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯಲ್ಲಿ'} ${c.businessIdea || c.category || 'ನಿಮ್ಮ ವ್ಯವಹಾರ'} ಆರಂಭಿಸುವ ಮೊದಲು ಸ್ಥಳೀಯ ಗ್ರಾಹಕರು ಮತ್ತು ಬೇಡಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ನಿಮ್ಮ ಕೌಶಲ್ಯ ${c.skill || 'ಇನ್ನೂ ಆಯ್ಕೆ ಆಗಿಲ್ಲ'}; ಲಭ್ಯ ಮಾರ್ಜಿನ್ ₹${(c.margin || 50000).toLocaleString('en-IN')}. ಸಣ್ಣ ಕಾರ್ಯನಿರ್ವಹಣೆಯ ಸೆಟಪ್‌ನಿಂದ ಆರಂಭಿಸಿ, ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಉಳಿಸಿ ಮತ್ತು ಮರುಬೇಡಿಕೆ ದೃಢಪಟ್ಟ ನಂತರವೇ ವಿಸ್ತರಿಸಿ. ಯೋಜನೆ ಮತ್ತು ಸಾಲ ಅರ್ಹತೆಯನ್ನು ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಿ.`,
    followUps: ['90 ದಿನಗಳ ಕಾರ್ಯಯೋಜನೆ ನೀಡಿ', 'ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ಹಂಚಬೇಕು?', 'ಯಾವ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು?'],
  }),
  gu: (c) => ({
    answer: `${c.district || 'તમારા જિલ્લામાં'} ${c.businessIdea || c.category || 'તમારા વ્યવસાય'} માટે પહેલા સ્થાનિક ગ્રાહકો અને માંગ ચકાસો. તમારી કુશળતા ${c.skill || 'હજુ પસંદ નથી'} છે અને ઉપલબ્ધ માર્જિન ₹${(c.margin || 50000).toLocaleString('en-IN')} છે. નાનાં કાર્યક્ષમ સેટઅપથી શરૂઆત કરો, વર્કિંગ કેપિટલ બચાવો અને પુનરાવર્તિત માંગ સાબિત થયા પછી જ વધારો. યોજના અને લોનની અંતિમ પાત્રતા અધિકૃત પોર્ટલ અથવા બેંક સાથે ચકાસો.`,
    followUps: ['90 દિવસની કાર્યયોજના આપો', 'મૂડી કેવી રીતે વહેંચું?', 'કઈ યોજનાઓ ચકાસવી?'],
  }),
  pa: (c) => ({
    answer: `${c.district || 'ਤੁਹਾਡੇ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ'} ${c.businessIdea || c.category || 'ਤੁਹਾਡੇ ਕਾਰੋਬਾਰ'} ਲਈ ਪਹਿਲਾਂ ਸਥਾਨਕ ਗਾਹਕ ਅਤੇ ਮੰਗ ਦੀ ਜਾਂਚ ਕਰੋ। ਤੁਹਾਡਾ ਹੁਨਰ ${c.skill || 'ਹਾਲੇ ਚੁਣਿਆ ਨਹੀਂ'} ਹੈ ਅਤੇ ਉਪਲਬਧ ਮਾਰਜਿਨ ₹${(c.margin || 50000).toLocaleString('en-IN')} ਹੈ। ਛੋਟੇ ਕਾਰਗਰ ਸੈਟਅਪ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ, ਵਰਕਿੰਗ ਕੈਪਿਟਲ ਬਚਾ ਕੇ ਰੱਖੋ ਅਤੇ ਦੁਹਰਾਈ ਮੰਗ ਸਾਬਤ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਵਧਾਓ। ਯੋਜਨਾ ਅਤੇ ਕਰਜ਼ੇ ਦੀ ਅੰਤਿਮ ਯੋਗਤਾ ਸਰਕਾਰੀ ਪੋਰਟਲ ਜਾਂ ਬੈਂਕ ਨਾਲ ਜਾਂਚੋ।`,
    followUps: ['90 ਦਿਨਾਂ ਦੀ ਕਾਰਵਾਈ ਯੋਜਨਾ ਦਿਓ', 'ਪੂੰਜੀ ਕਿਵੇਂ ਵੰਡਾਂ?', 'ਕਿਹੜੀਆਂ ਯੋਜਨਾਵਾਂ ਜਾਂਚਾਂ?'],
  }),
};

export async function askNirnayQuestion(
  question: string,
  context: ChatContext,
  history: ChatHistoryMessage[] = []
): Promise<ChatResponse> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ question, context, history: history.slice(-10) }),
    });

    if (res.ok) {
      const payload = await res.json();
      if (payload?.answer) {
        return {
          answer: payload.answer,
          sources: payload.sources,
          followUps: payload.followUps,
          confidenceNote: payload.confidenceNote,
        };
      }
    }
  } catch {
    // Use a localized offline-safe answer below.
  }

  const language = ((context.language || 'en') as LanguageCode);
  const factory = FALLBACK[language] || FALLBACK.en;
  return {
    ...factory(context),
    sources: ['NIRNAY AI local advisory fallback'],
  };
}
