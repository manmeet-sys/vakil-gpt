
-- Create a function to get client documents
CREATE OR REPLACE FUNCTION public.get_client_documents(
  p_client_id UUID
) 
RETURNS SETOF public.client_documents 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.client_documents
  WHERE client_id = p_client_id
  ORDER BY created_at DESC;
$$;
