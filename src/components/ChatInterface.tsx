
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import LegalChatMessage from './LegalChatMessage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Welcome to LegalGPT. How can I assist you with your legal questions today?",
    isUser: false
  }
];

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        isUser: false
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Simple response generator for demo purposes
  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('contract') || input.includes('agreement')) {
      return "Contracts are legally binding agreements between parties. For specific contract advice, I'd need more details about your situation. What type of contract are you dealing with?";
    } else if (input.includes('liability') || input.includes('sue')) {
      return "Liability questions are complex and depend on jurisdiction and specific circumstances. Could you provide more details about your situation so I can offer more targeted information?";
    } else if (input.includes('rights') || input.includes('entitled')) {
      return "Legal rights vary significantly by jurisdiction and context. To provide accurate information about your rights, I would need to know your location and the specific situation you're inquiring about.";
    } else if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm LegalGPT, your AI legal assistant. Please note that while I can provide legal information, I cannot provide legal advice that substitutes for a qualified attorney. How can I help you today?";
    } else {
      return "Thank you for your question. To provide you with accurate legal information, I'd need more specific details. Please note that I provide general legal information, not legal advice. For specific advice tailored to your situation, consulting with a qualified attorney is recommended.";
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-[500px] md:h-[600px] w-full max-w-3xl mx-auto rounded-xl shadow-elegant border border-legal-border overflow-hidden bg-legal-light/50 dark:bg-legal-slate/5",
      className
    )}>
      <div className="bg-white dark:bg-legal-slate/10 border-b border-legal-border px-4 py-3">
        <h3 className="font-semibold text-legal-slate">LegalGPT Assistant</h3>
        <p className="text-xs text-legal-muted">Ask any legal question</p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <LegalChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          
          {isLoading && (
            <LegalChatMessage
              message=""
              isUser={false}
              isLoading={true}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form 
        onSubmit={handleSendMessage}
        className="border-t border-legal-border bg-white dark:bg-legal-slate/10 p-4"
      >
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0 text-legal-muted hover:text-legal-slate border-legal-border"
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your legal question..."
            className="flex-1 border-legal-border focus-visible:ring-legal-accent"
          />
          
          <Button
            type="submit"
            className="flex-shrink-0 bg-legal-accent hover:bg-legal-accent/90 text-white"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
