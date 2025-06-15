
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, Subscriber, transformSubscriptionPlan, transformSubscriber } from '@/types/database';

export class SubscriptionService {
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }

    return data.map(transformSubscriptionPlan);
  }

  static async getUserSubscription(): Promise<Subscriber | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No subscription record found, return null
        return null;
      }
      console.error('Error fetching user subscription:', error);
      throw error;
    }

    return transformSubscriber(data);
  }

  static async checkSubscriptionStatus(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }

    return data;
  }

  static async createCheckoutSession(planName: string, billingCycle: 'monthly' | 'annual'): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planName, billingCycle }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }

    return data;
  }

  static async openCustomerPortal(): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('customer-portal');

    if (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }

    return data;
  }

  static async incrementAnalysisUsage(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.rpc('increment_analysis_usage', {
      user_id: user.id
    });

    if (error) {
      console.error('Error incrementing analysis usage:', error);
      throw error;
    }
  }
}
