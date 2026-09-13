import React from 'react';
import { GrowthProjectionData, AssessmentFormData, PageId, LanguageCode, BusinessCategory } from '../types';
import { GrowthChart } from '../components/GrowthChart';
import { EvidenceBadge } from '../components/EvidenceBadge';
import { t } from '../services/localizationService';
import { TrendingUp, ArrowRight, ShieldAlert, Flag } from 'lucide-react';

interface GrowthPageProps {
  formData: AssessmentFormData;
  growthData: GrowthProjectionData;
  onNavigate: (page: PageId) => void;
  language: LanguageCode;
}

const CATEGORY_ACTIONS: Record<BusinessCategory, string[]> = {
  Dairy: [
    'Set up hygienic collection, testing and cold-chain basics; validate farmer supply and repeat local buyers.',
    'Pilot fixed morning/evening routes with households, tea stalls, sweet shops and nearby institutions.',
    'Track spoilage, procurement quality, payment cycles and delivery cost before increasing daily volume.',
    'Add higher-margin products such as curd or paneer only after raw-milk demand and cold-chain discipline are stable.',
    'Expand sourcing and delivery radius only when repeat demand and working-capital cycles remain healthy.',
  ],
  'Food Processing': [
    'Complete food-safety basics, recipe standardisation, packaging tests and a small first production batch.',
    'Sell through local retailers, direct orders and institutions; measure repeat purchase by SKU.',
    'Control yield loss, shelf life, packaging cost and batch-wise gross margin before scaling output.',
    'Add the best-performing value-added SKU and negotiate better raw-material/packaging procurement.',
    'Expand distribution to adjacent markets only after quality, returns and inventory rotation are controlled.',
  ],
  Retail: [
    'Launch a compact fast-moving assortment based on local buyer interviews instead of overstocking.',
    'Track daily basket size, repeat customers, dead stock and supplier replenishment speed.',
    'Refine the assortment around the highest-turnover products and enforce customer-credit limits.',
    'Add local delivery, digital ordering or institutional supply where repeat demand supports it.',
    'Expand stock depth or a second catchment only after inventory turnover and cash conversion remain healthy.',
  ],
  'Agriculture Services': [
    'Prepare core tools, safety equipment and a seasonal service menu based on nearby farm needs.',
    'Pilot paid services with a small farmer cluster and record travel, fuel, repair and job-completion time.',
    'Prioritise repeatable services and maintain spare-part/maintenance reserves through the busy season.',
    'Add complementary services or equipment only when utilisation and payment collection are predictable.',
    'Expand to adjacent villages through farmer groups, input shops and referral partnerships.',
  ],
  Poultry: [
    'Set up housing, brooding, ventilation, water, hygiene and mortality-control routines before the first batch.',
    'Pilot a controlled batch and validate egg/bird off-take with retailers, households and food-service buyers.',
    'Track feed conversion, mortality, medicine, electricity and sale-price movement before increasing flock size.',
    'Scale batch size gradually and negotiate feed/input procurement after stable production cycles.',
    'Add broader market routes only after biosecurity, working capital and buyer payment discipline are proven.',
  ],
  Tailoring: [
    'Start with essential machines, samples, measurement workflow and a narrow set of high-demand services.',
    'Build repeat local orders through schools, women’s groups, boutiques, uniforms and alteration work.',
    'Track order turnaround, rework, fabric/trim usage and advance-payment discipline.',
    'Add higher-value designs, small-batch production or training support once capacity is consistently utilised.',
    'Expand through referrals, WhatsApp catalogues and institutional orders without overcommitting inventory.',
  ],
  Handicrafts: [
    'Standardise a small product range, costing, finishing quality and packaging before producing large inventory.',
    'Test sales at local markets, tourist routes, gift shops and online/social channels where practical.',
    'Track artisan time, raw-material yield, packaging, returns and product-wise contribution margin.',
    'Double down on the best-selling designs and improve packaging/storytelling rather than expanding every SKU.',
    'Scale through bulk gifting, retail partners or marketplaces only after repeat demand is established.',
  ],
  'Repair Services': [
    'Prepare diagnostic tools, common spares, pricing rules and a clear service/warranty process.',
    'Build a local referral base through households, shops, institutions and pickup/on-site service.',
    'Track first-time fix rate, parts cost, callbacks, travel time and payment collection.',
    'Add adjacent repair categories or AMC-style service only when core jobs are consistently profitable.',
    'Expand service radius or technician capacity after demand exceeds current utilisation.',
  ],
  'Small Manufacturing': [
    'Commission minimum viable machinery, safety controls and a small validated production run.',
    'Secure trial orders from local retailers, contractors, institutions or B2B buyers before raising output.',
    'Track machine utilisation, rejection rate, power, labour and raw-material yield at batch level.',
    'Improve throughput and procurement economics before adding new machinery or product variants.',
    'Expand capacity and market radius only after order visibility, quality and working capital remain stable.',
  ],
  Other: [
    'Launch the smallest workable version of the selected business and verify the first paying customers.',
    'Track repeat demand, pricing acceptance, delivery/service cost and working-capital use.',
    'Fix operational bottlenecks and focus on the most profitable customer/product route.',
    'Add capacity or a second offer only after the core model shows repeatable economics.',
    'Expand the catchment in stages and keep a cash buffer for volatility and delayed payments.',
  ],
};

