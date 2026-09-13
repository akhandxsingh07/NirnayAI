import {
  AssessmentFormData,
  FeasibilityScoreData,
  SWOTData,
  LocalOpportunityData,
  BusinessCategory,
  LanguageCode,
} from '../types';
import {
  DEMO_LOCAL_OPPORTUNITY,
} from '../utils/demoData';
import { supabase } from '../lib/supabase';

export interface AIAnalysisResponse {
  feasibilityScore: FeasibilityScoreData;
  recommendation: string;
  swot: SWOTData;
  insights: Array<{ title: string; description: string; tag: string }>;
  localOpportunity: LocalOpportunityData;
  isAiGenerated: boolean;
}

type LocalCopy = {
  status: string;
  recommendation: string;
  strengthSkill: string;
  strengthCapital: string;
  weaknessValidate: string;
  opportunityDistrict: string;
  threatCompetition: string;
  insightMarketTitle: string;
  insightMarketText: string;
  insightPilotTitle: string;
  insightPilotText: string;
  insightCashTitle: string;
  insightCashText: string;
  demand: string;
  gap: string;
  competition: string;
  radius: string;
  primaryProduct: string;
  secondaryProduct: string;
  institutional: string;
};

const FALLBACK_COPY: Record<LanguageCode, LocalCopy> = {
  en: {
    status: 'Promising — validate locally and scale in stages',
    recommendation: 'Your {business} plan in {district} fits your {skill} background and available resources. Start with the local route already identified for this district: {route}. Keep the first setup deliberately small, validate repeat demand, then expand capacity. Verify licences, current scheme eligibility and supplier pricing before committing the full capital.',
    strengthSkill: 'The selected skill directly supports day-to-day execution.',
    strengthCapital: 'Available capital can support a controlled pilot instead of an oversized launch.',
    weaknessValidate: 'Local demand and competitor pricing still need field validation.',
    opportunityDistrict: 'The selected district offers a distinct customer route that can be tested before expansion.',
    threatCompetition: 'Established local sellers may respond on price, convenience or credit.',
    insightMarketTitle: 'Validate the district route first',
    insightMarketText: 'Speak to likely buyers in the selected district and secure early orders before major fixed-cost spending.',
    insightPilotTitle: 'Launch as a measured pilot',
    insightPilotText: 'Use the smallest workable equipment and inventory setup for the first 30–45 days.',
    insightCashTitle: 'Protect working capital',
    insightCashText: 'Keep a cash buffer for delayed sales, repairs, raw-material swings and customer credit.',
    demand: '{business} has a plausible local demand route in {district}, but exact demand should be verified through customer interviews and test sales.',
    gap: 'A possible gap is reliable quality, faster service or more organized delivery compared with informal alternatives in {district}.',
    competition: 'Qualitative: likely mixed; verify nearby organized and informal competitors before launch.',
    radius: 'Start with a 3–8 km test cluster, then widen only after repeat demand.',
    primaryProduct: 'Core high-frequency offer', secondaryProduct: 'Value-added secondary offer', institutional: 'Bulk / institutional package',
  },
  hi: {
    status: 'संभावनाशील — स्थानीय सत्यापन के बाद चरणबद्ध विस्तार करें',
    recommendation: '{district} में आपका {business} प्लान आपके {skill} कौशल और उपलब्ध संसाधनों से मेल खाता है। इस जिले के लिए पहचाने गए स्थानीय मार्ग से शुरुआत करें: {route}। पहला सेटअप छोटा रखें, दोहराई मांग जांचें और फिर क्षमता बढ़ाएं। पूरी पूंजी लगाने से पहले लाइसेंस, वर्तमान योजना पात्रता और सप्लायर कीमतें जांचें।',
    strengthSkill: 'चुना गया कौशल रोजमर्रा के संचालन में सीधे मदद करता है।', strengthCapital: 'उपलब्ध पूंजी नियंत्रित पायलट के लिए पर्याप्त आधार देती है।', weaknessValidate: 'स्थानीय मांग और प्रतियोगी कीमतों का मैदान में सत्यापन अभी बाकी है।', opportunityDistrict: 'चुना गया जिला विस्तार से पहले जांचने योग्य अलग ग्राहक मार्ग देता है।', threatCompetition: 'स्थानीय स्थापित विक्रेता कीमत, सुविधा या उधार से मुकाबला कर सकते हैं।', insightMarketTitle: 'पहले जिला बाजार मार्ग जांचें', insightMarketText: 'बड़े स्थायी खर्च से पहले संभावित खरीदारों से बात करें और शुरुआती ऑर्डर लें।', insightPilotTitle: 'नियंत्रित पायलट से शुरू करें', insightPilotText: 'पहले 30–45 दिनों में न्यूनतम व्यवहारिक उपकरण और स्टॉक रखें।', insightCashTitle: 'वर्किंग कैपिटल बचाएं', insightCashText: 'धीमी बिक्री, रिपेयर, कच्चे माल की कीमत और ग्राहक उधार के लिए कैश बफर रखें।', demand: '{district} में {business} के लिए संभावित स्थानीय मांग मार्ग है, लेकिन ग्राहक इंटरव्यू और टेस्ट बिक्री से सत्यापन जरूरी है।', gap: '{district} में अनौपचारिक विकल्पों की तुलना में भरोसेमंद गुणवत्ता, तेज सेवा या व्यवस्थित डिलीवरी एक संभावित गैप हो सकता है।', competition: 'गुणात्मक: मिश्रित रहने की संभावना; लॉन्च से पहले नजदीकी संगठित और अनौपचारिक प्रतियोगियों की जांच करें।', radius: '3–8 किमी के टेस्ट क्लस्टर से शुरू करें और दोहराई मांग पर ही विस्तार करें।', primaryProduct: 'मुख्य तेज-बिक्री ऑफर', secondaryProduct: 'वैल्यू-एडेड सेकेंडरी ऑफर', institutional: 'बल्क / संस्थागत पैकेज',
  },
  bn: {
    status: 'সম্ভাবনাময় — স্থানীয় যাচাই করে ধাপে ধাপে বাড়ান',
    recommendation: '{district}-এ আপনার {business} পরিকল্পনা আপনার {skill} দক্ষতা ও সম্পদের সঙ্গে মানানসই। জেলার জন্য নির্ধারিত স্থানীয় পথ দিয়ে শুরু করুন: {route}। প্রথম সেটআপ ছোট রাখুন, পুনরাবৃত্ত চাহিদা যাচাই করুন, তারপর ক্ষমতা বাড়ান। পুরো মূলধন দেওয়ার আগে লাইসেন্স, স্কিম যোগ্যতা ও সরবরাহকারীর দাম যাচাই করুন।',
    strengthSkill: 'নির্বাচিত দক্ষতা দৈনন্দিন পরিচালনায় সরাসরি সহায়তা করে।', strengthCapital: 'উপলব্ধ মূলধন নিয়ন্ত্রিত পাইলটের জন্য ভালো ভিত্তি দেয়।', weaknessValidate: 'স্থানীয় চাহিদা ও প্রতিযোগীর দাম মাঠে যাচাই করা বাকি।', opportunityDistrict: 'নির্বাচিত জেলা বিস্তারের আগে পরীক্ষাযোগ্য আলাদা গ্রাহক পথ দেয়।', threatCompetition: 'স্থানীয় প্রতিষ্ঠিত বিক্রেতারা দাম, সুবিধা বা ক্রেডিট দিয়ে প্রতিযোগিতা করতে পারে।', insightMarketTitle: 'আগে জেলা বাজার পথ যাচাই করুন', insightMarketText: 'বড় স্থায়ী খরচের আগে সম্ভাব্য ক্রেতাদের সাথে কথা বলে প্রাথমিক অর্ডার নিন।', insightPilotTitle: 'পরিমিত পাইলট দিয়ে শুরু করুন', insightPilotText: 'প্রথম ৩০–৪৫ দিনে সর্বনিম্ন কার্যকর সরঞ্জাম ও স্টক রাখুন।', insightCashTitle: 'ওয়ার্কিং ক্যাপিটাল রক্ষা করুন', insightCashText: 'ধীর বিক্রি, মেরামত, কাঁচামালের দাম ও গ্রাহক ক্রেডিটের জন্য নগদ বাফার রাখুন।', demand: '{district}-এ {business}-এর সম্ভাব্য স্থানীয় চাহিদা পথ আছে, তবে গ্রাহক সাক্ষাৎকার ও টেস্ট বিক্রিতে যাচাই দরকার।', gap: '{district}-এ অনানুষ্ঠানিক বিকল্পের তুলনায় নির্ভরযোগ্য মান, দ্রুত সেবা বা সংগঠিত ডেলিভারি সম্ভাব্য ফাঁক।', competition: 'গুণগতভাবে মিশ্র হতে পারে; লঞ্চের আগে কাছাকাছি প্রতিযোগী যাচাই করুন।', radius: '৩–৮ কিমি টেস্ট ক্লাস্টার দিয়ে শুরু করে পুনরাবৃত্ত চাহিদায় বিস্তৃত করুন।', primaryProduct: 'মূল উচ্চ-চাহিদা অফার', secondaryProduct: 'ভ্যালু-অ্যাডেড দ্বিতীয় অফার', institutional: 'বাল্ক / প্রাতিষ্ঠানিক প্যাকেজ',
  },
  mr: {
    status: 'आशादायक — स्थानिक पडताळणीनंतर टप्प्याटप्प्याने वाढवा',
    recommendation: '{district} मधील तुमचा {business} प्लॅन तुमच्या {skill} कौशल्य आणि उपलब्ध साधनांशी जुळतो. जिल्ह्यासाठी ठरवलेल्या स्थानिक मार्गाने सुरुवात करा: {route}. पहिला सेटअप लहान ठेवा, पुनरावृत्ती मागणी तपासा आणि मग क्षमता वाढवा. पूर्ण भांडवल गुंतवण्यापूर्वी परवाने, योजना पात्रता आणि पुरवठादार किंमती तपासा.',
    strengthSkill: 'निवडलेले कौशल्य रोजच्या कामकाजाला थेट मदत करते.', strengthCapital: 'उपलब्ध भांडवल नियंत्रित पायलटसाठी चांगला आधार देते.', weaknessValidate: 'स्थानिक मागणी व स्पर्धक किंमतींची क्षेत्रीय पडताळणी आवश्यक आहे.', opportunityDistrict: 'निवडलेला जिल्हा विस्तारापूर्वी तपासता येईल असा वेगळा ग्राहक मार्ग देतो.', threatCompetition: 'स्थानिक विक्रेते किंमत, सोय किंवा उधारीवर स्पर्धा करू शकतात.', insightMarketTitle: 'प्रथम जिल्हा बाजार मार्ग तपासा', insightMarketText: 'मोठ्या स्थिर खर्चापूर्वी संभाव्य ग्राहकांशी बोलून सुरुवातीचे ऑर्डर मिळवा.', insightPilotTitle: 'मोजक्या पायलटने सुरुवात करा', insightPilotText: 'पहिल्या 30–45 दिवसांत किमान आवश्यक उपकरणे आणि स्टॉक ठेवा.', insightCashTitle: 'वर्किंग कॅपिटल जपा', insightCashText: 'मंद विक्री, दुरुस्ती, कच्चा माल आणि उधारीसाठी रोख राखीव ठेवा.', demand: '{district} मध्ये {business} साठी संभाव्य स्थानिक मागणी मार्ग आहे; ग्राहक मुलाखती व टेस्ट विक्रीने पडताळा करा.', gap: '{district} मध्ये अनौपचारिक पर्यायांपेक्षा विश्वासार्ह गुणवत्ता, जलद सेवा किंवा व्यवस्थित डिलिव्हरी हा संभाव्य गॅप आहे.', competition: 'गुणात्मकदृष्ट्या मिश्र; लॉन्चपूर्वी जवळचे स्पर्धक तपासा.', radius: '3–8 किमी टेस्ट क्लस्टरपासून सुरुवात करा आणि पुनरावृत्ती मागणीनंतर वाढवा.', primaryProduct: 'मुख्य जलद-विक्री ऑफर', secondaryProduct: 'मूल्यवर्धित दुय्यम ऑफर', institutional: 'बल्क / संस्थात्मक पॅकेज',
  },
  ta: {
    status: 'நம்பிக்கையளிக்கும் — உள்ளூர் சரிபார்ப்புடன் கட்டப்படியாக வளர்க்கவும்',
    recommendation: '{district} இல் உங்கள் {business} திட்டம் உங்கள் {skill} திறன் மற்றும் வளங்களுடன் பொருந்துகிறது. மாவட்டத்திற்கான உள்ளூர் பாதையுடன் தொடங்குங்கள்: {route}. முதல் அமைப்பை சிறியதாக வைத்துக் கொண்டு மீண்டும் வரும் தேவையை சரிபார்த்து பின்னர் விரிவுபடுத்துங்கள். முழு முதலீட்டுக்கு முன் உரிமங்கள், திட்ட தகுதி மற்றும் சப்ளையர் விலைகளை சரிபார்க்கவும்.',
    strengthSkill: 'தேர்ந்தெடுத்த திறன் தினசரி செயல்பாட்டை நேரடியாக ஆதரிக்கிறது.', strengthCapital: 'கிடைக்கும் முதல்தொகை கட்டுப்படுத்தப்பட்ட பைலட்டுக்கு நல்ல அடிப்படை.', weaknessValidate: 'உள்ளூர் தேவை மற்றும் போட்டியாளர் விலை களத்தில் சரிபார்க்கப்பட வேண்டும்.', opportunityDistrict: 'தேர்ந்தெடுத்த மாவட்டம் விரிவாக்கத்திற்கு முன் சோதிக்கக்கூடிய தனிப்பட்ட வாடிக்கையாளர் பாதை தருகிறது.', threatCompetition: 'உள்ளூர் விற்பனையாளர்கள் விலை, வசதி அல்லது கடன் மூலம் போட்டியிடலாம்.', insightMarketTitle: 'மாவட்ட சந்தை பாதையை முதலில் சரிபார்க்கவும்', insightMarketText: 'பெரிய நிலையான செலவுக்கு முன் வாங்குபவர்களுடன் பேசி ஆரம்ப ஆர்டர்களை பெறுங்கள்.', insightPilotTitle: 'கட்டுப்படுத்தப்பட்ட பைலட்டுடன் தொடங்குங்கள்', insightPilotText: 'முதல் 30–45 நாட்களுக்கு குறைந்தபட்ச செயல்பாட்டு உபகரணம் மற்றும் ஸ்டாக் போதும்.', insightCashTitle: 'சுழற்சி முதல்தொகையை பாதுகாக்கவும்', insightCashText: 'மெதுவான விற்பனை, பழுது, மூலப்பொருள் விலை மற்றும் கடனுக்காக பண கையிருப்பு வைத்திருங்கள்.', demand: '{district} இல் {business}க்கு சாத்தியமான உள்ளூர் தேவை பாதை உள்ளது; வாடிக்கையாளர் பேட்டி மற்றும் சோதனை விற்பனையால் உறுதி செய்யவும்.', gap: '{district} இல் நம்பகமான தரம், வேகமான சேவை அல்லது ஒழுங்கான விநியோகம் ஒரு சாத்தியமான இடைவெளி.', competition: 'தரநிலை அடிப்படையில் கலப்பு; தொடங்குவதற்கு முன் அருகிலுள்ள போட்டியாளர்களை சரிபார்க்கவும்.', radius: '3–8 கிமீ சோதனை கிளஸ்டரில் தொடங்கி மீண்டும் வரும் தேவைக்கு பிறகு விரிவுபடுத்தவும்.', primaryProduct: 'முக்கிய அதிக-அடிக்கடி ஆஃபர்', secondaryProduct: 'மதிப்பு கூட்டிய இரண்டாம் ஆஃபர்', institutional: 'மொத்த / நிறுவன தொகுப்பு',
  },
  te: {
    status: 'ఆశాజనకం — స్థానిక ధృవీకరణతో దశలవారీగా విస్తరించండి',
    recommendation: '{district}లో మీ {business} ప్లాన్ మీ {skill} నైపుణ్యం మరియు వనరులకు సరిపోతుంది. జిల్లాకు గుర్తించిన స్థానిక మార్గంతో ప్రారంభించండి: {route}. మొదటి సెటప్ చిన్నగా ఉంచి పునరావృత డిమాండ్‌ను పరీక్షించి తరువాత సామర్థ్యం పెంచండి. పూర్తి పెట్టుబడి ముందు లైసెన్సులు, పథకం అర్హత మరియు సరఫరాదారు ధరలను ధృవీకరించండి.',
    strengthSkill: 'ఎంచుకున్న నైపుణ్యం రోజువారీ నిర్వహణకు నేరుగా సహాయం చేస్తుంది.', strengthCapital: 'అందుబాటులో మూలధనం నియంత్రిత పైలట్‌కు మంచి ఆధారం.', weaknessValidate: 'స్థానిక డిమాండ్ మరియు పోటీ ధరలు క్షేత్రస్థాయిలో ధృవీకరించాలి.', opportunityDistrict: 'ఎంచుకున్న జిల్లా విస్తరణకు ముందు పరీక్షించగల ప్రత్యేక కస్టమర్ మార్గం ఇస్తుంది.', threatCompetition: 'స్థానిక విక్రేతలు ధర, సౌలభ్యం లేదా క్రెడిట్‌తో పోటీ చేయవచ్చు.', insightMarketTitle: 'ముందుగా జిల్లా మార్కెట్ మార్గాన్ని ధృవీకరించండి', insightMarketText: 'పెద్ద స్థిర ఖర్చు ముందు సంభావ్య కొనుగోలుదారులతో మాట్లాడి ప్రారంభ ఆర్డర్లు పొందండి.', insightPilotTitle: 'నియంత్రిత పైలట్‌తో ప్రారంభించండి', insightPilotText: 'మొదటి 30–45 రోజుల్లో కనీస అవసరమైన పరికరాలు మరియు స్టాక్‌తో ప్రారంభించండి.', insightCashTitle: 'వర్కింగ్ క్యాపిటల్‌ను కాపాడండి', insightCashText: 'నెమ్మదైన అమ్మకాలు, రిపేర్, ముడి సరుకు ధరలు మరియు క్రెడిట్ కోసం నగదు బఫర్ ఉంచండి.', demand: '{district}లో {business}కు సాధ్యమైన స్థానిక డిమాండ్ మార్గం ఉంది; కస్టమర్ ఇంటర్వ్యూలు మరియు టెస్ట్ సేల్స్‌తో ధృవీకరించండి.', gap: '{district}లో నమ్మదగిన నాణ్యత, వేగవంతమైన సేవ లేదా క్రమబద్ధమైన డెలివరీ ఒక సాధ్యమైన గ్యాప్.', competition: 'గుణాత్మకంగా మిశ్రమం; ప్రారంభానికి ముందు సమీప పోటీదారులను పరిశీలించండి.', radius: '3–8 కి.మీ టెస్ట్ క్లస్టర్‌తో ప్రారంభించి పునరావృత డిమాండ్ తరువాత విస్తరించండి.', primaryProduct: 'ప్రధాన అధిక-ఫ్రీక్వెన్సీ ఆఫర్', secondaryProduct: 'విలువ జోడించిన రెండవ ఆఫర్', institutional: 'బల్క్ / సంస్థాగత ప్యాకేజ్',
  },
  kn: {
    status: 'ಆಶಾದಾಯಕ — ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ಹಂತ ಹಂತವಾಗಿ ವಿಸ್ತರಿಸಿ',
    recommendation: '{district}ದಲ್ಲಿ ನಿಮ್ಮ {business} ಯೋಜನೆ ನಿಮ್ಮ {skill} ಕೌಶಲ್ಯ ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳಿಗೆ ಹೊಂದುತ್ತದೆ. ಜಿಲ್ಲೆಗೆ ಗುರುತಿಸಿದ ಸ್ಥಳೀಯ ಮಾರ್ಗದಿಂದ ಪ್ರಾರಂಭಿಸಿ: {route}. ಮೊದಲ ಸೆಟಪ್ ಚಿಕ್ಕದಾಗಿ ಇಟ್ಟು ಮರುಬೇಡಿಕೆ ಪರೀಕ್ಷಿಸಿ ನಂತರ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಿಸಿ. ಪೂರ್ಣ ಬಂಡವಾಳ ಮೊದಲು ಪರವಾನಗಿ, ಯೋಜನೆ ಅರ್ಹತೆ ಮತ್ತು ಸರಬರಾಜುದಾರ ಬೆಲೆ ಪರಿಶೀಲಿಸಿ.',
    strengthSkill: 'ಆಯ್ಕೆಮಾಡಿದ ಕೌಶಲ್ಯ ದಿನನಿತ್ಯದ ಕಾರ್ಯಾಚರಣೆಗೆ ನೇರವಾಗಿ ಸಹಾಯ ಮಾಡುತ್ತದೆ.', strengthCapital: 'ಲಭ್ಯ ಬಂಡವಾಳ ನಿಯಂತ್ರಿತ ಪೈಲಟ್‌ಗೆ ಉತ್ತಮ ಆಧಾರ.', weaknessValidate: 'ಸ್ಥಳೀಯ ಬೇಡಿಕೆ ಮತ್ತು ಸ್ಪರ್ಧಿ ಬೆಲೆಗಳನ್ನು ಕ್ಷೇತ್ರದಲ್ಲಿ ಪರಿಶೀಲಿಸಬೇಕು.', opportunityDistrict: 'ಆಯ್ಕೆಮಾಡಿದ ಜಿಲ್ಲೆ ವಿಸ್ತರಣೆಗೆ ಮೊದಲು ಪರೀಕ್ಷಿಸಬಹುದಾದ ವಿಭಿನ್ನ ಗ್ರಾಹಕ ಮಾರ್ಗ ನೀಡುತ್ತದೆ.', threatCompetition: 'ಸ್ಥಳೀಯ ಮಾರಾಟಗಾರರು ಬೆಲೆ, ಸೌಕರ್ಯ ಅಥವಾ ಕ್ರೆಡಿಟ್‌ನಲ್ಲಿ ಸ್ಪರ್ಧಿಸಬಹುದು.', insightMarketTitle: 'ಮೊದಲು ಜಿಲ್ಲಾ ಮಾರುಕಟ್ಟೆ ಮಾರ್ಗ ಪರಿಶೀಲಿಸಿ', insightMarketText: 'ದೊಡ್ಡ ಸ್ಥಿರ ವೆಚ್ಚಕ್ಕೂ ಮೊದಲು ಸಾಧ್ಯ ಖರೀದಿದಾರರೊಂದಿಗೆ ಮಾತನಾಡಿ ಆರಂಭಿಕ ಆರ್ಡರ್ ಪಡೆಯಿರಿ.', insightPilotTitle: 'ನಿಯಂತ್ರಿತ ಪೈಲಟ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಿ', insightPilotText: 'ಮೊದಲ 30–45 ದಿನಗಳಿಗೆ ಕನಿಷ್ಠ ಅಗತ್ಯ ಉಪಕರಣ ಮತ್ತು ಸ್ಟಾಕ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಿ.', insightCashTitle: 'ಕಾರ್ಯ ಬಂಡವಾಳವನ್ನು ರಕ್ಷಿಸಿ', insightCashText: 'ಮಂದ ಮಾರಾಟ, ರಿಪೇರಿ, ಕಚ್ಚಾ ವಸ್ತು ಬೆಲೆ ಮತ್ತು ಕ್ರೆಡಿಟ್‌ಗೆ ನಗದು ಬಫರ್ ಇಡಿ.', demand: '{district}ದಲ್ಲಿ {business}ಗೆ ಸಾಧ್ಯ ಸ್ಥಳೀಯ ಬೇಡಿಕೆ ಮಾರ್ಗ ಇದೆ; ಗ್ರಾಹಕ ಸಂದರ್ಶನ ಮತ್ತು ಟೆಸ್ಟ್ ಮಾರಾಟದಿಂದ ಪರಿಶೀಲಿಸಿ.', gap: '{district}ದಲ್ಲಿ ವಿಶ್ವಾಸಾರ್ಹ ಗುಣಮಟ್ಟ, ವೇಗದ ಸೇವೆ ಅಥವಾ ಸಂಘಟಿತ ವಿತರಣೆ ಒಂದು ಸಾಧ್ಯ ಗ್ಯಾಪ್.', competition: 'ಗುಣಾತ್ಮಕವಾಗಿ ಮಿಶ್ರ; ಆರಂಭಕ್ಕೂ ಮೊದಲು ಸಮೀಪದ ಸ್ಪರ್ಧಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.', radius: '3–8 ಕಿಮೀ ಟೆಸ್ಟ್ ಕ್ಲಸ್ಟರ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಿ ಮರುಬೇಡಿಕೆಯ ನಂತರ ವಿಸ್ತರಿಸಿ.', primaryProduct: 'ಮುಖ್ಯ ಹೆಚ್ಚಿನ-ಆವೃತ್ತಿ ಆಫರ್', secondaryProduct: 'ಮೌಲ್ಯವರ್ಧಿತ ಎರಡನೇ ಆಫರ್', institutional: 'ಬಲ್ಕ್ / ಸಂಸ್ಥಾತ್ಮಕ ಪ್ಯಾಕೇಜ್',
  },
  gu: {
    status: 'આશાસ્પદ — સ્થાનિક ચકાસણી સાથે તબક્કાવાર વધારો',
    recommendation: '{district}માં તમારો {business} પ્લાન તમારી {skill} કુશળતા અને ઉપલબ્ધ સંસાધનો સાથે મેળ ખાય છે. જિલ્લાની ઓળખેલી સ્થાનિક રૂટથી શરૂઆત કરો: {route}. પહેલું સેટઅપ નાનું રાખો, પુનરાવર્તિત માંગ ચકાસો અને પછી ક્ષમતા વધારો. સંપૂર્ણ મૂડી લગાડતા પહેલાં લાઇસન્સ, યોજના પાત્રતા અને સપ્લાયર ભાવ ચકાસો.',
    strengthSkill: 'પસંદ કરેલી કુશળતા દૈનિક કામગીરીને સીધી મદદ કરે છે.', strengthCapital: 'ઉપલબ્ધ મૂડી નિયંત્રિત પાઇલટ માટે સારો આધાર આપે છે.', weaknessValidate: 'સ્થાનિક માંગ અને સ્પર્ધક ભાવનું મેદાની ચકાસણું બાકી છે.', opportunityDistrict: 'પસંદ જિલ્લો વિસ્તરણ પહેલાં ચકાસી શકાય તેવી અલગ ગ્રાહક રૂટ આપે છે.', threatCompetition: 'સ્થાનિક વેચાણકાર ભાવ, સુવિધા અથવા ક્રેડિટથી સ્પર્ધા કરી શકે છે.', insightMarketTitle: 'પહેલા જિલ્લાની માર્કેટ રૂટ ચકાસો', insightMarketText: 'મોટા સ્થિર ખર્ચ પહેલાં સંભવિત ખરીદદારો સાથે વાત કરી પ્રારંભિક ઓર્ડર મેળવો.', insightPilotTitle: 'નિયંત્રિત પાઇલટથી શરૂઆત કરો', insightPilotText: 'પ્રથમ 30–45 દિવસ માટે ન્યૂનતમ જરૂરી સાધન અને સ્ટોક રાખો.', insightCashTitle: 'વર્કિંગ કેપિટલ બચાવો', insightCashText: 'ધીમા વેચાણ, રિપેર, કાચા માલના ભાવ અને ક્રેડિટ માટે કેશ બફર રાખો.', demand: '{district}માં {business} માટે સંભવિત સ્થાનિક માંગ રૂટ છે; ગ્રાહક ઇન્ટરવ્યૂ અને ટેસ્ટ વેચાણથી ચકાસો.', gap: '{district}માં વિશ્વસનીય ગુણવત્તા, ઝડપી સેવા અથવા વ્યવસ્થિત ડિલિવરી એક સંભવિત ગેપ છે.', competition: 'ગુણાત્મક રીતે મિશ્ર; લોન્ચ પહેલાં નજીકના સ્પર્ધકો ચકાસો.', radius: '3–8 કિમી ટેસ્ટ ક્લસ્ટરથી શરૂ કરી પુનરાવર્તિત માંગ પછી વધારો.', primaryProduct: 'મુખ્ય ઝડપી વેચાણ ઓફર', secondaryProduct: 'વેલ્યૂ-એડેડ સેકન્ડરી ઓફર', institutional: 'બલ્ક / સંસ્થાકીય પેકેજ',
  },
  pa: {
    status: 'ਉਮੀਦਵਾਰ — ਸਥਾਨਕ ਜਾਂਚ ਨਾਲ ਪੜਾਅਵਾਰ ਵਧਾਓ',
    recommendation: '{district} ਵਿੱਚ ਤੁਹਾਡਾ {business} ਪਲਾਨ ਤੁਹਾਡੇ {skill} ਹੁਨਰ ਅਤੇ ਉਪਲਬਧ ਸਰੋਤਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ। ਜ਼ਿਲ੍ਹੇ ਲਈ ਪਛਾਣੇ ਸਥਾਨਕ ਰੂਟ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ: {route}। ਪਹਿਲਾ ਸੈਟਅਪ ਛੋਟਾ ਰੱਖੋ, ਦੁਹਰਾਈ ਮੰਗ ਜਾਂਚੋ ਅਤੇ ਫਿਰ ਸਮਰੱਥਾ ਵਧਾਓ। ਪੂਰੀ ਪੂੰਜੀ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਲਾਇਸੈਂਸ, ਯੋਜਨਾ ਯੋਗਤਾ ਅਤੇ ਸਪਲਾਇਰ ਕੀਮਤ ਜਾਂਚੋ।',
    strengthSkill: 'ਚੁਣਿਆ ਹੁਨਰ ਰੋਜ਼ਾਨਾ ਕੰਮ ਨੂੰ ਸਿੱਧੀ ਮਦਦ ਕਰਦਾ ਹੈ।', strengthCapital: 'ਉਪਲਬਧ ਪੂੰਜੀ ਨਿਯੰਤਰਿਤ ਪਾਇਲਟ ਲਈ ਵਧੀਆ ਆਧਾਰ ਹੈ।', weaknessValidate: 'ਸਥਾਨਕ ਮੰਗ ਅਤੇ ਮੁਕਾਬਲੇ ਦੀ ਕੀਮਤ ਮੈਦਾਨ ਵਿੱਚ ਜਾਂਚਣੀ ਬਾਕੀ ਹੈ।', opportunityDistrict: 'ਚੁਣਿਆ ਜ਼ਿਲ੍ਹਾ ਵਧਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਂਚਣਯੋਗ ਵੱਖਰਾ ਗਾਹਕ ਰੂਟ ਦਿੰਦਾ ਹੈ।', threatCompetition: 'ਸਥਾਨਕ ਵਿਕਰੇਤਾ ਕੀਮਤ, ਸੁਵਿਧਾ ਜਾਂ ਕਰੈਡਿਟ ਨਾਲ ਮੁਕਾਬਲਾ ਕਰ ਸਕਦੇ ਹਨ।', insightMarketTitle: 'ਪਹਿਲਾਂ ਜ਼ਿਲ੍ਹਾ ਮਾਰਕੀਟ ਰੂਟ ਜਾਂਚੋ', insightMarketText: 'ਵੱਡੇ ਸਥਿਰ ਖਰਚ ਤੋਂ ਪਹਿਲਾਂ ਸੰਭਾਵੀ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਗੱਲ ਕਰਕੇ ਸ਼ੁਰੂਆਤੀ ਆਰਡਰ ਲਵੋ।', insightPilotTitle: 'ਨਿਯੰਤਰਿਤ ਪਾਇਲਟ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ', insightPilotText: 'ਪਹਿਲੇ 30–45 ਦਿਨ ਲਈ ਘੱਟੋ-ਘੱਟ ਲੋੜੀਂਦਾ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਅਤੇ ਸਟਾਕ ਰੱਖੋ।', insightCashTitle: 'ਵਰਕਿੰਗ ਕੈਪਿਟਲ ਬਚਾਓ', insightCashText: 'ਧੀਮੀ ਵਿਕਰੀ, ਰਿਪੇਅਰ, ਕੱਚੇ ਮਾਲ ਦੀ ਕੀਮਤ ਅਤੇ ਕਰੈਡਿਟ ਲਈ ਕੈਸ਼ ਬਫਰ ਰੱਖੋ।', demand: '{district} ਵਿੱਚ {business} ਲਈ ਸੰਭਾਵੀ ਸਥਾਨਕ ਮੰਗ ਰੂਟ ਹੈ; ਗਾਹਕ ਇੰਟਰਵਿਊ ਅਤੇ ਟੈਸਟ ਵਿਕਰੀ ਨਾਲ ਜਾਂਚੋ।', gap: '{district} ਵਿੱਚ ਭਰੋਸੇਯੋਗ ਗੁਣਵੱਤਾ, ਤੇਜ਼ ਸੇਵਾ ਜਾਂ ਵਿਵਸਥਿਤ ਡਿਲਿਵਰੀ ਇੱਕ ਸੰਭਾਵੀ ਗੈਪ ਹੈ।', competition: 'ਗੁਣਾਤਮਕ ਤੌਰ ਤੇ ਮਿਲਿਆ-ਜੁਲਿਆ; ਲਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਨੇੜਲੇ ਮੁਕਾਬਲੇਬਾਜ਼ ਜਾਂਚੋ।', radius: '3–8 ਕਿਮੀ ਟੈਸਟ ਕਲੱਸਟਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਦੁਹਰਾਈ ਮੰਗ ਤੋਂ ਬਾਅਦ ਵਧਾਓ।', primaryProduct: 'ਮੁੱਖ ਤੇਜ਼-ਵਿਕਰੀ ਆਫਰ', secondaryProduct: 'ਵੈਲਿਊ-ਐਡਡ ਦੂਜਾ ਆਫਰ', institutional: 'ਬਲਕ / ਸੰਸਥਾਗਤ ਪੈਕੇਜ',
  },
};

