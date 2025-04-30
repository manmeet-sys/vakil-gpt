
-- Create a function to get client status updates
CREATE OR REPLACE FUNCTION public.get_client_status_updates(
  p_client_id UUID
) 
RETURNS SETOF public.case_status_updates 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.case_status_updates
  WHERE client_id = p_client_id
  ORDER BY created_at DESC;
$$;
