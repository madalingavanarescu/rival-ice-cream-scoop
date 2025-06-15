
-- Create website_context table to store AI-analyzed website information
CREATE TABLE public.website_context (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    business_model TEXT NOT NULL,
    industry TEXT NOT NULL,
    target_audience JSONB NOT NULL,
    value_proposition TEXT NOT NULL,
    core_offerings JSONB NOT NULL,
    pricing_strategy JSONB NOT NULL,
    competitive_positioning JSONB NOT NULL,
    website_quality JSONB NOT NULL,
    strategic_context JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.website_context ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for website_context
CREATE POLICY "Users can view website context of their analyses" ON public.website_context
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = website_context.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert website context for their analyses" ON public.website_context
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.analyses 
            WHERE analyses.id = website_context.analysis_id 
            AND analyses.user_id = auth.uid()
        )
    );

-- Create index for better performance
CREATE INDEX idx_website_context_analysis_id ON public.website_context(analysis_id);
