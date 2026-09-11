import {
  AssessmentFormData,
  FeasibilityScoreData,
  SWOTData,
  LocalOpportunityData,
  BusinessCategory,
} from '../types';
import {
  DEMO_FEASIBILITY_SCORE,
  DEMO_SWOT,
  DEMO_AI_INSIGHTS,
  DEMO_LOCAL_OPPORTUNITY,
} from '../utils/demoData';

export interface AIAnalysisResponse {
  feasibilityScore: FeasibilityScoreData;
  recommendation: string;
  swot: SWOTData;
  insights: Array<{ title: string; description: string; tag: string }>;
  localOpportunity: LocalOpportunityData;
  isAiGenerated: boolean;
}

export async function analyzeBusinessWithAI(
  formData: AssessmentFormData
): Promise<AIAnalysisResponse> {
  try {
    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.feasibilityScore) {
        const fallbackLoc = `${formData.location.village}, ${formData.location.block}, ${formData.location.district} (${formData.location.state})`;
        return {
          feasibilityScore: data.feasibilityScore,
          recommendation: data.recommendation || 'Evaluated for rural micro-enterprise operations.',
          swot: {
            strengths: data.swot?.strengths || DEMO_SWOT.strengths,
            weaknesses: data.swot?.weaknesses || DEMO_SWOT.weaknesses,
            opportunities: data.swot?.opportunities || DEMO_SWOT.opportunities,
            threats: data.swot?.threats || DEMO_SWOT.threats,
          },
          insights: data.insights || DEMO_AI_INSIGHTS,
          localOpportunity: {
            ...DEMO_LOCAL_OPPORTUNITY,
            locationSummary: fallbackLoc,
            demandSignal: `${formData.category} enterprise has strong recurring local interest in ${formData.location.block}.`,
            marketGap: `Absence of organized, reliable suppliers of ${formData.category.toLowerCase()} within a 5-10km cluster.`,
            ...(data.localOpportunity || {}),
            suggestedProductMix:
              data.localOpportunity?.suggestedProductMix ||
              DEMO_LOCAL_OPPORTUNITY.suggestedProductMix ||
              ['Primary Product Grade', 'Value-Added Secondary Unit', 'Bulk Institutional Supply'],
          },
          isAiGenerated: data.isAiGenerated ?? true,
        };
      }
    }
  } catch {
    // Network or server fallback
  }

  // Realistic fallback domain engine matching user category and location
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
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return data;
      }
    }
  } catch {
    // Graceful fallback to domain rules
  }

  return getFallbackAssistantAnswer(question, context);
}

