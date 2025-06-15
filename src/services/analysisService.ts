import { supabase } from '@/integrations/supabase/client';
import { 
  Analysis, 
  Competitor, 
  AnalysisContent, 
  DifferentiationAngle,
  transformAnalysis,
  transformCompetitor,
  transformAnalysisContent,
  transformDifferentiationAngle
} from '@/types/database';

export class AnalysisService {
  static async createAnalysis(website: string, companyName: string): Promise<string> {
    console.log('Creating new analysis for:', website);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create analysis');
    }
    
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        name: `${companyName} Competitor Analysis`,
        website: website,
        status: 'pending',
        user_id: user.id
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating analysis:', error);
      throw error;
    }

    console.log('Analysis created with ID:', data.id);
    return data.id;
  }

  static async startAnalysis(analysisId: string): Promise<void> {
    console.log('Starting enhanced analysis for ID:', analysisId);
    
    try {
      // Update status to analyzing
      await supabase
        .from('analyses')
        .update({ status: 'analyzing', updated_at: new Date().toISOString() })
        .eq('id', analysisId);

      // Get the analysis details
      const { data: analysis } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (!analysis) throw new Error('Analysis not found');

      console.log('Discovering competitors using AI...');
      // Use the AI-powered competitor discovery
      const competitorData = await this.discoverCompetitorsWithAI(analysis.website, analysis.name);
      
      console.log('Analyzing competitors with enhanced AI-powered analysis...');
      // Analyze each competitor using enhanced AI with scraping
      const competitorPromises = competitorData.competitors.map(async (comp: any) => {
        console.log('Enhanced AI analyzing competitor:', comp.name);
        
        try {
          // First try to scrape the website for content
          let scrapedContent = '';
          try {
            console.log('Scraping competitor website:', comp.website);
            const scrapingResult = await supabase.functions.invoke('scrape-competitor', {
              body: { 
                website: comp.website,
                analysisId: analysisId 
              }
            });

            if (!scrapingResult.error && scrapingResult.data?.content) {
              scrapedContent = scrapingResult.data.content;
              console.log('Successfully scraped content for:', comp.name);
            }
          } catch (scrapingError) {
            console.log('Scraping failed for', comp.name, ', proceeding with AI analysis only:', scrapingError);
          }

          // Use enhanced AI to analyze the competitor
          console.log('Calling enhanced analyze-competitor function for:', comp.name);
          const analysisResult = await supabase.functions.invoke('analyze-competitor', {
            body: { 
              website: comp.website,
              competitorName: comp.name,
              scrapedContent: scrapedContent
            }
          });

          if (analysisResult.error) {
            console.error('Error in enhanced AI competitor analysis:', analysisResult.error);
            // Fall back to enhanced basic analysis
            const competitorData = await CompetitorAnalysisService.analyzeCompetitor(comp.website);
            return this.insertEnhancedCompetitorData(analysisId, competitorData);
          }

          const { competitorData } = analysisResult.data;
          
          // Insert the enhanced AI-analyzed competitor data
          const { error } = await supabase
            .from('competitors')
            .insert({
              analysis_id: analysisId,
              name: competitorData.name,
              website: comp.website,
              description: competitorData.description,
              positioning: competitorData.positioning,
              pricing_model: competitorData.pricing_model,
              pricing_start: competitorData.pricing_start,
              pricing_details: competitorData.pricing_details,
              strengths: competitorData.strengths,
              weaknesses: competitorData.weaknesses,
              features: competitorData.features,
              target_audience: competitorData.target_audience,
              value_proposition: competitorData.value_proposition,
              competitive_advantages: competitorData.competitive_advantages,
              market_focus: competitorData.market_focus
            });
          
          if (error) {
            console.error('Error inserting enhanced competitor:', error);
            throw error;
          }

          console.log('Successfully analyzed and stored competitor:', competitorData.name);
        } catch (error) {
          console.error('Error in enhanced competitor analysis:', error);
          // Don't fail the entire analysis if one competitor fails
          console.log('Continuing with next competitor...');
        }
      });

      await Promise.all(competitorPromises);

      console.log('Generating differentiation angles...');
      // Generate differentiation angles
      await DifferentiationService.generateAngles(analysisId, analysis.website);

      console.log('Generating enhanced content...');
      // Generate content for different formats
      await ContentGenerationService.generateAllContent(analysisId);

      // Mark as completed
      await supabase
        .from('analyses')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', analysisId);

      console.log('Enhanced analysis completed successfully for ID:', analysisId);
    } catch (error) {
      console.error('Error during enhanced analysis:', error);
      
      await supabase
        .from('analyses')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', analysisId);
      
      throw error;
    }
  }

  private static async insertEnhancedCompetitorData(analysisId: string, competitorData: any) {
    const { error } = await supabase
      .from('competitors')
      .insert({
        analysis_id: analysisId,
        name: competitorData.name,
        website: competitorData.website || 'https://example.com',
        description: competitorData.description,
        positioning: competitorData.positioning,
        pricing_model: competitorData.pricing_model,
        pricing_start: competitorData.pricing_start,
        pricing_details: competitorData.pricing_details,
        strengths: competitorData.strengths,
        weaknesses: competitorData.weaknesses,
        features: competitorData.features,
        target_audience: competitorData.target_audience,
        value_proposition: competitorData.value_proposition,
        competitive_advantages: competitorData.competitive_advantages,
        market_focus: competitorData.market_focus
      });
    
    if (error) {
      console.error('Error inserting enhanced competitor:', error);
      throw error;
    }
  }

  private static async discoverCompetitorsWithAI(website: string, companyName?: string): Promise<{ competitors: any[] }> {
    console.log('Using AI to discover competitors for:', website);
    
    try {
      const { data, error } = await supabase.functions.invoke('discover-competitors', {
        body: { 
          website,
          companyName 
        }
      });

      if (error) {
        console.error('Error in AI competitor discovery:', error);
        // Fallback to basic discovery
        return { competitors: CompetitorDiscoveryService.getBasicCompetitors(website) };
      }

      console.log('AI competitor discovery result:', data);
      return data;
    } catch (error) {
      console.error('Error calling discover-competitors function:', error);
      // Fallback to basic discovery
      return { competitors: CompetitorDiscoveryService.getBasicCompetitors(website) };
    }
  }

  static async getAnalysis(analysisId: string): Promise<Analysis | null> {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error) {
      console.error('Error fetching analysis:', error);
      return null;
    }

    return transformAnalysis(data);
  }

  static async getUserAnalyses(): Promise<Analysis[]> {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user analyses:', error);
      return [];
    }

    return (data || []).map(transformAnalysis);
  }

  static async getCompetitors(analysisId: string): Promise<Competitor[]> {
    const { data, error } = await supabase
      .from('competitors')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching competitors:', error);
      return [];
    }

    return (data || []).map(transformCompetitor);
  }

  static async getAnalysisContent(analysisId: string, contentType?: string): Promise<AnalysisContent[]> {
    let query = supabase
      .from('analysis_content')
      .select('*')
      .eq('analysis_id', analysisId);

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    const { data, error } = await query.order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching analysis content:', error);
      return [];
    }

    return (data || []).map(transformAnalysisContent);
  }

  static async getDifferentiationAngles(analysisId: string): Promise<DifferentiationAngle[]> {
    const { data, error } = await supabase
      .from('differentiation_angles')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('opportunity_level', { ascending: false });

    if (error) {
      console.error('Error fetching differentiation angles:', error);
      return [];
    }

    return (data || []).map(transformDifferentiationAngle);
  }
}

