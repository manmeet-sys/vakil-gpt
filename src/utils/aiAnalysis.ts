
/**
 * AI Analysis Utilities
 * Functions for integrating with OpenAI API
 */
import { getAIResponse } from '@/services/ai-provider';

// Use the API key from the service
const OPENAI_API_KEY = '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';

/**
 * Generate analysis using OpenAI API
 * @param prompt The text to analyze
 * @param context Additional context for the analysis
 * @returns The AI-generated analysis
 */
export const generateOpenAIAnalysis = async (prompt: string, context: string = ''): Promise<string> => {
  try {
    const contextPrompt = context ? `Context: ${context}\n\n` : '';
    const fullPrompt = `${contextPrompt}${prompt}`;
    
    return await getAIResponse(fullPrompt, { temperature: 0.7 });
  } catch (error) {
    console.error('Error in generateOpenAIAnalysis:', error);
    throw new Error('Failed to generate AI analysis. Please try again later.');
  }
};

/**
 * Fetch Indian legal updates using OpenAI
 * @returns Recent legal updates in India
 */
export const fetchIndianLegalUpdates = async (): Promise<string> => {
  try {
    const prompt = `
      Provide a concise summary of the most recent important legal updates, 
      amendments, and landmark cases in Indian law from the past 30 days.
      Focus on changes that would be relevant to practicing lawyers in India.
      Format the response with clear headings and bullet points.
    `;
    
    return await getAIResponse(prompt, { temperature: 0.3 });
  } catch (error) {
    console.error('Error fetching legal updates:', error);
    throw new Error('Failed to fetch recent legal updates. Please try again later.');
  }
};

/**
 * Subscribe to regular legal updates for a specific practice area
 * @param practiceArea The legal practice area to get updates for
 * @param email User email to send updates to
 * @returns Confirmation message
 */
export const subscribeToLegalUpdates = async (
  practiceArea: string,
  email: string
): Promise<string> => {
  // This would typically call a backend API to register the subscription
  // For now, we'll simulate the response
  
  return `Successfully subscribed ${email} to receive regular updates on ${practiceArea} legal developments.`;
};

export default {
  generateOpenAIAnalysis,
  fetchIndianLegalUpdates,
  subscribeToLegalUpdates
};
