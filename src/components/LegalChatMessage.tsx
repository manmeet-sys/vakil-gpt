
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
      "flex w-full gap-3 p-3 sm:p-4 rounded-lg",
      isAI ? "bg-blue-50 dark:bg-blue-900/10" : "bg-gray-50 dark:bg-gray-800/20"
    )}>
      <Avatar className="h-8 w-8">
        {isAI ? (
          <>
            <AvatarFallback className="bg-blue-500 text-white">AI</AvatarFallback>
            <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
          </>
        ) : (
          <>
            <AvatarFallback className="bg-gray-500 text-white">U</AvatarFallback>
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
          {message.split('\n').map((line, i) => (
            line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalChatMessage;
