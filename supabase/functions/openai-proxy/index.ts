
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Handle preflight OPTIONS request
serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  // Get the API key from request authorization header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized - Missing or invalid authorization header' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Parse request body
    const requestData = await req.json()
    const { prompt, model = 'gpt-4o-mini' } = requestData
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameter: prompt' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Get OpenAI API key from environment variables or use the service account key if not set
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY') || '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'
    
    // Set up the request to OpenAI API
    const openAiUrl = `https://api.openai.com/v1/chat/completions`
    
    // Make the request to OpenAI
    const openAiResponse = await fetch(openAiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 8192,
        top_p: 0.95
      }),
    })
    
    // Return error if the OpenAI API request failed
    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json()
      return new Response(
        JSON.stringify({ error: errorData.error?.message || `OpenAI API error: ${openAiResponse.status}` }),
        { 
          status: openAiResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Return the OpenAI API response
    const data = await openAiResponse.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

