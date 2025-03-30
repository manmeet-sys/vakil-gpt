import React, { useState, useRef, useEffect } from 'react';
import { Send, KeyRound, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import LegalChatMessage from './LegalChatMessage';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import LegalAnalysisGenerator from './LegalAnalysisGenerator';
import GeminiFlashAnalyzer from './GeminiFlashAnalyzer';
import KnowledgeBaseButton from './KnowledgeBaseButton';
import PdfAnalyzer from './PdfAnalyzer';
import * as GeminiProIntegration from './GeminiProIntegration';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Welcome to PrecedentAI. I'm your legal assistant specialized in Indian law, with focus on the Indian Constitution. How can I assist you today?",
    isUser: false
  }
];

const DEFAULT_SYSTEM_PROMPT = `You are PrecedentAI, an advanced legal AI assistant specialized in Indian law with primary focus on the Indian Constitution. 

Your core functionalities include:
1. Legal Document Analysis: Extract key information from contracts, court filings, and legal opinions. Identify critical clauses and flag potential issues.
2. Case Law Research: Search and analyze relevant case law from Indian courts, especially constitutional interpretations. Provide citations and explain legal principles.
3. Compliance Assistant: Offer guidance for divorce law, corporate law, criminal law, real estate law, and company formation, with procedures, checklists, and templates.
4. Legal Risk Assessment: Evaluate risks in scenarios like contract disputes or regulatory compliance, suggesting mitigation strategies.
5. Legal Education: Explain legal concepts in simple language, focusing on the Indian Constitution and landmark cases.
6. Due Diligence Support: Assist in due diligence for transactions, detecting issues like title defects or pending litigation.
7. Legal Filing Processes: Guide users through filing legal documents with templates and deadline alerts.
8. Contract Drafting: Draft or refine contracts ensuring legal soundness and clarity.
9. Case Summaries: Provide concise summaries of case law, highlighting significance and implications.

You are powered by legal data including the Indian Constitution, statutes like the Indian Penal Code and Companies Act, case law from the Supreme Court and High Courts, and authoritative legal texts.

Important ethical guidelines:
- You provide LEGAL INFORMATION, not legal advice. Always recommend consulting with qualified attorneys for specific legal problems.
- Maintain confidentiality and adhere to Indian data protection laws.
- Be transparent about your limitations and the need for human oversight.
- Focus on unbiased, accurate information aligned with constitutional norms.

When responding to queries:
- Ask clarifying questions when faced with ambiguity.
- Tailor your responses based on the legal field specified.
- Provide detailed or simplified answers based on user needs.
- Include relevant citations to legal sources when applicable.
- Always prioritize accuracy over speed.`;

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [showSystemPromptSettings, setShowSystemPromptSettings] = useState(false);
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('ai-api-key') || 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc';
    setApiKey(savedApiKey);
    
    const savedApiProvider = localStorage.getItem('ai-api-provider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(savedApiProvider);
    
    const savedSystemPrompt = localStorage.getItem('system-prompt');
    if (savedSystemPrompt) {
      setSystemPrompt(savedSystemPrompt);
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
      localStorage.setItem('ai-api-key', apiKey);
      localStorage.setItem('ai-api-provider', apiProvider);
      setShowApiKeyInput(false);
      toast({
        title: "Success",
        description: `${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key saved successfully`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid API key",
      });
    }
  };

  const saveSystemPrompt = () => {
    localStorage.setItem('system-prompt', systemPrompt);
    setShowSystemPromptSettings(false);
    toast({
      title: "Success",
      description: "Custom prompt saved successfully",
    });
  };

  const resetSystemPrompt = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    localStorage.removeItem('system-prompt');
    toast({
      title: "Success",
      description: "Prompt reset to default",
    });
  };

  const handleAnalysisComplete = (analysis: string) => {
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: "Based on your request, I've prepared the following legal analysis:\n\n" + analysis,
      isUser: false
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const incorporateKnowledgeBase = (userInput: string): string => {
    const savedItems = localStorage.getItem('precedentAI-knowledge');
    if (!savedItems) return userInput;
    
    try {
      const knowledgeItems = JSON.parse(savedItems);
      
      if (!knowledgeItems || knowledgeItems.length === 0) return userInput;
      
      let knowledgeContext = "Here is some additional context from my knowledge base that might be relevant to this query:\n\n";
      
      const recentItems = knowledgeItems
        .sort((a: any, b: any) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, 3);
      
      recentItems.forEach((item: any, index: number) => {
        knowledgeContext += `[Knowledge Item ${index + 1}] ${item.title}\n`;
        knowledgeContext += `${item.content.substring(0, 500)}${item.content.length > 500 ? '...' : ''}\n\n`;
      });
      
      return `${userInput}\n\n${knowledgeContext}`;
    } catch (e) {
      console.error('Failed to parse knowledge items:', e);
      return userInput;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Please enter your ${apiProvider.charAt(0).toUpperCase() + apiProvider.slice(1)} API key first`,
      });
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
      const enhancedUserInput = incorporateKnowledgeBase(inputValue);
      
      let response;
      if (apiProvider === 'deepseek') {
        response = await fetchDeepSeekResponse(enhancedUserInput);
      } else if (apiProvider === 'gemini') {
        response = await fetchGeminiResponse(enhancedUserInput);
      } else {
        throw new Error('Unsupported API provider');
      }
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false
      };
      
      setMessages(prev => [...prev, responseMessage]);
    } catch (error) {
      console.error(`Error fetching ${apiProvider} response:`, error);
      
      let errorMessage = "I'm sorry, I encountered an error processing your request.";
      
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('invalid')) {
          errorMessage += ` Invalid API key or authentication error. Please check your ${apiProvider} API key and try again.`;
        } else if (error.message.includes('429') || error.message.includes('quota')) {
          errorMessage += " Rate limit exceeded or quota reached. Please try again later.";
        } else if (error.message.includes('500')) {
          errorMessage += ` The ${apiProvider} API is experiencing issues. Please try again later.`;
        } else {
          errorMessage += " " + error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "API Error",
        description: `Failed to get response from ${apiProvider}. Please check your API key and try again.`,
      });
      
      const aiErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false
      };
      
      setMessages(prev => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeepSeekResponse = async (userInput: string): Promise<string> => {
    try {
      const previousMessages = messages
        .filter(m => messages.indexOf(m) > 0)
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
              content: systemPrompt
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
        const errorMessage = errorData.error?.message || `API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  };

  const fetchGeminiResponse = async (userInput: string): Promise<string> => {
    try {
      const previousMessages = messages
        .filter(m => messages.indexOf(m) > 0)
        .map(m => ({
          role: m.isUser ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));
      
      const contents = [];
      
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
      
      contents.push({
        role: 'model',
        parts: [{ text: 'I will act as PrecedentAI, providing legal information but not legal advice.' }]
      });
      
      contents.push(...previousMessages);
      
      contents.push({
        role: 'user',
        parts: [{ text: userInput }]
      });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topK: 40,
            topP: 0.95
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || `API error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('contract') || input.includes('agreement')) {
      return "Contracts are legally binding agreements between parties. For specific contract advice, I'd need more details about your situation. What type of contract are you dealing with?";
    } else if (input.includes('liability') || input.includes('sue')) {
      return "Liability questions are complex and depend on jurisdiction and specific circumstances. Could you provide more details about your situation so I can offer more targeted information?";
    } else if (input.includes('rights') || input.includes('entitled')) {
      return "Legal rights vary significantly by jurisdiction and context. To provide accurate information about your rights, I would need to know your location and the specific situation you're inquiring about.";
    } else if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm PrecedentAI, your AI legal assistant. Please note that while I can provide legal information, I cannot provide legal advice that substitutes for a qualified attorney. How can I help you today?";
    } else {
      return "Thank you for your question. To provide you with accurate legal information, I'd need more specific details. Please note that I provide general legal information, not legal advice. For specific advice tailored to your situation, consulting with a qualified attorney is recommended.";
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full w-full rounded-lg overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm",
      className
    )}>
      {showApiKeyInput && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-zinc-800">
          <div className="text-sm mb-2 font-medium">Select API provider and enter your API key</div>
          <div className="flex gap-2 mb-2">
            <select 
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value as 'deepseek' | 'gemini')}
              className="px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-sm"
            >
              <option value="deepseek">DeepSeek API</option>
              <option value="gemini">Google Gemini API</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={apiProvider === 'deepseek' ? 'DeepSeek API Key' : 'Gemini API Key'}
              className="flex-1 text-sm border-gray-300 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <Button onClick={saveApiKey} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </Button>
          </div>
          <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
            Your API key is stored locally in your browser and never sent to our servers.
            {apiProvider === 'gemini' && (
              <span> For Gemini, use an API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.</span>
            )}
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog open={showSystemPromptSettings} onOpenChange={setShowSystemPromptSettings}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                Custom Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle>Customize System Prompt</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={8}
                    className="resize-none dark:bg-zinc-800 dark:border-zinc-700"
                    placeholder="Enter your custom system prompt..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This prompt defines how the AI assistant behaves. You can customize it to focus on specific legal domains or response styles.
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetSystemPrompt} className="dark:border-zinc-700 dark:hover:bg-zinc-800">
                    Reset to Default
                  </Button>
                  <Button onClick={saveSystemPrompt} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <LegalAnalysisGenerator 
            apiKey={apiKey} 
            apiProvider={apiProvider} 
            onAnalysisComplete={handleAnalysisComplete} 
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => {
              if (!apiKey) {
                toast({
                  variant: "destructive",
                  title: "API Key Required",
                  description: "Please set your Gemini API key first",
                });
                setShowApiKeyInput(true);
                return;
              }
              
              setIsOpen(true);
            }}
          >
            <Zap className="h-3 w-3" />
            Gemini Pro
          </Button>
          
          <GeminiFlashAnalyzer
            apiKey={apiKey}
            onAnalysisComplete={handleAnalysisComplete}
          />
          
          <PdfAnalyzer
            apiKey={apiKey}
            apiProvider={apiProvider}
            onAnalysisComplete={handleAnalysisComplete}
          />
          
          <KnowledgeBaseButton />
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
      
      <div className="flex-1 overflow-y-auto" id="chat-messages">
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
      
      <form 
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900"
      >
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your legal question..."
            className="flex-1 py-6 border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 focus-visible:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim()) {
                  handleSendMessage(e);
                }
              }
            }}
          />
          
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
