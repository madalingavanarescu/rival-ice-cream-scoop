
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '@/services/subscriptionService';
import { SubscriptionPlan, Subscriber } from '@/types/database';
import { toast } from 'sonner';
import { useSession } from '@/hooks/useSession';

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: SubscriptionService.getSubscriptionPlans,
  });
};

export const useUserSubscription = () => {
  const { user } = useSession();
  
  return useQuery({
    queryKey: ['userSubscription', user?.id],
    queryFn: SubscriptionService.getUserSubscription,
    enabled: !!user,
  });
};

export const useCheckSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: SubscriptionService.checkSubscriptionStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
      console.log('Subscription status updated:', data);
    },
    onError: (error) => {
      console.error('Error checking subscription:', error);
      toast.error('Failed to check subscription status');
    },
  });
};

export const useCreateCheckout = () => {
  return useMutation({
    mutationFn: ({ planName, billingCycle }: { planName: string; billingCycle: 'monthly' | 'annual' }) =>
      SubscriptionService.createCheckoutSession(planName, billingCycle),
    onSuccess: (data) => {
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      toast.success('Redirecting to checkout...');
    },
    onError: (error) => {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout session');
    },
  });
};

export const useCustomerPortal = () => {
  return useMutation({
    mutationFn: SubscriptionService.openCustomerPortal,
    onSuccess: (data) => {
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
      toast.success('Opening subscription management...');
    },
    onError: (error) => {
      console.error('Error opening customer portal:', error);
      toast.error('Failed to open subscription management');
    },
  });
};

export const useSubscriptionLimits = () => {
  const { data: subscription } = useUserSubscription();
  const [canCreateAnalysis, setCanCreateAnalysis] = useState(true);
  const [analysesRemaining, setAnalysesRemaining] = useState(0);

  useEffect(() => {
    if (subscription) {
      const maxAnalyses = subscription.max_analyses;
      const usedAnalyses = subscription.analyses_used;
      
      if (maxAnalyses === -1) {
        // Unlimited
        setCanCreateAnalysis(true);
        setAnalysesRemaining(-1);
      } else {
        const remaining = maxAnalyses - usedAnalyses;
        setCanCreateAnalysis(remaining > 0);
        setAnalysesRemaining(remaining);
      }
    } else {
      // Default free tier limits
      setCanCreateAnalysis(true);
      setAnalysesRemaining(5);
    }
  }, [subscription]);

  return {
    canCreateAnalysis,
    analysesRemaining,
    subscription,
    isUnlimited: subscription?.max_analyses === -1,
    subscriptionTier: subscription?.subscription_tier || 'Free',
  };
};
