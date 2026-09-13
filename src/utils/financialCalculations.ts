import {
  BusinessCategory,
  FinancialPlanData,
  FinancialStructureData,
  SchemeOption,
  EMIResult,
  GrowthProjectionData,
  GrowthDataPoint,
} from '../types';

/**
 * Deterministic planning calculations for the SIH prototype.
 * These are indicative decision-support assumptions, not lender sanctions.
 */

type BusinessFinanceProfile = {
  capexShare: number;
  inventoryShare: number;
  workingCapitalShare: number;
  steadyRevenueRate: number;
  operatingExpenseRate: number;
  rampStart: number;
  year3Growth: number;
};

const BUSINESS_FINANCE_PROFILES: Record<BusinessCategory, BusinessFinanceProfile> = {
  Dairy: { capexShare: 0.55, inventoryShare: 0.2, workingCapitalShare: 0.25, steadyRevenueRate: 0.19, operatingExpenseRate: 0.68, rampStart: 0.38, year3Growth: 0.12 },
  'Food Processing': { capexShare: 0.45, inventoryShare: 0.3, workingCapitalShare: 0.25, steadyRevenueRate: 0.24, operatingExpenseRate: 0.7, rampStart: 0.35, year3Growth: 0.16 },
  Retail: { capexShare: 0.25, inventoryShare: 0.5, workingCapitalShare: 0.25, steadyRevenueRate: 0.28, operatingExpenseRate: 0.78, rampStart: 0.45, year3Growth: 0.1 },
  'Agriculture Services': { capexShare: 0.5, inventoryShare: 0.15, workingCapitalShare: 0.35, steadyRevenueRate: 0.18, operatingExpenseRate: 0.58, rampStart: 0.32, year3Growth: 0.14 },
  Poultry: { capexShare: 0.5, inventoryShare: 0.25, workingCapitalShare: 0.25, steadyRevenueRate: 0.23, operatingExpenseRate: 0.7, rampStart: 0.3, year3Growth: 0.13 },
  Tailoring: { capexShare: 0.4, inventoryShare: 0.2, workingCapitalShare: 0.4, steadyRevenueRate: 0.16, operatingExpenseRate: 0.48, rampStart: 0.42, year3Growth: 0.18 },
  Handicrafts: { capexShare: 0.35, inventoryShare: 0.35, workingCapitalShare: 0.3, steadyRevenueRate: 0.2, operatingExpenseRate: 0.6, rampStart: 0.32, year3Growth: 0.2 },
  'Repair Services': { capexShare: 0.45, inventoryShare: 0.15, workingCapitalShare: 0.4, steadyRevenueRate: 0.18, operatingExpenseRate: 0.45, rampStart: 0.45, year3Growth: 0.17 },
  'Small Manufacturing': { capexShare: 0.6, inventoryShare: 0.2, workingCapitalShare: 0.2, steadyRevenueRate: 0.2, operatingExpenseRate: 0.67, rampStart: 0.3, year3Growth: 0.15 },
  Other: { capexShare: 0.4, inventoryShare: 0.25, workingCapitalShare: 0.35, steadyRevenueRate: 0.18, operatingExpenseRate: 0.6, rampStart: 0.38, year3Growth: 0.14 },
};

export function getBusinessFinanceProfile(category: BusinessCategory): BusinessFinanceProfile {
  return BUSINESS_FINANCE_PROFILES[category] || BUSINESS_FINANCE_PROFILES.Other;
}

