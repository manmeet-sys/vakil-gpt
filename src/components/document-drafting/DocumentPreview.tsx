
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DocumentPreviewProps {
  title: string;
  type: string;
  content: string;
  onCopy: () => void;
  onDownload: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  type,
  content,
  onCopy,
  onDownload
}) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <div>
            <CardTitle>{title || 'Document Preview'}</CardTitle>
            <CardDescription>{type || 'Legal Document'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {content ? (
          <Textarea
            value={content}
            readOnly
            className="w-full h-full min-h-[400px] font-mono text-sm"
          />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/30 rounded-md border border-dashed text-muted-foreground">
            Generated document will appear here
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCopy} 
          disabled={!content}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          onClick={onDownload}
          disabled={!content}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentPreview;
