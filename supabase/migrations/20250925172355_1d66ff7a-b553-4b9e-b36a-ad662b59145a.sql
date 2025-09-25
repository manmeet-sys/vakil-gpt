-- Fix security warnings by setting search_path for functions

-- Update text search function with proper search_path
CREATE OR REPLACE FUNCTION public.search_chunks_ts(q text, match_limit int DEFAULT 50)
RETURNS SETOF public.chunks
LANGUAGE sql STABLE 
SET search_path = public
AS $$
  SELECT * FROM public.chunks
  WHERE tsv @@ plainto_tsquery('english', q)
  ORDER BY ts_rank(tsv, plainto_tsquery('english', q)) DESC
  LIMIT match_limit;
$$;

-- Update vector search function with proper search_path
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
LANGUAGE plpgsql STABLE 
SET search_path = public
AS $$
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

-- Update existing function with proper search_path
CREATE OR REPLACE FUNCTION public.update_chunks_tsv() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.tsv = to_tsvector('english', NEW.content);
  RETURN NEW;
END;
$$;