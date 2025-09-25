import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    issue: {
      type: "object",
      properties: {
        partySeeking: { type: "string" },
        partyResponding: { type: "string" },
        relief: { type: "string" },
        forum: { type: "string" },
        provisions: { type: "array", items: { type: "string" } }
      },
      required: ["partySeeking", "relief", "forum"]
    },
    answer: {
      type: "object",
      properties: { 
        short: { type: "string" }, 
        long: { type: "string" } 
      },
      required: ["short"]
    },
    authorities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          court: { type: "string" }, 
          year: { type: "number" }, 
          title: { type: "string" },
          pinpoint: { type: "string" }, 
          holding: { type: "string" },
          why_relevant: { type: "string" }, 
          primary: { type: "boolean" }
        },
        required: ["title", "holding", "primary"]
      }
    },
    applicability_grid: {
      type: "array", 
      items: { 
        type: "object",
        properties: { 
          proposition: { type: "string" }, 
          supports_user: { type: "boolean" }, 
          because: { type: "string" } 
        },
        required: ["proposition", "supports_user"] 
      }
    },
    missing_facts: { type: "array", items: { type: "string" } },
    next_steps: { type: "array", items: { type: "string" } },
    confidence: { type: "number", minimum: 0, maximum: 1 }
  },
  required: ["issue", "answer", "authorities"]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userQuery, norm, targetForum, context } = await req.json();

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Guardrail: Check for forum mismatch (husband under CrPC 125)
    if (norm.partySeeking === "husband" && 
        ["maintenance", "alimony", "interim maintenance", "permanent alimony"].includes(norm.relief) && 
        norm.forum === "CrPC_125") {
      return new Response(JSON.stringify({
        error: "Forum mismatch",
        message: "Husband claiming maintenance should proceed under HMA s.24 (interim) or s.25 (permanent), not CrPC 125.",
        suggestion: { 
          forum: norm.relief === "interim maintenance" ? "HMA_24" : "HMA_25" 
        }
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = `You are an expert Indian family law attorney with deep knowledge of matrimonial disputes, maintenance laws, and court precedents.

CRITICAL INSTRUCTIONS:
1. Return STRICT JSON conforming to the provided schema
2. Use PRIMARY legal sources first - court judgments over secondary summaries  
3. Only use the CONTEXT provided - do not hallucinate cases or laws
4. If primary authorities contradict user's position, be honest in applicability_grid
5. Provide specific section references (e.g., "Section 24 of Hindu Marriage Act")
6. Include confidence score based on strength of legal precedents

LEGAL EXPERTISE AREAS:
- Hindu Marriage Act 1955 (Sections 24, 25)
- Code of Criminal Procedure 1973 (Section 125) 
- Special Marriage Act 1954
- Supreme Court and High Court precedents
- Maintenance and alimony jurisprudence`;

    const userPrompt = `QUERY: ${userQuery}

NORMALIZED PARAMETERS:
${JSON.stringify({ norm, targetForum }, null, 2)}

LEGAL CONTEXT FROM DATABASE:
${JSON.stringify(context, null, 2)}

Analyze this maintenance/alimony query and provide a comprehensive legal response following the schema exactly.`;

    console.log('Generating legal answer with GPT-4...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.1,
        max_tokens: 3000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      }),
    });

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      return new Response(JSON.stringify({ error: 'No response from OpenAI' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let parsedAnswer: any;
    try {
      parsedAnswer = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.log('Raw response:', data.choices[0].message.content);
      
      return new Response(JSON.stringify({ 
        error: "Failed to parse legal analysis",
        raw_response: data.choices[0].message.content
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate minimum required fields
    if (!parsedAnswer?.authorities?.length) {
      return new Response(JSON.stringify({ 
        error: "No legal authorities found",
        raw_response: data.choices[0].message.content 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if we have primary sources
    const hasPrimary = parsedAnswer.authorities.some((a: any) => a.primary);
    if (!hasPrimary) {
      parsedAnswer.next_steps = [
        ...(parsedAnswer.next_steps || []), 
        "Locate and review primary court judgments for stronger legal foundation."
      ];
      parsedAnswer.confidence = Math.min(parsedAnswer.confidence || 0.5, 0.6);
    }

    // Add metadata about the analysis
    const responseData = {
      answer: parsedAnswer,
      metadata: {
        context_used: context?.length || 0,
        has_primary_sources: hasPrimary,
        forum_validated: true,
        generated_at: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in legal-answer function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});