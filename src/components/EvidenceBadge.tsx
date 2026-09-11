import React from 'react';
import { EvidenceType } from '../types';
import { ShieldCheck, Info, Sparkles, AlertCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  type: EvidenceType;
  className?: string;
  showIcon?: boolean;
}

export const EVIDENCE_CONFIG: Record<
  EvidenceType,
  {
    label: string;
    description: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  SOURCE_BACKED: {
    label: 'SOURCE-BACKED',
    description: 'Based on verified institutional/census data and published scheme guidelines.',
    bg: 'bg-[#6F7655]/10',
    text: 'text-[#474e30]',
    border: 'border-[#6F7655]/30',
    icon: ShieldCheck,
  },
  INDICATIVE: {
    label: 'INDICATIVE',
    description: 'Estimated standard prototype simulation for local micro-market demonstration.',
    bg: 'bg-[#B9825B]/10',
    text: 'text-[#8B5E47]',
    border: 'border-[#B9825B]/30',
    icon: Info,
  },
  AI_INFERENCE: {
    label: 'AI INFERENCE',
    description: 'Synthesized domain interpretation based on your provided inputs and category model.',
    bg: 'bg-[#4A2F24]/10',
    text: 'text-[#4A2F24]',
    border: 'border-[#4A2F24]/30',
    icon: Sparkles,
  },
  VERIFY_LOCALLY: {
    label: 'VERIFY LOCALLY',
    description: 'Must be verified on-ground with local customers and suppliers prior to financial commitment.',
    bg: 'bg-amber-500/10',
    text: 'text-amber-800',
    border: 'border-amber-500/30',
    icon: AlertCircle,
  },
};

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  type,
  className = '',
  showIcon = true,
}) => {
  const config = EVIDENCE_CONFIG[type] || EVIDENCE_CONFIG.INDICATIVE;
  const Icon = config.icon;

  return (
    <span
      title={config.description}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};

export const EvidenceLegendBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white rounded-xl p-3 border border-[#D9B99B]/40 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B4535] ${className}`}
    >
      <div className="font-semibold text-[#2B1B16] flex items-center gap-1.5">
        <Info className="w-4 h-4 text-[#8B5E47]" />
        <span>Evidence & Confidence System:</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6F7655]/10 text-[#474e30] border border-[#6F7655]/30">
          <ShieldCheck className="w-3 h-3" /> Source-Backed
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B9825B]/10 text-[#8B5E47] border border-[#B9825B]/30">
          <Info className="w-3 h-3" /> Indicative
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4A2F24]/10 text-[#4A2F24] border border-[#4A2F24]/30">
          <Sparkles className="w-3 h-3" /> AI Inference
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30">
          <AlertCircle className="w-3 h-3" /> Verify Locally
        </span>
      </div>
    </div>
  );
};
