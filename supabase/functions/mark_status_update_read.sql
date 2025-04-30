
-- Create a function to mark a status update as read
CREATE OR REPLACE FUNCTION public.mark_status_update_read(
  p_update_id UUID
) RETURNS VOID AS $$
BEGIN
  UPDATE public.case_status_updates
  SET is_read = TRUE
  WHERE id = p_update_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
