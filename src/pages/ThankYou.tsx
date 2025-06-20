import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      {/* Header */}
      <header className="relative z-10 border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-neutral-900">CompeteAI</span>
            </Link>
            
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Additional Actions */}
          <div className="mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back to Home
                </Button>
              </Link>
              {/* <Link to="/pricing">
                <Button className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800">
                  View Pricing
                </Button>
              </Link> */}
            </div>
            
            <p className="text-sm text-neutral-500 mt-6">
              Didn't receive an email? Check your spam folder or{' '}
              <Link to="/" className="text-neutral-700 hover:text-neutral-900 underline">
                try signing up again
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              © 2024 CompeteAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 