
-- Create a function to add a case status update
CREATE OR REPLACE FUNCTION public.add_case_status_update(
  p_client_id UUID,
  p_case_id UUID,
  p_case_title TEXT,
  p_status TEXT,
  p_message TEXT,
  p_is_read BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_id UUID;
  v_created_at TIMESTAMPTZ;
BEGIN
  INSERT INTO public.case_status_updates (
    client_id,
    case_id,
    case_title,
    status,
    message,
    is_read,
    created_at
  ) VALUES (
    p_client_id,
    p_case_id,
    p_case_title,
    p_status,
    p_message,
    p_is_read,
    now()
  )
  RETURNING id, created_at INTO v_id, v_created_at;
  
  RETURN jsonb_build_object(
    'id', v_id,
    'created_at', v_created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