export function getCapitalDeploymentCopy(category: BusinessCategory): {
  capex: string;
  inventory: string;
  workingCapital: string;
} {
  const byCategory: Record<BusinessCategory, { capex: string; inventory: string; workingCapital: string }> = {
    Dairy: {
      capex: 'Chilling/testing equipment, food-grade handling assets and essential setup.',
      inventory: 'Initial milk procurement, testing consumables and packaging material.',
      workingCapital: 'Utilities, collection payments, transport, maintenance and cash reserve.',
    },
    'Food Processing': {
      capex: 'Processing, sealing, weighing, storage and basic food-safety equipment.',
      inventory: 'Raw ingredients, packaging, labels and first production-batch inputs.',
      workingCapital: 'Utilities, transport, labour, spoilage buffer and repeat procurement cash.',
    },
    Retail: {
      capex: 'Shelving, billing tools, storage, basic fixtures and shop setup.',
      inventory: 'Opening fast-moving stock matched to the selected local customer segment.',
      workingCapital: 'Replenishment cash, rent/utilities, local delivery and credit-loss buffer.',
    },
    'Agriculture Services': {
      capex: 'Service tools, small machinery, safety equipment and transport/setup assets.',
      inventory: 'Frequently used spare parts, consumables and seasonal service inputs.',
      workingCapital: 'Fuel, repairs, field travel, seasonal demand swings and customer-credit buffer.',
    },
    Poultry: {
      capex: 'Shed setup, feeders, drinkers, ventilation, brooding and hygiene equipment.',
      inventory: 'Initial birds/chicks, feed, litter, vaccines and basic consumables.',
      workingCapital: 'Feed cycles, electricity, water, mortality buffer and market-delay reserve.',
    },
    Tailoring: {
      capex: 'Sewing/finishing machines, cutting table, tools and compact workspace setup.',
      inventory: 'Thread, lining, trims, sample fabric and fast-moving tailoring consumables.',
      workingCapital: 'Rent, electricity, alterations, local marketing and customer-order cash buffer.',
    },
    Handicrafts: {
      capex: 'Core artisan tools, finishing equipment, display/storage and workspace setup.',
      inventory: 'Raw craft material, dyes/finishes, packaging and sample-product stock.',
      workingCapital: 'Artisan labour, marketplace fees, transport, seasonal demand and order-cycle buffer.',
    },
    'Repair Services': {
      capex: 'Diagnostic tools, repair equipment, safety kit and compact service workspace.',
      inventory: 'Common replacement parts, connectors, consumables and small accessories.',
      workingCapital: 'Travel, utilities, repeat parts purchases, warranty callbacks and emergency reserve.',
    },
    'Small Manufacturing': {
      capex: 'Production machinery, work benches, safety equipment and essential workshop setup.',
      inventory: 'Opening raw material, components, consumables and packaging stock.',
      workingCapital: 'Power, labour, maintenance, supplier cycles and customer-payment buffer.',
    },
    Other: {
      capex: 'Essential tools, equipment and minimum viable setup assets.',
      inventory: 'Opening stock, consumables or inputs required for the first sales cycle.',
      workingCapital: 'Operating expenses, replenishment, marketing and contingency reserve.',
    },
  };
  return byCategory[category] || byCategory.Other;
}

export function calculateProjectStructure(availableMargin: number): FinancialPlanData {
  const safeMargin = Math.max(5000, Number(availableMargin) || 50000);
  const projectCost = Math.round(safeMargin / 0.1);
  const loanRequirement = Math.round(projectCost * 0.9);
  const workingCapital = Math.round(projectCost * 0.35);
  const equipmentCapital = Math.round(projectCost * 0.65);

  return {
    availableMargin: safeMargin,
    projectCost,
    loanRequirement,
    marginPercentage: 10,
    loanPercentage: 90,
    workingCapital,
    equipmentCapital,
  };
}

export function calculateFinancialStructure(
  availableMargin: number,
  category: BusinessCategory = 'Other'
): FinancialStructureData {
  const safeMargin = Math.max(5000, Number(availableMargin) || 50000);
  const projectCost = Math.round(safeMargin / 0.1);
  const loanRequirement = Math.round(projectCost * 0.9);
  const profile = getBusinessFinanceProfile(category);

  const isMicro = projectCost <= 140000;
  const interestRate = isMicro ? 6.5 : 8.0;
  const tenureMonths = isMicro ? 36 : 84;
  const moratoriumMonths = isMicro ? 3 : 6;
  const emiCalc = calculateEMI(loanRequirement, interestRate, tenureMonths, moratoriumMonths);

  return {
    entrepreneurMargin: safeMargin,
    totalProjectCost: projectCost,
    loanRequirement,
    marginPercentage: 10,
    loanPercentage: 90,
    recommendedScheme: isMicro ? 'Micro Finance Planning Route' : 'Term Loan Planning Route',
    schemeRationale: isMicro
      ? `Indicative planning route because project cost ${formatINR(projectCost)} is within the prototype's ₹1.40 lakh threshold. Verify the actual lender, rate, tenure and eligibility before applying.`
      : `Indicative planning route because project cost ${formatINR(projectCost)} is above the prototype's ₹1.40 lakh threshold. Verify the actual lender, rate, tenure, collateral and eligibility before applying.`,
    interestRate,
    tenureMonths,
    moratoriumMonths,
    monthlyEMI: emiCalc.monthlyEMI,
    breakdown: {
      capexMachinery: Math.round(projectCost * profile.capexShare),
      initialInventory: Math.round(projectCost * profile.inventoryShare),
      workingCapital: Math.round(projectCost * profile.workingCapitalShare),
    },
  };
}

