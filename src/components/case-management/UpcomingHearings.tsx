
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
import { Calendar, MoreHorizontal, Clock, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Deadline {
  id: string;
  title: string;
  case_title?: string | null;
  client_name?: string | null;
  court_name?: string | null;
  due_date: string;
  time_left: {
    days: number;
    isUpcoming: boolean;
  };
}

// Define a specific type for our data response
type DeadlineData = {
  id: string;
  title: string;
  case_title?: string | null;
  client_name?: string | null;
  court_name?: string | null;
  due_date: string;
};

const UpcomingHearings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hearings, setHearings] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingHearings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const today = new Date().toISOString();
        
        // First try to fetch from deadlines table
        const { data: deadlinesData, error: deadlinesError } = await supabase
          .from('deadlines')
          .select('id, title, due_date, case_title, client_name, court_name')
          .gte('due_date', today)
          .order('due_date', { ascending: true })
          .limit(5);
        
        if (deadlinesError) {
          console.error('Error fetching deadlines:', deadlinesError);
          // Check if the error is related to missing columns
          if (deadlinesError.message.includes("column") && deadlinesError.message.includes("does not exist")) {
            // Fallback to basic deadline data if columns don't exist yet
            const { data: basicDeadlines, error: basicError } = await supabase
              .from('deadlines')
              .select('id, title, due_date')
              .gte('due_date', today)
              .order('due_date', { ascending: true })
              .limit(5);
              
            if (basicError) throw basicError;
            
            // Transform basic data to match our interface
            const hearingsData: DeadlineData[] = (basicDeadlines || []).map(deadline => ({
              id: deadline.id,
              title: deadline.title,
              due_date: deadline.due_date,
              case_title: null,
              client_name: null,
              court_name: null
            }));
            
            setHearings(calculateTimeLeft(hearingsData));
            setLoading(false);
            return;
          } else {
            throw deadlinesError;
          }
        }
        
        // If no dedicated hearings, fallback to court filings hearing dates
        let hearingsData: DeadlineData[] = deadlinesData || [];
        
        if (hearingsData.length < 5) {
          const { data: filingData, error: filingError } = await supabase
            .from('court_filings')
            .select('id, case_title, client_name, court_name, hearing_date')
            .not('hearing_date', 'is', null)
            .gte('hearing_date', today)
            .order('hearing_date', { ascending: true })
            .limit(5 - hearingsData.length);
            
          if (filingError) throw filingError;
          
          // Transform filing data to match deadline structure
          if (filingData && filingData.length > 0) {
            const transformedFilings: DeadlineData[] = filingData.map(filing => ({
              id: filing.id,
              title: `Hearing: ${filing.case_title || 'Untitled Case'}`,
              case_title: filing.case_title,
              client_name: filing.client_name,
              court_name: filing.court_name,
              due_date: filing.hearing_date
            }));
            
            hearingsData = [...hearingsData, ...transformedFilings];
          }
        }
        
        setHearings(calculateTimeLeft(hearingsData));
      } catch (error: any) {
        console.error('Error fetching upcoming hearings:', error.message);
        toast.error('Failed to load hearings');
        setHearings([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingHearings();
  }, [user]);

  // Calculate days left for each hearing
  const calculateTimeLeft = (hearingsData: DeadlineData[]): Deadline[] => {
    return hearingsData.map((hearing) => {
      const hearingDate = new Date(hearing.due_date);
      const today = new Date();
      
      // Set both dates to midnight for accurate day calculation
      hearingDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const diffTime = hearingDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        ...hearing,
        time_left: {
          days: diffDays,
          isUpcoming: diffDays <= 5, // Mark as upcoming if within 5 days
        },
      };
    });
  };

  // Format date to Indian format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const handleViewCalendar = () => {
    // Navigate to deadlines management
    navigate('/deadline-management');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Upcoming Hearings
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Track your upcoming court appearances
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading hearings...</div>
        ) : hearings.length === 0 ? (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">No upcoming hearings</h3>
            <p className="text-sm text-gray-500 mt-1">
              When you add hearings to your cases, they will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {hearings.map((hearing) => (
              <div
                key={hearing.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition cursor-pointer"
                onClick={() => navigate('/deadline-management', { 
                  state: { selectedDeadlineId: hearing.id } 
                })}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    hearing.time_left.isUpcoming 
                      ? "bg-amber-100 dark:bg-amber-900/30" 
                      : "bg-blue-100 dark:bg-blue-900/30"
                  }`}>
                    <Calendar className={`h-5 w-5 ${
                      hearing.time_left.isUpcoming 
                        ? "text-amber-600 dark:text-amber-400" 
                        : "text-blue-600 dark:text-blue-400"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900 dark:text-white mr-2">
                        {formatDate(hearing.due_date)}
                      </p>
                      {hearing.time_left.isUpcoming && (
                        <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800/30 text-xs">
                          {hearing.time_left.days === 0 
                            ? "Today" 
                            : hearing.time_left.days === 1 
                              ? "Tomorrow" 
                              : `In ${hearing.time_left.days} days`}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                      {hearing.case_title && (
                        <span className="flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {hearing.case_title}
                        </span>
                      )}
                      {hearing.court_name && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {hearing.court_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={handleViewCalendar}>
          <Calendar className="h-4 w-4 mr-1" />
          View Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingHearings;
