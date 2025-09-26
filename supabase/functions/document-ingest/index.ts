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

// Simple tokenizer function (approximates tiktoken)
function tokenize(text: string): number {
  // Rough approximation: 1 token ≈ 0.75 words
  const words = text.split(/\s+/).length;
  return Math.ceil(words * 0.75);
}

// Text chunking function
function chunkText(text: string, chunkSize = 1200, overlap = 180): string[] {
  const chunks: string[] = [];
  
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize);
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, source_url, text, meta } = await req.json();

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!title || !text) {
      return new Response(JSON.stringify({ error: 'Title and text are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Ingesting document: ${title}`);
    console.log(`Text length: ${text.length} characters`);
    console.log(`Metadata:`, JSON.stringify(meta, null, 2));

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Create document record
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        title,
        source_url,
        jurisdiction: meta?.jurisdiction || null,
        court_level: meta?.court_level || null,
        date: meta?.date || null,
        provisions: meta?.provisions || [],
        posture: meta?.posture || null,
        is_primary: meta?.primary ?? true
      })
      .select()
      .single();

    if (docError) {
      console.error('Error creating document:', docError);
      return new Response(JSON.stringify({ error: 'Failed to create document', details: docError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Created document with ID: ${doc.id}`);

    // 2. Chunk the text
    const chunkSize = 1200;
    const overlap = 180;
    const chunks = chunkText(text, chunkSize, overlap);
    
    console.log(`Text chunked into ${chunks.length} pieces`);

    if (chunks.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid chunks generated from text' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Generate embeddings in batches (OpenAI has limits)
    const batchSize = 100; // Safe batch size for OpenAI embeddings API
    const allEmbeddings: number[][] = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize);
      console.log(`Processing embedding batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);
      
      const embResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: batchChunks
        }),
      });

      const embData = await embResponse.json();
      
      if (!embData.data) {
        console.error('Embedding API error:', embData);
        return new Response(JSON.stringify({ error: 'Failed to generate embeddings', details: embData }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      allEmbeddings.push(...embData.data.map((item: any) => item.embedding));
    }

    console.log(`Generated ${allEmbeddings.length} embeddings`);

    // 4. Prepare chunk records for database insertion
    const chunkRows = chunks.map((content, i) => ({
      doc_id: doc.id,
      content,
      token_count: tokenize(content),
      seq: i,
      provisions: meta?.provisions || [],
      posture: meta?.posture || null,
      holding_direction: meta?.holding_direction || null,
      court_level: meta?.court_level || null,
      date: meta?.date || null,
      is_primary: meta?.primary ?? true,
      embedding: allEmbeddings[i]
    }));

    // 5. Insert chunks in batches (Supabase has limits too)
    const insertBatchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < chunkRows.length; i += insertBatchSize) {
      const batchRows = chunkRows.slice(i, i + insertBatchSize);
      console.log(`Inserting chunk batch ${Math.floor(i/insertBatchSize) + 1}/${Math.ceil(chunkRows.length/insertBatchSize)}`);
      
      const { error: insertError } = await supabase
        .from('chunks')
        .insert(batchRows);

      if (insertError) {
        console.error('Error inserting chunks:', insertError);
        return new Response(JSON.stringify({ 
          error: 'Failed to insert chunks', 
          details: insertError,
          insertedSoFar: insertedCount
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      insertedCount += batchRows.length;
    }

    console.log(`Inserted ${insertedCount} chunks`);

    // 6. Refresh tsvector for full-text search
    console.log('Refreshing full-text search vectors...');
    const { error: refreshError } = await supabase.rpc('refresh_chunk_tsv');
    
    if (refreshError) {
      console.error('Error refreshing tsvector:', refreshError);
      // Don't fail the entire operation for this
    }

    const responseData = {
      success: true,
      document_id: doc.id,
      chunks_created: insertedCount,
      metadata: {
        title,
        source_url,
        total_text_length: text.length,
        chunk_size: chunkSize,
        overlap,
        embeddings_generated: allEmbeddings.length,
        processing_time: new Date().toISOString()
      }
    };

    console.log('Ingestion completed successfully:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in document-ingest function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});