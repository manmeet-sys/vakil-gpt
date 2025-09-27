import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Balance {
  tool_credits: number;
  free_chat_quota: number;
  free_chat_used: number;
}

export function useCredits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [free, setFree] = useState<{used: number; quota: number}>({used: 0, quota: 0});

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('credits-balance', {
        headers: {
          authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;
      
      setBalance(data.tool_credits ?? 0);
      setFree({ used: data.free_chat_used ?? 0, quota: data.free_chat_quota ?? 0 });
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
    setLoading(false);
  }, [user?.id]);

  const gateFreeChat = useCallback(async () => {
    if (!user?.id) {
      toast.error('Please log in to chat');
      return { allowed: false, remaining: 0 };
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-free', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      if (data.ok) {
        setFree((f) => ({ ...f, used: f.used + 1 }));
        return { allowed: true, remaining: data.remaining };
      }
      return { allowed: false, remaining: 0, credits: data.credits };
    } catch (error) {
      console.error('Error consuming free chat:', error);
      toast.error('Failed to consume free chat');
      return { allowed: false, remaining: 0 };
    }
  }, [user?.id]);

  const debitTool = useCallback(async (
    amount: number, 
    toolName: string, 
    meta: any = {}, 
    idempotencyKey?: string
  ) => {
    if (!user?.id) {
      toast.error('Please log in to use this feature');
      return { ok: false, error: 'NOT_AUTHENTICATED' };
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
          return { ok: false, error: 'INSUFFICIENT_FUNDS' };
        }
        return { ok: false, error: 'DEBIT_FAILED' };
      }

      setBalance(data.balance);
      return { ok: true, tx_id: data.tx_id, balance: data.balance };
    } catch (error) {
      console.error('Error debiting credits:', error);
      return { ok: false, error: 'DEBIT_FAILED' };
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, balance, free, refresh, gateFreeChat, debitTool };
}