function generateDeterministicAIResponse(formData: AssessmentFormData): AIAnalysisResponse {
  const cat = formData.category;
  const loc = `${formData.location.village}, ${formData.location.district} (${formData.location.state})`;

  const categoryProfiles: Record<
    BusinessCategory,
    {
      score: number;
      label: string;
      breakdown: [number, number, number, number, number];
      rec: string;
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
      insights: Array<{ title: string; description: string; tag: string }>;
    }
  > = {
    Dairy: {
      score: 78,
      label: 'Promising — proceed with controlled investment',
      breakdown: [82, 76, 68, 81, 84],
      rec: `Your proposed dairy business in ${loc} shows strong fundamentals. Daily recurring household demand and tea stall contracts provide resilient cash velocity, provided you maintain disciplined cold storage and upfront milk fat testing.`,
      strengths: DEMO_SWOT.strengths,
      weaknesses: DEMO_SWOT.weaknesses,
      opportunities: DEMO_SWOT.opportunities,
      threats: DEMO_SWOT.threats,
      insights: DEMO_AI_INSIGHTS,
    },
    'Food Processing': {
      score: 75,
      label: 'Viable — requires quality testing and packaging certification',
      breakdown: [79, 74, 70, 75, 78],
      rec: `Food processing near ${formData.location.block} has strong value-addition potential. Focus on local shelf-stable products (spices, pulses, pickles, or flour milling) with FSSAI basic registration.`,
      strengths: [
        'Raw agricultural produce available at farmgate rates locally',
        '30-45% value addition margin over raw crop sales',
        'Year-round consumption in rural and semi-urban markets',
      ],
      weaknesses: [
        'Seasonal raw material price spikes post-harvest',
        'Packaging moisture control and shelf-life monitoring needed',
      ],
      opportunities: [
        'Branded rural packaging in 250g/500g pouches for daily wage earners',
        'Supply tie-ups with local Kirana stores across 10 villages',
      ],
      threats: [
        'Competition from large regional FMCG packaged brands',
        'FSSAI compliance scrutiny and hygiene maintenance costs',
      ],
      insights: [
        {
          title: 'Start with 2-3 High Velocity Items',
          description: 'Avoid spreading capital across too many grain or spice variants initially.',
          tag: 'Production Focus',
        },
        {
          title: 'Prioritize Moisture-Proof Sealing',
          description: 'Invest in a dependable continuous band sealer to avoid rainy season spoilage.',
          tag: 'Quality Control',
        },
      ],
    },
    Retail: {
      score: 72,
      label: 'Moderately Feasible — location and credit management critical',
      breakdown: [74, 80, 62, 72, 71],
      rec: `Retail in ${formData.location.village} provides fast daily turnover. The primary risk is customer credit (Udhaar); strictly cap customer credit at under 15% of monthly sales.`,
      strengths: ['Immediate daily cash collections', 'Fast inventory turnover on fast-moving goods'],
      weaknesses: ['Working capital locked in unpaid customer credit registers (Khata)', 'Low gross margins (8-14%) on branded goods'],
      opportunities: ['Bundled delivery to surrounding hamlets', 'Digital payments (UPI) and micro-ATM agency add-on'],
      threats: ['Local competitors matching prices', 'Wholesale supplier price hikes'],
      insights: [
        {
          title: 'Digitize Khata & Limit Credit',
          description: 'Send automated SMS reminders and enforce a strict 14-day credit settlement window.',
          tag: 'Cash Management',
        },
      ],
    },
    'Agriculture Services': {
      score: 81,
      label: 'High Potential — strong seasonal demand in rural belt',
      breakdown: [85, 78, 77, 82, 83],
      rec: `Farm machinery custom hiring and organic input distribution around ${loc} addresses a proven mechanization gap for smallholder farmers.`,
      strengths: ['High demand during sowing and harvesting peaks', 'Government subsidy priority under agricultural schemes'],
      weaknesses: ['Seasonality with 3-4 lean months per year', 'Equipment maintenance and operator training costs'],
      opportunities: ['Rental service for power tillers, sprayers, and solar pumps', 'Contract seedling nursery'],
      threats: ['Monsoon delays impacting farmer hiring capacity', 'Unplanned machine breakdowns during harvest peak'],
      insights: [
        {
          title: 'Diversify Off-Season Services',
          description: 'Add transport trolley services and solar water pumping during non-sowing months.',
          tag: 'Year-Round Cash Flow',
        },
      ],
    },
    Poultry: {
      score: 74,
      label: 'Feasible — strict biosecurity and feed cost buffer required',
      breakdown: [78, 72, 65, 76, 79],
      rec: `Broiler or Desi poultry in ${loc} enjoys steady weekly mandi demand. Manage feed costs through local maize aggregation and maintain strict coop vaccination.`,
      strengths: ['Short 35-42 day production cycle', 'Consistent demand from local meat shops and weekly markets'],
      weaknesses: ['Mortality risk from temperature fluctuations', 'Feed represents up to 70% of total recurring cost'],
      opportunities: ['Desi poultry and organic country eggs fetching premium prices', 'Manure resale to vegetable growers'],
      threats: ['Disease outbreaks and bird flu alerts', 'Feed ingredient price volatility'],
      insights: [
        {
          title: 'Adopt Staggered Batch System',
          description: 'Run two overlapping sheds so cash inflow arrives every 21 days instead of waiting 45 days.',
          tag: 'Liquidity Planning',
        },
      ],
    },
    Tailoring: {
      score: 76,
      label: 'Low Risk & Steady — high margin on custom alterations',
      breakdown: [76, 88, 64, 78, 74],
      rec: `Tailoring and boutique garments in ${loc} has low initial capital requirements. Expand into school uniforms and festive bulk orders to secure bulk cash flow.`,
      strengths: ['High service margin (60-70%)', 'Low capital entry barrier'],
      weaknesses: ['Capacity capped by individual tailor labor hours', 'Peak festival workload followed by dry periods'],
      opportunities: ['School uniform annual supply contracts', 'Ready-to-wear local blouse and kurta designs'],
      threats: ['Cheap machine-made garments from nearby towns', 'Electricity load shedding affecting electric sewing machines'],
      insights: [
        {
          title: 'Secure School Uniform Contracts in April-June',
          description: 'Approach 3 local private and primary schools early to lock in bulk pre-orders.',
          tag: 'Institutional Revenue',
        },
      ],
    },
    Handicrafts: {
      score: 71,
      label: 'Niche Viability — needs market linkages and exhibition sales',
      breakdown: [72, 75, 60, 74, 76],
      rec: `Artisanal craft in ${loc} benefits from authentic cultural heritage. Bridge the local-to-urban gap through regional exhibitions, SHG federations, and postal dispatch.`,
      strengths: ['Unique traditional skill set', 'Low raw material costs'],
      weaknesses: ['Slow inventory liquidation', 'Dependence on seasonal tourist or urban buyers'],
      opportunities: ['State handloom emporium empanelment', 'Corporate gift packaging for festive seasons'],
      threats: ['Factory replica goods selling at lower prices', 'Intermediary middlemen taking excessive margins'],
      insights: [
        {
          title: 'Register on ONDC and GeM Portal',
          description: 'Access government department procurement tenders for gifting items.',
          tag: 'Market Linkage',
        },
      ],
    },
    'Repair Services': {
      score: 83,
      label: 'Very Strong — continuous essential demand with minimal inventory',
      breakdown: [86, 85, 80, 82, 81],
      rec: `Mobile, two-wheeler, or agricultural pump repair in ${loc} has virtually zero perishable inventory risk and high labor margins.`,
      strengths: ['Recurring breakdown demand', 'Immediate spot cash payment for labor charges'],
      weaknesses: ['Skill dependence on specialized tools', 'Spare parts sourcing turnaround from district town'],
      opportunities: ['Solar inverter and battery maintenance contracts', 'Mobile door-step breakdown service'],
      threats: ['New electronic components requiring specialized diagnostic equipment', 'Local roadside informal mechanics'],
      insights: [
        {
          title: 'Stock Top-20 Fast Moving Spare Parts',
          description: 'Keep plugs, filters, fuses, and cables in stock to avoid sending customers to distant towns.',
          tag: 'Service Turnaround',
        },
      ],
    },
    'Small Manufacturing': {
      score: 77,
      label: 'Capital Intensive — ensures strong defensibility once established',
      breakdown: [80, 71, 74, 78, 82],
      rec: `Light manufacturing (e.g. fly-ash bricks, paper plates, corrugated boxes) in ${loc} benefits from low rural labor and land rent, with high demand from local construction.`,
      strengths: ['Bulk order contracts', 'Protection against small casual competitors'],
      weaknesses: ['High single-point machine dependency', 'Industrial 3-phase electricity requirement'],
      opportunities: ['PMAY rural housing scheme building material demand', 'Local ban on single-use plastics promoting paper alternatives'],
      threats: ['Power supply interruptions', 'Raw material bulk transport freight costs'],
      insights: [
        {
          title: 'Partner with Local Gram Panchayat Contractors',
          description: 'Supply paved blocks and bricks directly to rural road and drainage works.',
          tag: 'Government Offtake',
        },
      ],
    },
    Other: {
      score: 75,
      label: 'Feasible — proceed with systematic local survey',
      breakdown: [77, 75, 70, 76, 77],
      rec: `Your enterprise in ${loc} shows viable opportunity. Verify the 5km competitor density and secure confirmed initial orders before making heavy capital outlays.`,
      strengths: DEMO_SWOT.strengths,
      weaknesses: DEMO_SWOT.weaknesses,
      opportunities: DEMO_SWOT.opportunities,
      threats: DEMO_SWOT.threats,
      insights: DEMO_AI_INSIGHTS,
    },
  };

  const profile = categoryProfiles[cat] || categoryProfiles['Dairy'];

  return {
    feasibilityScore: {
      overallScore: profile.score,
      statusLabel: profile.label,
      marketPotential: profile.breakdown[0],
      capitalFit: profile.breakdown[1],
      competitionScore: profile.breakdown[2],
      operationalFeasibility: profile.breakdown[3],
      growthPotential: profile.breakdown[4],
    },
    recommendation: profile.rec,
    swot: {
      strengths: profile.strengths,
      weaknesses: profile.weaknesses,
      opportunities: profile.opportunities,
      threats: profile.threats,
    },
    insights: profile.insights,
    localOpportunity: {
      ...DEMO_LOCAL_OPPORTUNITY,
      locationSummary: loc,
      demandSignal: `${cat} enterprise has strong recurring local interest in ${formData.location.block}.`,
      marketGap: `Absence of standardized quality and reliable delivery of ${cat.toLowerCase()} in a 5-10km cluster.`,
    },
    isAiGenerated: false,
  };
}

