
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
    const { website, analysisId } = await req.json();
    
    if (!website) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping competitor website:', website);

    // Normalize URL
    const url = website.startsWith('http') ? website : `https://${website}`;
    
    try {
      // Simple fetch to get the website content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Extract useful content using simple text parsing
      const extractedContent = extractContentFromHTML(html);
      
      console.log('Successfully scraped content from:', website);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          content: extractedContent,
          url: url,
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError) {
      console.error('Error fetching website:', fetchError);
      
      // Return basic fallback information
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to fetch website: ${fetchError.message}`,
          content: `Unable to scrape content from ${website}. Using fallback analysis.`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

function extractContentFromHTML(html: string): string {
  // Remove script and style tags
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Extract specific sections that might contain useful information
  const sections = {
    pricing: extractPricingInfo(cleanHtml),
    features: extractFeaturesInfo(cleanHtml),
    about: extractAboutInfo(cleanHtml),
    meta: extractMetaInfo(html)
  };

  // Combine extracted information
  const extractedContent = [
    sections.meta,
    sections.about,
    sections.pricing,
    sections.features,
    cleanHtml.substring(0, 2000) // First 2000 chars of clean content
  ].filter(Boolean).join('\n\n');

  return extractedContent.substring(0, 5000); // Limit to 5000 chars total
}

function extractPricingInfo(text: string): string {
  const pricingKeywords = ['pricing', 'price', 'cost', 'plan', 'subscription', 'free', 'premium', 'enterprise'];
  const sentences = text.split(/[.!?]+/);
  
  const pricingSentences = sentences.filter(sentence => 
    pricingKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    )
  ).slice(0, 5); // Limit to 5 sentences

  return pricingSentences.length > 0 ? 
    `PRICING INFO: ${pricingSentences.join('. ')}` : '';
}

function extractFeaturesInfo(text: string): string {
  const featureKeywords = ['feature', 'capability', 'functionality', 'tool', 'solution', 'service'];
  const sentences = text.split(/[.!?]+/);
  
  const featureSentences = sentences.filter(sentence => 
    featureKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    )
  ).slice(0, 5); // Limit to 5 sentences

  return featureSentences.length > 0 ? 
    `FEATURES INFO: ${featureSentences.join('. ')}` : '';
}

function extractAboutInfo(text: string): string {
  const aboutKeywords = ['about', 'company', 'mission', 'vision', 'founded', 'team', 'story'];
  const sentences = text.split(/[.!?]+/);
  
  const aboutSentences = sentences.filter(sentence => 
    aboutKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    )
  ).slice(0, 3); // Limit to 3 sentences

  return aboutSentences.length > 0 ? 
    `ABOUT INFO: ${aboutSentences.join('. ')}` : '';
}

function extractMetaInfo(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
  const keywordsMatch = html.match(/<meta[^>]*name="keywords"[^>]*content="([^"]+)"/i);
  
  const metaInfo = [];
  if (titleMatch) metaInfo.push(`TITLE: ${titleMatch[1]}`);
  if (descMatch) metaInfo.push(`DESCRIPTION: ${descMatch[1]}`);
  if (keywordsMatch) metaInfo.push(`KEYWORDS: ${keywordsMatch[1]}`);
  
  return metaInfo.join('\n');
}
