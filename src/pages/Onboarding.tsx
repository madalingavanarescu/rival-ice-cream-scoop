
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bot, Globe, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (website) {
      setStep(2);
    }
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && companyName) {
      setIsAnalyzing(true);
      // Simulate analysis
      setTimeout(() => {
        setStep(3);
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CompeteAI</span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Progress value={progressValue} className="mb-8" />

          {step === 1 && (
            <Card>
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">What's your website?</CardTitle>
                <p className="text-gray-600">
                  We'll analyze your site to understand your business and find the right competitors to track.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWebsiteSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://your-company.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      required
                      className="text-lg py-3"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Analyze My Website
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && !isAnalyzing && (
            <Card>
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Great! Now let's get you set up</CardTitle>
                <p className="text-gray-600">
                  We'll send your competitor analysis to your email and create your account.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUserInfoSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-lg py-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="text-lg py-3"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Start AI Analysis
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {isAnalyzing && (
            <Card>
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl">Our AI Robots Are Working!</CardTitle>
                <p className="text-gray-600">
                  This usually takes 2-3 minutes. We're analyzing your competitors and generating insights.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Search className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Research Robot: Discovering competitors...</span>
                    <div className="flex-1">
                      <div className="bg-blue-200 h-2 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Writing Robot: Analyzing features & positioning...</span>
                    <div className="flex-1">
                      <div className="bg-green-200 h-2 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Design Robot: Creating your competitor page...</span>
                    <div className="flex-1">
                      <div className="bg-purple-200 h-2 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Analysis Complete! 🎉</CardTitle>
                <p className="text-gray-600">
                  We've identified 5 key competitors and generated your first competitor analysis page.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What We Found:</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• 5 direct competitors in your market</li>
                    <li>• 3 unique differentiation opportunities</li>
                    <li>• 12 feature comparison points</li>
                    <li>• 1 comprehensive competitor page ready</li>
                  </ul>
                </div>
                <Link to="/dashboard" className="block">
                  <Button size="lg" className="w-full">
                    View Your Competitor Analysis
                  </Button>
                </Link>
                <p className="text-center text-sm text-gray-600">
                  We've also sent a copy to {email}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
