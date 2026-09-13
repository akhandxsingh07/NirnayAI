import React, { useMemo, useState } from 'react';
import { AssessmentFormData, BusinessCategory, LanguageCode } from '../types';
import {
  ArrowRight,
  CheckCircle2,
  IndianRupee,
  LandPlot,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundCog,
} from 'lucide-react';

interface AssessmentPageProps {
  initialData: AssessmentFormData;
  onSubmit: (data: AssessmentFormData) => void;
  language: LanguageCode;
  onOpenVoice: () => void;
}

type Risk = 'Low' | 'Medium' | 'High';
type Experience = 'None' | 'Some' | 'Experienced';
type SchemeScope = 'Central' | 'Uttar Pradesh';
type SkillKey =
  | 'agriculture'
  | 'dairy'
  | 'poultry'
  | 'food'
  | 'tailoring'
  | 'electrical'
  | 'digital'
  | 'computer'
  | 'handicraft'
  | 'carpentry';
type ArchetypeKey = 'metro' | 'periAgri' | 'agri' | 'industrial' | 'tourism' | 'regional';
type Localized = Record<LanguageCode, string>;

type BusinessProfile = {
  id: string;
  name: Localized;
  category: BusinessCategory;
  minCapital: number;
  maxCapital: number;
  minLand: number;
  skills: SkillKey[];
  risk: Risk;
  schemeIds: string[];
};

type SchemeProfile = {
  id: string;
  name: string;
  scope: SchemeScope;
  bestFor: string;
  benefit: string;
  eligibilityHint: string;
  officialUrl: string;
};

type DistrictProfile = {
  archetype: ArchetypeKey;
  boosts: Partial<Record<SkillKey, number>>;
};

type SkillPlan = {
  equipment: number;
  working: number;
  market: number;
  buffer: number;
};

const UP_LOCATIONS = [
  'Lucknow',
  'Barabanki',
  'Sitapur',
  'Unnao',
  'Rae Bareli',
  'Hardoi',
  'Kanpur Nagar',
  'Ayodhya',
  'Sultanpur',
  'Lakhimpur Kheri',
  'Bahraich',
  'Prayagraj',
];

