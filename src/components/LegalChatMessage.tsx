
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

    // Check for reference to knowledge base items
    if (text.includes("[KB-REFERENCE]")) {
      return text
        .split('\n')
        .map((line, i) => {
          if (line.includes("[KB-REFERENCE]")) {
            return `<div class="flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm my-2">
              <span class="mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg></span>
              <span>${line.replace("[KB-REFERENCE]", "Information from knowledge base: ")}</span>
            </div>`;
          }
          return formatLine(line);
        })
        .join('');
    }

    // Simple replacements for formatting
    return text
      .split('\n')
      .map(formatLine)
      .join('');
  };

  const formatLine = (line: string, i?: number) => {
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
  };

  return (
    <div className={cn(
      "py-4 sm:py-6 px-3 sm:px-4 flex items-start gap-3 sm:gap-4 rounded-lg mb-3 shadow-sm transition-all duration-300 animate-fade-up", 
      isUser 
        ? "bg-white/80 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-700/30" 
        : "bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/20"
    )}>
      <div className={cn(
        "w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full flex items-center justify-center shadow-sm",
        isUser ? "bg-purple-500 bg-gradient-to-br from-purple-400 to-purple-600" : "bg-blue-500 bg-gradient-to-br from-blue-400 to-blue-600"
      )}>
        {isUser ? (
          <UserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
