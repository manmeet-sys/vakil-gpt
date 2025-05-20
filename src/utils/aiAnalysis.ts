
/**
 * AI Analysis Utilities
 * Functions for integrating with OpenAI API
 */

const OPENAI_API_KEY = localStorage.getItem('openaiApiKey');
const BACKUP_KEY = localStorage.getItem('backupOpenaiApiKey');

/**
 * Generate analysis using OpenAI API
 * @param prompt The text to analyze
 * @param context Additional context for the analysis
 * @returns The AI-generated analysis
 */
export const generateOpenAIAnalysis = async (prompt: string, context: string = ''): Promise<string> => {
  try {
    const apiKey = OPENAI_API_KEY || BACKUP_KEY;
    
    if (!apiKey) {
      throw new Error('No API key available for AI analysis');
    }
    
    const contextPrompt = context ? `Context: ${context}\n\n` : '';
    const fullPrompt = `${contextPrompt}${prompt}`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are VakilGPT, a specialized legal assistant focused on Indian law. Provide detailed, accurate, and comprehensive legal analysis. Your responses should be professional, well-structured, and tailored to the Indian legal system.'
          },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`AI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateOpenAIAnalysis:', error);
    throw new Error('Failed to generate AI analysis. Please check your API key or try again later.');
  }
};

export default {
  generateOpenAIAnalysis
};
