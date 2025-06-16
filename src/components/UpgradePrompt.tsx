
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscriptionLimits } from '@/hooks/useSubscription';

interface UpgradePromptProps {
  trigger?: 'limit-reached' | 'feature-locked' | 'usage-warning';
  feature?: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  trigger = 'limit-reached', 
  feature 
}) => {
  const { analysesRemaining, subscriptionTier } = useSubscriptionLimits();

  const getPromptContent = () => {
    switch (trigger) {
      case 'limit-reached':
        return {
          icon: Crown,
          title: 'Analysis Limit Reached',
          description: `You've used all ${analysesRemaining === 0 ? 'available' : 'your'} analyses on the ${subscriptionTier} plan.`,
          action: 'Upgrade to continue analyzing competitors',
          urgent: true
        };
      case 'feature-locked':
        return {
          icon: Zap,
          title: `${feature} is a Premium Feature`,
          description: `Unlock ${feature?.toLowerCase()} and advanced features with a paid plan.`,
          action: 'Upgrade to access this feature',
          urgent: false
        };
      case 'usage-warning':
        return {
          icon: Crown,
          title: 'Running Low on Analyses',
          description: `You have ${analysesRemaining} analyses remaining on your ${subscriptionTier} plan.`,
          action: 'Upgrade for unlimited analyses',
          urgent: false
        };
      default:
        return {
          icon: Crown,
          title: 'Upgrade Your Plan',
          description: 'Get more analyses and premium features.',
          action: 'View pricing plans',
          urgent: false
        };
    }
  };

  const content = getPromptContent();
  const Icon = content.icon;

  return (
    <Card className={`${content.urgent ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${content.urgent ? 'text-orange-600' : 'text-blue-600'}`} />
          {content.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/pricing" className="flex-1">
            <Button className="w-full" size="sm">
              {content.action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          
          {!content.urgent && (
            <Button variant="outline" size="sm" className="flex-1">
              Maybe Later
            </Button>
          )}
        </div>
        
        <div className="text-xs text-gray-600">
          <strong>Pro Plan Benefits:</strong> 50 analyses/month, priority support, advanced exports
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
