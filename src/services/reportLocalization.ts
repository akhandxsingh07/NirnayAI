import { LanguageCode } from '../types';

export interface ReportCopy {
  reportTitle: string;
  reportSubtitle: string;
  dossierLabel: string;
  documentTitle: string;
  project: string;
  category: string;
  generatedFor: string;
  state: string;
  date: string;
  documentRef: string;
  section1: string;
  summaryA: string;
  summaryB: string;
  summaryC: string;
  block: string;
  district: string;
  feasibilityVerdict: string;
  genericRecommendation: string;
  section2: string;
  entrepreneurMargin: string;
  totalProjectCost: string;
  sanctionedLoan: string;
  monthlyDebtService: string;
  deploymentHead: string;
  specification: string;
  estimatedAmount: string;
  capex: string;
  capexSpec: string;
  inventory: string;
  inventorySpec: string;
  workingCapital: string;
  workingCapitalSpec: string;
  totalOutlay: string;
  section3: string;
  optionB: string;
  rateTenure: string;
  genericSchemeRationale: string;
  moratorium: string;
  monthsGrace: string;
  estimatedBreakEven: string;
  months: string;
  monthlyNetProfit: string;
  section4: string;
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  genericStrength: string;
  genericWeakness: string;
  genericOpportunity: string;
  genericThreat: string;
  section5: string;
  nextSteps: Array<{ title: string; desc: string }>;
  referencesTitle: string;
  referencesText: string;
  disclaimerTitle: string;
  disclaimerText: string;
  declaration: string;
  signature: string;
  verification: string;
  prototype: string;
}

