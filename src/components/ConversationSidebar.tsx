import React from 'react';
import { MessageSquare, Plus, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  context_summary?: string;
  topic_keywords?: string[];
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversation,
  onConversationSelect,
  onNewConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const title = getConversationTitle(conv).toLowerCase();
    const keywords = conv.topic_keywords?.join(' ').toLowerCase() || '';
    const summary = conv.context_summary?.toLowerCase() || '';
    
    return title.includes(searchLower) || 
           keywords.includes(searchLower) || 
           summary.includes(searchLower);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getConversationTitle = (conv: Conversation) => {
    if (conv.title && conv.title !== 'New Legal Consultation') return conv.title;
    if (conv.topic_keywords?.length > 0) {
      return conv.topic_keywords.slice(0, 2).join(', ');
    }
    return `Chat ${formatDate(conv.created_at)}`;
  };

  const getPreview = (conv: Conversation) => {
    if (conv.context_summary) {
      return conv.context_summary.slice(0, 60) + (conv.context_summary.length > 60 ? '...' : '');
    }
    return 'Legal consultation';
  };

  return (
    <Card className="w-80 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Conversations
          </CardTitle>
          <Button 
            size="sm" 
            onClick={onNewConversation}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-3">
          <div className="space-y-2 pb-4">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
                {!searchQuery && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onNewConversation}
                    className="mt-2"
                  >
                    Start your first chat
                  </Button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onConversationSelect(conv.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent group ${
                    currentConversation?.id === conv.id 
                      ? 'bg-accent border border-primary/20 shadow-sm' 
                      : 'border border-transparent hover:border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {getConversationTitle(conv)}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      {formatDate(conv.updated_at)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {getPreview(conv)}
                  </p>
                  
                  {conv.topic_keywords && conv.topic_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {conv.topic_keywords.slice(0, 3).map((keyword, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-xs px-1.5 py-0 h-5"
                        >
                          {keyword}
                        </Badge>
                      ))}
                      {conv.topic_keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                          +{conv.topic_keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};