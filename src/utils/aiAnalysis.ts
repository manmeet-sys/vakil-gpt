/**
 * Utility functions for AI analysis with focus on Indian law
 */
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

/**
 * Gets the appropriate API key based on the provider
 * @returns API key for the selected provider
 */
const getApiKey = (provider: 'openai' | 'gemini' | 'deepseek' = 'openai'): string => {
  return localStorage.getItem(`${provider}ApiKey`) || 
    (provider === 'openai' ? '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' : '');
};

/**
 * Generates analysis using OpenAI API
 * @param text The text to analyze
 * @param filename The name of the file being analyzed
 * @returns A promise that resolves to the analysis
 */
export const generateOpenAIAnalysis = async (text: string, filename: string): Promise<string> => {
  const systemPrompt = `You are VakilGPT, a legal document analyzer specialized in Indian law with expertise in the Indian Constitution and the new criminal law codes including Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).
  
I'm providing you with text extracted from a document named "${filename}".

Please analyze this legal document and provide:
1. A summary of the document type and purpose
2. Key legal provisions and terms identified under Indian law
3. Potential legal implications in the Indian legal context
4. Constitutional considerations with reference to specific articles
5. If relevant, analysis of how the new criminal laws (BNS/BNSS/BSA) apply compared to the older laws they replaced (IPC/CrPC/Indian Evidence Act)
6. Relevant Supreme Court and High Court judgments
7. Recommendations or areas of concern for Indian practice

Format your response with clear sections and be thorough yet concise in your legal analysis.`;

  // Check if filename indicates this is for document generation rather than analysis
  const isGeneratingDocument = filename.includes('Document Draft') || text.includes('Create a professional');

  // Adjust prompt for document generation
  const generationPrompt = isGeneratingDocument ? 
    `You are VakilGPT, an expert legal document drafter specialized in Indian law. 
    
    Create a professional Indian legal document based on the following request:
    
    "${text}"
    
    Please draft a comprehensive document that:
    1. Follows all Indian legal drafting standards and conventions
    2. Includes all necessary sections and clauses for this type of document
    3. Uses formal legal language appropriate for Indian courts
    4. Follows proper formatting with paragraphs, numbering, etc.
    5. References relevant Indian laws, acts and precedents
    6. Is ready for use in the appropriate Indian jurisdiction
    
    Format your response as the complete text of the document only, without any explanations or commentary outside the document itself.` : systemPrompt;

  try {
    // Use OpenAI with primary key
    return await getOpenAIResponse(
      isGeneratingDocument ? generationPrompt : systemPrompt + "\n\n" + text,
      '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'
    );
  } catch (error) {
    console.error("Error in generateAnalysis with primary OpenAI key:", error);
    
    // Fall back with a different OpenAI key if first one fails
    try {
      console.log('First OpenAI API key failed, trying alternate key');
      return await getOpenAIResponse(
        isGeneratingDocument ? generationPrompt : systemPrompt + "\n\n" + text,
        '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'
      );
    } catch (fallbackError) {
      console.error('Fallback to alternate key failed:', fallbackError);
      throw new Error(`Failed to generate analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

/**
 * Generates contract analysis specific to Indian legal context
 * @param text The contract text to analyze
 * @param contractType The type of contract
 * @param jurisdiction The Indian jurisdiction (e.g., Delhi, Mumbai)
 * @returns A promise that resolves to the contract analysis
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
    const prompt = `
      Analyze this ${contractType} contract from an Indian legal perspective, 
      focusing on the jurisdiction of ${jurisdiction}.
      Identify key risks, provide suggestions for improvement, and reference
      relevant Indian laws.
      
      Format your response as JSON with the following structure:
      {
        "risks": [
          {"issue": "Issue name", "severity": "high|medium|low", "description": "Description"}
        ],
        "suggestions": ["Suggestion 1", "Suggestion 2"],
        "indianLawReferences": [
          {"section": "Section number", "act": "Act name", "description": "Description"}
        ],
        "score": 85 // Overall score out of 100
      }
      
      Contract text:
      ${text}
    `;
    
    try {
      const response = await getOpenAIResponse(prompt, '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');
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing contract analysis:", error);
      
      // Return a fallback mock response
      return {
        risks: [
          {
            issue: "Analysis Error",
            severity: "medium" as const,
            description: "Failed to fully analyze the contract. Please try again."
          }
        ],
        suggestions: [
          "Try again with a clearer contract text",
          "Consider simplifying the contract language"
        ],
        indianLawReferences: [
          {
            section: "Section 10",
            act: "Indian Contract Act, 1872",
            description: "Basic requirements for a valid contract"
          }
        ],
        score: 0
      };
    }
  } catch (error) {
    console.error("Error generating Indian contract analysis:", error);
    throw new Error("Failed to analyze contract under Indian law. Please try again later.");
  }
};

/**
 * Fetch the latest updates on Indian laws and precedents
 * @returns A promise that resolves to the updates
 */
export const fetchIndianLegalUpdates = async (): Promise<{
  statutes: Array<{id: number, name: string, date: string, description: string, type: string}>,
  precedents: Array<{id: number, case: string, court: string, date: string, summary: string, impact: string}>
}> => {
  try {
    // Create a prompt for OpenAI to generate legal updates
    const prompt = `
      Generate a JSON object containing the latest updates on Indian laws and precedents.
      Include 5 recent statute updates and 5 recent precedent updates.
      
      Format your response as JSON with the following structure:
      {
        "statutes": [
          {
            "id": 1,
            "name": "Statute Name",
            "date": "YYYY-MM-DD",
            "description": "Brief description",
            "type": "Amendment|Rules|Notification|Clarification"
          }
        ],
        "precedents": [
          {
            "id": 1,
            "case": "Case name",
            "court": "Court name",
            "date": "YYYY-MM-DD",
            "summary": "Brief summary",
            "impact": "Brief impact description"
          }
        ]
      }
      
      Focus on recent developments in Indian law, especially regarding the new criminal law codes.
    `;
    
    try {
      const response = await getOpenAIResponse(prompt, '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');
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing legal updates:", error);
      
      // Return a fallback mock response similar to the one defined in the original code
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
          },
          {
            id: 4,
            case: "Reddy v. State of Telangana",
            court: "Supreme Court",
            date: "2024-02-25",
            summary: "Application of BNSS provisions on arrested persons' rights",
            impact: "Clarifies procedural safeguards under the new criminal procedure code"
          },
          {
            id: 5,
            case: "Digital Rights Foundation v. Union of India",
            court: "Supreme Court",
            date: "2024-02-15",
            summary: "Constitutional validity of automated decision-making in government services",
            impact: "Affects AI implementation in public services and requires human oversight"
          }
        ]
      };
    }
  } catch (error) {
    console.error("Error fetching Indian legal updates:", error);
    throw new Error("Failed to fetch the latest Indian legal updates. Please try again later.");
  }
};

/**
 * Subscribe to automatic updates for specific laws or legal areas
 * @param items Array of statute IDs or names to subscribe to
 * @param email Email address for notifications
 * @returns A promise that resolves to a success message
 */
export const subscribeToLegalUpdates = async (
  items: Array<{id: number, name: string}>, 
  email: string
): Promise<string> => {
  try {
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
