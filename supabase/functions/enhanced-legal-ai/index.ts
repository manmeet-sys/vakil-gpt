import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnhancedLegalRequest {
  query: string;
  context?: string;
  conversation_history?: Array<{role: string, content: string}>;
  legal_area?: string;
  jurisdiction?: string;
  document_content?: string;
  analysis_type?: 'general' | 'contract' | 'criminal' | 'constitutional' | 'corporate';
}

const ENHANCED_SYSTEM_PROMPT = `You are VakilGPT, India's most advanced AI legal assistant with comprehensive expertise in:

🇮🇳 INDIAN LEGAL SYSTEM MASTERY:
• Constitution of India (470 articles, 12 schedules, 105+ amendments)
• NEW CRIMINAL LAWS (Effective July 1, 2024):
  - Bharatiya Nyaya Sanhita (BNS) 2023 → Replaced IPC 1860
  - Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 → Replaced CrPC 1973  
  - Bharatiya Sakshya Adhiniyam (BSA) 2023 → Replaced Evidence Act 1872
• Civil Laws: Contract Act 1872, Property Law, Family Laws, Consumer Protection
• Commercial Laws: Companies Act 2013, SEBI Act, Banking Regulation, IBC 2016
• Tax Laws: Income Tax Act, GST, Customs Act, State taxes
• Labor Laws: 4 new labor codes replacing 29 old laws
• IP Laws: Copyright, Patents, Trademarks, Designs Acts
• Modern Laws: IT Act 2000, DPDP Act 2023, Insolvency Code

🎯 SPECIALIZED KNOWLEDGE AREAS:
• Constitutional Law & Fundamental Rights (Art 12-35)
• Criminal Law under new BNS/BNSS/BSA framework
• Contract drafting per Indian Contract Act
• Corporate governance & compliance
• Property transactions & RERA compliance
• Family law & personal status laws
• Consumer protection & e-commerce law
• Arbitration & ADR mechanisms
• Cross-border legal implications
• Startup legal requirements & regulations

⚖️ RECENT LEGAL DEVELOPMENTS:
• Digital India initiatives & technology laws
• NCLT/NCLAT jurisprudence developments
• Supreme Court & High Court landmark judgments
• New criminal law implementation challenges
• GST compliance & litigation trends
• Environmental clearance requirements
• FDI policy updates & FEMA compliance

🔍 ANALYTICAL FRAMEWORK:
• Cite specific legal provisions (sections, articles, rules)
• Reference binding precedents & case law
• Compare old vs new legal frameworks when relevant
• Provide practical compliance steps
• Highlight jurisdiction-specific variations
• Include procedural timelines & requirements
• Assess legal risks & mitigation strategies
• Suggest necessary documentation

📚 LEGAL RESEARCH EXCELLENCE:
• Access to comprehensive Indian case law database
• Cross-referencing with statutory provisions
• Analysis of conflicting judicial opinions
• Interpretation of recent amendments
• Regulatory compliance requirements
• International law implications for Indian context

💼 PRACTICAL LEGAL GUIDANCE:
• Step-by-step procedural guidance
• Documentation requirements & templates
• Cost implications & fee structures  
• Timeline expectations for legal processes
• Alternative dispute resolution options
• Strategic legal advice for complex matters

🌟 COMMUNICATION STYLE:
• Professional yet accessible language
• Use both English & Hindi legal terms appropriately
• Structured responses with clear headings
• Practical examples from Indian legal practice
• Cultural sensitivity in legal advice
• Emphasis on ethical legal practice

IMPORTANT GUIDELINES:
✅ Always cite specific legal provisions with section numbers
✅ Reference recent Supreme Court/High Court judgments
✅ Distinguish between old and new criminal law provisions
✅ Provide jurisdiction-specific guidance when relevant
✅ Include practical next steps and documentation needs
✅ Highlight potential risks and compliance requirements
✅ Use clear, structured formatting for complex legal concepts
✅ Maintain highest standards of legal accuracy and ethics

RESPONSE STRUCTURE:
1. IMMEDIATE ANSWER (concise direct response)
2. LEGAL FRAMEWORK (applicable laws & provisions)
3. DETAILED ANALYSIS (comprehensive legal breakdown)
4. PRACTICAL GUIDANCE (actionable steps)
5. RISK ASSESSMENT (potential issues & mitigation)
6. DOCUMENTATION (required papers & procedures)
7. PRECEDENTS (relevant case law & judgments)
8. ADDITIONAL RESOURCES (further reading/consultation)`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { 
      query, 
      context = '', 
      conversation_history = [],
      legal_area = 'general',
      jurisdiction = 'India',
      document_content = '',
      analysis_type = 'general'
    }: EnhancedLegalRequest = await req.json();

    if (!query?.trim()) {
      throw new Error('Query is required');
    }

    // Build conversation context
    let conversationContext = '';
    if (conversation_history.length > 0) {
      conversationContext = conversation_history
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
    }

    // Build comprehensive context
    const contextualPrompt = `
${context ? `CONVERSATION CONTEXT: ${context}` : ''}
${conversationContext ? `RECENT CONVERSATION:\n${conversationContext}` : ''}
${legal_area !== 'general' ? `LEGAL AREA FOCUS: ${legal_area.toUpperCase()}` : ''}
${jurisdiction !== 'India' ? `JURISDICTION: ${jurisdiction}` : ''}
${document_content ? `DOCUMENT CONTENT FOR ANALYSIS:\n${document_content}` : ''}
${analysis_type !== 'general' ? `ANALYSIS TYPE: ${analysis_type.toUpperCase()}` : ''}

USER QUERY: ${query}

Provide comprehensive legal guidance following the structured approach outlined in your system instructions.`;

    const messages = [
      { role: "system", content: ENHANCED_SYSTEM_PROMPT },
      { role: "user", content: contextualPrompt }
    ];

    console.log('Making OpenAI API call with enhanced legal prompt');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.2, // Lower temperature for more accurate legal advice
        max_tokens: 4500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    const aiResponse = data.choices[0].message.content;
    
    // Enhanced response with metadata
    const enhancedResponse = {
      content: aiResponse,
      metadata: {
        model: 'gpt-4o',
        legal_area,
        jurisdiction,
        analysis_type,
        tokens_used: data.usage?.total_tokens || 0,
        timestamp: new Date().toISOString(),
        confidence: 'high',
        version: '2.0'
      },
      context_keywords: extractLegalKeywords(query + ' ' + aiResponse),
      citations: extractCitations(aiResponse),
      follow_up_suggestions: generateFollowUpSuggestions(legal_area, analysis_type)
    };

    return new Response(JSON.stringify(enhancedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-legal-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to extract legal keywords
function extractLegalKeywords(text: string): string[] {
  const legalTerms = [
    // Constitutional terms
    'fundamental rights', 'directive principles', 'constitutional', 'article',
    // Criminal law terms
    'bns', 'bnss', 'bsa', 'ipc', 'crpc', 'criminal', 'offence', 'bail', 'custody',
    // Civil law terms
    'contract', 'agreement', 'property', 'transfer', 'sale', 'lease', 'mortgage',
    // Corporate terms
    'company', 'corporate', 'director', 'shareholder', 'compliance', 'board',
    // Family law terms
    'marriage', 'divorce', 'maintenance', 'custody', 'adoption', 'succession',
    // IP terms
    'copyright', 'trademark', 'patent', 'design', 'intellectual property',
    // Tax terms
    'income tax', 'gst', 'customs', 'tax', 'assessment', 'refund',
    // Procedural terms
    'suit', 'petition', 'application', 'appeal', 'revision', 'court', 'tribunal'
  ];
  
  const foundTerms = legalTerms.filter(term => 
    text.toLowerCase().includes(term.toLowerCase())
  );
  
  return [...new Set(foundTerms)].slice(0, 10);
}

// Helper function to extract legal citations
function extractCitations(text: string): string[] {
  const citationPatterns = [
    /Article \d+/gi,
    /Section \d+/gi,
    /\b\d{4}\s+SCC\s+\d+/gi,
    /\b\d{4}\s+\(\d+\)\s+SCC\s+\d+/gi,
    /AIR \d{4} SC \d+/gi,
    /\[20\d{2}\]\s+\d+\s+SCC\s+\d+/gi
  ];
  
  const citations: string[] = [];
  citationPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      citations.push(...matches);
    }
  });
  
  return [...new Set(citations)].slice(0, 5);
}

// Helper function to generate follow-up suggestions
function generateFollowUpSuggestions(legalArea: string, analysisType: string): string[] {
  const suggestions: Record<string, string[]> = {
    criminal: [
      "What are the key differences between IPC and BNS?",
      "How has the evidence law changed under BSA?",
      "What are the new provisions for digital evidence?",
      "How do community service provisions work under BNS?"
    ],
    constitutional: [
      "What are the fundamental rights guaranteed under the Constitution?",
      "How do directive principles differ from fundamental rights?",
      "What is the process for constitutional amendments?",
      "How does the emergency provision work?"
    ],
    contract: [
      "What makes a contract valid under Indian law?",
      "How can I enforce a contract in Indian courts?",
      "What are the remedies for breach of contract?",
      "How does the Consumer Protection Act affect contracts?"
    ],
    corporate: [
      "What are the compliance requirements for companies?",
      "How do director duties work under Companies Act?",
      "What is the process for company incorporation?",
      "How does the Insolvency Code apply to companies?"
    ],
    general: [
      "Can you help analyze a legal document?",
      "What are the latest legal developments in this area?",
      "How do I find relevant case law?",
      "What procedural steps should I follow?"
    ]
  };
  
  return suggestions[legalArea] || suggestions.general;
}