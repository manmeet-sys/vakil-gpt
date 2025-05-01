
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { downloadFile } from '@/utils/documentUtils';
import { 
  ClientDocument, 
  StatusUpdate, 
  clientPortalRPC 
} from '@/types/client-portal';

// Types for client portal data
interface ClientCase {
  id: string;
  case_title: string;
  case_number: string;
  status: string;
  court_name: string;
  filing_date?: string;
  hearing_date?: string | null;
  progress: number;
}

export const useClientPortal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadUpdates, setUnreadUpdates] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('advocate-portal-updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'case_status_updates',
        filter: `client_id=eq.${user.id}`
      }, payload => {
        const newUpdate = payload.new as StatusUpdate;
        setStatusUpdates(prev => [newUpdate, ...prev]);
        toast.info("You have a new case status update!");
        setUnreadUpdates(prev => prev + 1);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Fetch client data
  const fetchClientData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch client documents using RPC wrapper
      const documentsResponse = await clientPortalRPC(
        'get_client_documents',
        {
          p_client_id: user.id
        }
      );
      
      if (documentsResponse.error) throw documentsResponse.error;
      
      // Fetch status updates using RPC wrapper
      const updatesResponse = await clientPortalRPC(
        'get_client_status_updates',
        {
          p_client_id: user.id
        }
      );
      
      if (updatesResponse.error) throw updatesResponse.error;
      
      // Set the data in state 
      setDocuments(documentsResponse.data || []);
      setStatusUpdates(updatesResponse.data || []);
      
      // Count unread updates
      const updatesData = updatesResponse.data || [];
      const unread = updatesData.filter(update => !update.is_read).length;
      
      // Fetch cases
      const casesResponse = await supabase
        .from('court_filings')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (casesResponse.error) throw casesResponse.error;
      
      // Transform case data to include progress
      const transformedCases = casesResponse.data?.map(caseItem => ({
        ...caseItem,
        progress: calculateCaseProgress(caseItem.status || 'draft')
      })) as ClientCase[];
      
      setClientCases(transformedCases || []);
      setUnreadUpdates(unread);
    } catch (error: any) {
      console.error('Error fetching client data:', error);
      setError(error.message || 'Failed to load your data');
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate case progress based on status
  const calculateCaseProgress = (status: string): number => {
    switch (status) {
      case 'draft': return 10;
      case 'filed': return 30;
      case 'pending': return 50;
      case 'scheduled': return 70;
      case 'active': return 80;
      case 'closed': return 100;
      default: return 0;
    }
  };
  
  // Mark update as read
  const markUpdateAsRead = async (updateId: string) => {
    try {
      // Use RPC wrapper to mark status update as read
      const { error } = await clientPortalRPC(
        'mark_status_update_read',
        {
          p_update_id: updateId
        }
      );
      
      if (error) throw error;
      
      setStatusUpdates(prev => prev.map(update => 
        update.id === updateId ? { ...update, is_read: true } : update
      ));
      
      setUnreadUpdates(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking update as read:', error);
      toast.error('Failed to mark update as read');
    }
  };

  // Handle document download
  const handleDocumentDownload = async (document: ClientDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(document.path);
        
      if (error) throw error;
      
      // Create a download link using our utility function
      if (data instanceof Blob) {
        const url = URL.createObjectURL(data);
        downloadFile(url, document.name);
        toast.success('Document download started');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };
  
  // Initialize data on load
  useEffect(() => {
    fetchClientData();
  }, [user]);
  
  return {
    user,
    loading,
    error,
    documents,
    statusUpdates,
    clientCases,
    unreadUpdates,
    searchTerm,
    setSearchTerm,
    fetchClientData,
    markUpdateAsRead,
    handleDocumentDownload
  };
};

export type { ClientCase };
