import {
  AssessmentFormData,
  LocalOpportunityData,
  FeasibilityScoreData,
  SWOTData,
  MapMarkerItem,
} from '../types';

export const DEMO_SCENARIO: AssessmentFormData = {
  location: {
    village: 'Rampur Khas',
    block: 'Bilaspur Block',
    district: 'Rampur',
    state: 'Uttar Pradesh',
    latitude: 28.8154,
    longitude: 79.0257,
  },
  marginCapital: 50000,
  availableMargin: 50000,
  category: 'Dairy',
  ideaText: 'Small dairy and milk chilling collection center with packaged curd, paneer and ghee supply to local tea stalls, halwais, and village households.',
  businessIdea: 'Dairy & Milk Collection Center (Curd/Paneer/Fresh Milk)',
  targetMarket: 'Local households, dhabas, and 14 tea stalls within 5 km',
  priorExperience: 'Some',
  riskWillingness: 'Medium',
  preferredLanguage: 'en',
};

export const DEMO_ASSESSMENT_DATA = DEMO_SCENARIO;

export const DEMO_MAP_MARKERS: MapMarkerItem[] = [
  {
    id: 'opp-1',
    type: 'opportunity',
    title: 'Bilaspur Mandi & Weekly Haat',
    distanceKm: 3.8,
    x: 68,
    y: 35,
    description: 'High weekly footfall of 1,200+ local buyers; unmet demand for hygienic sealed curd and fresh paneer.',
    impact: 'High',
  },
  {
    id: 'opp-2',
    type: 'opportunity',
    title: 'Cluster of 14 Tea Stalls & Dhabas',
    distanceKm: 2.1,
    x: 42,
    y: 58,
    description: 'Requires 180-220 liters of fresh milk daily on structured morning delivery contracts.',
    impact: 'High',
  },
  {
    id: 'comp-1',
    type: 'competitor',
    title: 'Unorganized Local Dudhiya (Milkmen)',
    distanceKm: 1.4,
    x: 30,
    y: 28,
    description: '3 traditional unorganized suppliers with irregular testing and fluctuating seasonal availability.',
    impact: 'Medium',
  },
  {
    id: 'comp-2',
    type: 'competitor',
    title: 'District Cooperative Chilling Depot',
    distanceKm: 8.5,
    x: 82,
    y: 72,
    description: 'Procures raw milk for distant plants; offers lower farmgate prices than direct local retail sales.',
    impact: 'Low',
  },
  {
    id: 'gap-1',
    type: 'gap',
    title: 'Unserved Cold Chain / Value-Add Gap',
    distanceKm: 4.5,
    x: 55,
    y: 78,
    description: 'No small-scale chilling or mechanized cream separator within 7km, causing afternoon milk spoilage.',
    impact: 'High',
  },
  {
    id: 'cust-1',
    type: 'customer',
    title: 'Residential Hamlet (280 Households)',
    distanceKm: 1.8,
    x: 25,
    y: 65,
    description: 'Daily recurring demand for fresh cow & buffalo milk; willingness to pay ₹60-64/L for tested purity.',
    impact: 'High',
  },
  {
    id: 'cust-2',
    type: 'customer',
    title: 'Rampur Road Sweets Confectioner',
    distanceKm: 6.2,
    x: 75,
    y: 22,
    description: 'Bulk purchaser of cottage cheese (paneer) and khoya on bi-weekly payment terms.',
    impact: 'Medium',
  },
];

export const DEMO_LOCAL_OPPORTUNITY: LocalOpportunityData = {
  locationSummary: 'Rampur Khas, Bilaspur Block, Rampur District (Uttar Pradesh)',
  radiusKm: 10,
  localDemand: 'Moderate to High',
  demandSignal: 'Milk and daily-use dairy products show high recurring local consumption with strong household and commercial demand.',
  marketGap: 'Limited organized availability of tested, packaged dairy products (chilled milk, curd, paneer) within a 5–10 km radius.',
  competition: 'Moderate (mostly traditional informal milkmen, no organized value-addition center nearby)',
  competitorDensity: '2 informal raw milk collection points within 4 km, no chilling infrastructure',
  recommendedRadius: '5 km delivery radius (10 km extended sourcing)',
  suggestedProductMix: [
    'Chilled Pouch Milk (Cow & Buffalo)',
    'Fresh Malai Paneer (200g/500g)',
    'Set Curd / Dahi',
    'Desi Ghee (Tin/Glass Pack)',
  ],
  customerSegments: [
    'Rural & Semi-Urban Households (daily direct distribution)',
    'Local Tea Stalls & Dhabas on State Highway 37',
    'Halwais & Sweet Confectioneries requiring bulk milk & khoya',
    'Weekly Village Haat buyers seeking hygienic butter & ghee',
  ],
  dataConfidence: 'Medium',
  sources: [
    'District Census & Agriculture Livestock Census (Indicative baseline)',
    'Local Market Radius Survey Model (SIH26091 Simulation)',
    'Field Survey Checklist for Micro-Entrepreneurs',
  ],
  markers: DEMO_MAP_MARKERS,
  evidenceBadge: 'INDICATIVE',
};

export const DEMO_FEASIBILITY_SCORE: FeasibilityScoreData = {
  overallScore: 78,
  statusLabel: 'Promising — proceed with controlled investment',
  marketPotential: 82,
  capitalFit: 76,
  competitionScore: 68,
  operationalFeasibility: 81,
  growthPotential: 84,
};

export const DEMO_SWOT: SWOTData = {
  strengths: [
    'High recurring daily demand with non-cyclical essential consumption pattern',
    'Familiar product category with minimal customer education needed',
    'Immediate proximity to local cattle rearers and raw milk supply pools',
    'Favorable cash liquidity with daily or weekly collection cycles',
  ],
  weaknesses: [
    'Working capital pressure during initial cattle lactation cycle adjustments',
    'Perishable inventory requiring dependable chilling and cold chain handling',
    'Vulnerability to local power fluctuations if diesel generator backup is omitted',
  ],
  opportunities: [
    'High-margin value-added dairy derivatives (fresh paneer, curd, clarified ghee)',
    'Direct-to-doorstep subscription model for 80+ village households',
    'Off-take agreements with highway dhabas and institutional hostel canteens',
    'Aggregation of veterinary support and cattle feed supplies for extra revenue',
  ],
  threats: [
    'Informal price undercutting by unorganized local vendors lacking quality testing',
    'Seasonal fluctuations in green fodder availability and raw milk yields',
    'Sudden spikes in transportation and diesel fuel expenditure',
  ],
};

export const DEMO_AI_INSIGHTS = [
  {
    title: 'Focus on High-Margin Products Early',
    description: 'Raw liquid milk yields ~8-12% margins, while paneer, curd and ghee yield 25-35%. Convert 30% of daily surplus into value-added items.',
    tag: 'Margin Booster',
  },
  {
    title: 'Maintain 45-Day Working Capital Buffer',
    description: 'Ensure at least ₹35,000 remains in liquid reserves to absorb delayed payments from commercial buyers (halwais, tea stalls).',
    tag: 'Risk Mitigation',
  },
  {
    title: 'Lock In Advance Procurement Contracts',
    description: 'Sign seasonal price agreements with 4-6 local dairy farmers using transparent fat testing (lactometer) to prevent raw milk poaching.',
    tag: 'Supply Stability',
  },
  {
    title: 'Leverage Government Subsidy Under Term Loan',
    description: 'Under the 8% Term Loan Scheme, the 6-month moratorium protects your cash flow while your herd and collection chain stabilize.',
    tag: 'Financial Strategy',
  },
];
