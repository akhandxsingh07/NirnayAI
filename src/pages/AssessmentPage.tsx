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

type BusinessProfile = {
  name: string;
  category: BusinessCategory;
  minCapital: number;
  maxCapital: number;
  minLand: number;
  expertise: string[];
  risk: Risk;
  reason: string;
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
  tags: string[];
};

type ExpertiseOption = {
  value: string;
  labels: Record<LanguageCode, string>;
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

const EXPERTISE_FIELD_LABEL: Record<LanguageCode, string> = {
  en: 'Expertise / skills',
  hi: 'विशेषज्ञता / कौशल',
  bn: 'দক্ষতা / স্কিল',
  mr: 'कौशल्य / तज्ज्ञता',
  ta: 'நிபுணத்துவம் / திறன்கள்',
  te: 'నైపుణ్యం / నైపుణ్యాలు',
  kn: 'ಪರಿಣಿತಿ / ಕೌಶಲ್ಯಗಳು',
  gu: 'કુશળતા / નિષ્ણાતતા',
  pa: 'ਮਾਹਰਤਾ / ਹੁਨਰ',
};

const EXPERTISE_HINT: Record<LanguageCode, string> = {
  en: 'Choose the skill closest to your real experience. NirnayAI gives expertise the highest weight while ranking businesses.',
  hi: 'अपनी वास्तविक क्षमता के सबसे करीब कौशल चुनें। व्यवसाय रैंकिंग में निर्णय AI विशेषज्ञता को सबसे अधिक महत्व देता है।',
  bn: 'আপনার বাস্তব অভিজ্ঞতার কাছাকাছি দক্ষতা বেছে নিন। ব্যবসা র‍্যাঙ্কিংয়ে দক্ষতার ওজন সবচেয়ে বেশি।',
  mr: 'तुमच्या वास्तविक अनुभवाशी सर्वात जवळचे कौशल्य निवडा. व्यवसाय रँकिंगमध्ये कौशल्याला सर्वाधिक वजन दिले जाते.',
  ta: 'உங்கள் உண்மையான அனுபவத்திற்கு அருகிலான திறனைத் தேர்வு செய்யுங்கள். வணிக தரவரிசையில் திறனுக்கு அதிக முக்கியத்துவம் அளிக்கப்படுகிறது.',
  te: 'మీ నిజమైన అనుభవానికి దగ్గరైన నైపుణ్యాన్ని ఎంచుకోండి. వ్యాపార ర్యాంకింగ్‌లో నైపుణ్యానికి ఎక్కువ ప్రాధాన్యం ఉంటుంది.',
  kn: 'ನಿಮ್ಮ ನೈಜ ಅನುಭವಕ್ಕೆ ಹತ್ತಿರದ ಕೌಶಲ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ವ್ಯವಹಾರ ಶ್ರೇಯಾಂಕದಲ್ಲಿ ಕೌಶಲ್ಯಕ್ಕೆ ಹೆಚ್ಚಿನ ತೂಕ ನೀಡಲಾಗುತ್ತದೆ.',
  gu: 'તમારા વાસ્તવિક અનુભવને સૌથી નજીકનું કૌશલ્ય પસંદ કરો. વ્યવસાય રેન્કિંગમાં કૌશલ્યને સૌથી વધુ વજન આપવામાં આવે છે.',
  pa: 'ਆਪਣੇ ਅਸਲ ਤਜਰਬੇ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੁਨਰ ਨੂੰ ਚੁਣੋ। ਕਾਰੋਬਾਰ ਰੈਂਕਿੰਗ ਵਿੱਚ ਹੁਨਰ ਨੂੰ ਸਭ ਤੋਂ ਵੱਧ ਭਾਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।',
};

const EXPERTISE_OPTIONS: ExpertiseOption[] = [
  { value: 'agriculture', labels: { en: 'Agriculture / Farming', hi: 'कृषि / खेती', bn: 'কৃষি / চাষাবাদ', mr: 'शेती / कृषी', ta: 'விவசாயம்', te: 'వ్యవసాయం', kn: 'ಕೃಷಿ', gu: 'કૃષિ / ખેતી', pa: 'ਖੇਤੀਬਾੜੀ' } },
  { value: 'dairy', labels: { en: 'Dairy', hi: 'डेयरी', bn: 'ডেইরি', mr: 'दुग्ध व्यवसाय', ta: 'பால் தொழில்', te: 'డెయిరీ', kn: 'ಹೈನುಗಾರಿಕೆ', gu: 'ડેરી', pa: 'ਡੇਅਰੀ' } },
  { value: 'poultry', labels: { en: 'Poultry', hi: 'पोल्ट्री', bn: 'পোল্ট্রি', mr: 'कुक्कुटपालन', ta: 'கோழிப்பண்ணை', te: 'పౌల్ట్రీ', kn: 'ಕೋಳಿ ಸಾಕಣೆ', gu: 'પોલ્ટ્રી', pa: 'ਪੋਲਟਰੀ' } },
  { value: 'food', labels: { en: 'Food Processing / Cooking', hi: 'फूड प्रोसेसिंग / खाना', bn: 'খাদ্য প্রক্রিয়াকরণ', mr: 'अन्न प्रक्रिया', ta: 'உணவு பதப்படுத்தல்', te: 'ఆహార ప్రాసెసింగ్', kn: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ', gu: 'ફૂડ પ્રોસેસિંગ', pa: 'ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ' } },
  { value: 'tailoring', labels: { en: 'Tailoring / Fashion', hi: 'सिलाई / फैशन', bn: 'সেলাই / ফ্যাশন', mr: 'शिवणकाम / फॅशन', ta: 'தையல் / ஃபேஷன்', te: 'టైలరింగ్ / ఫ్యాషన్', kn: 'ಟೈಲರಿಂಗ್ / ಫ್ಯಾಷನ್', gu: 'ટેલરિંગ / ફેશન', pa: 'ਸਿਲਾਈ / ਫੈਸ਼ਨ' } },
  { value: 'electronics', labels: { en: 'Electronics / Repair', hi: 'इलेक्ट्रॉनिक्स / रिपेयर', bn: 'ইলেকট্রনিক্স / রিপেয়ার', mr: 'इलेक्ट्रॉनिक्स / दुरुस्ती', ta: 'மின்னணு / பழுது', te: 'ఎలక్ట్రానిక్స్ / రిపేర్', kn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ / ರಿಪೇರಿ', gu: 'ઇલેક્ટ્રોનિક્સ / રિપેર', pa: 'ਇਲੈਕਟ੍ਰਾਨਿਕਸ / ਰਿਪੇਅਰ' } },
  { value: 'digital', labels: { en: 'Digital Marketing / Social Media', hi: 'डिजिटल मार्केटिंग', bn: 'ডিজিটাল মার্কেটিং', mr: 'डिजिटल मार्केटिंग', ta: 'டிஜிட்டல் மார்க்கெட்டிங்', te: 'డిజిటల్ మార్కెటింగ్', kn: 'ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್', gu: 'ડિજિટલ માર્કેટિંગ', pa: 'ਡਿਜ਼ੀਟਲ ਮਾਰਕੀਟਿੰਗ' } },
  { value: 'computer', labels: { en: 'Computer / Coding / IT', hi: 'कंप्यूटर / कोडिंग / IT', bn: 'কম্পিউটার / কোডিং', mr: 'कॉम्प्युटर / कोडिंग', ta: 'கணினி / கோடிங்', te: 'కంప్యూటర్ / కోడింగ్', kn: 'ಕಂಪ್ಯೂಟರ್ / ಕೋಡಿಂಗ್', gu: 'કમ્પ્યુટર / કોડિંગ', pa: 'ਕੰਪਿਊਟਰ / ਕੋਡਿੰਗ' } },
  { value: 'handicraft', labels: { en: 'Handicraft / Artisan', hi: 'हस्तशिल्प / कारीगर', bn: 'হস্তশিল্প / কারিগর', mr: 'हस्तकला / कारागीर', ta: 'கைவினை / கலைஞர்', te: 'హస్తకళ / కళాకారుడు', kn: 'ಕರಕುಶಲ / ಕಾರಿಗ', gu: 'હસ્તકલા / કારીગર', pa: 'ਹੱਥਕਲਾ / ਕਾਰੀਗਰ' } },
  { value: 'carpentry', labels: { en: 'Carpentry / Furniture', hi: 'बढ़ई / फर्नीचर', bn: 'কাঠের কাজ / ফার্নিচার', mr: 'सुतारकाम / फर्निचर', ta: 'தச்சு / மரச்சாமான்', te: 'కార్పెంట్రీ / ఫర్నిచర్', kn: 'ಮರಗೆಲಸ / ಫರ್ನಿಚರ್', gu: 'કારપેન્ટ્રી / ફર્નિચર', pa: 'ਕਾਰਪੈਂਟਰੀ / ਫਰਨੀਚਰ' } },
  { value: 'solar', labels: { en: 'Solar / Electrical', hi: 'सोलर / इलेक्ट्रिकल', bn: 'সোলার / ইলেকট্রিক্যাল', mr: 'सोलर / इलेक्ट्रिकल', ta: 'சோலார் / மின்சாரம்', te: 'సోలార్ / ఎలక్ట్రికల్', kn: 'ಸೋಲಾರ್ / ಎಲೆಕ್ಟ್ರಿಕಲ್', gu: 'સોલાર / ઇલેક્ટ્રિકલ', pa: 'ਸੋਲਰ / ਇਲੈਕਟ੍ਰਿਕਲ' } },
  { value: 'business', labels: { en: 'Retail / General Business', hi: 'रिटेल / सामान्य व्यापार', bn: 'রিটেল / সাধারণ ব্যবসা', mr: 'रिटेल / सामान्य व्यवसाय', ta: 'சில்லறை / பொது வணிகம்', te: 'రిటైల్ / సాధారణ వ్యాపారం', kn: 'ಚಿಲ್ಲರೆ / ಸಾಮಾನ್ಯ ವ್ಯವಹಾರ', gu: 'રિટેલ / સામાન્ય વ્યવસાય', pa: 'ਰਿਟੇਲ / ਆਮ ਕਾਰੋਬਾਰ' } },
];

const CATEGORY_EXPERTISE_DEFAULT: Partial<Record<BusinessCategory, string>> = {
  Dairy: 'dairy',
  Poultry: 'poultry',
  'Food Processing': 'food',
  Tailoring: 'tailoring',
  Handicrafts: 'handicraft',
  'Repair Services': 'electronics',
  'Agriculture Services': 'agriculture',
  'Small Manufacturing': 'business',
  Retail: 'business',
  Other: 'business',
};

const BUSINESS_OPTIONS: BusinessProfile[] = [
  {
    name: 'Mushroom Farming Unit',
    category: 'Agriculture Services',
    minCapital: 120000,
    maxCapital: 800000,
    minLand: 0.05,
    expertise: ['agriculture', 'farming', 'horticulture', 'food'],
    risk: 'Medium',
    reason: 'Low land requirement, short crop cycles and strong fit for agriculture-oriented users.',
    schemeIds: ['CMYUVA', 'PMEGP', 'MUDRA', 'CGTMSE'],
  },
  {
    name: 'Dairy & Milk Collection Centre',
    category: 'Dairy',
    minCapital: 250000,
    maxCapital: 1500000,
    minLand: 0.15,
    expertise: ['dairy', 'animal', 'farming', 'agriculture', 'milk'],
    risk: 'Medium',
    reason: 'Recurring local demand and good fit where the user has space plus animal-handling experience.',
    schemeIds: ['CMYUVA', 'MYSY', 'PMEGP', 'MUDRA', 'CGTMSE'],
  },
  {
    name: 'Poultry Farming',
    category: 'Poultry',
    minCapital: 180000,
    maxCapital: 1200000,
    minLand: 0.12,
    expertise: ['poultry', 'animal', 'farming', 'agriculture'],
    risk: 'Medium',
    reason: 'Scalable rural business with manageable entry capital and regular market demand.',
    schemeIds: ['CMYUVA', 'PMEGP', 'MUDRA', 'CGTMSE'],
  },
  {
    name: 'Micro Food Processing Unit',
    category: 'Food Processing',
    minCapital: 200000,
    maxCapital: 2000000,
    minLand: 0.04,
    expertise: ['food', 'cooking', 'processing', 'agriculture', 'business'],
    risk: 'Medium',
    reason: 'Can convert local produce into higher-value packaged products and has dedicated food-processing support.',
    schemeIds: ['PMFME', 'ODOP', 'CMYUVA', 'PMEGP', 'MUDRA', 'CGTMSE'],
  },
  {
    name: 'Plant Nursery & Seedling Business',
    category: 'Agriculture Services',
    minCapital: 80000,
    maxCapital: 600000,
    minLand: 0.08,
    expertise: ['agriculture', 'farming', 'horticulture', 'plants', 'nursery'],
    risk: 'Low',
    reason: 'Good for users with small land parcels, agriculture skills and preference for lower operating risk.',
    schemeIds: ['CMYUVA', 'MUDRA', 'PMEGP'],
  },
  {
    name: 'Tailoring & Garment Micro Unit',
    category: 'Tailoring',
    minCapital: 70000,
    maxCapital: 700000,
    minLand: 0,
    expertise: ['tailoring', 'fashion', 'stitching', 'design'],
    risk: 'Low',
    reason: 'Very low land dependence and suitable for skill-led micro entrepreneurship.',
    schemeIds: ['VSSY', 'PMVISHWAKARMA', 'CMYUVA', 'MUDRA', 'PMEGP'],
  },
  {
    name: 'Mobile & Electronics Repair Centre',
    category: 'Repair Services',
    minCapital: 60000,
    maxCapital: 500000,
    minLand: 0,
    expertise: ['electronics', 'repair', 'mobile', 'technical', 'computer'],
    risk: 'Low',
    reason: 'Low fixed-cost service business where technical skill matters more than land.',
    schemeIds: ['VSSY', 'CMYUVA', 'MUDRA', 'PMEGP'],
  },
  {
    name: 'Local Digital Services & Marketing Agency',
    category: 'Other',
    minCapital: 50000,
    maxCapital: 400000,
    minLand: 0,
    expertise: ['computer', 'digital', 'marketing', 'design', 'coding', 'social media', 'software'],
    risk: 'Low',
    reason: 'Best suited to users with digital skills and limited land or capital.',
    schemeIds: ['CMYUVA', 'MUDRA', 'PMEGP'],
  },
  {
    name: 'Handicraft & Artisan Product Unit',
    category: 'Handicrafts',
    minCapital: 70000,
    maxCapital: 800000,
    minLand: 0,
    expertise: ['craft', 'handicraft', 'handicraft', 'art', 'design', 'artisan'],
    risk: 'Low',
    reason: 'Skill-driven enterprise that can start small and expand into online or tourism-linked sales.',
    schemeIds: ['PMVISHWAKARMA', 'VSSY', 'ODOP', 'CMYUVA', 'MUDRA', 'PMEGP'],
  },
  {
    name: 'Mini Flour / Spice Processing Unit',
    category: 'Small Manufacturing',
    minCapital: 300000,
    maxCapital: 1800000,
    minLand: 0.06,
    expertise: ['manufacturing', 'food', 'agriculture', 'business', 'processing'],
    risk: 'Medium',
    reason: 'Strong local-demand manufacturing option for users with moderate capital and basic operating space.',
    schemeIds: ['PMFME', 'ODOP', 'CMYUVA', 'MYSY', 'PMEGP', 'CGTMSE'],
  },
  {
    name: 'Small Furniture / Carpentry Workshop',
    category: 'Small Manufacturing',
    minCapital: 120000,
    maxCapital: 1000000,
    minLand: 0.02,
    expertise: ['carpentry', 'wood', 'furniture', 'artisan', 'manufacturing'],
    risk: 'Medium',
    reason: 'Good skill-led manufacturing option with artisan-focused support pathways.',
    schemeIds: ['PMVISHWAKARMA', 'VSSY', 'CMYUVA', 'MUDRA', 'PMEGP'],
  },
  {
    name: 'Solar Installation & Repair Service',
    category: 'Repair Services',
    minCapital: 100000,
    maxCapital: 700000,
    minLand: 0,
    expertise: ['solar', 'electrical', 'electrician', 'technical', 'repair'],
    risk: 'Medium',
    reason: 'Growing technical-service opportunity with low land dependence and skill-based entry.',
    schemeIds: ['VSSY', 'CMYUVA', 'MUDRA', 'PMEGP'],
  },
];

const SCHEMES: SchemeProfile[] = [
  {
    id: 'CMYUVA',
    name: 'Mukhyamantri Yuva Udyami Vikas Abhiyan (CM-YUVA)',
    scope: 'Uttar Pradesh',
    bestFor: 'Young UP residents starting manufacturing, service or trade micro-enterprises',
    benefit: 'UP MSME describes interest support for eligible youth enterprises, including Phase-1 support on loans up to ₹5 lakh.',
    eligibilityHint: 'Best match when the applicant is a UP resident, generally 21–40 years old, and meets education/training conditions.',
    officialUrl: 'https://msme1connect.up.gov.in/scheme-list/-mukhyamantri-yuva-udyami-vikas-abhiyan-yojana-%28cm-yuva%29',
    tags: ['up', 'youth', 'new-business', 'service', 'manufacturing', 'trade'],
  },
  {
    id: 'MYSY',
    name: 'Mukhyamantri Yuva Swarojgar Yojana',
    scope: 'Uttar Pradesh',
    bestFor: 'Educated UP youth establishing industry or service enterprises',
    benefit: 'UP MSME lists bank-linked finance with margin-money support for eligible industry and service projects.',
    eligibilityHint: 'Useful for UP residents in the prescribed youth age group who meet education and bank eligibility conditions.',
    officialUrl: 'https://msme1connect.up.gov.in/scheme-list/mukhyamantri-yuva-swarojgar-yojana',
    tags: ['up', 'youth', 'manufacturing', 'service', 'margin-money'],
  },
  {
    id: 'ODOP',
    name: 'UP ODOP Margin Money Scheme',
    scope: 'Uttar Pradesh',
    bestFor: 'Units producing the official One District One Product item of their district',
    benefit: 'Provides project-cost-linked margin-money assistance for eligible ODOP units through the UP industrial ecosystem.',
    eligibilityHint: 'Only recommend strongly when the proposed product matches the selected district’s notified ODOP product.',
    officialUrl: 'https://msme1connect.up.gov.in/scheme-list/financial-assistance-scheme-for-one-district-one-product-%28odop-margin-money-scheme%29',
    tags: ['up', 'odop', 'artisan', 'food', 'manufacturing', 'district-product'],
  },
  {
    id: 'VSSY',
    name: 'Vishwakarma Shram Samman Yojana 2.0',
    scope: 'Uttar Pradesh',
    bestFor: 'Traditional artisans and selected modern technical trades in Uttar Pradesh',
    benefit: 'UP MSME describes free skill training, tool/financial support and market-linkage assistance across covered trades.',
    eligibilityHint: 'Strong fit for trades such as tailoring, carpentry, mobile/electronics repair, plumbing, solar installation and related skills.',
    officialUrl: 'https://msme1connect.up.gov.in/scheme-list/vishwakarma-shram-samman-yojana',
    tags: ['up', 'artisan', 'tailoring', 'repair', 'carpentry', 'solar', 'technical'],
  },
  {
    id: 'PMEGP',
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    scope: 'Central',
    bestFor: 'New micro-enterprises in manufacturing and service sectors',
    benefit: 'Credit-linked subsidy support for eligible new units; official rules vary by category, rural/urban location and project size.',
    eligibilityHint: 'A broad option for first-time/new micro-enterprise projects; final eligibility must be checked on the PMEGP portal.',
    officialUrl: 'https://pmegp.msme.gov.in/',
    tags: ['india', 'new-business', 'manufacturing', 'service', 'subsidy'],
  },
  {
    id: 'MUDRA',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    scope: 'Central',
    bestFor: 'Micro businesses needing business credit through participating lenders',
    benefit: 'Business-loan support under MUDRA categories for eligible micro enterprises; sanction depends on lender appraisal.',
    eligibilityHint: 'Useful when the user needs relatively small business finance and does not specifically require a subsidy-linked scheme.',
    officialUrl: 'https://www.financialservices.gov.in/pradhan-mantri-mudra-yojana',
    tags: ['india', 'micro-business', 'loan', 'service', 'trade', 'manufacturing'],
  },
  {
    id: 'PMFME',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    scope: 'Central',
    bestFor: 'Eligible new or existing micro food-processing enterprises',
    benefit: 'Official PMFME portal describes 35% credit-linked capital subsidy on eligible project cost, subject to scheme ceilings and conditions.',
    eligibilityHint: 'Strongest fit for food-processing, spice, flour, packaged-food and district-product processing ideas.',
    officialUrl: 'https://pmfme.mofpi.gov.in/',
    tags: ['india', 'food', 'processing', 'odop', 'subsidy'],
  },
  {
    id: 'PMVISHWAKARMA',
    name: 'PM Vishwakarma',
    scope: 'Central',
    bestFor: 'Eligible traditional artisans and craftspeople in notified trades',
    benefit: 'Includes recognition, skill training, toolkit incentive and concessional collateral-free enterprise credit for eligible Vishwakarmas.',
    eligibilityHint: 'Strong fit for traditional craft and artisan occupations; only notified trades are eligible.',
    officialUrl: 'https://pmvishwakarma.gov.in/',
    tags: ['india', 'artisan', 'craft', 'tailoring', 'carpentry', 'tools', 'skill'],
  },
  {
    id: 'CGTMSE',
    name: 'CGTMSE Credit Guarantee Scheme',
    scope: 'Central',
    bestFor: 'Eligible micro and small enterprises seeking collateral-light bank credit',
    benefit: 'Provides guarantee cover to eligible lender credit facilities, helping improve access to collateral-free or collateral-light finance.',
    eligibilityHint: 'Not a direct cash subsidy; it works through eligible lenders and is useful when bank credit access is the main barrier.',
    officialUrl: 'https://www.cgtmse.in/',
    tags: ['india', 'credit-guarantee', 'msme', 'loan', 'manufacturing', 'service'],
  },
];

const normalize = (value: string) => value.toLowerCase().trim();

const capitalFit = (capital: number, min: number, max: number) => {
  if (capital >= min && capital <= max) return 30;
  if (capital < min) return Math.max(0, 30 - ((min - capital) / min) * 30);
  return Math.max(10, 30 - ((capital - max) / Math.max(max, 1)) * 15);
};

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ initialData, onSubmit, language }) => {
  const [landArea, setLandArea] = useState<number>(0.25);
  const [capital, setCapital] = useState<number>(initialData.availableMargin || initialData.marginCapital || 300000);
  const [expertise, setExpertise] = useState<string>(CATEGORY_EXPERTISE_DEFAULT[initialData.category] || 'agriculture');
  const [stateName, setStateName] = useState<string>(initialData.location.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState<string>(UP_LOCATIONS.includes(initialData.location.district) ? initialData.location.district : 'Lucknow');
  const [risk, setRisk] = useState<Risk>(initialData.riskWillingness || 'Medium');
  const [experience, setExperience] = useState<Experience>(initialData.priorExperience || 'Some');
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo(() => {
    const skill = normalize(expertise);
    const isUP = normalize(stateName).includes('uttar pradesh') || normalize(stateName) === 'up';

    return BUSINESS_OPTIONS.map((business) => {
      const cFit = capitalFit(capital, business.minCapital, business.maxCapital);
      const landFit = business.minLand === 0 ? 20 : landArea >= business.minLand ? 20 : Math.max(0, (landArea / business.minLand) * 20);
      const hasSkillMatch = business.expertise.some((item) => skill === item || skill.includes(item) || item.includes(skill));
      const skillFit = hasSkillMatch ? 40 : 5;
      const riskFit = business.risk === risk ? 10 : risk === 'High' ? 8 : business.risk === 'Low' ? 7 : 5;
      const score = Math.min(98, Math.round(cFit + landFit + skillFit + riskFit));

      const schemes = business.schemeIds
        .map((id) => SCHEMES.find((item) => item.id === id))
        .filter((item): item is SchemeProfile => Boolean(item))
        .filter((scheme) => scheme.scope === 'Central' || isUP)
        .map((scheme, index) => ({
          ...scheme,
          matchScore: Math.max(62, Math.min(97, score - index * 4 + (scheme.scope === 'Uttar Pradesh' && isUP ? 5 : 0))),
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);

      return { ...business, score, schemes };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [capital, expertise, landArea, risk, stateName]);

  const applyRecommendation = (business: (typeof recommendations)[number]) => {
    const next: AssessmentFormData = {
      ...initialData,
      location: {
        ...initialData.location,
        state: stateName,
        district,
      },
      marginCapital: capital,
      availableMargin: capital,
      category: business.category,
      ideaText: business.name,
      businessIdea: business.name,
      targetMarket: `Customers in and around ${district}, ${stateName}`,
      priorExperience: experience,
      riskWillingness: risk,
    };
    onSubmit(next);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 py-2">
      <section className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#6B4535]">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-extrabold uppercase tracking-[0.2em]">NirnayAI Business Finder</span>
            </div>
            <h1 className="text-2xl font-black text-[#2B1B16] sm:text-3xl">Tell us what you have. We’ll tell you what fits.</h1>
            <p className="mt-2 max-w-3xl text-sm text-[#7A5A49]">
              Enter land, capital, expertise and location. NirnayAI ranks business ideas and compares Central + Uttar Pradesh government support schemes for every strong match.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D9B99B]/50 bg-[#FAF7F3] px-4 py-3 text-xs font-bold text-[#6B4535]">
            Business + Deep Scheme Matching
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-5 flex items-center gap-2">
          <Target className="h-5 w-5 text-[#8B5E47]" />
          <h2 className="text-lg font-extrabold text-[#2B1B16]">Your Resources</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><LandPlot className="h-4 w-4 text-[#8B5E47]" />Available land (acres)</span>
            <input type="number" min="0" step="0.01" value={landArea} onChange={(e) => setLandArea(Number(e.target.value))} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
          </label>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-[#8B5E47]" />Available capital (₹)</span>
            <input type="number" min="10000" step="10000" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
          </label>

          <div className="space-y-3 md:col-span-2">
            <div>
              <span className="flex items-center gap-2 text-xs font-bold text-[#2B1B16]"><UserRoundCog className="h-4 w-4 text-[#8B5E47]" />{EXPERTISE_FIELD_LABEL[language]}</span>
              <p className="mt-1 text-[11px] leading-relaxed text-[#8B5E47]">{EXPERTISE_HINT[language]}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {EXPERTISE_OPTIONS.map((option) => {
                const selected = expertise === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setExpertise(option.value);
                      setShowResults(false);
                    }}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition ${selected ? 'border-[#6B4535] bg-[#6B4535] text-white shadow-sm' : 'border-[#D9B99B]/60 bg-[#FAF7F3] text-[#4A2F24] hover:border-[#8B5E47] hover:bg-[#F3E8DC]'}`}
                  >
                    {option.labels[language]}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8B5E47]" />State</span>
            <select value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none">
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Other State">Other State</option>
            </select>
          </label>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>Location / District</span>
            {stateName === 'Uttar Pradesh' ? (
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none">
                {UP_LOCATIONS.map((place) => <option key={place} value={place}>{place}</option>)}
              </select>
            ) : (
              <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Enter your district/city" className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
            )}
          </label>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>Risk preference</span>
            <select value={risk} onChange={(e) => setRisk(e.target.value as Risk)} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none">
              <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
            </select>
          </label>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>Experience level</span>
            <select value={experience} onChange={(e) => setExperience(e.target.value as Experience)} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none">
              <option value="None">Beginner</option><option value="Some">Some experience</option><option value="Experienced">Experienced</option>
            </select>
          </label>
        </div>

        <button type="button" onClick={() => setShowResults(true)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B4535] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#503126] sm:w-auto">
          <Sparkles className="h-4 w-4" /> Find My Best Business
        </button>
      </section>

      {showResults && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-[#2B1B16]">Top matches for {district}</h2>
            <p className="text-xs text-[#7A5A49]">Business scores and scheme-match scores are decision-support estimates, not guaranteed approval or returns.</p>
          </div>

          {recommendations.map((business, index) => (
            <article key={business.name} className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#6F7655]/15 px-3 py-1 text-xs font-black text-[#56603F]">#{index + 1} Match</span>
                    <span className="rounded-full bg-[#FAF0E5] px-3 py-1 text-xs font-black text-[#8B5E47]">{business.score}% business fit</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#2B1B16]">{business.name}</h3>
                    <p className="mt-1 text-sm text-[#765849]">{business.reason}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#FAF7F3] p-3 text-xs"><span className="block text-[#8B5E47]">Capital range</span><strong className="text-[#2B1B16]">₹{business.minCapital.toLocaleString('en-IN')} – ₹{business.maxCapital.toLocaleString('en-IN')}</strong></div>
                    <div className="rounded-2xl bg-[#FAF7F3] p-3 text-xs"><span className="block text-[#8B5E47]">Minimum land</span><strong className="text-[#2B1B16]">{business.minLand === 0 ? 'No dedicated land' : `${business.minLand} acre`}</strong></div>
                    <div className="rounded-2xl bg-[#FAF7F3] p-3 text-xs"><span className="block text-[#8B5E47]">Risk profile</span><strong className="text-[#2B1B16]">{business.risk}</strong></div>
                  </div>

                  <div className="rounded-2xl border border-[#B8C09B]/60 bg-[#F5F7EE] p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#46502F]"><ShieldCheck className="h-4 w-4" /> Best government schemes to verify</div>
                    <div className="space-y-3">
                      {business.schemes.map((scheme, schemeIndex) => (
                        <div key={scheme.id} className="rounded-xl border border-[#CED5B7] bg-white/80 p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-extrabold text-[#2B1B16]">{schemeIndex + 1}. {scheme.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-[#EEE8DE] px-2 py-1 text-[10px] font-black text-[#6B4535]">{scheme.scope}</span>
                              <span className="rounded-full bg-[#DFE7CC] px-2 py-1 text-[10px] font-black text-[#46502F]">{scheme.matchScore}% scheme fit</span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-[#687050]"><strong>Best for:</strong> {scheme.bestFor}</p>
                          <p className="mt-1 text-xs text-[#687050]"><strong>Benefit:</strong> {scheme.benefit}</p>
                          <p className="mt-1 text-xs text-[#687050]"><strong>Eligibility hint:</strong> {scheme.eligibilityHint}</p>
                          <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-extrabold text-[#6B4535] underline decoration-[#D9B99B] underline-offset-4">Verify on official portal</a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button type="button" onClick={() => applyRecommendation(business)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6B4535] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#503126]">
                  <CheckCircle2 className="h-4 w-4" /> Use this recommendation <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Important:</strong> NirnayAI shows likely-fit schemes for decision support. Final eligibility, current availability, subsidy, loan sanction, district-product eligibility and required documents must always be verified on the official government portal or with the implementing bank/agency.
          </div>
        </section>
      )}
    </div>
  );
};