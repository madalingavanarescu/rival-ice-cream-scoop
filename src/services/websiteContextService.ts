
import { supabase } from '@/integrations/supabase/client';
import { WebsiteContext, transformWebsiteContext } from '@/types/database';

export class WebsiteContextService {
  static async analyzeWebsite(website: string, companyName: string): Promise<any> {
    console.log('Analyzing website context for:', website);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-user-website', {
        body: { 
          website,
          companyName 
        }
      });

      if (error) {
        console.error('Error in website analysis:', error);
        throw error;
      }

      console.log('Website analysis result:', data);
      return data;
    } catch (error) {
      console.error('Error calling analyze-user-website function:', error);
      throw error;
    }
  }

  static async storeWebsiteContext(analysisId: string, websiteContext: any): Promise<void> {
    console.log('Storing website context for analysis:', analysisId);
    
    try {
      // Use type assertion to work around temporary type mismatch
      const { error } = await (supabase as any)
        .from('website_context')
        .insert({
          analysis_id: analysisId,
          company_name: websiteContext.company_name,
          business_model: websiteContext.business_model,
          industry: websiteContext.industry,
          target_audience: websiteContext.target_audience,
          value_proposition: websiteContext.value_proposition,
          core_offerings: websiteContext.core_offerings,
          pricing_strategy: websiteContext.pricing_strategy,
          competitive_positioning: websiteContext.competitive_positioning,
          website_quality: websiteContext.website_quality,
          strategic_context: websiteContext.strategic_context
        });

      if (error) {
        console.error('Error storing website context:', error);
        throw error;
      }

      console.log('Website context stored successfully');
    } catch (error) {
      console.error('Error storing website context:', error);
      throw error;
    }
  }

  static async getWebsiteContext(analysisId: string): Promise<WebsiteContext | null> {
    try {
      // Use type assertion to work around temporary type mismatch
      const { data, error } = await (supabase as any)
        .from('website_context')
        .select('*')
        .eq('analysis_id', analysisId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching website context:', error);
        return null;
      }

      return data ? transformWebsiteContext(data) : null;
    } catch (error) {
      console.error('Error fetching website context:', error);
      return null;
    }
  }
}
