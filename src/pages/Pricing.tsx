import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Bot, Zap, Crown, ArrowLeft, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserSubscription, useCreateCheckout } from '@/hooks/useSubscription';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Pricing = () => {
  const { user } = useSession();
  const { data: subscription } = useUserSubscription();
  const createCheckout = useCreateCheckout();

  const plans = [
    {
      name: 'Free',
      icon: Bot,
      price: 0,
      billingCycle: 'Forever',
      maxAnalyses: 5,
      features: [
        '5 competitor analyses',
        'Basic insights',
        'Standard templates',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false,
      current: !subscription?.subscribed && subscription?.subscription_tier === null
    },
    {
      name: 'Basic',
      icon: Zap,
      price: 9.99,
      billingCycle: 'month',
      maxAnalyses: 10,
      features: [
        '10 competitor analyses/month',
        'Advanced AI insights',
        'All templates',
        'Priority email support',
        'Export to PDF'
      ],
      cta: 'Start Free Trial',
      popular: true,
      current: subscription?.subscription_tier === 'Basic'
    },
    {
      name: 'Pro',
      icon: Crown,
      price: 29.99,
      billingCycle: 'month',
      maxAnalyses: 50,
      features: [
        '50 competitor analyses/month',
        'Premium AI insights',
        'Custom templates',
        'Live chat support',
        'Advanced exports',
        'API access',
        'Team collaboration'
      ],
      cta: 'Upgrade to Pro',
      popular: false,
      current: subscription?.subscription_tier === 'Pro'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 99.99,
      billingCycle: 'month',
      maxAnalyses: -1,
      features: [
        'Unlimited competitor analyses',
        'Custom AI models',
        'White-label solution',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'Advanced analytics'
      ],
      cta: 'Contact Sales',
      popular: false,
      current: subscription?.subscription_tier === 'Enterprise'
    }
  ];

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    if (planName === 'Free') {
      toast.info('You\'re already on the free plan!');
      return;
    }

    if (planName === 'Enterprise') {
      toast.info('Please contact our sales team for Enterprise pricing');
      return;
    }

    try {
      await createCheckout.mutateAsync({
        planName,
        billingCycle: 'monthly'
      });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

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
            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-neutral-700 hover:text-neutral-900">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button className="bg-neutral-900 hover:bg-neutral-800">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="mx-auto flex h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-4 text-xs text-neutral-800 mb-4">
            Simple, transparent pricing
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-neutral-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-600 mb-8">
            Scale your competitive intelligence with plans designed for every business size
          </p>
          
          {subscription?.subscribed && (
            <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-8">
              <Check className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 font-medium text-sm">
                Currently on {subscription.subscription_tier} plan
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={cn(
                  "relative border border-neutral-200 shadow-sm hover:shadow-md transition-shadow",
                  plan.popular && "border-neutral-900 shadow-lg",
                  plan.current && "ring-2 ring-green-500"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-neutral-900 text-white border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-600 text-white border-0">
                      Current Plan
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-900" />
                  </div>
                  <CardTitle className="text-xl font-medium text-neutral-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl sm:text-4xl font-medium text-neutral-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-neutral-600 text-sm">/{plan.billingCycle}</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mt-2">
                    {plan.maxAnalyses === -1 ? 'Unlimited' : plan.maxAnalyses} analyses
                    {plan.price > 0 ? ' per month' : ' total'}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.name)}
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-neutral-900 hover:bg-neutral-800 text-white"
                        : "border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-neutral-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              Everything you need to know about CompeteAI pricing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change plans at any time?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data remains accessible for 30 days after cancellation. You can export your analyses and reports during this period."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 14-day money-back guarantee for all paid plans. Contact support if you're not satisfied."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-neutral-200 pb-6">
                <h3 className="text-base font-medium text-neutral-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-neutral-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-50 px-6 sm:px-12 py-12 sm:py-16 text-center">
            {/* Grid pattern */}
            <div className="absolute inset-[unset] left-1/2 top-0 w-[800px] sm:w-[1200px] -translate-x-1/2 text-neutral-200">
              <svg width="100%" height="300" viewBox="0 0 1200 300" className="opacity-30 sm:opacity-50">
                <defs>
                  <pattern id="pricing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#pricing-grid)" />
              </svg>
            </div>

            <div className="relative">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-neutral-900 mb-4">
                Ready to outmaneuver your competition?
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Join hundreds of companies using AI to stay ahead of their competition.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/onboarding">
                  <Button size="lg" className="bg-neutral-900 hover:bg-neutral-800 px-8">
                    Start Free Trial
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
