import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const schema = {
      name: "normalize_legal_query",
      strict: true,
      parameters: {
        type: "object",
        properties: {
          partySeeking: { 
            type: "string", 
            enum: ["husband", "wife", "child", "parent", "other"] 
          },
          relief: { 
            type: "string", 
            enum: ["maintenance", "alimony", "interim maintenance", "permanent alimony", "execution", "other"] 
          },
          forum: { 
            type: "string", 
            enum: ["CrPC_125", "HMA_24", "HMA_25", "SMA_36", "SMA_37", "Other", "Unknown"] 
          },
          casePosture: { type: "string" },
          facts: {
            type: "object",
            properties: {
              disability: { type: "string" },
              disability_percent: { type: "number" },
              permanent: { type: "boolean" },
              income_details: { type: "string" }
            }
          }
        },
        required: ["partySeeking", "relief", "forum", "casePosture"]
      }
    };

    const messages = [
      { 
        role: "system", 
        content: "You are an expert in Indian family law. Extract the party seeking relief, relief type, applicable forum, and case posture from the query. Return ONLY a function call with normalized legal parameters." 
      },
      { role: "user", content: query }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        functions: [schema],
        function_call: { name: "normalize_legal_query" },
        temperature: 0
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.function_call?.arguments) {
      return new Response(JSON.stringify({ error: 'Failed to normalize query' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const args = JSON.parse(data.choices[0].message.function_call.arguments);
    
    // Apply routing rules - correct the forum for husband seeking maintenance
    if (args.partySeeking === "husband" && 
        ["maintenance", "alimony", "interim maintenance", "permanent alimony"].includes(args.relief)) {
      args.forum = args.relief === "interim maintenance" ? "HMA_24" : "HMA_25";
    }

    // Determine must-have facts based on forum
    const must_have = [];
    if (args.forum === "HMA_24" || args.forum === "HMA_25") {
      must_have.push(
        "disability_percent",
        "permanent_or_temporary", 
        "medical_certificate_source",
        "income_both_parties"
      );
    }

    return new Response(JSON.stringify({ 
      norm: args, 
      must_have,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in legal-normalize function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});