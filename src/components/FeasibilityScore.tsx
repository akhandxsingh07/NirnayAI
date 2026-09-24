import React from 'react';
import { FeasibilityScoreData } from '../types';
import { CheckCircle2, TrendingUp, DollarSign, Users2, Cog, Compass } from 'lucide-react';

interface FeasibilityScoreProps {
  data: FeasibilityScoreData;
  className?: string;
}

export const FeasibilityScore: React.FC<FeasibilityScoreProps> = ({ data, className = '' }) => {
  const safeData = data || {
    overallScore: 78,
    statusLabel: 'Promising — proceed with controlled investment',
    marketPotential: 82,
    capitalFit: 76,
    competitionScore: 68,
    operationalFeasibility: 81,
    growthPotential: 84,
  };

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((safeData.overallScore || 75) / 100) * circumference;

  const subMetrics = [
    {
      label: 'Market Potential',
      score: safeData.marketPotential ?? 75,
      icon: Compass,
      desc: 'Local customer demand & recurring consumption velocity',
    },
    {
      label: 'Capital Fit',
      score: safeData.capitalFit ?? 75,
      icon: DollarSign,
      desc: 'Fit between available capital, estimated setup cost and manageable funding gap',
    },
    {
      label: 'Competition Density',
      score: safeData.competitionScore ?? 75,
      icon: Users2,
      desc: 'Pressure from informal vendors & pricing defense',
    },
    {
      label: 'Operational Feasibility',
      score: safeData.operationalFeasibility ?? 75,
      icon: Cog,
      desc: 'Local input supply, power, labor & cold chain access',
    },
    {
      label: 'Growth Potential',
      score: safeData.growthPotential ?? 75,
      icon: TrendingUp,
      desc: '3-year capacity expansion & value-added diversification',
    },
  ];

  return (
    <div className={`bg-white rounded-2xl border border-[#D9B99B]/40 p-6 shadow-xs ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Main Circular Score Display */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/30 text-center">
          <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
              {/* Background track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#E8DCCE"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#6B4535"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-[#2B1B16] tracking-tight">
                {data.overallScore}
              </span>
              <span className="text-xs font-semibold text-[#8B5E47] uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6F7655]/15 text-[#474e30] border border-[#6F7655]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {data.statusLabel}
            </span>
          </div>
          <p className="text-xs text-[#8B5E47] mt-2 max-w-xs">
            Synthesized algorithmic feasibility benchmark across 5 core operational pillars.
          </p>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="md:col-span-7 space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B5E47]">
            Component Score Breakdown
          </h4>
          {subMetrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#2B1B16]">
                    <Icon className="w-3.5 h-3.5 text-[#8B5E47]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-extrabold text-[#6B4535]">{item.score} / 100</span>
                </div>
                {/* Bar */}
                <div className="w-full bg-[#FAF7F3] rounded-full h-2.5 overflow-hidden border border-[#D9B99B]/30">
                  <div
                    className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#B9825B] to-[#6B4535]"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#8B5E47]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