const CATEGORY_SCORE: Record<BusinessCategory, { score: number; breakdown: [number, number, number, number, number] }> = {
  Dairy: { score: 78, breakdown: [82, 76, 68, 81, 84] },
  'Food Processing': { score: 77, breakdown: [80, 75, 69, 77, 82] },
  Retail: { score: 72, breakdown: [74, 80, 62, 72, 71] },
  'Agriculture Services': { score: 81, breakdown: [85, 78, 77, 82, 83] },
  Poultry: { score: 74, breakdown: [78, 72, 65, 76, 79] },
  Tailoring: { score: 76, breakdown: [76, 88, 64, 78, 74] },
  Handicrafts: { score: 72, breakdown: [73, 75, 62, 74, 77] },
  'Repair Services': { score: 83, breakdown: [86, 85, 80, 82, 81] },
  'Small Manufacturing': { score: 77, breakdown: [80, 71, 74, 78, 82] },
  Other: { score: 75, breakdown: [77, 75, 70, 76, 77] },
};

function interpolate(value: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce((result, [key, replacement]) => result.replaceAll(`{${key}}`, replacement), value);
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function analyzeBusinessWithAI(formData: AssessmentFormData): Promise<AIAnalysisResponse> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.feasibilityScore) {
        const fallbackLoc = `${formData.location.village}, ${formData.location.block}, ${formData.location.district} (${formData.location.state})`;
        return {
          feasibilityScore: data.feasibilityScore,
          recommendation: data.recommendation,
          swot: data.swot,
          insights: data.insights || [],
          localOpportunity: {
            ...DEMO_LOCAL_OPPORTUNITY,
            locationSummary: fallbackLoc,
            ...(data.localOpportunity || {}),
          },
          isAiGenerated: data.isAiGenerated ?? true,
        };
      }
    }
  } catch {
    // Network/server errors fall through to a deterministic local plan.
  }

  return generateDeterministicAIResponse(formData);
}

