
import { supabase } from "@/integrations/supabase/client";

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    html?: string;
    metadata?: {
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
    };
  };
  error?: string;
}

interface CompetitorData {
  name: string;
  description: string;
  positioning: string;
  pricing_model: string;
  pricing_start: number;
  strengths: string[];
  weaknesses: string[];
  features: Record<string, boolean>;
}

export class FirecrawlService {
  static async scrapeCompetitor(website: string, analysisId: string): Promise<{
    success: boolean;
    competitorData?: CompetitorData;
    error?: string;
  }> {
    try {
      console.log('Calling scrape-competitor edge function for:', website);
      
      const { data, error } = await supabase.functions.invoke('scrape-competitor', {
        body: {
          website,
          analysisId
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        return {
          success: false,
          error: error.message || 'Failed to scrape competitor website'
        };
      }

      if (!data.success) {
        console.error('Scraping failed:', data.error);
        return {
          success: false,
          error: data.error || 'Failed to scrape competitor website'
        };
      }

      console.log('Successfully scraped competitor:', data.competitorData?.name);
      return {
        success: true,
        competitorData: data.competitorData
      };
    } catch (error) {
      console.error('Error calling scrape-competitor function:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async discoverCompetitors(businessDescription: string, industry: string): Promise<{
    success: boolean;
    competitors?: string[];
    error?: string;
  }> {
    // For now, return some common competitor discovery logic
    // This will be enhanced in Phase 1B with proper search API integration
    const commonCompetitors = [
      'competitor1.com',
      'competitor2.com',
      'competitor3.com'
    ];

    return {
      success: true,
      competitors: commonCompetitors
    };
  }
}
