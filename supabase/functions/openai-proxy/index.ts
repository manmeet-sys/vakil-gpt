
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Primary and backup API keys
const primaryOpenAiApiKey = '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';
const backupOpenAiApiKey = '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';

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
    
    // Try with primary API key first
    try {
      const response = await makeOpenAIRequest(prompt, model, primaryOpenAiApiKey);
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (primaryError) {
      console.error("Primary API key failed:", primaryError);
      
      // Try with backup API key if primary fails
      try {
        console.log("Trying backup API key...");
        const response = await makeOpenAIRequest(prompt, model, backupOpenAiApiKey);
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (backupError) {
        console.error("Backup API key also failed:", backupError);
        throw new Error(`Both API keys failed. Last error: ${backupError.message}`);
      }
    }
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

/**
 * Make a request to the OpenAI API
 */
async function makeOpenAIRequest(prompt: string, model: string, apiKey: string) {
  // Set up the request to OpenAI API
  const openAiUrl = 'https://api.openai.com/v1/chat/completions';
  
  // Make the request to OpenAI
  const openAiResponse = await fetch(openAiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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
    throw new Error(errorData.error?.message || `OpenAI API error: ${openAiResponse.status}`);
  }
  
  // Return the OpenAI API response
  return await openAiResponse.json();
}