const COPY: Record<LanguageCode, Record<string, string>> = {
  en: {
    eyebrow: 'NirnayAI Business Finder', title: 'Choose your skills. Get a plan built for your district.', subtitle: 'Select your strongest skill, experience, capital, land and location. NirnayAI changes the business ranking, launch plan and local market route for every district.', badge: 'Skill + Place + Scheme Matching', resources: 'Your Resources', land: 'Available land (acres)', capital: 'Available capital (₹)', skills: 'Choose your strongest skill', skillHint: 'Select one option. Skill fit gets the highest weight in business ranking.', state: 'State', district: 'Location / District', otherDistrict: 'Enter your district/city', risk: 'Risk preference', experience: 'Experience level', find: 'Find My Best Business', top: 'Top matches for', disclaimerShort: 'Scores are decision-support estimates. Local demand and scheme eligibility must be verified before investment.', match: 'Match', businessFit: 'business fit', localFit: 'local fit', capitalRange: 'Capital range', minimumLand: 'Minimum land', noLand: 'No dedicated land', acre: 'acre', riskProfile: 'Risk profile', districtPlan: 'District-smart launch plan', why: 'Why this fits', marketFocus: 'Local market focus', priorities: 'Local priority sectors', route: 'Best sales route', experienceAdvice: 'Experience-based approach', allocation: 'Suggested capital allocation', equipment: 'Equipment / setup', working: 'Working capital', acquisition: 'Sales / customer acquisition', buffer: 'Safety buffer', first90: 'First 90 days', phase1: 'Validate: speak to 15–20 likely buyers and compare 3 nearby competitors before major spending.', phase2: 'Pilot: start with the smallest workable setup and track weekly sales, gross margin and repeat customers.', phase3: 'Scale: expand only after repeat demand is visible; collect quotations and then verify scheme/loan eligibility.', schemes: 'Best government schemes to verify', bestFor: 'Best for', benefit: 'Benefit', eligibility: 'Eligibility hint', verify: 'Verify on official portal', use: 'Use this recommendation', important: 'Important', longDisclaimer: 'District plans are directional market guidance, not official demand statistics. Final eligibility, subsidy, loan sanction, ODOP fit, local licences and required documents must be verified with official portals, banks and district agencies.', low: 'Low', medium: 'Medium', high: 'High', beginner: 'Beginner', some: 'Some experience', experienced: 'Experienced', up: 'Uttar Pradesh', otherState: 'Other State', because: 'Strong match for your {skill} background, available resources and the market profile of {district}.', noneAdvice: 'Start with a small pilot and training/mentoring before heavy equipment purchases.', someAdvice: 'Use a controlled pilot, build repeat customers first, then increase capacity.', experiencedAdvice: 'Use your experience to secure supplier/customer commitments before expanding fixed costs.', localPrioritiesPrefix: 'In {district}, the model currently gives extra weight to',
  },
  hi: {
    eyebrow: 'निर्णयAI बिज़नेस फाइंडर', title: 'अपना कौशल चुनें। अपने जिले के हिसाब से योजना पाएं।', subtitle: 'कौशल, अनुभव, पूंजी, जमीन और स्थान चुनें। निर्णयAI हर जिले के लिए बिज़नेस रैंकिंग, लॉन्च प्लान और स्थानीय बाजार रणनीति बदलता है।', badge: 'कौशल + स्थान + योजना मिलान', resources: 'आपके संसाधन', land: 'उपलब्ध जमीन (एकड़)', capital: 'उपलब्ध पूंजी (₹)', skills: 'अपना सबसे मजबूत कौशल चुनें', skillHint: 'एक विकल्प चुनें। बिज़नेस रैंकिंग में कौशल को सबसे अधिक महत्व मिलता है।', state: 'राज्य', district: 'स्थान / जिला', otherDistrict: 'अपना जिला/शहर लिखें', risk: 'जोखिम पसंद', experience: 'अनुभव स्तर', find: 'मेरे लिए सही बिज़नेस खोजें', top: 'के लिए शीर्ष विकल्प', disclaimerShort: 'स्कोर निर्णय सहायता के लिए हैं। निवेश से पहले स्थानीय मांग और योजना पात्रता सत्यापित करें।', match: 'मैच', businessFit: 'बिज़नेस फिट', localFit: 'स्थानीय फिट', capitalRange: 'पूंजी सीमा', minimumLand: 'न्यूनतम जमीन', noLand: 'अलग जमीन आवश्यक नहीं', acre: 'एकड़', riskProfile: 'जोखिम प्रोफाइल', districtPlan: 'जिला-आधारित लॉन्च प्लान', why: 'यह क्यों फिट है', marketFocus: 'स्थानीय बाजार फोकस', priorities: 'स्थानीय प्राथमिक क्षेत्र', route: 'बेहतर बिक्री मार्ग', experienceAdvice: 'अनुभव के अनुसार तरीका', allocation: 'सुझाया गया पूंजी विभाजन', equipment: 'उपकरण / सेटअप', working: 'वर्किंग कैपिटल', acquisition: 'बिक्री / ग्राहक प्राप्ति', buffer: 'सुरक्षा रिज़र्व', first90: 'पहले 90 दिन', phase1: 'सत्यापन: बड़ा खर्च करने से पहले 15–20 संभावित ग्राहकों से बात करें और 3 नजदीकी प्रतियोगियों की तुलना करें।', phase2: 'पायलट: सबसे छोटे व्यवहारिक सेटअप से शुरू करें और साप्ताहिक बिक्री, मार्जिन और दोबारा खरीदने वाले ग्राहकों को ट्रैक करें।', phase3: 'विस्तार: दोहराई मांग दिखने के बाद ही क्षमता बढ़ाएं; कोटेशन लें और फिर योजना/लोन पात्रता जांचें।', schemes: 'जांचने योग्य सरकारी योजनाएं', bestFor: 'किसके लिए', benefit: 'लाभ', eligibility: 'पात्रता संकेत', verify: 'आधिकारिक पोर्टल पर जांचें', use: 'यह सुझाव चुनें', important: 'महत्वपूर्ण', longDisclaimer: 'जिला प्लान दिशात्मक बाजार मार्गदर्शन है, आधिकारिक मांग आंकड़ा नहीं। अंतिम पात्रता, सब्सिडी, लोन, ODOP फिट, स्थानीय लाइसेंस और दस्तावेज आधिकारिक पोर्टल, बैंक और जिला एजेंसी से जांचें।', low: 'कम', medium: 'मध्यम', high: 'उच्च', beginner: 'शुरुआती', some: 'कुछ अनुभव', experienced: 'अनुभवी', up: 'उत्तर प्रदेश', otherState: 'अन्य राज्य', because: 'आपके {skill} कौशल, उपलब्ध संसाधनों और {district} के बाजार प्रोफाइल के लिए मजबूत मेल।', noneAdvice: 'भारी उपकरण खरीदने से पहले छोटा पायलट और प्रशिक्षण/मेंटोरिंग से शुरू करें।', someAdvice: 'नियंत्रित पायलट चलाएं, पहले दोहराई ग्राहक बनाएं, फिर क्षमता बढ़ाएं।', experiencedAdvice: 'स्थायी खर्च बढ़ाने से पहले सप्लायर/ग्राहक प्रतिबद्धता लेने के लिए अपने अनुभव का उपयोग करें।', localPrioritiesPrefix: '{district} में मॉडल अतिरिक्त महत्व देता है',
  },
  bn: {
    eyebrow: 'নির্ণয়AI বিজনেস ফাইন্ডার', title: 'আপনার দক্ষতা বেছে নিন। জেলার জন্য উপযুক্ত পরিকল্পনা পান।', subtitle: 'দক্ষতা, অভিজ্ঞতা, মূলধন, জমি ও স্থান নির্বাচন করুন। প্রতিটি জেলার জন্য ব্যবসার র‌্যাঙ্কিং, লঞ্চ প্ল্যান ও বাজার পথ বদলাবে।', badge: 'দক্ষতা + স্থান + স্কিম মিল', resources: 'আপনার সম্পদ', land: 'উপলব্ধ জমি (একর)', capital: 'উপলব্ধ মূলধন (₹)', skills: 'আপনার শক্তিশালী দক্ষতা বেছে নিন', skillHint: 'একটি বিকল্প বেছে নিন। ব্যবসা র‌্যাঙ্কিংয়ে দক্ষতার ওজন সর্বাধিক।', state: 'রাজ্য', district: 'স্থান / জেলা', otherDistrict: 'জেলা/শহর লিখুন', risk: 'ঝুঁকি পছন্দ', experience: 'অভিজ্ঞতার স্তর', find: 'আমার সেরা ব্যবসা খুঁজুন', top: 'এর জন্য সেরা মিল', disclaimerShort: 'স্কোর সিদ্ধান্ত সহায়তার জন্য। বিনিয়োগের আগে স্থানীয় চাহিদা ও স্কিম যোগ্যতা যাচাই করুন।', match: 'মিল', businessFit: 'ব্যবসা ফিট', localFit: 'স্থানীয় ফিট', capitalRange: 'মূলধনের পরিসর', minimumLand: 'ন্যূনতম জমি', noLand: 'আলাদা জমি দরকার নেই', acre: 'একর', riskProfile: 'ঝুঁকি প্রোফাইল', districtPlan: 'জেলা-ভিত্তিক লঞ্চ প্ল্যান', why: 'কেন উপযুক্ত', marketFocus: 'স্থানীয় বাজার ফোকাস', priorities: 'স্থানীয় অগ্রাধিকার খাত', route: 'সেরা বিক্রয় পথ', experienceAdvice: 'অভিজ্ঞতা-ভিত্তিক পদ্ধতি', allocation: 'প্রস্তাবিত মূলধন বণ্টন', equipment: 'সরঞ্জাম / সেটআপ', working: 'ওয়ার্কিং ক্যাপিটাল', acquisition: 'বিক্রয় / গ্রাহক অর্জন', buffer: 'নিরাপত্তা রিজার্ভ', first90: 'প্রথম ৯০ দিন', phase1: 'যাচাই: বড় খরচের আগে ১৫–২০ সম্ভাব্য ক্রেতার সাথে কথা বলুন এবং ৩টি কাছাকাছি প্রতিযোগী তুলনা করুন।', phase2: 'পাইলট: ছোট কার্যকর সেটআপ দিয়ে শুরু করুন এবং সাপ্তাহিক বিক্রয়, মার্জিন ও পুনরায় গ্রাহক ট্র্যাক করুন।', phase3: 'স্কেল: পুনরাবৃত্ত চাহিদা দেখা গেলে তবেই ক্ষমতা বাড়ান; কোটেশন সংগ্রহ করে স্কিম/ঋণ যোগ্যতা যাচাই করুন।', schemes: 'যাচাই করার সরকারি স্কিম', bestFor: 'সেরা জন্য', benefit: 'সুবিধা', eligibility: 'যোগ্যতার ইঙ্গিত', verify: 'সরকারি পোর্টালে যাচাই', use: 'এই সুপারিশ ব্যবহার করুন', important: 'গুরুত্বপূর্ণ', longDisclaimer: 'জেলা পরিকল্পনা নির্দেশক বাজার সহায়তা, সরকারি চাহিদা পরিসংখ্যান নয়। চূড়ান্ত যোগ্যতা, ভর্তুকি, ঋণ, ODOP, লাইসেন্স ও নথি সরকারি উৎসে যাচাই করুন।', low: 'কম', medium: 'মাঝারি', high: 'উচ্চ', beginner: 'শুরুর স্তর', some: 'কিছু অভিজ্ঞতা', experienced: 'অভিজ্ঞ', up: 'উত্তর প্রদেশ', otherState: 'অন্যান্য রাজ্য', because: 'আপনার {skill} দক্ষতা, সম্পদ ও {district} বাজার প্রোফাইলের সঙ্গে শক্তিশালী মিল।', noneAdvice: 'বড় সরঞ্জাম কেনার আগে ছোট পাইলট ও প্রশিক্ষণ দিয়ে শুরু করুন।', someAdvice: 'নিয়ন্ত্রিত পাইলট চালান, পুনরাবৃত্ত গ্রাহক তৈরি করুন, তারপর ক্ষমতা বাড়ান।', experiencedAdvice: 'স্থায়ী খরচ বাড়ানোর আগে সরবরাহকারী/গ্রাহক প্রতিশ্রুতি নিন।', localPrioritiesPrefix: '{district}-এ মডেল বেশি গুরুত্ব দেয়',
  },
  mr: {
    eyebrow: 'निर्णयAI बिझनेस फाइंडर', title: 'तुमचे कौशल्य निवडा. जिल्ह्यानुसार योजना मिळवा.', subtitle: 'कौशल्य, अनुभव, भांडवल, जमीन आणि ठिकाण निवडा. प्रत्येक जिल्ह्यासाठी व्यवसाय रँकिंग, लॉन्च प्लॅन आणि बाजार मार्ग वेगळा असेल.', badge: 'कौशल्य + ठिकाण + योजना जुळणी', resources: 'तुमची साधने', land: 'उपलब्ध जमीन (एकर)', capital: 'उपलब्ध भांडवल (₹)', skills: 'तुमचे सर्वात मजबूत कौशल्य निवडा', skillHint: 'एक पर्याय निवडा. व्यवसाय रँकिंगमध्ये कौशल्याला सर्वाधिक वजन आहे.', state: 'राज्य', district: 'ठिकाण / जिल्हा', otherDistrict: 'जिल्हा/शहर लिहा', risk: 'जोखीम पसंती', experience: 'अनुभव स्तर', find: 'माझ्यासाठी योग्य व्यवसाय शोधा', top: 'साठी सर्वोत्तम पर्याय', disclaimerShort: 'स्कोअर निर्णय सहाय्यासाठी आहेत. गुंतवणुकीपूर्वी स्थानिक मागणी व योजना पात्रता तपासा.', match: 'जुळणी', businessFit: 'व्यवसाय फिट', localFit: 'स्थानिक फिट', capitalRange: 'भांडवल श्रेणी', minimumLand: 'किमान जमीन', noLand: 'स्वतंत्र जमीन आवश्यक नाही', acre: 'एकर', riskProfile: 'जोखीम प्रोफाइल', districtPlan: 'जिल्हा-स्मार्ट लॉन्च प्लॅन', why: 'हे का योग्य', marketFocus: 'स्थानिक बाजार फोकस', priorities: 'स्थानिक प्राधान्य क्षेत्रे', route: 'सर्वोत्तम विक्री मार्ग', experienceAdvice: 'अनुभवानुसार पद्धत', allocation: 'सुचवलेले भांडवल वाटप', equipment: 'उपकरणे / सेटअप', working: 'वर्किंग कॅपिटल', acquisition: 'विक्री / ग्राहक मिळवणे', buffer: 'सुरक्षा राखीव', first90: 'पहिले 90 दिवस', phase1: 'तपासणी: मोठा खर्च करण्यापूर्वी 15–20 संभाव्य ग्राहकांशी बोला आणि 3 जवळचे स्पर्धक तुलना करा.', phase2: 'पायलट: सर्वात लहान व्यवहार्य सेटअपने सुरुवात करा आणि साप्ताहिक विक्री, मार्जिन व पुनरावृत्ती ग्राहक नोंदवा.', phase3: 'वाढ: पुनरावृत्ती मागणी दिसल्यावरच क्षमता वाढवा; कोटेशन घेऊन योजना/कर्ज पात्रता तपासा.', schemes: 'तपासायच्या सरकारी योजना', bestFor: 'योग्य', benefit: 'लाभ', eligibility: 'पात्रता संकेत', verify: 'अधिकृत पोर्टलवर तपासा', use: 'ही शिफारस वापरा', important: 'महत्त्वाचे', longDisclaimer: 'जिल्हा प्लॅन दिशादर्शक बाजार मार्गदर्शन आहे, अधिकृत मागणी आकडेवारी नाही. अंतिम पात्रता, सबसिडी, कर्ज, ODOP, परवाने व कागदपत्रे अधिकृत स्त्रोतांवर तपासा.', low: 'कमी', medium: 'मध्यम', high: 'उच्च', beginner: 'नवशिक्या', some: 'काही अनुभव', experienced: 'अनुभवी', up: 'उत्तर प्रदेश', otherState: 'इतर राज्य', because: 'तुमचे {skill} कौशल्य, उपलब्ध साधने आणि {district} बाजार प्रोफाइल यांच्याशी मजबूत जुळणी.', noneAdvice: 'मोठी उपकरणे घेण्यापूर्वी छोटा पायलट आणि प्रशिक्षणाने सुरुवात करा.', someAdvice: 'नियंत्रित पायलट चालवा, पुनरावृत्ती ग्राहक तयार करा आणि मग क्षमता वाढवा.', experiencedAdvice: 'स्थिर खर्च वाढवण्यापूर्वी पुरवठादार/ग्राहक बांधिलकी घ्या.', localPrioritiesPrefix: '{district} मध्ये मॉडेल अधिक वजन देते',
  },
  ta: {
    eyebrow: 'NirnayAI வணிக தேர்வாளர்', title: 'உங்கள் திறனைத் தேர்வுசெய்க. மாவட்டத்திற்கேற்ற திட்டத்தைப் பெறுங்கள்.', subtitle: 'திறன், அனுபவம், முதல்தொகை, நிலம் மற்றும் இடத்தைத் தேர்வு செய்யுங்கள். ஒவ்வொரு மாவட்டத்திற்கும் வணிக தரவரிசை, தொடக்கத் திட்டம் மற்றும் சந்தை பாதை மாறும்.', badge: 'திறன் + இடம் + திட்ட பொருத்தம்', resources: 'உங்கள் வளங்கள்', land: 'கிடைக்கும் நிலம் (ஏக்கர்)', capital: 'கிடைக்கும் முதல்தொகை (₹)', skills: 'உங்கள் வலுவான திறனைத் தேர்வுசெய்க', skillHint: 'ஒரு விருப்பத்தைத் தேர்வுசெய்க. வணிக தரவரிசையில் திறனுக்கு அதிக எடை.', state: 'மாநிலம்', district: 'இடம் / மாவட்டம்', otherDistrict: 'மாவட்டம்/நகரம் உள்ளிடவும்', risk: 'ஆபத்து விருப்பம்', experience: 'அனுபவ நிலை', find: 'எனக்கான சிறந்த வணிகத்தை கண்டுபிடி', top: 'க்கான சிறந்த பொருத்தங்கள்', disclaimerShort: 'மதிப்பெண்கள் முடிவு உதவிக்காக மட்டுமே. முதலீட்டுக்கு முன் உள்ளூர் தேவை மற்றும் திட்ட தகுதியை சரிபார்க்கவும்.', match: 'பொருத்தம்', businessFit: 'வணிக பொருத்தம்', localFit: 'உள்ளூர் பொருத்தம்', capitalRange: 'முதல்தொகை வரம்பு', minimumLand: 'குறைந்தபட்ச நிலம்', noLand: 'தனி நிலம் தேவையில்லை', acre: 'ஏக்கர்', riskProfile: 'ஆபத்து சுயவிவரம்', districtPlan: 'மாவட்ட அடிப்படையிலான தொடக்கத் திட்டம்', why: 'ஏன் பொருத்தம்', marketFocus: 'உள்ளூர் சந்தை கவனம்', priorities: 'உள்ளூர் முன்னுரிமை துறைகள்', route: 'சிறந்த விற்பனை பாதை', experienceAdvice: 'அனுபவ அடிப்படையிலான அணுகுமுறை', allocation: 'பரிந்துரைக்கப்பட்ட முதல்தொகை பகிர்வு', equipment: 'உபகரணம் / அமைப்பு', working: 'சுழற்சி முதல்தொகை', acquisition: 'விற்பனை / வாடிக்கையாளர் சேர்த்தல்', buffer: 'பாதுகாப்பு நிதி', first90: 'முதல் 90 நாட்கள்', phase1: 'சரிபார்ப்பு: பெரிய செலவுக்கு முன் 15–20 சாத்திய வாடிக்கையாளர்களிடம் பேசுங்கள்; 3 அருகிலுள்ள போட்டியாளர்களை ஒப்பிடுங்கள்.', phase2: 'பைலட்: குறைந்த செயல்பாட்டு அமைப்பில் தொடங்கி வாராந்திர விற்பனை, மார்்ஜின், மீண்டும் வரும் வாடிக்கையாளர்களை கண்காணிக்கவும்.', phase3: 'விரிவு: மீண்டும் வரும் தேவை உறுதியான பிறகே திறனை உயர்த்துங்கள்; விலைப்பத்திரம் பெற்று திட்ட/கடன் தகுதியை சரிபார்க்கவும்.', schemes: 'சரிபார்க்க வேண்டிய அரசு திட்டங்கள்', bestFor: 'சிறந்தது', benefit: 'பயன்', eligibility: 'தகுதி குறிப்பு', verify: 'அதிகாரப்பூர்வ தளத்தில் சரிபார்க்கவும்', use: 'இந்த பரிந்துரையைப் பயன்படுத்து', important: 'முக்கியம்', longDisclaimer: 'மாவட்ட திட்டம் வழிகாட்டும் சந்தை உதவி மட்டுமே; அதிகாரப்பூர்வ தேவை புள்ளிவிவரம் அல்ல. இறுதி தகுதி, மானியம், கடன், ODOP, உரிமங்கள் மற்றும் ஆவணங்களை அதிகாரப்பூர்வ ஆதாரங்களில் சரிபார்க்கவும்.', low: 'குறைவு', medium: 'நடுத்தரம்', high: 'அதிகம்', beginner: 'தொடக்கநிலை', some: 'சில அனுபவம்', experienced: 'அனுபவம் உள்ளது', up: 'உத்தர பிரதேசம்', otherState: 'மற்ற மாநிலம்', because: 'உங்கள் {skill} திறன், வளங்கள் மற்றும் {district} சந்தை சுயவிவரத்துடன் வலுவான பொருத்தம்.', noneAdvice: 'பெரிய உபகரண செலவுக்கு முன் சிறிய பைலட் மற்றும் பயிற்சியுடன் தொடங்கவும்.', someAdvice: 'கட்டுப்படுத்தப்பட்ட பைலட் நடத்தி மீண்டும் வரும் வாடிக்கையாளர்களை உருவாக்கி பின்னர் திறனை உயர்த்தவும்.', experiencedAdvice: 'நிலையான செலவை உயர்த்துவதற்கு முன் சப்ளையர்/வாடிக்கையாளர் உறுதிப்பாட்டைப் பெறுங்கள்.', localPrioritiesPrefix: '{district} இல் மாடல் கூடுதல் எடை தருவது',
  },
  te: {
    eyebrow: 'NirnayAI బిజినెస్ ఫైండర్', title: 'మీ నైపుణ్యాన్ని ఎంచుకోండి. జిల్లాకు సరిపోయే ప్లాన్ పొందండి.', subtitle: 'నైపుణ్యం, అనుభవం, మూలధనం, భూమి మరియు ప్రదేశాన్ని ఎంచుకోండి. ప్రతి జిల్లాకు వ్యాపార ర్యాంకింగ్, ప్రారంభ ప్రణాళిక మరియు మార్కెట్ మార్గం మారుతుంది.', badge: 'నైపుణ్యం + ప్రదేశం + పథకం సరిపోలిక', resources: 'మీ వనరులు', land: 'అందుబాటులో ఉన్న భూమి (ఎకరాలు)', capital: 'అందుబాటులో మూలధనం (₹)', skills: 'మీ బలమైన నైపుణ్యాన్ని ఎంచుకోండి', skillHint: 'ఒక ఎంపికను ఎంచుకోండి. వ్యాపార ర్యాంకింగ్‌లో నైపుణ్యానికి అత్యధిక బరువు ఉంటుంది.', state: 'రాష్ట్రం', district: 'ప్రదేశం / జిల్లా', otherDistrict: 'జిల్లా/నగరం నమోదు చేయండి', risk: 'రిస్క్ అభిరుచి', experience: 'అనుభవ స్థాయి', find: 'నా ఉత్తమ వ్యాపారాన్ని కనుగొను', top: 'కు ఉత్తమ సరిపోలికలు', disclaimerShort: 'స్కోర్లు నిర్ణయ సహాయం కోసం. పెట్టుబడికి ముందు స్థానిక డిమాండ్ మరియు పథకం అర్హతను ధృవీకరించండి.', match: 'సరిపోలిక', businessFit: 'వ్యాపార సరిపోలిక', localFit: 'స్థానిక సరిపోలిక', capitalRange: 'మూలధన పరిధి', minimumLand: 'కనీస భూమి', noLand: 'ప్రత్యేక భూమి అవసరం లేదు', acre: 'ఎకరం', riskProfile: 'రిస్క్ ప్రొఫైల్', districtPlan: 'జిల్లా-స్మార్ట్ ప్రారంభ ప్రణాళిక', why: 'ఎందుకు సరిపోతుంది', marketFocus: 'స్థానిక మార్కెట్ ఫోకస్', priorities: 'స్థానిక ప్రాధాన్యత రంగాలు', route: 'ఉత్తమ అమ్మకాల మార్గం', experienceAdvice: 'అనుభవ ఆధారిత విధానం', allocation: 'సూచించిన మూలధన కేటాయింపు', equipment: 'పరికరాలు / సెటప్', working: 'వర్కింగ్ క్యాపిటల్', acquisition: 'అమ్మకాలు / కస్టమర్ సంపాదన', buffer: 'భద్రతా నిల్వ', first90: 'మొదటి 90 రోజులు', phase1: 'ధృవీకరణ: పెద్ద ఖర్చు ముందు 15–20 సంభావ్య కొనుగోలుదారులతో మాట్లాడి 3 సమీప పోటీదారులను పోల్చండి.', phase2: 'పైలట్: చిన్న పని చేసే సెటప్‌తో ప్రారంభించి వారపు అమ్మకాలు, మార్జిన్ మరియు తిరిగి వచ్చే కస్టమర్లను ట్రాక్ చేయండి.', phase3: 'విస్తరణ: పునరావృత డిమాండ్ కనిపించిన తర్వాత మాత్రమే సామర్థ్యం పెంచండి; కోటేషన్లు తీసుకుని పథకం/రుణ అర్హతను చెక్ చేయండి.', schemes: 'ధృవీకరించాల్సిన ప్రభుత్వ పథకాలు', bestFor: 'ఎవరికి మంచిది', benefit: 'లాభం', eligibility: 'అర్హత సూచన', verify: 'అధికారిక పోర్టల్‌లో చెక్ చేయండి', use: 'ఈ సిఫార్సు ఉపయోగించండి', important: 'ముఖ్యం', longDisclaimer: 'జిల్లా ప్లాన్ దిశానిర్దేశ మార్కెట్ గైడెన్స్ మాత్రమే; అధికారిక డిమాండ్ గణాంకం కాదు. తుది అర్హత, సబ్సిడీ, రుణం, ODOP, లైసెన్సులు మరియు పత్రాలను అధికారిక వనరుల్లో ధృవీకరించండి.', low: 'తక్కువ', medium: 'మధ్యస్థ', high: 'అధిక', beginner: 'ప్రారంభం', some: 'కొంత అనుభవం', experienced: 'అనుభవం ఉంది', up: 'ఉత్తరప్రదేశ్', otherState: 'ఇతర రాష్ట్రం', because: 'మీ {skill} నైపుణ్యం, వనరులు మరియు {district} మార్కెట్ ప్రొఫైల్‌కు బలమైన సరిపోలిక.', noneAdvice: 'పెద్ద పరికర కొనుగోలు ముందు చిన్న పైలట్ మరియు శిక్షణతో ప్రారంభించండి.', someAdvice: 'నియంత్రిత పైలట్ నడిపి పునరావృత కస్టమర్లను నిర్మించి తరువాత సామర్థ్యాన్ని పెంచండి.', experiencedAdvice: 'స్థిర ఖర్చు పెంచే ముందు సరఫరాదారు/కస్టమర్ కమిట్‌మెంట్ పొందండి.', localPrioritiesPrefix: '{district}లో మోడల్ ఎక్కువ బరువు ఇస్తుంది',
  },
  kn: {
    eyebrow: 'NirnayAI ಬಿಸಿನೆಸ್ ಫೈಂಡರ್', title: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ ಆಯ್ಕೆಮಾಡಿ. ಜಿಲ್ಲೆಗೆ ತಕ್ಕ ಯೋಜನೆ ಪಡೆಯಿರಿ.', subtitle: 'ಕೌಶಲ್ಯ, ಅನುಭವ, ಬಂಡವಾಳ, ಭೂಮಿ ಮತ್ತು ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ. ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆಗೆ ವ್ಯವಹಾರ ಶ್ರೇಯಾಂಕ, ಆರಂಭ ಯೋಜನೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಮಾರ್ಗ ಬದಲಾಗುತ್ತದೆ.', badge: 'ಕೌಶಲ್ಯ + ಸ್ಥಳ + ಯೋಜನೆ ಹೊಂದಾಣಿಕೆ', resources: 'ನಿಮ್ಮ ಸಂಪನ್ಮೂಲಗಳು', land: 'ಲಭ್ಯ ಭೂಮಿ (ಎಕರೆ)', capital: 'ಲಭ್ಯ ಬಂಡವಾಳ (₹)', skills: 'ನಿಮ್ಮ ಬಲವಾದ ಕೌಶಲ್ಯ ಆಯ್ಕೆಮಾಡಿ', skillHint: 'ಒಂದು ಆಯ್ಕೆ ಆರಿಸಿ. ವ್ಯವಹಾರ ಶ್ರೇಯಾಂಕದಲ್ಲಿ ಕೌಶಲ್ಯಕ್ಕೆ ಹೆಚ್ಚು ತೂಕ.', state: 'ರಾಜ್ಯ', district: 'ಸ್ಥಳ / ಜಿಲ್ಲೆ', otherDistrict: 'ಜಿಲ್ಲೆ/ನಗರ ನಮೂದಿಸಿ', risk: 'ಅಪಾಯ ಆಯ್ಕೆ', experience: 'ಅನುಭವ ಮಟ್ಟ', find: 'ನನ್ನ ಉತ್ತಮ ವ್ಯವಹಾರ ಹುಡುಕಿ', top: 'ಗಾಗಿ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಗಳು', disclaimerShort: 'ಸ್ಕೋರ್‌ಗಳು ನಿರ್ಧಾರ ಸಹಾಯಕ್ಕೆ. ಹೂಡಿಕೆ ಮೊದಲು ಸ್ಥಳೀಯ ಬೇಡಿಕೆ ಮತ್ತು ಯೋಜನೆ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ.', match: 'ಹೊಂದಾಣಿಕೆ', businessFit: 'ವ್ಯವಹಾರ ಹೊಂದಾಣಿಕೆ', localFit: 'ಸ್ಥಳೀಯ ಹೊಂದಾಣಿಕೆ', capitalRange: 'ಬಂಡವಾಳ ಶ್ರೇಣಿ', minimumLand: 'ಕನಿಷ್ಠ ಭೂಮಿ', noLand: 'ಪ್ರತ್ಯೇಕ ಭೂಮಿ ಅಗತ್ಯವಿಲ್ಲ', acre: 'ಎಕರೆ', riskProfile: 'ಅಪಾಯ ಪ್ರೊಫೈಲ್', districtPlan: 'ಜಿಲ್ಲಾ-ಸ್ಮಾರ್ಟ್ ಆರಂಭ ಯೋಜನೆ', why: 'ಏಕೆ ಹೊಂದಿದೆ', marketFocus: 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಕೇಂದ್ರೀಕರಣ', priorities: 'ಸ್ಥಳೀಯ ಆದ್ಯತೆ ಕ್ಷೇತ್ರಗಳು', route: 'ಉತ್ತಮ ಮಾರಾಟ ಮಾರ್ಗ', experienceAdvice: 'ಅನುಭವ ಆಧಾರಿತ ವಿಧಾನ', allocation: 'ಸೂಚಿಸಿದ ಬಂಡವಾಳ ಹಂಚಿಕೆ', equipment: 'ಉಪಕರಣ / ಸೆಟಪ್', working: 'ಕಾರ್ಯ ಬಂಡವಾಳ', acquisition: 'ಮಾರಾಟ / ಗ್ರಾಹಕ ಪಡೆದುಕೊಳ್ಳುವುದು', buffer: 'ಭದ್ರತಾ ಮೀಸಲು', first90: 'ಮೊದಲ 90 ದಿನಗಳು', phase1: 'ಪರಿಶೀಲನೆ: ದೊಡ್ಡ ವೆಚ್ಚಕ್ಕೂ ಮುನ್ನ 15–20 ಸಾಧ್ಯ ಗ್ರಾಹಕರೊಂದಿಗೆ ಮಾತನಾಡಿ 3 ಹತ್ತಿರದ ಸ್ಪರ್ಧಿಗಳನ್ನು ಹೋಲಿಸಿ.', phase2: 'ಪೈಲಟ್: ಚಿಕ್ಕ ಕಾರ್ಯಕ್ಷಮ ಸೆಟಪ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಿ ವಾರದ ಮಾರಾಟ, ಮಾರ್ಜಿನ್ ಮತ್ತು ಮರುಗ್ರಾಹಕರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.', phase3: 'ವಿಸ್ತರಣೆ: ಮರುಬೇಡಿಕೆ ಕಂಡ ನಂತರ ಮಾತ್ರ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಿಸಿ; ಕೊಟೇಶನ್ ಪಡೆದು ಯೋಜನೆ/ಸಾಲ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ.', schemes: 'ಪರಿಶೀಲಿಸಬೇಕಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', bestFor: 'ಯಾರಿಗೆ', benefit: 'ಲಾಭ', eligibility: 'ಅರ್ಹತೆ ಸೂಚನೆ', verify: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ', use: 'ಈ ಶಿಫಾರಸು ಬಳಸಿ', important: 'ಮುಖ್ಯ', longDisclaimer: 'ಜಿಲ್ಲಾ ಯೋಜನೆ ದಿಕ್ಕು ತೋರಿಸುವ ಮಾರುಕಟ್ಟೆ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ; ಅಧಿಕೃತ ಬೇಡಿಕೆ ಅಂಕಿಅಂಶವಲ್ಲ. ಅಂತಿಮ ಅರ್ಹತೆ, ಸಬ್ಸಿಡಿ, ಸಾಲ, ODOP, ಪರವಾನಗಿ ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ಅಧಿಕೃತ ಮೂಲಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.', low: 'ಕಡಿಮೆ', medium: 'ಮಧ್ಯಮ', high: 'ಹೆಚ್ಚು', beginner: 'ಆರಂಭಿಕ', some: 'ಸ್ವಲ್ಪ ಅನುಭವ', experienced: 'ಅನುಭವಿ', up: 'ಉತ್ತರ ಪ್ರದೇಶ', otherState: 'ಇತರೆ ರಾಜ್ಯ', because: 'ನಿಮ್ಮ {skill} ಕೌಶಲ್ಯ, ಸಂಪನ್ಮೂಲಗಳು ಮತ್ತು {district} ಮಾರುಕಟ್ಟೆ ಪ್ರೊಫೈಲ್‌ಗೆ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ.', noneAdvice: 'ದೊಡ್ಡ ಉಪಕರಣ ಖರೀದಿಗೂ ಮುನ್ನ ಚಿಕ್ಕ ಪೈಲಟ್ ಮತ್ತು ತರಬೇತಿಯಿಂದ ಪ್ರಾರಂಭಿಸಿ.', someAdvice: 'ನಿಯಂತ್ರಿತ ಪೈಲಟ್ ಮಾಡಿ ಮರುಗ್ರಾಹಕರನ್ನು ನಿರ್ಮಿಸಿ ನಂತರ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಿಸಿ.', experiencedAdvice: 'ಸ್ಥಿರ ವೆಚ್ಚ ಹೆಚ್ಚಿಸುವ ಮೊದಲು ಸರಬರಾಜುದಾರ/ಗ್ರಾಹಕ ಬದ್ಧತೆ ಪಡೆಯಿರಿ.', localPrioritiesPrefix: '{district}ನಲ್ಲಿ ಮಾದರಿ ಹೆಚ್ಚಿನ ತೂಕ ನೀಡುವುದು',
  },
  gu: {
    eyebrow: 'NirnayAI બિઝનેસ ફાઇન્ડર', title: 'તમારી કુશળતા પસંદ કરો. જિલ્લાનુસાર યોજના મેળવો.', subtitle: 'કુશળતા, અનુભવ, મૂડી, જમીન અને સ્થાન પસંદ કરો. દરેક જિલ્લામાં બિઝનેસ રેન્કિંગ, લોન્ચ પ્લાન અને માર્કેટ રૂટ બદલાય છે.', badge: 'કુશળતા + સ્થાન + યોજના મેચ', resources: 'તમારા સંસાધનો', land: 'ઉપલબ્ધ જમીન (એકર)', capital: 'ઉપલબ્ધ મૂડી (₹)', skills: 'તમારી સૌથી મજબૂત કુશળતા પસંદ કરો', skillHint: 'એક વિકલ્પ પસંદ કરો. બિઝનેસ રેન્કિંગમાં કુશળતાને સૌથી વધુ વજન મળે છે.', state: 'રાજ્ય', district: 'સ્થાન / જિલ્લો', otherDistrict: 'જિલ્લો/શહેર લખો', risk: 'જોખમ પસંદગી', experience: 'અનુભવ સ્તર', find: 'મારા માટે શ્રેષ્ઠ બિઝનેસ શોધો', top: 'માટે શ્રેષ્ઠ મેળ', disclaimerShort: 'સ્કોર નિર્ણય સહાય માટે છે. રોકાણ પહેલાં સ્થાનિક માંગ અને યોજના પાત્રતા ચકાસો.', match: 'મેચ', businessFit: 'બિઝનેસ ફિટ', localFit: 'સ્થાનિક ફિટ', capitalRange: 'મૂડી શ્રેણી', minimumLand: 'ન્યૂનતમ જમીન', noLand: 'અલગ જમીન જરૂરી નથી', acre: 'એકર', riskProfile: 'જોખમ પ્રોફાઇલ', districtPlan: 'જિલ્લા-સ્માર્ટ લોન્ચ પ્લાન', why: 'શા માટે ફિટ', marketFocus: 'સ્થાનિક બજાર ફોકસ', priorities: 'સ્થાનિક પ્રાથમિક ક્ષેત્રો', route: 'શ્રેષ્ઠ વેચાણ માર્ગ', experienceAdvice: 'અનુભવ આધારિત રીત', allocation: 'સૂચિત મૂડી વહેંચણી', equipment: 'ઉપકરણ / સેટઅપ', working: 'વર્કિંગ કેપિટલ', acquisition: 'વેચાણ / ગ્રાહક મેળવવો', buffer: 'સુરક્ષા રિઝર્વ', first90: 'પ્રથમ 90 દિવસ', phase1: 'ચકાસણી: મોટો ખર્ચ પહેલાં 15–20 સંભવિત ગ્રાહકો સાથે વાત કરો અને 3 નજીકના સ્પર્ધકોની તુલના કરો.', phase2: 'પાઇલટ: સૌથી નાના કાર્યક્ષમ સેટઅપથી શરૂ કરો અને સાપ્તાહિક વેચાણ, માર્જિન અને ફરી આવતા ગ્રાહકો ટ્રેક કરો.', phase3: 'વૃદ્ધિ: પુનરાવર્તિત માંગ દેખાય પછી જ ક્ષમતા વધારો; કોટેશન મેળવી યોજના/લોન પાત્રતા તપાસો.', schemes: 'ચકાસવા જેવી સરકારી યોજનાઓ', bestFor: 'શ્રેષ્ઠ માટે', benefit: 'લાભ', eligibility: 'પાત્રતા સંકેત', verify: 'સત્તાવાર પોર્ટલ પર તપાસો', use: 'આ ભલામણ વાપરો', important: 'મહત્વપૂર્ણ', longDisclaimer: 'જિલ્લા પ્લાન દિશાસૂચક બજાર માર્ગદર્શન છે, સત્તાવાર માંગ આંકડા નથી. અંતિમ પાત્રતા, સબસિડી, લોન, ODOP, લાઇસન્સ અને દસ્તાવેજો સત્તાવાર સ્ત્રોતોથી ચકાસો.', low: 'ઓછું', medium: 'મધ્યમ', high: 'ઉચ્ચ', beginner: 'શરૂઆત', some: 'થોડો અનુભવ', experienced: 'અનુભવી', up: 'ઉત્તર પ્રદેશ', otherState: 'અન્ય રાજ્ય', because: 'તમારી {skill} કુશળતા, સંસાધનો અને {district} બજાર પ્રોફાઇલ સાથે મજબૂત મેળ.', noneAdvice: 'મોટા સાધન ખર્ચ પહેલાં નાના પાઇલટ અને તાલીમથી શરૂ કરો.', someAdvice: 'નિયંત્રિત પાઇલટ ચલાવો, ફરી આવતા ગ્રાહકો બનાવો અને પછી ક્ષમતા વધારો.', experiencedAdvice: 'સ્થિર ખર્ચ વધારતા પહેલાં સપ્લાયર/ગ્રાહક પ્રતિબદ્ધતા મેળવો.', localPrioritiesPrefix: '{district}માં મોડેલ વધુ વજન આપે છે',
  },
  pa: {
    eyebrow: 'NirnayAI ਬਿਜ਼ਨਸ ਫਾਈਂਡਰ', title: 'ਆਪਣਾ ਹੁਨਰ ਚੁਣੋ। ਜ਼ਿਲ੍ਹੇ ਅਨੁਸਾਰ ਯੋਜਨਾ ਲਵੋ।', subtitle: 'ਹੁਨਰ, ਤਜਰਬਾ, ਪੂੰਜੀ, ਜ਼ਮੀਨ ਅਤੇ ਥਾਂ ਚੁਣੋ। ਹਰ ਜ਼ਿਲ੍ਹੇ ਲਈ ਬਿਜ਼ਨਸ ਰੈਂਕਿੰਗ, ਲਾਂਚ ਪਲਾਨ ਅਤੇ ਮਾਰਕੀਟ ਰੂਟ ਬਦਲਦਾ ਹੈ।', badge: 'ਹੁਨਰ + ਥਾਂ + ਯੋਜਨਾ ਮੇਲ', resources: 'ਤੁਹਾਡੇ ਸਰੋਤ', land: 'ਉਪਲਬਧ ਜ਼ਮੀਨ (ਏਕੜ)', capital: 'ਉਪਲਬਧ ਪੂੰਜੀ (₹)', skills: 'ਆਪਣਾ ਸਭ ਤੋਂ ਮਜ਼ਬੂਤ ਹੁਨਰ ਚੁਣੋ', skillHint: 'ਇੱਕ ਵਿਕਲਪ ਚੁਣੋ। ਬਿਜ਼ਨਸ ਰੈਂਕਿੰਗ ਵਿੱਚ ਹੁਨਰ ਨੂੰ ਸਭ ਤੋਂ ਵੱਧ ਭਾਰ ਮਿਲਦਾ ਹੈ।', state: 'ਰਾਜ', district: 'ਥਾਂ / ਜ਼ਿਲ੍ਹਾ', otherDistrict: 'ਜ਼ਿਲ੍ਹਾ/ਸ਼ਹਿਰ ਲਿਖੋ', risk: 'ਖਤਰਾ ਪਸੰਦ', experience: 'ਤਜਰਬਾ ਪੱਧਰ', find: 'ਮੇਰੇ ਲਈ ਵਧੀਆ ਬਿਜ਼ਨਸ ਲੱਭੋ', top: 'ਲਈ ਵਧੀਆ ਮੇਲ', disclaimerShort: 'ਸਕੋਰ ਫੈਸਲਾ ਸਹਾਇਤਾ ਲਈ ਹਨ। ਨਿਵੇਸ਼ ਤੋਂ ਪਹਿਲਾਂ ਸਥਾਨਕ ਮੰਗ ਅਤੇ ਯੋਜਨਾ ਯੋਗਤਾ ਜਾਂਚੋ।', match: 'ਮੇਲ', businessFit: 'ਬਿਜ਼ਨਸ ਫਿਟ', localFit: 'ਸਥਾਨਕ ਫਿਟ', capitalRange: 'ਪੂੰਜੀ ਸੀਮਾ', minimumLand: 'ਘੱਟੋ-ਘੱਟ ਜ਼ਮੀਨ', noLand: 'ਵੱਖਰੀ ਜ਼ਮੀਨ ਦੀ ਲੋੜ ਨਹੀਂ', acre: 'ਏਕੜ', riskProfile: 'ਖਤਰਾ ਪ੍ਰੋਫਾਈਲ', districtPlan: 'ਜ਼ਿਲ੍ਹਾ-ਸਮਾਰਟ ਲਾਂਚ ਪਲਾਨ', why: 'ਕਿਉਂ ਫਿਟ', marketFocus: 'ਸਥਾਨਕ ਮਾਰਕੀਟ ਫੋਕਸ', priorities: 'ਸਥਾਨਕ ਤਰਜੀਹ ਖੇਤਰ', route: 'ਵਧੀਆ ਵਿਕਰੀ ਰੂਟ', experienceAdvice: 'ਤਜਰਬੇ ਅਨੁਸਾਰ ਤਰੀਕਾ', allocation: 'ਸੁਝਾਇਆ ਪੂੰਜੀ ਵੰਡ', equipment: 'ਉਪਕਰਣ / ਸੈਟਅਪ', working: 'ਵਰਕਿੰਗ ਕੈਪਿਟਲ', acquisition: 'ਵਿਕਰੀ / ਗਾਹਕ ਪ੍ਰਾਪਤੀ', buffer: 'ਸੁਰੱਖਿਆ ਰਿਜ਼ਰਵ', first90: 'ਪਹਿਲੇ 90 ਦਿਨ', phase1: 'ਜਾਂਚ: ਵੱਡੇ ਖਰਚ ਤੋਂ ਪਹਿਲਾਂ 15–20 ਸੰਭਾਵੀ ਗਾਹਕਾਂ ਨਾਲ ਗੱਲ ਕਰੋ ਅਤੇ 3 ਨੇੜਲੇ ਮੁਕਾਬਲੇਬਾਜ਼ਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।', phase2: 'ਪਾਇਲਟ: ਸਭ ਤੋਂ ਛੋਟੇ ਕਾਰਗਰ ਸੈਟਅਪ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਹਫਤਾਵਾਰੀ ਵਿਕਰੀ, ਮਾਰਜਿਨ ਅਤੇ ਦੁਬਾਰਾ ਆਉਣ ਵਾਲੇ ਗਾਹਕ ਟ੍ਰੈਕ ਕਰੋ।', phase3: 'ਵਾਧਾ: ਦੁਹਰਾਈ ਮੰਗ ਦਿਖਣ ਤੋਂ ਬਾਅਦ ਹੀ ਸਮਰੱਥਾ ਵਧਾਓ; ਕੋਟੇਸ਼ਨ ਲੈ ਕੇ ਯੋਜਨਾ/ਲੋਨ ਯੋਗਤਾ ਜਾਂਚੋ।', schemes: 'ਜਾਂਚਣ ਵਾਲੀਆਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', bestFor: 'ਵਧੀਆ ਲਈ', benefit: 'ਲਾਭ', eligibility: 'ਯੋਗਤਾ ਸੰਕੇਤ', verify: 'ਸਰਕਾਰੀ ਪੋਰਟਲ ਤੇ ਜਾਂਚੋ', use: 'ਇਹ ਸਿਫਾਰਸ਼ ਵਰਤੋ', important: 'ਮਹੱਤਵਪੂਰਨ', longDisclaimer: 'ਜ਼ਿਲ੍ਹਾ ਪਲਾਨ ਦਿਸ਼ਾ-ਸੂਚਕ ਮਾਰਕੀਟ ਮਾਰਗਦਰਸ਼ਨ ਹੈ, ਸਰਕਾਰੀ ਮੰਗ ਅੰਕੜਾ ਨਹੀਂ। ਅੰਤਿਮ ਯੋਗਤਾ, ਸਬਸਿਡੀ, ਲੋਨ, ODOP, ਲਾਇਸੈਂਸ ਅਤੇ ਦਸਤਾਵੇਜ਼ ਸਰਕਾਰੀ ਸਰੋਤਾਂ ਤੋਂ ਜਾਂਚੋ।', low: 'ਘੱਟ', medium: 'ਦਰਮਿਆਨਾ', high: 'ਉੱਚ', beginner: 'ਸ਼ੁਰੂਆਤੀ', some: 'ਕੁਝ ਤਜਰਬਾ', experienced: 'ਤਜਰਬੇਕਾਰ', up: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼', otherState: 'ਹੋਰ ਰਾਜ', because: 'ਤੁਹਾਡੇ {skill} ਹੁਨਰ, ਸਰੋਤ ਅਤੇ {district} ਮਾਰਕੀਟ ਪ੍ਰੋਫਾਈਲ ਨਾਲ ਮਜ਼ਬੂਤ ਮੇਲ।', noneAdvice: 'ਵੱਡੇ ਉਪਕਰਣ ਖਰਚ ਤੋਂ ਪਹਿਲਾਂ ਛੋਟੇ ਪਾਇਲਟ ਅਤੇ ਟ੍ਰੇਨਿੰਗ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।', someAdvice: 'ਨਿਯੰਤਰਿਤ ਪਾਇਲਟ ਚਲਾਓ, ਦੁਬਾਰਾ ਗਾਹਕ ਬਣਾਓ ਅਤੇ ਫਿਰ ਸਮਰੱਥਾ ਵਧਾਓ।', experiencedAdvice: 'ਸਥਿਰ ਖਰਚ ਵਧਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸਪਲਾਇਰ/ਗਾਹਕ ਵਚਨਬੱਧਤਾ ਲਵੋ।', localPrioritiesPrefix: '{district} ਵਿੱਚ ਮਾਡਲ ਵਧੇਰੇ ਭਾਰ ਦਿੰਦਾ ਹੈ',
  },
};

