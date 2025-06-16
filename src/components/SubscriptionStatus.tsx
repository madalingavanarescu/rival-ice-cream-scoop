
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useUserSubscription, useCustomerPortal, useCheckSubscription } from '@/hooks/useSubscription';
import { useSubscriptionLimits } from '@/hooks/useSubscription';

const SubscriptionStatus = () => {
  const { data: subscription, isLoading } = useUserSubscription();
  const customerPortal = useCustomerPortal();
  const checkSubscription = useCheckSubscription();
  const { canCreateAnalysis, analysesRemaining, isUnlimited, subscriptionTier } = useSubscriptionLimits();

  const handleRefreshStatus = () => {
    checkSubscription.mutate();
  };

  const handleManageSubscription = () => {
    customerPortal.mutate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subscriptionEndDate = subscription?.subscription_end 
    ? new Date(subscription.subscription_end).toLocaleDateString()
    : null;

  const usagePercentage = subscription?.max_analyses > 0 
    ? (subscription.analyses_used / subscription.max_analyses) * 100 
    : 0;

  const isNearLimit = usagePercentage > 80;

  return (
    <Card className={subscription?.subscribed ? 'border-green-200' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600" />
            Subscription Status
          </CardTitle>
          <Badge 
            variant={subscription?.subscribed ? 'default' : 'secondary'}
            className={subscription?.subscribed ? 'bg-green-100 text-green-800' : ''}
          >
            {subscriptionTier}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Analysis Usage</span>
            <span className="text-sm text-gray-600">
              {subscription?.analyses_used || 0}
              {isUnlimited ? ' used' : ` / ${subscription?.max_analyses || 5}`}
            </span>
          </div>
          
          {!isUnlimited && (
            <Progress 
              value={usagePercentage} 
              className={`h-2 ${isNearLimit ? 'bg-red-100' : 'bg-blue-100'}`}
            />
          )}
          
          {isNearLimit && !isUnlimited && (
            <div className="flex items-center gap-1 text-orange-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Approaching usage limit</span>
            </div>
          )}
        </div>

        {/* Subscription Details */}
        {subscription?.subscribed && subscriptionEndDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Renews on {subscriptionEndDate}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStatus}
            disabled={checkSubscription.isPending}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {checkSubscription.isPending ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          {subscription?.subscribed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={customerPortal.isPending}
            >
              Manage Subscription
            </Button>
          )}
          
          {!subscription?.subscribed && (
            <Button
              size="sm"
              onClick={() => window.open('/pricing', '_blank')}
            >
              Upgrade Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
