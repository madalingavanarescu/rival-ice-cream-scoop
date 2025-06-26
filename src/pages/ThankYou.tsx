import { CheckCircle, Mail, ArrowLeft, Bot, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ThankYou() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}
    `;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
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
                  <Link 
                    to="/#features" 
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    to="/#how-it-works" 
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How it Works
                  </Link>
                  <div className="pt-3">
                    <Link to="/">
                      <Button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
                      >
                        Join Waitlist
                      </Button>
                    </Link>
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
                                 <img src="/images/logo-contenda.svg" alt="Contenda" className="h-5" />
              </div>
              
              {/* Desktop Navigation */}
              <nav className="flex space-x-6 lg:space-x-8">
                <Link to="/#features" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Features</Link>
                <Link to="/#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">How it Works</Link>
              </nav>
              
              {/* Desktop Actions */}
              <div className="flex items-center">
                <Link to="/">
                  <Button 
                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm px-4 py-2"
                  >
                    Join the Waitlist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Commented Out */}
      {/* <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-neutral-900 mb-6">
            Thanks for Signing Up!
          </h1>
          
          <div className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-700 leading-relaxed space-y-6">
            <p>
              <strong>Make sure to verify your email</strong> to lock your spot in the first 50 and get 
              <strong> two full competitor analysis packages for free</strong> when we launch.
            </p>
            
            <p>
              That means you'll get detailed comparison pages and custom sales cheat sheets for any 
              two competitors you choose — done for you, no work on your end.
            </p>
            
            <div className="flex items-center justify-center gap-3 mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-blue-800">
                Check your email for the confirmation link
              </span>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-neutral-500 mt-6">
              Didn't receive an email? Check your spam folder or{' '}
              <Link to="/" className="text-neutral-700 hover:text-neutral-900 underline">
                try signing up again
              </Link>
            </p>
          </div>
        </div>
      </main> */}

      {/* Survey Section - Centered */}
      <div data-tf-live="01JYKP6KZX7H7F1T57SVQ5C1X3"></div><script src="//embed.typeform.com/next/embed.js"></script>
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto w-full">
          <iframe 
            data-tally-src="https://tally.so/embed/nGaOEQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
            loading="lazy" 
            width="100%" 
            height={2341} 
            frameBorder={0} 
            marginHeight={0} 
            marginWidth={0} 
                            title="Contenda Waiting List"
            className="w-full"
          ></iframe>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
                              © 2024 Contenda. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 