
/**
 * Utility functions for AI analysis
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
 * Fetch the latest updates on Indian laws and precedents
 * @returns A promise that resolves to the updates
 */
export const fetchIndianLegalUpdates = async (): Promise<{
  statutes: Array<{id: number, name: string, date: string, description: string, type: string}>,
  precedents: Array<{id: number, case: string, court: string, date: string, summary: string, impact: string}>
}> => {
  try {
    // In a production environment, this would call an actual API endpoint
    // For now, we'll return mock data that simulates recently updated laws
    
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
    
    return "Successfully subscribed to updates for the selected laws and precedents.";
  } catch (error) {
    console.error("Error subscribing to legal updates:", error);
    throw new Error("Failed to subscribe to legal updates. Please try again later.");
  }
};
