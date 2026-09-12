import React, { useMemo, useState } from 'react';
import { AssessmentFormData, BusinessCategory, LanguageCode } from '../types';
import {
  ArrowRight,
  BriefcaseBusiness,
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
  bestFor: string;
  benefit: string;
  officialUrl: string;
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
    schemeIds: ['PMEGP', 'MUDRA'],
  },
  {
    name: 'Dairy & Milk Collection Centre',
    category: 'Dairy',
    minCapital: 250000,
    maxCapital: 1500000,
    minLand: 0.15,
    expertise: ['dairy', 'animal', 'farming', 'agriculture'],
    risk: 'Medium',
    reason: 'Recurring local demand and good fit where the user has space plus animal-handling experience.',
    schemeIds: ['PMEGP', 'MUDRA'],
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
    schemeIds: ['PMEGP', 'MUDRA'],
  },
  {
    name: 'Micro Food Processing Unit',
    category: 'Food Processing',
    minCapital: 200000,
    maxCapital: 2000000,
    minLand: 0.04,
    expertise: ['food', 'cooking', 'processing', 'agriculture', 'business'],
    risk: 'Medium',
    reason: 'Can convert local produce into higher-value packaged products and has dedicated scheme support.',
    schemeIds: ['PMFME', 'PMEGP', 'MUDRA'],
  },
  {
    name: 'Plant Nursery & Seedling Business',
    category: 'Agriculture Services',
    minCapital: 80000,
    maxCapital: 600000,
    minLand: 0.08,
    expertise: ['agriculture', 'farming', 'horticulture', 'plants'],
    risk: 'Low',
    reason: 'Good for users with small land parcels, agriculture skills and preference for lower operating risk.',
    schemeIds: ['MUDRA', 'PMEGP'],
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
    schemeIds: ['MUDRA', 'PMEGP'],
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
    schemeIds: ['MUDRA', 'PMEGP'],
  },
  {
    name: 'Local Digital Services & Marketing Agency',
    category: 'Other',
    minCapital: 50000,
    maxCapital: 400000,
    minLand: 0,
    expertise: ['computer', 'digital', 'marketing', 'design', 'coding', 'social media'],
    risk: 'Low',
    reason: 'Best suited to users with digital skills and limited land or capital.',
    schemeIds: ['MUDRA', 'PMEGP'],
  },
  {
    name: 'Handicraft & Artisan Product Unit',
    category: 'Handicrafts',
    minCapital: 70000,
    maxCapital: 800000,
    minLand: 0,
    expertise: ['craft', 'handicraft', 'art', 'design', 'artisan'],
    risk: 'Low',
    reason: 'Skill-driven enterprise that can start small and expand into online or tourism-linked sales.',
    schemeIds: ['MUDRA', 'PMEGP'],
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
    schemeIds: ['PMFME', 'PMEGP', 'MUDRA'],
  },
];

const SCHEMES: SchemeProfile[] = [
  {
    id: 'PMEGP',
    name: 'PMEGP',
    bestFor: 'New micro-enterprises in manufacturing and service sectors',
    benefit: 'Credit-linked support for eligible new projects; final eligibility and subsidy depend on official rules and applicant profile.',
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
  },
  {
    id: 'MUDRA',
    name: 'Pradhan Mantri MUDRA Yojana',
    bestFor: 'Small non-corporate micro businesses needing business credit',
    benefit: 'Useful for small-ticket enterprise finance through participating lenders; loan approval remains lender-dependent.',
    officialUrl: 'https://www.mudra.org.in/',
  },
  {
    id: 'PMFME',
    name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME)',
    bestFor: 'Eligible micro food-processing units',
    benefit: 'Official PMFME materials describe credit-linked capital subsidy support for eligible micro food-processing projects.',
    officialUrl: 'https://pmfme.mofpi.gov.in/',
  },
];

const normalize = (value: string) => value.toLowerCase().trim();

const capitalFit = (capital: number, min: number, max: number) => {
  if (capital >= min && capital <= max) return 40;
  if (capital < min) return Math.max(0, 40 - ((min - capital) / min) * 40);
  return Math.max(15, 40 - ((capital - max) / Math.max(max, 1)) * 20);
};

