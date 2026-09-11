import React, { useEffect, useRef, useState } from 'react';
import { PageId, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../services/localizationService';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  Landmark,
  Lightbulb,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sprout,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  onTryDemo: () => void;
  onOpenHelp: () => void;
}

type LandingCopy = {
  tagline: string;
  home: string;
  solutions: string;
  schemes: string;
  resources: string;
  about: string;
  tryDemo: string;
  getStarted: string;
  badge: string;
  heroTitle: string;
  heroBody: string;
  startJourney: string;
  watchStory: string;
  easy: string;
  data: string;
  bharat: string;
  stronger: string;
  dashboard: string;
  businessPlan: string;
  aiAdvisor: string;
  learning: string;
  profile: string;
  welcome: string;
  welcomeSub: string;
  growthLocal: string;
  investment: string;
  monthlyProfit: string;
  businessScore: string;
  riskLevel: string;
  low: string;
  profitProjection: string;
  sixMonthGrowth: string;
  sixMonths: string;
  opportunityTitle: string;
  opportunityBody: string;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionBody: string;
  govtSchemes: string;
  govtSchemesBody: string;
  govtSchemesFooter: string;
  actionPlan: string;
  actionPlanBody: string;
  actionPlanFooter: string;
  aiRecommendation: string;
  aiRecommendationBody: string;
  aiRecommendationFooter: string;
  metricEntrepreneurs: string;
  metricIdeas: string;
  metricSchemes: string;
  metricVillages: string;
  metricIndia: string;
  playScene: string;
  pauseScene: string;
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  storyPoint1: string;
  storyPoint2: string;
  storyPoint3: string;
  startAssessment: string;
};

