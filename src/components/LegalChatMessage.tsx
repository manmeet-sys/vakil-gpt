
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
  return (
    <div className={cn(
      "flex mb-4 animate-fade-up group", 
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%] sm:max-w-[70%] items-start",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center",
          isUser ? "ml-3" : "mr-3",
          isUser ? "bg-legal-accent text-white" : "bg-gray-100 text-legal-slate dark:bg-legal-slate/20"
        )}>
          {isUser ? (
            <UserCircle className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
        </div>
        
        <div className={cn(
          "py-3 px-4 rounded-lg animate-scale shadow-elegant",
          isUser 
            ? "bg-legal-accent text-white rounded-tr-none" 
            : "bg-white dark:bg-legal-slate/10 border border-legal-border text-legal-slate rounded-tl-none"
        )}>
          {isLoading ? (
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalChatMessage;
