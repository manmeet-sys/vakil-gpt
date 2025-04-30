
-- Create a function to get messages between a client and an advocate
CREATE OR REPLACE FUNCTION public.get_client_advocate_messages(
  p_client_id UUID,
  p_advocate_id UUID
) 
RETURNS SETOF public.client_messages 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.client_messages
  WHERE (sender_id = p_client_id AND receiver_id = p_advocate_id)
  OR (sender_id = p_advocate_id AND receiver_id = p_client_id)
  ORDER BY created_at ASC;
$$;