const SKILLS: Array<{ value: SkillKey; labels: Localized }> = [
  { value: 'agriculture', labels: { en: 'Agriculture / Farming', hi: 'कृषि / खेती', bn: 'কৃষি / চাষাবাদ', mr: 'शेती / कृषी', ta: 'விவசாயம்', te: 'వ్యవసాయం', kn: 'ಕೃಷಿ', gu: 'કૃષિ / ખેતી', pa: 'ਖੇਤੀਬਾੜੀ' } },
  { value: 'dairy', labels: { en: 'Dairy / Animal Care', hi: 'डेयरी / पशुपालन', bn: 'ডেইরি / পশুপালন', mr: 'दुग्ध / पशुपालन', ta: 'பால் / கால்நடை', te: 'డెయిరీ / పశుపోషణ', kn: 'ಹೈನು / ಪಶುಪಾಲನೆ', gu: 'ડેરી / પશુપાલન', pa: 'ਡੇਅਰੀ / ਪਸ਼ੂਪਾਲਨ' } },
  { value: 'poultry', labels: { en: 'Poultry', hi: 'पोल्ट्री', bn: 'পোল্ট্রি', mr: 'कुक्कुटपालन', ta: 'கோழிப்பண்ணை', te: 'పౌల్ట్రీ', kn: 'ಕೋಳಿ ಸಾಕಣೆ', gu: 'પોલ્ટ્રી', pa: 'ਪੋਲਟਰੀ' } },
  { value: 'food', labels: { en: 'Food Processing / Cooking', hi: 'फूड प्रोसेसिंग / खाना', bn: 'খাদ্য প্রক্রিয়াকরণ', mr: 'अन्न प्रक्रिया', ta: 'உணவு பதப்படுத்தல்', te: 'ఆహార ప్రాసెసింగ్', kn: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ', gu: 'ફૂડ પ્રોસેસિંગ', pa: 'ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ' } },
  { value: 'tailoring', labels: { en: 'Tailoring / Fashion', hi: 'सिलाई / फैशन', bn: 'সেলাই / ফ্যাশন', mr: 'शिवणकाम / फॅशन', ta: 'தையல் / ஃபேஷன்', te: 'టైలరింగ్ / ఫ్యాషన్', kn: 'ಟೈಲರಿಂಗ್ / ಫ್ಯಾಷನ್', gu: 'ટેલરિંગ / ફેશન', pa: 'ਸਿਲਾਈ / ਫੈਸ਼ਨ' } },
  { value: 'electrical', labels: { en: 'Electrical / Electronics / Solar', hi: 'इलेक्ट्रिकल / इलेक्ट्रॉनिक्स / सोलर', bn: 'ইলেকট্রিক্যাল / ইলেকট্রনিক্স / সোলার', mr: 'इलेक्ट्रिकल / इलेक्ट्रॉनिक्स / सोलर', ta: 'மின்சாரம் / மின்னணு / சோலார்', te: 'ఎలక్ట్రికల్ / ఎలక్ట్రానిక్స్ / సోలార్', kn: 'ಎಲೆಕ್ಟ್ರಿಕಲ್ / ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ / ಸೋಲಾರ್', gu: 'ઇલેક્ટ્રિકલ / ઇલેક્ટ્રોનિક્સ / સોલાર', pa: 'ਇਲੈਕਟ੍ਰਿਕਲ / ਇਲੈਕਟ੍ਰਾਨਿਕਸ / ਸੋਲਰ' } },
  { value: 'digital', labels: { en: 'Digital Marketing / Social Media', hi: 'डिजिटल मार्केटिंग / सोशल मीडिया', bn: 'ডিজিটাল মার্কেটিং / সোশ্যাল মিডিয়া', mr: 'डिजिटल मार्केटिंग / सोशल मीडिया', ta: 'டிஜிட்டல் மார்க்கெட்டிங் / சமூக ஊடகம்', te: 'డిజిటల్ మార్కెటింగ్ / సోషల్ మీడియా', kn: 'ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ / ಸೋಶಿಯಲ್ ಮೀಡಿಯಾ', gu: 'ડિજિટલ માર્કેટિંગ / સોશિયલ મીડિયા', pa: 'ਡਿਜ਼ੀਟਲ ਮਾਰਕੀਟਿੰਗ / ਸੋਸ਼ਲ ਮੀਡੀਆ' } },
  { value: 'computer', labels: { en: 'Computer / IT / Coding', hi: 'कंप्यूटर / IT / कोडिंग', bn: 'কম্পিউটার / IT / কোডিং', mr: 'कॉम्प्युटर / IT / कोडिंग', ta: 'கணினி / IT / கோடிங்', te: 'కంప్యూటర్ / IT / కోడింగ్', kn: 'ಕಂಪ್ಯೂಟರ್ / IT / ಕೋಡಿಂಗ್', gu: 'કમ્પ્યુટર / IT / કોડિંગ', pa: 'ਕੰਪਿਊਟਰ / IT / ਕੋਡਿੰਗ' } },
  { value: 'handicraft', labels: { en: 'Handicraft / Artisan', hi: 'हस्तशिल्प / कारीगर', bn: 'হস্তশিল্প / কারিগর', mr: 'हस्तकला / कारागीर', ta: 'கைவினை / கலைஞர்', te: 'హస్తకళ / కళాకారుడు', kn: 'ಕರಕುಶಲ / ಕಾರಿಗ', gu: 'હસ્તકલા / કારીગર', pa: 'ਹੱਥਕਲਾ / ਕਾਰੀਗਰ' } },
  { value: 'carpentry', labels: { en: 'Carpentry / Furniture', hi: 'बढ़ई / फर्नीचर', bn: 'কাঠের কাজ / ফার্নিচার', mr: 'सुतारकाम / फर्निचर', ta: 'தச்சு / மரச்சாமான்', te: 'కార్పెంట్రీ / ఫర్నిచర్', kn: 'ಮರಗೆಲಸ / ಫರ್ನಿಚರ್', gu: 'કારપેન્ટ્રી / ફર્નિચર', pa: 'ਕਾਰਪੈਂਟਰੀ / ਫਰਨੀਚਰ' } },
];

const BUSINESS_NAMES: Record<string, Localized> = {
  mushroom: { en: 'Mushroom Farming Unit', hi: 'मशरूम खेती इकाई', bn: 'মাশরুম চাষ ইউনিট', mr: 'मशरूम शेती युनिट', ta: 'காளான் விவசாய அலகு', te: 'మష్రూమ్ ఫార్మింగ్ యూనిట్', kn: 'ಮಶ್ರೂಮ್ ಕೃಷಿ ಘಟಕ', gu: 'મશરૂમ ખેતી યુનિટ', pa: 'ਮਸ਼ਰੂਮ ਖੇਤੀ ਯੂਨਿਟ' },
  dairy: { en: 'Dairy & Milk Collection Centre', hi: 'डेयरी और दूध संग्रह केंद्र', bn: 'ডেইরি ও দুধ সংগ্রহ কেন্দ্র', mr: 'दुग्ध व दूध संकलन केंद्र', ta: 'பால் மற்றும் சேகரிப்பு மையம்', te: 'డెయిరీ & పాల సేకరణ కేంద్రం', kn: 'ಹೈನು ಮತ್ತು ಹಾಲು ಸಂಗ್ರಹ ಕೇಂದ್ರ', gu: 'ડેરી અને દૂધ સંગ્રહ કેન્દ્ર', pa: 'ਡੇਅਰੀ ਅਤੇ ਦੁੱਧ ਇਕੱਠਾ ਕਰਨ ਦਾ ਕੇਂਦਰ' },
  poultry: { en: 'Poultry Farming', hi: 'पोल्ट्री फार्मिंग', bn: 'পোল্ট্রি ফার্মিং', mr: 'कुक्कुटपालन', ta: 'கோழிப்பண்ணை', te: 'పౌల్ట్రీ ఫార్మింగ్', kn: 'ಕೋಳಿ ಸಾಕಣೆ', gu: 'પોલ્ટ્રી ફાર્મિંગ', pa: 'ਪੋਲਟਰੀ ਫਾਰਮਿੰਗ' },
  food: { en: 'Micro Food Processing Unit', hi: 'सूक्ष्म फूड प्रोसेसिंग इकाई', bn: 'মাইক্রো খাদ্য প্রক্রিয়াকরণ ইউনিট', mr: 'सूक्ष्म अन्न प्रक्रिया युनिट', ta: 'சிறு உணவு பதப்படுத்தல் அலகு', te: 'మైక్రో ఫుడ్ ప్రాసెసింగ్ యూనిట్', kn: 'ಸಣ್ಣ ಆಹಾರ ಸಂಸ್ಕರಣೆ ಘಟಕ', gu: 'માઇક્રો ફૂડ પ્રોસેસિંગ યુનિટ', pa: 'ਮਾਈਕ੍ਰੋ ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ ਯੂਨਿਟ' },
  tailoring: { en: 'Tailoring & Garment Micro Unit', hi: 'सिलाई और गारमेंट माइक्रो यूनिट', bn: 'সেলাই ও পোশাক মাইক্রো ইউনিট', mr: 'शिवणकाम व गारमेंट मायक्रो युनिट', ta: 'தையல் மற்றும் ஆடை சிறு அலகு', te: 'టైలరింగ్ & గార్మెంట్ మైక్రో యూనిట్', kn: 'ಟೈಲರಿಂಗ್ ಮತ್ತು ಗಾರ್ಮೆಂಟ್ ಘಟಕ', gu: 'ટેલરિંગ અને ગારમેન્ટ માઇક્રો યુનિટ', pa: 'ਸਿਲਾਈ ਅਤੇ ਗਾਰਮੈਂਟ ਮਾਈਕ੍ਰੋ ਯੂਨਿਟ' },
  repair: { en: 'Mobile & Electronics Repair Centre', hi: 'मोबाइल और इलेक्ट्रॉनिक्स रिपेयर सेंटर', bn: 'মোবাইল ও ইলেকট্রনিক্স রিপেয়ার সেন্টার', mr: 'मोबाइल व इलेक्ट्रॉनिक्स दुरुस्ती केंद्र', ta: 'மொபைல் மற்றும் மின்னணு பழுது மையம்', te: 'మొబైల్ & ఎలక్ట్రానిక్స్ రిపేర్ సెంటర్', kn: 'ಮೊಬೈಲ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ರಿಪೇರಿ ಕೇಂದ್ರ', gu: 'મોબાઇલ અને ઇલેક્ટ્રોનિક્સ રિપેર સેન્ટર', pa: 'ਮੋਬਾਈਲ ਅਤੇ ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਰਿਪੇਅਰ ਸੈਂਟਰ' },
  digital: { en: 'Local Digital Services & Marketing Agency', hi: 'स्थानीय डिजिटल सर्विस और मार्केटिंग एजेंसी', bn: 'স্থানীয় ডিজিটাল সার্ভিস ও মার্কেটিং এজেন্সি', mr: 'स्थानिक डिजिटल सेवा व मार्केटिंग एजन्सी', ta: 'உள்ளூர் டிஜிட்டல் சேவை மற்றும் மார்க்கெட்டிங் நிறுவனம்', te: 'లోకల్ డిజిటల్ సర్వీసెస్ & మార్కెటింగ్ ఏజెన్సీ', kn: 'ಸ್ಥಳೀಯ ಡಿಜಿಟಲ್ ಸೇವೆ ಮತ್ತು ಮಾರ್ಕೆಟಿಂಗ್ ಏಜೆನ್ಸಿ', gu: 'સ્થાનિક ડિજિટલ સેવા અને માર્કેટિંગ એજન્સી', pa: 'ਸਥਾਨਕ ਡਿਜ਼ੀਟਲ ਸੇਵਾ ਅਤੇ ਮਾਰਕੀਟਿੰਗ ਏਜੰਸੀ' },
  handicraft: { en: 'Handicraft & Artisan Product Unit', hi: 'हस्तशिल्प और कारीगर उत्पाद इकाई', bn: 'হস্তশিল্প ও কারিগর পণ্য ইউনিট', mr: 'हस्तकला व कारागीर उत्पादन युनिट', ta: 'கைவினை மற்றும் கலைஞர் பொருள் அலகு', te: 'హస్తకళ & ఆర్టిసన్ ఉత్పత్తి యూనిట్', kn: 'ಕರಕುಶಲ ಮತ್ತು ಕಾರಿಗ ಉತ್ಪನ್ನ ಘಟಕ', gu: 'હસ્તકલા અને કારીગર ઉત્પાદન યુનિટ', pa: 'ਹੱਥਕਲਾ ਅਤੇ ਕਾਰੀਗਰ ਉਤਪਾਦ ਯੂਨਿਟ' },
  carpentry: { en: 'Small Furniture / Carpentry Workshop', hi: 'छोटा फर्नीचर / बढ़ई वर्कशॉप', bn: 'ছোট ফার্নিচার / কাঠের কাজ ওয়ার্কশপ', mr: 'लहान फर्निचर / सुतारकाम वर्कशॉप', ta: 'சிறு மரச்சாமான் / தச்சு பணிமனை', te: 'చిన్న ఫర్నిచర్ / కార్పెంట్రీ వర్క్‌షాప్', kn: 'ಸಣ್ಣ ಫರ್ನಿಚರ್ / ಮರಗೆಲಸ ವರ್ಕ್‌ಶಾಪ್', gu: 'નાનું ફર્નિચર / કારપેન્ટ્રી વર્કશોપ', pa: 'ਛੋਟਾ ਫਰਨੀਚਰ / ਕਾਰਪੈਂਟਰੀ ਵਰਕਸ਼ਾਪ' },
  solar: { en: 'Solar Installation & Repair Service', hi: 'सोलर इंस्टॉलेशन और रिपेयर सेवा', bn: 'সোলার ইনস্টলেশন ও রিপেয়ার সার্ভিস', mr: 'सोलर इंस्टॉलेशन व दुरुस्ती सेवा', ta: 'சோலார் நிறுவல் மற்றும் பழுது சேவை', te: 'సోలార్ ఇన్‌స్టాలేషన్ & రిపేర్ సర్వీస్', kn: 'ಸೋಲಾರ್ ಸ್ಥಾಪನೆ ಮತ್ತು ರಿಪೇರಿ ಸೇವೆ', gu: 'સોલાર ઇન્સ્ટોલેશન અને રિપેર સેવા', pa: 'ਸੋਲਰ ਇੰਸਟਾਲੇਸ਼ਨ ਅਤੇ ਰਿਪੇਅਰ ਸੇਵਾ' },
};

const BUSINESS_OPTIONS: BusinessProfile[] = [
  { id: 'mushroom', name: BUSINESS_NAMES.mushroom, category: 'Agriculture Services', minCapital: 120000, maxCapital: 800000, minLand: 0.05, skills: ['agriculture', 'food'], risk: 'Medium', schemeIds: ['CMYUVA', 'PMEGP', 'MUDRA', 'CGTMSE'] },
  { id: 'dairy', name: BUSINESS_NAMES.dairy, category: 'Dairy', minCapital: 250000, maxCapital: 1500000, minLand: 0.15, skills: ['dairy', 'agriculture'], risk: 'Medium', schemeIds: ['CMYUVA', 'MYSY', 'PMEGP', 'MUDRA', 'CGTMSE'] },
  { id: 'poultry', name: BUSINESS_NAMES.poultry, category: 'Poultry', minCapital: 180000, maxCapital: 1200000, minLand: 0.12, skills: ['poultry', 'agriculture'], risk: 'Medium', schemeIds: ['CMYUVA', 'PMEGP', 'MUDRA', 'CGTMSE'] },
  { id: 'food', name: BUSINESS_NAMES.food, category: 'Food Processing', minCapital: 200000, maxCapital: 2000000, minLand: 0.04, skills: ['food', 'agriculture'], risk: 'Medium', schemeIds: ['PMFME', 'ODOP', 'CMYUVA', 'PMEGP', 'MUDRA', 'CGTMSE'] },
  { id: 'tailoring', name: BUSINESS_NAMES.tailoring, category: 'Tailoring', minCapital: 70000, maxCapital: 700000, minLand: 0, skills: ['tailoring'], risk: 'Low', schemeIds: ['VSSY', 'PMVISHWAKARMA', 'CMYUVA', 'MUDRA', 'PMEGP'] },
  { id: 'repair', name: BUSINESS_NAMES.repair, category: 'Repair Services', minCapital: 60000, maxCapital: 500000, minLand: 0, skills: ['electrical', 'computer'], risk: 'Low', schemeIds: ['VSSY', 'CMYUVA', 'MUDRA', 'PMEGP'] },
  { id: 'digital', name: BUSINESS_NAMES.digital, category: 'Other', minCapital: 50000, maxCapital: 400000, minLand: 0, skills: ['digital', 'computer'], risk: 'Low', schemeIds: ['CMYUVA', 'MUDRA', 'PMEGP'] },
  { id: 'handicraft', name: BUSINESS_NAMES.handicraft, category: 'Handicrafts', minCapital: 70000, maxCapital: 800000, minLand: 0, skills: ['handicraft'], risk: 'Low', schemeIds: ['PMVISHWAKARMA', 'VSSY', 'ODOP', 'CMYUVA', 'MUDRA', 'PMEGP'] },
  { id: 'carpentry', name: BUSINESS_NAMES.carpentry, category: 'Small Manufacturing', minCapital: 120000, maxCapital: 1000000, minLand: 0.02, skills: ['carpentry'], risk: 'Medium', schemeIds: ['PMVISHWAKARMA', 'VSSY', 'CMYUVA', 'MUDRA', 'PMEGP'] },
  { id: 'solar', name: BUSINESS_NAMES.solar, category: 'Repair Services', minCapital: 100000, maxCapital: 700000, minLand: 0, skills: ['electrical'], risk: 'Medium', schemeIds: ['VSSY', 'CMYUVA', 'MUDRA', 'PMEGP'] },
];

const SCHEMES: SchemeProfile[] = [
  { id: 'CMYUVA', name: 'Mukhyamantri Yuva Udyami Vikas Abhiyan (CM-YUVA)', scope: 'Uttar Pradesh', bestFor: 'Young UP residents starting manufacturing, service or trade micro-enterprises', benefit: 'Interest support for eligible youth enterprises, subject to current UP scheme rules.', eligibilityHint: 'Check age, residency, education/training and bank conditions on the official UP MSME portal.', officialUrl: 'https://msme1connect.up.gov.in/scheme-list/-mukhyamantri-yuva-udyami-vikas-abhiyan-yojana-%28cm-yuva%29' },
  { id: 'MYSY', name: 'Mukhyamantri Yuva Swarojgar Yojana', scope: 'Uttar Pradesh', bestFor: 'Eligible UP youth establishing industry or service enterprises', benefit: 'Bank-linked finance with margin-money support subject to current scheme conditions.', eligibilityHint: 'Verify age, education, project type and lender requirements.', officialUrl: 'https://msme1connect.up.gov.in/scheme-list/mukhyamantri-yuva-swarojgar-yojana' },
  { id: 'ODOP', name: 'UP ODOP Margin Money Scheme', scope: 'Uttar Pradesh', bestFor: 'Units connected to the notified One District One Product item of the selected district', benefit: 'Project-cost-linked support may be available for eligible ODOP units.', eligibilityHint: 'Only treat this as a strong fit after verifying the selected district’s current ODOP product.', officialUrl: 'https://msme1connect.up.gov.in/scheme-list/financial-assistance-scheme-for-one-district-one-product-%28odop-margin-money-scheme%29' },
  { id: 'VSSY', name: 'Vishwakarma Shram Samman Yojana 2.0', scope: 'Uttar Pradesh', bestFor: 'Traditional artisans and selected technical trades in Uttar Pradesh', benefit: 'Skill training, tool/financial support and market-linkage assistance may apply to covered trades.', eligibilityHint: 'Verify that the selected skill/trade is currently covered.', officialUrl: 'https://msme1connect.up.gov.in/scheme-list/vishwakarma-shram-samman-yojana' },
  { id: 'PMEGP', name: 'Prime Minister Employment Generation Programme (PMEGP)', scope: 'Central', bestFor: 'New micro-enterprises in manufacturing and service sectors', benefit: 'Credit-linked subsidy support subject to category, location, project size and current rules.', eligibilityHint: 'Check final eligibility on the official PMEGP portal.', officialUrl: 'https://pmegp.msme.gov.in/' },
  { id: 'MUDRA', name: 'Pradhan Mantri MUDRA Yojana (PMMY)', scope: 'Central', bestFor: 'Micro businesses needing business credit through participating lenders', benefit: 'Business-loan support under applicable MUDRA categories; sanction depends on lender appraisal.', eligibilityHint: 'Useful where small business credit is the main need.', officialUrl: 'https://www.financialservices.gov.in/pradhan-mantri-mudra-yojana' },
  { id: 'PMFME', name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)', scope: 'Central', bestFor: 'Eligible micro food-processing enterprises', benefit: 'Credit-linked support may apply subject to current PMFME rules and ceilings.', eligibilityHint: 'Strongest fit for eligible food-processing projects; verify current state implementation.', officialUrl: 'https://pmfme.mofpi.gov.in/' },
  { id: 'PMVISHWAKARMA', name: 'PM Vishwakarma', scope: 'Central', bestFor: 'Eligible traditional artisans and craftspeople in notified trades', benefit: 'Recognition, skill training, toolkit support and enterprise credit are available for eligible trades.', eligibilityHint: 'Only notified trades qualify; verify the selected occupation.', officialUrl: 'https://pmvishwakarma.gov.in/' },
  { id: 'CGTMSE', name: 'CGTMSE Credit Guarantee Scheme', scope: 'Central', bestFor: 'Eligible micro and small enterprises seeking collateral-light bank credit', benefit: 'Credit guarantee support works through eligible lenders and can improve collateral-light access.', eligibilityHint: 'This is not a direct cash subsidy; lender eligibility and appraisal still apply.', officialUrl: 'https://www.cgtmse.in/' },
];

const DISTRICTS: Record<string, DistrictProfile> = {
  Lucknow: { archetype: 'metro', boosts: { digital: 12, computer: 12, food: 10, tailoring: 8, electrical: 8, handicraft: 6 } },
  Barabanki: { archetype: 'periAgri', boosts: { agriculture: 12, dairy: 11, poultry: 10, food: 10, handicraft: 5 } },
  Sitapur: { archetype: 'agri', boosts: { agriculture: 12, dairy: 10, food: 9, poultry: 8 } },
  Unnao: { archetype: 'industrial', boosts: { electrical: 9, tailoring: 8, food: 8, carpentry: 8, agriculture: 6 } },
  'Rae Bareli': { archetype: 'regional', boosts: { agriculture: 9, dairy: 8, electrical: 8, carpentry: 7, food: 7 } },
  Hardoi: { archetype: 'agri', boosts: { agriculture: 12, dairy: 10, poultry: 9, food: 8 } },
  'Kanpur Nagar': { archetype: 'industrial', boosts: { electrical: 12, computer: 10, digital: 10, tailoring: 9, carpentry: 9, food: 8 } },
  Ayodhya: { archetype: 'tourism', boosts: { food: 12, handicraft: 11, tailoring: 9, digital: 8, dairy: 5 } },
  Sultanpur: { archetype: 'regional', boosts: { agriculture: 11, dairy: 9, food: 9, poultry: 8 } },
  'Lakhimpur Kheri': { archetype: 'agri', boosts: { agriculture: 12, dairy: 11, food: 10, poultry: 9 } },
  Bahraich: { archetype: 'agri', boosts: { agriculture: 12, poultry: 10, dairy: 9, food: 9 } },
  Prayagraj: { archetype: 'metro', boosts: { digital: 10, food: 10, handicraft: 8, tailoring: 8, computer: 8, electrical: 7 } },
};

const ARCHETYPE_TEXT: Record<ArchetypeKey, { focus: Localized; route: Localized }> = {
  metro: {
    focus: { en: 'Dense urban demand, service businesses, institutional buyers and online discovery matter more here.', hi: 'घनी शहरी मांग, सेवा व्यवसाय, संस्थागत खरीदार और ऑनलाइन खोज यहां अधिक महत्वपूर्ण हैं।', bn: 'ঘন শহুরে চাহিদা, পরিষেবা ব্যবসা, প্রাতিষ্ঠানিক ক্রেতা ও অনলাইন খোঁজ এখানে বেশি গুরুত্বপূর্ণ।', mr: 'घन शहरी मागणी, सेवा व्यवसाय, संस्थात्मक खरेदीदार आणि ऑनलाइन शोध अधिक महत्त्वाचे आहेत.', ta: 'அடர்த்தியான நகர தேவை, சேவை வணிகம், நிறுவன வாங்குபவர்கள் மற்றும் ஆன்லைன் கண்டுபிடிப்பு முக்கியம்.', te: 'సాంద్ర నగర డిమాండ్, సేవా వ్యాపారాలు, సంస్థాగత కొనుగోలుదారులు మరియు ఆన్‌లైన్ డిస్కవరీ ముఖ్యమైనవి.', kn: 'ನಗರದ ದಟ್ಟ ಬೇಡಿಕೆ, ಸೇವಾ ವ್ಯವಹಾರ, ಸಂಸ್ಥಾತ್ಮಕ ಖರೀದಿದಾರರು ಮತ್ತು ಆನ್‌ಲೈನ್ ಕಂಡುಹಿಡಿಯುವಿಕೆ ಮುಖ್ಯ.', gu: 'ઘન શહેરી માંગ, સેવા બિઝનેસ, સંસ્થાકીય ખરીદદારો અને ઑનલાઇન શોધ વધુ મહત્વપૂર્ણ છે.', pa: 'ਘਣੀ ਸ਼ਹਿਰੀ ਮੰਗ, ਸੇਵਾ ਬਿਜ਼ਨਸ, ਸੰਸਥਾਗਤ ਖਰੀਦਦਾਰ ਅਤੇ ਆਨਲਾਈਨ ਖੋਜ ਵਧੇਰੇ ਮਹੱਤਵਪੂਰਨ ਹਨ।' },
    route: { en: 'Start with 2–3 dense neighbourhood clusters, local B2B tie-ups and WhatsApp/Google/marketplace discovery.', hi: '2–3 घने मोहल्ला क्लस्टर, स्थानीय B2B साझेदारी और WhatsApp/Google/मार्केटप्लेस से शुरुआत करें।', bn: '২–৩টি ঘন পাড়া ক্লাস্টার, স্থানীয় B2B অংশীদারি ও WhatsApp/Google/মার্কেটপ্লেস দিয়ে শুরু করুন।', mr: '2–3 दाट परिसर क्लस्टर, स्थानिक B2B जोडणी आणि WhatsApp/Google/मार्केटप्लेसपासून सुरुवात करा.', ta: '2–3 அடர்த்தியான பகுதி கிளஸ்டர்கள், உள்ளூர் B2B இணைப்புகள் மற்றும் WhatsApp/Google/மார்க்கெட்ப்ளேஸுடன் தொடங்குங்கள்.', te: '2–3 సాంద్ర ప్రాంత క్లస్టర్లు, స్థానిక B2B టై-అప్స్ మరియు WhatsApp/Google/మార్కెట్‌ప్లేస్‌తో ప్రారంభించండి.', kn: '2–3 ದಟ್ಟ ಪ್ರದೇಶ ಕ್ಲಸ್ಟರ್‌ಗಳು, ಸ್ಥಳೀಯ B2B ಒಪ್ಪಂದಗಳು ಮತ್ತು WhatsApp/Google/ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಿ.', gu: '2–3 ઘન વિસ્તાર ક્લસ્ટર, સ્થાનિક B2B જોડાણ અને WhatsApp/Google/માર્કેટપ્લેસથી શરૂઆત કરો.', pa: '2–3 ਘਣੇ ਮੁਹੱਲਾ ਕਲੱਸਟਰ, ਸਥਾਨਕ B2B ਟਾਈ-ਅੱਪ ਅਤੇ WhatsApp/Google/ਮਾਰਕੀਟਪਲੇਸ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।' },
  },
  periAgri: {
    focus: { en: 'Farm-linked demand, nearby town consumption and aggregation/processing opportunities are relatively more important.', hi: 'खेती से जुड़ी मांग, नजदीकी कस्बों की खपत और एग्रीगेशन/प्रोसेसिंग अवसर अपेक्षाकृत अधिक महत्वपूर्ण हैं।', bn: 'কৃষি-সংযুক্ত চাহিদা, কাছের শহরের ভোগ ও সংগ্রহ/প্রক্রিয়াকরণ সুযোগ বেশি গুরুত্বপূর্ণ।', mr: 'शेतीशी जोडलेली मागणी, जवळच्या शहरांची खपत आणि संकलन/प्रक्रिया संधी अधिक महत्त्वाच्या.', ta: 'விவசாய இணைப்பு தேவை, அருகிலுள்ள நகர நுகர்வு மற்றும் சேகரிப்பு/பதப்படுத்தல் வாய்ப்புகள் முக்கியம்.', te: 'వ్యవసాయ అనుసంధాన డిమాండ్, సమీప పట్టణ వినియోగం మరియు అగ్రిగేషన్/ప్రాసెసింగ్ అవకాశాలు ముఖ్యమైనవి.', kn: 'ಕೃಷಿ ಸಂಬಂಧಿತ ಬೇಡಿಕೆ, ಸಮೀಪದ ಪಟ್ಟಣ ಬಳಕೆ ಮತ್ತು ಸಂಗ್ರಹ/ಸಂಸ್ಕರಣೆ ಅವಕಾಶಗಳು ಮುಖ್ಯ.', gu: 'કૃષિ જોડાયેલી માંગ, નજીકના શહેરની ખપત અને એકત્રિકરણ/પ્રોસેસિંગ તકો વધુ મહત્વની.', pa: 'ਖੇਤੀ ਨਾਲ ਜੁੜੀ ਮੰਗ, ਨੇੜਲੇ ਕਸਬਿਆਂ ਦੀ ਖਪਤ ਅਤੇ ਇਕੱਠਾ ਕਰਨ/ਪ੍ਰੋਸੈਸਿੰਗ ਦੇ ਮੌਕੇ ਵਧੇਰੇ ਮਹੱਤਵਪੂਰਨ ਹਨ।' },
    route: { en: 'Build supply links with villages first, then sell through nearby town retailers, collection points and institutional buyers.', hi: 'पहले गांव स्तर पर सप्लाई लिंक बनाएं, फिर नजदीकी कस्बों के रिटेलर, कलेक्शन पॉइंट और संस्थागत खरीदारों तक बेचें।', bn: 'আগে গ্রাম পর্যায়ে সরবরাহ সংযোগ গড়ে তুলুন, তারপর কাছের শহরের খুচরা বিক্রেতা, সংগ্রহ পয়েন্ট ও প্রাতিষ্ঠানিক ক্রেতাদের কাছে বিক্রি করুন।', mr: 'पहिले गाव पातळीवर पुरवठा जोडणी करा, मग जवळच्या शहरातील रिटेलर, संकलन केंद्रे आणि संस्थात्मक खरेदीदारांपर्यंत विक्री करा.', ta: 'முதலில் கிராம வழங்கல் இணைப்புகளை உருவாக்கி, பின்னர் அருகிலுள்ள நகர சில்லறை, சேகரிப்பு மையங்கள் மற்றும் நிறுவனங்களுக்கு விற்கவும்.', te: 'ముందుగా గ్రామ సరఫరా లింకులు నిర్మించి, తరువాత సమీప పట్టణ రిటైలర్లు, కలెక్షన్ పాయింట్లు మరియు సంస్థలకు అమ్మండి.', kn: 'ಮೊದಲು ಗ್ರಾಮ ಸರಬರಾಜು ಸಂಪರ್ಕ ನಿರ್ಮಿಸಿ, ನಂತರ ಸಮೀಪದ ಪಟ್ಟಣದ ರಿಟೇಲರ್, ಸಂಗ್ರಹ ಕೇಂದ್ರ ಮತ್ತು ಸಂಸ್ಥಾತ್ಮಕ ಖರೀದಿದಾರರಿಗೆ ಮಾರಾಟ ಮಾಡಿ.', gu: 'પહેલા ગામ સ્તરે સપ્લાય જોડાણ બનાવો, પછી નજીકના શહેરના રિટેલર, કલેક્શન પોઇન્ટ અને સંસ્થાકીય ખરીદદારોને વેચો.', pa: 'ਪਹਿਲਾਂ ਪਿੰਡ ਪੱਧਰ ਤੇ ਸਪਲਾਈ ਲਿੰਕ ਬਣਾਓ, ਫਿਰ ਨੇੜਲੇ ਕਸਬਿਆਂ ਦੇ ਰਿਟੇਲਰ, ਕਲੇਕਸ਼ਨ ਪੌਇੰਟ ਅਤੇ ਸੰਸਥਾਗਤ ਖਰੀਦਦਾਰਾਂ ਤੱਕ ਵੇਚੋ।' },
  },
  agri: {
    focus: { en: 'Agriculture, livestock, local produce handling and small processing receive a stronger local-market weight.', hi: 'कृषि, पशुपालन, स्थानीय उपज हैंडलिंग और छोटे प्रोसेसिंग व्यवसायों को अधिक स्थानीय महत्व मिलता है।', bn: 'কৃষি, পশুপালন, স্থানীয় উৎপাদন হ্যান্ডলিং ও ছোট প্রক্রিয়াকরণ বেশি স্থানীয় গুরুত্ব পায়।', mr: 'शेती, पशुपालन, स्थानिक उत्पादन हाताळणी आणि लघु प्रक्रिया यांना अधिक स्थानिक वजन मिळते.', ta: 'விவசாயம், கால்நடை, உள்ளூர் உற்பத்தி கையாளுதல் மற்றும் சிறு பதப்படுத்தல் அதிக உள்ளூர் எடை பெறுகின்றன.', te: 'వ్యవసాయం, పశుపోషణ, స్థానిక ఉత్పత్తి హ్యాండ్లింగ్ మరియు చిన్న ప్రాసెసింగ్‌కు ఎక్కువ స్థానిక బరువు ఉంటుంది.', kn: 'ಕೃಷಿ, ಪಶುಪಾಲನೆ, ಸ್ಥಳೀಯ ಉತ್ಪನ್ನ ನಿರ್ವಹಣೆ ಮತ್ತು ಸಣ್ಣ ಸಂಸ್ಕರಣೆಗೆ ಹೆಚ್ಚು ಸ್ಥಳೀಯ ತೂಕ.', gu: 'કૃષિ, પશુપાલન, સ્થાનિક ઉત્પાદન હેન્ડલિંગ અને નાના પ્રોસેસિંગને વધુ સ્થાનિક વજન મળે છે.', pa: 'ਖੇਤੀ, ਪਸ਼ੂਪਾਲਨ, ਸਥਾਨਕ ਉਤਪਾਦ ਸੰਭਾਲ ਅਤੇ ਛੋਟੇ ਪ੍ਰੋਸੈਸਿੰਗ ਕਾਰੋਬਾਰ ਨੂੰ ਵਧੇਰੇ ਸਥਾਨਕ ਭਾਰ ਮਿਲਦਾ ਹੈ।' },
    route: { en: 'Validate with farmer groups, mandi-linked buyers, local retailers and bulk buyers before adding processing capacity.', hi: 'प्रोसेसिंग क्षमता बढ़ाने से पहले किसान समूह, मंडी से जुड़े खरीदार, स्थानीय रिटेलर और बल्क खरीदारों से मांग सत्यापित करें।', bn: 'প্রক্রিয়াকরণ ক্ষমতা বাড়ানোর আগে কৃষক দল, মন্ডি-সংযুক্ত ক্রেতা, স্থানীয় খুচরা ও বাল্ক ক্রেতার সাথে চাহিদা যাচাই করুন।', mr: 'प्रक्रिया क्षमता वाढवण्यापूर्वी शेतकरी गट, मंडईशी जोडलेले खरेदीदार, स्थानिक रिटेलर आणि बल्क खरेदीदारांकडून मागणी तपासा.', ta: 'பதப்படுத்தல் திறன் அதிகரிக்கும் முன் விவசாய குழுக்கள், சந்தை வாங்குபவர்கள், உள்ளூர் சில்லறை மற்றும் மொத்த வாங்குபவர்களிடம் தேவை சரிபார்க்கவும்.', te: 'ప్రాసెసింగ్ సామర్థ్యం పెంచే ముందు రైతు సమూహాలు, మార్కెట్ కొనుగోలుదారులు, స్థానిక రిటైలర్లు మరియు బల్క్ కొనుగోలుదారులతో డిమాండ్ నిర్ధారించండి.', kn: 'ಸಂಸ್ಕರಣೆ ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಿಸುವ ಮೊದಲು ರೈತ ಗುಂಪು, ಮಾರುಕಟ್ಟೆ ಖರೀದಿದಾರರು, ಸ್ಥಳೀಯ ರಿಟೇಲರ್ ಮತ್ತು ಬಲ್ಕ್ ಖರೀದಿದಾರರೊಂದಿಗೆ ಬೇಡಿಕೆ ಪರಿಶೀಲಿಸಿ.', gu: 'પ્રોસેસિંગ ક્ષમતા વધારતા પહેલાં ખેડૂત જૂથ, મંડિ જોડાયેલા ખરીદદારો, સ્થાનિક રિટેલર અને બલ્ક ખરીદદારો સાથે માંગ ચકાસો.', pa: 'ਪ੍ਰੋਸੈਸਿੰਗ ਸਮਰੱਥਾ ਵਧਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਸਾਨ ਗਰੁੱਪ, ਮੰਡੀ ਨਾਲ ਜੁੜੇ ਖਰੀਦਦਾਰ, ਸਥਾਨਕ ਰਿਟੇਲਰ ਅਤੇ ਬਲਕ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਮੰਗ ਜਾਂਚੋ।' },
  },
  industrial: {
    focus: { en: 'Repair, technical services, small manufacturing and B2B supply-chain work receive a stronger local weight.', hi: 'रिपेयर, तकनीकी सेवाएं, छोटे मैन्युफैक्चरिंग और B2B सप्लाई-चेन काम को अधिक स्थानीय महत्व मिलता है।', bn: 'রিপেয়ার, টেকনিক্যাল সার্ভিস, ছোট উৎপাদন ও B2B সাপ্লাই-চেইন কাজ বেশি স্থানীয় ওজন পায়।', mr: 'दुरुस्ती, तांत्रिक सेवा, लघु उत्पादन आणि B2B पुरवठा साखळी कामांना अधिक स्थानिक वजन.', ta: 'பழுது, தொழில்நுட்ப சேவை, சிறு உற்பத்தி மற்றும் B2B விநியோகச் சங்கிலி பணிக்கு அதிக உள்ளூர் எடை.', te: 'రిపేర్, టెక్నికల్ సర్వీసులు, చిన్న తయారీ మరియు B2B సరఫరా-చైన్ పనులకు ఎక్కువ స్థానిక బరువు.', kn: 'ರಿಪೇರಿ, ತಾಂತ್ರಿಕ ಸೇವೆ, ಸಣ್ಣ ಉತ್ಪಾದನೆ ಮತ್ತು B2B ಸರಬರಾಜು ಸರಪಳಿ ಕೆಲಸಕ್ಕೆ ಹೆಚ್ಚು ಸ್ಥಳೀಯ ತೂಕ.', gu: 'રિપેર, ટેકનિકલ સેવા, નાના મેન્યુફેક્ચરિંગ અને B2B સપ્લાય-ચેઇન કામને વધુ સ્થાનિક વજન.', pa: 'ਰਿਪੇਅਰ, ਤਕਨੀਕੀ ਸੇਵਾ, ਛੋਟਾ ਮੈਨੂਫੈਕਚਰਿੰਗ ਅਤੇ B2B ਸਪਲਾਈ-ਚੇਨ ਕੰਮ ਨੂੰ ਵਧੇਰੇ ਸਥਾਨਕ ਭਾਰ ਮਿਲਦਾ ਹੈ।' },
    route: { en: 'Target workshops, retailers, contractors and small industrial buyers first; use service contracts to create repeat revenue.', hi: 'पहले वर्कशॉप, रिटेलर, कॉन्ट्रैक्टर और छोटे औद्योगिक खरीदारों को लक्ष्य बनाएं; दोहराई आय के लिए सर्विस कॉन्ट्रैक्ट लें।', bn: 'প্রথমে ওয়ার্কশপ, খুচরা বিক্রেতা, কন্ট্রাক্টর ও ছোট শিল্প ক্রেতাদের লক্ষ্য করুন; পুনরাবৃত্ত আয়ের জন্য সার্ভিস চুক্তি নিন।', mr: 'वर्कशॉप, रिटेलर, कंत्राटदार आणि लघु औद्योगिक खरेदीदारांना प्रथम लक्ष्य करा; पुनरावृत्ती उत्पन्नासाठी सेवा करार घ्या.', ta: 'முதலில் பணிமனைகள், சில்லறை, ஒப்பந்தக்காரர்கள் மற்றும் சிறு தொழில் வாங்குபவர்களை இலக்காகக் கொண்டு சேவை ஒப்பந்தம் உருவாக்கவும்.', te: 'ముందుగా వర్క్‌షాపులు, రిటైలర్లు, కాంట్రాక్టర్లు మరియు చిన్న పరిశ్రమ కొనుగోలుదారులను లక్ష్యంగా పెట్టి సేవా ఒప్పందాలతో పునరావృత ఆదాయం పొందండి.', kn: 'ಮೊದಲು ವರ್ಕ್‌ಶಾಪ್, ರಿಟೇಲರ್, ಗುತ್ತಿಗೆದಾರರು ಮತ್ತು ಸಣ್ಣ ಕೈಗಾರಿಕಾ ಖರೀದಿದಾರರನ್ನು ಗುರಿಯಾಗಿಸಿ; ಸೇವಾ ಒಪ್ಪಂದಗಳಿಂದ ಮರುಆದಾಯ ನಿರ್ಮಿಸಿ.', gu: 'પહેલા વર્કશોપ, રિટેલર, કોન્ટ્રાક્ટર અને નાના ઔદ્યોગિક ખરીદદારોને લક્ષ્ય બનાવો; સર્વિસ કરારથી પુનરાવર્તિત આવક બનાવો.', pa: 'ਪਹਿਲਾਂ ਵਰਕਸ਼ਾਪ, ਰਿਟੇਲਰ, ਕਾਂਟ੍ਰੈਕਟਰ ਅਤੇ ਛੋਟੇ ਉਦਯੋਗਿਕ ਖਰੀਦਦਾਰਾਂ ਨੂੰ ਟਾਰਗੇਟ ਕਰੋ; ਸੇਵਾ ਕਾਂਟ੍ਰੈਕਟ ਨਾਲ ਦੁਹਰਾਈ ਆਮਦਨ ਬਣਾਓ।' },
  },
  tourism: {
    focus: { en: 'Visitor demand, hospitality, local retail, food and craft-led businesses receive a stronger local-market weight.', hi: 'आगंतुक मांग, हॉस्पिटैलिटी, स्थानीय रिटेल, फूड और क्राफ्ट आधारित व्यवसायों को अधिक स्थानीय महत्व मिलता है।', bn: 'পর্যটক চাহিদা, আতিথেয়তা, স্থানীয় খুচরা, খাদ্য ও কারুশিল্প ব্যবসা বেশি স্থানীয় ওজন পায়।', mr: 'पर्यटक मागणी, हॉस्पिटॅलिटी, स्थानिक रिटेल, अन्न आणि हस्तकला व्यवसायांना अधिक स्थानिक वजन.', ta: 'பார்வையாளர் தேவை, விருந்தோம்பல், உள்ளூர் சில்லறை, உணவு மற்றும் கைவினை வணிகங்களுக்கு அதிக உள்ளூர் எடை.', te: 'సందర్శకుల డిమాండ్, హాస్పిటాలిటీ, స్థానిక రిటైల్, ఆహారం మరియు హస్తకళ వ్యాపారాలకు ఎక్కువ స్థానిక బరువు.', kn: 'ಪ್ರವಾಸಿಗರ ಬೇಡಿಕೆ, ಆತಿಥ್ಯ, ಸ್ಥಳೀಯ ರಿಟೇಲ್, ಆಹಾರ ಮತ್ತು ಕರಕುಶಲ ವ್ಯವಹಾರಗಳಿಗೆ ಹೆಚ್ಚು ಸ್ಥಳೀಯ ತೂಕ.', gu: 'મુલાકાતી માંગ, હોસ્પિટાલિટી, સ્થાનિક રિટેલ, ફૂડ અને હસ્તકલા બિઝનેસને વધુ સ્થાનિક વજન.', pa: 'ਯਾਤਰੀ ਮੰਗ, ਹਾਸਪਿਟੈਲਿਟੀ, ਸਥਾਨਕ ਰਿਟੇਲ, ਖਾਣਾ ਅਤੇ ਹੱਥਕਲਾ ਕਾਰੋਬਾਰ ਨੂੰ ਵਧੇਰੇ ਸਥਾਨਕ ਭਾਰ ਮਿਲਦਾ ਹੈ।' },
    route: { en: 'Test near visitor corridors and local retail clusters, then add hotel/shop tie-ups and digital discovery.', hi: 'आगंतुक कॉरिडोर और स्थानीय रिटेल क्लस्टर के पास परीक्षण करें, फिर होटल/दुकान साझेदारी और डिजिटल खोज जोड़ें।', bn: 'পর্যটক করিডর ও স্থানীয় খুচরা ক্লাস্টারে পরীক্ষা করুন, তারপর হোটেল/দোকান অংশীদারি ও ডিজিটাল খোঁজ যোগ করুন।', mr: 'पर्यटक मार्ग आणि स्थानिक रिटेल क्लस्टरजवळ चाचणी करा, नंतर हॉटेल/दुकान जोडणी आणि डिजिटल शोध जोडा.', ta: 'பார்வையாளர் பாதைகள் மற்றும் உள்ளூர் சில்லறை கிளஸ்டர்களில் சோதித்து, பின்னர் ஹோட்டல்/கடை இணைப்புகள் மற்றும் டிஜிட்டல் கண்டுபிடிப்பை சேர்க்கவும்.', te: 'సందర్శకుల కారిడార్లు మరియు స్థానిక రిటైల్ క్లస్టర్లలో పరీక్షించి, తరువాత హోటల్/షాప్ టై-అప్స్ మరియు డిజిటల్ డిస్కవరీ జోడించండి.', kn: 'ಪ್ರವಾಸಿಗರ ಮಾರ್ಗಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ರಿಟೇಲ್ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ, ನಂತರ ಹೋಟೆಲ್/ಅಂಗಡಿ ಒಪ್ಪಂದ ಮತ್ತು ಡಿಜಿಟಲ್ ಕಂಡುಹಿಡಿಯುವಿಕೆ ಸೇರಿಸಿ.', gu: 'મુલાકાતી કોરિડોર અને સ્થાનિક રિટેલ ક્લસ્ટરમાં ટેસ્ટ કરો, પછી હોટેલ/દુકાન જોડાણ અને ડિજિટલ શોધ ઉમેરો.', pa: 'ਯਾਤਰੀ ਰੂਟ ਅਤੇ ਸਥਾਨਕ ਰਿਟੇਲ ਕਲੱਸਟਰ ਨੇੜੇ ਟੈਸਟ ਕਰੋ, ਫਿਰ ਹੋਟਲ/ਦੁਕਾਨ ਟਾਈ-ਅੱਪ ਅਤੇ ਡਿਜ਼ੀਟਲ ਖੋਜ ਜੋੜੋ।' },
  },
  regional: {
    focus: { en: 'A mixed district market rewards businesses that combine local household demand with nearby town and B2B customers.', hi: 'मिश्रित जिला बाजार में वे व्यवसाय बेहतर रहते हैं जो स्थानीय घरेलू मांग को नजदीकी कस्बे और B2B ग्राहकों से जोड़ते हैं।', bn: 'মিশ্র জেলা বাজারে স্থানীয় পরিবার চাহিদার সঙ্গে কাছের শহর ও B2B ক্রেতা যুক্ত করা ব্যবসা ভালো করে।', mr: 'मिश्र जिल्हा बाजारात स्थानिक घरगुती मागणीसोबत जवळचे शहर आणि B2B ग्राहक जोडणारे व्यवसाय चांगले ठरतात.', ta: 'கலப்பு மாவட்ட சந்தையில் உள்ளூர் குடும்ப தேவை, அருகிலுள்ள நகரம் மற்றும் B2B வாடிக்கையாளர்களை இணைக்கும் வணிகங்கள் சிறப்பாக செயல்படும்.', te: 'మిశ్రమ జిల్లా మార్కెట్లో స్థానిక గృహ డిమాండ్‌ను సమీప పట్టణం మరియు B2B కస్టమర్లతో కలిపే వ్యాపారాలు మెరుగ్గా ఉంటాయి.', kn: 'ಮಿಶ್ರ ಜಿಲ್ಲಾ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಸ್ಥಳೀಯ ಮನೆ ಬೇಡಿಕೆಯನ್ನು ಸಮೀಪದ ಪಟ್ಟಣ ಮತ್ತು B2B ಗ್ರಾಹಕರೊಂದಿಗೆ ಜೋಡಿಸುವ ವ್ಯವಹಾರಗಳು ಉತ್ತಮ.', gu: 'મિશ્ર જિલ્લા બજારમાં સ્થાનિક ઘરેલુ માંગને નજીકના શહેર અને B2B ગ્રાહકો સાથે જોડતા બિઝનેસ વધુ સારું કરે છે.', pa: 'ਮਿਸ਼ਰਤ ਜ਼ਿਲ੍ਹਾ ਮਾਰਕੀਟ ਵਿੱਚ ਸਥਾਨਕ ਘਰੇਲੂ ਮੰਗ ਨੂੰ ਨੇੜਲੇ ਕਸਬੇ ਅਤੇ B2B ਗਾਹਕਾਂ ਨਾਲ ਜੋੜਨ ਵਾਲੇ ਕਾਰੋਬਾਰ ਚੰਗੇ ਰਹਿੰਦੇ ਹਨ।' },
    route: { en: 'Begin with one local customer segment, one nearby town channel and one B2B partner instead of spreading too early.', hi: 'बहुत जल्दी फैलने के बजाय एक स्थानीय ग्राहक समूह, एक नजदीकी कस्बा चैनल और एक B2B पार्टनर से शुरुआत करें।', bn: 'খুব দ্রুত ছড়িয়ে না পড়ে একটি স্থানীয় গ্রাহক গোষ্ঠী, একটি কাছের শহর চ্যানেল ও একটি B2B পার্টনার দিয়ে শুরু করুন।', mr: 'लवकर जास्त विस्तार न करता एक स्थानिक ग्राहक गट, एक जवळचे शहर चॅनेल आणि एक B2B भागीदार निवडा.', ta: 'விரைவில் அதிகமாக பரவாமல் ஒரு உள்ளூர் வாடிக்கையாளர் பிரிவு, ஒரு அருகிலுள்ள நகர சேனல் மற்றும் ஒரு B2B கூட்டாளியுடன் தொடங்குங்கள்.', te: 'త్వరగా విస్తరించకుండా ఒక స్థానిక కస్టమర్ సెగ్మెంట్, ఒక సమీప పట్టణ ఛానల్ మరియు ఒక B2B భాగస్వామితో ప్రారంభించండి.', kn: 'ತುಂಬಾ ಬೇಗ ಹರಡುವುದಕ್ಕಿಂತ ಒಂದು ಸ್ಥಳೀಯ ಗ್ರಾಹಕ ವಿಭಾಗ, ಒಂದು ಸಮೀಪದ ಪಟ್ಟಣ ಚಾನೆಲ್ ಮತ್ತು ಒಂದು B2B ಪಾಲುದಾರರಿಂದ ಪ್ರಾರಂಭಿಸಿ.', gu: 'ઝડપથી ફેલાવા બદલે એક સ્થાનિક ગ્રાહક વિભાગ, એક નજીકના શહેર ચેનલ અને એક B2B ભાગીદારથી શરૂઆત કરો.', pa: 'ਬਹੁਤ ਜਲਦੀ ਫੈਲਣ ਦੀ ਬਜਾਏ ਇੱਕ ਸਥਾਨਕ ਗਾਹਕ ਸਮੂਹ, ਇੱਕ ਨੇੜਲਾ ਕਸਬਾ ਚੈਨਲ ਅਤੇ ਇੱਕ B2B ਸਾਥੀ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।' },
  },
};

const SKILL_PLAN: Record<SkillKey, SkillPlan> = {
  agriculture: { equipment: 30, working: 35, market: 10, buffer: 25 },
  dairy: { equipment: 45, working: 30, market: 10, buffer: 15 },
  poultry: { equipment: 40, working: 30, market: 10, buffer: 20 },
  food: { equipment: 45, working: 25, market: 15, buffer: 15 },
  tailoring: { equipment: 50, working: 20, market: 15, buffer: 15 },
  electrical: { equipment: 40, working: 25, market: 20, buffer: 15 },
  digital: { equipment: 25, working: 20, market: 35, buffer: 20 },
  computer: { equipment: 35, working: 20, market: 30, buffer: 15 },
  handicraft: { equipment: 30, working: 35, market: 20, buffer: 15 },
  carpentry: { equipment: 55, working: 20, market: 10, buffer: 15 },
};

const CATEGORY_DEFAULT: Record<BusinessCategory, SkillKey> = {
  Dairy: 'dairy', 'Food Processing': 'food', Retail: 'digital', 'Agriculture Services': 'agriculture', Poultry: 'poultry', Tailoring: 'tailoring', Handicrafts: 'handicraft', 'Repair Services': 'electrical', 'Small Manufacturing': 'carpentry', Other: 'digital',
};

const formatTemplate = (value: string, values: Record<string, string>) =>
  Object.entries(values).reduce((result, [key, replacement]) => result.replaceAll(`{${key}}`, replacement), value);

const skillLabel = (skill: SkillKey, language: LanguageCode) => SKILLS.find((item) => item.value === skill)?.labels[language] || skill;
const riskLabel = (risk: Risk, copy: Record<string, string>) => risk === 'Low' ? copy.low : risk === 'High' ? copy.high : copy.medium;

const capitalFit = (capital: number, min: number, max: number) => {
  if (capital >= min && capital <= max) return 25;
  if (capital < min) return Math.max(0, 25 - ((min - capital) / Math.max(min, 1)) * 25);
  return Math.max(8, 25 - ((capital - max) / Math.max(max, 1)) * 12);
};

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ initialData, onSubmit, language }) => {
  const copy = COPY[language] || COPY.en;
  const [landArea, setLandArea] = useState<number>(initialData.availableLandAcres ?? 0.25);
  const [capital, setCapital] = useState<number>(initialData.availableMargin || initialData.marginCapital || 300000);
  const [expertise, setExpertise] = useState<SkillKey>((initialData.selectedExpertise as SkillKey) || CATEGORY_DEFAULT[initialData.category] || 'agriculture');
  const [stateName, setStateName] = useState<string>(initialData.location.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState<string>(UP_LOCATIONS.includes(initialData.location.district) ? initialData.location.district : 'Lucknow');
  const [risk, setRisk] = useState<Risk>(initialData.riskWillingness || 'Medium');
  const [experience, setExperience] = useState<Experience>(initialData.priorExperience || 'Some');
  const [showResults, setShowResults] = useState(false);

  const districtProfile = DISTRICTS[district] || { archetype: 'regional' as ArchetypeKey, boosts: {} };
  const localText = ARCHETYPE_TEXT[districtProfile.archetype];
  const prioritySkills = Object.entries(districtProfile.boosts)
    .sort((a, b) => (b[1] || 0) - (a[1] || 0))
    .slice(0, 3)
    .map(([key]) => skillLabel(key as SkillKey, language));

  const recommendations = useMemo(() => {
    const isUP = stateName === 'Uttar Pradesh';
    return BUSINESS_OPTIONS.map((business) => {
      const cFit = capitalFit(capital, business.minCapital, business.maxCapital);
      const landFit = business.minLand === 0 ? 15 : landArea >= business.minLand ? 15 : Math.max(0, (landArea / business.minLand) * 15);
      const hasSkillMatch = business.skills.includes(expertise);
      const skillFit = hasSkillMatch ? 30 : 6;
      const boost = Math.max(...business.skills.map((skill) => districtProfile.boosts[skill] || 0), 0);
      const locationFit = 8 + Math.min(12, boost);
      const riskFit = business.risk === risk ? 5 : risk === 'High' ? 4 : business.risk === 'Low' ? 4 : 3;
      const experienceFit = experience === 'Experienced' ? 5 : experience === 'Some' ? 4 : 3;
      const score = Math.min(98, Math.round(cFit + landFit + skillFit + locationFit + riskFit + experienceFit));
      const primarySkill = hasSkillMatch ? expertise : business.skills[0];
      const allocation = SKILL_PLAN[primarySkill];

      const schemes = business.schemeIds
        .map((id) => SCHEMES.find((item) => item.id === id))
        .filter((item): item is SchemeProfile => Boolean(item))
        .filter((scheme) => scheme.scope === 'Central' || isUP)
        .map((scheme, index) => ({
          ...scheme,
          matchScore: Math.max(60, Math.min(97, score - index * 4 + (scheme.scope === 'Uttar Pradesh' && isUP ? 4 : 0))),
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      return { ...business, score, localFit: Math.min(100, 55 + locationFit * 2), primarySkill, allocation, schemes };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [capital, districtProfile, expertise, experience, landArea, risk, stateName]);

  const experienceAdvice = experience === 'None' ? copy.noneAdvice : experience === 'Experienced' ? copy.experiencedAdvice : copy.someAdvice;

  const applyRecommendation = (business: (typeof recommendations)[number]) => {
    const targetMarket = `${district}, ${stateName}. ${localText.route[language]}`;
    const next: AssessmentFormData = {
      ...initialData,
      location: { ...initialData.location, state: stateName, district },
      marginCapital: capital,
      availableMargin: capital,
      availableLandAcres: landArea,
      selectedExpertise: expertise,
      category: business.category,
      ideaText: business.name.en,
      businessIdea: business.name.en,
      targetMarket,
      priorExperience: experience,
      riskWillingness: risk,
      preferredLanguage: language,
    };
    onSubmit(next);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 py-2" lang={language}>
      <section className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#6B4535]"><Sparkles className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-[0.2em]">{copy.eyebrow}</span></div>
            <h1 className="text-2xl font-black text-[#2B1B16] sm:text-3xl">{copy.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#7A5A49]">{copy.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-[#D9B99B]/50 bg-[#FAF7F3] px-4 py-3 text-xs font-bold text-[#6B4535]">{copy.badge}</div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-5 flex items-center gap-2"><Target className="h-5 w-5 text-[#8B5E47]" /><h2 className="text-lg font-extrabold text-[#2B1B16]">{copy.resources}</h2></div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><LandPlot className="h-4 w-4 text-[#8B5E47]" />{copy.land}</span>
            <input type="number" min="0" step="0.01" value={landArea} onChange={(e) => { setLandArea(Number(e.target.value)); setShowResults(false); }} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
          </label>
          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-[#8B5E47]" />{copy.capital}</span>
            <input type="number" min="10000" step="10000" value={capital} onChange={(e) => { setCapital(Number(e.target.value)); setShowResults(false); }} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
          </label>

          <div className="space-y-3 md:col-span-2">
            <div><span className="flex items-center gap-2 text-xs font-bold text-[#2B1B16]"><UserRoundCog className="h-4 w-4 text-[#8B5E47]" />{copy.skills}</span><p className="mt-1 text-[11px] text-[#8B5E47]">{copy.skillHint}</p></div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {SKILLS.map((option) => {
                const selected = expertise === option.value;
                return <button key={option.value} type="button" onClick={() => { setExpertise(option.value); setShowResults(false); }} className={`rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${selected ? 'border-[#6B4535] bg-[#6B4535] text-white shadow-sm' : 'border-[#D9B99B]/60 bg-[#FAF7F3] text-[#4A2F24] hover:border-[#8B5E47] hover:bg-[#F3E8DC]'}`}>{option.labels[language]}</button>;
              })}
            </div>
          </div>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8B5E47]" />{copy.state}</span>
            <select value={stateName} onChange={(e) => { setStateName(e.target.value); setShowResults(false); }} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none"><option value="Uttar Pradesh">{copy.up}</option><option value="Other State">{copy.otherState}</option></select>
          </label>
          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>{copy.district}</span>
            {stateName === 'Uttar Pradesh' ? <select value={district} onChange={(e) => { setDistrict(e.target.value); setShowResults(false); }} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none">{UP_LOCATIONS.map((place) => <option key={place} value={place}>{place}</option>)}</select> : <input value={district} onChange={(e) => { setDistrict(e.target.value); setShowResults(false); }} placeholder={copy.otherDistrict} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />}
          </label>

          <div className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>{copy.risk}</span>
            <div className="grid grid-cols-3 gap-2">{(['Low', 'Medium', 'High'] as Risk[]).map((item) => <button key={item} type="button" onClick={() => { setRisk(item); setShowResults(false); }} className={`rounded-xl border px-3 py-3 ${risk === item ? 'border-[#6B4535] bg-[#6B4535] text-white' : 'border-[#D9B99B]/60 bg-[#FAF7F3] text-[#4A2F24]'}`}>{riskLabel(item, copy)}</button>)}</div>
          </div>
          <div className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>{copy.experience}</span>
            <div className="grid grid-cols-3 gap-2">{([
              ['None', copy.beginner], ['Some', copy.some], ['Experienced', copy.experienced],
            ] as Array<[Experience, string]>).map(([value, label]) => <button key={value} type="button" onClick={() => { setExperience(value); setShowResults(false); }} className={`rounded-xl border px-3 py-3 ${experience === value ? 'border-[#6B4535] bg-[#6B4535] text-white' : 'border-[#D9B99B]/60 bg-[#FAF7F3] text-[#4A2F24]'}`}>{label}</button>)}</div>
          </div>
        </div>

        <button type="button" onClick={() => setShowResults(true)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B4535] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#503126] sm:w-auto"><Sparkles className="h-4 w-4" />{copy.find}</button>
      </section>

      {showResults && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-[#D9B99B]/50 bg-[#FFFDF9] p-5">
            <h2 className="text-xl font-black text-[#2B1B16]">{copy.top} {district}</h2>
            <p className="mt-1 text-xs text-[#7A5A49]">{copy.disclaimerShort}</p>
            <p className="mt-3 text-sm font-semibold text-[#5F493D]">{localText.focus[language]}</p>
            <p className="mt-2 text-xs text-[#8B5E47]">{formatTemplate(copy.localPrioritiesPrefix, { district })}: <strong>{prioritySkills.join(' • ') || skillLabel(expertise, language)}</strong></p>
          </div>

          {recommendations.map((business, index) => {
            const allocation = business.allocation;
            const amounts = {
              equipment: Math.round(capital * allocation.equipment / 100),
              working: Math.round(capital * allocation.working / 100),
              market: Math.round(capital * allocation.market / 100),
              buffer: Math.round(capital * allocation.buffer / 100),
            };
            return (
              <article key={business.id} className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-[#6F7655]/15 px-3 py-1 text-xs font-black text-[#56603F]">#{index + 1} {copy.match}</span><span className="rounded-full bg-[#FAF0E5] px-3 py-1 text-xs font-black text-[#8B5E47]">{business.score}% {copy.businessFit}</span><span className="rounded-full bg-[#E8EEF6] px-3 py-1 text-xs font-black text-[#52667C]">{business.localFit}% {copy.localFit}</span></div>
                    <div><h3 className="text-xl font-black text-[#2B1B16]">{business.name[language]}</h3><p className="mt-1 text-sm text-[#765849]">{formatTemplate(copy.because, { skill: skillLabel(business.primarySkill, language), district })}</p></div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[#FAF7F3] p-3 text-xs"><span className="block text-[#8B5E47]">{copy.capitalRange}</span><strong>₹{business.minCapital.toLocaleString('en-IN')} – ₹{business.maxCapital.toLocaleString('en-IN')}</strong></div>
                      <div className="rounded-2xl bg-[#FAF7F3] p-3 text-xs"><span className="block text-[#8B5E47]">{copy.minimumLand}</span><strong>{business.minLand === 0 ? copy.noLand : `${business.minLand} ${copy.acre}`}</strong></div>
                      <div className="rounded-2xl bg-[#FAF7F3] p-3 text-xs"><span className="block text-[#8B5E47]">{copy.riskProfile}</span><strong>{riskLabel(business.risk, copy)}</strong></div>
                    </div>

                    <div className="rounded-2xl border border-[#D9B99B]/50 bg-[#FFF9F1] p-4">
                      <div className="mb-3 text-sm font-black text-[#5B3C29]">{copy.districtPlan}</div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-xl bg-white p-3 text-xs"><strong className="block text-[#6B4535]">{copy.marketFocus}</strong><span className="mt-1 block text-[#6F5C50]">{localText.focus[language]}</span></div>
                        <div className="rounded-xl bg-white p-3 text-xs"><strong className="block text-[#6B4535]">{copy.route}</strong><span className="mt-1 block text-[#6F5C50]">{localText.route[language]}</span></div>
                        <div className="rounded-xl bg-white p-3 text-xs md:col-span-2"><strong className="block text-[#6B4535]">{copy.experienceAdvice}</strong><span className="mt-1 block text-[#6F5C50]">{experienceAdvice}</span></div>
                      </div>

                      <div className="mt-4"><div className="mb-2 text-xs font-extrabold text-[#5B3C29]">{copy.allocation}</div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          [copy.equipment, allocation.equipment, amounts.equipment], [copy.working, allocation.working, amounts.working], [copy.acquisition, allocation.market, amounts.market], [copy.buffer, allocation.buffer, amounts.buffer],
                        ].map(([label, pct, amount]) => <div key={String(label)} className="rounded-xl border border-[#EAD8C4] bg-white p-3 text-xs"><span className="block text-[#8B5E47]">{label}</span><strong className="block text-[#2B1B16]">{pct}% · ₹{Number(amount).toLocaleString('en-IN')}</strong></div>)}
                      </div></div>

                      <div className="mt-4"><div className="mb-2 text-xs font-extrabold text-[#5B3C29]">{copy.first90}</div><div className="space-y-2">{[copy.phase1, copy.phase2, copy.phase3].map((step, stepIndex) => <div key={stepIndex} className="flex gap-3 rounded-xl bg-white p-3 text-xs text-[#6F5C50]"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6B4535] font-black text-white">{stepIndex + 1}</span><span>{step}</span></div>)}</div></div>
                    </div>

                    <div className="rounded-2xl border border-[#B8C09B]/60 bg-[#F5F7EE] p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#46502F]"><ShieldCheck className="h-4 w-4" />{copy.schemes}</div>
                      <div className="space-y-3">{business.schemes.map((scheme, schemeIndex) => <div key={scheme.id} className="rounded-xl border border-[#CED5B7] bg-white/80 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div className="font-extrabold text-[#2B1B16]">{schemeIndex + 1}. {scheme.name}</div><span className="rounded-full bg-[#DFE7CC] px-2 py-1 text-[10px] font-black text-[#46502F]">{scheme.matchScore}%</span></div><p className="mt-1 text-xs text-[#687050]"><strong>{copy.bestFor}:</strong> {scheme.bestFor}</p><p className="mt-1 text-xs text-[#687050]"><strong>{copy.benefit}:</strong> {scheme.benefit}</p><p className="mt-1 text-xs text-[#687050]"><strong>{copy.eligibility}:</strong> {scheme.eligibilityHint}</p><a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-extrabold text-[#6B4535] underline decoration-[#D9B99B] underline-offset-4">{copy.verify}</a></div>)}</div>
                    </div>
                  </div>

                  <button type="button" onClick={() => applyRecommendation(business)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6B4535] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#503126]"><CheckCircle2 className="h-4 w-4" />{copy.use}<ArrowRight className="h-4 w-4" /></button>
                </div>
              </article>
            );
          })}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"><strong>{copy.important}:</strong> {copy.longDisclaimer}</div>
        </section>
      )}
    </div>
  );
};
