import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye, Share2, Wand2 } from 'lucide-react';
import { generateAIAnalysis } from '@/utils/aiAnalysis';
import ShareButton from '../ShareButton';
import TextPreview from '../TextPreview';

interface DocumentPreviewProps {
  title: string;
  description: string;
  content: string;
  onDownload: () => void;
  onShare: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  description,
  content,
  onDownload,
  onShare,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState<string | null>(null);

  const handleEnhance = async () => {
    setIsGenerating(true);
    try {
      const analysis = await generateAIAnalysis(content, title);
      setEnhancedContent(analysis);
    } catch (error) {
      console.error("Error enhancing document:", error);
      setEnhancedContent("Failed to enhance document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enhancedContent !== null ? (
          <TextPreview content={enhancedContent} />
        ) : (
          <TextPreview content={content} />
        )}
      </CardContent>
      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground">
          {enhancedContent
            ? "AI Enhanced Preview"
            : "Original Document Preview"}
        </p>
      </CardContent>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              className="text-xs"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <ShareButton title={title} description={description} content={content} />
          </div>
          <Button
            size="sm"
            onClick={handleEnhance}
            disabled={isGenerating}
            className="bg-legal-accent hover:bg-blue-700 text-white text-xs"
          >
            {isGenerating ? (
              <>
                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Enhance with AI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
