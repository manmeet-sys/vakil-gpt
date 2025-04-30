
-- Create a function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_read(
  p_message_ids UUID[]
) RETURNS VOID AS $$
BEGIN
  UPDATE public.client_messages
  SET is_read = TRUE
  WHERE id = ANY(p_message_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
