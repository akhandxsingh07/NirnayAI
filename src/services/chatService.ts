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

type Intent = 'about' | 'finance' | 'scheme' | 'plan' | 'customers' | 'map' | 'business' | 'compliance' | 'general';

type LocalKnowledge = {
  about: string;
  finance: (c: ChatContext) => string;
  scheme: (c: ChatContext) => string;
  plan: (c: ChatContext) => string;
  customers: (c: ChatContext) => string;
  map: (c: ChatContext) => string;
  business: (c: ChatContext) => string;
  compliance: (c: ChatContext) => string;
  general: (c: ChatContext) => string;
  followUps: string[];
  fallbackNote: string;
  authNote: string;
  keyNote: string;
};

const money = (value?: number) => `₹${Math.max(0, value || 0).toLocaleString('en-IN')}`;
const businessName = (c: ChatContext) => c.businessIdea || c.category || 'your business';
const districtName = (c: ChatContext) => c.district || 'your district';

const LOCAL_KB: Record<LanguageCode, LocalKnowledge> = {
  en: {
    about: `NIRNAY AI is an AI-driven hyper-local business advisory and financial structuring assistant for rural and semi-urban micro-entrepreneurs in India.\n\nWhat it does:\n• Business fit: uses skill, experience, capital, land, risk preference and district to rank suitable business ideas.\n• Hyper-local analysis: compares the selected district, likely customer channels, nearby market opportunities and live OpenStreetMap-based business/POI signals where available.\n• Financial structuring: estimates project cost, entrepreneur margin, loan requirement, EMI-style repayment planning and working-capital allocation.\n• Scheme guidance: identifies likely-fit Central and State schemes to verify, without promising approval or subsidy.\n• AI advisory: answers follow-up questions about customers, pricing, operations, licences, risks and 30/60/90-day execution.\n• Multilingual voice: supports English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati and Punjabi for text, voice input and spoken AI replies.\n• Secure accounts: citizen/admin access and assessment data are handled through Supabase with row-level security.\n\nNIRNAY AI is decision support, not a bank sanction system or guaranteed-profit predictor. Local market facts, scheme eligibility and official financial terms should be verified before investment.`,
    finance: (c) => `For ${businessName(c)} in ${districtName(c)}, your current margin is ${money(c.margin)}${c.projectCost ? ` and estimated project cost is ${money(c.projectCost)}` : ''}${c.loan ? ` with about ${money(c.loan)} financing requirement` : ''}. Do not put the full amount into equipment. A practical first split is: 45–55% equipment/setup, 20–25% working capital, 10–15% customer acquisition/transport, and 10–15% safety reserve. Adjust this by business type: service businesses need less machinery; dairy/food/manufacturing usually need more operating buffer. Verify the final loan rate, tenure, moratorium and charges with the lender before committing.`,
    scheme: (c) => `For ${businessName(c)} in ${districtName(c)}, schemes should be shortlisted from your activity, project size, entrepreneur profile and district. Likely categories to verify can include MUDRA, PMEGP, PMFME for eligible food-processing units, PM Vishwakarma for notified artisan trades, CGTMSE-backed credit through lenders, and relevant Uttar Pradesh MSME/self-employment schemes. ${c.scheme ? `Your current internal recommendation is ${c.scheme}, but ` : ''}eligibility, subsidy, margin-money support, age/category rules and current availability must be checked on the official portal or implementing bank/agency.`,
    plan: (c) => `90-day launch plan for ${businessName(c)} in ${districtName(c)}:\n1–15 days: validate 15–20 potential customers, map competitors, confirm licences and collect 3 supplier quotations.\n16–30 days: run a small paid pilot, test pricing and keep at least one month of working capital untouched.\n31–60 days: repeat only the best-selling offer, track daily cash flow and build 2–3 reliable supplier/customer channels.\n61–90 days: expand capacity only if repeat demand is visible; then finalize larger equipment or loan decisions.\nYour ${c.skill || 'selected'} skill and ${c.experience || 'current'} experience level should decide how quickly you scale.`,
    customers: (c) => `For ${businessName(c)} in ${districtName(c)}, do not start with broad advertising. First define 2–3 customer groups${c.targetMarket ? ` around ${c.targetMarket}` : ''}. Build a list of 20 prospects, personally contact them, offer a small trial/intro package, and ask what price, delivery time and quality they currently accept. Use WhatsApp Business, local referrals, nearby shops/institutions and repeat-customer offers before spending heavily on ads. Your first target is not “many leads”; it is 5 paying customers and then 3 repeat customers.`,
    map: (c) => `NIRNAY AI's live map module uses OpenStreetMap/Nominatim/Overpass data to inspect mapped competitors, customer hubs and commercial/opportunity points around ${districtName(c)}. You can analyze roughly 5–10 km around the selected area or use browser location permission for a more precise center. It also estimates nearest mapped competitor and qualitative competitor density. This is live map data, not real-time sales or footfall data, and rural map listings can be incomplete, so important locations must still be verified locally.`,
    business: (c) => `A suitable business for you should match four things together: your ${c.skill || 'actual skill'}, ${money(c.margin)} available margin, ${c.landAcres ?? 'available'} acres of land, and the customer route in ${districtName(c)}. Instead of choosing a fashionable idea, prefer a business where you can personally execute the core work and reach customers cheaply. NIRNAY AI ranks options using skill fit first, then capital/land fit, risk, experience and district suitability.`,
    compliance: (c) => `Compliance depends on the activity. For ${businessName(c)}, first verify Udyam registration applicability, local shop/trade permissions, bank KYC and business account requirements. Food businesses may need FSSAI; GST depends on the business and applicable registration rules; manufacturing/processing can require additional local pollution, power, fire or municipal permissions. Do not buy major machinery until the required approvals for your exact activity and location are confirmed.`,
    general: (c) => `For ${businessName(c)} in ${districtName(c)}, the best next step depends on what you want to decide: business selection, customers, capital, scheme, map, licence or a launch plan. Your current profile shows ${c.skill || 'no specific skill selected'} skill, ${c.experience || 'unspecified'} experience and ${money(c.margin)} available margin. Ask one specific decision question and I will answer against this profile instead of repeating a generic recommendation.`,
    followUps: ['Explain NIRNAY AI completely', 'Give me a 90-day action plan', 'How should I split my capital?', 'Analyze my local market'],
    fallbackNote: 'This answer was generated by the multilingual local knowledge engine because the live AI response was unavailable.',
    authNote: 'Live AI needs an active citizen session; this answer was generated locally.',
    keyNote: 'Gemini is not configured on the server right now; this answer was generated by the smart local knowledge engine.',
  },
  hi: {
    about: `NIRNAY AI भारत के ग्रामीण और सेमी-अर्बन माइक्रो-उद्यमियों के लिए AI आधारित हाइपर-लोकल बिज़नेस सलाह और वित्तीय संरचना सहायक है।\n\nयह क्या करता है:\n• बिज़नेस फिट: कौशल, अनुभव, पूंजी, जमीन, जोखिम और जिले के आधार पर उपयुक्त व्यवसाय रैंक करता है।\n• हाइपर-लोकल विश्लेषण: जिले के ग्राहक चैनल, बाजार अवसर और उपलब्ध होने पर OpenStreetMap के लाइव मैप संकेत देखता है।\n• वित्तीय संरचना: प्रोजेक्ट लागत, आपकी मार्जिन पूंजी, संभावित ऋण जरूरत, EMI जैसी repayment planning और working capital allocation समझाता है।\n• योजना मार्गदर्शन: Central और State schemes में likely-fit विकल्प बताता है, लेकिन approval/subsidy की guarantee नहीं देता।\n• AI सलाह: ग्राहक, pricing, operations, licence, risk और 30/60/90 दिन की कार्ययोजना पर follow-up जवाब देता है।\n• बहुभाषी voice assistant: English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati और Punjabi में text, voice input और AI की spoken reply देता है।\n• सुरक्षित accounts: citizen/admin access और assessment data Supabase तथा row-level security से संभाला जाता है।\n\nNIRNAY AI decision-support system है; यह bank sanction या guaranteed profit system नहीं है। निवेश से पहले स्थानीय बाजार, योजना पात्रता और official financial terms सत्यापित करना जरूरी है।`,
    finance: (c) => `${districtName(c)} में ${businessName(c)} के लिए आपकी उपलब्ध मार्जिन पूंजी ${money(c.margin)} है${c.projectCost ? ` और अनुमानित project cost ${money(c.projectCost)} है` : ''}${c.loan ? `, जिसमें लगभग ${money(c.loan)} financing की जरूरत है` : ''}। पूरी रकम मशीनरी में न लगाएं। शुरुआती split: 45–55% setup/equipment, 20–25% working capital, 10–15% ग्राहक/transport और 10–15% safety reserve। Service business में machinery कम और dairy/food/manufacturing में operating buffer ज्यादा रखें। Final interest rate, tenure, moratorium और bank charges lender से verify करें।`,
    scheme: (c) => `${districtName(c)} में ${businessName(c)} के लिए scheme चयन business activity, project size, entrepreneur profile और district पर निर्भर करेगा। MUDRA, PMEGP, eligible food units के लिए PMFME, notified artisan trades के लिए PM Vishwakarma, lender के माध्यम से CGTMSE और संबंधित Uttar Pradesh MSME/self-employment schemes verify की जा सकती हैं। ${c.scheme ? `अभी internal recommendation ${c.scheme} है, लेकिन ` : ''}final eligibility, subsidy, margin money, age/category rules और current availability official portal/bank से जांचें।`,
    plan: (c) => `${districtName(c)} में ${businessName(c)} के लिए 90-दिन की योजना:\nदिन 1–15: 15–20 संभावित ग्राहकों से बात करें, competitors देखें, licences check करें और 3 supplier quotations लें।\nदिन 16–30: छोटा paid pilot चलाएं, pricing test करें और कम-से-कम 1 महीने का working capital न छुएं।\nदिन 31–60: best-selling offer पर focus करें, daily cash flow लिखें और 2–3 reliable supplier/customer channels बनाएं।\nदिन 61–90: repeat demand दिखे तभी capacity और बड़े equipment/loan पर जाएं। आपकी ${c.skill || 'चुनी हुई'} skill और ${c.experience || 'मौजूदा'} experience के अनुसार scaling speed रखें।`,
    customers: (c) => `${districtName(c)} में ${businessName(c)} के लिए शुरुआत broad advertising से मत करें। पहले 2–3 customer groups तय करें${c.targetMarket ? `, खासकर ${c.targetMarket}` : ''}। 20 prospects की list बनाएं, personally contact करें, छोटा trial दें और price/delivery/quality feedback लें। WhatsApp Business, local referrals, nearby shops/institutions और repeat-customer offers इस्तेमाल करें। पहला लक्ष्य 5 paying customers और फिर 3 repeat customers होना चाहिए।`,
    map: (c) => `NIRNAY AI का live map OpenStreetMap/Nominatim/Overpass से ${districtName(c)} के आसपास mapped competitors, customer hubs और commercial/opportunity points खोजता है। लगभग 5–10 km radius या browser location के आधार पर analysis हो सकता है। Nearest mapped competitor और qualitative competitor density भी दिखाई जाती है। यह live map data है, real-time sales/footfall data नहीं; rural areas में listings incomplete हो सकती हैं, इसलिए important places locally verify करें।`,
    business: (c) => `आपके लिए सही business वही है जो आपकी ${c.skill || 'असल skill'}, ${money(c.margin)} पूंजी, ${c.landAcres ?? 'उपलब्ध'} acres जमीन और ${districtName(c)} के customer route से match करे। NIRNAY AI skill fit को सबसे ज्यादा weight देकर capital/land fit, risk, experience और district suitability के साथ ideas rank करता है। Trend देखकर business चुनने के बजाय वही option लें जिसका core work आप खुद कर सकते हैं।`,
    compliance: (c) => `${businessName(c)} के लिए पहले Udyam applicability, local trade/shop permission, bank KYC और business account requirements check करें। Food business में FSSAI की जरूरत हो सकती है; GST applicability business/turnover rules पर निर्भर करती है; manufacturing/processing में local pollution, power, fire या municipal permissions भी लग सकती हैं। Exact approvals verify किए बिना बड़ी machinery न खरीदें।`,
    general: (c) => `${districtName(c)} में ${businessName(c)} के बारे में बेहतर जवाब देने के लिए एक specific decision पूछें—business selection, customer, capital, scheme, map, licence या launch plan। आपके profile में ${c.skill || 'कोई specific skill नहीं'}, ${c.experience || 'unspecified'} experience और ${money(c.margin)} margin है। अब मैं question के हिसाब से अलग जवाब दूंगा, generic recommendation repeat नहीं करूंगा।`,
    followUps: ['NIRNAY AI को पूरा समझाइए', '90 दिन की कार्ययोजना बनाइए', 'मेरी पूंजी कैसे बांटूं?', 'मेरा local market analyze करें'],
    fallbackNote: 'Live AI उत्तर उपलब्ध नहीं था, इसलिए यह जवाब multilingual local knowledge engine ने बनाया है।',
    authNote: 'Live AI के लिए active citizen session चाहिए; यह जवाब local engine से बनाया गया है।',
    keyNote: 'Server पर Gemini अभी configured नहीं है; यह जवाब smart local knowledge engine ने बनाया है।',
  },
  bn: {
    about: `NIRNAY AI ভারতের গ্রামীণ ও আধা-শহুরে ক্ষুদ্র উদ্যোক্তাদের জন্য AI-ভিত্তিক হাইপার-লোকাল ব্যবসা পরামর্শ ও আর্থিক কাঠামো সহায়ক। এটি দক্ষতা, অভিজ্ঞতা, মূলধন, জমি, ঝুঁকি ও জেলা দেখে ব্যবসা র‍্যাঙ্ক করে; স্থানীয় বাজার ও লাইভ OpenStreetMap সংকেত বিশ্লেষণ করে; প্রকল্প ব্যয়, ঋণ, working capital ও repayment planning বুঝতে সাহায্য করে; সম্ভাব্য সরকারি স্কিম যাচাই করতে বলে; এবং 30/60/90 দিনের action plan দেয়। English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati ও Punjabi-তে text, voice input এবং spoken AI reply সমর্থিত। এটি decision-support system—ব্যাংক অনুমোদন, ভর্তুকি বা লাভের গ্যারান্টি নয়।`,
    finance: (c) => `${districtName(c)}-এ ${businessName(c)}-এর জন্য আপনার margin ${money(c.margin)}। পুরো টাকা equipment-এ দেবেন না। শুরুতে প্রায় 45–55% setup, 20–25% working capital, 10–15% customer/transport এবং 10–15% safety reserve রাখুন। Loan rate, tenure ও charges lender-এর কাছে যাচাই করুন।`,
    scheme: (c) => `${businessName(c)}-এর জন্য MUDRA, PMEGP, যোগ্য food unit হলে PMFME, artisan trade হলে PM Vishwakarma এবং প্রাসঙ্গিক state schemes যাচাই করা যেতে পারে। Final eligibility ও subsidy official portal/bank-এ যাচাই জরুরি।`,
    plan: (c) => `90 দিনে: প্রথম 15 দিনে customer ও competitor যাচাই; 16–30 দিনে ছোট paid pilot; 31–60 দিনে best-selling offer ও cash-flow tracking; 61–90 দিনে repeat demand থাকলে scale করুন।`,
    customers: (c) => `প্রথমে 20 সম্ভাব্য buyer-এর তালিকা বানান, trial offer দিন, WhatsApp/local referral ব্যবহার করুন এবং 5 paying customer থেকে 3 repeat customer পাওয়াকে প্রথম লক্ষ্য করুন।`,
    map: (c) => `Live map ${districtName(c)}-এর আশেপাশে OpenStreetMap data থেকে mapped competitor, customer hub ও commercial opportunity দেখায়। এটি real-time sales/footfall নয় এবং rural listing অসম্পূর্ণ হতে পারে।`,
    business: (c) => `সঠিক ব্যবসা আপনার skill, ${money(c.margin)} capital, জমি এবং ${districtName(c)}-এর customer route-এর সঙ্গে মিলতে হবে। NIRNAY AI skill fit-কে বেশি weight দেয়।`,
    compliance: (c) => `Udyam, local trade permission, bank KYC এবং activity অনুযায়ী FSSAI/GST/অন্যান্য local approvals যাচাই করুন।`,
    general: (c) => `${businessName(c)} নিয়ে business, finance, scheme, customer, map বা licence-এর একটি নির্দিষ্ট প্রশ্ন করুন; আমি profile অনুযায়ী আলাদা উত্তর দেব।`,
    followUps: ['NIRNAY AI পুরো ব্যাখ্যা করুন', '৯০ দিনের পরিকল্পনা দিন', 'মূলধন কীভাবে ভাগ করব?', 'স্থানীয় বাজার বিশ্লেষণ করুন'],
    fallbackNote: 'Live AI না পাওয়ায় local multilingual engine এই উত্তর দিয়েছে।', authNote: 'Live AI-এর জন্য active citizen session দরকার।', keyNote: 'Server-এ Gemini configured নেই; local smart engine উত্তর দিয়েছে।',
  },
  mr: {
    about: `NIRNAY AI हे भारतातील ग्रामीण व अर्ध-शहरी सूक्ष्म उद्योजकांसाठी AI-आधारित hyper-local business advisory आणि financial structuring assistant आहे. कौशल्य, अनुभव, भांडवल, जमीन, जोखीम आणि जिल्हा वापरून व्यवसाय पर्याय rank करणे, live OpenStreetMap आधारित market signals पाहणे, project cost/loan/working capital planning, सरकारी योजना verify करण्यासाठी shortlist आणि 30/60/90 दिवसांची कृती योजना देणे हे त्याचे मुख्य काम आहे. 9 भारतीय/वेबसाइट भाषांमध्ये text, voice input आणि spoken AI reply उपलब्ध आहेत. हे decision-support आहे; loan, subsidy किंवा profit ची हमी नाही.`,
    finance: (c) => `${districtName(c)} मधील ${businessName(c)} साठी उपलब्ध margin ${money(c.margin)} आहे. पूर्ण रक्कम मशीनरीवर खर्च करू नका: साधारण 45–55% setup, 20–25% working capital, 10–15% customer/transport आणि 10–15% reserve ठेवा.`,
    scheme: (c) => `MUDRA, PMEGP, पात्र food unit साठी PMFME, notified artisan trade साठी PM Vishwakarma आणि संबंधित राज्य योजना verify करा. अंतिम पात्रता official portal/bank कडून तपासा.`,
    plan: (c) => `पहिले 15 दिवस customer/competitor validation, 16–30 दिवस छोटा paid pilot, 31–60 दिवस best-selling offer व cash-flow tracking, 61–90 दिवस repeat demand असल्यास scale करा.`,
    customers: (c) => `20 prospects ची यादी करा, trial द्या, WhatsApp/local referrals वापरा आणि पहिले 5 paying + 3 repeat customers हे लक्ष्य ठेवा.`,
    map: (c) => `Live map ${districtName(c)} परिसरातील mapped competitors, customer hubs आणि opportunity points OpenStreetMap मधून दाखवतो. हे real-time sales/footfall data नाही.`,
    business: (c) => `योग्य व्यवसाय तुमचे कौशल्य, ${money(c.margin)} भांडवल, जमीन आणि ${districtName(c)} customer route यांच्याशी जुळला पाहिजे.`,
    compliance: (c) => `Udyam, local trade permissions, bank KYC आणि activity नुसार FSSAI/GST/इतर approvals तपासा.`,
    general: (c) => `${businessName(c)} बद्दल business, finance, scheme, customer, map किंवा licence यापैकी एक specific प्रश्न विचारा; profile नुसार वेगळे उत्तर मिळेल.`,
    followUps: ['NIRNAY AI पूर्ण समजावून सांगा', '90 दिवसांची योजना द्या', 'भांडवल कसे विभागू?', 'स्थानिक बाजार विश्लेषण करा'],
    fallbackNote: 'Live AI उपलब्ध नसल्याने local multilingual engine ने उत्तर दिले.', authNote: 'Live AI साठी active citizen session आवश्यक आहे.', keyNote: 'Server वर Gemini configured नाही; smart local engine उत्तर देत आहे.',
  },
  ta: {
    about: `NIRNAY AI இந்தியாவின் கிராம மற்றும் அரைநகர micro-entrepreneurs க்கான AI-ஆதாரமான hyper-local business advisory மற்றும் financial structuring assistant. திறன், அனுபவம், முதல்தொகை, நிலம், risk மற்றும் மாவட்டத்தை வைத்து business options rank செய்கிறது; live OpenStreetMap market signals, project cost/loan/working capital planning, scheme verification மற்றும் 30/60/90 நாள் action plan வழங்குகிறது. English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati, Punjabi ஆகிய 9 மொழிகளில் text, voice input மற்றும் spoken AI reply உள்ளது. இது decision-support மட்டும்; loan/subsidy/profit guarantee அல்ல.`,
    finance: (c) => `${districtName(c)} இல் ${businessName(c)}க்கு margin ${money(c.margin)}. முழு பணத்தையும் equipment-ல் செலவிட வேண்டாம்: 45–55% setup, 20–25% working capital, 10–15% customer/transport, 10–15% safety reserve வைத்துக் கொள்ளுங்கள்.`,
    scheme: (c) => `MUDRA, PMEGP, தகுதி இருந்தால் PMFME, artisan trade என்றால் PM Vishwakarma மற்றும் பொருத்தமான state schemes verify செய்யலாம். இறுதி eligibility official portal/bank-ல் சரிபார்க்க வேண்டும்.`,
    plan: (c) => `90 நாள்: 1–15 customer/competitor validation; 16–30 paid pilot; 31–60 best-selling offer + cash-flow tracking; 61–90 repeat demand இருந்தால் scale செய்யுங்கள்.`,
    customers: (c) => `20 prospects பட்டியல் உருவாக்கி trial offer கொடுங்கள்; WhatsApp/local referral பயன்படுத்தி முதல் 5 paying customers மற்றும் 3 repeat customers இலக்காக வைத்துக் கொள்ளுங்கள்.`,
    map: (c) => `Live map ${districtName(c)} சுற்றிய mapped competitors, customer hubs மற்றும் opportunity points-ஐ OpenStreetMap data மூலம் காட்டுகிறது. இது real-time sales/footfall data அல்ல.`,
    business: (c) => `சரியான business உங்கள் skill, ${money(c.margin)} capital, land மற்றும் ${districtName(c)} customer route-க்கு பொருந்த வேண்டும்.`,
    compliance: (c) => `Udyam, local trade permission, bank KYC மற்றும் activityக்கு ஏற்ப FSSAI/GST/மற்ற approvals சரிபார்க்கவும்.`,
    general: (c) => `${businessName(c)} பற்றி business, finance, scheme, customer, map அல்லது licence தொடர்பான ஒரு specific question கேளுங்கள்; profile அடிப்படையில் வேறு answer கிடைக்கும்.`,
    followUps: ['NIRNAY AI முழுவதும் விளக்கவும்', '90 நாள் திட்டம் தரவும்', 'முதல்தொகையை எப்படி பிரிப்பது?', 'உள்ளூர் சந்தையை ஆய்வு செய்யவும்'],
    fallbackNote: 'Live AI கிடைக்காததால் local multilingual engine இந்த பதிலை உருவாக்கியது.', authNote: 'Live AIக்கு active citizen session தேவை.', keyNote: 'Server-ல் Gemini configured இல்லை; smart local engine பதிலளிக்கிறது.',
  },
  te: {
    about: `NIRNAY AI భారత గ్రామీణ మరియు semi-urban micro-entrepreneurs కోసం AI ఆధారిత hyper-local business advisory మరియు financial structuring assistant. skill, experience, capital, land, risk, district ఆధారంగా business options rank చేస్తుంది; live OpenStreetMap market signals, project cost/loan/working capital planning, scheme verification మరియు 30/60/90-day action plan అందిస్తుంది. English, Hindi, Bengali, Marathi, Tamil, Telugu, Kannada, Gujarati, Punjabi భాషల్లో text, voice input, spoken AI reply అందుబాటులో ఉన్నాయి. ఇది decision-support మాత్రమే; loan/subsidy/profit guarantee కాదు.`,
    finance: (c) => `${districtName(c)}లో ${businessName(c)} కోసం margin ${money(c.margin)}. మొత్తం డబ్బు equipmentపై పెట్టకండి: 45–55% setup, 20–25% working capital, 10–15% customer/transport, 10–15% safety reserve ఉంచండి.`,
    scheme: (c) => `MUDRA, PMEGP, eligible food unitsకు PMFME, artisan tradesకు PM Vishwakarma మరియు సంబంధిత state schemes verify చేయండి. Final eligibility official portal/bank ద్వారా నిర్ధారించాలి.`,
    plan: (c) => `90 రోజులు: 1–15 customer/competitor validation; 16–30 paid pilot; 31–60 best-selling offer + cash-flow tracking; 61–90 repeat demand ఉంటే scale చేయండి.`,
    customers: (c) => `20 prospects list తయారు చేసి trial ఇవ్వండి; WhatsApp/local referrals ఉపయోగించి మొదటి 5 paying customers, తరువాత 3 repeat customers లక్ష్యంగా పెట్టండి.`,
    map: (c) => `Live map ${districtName(c)} చుట్టూ mapped competitors, customer hubs మరియు opportunity pointsను OpenStreetMap data ద్వారా చూపిస్తుంది. ఇది real-time sales/footfall data కాదు.`,
    business: (c) => `సరైన business మీ skill, ${money(c.margin)} capital, land మరియు ${districtName(c)} customer routeకు సరిపోవాలి.`,
    compliance: (c) => `Udyam, local trade permission, bank KYC మరియు activity ప్రకారం FSSAI/GST/ఇతర approvals verify చేయండి.`,
    general: (c) => `${businessName(c)} గురించి business, finance, scheme, customer, map లేదా licenceపై ఒక specific question అడగండి; profile ఆధారంగా వేర్వేరు answer ఇస్తాను.`,
    followUps: ['NIRNAY AI పూర్తిగా వివరించండి', '90 రోజుల ప్లాన్ ఇవ్వండి', 'మూలధనాన్ని ఎలా విభజించాలి?', 'స్థానిక మార్కెట్ విశ్లేషించండి'],
    fallbackNote: 'Live AI అందుబాటులో లేక local multilingual engine సమాధానం ఇచ్చింది.', authNote: 'Live AIకి active citizen session అవసరం.', keyNote: 'Serverలో Gemini configured లేదు; smart local engine సమాధానం ఇస్తోంది.',
  },
  kn: {
    about: `NIRNAY AI ಭಾರತದ ಗ್ರಾಮೀಣ ಮತ್ತು semi-urban micro-entrepreneurs ಗಾಗಿ AI ಆಧಾರಿತ hyper-local business advisory ಮತ್ತು financial structuring assistant. skill, experience, capital, land, risk ಮತ್ತು district ಆಧರಿಸಿ business options rank ಮಾಡುತ್ತದೆ; live OpenStreetMap market signals, project cost/loan/working capital planning, scheme verification ಮತ್ತು 30/60/90 ದಿನಗಳ action plan ನೀಡುತ್ತದೆ. 9 ಭಾಷೆಗಳಲ್ಲಿ text, voice input ಮತ್ತು spoken AI reply ಇದೆ. ಇದು decision-support ಮಾತ್ರ; loan/subsidy/profit guarantee ಅಲ್ಲ.`,
    finance: (c) => `${districtName(c)} ನಲ್ಲಿ ${businessName(c)}ಗೆ margin ${money(c.margin)}. ಸಂಪೂರ್ಣ ಹಣವನ್ನು equipmentಗೆ ಹಾಕಬೇಡಿ: 45–55% setup, 20–25% working capital, 10–15% customer/transport, 10–15% safety reserve ಇಡಿ.`,
    scheme: (c) => `MUDRA, PMEGP, eligible food unitಗೆ PMFME, artisan tradeಗೆ PM Vishwakarma ಮತ್ತು ಸಂಬಂಧಿತ state schemes verify ಮಾಡಿ. Final eligibility official portal/bankನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.`,
    plan: (c) => `90 ದಿನ: 1–15 customer/competitor validation; 16–30 paid pilot; 31–60 best-selling offer + cash-flow tracking; 61–90 repeat demand ಇದ್ದರೆ scale ಮಾಡಿ.`,
    customers: (c) => `20 prospects list ಮಾಡಿ trial ನೀಡಿ; WhatsApp/local referrals ಬಳಸಿ ಮೊದಲ 5 paying ಮತ್ತು ನಂತರ 3 repeat customers ಗುರಿ ಇಡಿ.`,
    map: (c) => `Live map ${districtName(c)} ಸುತ್ತ mapped competitors, customer hubs ಮತ್ತು opportunity points ಅನ್ನು OpenStreetMap dataದಿಂದ ತೋರಿಸುತ್ತದೆ. ಇದು real-time sales/footfall data ಅಲ್ಲ.`,
    business: (c) => `ಸರಿಯಾದ business ನಿಮ್ಮ skill, ${money(c.margin)} capital, land ಮತ್ತು ${districtName(c)} customer routeಗೆ ಹೊಂದಬೇಕು.`,
    compliance: (c) => `Udyam, local trade permission, bank KYC ಮತ್ತು activity ಪ್ರಕಾರ FSSAI/GST/ಇತರೆ approvals ಪರಿಶೀಲಿಸಿ.`,
    general: (c) => `${businessName(c)} ಕುರಿತು business, finance, scheme, customer, map ಅಥವಾ licence ಬಗ್ಗೆ ಒಂದು specific question ಕೇಳಿ; profile ಆಧರಿಸಿ ಬೇರೆ ಉತ್ತರ ಕೊಡುತ್ತೇನೆ.`,
    followUps: ['NIRNAY AI ಸಂಪೂರ್ಣವಾಗಿ ವಿವರಿಸಿ', '90 ದಿನಗಳ ಯೋಜನೆ ನೀಡಿ', 'ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ಹಂಚಬೇಕು?', 'ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಿಸಿ'],
    fallbackNote: 'Live AI ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ local multilingual engine ಉತ್ತರ ನೀಡಿದೆ.', authNote: 'Live AIಗೆ active citizen session ಬೇಕು.', keyNote: 'Serverನಲ್ಲಿ Gemini configured ಇಲ್ಲ; smart local engine ಉತ್ತರಿಸುತ್ತಿದೆ.',
  },
  gu: {
    about: `NIRNAY AI ભારતના ગ્રામ્ય અને semi-urban micro-entrepreneurs માટે AI આધારિત hyper-local business advisory અને financial structuring assistant છે. skill, experience, capital, land, risk અને district આધારે business options rank કરે છે; live OpenStreetMap market signals, project cost/loan/working capital planning, scheme verification અને 30/60/90 દિવસનો action plan આપે છે. 9 ભાષામાં text, voice input અને spoken AI reply ઉપલબ્ધ છે. આ decision-support છે; loan/subsidy/profit guarantee નથી.`,
    finance: (c) => `${districtName(c)}માં ${businessName(c)} માટે margin ${money(c.margin)} છે. આખી રકમ equipmentમાં ન મૂકો: 45–55% setup, 20–25% working capital, 10–15% customer/transport અને 10–15% safety reserve રાખો.`,
    scheme: (c) => `MUDRA, PMEGP, eligible food unit માટે PMFME, artisan trade માટે PM Vishwakarma અને સંબંધિત state schemes verify કરો. Final eligibility official portal/bankમાંથી તપાસો.`,
    plan: (c) => `90 દિવસ: 1–15 customer/competitor validation; 16–30 paid pilot; 31–60 best-selling offer + cash-flow tracking; 61–90 repeat demand હોય તો scale કરો.`,
    customers: (c) => `20 prospectsની list બનાવો, trial આપો, WhatsApp/local referralsથી પહેલા 5 paying અને પછી 3 repeat customersનું લક્ષ્ય રાખો.`,
    map: (c) => `Live map ${districtName(c)} આસપાસ mapped competitors, customer hubs અને opportunity points OpenStreetMap dataથી બતાવે છે. આ real-time sales/footfall data નથી.`,
    business: (c) => `યોગ્ય business તમારી skill, ${money(c.margin)} capital, land અને ${districtName(c)} customer route સાથે મેળ ખાવું જોઈએ.`,
    compliance: (c) => `Udyam, local trade permission, bank KYC અને activity મુજબ FSSAI/GST/અન્ય approvals verify કરો.`,
    general: (c) => `${businessName(c)} વિશે business, finance, scheme, customer, map અથવા licence પર specific question પૂછો; profile પ્રમાણે અલગ જવાબ મળશે.`,
    followUps: ['NIRNAY AI સંપૂર્ણ સમજાવો', '90 દિવસની યોજના આપો', 'મૂડી કેવી રીતે વહેંચું?', 'સ્થાનિક બજાર વિશ્લેષણ કરો'],
    fallbackNote: 'Live AI ઉપલબ્ધ ન હોવાથી local multilingual engine એ જવાબ આપ્યો.', authNote: 'Live AI માટે active citizen session જરૂરી છે.', keyNote: 'Server પર Gemini configured નથી; smart local engine જવાબ આપે છે.',
  },
  pa: {
    about: `NIRNAY AI ਭਾਰਤ ਦੇ ਪਿੰਡਾਂ ਅਤੇ semi-urban micro-entrepreneurs ਲਈ AI-ਅਧਾਰਿਤ hyper-local business advisory ਅਤੇ financial structuring assistant ਹੈ। ਇਹ skill, experience, capital, land, risk ਅਤੇ district ਦੇ ਆਧਾਰ ਤੇ business options rank ਕਰਦਾ ਹੈ; live OpenStreetMap market signals, project cost/loan/working capital planning, scheme verification ਅਤੇ 30/60/90 ਦਿਨਾਂ ਦਾ action plan ਦਿੰਦਾ ਹੈ। 9 ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ text, voice input ਅਤੇ spoken AI reply ਉਪਲਬਧ ਹੈ। ਇਹ decision-support ਹੈ; loan/subsidy/profit ਦੀ guarantee ਨਹੀਂ।`,
    finance: (c) => `${districtName(c)} ਵਿੱਚ ${businessName(c)} ਲਈ margin ${money(c.margin)} ਹੈ। ਸਾਰੀ ਰਕਮ equipment ਵਿੱਚ ਨਾ ਲਗਾਓ: 45–55% setup, 20–25% working capital, 10–15% customer/transport ਅਤੇ 10–15% safety reserve ਰੱਖੋ।`,
    scheme: (c) => `MUDRA, PMEGP, eligible food unit ਲਈ PMFME, artisan trade ਲਈ PM Vishwakarma ਅਤੇ ਸੰਬੰਧਿਤ state schemes verify ਕਰੋ। Final eligibility official portal/bank ਤੋਂ ਜਾਂਚੋ।`,
    plan: (c) => `90 ਦਿਨ: 1–15 customer/competitor validation; 16–30 paid pilot; 31–60 best-selling offer + cash-flow tracking; 61–90 repeat demand ਹੋਵੇ ਤਾਂ scale ਕਰੋ।`,
    customers: (c) => `20 prospects ਦੀ list ਬਣਾਓ, trial ਦਿਓ, WhatsApp/local referrals ਨਾਲ ਪਹਿਲੇ 5 paying ਅਤੇ ਫਿਰ 3 repeat customers ਦਾ ਟਾਰਗੇਟ ਰੱਖੋ।`,
    map: (c) => `Live map ${districtName(c)} ਦੇ ਆਲੇ-ਦੁਆਲੇ mapped competitors, customer hubs ਅਤੇ opportunity points OpenStreetMap data ਤੋਂ ਦਿਖਾਉਂਦਾ ਹੈ। ਇਹ real-time sales/footfall data ਨਹੀਂ।`,
    business: (c) => `ਸਹੀ business ਤੁਹਾਡੀ skill, ${money(c.margin)} capital, land ਅਤੇ ${districtName(c)} customer route ਨਾਲ match ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।`,
    compliance: (c) => `Udyam, local trade permission, bank KYC ਅਤੇ activity ਮੁਤਾਬਕ FSSAI/GST/ਹੋਰ approvals verify ਕਰੋ।`,
    general: (c) => `${businessName(c)} ਬਾਰੇ business, finance, scheme, customer, map ਜਾਂ licence ਉੱਤੇ specific question ਪੁੱਛੋ; profile ਦੇ ਅਨੁਸਾਰ ਵੱਖਰਾ ਜਵਾਬ ਮਿਲੇਗਾ।`,
    followUps: ['NIRNAY AI ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਮਝਾਓ', '90 ਦਿਨਾਂ ਦੀ ਯੋਜਨਾ ਦਿਓ', 'ਪੂੰਜੀ ਕਿਵੇਂ ਵੰਡਾਂ?', 'ਸਥਾਨਕ ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ'],
    fallbackNote: 'Live AI ਉਪਲਬਧ ਨਾ ਹੋਣ ਕਰਕੇ local multilingual engine ਨੇ ਜਵਾਬ ਦਿੱਤਾ।', authNote: 'Live AI ਲਈ active citizen session ਚਾਹੀਦਾ ਹੈ।', keyNote: 'Server ਉੱਤੇ Gemini configured ਨਹੀਂ; smart local engine ਜਵਾਬ ਦੇ ਰਿਹਾ ਹੈ।',
  },
};

