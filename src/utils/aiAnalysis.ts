
/**
 * Utility functions for AI analysis with focus on Indian law
 */

// Hardcoded API keys
const GEMINI_API_KEY = "AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc";
const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY_HERE";

/**
 * Generates analysis using Gemini API
 * @param text The text to analyze
 * @param filename The name of the file being analyzed
 * @returns A promise that resolves to the analysis
 */
export const generateGeminiAnalysis = async (text: string, filename: string): Promise<string> => {
  const systemPrompt = `You are VakilGPT, a legal document analyzer specialized in Indian law with expertise in the Indian Constitution and the new criminal law codes including Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).
  
I'm providing you with text extracted from a PDF document named "${filename}".

Please analyze this legal document and provide:
1. A summary of the document type and purpose
2. Key legal provisions and terms identified under Indian law
3. Potential legal implications in the Indian legal context
4. Constitutional considerations with reference to specific articles
5. If relevant, analysis of how the new criminal laws (BNS/BNSS/BSA) apply compared to the older laws they replaced (IPC/CrPC/Indian Evidence Act)
6. Relevant Supreme Court and High Court judgments
7. Recommendations or areas of concern for Indian practice

Format your response with clear sections and be thorough yet concise in your legal analysis.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I will analyze the legal document as VakilGPT, with specific focus on Indian law, constitutional considerations, and the new criminal laws.' }] },
        { role: 'user', parts: [{ text }] }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4000,
        topK: 40,
        topP: 0.95
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Invalid response format from Gemini API');
  }
};

/**
 * Generates analysis using DeepSeek API
 * @param text The text to analyze
 * @param filename The name of the file being analyzed
 * @returns A promise that resolves to the analysis
 */
export const generateDeepSeekAnalysis = async (text: string, filename: string): Promise<string> => {
  const systemPrompt = `You are VakilGPT, a legal document analyzer specialized in Indian law with expertise in the Indian Constitution and the new criminal law codes including Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA).
  
I'm providing you with text extracted from a PDF document named "${filename}".

Please analyze this legal document and provide:
1. A summary of the document type and purpose
2. Key legal provisions and terms identified under Indian law
3. Potential legal implications in the Indian legal context
4. Constitutional considerations with reference to specific articles
5. If relevant, analysis of how the new criminal laws (BNS/BNSS/BSA) apply compared to the older laws they replaced (IPC/CrPC/Indian Evidence Act)
6. Relevant Supreme Court and High Court judgments
7. Recommendations or areas of concern for Indian practice

Format your response with clear sections and be thorough yet concise in your legal analysis.`;
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.4,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
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
    // In a production environment, this would call an AI API for real analysis
    // For now, simulate an API call with realistic Indian legal context
    
    // Mock data based on common Indian contract issues
    const mockRisks = [
      {
        issue: "Non-compliance with Indian Stamp Act",
        severity: "high" as const,
        description: "Contract may not comply with stamp duty requirements in " + jurisdiction
      },
      {
        issue: "Inadequate Digital Signature Compliance",
        severity: "medium" as const,
        description: "Digital signature provisions do not fully comply with the Information Technology Act, 2000 requirements"
      },
      {
        issue: "Arbitration Clause Issues",
        severity: "medium" as const,
        description: "Arbitration clause may not be enforceable under the Arbitration and Conciliation Act, 1996 as amended"
      }
    ];
    
    // Add contract-type specific risks
    if (contractType === "employment") {
      mockRisks.push({
        issue: "Non-compliance with Labour Laws",
        severity: "high" as const,
        description: "Contract may not comply with state-specific labour regulations in " + jurisdiction
      });
    } else if (contractType === "rental") {
      mockRisks.push({
        issue: "Rent Control Act Issues",
        severity: "high" as const,
        description: "Terms may violate local rent control regulations in " + jurisdiction
      });
    }
    
    const mockSuggestions = [
      "Update stamping provisions to comply with " + jurisdiction + " stamp duty requirements",
      "Revise digital signature clauses to conform with the IT Act, 2000",
      "Ensure arbitration clause specifies seat and venue in India",
      "Add specific reference to relevant Indian statutes"
    ];
    
    const mockIndianLawReferences = [
      {
        section: "Section 10",
        act: "Indian Contract Act, 1872",
        description: "Agreement must have all essential elements to be a valid contract"
      },
      {
        section: "Section 5",
        act: "Information Technology Act, 2000",
        description: "Requirements for valid electronic signatures"
      },
      {
        section: "Section 7",
        act: "Arbitration and Conciliation Act, 1996",
        description: "Requirements for a valid arbitration agreement"
      }
    ];
    
    // Add jurisdiction-specific references
    if (jurisdiction === "delhi") {
      mockIndianLawReferences.push({
        section: "Section 3",
        act: "Delhi Rent Control Act",
        description: "Governs rental agreements in Delhi"
      });
    } else if (jurisdiction === "mumbai") {
      mockIndianLawReferences.push({
        section: "Section 5",
        act: "Maharashtra Rent Control Act",
        description: "Specific provisions for rental agreements in Mumbai"
      });
    }
    
    // Add BNS/BNSS references if relevant
    if (text.toLowerCase().includes("criminal") || text.toLowerCase().includes("offense")) {
      mockIndianLawReferences.push({
        section: "Section 2(d)",
        act: "Bharatiya Nyaya Sanhita, 2023",
        description: "Definition of injury replaces old IPC definition"
      });
      mockIndianLawReferences.push({
        section: "Section 4(d)",
        act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
        description: "New procedural requirements replacing old CrPC provisions"
      });
    }
    
    // Calculate a realistic risk score
    const riskScores = {
      high: 20,
      medium: 10,
      low: 5
    };
    
    const totalRiskScore = mockRisks.reduce((score, risk) => {
      return score - riskScores[risk.severity];
    }, 100);
    
    return {
      risks: mockRisks,
      suggestions: mockSuggestions,
      indianLawReferences: mockIndianLawReferences,
      score: Math.max(0, Math.min(100, totalRiskScore))
    };
    
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
    // In a production environment, this would call an actual API endpoint
    // For now, we'll simulate successful subscription
    
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
