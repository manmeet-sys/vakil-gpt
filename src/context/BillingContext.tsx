
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface Matter {
  id: string;
  title: string;
  client_id: string | null;
  status: string | null;
  description: string | null;
}

interface BillingEntry {
  id: string;
  client_name: string | null;
  activity_type: string;
  hours_spent: number;
  date: string | null;
  description: string | null;
  hourly_rate: number | null;
  amount: number | null;
  matter_id: string | null;
  invoice_id: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | null;
  matter_id: string | null;
  amount: number | null;
  tax_amount: number | null;
  total_amount: number | null;
  status: string | null;
  issue_date: string | null;
  due_date: string | null;
}

interface BillingContextType {
  clients: Client[];
  matters: Matter[];
  billingEntries: BillingEntry[];
  invoices: Invoice[];
  loading: boolean;
  error: Error | null;
  fetchClients: () => Promise<void>;
  fetchMatters: () => Promise<void>;
  fetchBillingEntries: () => Promise<void>;
  fetchInvoices: () => Promise<void>;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  addMatter: (matter: Omit<Matter, 'id'>) => Promise<void>;
  addBillingEntry: (entry: Omit<BillingEntry, 'id'>) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateBillingEntry: (id: string, entry: Partial<BillingEntry>) => Promise<void>;
  deleteBillingEntry: (id: string) => Promise<void>;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [billingEntries, setBillingEntries] = useState<BillingEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err as Error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatters = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matters')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setMatters(data || []);
    } catch (err) {
      console.error('Error fetching matters:', err);
      setError(err as Error);
      toast.error('Failed to load matters');
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingEntries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('billing_entries')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setBillingEntries(data || []);
    } catch (err) {
      console.error('Error fetching billing entries:', err);
      setError(err as Error);
      toast.error('Failed to load billing entries');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('issue_date', { ascending: false });
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err as Error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setClients(prev => [...prev, data[0] as Client]);
        toast.success('Client added successfully');
      }
    } catch (err) {
      console.error('Error adding client:', err);
      setError(err as Error);
      toast.error('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const addMatter = async (matter: Omit<Matter, 'id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matters')
        .insert([{ ...matter, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setMatters(prev => [...prev, data[0] as Matter]);
        toast.success('Matter added successfully');
      }
    } catch (err) {
      console.error('Error adding matter:', err);
      setError(err as Error);
      toast.error('Failed to add matter');
    } finally {
      setLoading(false);
    }
  };

  const addBillingEntry = async (entry: Omit<BillingEntry, 'id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('billing_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setBillingEntries(prev => [...prev, data[0] as BillingEntry]);
        toast.success('Billing entry added successfully');
      }
    } catch (err) {
      console.error('Error adding billing entry:', err);
      setError(err as Error);
      toast.error('Failed to add billing entry');
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoice, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setInvoices(prev => [...prev, data[0] as Invoice]);
        toast.success('Invoice created successfully');
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err as Error);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const updateBillingEntry = async (id: string, entry: Partial<BillingEntry>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('billing_entries')
        .update(entry)
        .eq('id', id);
      
      if (error) throw error;
      
      setBillingEntries(prev => 
        prev.map(item => item.id === id ? { ...item, ...entry } : item)
      );
      
      toast.success('Billing entry updated successfully');
    } catch (err) {
      console.error('Error updating billing entry:', err);
      setError(err as Error);
      toast.error('Failed to update billing entry');
    } finally {
      setLoading(false);
    }
  };

  const deleteBillingEntry = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('billing_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBillingEntries(prev => prev.filter(item => item.id !== id));
      toast.success('Billing entry deleted successfully');
    } catch (err) {
      console.error('Error deleting billing entry:', err);
      setError(err as Error);
      toast.error('Failed to delete billing entry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchClients(),
        fetchMatters(),
        fetchBillingEntries(),
        fetchInvoices()
      ]).then(() => setLoading(false));
    } else {
      setClients([]);
      setMatters([]);
      setBillingEntries([]);
      setInvoices([]);
      setLoading(false);
    }
  }, [user]);

  const value = {
    clients,
    matters,
    billingEntries,
    invoices,
    loading,
    error,
    fetchClients,
    fetchMatters,
    fetchBillingEntries,
    fetchInvoices,
    addClient,
    addMatter,
    addBillingEntry,
    addInvoice,
    updateBillingEntry,
    deleteBillingEntry
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
