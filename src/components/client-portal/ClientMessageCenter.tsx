
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { SendHorizontal, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
}

interface ClientMessageCenterProps {
  clientId: string;
}

const ClientMessageCenter = ({ clientId }: ClientMessageCenterProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [advocates, setAdvocates] = useState<{id: string, name: string}[]>([]);
  const [selectedAdvocate, setSelectedAdvocate] = useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!clientId) return;
    
    // Fetch messages and advocates data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch advocates assigned to this client
        const { data: advocatesData, error: advocatesError } = await supabase
          .from('court_filings')
          .select('user_id, profiles:user_id(id, full_name)')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false });
          
        if (advocatesError) throw advocatesError;
        
        // Extract unique advocates
        const uniqueAdvocates = advocatesData?.reduce<{id: string, name: string}[]>((acc, curr) => {
          // @ts-ignore
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
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load communications data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [clientId]);
  
  useEffect(() => {
    if (!clientId || !selectedAdvocate) return;
    
    // Fetch messages between client and selected advocate
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('client_messages')
          .select('*')
          .or(`and(sender_id.eq.${clientId},receiver_id.eq.${selectedAdvocate}),and(sender_id.eq.${selectedAdvocate},receiver_id.eq.${clientId})`)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setMessages(data || []);
        
        // Mark received messages as read
        const unreadMessages = data?.filter(m => 
          m.receiver_id === clientId && !m.is_read
        ).map(m => m.id);
        
        if (unreadMessages && unreadMessages.length > 0) {
          await supabase
            .from('client_messages')
            .update({ is_read: true })
            .in('id', unreadMessages);
        }
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`client-messages-${clientId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'client_messages',
        filter: `or(receiver_id=eq.${clientId},sender_id=eq.${clientId})`
      }, payload => {
        // @ts-ignore
        const newMsg = payload.new as Message;
        // Only add if it's from the currently selected conversation
        if (
          (newMsg.sender_id === clientId && newMsg.receiver_id === selectedAdvocate) ||
          (newMsg.sender_id === selectedAdvocate && newMsg.receiver_id === clientId)
        ) {
          setMessages(prev => [...prev, newMsg]);
          
          // Mark as read if we received it
          if (newMsg.receiver_id === clientId) {
            supabase
              .from('client_messages')
              .update({ is_read: true })
              .eq('id', newMsg.id);
          }
        }
      })
      .subscribe();
      
    // Scroll to bottom on new messages
    scrollToBottom();
    
    return () => {
      supabase.removeChannel(channel);
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
    if (!newMessage.trim() || !selectedAdvocate) return;
    
    try {
      setSending(true);
      
      const { data, error } = await supabase
        .from('client_messages')
        .insert([
          {
            content: newMessage.trim(),
            sender_id: clientId,
            sender_name: user?.user_metadata?.full_name || 'Client',
            receiver_id: selectedAdvocate,
            is_read: false
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Clear input after sending
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-3 text-sm text-gray-500">Loading messages...</p>
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
