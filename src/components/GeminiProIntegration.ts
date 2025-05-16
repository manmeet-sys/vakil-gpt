
// This file exports the API functions from GeminiProIntegration component
// to be used directly by other components
import { getOpenAIResponse } from './OpenAIIntegration';

/**
 * Makes a request to the Gemini Pro API and returns the response text
 * @param prompt The text prompt to send to the API
 * @param apiKey Optional API key to override the default
 * @returns A Promise that resolves to the response text
 */
export const getGeminiResponse = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    if (!apiKey) {
      // Fallback to OpenAI if Gemini key isn't provided
      const openAIKey = localStorage.getItem('openaiApiKey') || '';
      if (openAIKey) {
        console.log('No Gemini API key provided, falling back to OpenAI');
        return await getOpenAIResponse(prompt, openAIKey);
      }
      throw new Error("API key is required. Please set your API key in Settings > AI Settings.");
    }
    
    // Check if we should use the Supabase edge function or direct API call
    const useEdgeFunction = localStorage.getItem('useEdgeFunction') === 'true';
    
    if (useEdgeFunction) {
      // Use Supabase Edge Function for secure API calls
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt })
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
        
        // Try OpenAI as fallback
        const openAIKey = localStorage.getItem('openaiApiKey') || '';
        if (openAIKey) {
          console.log('Gemini API error, falling back to OpenAI');
          return await getOpenAIResponse(prompt, openAIKey);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } else {
      // Direct API call to Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192,
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
    }
  } catch (error) {
    console.error('Error in Gemini API request:', error);
    
    // Try OpenAI as fallback
    try {
      const openAIKey = localStorage.getItem('openaiApiKey') || '';
      if (openAIKey) {
        console.log('Gemini API error, falling back to OpenAI');
        return await getOpenAIResponse(prompt, openAIKey);
      }
    } catch (fallbackError) {
      console.error('Fallback to OpenAI failed:', fallbackError);
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
  // Get the API key from localStorage
  const apiProvider = localStorage.getItem('preferredApiProvider') as 'openai' | 'deepseek' | 'gemini' || 'openai';
  const apiKey = localStorage.getItem(`${apiProvider}ApiKey`) || '';
  
  if (!apiKey) {
    throw new Error("API key is required. Please set your API key in Settings > AI Settings.");
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

  // Use the appropriate API based on provider
  if (apiProvider === 'openai') {
    return await getOpenAIResponse(prompt, apiKey);
  } else {
    return await getGeminiResponse(prompt, apiKey);
  }
};
