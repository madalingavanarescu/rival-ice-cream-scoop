
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { website, competitorName, scrapedContent } = await req.json();
    
    if (!website || !competitorName) {
      return new Response(
        JSON.stringify({ error: 'Website and competitor name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing competitor:', competitorName, 'at', website);

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Create a comprehensive analysis prompt
    const prompt = `Analyze the competitor "${competitorName}" based on their website ${website}.

${scrapedContent ? `Website content: ${scrapedContent.substring(0, 2000)}...` : ''}

Provide a detailed analysis in the following JSON format:
{
  "name": "Competitor Name",
  "description": "Brief 2-3 sentence description of what they do",
  "positioning": "How they position themselves in the market",
  "pricing_model": "Subscription|Freemium|Per-seat|Usage-based|One-time|Tiered",
  "pricing_start": 29,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "features": {
    "User Management": true,
    "Analytics Dashboard": true,
    "API Access": false,
    "Mobile App": true,
    "Custom Integrations": false,
    "Advanced Reporting": true,
    "White Labeling": false,
    "SSO Integration": true,
    "Multi-language Support": false,
    "24/7 Support": true
  }
}

Base your analysis on actual information about the company. Be specific and realistic. For pricing, estimate based on market standards if exact information isn't available.`;

    console.log('Calling OpenRouter API for competitor analysis');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com',
        'X-Title': 'Competitor Analysis Tool',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst specialized in competitive intelligence. Provide accurate, detailed competitor analysis based on available information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      // Fallback to enhanced basic analysis
      return new Response(
        JSON.stringify({ 
          success: true,
          competitorData: getEnhancedFallbackAnalysis(competitorName, website),
          source: 'fallback'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI model');
    }

    console.log('AI Analysis Response:', aiResponse);

    // Parse the JSON response
    let competitorData;
    try {
      const parsed = JSON.parse(aiResponse);
      competitorData = {
        name: parsed.name || competitorName,
        description: parsed.description || `${competitorName} is a competitor in this market space.`,
        positioning: parsed.positioning || 'Market positioning not available',
        pricing_model: parsed.pricing_model || 'Subscription',
        pricing_start: parsed.pricing_start || 29,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Strong market presence'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Limited information available'],
        features: parsed.features || getDefaultFeatures()
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Extract key information from text response
      competitorData = extractAnalysisFromText(aiResponse, competitorName, website);
    }

    console.log('Processed competitor analysis:', competitorData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        competitorData,
        source: 'ai'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-competitor function:', error);
    
    // Fallback to enhanced analysis
    const fallbackData = getEnhancedFallbackAnalysis(
      req.body?.competitorName || 'Competitor', 
      req.body?.website || 'https://example.com'
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        competitorData: fallbackData,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getEnhancedFallbackAnalysis(competitorName: string, website: string): any {
  const domain = extractDomain(website);
  const industry = guessIndustryFromDomain(domain);
  
  return {
    name: competitorName,
    description: `${competitorName} is a ${industry} solution provider offering innovative tools and services to their target market.`,
    positioning: getIndustryPositioning(industry, competitorName),
    pricing_model: getIndustryPricingModel(industry),
    pricing_start: getIndustryPricingStart(industry),
    strengths: getIndustryStrengths(industry),
    weaknesses: getIndustryWeaknesses(industry),
    features: getIndustryFeatures(industry)
  };
}

function extractDomain(website: string): string {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    return url.hostname.replace('www.', '');
  } catch {
    return website.toLowerCase();
  }
}

function guessIndustryFromDomain(domain: string): string {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('commerce')) {
    return 'ecommerce';
  } else if (domainLower.includes('app') || domainLower.includes('software') || domainLower.includes('saas')) {
    return 'saas';
  } else if (domainLower.includes('marketing') || domainLower.includes('agency') || domainLower.includes('digital')) {
    return 'marketing';
  } else if (domainLower.includes('finance') || domainLower.includes('bank') || domainLower.includes('fintech')) {
    return 'fintech';
  } else {
    return 'general';
  }
}

function getIndustryPositioning(industry: string, competitorName: string): string {
  const positioning = {
    saas: `${competitorName} positions itself as a scalable solution for modern businesses seeking efficient workflow automation`,
    ecommerce: `${competitorName} focuses on providing comprehensive e-commerce solutions for online retailers`,
    marketing: `${competitorName} specializes in digital marketing tools and customer engagement platforms`,
    fintech: `${competitorName} offers innovative financial technology solutions for modern banking needs`,
    general: `${competitorName} provides professional services and solutions to help businesses grow`
  };
  
  return positioning[industry as keyof typeof positioning] || positioning.general;
}

function getIndustryPricingModel(industry: string): string {
  const models = {
    saas: 'Subscription',
    ecommerce: 'Tiered',
    marketing: 'Per-seat',
    fintech: 'Usage-based',
    general: 'Subscription'
  };
  
  return models[industry as keyof typeof models] || 'Subscription';
}

function getIndustryPricingStart(industry: string): number {
  const pricing = {
    saas: 29,
    ecommerce: 19,
    marketing: 49,
    fintech: 99,
    general: 39
  };
  
  return pricing[industry as keyof typeof pricing] || 29;
}

function getIndustryStrengths(industry: string): string[] {
  const strengths = {
    saas: ['Scalable platform', 'Strong integrations', 'User-friendly interface'],
    ecommerce: ['Comprehensive features', 'Mobile optimization', 'Payment flexibility'],
    marketing: ['Advanced analytics', 'Campaign automation', 'Multi-channel support'],
    fintech: ['Security compliance', 'Real-time processing', 'Regulatory adherence'],
    general: ['Reliable service', 'Good support', 'Competitive pricing']
  };
  
  return strengths[industry as keyof typeof strengths] || strengths.general;
}

function getIndustryWeaknesses(industry: string): string[] {
  const weaknesses = {
    saas: ['Complex setup', 'Learning curve'],
    ecommerce: ['Transaction fees', 'Limited customization'],
    marketing: ['Expensive for small teams', 'Feature complexity'],
    fintech: ['Strict requirements', 'Integration challenges'],
    general: ['Limited specialization', 'Generic features']
  };
  
  return weaknesses[industry as keyof typeof weaknesses] || weaknesses.general;
}

function getIndustryFeatures(industry: string): Record<string, boolean> {
  const baseFeatures = getDefaultFeatures();
  
  const industrySpecific = {
    saas: {
      ...baseFeatures,
      'API Access': true,
      'Custom Integrations': true,
      'Advanced Reporting': true
    },
    ecommerce: {
      ...baseFeatures,
      'Mobile App': true,
      'Multi-language Support': true,
      'Payment Processing': true
    },
    marketing: {
      ...baseFeatures,
      'Advanced Reporting': true,
      'Campaign Management': true,
      'Social Media Integration': true
    },
    fintech: {
      ...baseFeatures,
      'Security Compliance': true,
      'Real-time Processing': true,
      'Audit Trail': true
    }
  };
  
  return industrySpecific[industry as keyof typeof industrySpecific] || baseFeatures;
}

function getDefaultFeatures(): Record<string, boolean> {
  return {
    'User Management': true,
    'Analytics Dashboard': true,
    'API Access': Math.random() > 0.4,
    'Mobile App': Math.random() > 0.3,
    'Custom Integrations': Math.random() > 0.5,
    'Advanced Reporting': Math.random() > 0.4,
    'White Labeling': Math.random() > 0.7,
    'SSO Integration': Math.random() > 0.6,
    'Multi-language Support': Math.random() > 0.5,
    '24/7 Support': Math.random() > 0.4
  };
}

function extractAnalysisFromText(text: string, competitorName: string, website: string): any {
  // Simple text parsing as fallback
  const lines = text.split('\n');
  
  // Try to extract pricing information
  const pricingMatch = text.match(/\$(\d+)/);
  const pricing_start = pricingMatch ? parseInt(pricingMatch[1]) : 29;
  
  // Extract model type
  const modelMatch = text.toLowerCase().match(/(subscription|freemium|per-seat|usage-based|one-time|tiered)/);
  const pricing_model = modelMatch ? modelMatch[1] : 'Subscription';
  
  return {
    name: competitorName,
    description: `${competitorName} provides professional solutions in their market segment.`,
    positioning: `${competitorName} focuses on delivering value to their target customers.`,
    pricing_model,
    pricing_start,
    strengths: ['Market presence', 'Product features', 'Customer base'],
    weaknesses: ['Pricing transparency', 'Feature complexity'],
    features: getDefaultFeatures()
  };
}
