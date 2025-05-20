
import React, { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import { FileUp, Loader2, SendHorizontal, ChevronRight, Search, ArrowRight } from 'lucide-react';
import LegalChatMessage from './LegalChatMessage';
import PdfAnalyzer from './PdfAnalyzer';
import KnowledgeBaseButton from './KnowledgeBaseButton';
import { useIsMobile } from '@/hooks/use-mobile';

// Define types for messages
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Define props for the component
interface ChatInterfaceProps {
  title?: string;
  description?: string;
  systemPrompt?: string;
  placeholder?: string;
  showFileUpload?: boolean;
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  title = 'VakilGPT Chat',
  description = 'Your AI-powered legal assistant',
  systemPrompt = 'You are a helpful legal assistant focused on Indian law.',
  placeholder = 'Ask any legal question...',
  showFileUpload = true,
  initialMessages = [],
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentText, setDocumentText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: generateId(),
      content: input,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse;
      
      if (onSendMessage) {
        aiResponse = await onSendMessage(input);
      } else {
        // Default to using OpenAI if no custom handler is provided
        const contextPrompt = documentText 
          ? `User uploaded document context:\n${documentText}\n\nUser question: ${input}` 
          : input;
          
        aiResponse = await generateOpenAIAnalysis(
          contextPrompt,
          systemPrompt
        );
      }

      const aiMessage = {
        id: generateId(),
        content: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDocumentAnalysis = (analysis: string) => {
    setDocumentText(analysis);
    toast({
      title: "Document Processed",
      description: "You can now ask questions about the document.",
    });
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)]">
      <CardHeader className={isMobile ? "py-3" : "py-6"}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {showFileUpload && (
              <PdfAnalyzer 
                onAnalysisComplete={handleDocumentAnalysis}
                iconOnly={true}
              />
            )}
            <KnowledgeBaseButton iconOnly={true} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto border-y">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Ask anything about Indian law</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                Get accurate information on legal procedures, rights, documentation, and more, all based on Indian legal frameworks.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                <Button variant="secondary" className="justify-start" onClick={() => setInput("What are my rights under Section 144?")}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Rights under Section 144
                </Button>
                <Button variant="secondary" className="justify-start" onClick={() => setInput("How do I file a consumer complaint?")}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  File a consumer complaint
                </Button>
                <Button variant="secondary" className="justify-start" onClick={() => setInput("What's the limitation period for filing a civil case?")}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Civil case limitation
                </Button>
                <Button variant="secondary" className="justify-start" onClick={() => setInput("Explain anticipatory bail provisions")}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Anticipatory bail
                </Button>
              </div>

              {documentText && (
                <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-md text-sm">
                  <p className="font-medium flex items-center justify-center">
                    <FileUp className="mr-2 h-4 w-4" />
                    Document loaded - you can ask questions about it
                  </p>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <LegalChatMessage
                key={message.id}
                message={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))
          )}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-bounce mr-2">●</div>
              <div className="animate-bounce animation-delay-200 mr-2">●</div>
              <div className="animate-bounce animation-delay-400">●</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className={`flex items-end gap-2 ${isMobile ? "p-3" : "p-4"}`}>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-10 resize-none"
          rows={1}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !input.trim()} 
          className={`px-3 ${isMobile ? 'h-9 w-9' : ''}`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          {!isMobile && <span className="ml-2">Send</span>}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
