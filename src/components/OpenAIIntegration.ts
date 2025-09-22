
/**
 * OpenAI API Integration for VakilGPT
 * This module provides centralized OpenAI API functionality using Supabase Edge Functions
 */

/**
 * Available OpenAI models for the application
 */
export const OPENAI_MODELS = {
  'gpt-4o': 'GPT-4o (Most Capable)',
  'gpt-4o-mini': 'GPT-4o Mini (Fast & Efficient)',
  'gpt-4-turbo': 'GPT-4 Turbo (High Performance)',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo (Fastest)',
} as const;

export type OpenAIModel = keyof typeof OPENAI_MODELS;

/**
 * OpenAI API configuration options
 */
export interface OpenAIConfig {
  model?: OpenAIModel;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * Default configuration for OpenAI requests
 */
const DEFAULT_CONFIG: Required<OpenAIConfig> = {
  model: 'gpt-4o-mini',
  temperature: 0.4,
  maxTokens: 4000,
  stream: false,
};

/**
 * Makes a request to OpenAI API via Supabase Edge Function (centralized API key)
 */
export const getOpenAIResponse = async (
  prompt: string, 
  config: OpenAIConfig = {}
): Promise<string> => {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    
    // Use enhanced legal AI endpoint for better Indian law expertise
    const response = await fetch(`https://clyqfnqkicwvpymbqijn.supabase.co/functions/v1/enhanced-legal-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseXFmbnFraWN3dnB5bWJxaWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDczODAsImV4cCI6MjA1OTM4MzM4MH0.CiGisrTRO87EcpytzoUUAnmpJKAkDyt-qx8oed2yQ5A`
      },
      body: JSON.stringify({ 
        query: prompt,
        legal_area: 'general',
        jurisdiction: 'India',
        analysis_type: 'general'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || `API error: ${response.status}`;
      } catch (e) {
        errorMessage = `API error: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data.content || data.message || '';
  } catch (error) {
    console.error('Error in OpenAI API request:', error);
    throw error;
  }
};

/**
 * Generates enhanced contract with detailed clauses specific to Indian law using OpenAI
 */
export const generateEnhancedIndianContract = async (
  contractType: string,
  parties: {
    partyA: string;
    partyAType: string;
    partyB: string;
    partyBType: string;
  },
  details: {
    jurisdiction: string;
    effectiveDate: string;
    purpose: string;
    keyTerms: string;
  }
): Promise<string> => {
  const { partyA, partyAType, partyB, partyBType } = parties;
  const { jurisdiction, effectiveDate, purpose, keyTerms } = details;
  
  const prompt = `Generate an enhanced legal contract with the following details:
  - Contract Type: ${contractType}
  - Party A: ${partyA} (${partyAType})
  - Party B: ${partyB} (${partyBType})
  - Jurisdiction: ${jurisdiction}
  - Effective Date: ${effectiveDate || new Date().toISOString().split('T')[0]}
  - Purpose: ${purpose || "mutual business collaboration and benefit"}
  - Key Terms: ${keyTerms || "Standard terms apply"}
  
  Please create a comprehensive Indian legal contract following all proper legal terminology, formatting, and requirements specific to Indian law. Include all standard and necessary clauses for this type of contract.`;

  return await getOpenAIResponse(prompt, { model: 'gpt-4o', temperature: 0.2 });
};

/**
 * Analyzes legal documents with focus on Indian law using OpenAI
 */
export const generateOpenAILegalAnalysis = async (
  text: string, 
  filename: string,
  analysisType: string = 'general'
): Promise<string> => {
  const systemPrompt = `You are VakilGPT, a senior legal expert and AI assistant specialized in Indian law with comprehensive expertise in:

CONSTITUTIONAL LAW:
- Indian Constitution (all 470 articles, 12 schedules, 105+ amendments)
- Fundamental Rights (Articles 12-35) and Directive Principles (Articles 36-51)
- Emergency provisions and constitutional jurisprudence
- Recent constitutional amendments and their implications

CRIMINAL LAW EXPERTISE:
- NEW CRIMINAL LAWS (effective from July 1, 2024):
  * Bharatiya Nyaya Sanhita (BNS) 2023 - replacing IPC 1860
  * Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 - replacing CrPC 1973
  * Bharatiya Sakshya Adhiniyam (BSA) 2023 - replacing Evidence Act 1872
- Key changes: community service, organized crime definitions, terrorism provisions
- Enhanced digital evidence framework under BSA
- Victim rights and witness protection under BNSS

CIVIL & COMMERCIAL LAW:
- Indian Contract Act 1872, Sale of Goods Act, Partnership Act
- Companies Act 2013, Insolvency and Bankruptcy Code 2016
- Consumer Protection Act 2019, Competition Act 2002
- Arbitration and Conciliation Act 1996 (2015 amendments)

SPECIALIZED AREAS:
- Intellectual Property: Copyright, Patents, Trademarks, Designs
- Information Technology Act 2000, Digital Personal Data Protection Act 2023
- Real Estate Regulation Act 2016, Transfer of Property Act 1882
- Labor codes (4 new codes replacing 29 labor laws)
- Tax Laws: Income Tax, GST, Customs Act
- Banking Regulation Act, SEBI Act, Insurance laws

DOCUMENT ANALYSIS FRAMEWORK:
Analyzing document: "${filename}"

Provide comprehensive analysis covering:

1. DOCUMENT CLASSIFICATION & PURPOSE
   - Legal document type and jurisdiction
   - Parties involved and their legal status
   - Primary legal purpose and objectives

2. SUBSTANTIVE LEGAL ANALYSIS
   - Key legal provisions identified
   - Statutory compliance requirements
   - Constitutional validity considerations
   - Cross-referencing with relevant acts/rules

3. NEW CRIMINAL LAW IMPLICATIONS (if applicable)
   - BNS provisions vs old IPC sections
   - BNSS procedural changes vs CrPC
   - BSA evidence standards vs Evidence Act
   - Transition implications and compliance requirements

4. RISK ASSESSMENT
   - Legal risks and liability exposure
   - Compliance gaps and regulatory issues
   - Enforceability concerns
   - Jurisdictional challenges

5. PRECEDENT ANALYSIS
   - Relevant Supreme Court judgments
   - High Court decisions
   - Recent judicial trends
   - Binding precedents affecting interpretation

6. PRACTICAL RECOMMENDATIONS
   - Immediate action items
   - Compliance steps required
   - Documentation gaps to address
   - Legal strategy suggestions

7. REGULATORY COMPLIANCE
   - Central government notifications
   - State-specific requirements
   - Filing/registration obligations
   - Timeline and procedural requirements

Format your response with clear headers, bullet points, and specific legal citations. Be precise in legal language while remaining accessible.

Document content for analysis: ${text}`;

  return await getOpenAIResponse(systemPrompt, { 
    model: 'gpt-4o', 
    temperature: 0.2,
    maxTokens: 4500 
  });
};

/**
 * Generates contract analysis specific to Indian legal context using OpenAI
 */
export const generateIndianContractAnalysis = async (
  text: string, 
  contractType: string, 
  jurisdiction: string
): Promise<{
  risks: Array<{issue: string, severity: 'high' | 'medium' | 'low', description: string}>,
  suggestions: string[],
  indianLawReferences: Array<{section: string, act: string, description: string}>,
  score: number
}> => {
  try {
    const prompt = `As an expert in Indian contract law, analyze this ${contractType} contract for the jurisdiction of ${jurisdiction}. 

Contract text: ${text}

Provide a JSON response with the following structure:
{
  "risks": [{"issue": "string", "severity": "high|medium|low", "description": "string"}],
  "suggestions": ["string"],
  "indianLawReferences": [{"section": "string", "act": "string", "description": "string"}],
  "score": number (0-100)
}

Focus on Indian legal compliance, including:
- Indian Contract Act, 1872
- Consumer Protection Act, 2019
- Arbitration and Conciliation Act, 1996
- Information Technology Act, 2000
- Stamp duty requirements
- Registration requirements
- State-specific laws for ${jurisdiction}
- BNS/BNSS/BSA implications if relevant`;

    const response = await getOpenAIResponse(prompt, { 
      model: 'gpt-4o', 
      temperature: 0.2,
      maxTokens: 3000 
    });
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        risks: [{
          issue: "Contract Analysis Error",
          severity: "medium" as const,
          description: "Unable to parse detailed analysis. Please try again."
        }],
        suggestions: ["Review contract manually", "Consult with legal expert"],
        indianLawReferences: [],
        score: 50
      };
    }
  } catch (error) {
    console.error("Error generating Indian contract analysis:", error);
    throw new Error("Failed to analyze contract under Indian law. Please try again later.");
  }
};

/**
 * Fetch the latest updates on Indian laws and precedents using OpenAI
 */
export const fetchIndianLegalUpdates = async (): Promise<{
  statutes: Array<{id: number, name: string, date: string, description: string, type: string}>,
  precedents: Array<{id: number, case: string, court: string, date: string, summary: string, impact: string}>
}> => {
  try {
    // In a production environment, this would call an actual API endpoint
    // For now, we'll return mock data that simulates recently updated Indian laws
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      statutes: [
        {
          id: 1,
          name: "Bharatiya Nyaya Sanhita, 2023",
          date: "2024-03-15",
          description: "Updated sections on cybercrime and mob lynching with new clarifications",
          type: "Amendment"
        },
        {
          id: 2,
          name: "Bharatiya Nagarik Suraksha Sanhita, 2023",
          date: "2024-03-10",
          description: "New guidelines for electronic evidence handling and summons procedures",
          type: "Rules"
        },
        {
          id: 3,
          name: "Digital Personal Data Protection Act, 2023",
          date: "2024-03-05",
          description: "Implementation timeline announced for key provisions",
          type: "Notification"
        },
        {
          id: 4,
          name: "Bharatiya Sakshya Adhiniyam, 2023",
          date: "2024-02-28",
          description: "Clarifications on digital evidence admissibility standards",
          type: "Clarification"
        },
        {
          id: 5,
          name: "Companies Act, 2013",
          date: "2024-02-20",
          description: "New compliance requirements for tech startups and digital businesses",
          type: "Amendment"
        }
      ],
      precedents: [
        {
          id: 1,
          case: "Sharma v. Union of India",
          court: "Supreme Court",
          date: "2024-03-18",
          summary: "Landmark judgment on privacy rights under the Digital Personal Data Protection Act",
          impact: "High impact on data privacy cases and corporate compliance requirements"
        },
        {
          id: 2,
          case: "State of Maharashtra v. Deshmukh",
          court: "Bombay High Court",
          date: "2024-03-12",
          summary: "First major interpretation of BNS provisions on cyberstalking",
          impact: "Sets precedent for applying new criminal code to digital offenses"
        },
        {
          id: 3,
          case: "Tech Solutions Ltd. v. Commissioner of Income Tax",
          court: "Delhi High Court",
          date: "2024-03-05",
          summary: "Ruling on taxation of international SaaS services",
          impact: "Affects taxation of cloud-based service providers in India"
        }
      ]
    };
    
  } catch (error) {
    console.error("Error fetching Indian legal updates:", error);
    throw new Error("Failed to fetch the latest Indian legal updates. Please try again later.");
  }
};

/**
 * Subscribe to automatic updates for specific laws or legal areas
 */
export const subscribeToLegalUpdates = async (
  items: Array<{id: number, name: string}>, 
  email: string
): Promise<string> => {
  try {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store subscription in localStorage for demo purposes
    const existingSubscriptions = JSON.parse(localStorage.getItem('vakilgpt-legal-subscriptions') || '[]');
    
    const newSubscription = {
      email,
      items,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('vakilgpt-legal-subscriptions', JSON.stringify([...existingSubscriptions, newSubscription]));
    
    return "Successfully subscribed to updates for the selected Indian laws and precedents.";
  } catch (error) {
    console.error("Error subscribing to legal updates:", error);
    throw new Error("Failed to subscribe to legal updates. Please try again later.");
  }
};
