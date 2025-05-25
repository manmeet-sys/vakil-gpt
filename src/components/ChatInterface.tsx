
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import LegalChatMessage from './LegalChatMessage';
import LegalAnalysisGenerator from './LegalAnalysisGenerator';
import KnowledgeBaseButton from './KnowledgeBaseButton';
import PdfAnalyzer from './PdfAnalyzer';
import { getOpenAIResponse } from './OpenAIIntegration';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "नमस्ते! Welcome to VakilGPT. I'm your AI legal assistant specializing in Indian law. I can help with legal questions, analyze documents, and provide information on constitutional matters. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getOpenAIResponse(
        `You are VakilGPT, a legal assistant specializing in Indian law. 
        Respond to the following query with accurate legal information relevant to Indian law, Indian legal procedures, Supreme Court and High Court decisions, and the Indian Constitution:
        
        ${input}`
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "नमस्ते! Welcome to VakilGPT. I'm your AI legal assistant specializing in Indian law. I can help with legal questions, analyze documents, and provide information on constitutional matters. How can I assist you today?"
      }
    ]);
    
    toast({
      title: "Chat Cleared",
      description: "The conversation has been reset",
    });
  };

  const handleAnalysisComplete = (analysis: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: analysis
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className={`flex flex-col border rounded-xl bg-white dark:bg-zinc-800 shadow-sm h-full ${className}`}>
      {/* Chat Header */}
      <div className="flex justify-between items-center p-2 sm:p-3 border-b">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            className="text-xs flex items-center gap-1 px-2 py-1 h-8"
          >
            <Trash className="h-3 w-3" />
            <span className={isMobile ? "hidden" : "inline"}>Clear</span>
          </Button>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <LegalAnalysisGenerator
            onAnalysisComplete={handleAnalysisComplete}
            buttonLabel={isMobile ? "Analysis" : "Legal Analysis"}
            iconOnly={isMobile}
          />
          
          <KnowledgeBaseButton 
            buttonLabel={isMobile ? "KB" : "Knowledge Base"}
            iconOnly={isMobile}
          />
          
          <PdfAnalyzer 
            onAnalysisComplete={handleAnalysisComplete}
            buttonLabel={isMobile ? "PDF" : "PDF Analysis"}
            iconOnly={isMobile}
          />
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900/80">
        {messages.map((message) => (
          <LegalChatMessage
            key={message.id}
            message={message.content}
            isUser={message.role === 'user'}
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
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2 bg-white dark:bg-zinc-800/90 backdrop-blur-sm">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Indian law or legal procedures..."
          disabled={isLoading}
          className="flex-1 w-full border-gray-300 dark:border-zinc-700 focus:ring-blue-accent dark:focus:ring-blue-accent/70"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          size="icon"
          className="rounded-full bg-blue-accent hover:bg-blue-accent/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
