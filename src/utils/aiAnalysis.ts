
/**
 * Utility functions for AI analysis using OpenAI integration
 */
import { getOpenAIResponse, generateOpenAILegalAnalysis, generateIndianContractAnalysis, fetchIndianLegalUpdates, subscribeToLegalUpdates } from '@/components/OpenAIIntegration';

/**
 * Generates analysis using OpenAI API
 * @param text The text to analyze
 * @param filename The name of the file being analyzed
 * @returns A promise that resolves to the analysis
 */
export const generateAIAnalysis = async (text: string, filename: string): Promise<string> => {
  return await generateOpenAILegalAnalysis(text, filename);
};

// Export all the functions from OpenAI integration
export { 
  getOpenAIResponse as getAIResponse,
  generateIndianContractAnalysis,
  fetchIndianLegalUpdates,
  subscribeToLegalUpdates
};