const C: Record<LanguageCode, ReportCopy> = {
  en: {
    reportTitle: 'Final Business Plan',
    reportSubtitle: 'Comprehensive Decision-Support & Financing Dossier',
    dossierLabel: 'SIH26091 ENTERPRISE ADVISORY DOSSIER',
    documentTitle: 'Comprehensive Rural Business Plan',
    project: 'Project', category: 'Category', generatedFor: 'Generated For', state: 'State', date: 'Date', documentRef: 'Document Ref',
    section1: '1. Executive Summary & Strategic Viability',
    summaryA: 'This business advisory report provides a structured appraisal for establishing',
    summaryB: 'The enterprise proposal requires an estimated total capital outlay of',
    summaryC: 'anchored by a committed 10% entrepreneur margin contribution and supported by 90% debt financing under the recommended scheme.',
    block: 'Block', district: 'District', feasibilityVerdict: 'Algorithmic Feasibility Verdict',
    genericRecommendation: 'The opportunity shows promising local fundamentals. Proceed with controlled investment, validate recurring demand and maintain disciplined working-capital and quality controls.',
    section2: '2. Capital Structure & Loan Terms',
    entrepreneurMargin: '10% Entrepreneur Margin', totalProjectCost: '100% Total Project Cost', sanctionedLoan: '90% Sanctioned Loan', monthlyDebtService: 'Monthly Debt Service',
    deploymentHead: 'Capital Deployment Head', specification: 'Specification', estimatedAmount: 'Estimated Amount',
    capex: 'Capital Expenditure (Capex)', capexSpec: 'Machinery, equipment and essential setup assets',
    inventory: 'Initial Inventory Stock', inventorySpec: 'Initial procurement buffer, consumables and packaging',
    workingCapital: 'Working Capital Liquidity', workingCapitalSpec: 'Operating cash cushion, utilities and contingency reserve', totalOutlay: 'Total Estimated Project Outlay',
    section3: '3. Statutory Scheme Recommendation', optionB: 'Option B', rateTenure: '8.0% p.a. • 7 Years Tenure',
    genericSchemeRationale: 'This financing route is aligned with a micro-enterprise structure and should be verified against current lender and scheme eligibility rules before application.',
    moratorium: 'Moratorium', monthsGrace: 'Months Grace', estimatedBreakEven: 'Estimated Break-even', months: 'Months', monthlyNetProfit: 'Monthly Net Profit',
    section4: '4. SWOT Strategic Matrix', strengths: 'Strengths', weaknesses: 'Weaknesses', opportunities: 'Opportunities', threats: 'Threats & Mitigations',
    genericStrength: 'Recurring local demand and proximity to customers support dependable sales.',
    genericWeakness: 'Working-capital discipline, quality control and supplier reliability require close monitoring.',
    genericOpportunity: 'Nearby villages, institutional buyers and value-added products can expand revenue.',
    genericThreat: 'Price volatility, local competition and operational disruptions should be managed with buffers and backup suppliers.',
    section5: '5. Entrepreneur On-Ground Action Checklist',
    nextSteps: [
      { title: 'Complete Free Udyam MSME Registration', desc: 'Obtain the enterprise registration number on the official Udyam portal using Aadhaar.' },
      { title: 'Open a Dedicated Business Current Account', desc: 'Keep business inflows, expenses and loan disbursements separate from personal transactions.' },
      { title: 'Obtain 2 Machinery / Supplier Quotations', desc: 'Collect proforma invoices for equipment and major startup purchases for lender appraisal.' },
      { title: 'Confirm 5 Local Customer or Supply Commitments', desc: 'Document early demand from nearby households, shops or institutional buyers.' },
      { title: 'Submit the Loan / Scheme Application', desc: 'Present this structured plan with identity, quotations and supporting documents to the relevant bank or agency.' },
    ],
    referencesTitle: 'Institutional References & Methodology',
    referencesText: 'Planning logic references RBI small-enterprise guidance, Ministry of MSME Udyam classification parameters and assisted-digital-access research. Always verify current scheme and lender rules from official sources.',
    disclaimerTitle: 'Official Disclaimer',
    disclaimerText: 'This report is an AI-assisted and rule-based decision-support prototype. It is not a legal loan sanction, formal credit endorsement or financial guarantee. Actual eligibility, rates and approvals remain subject to official scheme rules and lender underwriting.',
    declaration: 'Entrepreneur Declaration', signature: 'Applicant Signature / Thumb Impression', verification: 'Advisory System Verification', prototype: 'Smart India Hackathon 2026 Prototype',
  },
  hi: {
    reportTitle: 'अंतिम व्यापार योजना', reportSubtitle: 'समग्र निर्णय-सहायता एवं वित्तीय दस्तावेज', dossierLabel: 'SIH26091 उद्यम सलाह दस्तावेज', documentTitle: 'समग्र ग्रामीण व्यापार योजना',
    project: 'परियोजना', category: 'श्रेणी', generatedFor: 'तैयार किया गया', state: 'राज्य', date: 'दिनांक', documentRef: 'दस्तावेज संदर्भ',
    section1: '1. कार्यकारी सारांश एवं रणनीतिक व्यवहार्यता', summaryA: 'यह व्यावसायिक सलाह रिपोर्ट निम्न उद्यम की स्थापना के लिए संरचित मूल्यांकन प्रस्तुत करती है:', summaryB: 'प्रस्तावित उद्यम के लिए अनुमानित कुल पूंजीगत आवश्यकता है', summaryC: 'जिसमें 10% उद्यमी मार्जिन योगदान और अनुशंसित योजना के अंतर्गत 90% ऋण वित्तपोषण का ढांचा रखा गया है।', block: 'ब्लॉक', district: 'जिला', feasibilityVerdict: 'एल्गोरिदमिक व्यवहार्यता निष्कर्ष', genericRecommendation: 'इस अवसर में स्थानीय स्तर पर अच्छे आधार दिखाई देते हैं। नियंत्रित निवेश से शुरुआत करें, नियमित मांग की पुष्टि करें और कार्यशील पूंजी तथा गुणवत्ता नियंत्रण पर अनुशासन बनाए रखें।',
    section2: '2. पूंजी संरचना एवं ऋण शर्तें', entrepreneurMargin: '10% उद्यमी मार्जिन', totalProjectCost: '100% कुल परियोजना लागत', sanctionedLoan: '90% प्रस्तावित ऋण', monthlyDebtService: 'मासिक ऋण भुगतान', deploymentHead: 'पूंजी उपयोग मद', specification: 'विवरण', estimatedAmount: 'अनुमानित राशि', capex: 'पूंजीगत व्यय (कैपेक्स)', capexSpec: 'मशीनरी, उपकरण एवं आवश्यक स्थापना परिसंपत्तियाँ', inventory: 'प्रारंभिक स्टॉक', inventorySpec: 'प्रारंभिक खरीद, उपभोग्य सामग्री एवं पैकेजिंग', workingCapital: 'कार्यशील पूंजी', workingCapitalSpec: 'संचालन नकदी, उपयोगिता खर्च एवं आकस्मिक रिज़र्व', totalOutlay: 'कुल अनुमानित परियोजना व्यय',
    section3: '3. सरकारी/वैधानिक योजना अनुशंसा', optionB: 'विकल्प B', rateTenure: '8.0% वार्षिक • 7 वर्ष अवधि', genericSchemeRationale: 'यह वित्तीय संरचना सूक्ष्म उद्यम के लिए उपयुक्त हो सकती है। आवेदन से पहले वर्तमान बैंक और योजना पात्रता नियमों की आधिकारिक पुष्टि करें।', moratorium: 'मोरेटोरियम', monthsGrace: 'माह की राहत', estimatedBreakEven: 'अनुमानित ब्रेक-ईवन', months: 'माह', monthlyNetProfit: 'मासिक शुद्ध लाभ',
    section4: '4. SWOT रणनीतिक मैट्रिक्स', strengths: 'ताकत', weaknesses: 'कमज़ोरियाँ', opportunities: 'अवसर', threats: 'जोखिम एवं निवारण', genericStrength: 'स्थानीय नियमित मांग और ग्राहकों की निकटता स्थिर बिक्री में सहायता कर सकती है।', genericWeakness: 'कार्यशील पूंजी, गुणवत्ता नियंत्रण और आपूर्तिकर्ता विश्वसनीयता पर निरंतर निगरानी आवश्यक है।', genericOpportunity: 'आसपास के गांव, संस्थागत खरीदार और मूल्य-वर्धित उत्पाद आय बढ़ा सकते हैं।', genericThreat: 'मूल्य उतार-चढ़ाव, स्थानीय प्रतिस्पर्धा और संचालन बाधाओं के लिए रिज़र्व तथा वैकल्पिक आपूर्तिकर्ता रखें।',
    section5: '5. उद्यमी के लिए जमीनी कार्य सूची', nextSteps: [
      { title: 'निःशुल्क उद्यम MSME पंजीकरण पूरा करें', desc: 'आधार के माध्यम से आधिकारिक उद्यम पोर्टल पर उद्यम पंजीकरण संख्या प्राप्त करें।' },
      { title: 'अलग व्यवसायिक चालू खाता खोलें', desc: 'व्यवसाय की आय, खर्च और ऋण वितरण को निजी लेन-देन से अलग रखें।' },
      { title: '2 मशीनरी/आपूर्तिकर्ता कोटेशन प्राप्त करें', desc: 'बैंक मूल्यांकन के लिए उपकरण और प्रमुख खरीद की प्रोफार्मा इनवॉइस लें।' },
      { title: '5 स्थानीय ग्राहक/आपूर्ति प्रतिबद्धताएँ सुनिश्चित करें', desc: 'नजदीकी परिवारों, दुकानों या संस्थागत खरीदारों से प्रारंभिक मांग दर्ज करें।' },
      { title: 'ऋण/योजना आवेदन जमा करें', desc: 'पहचान, कोटेशन और सहायक दस्तावेजों के साथ यह योजना संबंधित बैंक या एजेंसी में प्रस्तुत करें।' },
    ],
    referencesTitle: 'संस्थागत संदर्भ एवं कार्यप्रणाली', referencesText: 'योजना तर्क RBI लघु उद्यम मार्गदर्शन, MSME उद्यम वर्गीकरण तथा डिजिटल सहायता अनुसंधान पर आधारित है। वर्तमान नियम हमेशा आधिकारिक स्रोत से सत्यापित करें।', disclaimerTitle: 'आधिकारिक अस्वीकरण', disclaimerText: 'यह रिपोर्ट AI-सहायित एवं नियम-आधारित निर्णय-सहायता प्रोटोटाइप है। यह ऋण स्वीकृति, औपचारिक क्रेडिट समर्थन या वित्तीय गारंटी नहीं है। वास्तविक पात्रता, दरें और स्वीकृति आधिकारिक योजना नियमों तथा बैंक मूल्यांकन पर निर्भर हैं।', declaration: 'उद्यमी घोषणा', signature: 'आवेदक हस्ताक्षर / अंगूठा निशान', verification: 'सलाह प्रणाली सत्यापन', prototype: 'स्मार्ट इंडिया हैकाथॉन 2026 प्रोटोटाइप',
  },
  bn: {
    reportTitle: 'চূড়ান্ত ব্যবসায়িক পরিকল্পনা', reportSubtitle: 'সমন্বিত সিদ্ধান্ত সহায়তা ও অর্থায়ন নথি', dossierLabel: 'SIH26091 উদ্যোগ পরামর্শ নথি', documentTitle: 'সমন্বিত গ্রামীণ ব্যবসায়িক পরিকল্পনা', project: 'প্রকল্প', category: 'বিভাগ', generatedFor: 'প্রস্তুত করা হয়েছে', state: 'রাজ্য', date: 'তারিখ', documentRef: 'নথি রেফারেন্স', section1: '1. নির্বাহী সারাংশ ও কৌশলগত সম্ভাব্যতা', summaryA: 'এই ব্যবসায়িক পরামর্শ প্রতিবেদন নিম্ন উদ্যোগ স্থাপনের জন্য একটি কাঠামোবদ্ধ মূল্যায়ন প্রদান করে:', summaryB: 'প্রস্তাবিত উদ্যোগের আনুমানিক মোট মূলধনী ব্যয়', summaryC: 'যেখানে ১০% উদ্যোক্তা মার্জিন এবং প্রস্তাবিত স্কিমের অধীনে ৯০% ঋণ অর্থায়ন ধরা হয়েছে।', block: 'ব্লক', district: 'জেলা', feasibilityVerdict: 'অ্যালগরিদমিক সম্ভাব্যতা সিদ্ধান্ত', genericRecommendation: 'এই সুযোগটির স্থানীয় ভিত্তি আশাব্যঞ্জক। নিয়ন্ত্রিত বিনিয়োগ দিয়ে শুরু করুন, নিয়মিত চাহিদা যাচাই করুন এবং কার্যকরী মূলধন ও মান নিয়ন্ত্রণে শৃঙ্খলা বজায় রাখুন।', section2: '2. মূলধন কাঠামো ও ঋণের শর্ত', entrepreneurMargin: '১০% উদ্যোক্তা মার্জিন', totalProjectCost: '১০০% মোট প্রকল্প ব্যয়', sanctionedLoan: '৯০% প্রস্তাবিত ঋণ', monthlyDebtService: 'মাসিক ঋণ পরিশোধ', deploymentHead: 'মূলধন ব্যবহারের খাত', specification: 'বিবরণ', estimatedAmount: 'আনুমানিক পরিমাণ', capex: 'মূলধনী ব্যয়', capexSpec: 'যন্ত্রপাতি, সরঞ্জাম ও প্রয়োজনীয় স্থাপনা', inventory: 'প্রাথমিক মজুত', inventorySpec: 'প্রাথমিক ক্রয়, ভোগ্যপণ্য ও প্যাকেজিং', workingCapital: 'কার্যকরী মূলধন', workingCapitalSpec: 'পরিচালন নগদ, ইউটিলিটি ও জরুরি রিজার্ভ', totalOutlay: 'মোট আনুমানিক প্রকল্প ব্যয়', section3: '3. সরকারি স্কিম সুপারিশ', optionB: 'বিকল্প B', rateTenure: 'বার্ষিক ৮.০% • ৭ বছর মেয়াদ', genericSchemeRationale: 'এই অর্থায়ন কাঠামো ক্ষুদ্র উদ্যোগের জন্য উপযুক্ত হতে পারে। আবেদনের আগে বর্তমান ব্যাংক ও স্কিমের যোগ্যতা যাচাই করুন।', moratorium: 'মোরাটোরিয়াম', monthsGrace: 'মাস ছাড়', estimatedBreakEven: 'আনুমানিক ব্রেক-ইভেন', months: 'মাস', monthlyNetProfit: 'মাসিক নিট লাভ', section4: '4. SWOT কৌশলগত ম্যাট্রিক্স', strengths: 'শক্তি', weaknesses: 'দুর্বলতা', opportunities: 'সুযোগ', threats: 'ঝুঁকি ও প্রতিকার', genericStrength: 'স্থানীয় নিয়মিত চাহিদা এবং গ্রাহকের নিকটতা স্থিতিশীল বিক্রয়কে সমর্থন করে।', genericWeakness: 'কার্যকরী মূলধন, মান নিয়ন্ত্রণ এবং সরবরাহকারীর নির্ভরযোগ্যতা নিয়মিত পর্যবেক্ষণ দরকার।', genericOpportunity: 'পার্শ্ববর্তী গ্রাম, প্রাতিষ্ঠানিক ক্রেতা এবং মূল্য সংযোজিত পণ্য আয় বাড়াতে পারে।', genericThreat: 'মূল্য ওঠানামা, স্থানীয় প্রতিযোগিতা ও পরিচালন বিঘ্নের জন্য রিজার্ভ এবং বিকল্প সরবরাহকারী রাখুন।', section5: '5. উদ্যোক্তার মাঠপর্যায়ের কর্মতালিকা', nextSteps: [
      { title: 'বিনামূল্যে Udyam MSME নিবন্ধন সম্পূর্ণ করুন', desc: 'আধার ব্যবহার করে সরকারি Udyam পোর্টালে উদ্যোগ নিবন্ধন নম্বর নিন।' },
      { title: 'আলাদা ব্যবসায়িক কারেন্ট অ্যাকাউন্ট খুলুন', desc: 'ব্যবসার আয়, ব্যয় ও ঋণ লেনদেন ব্যক্তিগত হিসাব থেকে আলাদা রাখুন।' },
      { title: '২টি যন্ত্রপাতি/সরবরাহকারী কোটেশন নিন', desc: 'ব্যাংক মূল্যায়নের জন্য প্রধান সরঞ্জামের প্রোফর্মা ইনভয়েস সংগ্রহ করুন।' },
      { title: '৫টি স্থানীয় গ্রাহক/সরবরাহ প্রতিশ্রুতি নিশ্চিত করুন', desc: 'নিকটবর্তী পরিবার, দোকান বা প্রাতিষ্ঠানিক ক্রেতার প্রাথমিক চাহিদা নথিভুক্ত করুন।' },
      { title: 'ঋণ/স্কিম আবেদন জমা দিন', desc: 'পরিচয়পত্র, কোটেশন ও সহায়ক নথিসহ এই পরিকল্পনা সংশ্লিষ্ট ব্যাংক বা সংস্থায় দিন।' },
    ], referencesTitle: 'প্রাতিষ্ঠানিক সূত্র ও পদ্ধতি', referencesText: 'পরিকল্পনা RBI ক্ষুদ্র উদ্যোগ নির্দেশিকা, MSME Udyam শ্রেণিবিন্যাস এবং সহায়তাপ্রাপ্ত ডিজিটাল গবেষণার রেফারেন্স ব্যবহার করে। বর্তমান নিয়ম সরকারি উৎসে যাচাই করুন।', disclaimerTitle: 'সরকারি দাবিত্যাগ', disclaimerText: 'এই প্রতিবেদন AI-সহায়িত সিদ্ধান্ত-সহায়তা প্রোটোটাইপ। এটি ঋণ অনুমোদন, আনুষ্ঠানিক ক্রেডিট সমর্থন বা আর্থিক গ্যারান্টি নয়। প্রকৃত যোগ্যতা ও অনুমোদন সরকারি নিয়ম ও ব্যাংক মূল্যায়নের উপর নির্ভরশীল।', declaration: 'উদ্যোক্তা ঘোষণা', signature: 'আবেদনকারীর স্বাক্ষর / আঙুলের ছাপ', verification: 'পরামর্শ ব্যবস্থা যাচাই', prototype: 'স্মার্ট ইন্ডিয়া হ্যাকাথন ২০২৬ প্রোটোটাইপ',
  },
  mr: {
    reportTitle: 'अंतिम व्यवसाय योजना', reportSubtitle: 'सर्वसमावेशक निर्णय-सहाय्य व वित्तपुरवठा दस्तऐवज', dossierLabel: 'SIH26091 उद्योग सल्ला दस्तऐवज', documentTitle: 'सर्वसमावेशक ग्रामीण व्यवसाय योजना', project: 'प्रकल्प', category: 'श्रेणी', generatedFor: 'यांच्यासाठी तयार', state: 'राज्य', date: 'दिनांक', documentRef: 'दस्तऐवज संदर्भ', section1: '1. कार्यकारी सारांश व धोरणात्मक व्यवहार्यता', summaryA: 'हा व्यवसाय सल्ला अहवाल खालील उद्योग स्थापनेसाठी संरचित मूल्यांकन देतो:', summaryB: 'उद्योगासाठी अंदाजित एकूण भांडवली गरज आहे', summaryC: 'ज्यात 10% उद्योजक मार्जिन आणि शिफारस केलेल्या योजनेअंतर्गत 90% कर्ज वित्तपुरवठा गृहित धरला आहे.', block: 'तालुका/ब्लॉक', district: 'जिल्हा', feasibilityVerdict: 'अल्गोरिदमिक व्यवहार्यता निष्कर्ष', genericRecommendation: 'या संधीची स्थानिक पातळीवर चांगली पायाभरणी दिसते. नियंत्रित गुंतवणुकीने सुरुवात करा, नियमित मागणी पडताळा आणि कार्यभांडवल व गुणवत्ता नियंत्रणात शिस्त ठेवा.', section2: '2. भांडवल रचना व कर्ज अटी', entrepreneurMargin: '10% उद्योजक मार्जिन', totalProjectCost: '100% एकूण प्रकल्प खर्च', sanctionedLoan: '90% प्रस्तावित कर्ज', monthlyDebtService: 'मासिक कर्ज परतफेड', deploymentHead: 'भांडवल वापर विभाग', specification: 'तपशील', estimatedAmount: 'अंदाजित रक्कम', capex: 'भांडवली खर्च', capexSpec: 'यंत्रसामग्री, उपकरणे व आवश्यक स्थापना', inventory: 'प्रारंभिक साठा', inventorySpec: 'प्रारंभिक खरेदी, वापर सामग्री व पॅकेजिंग', workingCapital: 'कार्यभांडवल', workingCapitalSpec: 'दैनंदिन रोकड, उपयोगिता खर्च व आकस्मिक राखीव', totalOutlay: 'एकूण अंदाजित प्रकल्प खर्च', section3: '3. सरकारी योजना शिफारस', optionB: 'पर्याय B', rateTenure: '8.0% वार्षिक • 7 वर्षे', genericSchemeRationale: 'ही वित्तीय रचना सूक्ष्म उद्योगासाठी योग्य असू शकते. अर्जापूर्वी बँक व योजना पात्रता नियमांची अधिकृत पडताळणी करा.', moratorium: 'मोरेटोरियम', monthsGrace: 'महिन्यांची सवलत', estimatedBreakEven: 'अंदाजित ब्रेक-इव्हन', months: 'महिने', monthlyNetProfit: 'मासिक निव्वळ नफा', section4: '4. SWOT धोरणात्मक मॅट्रिक्स', strengths: 'बलस्थान', weaknesses: 'कमकुवत बाजू', opportunities: 'संधी', threats: 'धोके व उपाय', genericStrength: 'स्थानिक पुनरावृत्ती मागणी आणि ग्राहकांची जवळीक स्थिर विक्रीस मदत करते.', genericWeakness: 'कार्यभांडवल, गुणवत्ता नियंत्रण आणि पुरवठादार विश्वसनीयतेवर लक्ष आवश्यक आहे.', genericOpportunity: 'शेजारील गावे, संस्थात्मक ग्राहक आणि मूल्यवर्धित उत्पादने उत्पन्न वाढवू शकतात.', genericThreat: 'किंमत चढउतार, स्थानिक स्पर्धा आणि संचालनातील अडथळ्यांसाठी राखीव निधी व पर्यायी पुरवठादार ठेवा.', section5: '5. उद्योजक कृती यादी', nextSteps: [
      { title: 'मोफत Udyam MSME नोंदणी पूर्ण करा', desc: 'आधार वापरून अधिकृत Udyam पोर्टलवर उद्योग नोंदणी क्रमांक मिळवा.' },
      { title: 'स्वतंत्र व्यवसाय चालू खाते उघडा', desc: 'व्यवसायाची येणी, खर्च आणि कर्ज व्यवहार वैयक्तिक व्यवहारांपासून वेगळे ठेवा.' },
      { title: '2 यंत्रसामग्री/पुरवठादार कोटेशन घ्या', desc: 'बँक मूल्यांकनासाठी प्रमुख उपकरणांची प्रोफॉर्मा इनव्हॉइस गोळा करा.' },
      { title: '5 स्थानिक ग्राहक/पुरवठा बांधिलकी निश्चित करा', desc: 'जवळील ग्राहक, दुकाने किंवा संस्थांकडील सुरुवातीची मागणी नोंदवा.' },
      { title: 'कर्ज/योजना अर्ज सादर करा', desc: 'ओळखपत्र, कोटेशन व सहाय्यक कागदपत्रांसह योजना संबंधित बँक किंवा संस्थेकडे द्या.' },
    ], referencesTitle: 'संस्थात्मक संदर्भ व पद्धत', referencesText: 'योजनेत RBI लघुउद्योग मार्गदर्शन, MSME Udyam वर्गीकरण आणि डिजिटल सहाय्य संशोधनाचा संदर्भ आहे. चालू नियम अधिकृत स्रोतावर तपासा.', disclaimerTitle: 'अधिकृत अस्वीकरण', disclaimerText: 'हा अहवाल AI-सहाय्यित निर्णय-सहाय्य प्रोटोटाइप आहे. तो कर्ज मंजुरी, औपचारिक क्रेडिट समर्थन किंवा आर्थिक हमी नाही. अंतिम पात्रता व मंजुरी अधिकृत नियम आणि बँक मूल्यांकनावर अवलंबून आहे.', declaration: 'उद्योजक घोषणा', signature: 'अर्जदार स्वाक्षरी / अंगठा ठसा', verification: 'सल्ला प्रणाली पडताळणी', prototype: 'स्मार्ट इंडिया हॅकाथॉन 2026 प्रोटोटाइप',
  },
  ta: {
    reportTitle: 'இறுதி வணிகத் திட்டம்', reportSubtitle: 'முழுமையான முடிவு ஆதரவு மற்றும் நிதி ஆவணம்', dossierLabel: 'SIH26091 தொழில் ஆலோசனை ஆவணம்', documentTitle: 'முழுமையான கிராமப்புற வணிகத் திட்டம்', project: 'திட்டம்', category: 'வகை', generatedFor: 'தயாரிக்கப்பட்ட இடம்', state: 'மாநிலம்', date: 'தேதி', documentRef: 'ஆவண குறிப்பு', section1: '1. நிர்வாகச் சுருக்கம் மற்றும் மூலோபாய சாத்தியம்', summaryA: 'இந்த வணிக ஆலோசனை அறிக்கை பின்வரும் தொழிலை நிறுவுவதற்கான கட்டமைக்கப்பட்ட மதிப்பீட்டை வழங்குகிறது:', summaryB: 'இந்த தொழிலுக்கான மதிப்பிடப்பட்ட மொத்த மூலதனத் தேவை', summaryC: 'இதில் 10% தொழில்முனைவோர் பங்களிப்பும் பரிந்துரைக்கப்பட்ட திட்டத்தின் கீழ் 90% கடன் நிதியும் உள்ளடங்கும்.', block: 'வட்டம்/பிளாக்', district: 'மாவட்டம்', feasibilityVerdict: 'கணினி சாத்தியக்கூறு முடிவு', genericRecommendation: 'இந்த வாய்ப்புக்கு நல்ல உள்ளூர் அடித்தளம் உள்ளது. கட்டுப்படுத்தப்பட்ட முதலீட்டுடன் தொடங்கி, தொடர்ச்சியான தேவையை உறுதி செய்து, பணப்புழக்கம் மற்றும் தரக் கட்டுப்பாட்டை ஒழுங்குடன் நிர்வகிக்கவும்.', section2: '2. மூலதன அமைப்பு மற்றும் கடன் நிபந்தனைகள்', entrepreneurMargin: '10% தொழில்முனைவோர் பங்கு', totalProjectCost: '100% மொத்த திட்டச் செலவு', sanctionedLoan: '90% பரிந்துரைக்கப்பட்ட கடன்', monthlyDebtService: 'மாதாந்திர கடன் செலுத்தல்', deploymentHead: 'மூலதனப் பயன்பாட்டு தலைப்பு', specification: 'விவரம்', estimatedAmount: 'மதிப்பிடப்பட்ட தொகை', capex: 'மூலதனச் செலவு', capexSpec: 'இயந்திரங்கள், உபகரணங்கள் மற்றும் அத்தியாவசிய அமைப்பு', inventory: 'தொடக்க சரக்கு', inventorySpec: 'தொடக்க கொள்முதல், பயன்பாட்டு பொருட்கள் மற்றும் பொதியிடல்', workingCapital: 'சுழற்சி மூலதனம்', workingCapitalSpec: 'இயக்க பணம், பயன்பாட்டு செலவுகள் மற்றும் அவசர இருப்பு', totalOutlay: 'மொத்த மதிப்பிடப்பட்ட திட்டச் செலவு', section3: '3. அரசு திட்ட பரிந்துரை', optionB: 'விருப்பம் B', rateTenure: 'ஆண்டு 8.0% • 7 ஆண்டு காலம்', genericSchemeRationale: 'இந்த நிதி அமைப்பு சிறு தொழிலுக்கு பொருத்தமானதாக இருக்கலாம். விண்ணப்பத்திற்கு முன் தற்போதைய வங்கி மற்றும் திட்ட தகுதியை அதிகாரப்பூர்வமாக சரிபார்க்கவும்.', moratorium: 'மோரட்டோரியம்', monthsGrace: 'மாத அவகாசம்', estimatedBreakEven: 'மதிப்பிடப்பட்ட பிரேக்-ஈவன்', months: 'மாதங்கள்', monthlyNetProfit: 'மாதாந்திர நிகர லாபம்', section4: '4. SWOT மூலோபாய அட்டவணை', strengths: 'வலிமைகள்', weaknesses: 'பலவீனங்கள்', opportunities: 'வாய்ப்புகள்', threats: 'அபாயங்கள் மற்றும் தடுப்பு', genericStrength: 'தொடர்ச்சியான உள்ளூர் தேவை மற்றும் வாடிக்கையாளர் அருகாமை நிலையான விற்பனைக்கு உதவுகிறது.', genericWeakness: 'சுழற்சி மூலதனம், தரக் கட்டுப்பாடு மற்றும் சப்ளையர் நம்பகத்தன்மை கவனமாக கண்காணிக்கப்பட வேண்டும்.', genericOpportunity: 'அருகிலுள்ள கிராமங்கள், நிறுவன வாடிக்கையாளர்கள் மற்றும் மதிப்புக் கூட்டிய பொருட்கள் வருவாயை உயர்த்தலாம்.', genericThreat: 'விலை மாற்றம், உள்ளூர் போட்டி மற்றும் செயல்பாட்டு இடையூறுகளுக்கு இருப்பு மற்றும் மாற்று சப்ளையர்கள் தேவை.', section5: '5. தொழில்முனைவோர் செயல் பட்டியல்', nextSteps: [
      { title: 'இலவச Udyam MSME பதிவை முடிக்கவும்', desc: 'ஆதார் மூலம் அதிகாரப்பூர்வ Udyam தளத்தில் தொழில் பதிவு எண்ணைப் பெறவும்.' },
      { title: 'தனி வணிக நடப்பு கணக்கைத் திறக்கவும்', desc: 'வணிக வரவு, செலவு மற்றும் கடன் பரிவர்த்தனைகளை தனிப்பட்ட கணக்கிலிருந்து பிரிக்கவும்.' },
      { title: '2 இயந்திர/சப்ளையர் விலைப்பட்டியல்களைப் பெறவும்', desc: 'வங்கி மதிப்பீட்டிற்கு முக்கிய உபகரணங்களின் புரோஃபார்மா இன்வாய்ஸ்களை சேகரிக்கவும்.' },
      { title: '5 உள்ளூர் வாடிக்கையாளர்/விநியோக உறுதிகளைப் பெறவும்', desc: 'அருகிலுள்ள குடும்பங்கள், கடைகள் அல்லது நிறுவன வாடிக்கையாளர்களின் ஆரம்ப தேவையை பதிவு செய்யவும்.' },
      { title: 'கடன்/திட்ட விண்ணப்பத்தைச் சமர்ப்பிக்கவும்', desc: 'அடையாளம், விலைப்பட்டியல் மற்றும் ஆதார ஆவணங்களுடன் திட்டத்தை வங்கி அல்லது முகமைக்கு வழங்கவும்.' },
    ], referencesTitle: 'நிறுவன ஆதாரங்கள் மற்றும் முறை', referencesText: 'இந்த திட்டம் RBI சிறு தொழில் வழிகாட்டல், MSME Udyam வகைப்படுத்தல் மற்றும் டிஜிட்டல் உதவி ஆய்வை மேற்கோளாகக் கொண்டுள்ளது. தற்போதைய விதிகளை அதிகாரப்பூர்வ ஆதாரங்களில் சரிபார்க்கவும்.', disclaimerTitle: 'அதிகாரப்பூர்வ மறுப்பு', disclaimerText: 'இந்த அறிக்கை AI உதவியுடனான முடிவு ஆதரவு மாதிரி மட்டுமே. இது கடன் ஒப்புதல், அதிகாரப்பூர்வ கடன் உறுதி அல்லது நிதி உத்தரவாதம் அல்ல. இறுதி தகுதி மற்றும் ஒப்புதல் அதிகாரப்பூர்வ விதிகள் மற்றும் வங்கி மதிப்பீட்டுக்கு உட்பட்டது.', declaration: 'தொழில்முனைவோர் அறிவிப்பு', signature: 'விண்ணப்பதாரர் கையொப்பம் / விரலடையாளம்', verification: 'ஆலோசனை அமைப்பு சரிபார்ப்பு', prototype: 'ஸ்மார்ட் இந்தியா ஹாக்கத்தான் 2026 மாதிரி',
  },
  te: {
    reportTitle: 'చివరి వ్యాపార ప్రణాళిక', reportSubtitle: 'సమగ్ర నిర్ణయ సహాయం మరియు ఆర్థిక పత్రం', dossierLabel: 'SIH26091 వ్యాపార సలహా పత్రం', documentTitle: 'సమగ్ర గ్రామీణ వ్యాపార ప్రణాళిక', project: 'ప్రాజెక్ట్', category: 'వర్గం', generatedFor: 'తయారు చేసిన ప్రాంతం', state: 'రాష్ట్రం', date: 'తేదీ', documentRef: 'పత్ర సూచన', section1: '1. కార్యనిర్వాహక సారాంశం మరియు వ్యూహాత్మక సాధ్యత', summaryA: 'ఈ వ్యాపార సలహా నివేదిక క్రింది వ్యాపార స్థాపనకు నిర్మిత మూల్యాంకనాన్ని అందిస్తుంది:', summaryB: 'ఈ వ్యాపారానికి అంచనా మొత్తం మూలధన అవసరం', summaryC: 'దీనిలో 10% উদ্যమి మార్జిన్ మరియు సిఫార్సు పథకం కింద 90% రుణ నిధులు ఉంటాయి.', block: 'బ్లాక్', district: 'జిల్లా', feasibilityVerdict: 'అల్గోరిథమిక్ సాధ్యత తీర్పు', genericRecommendation: 'ఈ అవకాశానికి బలమైన స్థానిక పునాది ఉంది. నియంత్రిత పెట్టుబడితో ప్రారంభించి, నిరంతర డిమాండ్‌ను నిర్ధారించి, వర్కింగ్ క్యాపిటల్ మరియు నాణ్యత నియంత్రణను క్రమబద్ధంగా నిర్వహించండి.', section2: '2. మూలధన నిర్మాణం మరియు రుణ నిబంధనలు', entrepreneurMargin: '10% উদ্যమి మార్జిన్', totalProjectCost: '100% మొత్తం ప్రాజెక్ట్ వ్యయం', sanctionedLoan: '90% ప్రతిపాదిత రుణం', monthlyDebtService: 'నెలవారీ రుణ చెల్లింపు', deploymentHead: 'మూలధన వినియోగ విభాగం', specification: 'వివరణ', estimatedAmount: 'అంచనా మొత్తం', capex: 'మూలధన వ్యయం', capexSpec: 'యంత్రాలు, పరికరాలు మరియు అవసరమైన ఏర్పాటు', inventory: 'ప్రారంభ నిల్వ', inventorySpec: 'ప్రారంభ కొనుగోలు, వినియోగ వస్తువులు మరియు ప్యాకేజింగ్', workingCapital: 'వర్కింగ్ క్యాపిటల్', workingCapitalSpec: 'ఆపరేటింగ్ నగదు, యుటిలిటీలు మరియు అత్యవసర నిల్వ', totalOutlay: 'మొత్తం అంచనా ప్రాజెక్ట్ వ్యయం', section3: '3. ప్రభుత్వ పథకం సిఫార్సు', optionB: 'ఎంపిక B', rateTenure: 'ఏటా 8.0% • 7 సంవత్సరాల కాలం', genericSchemeRationale: 'ఈ ఆర్థిక నిర్మాణం సూక్ష్మ వ్యాపారానికి అనుకూలంగా ఉండవచ్చు. దరఖాస్తు ముందు ప్రస్తుత బ్యాంకు మరియు పథకం అర్హతను అధికారికంగా తనిఖీ చేయండి.', moratorium: 'మొరటోరియం', monthsGrace: 'నెలల గడువు', estimatedBreakEven: 'అంచనా బ్రేక్-ఈవెన్', months: 'నెలలు', monthlyNetProfit: 'నెలవారీ నికర లాభం', section4: '4. SWOT వ్యూహాత్మక మ్యాట్రిక్స్', strengths: 'బలాలు', weaknesses: 'బలహీనతలు', opportunities: 'అవకాశాలు', threats: 'ప్రమాదాలు మరియు నివారణ', genericStrength: 'నిరంతర స్థానిక డిమాండ్ మరియు వినియోగదారుల సమీపం స్థిర విక్రయాలకు తోడ్పడుతుంది.', genericWeakness: 'వర్కింగ్ క్యాపిటల్, నాణ్యత నియంత్రణ మరియు సరఫరాదారుల విశ్వసనీయతను క్రమంగా పర్యవేక్షించాలి.', genericOpportunity: 'సమీప గ్రామాలు, సంస్థాగత కొనుగోలుదారులు మరియు విలువ జోడించిన ఉత్పత్తులు ఆదాయాన్ని పెంచవచ్చు.', genericThreat: 'ధరల మార్పు, స్థానిక పోటీ మరియు ఆపరేషనల్ అంతరాయాలకు రిజర్వ్ మరియు ప్రత్యామ్నాయ సరఫరాదారులు అవసరం.', section5: '5. উদ্যమి కార్యాచరణ జాబితా', nextSteps: [
      { title: 'ఉచిత Udyam MSME నమోదు పూర్తి చేయండి', desc: 'ఆధార్‌తో అధికారిక Udyam పోర్టల్‌లో వ్యాపార నమోదు సంఖ్య పొందండి.' },
      { title: 'ప్రత్యేక వ్యాపార కరెంట్ ఖాతా తెరవండి', desc: 'వ్యాపార ఆదాయం, ఖర్చులు మరియు రుణ లావాదేవీలను వ్యక్తిగత ఖాతా నుంచి వేరు చేయండి.' },
      { title: '2 యంత్ర/సరఫరాదారు కోటేషన్లు పొందండి', desc: 'బ్యాంకు మూల్యాంకనానికి ప్రధాన పరికరాల ప్రోఫార్మా ఇన్వాయిస్‌లు సేకరించండి.' },
      { title: '5 స్థానిక కస్టమర్/సరఫరా హామీలు పొందండి', desc: 'సమీప కుటుంబాలు, దుకాణాలు లేదా సంస్థల ప్రారంభ డిమాండ్‌ను నమోదు చేయండి.' },
      { title: 'రుణ/పథకం దరఖాస్తు సమర్పించండి', desc: 'గుర్తింపు, కోటేషన్లు మరియు సహాయక పత్రాలతో ప్రణాళికను బ్యాంకు లేదా సంస్థకు ఇవ్వండి.' },
    ], referencesTitle: 'సంస్థాగత ఆధారాలు మరియు విధానం', referencesText: 'ప్రణాళిక RBI చిన్న వ్యాపార మార్గదర్శకాలు, MSME Udyam వర్గీకరణ మరియు డిజిటల్ సహాయ పరిశోధనను సూచిస్తుంది. ప్రస్తుత నియమాలను అధికారిక మూలాల ద్వారా తనిఖీ చేయండి.', disclaimerTitle: 'అధికారిక నిరాకరణ', disclaimerText: 'ఈ నివేదిక AI-సహాయక నిర్ణయ మద్దతు నమూనా మాత్రమే. ఇది రుణ ఆమోదం, అధికారిక క్రెడిట్ హామీ లేదా ఆర్థిక గ్యారంటీ కాదు. తుది అర్హత మరియు ఆమోదం అధికారిక నియమాలు మరియు బ్యాంకు మూల్యాంకనంపై ఆధారపడి ఉంటుంది.', declaration: 'ఉద్యమి ప్రకటన', signature: 'దరఖాస్తుదారు సంతకం / బొటనవేలు ముద్ర', verification: 'సలహా వ్యవస్థ ధృవీకరణ', prototype: 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 నమూనా',
  },
  kn: {
    reportTitle: 'ಅಂತಿಮ ವ್ಯಾಪಾರ ಯೋಜನೆ', reportSubtitle: 'ಸಮಗ್ರ ನಿರ್ಧಾರ-ಸಹಾಯ ಮತ್ತು ಹಣಕಾಸು ದಾಖಲೆ', dossierLabel: 'SIH26091 ಉದ್ಯಮ ಸಲಹಾ ದಾಖಲೆ', documentTitle: 'ಸಮಗ್ರ ಗ್ರಾಮೀಣ ವ್ಯಾಪಾರ ಯೋಜನೆ', project: 'ಯೋಜನೆ', category: 'ವರ್ಗ', generatedFor: 'ತಯಾರಿಸಿದ ಪ್ರದೇಶ', state: 'ರಾಜ್ಯ', date: 'ದಿನಾಂಕ', documentRef: 'ದಾಖಲೆ ಉಲ್ಲೇಖ', section1: '1. ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ ಮತ್ತು ಕಾರ್ಯತಂತ್ರದ ಸಾಧ್ಯತೆ', summaryA: 'ಈ ವ್ಯಾಪಾರ ಸಲಹಾ ವರದಿ ಕೆಳಗಿನ ಉದ್ಯಮ ಸ್ಥಾಪನೆಗೆ ರಚಿತ ಮೌಲ್ಯಮಾಪನ ನೀಡುತ್ತದೆ:', summaryB: 'ಉದ್ಯಮದ ಅಂದಾಜು ಒಟ್ಟು ಬಂಡವಾಳ ಅಗತ್ಯ', summaryC: 'ಇದರಲ್ಲಿ 10% ಉದ್ಯಮಿ ಮಾರ್ಜಿನ್ ಮತ್ತು ಶಿಫಾರಸು ಯೋಜನೆಯಡಿ 90% ಸಾಲ ಹಣಕಾಸು ಒಳಗೊಂಡಿದೆ.', block: 'ಬ್ಲಾಕ್', district: 'ಜಿಲ್ಲೆ', feasibilityVerdict: 'ಅಲ್ಗೋರಿದಮಿಕ್ ಸಾಧ್ಯತಾ ತೀರ್ಪು', genericRecommendation: 'ಈ ಅವಕಾಶಕ್ಕೆ ಉತ್ತಮ ಸ್ಥಳೀಯ ಆಧಾರವಿದೆ. ನಿಯಂತ್ರಿತ ಹೂಡಿಕೆಯಿಂದ ಪ್ರಾರಂಭಿಸಿ, ಮರುಕಳಿಸುವ ಬೇಡಿಕೆಯನ್ನು ದೃಢಪಡಿಸಿ ಮತ್ತು ಕಾರ್ಯನಿಧಿ ಹಾಗೂ ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣವನ್ನು ಶಿಸ್ತಿನಿಂದ ನಿರ್ವಹಿಸಿ.', section2: '2. ಬಂಡವಾಳ ರಚನೆ ಮತ್ತು ಸಾಲ ಷರತ್ತುಗಳು', entrepreneurMargin: '10% ಉದ್ಯಮಿ ಮಾರ್ಜಿನ್', totalProjectCost: '100% ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ', sanctionedLoan: '90% ಪ್ರಸ್ತಾವಿತ ಸಾಲ', monthlyDebtService: 'ಮಾಸಿಕ ಸಾಲ ಪಾವತಿ', deploymentHead: 'ಬಂಡವಾಳ ಬಳಕೆ ವಿಭಾಗ', specification: 'ವಿವರ', estimatedAmount: 'ಅಂದಾಜು ಮೊತ್ತ', capex: 'ಬಂಡವಾಳ ವೆಚ್ಚ', capexSpec: 'ಯಂತ್ರೋಪಕರಣ, ಸಾಧನಗಳು ಮತ್ತು ಅಗತ್ಯ ಸ್ಥಾಪನೆ', inventory: 'ಆರಂಭಿಕ ಸಂಗ್ರಹ', inventorySpec: 'ಆರಂಭಿಕ ಖರೀದಿ, ಬಳಕೆ ವಸ್ತುಗಳು ಮತ್ತು ಪ್ಯಾಕೇಜಿಂಗ್', workingCapital: 'ಕಾರ್ಯನಿಧಿ', workingCapitalSpec: 'ಕಾರ್ಯಾಚರಣಾ ನಗದು, ಉಪಯೋಗ ವೆಚ್ಚ ಮತ್ತು ತುರ್ತು ನಿಧಿ', totalOutlay: 'ಒಟ್ಟು ಅಂದಾಜು ಯೋಜನಾ ವೆಚ್ಚ', section3: '3. ಸರ್ಕಾರಿ ಯೋಜನೆ ಶಿಫಾರಸು', optionB: 'ಆಯ್ಕೆ B', rateTenure: 'ವಾರ್ಷಿಕ 8.0% • 7 ವರ್ಷ ಅವಧಿ', genericSchemeRationale: 'ಈ ಹಣಕಾಸು ರಚನೆ ಸೂಕ್ಷ್ಮ ಉದ್ಯಮಕ್ಕೆ ಸೂಕ್ತವಾಗಿರಬಹುದು. ಅರ್ಜಿಗೆ ಮೊದಲು ಪ್ರಸ್ತುತ ಬ್ಯಾಂಕ್ ಮತ್ತು ಯೋಜನಾ ಅರ್ಹತೆಯನ್ನು ಅಧಿಕೃತವಾಗಿ ಪರಿಶೀಲಿಸಿ.', moratorium: 'ಮೋರೇಟೋರಿಯಂ', monthsGrace: 'ತಿಂಗಳ ವಿನಾಯಿತಿ', estimatedBreakEven: 'ಅಂದಾಜು ಬ್ರೇಕ್-ಈವನ್', months: 'ತಿಂಗಳು', monthlyNetProfit: 'ಮಾಸಿಕ ಶುದ್ಧ ಲಾಭ', section4: '4. SWOT ಕಾರ್ಯತಂತ್ರ ಮ್ಯಾಟ್ರಿಕ್ಸ್', strengths: 'ಶಕ್ತಿಗಳು', weaknesses: 'ದುರ್ಬಲತೆಗಳು', opportunities: 'ಅವಕಾಶಗಳು', threats: 'ಅಪಾಯಗಳು ಮತ್ತು ಪರಿಹಾರ', genericStrength: 'ಮರುಕಳಿಸುವ ಸ್ಥಳೀಯ ಬೇಡಿಕೆ ಮತ್ತು ಗ್ರಾಹಕರ ಸಮೀಪತೆ ಸ್ಥಿರ ಮಾರಾಟಕ್ಕೆ ನೆರವಾಗುತ್ತದೆ.', genericWeakness: 'ಕಾರ್ಯನಿಧಿ, ಗುಣಮಟ್ಟ ನಿಯಂತ್ರಣ ಮತ್ತು ಸರಬರಾಜುದಾರರ ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಗಮನಿಸಬೇಕು.', genericOpportunity: 'ಸಮೀಪದ ಗ್ರಾಮಗಳು, ಸಂಸ್ಥಾತ್ಮಕ ಖರೀದಿದಾರರು ಮತ್ತು ಮೌಲ್ಯವರ್ಧಿತ ಉತ್ಪನ್ನಗಳು ಆದಾಯ ಹೆಚ್ಚಿಸಬಹುದು.', genericThreat: 'ಬೆಲೆ ಏರಿಳಿತ, ಸ್ಥಳೀಯ ಸ್ಪರ್ಧೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣಾ ಅಡಚಣೆಗಳಿಗೆ ಮೀಸಲು ನಿಧಿ ಮತ್ತು ಪರ್ಯಾಯ ಸರಬರಾಜುದಾರರು ಅಗತ್ಯ.', section5: '5. ಉದ್ಯಮಿ ನೆಲಮಟ್ಟದ ಕಾರ್ಯಪಟ್ಟಿ', nextSteps: [
      { title: 'ಉಚಿತ Udyam MSME ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ', desc: 'ಆಧಾರ್ ಮೂಲಕ ಅಧಿಕೃತ Udyam ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಉದ್ಯಮ ನೋಂದಣಿ ಸಂಖ್ಯೆ ಪಡೆಯಿರಿ.' },
      { title: 'ಪ್ರತ್ಯೇಕ ವ್ಯವಹಾರ ಚಾಲ್ತಿ ಖಾತೆ ತೆರೆಯಿರಿ', desc: 'ವ್ಯವಹಾರ ಆದಾಯ, ವೆಚ್ಚ ಮತ್ತು ಸಾಲ ವಹಿವಾಟನ್ನು ವೈಯಕ್ತಿಕ ಖಾತೆಯಿಂದ ಬೇರ್ಪಡಿಸಿ.' },
      { title: '2 ಯಂತ್ರ/ಸರಬರಾಜುದಾರ ಕೊಟೇಶನ್ ಪಡೆಯಿರಿ', desc: 'ಬ್ಯಾಂಕ್ ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ಪ್ರಮುಖ ಸಾಧನಗಳ ಪ್ರೊಫಾರ್ಮಾ ಇನ್ವಾಯ್ಸ್ ಸಂಗ್ರಹಿಸಿ.' },
      { title: '5 ಸ್ಥಳೀಯ ಗ್ರಾಹಕ/ಪೂರೈಕೆ ಬದ್ಧತೆ ದೃಢಪಡಿಸಿ', desc: 'ಸಮೀಪದ ಮನೆ, ಅಂಗಡಿ ಅಥವಾ ಸಂಸ್ಥೆಗಳ ಆರಂಭಿಕ ಬೇಡಿಕೆಯನ್ನು ದಾಖಲಿಸಿ.' },
      { title: 'ಸಾಲ/ಯೋಜನೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ', desc: 'ಗುರುತು, ಕೊಟೇಶನ್ ಮತ್ತು ಸಹಾಯಕ ದಾಖಲೆಗಳೊಂದಿಗೆ ಯೋಜನೆಯನ್ನು ಬ್ಯಾಂಕ್ ಅಥವಾ ಸಂಸ್ಥೆಗೆ ಸಲ್ಲಿಸಿ.' },
    ], referencesTitle: 'ಸಂಸ್ಥಾತ್ಮಕ ಉಲ್ಲೇಖಗಳು ಮತ್ತು ವಿಧಾನ', referencesText: 'ಯೋಜನೆ RBI ಸಣ್ಣ ಉದ್ಯಮ ಮಾರ್ಗದರ್ಶನ, MSME Udyam ವರ್ಗೀಕರಣ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಹಾಯ ಸಂಶೋಧನೆಯನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತದೆ. ಪ್ರಸ್ತುತ ನಿಯಮಗಳನ್ನು ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ ಪರಿಶೀಲಿಸಿ.', disclaimerTitle: 'ಅಧಿಕೃತ ನಿರಾಕರಣೆ', disclaimerText: 'ಈ ವರದಿ AI-ಸಹಾಯಿತ ನಿರ್ಧಾರ-ಬೆಂಬಲ ಮಾದರಿ ಮಾತ್ರ. ಇದು ಸಾಲ ಅನುಮೋದನೆ, ಅಧಿಕೃತ ಕ್ರೆಡಿಟ್ ಬೆಂಬಲ ಅಥವಾ ಹಣಕಾಸು ಖಾತರಿ ಅಲ್ಲ. ಅಂತಿಮ ಅರ್ಹತೆ ಮತ್ತು ಅನುಮೋದನೆ ಅಧಿಕೃತ ನಿಯಮಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್ ಮೌಲ್ಯಮಾಪನಕ್ಕೆ ಒಳಪಟ್ಟಿವೆ.', declaration: 'ಉದ್ಯಮಿ ಘೋಷಣೆ', signature: 'ಅರ್ಜಿದಾರರ ಸಹಿ / ಬೆರಳಚ್ಚು', verification: 'ಸಲಹಾ ವ್ಯವಸ್ಥೆ ಪರಿಶೀಲನೆ', prototype: 'ಸ್ಮಾರ್ಟ್ ಇಂಡಿಯಾ ಹ್ಯಾಕಥಾನ್ 2026 ಮಾದರಿ',
  },
  gu: {
    reportTitle: 'અંતિમ વ્યવસાય યોજના', reportSubtitle: 'સમગ્ર નિર્ણય સહાય અને નાણાકીય દસ્તાવેજ', dossierLabel: 'SIH26091 ઉદ્યોગ સલાહ દસ્તાવેજ', documentTitle: 'સમગ્ર ગ્રામ્ય વ્યવસાય યોજના', project: 'પ્રોજેક્ટ', category: 'શ્રેણી', generatedFor: 'તૈયાર કરાયું', state: 'રાજ્ય', date: 'તારીખ', documentRef: 'દસ્તાવેજ સંદર્ભ', section1: '1. કાર્યકારી સારાંશ અને વ્યૂહાત્મક વ્યવહાર્યતા', summaryA: 'આ વ્યવસાય સલાહ અહેવાલ નીચેના ઉદ્યોગની સ્થાપના માટે રચનાત્મક મૂલ્યાંકન આપે છે:', summaryB: 'ઉદ્યોગ માટેનો અંદાજિત કુલ મૂડી ખર્ચ', summaryC: 'જેમાં 10% ઉદ્યોગસાહસિક માર્જિન અને ભલામણ કરેલી યોજના હેઠળ 90% દેવું નાણાકીય સહાયનો સમાવેશ થાય છે.', block: 'બ્લોક', district: 'જિલ્લો', feasibilityVerdict: 'અલ્ગોરિધમિક વ્યવહાર્યતા નિર્ણય', genericRecommendation: 'આ તકમાં સારો સ્થાનિક આધાર દેખાય છે. નિયંત્રિત રોકાણથી શરૂઆત કરો, નિયમિત માંગ ચકાસો અને વર્કિંગ કેપિટલ તથા ગુણવત્તા નિયંત્રણમાં શિસ્ત રાખો.', section2: '2. મૂડી માળખું અને લોનની શરતો', entrepreneurMargin: '10% ઉદ્યોગસાહસિક માર્જિન', totalProjectCost: '100% કુલ પ્રોજેક્ટ ખર્ચ', sanctionedLoan: '90% પ્રસ્તાવિત લોન', monthlyDebtService: 'માસિક દેવું ચૂકવણી', deploymentHead: 'મૂડી ઉપયોગ વિભાગ', specification: 'વિગત', estimatedAmount: 'અંદાજિત રકમ', capex: 'મૂડી ખર્ચ', capexSpec: 'મશીનરી, સાધનો અને જરૂરી સ્થાપના', inventory: 'પ્રારંભિક સ્ટોક', inventorySpec: 'પ્રારંભિક ખરીદી, વપરાશ સામગ્રી અને પેકેજિંગ', workingCapital: 'વર્કિંગ કેપિટલ', workingCapitalSpec: 'ચાલુ નાણાં, યુટિલિટી ખર્ચ અને આકસ્મિક રિઝર્વ', totalOutlay: 'કુલ અંદાજિત પ્રોજેક્ટ ખર્ચ', section3: '3. સરકારી યોજના ભલામણ', optionB: 'વિકલ્પ B', rateTenure: 'વાર્ષિક 8.0% • 7 વર્ષ અવધિ', genericSchemeRationale: 'આ નાણાકીય માળખું સૂક્ષ્મ ઉદ્યોગ માટે યોગ્ય હોઈ શકે છે. અરજી પહેલાં વર્તમાન બેંક અને યોજના પાત્રતા નિયમોની સત્તાવાર ખાતરી કરો.', moratorium: 'મોરેટોરિયમ', monthsGrace: 'મહિના રાહત', estimatedBreakEven: 'અંદાજિત બ્રેક-ઈવન', months: 'મહિના', monthlyNetProfit: 'માસિક શુદ્ધ નફો', section4: '4. SWOT વ્યૂહાત્મક મેટ્રિક્સ', strengths: 'મજબૂતીઓ', weaknesses: 'કમજોરીઓ', opportunities: 'તકો', threats: 'જોખમ અને નિવારણ', genericStrength: 'નિયમિત સ્થાનિક માંગ અને ગ્રાહકોની નજીકતા સ્થિર વેચાણને ટેકો આપે છે.', genericWeakness: 'વર્કિંગ કેપિટલ, ગુણવત્તા નિયંત્રણ અને સપ્લાયર વિશ્વસનીયતા પર નજર જરૂરી છે.', genericOpportunity: 'નજીકના ગામો, સંસ્થાકીય ખરીદદારો અને મૂલ્યવર્ધિત ઉત્પાદનો આવક વધારી શકે છે.', genericThreat: 'ભાવમાં ફેરફાર, સ્થાનિક સ્પર્ધા અને કાર્યમાં વિક્ષેપ માટે રિઝર્વ અને વિકલ્પ સપ્લાયર રાખો.', section5: '5. ઉદ્યોગસાહસિક કાર્યયાદી', nextSteps: [
      { title: 'મફત Udyam MSME નોંધણી પૂર્ણ કરો', desc: 'આધાર દ્વારા સત્તાવાર Udyam પોર્ટલ પર ઉદ્યોગ નોંધણી નંબર મેળવો.' },
      { title: 'અલગ વ્યવસાય કરન્ટ એકાઉન્ટ ખોલો', desc: 'વ્યવસાય આવક, ખર્ચ અને લોન વ્યવહાર વ્યક્તિગત વ્યવહારથી અલગ રાખો.' },
      { title: '2 મશીનરી/સપ્લાયર ક્વોટેશન મેળવો', desc: 'બેંક મૂલ્યાંકન માટે મુખ્ય સાધનોના પ્રોફોર્મા ઇન્વોઇસ મેળવો.' },
      { title: '5 સ્થાનિક ગ્રાહક/સપ્લાય પ્રતિબદ્ધતા મેળવો', desc: 'નજીકના ઘરો, દુકાનો અથવા સંસ્થાકીય ખરીદદારોની પ્રારંભિક માંગ નોંધો.' },
      { title: 'લોન/યોજનાનો અરજીપત્ર સબમિટ કરો', desc: 'ઓળખ, ક્વોટેશન અને સહાયક દસ્તાવેજો સાથે યોજના સંબંધિત બેંક અથવા એજન્સીને આપો.' },
    ], referencesTitle: 'સંસ્થાકીય સંદર્ભ અને પદ્ધતિ', referencesText: 'યોજનામાં RBI નાના ઉદ્યોગ માર્ગદર્શન, MSME Udyam વર્ગીકરણ અને ડિજિટલ સહાય સંશોધનનો સંદર્ભ છે. વર્તમાન નિયમોને સત્તાવાર સ્ત્રોતથી ચકાસો.', disclaimerTitle: 'સત્તાવાર અસ્વીકરણ', disclaimerText: 'આ અહેવાલ AI-સહાયિત નિર્ણય સહાય પ્રોટોટાઇપ છે. તે લોન મંજૂરી, સત્તાવાર ક્રેડિટ સમર્થન અથવા નાણાકીય ગેરંટી નથી. અંતિમ પાત્રતા અને મંજૂરી સત્તાવાર નિયમો અને બેંક મૂલ્યાંકનને આધિન છે.', declaration: 'ઉદ્યોગસાહસિક ઘોષણા', signature: 'અરજદાર હસ્તાક્ષર / અંગૂઠાનો છાપ', verification: 'સલાહ સિસ્ટમ ચકાસણી', prototype: 'સ્માર્ટ ઇન્ડિયા હેકાથોન 2026 પ્રોટોટાઇપ',
  },
  pa: {
    reportTitle: 'ਅੰਤਿਮ ਕਾਰੋਬਾਰੀ ਯੋਜਨਾ', reportSubtitle: 'ਸੰਪੂਰਨ ਫੈਸਲਾ-ਸਹਾਇਤਾ ਅਤੇ ਵਿੱਤੀ ਦਸਤਾਵੇਜ਼', dossierLabel: 'SIH26091 ਉਦਯੋਗ ਸਲਾਹ ਦਸਤਾਵੇਜ਼', documentTitle: 'ਸੰਪੂਰਨ ਪੇਂਡੂ ਕਾਰੋਬਾਰੀ ਯੋਜਨਾ', project: 'ਪ੍ਰੋਜੈਕਟ', category: 'ਸ਼੍ਰੇਣੀ', generatedFor: 'ਇਸ ਲਈ ਤਿਆਰ', state: 'ਰਾਜ', date: 'ਤਾਰੀਖ', documentRef: 'ਦਸਤਾਵੇਜ਼ ਹਵਾਲਾ', section1: '1. ਕਾਰਜਕਾਰੀ ਸਾਰ ਅਤੇ ਰਣਨੀਤਿਕ ਸੰਭਾਵਨਾ', summaryA: 'ਇਹ ਕਾਰੋਬਾਰੀ ਸਲਾਹ ਰਿਪੋਰਟ ਹੇਠਲੇ ਉਦਯੋਗ ਦੀ ਸਥਾਪਨਾ ਲਈ ਢਾਂਚੇਬੱਧ ਮੁਲਾਂਕਣ ਦਿੰਦੀ ਹੈ:', summaryB: 'ਉਦਯੋਗ ਲਈ ਅੰਦਾਜ਼ਿਤ ਕੁੱਲ ਪੂੰਜੀ ਦੀ ਲੋੜ', summaryC: 'ਜਿਸ ਵਿੱਚ 10% ਉਦਯੋਗਪਤੀ ਮਾਰਜਿਨ ਅਤੇ ਸਿਫਾਰਸ਼ੀ ਯੋਜਨਾ ਹੇਠ 90% ਕਰਜ਼ ਵਿੱਤ ਸ਼ਾਮਲ ਹੈ।', block: 'ਬਲਾਕ', district: 'ਜ਼ਿਲ੍ਹਾ', feasibilityVerdict: 'ਐਲਗੋਰਿਦਮਿਕ ਸੰਭਾਵਨਾ ਨਤੀਜਾ', genericRecommendation: 'ਇਸ ਮੌਕੇ ਵਿੱਚ ਮਜ਼ਬੂਤ ਸਥਾਨਕ ਆਧਾਰ ਹੈ। ਨਿਯੰਤਰਿਤ ਨਿਵੇਸ਼ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ, ਨਿਯਮਿਤ ਮੰਗ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਵਰਕਿੰਗ ਕੈਪੀਟਲ ਅਤੇ ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਵਿੱਚ ਅਨੁਸ਼ਾਸਨ ਰੱਖੋ।', section2: '2. ਪੂੰਜੀ ਢਾਂਚਾ ਅਤੇ ਕਰਜ਼ ਦੀਆਂ ਸ਼ਰਤਾਂ', entrepreneurMargin: '10% ਉਦਯੋਗਪਤੀ ਮਾਰਜਿਨ', totalProjectCost: '100% ਕੁੱਲ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ', sanctionedLoan: '90% ਪ੍ਰਸਤਾਵਿਤ ਕਰਜ਼', monthlyDebtService: 'ਮਹੀਨਾਵਾਰ ਕਰਜ਼ ਭੁਗਤਾਨ', deploymentHead: 'ਪੂੰਜੀ ਵਰਤੋਂ ਸਿਰਲੇਖ', specification: 'ਵੇਰਵਾ', estimatedAmount: 'ਅੰਦਾਜ਼ਿਤ ਰਕਮ', capex: 'ਪੂੰਜੀ ਖਰਚ', capexSpec: 'ਮਸ਼ੀਨਰੀ, ਸਾਜ਼ੋ-ਸਾਮਾਨ ਅਤੇ ਲੋੜੀਂਦੀ ਸਥਾਪਨਾ', inventory: 'ਸ਼ੁਰੂਆਤੀ ਸਟਾਕ', inventorySpec: 'ਸ਼ੁਰੂਆਤੀ ਖਰੀਦ, ਵਰਤੋਂ ਸਮੱਗਰੀ ਅਤੇ ਪੈਕੇਜਿੰਗ', workingCapital: 'ਵਰਕਿੰਗ ਕੈਪੀਟਲ', workingCapitalSpec: 'ਚਾਲੂ ਨਕਦ, ਯੂਟਿਲਿਟੀ ਖਰਚ ਅਤੇ ਐਮਰਜੈਂਸੀ ਰਿਜ਼ਰਵ', totalOutlay: 'ਕੁੱਲ ਅੰਦਾਜ਼ਿਤ ਪ੍ਰੋਜੈਕਟ ਲਾਗਤ', section3: '3. ਸਰਕਾਰੀ ਯੋਜਨਾ ਸਿਫਾਰਸ਼', optionB: 'ਵਿਕਲਪ B', rateTenure: 'ਸਾਲਾਨਾ 8.0% • 7 ਸਾਲ ਮਿਆਦ', genericSchemeRationale: 'ਇਹ ਵਿੱਤੀ ਢਾਂਚਾ ਸੂਖਮ ਉਦਯੋਗ ਲਈ ਢੁਕਵਾਂ ਹੋ ਸਕਦਾ ਹੈ। ਅਰਜ਼ੀ ਤੋਂ ਪਹਿਲਾਂ ਮੌਜੂਦਾ ਬੈਂਕ ਅਤੇ ਯੋਜਨਾ ਯੋਗਤਾ ਦੀ ਅਧਿਕਾਰਿਕ ਪੁਸ਼ਟੀ ਕਰੋ।', moratorium: 'ਮੋਰਾਟੋਰਿਅਮ', monthsGrace: 'ਮਹੀਨੇ ਦੀ ਰਾਹਤ', estimatedBreakEven: 'ਅੰਦਾਜ਼ਿਤ ਬ੍ਰੇਕ-ਈਵਨ', months: 'ਮਹੀਨੇ', monthlyNetProfit: 'ਮਹੀਨਾਵਾਰ ਸ਼ੁੱਧ ਲਾਭ', section4: '4. SWOT ਰਣਨੀਤਿਕ ਮੈਟ੍ਰਿਕਸ', strengths: 'ਮਜ਼ਬੂਤੀਆਂ', weaknesses: 'ਕਮਜ਼ੋਰੀਆਂ', opportunities: 'ਮੌਕੇ', threats: 'ਖਤਰੇ ਅਤੇ ਹੱਲ', genericStrength: 'ਨਿਯਮਿਤ ਸਥਾਨਕ ਮੰਗ ਅਤੇ ਗਾਹਕਾਂ ਦੀ ਨੇੜਤਾ ਸਥਿਰ ਵਿਕਰੀ ਨੂੰ ਸਹਾਰਾ ਦਿੰਦੀ ਹੈ।', genericWeakness: 'ਵਰਕਿੰਗ ਕੈਪੀਟਲ, ਗੁਣਵੱਤਾ ਨਿਯੰਤਰਣ ਅਤੇ ਸਪਲਾਇਰ ਭਰੋਸੇਯੋਗਤਾ ਦੀ ਨਿਗਰਾਨੀ ਲਾਜ਼ਮੀ ਹੈ।', genericOpportunity: 'ਨਜ਼ਦੀਕੀ ਪਿੰਡ, ਸੰਸਥਾਗਤ ਖਰੀਦਦਾਰ ਅਤੇ ਮੁੱਲ-ਵਧੇਰੇ ਉਤਪਾਦ ਆਮਦਨ ਵਧਾ ਸਕਦੇ ਹਨ।', genericThreat: 'ਕੀਮਤ ਉਤਾਰ-ਚੜ੍ਹਾਅ, ਸਥਾਨਕ ਮੁਕਾਬਲੇ ਅਤੇ ਕਾਰੋਬਾਰੀ ਰੁਕਾਵਟ ਲਈ ਰਿਜ਼ਰਵ ਅਤੇ ਬਦਲ ਸਪਲਾਇਰ ਰੱਖੋ।', section5: '5. ਉਦਯੋਗਪਤੀ ਮੈਦਾਨੀ ਕਾਰਵਾਈ ਸੂਚੀ', nextSteps: [
      { title: 'ਮੁਫ਼ਤ Udyam MSME ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰੋ', desc: 'ਆਧਾਰ ਰਾਹੀਂ ਸਰਕਾਰੀ Udyam ਪੋਰਟਲ ਤੋਂ ਉਦਯੋਗ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ ਲਵੋ।' },
      { title: 'ਵੱਖਰਾ ਕਾਰੋਬਾਰੀ ਕਰੰਟ ਖਾਤਾ ਖੋਲ੍ਹੋ', desc: 'ਕਾਰੋਬਾਰੀ ਆਮਦਨ, ਖਰਚ ਅਤੇ ਕਰਜ਼ ਲੈਣ-ਦੇਣ ਨੂੰ ਨਿੱਜੀ ਖਾਤੇ ਤੋਂ ਵੱਖ ਰੱਖੋ।' },
      { title: '2 ਮਸ਼ੀਨਰੀ/ਸਪਲਾਇਰ ਕੋਟੇਸ਼ਨ ਲਵੋ', desc: 'ਬੈਂਕ ਮੁਲਾਂਕਣ ਲਈ ਮੁੱਖ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਦੀ ਪ੍ਰੋਫਾਰਮਾ ਇਨਵੌਇਸ ਇਕੱਠੀ ਕਰੋ।' },
      { title: '5 ਸਥਾਨਕ ਗਾਹਕ/ਸਪਲਾਈ ਵਚਨਬੱਧਤਾਵਾਂ ਲਵੋ', desc: 'ਨਜ਼ਦੀਕੀ ਘਰਾਂ, ਦੁਕਾਨਾਂ ਜਾਂ ਸੰਸਥਾਵਾਂ ਤੋਂ ਸ਼ੁਰੂਆਤੀ ਮੰਗ ਦਰਜ ਕਰੋ।' },
      { title: 'ਕਰਜ਼/ਯੋਜਨਾ ਅਰਜ਼ੀ ਦਾਖਲ ਕਰੋ', desc: 'ਪਛਾਣ, ਕੋਟੇਸ਼ਨ ਅਤੇ ਸਹਾਇਕ ਦਸਤਾਵੇਜ਼ਾਂ ਨਾਲ ਯੋਜਨਾ ਸੰਬੰਧਤ ਬੈਂਕ ਜਾਂ ਏਜੰਸੀ ਨੂੰ ਦਿਓ।' },
    ], referencesTitle: 'ਸੰਸਥਾਗਤ ਹਵਾਲੇ ਅਤੇ ਵਿਧੀ', referencesText: 'ਯੋਜਨਾ RBI ਛੋਟੇ ਉਦਯੋਗ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼, MSME Udyam ਵਰਗੀਕਰਨ ਅਤੇ ਡਿਜ਼ਿਟਲ ਸਹਾਇਤਾ ਖੋਜ ਦਾ ਹਵਾਲਾ ਲੈਂਦੀ ਹੈ। ਮੌਜੂਦਾ ਨਿਯਮ ਸਰਕਾਰੀ ਸਰੋਤਾਂ ਤੋਂ ਜਾਂਚੋ।', disclaimerTitle: 'ਅਧਿਕਾਰਿਕ ਅਸਵੀਕਰਨ', disclaimerText: 'ਇਹ ਰਿਪੋਰਟ AI-ਸਹਾਇਤ ਫੈਸਲਾ-ਸਹਾਇਤਾ ਪ੍ਰੋਟੋਟਾਈਪ ਹੈ। ਇਹ ਕਰਜ਼ ਮਨਜ਼ੂਰੀ, ਅਧਿਕਾਰਿਕ ਕਰੈਡਿਟ ਸਮਰਥਨ ਜਾਂ ਵਿੱਤੀ ਗਾਰੰਟੀ ਨਹੀਂ ਹੈ। ਅੰਤਿਮ ਯੋਗਤਾ ਅਤੇ ਮਨਜ਼ੂਰੀ ਸਰਕਾਰੀ ਨਿਯਮਾਂ ਅਤੇ ਬੈਂਕ ਮੁਲਾਂਕਣ ਦੇ ਅਧੀਨ ਹੈ।', declaration: 'ਉਦਯੋਗਪਤੀ ਘੋਸ਼ਣਾ', signature: 'ਅਰਜ਼ੀਕਾਰ ਹਸਤਾਖਰ / ਅੰਗੂਠਾ ਨਿਸ਼ਾਨ', verification: 'ਸਲਾਹ ਪ੍ਰਣਾਲੀ ਤਸਦੀਕ', prototype: 'ਸਮਾਰਟ ਇੰਡੀਆ ਹੈਕਾਥਾਨ 2026 ਪ੍ਰੋਟੋਟਾਈਪ',
  },
};

