
-- Create a function to add a client document
CREATE OR REPLACE FUNCTION public.add_client_document(
  p_name TEXT,
  p_size BIGINT,
  p_type TEXT,
  p_path TEXT,
  p_client_id UUID,
  p_notes TEXT DEFAULT NULL,
  p_case_id UUID DEFAULT NULL,
  p_status TEXT DEFAULT 'pending_review',
  p_uploaded_by UUID DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
  v_created_at TIMESTAMP WITH TIME ZONE;
BEGIN
  INSERT INTO public.client_documents (
    name, 
    size, 
    type, 
    path, 
    client_id, 
    notes, 
    case_id, 
    status, 
    uploaded_by
  )
  VALUES (
    p_name,
    p_size,
    p_type,
    p_path,
    p_client_id,
    p_notes,
    p_case_id,
    p_status,
    p_uploaded_by
  )
  RETURNING id, created_at INTO v_id, v_created_at;
  
  RETURN jsonb_build_object(
    'id', v_id,
    'created_at', v_created_at
  );
END;
$$;
