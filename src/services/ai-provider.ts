
// Unified service that handles OpenAI API integration
import { toast } from 'sonner';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

/**
 * Get the configured API key
 * @returns OpenAI API key
 */
export const getAIConfig = () => {
  // Use the hardcoded API key
  const primaryApiKey = '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';
  const backupApiKey = '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';
  
  return { primaryApiKey, backupApiKey };
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
    temperature?: number;
  }
): Promise<string> => {
  const { primaryApiKey } = getAIConfig();
  const temperature = options?.temperature || 0.4;
  
  try {
    return await getOpenAIResponse(prompt, primaryApiKey);
  } catch (error) {
    console.error(`Error in OpenAI API request:`, error);
    
    // Try with Supabase edge function
    try {
      const response = await fetch(`https://clyqfnqkicwvpymbqijn.supabase.co/functions/v1/openai-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, model: 'gpt-4o-mini' })
      });
      
      if (!response.ok) {
        throw new Error(`Edge function error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      
      throw new Error('Invalid response format from edge function');
    } catch (edgeFunctionError) {
      console.error('Edge function also failed:', edgeFunctionError);
      
      // Provide a user-friendly error message
      throw new Error('Failed to connect to AI service. Please try again later.');
    }
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
  const { primaryApiKey } = getAIConfig();

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