export const SCHEME_OPTIONS: Array<{
  id: string;
  code: string;
  name: string;
  projectCostCeiling: string;
  maxAgencySupport: string;
  interestRate: string;
  tenure: string;
  moratorium: string;
  target: string;
}> = [
  {
    id: 'micro-finance',
    code: 'PLANNING OPTION A',
    name: 'Micro Finance Planning Route',
    projectCostCeiling: 'Prototype threshold: up to ₹1.40 lakh',
    maxAgencySupport: 'Illustrative debt requirement: up to 90%',
    interestRate: 'Illustrative 6.5% p.a.',
    tenure: 'Illustrative 3 years',
    moratorium: 'Illustrative 3 months',
    target: 'Low-capex micro-enterprise planning; verify a real lender/scheme before application',
  },
  {
    id: 'term-loan',
    code: 'PLANNING OPTION B',
    name: 'Term Loan Planning Route',
    projectCostCeiling: 'Prototype threshold: above ₹1.40 lakh',
    maxAgencySupport: 'Illustrative debt requirement: up to 90%',
    interestRate: 'Illustrative 8.0% p.a.',
    tenure: 'Illustrative up to 7 years',
    moratorium: 'Illustrative 6 months',
    target: 'Machinery/service enterprise planning; verify current bank and scheme terms',
  },
];

export function generateGrowthProjections(
  availableMargin: number,
  category: BusinessCategory = 'Other'
): GrowthProjectionData {
  const fin = calculateFinancialStructure(availableMargin, category);
  return calculateGrowthProjections(fin.totalProjectCost, fin.monthlyEMI, category);
}

export function getSchemeOptions(projectCost: number): {
  recommended: SchemeOption;
  schemes: SchemeOption[];
} {
  const isMicro = projectCost <= 140000;

  const optionA: SchemeOption = {
    id: 'MICRO_FINANCE',
    name: 'Micro Finance Planning Route',
    tagline: 'Indicative low-capex financing structure',
    applicableProjectCostRule: 'Prototype planning threshold up to ₹1.40 lakh',
    agencySupportText: 'Illustrative debt share up to 90%',
    agencySupportPercent: 90,
    maxAgencyAmount: 125000,
    interestRate: 6.5,
    tenureYears: 3,
    tenureMonths: 36,
    moratoriumMonths: 3,
    isRecommended: isMicro,
    whyRecommended: isMicro
      ? `Indicative match because project cost ${formatINR(projectCost)} is within the prototype threshold. Verify real lender eligibility and terms.`
      : 'Use only as a planning comparison for lower-cost projects.',
    parametersBasis: 'Illustrative SIH prototype assumptions; not an official lender sanction or scheme rule',
  };

  const optionB: SchemeOption = {
    id: 'TERM_LOAN',
    name: 'Term Loan Planning Route',
    tagline: 'Indicative long-term financing structure for larger setups',
    applicableProjectCostRule: 'Prototype planning threshold above ₹1.40 lakh',
    agencySupportText: 'Illustrative debt share up to 90%',
    agencySupportPercent: 90,
    maxAgencyAmount: 4500000,
    interestRate: 8.0,
    tenureYears: 7,
    tenureMonths: 84,
    moratoriumMonths: 6,
    isRecommended: !isMicro,
    whyRecommended: !isMicro
      ? `Indicative match because project cost ${formatINR(projectCost)} is above the prototype threshold. Verify real bank/scheme eligibility, rate and security requirements.`
      : 'Use only as a planning comparison for higher-cost projects.',
    parametersBasis: 'Illustrative SIH prototype assumptions; not an official lender sanction or scheme rule',
  };

  return {
    recommended: isMicro ? optionA : optionB,
    schemes: [optionA, optionB],
  };
}