function getFallbackAssistantAnswer(
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
): { answer: string; sources: string[] } {
  const q = question.toLowerCase();
  const margin = context.margin || 50000;
  const projectCost = context.projectCost || Math.round(margin / 0.1);
  const loan = context.loan || Math.round(projectCost * 0.9);

  if (q.includes('50,000') || q.includes('50000') || q.includes('start with') || q.includes('p पूंजी') || q.includes('शुरू')) {
    return {
      answer: `With ₹50,000 margin capital under the SIH26091 financial model:
1. Your 10% Margin: ₹50,000
2. Eligible Project Cost: ₹5,00,000 (Margin / 10%)
3. Financing Support: ₹4,50,000 (90% via Term Loan Scheme at 8% p.a., 7-year tenure, with 6-month moratorium).

Top Recommended Businesses in Rural/Semi-Urban Clusters:
• Dairy & Milk Collection Center (Curd/Paneer/Fresh Milk)
• Agro-Machinery & Power Tiller Rental Service
• Flour & Spice Processing / Oil Expeller
• Two-Wheeler & Solar Equipment Repair Center`,
      sources: ['SIH26091 Problem Statement', 'RBI Financial Education for Small Entrepreneurs'],
    };
  }

  if (q.includes('hindi') || q.includes('हिंदी') || q.includes('loan') || q.includes('ऋण') || q.includes('कर्ज')) {
    return {
      answer: `आपके ऋण की संरचना (SIH26091 नियमों के अनुसार):
• आपकी पूंजी (10% मार्जिन): ₹${margin.toLocaleString('en-IN')}
• कुल प्रोजेक्ट लागत: ₹${projectCost.toLocaleString('en-IN')}
• बैंक/एजेंसी ऋण (90%): ₹${loan.toLocaleString('en-IN')}
• लागू योजना: ${projectCost > 140000 ? 'टर्म लोन योजना (Term Loan Scheme)' : 'माइक्रो फाइनेंस योजना (Micro Finance Scheme)'}
• ब्याज दर: ${projectCost > 140000 ? '8.0% वार्षिक' : '6.5% वार्षिक'}
• ऋण अवधि: ${projectCost > 140000 ? '7 वर्ष (84 माह)' : '3 वर्ष (36 माह)'}
• मोरेटोरियम (छूट अवधि): ${projectCost > 140000 ? '6 महीने' : '3 महीने'} (इस दौरान केवल सामान्य ब्याज, मूलधन की किस्त नहीं देनी होती)।`,
      sources: ['SIH26091 Guidelines', 'Udyam Registration Portal'],
    };
  }

  if (q.includes('scheme') || q.includes('योजना') || q.includes('difference') || q.includes('micro') || q.includes('term')) {
    return {
      answer: `NIRNAY AI utilizes the deterministic SIH26091 scheme router:
• Option A: Micro Finance Scheme
  - Applied when project cost is up to ₹1.40 Lakh.
  - Agency support up to 90% (max ₹1.25 Lakh), 6.5% interest, 3-year tenure, 3-month moratorium.
• Option B: Term Loan Scheme
  - Applied when project cost exceeds ₹1.40 Lakh up to ₹50 Lakh.
  - Agency support up to 90% (max ₹45 Lakh), 8% interest, 7-year tenure, 6-month moratorium.

Your current estimated project cost is ₹${projectCost.toLocaleString('en-IN')}, which places you in the ${projectCost > 140000 ? 'Term Loan Scheme' : 'Micro Finance Scheme'}.`,
      sources: ['SIH26091 Scheme Guidelines'],
    };
  }

  return {
    answer: `NIRNAY AI Recommendation for your ${context.category || 'proposed'} business:
1. Feasibility: Your project cost is ₹${projectCost.toLocaleString('en-IN')} backed by ₹${margin.toLocaleString('en-IN')} margin.
2. Financing: Under ${context.scheme || (projectCost > 140000 ? 'Term Loan Scheme' : 'Micro Finance Scheme')}, monthly repayments are calculated deterministically to protect your operating cash flow.
3. Key Advice: Complete 5 local customer pre-orders before purchasing machinery, and maintain at least 30-45 days of working capital reserve.`,
    sources: ['SIH26091 Advisory Engine', 'Haqdarshak & RBI Case Studies'],
  };
}
