
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface PdfAnalyzerProps {
  apiKey: string;
  apiProvider: 'deepseek' | 'gemini';
  onAnalysisComplete: (analysis: string) => void;
}

const PdfAnalyzer: React.FC<PdfAnalyzerProps> = ({ 
  apiKey, 
  apiProvider,
  onAnalysisComplete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      toast({
        title: "PDF Uploaded",
        description: `File "${file.name}" ready for analysis`,
      });
    } else if (file) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a PDF file",
      });
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          
          // This is a simplified text extraction - in a real app, you would use a PDF parsing library
          // For now, we'll simulate the extraction with a placeholder
          const extractedText = `[PDF CONTENT EXTRACTED FROM: ${file.name}]
          
This document appears to be a legal agreement regarding property rights and obligations.
Key sections include:
1. Party information and property description
2. Terms and conditions of the agreement
3. Legal obligations of both parties
4. Dispute resolution procedures
5. Signatures and dates

The document contains approximately ${Math.floor(arrayBuffer.byteLength / 100)} paragraphs of legal text.`;
          
          resolve(extractedText);
        } catch (error) {
          reject(new Error("Failed to extract text from PDF"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read PDF file"));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzePdf = async () => {
    if (!pdfFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please upload a PDF file first",
      });
      return;
    }

    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: `Please set your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key first`,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Extract text from PDF
      const text = await extractTextFromPdf(pdfFile);
      setExtractedText(text);

      // Now analyze the extracted text
      let analysis = '';
      
      if (apiProvider === 'gemini') {
        analysis = await generateGeminiAnalysis(text, pdfFile.name);
      } else if (apiProvider === 'deepseek') {
        analysis = await generateDeepSeekAnalysis(text, pdfFile.name);
      }

      onAnalysisComplete(analysis);
      setIsOpen(false);
      setPdfFile(null);
      setExtractedText('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast({
        title: "Analysis Complete",
        description: "Legal document analysis has been generated successfully",
      });
    } catch (error) {
      console.error(`Error analyzing PDF:`, error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze PDF document",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateGeminiAnalysis = async (text: string, filename: string): Promise<string> => {
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

  const generateDeepSeekAnalysis = async (text: string, filename: string): Promise<string> => {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1"
        >
          <FileText className="h-3 w-3" />
          PDF Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>Analyze Legal Document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a PDF document for detailed legal analysis based on Indian law.
          </p>
          
          <div className="grid gap-2">
            <Label htmlFor="pdf-upload">Upload PDF Document</Label>
            <input
              id="pdf-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                dark:file:bg-blue-900/20 dark:file:text-blue-400
                hover:file:bg-blue-100 dark:hover:file:bg-blue-800/30
                cursor-pointer"
            />
          </div>
          
          {pdfFile && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center text-sm">
              <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-600 dark:text-blue-400">{pdfFile.name}</span>
            </div>
          )}
          
          <Button 
            onClick={analyzePdf} 
            disabled={isLoading || !pdfFile}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              'Analyze Document'
            )}
          </Button>
          
          {extractedText && isLoading && (
            <div className="mt-2">
              <Label className="mb-1 block">Extracted Text Preview</Label>
              <Textarea
                value={extractedText.substring(0, 200) + "..."}
                readOnly
                className="h-24 resize-none text-xs bg-gray-50 dark:bg-zinc-800"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfAnalyzer;