export const AssessmentPage: React.FC<AssessmentPageProps> = ({ initialData, onSubmit }) => {
  const [landArea, setLandArea] = useState<number>(0.25);
  const [capital, setCapital] = useState<number>(initialData.availableMargin || initialData.marginCapital || 300000);
  const [expertise, setExpertise] = useState<string>('agriculture');
  const [stateName, setStateName] = useState<string>(initialData.location.state || 'Uttar Pradesh');
  const [district, setDistrict] = useState<string>(initialData.location.district || 'Lucknow');
  const [risk, setRisk] = useState<Risk>(initialData.riskWillingness || 'Medium');
  const [experience, setExperience] = useState<Experience>(initialData.priorExperience || 'Some');
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo(() => {
    const skill = normalize(expertise);

    return BUSINESS_OPTIONS.map((business) => {
      const cFit = capitalFit(capital, business.minCapital, business.maxCapital);
      const landFit = business.minLand === 0 ? 25 : landArea >= business.minLand ? 25 : Math.max(0, (landArea / business.minLand) * 25);
      const skillFit = business.expertise.some((item) => skill.includes(item) || item.includes(skill)) ? 25 : skill.length > 2 ? 8 : 4;
      const riskFit = business.risk === risk ? 10 : risk === 'High' ? 8 : business.risk === 'Low' ? 7 : 5;
      const score = Math.min(98, Math.round(cFit + landFit + skillFit + riskFit));
      const scheme = SCHEMES.find((item) => item.id === business.schemeIds[0]) || SCHEMES[0];
      return { ...business, score, scheme };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [capital, expertise, landArea, risk]);

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
              Enter your available land, capital and expertise. NirnayAI ranks suitable business options and also suggests the most relevant government support scheme to verify.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D9B99B]/50 bg-[#FAF7F3] px-4 py-3 text-xs font-bold text-[#6B4535]">
            Business + Scheme Matching
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

          <label className="space-y-2 text-xs font-bold text-[#2B1B16] md:col-span-2">
            <span className="flex items-center gap-2"><UserRoundCog className="h-4 w-4 text-[#8B5E47]" />Expertise / skills</span>
            <input value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="e.g. agriculture, dairy, tailoring, electronics, digital marketing" className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
          </label>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8B5E47]" />State</span>
            <input value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
          </label>

          <label className="space-y-2 text-xs font-bold text-[#2B1B16]">
            <span>District</span>
            <input value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full rounded-xl border border-[#D9B99B]/60 bg-[#FAF7F3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D9B99B]" />
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
            <h2 className="text-xl font-black text-[#2B1B16]">Top matches for you</h2>
            <p className="text-xs text-[#7A5A49]">Scores are indicative decision-support scores, not guaranteed financial returns.</p>
          </div>

          {recommendations.map((business, index) => (
            <article key={business.name} className="rounded-3xl border border-[#D9B99B]/50 bg-white p-6 shadow-xs">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#6F7655]/15 px-3 py-1 text-xs font-black text-[#56603F]">#{index + 1} Match</span>
                    <span className="rounded-full bg-[#FAF0E5] px-3 py-1 text-xs font-black text-[#8B5E47]">{business.score}% fit</span>
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
                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#46502F]"><ShieldCheck className="h-4 w-4" /> Best government scheme to verify</div>
                    <div className="font-extrabold text-[#2B1B16]">{business.scheme.name}</div>
                    <p className="mt-1 text-xs text-[#687050]">{business.scheme.bestFor}</p>
                    <p className="mt-2 text-xs text-[#687050]">{business.scheme.benefit}</p>
                    <a href={business.scheme.officialUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-extrabold text-[#6B4535] underline decoration-[#D9B99B] underline-offset-4">Verify on official portal</a>
                  </div>
                </div>

                <button type="button" onClick={() => applyRecommendation(business)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6B4535] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#503126]">
                  <CheckCircle2 className="h-4 w-4" /> Use this recommendation <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>Important:</strong> NirnayAI shows likely-fit schemes for decision support. Final eligibility, subsidy, loan sanction and required documents must always be verified on the official government portal or with the implementing bank/agency.
          </div>
        </section>
      )}
    </div>
  );
};
