
// Unified service that handles multiple AI providers (OpenAI, Gemini, DeepSeek)
import { getGeminiResponse } from '@/components/GeminiProIntegration';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

export type AIProvider = 'gemini' | 'deepseek' | 'openai';

/**
 * Get the configured API provider and API key
 * @returns Object containing provider name and API key
 */
export const getAIConfig = () => {
  const provider = localStorage.getItem('preferredApiProvider') as AIProvider || 'gemini';
  const apiKey = localStorage.getItem(`${provider}ApiKey`) || '';
  
  return { provider, apiKey };
};

/**
 * Makes a request to the configured AI model and returns the response text
 * @param prompt The text prompt to send to the API
 * @param options Optional configuration options
 * @returns A Promise that resolves to the response text
 */
export const getAIResponse = async (
  prompt: string, 
  options?: { 
    provider?: AIProvider; 
    apiKey?: string;
    temperature?: number;
  }
): Promise<string> => {
  const { provider: configuredProvider, apiKey: configuredKey } = getAIConfig();
  const provider = options?.provider || configuredProvider;
  const apiKey = options?.apiKey || configuredKey;

  if (!apiKey) {
    throw new Error(`API key for ${provider} is not configured. Please set it in Settings > AI Settings.`);
  }

  try {
    switch (provider) {
      case 'gemini':
        return await getGeminiResponse(prompt, apiKey);
      case 'openai':
        return await getOpenAIResponse(prompt, apiKey);
      case 'deepseek':
        // DeepSeek implementation would go here
        // For now, fall back to OpenAI if configured, otherwise Gemini
        if (localStorage.getItem('openaiApiKey')) {
          return await getOpenAIResponse(prompt, localStorage.getItem('openaiApiKey') || '');
        } else {
          return await getGeminiResponse(prompt, localStorage.getItem('geminiApiKey') || '');
        }
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error in ${provider} API request:`, error);
    throw error;
  }
};

/**
 * Check if OpenAI API key is configured and set it as the preferred provider
 * @param apiKey OpenAI API key to verify and set (optional)
 * @returns True if successful, false if not
 */
export const configureOpenAIProvider = (apiKey?: string): boolean => {
  const key = apiKey || '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';
  
  if (key && (key.startsWith('sk-') || key.startsWith('sk-svcacct'))) {
    localStorage.setItem('openaiApiKey', key);
    localStorage.setItem('preferredApiProvider', 'openai');
    return true;
  }
  return false;
};

