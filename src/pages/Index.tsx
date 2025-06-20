
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Search, FileText, Download, Check, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">CompeteAI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
            </nav>
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={handleSignIn} className="font-medium">Sign In</Button>
              <Link to="/onboarding">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Trusted by 500+ companies</span>
            </div>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Close every deal.
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Our AI robots analyze your SaaS competitors 24/7, then generate beautiful competitor pages 
            and cheat sheets that help you stay ahead of every opportunity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/onboarding">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-xl rounded-xl">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-medium border-2 hover:bg-gray-50 rounded-xl" onClick={handleSample}>
              View Demo
            </Button>
          </div>

          {/* Hero Screenshot Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-96 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Live Demo Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Robot Workers Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              A snapshot of your entire sales pipeline.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three AI robots work together to give you the complete competitive intelligence you need to win every deal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Research Robot</h3>
              <p className="text-gray-600 leading-relaxed">Discovers SaaS competitors and analyzes their websites, features, and positioning with precision</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Writing Robot</h3>
              <p className="text-gray-600 leading-relaxed">Generates compelling competitor analysis content that ranks well with unexpected angles</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Design Robot</h3>
              <p className="text-gray-600 leading-relaxed">Creates beautiful competitor pages and PDF cheat sheets for your team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Know more about your customers than they do.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From automatic competitor discovery to beautiful reports, our AI handles the heavy lifting 
              so you can focus on winning deals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Smart Competitor Detection</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Just enter your website. Our AI identifies your real competitors, not just the obvious ones.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Unexpected Differentiation Angles</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Discover unique positioning opportunities your competitors haven't thought of yet.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Beautiful Competitor Pages</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Generate professional competitor analysis pages in multiple styles and formats.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Sales Team Cheat Sheets</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Export PDF battle cards that help your sales team handle competitive objections.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Continuous Monitoring</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Get alerts when competitors change pricing, add features, or update positioning.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Brand Integration</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">Upload your brand assets to create on-brand competitor analysis materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Outreach Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Customer outreach has never been easier.
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform competitor research from weeks of manual work to automated intelligence that helps you win every deal.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-64 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Analytics Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 rounded-full p-2 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Real-time competitor insights</h3>
                  <p className="text-gray-300">Monitor pricing changes, feature updates, and market positioning automatically.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-600 rounded-full p-2 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Automated battle cards</h3>
                  <p className="text-gray-300">Generate sales materials that highlight your competitive advantages.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 rounded-full p-2 mt-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Team collaboration</h3>
                  <p className="text-gray-300">Share insights across sales, marketing, and product teams seamlessly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Trusted by professionals</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full mr-4 bg-gradient-to-br from-blue-400 to-blue-600" src="/api/placeholder/48/48" alt="Customer" />
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Chen</h4>
                  <p className="text-sm text-gray-600">VP of Sales, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"CompeteAI helped us close 40% more deals by giving us the competitive intelligence we needed to position ourselves perfectly."</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full mr-4 bg-gradient-to-br from-green-400 to-green-600" src="/api/placeholder/48/48" alt="Customer" />
                <div>
                  <h4 className="font-bold text-gray-900">Mike Rodriguez</h4>
                  <p className="text-sm text-gray-600">CMO, StartupXYZ</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"The automated competitor monitoring saved us 20 hours a week and helped us stay ahead of market changes."</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full mr-4 bg-gradient-to-br from-purple-400 to-purple-600" src="/api/placeholder/48/48" alt="Customer" />
                <div>
                  <h4 className="font-bold text-gray-900">Emily Watson</h4>
                  <p className="text-sm text-gray-600">Head of Product, ScaleUp</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"Finally, a tool that turns competitive research from a chore into a competitive advantage. Game-changer for our team."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to dive in?
          </h2>
          <h3 className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-8">
            Start your free trial today.
          </h3>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join hundreds of companies using AI to stay ahead of their competition and close more deals.
          </p>
          
          <Link to="/onboarding">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg font-semibold shadow-xl rounded-xl mb-8">
              Start Your Free Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">CompeteAI</span>
              </div>
              <p className="text-gray-600 leading-relaxed">AI-powered competitive intelligence for modern businesses.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2024 CompeteAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
