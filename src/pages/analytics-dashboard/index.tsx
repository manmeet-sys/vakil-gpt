
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, User, Activity, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import ClearAnalyticsButton from '@/components/ClearAnalyticsButton';

// Define the analytics event interface
interface AnalyticsEvent {
  id: string;
  created_at: string;
  user_id: string | null;
  event_name: string;
  page_path: string;
  event_data: Record<string, any> | null;
  user_agent: string | null;
  ip_address: string | null;
  referrer: string | null;
}

const AnalyticsDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [pageViews, setPageViews] = useState<{name: string, value: number}[]>([]);
  const [actionEvents, setActionEvents] = useState<{name: string, value: number}[]>([]);
  const { user } = useAuth();

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        setEvents(data as AnalyticsEvent[]);
        
        // Process page views
        const pageViewsMap = new Map<string, number>();
        data.filter(event => event.event_name === 'page_view')
            .forEach(event => {
              const path = event.page_path;
              pageViewsMap.set(path, (pageViewsMap.get(path) || 0) + 1);
            });
        
        const pageViewsData = Array.from(pageViewsMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        
        setPageViews(pageViewsData);
        
        // Process action events
        const actionsMap = new Map<string, number>();
        data.filter(event => event.event_name.startsWith('action_'))
            .forEach(event => {
              const action = event.event_name.replace('action_', '');
              actionsMap.set(action, (actionsMap.get(action) || 0) + 1);
            });
        
        const actionsData = Array.from(actionsMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        
        setActionEvents(actionsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleClearData = () => {
    setEvents([]);
    setPageViews([]);
    setActionEvents([]);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Analytics Dashboard | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchAnalyticsData}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ClearAnalyticsButton onClear={handleClearData} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Activity className="h-3 w-3 mr-1" />
                <span>Recent analytics events</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => e.event_name === 'page_view').length}
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Total page views recorded</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(events.map(e => e.user_id).filter(Boolean)).size}
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <User className="h-3 w-3 mr-1" />
                <span>Distinct users tracked</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most viewed pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {pageViews.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pageViews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No page view data to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Actions</CardTitle>
              <CardDescription>Most frequent user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {actionEvents.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={actionEvents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No user action data to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest analytics events captured</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading analytics data...</div>
            ) : events.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Event</th>
                      <th className="text-left py-3 px-4">Page</th>
                      <th className="text-left py-3 px-4">User ID</th>
                      <th className="text-left py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.slice(0, 10).map((event) => (
                      <tr key={event.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">{event.event_name}</td>
                        <td className="py-3 px-4">{event.page_path}</td>
                        <td className="py-3 px-4">{event.user_id ? event.user_id.slice(0, 8) + '...' : 'Anonymous'}</td>
                        <td className="py-3 px-4">{new Date(event.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No analytics events found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AnalyticsDashboardPage;
