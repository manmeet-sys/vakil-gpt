-- Helper function to refresh tsvector for all chunks
CREATE OR REPLACE FUNCTION public.refresh_chunk_tsv()
RETURNS void
LANGUAGE sql VOLATILE 
SET search_path = public
AS $$
  UPDATE public.chunks SET tsv = to_tsvector('english', content);
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.refresh_chunk_tsv() TO anon, authenticated;