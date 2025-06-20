import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Search, FileText, Download, Star, Users, Zap, Shield, Globe, CheckCircle, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-900" />
              <span className="text-lg sm:text-2xl font-semibold text-neutral-900">CompeteAI</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              <a href="#features" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">How it Works</a>
              <Link to="/pricing" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Pricing</Link>
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Button variant="ghost" onClick={handleSignIn} className="text-neutral-700 hover:text-neutral-900">
                Sign In
              </Button>
              <Link to="/onboarding">
                <Button className="bg-neutral-900 hover:bg-neutral-800">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="#features" 
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
                </a>
                <Link 
                  to="/pricing" 
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="flex flex-col space-y-3 pt-2">
                  <Button variant="ghost" onClick={handleSignIn} className="justify-start text-neutral-700 hover:text-neutral-900">
                    Sign In
                  </Button>
                  <Link to="/onboarding">
                    <Button className="w-full bg-neutral-900 hover:bg-neutral-800">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative mx-auto w-full max-w-screen-lg overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-50 p-6 sm:p-12 lg:p-20 text-center">
          {/* Grid pattern */}
          <div className="absolute inset-[unset] left-1/2 top-0 w-[800px] sm:w-[1200px] -translate-x-1/2 text-neutral-300">
            <svg width="100%" height="400" viewBox="0 0 1200 400" className="opacity-30 sm:opacity-50">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" className="sm:w-20 sm:h-20">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="sm:d-[M 80 0 L 0 0 0 80]"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Gradient background */}
          <div className="absolute -inset-x-4 sm:-inset-x-10 bottom-0 h-[60%] opacity-30 sm:opacity-40 blur-[60px] sm:blur-[100px]">
            <div 
              className="size-full -scale-y-100"
              style={{
                background: `radial-gradient(77% 116% at 37% 67%, #EEA5BA, rgba(238, 165, 186, 0) 50%),
                  radial-gradient(56% 84% at 34% 56%, #3A8BFD, rgba(58, 139, 253, 0) 50%),
                  radial-gradient(85% 127% at 100% 100%, #E4C795, rgba(228, 199, 149, 0) 50%),
                  radial-gradient(82% 122% at 3% 29%, #855AFC, rgba(133, 90, 252, 0) 50%),
                  radial-gradient(90% 136% at 52% 100%, #FD3A4E, rgba(253, 58, 78, 0) 50%),
                  radial-gradient(102% 143% at 92% 7%, #72FE7D, rgba(114, 254, 125, 0) 50%)`
              }}
            />
          </div>

          <div className="relative">
            <div className="mx-auto flex h-6 sm:h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-3 sm:px-4 text-xs text-neutral-800 mb-4 sm:mb-6">
              AI-Powered Competitive Intelligence
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-neutral-900 leading-tight sm:leading-[1.15] mb-4 sm:mb-6">
              Stop Guessing What Your{' '}
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                SaaS Competitors
              </span>{' '}
              Are Doing
            </h1>
            
            <p className="mx-auto max-w-2xl lg:max-w-3xl text-sm sm:text-base lg:text-xl text-neutral-700 mb-6 sm:mb-8 px-2 sm:px-0">
              Our AI robots analyze your SaaS competitors 24/7, then generate beautiful competitor pages 
              and cheat sheets that help you stay ahead. No more manual research or outdated spreadsheets.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
              <Link to="/onboarding" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 px-6 sm:px-8 py-3 text-sm sm:text-base">
                  Analyze My Competitors
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base" onClick={handleSample}>
                View Sample Report
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-neutral-500 mb-6 sm:mb-8">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Robot Workers Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Search,
                title: "Research Robot",
                description: "Discovers SaaS competitors and analyzes their websites, features, and positioning",
                color: "blue"
              },
              {
                icon: FileText,
                title: "Writing Robot", 
                description: "Generates compelling competitor analysis content that ranks well with unexpected angles",
                color: "green"
              },
              {
                icon: Download,
                title: "Design Robot",
                description: "Creates beautiful competitor pages and PDF cheat sheets for your team", 
                color: "purple"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col gap-4 sm:gap-6 px-4 py-6 sm:px-6 sm:py-8 bg-white rounded-lg border border-neutral-100 hover:border-neutral-200 transition-colors">
                <div className={cn(
                  "absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 sm:opacity-10 blur-[30px] sm:blur-[50px]",
                  item.color === "blue" && "bg-blue-500",
                  item.color === "green" && "bg-green-500", 
                  item.color === "purple" && "bg-purple-500"
                )} />
                
                <div className="relative h-20 sm:h-32 overflow-hidden flex items-center justify-center">
                  <div className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center",
                    item.color === "blue" && "bg-blue-100",
                    item.color === "green" && "bg-green-100",
                    item.color === "purple" && "bg-purple-100"
                  )}>
                    <item.icon className={cn(
                      "h-6 w-6 sm:h-8 sm:w-8",
                      item.color === "blue" && "text-blue-600",
                      item.color === "green" && "text-green-600", 
                      item.color === "purple" && "text-purple-600"
                    )} />
                  </div>
                </div>
                
                <div className="relative flex flex-col text-center">
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-neutral-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-xl px-4 text-center mb-10 sm:mb-14">
          <div className="mx-auto flex h-6 sm:h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-3 sm:px-4 text-xs text-neutral-800 mb-3 sm:mb-4">
            Powerful Features
          </div>
          <h2 className="font-display text-balance text-2xl sm:text-3xl font-medium text-neutral-900 mb-3 sm:mb-4">
            Everything You Need to Outmaneuver SaaS Competitors
          </h2>
          <p className="text-pretty text-base sm:text-lg text-neutral-600">
            From automatic competitor discovery to beautiful reports, our AI handles the heavy lifting 
            so you can focus on winning deals.
          </p>
        </div>

        <div className="mx-auto max-w-screen-lg grid grid-cols-1 px-4 sm:grid-cols-2">
          <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x">
            {[
              {
                title: "Smart Competitor Detection",
                description: "Just enter your website. Our AI identifies your real competitors, not just the obvious ones.",
                icon: Search
              },
              {
                title: "Unexpected Differentiation Angles", 
                description: "Discover unique positioning opportunities your competitors haven't thought of yet.",
                icon: Zap
              },
              {
                title: "Beautiful Competitor Pages",
                description: "Generate professional competitor analysis pages in multiple styles and formats.",
                icon: Globe
              },
              {
                title: "Sales Team Cheat Sheets",
                description: "Export PDF battle cards that help your sales team handle competitive objections.", 
                icon: Shield
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative flex flex-col gap-6 sm:gap-10 px-4 py-8 sm:py-14 sm:px-12">
                <div className="absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 sm:opacity-10 blur-[30px] sm:blur-[50px] bg-gradient-to-r from-orange-400 to-red-500" />
                
                <div className="relative h-16 sm:h-24 overflow-hidden flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-neutral-200 bg-white flex items-center justify-center">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-700" />
                  </div>
                </div>
                
                <div className="relative flex flex-col text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-medium text-neutral-900">{feature.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-neutral-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto flex h-6 sm:h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-3 sm:px-4 text-xs text-neutral-800 mb-3 sm:mb-4">
            How It Works
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-neutral-900 mb-3 sm:mb-4">
            From Website to Winning Strategy in Minutes
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto">
            Our three-robot system transforms competitor research from weeks of manual work to automated intelligence.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              "Enter your website URL and let our Research Robot discover your competitors",
              "Writing Robot analyzes features, pricing, and positioning to find your unique angles", 
              "Design Robot creates beautiful competitor pages and PDF cheat sheets for your team"
            ].map((step, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 sm:p-6 text-left">
                <div className="bg-neutral-900 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-medium text-xs sm:text-sm mb-3 sm:mb-4">
                  {idx + 1}
                </div>
                <p className="text-sm sm:text-base text-neutral-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative mx-auto w-full max-w-screen-lg overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-50 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-16 pt-8 sm:pt-10 text-center">
          {/* Grid pattern */}
          <div className="absolute inset-[unset] left-1/2 top-0 w-[800px] sm:w-[1200px] -translate-x-1/2 text-neutral-200">
            <svg width="100%" height="300" viewBox="0 0 1200 300" className="opacity-30 sm:opacity-50">
              <defs>
                <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse" className="sm:w-20 sm:h-20">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="sm:d-[M 80 0 L 0 0 0 80]"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          
          {/* Gradient background */}
          <div className="absolute -left-1/4 -top-1/2 h-[135%] w-[150%] opacity-3 sm:opacity-5 blur-[80px] sm:blur-[130px]">
            <div className="size-full bg-gradient-to-r from-purple-500 via-red-500 via-yellow-500 via-green-500 to-purple-500" 
                 style={{maskImage: 'radial-gradient(closest-side,black 100%,transparent 100%)'}} />
          </div>

          {/* Ratings */}
          <div className="relative mx-auto my-6 sm:my-8 flex w-fit gap-4 sm:gap-6 lg:gap-8">
            {[
              { name: "G2", stars: 5 },
              { name: "Product Hunt", stars: 5 },
              { name: "Trustpilot", stars: 4.5 }
            ].map(({ name, stars }, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-neutral-800 rounded flex items-center justify-center mb-2">
                  <span className="text-white text-xs font-bold">{name[0]}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(Math.floor(stars))].map((_, i) => (
                    <Star key={i} fill="currentColor" strokeWidth={0} className="size-2 sm:size-3 text-amber-500" />
                  ))}
                  {stars % 1 > 0 && (
                    <Star fill="currentColor" strokeWidth={0} className="size-2 sm:size-3 text-amber-500 opacity-50" />
                  )}
                </div>
                <p className="text-xs text-neutral-500">{stars} out of 5</p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto flex w-full max-w-lg lg:max-w-xl flex-col items-center">
            <h2 className="font-display text-balance text-3xl sm:text-4xl lg:text-5xl font-medium text-neutral-900 leading-tight sm:leading-[1.15] mb-4 sm:mb-5">
              Ready to Stop Playing Catch-Up?
            </h2>
            <p className="text-balance text-sm sm:text-base lg:text-xl text-neutral-600 mb-6 sm:mb-10">
              Join hundreds of companies using AI to stay ahead of their competition.
            </p>
          </div>

          <div className="relative mx-auto flex flex-col sm:flex-row max-w-fit gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 px-6 sm:px-8">
                Start for Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8" onClick={handleSample}>
              View Demo
            </Button>
          </div>

          {/* Trusted by companies */}
          <div className="relative">
            <p className="text-xs sm:text-sm text-neutral-500 mb-3 sm:mb-4">Trusted by marketing teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
              {["TechCorp", "StartupXYZ", "SaaSCo", "InnovateInc"].map((company, idx) => (
                <div key={idx} className="text-xs sm:text-sm font-medium text-neutral-400">{company}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-900" />
                <span className="text-lg sm:text-xl font-semibold text-neutral-900">CompeteAI</span>
              </div>
              <p className="text-neutral-600 text-xs sm:text-sm max-w-xs">AI-powered competitive intelligence for modern businesses.</p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li><a href="#features" className="hover:text-neutral-900 transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li><a href="#" className="hover:text-neutral-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm text-neutral-500">© 2024 CompeteAI. All rights reserved.</p>
            <div className="flex space-x-4 sm:space-x-6 mt-3 sm:mt-0">
              <a href="#" className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Privacy</a>
              <a href="#" className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