export async function askAssistantQuestion(
  question: string,
  context: {
    businessIdea?: string;
    category?: string;
    margin?: number;
    projectCost?: number;
    loan?: number;
    scheme?: string;
    language?: string;
  }
): Promise<{ answer: string; sources?: string[] }> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ question, context }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.answer) return data;
    }
  } catch {
    // Fall back to a compact deterministic answer.
  }

  const language = (context.language || 'en') as LanguageCode;
  if (language === 'hi') {
    return {
      answer: `आपके ${context.businessIdea || context.category || 'व्यवसाय'} के लिए पहले स्थानीय मांग जांचें, फिर न्यूनतम व्यवहारिक सेटअप से शुरू करें। उपलब्ध मार्जिन ₹${(context.margin || 50000).toLocaleString('en-IN')} है, इसलिए मशीनरी पर पूरी राशि लगाने के बजाय वर्किंग कैपिटल और सुरक्षा रिज़र्व रखें। योजना/लोन की अंतिम पात्रता आधिकारिक पोर्टल और बैंक से जांचें।`,
      sources: ['NIRNAY AI Advisory Engine'],
    };
  }
  return {
    answer: `For your ${context.businessIdea || context.category || 'business'}, validate local demand first and begin with the smallest workable setup. With ₹${(context.margin || 50000).toLocaleString('en-IN')} available margin, keep part of the money as working capital and safety buffer instead of spending everything on equipment. Verify final scheme and loan eligibility with the official portal and lender.`,
    sources: ['NIRNAY AI Advisory Engine'],
  };
}