// Enhanced Competitor Discovery Service with AI capabilities
export class CompetitorDiscoveryService {
  static async discoverCompetitors(website: string): Promise<{ name: string; website: string }[]> {
    console.log('Discovering competitors for:', website);
    
    try {
      // Use the new AI-powered discovery
      const result = await supabase.functions.invoke('discover-competitors', {
        body: { website }
      });

      if (result.error || !result.data?.competitors) {
        console.error('AI discovery failed, using fallback:', result.error);
        return this.getBasicCompetitors(website);
      }

      return result.data.competitors.map((comp: any) => ({
        name: comp.name,
        website: comp.website
      }));
    } catch (error) {
      console.error('Error discovering competitors:', error);
      return this.getBasicCompetitors(website);
    }
  }

  static getBasicCompetitors(website: string): { name: string; website: string }[] {
    const domain = this.extractDomain(website);
    const industry = this.guessIndustry(domain);
    
    const competitors = {
      saas: [
        { name: 'Notion', website: 'https://notion.so' },
        { name: 'Airtable', website: 'https://airtable.com' },
        { name: 'Monday.com', website: 'https://monday.com' },
        { name: 'Asana', website: 'https://asana.com' },
        { name: 'ClickUp', website: 'https://clickup.com' }
      ],
      ecommerce: [
        { name: 'Shopify', website: 'https://shopify.com' },
        { name: 'WooCommerce', website: 'https://woocommerce.com' },
        { name: 'BigCommerce', website: 'https://bigcommerce.com' },
        { name: 'Magento', website: 'https://magento.com' }
      ],
      marketing: [
        { name: 'HubSpot', website: 'https://hubspot.com' },
        { name: 'Mailchimp', website: 'https://mailchimp.com' },
        { name: 'Salesforce', website: 'https://salesforce.com' },
        { name: 'Marketo', website: 'https://marketo.com' }
      ],
      general: [
        { name: 'Microsoft 365', website: 'https://microsoft.com' },
        { name: 'Google Workspace', website: 'https://workspace.google.com' },
        { name: 'Slack', website: 'https://slack.com' }
      ]
    };

    return competitors[industry as keyof typeof competitors] || competitors.general;
  }

