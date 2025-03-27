
import React from 'react';
import { cn } from '@/lib/utils';
import { UserCircle, Bot } from 'lucide-react';

interface LegalChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

const LegalChatMessage: React.FC<LegalChatMessageProps> = ({ 
  message, 
  isUser,
  isLoading = false
}) => {
  // Function to format message with proper markdown-like styling
  const formatMessage = (text: string) => {
    // Check if the text is JSON
    try {
      if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
        const jsonObj = JSON.parse(text);
        return `<pre class="bg-gray-100 dark:bg-zinc-800 p-3 rounded-md my-2 overflow-x-auto font-mono text-sm">${JSON.stringify(jsonObj, null, 2)}</pre>`;
      }
    } catch (e) {
      // Not valid JSON, continue with normal formatting
    }

    // Simple replacements for formatting
    return text
      .split('\n')
      .map((line, i) => {
        // Process code blocks
        if (line.startsWith('```')) {
          return `<pre class="bg-gray-100 dark:bg-zinc-800 p-3 rounded-md my-2 overflow-x-auto font-mono text-sm">${line.replace('```', '')}</pre>`;
        }
        
        // Process headings
        if (line.startsWith('# ')) {
          return `<h1 class="text-xl font-bold my-2">${line.substring(2)}</h1>`;
        }
        if (line.startsWith('## ')) {
          return `<h2 class="text-lg font-bold my-2">${line.substring(3)}</h2>`;
        }
        if (line.startsWith('### ')) {
          return `<h3 class="text-md font-bold my-2">${line.substring(4)}</h3>`;
        }
        
        // Process lists
        if (line.match(/^\d+\.\s/)) {
          return `<li class="ml-4 list-decimal">${line.replace(/^\d+\.\s/, '')}</li>`;
        }
        if (line.startsWith('- ')) {
          return `<li class="ml-4 list-disc">${line.substring(2)}</li>`;
        }
        
        // Process bold and italic
        let processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
          
        return `<p>${processedLine}</p>`;
      })
      .join('');
  };

  return (
    <div className={cn(
      "py-6 px-4 flex items-start gap-4 border-b border-gray-100 dark:border-zinc-800 animate-fade-up group", 
      isUser ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-800/20"
    )}>
      <div className={cn(
        "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center",
        isUser ? "bg-green-500" : "bg-blue-500"
      )}>
        {isUser ? (
          <UserCircle className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className="flex-1 max-w-full overflow-hidden">
        {isLoading ? (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
          />
        )}
      </div>
    </div>
  );
};

export default LegalChatMessage;
