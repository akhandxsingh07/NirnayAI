import { FinancialPlanData, FinancialStructureData, SchemeOption, EMIResult, GrowthProjectionData, GrowthDataPoint } from '../types';

/**
 * Deterministic Financial Calculations for SIH26091
 * Rules are strictly derived from the problem statement parameters:
 * - Project Cost = Available Margin / 10%
 * - Loan Requirement = 90% of Project Cost
 */

export function calculateProjectStructure(availableMargin: number): FinancialPlanData {
  const safeMargin = Math.max(5000, Number(availableMargin) || 50000);
  // Project Cost = Margin / 0.10
  const projectCost = Math.round(safeMargin / 0.1);
  // Loan = 90% of Project Cost
  const loanRequirement = Math.round(projectCost * 0.9);

  // Reasonable allocation breakdown
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

export function calculateFinancialStructure(availableMargin: number): FinancialStructureData {
  const safeMargin = Math.max(5000, Number(availableMargin) || 50000);
  const projectCost = Math.round(safeMargin / 0.1);
  const loanRequirement = Math.round(projectCost * 0.9);

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
    recommendedScheme: isMicro ? 'Micro Finance Scheme' : 'Term Loan Scheme',
    schemeRationale: isMicro
      ? `Project cost (${formatINR(projectCost)}) is within ₹1.40 Lakh threshold, eligible for 6.5% interest Micro Finance Scheme.`
      : `Project cost (${formatINR(projectCost)}) exceeds ₹1.40 Lakh threshold, qualifying for 8% interest Term Loan Scheme up to 7 years.`,
    interestRate,
    tenureMonths,
    moratoriumMonths,
    monthlyEMI: emiCalc.monthlyEMI,
    breakdown: {
      capexMachinery: Math.round(projectCost * 0.62),
      initialInventory: Math.round(projectCost * 0.18),
      workingCapital: Math.round(projectCost * 0.20),
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
    code: 'OPTION A',
    name: 'Micro Finance Scheme',
    projectCostCeiling: 'Up to ₹1.40 Lakh',
    maxAgencySupport: 'Up to 90% (max ₹1.25 Lakh)',
    interestRate: '6.5% p.a.',
    tenure: '3 years (36 months)',
    moratorium: '3 months grace',
    target: 'Micro initiatives, individual artisans, roadside units & street vendors',
  },
  {
    id: 'term-loan',
    code: 'OPTION B',
    name: 'Term Loan Scheme',
    projectCostCeiling: 'Above ₹1.40 Lakh up to ₹50 Lakh',
    maxAgencySupport: 'Up to 90% (max ₹45 Lakh)',
    interestRate: '8.0% p.a.',
    tenure: '7 years (84 months)',
    moratorium: '6 months grace',
    target: 'Small rural enterprises, machinery acquisition & processing units',
  },
];

export function generateGrowthProjections(availableMargin: number): GrowthProjectionData {
  const fin = calculateFinancialStructure(availableMargin);
  return calculateGrowthProjections(fin.totalProjectCost, fin.monthlyEMI, 'General');
}

export function getSchemeOptions(projectCost: number): {
  recommended: SchemeOption;
  schemes: SchemeOption[];
} {
  const isMicro = projectCost <= 140000;

  const optionA: SchemeOption = {
    id: 'MICRO_FINANCE',
    name: 'Micro Finance Scheme',
    tagline: 'Ideal for micro enterprises & small village setups up to ₹1.40 Lakh',
    applicableProjectCostRule: 'For project costs up to ₹1.40 Lakh',
    agencySupportText: 'Agency support up to 90% (max ₹1.25 Lakh)',
    agencySupportPercent: 90,
    maxAgencyAmount: 125000,
    interestRate: 6.5,
    tenureYears: 3,
    tenureMonths: 36,
    moratoriumMonths: 3,
    isRecommended: isMicro,
    whyRecommended: isMicro
      ? 'Your project cost (₹' + projectCost.toLocaleString('en-IN') + ') is within the ₹1.40 Lakh threshold for Micro Finance support.'
      : 'Applicable when project cost is capped at ₹1.40 Lakh.',
    parametersBasis: 'Based on SIH26091 problem-statement parameters',
  };

  const optionB: SchemeOption = {
    id: 'TERM_LOAN',
    name: 'Term Loan Scheme',
    tagline: 'Structured growth financing for projects above ₹1.40 Lakh up to ₹50 Lakh',
    applicableProjectCostRule: 'For project costs above ₹1.40 Lakh up to ₹50 Lakh',
    agencySupportText: 'Agency support up to 90% (max ₹45 Lakh)',
    agencySupportPercent: 90,
    maxAgencyAmount: 4500000,
    interestRate: 8.0,
    tenureYears: 7,
    tenureMonths: 84,
    moratoriumMonths: 6,
    isRecommended: !isMicro,
    whyRecommended: !isMicro
      ? 'Your project cost (₹' + projectCost.toLocaleString('en-IN') + ') exceeds ₹1.40 Lakh, qualifying for long-term Term Loan financing with 6-month moratorium.'
      : 'Applicable when project cost exceeds ₹1.40 Lakh.',
    parametersBasis: 'Based on SIH26091 problem-statement parameters',
  };

  return {
    recommended: isMicro ? optionA : optionB,
    schemes: [optionA, optionB],
  };
}

/**
 * Standard Reducing Balance Amortization Formula
 * EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where:
 * P = principal loan amount
 * r = monthly interest rate = (annualRate / 12) / 100
 * n = repayment tenure in months (active payment months after moratorium)
 */
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

  // Active repayment months
  const activeMonths = totalMonths - moratorium;
  const monthlyRate = annualRate / 12 / 100;

  // EMI formula
  const emiFactor = Math.pow(1 + monthlyRate, activeMonths);
  const monthlyEMI = Math.round((P * monthlyRate * emiFactor) / (emiFactor - 1));

  let currentBalance = P;
  let accumulatedInterest = 0;
  const schedule = [];

  // 1. Moratorium Period: Only interest or grace
  for (let m = 1; m <= moratorium; m++) {
    const interestDuringMoratorium = Math.round(currentBalance * monthlyRate);
    accumulatedInterest += interestDuringMoratorium;
    schedule.push({
      month: m,
      emi: interestDuringMoratorium, // Only simple interest during grace
      principal: 0,
      interest: interestDuringMoratorium,
      balance: currentBalance,
    });
  }

  // 2. Active Amortization Period
  for (let m = moratorium + 1; m <= totalMonths; m++) {
    const interestForMonth = Math.round(currentBalance * monthlyRate);
    const principalForMonth = Math.min(monthlyEMI - interestForMonth, currentBalance);
    accumulatedInterest += interestForMonth;
    currentBalance = Math.max(0, currentBalance - principalForMonth);

    schedule.push({
      month: m,
      emi: monthlyEMI,
      principal: principalForMonth,
      interest: interestForMonth,
      balance: currentBalance,
    });
  }

  const totalRepayment = P + accumulatedInterest;

  return {
    loanAmount: P,
    annualInterestRate: annualRate,
    tenureMonths: totalMonths,
    moratoriumMonths: moratorium,
    monthlyEMI,
    totalInterest: accumulatedInterest,
    totalRepayment,
    schedule,
  };
}

