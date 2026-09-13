import {
  AssessmentFormData,
  BusinessCategory,
  FeasibilityScoreData,
  LanguageCode,
  LocalOpportunityData,
  MapMarkerItem,
  SWOTData,
} from '../types';

export type DemoCityId =
  | 'lucknow'
  | 'kanpur'
  | 'prayagraj'
  | 'varanasi'
  | 'ayodhya'
  | 'barabanki'
  | 'sitapur'
  | 'unnao'
  | 'raebareli'
  | 'hardoi'
  | 'sultanpur'
  | 'lakhimpur'
  | 'bahraich'
  | 'gorakhpur'
  | 'agra';

export type DemoBusinessId =
  | 'agriculture'
  | 'dairy'
  | 'poultry'
  | 'food-processing'
  | 'tailoring'
  | 'electrical-solar'
  | 'digital-it'
  | 'handicraft'
  | 'carpentry'
  | 'repair-service';

type DemoMarketType = 'metro' | 'industrial' | 'mixed' | 'rural-agri' | 'religious-tourism' | 'tourism';

export interface DemoCity {
  id: DemoCityId;
  label: string;
  district: string;
  village: string;
  block: string;
  state: string;
  latitude?: number;
  longitude?: number;
  marketType: DemoMarketType;
}

export interface DemoBusiness {
  id: DemoBusinessId;
  labels: Record<LanguageCode, string>;
  category: BusinessCategory;
  skill: string;
  marginCapital: number;
  availableLandAcres: number;
  priorExperience: 'None' | 'Some' | 'Experienced';
  riskWillingness: 'Low' | 'Medium' | 'High';
  preferredMarkets: DemoMarketType[];
  baseScore: number;
}

export const DEMO_CITIES: DemoCity[] = [
  { id: 'lucknow', label: 'Lucknow', district: 'Lucknow', village: 'Bakshi Ka Talab', block: 'Bakshi Ka Talab', state: 'Uttar Pradesh', latitude: 26.986, longitude: 80.929, marketType: 'metro' },
  { id: 'kanpur', label: 'Kanpur Nagar', district: 'Kanpur Nagar', village: 'Bilhaur', block: 'Bilhaur', state: 'Uttar Pradesh', latitude: 26.843, longitude: 80.063, marketType: 'industrial' },
  { id: 'prayagraj', label: 'Prayagraj', district: 'Prayagraj', village: 'Phulpur', block: 'Phulpur', state: 'Uttar Pradesh', latitude: 25.548, longitude: 82.089, marketType: 'mixed' },
  { id: 'varanasi', label: 'Varanasi', district: 'Varanasi', village: 'Pindra', block: 'Pindra', state: 'Uttar Pradesh', latitude: 25.491, longitude: 82.858, marketType: 'religious-tourism' },
  { id: 'ayodhya', label: 'Ayodhya', district: 'Ayodhya', village: 'Sohawal', block: 'Sohawal', state: 'Uttar Pradesh', latitude: 26.747, longitude: 81.989, marketType: 'religious-tourism' },
  { id: 'barabanki', label: 'Barabanki', district: 'Barabanki', village: 'Dewa', block: 'Dewa', state: 'Uttar Pradesh', latitude: 27.036, longitude: 81.166, marketType: 'rural-agri' },
  { id: 'sitapur', label: 'Sitapur', district: 'Sitapur', village: 'Mahmudabad', block: 'Mahmudabad', state: 'Uttar Pradesh', latitude: 27.291, longitude: 81.118, marketType: 'rural-agri' },
  { id: 'unnao', label: 'Unnao', district: 'Unnao', village: 'Nawabganj', block: 'Nawabganj', state: 'Uttar Pradesh', latitude: 26.616, longitude: 80.656, marketType: 'industrial' },
  { id: 'raebareli', label: 'Rae Bareli', district: 'Rae Bareli', village: 'Lalganj', block: 'Lalganj', state: 'Uttar Pradesh', latitude: 26.165, longitude: 80.966, marketType: 'mixed' },
  { id: 'hardoi', label: 'Hardoi', district: 'Hardoi', village: 'Sandila', block: 'Sandila', state: 'Uttar Pradesh', latitude: 27.069, longitude: 80.514, marketType: 'rural-agri' },
  { id: 'sultanpur', label: 'Sultanpur', district: 'Sultanpur', village: 'Lambhua', block: 'Lambhua', state: 'Uttar Pradesh', latitude: 26.206, longitude: 82.197, marketType: 'mixed' },
  { id: 'lakhimpur', label: 'Lakhimpur Kheri', district: 'Lakhimpur Kheri', village: 'Gola Gokaran Nath', block: 'Gola', state: 'Uttar Pradesh', latitude: 28.078, longitude: 80.47, marketType: 'rural-agri' },
  { id: 'bahraich', label: 'Bahraich', district: 'Bahraich', village: 'Nanpara', block: 'Nanpara', state: 'Uttar Pradesh', latitude: 27.864, longitude: 81.5, marketType: 'rural-agri' },
  { id: 'gorakhpur', label: 'Gorakhpur', district: 'Gorakhpur', village: 'Pipraich', block: 'Pipraich', state: 'Uttar Pradesh', latitude: 26.827, longitude: 83.526, marketType: 'mixed' },
  { id: 'agra', label: 'Agra', district: 'Agra', village: 'Achhnera', block: 'Achhnera', state: 'Uttar Pradesh', latitude: 27.178, longitude: 77.756, marketType: 'tourism' },
];