const COPY: Record<LanguageCode, LandingCopy> = {
  en: {
    tagline: 'SAHI SOCH. BEHTAR KAL.', home: 'Home', solutions: 'Solutions', schemes: 'Government Schemes', resources: 'Resources', about: 'About', tryDemo: 'Try Demo', getStarted: 'Get Started',
    badge: 'Empowering Rural Entrepreneurs', heroTitle: 'Smarter Business Decisions for a Brighter Rural India.', heroBody: 'Nirnay AI helps rural entrepreneurs plan, analyze and grow their businesses with AI-powered local insights, practical financial structuring and relevant government scheme guidance.', startJourney: 'Start Your Journey', watchStory: 'Watch Rural Story', easy: 'Easy to use', data: 'Backed by data', bharat: 'Built for Bharat', stronger: 'Stronger Villages\nBrighter India',
    dashboard: 'Dashboard', businessPlan: 'Business Plan', aiAdvisor: 'AI Advisor', learning: 'Learning', profile: 'Profile', welcome: 'Welcome back, Ramesh!', welcomeSub: 'Good decisions today, a better tomorrow.', growthLocal: 'Growth begins locally 🌱', investment: 'Investment', monthlyProfit: 'Monthly Profit', businessScore: 'Business Score', riskLevel: 'Risk Level', low: 'Low', profitProjection: 'Profit Projection', sixMonthGrowth: '6 Month Growth', sixMonths: '6 Months', opportunityTitle: 'Bigger Opportunities for Brighter Tomorrows', opportunityBody: 'Practical local insight, structured finance and a clearer path to action.',
    sectionEyebrow: 'One platform, practical decisions', sectionTitle: 'From opportunity to execution', sectionBody: 'Nirnay keeps local opportunity, financial planning and government support connected in one decision flow.', govtSchemes: 'Government Schemes', govtSchemesBody: 'Discover relevant schemes and support options for your business.', govtSchemesFooter: 'Scheme-aware guidance', actionPlan: 'Action Plan', actionPlanBody: 'Turn your assessment into a clear, practical path to launch and grow.', actionPlanFooter: 'From idea to implementation', aiRecommendation: 'AI Recommendation', aiRecommendationBody: 'Get personalized feasibility guidance based on your business idea and location.', aiRecommendationFooter: 'AI-assisted, data-grounded', metricEntrepreneurs: 'Rural Entrepreneurs', metricIdeas: 'Business Ideas Analyzed', metricSchemes: 'Government Support Paths', metricVillages: 'Stronger Villages', metricIndia: 'Brighter India', playScene: 'Play scene', pauseScene: 'Pause scene', storyEyebrow: 'Nirnay AI', storyTitle: 'Built around real rural aspirations', storyBody: 'The visual language stays familiar and grounded in village life while the product experience remains modern, simple and professional.', storyPoint1: 'Local opportunity intelligence', storyPoint2: 'Financial structuring in plain language', storyPoint3: 'Relevant scheme and growth guidance', startAssessment: 'Start Assessment',
  },
  hi: {
    tagline: 'सही सोच। बेहतर कल।', home: 'होम', solutions: 'समाधान', schemes: 'सरकारी योजनाएँ', resources: 'संसाधन', about: 'हमारे बारे में', tryDemo: 'डेमो देखें', getStarted: 'शुरू करें',
    badge: 'ग्रामीण उद्यमियों को सशक्त बनाना', heroTitle: 'बेहतर व्यवसायिक निर्णय, उज्ज्वल ग्रामीण भारत के लिए।', heroBody: 'निर्णय AI ग्रामीण उद्यमियों को स्थानीय जानकारी, वित्तीय संरचना और उपयोगी सरकारी योजनाओं के साथ व्यवसाय की योजना बनाने, समझने और बढ़ाने में मदद करता है।', startJourney: 'अपनी यात्रा शुरू करें', watchStory: 'ग्रामीण कहानी देखें', easy: 'उपयोग में आसान', data: 'डेटा पर आधारित', bharat: 'भारत के लिए बनाया गया', stronger: 'मज़बूत गाँव\nउज्ज्वल भारत',
    dashboard: 'डैशबोर्ड', businessPlan: 'व्यवसाय योजना', aiAdvisor: 'AI सलाहकार', learning: 'सीखें', profile: 'प्रोफ़ाइल', welcome: 'वापसी पर स्वागत है, रमेश!', welcomeSub: 'आज सही निर्णय, कल बेहतर भविष्य।', growthLocal: 'विकास स्थानीय स्तर से शुरू होता है 🌱', investment: 'निवेश', monthlyProfit: 'मासिक लाभ', businessScore: 'व्यवसाय स्कोर', riskLevel: 'जोखिम स्तर', low: 'कम', profitProjection: 'लाभ अनुमान', sixMonthGrowth: '6 माह की वृद्धि', sixMonths: '6 माह', opportunityTitle: 'बेहतर कल के लिए बड़े अवसर', opportunityBody: 'स्थानीय जानकारी, सुव्यवस्थित वित्त और कार्रवाई का स्पष्ट रास्ता।',
    sectionEyebrow: 'एक मंच, व्यावहारिक निर्णय', sectionTitle: 'अवसर से क्रियान्वयन तक', sectionBody: 'निर्णय AI स्थानीय अवसर, वित्तीय योजना और सरकारी सहायता को एक ही निर्णय प्रक्रिया में जोड़ता है।', govtSchemes: 'सरकारी योजनाएँ', govtSchemesBody: 'अपने व्यवसाय के लिए प्रासंगिक योजनाएँ और सहायता विकल्प खोजें।', govtSchemesFooter: 'योजना-आधारित मार्गदर्शन', actionPlan: 'कार्य योजना', actionPlanBody: 'अपने मूल्यांकन को व्यवसाय शुरू करने और बढ़ाने की स्पष्ट योजना में बदलें।', actionPlanFooter: 'विचार से क्रियान्वयन तक', aiRecommendation: 'AI सुझाव', aiRecommendationBody: 'अपने व्यवसाय विचार और स्थान के आधार पर व्यक्तिगत व्यवहार्यता मार्गदर्शन प्राप्त करें।', aiRecommendationFooter: 'AI-सहायित, डेटा-आधारित', metricEntrepreneurs: 'ग्रामीण उद्यमी', metricIdeas: 'व्यवसाय विचारों का विश्लेषण', metricSchemes: 'सरकारी सहायता मार्ग', metricVillages: 'मज़बूत गाँव', metricIndia: 'उज्ज्वल भारत', playScene: 'दृश्य चलाएँ', pauseScene: 'दृश्य रोकें', storyEyebrow: 'निर्णय AI', storyTitle: 'ग्रामीण आकांक्षाओं के लिए बनाया गया', storyBody: 'डिज़ाइन गाँव के जीवन से परिचित और जुड़ा हुआ है, जबकि अनुभव आधुनिक, सरल और पेशेवर रहता है।', storyPoint1: 'स्थानीय अवसर की जानकारी', storyPoint2: 'सरल भाषा में वित्तीय संरचना', storyPoint3: 'उपयुक्त योजना और विकास मार्गदर्शन', startAssessment: 'मूल्यांकन शुरू करें',
  },
  bn: {
    tagline: 'সঠিক ভাবনা। উন্নত আগামী।', home: 'হোম', solutions: 'সমাধান', schemes: 'সরকারি প্রকল্প', resources: 'সম্পদ', about: 'আমাদের সম্পর্কে', tryDemo: 'ডেমো দেখুন', getStarted: 'শুরু করুন',
    badge: 'গ্রামীণ উদ্যোক্তাদের ক্ষমতায়ন', heroTitle: 'উন্নত ব্যবসায়িক সিদ্ধান্ত, উজ্জ্বল গ্রামীণ ভারতের জন্য।', heroBody: 'Nirnay AI স্থানীয় তথ্য, আর্থিক পরিকল্পনা এবং প্রাসঙ্গিক সরকারি প্রকল্পের মাধ্যমে গ্রামীণ উদ্যোক্তাদের ব্যবসা পরিকল্পনা ও বৃদ্ধি করতে সহায়তা করে।', startJourney: 'আপনার যাত্রা শুরু করুন', watchStory: 'গ্রামীণ গল্প দেখুন', easy: 'ব্যবহার সহজ', data: 'তথ্যভিত্তিক', bharat: 'ভারতের জন্য তৈরি', stronger: 'শক্তিশালী গ্রাম\nউজ্জ্বল ভারত',
    dashboard: 'ড্যাশবোর্ড', businessPlan: 'ব্যবসা পরিকল্পনা', aiAdvisor: 'AI পরামর্শদাতা', learning: 'শিখুন', profile: 'প্রোফাইল', welcome: 'স্বাগতম, রমেশ!', welcomeSub: 'আজ ভালো সিদ্ধান্ত, আগামীকাল ভালো ভবিষ্যৎ।', growthLocal: 'বৃদ্ধি শুরু হয় স্থানীয়ভাবে 🌱', investment: 'বিনিয়োগ', monthlyProfit: 'মাসিক লাভ', businessScore: 'ব্যবসা স্কোর', riskLevel: 'ঝুঁকির স্তর', low: 'কম', profitProjection: 'লাভের পূর্বাভাস', sixMonthGrowth: '৬ মাসের বৃদ্ধি', sixMonths: '৬ মাস', opportunityTitle: 'উজ্জ্বল ভবিষ্যতের জন্য বড় সুযোগ', opportunityBody: 'স্থানীয় তথ্য, সুসংগঠিত অর্থায়ন এবং পরিষ্কার কর্মপথ।',
    sectionEyebrow: 'এক প্ল্যাটফর্ম, বাস্তব সিদ্ধান্ত', sectionTitle: 'সুযোগ থেকে বাস্তবায়ন', sectionBody: 'Nirnay স্থানীয় সুযোগ, আর্থিক পরিকল্পনা এবং সরকারি সহায়তাকে এক সিদ্ধান্ত প্রবাহে যুক্ত করে।', govtSchemes: 'সরকারি প্রকল্প', govtSchemesBody: 'আপনার ব্যবসার জন্য প্রাসঙ্গিক প্রকল্প ও সহায়তা খুঁজুন।', govtSchemesFooter: 'স্কিম-ভিত্তিক নির্দেশনা', actionPlan: 'কর্মপরিকল্পনা', actionPlanBody: 'আপনার মূল্যায়নকে ব্যবসা শুরু ও বাড়ানোর বাস্তব পরিকল্পনায় রূপ দিন।', actionPlanFooter: 'ভাবনা থেকে বাস্তবায়ন', aiRecommendation: 'AI সুপারিশ', aiRecommendationBody: 'আপনার ব্যবসার ধারণা ও অবস্থানের ভিত্তিতে ব্যক্তিগত সম্ভাব্যতা নির্দেশনা পান।', aiRecommendationFooter: 'AI সহায়িত, তথ্যভিত্তিক', metricEntrepreneurs: 'গ্রামীণ উদ্যোক্তা', metricIdeas: 'বিশ্লেষিত ব্যবসার ধারণা', metricSchemes: 'সরকারি সহায়তার পথ', metricVillages: 'শক্তিশালী গ্রাম', metricIndia: 'উজ্জ্বল ভারত', playScene: 'দৃশ্য চালান', pauseScene: 'দৃশ্য থামান', storyEyebrow: 'Nirnay AI', storyTitle: 'বাস্তব গ্রামীণ আকাঙ্ক্ষাকে কেন্দ্র করে', storyBody: 'ভিজ্যুয়াল ভাষা গ্রামের জীবনের সঙ্গে পরিচিত থাকে, আর পণ্যের অভিজ্ঞতা থাকে আধুনিক, সহজ ও পেশাদার।', storyPoint1: 'স্থানীয় সুযোগের তথ্য', storyPoint2: 'সহজ ভাষায় আর্থিক কাঠামো', storyPoint3: 'প্রাসঙ্গিক প্রকল্প ও বৃদ্ধির দিকনির্দেশনা', startAssessment: 'মূল্যায়ন শুরু করুন',
  },
  mr: {
    tagline: 'योग्य विचार. उत्तम उद्या.', home: 'मुख्यपृष्ठ', solutions: 'उपाय', schemes: 'सरकारी योजना', resources: 'संसाधने', about: 'आमच्याबद्दल', tryDemo: 'डेमो पहा', getStarted: 'सुरू करा',
    badge: 'ग्रामीण उद्योजकांना सक्षम बनवणे', heroTitle: 'हुशार व्यवसाय निर्णय, उज्ज्वल ग्रामीण भारतासाठी.', heroBody: 'Nirnay AI स्थानिक माहिती, आर्थिक रचना आणि संबंधित सरकारी योजनांच्या मदतीने ग्रामीण उद्योजकांना व्यवसाय नियोजन, विश्लेषण आणि वाढीस मदत करते.', startJourney: 'तुमचा प्रवास सुरू करा', watchStory: 'ग्रामीण कथा पहा', easy: 'वापरण्यास सोपे', data: 'डेटावर आधारित', bharat: 'भारतासाठी तयार', stronger: 'मजबूत गावे\nउज्ज्वल भारत',
    dashboard: 'डॅशबोर्ड', businessPlan: 'व्यवसाय योजना', aiAdvisor: 'AI सल्लागार', learning: 'शिकणे', profile: 'प्रोफाइल', welcome: 'पुन्हा स्वागत, रमेश!', welcomeSub: 'आज योग्य निर्णय, उद्या चांगले भविष्य.', growthLocal: 'वाढ स्थानिक पातळीवर सुरू होते 🌱', investment: 'गुंतवणूक', monthlyProfit: 'मासिक नफा', businessScore: 'व्यवसाय गुण', riskLevel: 'जोखीम स्तर', low: 'कमी', profitProjection: 'नफा अंदाज', sixMonthGrowth: '६ महिन्यांची वाढ', sixMonths: '६ महिने', opportunityTitle: 'उज्ज्वल उद्यासाठी मोठ्या संधी', opportunityBody: 'स्थानिक माहिती, संरचित वित्त आणि स्पष्ट कृती मार्ग.',
    sectionEyebrow: 'एक प्लॅटफॉर्म, व्यावहारिक निर्णय', sectionTitle: 'संधीपासून अंमलबजावणीपर्यंत', sectionBody: 'Nirnay स्थानिक संधी, आर्थिक नियोजन आणि सरकारी सहाय्य एका निर्णय प्रवाहात जोडते.', govtSchemes: 'सरकारी योजना', govtSchemesBody: 'तुमच्या व्यवसायासाठी योग्य योजना व सहाय्य पर्याय शोधा.', govtSchemesFooter: 'योजना-जागरूक मार्गदर्शन', actionPlan: 'कृती योजना', actionPlanBody: 'तुमच्या मूल्यांकनाला व्यवसाय सुरू करण्याच्या स्पष्ट कृती योजनेत रूपांतरित करा.', actionPlanFooter: 'कल्पनेपासून अंमलबजावणीपर्यंत', aiRecommendation: 'AI शिफारस', aiRecommendationBody: 'तुमच्या व्यवसाय कल्पना आणि स्थानानुसार वैयक्तिक व्यवहार्यता मार्गदर्शन मिळवा.', aiRecommendationFooter: 'AI सहाय्यित, डेटा-आधारित', metricEntrepreneurs: 'ग्रामीण उद्योजक', metricIdeas: 'विश्लेषित व्यवसाय कल्पना', metricSchemes: 'सरकारी सहाय्य मार्ग', metricVillages: 'मजबूत गावे', metricIndia: 'उज्ज्वल भारत', playScene: 'दृश्य चालू करा', pauseScene: 'दृश्य थांबवा', storyEyebrow: 'Nirnay AI', storyTitle: 'खऱ्या ग्रामीण आकांक्षांसाठी तयार', storyBody: 'डिझाइन गावच्या जीवनाशी परिचित राहते आणि उत्पादनाचा अनुभव आधुनिक, सोपा आणि व्यावसायिक ठेवतो.', storyPoint1: 'स्थानिक संधी माहिती', storyPoint2: 'सोप्या भाषेत आर्थिक रचना', storyPoint3: 'योग्य योजना आणि वाढ मार्गदर्शन', startAssessment: 'मूल्यांकन सुरू करा',
  },
  ta: {
    tagline: 'சரியான சிந்தனை. சிறந்த நாளை.', home: 'முகப்பு', solutions: 'தீர்வுகள்', schemes: 'அரசுத் திட்டங்கள்', resources: 'வளங்கள்', about: 'எங்களை பற்றி', tryDemo: 'டெமோ பார்க்க', getStarted: 'தொடங்குங்கள்',
    badge: 'கிராமப்புற தொழில்முனைவோரை வலுப்படுத்துதல்', heroTitle: 'சிறந்த வணிக முடிவுகள், ஒளிமயமான கிராமிய இந்தியாவிற்காக.', heroBody: 'Nirnay AI உள்ளூர் தகவல்கள், நடைமுறை நிதி திட்டமிடல் மற்றும் பொருத்தமான அரசுத் திட்டங்களின் மூலம் கிராமப்புற தொழில்முனைவோருக்கு வணிகத்தை திட்டமிட, ஆய்வு செய்ய மற்றும் வளர உதவுகிறது.', startJourney: 'உங்கள் பயணத்தை தொடங்குங்கள்', watchStory: 'கிராமிய கதையை பாருங்கள்', easy: 'பயன்படுத்த எளிது', data: 'தரவின் ஆதாரம்', bharat: 'இந்தியாவுக்காக உருவாக்கப்பட்டது', stronger: 'வலுவான கிராமங்கள்\nஒளிமயமான இந்தியா',
    dashboard: 'டாஷ்போர்டு', businessPlan: 'வணிகத் திட்டம்', aiAdvisor: 'AI ஆலோசகர்', learning: 'கற்றல்', profile: 'சுயவிவரம்', welcome: 'மீண்டும் வரவேற்கிறோம், ரமேஷ்!', welcomeSub: 'இன்று நல்ல முடிவுகள், நாளை சிறந்த எதிர்காலம்.', growthLocal: 'வளர்ச்சி உள்ளூரிலிருந்து தொடங்குகிறது 🌱', investment: 'முதலீடு', monthlyProfit: 'மாத லாபம்', businessScore: 'வணிக மதிப்பெண்', riskLevel: 'ஆபத்து நிலை', low: 'குறைவு', profitProjection: 'லாப முன்னறிவு', sixMonthGrowth: '6 மாத வளர்ச்சி', sixMonths: '6 மாதங்கள்', opportunityTitle: 'ஒளிமயமான நாளைக்கான பெரிய வாய்ப்புகள்', opportunityBody: 'நடைமுறை உள்ளூர் தகவல், கட்டமைக்கப்பட்ட நிதி மற்றும் தெளிவான செயல்திட்டம்.',
    sectionEyebrow: 'ஒரே தளம், நடைமுறை முடிவுகள்', sectionTitle: 'வாய்ப்பிலிருந்து செயல்படுத்தல் வரை', sectionBody: 'Nirnay உள்ளூர் வாய்ப்பு, நிதி திட்டம் மற்றும் அரசு ஆதரவை ஒரே முடிவு ஓட்டத்தில் இணைக்கிறது.', govtSchemes: 'அரசுத் திட்டங்கள்', govtSchemesBody: 'உங்கள் வணிகத்திற்கு பொருத்தமான திட்டங்கள் மற்றும் ஆதரவை கண்டறியுங்கள்.', govtSchemesFooter: 'திட்ட அடிப்படையிலான வழிகாட்டல்', actionPlan: 'செயல் திட்டம்', actionPlanBody: 'உங்கள் மதிப்பீட்டை தொடங்கவும் வளரவும் தெளிவான நடைமுறை பாதையாக மாற்றுங்கள்.', actionPlanFooter: 'யோசனையிலிருந்து செயலாக்கம் வரை', aiRecommendation: 'AI பரிந்துரை', aiRecommendationBody: 'உங்கள் வணிக யோசனை மற்றும் இருப்பிடத்தின் அடிப்படையில் தனிப்பட்ட வழிகாட்டலை பெறுங்கள்.', aiRecommendationFooter: 'AI உதவியுடன், தரவின் ஆதாரம்', metricEntrepreneurs: 'கிராமப்புற தொழில்முனைவோர்', metricIdeas: 'ஆய்வு செய்யப்பட்ட வணிக யோசனைகள்', metricSchemes: 'அரசு ஆதரவு பாதைகள்', metricVillages: 'வலுவான கிராமங்கள்', metricIndia: 'ஒளிமயமான இந்தியா', playScene: 'காட்சியை இயக்கவும்', pauseScene: 'காட்சியை நிறுத்தவும்', storyEyebrow: 'Nirnay AI', storyTitle: 'உண்மையான கிராமிய கனவுகளை மையமாகக் கொண்டு', storyBody: 'காட்சி மொழி கிராம வாழ்க்கைக்கு பரிச்சயமாக இருக்கும்; தயாரிப்பு அனுபவம் நவீனமாக, எளிமையாக, தொழில்முறையாக இருக்கும்.', storyPoint1: 'உள்ளூர் வாய்ப்பு நுண்ணறிவு', storyPoint2: 'எளிய மொழியில் நிதி அமைப்பு', storyPoint3: 'பொருத்தமான திட்டம் மற்றும் வளர்ச்சி வழிகாட்டல்', startAssessment: 'மதிப்பீட்டை தொடங்கவும்',
  },
  te: {
    tagline: 'సరైన ఆలోచన. మంచి రేపు.', home: 'హోమ్', solutions: 'పరిష్కారాలు', schemes: 'ప్రభుత్వ పథకాలు', resources: 'వనరులు', about: 'మా గురించి', tryDemo: 'డెమో చూడండి', getStarted: 'ప్రారంభించండి',
    badge: 'గ్రామీణ వ్యాపారులను శక్తివంతం చేయడం', heroTitle: 'మెరుగైన వ్యాపార నిర్ణయాలు, ఉజ్వల గ్రామీణ భారతదేశం కోసం.', heroBody: 'Nirnay AI స్థానిక సమాచారం, ఆర్థిక నిర్మాణం మరియు సంబంధిత ప్రభుత్వ పథకాలతో గ్రామీణ వ్యాపారులకు వ్యాపారాన్ని ప్రణాళిక చేయడం, విశ్లేషించడం మరియు పెంచడం లో సహాయపడుతుంది.', startJourney: 'మీ ప్రయాణం ప్రారంభించండి', watchStory: 'గ్రామీణ కథ చూడండి', easy: 'వాడటం సులభం', data: 'డేటా ఆధారితం', bharat: 'భారతదేశం కోసం రూపొందించబడింది', stronger: 'బలమైన గ్రామాలు\nఉజ్వల భారత్',
    dashboard: 'డాష్‌బోర్డ్', businessPlan: 'వ్యాపార ప్రణాళిక', aiAdvisor: 'AI సలహాదారు', learning: 'అభ్యాసం', profile: 'ప్రొఫైల్', welcome: 'మళ్లీ స్వాగతం, రమేష్!', welcomeSub: 'ఈరోజు మంచి నిర్ణయాలు, రేపు మంచి భవిష్యత్తు.', growthLocal: 'వృద్ధి స్థానికంగా మొదలవుతుంది 🌱', investment: 'పెట్టుబడి', monthlyProfit: 'నెలవారీ లాభం', businessScore: 'వ్యాపార స్కోర్', riskLevel: 'రిస్క్ స్థాయి', low: 'తక్కువ', profitProjection: 'లాభ అంచనా', sixMonthGrowth: '6 నెలల వృద్ధి', sixMonths: '6 నెలలు', opportunityTitle: 'ఉజ్వల రేపటి కోసం పెద్ద అవకాశాలు', opportunityBody: 'ప్రయోజనకరమైన స్థానిక సమాచారం, నిర్మిత ఆర్థిక ప్రణాళిక మరియు స్పష్టమైన కార్యాచరణ.',
    sectionEyebrow: 'ఒక వేదిక, ప్రయోజనకర నిర్ణయాలు', sectionTitle: 'అవకాశం నుండి అమలువరకు', sectionBody: 'Nirnay స్థానిక అవకాశాలు, ఆర్థిక ప్రణాళిక మరియు ప్రభుత్వ సహాయాన్ని ఒకే నిర్ణయ ప్రవాహంలో కలుపుతుంది.', govtSchemes: 'ప్రభుత్వ పథకాలు', govtSchemesBody: 'మీ వ్యాపారానికి తగిన పథకాలు మరియు సహాయ ఎంపికలను కనుగొనండి.', govtSchemesFooter: 'పథక ఆధారిత మార్గదర్శనం', actionPlan: 'కార్యాచరణ ప్రణాళిక', actionPlanBody: 'మీ అంచనాను వ్యాపారం ప్రారంభించడానికి, పెంచడానికి స్పష్టమైన మార్గంగా మార్చండి.', actionPlanFooter: 'ఆలోచన నుండి అమలువరకు', aiRecommendation: 'AI సిఫార్సు', aiRecommendationBody: 'మీ వ్యాపార ఆలోచన మరియు ప్రాంతం ఆధారంగా వ్యక్తిగత సాధ్యత మార్గదర్శనం పొందండి.', aiRecommendationFooter: 'AI సహాయం, డేటా ఆధారం', metricEntrepreneurs: 'గ్రామీణ వ్యాపారులు', metricIdeas: 'విశ్లేషించిన వ్యాపార ఆలోచనలు', metricSchemes: 'ప్రభుత్వ సహాయ మార్గాలు', metricVillages: 'బలమైన గ్రామాలు', metricIndia: 'ఉజ్వల భారత్', playScene: 'దృశ్యం ప్లే చేయండి', pauseScene: 'దృశ్యం నిలిపివేయండి', storyEyebrow: 'Nirnay AI', storyTitle: 'నిజమైన గ్రామీణ ఆశయాల చుట్టూ నిర్మించబడింది', storyBody: 'దృశ్య రూపకల్పన గ్రామ జీవనానికి పరిచయంగా ఉండి, ఉత్పత్తి అనుభవం ఆధునికం, సులభం మరియు ప్రొఫెషనల్‌గా ఉంటుంది.', storyPoint1: 'స్థానిక అవకాశ సమాచారం', storyPoint2: 'సులభమైన భాషలో ఆర్థిక నిర్మాణం', storyPoint3: 'సంబంధిత పథకాలు మరియు వృద్ధి మార్గదర్శనం', startAssessment: 'అంచనా ప్రారంభించండి',
  },
  kn: {
    tagline: 'ಸರಿಯಾದ ಚಿಂತನೆ. ಉತ್ತಮ ನಾಳೆ.', home: 'ಮುಖಪುಟ', solutions: 'ಪರಿಹಾರಗಳು', schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', resources: 'ಸಂಪನ್ಮೂಲಗಳು', about: 'ನಮ್ಮ ಬಗ್ಗೆ', tryDemo: 'ಡೆಮೊ ನೋಡಿ', getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    badge: 'ಗ್ರಾಮೀಣ ಉದ್ಯಮಿಗಳಿಗೆ ಶಕ್ತಿ ನೀಡುವುದು', heroTitle: 'ಉತ್ತಮ ವ್ಯಾಪಾರ ನಿರ್ಧಾರಗಳು, ಪ್ರಕಾಶಮಾನ ಗ್ರಾಮೀಣ ಭಾರತದಿಗಾಗಿ.', heroBody: 'Nirnay AI ಸ್ಥಳೀಯ ಮಾಹಿತಿ, ಹಣಕಾಸು ರಚನೆ ಮತ್ತು ಸೂಕ್ತ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮೂಲಕ ಗ್ರಾಮೀಣ ಉದ್ಯಮಿಗಳಿಗೆ ವ್ಯವಹಾರವನ್ನು ಯೋಜಿಸಲು, ವಿಶ್ಲೇಷಿಸಲು ಮತ್ತು ಬೆಳೆಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.', startJourney: 'ನಿಮ್ಮ ಪ್ರಯಾಣ ಆರಂಭಿಸಿ', watchStory: 'ಗ್ರಾಮೀಣ ಕಥೆ ನೋಡಿ', easy: 'ಬಳಸಲು ಸುಲಭ', data: 'ಡೇಟಾ ಆಧಾರಿತ', bharat: 'ಭಾರತಕ್ಕಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ', stronger: 'ಬಲವಾದ ಗ್ರಾಮಗಳು\nಪ್ರಕಾಶಮಾನ ಭಾರತ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', businessPlan: 'ವ್ಯಾಪಾರ ಯೋಜನೆ', aiAdvisor: 'AI ಸಲಹೆಗಾರ', learning: 'ಕಲಿಕೆ', profile: 'ಪ್ರೊಫೈಲ್', welcome: 'ಮತ್ತೆ ಸ್ವಾಗತ, ರಮೇಶ್!', welcomeSub: 'ಇಂದು ಉತ್ತಮ ನಿರ್ಧಾರಗಳು, ನಾಳೆ ಉತ್ತಮ ಭವಿಷ್ಯ.', growthLocal: 'ಬೆಳವಣಿಗೆ ಸ್ಥಳೀಯವಾಗಿ ಆರಂಭವಾಗುತ್ತದೆ 🌱', investment: 'ಹೂಡಿಕೆ', monthlyProfit: 'ಮಾಸಿಕ ಲಾಭ', businessScore: 'ವ್ಯಾಪಾರ ಅಂಕ', riskLevel: 'ಅಪಾಯ ಮಟ್ಟ', low: 'ಕಡಿಮೆ', profitProjection: 'ಲಾಭದ ಅಂದಾಜು', sixMonthGrowth: '6 ತಿಂಗಳ ಬೆಳವಣಿಗೆ', sixMonths: '6 ತಿಂಗಳು', opportunityTitle: 'ಉತ್ತಮ ನಾಳೆಗಾಗಿ ದೊಡ್ಡ ಅವಕಾಶಗಳು', opportunityBody: 'ಪ್ರಾಯೋಗಿಕ ಸ್ಥಳೀಯ ಮಾಹಿತಿ, ವ್ಯವಸ್ಥಿತ ಹಣಕಾಸು ಮತ್ತು ಸ್ಪಷ್ಟ ಕಾರ್ಯಪಥ.',
    sectionEyebrow: 'ಒಂದು ವೇದಿಕೆ, ಪ್ರಾಯೋಗಿಕ ನಿರ್ಧಾರಗಳು', sectionTitle: 'ಅವಕಾಶದಿಂದ ಅನುಷ್ಠಾನವರೆಗೆ', sectionBody: 'Nirnay ಸ್ಥಳೀಯ ಅವಕಾಶ, ಹಣಕಾಸು ಯೋಜನೆ ಮತ್ತು ಸರ್ಕಾರಿ ಬೆಂಬಲವನ್ನು ಒಂದೇ ನಿರ್ಧಾರ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಜೋಡಿಸುತ್ತದೆ.', govtSchemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', govtSchemesBody: 'ನಿಮ್ಮ ವ್ಯಾಪಾರಕ್ಕೆ ಸೂಕ್ತ ಯೋಜನೆಗಳು ಮತ್ತು ಬೆಂಬಲ ಆಯ್ಕೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ.', govtSchemesFooter: 'ಯೋಜನೆ ಆಧಾರಿತ ಮಾರ್ಗದರ್ಶನ', actionPlan: 'ಕಾರ್ಯ ಯೋಜನೆ', actionPlanBody: 'ನಿಮ್ಮ ಮೌಲ್ಯಮಾಪನವನ್ನು ವ್ಯವಹಾರ ಆರಂಭಿಸಲು ಮತ್ತು ಬೆಳೆಸಲು ಸ್ಪಷ್ಟ ಮಾರ್ಗವಾಗಿ ಪರಿವರ್ತಿಸಿ.', actionPlanFooter: 'ಕಲ್ಪನೆಯಿಂದ ಅನುಷ್ಠಾನವರೆಗೆ', aiRecommendation: 'AI ಶಿಫಾರಸು', aiRecommendationBody: 'ನಿಮ್ಮ ವ್ಯವಹಾರ ಕಲ್ಪನೆ ಮತ್ತು ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.', aiRecommendationFooter: 'AI ಸಹಾಯ, ಡೇಟಾ ಆಧಾರಿತ', metricEntrepreneurs: 'ಗ್ರಾಮೀಣ ಉದ್ಯಮಿಗಳು', metricIdeas: 'ವಿಶ್ಲೇಷಿತ ವ್ಯಾಪಾರ ಕಲ್ಪನೆಗಳು', metricSchemes: 'ಸರ್ಕಾರಿ ಬೆಂಬಲ ಮಾರ್ಗಗಳು', metricVillages: 'ಬಲವಾದ ಗ್ರಾಮಗಳು', metricIndia: 'ಪ್ರಕಾಶಮಾನ ಭಾರತ', playScene: 'ದೃಶ್ಯ ಆರಂಭಿಸಿ', pauseScene: 'ದೃಶ್ಯ ನಿಲ್ಲಿಸಿ', storyEyebrow: 'Nirnay AI', storyTitle: 'ನಿಜವಾದ ಗ್ರಾಮೀಣ ಆಶಯಗಳ ಸುತ್ತ ನಿರ್ಮಿಸಲಾಗಿದೆ', storyBody: 'ದೃಶ್ಯ ಭಾಷೆ ಗ್ರಾಮ ಜೀವನಕ್ಕೆ ಪರಿಚಿತವಾಗಿರುತ್ತದೆ, ಆದರೆ ಉತ್ಪನ್ನ ಅನುಭವ ಆಧುನಿಕ, ಸರಳ ಮತ್ತು ವೃತ್ತಿಪರವಾಗಿರುತ್ತದೆ.', storyPoint1: 'ಸ್ಥಳೀಯ ಅವಕಾಶ ಮಾಹಿತಿ', storyPoint2: 'ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಹಣಕಾಸು ರಚನೆ', storyPoint3: 'ಸಂಬಂಧಿತ ಯೋಜನೆ ಮತ್ತು ಬೆಳವಣಿಗೆ ಮಾರ್ಗದರ್ಶನ', startAssessment: 'ಮೌಲ್ಯಮಾಪನ ಆರಂಭಿಸಿ',
  },
  gu: {
    tagline: 'સાચી વિચારણા. સારું આવતીકાલ.', home: 'હોમ', solutions: 'ઉકેલો', schemes: 'સરકારી યોજનાઓ', resources: 'સંસાધનો', about: 'અમારા વિશે', tryDemo: 'ડેમો જુઓ', getStarted: 'શરૂ કરો',
    badge: 'ગ્રામીણ ઉદ્યોગસાહસિકોને સશક્ત બનાવવું', heroTitle: 'વધુ સારા વ્યવસાયિક નિર્ણયો, ઉજ્જવળ ગ્રામ્ય ભારત માટે.', heroBody: 'Nirnay AI સ્થાનિક માહિતી, નાણાકીય માળખું અને સંબંધિત સરકારી યોજનાઓ સાથે ગ્રામ્ય ઉદ્યોગસાહસિકોને વ્યવસાયની યોજના, વિશ્લેષણ અને વૃદ્ધિમાં મદદ કરે છે.', startJourney: 'તમારી યાત્રા શરૂ કરો', watchStory: 'ગ્રામ્ય વાર્તા જુઓ', easy: 'વાપરવામાં સરળ', data: 'ડેટા આધારિત', bharat: 'ભારત માટે બનાવેલ', stronger: 'મજબૂત ગામો\nઉજ્જવળ ભારત',
    dashboard: 'ડેશબોર્ડ', businessPlan: 'વ્યવસાય યોજના', aiAdvisor: 'AI સલાહકાર', learning: 'શીખવું', profile: 'પ્રોફાઇલ', welcome: 'ફરી સ્વાગત, રમેશ!', welcomeSub: 'આજે સારા નિર્ણયો, કાલે સારું ભવિષ્ય.', growthLocal: 'વિકાસ સ્થાનિક સ્તરથી શરૂ થાય છે 🌱', investment: 'રોકાણ', monthlyProfit: 'માસિક નફો', businessScore: 'વ્યવસાય સ્કોર', riskLevel: 'જોખમ સ્તર', low: 'ઓછું', profitProjection: 'નફાનો અંદાજ', sixMonthGrowth: '6 મહિનાની વૃદ્ધિ', sixMonths: '6 મહિના', opportunityTitle: 'ઉજ્જવળ આવતીકાલ માટે મોટી તકો', opportunityBody: 'વ્યવહારુ સ્થાનિક માહિતી, સંરચિત નાણાં અને સ્પષ્ટ કાર્યપથ.',
    sectionEyebrow: 'એક પ્લેટફોર્મ, વ્યવહારુ નિર્ણયો', sectionTitle: 'તકથી અમલ સુધી', sectionBody: 'Nirnay સ્થાનિક તક, નાણાકીય આયોજન અને સરકારી સહાયને એક જ નિર્ણય પ્રવાહમાં જોડે છે.', govtSchemes: 'સરકારી યોજનાઓ', govtSchemesBody: 'તમારા વ્યવસાય માટે યોગ્ય યોજનાઓ અને સહાય વિકલ્પો શોધો.', govtSchemesFooter: 'યોજના આધારિત માર્ગદર્શન', actionPlan: 'કાર્ય યોજના', actionPlanBody: 'તમારા મૂલ્યાંકનને વ્યવસાય શરૂ અને વધારવા માટે સ્પષ્ટ માર્ગમાં ફેરવો.', actionPlanFooter: 'વિચારથી અમલ સુધી', aiRecommendation: 'AI ભલામણ', aiRecommendationBody: 'તમારા વ્યવસાય વિચાર અને સ્થાન આધારિત વ્યક્તિગત માર્ગદર્શન મેળવો.', aiRecommendationFooter: 'AI સહાયિત, ડેટા આધારિત', metricEntrepreneurs: 'ગ્રામીણ ઉદ્યોગસાહસિકો', metricIdeas: 'વિશ્લેષિત વ્યવસાય વિચારો', metricSchemes: 'સરકારી સહાય માર્ગો', metricVillages: 'મજબૂત ગામો', metricIndia: 'ઉજ્જવળ ભારત', playScene: 'દૃશ્ય ચલાવો', pauseScene: 'દૃશ્ય રોકો', storyEyebrow: 'Nirnay AI', storyTitle: 'વાસ્તવિક ગ્રામ્ય આશાઓને કેન્દ્રમાં રાખીને', storyBody: 'દૃશ્ય ભાષા ગ્રામ્ય જીવન સાથે પરિચિત રહે છે અને ઉત્પાદન અનુભવ આધુનિક, સરળ અને વ્યાવસાયિક રહે છે.', storyPoint1: 'સ્થાનિક તકની માહિતી', storyPoint2: 'સરળ ભાષામાં નાણાકીય માળખું', storyPoint3: 'યોગ્ય યોજના અને વૃદ્ધિ માર્ગદર્શન', startAssessment: 'મૂલ્યાંકન શરૂ કરો',
  },
  pa: {
    tagline: 'ਸਹੀ ਸੋਚ। ਬਿਹਤਰ ਕੱਲ੍ਹ।', home: 'ਹੋਮ', solutions: 'ਹੱਲ', schemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', resources: 'ਸਰੋਤ', about: 'ਸਾਡੇ ਬਾਰੇ', tryDemo: 'ਡੈਮੋ ਵੇਖੋ', getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    badge: 'ਪੇਂਡੂ ਉਦਯੋਗਪਤੀਆਂ ਨੂੰ ਸਸ਼ਕਤ ਕਰਨਾ', heroTitle: 'ਵਧੀਆ ਕਾਰੋਬਾਰੀ ਫੈਸਲੇ, ਚਮਕਦਾਰ ਪੇਂਡੂ ਭਾਰਤ ਲਈ।', heroBody: 'Nirnay AI ਸਥਾਨਕ ਜਾਣਕਾਰੀ, ਵਿੱਤੀ ਯੋਜਨਾ ਅਤੇ ਉਚਿਤ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਨਾਲ ਪੇਂਡੂ ਉਦਯੋਗਪਤੀਆਂ ਨੂੰ ਕਾਰੋਬਾਰ ਦੀ ਯੋਜਨਾ, ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਵਾਧੇ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।', startJourney: 'ਆਪਣੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ', watchStory: 'ਪੇਂਡੂ ਕਹਾਣੀ ਵੇਖੋ', easy: 'ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ', data: 'ਡਾਟਾ ਅਧਾਰਿਤ', bharat: 'ਭਾਰਤ ਲਈ ਬਣਾਇਆ', stronger: 'ਮਜ਼ਬੂਤ ਪਿੰਡ\nਚਮਕਦਾਰ ਭਾਰਤ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ', businessPlan: 'ਕਾਰੋਬਾਰ ਯੋਜਨਾ', aiAdvisor: 'AI ਸਲਾਹਕਾਰ', learning: 'ਸਿੱਖਣਾ', profile: 'ਪ੍ਰੋਫਾਈਲ', welcome: 'ਮੁੜ ਜੀ ਆਇਆਂ ਨੂੰ, ਰਮੇਸ਼!', welcomeSub: 'ਅੱਜ ਵਧੀਆ ਫੈਸਲੇ, ਕੱਲ੍ਹ ਵਧੀਆ ਭਵਿੱਖ।', growthLocal: 'ਵਾਧਾ ਸਥਾਨਕ ਤੌਰ ਤੇ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ 🌱', investment: 'ਨਿਵੇਸ਼', monthlyProfit: 'ਮਹੀਨਾਵਾਰ ਲਾਭ', businessScore: 'ਕਾਰੋਬਾਰ ਸਕੋਰ', riskLevel: 'ਖਤਰਾ ਪੱਧਰ', low: 'ਘੱਟ', profitProjection: 'ਲਾਭ ਅਨੁਮਾਨ', sixMonthGrowth: '6 ਮਹੀਨੇ ਦਾ ਵਾਧਾ', sixMonths: '6 ਮਹੀਨੇ', opportunityTitle: 'ਚਮਕਦਾਰ ਕੱਲ੍ਹ ਲਈ ਵੱਡੇ ਮੌਕੇ', opportunityBody: 'ਵਿਹਾਰਕ ਸਥਾਨਕ ਜਾਣਕਾਰੀ, ਸੁਚੱਜੀ ਵਿੱਤੀ ਯੋਜਨਾ ਅਤੇ ਸਪਸ਼ਟ ਕਾਰਵਾਈ ਦਾ ਰਾਹ।',
    sectionEyebrow: 'ਇੱਕ ਪਲੇਟਫਾਰਮ, ਵਿਹਾਰਕ ਫੈਸਲੇ', sectionTitle: 'ਮੌਕੇ ਤੋਂ ਅਮਲ ਤੱਕ', sectionBody: 'Nirnay ਸਥਾਨਕ ਮੌਕਿਆਂ, ਵਿੱਤੀ ਯੋਜਨਾ ਅਤੇ ਸਰਕਾਰੀ ਸਹਾਇਤਾ ਨੂੰ ਇੱਕ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਜੋੜਦਾ ਹੈ।', govtSchemes: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ', govtSchemesBody: 'ਆਪਣੇ ਕਾਰੋਬਾਰ ਲਈ ਉਚਿਤ ਯੋਜਨਾਵਾਂ ਅਤੇ ਸਹਾਇਤਾ ਵਿਕਲਪ ਲੱਭੋ।', govtSchemesFooter: 'ਯੋਜਨਾ ਅਧਾਰਿਤ ਮਾਰਗਦਰਸ਼ਨ', actionPlan: 'ਕਾਰਵਾਈ ਯੋਜਨਾ', actionPlanBody: 'ਆਪਣੇ ਮੁਲਾਂਕਣ ਨੂੰ ਕਾਰੋਬਾਰ ਸ਼ੁਰੂ ਕਰਨ ਅਤੇ ਵਧਾਉਣ ਲਈ ਸਪਸ਼ਟ ਰਾਹ ਵਿੱਚ ਬਦਲੋ।', actionPlanFooter: 'ਵਿਚਾਰ ਤੋਂ ਅਮਲ ਤੱਕ', aiRecommendation: 'AI ਸਿਫਾਰਸ਼', aiRecommendationBody: 'ਆਪਣੇ ਕਾਰੋਬਾਰ ਵਿਚਾਰ ਅਤੇ ਸਥਾਨ ਦੇ ਅਧਾਰ ਤੇ ਨਿੱਜੀ ਮਾਰਗਦਰਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ।', aiRecommendationFooter: 'AI ਸਹਾਇਿਤ, ਡਾਟਾ ਅਧਾਰਿਤ', metricEntrepreneurs: 'ਪੇਂਡੂ ਉਦਯੋਗਪਤੀ', metricIdeas: 'ਵਿਸ਼ਲੇਸ਼ਿਤ ਕਾਰੋਬਾਰ ਵਿਚਾਰ', metricSchemes: 'ਸਰਕਾਰੀ ਸਹਾਇਤਾ ਦੇ ਰਾਹ', metricVillages: 'ਮਜ਼ਬੂਤ ਪਿੰਡ', metricIndia: 'ਚਮਕਦਾਰ ਭਾਰਤ', playScene: 'ਦ੍ਰਿਸ਼ ਚਲਾਓ', pauseScene: 'ਦ੍ਰਿਸ਼ ਰੋਕੋ', storyEyebrow: 'Nirnay AI', storyTitle: 'ਅਸਲ ਪੇਂਡੂ ਆਕਾਂਖਾਵਾਂ ਦੇ ਆਧਾਰ ਤੇ', storyBody: 'ਦ੍ਰਿਸ਼ ਭਾਸ਼ਾ ਪਿੰਡ ਦੇ ਜੀਵਨ ਨਾਲ ਜਾਣ-ਪਛਾਣ ਵਾਲੀ ਰਹਿੰਦੀ ਹੈ ਅਤੇ ਉਤਪਾਦ ਅਨੁਭਵ ਆਧੁਨਿਕ, ਸਧਾਰਣ ਅਤੇ ਪੇਸ਼ੇਵਰ ਰਹਿੰਦਾ ਹੈ।', storyPoint1: 'ਸਥਾਨਕ ਮੌਕੇ ਦੀ ਜਾਣਕਾਰੀ', storyPoint2: 'ਸਧਾਰਣ ਭਾਸ਼ਾ ਵਿੱਚ ਵਿੱਤੀ ਯੋਜਨਾ', storyPoint3: 'ਉਚਿਤ ਯੋਜਨਾ ਅਤੇ ਵਾਧੇ ਦੀ ਮਾਰਗਦਰਸ਼ਨ', startAssessment: 'ਮੁਲਾਂਕਣ ਸ਼ੁਰੂ ਕਰੋ',
  },
};