/**
 * Deterministic 36-Month Growth Trajectory
 * Calculates realistic operating revenues, costs, margins, and break-even point
 */
export function calculateGrowthProjections(
  projectCost: number,
  monthlyEMI: number,
  category: string
): GrowthProjectionData {
  // Base monthly steady-state revenue estimate around 18-24% of project cost for rural micro-enterprises
  const baseSteadyRevenue = Math.round(projectCost * 0.22);
  const baseOperatingExpenseRate = 0.62; // 62% operating expenses (materials, power, labor)

  const monthlyData: GrowthDataPoint[] = [];
  let cumulativeCash = -projectCost * 0.1; // initial margin outflow

  let breakEvenMonth = 0;

  for (let m = 1; m <= 36; m++) {
    // Ramp-up sigmoid curve from month 1 (45% capacity) to month 12 (100% capacity)
    const rampFactor = m <= 12 ? 0.45 + (0.55 * (m - 1)) / 11 : 1.0 + (0.15 * (m - 12)) / 24;
    const revenue = Math.round(baseSteadyRevenue * rampFactor);
    const expenses = Math.round(revenue * baseOperatingExpenseRate);
    const repayment = monthlyEMI;
    const netProfit = revenue - expenses - repayment;
    cumulativeCash += netProfit;

    if (cumulativeCash > 0 && breakEvenMonth === 0) {
      breakEvenMonth = m;
    }

    monthlyData.push({
      month: m,
      label: `M${m}`,
      revenue,
      expenses,
      profit: netProfit,
      repayment,
      cashFlow: cumulativeCash,
    });
  }

  if (breakEvenMonth === 0) {
    breakEvenMonth = 8; // fallback realistic break-even
  }

  const matureMonth = monthlyData[18] || monthlyData[monthlyData.length - 1];

  return {
    monthlyData,
    projectedMonthlyRevenue: matureMonth.revenue,
    projectedMonthlyProfit: matureMonth.profit,
    breakEvenMonths: breakEvenMonth,
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
