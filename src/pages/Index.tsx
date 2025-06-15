import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Search, FileText, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  // Handlers for buttons
  const handleSample = () => {
    // Navigate to a hardcoded sample report (public demo)
    navigate('/analysis/sample');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CompeteAI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
            </nav>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
              <Link to="/onboarding">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stop Guessing What Your 
            <span className="text-blue-600"> Competitors</span> Are Doing
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our AI robots analyze your competitors 24/7, then generate beautiful competitor pages 
            and cheat sheets that help you stay ahead. No more manual research or outdated spreadsheets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/onboarding">
              <Button size="lg" className="px-8 py-3">
                Analyze My Competitors <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3" onClick={handleSample}>
              View Sample Report
            </Button>
          </div>

          {/* Robot Workers Illustration */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Research Robot</h3>
              <p className="text-gray-600">Discovers competitors and analyzes their websites, features, and positioning</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Writing Robot</h3>
              <p className="text-gray-600">Generates compelling competitor analysis content with unexpected angles</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Design Robot</h3>
              <p className="text-gray-600">Creates beautiful competitor pages and PDF cheat sheets for your team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Outmaneuver Competitors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From automatic competitor discovery to beautiful reports, our AI handles the heavy lifting 
              so you can focus on winning deals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Smart Competitor Detection</h3>
              <p className="text-gray-600">Just enter your website. Our AI identifies your real competitors, not just the obvious ones.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Unexpected Differentiation Angles</h3>
              <p className="text-gray-600">Discover unique positioning opportunities your competitors haven't thought of yet.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Beautiful Competitor Pages</h3>
              <p className="text-gray-600">Generate professional competitor analysis pages in multiple styles and formats.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Sales Team Cheat Sheets</h3>
              <p className="text-gray-600">Export PDF battle cards that help your sales team handle competitive objections.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Continuous Monitoring</h3>
              <p className="text-gray-600">Get alerts when competitors change pricing, add features, or update positioning.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Brand Integration</h3>
              <p className="text-gray-600">Upload your brand assets to create on-brand competitor analysis materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            From Website to Winning Strategy in Minutes
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Our three-robot system transforms competitor research from weeks of manual work to automated intelligence.
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <p className="text-lg">Enter your website URL and let our Research Robot discover your competitors</p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <p className="text-lg">Writing Robot analyzes features, pricing, and positioning to find your unique angles</p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <p className="text-lg">Design Robot creates beautiful competitor pages and PDF cheat sheets for your team</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Stop Playing Catch-Up?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies using AI to stay ahead of their competition.
          </p>
          <Link to="/onboarding">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Start Your Free Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6" />
                <span className="text-xl font-bold">CompeteAI</span>
              </div>
              <p className="text-gray-400">AI-powered competitive intelligence for modern businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
