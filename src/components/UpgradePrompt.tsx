import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSubscriptionLimits } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

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
    <Card className={cn(
      "border-2",
      content.urgent 
        ? "border-orange-200 bg-orange-50" 
        : "border-neutral-200 bg-neutral-50"
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-base font-medium">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            content.urgent ? "bg-orange-100" : "bg-neutral-100"
          )}>
            <Icon className={cn(
              "h-4 w-4",
              content.urgent ? "text-orange-600" : "text-neutral-700"
            )} />
          </div>
          <span className="text-neutral-900">{content.title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-5">
        <p className="text-sm text-neutral-700 leading-relaxed">
          {content.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/pricing" className="flex-1">
            <Button 
              className="w-full bg-neutral-900 hover:bg-neutral-800" 
              size="sm"
            >
              {content.action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          
          {!content.urgent && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Maybe Later
            </Button>
          )}
        </div>
        
        <div className="rounded-lg bg-white border border-neutral-200 p-3">
          <p className="text-xs font-medium text-neutral-900 mb-1">
            Pro Plan Benefits
          </p>
          <p className="text-xs text-neutral-600">
            50 analyses/month • Priority support • Advanced exports • API access
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradePrompt;
