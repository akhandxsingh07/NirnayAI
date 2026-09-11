import React, { useState } from 'react';
import { GrowthProjectionData, GrowthDataPoint } from '../types';
import { formatINR } from '../utils/financialCalculations';
import { TrendingUp, DollarSign, Clock, HelpCircle, ArrowUpRight } from 'lucide-react';

interface GrowthChartProps {
  data: GrowthProjectionData;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'profit' | 'cashFlow'>('revenue');
  const [hoveredPoint, setHoveredPoint] = useState<GrowthDataPoint | null>(null);

  const points = data?.monthlyData || [];
  if (points.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-8 text-center text-xs text-[#8B5E47]">
        Loading growth projection data...
      </div>
    );
  }

  const width = 800;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 40, left: 70 };

  // Calculate scales based on activeMetric
  let values: number[] = [0];
  if (points.length > 0) {
    if (activeMetric === 'revenue') {
      values = points.flatMap((p) => [p.revenue, p.expenses]);
    } else if (activeMetric === 'profit') {
      values = points.map((p) => p.profit);
    } else {
      values = points.map((p) => p.cashFlow);
    }
  }

  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(1000, ...values) * 1.15;

  const getX = (index: number) => {
    if (points.length <= 1) return padding.left;
    return padding.left + (index / (points.length - 1)) * (width - padding.left - padding.right);
  };

  const getY = (val: number) => {
    const range = maxValue - minValue || 1;
    return height - padding.bottom - ((val - minValue) / range) * (height - padding.top - padding.bottom);
  };

  const zeroY = getY(0);

  // Generate SVG path for a dataset
  const generateLinePath = (dataset: 'revenue' | 'expenses' | 'profit' | 'cashFlow' | 'repayment') => {
    return points.reduce((acc, curr, idx) => {
      const x = getX(idx);
      const y = getY(curr[dataset]);
      return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }, '');
  };

  const generateAreaPath = (dataset: 'revenue' | 'profit' | 'cashFlow') => {
    const line = generateLinePath(dataset);
    const lastX = getX(points.length - 1);
    const firstX = getX(0);
    return `${line} L ${lastX} ${zeroY} L ${firstX} ${zeroY} Z`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D9B99B]/40 p-6 shadow-xs space-y-6">
      {/* Chart Top Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#6B4535]" />
            <h3 className="text-base font-bold text-[#2B1B16]">
              36-Month Operational Trajectory
            </h3>
          </div>
          <p className="text-xs text-[#8B5E47] mt-0.5">
            Predictive modeling factoring standard rural micro-enterprise ramp-up and stabilization.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/50 text-xs">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeMetric === 'revenue'
                ? 'bg-[#6B4535] text-white shadow-xs'
                : 'text-[#6B4535] hover:text-[#2B1B16]'
            }`}
          >
            Revenue & Cost
          </button>
          <button
            onClick={() => setActiveMetric('profit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeMetric === 'profit'
                ? 'bg-[#6F7655] text-white shadow-xs'
                : 'text-[#6B4535] hover:text-[#2B1B16]'
            }`}
          >
            Net Profit
          </button>
          <button
            onClick={() => setActiveMetric('cashFlow')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeMetric === 'cashFlow'
                ? 'bg-[#B9825B] text-white shadow-xs'
                : 'text-[#6B4535] hover:text-[#2B1B16]'
            }`}
          >
            Cumulative Cash Flow
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
          <span className="text-[11px] font-semibold text-[#8B5E47] uppercase tracking-wider block">
            Projected Monthly Revenue
          </span>
          <div className="text-xl font-extrabold text-[#2B1B16] mt-1">
            {formatINR(data.projectedMonthlyRevenue)}
          </div>
          <span className="text-[10px] text-[#6F7655] font-bold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> Steady state capacity
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#6F7655]/10 border border-[#6F7655]/30">
          <span className="text-[11px] font-semibold text-[#474e30] uppercase tracking-wider block">
            Projected Monthly Profit
          </span>
          <div className="text-xl font-extrabold text-[#474e30] mt-1">
            {formatINR(data.projectedMonthlyProfit)}
          </div>
          <span className="text-[10px] text-[#474e30] font-medium block mt-0.5">
            After debt installment
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
          <span className="text-[11px] font-semibold text-[#8B5E47] uppercase tracking-wider block">
            Break-even Estimate
          </span>
          <div className="text-xl font-extrabold text-[#6B4535] mt-1">
            {data.breakEvenMonths} Months
          </div>
          <span className="text-[10px] text-[#8B5E47] block mt-0.5">
            Margin capital recovered
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/40">
          <span className="text-[11px] font-semibold text-[#8B5E47] uppercase tracking-wider block">
            Loan Repayment
          </span>
          <div className="text-xl font-extrabold text-[#2B1B16] mt-1">
            {formatINR(data.loanRepaymentMonthly)} / mo
          </div>
          <span className="text-[10px] text-[#8B5E47] block mt-0.5">
            Factored in profit model
          </span>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative aspect-16/9 sm:aspect-21/9 bg-[#FAF7F3] rounded-xl border border-[#D9B99B]/40 p-2 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B4535" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6B4535" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6F7655" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6F7655" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B9825B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B9825B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
            const val = minValue + ratio * (maxValue - minValue);
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#D9B99B"
                  strokeWidth="0.75"
                  strokeDasharray="4 4"
                  strokeOpacity="0.6"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#8B5E47"
                  fontWeight="600"
                >
                  {val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${Math.round(val / 1000)}k`}
                </text>
              </g>
            );
          })}

          {/* Zero baseline if cashflow negative */}
          {minValue < 0 && (
            <line
              x1={padding.left}
              y1={zeroY}
              x2={width - padding.right}
              y2={zeroY}
              stroke="#8B5E47"
              strokeWidth="1.5"
            />
          )}

          {/* Month X Labels */}
          {points.filter((_, idx) => idx % 6 === 0 || idx === points.length - 1).map((p, i) => {
            const idx = points.indexOf(p);
            const x = getX(idx);
            return (
              <text
                key={i}
                x={x}
                y={height - 15}
                textAnchor="middle"
                fontSize="11"
                fill="#4A2F24"
                fontWeight="700"
              >
                Month {p.month}
              </text>
            );
          })}

          {/* Paths depending on view */}
          {activeMetric === 'revenue' && (
            <>
              <path d={generateAreaPath('revenue')} fill="url(#revenueGradient)" />
              <path d={generateLinePath('revenue')} fill="none" stroke="#6B4535" strokeWidth="3" />
              <path d={generateLinePath('expenses')} fill="none" stroke="#B9825B" strokeWidth="2" strokeDasharray="5 4" />
            </>
          )}

          {activeMetric === 'profit' && (
            <>
              <path d={generateAreaPath('profit')} fill="url(#profitGradient)" />
              <path d={generateLinePath('profit')} fill="none" stroke="#6F7655" strokeWidth="3" />
            </>
          )}

          {activeMetric === 'cashFlow' && (
            <>
              <path d={generateAreaPath('cashFlow')} fill="url(#cashGradient)" />
              <path d={generateLinePath('cashFlow')} fill="none" stroke="#B9825B" strokeWidth="3" />
            </>
          )}

          {/* Hover tracker line */}
          {hoveredPoint && (
            <g>
              <line
                x1={getX(hoveredPoint.month - 1)}
                y1={padding.top}
                x2={getX(hoveredPoint.month - 1)}
                y2={height - padding.bottom}
                stroke="#2B1B16"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoveredPoint.month - 1)}
                cy={getY(
                  activeMetric === 'revenue'
                    ? hoveredPoint.revenue
                    : activeMetric === 'profit'
                    ? hoveredPoint.profit
                    : hoveredPoint.cashFlow
                )}
                r="6"
                fill="#2B1B16"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Transparent Hover catchers */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={getX(idx) - (width - padding.left - padding.right) / (points.length * 2)}
              y={padding.top}
              width={(width - padding.left - padding.right) / points.length}
              height={height - padding.top - padding.bottom}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p)}
            />
          ))}
        </svg>

        {/* Floating Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-[#D9B99B]/70 shadow-md text-xs space-y-1">
            <span className="font-extrabold text-[#2B1B16] block border-b border-[#F3E8DC] pb-1">
              Month {hoveredPoint.month} Snapshot
            </span>
            <div className="flex justify-between gap-4 text-[#4A2F24]">
              <span>Monthly Revenue:</span>
              <span className="font-bold text-[#6B4535]">{formatINR(hoveredPoint.revenue)}</span>
            </div>
            <div className="flex justify-between gap-4 text-[#8B5E47]">
              <span>Operating Costs:</span>
              <span className="font-bold">{formatINR(hoveredPoint.expenses)}</span>
            </div>
            <div className="flex justify-between gap-4 text-[#474e30]">
              <span>Net Monthly Profit:</span>
              <span className="font-extrabold">{formatINR(hoveredPoint.profit)}</span>
            </div>
            <div className="flex justify-between gap-4 text-[#8B5E47]">
              <span>Cumulative Cash:</span>
              <span className="font-bold">{formatINR(hoveredPoint.cashFlow)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend & Indicative Disclaimer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B4535] pt-1">
        <div className="flex items-center gap-4">
          {activeMetric === 'revenue' && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-[#6B4535] rounded-full" />
                <span className="font-semibold text-[#2B1B16]">Projected Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-[#B9825B]" />
                <span>Operating Expenses</span>
              </div>
            </>
          )}
          {activeMetric === 'profit' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#6F7655] rounded-full" />
              <span className="font-semibold text-[#474e30]">Net Monthly Profit (post-EMI)</span>
            </div>
          )}
          {activeMetric === 'cashFlow' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#B9825B] rounded-full" />
              <span className="font-semibold text-[#8B5E47]">Cumulative Net Cash Generated</span>
            </div>
          )}
        </div>

        <span className="text-[11px] text-[#8B5E47] italic">
          *Indicative projection based on SIH26091 model parameters. Does not represent guaranteed financial returns.
        </span>
      </div>
    </div>
  );
};
