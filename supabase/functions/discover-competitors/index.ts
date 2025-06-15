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
    const { website, companyName, websiteContext } = await req.json();
    
    if (!website) {
      return new Response(
        JSON.stringify({ error: 'Website is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI-powered competitor discovery for:', website, companyName);

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Create intelligent competitor discovery prompt using website context
    const prompt = createIntelligentDiscoveryPrompt(website, companyName, websiteContext);

    console.log('Calling OpenRouter API for AI-powered competitor discovery');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com',
        'X-Title': 'AI-Powered Competitor Discovery Tool',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'system',
            content: 'You are an expert market researcher specialized in competitive intelligence. Use the provided website context to identify the most relevant direct competitors based on business model, target audience, and market positioning.'
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
      
      // Enhanced fallback using website context
      return new Response(
        JSON.stringify({ 
          success: true,
          competitors: getContextualFallbackCompetitors(website, websiteContext),
          source: 'contextual_fallback'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI model');
    }

    console.log('AI Competitor Discovery Response:', aiResponse);

    // Parse and validate AI response
    let competitors;
    try {
      const parsed = JSON.parse(aiResponse);
      competitors = parsed.competitors || [];
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      competitors = extractCompetitorsFromText(aiResponse);
    }

    // Enhanced validation and filtering
    const validCompetitors = competitors
      .filter((comp: any) => comp.name && comp.website && isRelevantCompetitor(comp, websiteContext))
      .slice(0, 8) // Increased limit for better selection
      .map((comp: any) => ({
        name: comp.name.trim(),
        website: ensureValidUrl(comp.website.trim()),
        description: comp.description?.trim() || generateContextualDescription(comp.name, websiteContext),
        relevance_score: comp.relevance_score || calculateRelevanceScore(comp, websiteContext),
        business_model_match: comp.business_model_match || 'unknown'
      }));

    console.log('AI-discovered competitors:', validCompetitors);

    return new Response(
      JSON.stringify({ 
        success: true, 
        competitors: validCompetitors,
        source: 'ai_powered',
        context_used: !!websiteContext
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI-powered competitor discovery:', error);
    
    const { website: reqWebsite, websiteContext: reqContext } = await req.json().catch(() => ({}));
    const fallbackCompetitors = getContextualFallbackCompetitors(reqWebsite, reqContext);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        competitors: fallbackCompetitors,
        source: 'contextual_fallback',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function createIntelligentDiscoveryPrompt(website: string, companyName?: string, websiteContext?: any): string {
  const contextInfo = websiteContext ? `
WEBSITE CONTEXT ANALYSIS:
- Company: ${websiteContext.company_name || companyName || 'Unknown'}
- Business Model: ${websiteContext.business_model || 'Unknown'}
- Industry: ${websiteContext.industry || 'Unknown'}
- Target Audience: ${websiteContext.target_audience?.primary || 'Unknown'}
- Value Proposition: ${websiteContext.value_proposition || 'Unknown'}
- Pricing Model: ${websiteContext.pricing_strategy?.model || 'Unknown'}
- Starting Price: $${websiteContext.pricing_strategy?.starting_price || 'Unknown'}
- Market Focus: ${websiteContext.competitive_positioning?.market_focus || 'Unknown'}
- Key Features: ${websiteContext.core_offerings?.key_features?.join(', ') || 'Unknown'}
` : '';

  return `Based on the website ${website} ${companyName ? `(${companyName})` : ''}, identify 6-8 direct competitors.

${contextInfo}

COMPETITOR DISCOVERY CRITERIA:
1. **Business Model Match**: Find competitors with the same or very similar business model
2. **Target Audience Overlap**: Focus on companies targeting the same customer segments
3. **Feature/Service Similarity**: Look for companies offering similar core features or services
4. **Market Positioning**: Find competitors in the same market category and price range
5. **Geographic Relevance**: Prioritize competitors serving similar markets

For each competitor, provide:
1. Company name (exact, real company name)
2. Website URL (must be valid and accessible)
3. Brief description (2-3 sentences about what they do)
4. Relevance score (1-10, how similar to the target company)
5. Business model match (exact|similar|adjacent)

Respond in this exact JSON format:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "https://example.com",
      "description": "Brief description of what they do and how they compete",
      "relevance_score": 9,
      "business_model_match": "exact"
    }
  ]
}

Focus on REAL, EXISTING companies that are direct competitors. Avoid generic or placeholder names.`;
}

function getContextualFallbackCompetitors(website: string, websiteContext?: any): any[] {
  const domain = extractDomain(website);
  const industry = websiteContext?.industry || guessIndustryFromDomain(domain);
  const businessModel = websiteContext?.business_model || getIndustryBusinessModel(industry);
  
  // Enhanced fallback based on context
  const contextualCompetitors = {
    'SaaS_Technology': [
      { name: 'Notion', website: 'https://notion.so', description: 'All-in-one workspace combining notes, tasks, wikis, and databases', relevance_score: 8, business_model_match: 'exact' },
      { name: 'Airtable', website: 'https://airtable.com', description: 'Cloud collaboration platform that combines database and spreadsheet functionality', relevance_score: 8, business_model_match: 'exact' },
      { name: 'Monday.com', website: 'https://monday.com', description: 'Work management platform for project tracking and team collaboration', relevance_score: 7, business_model_match: 'exact' },
      { name: 'Asana', website: 'https://asana.com', description: 'Team collaboration and project management software', relevance_score: 7, business_model_match: 'exact' },
    ],
    'E-commerce_E-commerce': [
      { name: 'Shopify', website: 'https://shopify.com', description: 'Complete e-commerce platform for online stores and retail POS systems', relevance_score: 9, business_model_match: 'exact' },
      { name: 'WooCommerce', website: 'https://woocommerce.com', description: 'Open-source e-commerce plugin for WordPress websites', relevance_score: 8, business_model_match: 'similar' },
      { name: 'BigCommerce', website: 'https://bigcommerce.com', description: 'Enterprise e-commerce platform with built-in features and APIs', relevance_score: 8, business_model_match: 'exact' },
      { name: 'Magento', website: 'https://magento.com', description: 'Flexible e-commerce platform for B2B and B2C businesses', relevance_score: 7, business_model_match: 'similar' },
    ],
    'Marketing_Agency': [
      { name: 'HubSpot', website: 'https://hubspot.com', description: 'Inbound marketing, sales, and customer service platform', relevance_score: 9, business_model_match: 'exact' },
      { name: 'Mailchimp', website: 'https://mailchimp.com', description: 'Email marketing and automation platform for small businesses', relevance_score: 8, business_model_match: 'exact' },
      { name: 'Constant Contact', website: 'https://constantcontact.com', description: 'Email marketing and digital marketing platform', relevance_score: 7, business_model_match: 'exact' },
      { name: 'Klaviyo', website: 'https://klaviyo.com', description: 'Email and SMS marketing platform for e-commerce businesses', relevance_score: 8, business_model_match: 'exact' },
    ]
  };

  const key = `${industry}_${businessModel}` as keyof typeof contextualCompetitors;
  return contextualCompetitors[key] || contextualCompetitors['SaaS_Technology'];
}

function isRelevantCompetitor(competitor: any, websiteContext?: any): boolean {
  if (!websiteContext) return true;
  
  // Filter based on relevance score
  const minRelevanceScore = 6;
  if (competitor.relevance_score && competitor.relevance_score < minRelevanceScore) {
    return false;
  }
  
  // Ensure business model alignment
  const businessModelMatch = competitor.business_model_match;
  if (businessModelMatch && !['exact', 'similar'].includes(businessModelMatch)) {
    return false;
  }
  
  return true;
}

function calculateRelevanceScore(competitor: any, websiteContext?: any): number {
  if (!websiteContext) return 5;
  
  let score = 5;
  
  // Business model alignment
  if (competitor.business_model_match === 'exact') score += 3;
  else if (competitor.business_model_match === 'similar') score += 1;
  
  // Industry relevance (basic text matching)
  if (competitor.description?.toLowerCase().includes(websiteContext.industry?.toLowerCase())) {
    score += 2;
  }
  
  return Math.min(10, Math.max(1, score));
}

function generateContextualDescription(competitorName: string, websiteContext?: any): string {
  if (!websiteContext) {
    return `${competitorName} provides competitive solutions in the same market space`;
  }
  
  const industry = websiteContext.industry || 'technology';
  const businessModel = websiteContext.business_model || 'SaaS';
  
  return `${competitorName} offers ${industry.toLowerCase()} solutions with a ${businessModel} business model, competing in similar market segments`;
}

function extractCompetitorsFromText(text: string): any[] {
  const lines = text.split('\n');
  const competitors: any[] = [];
  
  for (const line of lines) {
    if (line.includes('http') && competitors.length < 8) {
      const parts = line.split(/[:-]/);
      if (parts.length >= 2) {
        const name = parts[0].replace(/^\d+\.?\s*/, '').trim();
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        const website = urlMatch ? urlMatch[1] : '';
        
        if (name && website) {
          competitors.push({
            name,
            website: ensureValidUrl(website),
            description: 'Competitor identified through AI analysis',
            relevance_score: 7,
            business_model_match: 'similar'
          });
        }
      }
    }
  }
  
  return competitors;
}

function ensureValidUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
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
    return 'E-commerce';
  } else if (domainLower.includes('app') || domainLower.includes('software') || domainLower.includes('saas')) {
    return 'Technology';
  } else if (domainLower.includes('marketing') || domainLower.includes('agency') || domainLower.includes('digital')) {
    return 'Marketing';
  } else if (domainLower.includes('finance') || domainLower.includes('bank') || domainLower.includes('fintech')) {
    return 'Finance';
  } else {
    return 'Technology';
  }
}

function getIndustryBusinessModel(industry: string): string {
  const models = {
    'Technology': 'SaaS',
    'E-commerce': 'E-commerce',
    'Marketing': 'Agency',
    'Finance': 'SaaS'
  };
  
  return models[industry as keyof typeof models] || 'SaaS';
}
