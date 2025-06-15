
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

export interface Competitor {
  id: string;
  analysis_id: string;
  name: string;
  website: string;
  description?: string;
  positioning?: string;
  pricing_model?: string;
  pricing_start?: number;
  strengths?: string[];
  weaknesses?: string[];
  features?: Record<string, any>;
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
