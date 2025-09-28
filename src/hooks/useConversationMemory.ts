import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  tokens_used?: number;
  legal_context?: any;
}

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  context_summary?: string;
  topic_keywords?: string[];
}

export const useConversationMemory = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations for the user
  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [user]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const typedMessages = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at,
        tokens_used: msg.tokens_used,
        legal_context: msg.legal_context
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (title?: string, contextSummary?: string, keywords?: string[]) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: title || 'New Legal Consultation',
          context_summary: contextSummary,
          topic_keywords: keywords
        })
        .select()
        .single();

      if (error) throw error;
      
      const newConversation = data as Conversation;
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [user]);

  // Add a message to the current conversation
  const addMessage = useCallback(async (message: Omit<Message, 'id'>, conversationId?: string) => {
    if (!user || (!currentConversation && !conversationId)) return null;

    const targetConversationId = conversationId || currentConversation?.id;
    if (!targetConversationId) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: targetConversationId,
          role: message.role,
          content: message.content,
          tokens_used: message.tokens_used || 0,
          legal_context: message.legal_context
        })
        .select()
        .single();

      if (error) throw error;
      
      const newMessage = {
        id: data.id,
        role: data.role as 'user' | 'assistant',
        content: data.content,
        created_at: data.created_at,
        tokens_used: data.tokens_used,
        legal_context: data.legal_context
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }, [user, currentConversation]);

  // Update conversation context
  const updateConversationContext = useCallback(async (
    conversationId: string, 
    contextSummary: string, 
    keywords: string[]
  ) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({
          context_summary: contextSummary,
          topic_keywords: keywords
        })
        .eq('id', conversationId);

      if (error) throw error;
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, context_summary: contextSummary, topic_keywords: keywords }
            : conv
        )
      );
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => 
          prev ? { ...prev, context_summary: contextSummary, topic_keywords: keywords } : prev
        );
      }
    } catch (error) {
      console.error('Error updating conversation context:', error);
    }
  }, [currentConversation]);

  // Switch to a different conversation
  const switchConversation = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
      await loadMessages(conversationId);
    }
  }, [conversations, loadMessages]);

  // Start a new conversation
  const startNewConversation = useCallback(async () => {
    const newConv = await createConversation();
    if (newConv) {
      // Only add welcome message if there are no existing messages
      setMessages([]);
    }
    return newConv;
  }, [createConversation]);

  // Clear current conversation
  const clearConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
  }, []);

  // Get conversation context for AI
  const getConversationContext = useCallback(() => {
    if (!currentConversation || messages.length === 0) return '';
    
    const recentMessages = messages.slice(-10); // Last 10 messages for context
    const context = recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    const summary = currentConversation.context_summary || '';
    const keywords = currentConversation.topic_keywords?.join(', ') || '';
    
    return `Previous conversation context:
${summary ? `Summary: ${summary}` : ''}
${keywords ? `Keywords: ${keywords}` : ''}
${context}`;
  }, [currentConversation, messages]);

  // Extract keywords and generate summary from conversation
  const analyzeConversation = useCallback((messages: Message[]) => {
    if (messages.length < 3) return { keywords: [], summary: '' };
    
    const content = messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .join(' ');
    
    // Simple keyword extraction (in real app, use AI)
    const legalTerms = [
      'contract', 'agreement', 'property', 'criminal', 'civil', 'constitutional',
      'copyright', 'trademark', 'patent', 'divorce', 'marriage', 'custody',
      'employment', 'labor', 'company', 'corporate', 'tax', 'gst',
      'arbitration', 'litigation', 'court', 'judgment', 'appeal',
      'bns', 'bnss', 'bsa', 'ipc', 'crpc', 'evidence'
    ];
    
    const keywords = legalTerms.filter(term => 
      content.toLowerCase().includes(term)
    ).slice(0, 5);
    
    const summary = `Legal consultation covering: ${keywords.join(', ')}`;
    
    return { keywords, summary };
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    createConversation,
    addMessage,
    switchConversation,
    startNewConversation,
    clearConversation,
    updateConversationContext,
    getConversationContext,
    analyzeConversation,
    loadConversations
  };
};