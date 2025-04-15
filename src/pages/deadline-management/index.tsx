
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import LegalToolLayout from '@/components/LegalToolLayout';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import DeadlineForm from '@/components/deadline-management/DeadlineForm';
import DeadlineList from '@/components/deadline-management/DeadlineList';
import DashboardCards from '@/components/deadline-management/DashboardCards';

const DeadlineManagementPage = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch deadlines from the database
  const fetchDeadlines = async () => {
    setIsLoading(true);
    try {
      if (!currentUserId) return;
      
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('user_id', currentUserId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      // Count completed and urgent deadlines
      const completed = data?.filter(d => d.status === 'completed').length || 0;
      const urgent = data?.filter(d => d.priority === 'Urgent' && d.status !== 'completed').length || 0;
      
      setCompletedCount(completed);
      setUrgentCount(urgent);
      setDeadlines(data || []);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      toast.error("Failed to load deadlines. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchDeadlines();
    }
  }, [currentUserId]);

  // Function to get upcoming deadlines count for dashboard
  const getUpcomingCount = () => {
    return deadlines.filter(d => {
      const deadlineDate = new Date(d.due_date);
      const today = new Date();
      return deadlineDate >= today && d.status !== 'completed';
    }).length;
  };

  // Handlers for child component actions
  const handleDeadlineAdded = () => {
    fetchDeadlines();
  };

  const handleDeadlineUpdated = () => {
    fetchDeadlines();
  };

  return (
    <LegalToolLayout
      title="Deadline Management"
      description="Create and track legal deadlines and court filing dates"
      icon={<Clock className="w-6 h-6 text-white" />}
    >
      <Toaster richColors position="top-right" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <DashboardCards 
          upcomingCount={getUpcomingCount()}
          urgentCount={urgentCount}
          completedCount={completedCount}
          totalDeadlines={deadlines.length}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Form */}
          <div className="md:col-span-1">
            <DeadlineForm 
              onDeadlineAdded={handleDeadlineAdded}
              currentUserId={currentUserId}
            />
          </div>
          
          {/* Right column - Deadlines list */}
          <div className="md:col-span-2">
            <DeadlineList 
              deadlines={deadlines}
              isLoading={isLoading}
              onDeadlineUpdated={handleDeadlineUpdated}
            />
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default DeadlineManagementPage;
