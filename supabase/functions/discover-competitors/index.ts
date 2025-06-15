
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
        JSON.stringify({ error: 'Website is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Discovering competitors for:', website, companyName);

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Create a prompt for competitor discovery
    const prompt = `Analyze the website ${website} ${companyName ? `(company: ${companyName})` : ''} and identify 5 direct competitors. 

For each competitor, provide:
1. Company name
2. Website URL (must be a valid, real website)
3. Brief description of what they do

Focus on direct competitors that offer similar products/services. Only include real companies with actual websites.

Respond in this exact JSON format:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "https://example.com", 
      "description": "Brief description"
    }
  ]
}`;

    console.log('Calling OpenRouter API for competitor discovery');
    
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
            content: 'You are a business analyst specialized in competitive research. Provide accurate, real competitor information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      // Fallback to basic competitor discovery
      return new Response(
        JSON.stringify({ 
          success: true,
          competitors: getFallbackCompetitors(website),
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

    console.log('AI Response:', aiResponse);

    // Parse the JSON response
    let competitors;
    try {
      const parsed = JSON.parse(aiResponse);
      competitors = parsed.competitors || [];
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Try to extract competitors from text response
      competitors = extractCompetitorsFromText(aiResponse);
    }

    // Validate and clean the competitors
    const validCompetitors = competitors
      .filter((comp: any) => comp.name && comp.website)
      .slice(0, 5) // Limit to 5 competitors
      .map((comp: any) => ({
        name: comp.name.trim(),
        website: ensureValidUrl(comp.website.trim()),
        description: comp.description?.trim() || 'Competitor in the same industry'
      }));

    console.log('Discovered competitors:', validCompetitors);

    return new Response(
      JSON.stringify({ 
        success: true, 
        competitors: validCompetitors,
        source: 'ai'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in discover-competitors function:', error);
    
    // Fallback to basic competitor discovery
    const fallbackCompetitors = getFallbackCompetitors(req.url);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        competitors: fallbackCompetitors,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getFallbackCompetitors(website: string): any[] {
  const domain = extractDomain(website);
  const industry = guessIndustry(domain);
  
  const competitors = {
    saas: [
      { name: 'Notion', website: 'https://notion.so', description: 'All-in-one workspace for notes, tasks, and collaboration' },
      { name: 'Airtable', website: 'https://airtable.com', description: 'Database and spreadsheet hybrid platform' },
      { name: 'Monday.com', website: 'https://monday.com', description: 'Work management platform for teams' },
    ],
    ecommerce: [
      { name: 'Shopify', website: 'https://shopify.com', description: 'E-commerce platform for online stores' },
      { name: 'WooCommerce', website: 'https://woocommerce.com', description: 'WordPress e-commerce plugin' },
      { name: 'BigCommerce', website: 'https://bigcommerce.com', description: 'Enterprise e-commerce platform' },
    ],
    marketing: [
      { name: 'HubSpot', website: 'https://hubspot.com', description: 'Inbound marketing and sales platform' },
      { name: 'Mailchimp', website: 'https://mailchimp.com', description: 'Email marketing and automation platform' },
      { name: 'Salesforce', website: 'https://salesforce.com', description: 'Customer relationship management platform' },
    ],
    general: [
      { name: 'Microsoft 365', website: 'https://microsoft.com', description: 'Productivity and collaboration tools' },
      { name: 'Google Workspace', website: 'https://workspace.google.com', description: 'Cloud-based productivity suite' },
      { name: 'Slack', website: 'https://slack.com', description: 'Team communication and collaboration platform' },
    ]
  };

  return competitors[industry as keyof typeof competitors] || competitors.general;
}

function extractDomain(website: string): string {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    return url.hostname.replace('www.', '');
  } catch {
    return website.toLowerCase();
  }
}

function guessIndustry(domain: string): string {
  const domainLower = domain.toLowerCase();
  
  if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('commerce')) {
    return 'ecommerce';
  } else if (domainLower.includes('app') || domainLower.includes('software') || domainLower.includes('saas')) {
    return 'saas';
  } else if (domainLower.includes('marketing') || domainLower.includes('agency') || domainLower.includes('digital')) {
    return 'marketing';
  } else {
    return 'general';
  }
}

function extractCompetitorsFromText(text: string): any[] {
  // Simple text parsing as fallback
  const lines = text.split('\n');
  const competitors: any[] = [];
  
  for (const line of lines) {
    if (line.includes('http') && competitors.length < 5) {
      const parts = line.split(/[:-]/);
      if (parts.length >= 2) {
        const name = parts[0].replace(/^\d+\.?\s*/, '').trim();
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        const website = urlMatch ? urlMatch[1] : '';
        
        if (name && website) {
          competitors.push({
            name,
            website: ensureValidUrl(website),
            description: 'Competitor identified through AI analysis'
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
