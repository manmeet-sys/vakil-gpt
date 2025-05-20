
import { useState } from 'react';

/**
 * Makes a request to OpenAI's API
 * @param prompt The prompt to send to OpenAI
 * @param apiKey Your OpenAI API key
 * @returns The response from the API
 */
export const getOpenAIResponse = async (prompt: string, apiKey: string = ''): Promise<string> => {
  // Use the provided key or try to get from localStorage
  const openaiApiKey = apiKey || localStorage.getItem('openaiApiKey') || '';
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are VakilGPT, a legal assistant specialized in Indian law.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};

/**
 * React hook for using OpenAI in components
 */
export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateResponse = async (prompt: string, apiKey: string = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getOpenAIResponse(prompt, apiKey);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { generateResponse, isLoading, error };
};