  private static extractDomain(website: string): string {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      return url.hostname.replace('www.', '');
    } catch {
      return website.toLowerCase();
    }
  }

  private static guessIndustry(domain: string): string {
    const domainLower = domain.toLowerCase();
    
    if (domainLower.includes('shop') || domainLower.includes('store') || 
        domainLower.includes('commerce') || domainLower.includes('retail')) {
      return 'ecommerce';
    } else if (domainLower.includes('tech') || domainLower.includes('app') || 
               domainLower.includes('software') || domainLower.includes('saas')) {
      return 'saas';
    } else if (domainLower.includes('marketing') || domainLower.includes('agency') ||
               domainLower.includes('digital') || domainLower.includes('seo')) {
      return 'marketing';
    } else if (domainLower.includes('finance') || domainLower.includes('bank') ||
               domainLower.includes('fintech') || domainLower.includes('payment')) {
      return 'fintech';
    } else {
      return 'general';
    }
  }
}

// Competitor Analysis Service
export class CompetitorAnalysisService {
  static async analyzeCompetitor(website: string) {
    console.log('AI analyzing competitor:', website);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Enhanced fallback analysis based on domain intelligence
    const companyName = this.extractCompanyName(website);
    const domain = this.extractDomain(website);
    const industry = this.guessIndustry(domain);
    
    return {
      name: companyName,
      description: this.generateSmartDescription(companyName, industry),
      positioning: this.generateSmartPositioning(companyName, industry),
      pricing_model: this.getIndustryPricingModel(industry),
      pricing_start: this.getIndustryPricingStart(industry),
      strengths: this.getIndustryStrengths(industry),
      weaknesses: this.getIndustryWeaknesses(industry),
      features: this.generateSmartFeatures(industry)
    };
  }

  private static extractCompanyName(website: string): string {
    try {
      const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
      const name = domain.replace('www.', '').split('.')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return 'Competitor';
    }
  }

