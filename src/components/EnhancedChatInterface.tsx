import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash, MessageSquare, Plus, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import LegalChatMessage from './LegalChatMessage';
import LegalAnalysisGenerator from './LegalAnalysisGenerator';
import KnowledgeBaseButton from './KnowledgeBaseButton';
import PdfAnalyzer from './PdfAnalyzer';
import { getOpenAIResponse } from './OpenAIIntegration';
import { useIsMobile } from '@/hooks/use-mobile';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { useAuth } from '@/context/AuthContext';
import { useCreditGate } from '@/hooks/useCreditGateSimple';

interface EnhancedChatInterfaceProps {
  className?: string;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ className }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { executeWithCredits } = useCreditGate();
  
  const {
    conversations,
    currentConversation,
    messages,
    isLoading: conversationLoading,
    addMessage,
    switchConversation,
    startNewConversation,
    clearConversation,
    getConversationContext,
    analyzeConversation,
    updateConversationContext
  } = useConversationMemory();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced Indian law system prompt
  const getEnhancedLegalPrompt = (userQuery: string, context: string) => {
    return `You are VakilGPT, an expert AI legal assistant specialized in Indian law with comprehensive knowledge of:

CORE LEGAL FRAMEWORK:
- Indian Constitution (all articles, schedules, amendments)
- New Criminal Laws: Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), Bharatiya Sakshya Adhiniyam (BSA)
- Civil Laws: Indian Contract Act, Property Law, Family Law, Consumer Protection
- Commercial Laws: Companies Act, SEBI regulations, Banking laws, Insolvency Code
- Tax Laws: Income Tax, GST, Customs, State taxes
- Intellectual Property: Copyright, Patents, Trademarks, Designs
- Labor & Employment laws
- Environmental and regulatory compliance

EXPERTISE AREAS:
- Constitutional interpretation and fundamental rights
- Contract drafting and analysis under Indian law
- Criminal procedure and evidence under new codes
- Corporate governance and compliance
- Litigation strategy and case law analysis
- Property transactions and documentation
- Family law matters including marriage, divorce, succession
- Tax planning and compliance
- Startup legal requirements
- Cross-border legal implications

RESPONSE GUIDELINES:
1. Always cite specific legal provisions (sections, articles, rules)
2. Reference recent Supreme Court and High Court judgments when relevant
3. Compare old vs new criminal laws when applicable (IPC/CrPC vs BNS/BNSS)
4. Provide practical, actionable legal advice
5. Mention jurisdiction-specific variations when relevant
6. Include procedural steps and timelines
7. Highlight risks and compliance requirements
8. Suggest documentation needed
9. Be professional yet accessible in language
10. Use both English and Hindi legal terms appropriately

PREVIOUS CONVERSATION CONTEXT:
${context}

USER QUERY: ${userQuery}

Provide a comprehensive, accurate response following Indian legal precedents and current statutory provisions.`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to use the chat feature",
      });
      return;
    }

    // Check if we need to create a new conversation
    if (!currentConversation) {
      await startNewConversation();
    }

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    const userMessage = await addMessage({
      role: 'user',
      content: userInput,
      tokens_used: Math.ceil(userInput.length / 4) // Rough token estimate
    });

    if (!userMessage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save message",
      });
      setIsLoading(false);
      return;
    }

    try {
      await executeWithCredits('doc_analysis', async () => {
        const context = getConversationContext();
        const enhancedPrompt = getEnhancedLegalPrompt(userInput, context);
        
        const response = await getOpenAIResponse(enhancedPrompt, {
          model: 'gpt-4o',
          temperature: 0.3,
          maxTokens: 3000
        });

        const assistantMessage = await addMessage({
          role: 'assistant',
          content: response,
          tokens_used: Math.ceil(response.length / 4),
          legal_context: {
            query_type: detectQueryType(userInput),
            confidence: 'high',
            jurisdiction: 'India'
          }
        });

        if (assistantMessage && currentConversation) {
          // Update conversation context after a few messages
          const allMessages = [...messages, userMessage, assistantMessage];
          if (allMessages.length % 6 === 0) { // Every 6 messages
            const { keywords, summary } = analyzeConversation(allMessages);
            await updateConversationContext(currentConversation.id, summary, keywords);
          }
        }
      });
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

  const detectQueryType = (query: string): string => {
    const queryLower = query.toLowerCase();
    if (queryLower.includes('contract') || queryLower.includes('agreement')) return 'contract';
    if (queryLower.includes('criminal') || queryLower.includes('bns') || queryLower.includes('ipc')) return 'criminal';
    if (queryLower.includes('property') || queryLower.includes('real estate')) return 'property';
    if (queryLower.includes('family') || queryLower.includes('marriage') || queryLower.includes('divorce')) return 'family';
    if (queryLower.includes('company') || queryLower.includes('corporate')) return 'corporate';
    if (queryLower.includes('tax') || queryLower.includes('gst')) return 'tax';
    return 'general';
  };

  const handleAnalysisComplete = (analysis: string) => {
    addMessage({
      role: 'assistant',
      content: analysis,
      legal_context: { analysis_type: 'document', source: 'pdf_analyzer' }
    });
  };

  const clearChat = () => {
    clearConversation();
    toast({
      title: "Conversation Ended",
      description: "Start a new conversation to continue",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversationTitle = (conv: any) => {
    if (conv.title && conv.title !== 'New Legal Consultation') return conv.title;
    if (conv.topic_keywords?.length > 0) {
      return conv.topic_keywords.slice(0, 2).join(', ');
    }
    return `Chat ${formatDate(conv.created_at)}`;
  };

  return (
    <div className={`flex gap-4 h-full ${className}`}>
      {/* Conversation Sidebar - Desktop */}
      {!isMobile && (
        <Card className="w-80 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversations
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={startNewConversation}
                className="h-7 px-2"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-2">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => switchConversation(conv.id)}
                    className={`p-2 rounded text-xs cursor-pointer transition-colors hover:bg-accent ${
                      currentConversation?.id === conv.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="font-medium truncate">
                      {getConversationTitle(conv)}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(conv.updated_at)}
                    </div>
                    {conv.topic_keywords && conv.topic_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {conv.topic_keywords.slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col border rounded-xl bg-card shadow-sm">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-3 border-b">
          {/* Mobile Conversation Toggle */}
          {isMobile && (
            <Collapsible open={showConversations} onOpenChange={setShowConversations}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span className="text-xs">Chats</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="absolute top-full left-0 right-0 z-10 bg-card border rounded-b-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={startNewConversation}
                    className="w-full mb-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New Chat
                  </Button>
                  {conversations.slice(0, 5).map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        switchConversation(conv.id);
                        setShowConversations(false);
                      }}
                      className="p-2 rounded text-xs cursor-pointer hover:bg-accent"
                    >
                      <div className="font-medium truncate">
                        {getConversationTitle(conv)}
                      </div>
                      <div className="text-muted-foreground">
                        {formatDate(conv.updated_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

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

        {/* Current Conversation Info */}
        {currentConversation && (
          <div className="px-3 py-2 bg-accent/50 border-b">
            <div className="text-sm font-medium">
              {getConversationTitle(currentConversation)}
            </div>
            {currentConversation.topic_keywords && currentConversation.topic_keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {currentConversation.topic_keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
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
        </ScrollArea>
        
        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2 bg-card/90 backdrop-blur-sm">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Indian law, analyze documents, or get legal guidance..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim() || !user}
            size="icon"
            className="rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;