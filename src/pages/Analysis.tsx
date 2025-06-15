
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Edit, Download, Share, ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const Analysis = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in real app this would come from API
  const analysisData = {
    id: 1,
    name: 'SaaS Platform Analysis',
    website: 'example.com',
    competitors: [
      {
        name: 'Competitor A',
        website: 'competitor-a.com',
        strengths: ['Advanced analytics', 'Strong integrations', 'Enterprise features'],
        weaknesses: ['High price point', 'Steep learning curve', 'Limited mobile app'],
        pricing: 'Starting at $99/month',
        positioning: 'Enterprise-focused analytics platform'
      },
      {
        name: 'Competitor B',
        website: 'competitor-b.com',
        strengths: ['User-friendly interface', 'Competitive pricing', 'Good customer support'],
        weaknesses: ['Limited customization', 'Fewer integrations', 'Basic reporting'],
        pricing: 'Starting at $29/month',
        positioning: 'SMB-focused with ease of use'
      }
    ],
    differentiationAngles: [
      {
        title: 'AI-Powered Insights',
        description: 'While competitors rely on static dashboards, our platform uses machine learning to surface actionable insights automatically.',
        opportunity: 'High - This is a key differentiator that resonates with modern businesses'
      },
      {
        title: 'No-Code Customization',
        description: 'Users can build custom workflows without technical expertise, unlike competitors that require developer resources.',
        opportunity: 'Medium - Appeals to smaller teams but may not matter for enterprise buyers'
      }
    ],
    generatedContent: `# Competitive Analysis: SaaS Platform Market

## Executive Summary

In the competitive SaaS platform landscape, your company is well-positioned to capture market share through strategic differentiation. Our analysis of 5 key competitors reveals significant opportunities in AI-powered automation and user experience design.

## Key Competitors Overview

### Competitor A - The Enterprise Giant
**Website:** competitor-a.com  
**Positioning:** Enterprise-focused analytics platform  
**Pricing:** Starting at $99/month  

**What They Do Well:**
- Advanced analytics capabilities that appeal to data-driven organizations
- Strong integration ecosystem with 200+ third-party tools
- Robust enterprise features including SSO, advanced permissions, and audit trails

**Where They Fall Short:**
- High price point creates barrier for SMB market
- Steep learning curve requires significant training investment
- Mobile experience is limited, reducing field accessibility

**Your Competitive Advantage:** Focus on intuitive design and AI-powered insights that deliver value from day one, without the complexity tax.

### Competitor B - The SMB Favorite
**Website:** competitor-b.com  
**Positioning:** SMB-focused with ease of use  
**Pricing:** Starting at $29/month  

**What They Do Well:**
- Exceptionally user-friendly interface that requires minimal training
- Competitive pricing that appeals to cost-conscious buyers
- Responsive customer support with high satisfaction ratings

**Where They Fall Short:**
- Limited customization options restrict advanced use cases
- Fewer integrations limit workflow automation potential
- Basic reporting capabilities don't scale with growing businesses

**Your Competitive Advantage:** Bridge the gap between simplicity and power with no-code customization that grows with the customer.

## Unexpected Differentiation Opportunities

### 1. AI-Powered Insights Engine
**The Opportunity:** While competitors provide dashboards, they don't provide intelligence. Most require users to interpret data and draw conclusions manually.

**Your Unique Angle:** Position your platform as the first to automatically surface insights and recommend actions. Instead of showing what happened, show what to do next.

**Messaging:** "Stop analyzing data. Start acting on intelligence."

### 2. No-Code Workflow Builder
**The Opportunity:** Competitors either offer no customization (too simple) or require developers (too complex).

**Your Unique Angle:** Democratize customization with visual workflow builders that anyone can use, but powerful enough for complex business logic.

**Messaging:** "Built for business users, powerful enough for IT."

## Battle Card: Key Talking Points

### When They Say: "Competitor A has more features"
**You Say:** "Features don't equal results. Our AI engine delivers insights automatically, so you spend time acting instead of analyzing. Would you rather have 100 reports to read or 5 actions to take?"

### When They Say: "Competitor B is cheaper"
**You Say:** "True, but cheap software gets expensive when you outgrow it. Our platform scales with you using no-code customization, so you won't need to migrate in 18 months."

### When They Say: "We need enterprise-grade security"
**You Say:** "We meet the same SOC 2 and GDPR standards as the enterprise players, but without the enterprise complexity. Security shouldn't require a PhD to configure."

## Recommended Positioning Strategy

**Primary Message:** "The intelligent platform that grows with your business"

**Supporting Pillars:**
1. **Intelligence Over Information:** AI-powered insights vs. static dashboards
2. **Simplicity That Scales:** No-code customization vs. one-size-fits-all or developer-required
3. **Value From Day One:** Quick wins vs. long implementation cycles

## Market Timing Insights

The market is shifting toward AI-powered tools, creating a window of opportunity. Competitors are focused on feature parity rather than fundamental innovation. This is your chance to leapfrog with a different approach.

**Immediate Action Items:**
1. Emphasize AI capabilities in all marketing materials
2. Create demo scenarios showing insight generation, not just data visualization  
3. Develop case studies highlighting no-code customization success stories
4. Position against "legacy" approaches to business intelligence

## Conclusion

Your strongest competitive position lies at the intersection of intelligence and accessibility. While Competitor A focuses on power and Competitor B focuses on simplicity, you can own the "intelligent simplicity" position that the market is demanding.

The key is to avoid feature comparisons and instead focus on outcomes. Don't compete on what your platform has—compete on what it helps customers achieve.`
  };

  const handleExport = () => {
    // Create PDF or export functionality
    console.log('Exporting analysis...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">{analysisData.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analysis">Full Analysis</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Cards</TabsTrigger>
            <TabsTrigger value="insights">Key Insights</TabsTrigger>
            <TabsTrigger value="battlecard">Battle Card</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{analysisData.name}</CardTitle>
                    <p className="text-gray-600 mt-1">
                      Generated for {analysisData.website} • {analysisData.competitors.length} competitors analyzed
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Star className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
                    defaultValue={analysisData.generatedContent}
                  />
                ) : (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{analysisData.generatedContent}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            {analysisData.competitors.map((competitor, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {competitor.name}
                        <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                      </CardTitle>
                      <p className="text-gray-600">{competitor.website}</p>
                      <p className="text-sm text-gray-500 mt-1">{competitor.positioning}</p>
                    </div>
                    <Badge variant="outline">{competitor.pricing}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Strengths</h4>
                      <ul className="space-y-2">
                        {competitor.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-3">Weaknesses</h4>
                      <ul className="space-y-2">
                        {competitor.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {analysisData.differentiationAngles.map((angle, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{angle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{angle.description}</p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Market Opportunity</p>
                    <p className="text-blue-800">{angle.opportunity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="battlecard">
            <Card>
              <CardHeader>
                <CardTitle>Sales Battle Card</CardTitle>
                <p className="text-gray-600">Quick reference for competitive conversations</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Key Messaging</h4>
                    <p className="text-yellow-800">"The intelligent platform that grows with your business"</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">When They Choose Us</h4>
                      <ul className="text-green-800 text-sm space-y-1">
                        <li>• AI-powered insights vs. static dashboards</li>
                        <li>• No-code customization that scales</li>
                        <li>• Value from day one implementation</li>
                      </ul>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Common Objections</h4>
                      <ul className="text-red-800 text-sm space-y-1">
                        <li>• "Competitor A has more features"</li>
                        <li>• "Competitor B is cheaper"</li>
                        <li>• "We need enterprise security"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;
