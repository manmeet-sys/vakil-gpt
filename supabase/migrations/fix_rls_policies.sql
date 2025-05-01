
-- Create RLS policies for MA Due Diligence
ALTER TABLE IF EXISTS public.ma_due_diligence ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to prevent duplicates)
DROP POLICY IF EXISTS "Allow users to access own due diligence" ON public.ma_due_diligence;
DROP POLICY IF EXISTS "Allow users to insert own due diligence" ON public.ma_due_diligence;
DROP POLICY IF EXISTS "Allow users to update own due diligence" ON public.ma_due_diligence;
DROP POLICY IF EXISTS "Allow users to delete own due diligence" ON public.ma_due_diligence;

-- Create policies for ma_due_diligence
CREATE POLICY "Allow users to access own due diligence"
  ON public.ma_due_diligence
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert own due diligence"
  ON public.ma_due_diligence
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own due diligence"
  ON public.ma_due_diligence
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own due diligence"
  ON public.ma_due_diligence
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for MA Risks
ALTER TABLE IF EXISTS public.ma_risks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow users to access own ma_risks" ON public.ma_risks;
DROP POLICY IF EXISTS "Allow users to insert own ma_risks" ON public.ma_risks;
DROP POLICY IF EXISTS "Allow users to update own ma_risks" ON public.ma_risks;
DROP POLICY IF EXISTS "Allow users to delete own ma_risks" ON public.ma_risks;

-- Create function to check if due diligence belongs to user
CREATE OR REPLACE FUNCTION public.check_ma_due_diligence_belongs_to_user(diligence_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.ma_due_diligence
    WHERE id = diligence_id_param AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for ma_risks
CREATE POLICY "Allow users to access own ma_risks"
  ON public.ma_risks
  FOR SELECT
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to insert own ma_risks"
  ON public.ma_risks
  FOR INSERT
  WITH CHECK (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to update own ma_risks"
  ON public.ma_risks
  FOR UPDATE
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to delete own ma_risks"
  ON public.ma_risks
  FOR DELETE
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

-- Create RLS policies for MA Recommendations
ALTER TABLE IF EXISTS public.ma_recommendations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow users to access own ma_recommendations" ON public.ma_recommendations;
DROP POLICY IF EXISTS "Allow users to insert own ma_recommendations" ON public.ma_recommendations;
DROP POLICY IF EXISTS "Allow users to update own ma_recommendations" ON public.ma_recommendations;
DROP POLICY IF EXISTS "Allow users to delete own ma_recommendations" ON public.ma_recommendations;

-- Create policies for ma_recommendations
CREATE POLICY "Allow users to access own ma_recommendations"
  ON public.ma_recommendations
  FOR SELECT
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to insert own ma_recommendations"
  ON public.ma_recommendations
  FOR INSERT
  WITH CHECK (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to update own ma_recommendations"
  ON public.ma_recommendations
  FOR UPDATE
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to delete own ma_recommendations"
  ON public.ma_recommendations
  FOR DELETE
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

-- Create RLS policies for MA Applicable Laws
ALTER TABLE IF EXISTS public.ma_applicable_laws ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow users to access own ma_applicable_laws" ON public.ma_applicable_laws;
DROP POLICY IF EXISTS "Allow users to insert own ma_applicable_laws" ON public.ma_applicable_laws;
DROP POLICY IF EXISTS "Allow users to update own ma_applicable_laws" ON public.ma_applicable_laws;
DROP POLICY IF EXISTS "Allow users to delete own ma_applicable_laws" ON public.ma_applicable_laws;

-- Create policies for ma_applicable_laws
CREATE POLICY "Allow users to access own ma_applicable_laws"
  ON public.ma_applicable_laws
  FOR SELECT
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to insert own ma_applicable_laws"
  ON public.ma_applicable_laws
  FOR INSERT
  WITH CHECK (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to update own ma_applicable_laws"
  ON public.ma_applicable_laws
  FOR UPDATE
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

CREATE POLICY "Allow users to delete own ma_applicable_laws"
  ON public.ma_applicable_laws
  FOR DELETE
  USING (public.check_ma_due_diligence_belongs_to_user(diligence_id));

-- Fix User Reviews table RLS policies
ALTER TABLE IF EXISTS public.user_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to read all reviews" ON public.user_reviews;
DROP POLICY IF EXISTS "Allow users to insert own reviews" ON public.user_reviews;
DROP POLICY IF EXISTS "Allow users to update own reviews" ON public.user_reviews;
DROP POLICY IF EXISTS "Allow users to delete own reviews" ON public.user_reviews;

-- Create policies for user_reviews
CREATE POLICY "Allow users to read all reviews"
  ON public.user_reviews
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow users to insert own reviews"
  ON public.user_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update own reviews"
  ON public.user_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own reviews"
  ON public.user_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix Analytics Events table RLS policies
ALTER TABLE IF EXISTS public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to insert own analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow users to read own analytics events" ON public.analytics_events;

-- Create policies for analytics_events
CREATE POLICY "Allow users to insert own analytics events"
  ON public.analytics_events
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    (user_id IS NULL) OR 
    (auth.uid() = user_id)
  );

CREATE POLICY "Allow users to read own analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated, anon
  USING (
    (user_id IS NULL) OR 
    (auth.uid() = user_id)
  );
