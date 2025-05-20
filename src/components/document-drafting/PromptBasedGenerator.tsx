
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';
import { performanceMonitor } from '@/utils/performance-monitoring';

interface PromptBasedGeneratorProps {
  title?: string;
  description?: string;
  defaultPrompt?: string;
  onGenerate?: (content: string) => void;
  placeholder?: string;
  promptLabel?: string;
  generateButtonText?: string;
}

const PromptBasedGenerator: React.FC<PromptBasedGeneratorProps> = ({
  title = "Document Generator",
  description = "Generate legal documents based on your requirements",
  defaultPrompt = "",
  onGenerate,
  placeholder = "Describe what you need to generate...",
  promptLabel = "Your Requirements",
  generateButtonText = "Generate Document"
}) => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (prompt.trim().length < 10) {
      toast({
        description: "Please provide more details for better results"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = await performanceMonitor.measureAsync('PromptBasedGenerator', 'generate', async () => {
        const enhancedPrompt = `
          Generate a professional ${title} based on the following requirements:
          
          ${prompt}
          
          Please format the document properly with appropriate sections, headings, and legal terminology.
          Ensure compliance with Indian legal standards and drafting conventions.
        `;

        return await getOpenAIResponse(enhancedPrompt);
      });

      if (onGenerate) {
        onGenerate(result);
      }

      toast({
        description: "Document generated successfully"
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        description: "Failed to generate document. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">{promptLabel}</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground">
            Provide detailed requirements for more accurate results
          </p>
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || prompt.trim().length < 10}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            generateButtonText
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromptBasedGenerator;
