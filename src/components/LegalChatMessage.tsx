
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface LegalChatMessageProps {
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const LegalChatMessage: React.FC<LegalChatMessageProps> = ({
  message,
  sender,
  timestamp
}) => {
  const isAI = sender === 'ai';
  
  return (
    <div className={cn(
      "flex w-full gap-3 p-4 rounded-lg",
      isAI ? "bg-secondary/50" : "bg-secondary/20"
    )}>
      <Avatar className="h-8 w-8">
        {isAI ? (
          <>
            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
          </>
        ) : (
          <>
            <AvatarFallback className="bg-muted text-muted-foreground">U</AvatarFallback>
            <AvatarImage src="/user-avatar.png" alt="User" />
          </>
        )}
      </Avatar>
      
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {isAI ? 'VakilGPT Assistant' : 'You'}
          </p>
          <time className="text-xs text-muted-foreground">
            {format(timestamp, 'HH:mm')}
          </time>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message}
        </div>
      </div>
    </div>
  );
};

export default LegalChatMessage;
