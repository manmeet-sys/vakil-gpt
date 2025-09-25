import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userQuery, norm, targetForum } = await req.json();

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const topBM25 = 50;
    const topVec = 50;
    const topFinal = 12;

    // 1) BM25-style text search using tsvector
    console.log('Performing text search for:', userQuery);
    const { data: bm25Results, error: bm25Error } = await supabase
      .rpc('search_chunks_ts', { q: userQuery, match_limit: topBM25 });

    if (bm25Error) {
      console.error('BM25 search error:', bm25Error);
    }

    const bm25Map = new Map((bm25Results || []).map((r: any) => [r.id, r]));

    // 2) Vector search - first get embedding
    console.log('Getting embedding for:', userQuery);
    const embResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: userQuery
      }),
    });

    const embData = await embResponse.json();
    if (!embData.data?.[0]?.embedding) {
      return new Response(JSON.stringify({ error: 'Failed to get embedding' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const embedding = embData.data[0].embedding;

    console.log('Performing vector search...');
    const { data: vectorResults, error: vectorError } = await supabase
      .rpc('search_chunks_vec', { query_vec: embedding, match_count: topVec });

    if (vectorError) {
      console.error('Vector search error:', vectorError);
    }

    // 3) Merge and deduplicate results
    const merged = new Map<string, any>();
    
    // Add BM25 results
    for (const r of (bm25Results || []).slice(0, topBM25)) {
      merged.set(r.id, { ...r, bm25_rank: true });
    }
    
    // Add vector results with similarity scores
    for (const r of (vectorResults || [])) {
      const existing = merged.get(r.id);
      merged.set(r.id, { 
        ...existing, 
        ...r, 
        vector_rank: true,
        similarity: r.similarity 
      });
    }

    const candidates = Array.from(merged.values());
    console.log(`Found ${candidates.length} candidate chunks`);

    if (candidates.length === 0) {
      return new Response(JSON.stringify({ 
        results: [], 
        message: 'No relevant legal content found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4) Re-rank using GPT-4o-mini for legal relevance
    const prompt = `You are an expert in Indian family law. Rank these legal excerpts for relevance to the user's query.

NORMALIZED QUERY: ${JSON.stringify({ norm, targetForum })}
USER QUERY: ${userQuery}

Score each excerpt 0-5 based on:
- Posture match (same party seeking same relief)
- Provision/forum relevance
- Holding direction (supports/contradicts user's position)
- Court authority level (Supreme Court > High Court > District Court)
- Factual similarity

Return JSON array: [{"id":"chunk_id","score":N}]`;

    const context = candidates.map(c => ({
      id: c.id,
      meta: { 
        provisions: c.provisions, 
        posture: c.posture, 
        holding_direction: c.holding_direction, 
        court_level: c.court_level, 
        date: c.date,
        is_primary: c.is_primary
      },
      excerpt: c.content.slice(0, 500) // Truncate for token efficiency
    }));

    console.log('Re-ranking with OpenAI...');
    const rerankResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
          { role: "system", content: "Return only valid JSON array with scores." },
          { 
            role: "user", 
            content: prompt + "\n\nCANDIDATES:\n" + JSON.stringify(context, null, 2) 
          }
        ]
      }),
    });

    const rerankData = await rerankResponse.json();
    
    let scores: {id: string; score: number}[] = [];
    try {
      const content = rerankData.choices?.[0]?.message?.content || "[]";
      scores = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse rerank scores:', e);
      // Fallback: use vector similarity scores
      scores = candidates.map(c => ({ 
        id: c.id, 
        score: c.similarity ? c.similarity * 5 : 2.5 
      }));
    }

    // 5) Final ranking and filtering
    const ranked = scores
      .map(s => ({ 
        ...candidates.find(c => c.id === s.id), 
        relevance_score: s.score 
      }))
      .filter(Boolean)
      .sort((a: any, b: any) => (b.relevance_score || 0) - (a.relevance_score || 0))
      .slice(0, topFinal);

    console.log(`Returning ${ranked.length} ranked results`);

    return new Response(JSON.stringify({ 
      results: ranked,
      stats: {
        bm25_count: (bm25Results || []).length,
        vector_count: (vectorResults || []).length,
        merged_count: candidates.length,
        final_count: ranked.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in legal-retrieval function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});