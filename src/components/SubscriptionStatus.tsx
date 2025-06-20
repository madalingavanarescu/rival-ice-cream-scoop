import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Calendar, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';
import { useUserSubscription, useCustomerPortal, useCheckSubscription } from '@/hooks/useSubscription';
import { useSubscriptionLimits } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

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
      <Card className="border-neutral-200">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
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
    <Card className={cn(
      "border-neutral-200",
      subscription?.subscribed && "bg-green-50 border-green-200"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
              <Crown className="h-4 w-4 text-neutral-700" />
            </div>
            <span className="text-neutral-900">Subscription Status</span>
          </CardTitle>
          <Badge 
            variant="secondary"
            className={cn(
              "text-xs font-medium",
              subscription?.subscribed 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-neutral-100 text-neutral-700 border-neutral-200"
            )}
          >
            {subscriptionTier}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Usage Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-900">Analysis Usage</span>
            <span className="text-sm text-neutral-600">
              {subscription?.analyses_used || 0}
              {isUnlimited ? ' used' : ` / ${subscription?.max_analyses || 5}`}
            </span>
          </div>
          
          {!isUnlimited && (
            <div className="space-y-2">
              <Progress 
                value={usagePercentage} 
                className={cn(
                  "h-2",
                  isNearLimit ? "bg-red-100" : "bg-neutral-100"
                )}
              />
              
              {isNearLimit && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-orange-50 border border-orange-200">
                  <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span className="text-xs text-orange-800">
                    Approaching usage limit
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subscription Details */}
        {subscription?.subscribed && subscriptionEndDate && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white border border-neutral-200">
            <Calendar className="h-4 w-4 text-neutral-600" />
            <span className="text-sm text-neutral-700">
              Renews on {subscriptionEndDate}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshStatus}
            disabled={checkSubscription.isPending}
            className="text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {checkSubscription.isPending ? 'Refreshing...' : 'Refresh Status'}
          </Button>
          
          {subscription?.subscribed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              disabled={customerPortal.isPending}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Subscription
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => window.open('/pricing', '_blank')}
              className="bg-neutral-900 hover:bg-neutral-800"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
