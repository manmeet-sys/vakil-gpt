
/**
 * Utility functions for AI integration in legal tools
 */
import { useState, useEffect } from 'react';
import { generateGeminiAnalysis } from './aiAnalysis';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to use AI analysis capabilities
 * @param initialState Whether AI is enabled by default
 * @returns AI state and methods
 */
export const useAIAnalysis = (initialState = false) => {
  const [aiEnabled, setAIEnabled] = useState<boolean>(initialState);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { toast } = useToast();

  const analyzeWithAI = async (content: string, context: string): Promise<string> => {
    if (!aiEnabled) return '';
    
    setIsAnalyzing(true);
    try {
      const result = await generateGeminiAnalysis(content, context);
      return result;
    } catch (error) {
      console.error("Error in AI analysis:", error);
      toast({
        title: "AI Analysis Error",
        description: "There was an error processing your request with AI. Please try again.",
        variant: "destructive"
      });
      return '';
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    aiEnabled,
    setAIEnabled,
    isAnalyzing,
    analyzeWithAI
  };
};

/**
 * Generate case citations from AI analysis for legal documents
 * @param text The legal text to analyze
 * @returns Array of case citations
 */
export const generateCaseCitations = async (text: string): Promise<Array<{case: string, citation: string, relevance: string}>> => {
  try {
    const prompt = `Extract the most relevant case citations from the following legal text. 
    Format your response as a JSON array of objects with the following structure:
    [
      {
        "case": "Case name",
        "citation": "Citation",
        "relevance": "Brief description of relevance to the text"
      }
    ]
    
    Text to analyze:
    ${text}`;
    
    const analysis = await generateGeminiAnalysis(prompt, "Case Citation Extraction");
    
    // Try to parse the response as JSON
    try {
      const citationsJson = analysis.match(/\[\s*\{.*\}\s*\]/s)?.[0];
      if (citationsJson) {
        return JSON.parse(citationsJson);
      }
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
    }
    
    // Fallback to empty array if parsing fails
    return [];
  } catch (error) {
    console.error("Error in generateCaseCitations:", error);
    return [];
  }
};

/**
 * Generate legal principles from AI analysis
 * @param text The legal text to analyze
 * @returns Array of legal principles
 */
export const generateLegalPrinciples = async (text: string): Promise<Array<{principle: string, description: string, source: string}>> => {
  try {
    const prompt = `Extract the key legal principles from the following text.
    Format your response as a JSON array of objects with the following structure:
    [
      {
        "principle": "Name of legal principle",
        "description": "Brief description of the principle",
        "source": "Legal source (statute, case law, etc.)"
      }
    ]
    
    Text to analyze:
    ${text}`;
    
    const analysis = await generateGeminiAnalysis(prompt, "Legal Principles Extraction");
    
    // Try to parse the response as JSON
    try {
      const principlesJson = analysis.match(/\[\s*\{.*\}\s*\]/s)?.[0];
      if (principlesJson) {
        return JSON.parse(principlesJson);
      }
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
    }
    
    // Fallback to empty array if parsing fails
    return [];
  } catch (error) {
    console.error("Error in generateLegalPrinciples:", error);
    return [];
  }
};

/**
 * Enhance document with AI suggestions
 * @param documentTemplate The base document template
 * @param context Additional context for enhancement
 * @returns Enhanced document
 */
export const enhanceDocumentWithAI = async (documentTemplate: string, context: string): Promise<string> => {
  try {
    const prompt = `Enhance the following legal document by:
    1. Ensuring all necessary legal clauses are included
    2. Adding appropriate references to Indian statutes and case law
    3. Improving the language for clarity and legal precision
    4. Making it compliant with current Indian legal standards
    
    Additional context: ${context}
    
    Document to enhance:
    ${documentTemplate}
    
    Return only the improved document text without any explanations or commentary.`;
    
    return await generateGeminiAnalysis(prompt, "Document Enhancement");
  } catch (error) {
    console.error("Error in enhanceDocumentWithAI:", error);
    return documentTemplate; // Return original if enhancement fails
  }
};
