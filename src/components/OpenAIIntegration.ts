
/**
 * Makes a request to the OpenAI API and returns the response text
 * @param prompt The text prompt to send to the API
 * @param apiKey Optional API key to override the default
 * @returns A Promise that resolves to the response text
 */
export const getOpenAIResponse = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    // Use the provided API key or the hardcoded one
    const key = apiKey || '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';
    
    // Direct API call to OpenAI
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
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
  } catch (error) {
    console.error('Error in OpenAI API request:', error);
    
    // In case of error, try an alternate API key
    try {
      const alternateKey = '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';
      
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${alternateKey}`
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
        throw new Error(`API error with alternate key: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content;
      }
      
      throw new Error('Invalid response format from OpenAI API with alternate key');
    } catch (fallbackError) {
      console.error('Fallback to alternate key also failed:', fallbackError);
      
      // Try the Supabase edge function as a last resort
      try {
        const response = await fetch(`https://clyqfnqkicwvpymbqijn.supabase.co/functions/v1/openai-proxy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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
        
        throw new Error('Invalid response format from edge function');
      } catch (edgeFunctionError) {
        console.error('All fallback methods failed:', edgeFunctionError);
        throw new Error('Failed to get a response from any available OpenAI service. Please try again later.');
      }
    }
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
  // Use hardcoded API key
  const apiKey = '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';
  
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
