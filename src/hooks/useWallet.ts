import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Wallet {
  id: string;
  user_id: string;
  current_credits: number;
  last_updated: string;
}

interface Transaction {
  id: string;
  user_id: string;
  action_type: string;
  credits_used: number;
  balance_after: number;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wallet balance
  const fetchWallet = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create wallet if it doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({ user_id: user.id, current_credits: 200 })
          .select()
          .single();

        if (createError) throw createError;
        setWallet(newWallet);
      } else {
        setWallet(data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Deduct credits
  const deductCredits = async (actionType: string, cost: number) => {
    if (!user?.id) {
      toast.error('Please log in to use this feature');
      return false;
    }

    try {
      const { error } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_action_type: actionType,
        p_cost: cost
      });

      if (error) {
        if (error.message.includes('Insufficient credits')) {
          toast.error(`Insufficient credits. You need ${cost} credits but only have ${wallet?.current_credits || 0}.`);
        } else {
          toast.error('Failed to deduct credits');
        }
        return false;
      }

      // Refresh wallet and transactions
      await Promise.all([fetchWallet(), fetchTransactions()]);
      return true;
    } catch (error) {
      console.error('Error deducting credits:', error);
      toast.error('Failed to deduct credits');
      return false;
    }
  };

  // Add credits
  const addCredits = async (amount: number, source: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase.rpc('add_credits', {
        p_user_id: user.id,
        p_amount: amount,
        p_source: source
      });

      if (error) throw error;

      // Refresh wallet and transactions
      await Promise.all([fetchWallet(), fetchTransactions()]);
      toast.success(`${amount} credits added successfully!`);
      return true;
    } catch (error) {
      console.error('Error adding credits:', error);
      toast.error('Failed to add credits');
      return false;
    }
  };

  // Check if user has enough credits
  const hasEnoughCredits = (cost: number) => {
    return (wallet?.current_credits || 0) >= cost;
  };

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([fetchWallet(), fetchTransactions()]).finally(() => {
        setLoading(false);
      });
    } else {
      setWallet(null);
      setTransactions([]);
      setLoading(false);
    }
  }, [user?.id]);

  // Real-time subscription for wallet updates
  useEffect(() => {
    if (!user?.id) return;

    const walletSubscription = supabase
      .channel('wallet-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchWallet();
        }
      )
      .subscribe();

    const transactionSubscription = supabase
      .channel('transaction-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(walletSubscription);
      supabase.removeChannel(transactionSubscription);
    };
  }, [user?.id]);

  return {
    wallet,
    transactions,
    loading,
    deductCredits,
    addCredits,
    hasEnoughCredits,
    refreshWallet: fetchWallet,
    refreshTransactions: fetchTransactions
  };
};