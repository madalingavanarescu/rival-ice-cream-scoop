import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Edit, Download, Eye, Share, Plus, BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalyses } from '@/hooks/useAnalysis';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";
import SubscriptionStatus from '@/components/SubscriptionStatus';
import UpgradePrompt from '@/components/UpgradePrompt';
import { useSubscriptionLimits } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { canCreateAnalysis, analysesRemaining } = useSubscriptionLimits();

  if (!session.user && session.isLoaded) {
    navigate("/auth");
    return null;
  }

  const { data: analyses, isLoading, error } = useAnalyses();

  const completedAnalyses = analyses?.filter(a => a.status === 'completed') || [];
  const totalCompetitors = completedAnalyses.length * 5;
  const totalPages = completedAnalyses.length;

  const shouldShowUpgradePrompt = !canCreateAnalysis;
  const shouldShowUsageWarning = analysesRemaining <= 2 && analysesRemaining > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-900" />
              <span className="text-lg sm:text-2xl font-semibold text-neutral-900">CompeteAI</span>
            </Link>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link to="/pricing">
                <Button variant="ghost" size="sm" className="text-neutral-700 hover:text-neutral-900">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Pricing
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button 
                  size="sm" 
                  disabled={!canCreateAnalysis}
                  className="bg-neutral-900 hover:bg-neutral-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-neutral-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-neutral-600">
            Your AI robots have been busy analyzing competitors. Here's what's new.
          </p>
        </div>

        {/* Subscription Status and Upgrade Prompts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {shouldShowUpgradePrompt && (
              <div className="mb-6">
                <UpgradePrompt trigger="limit-reached" />
              </div>
            )}
            {shouldShowUsageWarning && !shouldShowUpgradePrompt && (
              <div className="mb-6">
                <UpgradePrompt trigger="usage-warning" />
              </div>
            )}
          </div>
          <div>
            <SubscriptionStatus />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              title: "Total Analyses",
              value: isLoading ? <Skeleton className="h-6 w-8" /> : analyses?.length || 0,
              icon: Bot,
              color: "blue"
            },
            {
              title: "Competitors Tracked",
              value: isLoading ? <Skeleton className="h-6 w-8" /> : totalCompetitors,
              icon: Users,
              color: "green"
            },
            {
              title: "Pages Generated",
              value: isLoading ? <Skeleton className="h-6 w-8" /> : totalPages,
              icon: Edit,
              color: "purple"
            },
            {
              title: "Success Rate",
              value: isLoading ? <Skeleton className="h-6 w-8" /> : '98%',
              icon: TrendingUp,
              color: "orange"
            }
          ].map((stat, idx) => (
            <Card key={idx} className="border-neutral-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-medium text-neutral-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn(
                    "p-2 sm:p-3 rounded-lg",
                    stat.color === "blue" && "bg-blue-100",
                    stat.color === "green" && "bg-green-100",
                    stat.color === "purple" && "bg-purple-100",
                    stat.color === "orange" && "bg-orange-100"
                  )}>
                    <stat.icon className={cn(
                      "h-5 w-5 sm:h-6 sm:w-6",
                      stat.color === "blue" && "text-blue-600",
                      stat.color === "green" && "text-green-600",
                      stat.color === "purple" && "text-purple-600",
                      stat.color === "orange" && "text-orange-600"
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-neutral-100">
            <TabsTrigger value="projects" className="data-[state=active]:bg-white">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-white">
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-white">
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-medium text-neutral-900">Recent Analyses</h2>
              <Link to="/onboarding">
                <Button disabled={!canCreateAnalysis} className="bg-neutral-900 hover:bg-neutral-800">
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 sm:h-32 w-full" />
                  <Skeleton className="h-24 sm:h-32 w-full" />
                </div>
              ) : error ? (
                <Card className="border-neutral-200">
                  <CardContent className="p-6 text-center">
                    <p className="text-red-600">Error loading analyses. Please try again.</p>
                  </CardContent>
                </Card>
              ) : analyses?.length === 0 ? (
                <Card className="border-neutral-200">
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                      <Bot className="h-6 w-6 text-neutral-600" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">No analyses yet</h3>
                    <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
                      Create your first competitor analysis to get started with CompeteAI.
                    </p>
                    <Link to="/onboarding">
                      <Button disabled={!canCreateAnalysis} className="bg-neutral-900 hover:bg-neutral-800">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Analysis
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                analyses.map((analysis) => (
                  <Card key={analysis.id} className="border-neutral-200 hover:border-neutral-300 transition-colors">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                 <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-2">
                             <h3 className="font-medium text-neutral-900 truncate">
                               {analysis.website}
                             </h3>
                            <Badge 
                              variant={analysis.status === 'completed' ? 'default' : 'secondary'}
                              className={cn(
                                "text-xs",
                                analysis.status === 'completed' 
                                  ? "bg-green-100 text-green-800 border-green-200" 
                                  : "bg-neutral-100 text-neutral-700 border-neutral-200"
                              )}
                            >
                              {analysis.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Created {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {analysis.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm" className="text-neutral-700 hover:text-neutral-900">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm" className="text-neutral-700 hover:text-neutral-900">
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                              <Button variant="ghost" size="sm" className="text-neutral-700 hover:text-neutral-900">
                                <Share className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="border-neutral-200">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                  <Target className="h-6 w-6 text-neutral-600" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Monitoring Coming Soon</h3>
                <p className="text-neutral-600 max-w-sm mx-auto">
                  Set up alerts for when competitors change pricing, add features, or update positioning.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card className="border-neutral-200">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4">
                  <Edit className="h-6 w-6 text-neutral-600" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">Custom Templates</h3>
                <p className="text-neutral-600 max-w-sm mx-auto">
                  Create and manage custom templates for your competitor analysis reports.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
