alter table public.business_assessments
  add column if not exists selected_expertise text,
  add column if not exists available_land_acres numeric;

comment on column public.business_assessments.selected_expertise is
  'Normalized skill selected by the citizen in the multilingual business finder.';

comment on column public.business_assessments.available_land_acres is
  'Land availability captured during the resource-based business assessment.';