const DATE_LOCALES: Record<LanguageCode, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', mr: 'mr-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', gu: 'gu-IN', pa: 'pa-IN',
};

const CATEGORY_MAP: Record<string, Partial<Record<LanguageCode, string>>> = {
  Dairy: { hi: 'डेयरी', bn: 'দুগ্ধ', mr: 'दुग्ध व्यवसाय', ta: 'பால் தொழில்', te: 'పాడి', kn: 'ಹೈನುಗಾರಿಕೆ', gu: 'ડેરી', pa: 'ਡੇਅਰੀ' },
  'Food Processing': { hi: 'खाद्य प्रसंस्करण', bn: 'খাদ্য প্রক্রিয়াকরণ', mr: 'अन्न प्रक्रिया', ta: 'உணவு பதப்படுத்தல்', te: 'ఆహార ప్రాసెసింగ్', kn: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ', gu: 'ખાદ્ય પ્રોસેસિંગ', pa: 'ਭੋਜਨ ਪ੍ਰੋਸੈਸਿੰਗ' },
  Retail: { hi: 'खुदरा', bn: 'খুচরা', mr: 'किरकोळ', ta: 'சில்லறை', te: 'రిటైల్', kn: 'ಚಿಲ್ಲರೆ', gu: 'રિટેલ', pa: 'ਰਿਟੇਲ' },
  Poultry: { hi: 'पोल्ट्री', bn: 'পোলট্রি', mr: 'कुक्कुटपालन', ta: 'கோழிப்பண்ணை', te: 'పౌల్ట్రీ', kn: 'ಕೋಳಿ ಸಾಕಣೆ', gu: 'પોલ્ટ્રી', pa: 'ਪੋਲਟਰੀ' },
  Tailoring: { hi: 'सिलाई', bn: 'দর্জি কাজ', mr: 'शिवणकाम', ta: 'தையல்', te: 'టైలరింగ్', kn: 'ಹೊಲಿಗೆ', gu: 'ટેલરિંગ', pa: 'ਸਿਲਾਈ' },
};

export const getReportCopy = (language: LanguageCode): ReportCopy => C[language] || C.en;
export const getReportDateLocale = (language: LanguageCode): string => DATE_LOCALES[language] || 'en-IN';
export const localizeCategory = (category: string, language: LanguageCode): string => CATEGORY_MAP[category]?.[language] || category;

export const localizeDemoBusinessIdea = (idea: string, language: LanguageCode): string => {
  if (language === 'en') return idea;
  const dairyIdea: Record<LanguageCode, string> = {
    en: idea,
    hi: 'डेयरी एवं दूध संग्रह केंद्र (दही/पनीर/ताज़ा दूध)',
    bn: 'দুগ্ধ ও দুধ সংগ্রহ কেন্দ্র (দই/পনির/তাজা দুধ)',
    mr: 'दुग्ध व दूध संकलन केंद्र (दही/पनीर/ताजे दूध)',
    ta: 'பால் மற்றும் பால் சேகரிப்பு மையம் (தயிர்/பனீர்/புதிய பால்)',
    te: 'పాడి మరియు పాలు సేకరణ కేంద్రం (పెరుగు/పనీర్/తాజా పాలు)',
    kn: 'ಹೈನುಗಾರಿಕೆ ಮತ್ತು ಹಾಲು ಸಂಗ್ರಹ ಕೇಂದ್ರ (ಮೊಸರು/ಪನೀರ್/ತಾಜಾ ಹಾಲು)',
    gu: 'ડેરી અને દૂધ સંગ્રહ કેન્દ્ર (દહીં/પનીર/તાજું દૂધ)',
    pa: 'ਡੇਅਰੀ ਅਤੇ ਦੁੱਧ ਇਕੱਠਾ ਕਰਨ ਕੇਂਦਰ (ਦਹੀਂ/ਪਨੀਰ/ਤਾਜ਼ਾ ਦੁੱਧ)',
  };
  return /dairy|milk collection/i.test(idea) ? dairyIdea[language] : idea;
};

export const getLocalizedFeasibilityStatus = (score: number, language: LanguageCode): string => {
  const positive: Record<LanguageCode, string> = {
    en: 'Promising — proceed with controlled investment',
    hi: 'आशाजनक — नियंत्रित निवेश के साथ आगे बढ़ें',
    bn: 'আশাব্যঞ্জক — নিয়ন্ত্রিত বিনিয়োগে এগিয়ে যান',
    mr: 'आशादायक — नियंत्रित गुंतवणुकीसह पुढे जा',
    ta: 'நம்பிக்கையளிக்கிறது — கட்டுப்படுத்தப்பட்ட முதலீட்டுடன் முன்னேறுங்கள்',
    te: 'ఆశాజనకంగా ఉంది — నియంత్రిత పెట్టుబడితో ముందుకు సాగండి',
    kn: 'ಭರವಸೆಯಿದೆ — ನಿಯಂತ್ರಿತ ಹೂಡಿಕೆಯಿಂದ ಮುಂದುವರಿಯಿರಿ',
    gu: 'આશાસ્પદ — નિયંત્રિત રોકાણ સાથે આગળ વધો',
    pa: 'ਉਮੀਦਵਾਰ — ਨਿਯੰਤਰਿਤ ਨਿਵੇਸ਼ ਨਾਲ ਅੱਗੇ ਵਧੋ',
  };
  const moderate: Record<LanguageCode, string> = {
    en: 'Moderately viable — strengthen key risks before scaling',
    hi: 'मध्यम व्यवहार्यता — विस्तार से पहले प्रमुख जोखिम मजबूत करें',
    bn: 'মাঝারি সম্ভাব্যতা — সম্প্রসারণের আগে মূল ঝুঁকি শক্তভাবে সামলান',
    mr: 'मध्यम व्यवहार्यता — विस्तारापूर्वी प्रमुख धोके नियंत्रित करा',
    ta: 'மிதமான சாத்தியம் — விரிவாக்கத்திற்கு முன் முக்கிய அபாயங்களை சரிசெய்யவும்',
    te: 'మధ్యస్థ సాధ్యత — విస్తరణకు ముందు ప్రధాన ప్రమాదాలను బలోపేతం చేయండి',
    kn: 'ಮಧ್ಯಮ ಸಾಧ್ಯತೆ — ವಿಸ್ತರಣೆಗೆ ಮೊದಲು ಪ್ರಮುಖ ಅಪಾಯಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ',
    gu: 'મધ્યમ વ્યવહાર્યતા — વિસ્તરણ પહેલાં મુખ્ય જોખમો સંભાળો',
    pa: 'ਦਰਮਿਆਨੀ ਸੰਭਾਵਨਾ — ਵਿਸਥਾਰ ਤੋਂ ਪਹਿਲਾਂ ਮੁੱਖ ਜੋਖਮ ਸੰਭਾਲੋ',
  };
  return score >= 70 ? positive[language] : moderate[language];
};