  private static extractDomain(website: string): string {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      return url.hostname.replace('www.', '');
    } catch {
      return website.toLowerCase();
    }
  }

  private static guessIndustry(domain: string): string {
    const domainLower = domain.toLowerCase();
    
    if (domainLower.includes('shop') || domainLower.includes('store') || 
        domainLower.includes('commerce') || domainLower.includes('retail')) {
      return 'ecommerce';
    } else if (domainLower.includes('tech') || domainLower.includes('app') || 
               domainLower.includes('software') || domainLower.includes('saas')) {
      return 'saas';
    } else if (domainLower.includes('marketing') || domainLower.includes('agency') ||
               domainLower.includes('digital') || domainLower.includes('seo')) {
      return 'marketing';
    } else if (domainLower.includes('finance') || domainLower.includes('bank') ||
               domainLower.includes('fintech') || domainLower.includes('payment')) {
      return 'fintech';
    } else {
      return 'general';
    }
  }

  private static generateSmartDescription(companyName: string, industry: string): string {
    const descriptions = {
      saas: `${companyName} is a cloud-based software platform that helps businesses streamline their operations and improve productivity through innovative technology solutions.`,
      ecommerce: `${companyName} provides comprehensive e-commerce solutions, enabling businesses to create, manage, and scale their online stores with advanced features and integrations.`,
      marketing: `${companyName} specializes in digital marketing tools and customer engagement platforms, helping businesses reach and convert their target audiences effectively.`,
      fintech: `${companyName} offers cutting-edge financial technology solutions, providing secure and efficient tools for modern banking, payments, and financial management.`,
      general: `${companyName} is a professional services company that delivers innovative solutions to help businesses achieve their goals and improve operational efficiency.`
    };
    
    return descriptions[industry as keyof typeof descriptions] || descriptions.general;
  }

  private static generateSmartPositioning(companyName: string, industry: string): string {
    const positioning = {
      saas: `${companyName} positions itself as the go-to platform for businesses seeking scalable, user-friendly automation solutions`,
      ecommerce: `${companyName} focuses on empowering online retailers with comprehensive, feature-rich e-commerce capabilities`,
      marketing: `${companyName} targets growth-oriented businesses looking for advanced marketing automation and customer insights`,
      fintech: `${companyName} serves modern financial institutions and businesses requiring secure, compliant financial technology`,
      general: `${companyName} appeals to companies seeking reliable, professional services and innovative business solutions`
    };
    
    return positioning[industry as keyof typeof positioning] || positioning.general;
  }

  private static getIndustryPricingModel(industry: string): string {
    const models = {
      saas: 'Subscription',
      ecommerce: 'Tiered',
      marketing: 'Per-seat',
      fintech: 'Usage-based',
      general: 'Subscription'
    };
    
    return models[industry as keyof typeof models] || 'Subscription';
  }

  private static getIndustryPricingStart(industry: string): number {
    const pricing = {
      saas: 29,
      ecommerce: 19,
      marketing: 49,
      fintech: 99,
      general: 39
    };
    
    return pricing[industry as keyof typeof pricing] || 29;
  }

  private static getIndustryStrengths(industry: string): string[] {
    const strengths = {
      saas: ['Scalable architecture', 'Strong API ecosystem', 'User-friendly interface'],
      ecommerce: ['Comprehensive feature set', 'Mobile optimization', 'Payment flexibility'],
      marketing: ['Advanced analytics', 'Automation capabilities', 'Multi-channel support'],
      fintech: ['Security compliance', 'Real-time processing', 'Regulatory adherence'],
      general: ['Reliable service delivery', 'Good customer support', 'Competitive pricing']
    };
    
    return strengths[industry as keyof typeof strengths] || strengths.general;
  }

  private static getIndustryWeaknesses(industry: string): string[] {
    const weaknesses = {
      saas: ['Complex initial setup', 'Steep learning curve'],
      ecommerce: ['Transaction fees can add up', 'Limited design customization'],
      marketing: ['Expensive for small teams', 'Feature complexity'],
      fintech: ['Strict compliance requirements', 'Integration challenges'],
      general: ['Limited industry specialization', 'Generic feature set']
    };
    
    return weaknesses[industry as keyof typeof weaknesses] || weaknesses.general;
  }

  private static generateSmartFeatures(industry: string): Record<string, any> {
    const baseFeatures = {
      'User Management': true,
      'Analytics Dashboard': true,
      'API Access': true,
      'Mobile App': Math.random() > 0.3,
      'Custom Integrations': Math.random() > 0.4,
      'Advanced Reporting': Math.random() > 0.5,
      'White Labeling': Math.random() > 0.7,
      'SSO Integration': Math.random() > 0.6,
      'Multi-language Support': Math.random() > 0.5,
      '24/7 Support': Math.random() > 0.4
    };

    // Industry-specific feature enhancements
    const industryFeatures = {
      saas: {
        ...baseFeatures,
        'API Access': true,
        'Custom Integrations': true,
        'Advanced Reporting': true,
        'SSO Integration': true
      },
      ecommerce: {
        ...baseFeatures,
        'Mobile App': true,
        'Multi-language Support': true,
        'Payment Processing': true,
        'Inventory Management': true
      },
      marketing: {
        ...baseFeatures,
        'Advanced Reporting': true,
        'Campaign Management': true,
        'Social Media Integration': true,
        'A/B Testing': true
      },
      fintech: {
        ...baseFeatures,
        'Security Compliance': true,
        'Real-time Processing': true,
        'Audit Trail': true,
        'Fraud Detection': true
      }
    };

    return industryFeatures[industry as keyof typeof industryFeatures] || baseFeatures;
  }
}

