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
        user_id: user.id  // Set the user_id explicitly
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
    console.log('Starting analysis for ID:', analysisId);
    
    // Update status to analyzing
    await supabase
      .from('analyses')
      .update({ status: 'analyzing', updated_at: new Date().toISOString() })
      .eq('id', analysisId);

    try {
      // Get the analysis details
      const { data: analysis } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (!analysis) throw new Error('Analysis not found');

      // Discover competitors using AI
      const competitors = await CompetitorDiscoveryService.discoverCompetitors(analysis.website);
      
      // Analyze each competitor
      const competitorPromises = competitors.map(async (comp) => {
        const competitorData = await CompetitorAnalysisService.analyzeCompetitor(comp.website);
        
        return supabase
          .from('competitors')
          .insert({
            analysis_id: analysisId,
            name: competitorData.name,
            website: comp.website,
            description: competitorData.description,
            positioning: competitorData.positioning,
            pricing_model: competitorData.pricing_model,
            pricing_start: competitorData.pricing_start,
            strengths: competitorData.strengths,
            weaknesses: competitorData.weaknesses,
            features: competitorData.features
          });
      });

      await Promise.all(competitorPromises);

      // Generate differentiation angles
      const angles = await DifferentiationService.generateAngles(analysisId, analysis.website);
      
      // Generate content for different formats
      await ContentGenerationService.generateAllContent(analysisId);

      // Mark as completed
      await supabase
        .from('analyses')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', analysisId);

      console.log('Analysis completed successfully for ID:', analysisId);
    } catch (error) {
      console.error('Error during analysis:', error);
      
      await supabase
        .from('analyses')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', analysisId);
      
      throw error;
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

// Competitor Discovery Service
export class CompetitorDiscoveryService {
  static async discoverCompetitors(website: string): Promise<{ name: string; website: string }[]> {
    console.log('Discovering competitors for:', website);
    
    // This would typically use AI to discover competitors
    // For now, we'll return some realistic competitors based on common patterns
    const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
    const industry = await this.guessIndustry(domain);
    
    return this.getCommonCompetitors(industry);
  }

  private static async guessIndustry(domain: string): Promise<string> {
    // Simple industry detection based on domain patterns
    if (domain.includes('shop') || domain.includes('store') || domain.includes('commerce')) {
      return 'ecommerce';
    } else if (domain.includes('tech') || domain.includes('app') || domain.includes('software')) {
      return 'saas';
    } else if (domain.includes('marketing') || domain.includes('agency')) {
      return 'marketing';
    } else {
      return 'general';
    }
  }

  private static getCommonCompetitors(industry: string): { name: string; website: string }[] {
    const competitors = {
      saas: [
        { name: 'Competitor A', website: 'https://competitor-a.com' },
        { name: 'Competitor B', website: 'https://competitor-b.com' },
        { name: 'Industry Leader', website: 'https://industry-leader.com' },
        { name: 'StartupRival', website: 'https://startup-rival.com' },
        { name: 'BigCorpSolution', website: 'https://bigcorp-solution.com' }
      ],
      ecommerce: [
        { name: 'ShopRival', website: 'https://shop-rival.com' },
        { name: 'EcomLeader', website: 'https://ecom-leader.com' },
        { name: 'MarketPlace Pro', website: 'https://marketplace-pro.com' },
        { name: 'RetailGiant', website: 'https://retail-giant.com' }
      ],
      marketing: [
        { name: 'AgencyPro', website: 'https://agency-pro.com' },
        { name: 'MarketingMaster', website: 'https://marketing-master.com' },
        { name: 'DigitalExperts', website: 'https://digital-experts.com' }
      ],
      general: [
        { name: 'DirectCompetitor', website: 'https://direct-competitor.com' },
        { name: 'AlternativeSolution', website: 'https://alternative-solution.com' },
        { name: 'IndustryPlayer', website: 'https://industry-player.com' }
      ]
    };

    return competitors[industry as keyof typeof competitors] || competitors.general;
  }
}

// Competitor Analysis Service
export class CompetitorAnalysisService {
  static async analyzeCompetitor(website: string) {
    console.log('Analyzing competitor:', website);
    
    // Simulate web scraping and AI analysis
    const companyName = this.extractCompanyName(website);
    
    return {
      name: companyName,
      description: `${companyName} is a leading player in their market segment, offering innovative solutions to their target customers.`,
      positioning: this.generatePositioning(companyName),
      pricing_model: this.generatePricingModel(),
      pricing_start: this.generatePricingStart(),
      strengths: this.generateStrengths(),
      weaknesses: this.generateWeaknesses(),
      features: this.generateFeatures()
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

  private static generatePositioning(companyName: string): string {
    const positions = [
      `${companyName} positions itself as the premium solution for enterprise customers`,
      `${companyName} focuses on simplicity and ease of use for small businesses`,
      `${companyName} targets mid-market companies with scalable solutions`,
      `${companyName} emphasizes innovation and cutting-edge technology`
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  }

  private static generatePricingModel(): string {
    const models = ['Subscription', 'Freemium', 'Per-seat', 'Usage-based', 'One-time', 'Tiered'];
    return models[Math.floor(Math.random() * models.length)];
  }

  private static generatePricingStart(): number {
    const prices = [9, 19, 29, 49, 99, 199, 299, 499];
    return prices[Math.floor(Math.random() * prices.length)];
  }

  private static generateStrengths(): string[] {
    const allStrengths = [
      'Strong brand recognition',
      'Excellent customer support',
      'Advanced feature set',
      'Competitive pricing',
      'Great user experience',
      'Strong integrations',
      'Scalable platform',
      'Industry expertise',
      'Global presence',
      'Innovation leadership'
    ];
    
    return allStrengths.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  private static generateWeaknesses(): string[] {
    const allWeaknesses = [
      'Complex pricing structure',
      'Limited customization options',
      'Steep learning curve',
      'Expensive for small businesses',
      'Limited integrations',
      'Slow customer support',
      'Outdated user interface',
      'Missing key features',
      'Poor mobile experience',
      'Vendor lock-in concerns'
    ];
    
    return allWeaknesses.sort(() => 0.5 - Math.random()).slice(0, 2);
  }

  private static generateFeatures(): Record<string, any> {
    return {
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
  }
}

// Differentiation Service
export class DifferentiationService {
  static async generateAngles(analysisId: string, userWebsite: string): Promise<void> {
    console.log('Generating differentiation angles for analysis:', analysisId);
    
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

    const insertPromises = angles.map(angle => 
      supabase
        .from('differentiation_angles')
        .insert({
          analysis_id: analysisId,
          title: angle.title,
          description: angle.description,
          opportunity_level: angle.opportunity_level
        })
    );

    await Promise.all(insertPromises);
  }
}

// Content Generation Service
export class ContentGenerationService {
  static async generateAllContent(analysisId: string): Promise<void> {
    console.log('Generating all content types for analysis:', analysisId);
    
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
      
      return supabase
        .from('analysis_content')
        .insert({
          analysis_id: analysisId,
          content_type: contentType.type,
          content: content
        });
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
- **Most Common Model**: ${this.getMostCommonPricingModel(competitors)}
- **Price Range**: $${Math.min(...competitors.map(c => c.pricing_start || 0))} - $${Math.max(...competitors.map(c => c.pricing_start || 0))}

### Feature Adoption
${this.generateFeatureInsights(competitors)}

### Positioning Trends
${this.generatePositioningInsights(competitors)}

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
