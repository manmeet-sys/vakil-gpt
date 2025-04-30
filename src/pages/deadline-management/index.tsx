
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import LegalToolLayout from '@/components/LegalToolLayout';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

// Import refactored components
import DeadlineForm from '@/components/deadline-management/DeadlineForm';
import DeadlineList from '@/components/deadline-management/DeadlineList';
import DashboardCards from '@/components/deadline-management/DashboardCards';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    toast.success("New deadline added successfully!");
  };

  const handleDeadlineUpdated = () => {
    fetchDeadlines();
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <LegalToolLayout
      title="Deadline Management"
      description="Create and track legal deadlines and court filing dates"
      icon={<Clock className="w-6 h-6 text-white" />}
    >
      <Toaster richColors position="top-right" />
      
      <motion.div 
        className="container mx-auto px-4 py-6 max-w-7xl"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        {/* Stats Dashboard */}
        <motion.div variants={itemVariants}>
          <DashboardCards 
            upcomingCount={getUpcomingCount()}
            urgentCount={urgentCount}
            completedCount={completedCount}
            totalDeadlines={deadlines.length}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form */}
          <motion.div className="lg:col-span-1 order-2 lg:order-1" variants={itemVariants}>
            <DeadlineForm 
              onDeadlineAdded={handleDeadlineAdded}
              currentUserId={currentUserId}
            />
            
            {/* Tips alert */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                  <p className="font-medium mb-1">Tips for effective deadline management:</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Set reminders for important deadlines</li>
                    <li>Prioritize urgent tasks with appropriate labels</li>
                    <li>Update status promptly when completed</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          </motion.div>
          
          {/* Right column - Deadlines list */}
          <motion.div className="lg:col-span-2 order-1 lg:order-2" variants={itemVariants}>
            <DeadlineList 
              deadlines={deadlines}
              isLoading={isLoading}
              onDeadlineUpdated={handleDeadlineUpdated}
            />
          </motion.div>
        </div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default DeadlineManagementPage;
