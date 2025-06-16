
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionService } from '@/services/subscriptionService';
import { useSubscriptionLimits } from '@/hooks/useSubscription';
import { toast } from 'sonner';

export const useUsageTracking = () => {
  const queryClient = useQueryClient();
  const { canCreateAnalysis, analysesRemaining } = useSubscriptionLimits();

  const incrementUsage = useMutation({
    mutationFn: SubscriptionService.incrementAnalysisUsage,
    onSuccess: () => {
      // Refresh subscription data
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
    onError: (error) => {
      console.error('Error tracking usage:', error);
      toast.error('Failed to track usage');
    },
  });

  const checkUsageLimit = () => {
    if (!canCreateAnalysis) {
      toast.error('Analysis limit reached', {
        description: 'Please upgrade your plan to continue analyzing competitors.'
      });
      return false;
    }

    // Warn when approaching limit
    if (analysesRemaining <= 2 && analysesRemaining > 0) {
      toast.warning(`Only ${analysesRemaining} analyses remaining`, {
        description: 'Consider upgrading for unlimited analyses.'
      });
    }

    return true;
  };

  return {
    incrementUsage,
    checkUsageLimit,
    canCreateAnalysis,
    analysesRemaining
  };
};
