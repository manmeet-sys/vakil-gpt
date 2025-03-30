
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TextPreviewProps {
  text: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({ text }) => {
  if (!text) return null;
  
  return (
    <div className="mt-2">
      <Label className="mb-1 block">Extracted Text Preview</Label>
      <Textarea
        value={text.substring(0, 200) + "..."}
        readOnly
        className="h-24 resize-none text-xs bg-gray-50 dark:bg-zinc-800"
      />
    </div>
  );
};

export default TextPreview;
