
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

interface CrawlJobResponse {
  success: boolean;
  jobId?: string;
  data?: any[];
  error?: string;
}

export class FirecrawlService {
  private static readonly BASE_URL = 'https://api.firecrawl.dev/v0';

  static async scrapeUrl(url: string): Promise<FirecrawlResponse> {
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
          formats: ['markdown', 'html'],
          includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'div', 'span'],
          excludeTags: ['script', 'style', 'nav', 'footer', 'header'],
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

  static async crawlWebsite(url: string, maxPages: number = 10): Promise<CrawlJobResponse> {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    try {
      console.log('Starting crawl job for:', url, 'with max pages:', maxPages);
      
      const response = await fetch(`${this.BASE_URL}/crawl`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          crawlerOptions: {
            includes: [],
            excludes: ['/blog/*', '/news/*', '/press/*'],
            limit: maxPages,
            allowBackwardCrawling: false,
            allowExternalContentLinks: false
          },
          pageOptions: {
            formats: ['markdown'],
            onlyMainContent: true,
            includeHtml: false,
            screenshot: false,
            waitFor: 1000
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Firecrawl crawl API error:', response.status, errorText);
        return {
          success: false,
          error: `Failed to start crawl: ${response.status} ${errorText}`
        };
      }

      const data = await response.json();
      console.log('Firecrawl crawl started successfully:', data);
      
      return {
        success: true,
        jobId: data.jobId,
        data: data.data
      };
    } catch (error) {
      console.error('Error starting crawl with Firecrawl:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async getCrawlStatus(jobId: string): Promise<CrawlJobResponse> {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    try {
      const response = await fetch(`${this.BASE_URL}/crawl/status/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Firecrawl status API error:', response.status, errorText);
        return {
          success: false,
          error: `Failed to get crawl status: ${response.status} ${errorText}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || [],
        jobId: jobId
      };
    } catch (error) {
      console.error('Error getting crawl status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static extractCompanyInfo(scrapedData: any): {
    name: string;
    description: string;
    features: string[];
    pricing: string[];
  } {
    const markdown = scrapedData?.markdown || '';
    const metadata = scrapedData?.metadata || {};
    
    // Extract company name from title or metadata
    const name = metadata.ogTitle || metadata.title || 'Unknown Company';
    
    // Extract description
    const description = metadata.ogDescription || metadata.description || 
      this.extractFirstParagraph(markdown);
    
    // Extract features (look for feature-related sections)
    const features = this.extractFeatures(markdown);
    
    // Extract pricing information
    const pricing = this.extractPricing(markdown);
    
    return {
      name: this.cleanCompanyName(name),
      description: description.substring(0, 500),
      features,
      pricing
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
    
    let inFeatureSection = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Detect feature sections
      if (line.includes('feature') || line.includes('capability') || 
          line.includes('benefit') || line.includes('tool')) {
        inFeatureSection = true;
        continue;
      }
      
      // Stop if we hit another major section
      if (line.startsWith('# ') || line.startsWith('## ')) {
        if (inFeatureSection) inFeatureSection = false;
      }
      
      // Extract bullet points and list items
      if ((line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\./)) && 
          line.length > 10) {
        features.push(line.replace(/^[-*\d.]\s*/, '').trim());
      }
    }
    
    return features.slice(0, 10); // Limit to top 10 features
  }

  private static extractPricing(markdown: string): string[] {
    const pricing: string[] = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      const lower = line.toLowerCase();
      
      // Look for pricing-related content
      if (lower.includes('$') || lower.includes('price') || 
          lower.includes('plan') || lower.includes('cost')) {
        const cleaned = line.trim().replace(/^[-*#\d.]\s*/, '');
        if (cleaned.length > 5) {
          pricing.push(cleaned);
        }
      }
    }
    
    return pricing.slice(0, 5); // Limit to top 5 pricing items
  }

  private static cleanCompanyName(name: string): string {
    return name
      .replace(/\s*[-|]\s*.*/g, '') // Remove everything after dash or pipe
      .replace(/\s*(home|homepage|official|website).*$/gi, '') // Remove common suffixes
      .trim();
  }
}
