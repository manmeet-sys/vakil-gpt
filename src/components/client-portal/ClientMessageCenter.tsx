import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { SendHorizontal, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientMessage, ClientPortalRPCFunctions, ClientPortalRPCArgs, ClientPortalRPCReturns } from '@/types/ClientPortalTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClientMessageCenterProps {
  clientId: string;
}

const ClientMessageCenter = ({ clientId }: ClientMessageCenterProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [advocates, setAdvocates] = useState<{id: string, name: string}[]>([]);
  const [selectedAdvocate, setSelectedAdvocate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!clientId) return;
    
    // Fetch advocates assigned to this client
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch advocates assigned to this client
        const { data: advocatesData, error: advocatesError } = await supabase
          .from('court_filings')
          .select('user_id, profiles(id, full_name)')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });
          
        if (advocatesError) throw advocatesError;
        
        // Extract unique advocates
        const uniqueAdvocates = advocatesData?.reduce<{id: string, name: string}[]>((acc, curr) => {
          // @ts-ignore - we know the structure of the returned data
          const advocateId = curr.profiles?.id;
          // @ts-ignore
          const advocateName = curr.profiles?.full_name;
          
          if (advocateId && !acc.some(a => a.id === advocateId)) {
            acc.push({ id: advocateId, name: advocateName || 'Unknown Advocate' });
          }
          return acc;
        }, []) || [];
        
        setAdvocates(uniqueAdvocates);
        
        // Set first advocate as default if available
        if (uniqueAdvocates.length > 0 && !selectedAdvocate) {
          setSelectedAdvocate(uniqueAdvocates[0].id);
        }
        
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load communications data');
        toast.error('Failed to load communications data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [clientId]);
  
  useEffect(() => {
    if (!clientId || !selectedAdvocate) return;
    
    // Fetch messages using RPC function
    const fetchMessages = async () => {
      try {
        setError(null);
        
        const { data, error } = await supabase.rpc<
          ClientMessage[]
        >(
          'get_client_advocate_messages',
          {
            p_client_id: clientId,
            p_advocate_id: selectedAdvocate
          } as ClientPortalRPCArgs<'get_client_advocate_messages'>
        );
          
        if (error) throw error;
        
        if (data) {
          setMessages(data as ClientMessage[]);
          
          // Mark received messages as read
          const unreadMessages = (data as ClientMessage[]).filter(m => 
            m.receiver_id === clientId && !m.is_read
          ).map(m => m.id);
          
          if (unreadMessages && unreadMessages.length > 0) {
            // Mark messages as read using RPC
            await supabase.rpc<
              null
            >(
              'mark_messages_read',
              {
                p_message_ids: unreadMessages
              } as ClientPortalRPCArgs<'mark_messages_read'>
            );
          }
        }
        
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        setError(error.message || 'Failed to load messages');
      }
    };
    
    fetchMessages();
    
    // Scroll to bottom on new messages
    scrollToBottom();
    
    // Set up a subscription for new message via polling (every 5 seconds) 
    // since we can't use the Supabase realtime directly with the DB functions
    const interval = setInterval(fetchMessages, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [clientId, selectedAdvocate]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAdvocate || !user) {
      toast.error('Please enter a message and select an advocate');
      return;
    }
    
    try {
      setSending(true);
      setError(null);
      
      // Send message using RPC
      const { data, error } = await supabase.rpc<
        ClientMessage
      >(
        'add_client_message',
        {
          p_content: newMessage.trim(),
          p_sender_id: clientId,
          p_sender_name: user?.user_metadata?.full_name || 'Client',
          p_receiver_id: selectedAdvocate,
          p_is_read: false
        } as ClientPortalRPCArgs<'add_client_message'>
      );
      
      if (error) throw error;
      
      // Add the new message to the list
      if (data) {
        setMessages(prev => [...prev, data as ClientMessage]);
      }
      
      // Clear input after sending
      setNewMessage('');
      toast.success('Message sent');
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[400px]">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <Skeleton className="h-9 w-32 rounded" />
          <Skeleton className="h-9 w-32 rounded" />
        </div>
        
        <Skeleton className="flex-1 rounded-md mb-4" />
        
        <div className="flex gap-2 items-center">
          <Skeleton className="flex-1 h-10 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </div>
    );
  }
  
  if (advocates.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCircle className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <h3 className="text-md font-medium">No advocates assigned</h3>
        <p className="text-sm text-gray-500 mt-1">
          You'll be able to communicate with your legal team here once an advocate is assigned to your case
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col h-[400px]">
      {/* Advocates selector */}
      {advocates.length > 1 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {advocates.map(advocate => (
            <Button 
              key={advocate.id}
              variant={selectedAdvocate === advocate.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAdvocate(advocate.id)}
              className="whitespace-nowrap"
            >
              {advocate.name}
            </Button>
          ))}
        </div>
      )}
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender_id === clientId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender_id === clientId 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {msg.sender_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{msg.sender_name}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-right text-xs mt-1 opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Message input */}
      <div className="flex gap-2 items-center">
        <Input
          className="flex-1"
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          disabled={sending}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <SendHorizontal className="h-4 w-4 mr-2" />
              Send
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientMessageCenter;
