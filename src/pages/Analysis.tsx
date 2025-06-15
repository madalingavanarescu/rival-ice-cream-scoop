import React from 'react';
import { useParams, Navigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalysis, useCompetitors, useAnalysisContent, useDifferentiationAngles } from '@/hooks/useAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, ArrowLeft, Download, Share, Users, TrendingUp, Target, FileText, Lightbulb } from 'lucide-react';

const AnalysisPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSession();

  if (id === "sample") {
    // Show sample data for demo
    return (
      <div className="max-w-2xl mx-auto py-24 px-4">
        <h2 className="text-3xl font-bold mb-6">Sample Competitor Analysis</h2>
        <p className="mb-4">
          Here is a demo of what you'll receive with CompeteAI. Your real results will be fully tailored to your market:
        </p>
        <ul className="mb-6 text-blue-800 space-y-2 bg-blue-50 p-4 rounded">
          <li>• 5 sample competitors with side-by-side charts</li>
          <li>• Differentiation angle examples</li>
          <li>• Full battle card, feature table, and executive summary</li>
        </ul>
        <div className="border p-8 rounded bg-white shadow">
          <p className="font-bold mb-2">Executive Summary</p>
          <p style={{ color: "#2a2a2a" }}>
            "Acme AI leverages advanced automation to outpace traditional competitors in speed, flexibility, and cost-efficiency.
            Key rivals include RoboSoft, InsightPro, and PricingGenius, with unique weaknesses and gaps in their product lines."
          </p>
          <div className="mt-6">
            <p className="font-bold mb-1">Battle Card Highlight</p>
            <p>RoboSoft: Lacks integrated analytics; InsightPro: Expensive for SMBs; PricingGenius: Slow deployment time.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session.user && session.isLoaded) {
    return <Navigate to="/auth" replace />;
  }

  const { data: analysis, isLoading: analysisLoading } = useAnalysis(id);
  const { data: competitors, isLoading: competitorsLoading } = useCompetitors(id);
  const { data: content, isLoading: contentLoading } = useAnalysisContent(id);
  const { data: angles, isLoading: anglesLoading } = useDifferentiationAngles(id);

  const fullAnalysis = content?.find(c => c.content_type === 'full_analysis');
  const battleCard = content?.find(c => c.content_type === 'battle_card');
  const insights = content?.find(c => c.content_type === 'insights');
  const executiveSummary = content?.find(c => c.content_type === 'executive_summary');

  if (analysisLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
            <p className="text-gray-600 mb-4">The analysis you're looking for doesn't exist or you don't have access to it.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{analysis.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={analysis.status === 'completed' ? 'default' : 'secondary'}>
                    {analysis.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{analysis.website}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analysis.status === 'completed' ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="battlecard">Battle Card</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="analysis">Full Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Competitors Found</p>
                        <p className="text-3xl font-bold text-gray-900">{competitors?.length || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">High-Priority Opportunities</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {angles?.filter(a => a.opportunity_level === 'high').length || 0}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Analysis Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Executive Summary */}
              {executiveSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {executiveSummary.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Differentiation Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Key Differentiation Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {anglesLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : (
                      angles?.slice(0, 3).map((angle) => (
                        <div key={angle.id} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{angle.title}</h4>
                            <Badge variant={angle.opportunity_level === 'high' ? 'default' : 'secondary'}>
                              {angle.opportunity_level}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{angle.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-6">
              <div className="grid gap-6">
                {competitorsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  competitors?.map((competitor) => (
                    <Card key={competitor.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{competitor.name}</h3>
                            <p className="text-gray-600 mb-2">{competitor.website}</p>
                            <p className="text-sm text-gray-700">{competitor.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{competitor.pricing_model}</Badge>
                            <p className="text-lg font-semibold mt-1">
                              ${competitor.pricing_start}/month
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                            <ul className="text-sm space-y-1">
                              {competitor.strengths?.map((strength, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">Weaknesses</h4>
                            <ul className="text-sm space-y-1">
                              {competitor.weaknesses?.map((weakness, index) => (
                                <li key={index} className="flex items-center">
                                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="battlecard">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Battle Card</CardTitle>
                  <p className="text-gray-600">Quick reference for sales conversations and competitive positioning.</p>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <Skeleton className="h-96 w-full" />
                  ) : battleCard ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {battleCard.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-500">Battle card content is being generated...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                  <p className="text-gray-600">Strategic insights and market intelligence.</p>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <Skeleton className="h-96 w-full" />
                  ) : insights ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {insights.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-500">Insights are being generated...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <Card>
                <CardHeader>
                  <CardTitle>Full Competitive Analysis</CardTitle>
                  <p className="text-gray-600">Comprehensive analysis including all findings and recommendations.</p>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <Skeleton className="h-96 w-full" />
                  ) : fullAnalysis ? (
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {fullAnalysis.content}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-500">Full analysis is being generated...</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-semibold mb-2">Analysis in Progress</h2>
              <p className="text-gray-600 mb-4">
                Our AI robots are analyzing your competitors. This usually takes 2-3 minutes.
              </p>
              <Badge variant="secondary">{analysis.status}</Badge>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