export const DEMO_BUSINESSES: DemoBusiness[] = [
  {
    id: 'agriculture',
    labels: { en: 'Agriculture & Farm Services', hi: 'कृषि एवं फार्म सेवाएँ', bn: 'কৃষি ও খামার পরিষেবা', mr: 'कृषी व शेत सेवा', ta: 'விவசாயம் & பண்ணை சேவைகள்', te: 'వ్యవసాయం & ఫార్మ్ సేవలు', kn: 'ಕೃಷಿ & ಫಾರ್ಮ್ ಸೇವೆಗಳು', gu: 'કૃષિ અને ફાર્મ સેવાઓ', pa: 'ਖੇਤੀਬਾੜੀ ਅਤੇ ਫਾਰਮ ਸੇਵਾਵਾਂ' },
    category: 'Agriculture Services', skill: 'Agriculture / Farming', marginCapital: 80000, availableLandAcres: 2, priorExperience: 'Some', riskWillingness: 'Medium', preferredMarkets: ['rural-agri', 'mixed'], baseScore: 80,
  },
  {
    id: 'dairy',
    labels: { en: 'Dairy & Milk Products', hi: 'डेयरी एवं दुग्ध उत्पाद', bn: 'ডেইরি ও দুগ্ধপণ্য', mr: 'दुग्ध व्यवसाय व दुग्धजन्य उत्पादने', ta: 'பால் பண்ணை & பால் பொருட்கள்', te: 'డెయిరీ & పాల ఉత్పత్తులు', kn: 'ಡೈರಿ & ಹಾಲು ಉತ್ಪನ್ನಗಳು', gu: 'ડેરી અને દૂધ ઉત્પાદનો', pa: 'ਡੇਅਰੀ ਅਤੇ ਦੁੱਧ ਉਤਪਾਦ' },
    category: 'Dairy', skill: 'Dairy / Animal Care', marginCapital: 50000, availableLandAcres: 0.5, priorExperience: 'Some', riskWillingness: 'Medium', preferredMarkets: ['rural-agri', 'mixed', 'metro'], baseScore: 79,
  },
  {
    id: 'poultry',
    labels: { en: 'Poultry & Egg Unit', hi: 'पोल्ट्री एवं अंडा इकाई', bn: 'পোল্ট্রি ও ডিম ইউনিট', mr: 'पोल्ट्री व अंडी युनिट', ta: 'கோழிப்பண்ணை & முட்டை அலகு', te: 'పౌల్ట్రీ & గుడ్ల యూనిట్', kn: 'ಕೋಳಿ ಸಾಕಣೆ & ಮೊಟ್ಟೆ ಘಟಕ', gu: 'પોલ્ટ્રી અને ઇંડા યુનિટ', pa: 'ਪੋਲਟਰੀ ਅਤੇ ਅੰਡਾ ਯੂਨਿਟ' },
    category: 'Poultry', skill: 'Poultry', marginCapital: 70000, availableLandAcres: 1, priorExperience: 'Some', riskWillingness: 'Medium', preferredMarkets: ['rural-agri', 'mixed'], baseScore: 77,
  },
  {
    id: 'food-processing',
    labels: { en: 'Food Processing & Packaged Foods', hi: 'खाद्य प्रसंस्करण एवं पैकेज्ड फूड', bn: 'খাদ্য প্রক্রিয়াকরণ ও প্যাকেটজাত খাবার', mr: 'अन्न प्रक्रिया व पॅकेज्ड फूड', ta: 'உணவு பதப்படுத்தல் & பொதியிடப்பட்ட உணவு', te: 'ఫుడ్ ప్రాసెసింగ్ & ప్యాకేజ్డ్ ఫుడ్స్', kn: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ & ಪ್ಯಾಕೇಜ್ಡ್ ಆಹಾರ', gu: 'ફૂડ પ્રોસેસિંગ અને પેકેજ્ડ ફૂડ', pa: 'ਫੂਡ ਪ੍ਰੋਸੈਸਿੰਗ ਅਤੇ ਪੈਕ ਕੀਤੇ ਭੋਜਨ' },
    category: 'Food Processing', skill: 'Food Processing / Cooking', marginCapital: 100000, availableLandAcres: 0.25, priorExperience: 'Some', riskWillingness: 'Medium', preferredMarkets: ['metro', 'mixed', 'tourism', 'religious-tourism'], baseScore: 81,
  },
  {
    id: 'tailoring',
    labels: { en: 'Tailoring & Fashion Services', hi: 'सिलाई एवं फैशन सेवाएँ', bn: 'দর্জি ও ফ্যাশন পরিষেবা', mr: 'शिवणकाम व फॅशन सेवा', ta: 'தையல் & ஃபேஷன் சேவைகள்', te: 'టైలరింగ్ & ఫ్యాషన్ సేవలు', kn: 'ಟೈಲರಿಂಗ್ & ಫ್ಯಾಷನ್ ಸೇವೆಗಳು', gu: 'ટેલરિંગ અને ફેશન સેવાઓ', pa: 'ਸਿਲਾਈ ਅਤੇ ਫੈਸ਼ਨ ਸੇਵਾਵਾਂ' },
    category: 'Tailoring', skill: 'Tailoring / Fashion', marginCapital: 35000, availableLandAcres: 0, priorExperience: 'Some', riskWillingness: 'Low', preferredMarkets: ['metro', 'mixed', 'tourism', 'religious-tourism'], baseScore: 82,
  },
  {
    id: 'electrical-solar',
    labels: { en: 'Electrical & Solar Services', hi: 'इलेक्ट्रिकल एवं सोलर सेवाएँ', bn: 'ইলেকট্রিক্যাল ও সৌর পরিষেবা', mr: 'इलेक्ट्रिकल व सोलर सेवा', ta: 'மின்சாரம் & சோலார் சேவைகள்', te: 'ఎలక్ట్రికల్ & సోలార్ సేవలు', kn: 'ಎಲೆಕ್ಟ್ರಿಕಲ್ & ಸೌರ ಸೇವೆಗಳು', gu: 'ઇલેક્ટ્રિકલ અને સોલાર સેવાઓ', pa: 'ਇਲੈਕਟ੍ਰਿਕਲ ਅਤੇ ਸੋਲਰ ਸੇਵਾਵਾਂ' },
    category: 'Repair Services', skill: 'Electrical / Electronics / Solar', marginCapital: 60000, availableLandAcres: 0, priorExperience: 'Experienced', riskWillingness: 'Medium', preferredMarkets: ['industrial', 'mixed', 'rural-agri'], baseScore: 83,
  },
  {
    id: 'digital-it',
    labels: { en: 'Digital & IT Services', hi: 'डिजिटल एवं आईटी सेवाएँ', bn: 'ডিজিটাল ও আইটি পরিষেবা', mr: 'डिजिटल व आयटी सेवा', ta: 'டிஜிட்டல் & ஐடி சேவைகள்', te: 'డిజిటల్ & ఐటీ సేవలు', kn: 'ಡಿಜಿಟಲ್ & ಐಟಿ ಸೇವೆಗಳು', gu: 'ડિજિટલ અને આઈટી સેવાઓ', pa: 'ਡਿਜ਼ਿਟਲ ਅਤੇ ਆਈਟੀ ਸੇਵਾਵਾਂ' },
    category: 'Other', skill: 'Digital Marketing / Computer / IT', marginCapital: 12000, availableLandAcres: 0, priorExperience: 'Some', riskWillingness: 'Low', preferredMarkets: ['metro', 'industrial', 'mixed'], baseScore: 84,
  },
  {
    id: 'handicraft',
    labels: { en: 'Handicrafts & Artisan Products', hi: 'हस्तशिल्प एवं कारीगर उत्पाद', bn: 'হস্তশিল্প ও কারিগর পণ্য', mr: 'हस्तकला व कारागीर उत्पादने', ta: 'கைவினை & கலைஞர் பொருட்கள்', te: 'హస్తకళలు & కళాకారుల ఉత్పత్తులు', kn: 'ಹಸ್ತಕಲೆ & ಕರಕುಶಲ ಉತ್ಪನ್ನಗಳು', gu: 'હસ્તકલા અને કારીગર ઉત્પાદનો', pa: 'ਹਸਤਕਲਾ ਅਤੇ ਕਾਰੀਗਰ ਉਤਪਾਦ' },
    category: 'Handicrafts', skill: 'Handicraft / Artisan', marginCapital: 40000, availableLandAcres: 0, priorExperience: 'Some', riskWillingness: 'Low', preferredMarkets: ['tourism', 'religious-tourism', 'metro'], baseScore: 78,
  },
  {
    id: 'carpentry',
    labels: { en: 'Carpentry & Furniture', hi: 'बढ़ईगीरी एवं फर्नीचर', bn: 'কাঠমিস্ত্রি ও আসবাবপত্র', mr: 'सुतारकाम व फर्निचर', ta: 'தச்சு வேலை & மரச்சாமான்கள்', te: 'కార్పెంట్రీ & ఫర్నిచర్', kn: 'ಬಡಗಿ ಕೆಲಸ & ಫರ್ನಿಚರ್', gu: 'સુથારીકામ અને ફર્નિચર', pa: 'ਤਰਖਾਣੀ ਅਤੇ ਫਰਨੀਚਰ' },
    category: 'Small Manufacturing', skill: 'Carpentry / Furniture', marginCapital: 90000, availableLandAcres: 0.1, priorExperience: 'Experienced', riskWillingness: 'Medium', preferredMarkets: ['industrial', 'mixed', 'metro'], baseScore: 79,
  },
  {
    id: 'repair-service',
    labels: { en: 'Repair & Service Center', hi: 'मरम्मत एवं सेवा केंद्र', bn: 'মেরামত ও পরিষেবা কেন্দ্র', mr: 'दुरुस्ती व सेवा केंद्र', ta: 'பழுது பார்க்கும் & சேவை மையம்', te: 'రిపేర్ & సర్వీస్ సెంటర్', kn: 'ದುರಸ್ತಿ & ಸೇವಾ ಕೇಂದ್ರ', gu: 'રિપેર અને સર્વિસ સેન્ટર', pa: 'ਮੁਰੰਮਤ ਅਤੇ ਸੇਵਾ ਕੇਂਦਰ' },
    category: 'Repair Services', skill: 'Electrical / Electronics / Repair', marginCapital: 45000, availableLandAcres: 0, priorExperience: 'Some', riskWillingness: 'Low', preferredMarkets: ['industrial', 'mixed', 'rural-agri', 'metro'], baseScore: 81,
  },
];

export const DEFAULT_DEMO_CITY: DemoCityId = 'lucknow';
export const DEFAULT_DEMO_BUSINESS: DemoBusinessId = 'dairy';

const CITY_SCORE_DELTA: Record<DemoCityId, number> = {
  lucknow: 2, kanpur: 1, prayagraj: 1, varanasi: 2, ayodhya: 1,
  barabanki: 2, sitapur: 0, unnao: 1, raebareli: 0, hardoi: 0,
  sultanpur: 0, lakhimpur: 2, bahraich: -1, gorakhpur: 1, agra: 2,
};

const DEMO_TEXT: Record<LanguageCode, {
  serving: string;
  buyers: string;
  localDemand: string;
  demandSignal: string;
  marketGap: string;
  competition: string;
  recommendedRadius: string;
  marketCluster: string;
  customerCluster: string;
  competitors: string;
  gapTitle: string;
  opportunityDescription: string;
  customerDescription: string;
  competitorDescription: string;
  gapDescription: string;
  coreOffer: string;
  starterPackage: string;
  valueAdded: string;
  bulkContract: string;
  verify: string;
  source: string;
  promising: string;
  viable: string;
  recommendation: string;
  strengthSkill: string;
  strengthMarket: string;
  strengthCapital: string;
  weaknessValidation: string;
  weaknessExecution: string;
  weaknessCash: string;
  opportunityLocal: string;
  opportunityRepeat: string;
  opportunityDigital: string;
  threatCompetition: string;
  threatDemand: string;
  threatCost: string;
  pilotTitle: string;
  pilotDesc: string;
  capitalTitle: string;
  capitalDesc: string;
  marketTitle: string;
  marketDesc: string;
}> = {
  en: {
    serving: 'localized business scenario serving', buyers: 'Likely local buyers and repeat customers around', localDemand: 'Moderate to High', demandSignal: 'Recurring demand should be validated with nearby buyers for', marketGap: 'Potential gap for a reliable, organized local offer in', competition: 'Moderate competition; map and field-check existing providers for', recommendedRadius: 'Start within 5 km; expand to 10 km after repeat demand is proven', marketCluster: 'Local Market Cluster', customerCluster: 'Customer Hub', competitors: 'Existing Competitors', gapTitle: 'Local Market Gap', opportunityDescription: 'Use this cluster to test pricing, demand frequency and repeat orders before scaling.', customerDescription: 'Nearby buyers can be approached through direct outreach, referrals and small trial offers.', competitorDescription: 'Compare price, quality, turnaround time and trust signals before choosing your positioning.', gapDescription: 'Validate whether customers are underserved on quality, convenience, availability or after-sales support.', coreOffer: 'Core offer', starterPackage: 'Starter package', valueAdded: 'Value-added option', bulkContract: 'B2B / repeat contract', verify: 'Indicative demo data — verify locally before investing', source: 'NIRNAY AI multi-business demo model', promising: 'Promising — proceed with controlled validation', viable: 'Viable with local validation and disciplined execution', recommendation: 'shows a promising fit when skill, capital and the district customer route are validated together. Start with a small paid pilot, compare nearby competitors and protect working capital before scaling.', strengthSkill: 'matches the selected skill and can start with a focused offer.', strengthMarket: 'provides multiple local customer routes to test.', strengthCapital: 'can be staged so capital is not committed all at once.', weaknessValidation: 'Demand assumptions still need a real customer survey.', weaknessExecution: 'Execution quality and consistency will determine repeat demand.', weaknessCash: 'Working-capital discipline is required during the launch phase.', opportunityLocal: 'Local buyer clusters can support direct and referral-led sales.', opportunityRepeat: 'Repeat orders can improve cash-flow predictability.', opportunityDigital: 'WhatsApp, maps and local digital discovery can widen reach.', threatCompetition: 'Existing informal or established competitors may undercut price.', threatDemand: 'Demand can vary by season, locality and customer segment.', threatCost: 'Input, transport or energy costs can reduce margins.', pilotTitle: 'Run a paid pilot first', pilotDesc: 'Test the smallest sellable version with 10–20 real customers before committing the full project budget.', capitalTitle: 'Protect working capital', capitalDesc: 'Keep a cash buffer for supplies, transport, repairs and delayed customer payments.', marketTitle: 'Validate the local route', marketDesc: 'Use the district, nearby clusters and competitor checks to decide where the first repeat customers should come from.'
  },
  hi: {
    serving: 'के लिए स्थानीय व्यवसाय डेमो', buyers: 'आस-पास के संभावित स्थानीय ग्राहक और दोबारा खरीदने वाले ग्राहक', localDemand: 'मध्यम से उच्च', demandSignal: 'नजदीकी ग्राहकों के साथ नियमित मांग की पुष्टि करें:', marketGap: 'विश्वसनीय और संगठित स्थानीय पेशकश की संभावित कमी:', competition: 'मध्यम प्रतिस्पर्धा; मौजूदा प्रदाताओं को मैप और फील्ड में जांचें:', recommendedRadius: '5 किमी से शुरू करें; दोबारा मांग साबित होने पर 10 किमी तक बढ़ाएँ', marketCluster: 'स्थानीय बाजार क्लस्टर', customerCluster: 'ग्राहक केंद्र', competitors: 'मौजूदा प्रतिस्पर्धी', gapTitle: 'स्थानीय बाजार की कमी', opportunityDescription: 'बड़े निवेश से पहले यहां कीमत, मांग की आवृत्ति और दोबारा ऑर्डर जांचें।', customerDescription: 'नजदीकी ग्राहकों तक सीधे संपर्क, रेफरल और छोटे ट्रायल ऑफर से पहुंचें।', competitorDescription: 'अपनी पोजिशनिंग तय करने से पहले कीमत, गुणवत्ता, समय और भरोसे की तुलना करें।', gapDescription: 'जांचें कि ग्राहक गुणवत्ता, सुविधा, उपलब्धता या सेवा में कहां कम सुविधा पा रहे हैं।', coreOffer: 'मुख्य पेशकश', starterPackage: 'शुरुआती पैकेज', valueAdded: 'वैल्यू-ऐडेड विकल्प', bulkContract: 'B2B / नियमित अनुबंध', verify: 'संकेतात्मक डेमो डेटा — निवेश से पहले स्थानीय सत्यापन करें', source: 'NIRNAY AI मल्टी-बिजनेस डेमो मॉडल', promising: 'आशाजनक — नियंत्रित सत्यापन के साथ आगे बढ़ें', viable: 'स्थानीय सत्यापन और अनुशासित क्रियान्वयन के साथ व्यवहार्य', recommendation: 'कौशल, पूंजी और जिला ग्राहक मार्ग को साथ में सत्यापित करने पर अच्छा फिट दिखाता है। छोटे भुगतान वाले पायलट से शुरू करें, नजदीकी प्रतिस्पर्धियों की तुलना करें और विस्तार से पहले कार्यशील पूंजी सुरक्षित रखें।', strengthSkill: 'चुने हुए कौशल से मेल खाता है और केंद्रित पेशकश से शुरू हो सकता है।', strengthMarket: 'परीक्षण के लिए कई स्थानीय ग्राहक मार्ग देता है।', strengthCapital: 'पूंजी को चरणों में लगाया जा सकता है।', weaknessValidation: 'मांग की धारणा को वास्तविक ग्राहक सर्वे से जांचना बाकी है।', weaknessExecution: 'दोबारा मांग के लिए गुणवत्ता और निरंतरता जरूरी है।', weaknessCash: 'लॉन्च चरण में कार्यशील पूंजी अनुशासन जरूरी है।', opportunityLocal: 'स्थानीय ग्राहक क्लस्टर सीधे और रेफरल बिक्री दे सकते हैं।', opportunityRepeat: 'दोबारा ऑर्डर नकदी प्रवाह को स्थिर कर सकते हैं।', opportunityDigital: 'WhatsApp, मैप और स्थानीय डिजिटल खोज पहुंच बढ़ा सकते हैं।', threatCompetition: 'मौजूदा प्रतिस्पर्धी कीमत कम कर सकते हैं।', threatDemand: 'मांग मौसम, स्थान और ग्राहक वर्ग के अनुसार बदल सकती है।', threatCost: 'इनपुट, परिवहन या ऊर्जा लागत मार्जिन घटा सकती है।', pilotTitle: 'पहले भुगतान वाला पायलट चलाएँ', pilotDesc: 'पूरा बजट लगाने से पहले 10–20 वास्तविक ग्राहकों के साथ सबसे छोटा बिकने योग्य मॉडल जांचें।', capitalTitle: 'कार्यशील पूंजी बचाएँ', capitalDesc: 'सप्लाई, परिवहन, मरम्मत और देर से भुगतान के लिए नकदी बफर रखें।', marketTitle: 'स्थानीय ग्राहक मार्ग सत्यापित करें', marketDesc: 'जिला, नजदीकी क्लस्टर और प्रतिस्पर्धी जांच से पहले नियमित ग्राहकों का स्रोत तय करें।'
  },
  bn: {
    serving: 'এর জন্য স্থানীয় ব্যবসা ডেমো', buyers: 'আশেপাশের সম্ভাব্য স্থানীয় ক্রেতা ও পুনরাবৃত্ত গ্রাহক', localDemand: 'মাঝারি থেকে উচ্চ', demandSignal: 'নিকটবর্তী ক্রেতাদের সঙ্গে পুনরাবৃত্ত চাহিদা যাচাই করুন:', marketGap: 'বিশ্বস্ত ও সংগঠিত স্থানীয় অফারের সম্ভাব্য ঘাটতি:', competition: 'মাঝারি প্রতিযোগিতা; বিদ্যমান সরবরাহকারী মাঠে যাচাই করুন:', recommendedRadius: '৫ কিমি থেকে শুরু করুন; পুনরাবৃত্ত চাহিদা প্রমাণিত হলে ১০ কিমি পর্যন্ত বাড়ান', marketCluster: 'স্থানীয় বাজার ক্লাস্টার', customerCluster: 'গ্রাহক কেন্দ্র', competitors: 'বর্তমান প্রতিযোগী', gapTitle: 'স্থানীয় বাজারের ঘাটতি', opportunityDescription: 'স্কেল করার আগে মূল্য, চাহিদার ঘনত্ব ও পুনরায় অর্ডার পরীক্ষা করুন।', customerDescription: 'সরাসরি যোগাযোগ, রেফারেল ও ছোট ট্রায়াল অফার দিয়ে কাছের ক্রেতাদের কাছে পৌঁছান।', competitorDescription: 'অবস্থান ঠিক করার আগে মূল্য, গুণমান, সময় ও বিশ্বাসযোগ্যতা তুলনা করুন।', gapDescription: 'গুণমান, সুবিধা, প্রাপ্যতা বা বিক্রয়োত্তর সেবায় ঘাটতি আছে কি না যাচাই করুন।', coreOffer: 'মূল অফার', starterPackage: 'শুরুর প্যাকেজ', valueAdded: 'ভ্যালু-অ্যাডেড বিকল্প', bulkContract: 'B2B / পুনরাবৃত্ত চুক্তি', verify: 'ইঙ্গিতমূলক ডেমো তথ্য — বিনিয়োগের আগে স্থানীয়ভাবে যাচাই করুন', source: 'NIRNAY AI মাল্টি-বিজনেস ডেমো মডেল', promising: 'আশাব্যঞ্জক — নিয়ন্ত্রিত যাচাইয়ের সঙ্গে এগোন', viable: 'স্থানীয় যাচাই ও শৃঙ্খলিত বাস্তবায়নে কার্যকর', recommendation: 'দক্ষতা, মূলধন ও জেলার গ্রাহক পথ একসঙ্গে যাচাই করলে ভালো ফিট দেখায়। ছোট পেইড পাইলট চালান, কাছের প্রতিযোগী তুলনা করুন এবং স্কেলের আগে ওয়ার্কিং ক্যাপিটাল রক্ষা করুন।', strengthSkill: 'নির্বাচিত দক্ষতার সঙ্গে মেলে এবং ছোট ফোকাসড অফার দিয়ে শুরু করা যায়।', strengthMarket: 'পরীক্ষার জন্য একাধিক স্থানীয় গ্রাহক পথ দেয়।', strengthCapital: 'ধাপে ধাপে মূলধন বিনিয়োগ করা যায়।', weaknessValidation: 'বাস্তব গ্রাহক জরিপ দিয়ে চাহিদা যাচাই বাকি।', weaknessExecution: 'পুনরাবৃত্ত চাহিদার জন্য গুণমান ও ধারাবাহিকতা জরুরি।', weaknessCash: 'লঞ্চ পর্যায়ে ওয়ার্কিং ক্যাপিটাল শৃঙ্খলা দরকার।', opportunityLocal: 'স্থানীয় ক্রেতা ক্লাস্টার সরাসরি ও রেফারেল বিক্রি দিতে পারে।', opportunityRepeat: 'পুনরাবৃত্ত অর্ডার ক্যাশফ্লো স্থিতিশীল করতে পারে।', opportunityDigital: 'WhatsApp, ম্যাপ ও স্থানীয় ডিজিটাল অনুসন্ধান নাগাল বাড়াতে পারে।', threatCompetition: 'বিদ্যমান প্রতিযোগী কম দামে চাপ দিতে পারে।', threatDemand: 'চাহিদা মৌসুম, এলাকা ও গ্রাহক অনুযায়ী বদলাতে পারে।', threatCost: 'ইনপুট, পরিবহন বা বিদ্যুৎ খরচ মার্জিন কমাতে পারে।', pilotTitle: 'আগে পেইড পাইলট চালান', pilotDesc: 'পুরো বাজেট দেওয়ার আগে ১০–২০ বাস্তব গ্রাহকের সঙ্গে ছোট বিক্রয়যোগ্য মডেল পরীক্ষা করুন।', capitalTitle: 'ওয়ার্কিং ক্যাপিটাল রক্ষা করুন', capitalDesc: 'সরবরাহ, পরিবহন, মেরামত ও বিলম্বিত পেমেন্টের জন্য নগদ বাফার রাখুন।', marketTitle: 'স্থানীয় গ্রাহক পথ যাচাই করুন', marketDesc: 'জেলা, কাছের ক্লাস্টার ও প্রতিযোগী দেখে প্রথম পুনরাবৃত্ত গ্রাহকের উৎস ঠিক করুন।'
  },
  mr: {
    serving: 'साठी स्थानिक व्यवसाय डेमो', buyers: 'आजूबाजूचे संभाव्य स्थानिक ग्राहक व पुनरावृत्ती ग्राहक', localDemand: 'मध्यम ते उच्च', demandSignal: 'जवळच्या ग्राहकांसोबत नियमित मागणी तपासा:', marketGap: 'विश्वसनीय व संघटित स्थानिक ऑफरची संभाव्य कमतरता:', competition: 'मध्यम स्पर्धा; विद्यमान सेवा/विक्रेते प्रत्यक्ष तपासा:', recommendedRadius: '5 किमीपासून सुरू करा; पुनरावृत्ती मागणी सिद्ध झाल्यावर 10 किमीपर्यंत वाढवा', marketCluster: 'स्थानिक बाजार क्लस्टर', customerCluster: 'ग्राहक केंद्र', competitors: 'विद्यमान स्पर्धक', gapTitle: 'स्थानिक बाजारातील अंतर', opportunityDescription: 'वाढ करण्यापूर्वी किंमत, मागणीची वारंवारता आणि पुनरावृत्ती ऑर्डर तपासा.', customerDescription: 'थेट संपर्क, रेफरल आणि छोट्या ट्रायल ऑफरने जवळच्या ग्राहकांपर्यंत पोहोचा.', competitorDescription: 'पोझिशनिंगपूर्वी किंमत, गुणवत्ता, वेळ व विश्वासाची तुलना करा.', gapDescription: 'गुणवत्ता, सुविधा, उपलब्धता किंवा सेवेत ग्राहक कमी सेवा घेत आहेत का ते तपासा.', coreOffer: 'मुख्य ऑफर', starterPackage: 'स्टार्टर पॅकेज', valueAdded: 'मूल्यवर्धित पर्याय', bulkContract: 'B2B / नियमित करार', verify: 'सूचक डेमो डेटा — गुंतवणुकीपूर्वी स्थानिक तपासणी करा', source: 'NIRNAY AI मल्टी-बिझनेस डेमो मॉडेल', promising: 'आशादायक — नियंत्रित पडताळणीसह पुढे जा', viable: 'स्थानिक पडताळणी व शिस्तबद्ध अंमलबजावणीसह व्यवहार्य', recommendation: 'कौशल्य, भांडवल आणि जिल्हा ग्राहक मार्ग एकत्र पडताळल्यास चांगला फिट दिसतो. छोट्या पेड पायलटने सुरुवात करा, जवळचे स्पर्धक तपासा आणि विस्तारापूर्वी कार्यभांडवल राखा.', strengthSkill: 'निवडलेल्या कौशल्याशी जुळते आणि केंद्रित ऑफरने सुरुवात करता येते.', strengthMarket: 'चाचणीसाठी अनेक स्थानिक ग्राहक मार्ग उपलब्ध आहेत.', strengthCapital: 'भांडवल टप्प्याटप्प्याने गुंतवता येते.', weaknessValidation: 'मागणी प्रत्यक्ष ग्राहक सर्वेक्षणाने तपासणे बाकी आहे.', weaknessExecution: 'पुनरावृत्ती मागणीसाठी गुणवत्ता व सातत्य महत्त्वाचे आहे.', weaknessCash: 'लॉन्च टप्प्यात कार्यभांडवल शिस्त आवश्यक आहे.', opportunityLocal: 'स्थानिक ग्राहक क्लस्टर थेट व रेफरल विक्री देऊ शकतात.', opportunityRepeat: 'पुनरावृत्ती ऑर्डर कॅशफ्लो स्थिर करू शकतात.', opportunityDigital: 'WhatsApp, नकाशे आणि स्थानिक डिजिटल शोध पोहोच वाढवू शकतात.', threatCompetition: 'विद्यमान स्पर्धक किंमत कमी करू शकतात.', threatDemand: 'मागणी हंगाम, स्थान व ग्राहक गटानुसार बदलू शकते.', threatCost: 'इनपुट, वाहतूक किंवा ऊर्जा खर्च मार्जिन कमी करू शकतो.', pilotTitle: 'आधी पेड पायलट चालवा', pilotDesc: 'पूर्ण बजेट गुंतवण्यापूर्वी 10–20 वास्तविक ग्राहकांसोबत छोटा विक्रीयोग्य मॉडेल तपासा.', capitalTitle: 'कार्यभांडवल सुरक्षित ठेवा', capitalDesc: 'पुरवठा, वाहतूक, दुरुस्ती आणि उशिरा मिळणाऱ्या पैशासाठी रोख राखीव ठेवा.', marketTitle: 'स्थानिक ग्राहक मार्ग पडताळा', marketDesc: 'जिल्हा, जवळचे क्लस्टर आणि स्पर्धक तपासून पहिल्या पुनरावृत्ती ग्राहकांचा स्रोत ठरवा.'
  },
  ta: {
    serving: 'க்கான உள்ளூர் வணிக டெமோ', buyers: 'சுற்றியுள்ள சாத்தியமான உள்ளூர் வாங்குபவர்கள் மற்றும் மீண்டும் வாங்கும் வாடிக்கையாளர்கள்', localDemand: 'மிதமானது முதல் அதிகம்', demandSignal: 'அருகிலுள்ள வாங்குபவர்களுடன் மீண்டும் வரும் தேவையை சரிபார்க்கவும்:', marketGap: 'நம்பகமான ஒழுங்கமைந்த உள்ளூர் சேவைக்கான சாத்தியமான இடைவெளி:', competition: 'மிதமான போட்டி; உள்ளூர் வழங்குநர்களை வரைபடம் மற்றும் நேரில் சரிபார்க்கவும்:', recommendedRadius: '5 கிமீவில் தொடங்கவும்; மீண்டும் வரும் தேவை நிரூபித்த பிறகு 10 கிமீ வரை விரிவாக்கவும்', marketCluster: 'உள்ளூர் சந்தை தொகுதி', customerCluster: 'வாடிக்கையாளர் மையம்', competitors: 'தற்போதைய போட்டியாளர்கள்', gapTitle: 'உள்ளூர் சந்தை இடைவெளி', opportunityDescription: 'விரிவாக்கத்திற்கு முன் விலை, தேவை அடிக்கடி வருகிறதா மற்றும் மீண்டும் ஆர்டர் வருகிறதா என்பதை சோதிக்கவும்.', customerDescription: 'நேரடி தொடர்பு, பரிந்துரை மற்றும் சிறிய சோதனை சலுகைகளால் அருகிலுள்ள வாங்குபவர்களை அணுகவும்.', competitorDescription: 'உங்கள் நிலைப்பாட்டைத் தேர்வதற்கு முன் விலை, தரம், நேரம் மற்றும் நம்பகத்தன்மையை ஒப்பிடவும்.', gapDescription: 'தரம், வசதி, கிடைக்கும் தன்மை அல்லது சேவையில் வாடிக்கையாளர்கள் குறைவாக சேவை பெறுகிறார்களா என சரிபார்க்கவும்.', coreOffer: 'முக்கிய சலுகை', starterPackage: 'தொடக்க தொகுப்பு', valueAdded: 'மதிப்பு கூட்டிய விருப்பம்', bulkContract: 'B2B / மீண்டும் வரும் ஒப்பந்தம்', verify: 'குறிப்புக்கான டெமோ தரவு — முதலீட்டுக்கு முன் உள்ளூரில் சரிபார்க்கவும்', source: 'NIRNAY AI பல-வணிக டெமோ மாதிரி', promising: 'நம்பிக்கைக்குரியது — கட்டுப்படுத்தப்பட்ட சரிபார்ப்புடன் தொடரவும்', viable: 'உள்ளூர் சரிபார்ப்பு மற்றும் ஒழுங்கான செயல்பாட்டுடன் சாத்தியம்', recommendation: 'திறன், மூலதனம் மற்றும் மாவட்ட வாடிக்கையாளர் வழியை ஒன்றாக சரிபார்த்தால் நல்ல பொருத்தம் காட்டுகிறது. சிறிய கட்டண பைலட்டில் தொடங்கி, அருகிலுள்ள போட்டியாளர்களை ஒப்பிட்டு, விரிவாக்கத்திற்கு முன் பணிச்சுழற்சி மூலதனத்தை பாதுகாக்கவும்.', strengthSkill: 'தேர்ந்தெடுத்த திறனுடன் பொருந்துகிறது; குறுகிய சலுகையுடன் தொடங்கலாம்.', strengthMarket: 'சோதிக்க பல உள்ளூர் வாடிக்கையாளர் வழிகள் உள்ளன.', strengthCapital: 'மூலதனத்தை கட்டங்களாக முதலீடு செய்யலாம்.', weaknessValidation: 'உண்மையான வாடிக்கையாளர் ஆய்வால் தேவையை இன்னும் சரிபார்க்க வேண்டும்.', weaknessExecution: 'மீண்டும் வரும் தேவைக்கு தரமும் ஒரே மாதிரி சேவையும் அவசியம்.', weaknessCash: 'தொடக்க கட்டத்தில் பணிச்சுழற்சி மூலதன கட்டுப்பாடு தேவை.', opportunityLocal: 'உள்ளூர் வாங்குபவர் தொகுதிகள் நேரடி மற்றும் பரிந்துரை விற்பனையை ஆதரிக்கலாம்.', opportunityRepeat: 'மீண்டும் வரும் ஆர்டர்கள் பணப்புழக்கத்தை நிலைப்படுத்தலாம்.', opportunityDigital: 'WhatsApp, வரைபடம் மற்றும் உள்ளூர் டிஜிட்டல் தேடல் அணுகலை அதிகரிக்கலாம்.', threatCompetition: 'இருக்கும் போட்டியாளர்கள் குறைந்த விலையில் போட்டியிடலாம்.', threatDemand: 'தேவை பருவம், இடம் மற்றும் வாடிக்கையாளர் பிரிவுக்கு ஏற்ப மாறலாம்.', threatCost: 'உள்ளீடு, போக்குவரத்து அல்லது மின்சார செலவு லாபத்தை குறைக்கலாம்.', pilotTitle: 'முதலில் கட்டண பைலட் நடத்தவும்', pilotDesc: 'முழு பட்ஜெட்டை செலவிடும் முன் 10–20 உண்மையான வாடிக்கையாளர்களுடன் சிறிய விற்பனை மாதிரியை சோதிக்கவும்.', capitalTitle: 'பணிச்சுழற்சி மூலதனத்தை பாதுகாக்கவும்', capitalDesc: 'வழங்கல், போக்குவரத்து, பழுது மற்றும் தாமதமான கட்டணத்திற்கு பண கையிருப்பு வைத்திருக்கவும்.', marketTitle: 'உள்ளூர் வாடிக்கையாளர் வழியை சரிபார்க்கவும்', marketDesc: 'மாவட்டம், அருகிலுள்ள தொகுதிகள் மற்றும் போட்டியாளர்களை பயன்படுத்தி முதல் மீண்டும் வரும் வாடிக்கையாளர்கள் எங்கிருந்து வர வேண்டும் என்பதை தீர்மானிக்கவும்.'
  },
  te: {
    serving: 'కు స్థానిక వ్యాపార డెమో', buyers: 'సమీపంలోని సంభావ్య స్థానిక కొనుగోలుదారులు మరియు మళ్లీ వచ్చే కస్టమర్లు', localDemand: 'మధ్యస్థం నుంచి ఎక్కువ', demandSignal: 'సమీప కొనుగోలుదారులతో పునరావృత డిమాండ్‌ను ధృవీకరించండి:', marketGap: 'నమ్మదగిన, వ్యవస్థీకృత స్థానిక ఆఫర్‌కు అవకాశం:', competition: 'మధ్యస్థ పోటీ; ఉన్న ప్రొవైడర్లను మ్యాప్ చేసి స్థానికంగా తనిఖీ చేయండి:', recommendedRadius: '5 కిమీతో ప్రారంభించండి; పునరావృత డిమాండ్ నిరూపితమైన తర్వాత 10 కిమీ వరకు విస్తరించండి', marketCluster: 'స్థానిక మార్కెట్ క్లస్టర్', customerCluster: 'కస్టమర్ హబ్', competitors: 'ఉన్న పోటీదారులు', gapTitle: 'స్థానిక మార్కెట్ గ్యాప్', opportunityDescription: 'విస్తరించే ముందు ధర, డిమాండ్ తరచుదనం మరియు పునరావృత ఆర్డర్లను పరీక్షించండి.', customerDescription: 'నేరుగా సంప్రదింపు, రిఫరల్ మరియు చిన్న ట్రయల్ ఆఫర్లతో సమీప కొనుగోలుదారులను చేరుకోండి.', competitorDescription: 'పొజిషనింగ్ నిర్ణయించే ముందు ధర, నాణ్యత, సమయం మరియు నమ్మకాన్ని పోల్చండి.', gapDescription: 'నాణ్యత, సౌలభ్యం, అందుబాటు లేదా సేవలో కస్టమర్లు తక్కువ సేవ పొందుతున్నారా తనిఖీ చేయండి.', coreOffer: 'ప్రధాన ఆఫర్', starterPackage: 'స్టార్టర్ ప్యాకేజ్', valueAdded: 'విలువ జోడించిన ఎంపిక', bulkContract: 'B2B / పునరావృత ఒప్పందం', verify: 'సూచనాత్మక డెమో డేటా — పెట్టుబడికి ముందు స్థానికంగా ధృవీకరించండి', source: 'NIRNAY AI మల్టీ-బిజినెస్ డెమో మోడల్', promising: 'ఆశాజనకం — నియంత్రిత ధృవీకరణతో ముందుకు సాగండి', viable: 'స్థానిక ధృవీకరణ మరియు క్రమబద్ధమైన అమలుతో సాధ్యం', recommendation: 'నైపుణ్యం, మూలధనం మరియు జిల్లా కస్టమర్ మార్గాన్ని కలిసి ధృవీకరిస్తే మంచి ఫిట్ చూపిస్తుంది. చిన్న చెల్లింపు పైలట్‌తో ప్రారంభించి, సమీప పోటీదారులను పోల్చి, విస్తరణకు ముందు వర్కింగ్ క్యాపిటల్‌ను రక్షించండి.', strengthSkill: 'ఎంచుకున్న నైపుణ్యానికి సరిపోతుంది మరియు ఫోకస్ చేసిన ఆఫర్‌తో ప్రారంభించవచ్చు.', strengthMarket: 'పరీక్షించడానికి అనేక స్థానిక కస్టమర్ మార్గాలు ఉన్నాయి.', strengthCapital: 'మూలధనాన్ని దశలవారీగా పెట్టవచ్చు.', weaknessValidation: 'నిజమైన కస్టమర్ సర్వేతో డిమాండ్ ఇంకా ధృవీకరించాలి.', weaknessExecution: 'పునరావృత డిమాండ్‌కు నాణ్యత మరియు స్థిరత్వం అవసరం.', weaknessCash: 'లాంచ్ దశలో వర్కింగ్ క్యాపిటల్ నియంత్రణ అవసరం.', opportunityLocal: 'స్థానిక కొనుగోలుదారుల క్లస్టర్లు నేరుగా మరియు రిఫరల్ అమ్మకాలను ఇవ్వగలవు.', opportunityRepeat: 'పునరావృత ఆర్డర్లు క్యాష్ ఫ్లోను స్థిరం చేయగలవు.', opportunityDigital: 'WhatsApp, మ్యాప్స్ మరియు స్థానిక డిజిటల్ డిస్కవరీ చేరువను పెంచగలవు.', threatCompetition: 'ఉన్న పోటీదారులు తక్కువ ధరతో పోటీ చేయవచ్చు.', threatDemand: 'డిమాండ్ సీజన్, ప్రదేశం మరియు కస్టమర్ విభాగం ప్రకారం మారవచ్చు.', threatCost: 'ఇన్‌పుట్, రవాణా లేదా శక్తి ఖర్చులు మార్జిన్‌ను తగ్గించవచ్చు.', pilotTitle: 'ముందుగా చెల్లింపు పైలట్ చేయండి', pilotDesc: 'మొత్తం బడ్జెట్ ఖర్చు చేసే ముందు 10–20 నిజమైన కస్టమర్లతో చిన్న అమ్మదగిన మోడల్‌ను పరీక్షించండి.', capitalTitle: 'వర్కింగ్ క్యాపిటల్‌ను కాపాడండి', capitalDesc: 'సరఫరా, రవాణా, మరమ్మతులు మరియు ఆలస్య చెల్లింపులకు నగదు బఫర్ ఉంచండి.', marketTitle: 'స్థానిక కస్టమర్ మార్గాన్ని ధృవీకరించండి', marketDesc: 'జిల్లా, సమీప క్లస్టర్లు మరియు పోటీదారుల తనిఖీలతో మొదటి పునరావృత కస్టమర్లు ఎక్కడి నుంచి రావాలో నిర్ణయించండి.'
  },
  kn: {
    serving: 'ಗಾಗಿ ಸ್ಥಳೀಯ ವ್ಯವಹಾರ ಡೆಮೊ', buyers: 'ಹತ್ತಿರದ ಸಾಧ್ಯ ಸ್ಥಳೀಯ ಖರೀದಿದಾರರು ಮತ್ತು ಮರು ಖರೀದಿ ಗ್ರಾಹಕರು', localDemand: 'ಮಧ್ಯಮದಿಂದ ಹೆಚ್ಚು', demandSignal: 'ಹತ್ತಿರದ ಖರೀದಿದಾರರೊಂದಿಗೆ ಮರುಕಳಿಸುವ ಬೇಡಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ:', marketGap: 'ನಂಬಿಗಸ್ತ ಮತ್ತು ಸಂಘಟಿತ ಸ್ಥಳೀಯ ಆಫರ್‌ಗೆ ಸಾಧ್ಯ ಅವಕಾಶ:', competition: 'ಮಧ್ಯಮ ಸ್ಪರ್ಧೆ; ಇರುವ ಸೇವೆದಾರರನ್ನು ನಕ್ಷೆ ಮತ್ತು ಸ್ಥಳೀಯವಾಗಿ ಪರಿಶೀಲಿಸಿ:', recommendedRadius: '5 ಕಿಮೀದಿಂದ ಪ್ರಾರಂಭಿಸಿ; ಮರುಕಳಿಸುವ ಬೇಡಿಕೆ ಸಾಬೀತಾದ ನಂತರ 10 ಕಿಮೀವರೆಗೆ ವಿಸ್ತರಿಸಿ', marketCluster: 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಕ್ಲಸ್ಟರ್', customerCluster: 'ಗ್ರಾಹಕ ಕೇಂದ್ರ', competitors: 'ಇರುವ ಸ್ಪರ್ಧಿಗಳು', gapTitle: 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ಅಂತರ', opportunityDescription: 'ವಿಸ್ತರಣೆಯ ಮೊದಲು ಬೆಲೆ, ಬೇಡಿಕೆಯ ಆವರ್ತನೆ ಮತ್ತು ಮರು ಆರ್ಡರ್‌ಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.', customerDescription: 'ನೇರ ಸಂಪರ್ಕ, ರೆಫರಲ್ ಮತ್ತು ಸಣ್ಣ ಟ್ರಯಲ್ ಆಫರ್‌ಗಳಿಂದ ಹತ್ತಿರದ ಖರೀದಿದಾರರನ್ನು ತಲುಪಿ.', competitorDescription: 'ಪೊಸಿಷನಿಂಗ್ ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು ಬೆಲೆ, ಗುಣಮಟ್ಟ, ಸಮಯ ಮತ್ತು ನಂಬಿಕೆಯನ್ನು ಹೋಲಿಸಿ.', gapDescription: 'ಗುಣಮಟ್ಟ, ಸೌಲಭ್ಯ, ಲಭ್ಯತೆ ಅಥವಾ ಸೇವೆಯಲ್ಲಿ ಗ್ರಾಹಕರು ಕಡಿಮೆ ಸೇವೆ ಪಡೆಯುತ್ತಿದಾರೆಯೇ ಪರಿಶೀಲಿಸಿ.', coreOffer: 'ಮುಖ್ಯ ಆಫರ್', starterPackage: 'ಸ್ಟಾರ್ಟರ್ ಪ್ಯಾಕೇಜ್', valueAdded: 'ಮೌಲ್ಯವರ್ಧಿತ ಆಯ್ಕೆ', bulkContract: 'B2B / ಮರುಕಳಿಸುವ ಒಪ್ಪಂದ', verify: 'ಸೂಚಕ ಡೆಮೊ ಡೇಟಾ — ಹೂಡಿಕೆಗೆ ಮೊದಲು ಸ್ಥಳೀಯವಾಗಿ ಪರಿಶೀಲಿಸಿ', source: 'NIRNAY AI ಬಹು-ವ್ಯವಹಾರ ಡೆಮೊ ಮಾದರಿ', promising: 'ಆಶಾದಾಯಕ — ನಿಯಂತ್ರಿತ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ', viable: 'ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಮತ್ತು ಶಿಸ್ತಿನ ಅನುಷ್ಠಾನದೊಂದಿಗೆ ಸಾಧ್ಯ', recommendation: 'ಕೌಶಲ್ಯ, ಬಂಡವಾಳ ಮತ್ತು ಜಿಲ್ಲೆಯ ಗ್ರಾಹಕ ಮಾರ್ಗವನ್ನು ಒಟ್ಟಿಗೆ ಪರಿಶೀಲಿಸಿದಾಗ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ ತೋರಿಸುತ್ತದೆ. ಸಣ್ಣ ಪೇಡ್ ಪೈಲಟ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಿ, ಹತ್ತಿರದ ಸ್ಪರ್ಧಿಗಳನ್ನು ಹೋಲಿಸಿ ಮತ್ತು ವಿಸ್ತರಣೆಗೆ ಮೊದಲು ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಉಳಿಸಿ.', strengthSkill: 'ಆಯ್ದ ಕೌಶಲ್ಯಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ ಮತ್ತು ಕೇಂದ್ರೀಕೃತ ಆಫರ್‌ನಿಂದ ಪ್ರಾರಂಭಿಸಬಹುದು.', strengthMarket: 'ಪರೀಕ್ಷಿಸಲು ಹಲವು ಸ್ಥಳೀಯ ಗ್ರಾಹಕ ಮಾರ್ಗಗಳಿವೆ.', strengthCapital: 'ಬಂಡವಾಳವನ್ನು ಹಂತ ಹಂತವಾಗಿ ಹೂಡಬಹುದು.', weaknessValidation: 'ನಿಜವಾದ ಗ್ರಾಹಕ ಸಮೀಕ್ಷೆಯಿಂದ ಬೇಡಿಕೆ ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕು.', weaknessExecution: 'ಮರುಕಳಿಸುವ ಬೇಡಿಕೆಗೆ ಗುಣಮಟ್ಟ ಮತ್ತು ಸ್ಥಿರತೆ ಅಗತ್ಯ.', weaknessCash: 'ಲಾಂಚ್ ಹಂತದಲ್ಲಿ ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಶಿಸ್ತು ಅಗತ್ಯ.', opportunityLocal: 'ಸ್ಥಳೀಯ ಖರೀದಿದಾರ ಕ್ಲಸ್ಟರ್‌ಗಳು ನೇರ ಮತ್ತು ರೆಫರಲ್ ಮಾರಾಟಕ್ಕೆ ನೆರವಾಗಬಹುದು.', opportunityRepeat: 'ಮರು ಆರ್ಡರ್‌ಗಳು ಕ್ಯಾಶ್ ಫ್ಲೋ ಸ್ಥಿರಗೊಳಿಸಬಹುದು.', opportunityDigital: 'WhatsApp, ನಕ್ಷೆಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಡಿಜಿಟಲ್ ಡಿಸ್ಕವರಿ ವ್ಯಾಪ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಬಹುದು.', threatCompetition: 'ಇರುವ ಸ್ಪರ್ಧಿಗಳು ಕಡಿಮೆ ಬೆಲೆಯಲ್ಲಿ ಸ್ಪರ್ಧಿಸಬಹುದು.', threatDemand: 'ಬೇಡಿಕೆ ಋತು, ಸ್ಥಳ ಮತ್ತು ಗ್ರಾಹಕ ವಿಭಾಗದಂತೆ ಬದಲಾಗಬಹುದು.', threatCost: 'ಇನ್‌ಪುಟ್, ಸಾರಿಗೆ ಅಥವಾ ಶಕ್ತಿ ವೆಚ್ಚಗಳು ಮಾರ್ಜಿನ್ ಕಡಿಮೆ ಮಾಡಬಹುದು.', pilotTitle: 'ಮೊದಲು ಪೇಡ್ ಪೈಲಟ್ ನಡೆಸಿ', pilotDesc: 'ಪೂರ್ಣ ಬಜೆಟ್ ಹೂಡುವ ಮೊದಲು 10–20 ನಿಜವಾದ ಗ್ರಾಹಕರೊಂದಿಗೆ ಸಣ್ಣ ಮಾರಾಟಯೋಗ್ಯ ಮಾದರಿ ಪರೀಕ್ಷಿಸಿ.', capitalTitle: 'ವರ್ಕಿಂಗ್ ಕ್ಯಾಪಿಟಲ್ ಉಳಿಸಿ', capitalDesc: 'ಸರಬರಾಜು, ಸಾರಿಗೆ, ರಿಪೇರಿ ಮತ್ತು ತಡ ಪಾವತಿಗಳಿಗೆ ನಗದು ಬಫರ್ ಇಡಿ.', marketTitle: 'ಸ್ಥಳೀಯ ಗ್ರಾಹಕ ಮಾರ್ಗ ಪರಿಶೀಲಿಸಿ', marketDesc: 'ಜಿಲ್ಲೆ, ಹತ್ತಿರದ ಕ್ಲಸ್ಟರ್ ಮತ್ತು ಸ್ಪರ್ಧಿ ಪರಿಶೀಲನೆಗಳಿಂದ ಮೊದಲ ಮರುಕಳಿಸುವ ಗ್ರಾಹಕರು ಎಲ್ಲಿಂದ ಬರಬೇಕು ಎಂದು ನಿರ್ಧರಿಸಿ.'
  },
  gu: {
    serving: 'માટે સ્થાનિક બિઝનેસ ડેમો', buyers: 'આસપાસના સંભવિત સ્થાનિક ખરીદદારો અને ફરી ખરીદતા ગ્રાહકો', localDemand: 'મધ્યમથી ઊંચી', demandSignal: 'નજીકના ખરીદદારો સાથે પુનરાવર્તિત માંગ ચકાસો:', marketGap: 'વિશ્વસનીય અને ગોઠવાયેલ સ્થાનિક ઓફરની સંભવિત ખામી:', competition: 'મધ્યમ સ્પર્ધા; હાલના પ્રદાતાઓને નકશા અને સ્થાનિક રીતે ચકાસો:', recommendedRadius: '5 કિમીથી શરૂ કરો; પુનરાવર્તિત માંગ સાબિત થયા પછી 10 કિમી સુધી વધારો', marketCluster: 'સ્થાનિક બજાર ક્લસ્ટર', customerCluster: 'ગ્રાહક હબ', competitors: 'હાલના સ્પર્ધકો', gapTitle: 'સ્થાનિક બજાર ગેપ', opportunityDescription: 'વિસ્તાર પહેલાં ભાવ, માંગની આવર્તનતા અને ફરી ઓર્ડર ચકાસો.', customerDescription: 'સીધો સંપર્ક, રેફરલ અને નાના ટ્રાયલ ઓફરથી નજીકના ખરીદદારો સુધી પહોંચો.', competitorDescription: 'પોઝિશનિંગ પહેલાં ભાવ, ગુણવત્તા, સમય અને વિશ્વાસની તુલના કરો.', gapDescription: 'ગુણવત્તા, સુવિધા, ઉપલબ્ધતા અથવા સેવામાં ગ્રાહકોને ઓછી સેવા મળે છે કે નહીં તે ચકાસો.', coreOffer: 'મુખ્ય ઓફર', starterPackage: 'સ્ટાર્ટર પેકેજ', valueAdded: 'વેલ્યૂ-એડેડ વિકલ્પ', bulkContract: 'B2B / પુનરાવર્તિત કરાર', verify: 'સૂચક ડેમો ડેટા — રોકાણ પહેલાં સ્થાનિક રીતે ચકાસો', source: 'NIRNAY AI મલ્ટી-બિઝનેસ ડેમો મોડેલ', promising: 'આશાસ્પદ — નિયંત્રિત ચકાસણી સાથે આગળ વધો', viable: 'સ્થાનિક ચકાસણી અને શિસ્તબદ્ધ અમલ સાથે શક્ય', recommendation: 'કુશળતા, મૂડી અને જિલ્લા ગ્રાહક માર્ગ સાથે ચકાસવામાં આવે ત્યારે સારો ફિટ બતાવે છે. નાના પેઇડ પાઇલટથી શરૂ કરો, નજીકના સ્પર્ધકોની તુલના કરો અને વિસ્તરણ પહેલાં વર્કિંગ કેપિટલ બચાવો.', strengthSkill: 'પસંદ કરેલી કુશળતા સાથે મેળ ખાય છે અને કેન્દ્રિત ઓફરથી શરૂ કરી શકાય છે.', strengthMarket: 'ચકાસવા માટે અનેક સ્થાનિક ગ્રાહક માર્ગ આપે છે.', strengthCapital: 'મૂડી તબક્કાવાર લગાવી શકાય છે.', weaknessValidation: 'વાસ્તવિક ગ્રાહક સર્વે દ્વારા માંગ ચકાસવી બાકી છે.', weaknessExecution: 'ફરી માંગ માટે ગુણવત્તા અને સ્થિરતા જરૂરી છે.', weaknessCash: 'લૉન્ચ તબક્કામાં વર્કિંગ કેપિટલ શિસ્ત જરૂરી છે.', opportunityLocal: 'સ્થાનિક ખરીદદાર ક્લસ્ટર સીધી અને રેફરલ વેચાણ આપી શકે છે.', opportunityRepeat: 'પુનરાવર્તિત ઓર્ડર કેશ ફ્લો સ્થિર કરી શકે છે.', opportunityDigital: 'WhatsApp, નકશા અને સ્થાનિક ડિજિટલ શોધ પહોંચ વધારી શકે છે.', threatCompetition: 'હાલના સ્પર્ધકો ઓછા ભાવથી સ્પર્ધા કરી શકે છે.', threatDemand: 'માગ સીઝન, વિસ્તાર અને ગ્રાહક વર્ગ પ્રમાણે બદલાઈ શકે છે.', threatCost: 'ઇનપુટ, પરિવહન અથવા ઊર્જા ખર્ચ માર્જિન ઘટાડે છે.', pilotTitle: 'પહેલા પેઇડ પાઇલટ ચલાવો', pilotDesc: 'પૂર્ણ બજેટ લગાવતાં પહેલાં 10–20 વાસ્તવિક ગ્રાહકો સાથે નાનું વેચી શકાય એવું મોડેલ ચકાસો.', capitalTitle: 'વર્કિંગ કેપિટલ બચાવો', capitalDesc: 'સપ્લાય, પરિવહન, રિપેર અને મોડા પેમેન્ટ માટે રોકડ બફર રાખો.', marketTitle: 'સ્થાનિક ગ્રાહક માર્ગ ચકાસો', marketDesc: 'જિલ્લો, નજીકના ક્લસ્ટર અને સ્પર્ધકોની તપાસથી પ્રથમ પુનરાવર્તિત ગ્રાહકો ક્યાંથી આવશે તે નક્કી કરો.'
  },
  pa: {
    serving: 'ਲਈ ਸਥਾਨਕ ਕਾਰੋਬਾਰ ਡੈਮੋ', buyers: 'ਨੇੜਲੇ ਸੰਭਾਵੀ ਸਥਾਨਕ ਖਰੀਦਦਾਰ ਅਤੇ ਦੁਬਾਰਾ ਖਰੀਦਣ ਵਾਲੇ ਗਾਹਕ', localDemand: 'ਦਰਮਿਆਨੀ ਤੋਂ ਉੱਚੀ', demandSignal: 'ਨੇੜਲੇ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਮੁੜ ਆਉਣ ਵਾਲੀ ਮੰਗ ਦੀ ਜਾਂਚ ਕਰੋ:', marketGap: 'ਭਰੋਸੇਯੋਗ ਅਤੇ ਸੰਗਠਿਤ ਸਥਾਨਕ ਪੇਸ਼ਕਸ਼ ਦੀ ਸੰਭਾਵੀ ਘਾਟ:', competition: 'ਦਰਮਿਆਨੀ ਮੁਕਾਬਲਾ; ਮੌਜੂਦਾ ਪ੍ਰਦਾਤਾਵਾਂ ਨੂੰ ਨਕਸ਼ੇ ਅਤੇ ਮੈਦਾਨ ਵਿੱਚ ਜਾਂਚੋ:', recommendedRadius: '5 ਕਿਮੀ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ; ਮੁੜ ਮੰਗ ਸਾਬਤ ਹੋਣ ਉੱਤੇ 10 ਕਿਮੀ ਤੱਕ ਵਧਾਓ', marketCluster: 'ਸਥਾਨਕ ਬਾਜ਼ਾਰ ਕਲੱਸਟਰ', customerCluster: 'ਗਾਹਕ ਕੇਂਦਰ', competitors: 'ਮੌਜੂਦਾ ਮੁਕਾਬਲੇਬਾਜ਼', gapTitle: 'ਸਥਾਨਕ ਬਾਜ਼ਾਰ ਘਾਟ', opportunityDescription: 'ਵਿਸਥਾਰ ਤੋਂ ਪਹਿਲਾਂ ਕੀਮਤ, ਮੰਗ ਦੀ ਆਵਰਤੀ ਅਤੇ ਦੁਬਾਰਾ ਆਰਡਰ ਦੀ ਜਾਂਚ ਕਰੋ।', customerDescription: 'ਸਿੱਧਾ ਸੰਪਰਕ, ਰੈਫਰਲ ਅਤੇ ਛੋਟੇ ਟ੍ਰਾਇਲ ਆਫਰ ਨਾਲ ਨੇੜਲੇ ਖਰੀਦਦਾਰਾਂ ਤੱਕ ਪਹੁੰਚੋ।', competitorDescription: 'ਪੋਜ਼ੀਸ਼ਨਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਕੀਮਤ, ਗੁਣਵੱਤਾ, ਸਮਾਂ ਅਤੇ ਭਰੋਸੇ ਦੀ ਤੁਲਨਾ ਕਰੋ।', gapDescription: 'ਜਾਂਚੋ ਕਿ ਗਾਹਕ ਗੁਣਵੱਤਾ, ਸੁਵਿਧਾ, ਉਪਲਬਧਤਾ ਜਾਂ ਸੇਵਾ ਵਿੱਚ ਘੱਟ ਸੇਵਾ ਲੈ ਰਹੇ ਹਨ ਜਾਂ ਨਹੀਂ।', coreOffer: 'ਮੁੱਖ ਪੇਸ਼ਕਸ਼', starterPackage: 'ਸ਼ੁਰੂਆਤੀ ਪੈਕੇਜ', valueAdded: 'ਵੈਲਿਊ-ਐਡਡ ਵਿਕਲਪ', bulkContract: 'B2B / ਮੁੜ ਆਉਣ ਵਾਲਾ ਕਰਾਰ', verify: 'ਸੰਕੇਤਕ ਡੈਮੋ ਡਾਟਾ — ਨਿਵੇਸ਼ ਤੋਂ ਪਹਿਲਾਂ ਸਥਾਨਕ ਜਾਂਚ ਕਰੋ', source: 'NIRNAY AI ਮਲਟੀ-ਬਿਜ਼ਨਸ ਡੈਮੋ ਮਾਡਲ', promising: 'ਆਸ਼ਾਵਾਦੀ — ਨਿਯੰਤਰਿਤ ਜਾਂਚ ਨਾਲ ਅੱਗੇ ਵਧੋ', viable: 'ਸਥਾਨਕ ਜਾਂਚ ਅਤੇ ਅਨੁਸ਼ਾਸਿਤ ਕਾਰਵਾਈ ਨਾਲ ਯੋਗ', recommendation: 'ਹੁਨਰ, ਪੂੰਜੀ ਅਤੇ ਜ਼ਿਲ੍ਹਾ ਗਾਹਕ ਰਸਤੇ ਨੂੰ ਇਕੱਠੇ ਜਾਂਚਣ ਉੱਤੇ ਚੰਗਾ ਫਿਟ ਦਿਖਾਉਂਦਾ ਹੈ। ਛੋਟੇ ਭੁਗਤਾਨ ਵਾਲੇ ਪਾਇਲਟ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ, ਨੇੜਲੇ ਮੁਕਾਬਲੇਬਾਜ਼ਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ ਅਤੇ ਵਿਸਥਾਰ ਤੋਂ ਪਹਿਲਾਂ ਵਰਕਿੰਗ ਕੈਪਿਟਲ ਬਚਾਓ।', strengthSkill: 'ਚੁਣੇ ਹੁਨਰ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ ਅਤੇ ਕੇਂਦਰਿਤ ਪੇਸ਼ਕਸ਼ ਨਾਲ ਸ਼ੁਰੂ ਹੋ ਸਕਦਾ ਹੈ।', strengthMarket: 'ਜਾਂਚ ਲਈ ਕਈ ਸਥਾਨਕ ਗਾਹਕ ਰਸਤੇ ਦਿੰਦਾ ਹੈ।', strengthCapital: 'ਪੂੰਜੀ ਨੂੰ ਪੜਾਅਵਾਰ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।', weaknessValidation: 'ਅਸਲੀ ਗਾਹਕ ਸਰਵੇ ਨਾਲ ਮੰਗ ਦੀ ਜਾਂਚ ਬਾਕੀ ਹੈ।', weaknessExecution: 'ਮੁੜ ਮੰਗ ਲਈ ਗੁਣਵੱਤਾ ਅਤੇ ਲਗਾਤਾਰ ਸੇਵਾ ਜ਼ਰੂਰੀ ਹੈ।', weaknessCash: 'ਲਾਂਚ ਪੜਾਅ ਵਿੱਚ ਵਰਕਿੰਗ ਕੈਪਿਟਲ ਅਨੁਸ਼ਾਸਨ ਜ਼ਰੂਰੀ ਹੈ।', opportunityLocal: 'ਸਥਾਨਕ ਖਰੀਦਦਾਰ ਕਲੱਸਟਰ ਸਿੱਧੀ ਅਤੇ ਰੈਫਰਲ ਵਿਕਰੀ ਦੇ ਸਕਦੇ ਹਨ।', opportunityRepeat: 'ਮੁੜ ਆਰਡਰ ਕੈਸ਼ ਫਲੋ ਸਥਿਰ ਕਰ ਸਕਦੇ ਹਨ।', opportunityDigital: 'WhatsApp, ਨਕਸ਼ੇ ਅਤੇ ਸਥਾਨਕ ਡਿਜ਼ਿਟਲ ਖੋਜ ਪਹੁੰਚ ਵਧਾ ਸਕਦੇ ਹਨ।', threatCompetition: 'ਮੌਜੂਦਾ ਮੁਕਾਬਲੇਬਾਜ਼ ਘੱਟ ਕੀਮਤ ਨਾਲ ਮੁਕਾਬਲਾ ਕਰ ਸਕਦੇ ਹਨ।', threatDemand: 'ਮੰਗ ਮੌਸਮ, ਥਾਂ ਅਤੇ ਗਾਹਕ ਵਰਗ ਅਨੁਸਾਰ ਬਦਲ ਸਕਦੀ ਹੈ।', threatCost: 'ਇਨਪੁਟ, ਆਵਾਜਾਈ ਜਾਂ ਊਰਜਾ ਲਾਗਤ ਮਾਰਜਿਨ ਘਟਾ ਸਕਦੀ ਹੈ।', pilotTitle: 'ਪਹਿਲਾਂ ਭੁਗਤਾਨ ਵਾਲਾ ਪਾਇਲਟ ਚਲਾਓ', pilotDesc: 'ਪੂਰਾ ਬਜਟ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ 10–20 ਅਸਲੀ ਗਾਹਕਾਂ ਨਾਲ ਛੋਟਾ ਵੇਚਣਯੋਗ ਮਾਡਲ ਜਾਂਚੋ।', capitalTitle: 'ਵਰਕਿੰਗ ਕੈਪਿਟਲ ਬਚਾਓ', capitalDesc: 'ਸਪਲਾਈ, ਆਵਾਜਾਈ, ਮੁਰੰਮਤ ਅਤੇ ਦੇਰੀ ਨਾਲ ਭੁਗਤਾਨ ਲਈ ਨਕਦ ਬਫਰ ਰੱਖੋ।', marketTitle: 'ਸਥਾਨਕ ਗਾਹਕ ਰਸਤਾ ਜਾਂਚੋ', marketDesc: 'ਜ਼ਿਲ੍ਹਾ, ਨੇੜਲੇ ਕਲੱਸਟਰ ਅਤੇ ਮੁਕਾਬਲੇਬਾਜ਼ ਜਾਂਚ ਨਾਲ ਪਹਿਲੇ ਮੁੜ ਆਉਣ ਵਾਲੇ ਗਾਹਕਾਂ ਦਾ ਸਰੋਤ ਤੈਅ ਕਰੋ।'
  },
};

export function getDemoCity(id: DemoCityId): DemoCity {
  return DEMO_CITIES.find((city) => city.id === id) || DEMO_CITIES[0];
}

export function getDemoBusiness(id: DemoBusinessId): DemoBusiness {
  return DEMO_BUSINESSES.find((business) => business.id === id) || DEMO_BUSINESSES[0];
}

export function getDemoBusinessLabel(id: DemoBusinessId, language: LanguageCode = 'en'): string {
  return getDemoBusiness(id).labels[language] || getDemoBusiness(id).labels.en;
}

export function buildDemoAssessment(
  cityId: DemoCityId,
  businessId: DemoBusinessId = DEFAULT_DEMO_BUSINESS,
  preferredLanguage: AssessmentFormData['preferredLanguage'] = 'en'
): AssessmentFormData {
  const city = getDemoCity(cityId);
  const business = getDemoBusiness(businessId);
  const label = getDemoBusinessLabel(businessId, preferredLanguage);
  const copy = DEMO_TEXT[preferredLanguage];

  return {
    location: {
      village: city.village,
      block: city.block,
      district: city.district,
      state: city.state,
      latitude: city.latitude,
      longitude: city.longitude,
    },
    marginCapital: business.marginCapital,
    availableMargin: business.marginCapital,
    category: business.category,
    ideaText: `${label} — ${city.district} ${copy.serving}`,
    businessIdea: label,
    targetMarket: `${copy.buyers}: ${city.district}`,
    priorExperience: business.priorExperience,
    riskWillingness: business.riskWillingness,
    selectedExpertise: business.skill,
    availableLandAcres: business.availableLandAcres,
    preferredLanguage,
  };
}

export function buildDemoOpportunity(
  cityId: DemoCityId,
  businessId: DemoBusinessId = DEFAULT_DEMO_BUSINESS,
  language: LanguageCode = 'en'
): LocalOpportunityData {
  const city = getDemoCity(cityId);
  const label = getDemoBusinessLabel(businessId, language);
  const copy = DEMO_TEXT[language];
  const markers: MapMarkerItem[] = [
    { id: 'opp-1', type: 'opportunity', title: `${label} · ${copy.marketCluster}`, distanceKm: 3.5, x: 68, y: 35, description: copy.opportunityDescription, impact: 'High' },
    { id: 'cust-1', type: 'customer', title: `${city.village} · ${copy.customerCluster}`, distanceKm: 1.8, x: 25, y: 65, description: copy.customerDescription, impact: 'High' },
    { id: 'comp-1', type: 'competitor', title: `${label} · ${copy.competitors}`, distanceKm: 2.4, x: 30, y: 28, description: copy.competitorDescription, impact: 'Medium' },
    { id: 'gap-1', type: 'gap', title: `${label} · ${copy.gapTitle}`, distanceKm: 4.4, x: 55, y: 78, description: copy.gapDescription, impact: 'High' },
  ];

  return {
    locationSummary: `${city.village}, ${city.block}, ${city.district} (${city.state})`,
    radiusKm: 10,
    localDemand: copy.localDemand,
    demandSignal: `${copy.demandSignal} ${label} · ${city.district}`,
    marketGap: `${copy.marketGap} ${label} · ${city.district}`,
    competition: `${copy.competition} ${label}`,
    competitorDensity: copy.verify,
    recommendedRadius: copy.recommendedRadius,
    suggestedProductMix: [
      `${label} · ${copy.coreOffer}`,
      `${label} · ${copy.starterPackage}`,
      `${label} · ${copy.valueAdded}`,
      `${label} · ${copy.bulkContract}`,
    ],
    customerSegments: [
      `${copy.buyers}: ${city.village}`,
      `${copy.buyers}: ${city.district}`,
      `${label} · B2B / repeat buyers`,
    ],
    dataConfidence: 'Medium',
    sources: [copy.source, copy.verify],
    markers,
    evidenceBadge: 'INDICATIVE',
  };
}

export function buildDemoFeasibility(
  cityId: DemoCityId,
  businessId: DemoBusinessId = DEFAULT_DEMO_BUSINESS,
  language: LanguageCode = 'en'
): FeasibilityScoreData {
  const city = getDemoCity(cityId);
  const business = getDemoBusiness(businessId);
  const marketBonus = business.preferredMarkets.includes(city.marketType) ? 4 : -1;
  const overall = Math.max(66, Math.min(92, business.baseScore + marketBonus + CITY_SCORE_DELTA[cityId]));
  const copy = DEMO_TEXT[language];

  return {
    overallScore: overall,
    statusLabel: overall >= 82 ? copy.promising : copy.viable,
    marketPotential: Math.min(94, overall + (marketBonus > 0 ? 4 : 0)),
    capitalFit: Math.max(65, Math.min(92, overall - (business.marginCapital > 80000 ? 3 : 0) + (business.marginCapital <= 40000 ? 3 : 0))),
    competitionScore: Math.max(62, Math.min(90, overall - 7 + CITY_SCORE_DELTA[cityId])),
    operationalFeasibility: Math.max(66, Math.min(93, overall + (business.priorExperience === 'Experienced' ? 4 : 1))),
    growthPotential: Math.max(68, Math.min(95, overall + (city.marketType === 'metro' || city.marketType === 'industrial' ? 3 : 1))),
  };
}

export function buildDemoSwot(
  cityId: DemoCityId,
  businessId: DemoBusinessId = DEFAULT_DEMO_BUSINESS,
  language: LanguageCode = 'en'
): SWOTData {
  const city = getDemoCity(cityId);
  const label = getDemoBusinessLabel(businessId, language);
  const copy = DEMO_TEXT[language];

  return {
    strengths: [
      `${label}: ${copy.strengthSkill}`,
      `${city.district}: ${copy.strengthMarket}`,
      copy.strengthCapital,
    ],
    weaknesses: [copy.weaknessValidation, copy.weaknessExecution, copy.weaknessCash],
    opportunities: [copy.opportunityLocal, copy.opportunityRepeat, copy.opportunityDigital],
    threats: [copy.threatCompetition, copy.threatDemand, copy.threatCost],
  };
}

export function buildDemoInsights(
  cityId: DemoCityId,
  businessId: DemoBusinessId = DEFAULT_DEMO_BUSINESS,
  language: LanguageCode = 'en'
) {
  const city = getDemoCity(cityId);
  const label = getDemoBusinessLabel(businessId, language);
  const copy = DEMO_TEXT[language];

  return [
    { title: copy.pilotTitle, description: `${label} · ${copy.pilotDesc}`, tag: 'Pilot' },
    { title: copy.capitalTitle, description: `${label} · ${copy.capitalDesc}`, tag: 'Capital' },
    { title: copy.marketTitle, description: `${city.district} · ${copy.marketDesc}`, tag: 'Local Market' },
  ];
}

export function buildDemoRecommendation(
  cityId: DemoCityId,
  businessId: DemoBusinessId = DEFAULT_DEMO_BUSINESS,
  language: LanguageCode = 'en'
): string {
  const city = getDemoCity(cityId);
  const label = getDemoBusinessLabel(businessId, language);
  return `${label} · ${city.district}: ${DEMO_TEXT[language].recommendation}`;
}