export const GrowthPage: React.FC<GrowthPageProps> = ({
  formData,
  growthData,
  onNavigate,
  language,
}) => {
  const actions = CATEGORY_ACTIONS[formData.category] || CATEGORY_ACTIONS.Other;
  const milestones = [
    { period: 'Months 1–3', title: 'Setup & Validation', detail: actions[0], badge: 'Pilot Setup' },
    { period: 'Months 4–6', title: 'Customer Acquisition', detail: actions[1], badge: 'Market Test' },
    { period: 'Months 7–12', title: 'Operational Stabilisation', detail: actions[2], badge: 'Stabilise' },
    { period: 'Months 13–24', title: 'Margin & Capacity Improvement', detail: actions[3], badge: 'Optimise' },
    { period: 'Months 25–36', title: 'Controlled Expansion', detail: actions[4], badge: 'Scale Carefully' },
  ];
  const breakEvenText = growthData.breakEvenMonths > 36 ? 'Not reached within 36-month model' : `Modelled in month ${growthData.breakEvenMonths}`;

  return (
    <div className="space-y-8 py-2">
      <div className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FAF7F3] text-[#6B4535] border border-[#D9B99B]/50"><TrendingUp className="w-5 h-5" /></span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B1B16]">{t('growthTitle', language)}</h1>
          </div>
          <p className="text-xs text-[#8B5E47] mt-1 max-w-3xl">
            Indicative 36-month scenario for <strong className="text-[#2B1B16]">{formData.businessIdea || formData.ideaText}</strong>. Revenue ramp and operating-cost assumptions now vary by business category. Break-even status: <strong>{breakEvenText}</strong>.
          </p>
        </div>

        <button onClick={() => onNavigate('report')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2F24] hover:bg-[#2B1B16] text-white font-bold text-xs shadow-xs transition-all">
          <span>Generate Final Business Plan</span><ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Indicative Financial Trajectory (Month 1–36)</h2>
          <EvidenceBadge type="INDICATIVE" />
        </div>
        <GrowthChart data={growthData} />
      </section>

      <section className="bg-white rounded-3xl border border-[#D9B99B]/40 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#D9B99B]/30 pb-3">
          <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-[#8B5E47]" /><h2 className="text-sm font-bold text-[#2B1B16] uppercase tracking-wider">Business-Specific 36-Month Roadmap</h2></div>
          <span className="text-xs text-[#8B5E47]">{formData.category}</span>
        </div>

        <div className="space-y-4">
          {milestones.map((m, idx) => (
            <div key={m.period} className="p-4 rounded-2xl bg-[#FAF7F3] border border-[#D9B99B]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#6B4535] transition-all">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#4A2F24] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{idx + 1}</div>
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-[#6B4535]">{m.period}:</span><h3 className="text-xs font-bold text-[#2B1B16]">{m.title}</h3></div>
                  <p className="text-xs text-[#4A2F24] mt-1 leading-relaxed max-w-3xl">{m.detail}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white border border-[#D9B99B]/60 text-[#4A2F24] shrink-0 self-start sm:self-center">{m.badge}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
        <div><span className="font-bold">Projection notice:</span> Revenue, profit, break-even and growth values are scenario estimates, not guarantees. Actual results depend on local demand, prices, input costs, utilisation, weather where relevant, credit collection and execution. If the model does not break even within 36 months, NirnayAI now reports that instead of inventing a fallback month.</div>
      </div>
    </div>
  );
};
