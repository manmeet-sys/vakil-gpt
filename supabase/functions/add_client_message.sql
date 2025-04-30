
-- Create a function to add a client message
CREATE OR REPLACE FUNCTION public.add_client_message(
  p_content TEXT,
  p_sender_id UUID,
  p_sender_name TEXT,
  p_receiver_id UUID,
  p_is_read BOOLEAN DEFAULT FALSE
) RETURNS JSONB AS $$
DECLARE
  v_id UUID;
  v_created_at TIMESTAMPTZ;
BEGIN
  INSERT INTO public.client_messages (
    content,
    sender_id,
    sender_name,
    receiver_id,
    is_read,
    created_at
  ) VALUES (
    p_content,
    p_sender_id,
    p_sender_name,
    p_receiver_id,
    p_is_read,
    now()
  )
  RETURNING id, created_at INTO v_id, v_created_at;
  
  RETURN jsonb_build_object(
    'id', v_id,
    'content', p_content,
    'sender_id', p_sender_id,
    'sender_name', p_sender_name,
    'receiver_id', p_receiver_id,
    'is_read', p_is_read,
    'created_at', v_created_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
