
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    // Use the hardcoded OpenAI API key
    const openAiApiKey = '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';
    
    // Set up the request to OpenAI API
    const openAiUrl = 'https://api.openai.com/v1/chat/completions';
    
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
    });
    
    // Return error if the OpenAI API request failed
    if (!openAiResponse.ok) {
      const errorData = await openAiResponse.json();
      return new Response(
        JSON.stringify({ error: errorData.error?.message || `OpenAI API error: ${openAiResponse.status}` }),
        { 
          status: openAiResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return the OpenAI API response
    const data = await openAiResponse.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("OpenAI proxy error:", error);
    // Return error response with detailed information
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: typeof error === 'object' ? JSON.stringify(error) : 'No additional details'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
