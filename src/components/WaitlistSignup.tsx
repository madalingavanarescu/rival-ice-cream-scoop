import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { kitService } from '../services/kitService';

export default function WaitlistSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await kitService.addSubscriberToForm({
        email_address: email.toLowerCase().trim(),
        referrer: `${window.location.origin}?utm_source=waitlist&utm_medium=homepage&utm_campaign=launch`
      });

      console.log('Subscriber added successfully:', result);
      
      // Redirect to thank you page on success
      navigate('/thank-you');
      
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      
      // Handle specific error cases
      if (error instanceof Error && error.message.includes('409')) {
        // If already subscribed, still redirect to thank you page
        navigate('/thank-you');
      } else if (error instanceof Error && error.message.includes('422')) {
        setMessage('Please enter a valid email address');
      } else if (error instanceof Error && error.message.includes('401')) {
        setMessage('Service temporarily unavailable. Please try again later.');
      } else {
        setMessage('Failed to join waitlist. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 text-base"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-12 px-8 bg-neutral-900 hover:bg-neutral-800 text-white whitespace-nowrap"
          >
            {isLoading ? 'Joining...' : 'Join Waitlist'}
          </Button>
        </div>
        
        {message && (
          <p className="text-sm text-center text-red-600">
            {message}
          </p>
        )}
      </form>
      
      <p className="text-xs text-neutral-500 text-center mt-3 mb-4">
        Be the first to know when we launch. No spam, ever.
      </p>

      {/* Trust indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-neutral-500">
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
  );
} 