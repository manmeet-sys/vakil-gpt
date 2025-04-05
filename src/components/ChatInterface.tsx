
import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Zap, Loader2, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import LegalChatMessage from './LegalChatMessage';
import LegalAnalysisGenerator from './LegalAnalysisGenerator';
import GeminiFlashAnalyzer from './GeminiFlashAnalyzer';
import KnowledgeBaseButton from './KnowledgeBaseButton';
import PdfAnalyzer from './PdfAnalyzer';
import { getGeminiResponse } from './GeminiProIntegration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'deepseek'>(() => 
    localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState('legal-brief');
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const analysisOptions = [
    { value: 'legal-brief', label: 'Legal Brief Generation' },
    { value: 'contract-analysis', label: 'Contract Analysis' },
    { value: 'case-precedent', label: 'Case Precedent Research' },
    { value: 'compliance-check', label: 'Compliance Check' },
    { value: 'risk-assessment', label: 'Legal Risk Assessment' },
    { value: 'document-summary', label: 'Document Summary' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedProvider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setSelectedProvider(storedProvider);
  }, []);

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
      let response = '';
      
      if (selectedProvider === 'gemini') {
        response = await getGeminiResponse(
          `You are VakilGPT, a legal assistant specializing in Indian law. 
          Respond to the following query with accurate legal information relevant to Indian law, Indian legal procedures, Supreme Court and High Court decisions, and the Indian Constitution:
          
          ${input}`
        );
      } else {
        // For DeepSeek (currently using a placeholder response)
        response = "DeepSeek response will be implemented here";
      }

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

  const getPromptTemplate = (type: string, content: string): string => {
    const templates: Record<string, string> = {
      'legal-brief': `Generate a comprehensive legal brief based on the following information, focusing on relevant Indian law. Include Supreme Court and High Court citations, and structured arguments according to Indian legal practice:\n\n${content}`,
      'contract-analysis': `Analyze this contract text from an Indian legal perspective and identify key clauses, potential risks, obligations, and suggested modifications according to Indian contract law:\n\n${content}`,
      'case-precedent': `Research and identify relevant Indian case precedents related to this legal issue. Include case names, citations from Supreme Court and High Courts, and brief summaries of their relevance:\n\n${content}`,
      'compliance-check': `Perform a compliance check on this text to identify potential regulatory issues, focusing on applicable Indian laws and regulations:\n\n${content}`,
      'risk-assessment': `Conduct a legal risk assessment based on this information in the context of Indian law. Identify potential legal risks, their likelihood, potential impact, and mitigation strategies:\n\n${content}`,
      'document-summary': `Provide a comprehensive yet concise summary of this Indian legal document, highlighting key points, implications, and important considerations under Indian law:\n\n${content}`
    };
    
    return templates[type] || templates['document-summary'];
  };

  const generateAnalysis = async () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some text to analyze",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = getPromptTemplate(analysisType, text);
      const analysis = await getGeminiResponse(prompt);
      
      handleAnalysisComplete(analysis);
      setIsOpen(false);
      setText('');
      
      toast({
        title: "Analysis Complete",
        description: `${analysisOptions.find(opt => opt.value === analysisType)?.label} has been generated successfully`,
      });
    } catch (error) {
      console.error(`Error generating analysis:`, error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate analysis",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex flex-col border rounded-xl bg-white dark:bg-zinc-800 shadow-sm h-full ${className}`}>
      {/* Chat Header */}
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            className="text-xs flex items-center gap-1"
          >
            <Trash className="h-3 w-3 mr-1" />
            Clear Chat
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1"
              >
                <Zap className="h-3 w-3" />
                Gemini Pro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800">
              <DialogHeader>
                <DialogTitle>Gemini Pro Legal Analysis</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
                  <Select 
                    value={analysisType} 
                    onValueChange={setAnalysisType}
                  >
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      {analysisOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[250px] w-full resize-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder={`Enter text for ${analysisOptions.find(opt => opt.value === analysisType)?.label}...`}
                />
                
                <Button 
                  onClick={generateAnalysis} 
                  disabled={isGenerating || !text.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Analysis...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate {analysisOptions.find(opt => opt.value === analysisType)?.label}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <LegalAnalysisGenerator
            apiProvider="gemini"
            onAnalysisComplete={handleAnalysisComplete} 
          />
          
          <GeminiFlashAnalyzer
            onAnalysisComplete={handleAnalysisComplete}
          />
          
          <KnowledgeBaseButton />
          
          <PdfAnalyzer 
            apiProvider="gemini"
            onAnalysisComplete={handleAnalysisComplete} 
          />
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Indian law or legal procedures..."
          disabled={isLoading}
          className="flex-1 w-full"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
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