const ruralVideoSources = ['/rural-hero.mp4', 'https://www.pexels.com/download/video/37664921/'];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, language, onLanguageChange, onTryDemo, onOpenHelp }) => {
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const c = COPY[language] || COPY.en;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      heroVideoRef.current?.pause();
      setIsVideoPaused(true);
    }
  }, []);

  const scrollToSolutions = () => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
  const toggleHeroVideo = () => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsVideoPaused(false);
    } else {
      video.pause();
      setIsVideoPaused(true);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#FBF7EF] text-[#281C13]" lang={language}>
      <header className="sticky top-0 z-40 border-b border-[#E7DDCF]/80 bg-[#FBF7EF]/90 shadow-[0_8px_30px_rgba(73,48,28,.04)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-5 px-5 py-3.5 sm:px-8 lg:px-10">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0E1CA] text-[#9C6A30]"><Sprout className="h-7 w-7" strokeWidth={1.8} /></div>
            <div><h1 className="font-serif text-2xl font-bold tracking-tight sm:text-[28px]">Nirnay AI</h1><p className="mt-0.5 text-[10px] font-medium tracking-[0.08em] text-[#7A6C5F]">{c.tagline}</p></div>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-medium text-[#564B40] xl:flex">
            <button onClick={() => onNavigate('landing')} className="border-b-2 border-[#A97838] py-2 text-[#281C13]">{c.home}</button>
            <button onClick={scrollToSolutions} className="py-2 transition hover:text-[#281C13]">{c.solutions}</button>
            <button onClick={() => onNavigate('schemes')} className="py-2 transition hover:text-[#281C13]">{c.schemes}</button>
            <button onClick={onOpenHelp} className="py-2 transition hover:text-[#281C13]">{c.resources}</button>
            <button onClick={onOpenHelp} className="py-2 transition hover:text-[#281C13]">{c.about}</button>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block"><Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96652D]" /><select value={language} onChange={(e) => onLanguageChange(e.target.value as LanguageCode)} aria-label="Select language" className="h-10 rounded-xl border border-[#D8C5AA] bg-[#FFFDF8]/90 pl-9 pr-8 text-xs font-semibold text-[#5B4632] outline-none transition hover:border-[#B98B52] focus:border-[#A97838]">{SUPPORTED_LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.nativeLabel}</option>)}</select></div>
            <button onClick={onOpenHelp} aria-label={c.resources} className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#4D4238] transition hover:bg-[#F1E6D6] sm:flex"><Search className="h-5 w-5" /></button>
            <button onClick={onTryDemo} className="hidden rounded-xl border border-[#CDB18C] bg-[#FFFDF8] px-4 py-2.5 text-sm font-bold text-[#49311E] transition hover:bg-[#F3E8D9] lg:block">{c.tryDemo}</button>
            <button onClick={() => onNavigate('assessment')} className="rounded-xl bg-[#A97838] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(169,120,56,.18)] transition hover:-translate-y-0.5 hover:bg-[#8D5D28]">{c.getStarted}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden border-b border-[#E7DDCF]">
          <video ref={heroVideoRef} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="nirnay-hero-video pointer-events-none absolute inset-0 h-full w-full object-cover">{ruralVideoSources.map((source) => <source key={source} src={source} type="video/mp4" />)}</video>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(251,247,239,.98)_0%,rgba(251,247,239,.93)_38%,rgba(251,247,239,.78)_68%,rgba(251,247,239,.68)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,248,.18),rgba(242,229,210,.38))]" />
          <div className="nirnay-video-grain pointer-events-none absolute inset-0" />
          <div className="nirnay-rural-scene pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-70" />
          <button type="button" onClick={toggleHeroVideo} className="absolute bottom-5 right-5 z-20 hidden items-center gap-2 rounded-full border border-[#D6C2A4] bg-[#FFFDF8]/85 px-3 py-2 text-[11px] font-bold text-[#6D4B27] shadow-sm backdrop-blur-md transition hover:bg-white md:flex" aria-label={isVideoPaused ? c.playScene : c.pauseScene}>{isVideoPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}{isVideoPaused ? c.playScene : c.pauseScene}</button>
          <div className="pointer-events-none absolute right-5 top-36 hidden rotate-[-5deg] whitespace-pre-line font-serif text-lg italic leading-7 text-[#8A6841]/70 2xl:block">{c.stronger}</div>

          <div className="relative z-10 mx-auto grid min-h-[640px] max-w-[1380px] items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DEC8A7] bg-[#F6EBDD]/90 px-4 py-2 text-sm font-bold text-[#775328] backdrop-blur-sm"><Sprout className="h-4 w-4" />{c.badge}</div>
              <h2 className="mt-5 max-w-[690px] font-serif text-[46px] font-bold leading-[1.03] tracking-[-2px] text-[#21150C] sm:text-[58px] lg:text-[68px]">{c.heroTitle}</h2>
              <p className="mt-5 max-w-[610px] text-base leading-7 text-[#66594D] sm:text-[17px]">{c.heroBody}</p>
              <div className="mt-7 flex flex-wrap gap-3"><button onClick={() => onNavigate('assessment')} className="flex items-center gap-3 rounded-xl bg-[#A97838] px-7 py-4 text-sm font-bold text-white shadow-[0_12px_26px_rgba(169,120,56,.22)] transition hover:-translate-y-0.5 hover:bg-[#8D5D28]">{c.startJourney}<ArrowRight className="h-4 w-4" /></button><button onClick={() => setIsStoryOpen(true)} className="flex items-center gap-3 rounded-xl border border-[#C8A77C] bg-[#FFFDF8]/88 px-7 py-4 text-sm font-bold text-[#49311E] transition hover:-translate-y-0.5 hover:bg-white"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B98B52] bg-[#F7EBDD]"><Play className="h-4 w-4 fill-[#A97838] text-[#A97838]" /></span>{c.watchStory}</button></div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#605449]"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />{c.easy}</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />{c.data}</span><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#A97838]" />{c.bharat}</span></div>
            </div>

            <div className="nirnay-dashboard-shell overflow-hidden rounded-[24px] border border-[#DED2C1] bg-[#FFFDF8]/92 shadow-[0_28px_70px_rgba(78,52,28,.13)] backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-[#E9DFD1] bg-[#FFFDF8]/80 px-5 py-4"><div className="flex items-center gap-2 font-serif text-xl font-bold"><Sprout className="h-5 w-5 text-[#9D6A30]" /> Nirnay AI</div><div className="flex items-center gap-3 text-[#75675B]"><span className="h-2 w-2 rounded-full bg-[#6E844C] shadow-[0_0_0_4px_rgba(110,132,76,.10)]" /><User className="h-5 w-5" /></div></div>
              <div className="grid min-h-[435px] md:grid-cols-[142px_1fr]">
                <aside className="hidden border-r border-[#EBE1D5] bg-[#FFFDF9]/80 p-3 md:block"><SideButton active icon={<BarChart3 className="h-4 w-4" />} label={c.dashboard} onClick={onTryDemo} /><SideButton icon={<FileText className="h-4 w-4" />} label={c.businessPlan} onClick={() => onNavigate('report')} /><SideButton icon={<Landmark className="h-4 w-4" />} label={c.schemes} onClick={() => onNavigate('schemes')} /><SideButton icon={<Lightbulb className="h-4 w-4" />} label={c.aiAdvisor} onClick={() => onNavigate('analysis')} /><SideButton icon={<FileText className="h-4 w-4" />} label={c.learning} onClick={onOpenHelp} /><SideButton icon={<User className="h-4 w-4" />} label={c.profile} onClick={() => onNavigate('assessment')} /></aside>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold text-[#24170D]">{c.welcome}</h3><p className="mt-1 text-xs text-[#827366]">{c.welcomeSub}</p></div><div className="hidden rounded-full bg-[#F3E8D9] px-3 py-1.5 text-[10px] font-semibold text-[#7A5A37] sm:block">{c.growthLocal}</div></div>
                  <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4"><MiniStat icon={<span className="text-lg font-bold">₹</span>} label={c.investment} value="₹2,50,000" /><MiniStat icon={<TrendingUp className="h-4 w-4" />} label={c.monthlyProfit} value="₹45,000" /><MiniStat icon={<BarChart3 className="h-4 w-4" />} label={c.businessScore} value="78/100" /><MiniStat icon={<ShieldCheck className="h-4 w-4" />} label={c.riskLevel} value={c.low} valueClass="text-[#648044]" /></div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-[1.18fr_.82fr]"><div className="rounded-2xl border border-[#E5DACB] bg-white/90 p-4"><div className="flex items-center justify-between gap-3"><div><div className="text-sm font-bold">{c.profitProjection}</div><div className="mt-1 text-[11px] text-[#807165]">{c.sixMonthGrowth}</div></div><span className="rounded-full border border-[#E4D8C7] bg-[#FFFDF8] px-3 py-1 text-[10px] text-[#746558]">{c.sixMonths}</span></div><div className="relative mt-5 h-32 border-b border-l border-[#E9E1D6]"><svg viewBox="0 0 420 130" className="absolute inset-0 h-full w-full overflow-visible"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C89450" stopOpacity="0.28" /><stop offset="100%" stopColor="#C89450" stopOpacity="0.02" /></linearGradient></defs><path d="M0,112 L70,88 L140,72 L210,64 L280,48 L350,26 L420,12 L420,130 L0,130 Z" fill="url(#areaFill)" /><polyline points="0,112 70,88 140,72 210,64 280,48 350,26 420,12" fill="none" stroke="#A97838" strokeWidth="3" /></svg></div></div><div className="rounded-2xl border border-[#E0D1BA] bg-gradient-to-br from-[#F8F0E5] to-[#E7D4B5] p-5"><p className="font-serif text-xl font-bold leading-tight text-[#3A291B]">{c.opportunityTitle}</p><p className="mt-3 text-[11px] leading-5 text-[#76604B]">{c.opportunityBody}</p><div className="mt-5 flex justify-end"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9B18D]/45 text-3xl">👨🏽‍🌾</div></div></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="border-t border-[#E7DDCF] bg-[#FFFDF8]/92 px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto mb-6 flex max-w-[1380px] flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9A6A31]">{c.sectionEyebrow}</p><h2 className="mt-2 font-serif text-2xl font-bold text-[#2A1A10] sm:text-3xl">{c.sectionTitle}</h2></div><p className="max-w-xl text-sm leading-6 text-[#796B5E]">{c.sectionBody}</p></div><div className="mx-auto grid max-w-[1380px] gap-5 md:grid-cols-3"><FeatureCard icon={<Landmark className="h-6 w-6" />} title={c.govtSchemes} text={c.govtSchemesBody} footer={c.govtSchemesFooter} onClick={() => onNavigate('schemes')} /><FeatureCard icon={<FileText className="h-6 w-6" />} title={c.actionPlan} text={c.actionPlanBody} footer={c.actionPlanFooter} onClick={() => onNavigate('report')} /><FeatureCard icon={<Lightbulb className="h-6 w-6" />} title={c.aiRecommendation} text={c.aiRecommendationBody} footer={c.aiRecommendationFooter} onClick={() => onNavigate('analysis')} /></div></section>
        <section className="border-t border-[#EAE0D4] bg-[#FFFDF9] px-5 py-7 sm:px-8 lg:px-10"><div className="mx-auto grid max-w-[1380px] gap-6 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={<Users className="h-7 w-7" />} value="10,000+" label={c.metricEntrepreneurs} /><Metric icon={<BarChart3 className="h-7 w-7" />} value="500+" label={c.metricIdeas} /><Metric icon={<Landmark className="h-7 w-7" />} value="200+" label={c.metricSchemes} /><Metric icon={<Sprout className="h-7 w-7" />} value={c.metricVillages} label={c.metricIndia} /></div></section>
        <footer className="border-t border-[#E9DED0] bg-[#FAF6EE] px-5 py-6 text-center text-[11px] text-[#837366]"><p className="font-semibold text-[#5D4C3F]">NIRNAY AI — Team VYOMA · Smart India Hackathon 2026</p><p className="mt-1">PS SIH26091 · Hyper-Local Business Advisory & Financial Structuring for Rural Micro-Entrepreneurs</p><p className="mx-auto mt-1 max-w-2xl italic">{t('disclaimerText', language)}</p></footer>
      </main>

      {isStoryOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#20150D]/70 p-4 backdrop-blur-md" role="dialog" aria-modal="true"><div className="w-full max-w-5xl overflow-hidden rounded-[26px] border border-[#D8C6AA] bg-[#FFFDF8] shadow-[0_35px_100px_rgba(28,18,10,.35)]"><div className="flex items-center justify-between border-b border-[#E8DDCF] px-5 py-4 sm:px-6"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9A6A31]">{c.storyEyebrow}</p><h3 className="mt-1 font-serif text-xl font-bold text-[#281C13]">{c.storyTitle}</h3></div><button onClick={() => setIsStoryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E7D7] text-[#5F4630]"><X className="h-5 w-5" /></button></div><div className="grid lg:grid-cols-[1.45fr_.55fr]"><div className="bg-[#20150D]"><video autoPlay muted controls loop playsInline className="aspect-video h-full w-full object-cover">{ruralVideoSources.map((source) => <source key={source} src={source} type="video/mp4" />)}</video></div><div className="flex flex-col justify-between p-6 sm:p-7"><div><div className="inline-flex items-center gap-2 rounded-full bg-[#F1E4D1] px-3 py-1.5 text-xs font-bold text-[#775328]"><Sprout className="h-3.5 w-3.5" />{c.badge}</div><p className="mt-5 text-sm leading-7 text-[#6D5E51]">{c.storyBody}</p><div className="mt-5 space-y-3 text-sm text-[#5F5145]"><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" />{c.storyPoint1}</div><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" />{c.storyPoint2}</div><div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#A97838]" />{c.storyPoint3}</div></div></div><button onClick={() => { setIsStoryOpen(false); onNavigate('assessment'); }} className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#A97838] px-5 py-3.5 text-sm font-bold text-white">{c.startAssessment}<ArrowRight className="h-4 w-4" /></button></div></div></div></div>}
    </div>
  );
};

const SideButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; active?: boolean }> = ({ icon, label, onClick, active }) => <button onClick={onClick} className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs ${active ? 'bg-[#F0E1CA] font-bold text-[#775122]' : 'text-[#625548] hover:bg-[#F6ECDE]'}`}>{icon}{label}</button>;
const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: string; valueClass?: string }> = ({ icon, label, value, valueClass = '' }) => <div className="rounded-2xl border border-[#E7DDCF] bg-white/95 p-3 shadow-[0_3px_12px_rgba(65,42,20,.04)]"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1E1C8] text-[#A26D2C]">{icon}</div><p className="mt-3 text-[10px] text-[#817267]">{label}</p><strong className={`mt-1 block text-base font-extrabold ${valueClass}`}>{value}</strong></div>;
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; text: string; footer: string; onClick: () => void }> = ({ icon, title, text, footer, onClick }) => <button onClick={onClick} className="group rounded-2xl border border-[#E0D4C4] bg-[#FFFDF8] p-5 text-left shadow-[0_5px_18px_rgba(70,45,25,.04)] transition hover:-translate-y-1 hover:border-[#CFAE80] hover:shadow-[0_16px_38px_rgba(70,45,25,.10)]"><div className="flex items-start justify-between gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F3E6D1] to-[#EAD5B5] text-[#98652A]">{icon}</div><ChevronRight className="h-5 w-5 text-[#96652D]" /></div><h3 className="mt-4 font-serif text-lg font-bold text-[#25170D]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#75675B]">{text}</p><div className="mt-4 flex items-center justify-between rounded-xl bg-[#F2E6D3] px-3 py-2 text-[11px] font-semibold text-[#77542D]"><span>{footer}</span><ChevronRight className="h-4 w-4" /></div></button>;
const Metric: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => <div className="flex items-center gap-4 lg:border-r lg:border-[#DED4C6] lg:last:border-r-0"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2E5D2] text-[#A67334]">{icon}</div><div><strong className="block text-xl font-extrabold text-[#2A1A10]">{value}</strong><p className="mt-1 text-[11px] text-[#796C60]">{label}</p></div></div>;
