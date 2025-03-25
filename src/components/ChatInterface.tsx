
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import LegalChatMessage from './LegalChatMessage';
import { toast } from 'sonner';

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
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Try to get API key from localStorage on initial load
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseek-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // Show API key input if no key is found
      setShowApiKeyInput(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek-api-key', apiKey);
      setShowApiKeyInput(false);
      toast.success('API key saved successfully');
    } else {
      toast.error('Please enter a valid API key');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast.error('Please enter your DeepSeek API key first');
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetchDeepSeekResponse(inputValue);
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast.error('Failed to get response. Please check your API key and try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your request. Please check your API key or try again later.",
        isUser: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeepSeekResponse = async (userInput: string): Promise<string> => {
    try {
      const previousMessages = messages
        .filter(m => messages.indexOf(m) > 0) // Skip the initial welcome message
        .map(m => ({
          role: m.isUser ? 'user' : 'assistant',
          content: m.text
        }));

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are LegalGPT, an AI assistant specialized in legal information. 
              You provide helpful, accurate, and clear information about legal topics. 
              Remember that you provide general legal information, not specific legal advice. 
              Always suggest consulting with a qualified attorney for specific legal problems.
              Focus on giving factual, well-structured responses about legal matters.`
            },
            ...previousMessages,
            {
              role: 'user',
              content: userInput
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch response');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  };

  // Simple fallback response generator for when API is not available
  const generateFallbackResponse = (userInput: string): string => {
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
      <div className="bg-white dark:bg-legal-slate/10 border-b border-legal-border px-4 py-3 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-legal-slate">LegalGPT Assistant</h3>
          <p className="text-xs text-legal-muted">Ask any legal question</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
        >
          <KeyRound className="h-3 w-3" />
          {apiKey ? 'Change API Key' : 'Set API Key'}
        </Button>
      </div>
      
      {showApiKeyInput && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b border-legal-border">
          <div className="text-sm mb-2">Enter your DeepSeek API key to enable AI responses</div>
          <div className="flex gap-2">
            <Input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="DeepSeek API Key"
              className="flex-1 text-sm border-legal-border"
            />
            <Button onClick={saveApiKey} className="bg-legal-accent hover:bg-legal-accent/90 text-white">
              Save
            </Button>
          </div>
          <p className="text-xs mt-2 text-legal-muted">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      )}
      
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