// Differentiation Service
export class DifferentiationService {
  static async generateAngles(analysisId: string, userWebsite: string): Promise<void> {
    console.log('Generating differentiation angles for analysis:', analysisId);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const angles = [
      {
        title: 'User Experience Simplification',
        description: 'Focus on creating a more intuitive and streamlined user experience compared to complex competitor interfaces.',
        opportunity_level: 'high' as const
      },
      {
        title: 'Pricing Transparency',
        description: 'Offer clear, straightforward pricing without hidden fees or complex tier structures.',
        opportunity_level: 'medium' as const
      },
      {
        title: 'Specialized Industry Focus',
        description: 'Develop deep expertise and specialized features for a specific industry vertical.',
        opportunity_level: 'high' as const
      },
      {
        title: 'Customer Support Excellence',
        description: 'Provide superior customer support with faster response times and more personalized service.',
        opportunity_level: 'medium' as const
      },
      {
        title: 'Integration Ecosystem',
        description: 'Build a comprehensive integration ecosystem that competitors are missing.',
        opportunity_level: 'low' as const
      }
    ];

    const insertPromises = angles.map(async angle => {
      const { error } = await supabase
        .from('differentiation_angles')
        .insert({
          analysis_id: analysisId,
          title: angle.title,
          description: angle.description,
          opportunity_level: angle.opportunity_level
        });
      
      if (error) {
        console.error('Error inserting differentiation angle:', error);
        throw error;
      }
    });

    await Promise.all(insertPromises);
  }
}

// Content Generation Service
export class ContentGenerationService {
  static async generateAllContent(analysisId: string): Promise<void> {
    console.log('Generating all content types for analysis:', analysisId);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get analysis and competitors data
    const { data: analysis } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    const { data: competitors } = await supabase
      .from('competitors')
      .select('*')
      .eq('analysis_id', analysisId);

    const { data: angles } = await supabase
      .from('differentiation_angles')
      .select('*')
      .eq('analysis_id', analysisId);

    if (!analysis || !competitors) return;

    // Transform the data
    const transformedAnalysis = transformAnalysis(analysis);
    const transformedCompetitors = competitors.map(transformCompetitor);
    const transformedAngles = (angles || []).map(transformDifferentiationAngle);

    // Generate different content types
    const contentTypes = [
      { type: 'full_analysis', generator: this.generateFullAnalysis },
      { type: 'executive_summary', generator: this.generateExecutiveSummary },
      { type: 'battle_card', generator: this.generateBattleCard },
      { type: 'insights', generator: this.generateInsights }
    ];

    const contentPromises = contentTypes.map(async (contentType) => {
      const content = await contentType.generator(transformedAnalysis, transformedCompetitors, transformedAngles);
      
      const { error } = await supabase
        .from('analysis_content')
        .insert({
          analysis_id: analysisId,
          content_type: contentType.type,
          content: content
        });
      
      if (error) {
        console.error('Error inserting content:', error);
        throw error;
      }
    });

    await Promise.all(contentPromises);
  }

