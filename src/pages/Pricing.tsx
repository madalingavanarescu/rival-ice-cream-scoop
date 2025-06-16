
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Bot, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserSubscription, useCreateCheckout } from '@/hooks/useSubscription';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';

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
              {user ? (
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Scale your competitive intelligence with plans designed for every business size
          </p>
          
          {subscription?.subscribed && (
            <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-8">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Currently on {subscription.subscription_tier} plan
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''} ${plan.current ? 'ring-2 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-green-500 text-white">Current Plan</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/{plan.billingCycle}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.maxAnalyses === -1 ? 'Unlimited' : plan.maxAnalyses} analyses
                    {plan.price > 0 ? ' per month' : ' total'}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : (plan.popular ? "default" : "outline")}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={plan.current || createCheckout.isPending}
                  >
                    {plan.current ? 'Current Plan' : plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your analysis data remains accessible. You can export it anytime, even after cancellation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
