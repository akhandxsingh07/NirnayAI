export type PageId =
  | 'landing'
  | 'dashboard'
  | 'assessment'
  | 'opportunity'
  | 'analysis'
  | 'finance'
  | 'schemes'
  | 'growth'
  | 'report';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'mr'
  | 'ta'
  | 'te'
  | 'kn'
  | 'gu'
  | 'pa';

export type BusinessCategory =
  | 'Dairy'
  | 'Food Processing'
  | 'Retail'
  | 'Agriculture Services'
  | 'Poultry'
  | 'Tailoring'
  | 'Handicrafts'
  | 'Repair Services'
  | 'Small Manufacturing'
  | 'Other';

export interface LocationData {
  village: string;
  block: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export interface AssessmentFormData {
  location: LocationData;
  marginCapital: number;
  category: BusinessCategory;
  ideaText: string;
  preferredLanguage: LanguageCode;
  availableMargin?: number;
  businessIdea?: string;
  targetMarket?: string;
  priorExperience?: 'None' | 'Some' | 'Experienced';
  riskWillingness?: 'Low' | 'Medium' | 'High';
}

export interface FinancialStructureData {
  entrepreneurMargin: number;
  totalProjectCost: number;
  loanRequirement: number;
  marginPercentage: number;
  loanPercentage: number;
  recommendedScheme: string;
  schemeRationale: string;
  interestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  breakdown: {
    capexMachinery: number;
    initialInventory: number;
    workingCapital: number;
  };
}

export type EvidenceType =
  | 'SOURCE_BACKED'
  | 'INDICATIVE'
  | 'AI_INFERENCE'
  | 'VERIFY_LOCALLY';

export interface MapMarkerItem {
  id: string;
  type: 'opportunity' | 'competitor' | 'gap' | 'customer';
  title: string;
  distanceKm: number;
  x: number; // percentage on map 0-100
  y: number; // percentage on map 0-100
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface LocalOpportunityData {
  locationSummary: string;
  radiusKm: number;
  localDemand: string;
  demandSignal: string;
  marketGap: string;
  competition: string;
  customerSegments: string[];
  dataConfidence: 'Medium' | 'High';
  sources: string[];
  markers: MapMarkerItem[];
  evidenceBadge: EvidenceType;
  competitorDensity?: string;
  recommendedRadius?: string;
  suggestedProductMix?: string[];
}

export interface FeasibilityScoreData {
  overallScore: number;
  statusLabel: string;
  marketPotential: number;
  capitalFit: number;
  competitionScore: number;
  operationalFeasibility: number;
  growthPotential: number;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface FinancialPlanData {
  availableMargin: number; // e.g. 50,000
  projectCost: number; // Available Margin / 10% = 5,00,000
  loanRequirement: number; // 90% of Project Cost = 4,50,000
  marginPercentage: number; // 10%
  loanPercentage: number; // 90%
  workingCapital: number;
  equipmentCapital: number;
}

export interface SchemeOption {
  id: 'MICRO_FINANCE' | 'TERM_LOAN';
  name: string;
  tagline: string;
  applicableProjectCostRule: string;
  agencySupportText: string;
  agencySupportPercent: number;
  maxAgencyAmount: number;
  interestRate: number; // in % p.a.
  tenureYears: number;
  tenureMonths: number;
  moratoriumMonths: number;
  isRecommended: boolean;
  whyRecommended: string;
  parametersBasis: string;
}

export interface EMIResult {
  loanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  moratoriumMonths: number;
  monthlyEMI: number;
  totalInterest: number;
  totalRepayment: number;
  schedule: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export interface GrowthDataPoint {
  month: number;
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
  repayment: number;
  cashFlow: number;
}

export interface GrowthProjectionData {
  monthlyData: GrowthDataPoint[];
  projectedMonthlyRevenue: number;
  projectedMonthlyProfit: number;
  breakEvenMonths: number;
  loanRepaymentMonthly: number;
  isIndicative: boolean;
}

export interface BusinessPlanReport {
  generatedAt: string;
  businessIdea: string;
  category: BusinessCategory;
  location: LocationData;
  opportunitySummary: string;
  feasibilityScore: number;
  feasibilityLabel: string;
  financialStructure: FinancialPlanData;
  recommendedScheme: SchemeOption;
  monthlyEMI: number;
  keyRisks: string[];
  mitigations: string[];
  nextSteps: string[];
}
