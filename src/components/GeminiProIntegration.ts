
// This file exports the API functions from GeminiProIntegration component
// to be used directly by other components

// Hardcoded API key
const GEMINI_API_KEY = "AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc";

/**
 * Makes a request to the Gemini Pro API and returns the response text
 * @param prompt The text prompt to send to the API
 * @returns A Promise that resolves to the response text
 */
export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    // Make request to Gemini API using the hardcoded key
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
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
  } catch (error) {
    console.error('Error in Gemini API request:', error);
    throw error;
  }
};
