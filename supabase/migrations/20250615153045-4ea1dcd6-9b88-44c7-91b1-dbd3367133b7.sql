
-- Create analyses table to store competitor analysis projects
CREATE TABLE public.analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
    template TEXT DEFAULT 'professional' CHECK (template IN ('professional', 'executive', 'battlecard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create competitors table to store competitor information
CREATE TABLE public.competitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    website TEXT NOT NULL,
    description TEXT,
    positioning TEXT,
    pricing_model TEXT,
    pricing_start DECIMAL,
    strengths TEXT[],
    weaknesses TEXT[],
    features JSONB,
    last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create analysis_content table to store generated content
CREATE TABLE public.analysis_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('full_analysis', 'executive_summary', 'battle_card', 'insights')),
    content TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create monitoring_alerts table for competitor tracking
CREATE TABLE public.monitoring_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competitor_id UUID REFERENCES public.competitors(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('pricing_change', 'feature_update', 'content_change', 'new_page')),
    old_value TEXT,
    new_value TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE
);

-- Create differentiation_angles table
CREATE TABLE public.differentiation_angles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    opportunity_level TEXT CHECK (opportunity_level IN ('high', 'medium', 'low')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.differentiation_angles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analyses" ON public.analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON public.analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON public.analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON public.analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Competitors policies
CREATE POLICY "Users can view competitors of their analyses" ON public.competitors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = competitors.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert competitors for their analyses" ON public.competitors
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = competitors.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update competitors of their analyses" ON public.competitors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = competitors.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete competitors of their analyses" ON public.competitors
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = competitors.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Analysis content policies
CREATE POLICY "Users can view content of their analyses" ON public.analysis_content
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = analysis_content.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert content for their analyses" ON public.analysis_content
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = analysis_content.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Monitoring alerts policies
CREATE POLICY "Users can view alerts for their competitors" ON public.monitoring_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.competitors c
            JOIN public.analyses a ON a.id = c.analysis_id
            WHERE c.id = monitoring_alerts.competitor_id 
            AND a.user_id = auth.uid()
        )
    );

-- Differentiation angles policies
CREATE POLICY "Users can view angles of their analyses" ON public.differentiation_angles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = differentiation_angles.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert angles for their analyses" ON public.differentiation_angles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = differentiation_angles.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_competitors_analysis_id ON public.competitors(analysis_id);
CREATE INDEX idx_analysis_content_analysis_id ON public.analysis_content(analysis_id);
CREATE INDEX idx_monitoring_alerts_competitor_id ON public.monitoring_alerts(competitor_id);
CREATE INDEX idx_differentiation_angles_analysis_id ON public.differentiation_angles(analysis_id);

-- Enable realtime for monitoring alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.monitoring_alerts;
