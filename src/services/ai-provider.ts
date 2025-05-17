
// Unified service that handles OpenAI API integration
import { toast } from 'sonner';

/**
 * Get the configured API key
 * @returns OpenAI API key
 */
export const getAIConfig = () => {
  // Use the hardcoded API key
  const apiKey = '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';
  
  return { apiKey };
};

/**
 * Makes a request to OpenAI and returns the response text
 * @param prompt The text prompt to send to the API
 * @param options Optional configuration options
 * @returns A Promise that resolves to the response text
 */
export const getAIResponse = async (
  prompt: string, 
  options?: { 
    apiKey?: string;
    temperature?: number;
  }
): Promise<string> => {
  const { apiKey: configuredKey } = getAIConfig();
  const apiKey = options?.apiKey || configuredKey;
  const temperature = options?.temperature || 0.4;
  
  if (!apiKey) {
    throw new Error('API key is not configured.');
  }

  try {
    return await getOpenAIResponse(prompt, apiKey, temperature);
  } catch (error) {
    console.error(`Error in OpenAI API request:`, error);
    
    // Provide a user-friendly error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while connecting to OpenAI';
    
    throw new Error(`OpenAI API error: ${errorMessage}`);
  }
};

/**
 * Makes a request to the OpenAI API and returns the response text
 * @param prompt The text prompt to send to the API
 * @param apiKey The OpenAI API key
 * @param temperature The temperature setting for response generation
 * @returns A Promise that resolves to the response text
 */
const getOpenAIResponse = async (
  prompt: string, 
  apiKey: string,
  temperature: number = 0.4
): Promise<string> => {
  try {
    // Use direct API call to OpenAI
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
        max_tokens: 8192,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format from OpenAI API');
    }
  } catch (error) {
    console.error('Error in OpenAI API request:', error);
    
    // Try Supabase Edge Function as fallback if direct API fails
    try {
      const response = await fetch(`https://clyqfnqkicwvpymbqijn.supabase.co/functions/v1/openai-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`Edge function error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      }
    } catch (fallbackError) {
      console.error('Fallback OpenAI proxy also failed:', fallbackError);
    }
    
    throw error;
  }
};

/**
 * Generates an enhanced contract with detailed clauses specific to Indian law
 * @param contractType The type of contract to generate
 * @param parties Information about the parties involved
 * @param details Contract details including jurisdiction, purpose, terms
 * @returns A Promise that resolves to the generated contract text
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
  const { apiKey } = getAIConfig();
  
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }

  const { partyA, partyAType, partyB, partyBType } = parties;
  const { jurisdiction, effectiveDate, purpose, keyTerms } = details;
  
  // Create the prompt for contract generation
  const prompt = `Generate an enhanced legal contract with the following details:
  - Contract Type: ${contractType}
  - Party A: ${partyA} (${partyAType})
  - Party B: ${partyB} (${partyBType})
  - Jurisdiction: ${jurisdiction}
  - Effective Date: ${effectiveDate || new Date().toISOString().split('T')[0]}
  - Purpose: ${purpose || "mutual business collaboration and benefit"}
  - Key Terms: ${keyTerms || "Standard terms apply"}
  
  Please create a comprehensive Indian legal contract following all proper legal terminology, formatting, and requirements specific to Indian law. Include all standard and necessary clauses for this type of contract.`;

  // Use the OpenAI API to generate the contract
  return await getAIResponse(prompt);
};