/** Standard reducing-balance amortization formula. */
export function calculateEMI(
  loanAmount: number,
  annualInterestRate: number,
  tenureMonths: number,
  moratoriumMonths: number = 0
): EMIResult {
  const P = Math.max(1000, loanAmount);
  const annualRate = Math.max(0.1, annualInterestRate);
  const totalMonths = Math.max(6, tenureMonths);
  const moratorium = Math.min(Math.max(0, moratoriumMonths), totalMonths - 3);
  const activeMonths = totalMonths - moratorium;
  const monthlyRate = annualRate / 12 / 100;
  const emiFactor = Math.pow(1 + monthlyRate, activeMonths);
  const monthlyEMI = Math.round((P * monthlyRate * emiFactor) / (emiFactor - 1));

  let currentBalance = P;
  let accumulatedInterest = 0;
  const schedule = [];

  for (let m = 1; m <= moratorium; m++) {
    const interestDuringMoratorium = Math.round(currentBalance * monthlyRate);
    accumulatedInterest += interestDuringMoratorium;
    schedule.push({ month: m, emi: interestDuringMoratorium, principal: 0, interest: interestDuringMoratorium, balance: currentBalance });
  }

  for (let m = moratorium + 1; m <= totalMonths; m++) {
    const interestForMonth = Math.round(currentBalance * monthlyRate);
    const principalForMonth = Math.min(monthlyEMI - interestForMonth, currentBalance);
    accumulatedInterest += interestForMonth;
    currentBalance = Math.max(0, currentBalance - principalForMonth);
    schedule.push({ month: m, emi: monthlyEMI, principal: principalForMonth, interest: interestForMonth, balance: currentBalance });
  }

  return {
    loanAmount: P,
    annualInterestRate: annualRate,
    tenureMonths: totalMonths,
    moratoriumMonths: moratorium,
    monthlyEMI,
    totalInterest: accumulatedInterest,
    totalRepayment: P + accumulatedInterest,
    schedule,
  };
}

/**
 * Indicative 36-month operating trajectory. Category profiles materially change
 * revenue ramp, cost intensity and working economics. A break-even value of 37
 * means the model did not reach break-even within the displayed 36-month period.
 */
export function calculateGrowthProjections(
  projectCost: number,
  monthlyEMI: number,
  category: BusinessCategory = 'Other'
): GrowthProjectionData {
  const profile = getBusinessFinanceProfile(category);
  const baseSteadyRevenue = Math.round(projectCost * profile.steadyRevenueRate);
  const monthlyData: GrowthDataPoint[] = [];
  let cumulativeCash = -projectCost * 0.1;
  let breakEvenMonth = 0;

  for (let m = 1; m <= 36; m++) {
    const firstYearProgress = Math.min(1, (m - 1) / 11);
    const laterProgress = m <= 12 ? 0 : (m - 12) / 24;
    const rampFactor = m <= 12
      ? profile.rampStart + (1 - profile.rampStart) * firstYearProgress
      : 1 + profile.year3Growth * laterProgress;

    const revenue = Math.round(baseSteadyRevenue * rampFactor);
    const expenses = Math.round(revenue * profile.operatingExpenseRate);
    const repayment = monthlyEMI;
    const netProfit = revenue - expenses - repayment;
    cumulativeCash += netProfit;

    if (cumulativeCash >= 0 && breakEvenMonth === 0) breakEvenMonth = m;

    monthlyData.push({ month: m, label: `M${m}`, revenue, expenses, profit: netProfit, repayment, cashFlow: cumulativeCash });
  }

  const matureMonth = monthlyData[18] || monthlyData[monthlyData.length - 1];

  return {
    monthlyData,
    projectedMonthlyRevenue: matureMonth.revenue,
    projectedMonthlyProfit: matureMonth.profit,
    breakEvenMonths: breakEvenMonth || 37,
    loanRepaymentMonthly: monthlyEMI,
    isIndicative: true,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
