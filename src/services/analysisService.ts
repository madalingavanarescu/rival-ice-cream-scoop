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
import { WebsiteContextService } from './websiteContextService';

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
    console.log('Starting enhanced analysis for:', analysisId);
    
    try {
      // Update status to analyzing
      await supabase
        .from('analyses')
        .update({ 
          status: 'analyzing',
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId);

      // Get analysis details
      const { data: analysis } = await supabase
        .from('analyses')
        .select('website, name')
        .eq('id', analysisId)
        .single();

      if (!analysis) {
        throw new Error('Analysis not found');
      }

      console.log('Step 1: Analyzing user website context');
      
      // Phase 1: Analyze user's website context first
      const websiteAnalysis = await WebsiteContextService.analyzeWebsite(
        analysis.website, 
        analysis.name
      );

      if (!websiteAnalysis?.success) {
        console.warn('Website context analysis failed, proceeding without context');
      }

      // Store website context if successful
      let websiteContext = null;
      if (websiteAnalysis?.success && websiteAnalysis.websiteContext) {
        await WebsiteContextService.storeWebsiteContext(analysisId, websiteAnalysis.websiteContext);
        websiteContext = websiteAnalysis.websiteContext;
        console.log('Website context stored successfully');
      }

      console.log('Step 2: AI-powered competitor discovery');
      
      // Phase 2: Enhanced competitor discovery using website context
      const { data: competitorData, error: competitorError } = await supabase.functions.invoke('discover-competitors', {
        body: { 
          website: analysis.website,
          companyName: analysis.name,
          websiteContext: websiteContext
        }
      });

      if (competitorError) {
        console.error('Error discovering competitors:', competitorError);
        throw competitorError;
      }

      const competitors = competitorData?.competitors || [];
      console.log(`Discovered ${competitors.length} competitors using AI`, competitorData?.source);

      console.log('Step 3: Enhanced comparative competitor analysis');

      // Phase 3: Analyze each competitor with enhanced comparative context
      for (const competitor of competitors) {
        try {
          console.log(`Analyzing competitor: ${competitor.name}`);
          
          // First scrape the competitor's website
          const { data: scrapingResult } = await supabase.functions.invoke('scrape-competitor', {
            body: { 
              website: competitor.website,
              analysisId: analysisId 
            }
          });

          // Then analyze with enhanced comparative context
          const { data: analysisResult } = await supabase.functions.invoke('analyze-competitor', {
            body: {
              website: competitor.website,
              competitorName: competitor.name,
              scrapedContent: scrapingResult?.content,
              userWebsiteContext: websiteContext // Pass user's context for comparative analysis
            }
          });

          if (analysisResult?.success && analysisResult.competitorData) {
            // Store enhanced competitor data with comparative insights
            await supabase
              .from('competitors')
              .insert({
                analysis_id: analysisId,
                name: analysisResult.competitorData.name,
                website: competitor.website,
                description: analysisResult.competitorData.description,
                positioning: analysisResult.competitorData.positioning,
                pricing_model: analysisResult.competitorData.pricing_model,
                pricing_start: analysisResult.competitorData.pricing_start,
                pricing_details: analysisResult.competitorData.pricing_details,
                strengths: analysisResult.competitorData.strengths,
                weaknesses: analysisResult.competitorData.weaknesses,
                features: analysisResult.competitorData.features,
                target_audience: analysisResult.competitorData.target_audience,
                value_proposition: analysisResult.competitorData.value_proposition,
                competitive_advantages: analysisResult.competitorData.competitive_advantages,
                market_focus: analysisResult.competitorData.market_focus,
                comparative_insights: analysisResult.competitorData.comparative_insights
              });

            // Generate differentiation angles based on comparative insights
            if (analysisResult.competitorData.comparative_insights?.differentiation_opportunities) {
              for (const opportunity of analysisResult.competitorData.comparative_insights.differentiation_opportunities) {
                await supabase
                  .from('differentiation_angles')
                  .insert({
                    analysis_id: analysisId,
                    title: opportunity,
                    description: `Opportunity identified through comparative analysis with ${competitor.name}`,
                    opportunity_level: analysisResult.competitorData.comparative_insights.competitive_threat_level === 'high' ? 'high' : 'medium'
                  });
              }
            }

            console.log(`Competitor ${competitor.name} analyzed and stored with comparative insights`);
          }
        } catch (error) {
          console.error(`Error analyzing competitor ${competitor.name}:`, error);
          // Continue with next competitor instead of failing the entire analysis
        }
      }

      console.log('Step 4: Generating personalized content');

      // Generate analysis content
      await this.generateAnalysisContent(analysisId);

      // Mark analysis as completed
      await supabase
        .from('analyses')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId);

      console.log('Enhanced comparative analysis completed successfully');

    } catch (error) {
      console.error('Error in enhanced analysis:', error);
      
      // Mark analysis as failed
      await supabase
        .from('analyses')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
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

  private static async generateAnalysisContent(analysisId: string): Promise<void> {
    console.log('Generating analysis content for analysis:', analysisId);
    
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