function generateDeterministicAIResponse(formData: AssessmentFormData): AIAnalysisResponse {
  const language = formData.preferredLanguage || 'en';
  const copy = FALLBACK_COPY[language] || FALLBACK_COPY.en;
  const district = formData.location.district || formData.location.block || 'your district';
  const business = formData.businessIdea || formData.ideaText || formData.category;
  const skill = formData.selectedExpertise || formData.category;
  const route = formData.targetMarket || district;
  const profile = CATEGORY_SCORE[formData.category] || CATEGORY_SCORE.Other;
  const loc = `${formData.location.village}, ${district} (${formData.location.state})`;
  const recommendation = interpolate(copy.recommendation, { business, district, skill, route });

  return {
    feasibilityScore: {
      overallScore: profile.score,
      statusLabel: copy.status,
      marketPotential: profile.breakdown[0],
      capitalFit: profile.breakdown[1],
      competitionScore: profile.breakdown[2],
      operationalFeasibility: profile.breakdown[3],
      growthPotential: profile.breakdown[4],
    },
    recommendation,
    swot: {
      strengths: [copy.strengthSkill, copy.strengthCapital],
      weaknesses: [copy.weaknessValidate],
      opportunities: [copy.opportunityDistrict],
      threats: [copy.threatCompetition],
    },
    insights: [
      { title: copy.insightMarketTitle, description: copy.insightMarketText, tag: district },
      { title: copy.insightPilotTitle, description: copy.insightPilotText, tag: skill },
      { title: copy.insightCashTitle, description: copy.insightCashText, tag: 'Cash flow' },
    ],
    localOpportunity: {
      ...DEMO_LOCAL_OPPORTUNITY,
      locationSummary: loc,
      demandSignal: interpolate(copy.demand, { business, district }),
      marketGap: interpolate(copy.gap, { district }),
      competitorDensity: copy.competition,
      recommendedRadius: copy.radius,
      suggestedProductMix: [copy.primaryProduct, copy.secondaryProduct, copy.institutional],
    },
    isAiGenerated: false,
  };
}
