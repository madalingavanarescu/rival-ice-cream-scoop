export interface Analysis {
  id: string;
  user_id: string;
  name: string;
  website: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  template: 'professional' | 'executive' | 'battlecard';
  created_at: string;
  updated_at: string;
}

export interface PricingDetails {
  free_tier: boolean;
  starting_price: number;
  currency: string;
  billing_cycle: 'monthly' | 'annual' | 'usage';
  enterprise_pricing: 'custom' | 'contact' | 'disclosed';
  pricing_notes: string;
}

export interface Competitor {
  id: string;
  analysis_id: string;
  name: string;
  website: string;
  description?: string;
  positioning?: string;
  pricing_model?: string;
  pricing_start?: number;
  pricing_details?: PricingDetails;
  strengths?: string[];
  weaknesses?: string[];
  features?: Record<string, any>;
  target_audience?: string;
  value_proposition?: string;
  competitive_advantages?: string[];
  market_focus?: 'B2B' | 'B2C' | 'Enterprise' | 'SMB' | 'Startup';
  last_analyzed: string;
  created_at: string;
}

export interface AnalysisContent {
  id: string;
  analysis_id: string;
  content_type: 'full_analysis' | 'executive_summary' | 'battle_card' | 'insights';
  content: string;
  generated_at: string;
}

export interface MonitoringAlert {
  id: string;
  competitor_id: string;
  alert_type: 'pricing_change' | 'feature_update' | 'content_change' | 'new_page';
  old_value?: string;
  new_value?: string;
  detected_at: string;
  is_read: boolean;
}

export interface DifferentiationAngle {
  id: string;
  analysis_id: string;
  title: string;
  description: string;
  opportunity_level: 'high' | 'medium' | 'low';
  created_at: string;
}

// Helper functions to transform Supabase data to our types
export const transformAnalysis = (data: any): Analysis => ({
  id: data.id,
  user_id: data.user_id,
  name: data.name,
  website: data.website,
  status: data.status as Analysis['status'],
  template: (data.template || 'professional') as Analysis['template'],
  created_at: data.created_at,
  updated_at: data.updated_at,
});

export const transformCompetitor = (data: any): Competitor => ({
  id: data.id,
  analysis_id: data.analysis_id,
  name: data.name,
  website: data.website,
  description: data.description,
  positioning: data.positioning,
  pricing_model: data.pricing_model,
  pricing_start: data.pricing_start,
  pricing_details: data.pricing_details as PricingDetails,
  strengths: data.strengths,
  weaknesses: data.weaknesses,
  features: data.features as Record<string, any>,
  target_audience: data.target_audience,
  value_proposition: data.value_proposition,
  competitive_advantages: data.competitive_advantages,
  market_focus: data.market_focus as Competitor['market_focus'],
  last_analyzed: data.last_analyzed || data.created_at,
  created_at: data.created_at,
});

export const transformAnalysisContent = (data: any): AnalysisContent => ({
  id: data.id,
  analysis_id: data.analysis_id,
  content_type: data.content_type as AnalysisContent['content_type'],
  content: data.content,
  generated_at: data.generated_at,
});

export const transformDifferentiationAngle = (data: any): DifferentiationAngle => ({
  id: data.id,
  analysis_id: data.analysis_id,
  title: data.title,
  description: data.description,
  opportunity_level: data.opportunity_level as DifferentiationAngle['opportunity_level'],
  created_at: data.created_at,
});
