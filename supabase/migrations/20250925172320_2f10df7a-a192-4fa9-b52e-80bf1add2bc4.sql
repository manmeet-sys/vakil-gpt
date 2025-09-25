-- Create RPC functions for hybrid search

-- 1) Text search using tsvector (BM25-like)
CREATE OR REPLACE FUNCTION public.search_chunks_ts(q text, match_limit int DEFAULT 50)
RETURNS SETOF public.chunks
LANGUAGE sql STABLE AS $$
  SELECT * FROM public.chunks
  WHERE tsv @@ plainto_tsquery('english', q)
  ORDER BY ts_rank(tsv, plainto_tsquery('english', q)) DESC
  LIMIT match_limit;
$$;

-- 2) Vector search function
CREATE OR REPLACE FUNCTION public.search_chunks_vec(query_vec vector, match_count int DEFAULT 50)
RETURNS TABLE (
  id uuid, 
  doc_id uuid, 
  content text, 
  token_count int,
  seq int,
  provisions text[], 
  posture text, 
  holding_direction text, 
  court_level text, 
  date date, 
  is_primary boolean, 
  embedding vector,
  similarity float
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id, 
    c.doc_id, 
    c.content, 
    c.token_count,
    c.seq,
    c.provisions, 
    c.posture, 
    c.holding_direction, 
    c.court_level, 
    c.date, 
    c.is_primary, 
    c.embedding,
    1 - (c.embedding <=> query_vec) as similarity
  FROM public.chunks c
  WHERE c.embedding IS NOT NULL
  ORDER BY c.embedding <=> query_vec
  LIMIT match_count;
END; $$;

-- Grant access to these functions
GRANT EXECUTE ON FUNCTION public.search_chunks_ts(text, int) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_chunks_vec(vector, int) TO anon, authenticated;