import React, { useState, useMemo } from 'react';
import { calculateEMI, formatINR } from '../utils/financialCalculations';
import { Calculator, ShieldAlert, Calendar, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface EMICalculatorProps {
  initialLoanAmount: number;
  initialRate?: number;
  initialTenureMonths?: number;
  initialMoratorium?: number;
  onValuesChange?: (emi: number, totalRepay: number) => void;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({
  initialLoanAmount,
  initialRate = 8.0,
  initialTenureMonths = 84, // 7 years default
  initialMoratorium = 6,
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(initialLoanAmount);
  const [interestRate, setInterestRate] = useState<number>(initialRate);
  const [tenureYears, setTenureYears] = useState<number>(Math.round(initialTenureMonths / 12) || 7);
  const [moratoriumMonths, setMoratoriumMonths] = useState<number>(initialMoratorium);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const totalTenureMonths = tenureYears * 12;

  const result = useMemo(() => {
    return calculateEMI(loanAmount, interestRate, totalTenureMonths, moratoriumMonths);
  }, [loanAmount, interestRate, totalTenureMonths, moratoriumMonths]);

  return (
    <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-6 shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9B99B]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#6B4535]" />
            <h3 className="text-base font-bold text-[#2B1B16]">
              Interactive EMI & Repayment Planner
            </h3>
          </div>
          <p className="text-xs text-[#8B5E47] mt-0.5">
            Deterministic reducing-balance calculation factoring grace / moratorium months.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F3E8DC] text-[#4A2F24] border border-[#D9B99B]/50">
          SIH26091 Parameter Engine
        </span>
      </div>

      {/* Control Sliders & Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Loan Amount */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-semibold text-[#2B1B16]">Loan Amount</label>
            <span className="font-bold text-[#6B4535]">{formatINR(loanAmount)}</span>
          </div>
          <input
            type="range"
            min={20000}
            max={5000000}
            step={10000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-[#6B4535] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8B5E47]">
            <span>₹20,000</span>
            <span>₹50 Lakh</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-semibold text-[#2B1B16]">Interest Rate</label>
            <span className="font-bold text-[#6B4535]">{interestRate.toFixed(1)}% p.a.</span>
          </div>
          <input
            type="range"
            min={5.0}
            max={14.0}
            step={0.5}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-[#6B4535] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8B5E47]">
            <span>5.0% (Subsidized)</span>
            <span>14.0%</span>
          </div>
        </div>

        {/* Tenure Years */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-semibold text-[#2B1B16]">Tenure (Years)</label>
            <span className="font-bold text-[#6B4535]">
              {tenureYears} Yrs ({totalTenureMonths} Mo)
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-[#6B4535] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8B5E47]">
            <span>1 Year</span>
            <span>7 Years</span>
          </div>
        </div>

        {/* Moratorium Grace */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40 space-y-2">
          <div className="flex justify-between text-xs">
            <label className="font-semibold text-[#2B1B16]">Moratorium Grace</label>
            <span className="font-bold text-[#6B4535]">{moratoriumMonths} Months</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={moratoriumMonths}
            onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
            className="w-full accent-[#6B4535] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#8B5E47]">
            <span>0 Mo</span>
            <span>12 Months</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#6B4535] text-white shadow-xs">
          <span className="text-xs uppercase tracking-wider font-medium text-[#F3E8DC]">
            Monthly Regular EMI
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
            {formatINR(result.monthlyEMI)}
          </div>
          <span className="block text-[11px] text-[#D9B99B] mt-1">
            Active repayment after {result.moratoriumMonths} mo moratorium
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50">
          <span className="text-xs uppercase tracking-wider font-medium text-[#8B5E47]">
            Total Interest Payable
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2B1B16] mt-1">
            {formatINR(result.totalInterest)}
          </div>
          <span className="block text-[11px] text-[#8B5E47] mt-1">
            Over {totalTenureMonths} months tenure
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50">
          <span className="text-xs uppercase tracking-wider font-medium text-[#8B5E47]">
            Total Outflow (Principal + Interest)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2B1B16] mt-1">
            {formatINR(result.totalRepayment)}
          </div>
          <span className="block text-[11px] text-[#8B5E47] mt-1">
            Principal {formatINR(result.loanAmount)} + Interest
          </span>
        </div>
      </div>

      {/* Moratorium Detail Banner */}
      {result.moratoriumMonths > 0 && (
        <div className="p-3.5 rounded-xl bg-[#6F7655]/10 border border-[#6F7655]/25 flex items-start gap-2.5 text-xs text-[#474e30]">
          <Clock className="w-4 h-4 shrink-0 text-[#6F7655] mt-0.5" />
          <div>
            <span className="font-bold">
              Moratorium Advantage ({result.moratoriumMonths} Months):
            </span>{' '}
            During the initial {result.moratoriumMonths} months, you are not burdened with principal installments. Only simple interest of approximately{' '}
            <strong>{formatINR(Math.round(result.loanAmount * (interestRate / 12 / 100)))}/month</strong> is serviced, safeguarding your early cash flow while your rural enterprise builds momentum.
          </div>
        </div>
      )}

      {/* Amortization Table Toggle */}
      <div className="pt-2">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B4535] hover:text-[#2B1B16] transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span>{showSchedule ? 'Hide' : 'View'} Complete Repayment Schedule ({result.schedule.length} Months)</span>
          {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSchedule && (
          <div className="mt-4 rounded-xl border border-[#D9B99B]/50 overflow-hidden text-xs">
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAF7F3] text-[#4A2F24] sticky top-0 border-b border-[#D9B99B]/50">
                  <tr>
                    <th className="p-2.5 font-bold">Month</th>
                    <th className="p-2.5 font-bold">Payment</th>
                    <th className="p-2.5 font-bold">Principal</th>
                    <th className="p-2.5 font-bold">Interest</th>
                    <th className="p-2.5 font-bold">Remaining Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E8DC]">
                  {result.schedule.map((row) => (
                    <tr
                      key={row.month}
                      className={row.month <= result.moratoriumMonths ? 'bg-[#6F7655]/5' : 'hover:bg-[#FAF7F3]'}
                    >
                      <td className="p-2 font-medium text-[#2B1B16]">
                        M{row.month}{' '}
                        {row.month <= result.moratoriumMonths && (
                          <span className="text-[10px] text-[#6F7655] font-bold">(Grace)</span>
                        )}
                      </td>
                      <td className="p-2 font-semibold text-[#6B4535]">{formatINR(row.emi)}</td>
                      <td className="p-2 text-[#4A2F24]">{formatINR(row.principal)}</td>
                      <td className="p-2 text-[#8B5E47]">{formatINR(row.interest)}</td>
                      <td className="p-2 font-medium text-[#2B1B16]">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FAF7F3] border border-[#D9B99B]/30 text-[11px] text-[#8B5E47]">
        <ShieldAlert className="w-4 h-4 shrink-0 text-[#B9825B]" />
        <span>
          Indicative calculation. Actual lending terms depend on the applicable institution/scheme and final approval.
        </span>
      </div>
    </div>
  );
};
