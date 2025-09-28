import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Trash, MessageSquare, Plus, Clock, ChevronDown, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import LegalChatMessage from './LegalChatMessage';
import { FactChecklist } from './FactChecklist';
import { LegalAnswerDisplay } from './LegalAnswerDisplay';
import { ForumMismatchAlert } from './ForumMismatchAlert';
import { CitationModal } from './CitationModal';
import LegalAnalysisGenerator from './LegalAnalysisGenerator';
import KnowledgeBaseButton from './KnowledgeBaseButton';
import PdfAnalyzer from './PdfAnalyzer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useConversationMemory } from '@/hooks/useConversationMemory';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { withToolCredits, TOOL_COSTS } from '@/lib/withToolCredits';
import UpgradeModal from '@/components/UpgradeModal';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedChatInterfaceProps {
  className?: string;
}

interface LegalAuthority {
  court?: string;
  year?: number;
  title: string;
  pinpoint?: string;
  holding: string;
  why_relevant?: string;
  primary: boolean;
}

interface NormalizedQuery {
  partySeeking: string;
  relief: string;
  forum: string;
  casePosture: string;
  facts?: any;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ className }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { gateFreeChat, free } = useCredits();
  const { toast } = useToast();
  
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
  
  // Legal RAG states
  const [showFactChecklist, setShowFactChecklist] = useState(false);
  const [missingFacts, setMissingFacts] = useState<string[]>([]);
  const [normalizedQuery, setNormalizedQuery] = useState<NormalizedQuery | null>(null);
  const [forumMismatchError, setForumMismatchError] = useState<any>(null);
  const [selectedCitation, setSelectedCitation] = useState<LegalAuthority | null>(null);
  const [showCitationModal, setShowCitationModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCitationClick = (authority: LegalAuthority) => {
    setSelectedCitation(authority);
    setShowCitationModal(true);
  };

  const processLegalQuery = async (query: string, proceedWithAssumptions = false) => {
    try {
      // Step 1: Normalize the query
      const { data: normalizeData, error: normalizeError } = await supabase.functions.invoke('legal-normalize', {
        body: { query }
      });

      if (normalizeError) throw normalizeError;

      const { norm, must_have } = normalizeData;
      setNormalizedQuery(norm);

      // Step 2: Check for missing critical facts
      if (must_have && must_have.length > 0 && !proceedWithAssumptions) {
        setMissingFacts(must_have);
        setShowFactChecklist(true);
        return;
      }

      // Step 3: Get retrieval context
      const { data: retrievalData, error: retrievalError } = await supabase.functions.invoke('legal-retrieval', {
        body: { 
          userQuery: query, 
          norm, 
          targetForum: norm.forum 
        }
      });

      if (retrievalError) throw retrievalError;

      // Step 4: Get legal answer
      const { data: answerData, error: answerError } = await supabase.functions.invoke('legal-answer', {
        body: { 
          userQuery: query, 
          norm, 
          targetForum: norm.forum,
          context: retrievalData.results || []
        }
      });

      // Handle forum mismatch
      if (answerError && answerError.message?.includes('Forum mismatch')) {
        setForumMismatchError(answerError);
        return;
      }

      if (answerError) throw answerError;

      // Add structured legal response
      const responseMessage = {
        role: 'assistant' as const,
        content: JSON.stringify({
          type: 'legal_analysis',
          data: answerData.answer
        })
      };

      await addMessage(responseMessage);

      // Clear states
      setShowFactChecklist(false);
      setMissingFacts([]);
      setForumMismatchError(null);

    } catch (error) {
      console.error('Legal query processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process legal query';
      
      await addMessage({
        role: 'assistant',
        content: `I apologize, but I encountered an error while processing your legal query: ${errorMessage}. Please try rephrasing your question or contact support if the issue persists.`
      });
    }
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
      // Process as legal query using RAG system (no credits for normal chat)
      await processLegalQuery(userInput);
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

  const handleProceedWithAssumptions = async () => {
    if (normalizedQuery && input) {
      setShowFactChecklist(false);
      await processLegalQuery(input, true);
    }
  };

  const handleSwitchForum = async (newForum: string) => {
    if (normalizedQuery && input) {
      const updatedNorm = { ...normalizedQuery, forum: newForum };
      setNormalizedQuery(updatedNorm);
      setForumMismatchError(null);
      
      // Retry with new forum
      await processLegalQuery(input);
    }
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
    setShowFactChecklist(false);
    setMissingFacts([]);
    setForumMismatchError(null);
    setNormalizedQuery(null);
    toast({
      title: "Conversation Ended",
      description: "Start a new conversation to continue",
    });
  };

  const handleNewConversation = async () => {
    await startNewConversation();
    setShowFactChecklist(false);
    setMissingFacts([]);
    setForumMismatchError(null);
    setNormalizedQuery(null);
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

  const renderMessage = (message: any, index: number) => {
    if (message.role === 'assistant' && message.content.startsWith('{')) {
      try {
        const parsed = JSON.parse(message.content);
        if (parsed.type === 'legal_analysis') {
          return (
            <div key={message.id || index} className="mb-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm text-gray-600 mt-1">Legal Analysis</div>
              </div>
              <LegalAnswerDisplay 
                answer={parsed.data} 
                onCitationClick={handleCitationClick}
              />
            </div>
          );
        }
      } catch (e) {
        // Fall back to regular message display
      }
    }

    return (
      <LegalChatMessage
        key={message.id || index}
        message={message.content}
        isUser={message.role === 'user'}
        isLoading={false}
      />
    );
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
                onClick={handleNewConversation}
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
                    onClick={handleNewConversation}
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
            {/* Fact Checklist Banner */}
            {showFactChecklist && (
              <FactChecklist
                missingFacts={missingFacts}
                onProceedWithAssumptions={handleProceedWithAssumptions}
                onCancel={() => setShowFactChecklist(false)}
              />
            )}

            {/* Forum Mismatch Alert */}
            {forumMismatchError && (
              <ForumMismatchAlert
                error={forumMismatchError}
                onSwitchForum={handleSwitchForum}
                onDismiss={() => setForumMismatchError(null)}
              />
            )}

            {/* Messages */}
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* Loading indicator */}
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
            placeholder="Ask about Indian law, maintenance, divorce, or get legal guidance..."
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

      {/* Citation Modal */}
      <CitationModal
        isOpen={showCitationModal}
        onClose={() => {
          setShowCitationModal(false);
          setSelectedCitation(null);
        }}
        authority={selectedCitation}
      />
    </div>
  );
};

export default EnhancedChatInterface;