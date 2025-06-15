
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL, -- price in cents
  price_annual INTEGER NOT NULL, -- price in cents
  stripe_price_id_monthly TEXT,
  stripe_price_id_annual TEXT,
  max_analyses INTEGER, -- -1 for unlimited
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  analyses_used INTEGER NOT NULL DEFAULT 0,
  max_analyses INTEGER NOT NULL DEFAULT 5, -- Default for free tier
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
FOR SELECT USING (true);

-- RLS policies for subscribers
CREATE POLICY "Users can view their own subscription" ON public.subscribers
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON public.subscribers
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription" ON public.subscribers
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_annual, max_analyses, features) VALUES
('Basic', 999, 9990, 10, '["Up to 10 competitor analyses per month", "Basic competitor insights", "Email support"]'::jsonb),
('Pro', 2999, 29990, 50, '["Up to 50 competitor analyses per month", "Advanced competitive insights", "Battle cards generation", "Priority support", "Export to PDF"]'::jsonb),
('Enterprise', 9999, 99990, -1, '["Unlimited competitor analyses", "Advanced competitive insights", "Battle cards generation", "Priority support", "Export to PDF", "Custom branding", "API access", "Dedicated account manager"]'::jsonb);

-- Create function to handle new user signup with subscription setup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscribers (user_id, email, max_analyses)
  VALUES (new.id, new.email, 5); -- Free tier: 5 analyses
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create subscriber record on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Create indexes for better performance
CREATE INDEX idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscription_plans_active ON public.subscription_plans(is_active);
