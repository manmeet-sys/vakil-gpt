
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

const ClientsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .limit(5)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setClients(data || []);
      } catch (error: any) {
        console.error('Error fetching clients:', error.message);
        toast.error('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [user]);

  const handleAddClient = () => {
    // Navigate to the client management section
    navigate('/case-management', { state: { showClientManagement: true } });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Recent Clients
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your clients and their contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">No clients yet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add your first client to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition cursor-pointer"
                onClick={() => navigate('/case-management', { state: { selectedClientId: client.id } })}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                    <p className="text-xs text-gray-500">
                      {client.email ? client.email : (client.phone ? client.phone : 'No contact info')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleAddClient}>
          <Plus className="h-4 w-4 mr-1" />
          Add New Client
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientsList;
