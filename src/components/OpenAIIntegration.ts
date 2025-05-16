
/**
 * Makes a request to the OpenAI API and returns the response text
 * @param prompt The text prompt to send to the API
 * @param apiKey Optional API key to override the default
 * @returns A Promise that resolves to the response text
 */
export const getOpenAIResponse = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API key is required. Please set your API key in Settings > AI Settings.");
    }
    
    // Check if we should use the Supabase edge function or direct API call
    const useEdgeFunction = localStorage.getItem('useEdgeFunction') !== 'false';
    
    if (useEdgeFunction) {
      // Use Supabase Edge Function for secure API calls
      const response = await fetch(`https://clyqfnqkicwvpymbqijn.supabase.co/functions/v1/openai-proxy`, {
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
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from OpenAI API');
      }
    } else {
      // Direct API call to OpenAI
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.4,
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
    }
  } catch (error) {
    console.error('Error in OpenAI API request:', error);
    throw error;
  }
};

/**
 * Generates an enhanced contract with detailed clauses specific to Indian law using OpenAI
 * @param contractType The type of contract to generate
 * @param parties Information about the parties involved
 * @param details Contract details including jurisdiction, purpose, terms
 * @returns A Promise that resolves to the generated contract text
 */
export const generateEnhancedIndianContractWithOpenAI = async (
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
  const apiKey = localStorage.getItem('openaiApiKey') || '';
  
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

  // Use the main OpenAI function to generate the contract
  return await getOpenAIResponse(prompt, apiKey);
};