function normalizeLanguage(value?: string): LanguageCode {
  return value && value in LOCAL_KB ? (value as LanguageCode) : 'en';
}

function hasAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word));
}

function detectIntent(question: string): Intent {
  const q = question.toLocaleLowerCase();
  if (hasAny(q, ['nirnay ai', 'nirnay', 'निर्णय ai', 'निर्णय', 'about you', 'what are you', 'क्या है', 'तुम कौन', 'আপনি কে', 'என்ன nirnay', 'ఏమిటి nirnay', 'ಏನು nirnay'])) return 'about';
  if (hasAny(q, ['scheme', 'subsidy', 'yojana', 'योजना', 'सब्सिडी', 'স্কিম', 'योजना', 'திட்டம்', 'పథకం', 'ಯೋಜನೆ', 'યોજના', 'ਯੋਜਨਾ', 'mudra', 'pmegp', 'pmfme', 'vishwakarma'])) return 'scheme';
  if (hasAny(q, ['loan', 'emi', 'finance', 'capital', 'money', 'पूंजी', 'ऋण', 'कर्ज', 'पैसा', 'মূলধন', 'ঋণ', 'भांडवल', 'கடன்', 'முதல்தொகை', 'రుణ', 'మూలధన', 'ಸಾಲ', 'ಬಂಡವಾಳ', 'લોન', 'મૂડી', 'ਕਰਜ਼', 'ਪੂੰਜੀ'])) return 'finance';
  if (hasAny(q, ['90 day', '90-day', 'action plan', 'launch plan', 'first month', 'start plan', 'कार्ययोजना', 'शुरू', 'शुरुआत', 'কর্মপরিকল্পনা', 'कृती योजना', 'செயல் திட்ட', 'కార్యాచరణ', 'ಕಾರ್ಯಯೋಜನೆ', 'કાર્યયોજના', 'ਕਾਰਵਾਈ ਯੋਜਨਾ'])) return 'plan';
  if (hasAny(q, ['customer', 'sales', 'buyer', 'marketing', 'ग्राहक', 'बिक्री', 'कस्टमर', 'ক্রেতা', 'ग्राहक', 'வாடிக்கையாளர்', 'కస్టమర్', 'ಗ್ರಾಹಕ', 'ગ્રાહક', 'ਗਾਹਕ'])) return 'customers';
  if (hasAny(q, ['map', 'competitor', 'nearby', 'location', 'radius', 'नक्शा', 'आसपास', 'प्रतियोगी', 'মানচিত্র', 'नकाशा', 'வரைபட', 'మ్యాప్', 'ನಕ್ಷೆ', 'નકશો', 'ਨਕਸ਼ਾ'])) return 'map';
  if (hasAny(q, ['license', 'licence', 'fssai', 'gst', 'udyam', 'registration', 'लाइसेंस', 'रजिस्ट्रेशन', 'লাইসেন্স', 'परवाना', 'உரிமம்', 'లైసెన్స్', 'ಪರವಾನಗಿ', 'લાઇસન્સ', 'ਲਾਇਸੈਂਸ'])) return 'compliance';
  if (hasAny(q, ['which business', 'business idea', 'what business', 'व्यवसाय', 'बिजनेस', 'ব্যবসা', 'व्यवसाय', 'வணிக', 'వ్యాపార', 'ವ್ಯವಹಾರ', 'બિઝનેસ', 'ਕਾਰੋਬਾਰ'])) return 'business';
  return 'general';
}

function buildLocalFallback(
  question: string,
  context: ChatContext,
  language: LanguageCode,
  reason: 'auth' | 'key' | 'unavailable'
): ChatResponse {
  const kb = LOCAL_KB[language];
  const intent = detectIntent(question);
  const answer = intent === 'about' ? kb.about : kb[intent](context);
  const reasonNote = reason === 'auth' ? kb.authNote : reason === 'key' ? kb.keyNote : kb.fallbackNote;
  return {
    answer,
    followUps: kb.followUps,
    confidenceNote: reasonNote,
    sources: ['NIRNAY AI smart local knowledge engine', context.district ? `Profile: ${context.district}` : 'Entrepreneur profile'],
  };
}

export async function askNirnayQuestion(
  question: string,
  context: ChatContext,
  history: ChatHistoryMessage[] = []
): Promise<ChatResponse> {
  let fallbackReason: 'auth' | 'key' | 'unavailable' = 'unavailable';
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
      if (payload?.requiresAuth) fallbackReason = 'auth';
      if (payload?.requiresGeminiKey) fallbackReason = 'key';
    }
  } catch {
    fallbackReason = 'unavailable';
  }

  const language = normalizeLanguage(context.language);
  return buildLocalFallback(question, context, language, fallbackReason);
}
