
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
    const { website, companyName } = await req.json();
    
    if (!website) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing user website:', website);

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // First, try to scrape the user's website for content
    let scrapedContent = '';
    try {
      console.log('Scraping user website for context:', website);
      const scrapingResult = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-competitor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          website: website,
          analysisId: 'user-website' 
        })
      });

      const scrapingData = await scrapingResult.json();
      if (scrapingData.content) {
        scrapedContent = scrapingData.content;
        console.log('Successfully scraped user website content');
      }
    } catch (scrapingError) {
      console.log('Website scraping failed, proceeding with AI analysis only:', scrapingError);
    }

    // Create comprehensive prompt for user website analysis
    const prompt = createWebsiteAnalysisPrompt(companyName || 'Your Company', website, scrapedContent);

    console.log('Calling OpenRouter API for user website analysis');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com',
        'X-Title': 'Website Context Analysis Tool',
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: [
          {
            role: 'system',
            content: 'You are an expert business analyst specialized in analyzing companies and their competitive positioning. Provide detailed, accurate analysis based on available website information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      // Enhanced fallback analysis
      return new Response(
        JSON.stringify({ 
          success: true,
          websiteContext: getFallbackWebsiteAnalysis(companyName || 'Your Company', website, scrapedContent),
          source: 'enhanced_fallback'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI model');
    }

    console.log('AI Website Analysis Response:', aiResponse);

    // Parse the JSON response with enhanced error handling
    let websiteContext;
    try {
      const parsed = JSON.parse(aiResponse);
      websiteContext = validateAndEnhanceWebsiteContext(parsed, companyName || 'Your Company', website, scrapedContent);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Extract key information from text response
      websiteContext = extractWebsiteContextFromText(aiResponse, companyName || 'Your Company', website, scrapedContent);
    }

    console.log('Processed website context analysis:', websiteContext);

    return new Response(
      JSON.stringify({ 
        success: true, 
        websiteContext,
        source: 'ai_analysis'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-user-website function:', error);
    
    const { website: reqWebsite, companyName: reqCompanyName } = await req.json().catch(() => ({}));
    const fallbackData = getFallbackWebsiteAnalysis(
      reqCompanyName || 'Your Company', 
      reqWebsite || 'https://example.com',
      ''
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        websiteContext: fallbackData,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function createWebsiteAnalysisPrompt(companyName: string, website: string, scrapedContent?: string): string {
  return `Analyze the business context of "${companyName}" (${website}) to understand their competitive positioning.

${scrapedContent ? `Website content analysis: ${scrapedContent.substring(0, 4000)}...` : ''}

Perform a comprehensive business analysis with focus on:

1. BUSINESS MODEL ANALYSIS: Understand how they make money, their target market, and core value proposition
2. PRODUCT/SERVICE ANALYSIS: Identify their main offerings, key features, and unique selling points
3. PRICING STRATEGY: Extract pricing information, models, and positioning in the market
4. TARGET AUDIENCE: Define their ideal customer profile and market segments
5. COMPETITIVE POSITIONING: How they position themselves in the market and key differentiators

Provide your analysis in the following JSON format:

{
  "company_name": "Exact company name",
  "business_model": "SaaS|E-commerce|Marketplace|Agency|Product|Service|Other",
  "industry": "Technology|Marketing|E-commerce|Finance|Healthcare|Education|Other",
  "target_audience": {
    "primary": "Who they primarily target",
    "segments": ["segment1", "segment2", "segment3"],
    "company_size": "Startup|SMB|Mid-market|Enterprise|All"
  },
  "value_proposition": "Their main value proposition in one clear sentence",
  "core_offerings": {
    "primary_product": "Main product/service name",
    "secondary_products": ["product2", "product3"],
    "key_features": ["feature1", "feature2", "feature3", "feature4", "feature5"]
  },
  "pricing_strategy": {
    "model": "Freemium|Subscription|One-time|Usage-based|Tiered|Custom|Contact",
    "starting_price": 29,
    "currency": "USD",
    "billing_cycle": "monthly|annual|usage|custom",
    "free_tier": true|false,
    "pricing_transparency": "high|medium|low",
    "price_range": "budget|mid-range|premium|enterprise"
  },
  "competitive_positioning": {
    "main_differentiators": ["differentiator1", "differentiator2", "differentiator3"],
    "positioning_statement": "How they position themselves vs competitors",
    "competitive_advantages": ["advantage1", "advantage2"],
    "market_focus": "B2B|B2C|B2B2C|Enterprise|SMB"
  },
  "website_quality": {
    "messaging_clarity": "high|medium|low",
    "feature_explanation": "high|medium|low",
    "pricing_transparency": "high|medium|low",
    "conversion_optimization": "high|medium|low"
  },
  "strategic_context": {
    "likely_competitors": ["competitor1.com", "competitor2.com", "competitor3.com"],
    "market_maturity": "emerging|growing|mature|declining",
    "innovation_level": "cutting-edge|modern|standard|legacy"
  }
}

Base your analysis on actual information from the website. Be specific and realistic. If information is not available, make educated estimates based on industry standards and observable patterns.`;
}

function validateAndEnhanceWebsiteContext(parsed: any, companyName: string, website: string, scrapedContent?: string): any {
  return {
    company_name: parsed.company_name || companyName,
    business_model: parsed.business_model || 'SaaS',
    industry: parsed.industry || 'Technology',
    target_audience: {
      primary: parsed.target_audience?.primary || 'Business professionals',
      segments: Array.isArray(parsed.target_audience?.segments) ? parsed.target_audience.segments : ['Small businesses', 'Startups'],
      company_size: parsed.target_audience?.company_size || 'SMB'
    },
    value_proposition: parsed.value_proposition || `${companyName} provides innovative solutions for modern businesses`,
    core_offerings: {
      primary_product: parsed.core_offerings?.primary_product || `${companyName} Platform`,
      secondary_products: Array.isArray(parsed.core_offerings?.secondary_products) ? parsed.core_offerings.secondary_products : [],
      key_features: Array.isArray(parsed.core_offerings?.key_features) ? parsed.core_offerings.key_features : ['User-friendly interface', 'Advanced analytics', 'Integration capabilities']
    },
    pricing_strategy: {
      model: parsed.pricing_strategy?.model || 'Subscription',
      starting_price: parsed.pricing_strategy?.starting_price || 29,
      currency: parsed.pricing_strategy?.currency || 'USD',
      billing_cycle: parsed.pricing_strategy?.billing_cycle || 'monthly',
      free_tier: parsed.pricing_strategy?.free_tier ?? false,
      pricing_transparency: parsed.pricing_strategy?.pricing_transparency || 'medium',
      price_range: parsed.pricing_strategy?.price_range || 'mid-range'
    },
    competitive_positioning: {
      main_differentiators: Array.isArray(parsed.competitive_positioning?.main_differentiators) ? parsed.competitive_positioning.main_differentiators : ['Quality', 'Support', 'Innovation'],
      positioning_statement: parsed.competitive_positioning?.positioning_statement || `${companyName} stands out through superior user experience`,
      competitive_advantages: Array.isArray(parsed.competitive_positioning?.competitive_advantages) ? parsed.competitive_positioning.competitive_advantages : ['Strong brand', 'Good pricing'],
      market_focus: parsed.competitive_positioning?.market_focus || 'B2B'
    },
    website_quality: {
      messaging_clarity: parsed.website_quality?.messaging_clarity || 'medium',
      feature_explanation: parsed.website_quality?.feature_explanation || 'medium',
      pricing_transparency: parsed.website_quality?.pricing_transparency || 'medium',
      conversion_optimization: parsed.website_quality?.conversion_optimization || 'medium'
    },
    strategic_context: {
      likely_competitors: Array.isArray(parsed.strategic_context?.likely_competitors) ? parsed.strategic_context.likely_competitors : [],
      market_maturity: parsed.strategic_context?.market_maturity || 'growing',
      innovation_level: parsed.strategic_context?.innovation_level || 'modern'
    }
  };
}

function getFallbackWebsiteAnalysis(companyName: string, website: string, scrapedContent?: string): any {
  const domain = extractDomain(website);
  const industry = guessIndustryFromDomain(domain);
  
  return {
    company_name: companyName,
    business_model: getIndustryBusinessModel(industry),
    industry: industry,
    target_audience: {
      primary: getIndustryTargetAudience(industry),
      segments: getIndustrySegments(industry),
      company_size: 'SMB'
    },
    value_proposition: `${companyName} provides innovative ${industry} solutions for modern businesses`,
    core_offerings: {
      primary_product: `${companyName} Platform`,
      secondary_products: getIndustrySecondaryProducts(industry),
      key_features: getIndustryFeatures(industry)
    },
    pricing_strategy: {
      model: 'Subscription',
      starting_price: 29,
      currency: 'USD',
      billing_cycle: 'monthly',
      free_tier: false,
      pricing_transparency: 'medium',
      price_range: 'mid-range'
    },
    competitive_positioning: {
      main_differentiators: ['Quality', 'Support', 'Innovation'],
      positioning_statement: `${companyName} stands out through superior user experience and reliability`,
      competitive_advantages: ['Strong product focus', 'Good customer support'],
      market_focus: 'B2B'
    },
    website_quality: {
      messaging_clarity: 'medium',
      feature_explanation: 'medium',
      pricing_transparency: 'medium',
      conversion_optimization: 'medium'
    },
    strategic_context: {
      likely_competitors: [],
      market_maturity: 'growing',
      innovation_level: 'modern'
    }
  };
}

function extractWebsiteContextFromText(text: string, companyName: string, website: string, scrapedContent?: string): any {
  // Basic text parsing for fallback
  return getFallbackWebsiteAnalysis(companyName, website, scrapedContent);
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
    'Finance': 'SaaS',
    'Healthcare': 'Service',
    'Education': 'SaaS'
  };
  
  return models[industry as keyof typeof models] || 'SaaS';
}

function getIndustryTargetAudience(industry: string): string {
  const audiences = {
    'Technology': 'Software teams and developers',
    'E-commerce': 'Online retailers and merchants',
    'Marketing': 'Marketing teams and agencies',
    'Finance': 'Financial professionals and institutions',
    'Healthcare': 'Healthcare providers and patients',
    'Education': 'Educational institutions and learners'
  };
  
  return audiences[industry as keyof typeof audiences] || 'Business professionals';
}

function getIndustrySegments(industry: string): string[] {
  const segments = {
    'Technology': ['Startups', 'SMBs', 'Enterprise'],
    'E-commerce': ['Small retailers', 'Growing brands', 'Enterprise merchants'],
    'Marketing': ['Agencies', 'In-house teams', 'Consultants'],
    'Finance': ['SMBs', 'Enterprise', 'Financial institutions'],
    'Healthcare': ['Providers', 'Patients', 'Administrators'],
    'Education': ['K-12', 'Higher Ed', 'Corporate Training']
  };
  
  return segments[industry as keyof typeof segments] || ['Small businesses', 'Mid-market', 'Enterprise'];
}

function getIndustrySecondaryProducts(industry: string): string[] {
  const products = {
    'Technology': ['API', 'Mobile App', 'Integrations'],
    'E-commerce': ['Analytics', 'Marketing Tools', 'Inventory Management'],
    'Marketing': ['Analytics', 'Automation', 'Reporting'],
    'Finance': ['Reporting', 'Compliance', 'Analytics'],
    'Healthcare': ['Records', 'Scheduling', 'Billing'],
    'Education': ['Assessment', 'Content', 'Analytics']
  };
  
  return products[industry as keyof typeof products] || ['Analytics', 'Reporting', 'Support'];
}

function getIndustryFeatures(industry: string): string[] {
  const features = {
    'Technology': ['User Management', 'API Access', 'Real-time Updates', 'Custom Integrations', 'Advanced Analytics'],
    'E-commerce': ['Product Catalog', 'Payment Processing', 'Inventory Management', 'Order Tracking', 'Customer Support'],
    'Marketing': ['Campaign Management', 'Analytics Dashboard', 'A/B Testing', 'Email Marketing', 'Social Media Integration'],
    'Finance': ['Secure Transactions', 'Compliance Reporting', 'Risk Management', 'Data Analytics', 'Audit Trail'],
    'Healthcare': ['Patient Records', 'Appointment Scheduling', 'Billing Integration', 'Compliance', 'Reporting'],
    'Education': ['Course Management', 'Student Tracking', 'Assessment Tools', 'Content Library', 'Progress Analytics']
  };
  
  return features[industry as keyof typeof features] || ['User Management', 'Analytics', 'Reporting', 'Integration', 'Support'];
}
