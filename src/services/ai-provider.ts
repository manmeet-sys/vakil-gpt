
// Unified service that handles multiple AI providers (OpenAI, Gemini, DeepSeek)
import { getGeminiResponse } from '@/components/GeminiProIntegration';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { toast } from 'sonner';

export type AIProvider = 'openai' | 'gemini' | 'deepseek';

/**
 * Get the configured API provider and API key
 * @returns Object containing provider name and API key
 */
export const getAIConfig = () => {
  // Always default to OpenAI if no provider is set
  const provider = localStorage.getItem('preferredApiProvider') as AIProvider || 'openai';
  
  // First try to get the specified provider's API key
  let apiKey = localStorage.getItem(`${provider}ApiKey`) || '';
  
  // If the requested provider has no key, fall back to OpenAI
  if (!apiKey && provider !== 'openai') {
    apiKey = localStorage.getItem('openaiApiKey') || '';
    return { provider: 'openai', apiKey };
  }
  
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
  
  // Default to OpenAI key if present and no key is provided for specified provider
  const openAIKey = localStorage.getItem('openaiApiKey') || '';
  
  if (!apiKey) {
    // Always use OpenAI if it's available and no other key is set
    if (openAIKey) {
      console.log(`No API key for ${provider}, falling back to OpenAI`);
      try {
        return await getOpenAIResponse(prompt, openAIKey);
      } catch (error) {
        console.error('Error in OpenAI fallback:', error);
        throw new Error(`API key for ${provider} is not configured. Please set it in Settings > AI Settings.`);
      }
    } else {
      throw new Error(`API key for ${provider} is not configured. Please set it in Settings > AI Settings.`);
    }
  }

  try {
    switch (provider) {
      case 'openai':
        return await getOpenAIResponse(prompt, apiKey);
      case 'gemini':
        try {
          return await getGeminiResponse(prompt, apiKey);
        } catch (error) {
          console.warn('Gemini API error, falling back to OpenAI');
          if (openAIKey) {
            toast.info('Falling back to OpenAI');
            return await getOpenAIResponse(prompt, openAIKey);
          }
          throw error;
        }
      case 'deepseek':
        // DeepSeek implementation would go here
        // For now, fall back to OpenAI as the default
        console.warn('DeepSeek not implemented, using OpenAI');
        return await getOpenAIResponse(prompt, openAIKey || apiKey);
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error in ${provider} API request:`, error);
    
    // Try to gracefully recover with OpenAI if another provider fails
    if (provider !== 'openai' && openAIKey) {
      try {
        console.log(`${provider} failed, trying OpenAI as fallback`);
        toast.info(`${provider} API failed, using OpenAI as fallback`);
        return await getOpenAIResponse(prompt, openAIKey);
      } catch (fallbackError) {
        console.error('OpenAI fallback also failed:', fallbackError);
      }
    }
    
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
