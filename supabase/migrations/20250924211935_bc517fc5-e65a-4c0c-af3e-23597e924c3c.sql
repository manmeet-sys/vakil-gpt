-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table for uploaded/scraped legal documents
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  source_url text,
  jurisdiction text,
  court_level text,
  date date,
  provisions text[] DEFAULT '{}',
  posture text, -- e.g. 'husband_from_wife', 'wife_from_husband'
  is_primary boolean DEFAULT true,
  inserted_at timestamptz DEFAULT now()
);

-- Chunked text with embeddings for vector search
CREATE TABLE public.chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  content text NOT NULL,
  token_count int,
  seq int, -- order in document
  provisions text[] DEFAULT '{}',
  posture text,
  holding_direction text, -- 'supports' | 'contradicts' | 'neutral'
  court_level text,
  date date,
  is_primary boolean,
  embedding vector(1536), -- using text-embedding-ada-002 dimension
  inserted_at timestamptz DEFAULT now()
);

-- Citations captured in AI answers for tracking sources
CREATE TABLE public.citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id text,
  answer_id text,
  doc_id uuid REFERENCES public.documents(id),
  chunk_id uuid REFERENCES public.chunks(id),
  score numeric,
  created_at timestamptz DEFAULT now()
);

-- Evaluation table for testing AI performance
CREATE TABLE public.evals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  input jsonb,
  output jsonb,
  score numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Vector similarity index for chunks
CREATE INDEX ON public.chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Full-text search using tsvector
ALTER TABLE public.chunks ADD COLUMN tsv tsvector;
UPDATE public.chunks SET tsv = to_tsvector('english', content);
CREATE INDEX chunks_tsv_idx ON public.chunks USING gin(tsv);

-- Enable RLS for security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evals ENABLE ROW LEVEL SECURITY;

-- RLS policies for read access
CREATE POLICY "read_all_documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "read_all_chunks" ON public.chunks FOR SELECT USING (true);
CREATE POLICY "read_all_citations" ON public.citations FOR SELECT USING (true);
CREATE POLICY "read_all_evals" ON public.evals FOR SELECT USING (true);

-- Function to automatically update tsvector when content changes
CREATE OR REPLACE FUNCTION update_chunks_tsv() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv = to_tsvector('english', NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tsvector on content changes
CREATE TRIGGER chunks_tsv_update
  BEFORE INSERT OR UPDATE OF content ON public.chunks
  FOR EACH ROW EXECUTE FUNCTION update_chunks_tsv();