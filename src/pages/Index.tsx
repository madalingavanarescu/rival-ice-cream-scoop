import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, FileText, Download, Star, Users, Zap, Shield, Globe, CheckCircle, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import WaitlistSignup from '@/components/WaitlistSignup';
import { BounceCards } from '@/components/ui/bounce-cards';

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
      <header className="sticky top-0 z-30 w-full">
        {/* Mobile Header - Full Width */}
        <div className="md:hidden border-b border-neutral-200 bg-white/90 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex h-14 sm:h-16 items-center justify-between">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <img src="/images/logo-contenda.svg" alt="Contenda" className="h-6 sm:h-8" />
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className="p-2 text-neutral-600 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="border-t border-neutral-200 py-4">
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
                  <div className="pt-3">
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        document.getElementById('waitlist-signup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
                    >
                      Join Waitlist
                    </Button>
                  </div>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Header - Floating Island */}
        <div className="hidden md:flex justify-center pt-4 px-4">
          <div className="bg-white/90 backdrop-blur-lg border border-neutral-200/50 rounded-2xl shadow-lg shadow-neutral-900/5 px-6 py-3 max-w-fit">
            <div className="flex items-center justify-between gap-8">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <img src="/images/logo-contenda.svg" alt="Contenda" className="h-6" />
              </div>
              
              {/* Desktop Navigation */}
              <nav className="flex space-x-6 lg:space-x-8">
                <a href="#features" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">How it Works</a>
                {/* <Link to="/pricing" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Pricing</Link> */}
              </nav>
              
              {/* Desktop Actions */}
              <div className="flex items-center">
                <Button 
                  onClick={() => document.getElementById('waitlist-signup')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm px-4 py-2"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-8 sm:px-6 sm:py-12 lg:px-8 md:pt-2 lg:pt-2">
        <div className="relative mx-auto w-full max-w-screen-lg overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-50 px-6 py-6 sm:px-12 sm:py-8 lg:px-20 lg:py-4 text-center">
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
          <div className="absolute -left-1/4 -top-1/2 h-[135%] w-[150%] opacity-5 blur-[130px]">
            <div className="size-full bg-gradient-to-r from-[#090040] via-[#471396] via-[#B13BFF] via-[#FFCC00] to-[#090040]" 
                 style={{maskImage: 'radial-gradient(closest-side,black 100%,transparent 100%)'}} />
          </div>

          <div className="relative">
            <div className="mx-auto flex h-6 sm:h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-3 sm:px-4 text-xs text-neutral-800">
            Competitive Intelligence for SaaS Businesses
            </div>
            
            {/* BounceCards Demo */}
            <div className="w-full flex justify-center items-center">
              <div className="relative flex justify-center items-center -translate-x-8 sm:translate-x-0" style={{ height: '300px', width: '100%' }}>
                <BounceCards
                  images={[
                    "/images/competitors/screenshot-competitor-2.png",
                    "/images/competitors/screenshot-competitor-4.png",
                    "/images/competitors/screenshot-competitor-3.png",
                    "/images/competitors/screenshot-competitor-1.png",
                    "/images/competitors/screenshot-competitor-5.png"
                  ]}
                  containerWidth={500}
                  containerHeight={300}
                  animationDelay={1}
                  animationStagger={0.08}
                  easeType="elastic.out(1, 0.5)"
                  transformStyles={[
                    "translate(-120px, -10px) rotate(5deg)",
                    "translate(-50px, 5px) rotate(0deg)",
                    "translate(0px, 0px) rotate(-5deg)",
                    "translate(50px, 5px) rotate(5deg)",
                    "translate(120px, -10px) rotate(-5deg)"
                  ]}
                  className="absolute inset-0 m-auto"
                />
              </div>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-neutral-900 leading-tight sm:leading-[1.15] mb-4 sm:mb-6">
              Generate in minutes{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#471396] via-[#B13BFF] to-[#090040] bg-clip-text text-transparent font-semibold">
                  Competitor Comparison Pages
                </span>
                <span className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-[#B13BFF]/20 via-[#FFCC00]/20 to-[#B13BFF]/20 rounded-lg -z-10 blur-sm"></span>
              </span>{' '}
              that rank and convert
            </h1>
            
            <p className="mx-auto max-w-2xl lg:max-w-3xl text-sm sm:text-base lg:text-xl text-neutral-700 mb-8 sm:mb-12 px-2 sm:px-0">
             Generate SEO-optimised <b>ready-to-rank competitor pages </b> 
             and <b>sales-ready cheat sheets</b> that help you stay ahead. Our AI robots analyze your competitors 24/7, so you’re always up to date. No more manual research or outdated spreadsheets.
            </p>

            {/* Waitlist Signup */}
            <div id="waitlist-signup" className="mb-8 sm:mb-12 px-4 sm:px-0">
              <WaitlistSignup />
            </div>

            {/* Secondary CTA */}
            {/* <div className="mb-8 sm:mb-12">
              <Button variant="outline" size="lg" className="px-6 sm:px-8 py-3 text-sm sm:text-base" onClick={handleSample}>
                View Sample Report
              </Button>
            </div> */}
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
                description: "Scans websites, review platforms, pricing pages, and videos to find relevant competitor data and positioning. No spreadsheets required.",
                color: "primary"
              },
              {
                icon: FileText,
                title: "Writing Robot", 
                description: "Crafts high-quality comparison content using fresh insights and unique angles that help your brand stand out in search.",
                color: "secondary"
              },
              {
                icon: Download,
                title: "Design Robot",
                description: "Turns your content into clean, well-branded competitor cheat sheets and beautiful PDF battlecards. Ready sharing with the clients.", 
                color: "accent"
              }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col gap-4 sm:gap-6 px-4 py-6 sm:px-6 sm:py-8 bg-white rounded-lg border border-neutral-100 hover:border-neutral-200 transition-colors">
                <div className={cn(
                  "absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 sm:opacity-10 blur-[30px] sm:blur-[50px]",
                  item.color === "primary" && "bg-[#471396]",
                  item.color === "secondary" && "bg-[#B13BFF]", 
                  item.color === "accent" && "bg-[#FFCC00]"
                )} />
                
                <div className="relative h-20 sm:h-32 overflow-hidden flex items-center justify-center">
                  <div className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center",
                    item.color === "primary" && "bg-[#471396]/10 border border-[#471396]/20",
                    item.color === "secondary" && "bg-[#B13BFF]/10 border border-[#B13BFF]/20",
                    item.color === "accent" && "bg-[#FFCC00]/10 border border-[#FFCC00]/20"
                  )}>
                    <item.icon className={cn(
                      "h-6 w-6 sm:h-8 sm:w-8",
                      item.color === "primary" && "text-[#471396]",
                      item.color === "secondary" && "text-[#B13BFF]", 
                      item.color === "accent" && "text-[#FFCC00]"
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
            Everything You Need to Stand Out from Your SaaS Competitors
          </h2>
          <p className="text-pretty text-base sm:text-lg text-neutral-600">
          From smart research to standout design, Contenda gives your marketing and sales team the edge they need to win.
          </p>
        </div>

        <div className="mx-auto max-w-screen-lg grid grid-cols-1 px-4 sm:grid-cols-2">
          <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x">
            {[
              {
                title: "Ready-to-Rank Comparison Pages",
                description: "SEO-focused content for high-intent keywords like “vs” and “alternatives” with FAQs and semantic structure included.",
                icon: Globe
              },
              {
                title: "Sales Team Cheat Sheets",
                description: "Export beautiful PDF battlecards that help reps handle objections in real time with accurate, up-to-date facts.", 
                icon: Shield
              },
              {
                title: "Built for Collaboration",
                description: "Bring your insights into the loop. Add context, adjust voice, and refine focus. Contenda works with you, not instead of you.",
                icon: Search
              },
              {
                title: "Unexpected Differentiation Angles", 
                description: "Discover unique positioning opportunities your competitors haven't thought of yet extracted from real customer reviews.",
                icon: Zap
              }
            ].map((feature, idx) => (
              <div key={idx} className="relative flex flex-col gap-6 sm:gap-10 px-4 py-8 sm:py-14 sm:px-12">
                <div className="absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 sm:opacity-10 blur-[30px] sm:blur-[50px] bg-gradient-to-r from-[#471396] to-[#B13BFF]" />
                
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
              "Enter your competitor’s website and let our Research Robot dig into their product features, pricing, and positioning",
              "The Writing Robot turns that data into compelling, SEO-optimized content with rich comparison tables and FAQs.", 
              "The Design Robot wraps it all into on-brand comparison pages and polished PDF battlecards and cheat sheets for your team"
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
          <div className="absolute -left-1/4 -top-1/2 h-[135%] w-[150%] opacity-5 blur-[130px]">
            <div className="size-full bg-gradient-to-r from-[#090040] via-[#471396] via-[#B13BFF] via-[#FFCC00] to-[#090040]" 
                 style={{maskImage: 'radial-gradient(closest-side,black 100%,transparent 100%)'}} />
          </div>

          {/* Ratings */}
          <div className="relative mx-auto my-6 sm:my-8 flex w-fit gap-4 sm:gap-6 lg:gap-8">
            {[
              { name: "G2", stars: 5 },
              { name: "Product Hunt", stars: 5 },
              { name: "Trustpilot", stars: 5 }
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
             Join marketers, founders, and sales teams already turning competitor research into SEO growth and closed deals.
            </p>
          </div>

          {/* Waitlist Signup in CTA Section */}
          <div className="relative mx-auto max-w-md mb-6 sm:mb-8">
            <WaitlistSignup />
          </div>

          {/* <div className="relative mx-auto flex flex-col sm:flex-row max-w-fit gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 px-6 sm:px-8">
                Start for Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8" onClick={handleSample}>
              View Demo
            </Button>
          </div> */}

          {/* Trusted by companies 
          <div className="relative">
            <p className="text-xs sm:text-sm text-neutral-500 mb-3 sm:mb-4">Trusted by marketing teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
              {["TechCorp", "StartupXYZ", "SaaSCo", "InnovateInc"].map((company, idx) => (
                <div key={idx} className="text-xs sm:text-sm font-medium text-neutral-400">{company}</div>
              ))}
            </div>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <img src="/images/logo-contenda.svg" alt="Contenda" className="h-5 sm:h-6" />
              </div>
              <p className="text-neutral-600 text-xs sm:text-sm max-w-xs">AI-powered competitive intelligence for SaaS businesses.</p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li><a href="#features" className="hover:text-neutral-900 transition-colors">Features</a></li>
                {/* <li><Link to="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</Link></li> */}
                {/* <li><a href="#" className="hover:text-neutral-900 transition-colors">API</a></li> */}
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
            <p className="text-xs sm:text-sm text-neutral-500">© 2025 Contenda. All rights reserved.</p>
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