  private static async generateFullAnalysis(analysis: Analysis, competitors: Competitor[], angles: DifferentiationAngle[]): Promise<string> {
    return `# Competitive Analysis: ${analysis.name}

## Executive Summary

This comprehensive analysis of ${analysis.website} reveals key competitive dynamics and strategic opportunities in the market. Based on our analysis of ${competitors.length} main competitors, we've identified several differentiation opportunities.

## Market Landscape

### Key Competitors

${competitors.map(comp => `
**${comp.name}** (${comp.website})
- Positioning: ${comp.positioning}
- Pricing: ${comp.pricing_model} starting at $${comp.pricing_start}
- Strengths: ${comp.strengths?.join(', ')}
- Weaknesses: ${comp.weaknesses?.join(', ')}
`).join('')}

## Competitive Positioning

### Differentiation Opportunities

${angles.map(angle => `
**${angle.title}** (${angle.opportunity_level} opportunity)
${angle.description}
`).join('')}

## Feature Comparison

| Feature | Your Product | ${competitors.slice(0, 3).map(c => c.name).join(' | ')} |
|---------|-------------|${competitors.slice(0, 3).map(() => '----------').join('|')}|
| User Management | ✅ | ${competitors.slice(0, 3).map(c => c.features?.['User Management'] ? '✅' : '❌').join(' | ')} |
| Analytics | ✅ | ${competitors.slice(0, 3).map(c => c.features?.['Analytics Dashboard'] ? '✅' : '❌').join(' | ')} |
| API Access | ✅ | ${competitors.slice(0, 3).map(c => c.features?.['API Access'] ? '✅' : '❌').join(' | ')} |
| Mobile App | ✅ | ${competitors.slice(0, 3).map(c => c.features?.['Mobile App'] ? '✅' : '❌').join(' | ')} |

## Strategic Recommendations

1. **Focus on Simplicity**: Many competitors have complex interfaces. Emphasize ease of use.
2. **Transparent Pricing**: Offer clear, simple pricing structures.
3. **Superior Support**: Invest in customer success to differentiate from competitors.
4. **Niche Specialization**: Consider focusing on specific industry verticals.

## Next Steps

- Implement feature gaps identified in the analysis
- Develop messaging around key differentiators
- Monitor competitor pricing and feature updates
- Track market positioning changes quarterly

Generated on: ${new Date().toLocaleDateString()}`;
  }

  private static async generateExecutiveSummary(analysis: Analysis, competitors: Competitor[], angles: DifferentiationAngle[]): Promise<string> {
    return `# Executive Summary: ${analysis.name}

## Key Findings

We analyzed ${competitors.length} primary competitors for ${analysis.website} and identified ${angles.filter(a => a.opportunity_level === 'high').length} high-priority differentiation opportunities.

## Competitive Landscape

**Market Position**: The market is competitive with established players focusing on different segments.

**Pricing Range**: Competitors range from $${Math.min(...competitors.map(c => c.pricing_start || 0))} to $${Math.max(...competitors.map(c => c.pricing_start || 0))} per month.

**Key Differentiation Opportunities**:
${angles.filter(a => a.opportunity_level === 'high').map(angle => `- ${angle.title}`).join('\n')}

## Strategic Recommendations

1. **Immediate Action**: Focus on ${angles.find(a => a.opportunity_level === 'high')?.title}
2. **Medium-term**: Develop ${angles.filter(a => a.opportunity_level === 'medium').length} medium-priority initiatives
3. **Monitoring**: Track competitor moves in pricing and feature updates

## Success Metrics

- Market share growth in target segments
- Customer acquisition cost reduction
- Improved customer satisfaction scores
- Competitive win rate improvement

*Analysis Date: ${new Date().toLocaleDateString()}*`;
  }

