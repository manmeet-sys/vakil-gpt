
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Download, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  content: string;
  filename?: string;
  title?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  content, 
  filename = 'document',
  title = 'Share Document'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy content to clipboard",
      });
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "File has been downloaded",
    });
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(content);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button onClick={copyToClipboard} variant="outline" className="justify-start">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button onClick={downloadAsText} variant="outline" className="justify-start">
            <Download className="mr-2 h-4 w-4" />
            Download as Text
          </Button>
          <Button onClick={shareViaEmail} variant="outline" className="justify-start">
            <Mail className="mr-2 h-4 w-4" />
            Share via Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
