import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatuteRequest {
  query?: string;
  action: 'search' | 'track' | 'get_updates' | 'analyze';
  statuteName?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, action, statuteName, dateRange }: StatuteRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'search':
        systemPrompt = `You are an expert Indian legal researcher specializing in statutory law. Your task is to find and analyze Indian statutes, acts, and regulations based on user queries.

Guidelines for statute search:
1. Focus on current Indian legislation (Central and State)
2. Include recent amendments and updates
3. Provide accurate statutory references
4. Consider regulatory frameworks and rules
5. Include implementation dates and effective periods
6. Analyze practical implications
7. Consider cross-references between related statutes

Return results in JSON format:
{
  "statutes": [
    {
      "name": "Full statute name",
      "shortName": "Commonly used name",
      "year": "Year of enactment",
      "type": "Act/Rule/Regulation",
      "ministry": "Responsible ministry",
      "lastAmendment": "Date of last amendment",
      "status": "Current status",
      "summary": "Brief description",
      "keyProvisions": ["Important sections"],
      "relevanceScore": 95,
      "implementationDate": "Date",
      "applicability": "Scope of application",
      "relatedStatutes": ["Related acts"],
      "recentChanges": ["Recent amendments"]
    }
  ],
  "searchInsights": {
    "totalStatutesFound": 10,
    "activeStatutes": 8,
    "recentAmendments": 3,
    "keyAreas": ["Tax Law", "Corporate Law"],
    "upcomingChanges": "Planned amendments"
  }
}`;
        userPrompt = `Search for Indian statutes related to: "${query}"
        ${dateRange ? `Date range: ${dateRange.from} to ${dateRange.to}` : ''}
        
        Please provide comprehensive information about relevant Indian statutes and their current status.`;
        break;

      case 'get_updates':
        systemPrompt = `You are an Indian legal update specialist. Provide recent updates, amendments, and changes to Indian legislation.

Return updates in JSON format:
{
  "updates": [
    {
      "statute": "Statute name",
      "updateType": "Amendment/New/Repeal",
      "date": "Update date",
      "title": "Update title",
      "summary": "What changed",
      "impact": "High/Medium/Low",
      "affectedSections": ["Section numbers"],
      "effectiveDate": "When it takes effect",
      "complianceRequirements": ["What businesses need to do"],
      "source": "Official source"
    }
  ],
  "insights": {
    "totalUpdates": 5,
    "criticalUpdates": 2,
    "trends": "Current legislative trends"
  }
}`;
        userPrompt = `Provide recent updates and amendments to Indian legislation${statuteName ? ` for ${statuteName}` : ''}.
        ${dateRange ? `Date range: ${dateRange.from} to ${dateRange.to}` : ' from the last 30 days'}`;
        break;

      case 'analyze':
        systemPrompt = `You are an Indian legal analyst. Analyze the specified statute for practical implications, compliance requirements, and business impact.

Return analysis in JSON format:
{
  "analysis": {
    "statute": "Statute name",
    "overview": "Comprehensive overview",
    "keyProvisions": [
      {
        "section": "Section number",
        "title": "Section title",
        "summary": "What it means",
        "compliance": "Compliance requirements",
        "penalties": "Penalties for non-compliance"
      }
    ],
    "businessImpact": "How it affects businesses",
    "complianceChecklist": ["Action items"],
    "deadlines": ["Important dates"],
    "recommendations": ["Best practices"],
    "relatedGuidance": ["Official circulars/notifications"]
  }
}`;
        userPrompt = `Analyze the Indian statute: "${statuteName || query}" for practical compliance and business implications.`;
        break;

      default:
        throw new Error('Invalid action specified');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content ?? '';

    try {
      const parsed = JSON.parse(aiResponse);

      if (Array.isArray(parsed.statutes)) {
        parsed.statutes = parsed.statutes.map((s: any) => {
          const q = encodeURIComponent(`${s.name || ''} ${s.shortName || ''}`);
          return {
            ...s,
            links: {
              indiaCode: `https://www.indiacode.nic.in/search?text=${q}`,
              eGazette: `https://egazette.nic.in/Search.aspx?SearchBy=${q}`,
              google: `https://www.google.com/search?q=${q}`
            }
          };
        });
      }

      if (Array.isArray(parsed.updates)) {
        parsed.updates = parsed.updates.map((u: any) => ({
          ...u,
          links: {
            sourceSearch: `https://www.google.com/search?q=${encodeURIComponent(u.title || u.statute || '')}`
          }
        }));
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      return new Response(JSON.stringify({
        error: "Failed to parse AI response",
        rawResponse: aiResponse
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in statute-tracker function:', error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});