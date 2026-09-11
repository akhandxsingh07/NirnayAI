import React, { useState } from 'react';
import { AssessmentFormData, BusinessCategory, PageId, LanguageCode } from '../types';
import { DEMO_ASSESSMENT_DATA } from '../utils/demoData';
import { formatINR } from '../utils/financialCalculations';
import { t } from '../services/localizationService';
import {
  FileText,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Award,
  AlertTriangle,
  Play,
  ArrowRight,
  Mic,
  Sparkles,
  Calculator,
  CheckCircle2,
} from 'lucide-react';

interface AssessmentPageProps {
  initialData: AssessmentFormData;
  onSubmit: (data: AssessmentFormData) => void;
  language: LanguageCode;
  onOpenVoice: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  initialData,
  onSubmit,
  language,
  onOpenVoice,
}) => {
  const [formData, setFormData] = useState<AssessmentFormData>(initialData);

  const categories: BusinessCategory[] = [
    'Dairy',
    'Food Processing',
    'Retail',
    'Agriculture Services',
    'Poultry',
    'Tailoring',
    'Repair Services',
    'Small Manufacturing',
    'Handicrafts',
    'Other',
  ];

  const handleFillDemo = () => {
    setFormData(DEMO_ASSESSMENT_DATA);
  };

  // Instant calculated preview
  const margin = formData.availableMargin || 0;
  const estimatedProjectCost = Math.round(margin / 0.1);
  const estimatedLoan = Math.round(estimatedProjectCost * 0.9);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">
              {t('assessmentTitle', language)}
            </h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1">
            Provide baseline rural location, enterprise category, and margin capital to run feasibility and financial structuring.
          </p>
        </div>

        {/* Fill Demo Data Button */}
        <button
          type="button"
          onClick={handleFillDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF7F3] hover:bg-[#F3E8DC] text-[#4A2F24] border border-[#D9B99B]/70 font-bold text-xs shadow-2xs transition-all"
        >
          <Play className="w-3.5 h-3.5 text-[#B9825B] fill-[#B9825B]" />
          <span>{t('btnFillDemo', language)}</span>
        </button>
      </div>

      {/* Main Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Location Profile */}
        <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D9B99B]/30 pb-3">
            <MapPin className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              1. Geographic & Location Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldVillage', language)} *
              </label>
              <input
                type="text"
                required
                value={formData.location.village}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, village: e.target.value },
                  })
                }
                placeholder="e.g. Rampur"
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldBlock', language)} *
              </label>
              <input
                type="text"
                required
                value={formData.location.block}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, block: e.target.value },
                  })
                }
                placeholder="e.g. Mahmudabad"
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldDistrict', language)} *
              </label>
              <input
                type="text"
                required
                value={formData.location.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, district: e.target.value },
                  })
                }
                placeholder="e.g. Sitapur"
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldState', language)} *
              </label>
              <input
                type="text"
                required
                value={formData.location.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value },
                  })
                }
                placeholder="e.g. Uttar Pradesh"
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Category & Description */}
        <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D9B99B]/30 pb-3">
            <Briefcase className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              2. Proposed Business Opportunity
            </h2>
          </div>

          {/* Category Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2B1B16] block">
              {t('fieldCategory', language)} *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    formData.category === cat
                      ? 'bg-[#6B4535] text-white shadow-xs font-bold'
                      : 'bg-[#FAF7F3] text-[#4A2F24] border border-[#D9B99B]/60 hover:bg-[#F3E8DC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Business Idea Description + Voice CTA */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-[#2B1B16]">
                {t('fieldIdea', language)} *
              </label>
              <button
                type="button"
                onClick={onOpenVoice}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B4535] hover:text-[#2B1B16]"
              >
                <Mic className="w-3.5 h-3.5 text-[#B9825B]" />
                <span>Speak Business Idea</span>
              </button>
            </div>
            <textarea
              required
              rows={2}
              value={formData.businessIdea}
              onChange={(e) => setFormData({ ...formData, businessIdea: e.target.value })}
              placeholder="e.g. Dairy & Milk Collection Center (Curd/Paneer/Fresh Milk supply to local tea stalls and households)"
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-xs text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
            />
          </div>

          {/* Target Customers */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2B1B16] block">
              {t('fieldTargetMarket', language)}
            </label>
            <input
              type="text"
              value={formData.targetMarket}
              onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
              placeholder="e.g. Local households and tea stalls within 5 km"
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-xs text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
            />
          </div>
        </div>

        {/* Section 3: Financial Capital & Risk Profile */}
        <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D9B99B]/30 pb-3">
            <DollarSign className="w-4 h-4 text-[#8B5E47]" />
            <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">
              3. Margin Money & Risk Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Available Margin Money */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldMargin', language)} (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#8B5E47] font-bold">₹</span>
                <input
                  type="number"
                  required
                  min={5000}
                  max={1000000}
                  step={5000}
                  value={formData.availableMargin}
                  onChange={(e) =>
                    setFormData({ ...formData, availableMargin: Number(e.target.value) })
                  }
                  className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-xs font-bold text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
                />
              </div>
              <span className="text-[10px] text-[#8B5E47]">
                Your self-contribution equity (10% standard rule)
              </span>
            </div>

            {/* Prior Experience */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldExperience', language)}
              </label>
              <select
                value={formData.priorExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priorExperience: e.target.value as 'None' | 'Some' | 'Experienced',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-xs text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
              >
                <option value="None">None (First-time entrepreneur)</option>
                <option value="Some">Some (Family background or informal)</option>
                <option value="Experienced">Experienced (2+ years working knowledge)</option>
              </select>
            </div>

            {/* Risk Willingness */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#2B1B16] block">
                {t('fieldRisk', language)}
              </label>
              <select
                value={formData.riskWillingness}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    riskWillingness: e.target.value as 'Low' | 'Medium' | 'High',
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F3] border border-[#D9B99B]/60 text-xs text-[#2B1B16] focus:outline-hidden focus:ring-1 focus:ring-[#6B4535]"
              >
                <option value="Low">Low (Safe, steady recurring demand)</option>
                <option value="Medium">Medium (Balanced investment & growth)</option>
                <option value="High">High (Aggressive equipment & capacity expansion)</option>
              </select>
            </div>
          </div>

          {/* Real-time Project Cost Preview based on SIH26091 10% Margin Rule */}
          <div className="p-4 rounded-2xl bg-[#6F7655]/10 border border-[#6F7655]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#474e30]">
              <Calculator className="w-4 h-4 text-[#6F7655]" />
              <span>SIH26091 Capital Multiplication Preview:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#6F7655]/20">
                <span className="text-[10px] text-[#8B5E47] block">Your 10% Margin:</span>
                <span className="text-sm font-extrabold text-[#2B1B16]">
                  {formatINR(margin)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#6F7655]/20">
                <span className="text-[10px] text-[#8B5E47] block">Total Eligible Project Cost:</span>
                <span className="text-sm font-extrabold text-[#6B4535]">
                  {formatINR(estimatedProjectCost)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#6F7655]/20">
                <span className="text-[10px] text-[#8B5E47] block">90% Loan Requirement:</span>
                <span className="text-sm font-extrabold text-[#474e30]">
                  {formatINR(estimatedLoan)}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#474e30]/80">
              *Deterministic financial calculation: Project Cost = Margin ÷ 10%. Loan = 90% of Project Cost.
            </p>
          </div>
        </div>

        {/* Submit CTA */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-sm shadow-md transition-all hover:gap-3"
          >
            <span>{t('btnAnalyze', language)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
