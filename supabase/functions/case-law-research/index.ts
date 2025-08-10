import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CaseSearchRequest {
  query: string;
  jurisdiction?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  caseType?: string;
  court?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, jurisdiction = "India", dateRange, caseType, court }: CaseSearchRequest = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Enhanced prompt for better case law research
    const systemPrompt = `You are an expert Indian legal research assistant with deep knowledge of Indian case law, statutes, and legal precedents. Your task is to find and analyze relevant case law based on user queries.

Guidelines for case law research:
1. Focus on Indian jurisdiction (Supreme Court, High Courts, and lower courts)
2. Provide accurate case citations in standard format
3. Include relevant legal principles and precedents
4. Consider the hierarchy of courts and binding precedents
5. Analyze the legal reasoning and ratio decidendi
6. Include dissenting opinions when relevant
7. Consider the current legal status of the case

Return results in the following JSON format:
{
  "cases": [
    {
      "title": "Case Title",
      "citation": "Standard citation format",
      "court": "Court name",
      "year": "Year",
      "judges": ["Judge names"],
      "summary": "Brief summary of the case",
      "legalPrinciples": ["Key legal principles"],
      "relevanceScore": 95,
      "facts": "Brief facts of the case",
      "ratio": "Ratio decidendi",
      "currentStatus": "Current legal status",
      "relatedCases": ["Related case citations"],
      "keywords": ["Relevant keywords"]
    }
  ],
  "searchInsights": {
    "totalCasesFound": 10,
    "relevantPrecedents": 5,
    "keyLegalAreas": ["Constitutional Law", "Contract Law"],
    "suggestedFilters": ["Supreme Court", "High Court"],
    "legalTrends": "Analysis of legal trends"
  }
}`;

    const userPrompt = `Search for Indian case law related to: "${query}"
    ${jurisdiction ? `Jurisdiction: ${jurisdiction}` : ''}
    ${dateRange ? `Date range: ${dateRange.from} to ${dateRange.to}` : ''}
    ${caseType ? `Case type: ${caseType}` : ''}
    ${court ? `Preferred court: ${court}` : ''}
    
    Please provide relevant Indian cases with detailed analysis and legal insights.`;

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
      const cases = Array.isArray(parsed.cases) ? parsed.cases : [];

      const enhanceCase = (c: any) => {
        const citation = (c.citation || '').toString();
        const citationVerified = /(\(\d{4}\)\s*\d+\s*SCC)|\bAIR\s*\d{4}\b|SCC\s*OnLine/i.test(citation);
        const court = (c.court || '').toString();
        const precedenceRank = /supreme/i.test(court) ? 3 : /high\s*court/i.test(court) ? 2 : 1;
        const title = (c.title || '').toString();
        const yr = parseInt(c.year || '0', 10) || 0;
        const searchQ = encodeURIComponent(`${title} ${citation}`);
        return {
          ...c,
          verification: {
            citationVerified,
            bindingLevel: precedenceRank === 3 ? 'Supreme Court' : precedenceRank === 2 ? 'High Court' : 'Lower Court',
            suggestedSources: {
              indianKanoon: `https://indiankanoon.org/search/?formInput=${searchQ}`,
              googleScholar: `https://scholar.google.com/scholar?q=${searchQ}`
            }
          },
          sortKey: { precedenceRank, relevance: Number(c.relevanceScore || 0), year: yr }
        };
      };

      const enhancedCases = cases
        .map(enhanceCase)
        .sort((a: any, b: any) => (b.sortKey.precedenceRank - a.sortKey.precedenceRank) || (b.sortKey.relevance - a.sortKey.relevance) || (b.sortKey.year - a.sortKey.year))
        .map(({ sortKey, ...rest }: any) => rest);

      const result = { ...parsed, cases: enhancedCases };
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return new Response(JSON.stringify({
        cases: [],
        searchInsights: {
          totalCasesFound: 0,
          error: "Failed to parse AI response",
          rawResponse: aiResponse
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in case-law-research function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      cases: [],
      searchInsights: {
        totalCasesFound: 0,
        error: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});