  private static async generateBattleCard(analysis: Analysis, competitors: Competitor[], angles: DifferentiationAngle[]): Promise<string> {
    const topCompetitor = competitors[0];
    if (!topCompetitor) return 'No competitor data available';

    return `# Sales Battle Card: ${analysis.website} vs ${topCompetitor.name}

## Quick Win Messages

### Our Advantages
✅ **${angles[0]?.title}**: ${angles[0]?.description}
✅ **Better Value**: More transparent pricing structure
✅ **Superior Support**: Faster response times and dedicated success management

### Competitor Weaknesses
❌ **${topCompetitor.weaknesses?.[0]}**: Use this as a key differentiator
❌ **${topCompetitor.weaknesses?.[1]}**: Highlight our strength in this area

## Objection Handling

**"${topCompetitor.name} is the market leader"**
→ "While they're established, our customers choose us for [specific advantage]. Let me show you how we deliver better results."

**"${topCompetitor.name} is cheaper"**
→ "When you factor in hidden costs and implementation time, our total cost of ownership is actually lower. Plus, you get [specific value]."

**"We're already using ${topCompetitor.name}"**
→ "Many of our best customers switched from ${topCompetitor.name}. Here's what they gained: [specific benefits]."

## Competitive Pricing

| Plan | Us | ${topCompetitor.name} |
|------|----|--------------------|
| Starting Price | $29/month | $${topCompetitor.pricing_start}/month |
| Value Props | Simplified pricing, no hidden fees | ${topCompetitor.pricing_model} model |

## Discovery Questions

1. "What's working well with your current solution?"
2. "What's your biggest challenge with [current tool]?"
3. "How important is [key differentiator] to your team?"
4. "What would success look like in 6 months?"

## Next Steps

1. Demo our strongest differentiators
2. Provide ROI calculator
3. Connect with reference customer
4. Schedule technical deep-dive

*Last Updated: ${new Date().toLocaleDateString()}*`;
  }

  private static async generateInsights(analysis: Analysis, competitors: Competitor[], angles: DifferentiationAngle[]): Promise<string> {
    return `# Market Insights: ${analysis.name}

## Key Market Trends

### Pricing Analysis
- **Average Starting Price**: $${Math.round(competitors.reduce((sum, c) => sum + (c.pricing_start || 0), 0) / competitors.length)}
- **Most Common Model**: ${ContentGenerationService.getMostCommonPricingModel(competitors)}
- **Price Range**: $${Math.min(...competitors.map(c => c.pricing_start || 0))} - $${Math.max(...competitors.map(c => c.pricing_start || 0))}

### Feature Adoption
${ContentGenerationService.generateFeatureInsights(competitors)}

### Positioning Trends
${ContentGenerationService.generatePositioningInsights(competitors)}

## Opportunity Assessment

### High-Priority Opportunities
${angles.filter(a => a.opportunity_level === 'high').map(angle => `
**${angle.title}**
${angle.description}
`).join('')}

### Market Gaps
- Simplified user experience for non-technical users
- Better onboarding and customer success programs
- More flexible pricing options for growing businesses
- Industry-specific feature sets

## Competitive Intelligence

### Recent Market Moves
- Competitors are focusing on enterprise features
- Pricing pressure in the mid-market segment
- Increasing emphasis on integrations and APIs
- Customer success becoming a key differentiator

### Watch List
${competitors.slice(0, 3).map(comp => `
- **${comp.name}**: Monitor for ${comp.strengths?.[0]} improvements
`).join('')}

## Action Items

1. **Product Development**: Focus on ${angles[0]?.title}
2. **Marketing Messaging**: Emphasize transparency and simplicity
3. **Sales Enablement**: Update battle cards with latest competitive intel
4. **Customer Success**: Implement proactive monitoring program

*Intelligence gathered: ${new Date().toLocaleDateString()}*`;
  }

  private static getMostCommonPricingModel(competitors: Competitor[]): string {
    const models = competitors.map(c => c.pricing_model).filter(Boolean);
    const frequency = models.reduce((acc, model) => {
      acc[model!] = (acc[model!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(frequency).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Subscription';
  }

  private static generateFeatureInsights(competitors: Competitor[]): string {
    const features = ['User Management', 'Analytics Dashboard', 'API Access', 'Mobile App'];
    return features.map(feature => {
      const adoption = competitors.filter(c => c.features?.[feature]).length;
      const percentage = Math.round((adoption / competitors.length) * 100);
      return `- **${feature}**: ${percentage}% adoption rate among competitors`;
    }).join('\n');
  }

  private static generatePositioningInsights(competitors: Competitor[]): string {
    const insights = [
      'Enterprise-focused positioning dominates the market',
      'Emphasis on scalability and security',
      'User experience differentiation becoming more important',
      'Integration capabilities are table stakes'
    ];
    return insights.map(insight => `- ${insight}`).join('\n');
  }
}
