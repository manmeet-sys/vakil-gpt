
import React from 'react';
import { cn } from '@/lib/utils';
import { richTextStyles } from '@/lib/typography';

interface RichTextProps {
  content: string;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
}

export const RichText: React.FC<RichTextProps> = ({ 
  content, 
  className,
  variant = 'default'
}) => {
  const variantStyles = {
    default: richTextStyles,
    compact: cn(richTextStyles, "prose-sm space-y-2"),
    expanded: cn(richTextStyles, "prose-lg space-y-6")
  };

  // Convert line breaks to paragraphs for better formatting
  const formatContent = (text: string) => {
    return text
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  return (
    <div 
      className={cn(variantStyles[variant], className)}
      dangerouslySetInnerHTML={{ 
        __html: formatContent(content) 
      }}
    />
  );
};

export default RichText;
