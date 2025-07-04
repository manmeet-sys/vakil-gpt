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
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
}

interface Matter {
  id: string;
  title: string;
  client_id: string | null;
  description: string | null;
  status: string | null;
  matter_number: string | null;
  practice_area: string | null;
  opened_date: string | null;
  closed_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
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
  case_id: string | null;
  invoice_number: string | null;
  invoice_status: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
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
  paid_date: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
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
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  addMatter: (matter: Omit<Matter, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
  addBillingEntry: (entry: Partial<Omit<BillingEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
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

  // Helper function to send data to n8n webhook
  const sendToWebhook = async (type: string, data: any) => {
    try {
      await supabase.functions.invoke('n8n-webhook', {
        body: { type, data }
      });
    } catch (error) {
      console.error('Failed to send data to webhook:', error);
      // Don't throw error to avoid disrupting the main operation
    }
  };

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use type assertion with any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
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
      // Use type assertion with any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
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
      
      // Use type assertion with proper casting
      setBillingEntries((data || []) as unknown as BillingEntry[]);
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
      // Use type assertion with any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
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

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use type assertion with any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
        .from('clients')
        .insert([{ ...client, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newClient = data[0] as Client;
        setClients(prev => [...prev, newClient]);
        
        // Send to webhook
        await sendToWebhook('client_added', newClient);
        
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

  const addMatter = async (matter: Omit<Matter, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use type assertion with any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
        .from('matters')
        .insert([{ ...matter, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newMatter = data[0] as Matter;
        setMatters(prev => [...prev, newMatter]);
        
        // Send to webhook
        await sendToWebhook('matter_added', newMatter);
        
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

  const addBillingEntry = async (entry: Partial<Omit<BillingEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      console.log("Adding billing entry:", entry);
      
      // Make sure required fields are present or set defaults
      const completeEntry = {
        activity_type: entry.activity_type || 'Other',
        hours_spent: entry.hours_spent || 0,
        client_name: entry.client_name,
        date: entry.date,
        description: entry.description,
        hourly_rate: entry.hourly_rate,
        case_id: entry.case_id,
        invoice_number: entry.invoice_number,
        invoice_status: entry.invoice_status || 'unbilled',
        user_id: user.id
      };
      
      console.log("Complete entry to be submitted:", completeEntry);
      
      const { data, error } = await supabase
        .from('billing_entries')
        .insert(completeEntry)
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Response data:", data);
      
      if (data && data.length > 0) {
        const newEntry = data[0] as unknown as BillingEntry;
        setBillingEntries(prev => [...prev, newEntry]);
        
        // Send to webhook
        await sendToWebhook('billing_entry_added', newEntry);
        
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

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Use type assertion with any to bypass TypeScript errors
      const { data, error } = await (supabase as any)
        .from('invoices')
        .insert([{ ...invoice, user_id: user.id }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newInvoice = data[0] as Invoice;
        setInvoices(prev => [...prev, newInvoice]);
        
        // Send to webhook
        await sendToWebhook('invoice_created', newInvoice);
        
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
      
      const updatedEntry = { ...billingEntries.find(e => e.id === id), ...entry };
      setBillingEntries(prev => 
        prev.map(item => item.id === id ? { ...item, ...entry } : item)
      );
      
      // Send to webhook
      await sendToWebhook('billing_entry_updated', { id, ...updatedEntry });
      
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
      const entryToDelete = billingEntries.find(e => e.id === id);
      
      const { error } = await supabase
        .from('billing_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBillingEntries(prev => prev.filter(item => item.id !== id));
      
      // Send to webhook
      await sendToWebhook('billing_entry_deleted', { id, deleted_entry: entryToDelete });
      
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
