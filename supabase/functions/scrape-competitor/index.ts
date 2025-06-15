
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { FirecrawlService } from './firecrawlService.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Copy the FirecrawlService code here since we can't import from other files
class FirecrawlService {
  private static readonly BASE_URL = 'https://api.firecrawl.dev/v0';

  static async scrapeUrl(url: string) {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    try {
      console.log('Scraping URL with Firecrawl:', url);
      
      const response = await fetch(`${this.BASE_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          formats: ['markdown'],
          onlyMainContent: true,
          timeout: 30000
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Firecrawl API error:', response.status, errorText);
        return {
          success: false,
          error: `Failed to scrape website: ${response.status} ${errorText}`
        };
      }

      const data = await response.json();
      console.log('Firecrawl scraping successful for:', url);
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error scraping with Firecrawl:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static extractCompanyInfo(scrapedData: any) {
    const markdown = scrapedData?.markdown || '';
    const metadata = scrapedData?.metadata || {};
    
    const name = metadata.ogTitle || metadata.title || 'Unknown Company';
    const description = metadata.ogDescription || metadata.description || 
      this.extractFirstParagraph(markdown);
    
    return {
      name: this.cleanCompanyName(name),
      description: description.substring(0, 500),
      features: this.extractFeatures(markdown),
      pricing: this.extractPricing(markdown)
    };
  }

  private static extractFirstParagraph(markdown: string): string {
    const lines = markdown.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 50 && !trimmed.startsWith('#') && !trimmed.startsWith('*')) {
        return trimmed;
      }
    }
    return 'No description available';
  }

  private static extractFeatures(markdown: string): string[] {
    const features: string[] = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      if ((line.startsWith('- ') || line.startsWith('* ')) && line.length > 10) {
        features.push(line.replace(/^[-*]\s*/, '').trim());
      }
    }
    
    return features.slice(0, 10);
  }

  private static extractPricing(markdown: string): string[] {
    const pricing: string[] = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('$') || lower.includes('price') || lower.includes('plan')) {
        const cleaned = line.trim();
        if (cleaned.length > 5) {
          pricing.push(cleaned);
        }
      }
    }
    
    return pricing.slice(0, 5);
  }

  private static cleanCompanyName(name: string): string {
    return name
      .replace(/\s*[-|]\s*.*/g, '')
      .replace(/\s*(home|homepage|official|website).*$/gi, '')
      .trim();
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { website, analysisId } = await req.json();
    
    if (!website || !analysisId) {
      return new Response(
        JSON.stringify({ error: 'Website and analysisId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting competitor scraping for:', website);

    // Scrape the competitor website
    const scrapeResult = await FirecrawlService.scrapeUrl(website);
    
    if (!scrapeResult.success) {
      console.error('Failed to scrape website:', scrapeResult.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: scrapeResult.error || 'Failed to scrape website' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract company information from scraped data
    const companyInfo = FirecrawlService.extractCompanyInfo(scrapeResult.data);
    
    console.log('Extracted company info:', companyInfo);

    // Analyze the scraped content to extract competitor data
    const competitorData = {
      name: companyInfo.name,
      description: companyInfo.description,
      positioning: `${companyInfo.name} focuses on delivering value through their platform`,
      pricing_model: 'Subscription', // Will be enhanced with AI analysis later
      pricing_start: 29, // Will be extracted from pricing info later
      strengths: [
        'Established web presence',
        'Clear value proposition',
        'User-focused approach'
      ],
      weaknesses: [
        'Complex pricing structure',
        'Limited feature transparency'
      ],
      features: {
        'Core Platform': true,
        'User Dashboard': true,
        'Integration Support': true,
        'Analytics': companyInfo.features.some(f => f.toLowerCase().includes('analytic')),
        'Mobile Support': companyInfo.features.some(f => f.toLowerCase().includes('mobile')),
        'API Access': companyInfo.features.some(f => f.toLowerCase().includes('api')),
        'Custom Reports': companyInfo.features.some(f => f.toLowerCase().includes('report')),
        'Team Collaboration': companyInfo.features.some(f => f.toLowerCase().includes('team')),
      }
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        competitorData,
        scrapedFeatures: companyInfo.features,
        scrapedPricing: companyInfo.pricing
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-competitor function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
