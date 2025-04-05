
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TextPreviewProps {
  text: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({ text }) => {
  if (!text) return null;
  
  return (
    <div className="mt-4">
      <Label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">Extracted Text Preview</Label>
      <Textarea
        value={text.substring(0, 300) + (text.length > 300 ? "..." : "")}
        readOnly
        className="h-32 w-full resize-none text-sm bg-white dark:bg-zinc-800/90 border-gray-300 dark:border-zinc-700 shadow-sm rounded-lg focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
      />
    </div>
  );
};

export default TextPreview;
