create or replace function private.create_default_action_tasks()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  insert into public.action_plan_tasks (user_id, assessment_id, task_key, title, position)
  values
    (new.user_id, new.id, 'udyam_registration', 'Complete Udyam registration', 1),
    (new.user_id, new.id, 'customer_validation', 'Validate demand with at least 5 local customers', 2),
    (new.user_id, new.id, 'supplier_quotes', 'Collect 2-3 supplier or equipment quotations', 3),
    (new.user_id, new.id, 'scheme_documents', 'Prepare identity, bank and scheme documents', 4),
    (new.user_id, new.id, 'bank_meeting', 'Schedule a financing discussion with the selected lender', 5);
  return new;
end;
$$;

revoke all on function private.create_default_action_tasks() from public, anon, authenticated;

drop trigger if exists on_assessment_create_tasks on public.business_assessments;
create trigger on_assessment_create_tasks
after insert on public.business_assessments
for each row execute function private.create_default_action_tasks();

create or replace function private.sync_action_task_completion()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if new.completed = true and coalesce(old.completed, false) = false then
    new.completed_at := now();
  elsif new.completed = false then
    new.completed_at := null;
  end if;
  return new;
end;
$$;

revoke all on function private.sync_action_task_completion() from public, anon, authenticated;

drop trigger if exists before_action_task_completion on public.action_plan_tasks;
create trigger before_action_task_completion
before update of completed on public.action_plan_tasks
for each row execute function private.sync_action_task_completion();

create or replace function private.log_nirnay_event()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  event_action text;
  event_entity_id uuid;
  event_metadata jsonb := '{}'::jsonb;
begin
  event_entity_id := new.id;

  if tg_table_name = 'profiles' then
    event_action := case when new.role = 'admin' then 'admin_profile_created' else 'citizen_registered' end;
    event_metadata := jsonb_build_object('role', new.role, 'email', new.email, 'phone', new.phone);
  elsif tg_table_name = 'business_assessments' then
    event_action := 'assessment_saved';
    event_metadata := jsonb_build_object('user_id', new.user_id, 'category', new.category, 'status', new.status);
  elsif tg_table_name = 'ai_analyses' then
    event_action := 'analysis_saved';
    event_metadata := jsonb_build_object('user_id', new.user_id, 'assessment_id', new.assessment_id, 'is_ai_generated', new.is_ai_generated);
  elsif tg_table_name = 'financial_plans' then
    event_action := 'financial_plan_saved';
    event_metadata := jsonb_build_object('user_id', new.user_id, 'assessment_id', new.assessment_id, 'recommended_scheme', new.recommended_scheme);
  elsif tg_table_name = 'reports' then
    event_action := 'report_saved';
    event_metadata := jsonb_build_object('user_id', new.user_id, 'assessment_id', new.assessment_id, 'language', new.language);
  else
    return new;
  end if;

  insert into public.admin_activity (action, entity_type, entity_id, metadata)
  values (event_action, tg_table_name, event_entity_id, event_metadata);

  return new;
end;
$$;

revoke all on function private.log_nirnay_event() from public, anon, authenticated;

drop trigger if exists audit_profile_insert on public.profiles;
create trigger audit_profile_insert after insert on public.profiles
for each row execute function private.log_nirnay_event();

drop trigger if exists audit_assessment_insert on public.business_assessments;
create trigger audit_assessment_insert after insert on public.business_assessments
for each row execute function private.log_nirnay_event();

drop trigger if exists audit_analysis_insert on public.ai_analyses;
create trigger audit_analysis_insert after insert on public.ai_analyses
for each row execute function private.log_nirnay_event();

drop trigger if exists audit_financial_plan_insert on public.financial_plans;
create trigger audit_financial_plan_insert after insert on public.financial_plans
for each row execute function private.log_nirnay_event();

drop trigger if exists audit_report_insert on public.reports;
create trigger audit_report_insert after insert on public.reports
for each row execute function private.log_nirnay_event();
