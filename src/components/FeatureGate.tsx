
import React from 'react';
import { useSubscriptionLimits } from '@/hooks/useSubscription';
import UpgradePrompt from './UpgradePrompt';

interface FeatureGateProps {
  children: React.ReactNode;
  feature: string;
  requiresTier?: 'Basic' | 'Pro' | 'Enterprise';
  fallback?: React.ReactNode;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  children, 
  feature, 
  requiresTier = 'Basic',
  fallback 
}) => {
  const { subscriptionTier, subscription } = useSubscriptionLimits();

  const tierHierarchy = {
    'Free': 0,
    'Basic': 1,
    'Pro': 2,
    'Enterprise': 3
  };

  const currentTierLevel = tierHierarchy[subscriptionTier as keyof typeof tierHierarchy] || 0;
  const requiredTierLevel = tierHierarchy[requiresTier];

  const hasAccess = currentTierLevel >= requiredTierLevel;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradePrompt 
      trigger="feature-locked" 
      feature={feature}
    />
  );
};

export default FeatureGate;
