
/**
 * Utility functions for AI analysis
 */

/**
 * Generates analysis using Gemini API
 * @param text The text to analyze
 * @param filename The name of the file being analyzed
 * @param apiKey The API key for Gemini
 * @returns A promise that resolves to the analysis
 */
export const generateGeminiAnalysis = async (text: string, filename: string, apiKey: string): Promise<string> => {
  const systemPrompt = `You are PrecedentAI, a legal document analyzer specialized in Indian law with expertise in the Indian Constitution.
  
I'm providing you with text extracted from a PDF document named "${filename}".

Please analyze this legal document and provide:
1. A summary of the document type and purpose
2. Key legal provisions and terms identified
3. Potential legal implications under Indian law
4. Any constitutional considerations
5. Recommendations or areas of concern

Format your response with clear sections and be thorough yet concise in your legal analysis.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I will analyze the legal document as PrecedentAI, with focus on Indian law and constitutional considerations.' }] },
        { role: 'user', parts: [{ text }] }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4000,
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
};

/**
 * Generates analysis using DeepSeek API
 * @param text The text to analyze
 * @param filename The name of the file being analyzed
 * @param apiKey The API key for DeepSeek
 * @returns A promise that resolves to the analysis
 */
export const generateDeepSeekAnalysis = async (text: string, filename: string, apiKey: string): Promise<string> => {
  const systemPrompt = `You are PrecedentAI, a legal document analyzer specialized in Indian law with expertise in the Indian Constitution.
  
I'm providing you with text extracted from a PDF document named "${filename}".

Please analyze this legal document and provide:
1. A summary of the document type and purpose
2. Key legal provisions and terms identified
3. Potential legal implications under Indian law
4. Any constitutional considerations
5. Recommendations or areas of concern

Format your response with clear sections and be thorough yet concise in your legal analysis.`;
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.4,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
