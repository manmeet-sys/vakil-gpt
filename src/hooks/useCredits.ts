import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface UserBalance {
  tool_credits: number;
  free_chat_quota: number;
  free_chat_used: number;
}

interface DebitResult {
  balance: number;
  tx_id: string;
}

interface FreeChatResult {
  ok: boolean;
  remaining: number;
  credits?: number;
}

export const useCredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user balance
  const fetchBalance = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.functions.invoke('credits-balance', {
        headers: {
          authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Failed to fetch balance');
    }
  };

  // Debit credits for tool usage
  const debitCredits = async (
    amount: number,
    toolName: string,
    meta: any = {},
    idempotencyKey?: string
  ): Promise<DebitResult | null> => {
    if (!user?.id) {
      toast.error('Please log in to use this feature');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('credits-debit', {
        body: { amount, toolName, meta, idempotencyKey },
        headers: {
          authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) {
        if (error.message?.includes('INSUFFICIENT_FUNDS')) {
          toast.error(`Insufficient credits. You need ${amount} credits.`);
        } else {
          toast.error('Failed to debit credits');
        }
        return null;
      }

      await fetchBalance(); // Refresh balance
      return data;
    } catch (error) {
      console.error('Error debiting credits:', error);
      toast.error('Failed to debit credits');
      return null;
    }
  };

  // Consume free chat quota
  const consumeFreeChat = async (): Promise<FreeChatResult | null> => {
    if (!user?.id) {
      toast.error('Please log in to chat');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-free', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      await fetchBalance(); // Refresh balance
      return data;
    } catch (error) {
      console.error('Error consuming free chat:', error);
      toast.error('Failed to consume free chat');
      return null;
    }
  };

  // Check if user has enough credits
  const hasEnoughCredits = (amount: number): boolean => {
    return (balance?.tool_credits || 0) >= amount;
  };

  // Check if user has free chats remaining
  const hasFreeChatRemaining = (): boolean => {
    if (!balance) return false;
    return balance.free_chat_used < balance.free_chat_quota;
  };

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetchBalance().finally(() => setLoading(false));
    } else {
      setBalance(null);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    balance,
    loading,
    debitCredits,
    consumeFreeChat,
    hasEnoughCredits,
    hasFreeChatRemaining,
    refreshBalance: fetchBalance
  };
};