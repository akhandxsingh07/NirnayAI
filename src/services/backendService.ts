import { supabase } from '../lib/supabase';
import type {
  AssessmentFormData,
  FinancialStructureData,
  FeasibilityScoreData,
  LocalOpportunityData,
  SWOTData,
} from '../types';

export interface PersistedAnalysisPayload {
  feasibilityScore: FeasibilityScoreData;
  recommendation: string;
  swot: SWOTData;
  insights: Array<{ title: string; description: string; tag: string }>;
  localOpportunity: LocalOpportunityData;
  isAiGenerated: boolean;
}

export async function saveAssessmentBundle(
  formData: AssessmentFormData,
  analysis: PersistedAnalysisPayload,
  financial: FinancialStructureData
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: assessment, error: assessmentError } = await supabase
    .from('business_assessments')
    .insert({
      user_id: user.id,
      business_idea: formData.businessIdea || formData.ideaText || formData.category,
      category: formData.category,
      available_margin: formData.availableMargin || formData.marginCapital || 0,
      selected_expertise: formData.selectedExpertise || null,
      available_land_acres: formData.availableLandAcres ?? null,
      target_market: formData.targetMarket || null,
      prior_experience: formData.priorExperience || null,
      risk_willingness: formData.riskWillingness || null,
      village: formData.location.village || null,
      block: formData.location.block || null,
      district: formData.location.district || null,
      state: formData.location.state || null,
      raw_input: formData,
      status: 'completed',
    })
    .select('id')
    .single();

  if (assessmentError || !assessment) {
    console.warn('Could not persist assessment:', assessmentError?.message);
    return null;
  }

  const assessmentId = assessment.id as string;

  const [analysisResult, financeResult] = await Promise.all([
    supabase.from('ai_analyses').insert({
      assessment_id: assessmentId,
      user_id: user.id,
      feasibility_score: analysis.feasibilityScore.overallScore,
      recommendation: analysis.recommendation,
      swot: analysis.swot,
      insights: analysis.insights,
      local_opportunity: analysis.localOpportunity,
      model: analysis.isAiGenerated ? 'gemini-2.5-flash' : 'deterministic-fallback',
      is_ai_generated: analysis.isAiGenerated,
    }),
    supabase.from('financial_plans').insert({
      assessment_id: assessmentId,
      user_id: user.id,
      total_project_cost: financial.totalProjectCost,
      margin_amount: financial.entrepreneurMargin,
      loan_requirement: financial.loanRequirement,
      recommended_scheme: financial.recommendedScheme,
      payload: financial,
    }),
  ]);

  if (analysisResult.error) console.warn('Could not persist AI analysis:', analysisResult.error.message);
  if (financeResult.error) console.warn('Could not persist financial plan:', financeResult.error.message);

  return assessmentId;
}

export async function saveBusinessReport(
  assessmentId: string | null,
  title: string,
  language: string,
  reportData: unknown
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('reports').insert({
    user_id: user.id,
    assessment_id: assessmentId,
    title,
    language,
    report_data: reportData,
  });

  if (error) console.warn('Could not persist report:', error.message);
}

export async function getAdminStats(): Promise<{
  citizens: number;
  assessments: number;
  reports: number;
  analyses: number;
}> {
  const [citizens, assessments, reports, analyses] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'citizen'),
    supabase.from('business_assessments').select('id', { count: 'exact', head: true }),
    supabase.from('reports').select('id', { count: 'exact', head: true }),
    supabase.from('ai_analyses').select('id', { count: 'exact', head: true }),
  ]);

  return {
    citizens: citizens.count || 0,
    assessments: assessments.count || 0,
    reports: reports.count || 0,
    analyses: analyses.count || 0,
  };
}

export async function getRecentAdminActivity(): Promise<Array<{
  action: string;
  entity_type: string | null;
  created_at: string;
}>> {
  const { data } = await supabase
    .from('admin_activity')
    .select('action, entity_type, created_at')
    .order('created_at', { ascending: false })
    .limit(8);

  return data || [];
}
