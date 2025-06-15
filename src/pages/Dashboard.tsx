
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Edit, Download, Eye, Share, Plus, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'SaaS Platform Analysis',
      website: 'example.com',
      competitors: 5,
      status: 'completed',
      lastUpdated: '2 hours ago',
      template: 'Professional'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CompeteAI</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Usage
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Your AI robots have been busy analyzing competitors. Here's what's new.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Competitors Tracked</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pages Generated</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Edit className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Downloads</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Analyses</h2>
              <Link to="/onboarding">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {project.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{project.website}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{project.competitors} competitors</span>
                          <span>•</span>
                          <span>Updated {project.lastUpdated}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link to={`/analysis/${project.id}`}>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Monitoring</CardTitle>
                <p className="text-gray-600">Track changes to your competitors' websites, pricing, and features.</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No monitoring alerts yet</h3>
                  <p className="text-gray-600 mb-4">Set up monitoring for your competitors to get real-time updates.</p>
                  <Button>Setup Monitoring</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Professional</h3>
                  <p className="text-gray-600 text-sm mb-4">Clean, business-focused competitor analysis with detailed feature comparisons.</p>
                  <Badge variant="secondary">Most Popular</Badge>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                  <p className="text-gray-600 text-sm mb-4">High-level overview perfect for leadership presentations and strategic planning.</p>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Edit className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sales Battle Card</h3>
                  <p className="text-gray-600 text-sm mb-4">Focused on objection handling and competitive positioning for sales teams.</p>
                  <Badge variant="outline">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
