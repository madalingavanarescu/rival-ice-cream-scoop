
-- Drop existing policies and recreate them properly
DROP POLICY IF EXISTS "Users can view their own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can create their own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can update their own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can delete their own analyses" ON public.analyses;

DROP POLICY IF EXISTS "Users can view competitors through their analyses" ON public.competitors;
DROP POLICY IF EXISTS "Users can create competitors through their analyses" ON public.competitors;
DROP POLICY IF EXISTS "Users can update competitors through their analyses" ON public.competitors;
DROP POLICY IF EXISTS "Users can delete competitors through their analyses" ON public.competitors;

DROP POLICY IF EXISTS "Users can view analysis content through their analyses" ON public.analysis_content;
DROP POLICY IF EXISTS "Users can create analysis content through their analyses" ON public.analysis_content;

DROP POLICY IF EXISTS "Users can view differentiation angles through their analyses" ON public.differentiation_angles;
DROP POLICY IF EXISTS "Users can create differentiation angles through their analyses" ON public.differentiation_angles;

DROP POLICY IF EXISTS "Users can view monitoring alerts through their competitors" ON public.monitoring_alerts;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Now create the correct policies
CREATE POLICY "Users can view their own analyses" 
  ON public.analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses" 
  ON public.analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" 
  ON public.analyses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" 
  ON public.analyses 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view competitors through their analyses" 
  ON public.competitors 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = competitors.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create competitors through their analyses" 
  ON public.competitors 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = competitors.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can update competitors through their analyses" 
  ON public.competitors 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = competitors.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete competitors through their analyses" 
  ON public.competitors 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = competitors.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can view analysis content through their analyses" 
  ON public.analysis_content 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = analysis_content.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create analysis content through their analyses" 
  ON public.analysis_content 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = analysis_content.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can view differentiation angles through their analyses" 
  ON public.differentiation_angles 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = differentiation_angles.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create differentiation angles through their analyses" 
  ON public.differentiation_angles 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = differentiation_angles.analysis_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can view monitoring alerts through their competitors" 
  ON public.monitoring_alerts 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.competitors 
    JOIN public.analyses ON analyses.id = competitors.analysis_id
    WHERE competitors.id = monitoring_alerts.competitor_id 
    AND analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
