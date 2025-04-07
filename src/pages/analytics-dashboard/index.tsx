import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, LineChart, Activity, Search, BarChart2, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays } from 'date-fns';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Types for analytics data
interface AnalyticsEvent {
  id: string;
  user_id: string | null;
  event_name: string;
  page_path: string;
  event_data: Record<string, any>;
  user_agent: string | null;
  created_at: string;
  referrer: string | null;
}

// Main dashboard component
const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEvent[]>([]);
  const [timeRange, setTimeRange] = useState('7days');
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      // For simplicity, we're checking if the email is admin@example.com
      // In a real app, you would have a more robust admin check
      if (user.email === 'admin@example.com') {
        setIsAdmin(true);
        fetchAnalyticsData();
      } else {
        toast.error('You do not have access to this page');
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [user, navigate]);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Calculate date range
      let fromDate;
      switch (timeRange) {
        case '24hours':
          fromDate = subDays(new Date(), 1);
          break;
        case '7days':
          fromDate = subDays(new Date(), 7);
          break;
        case '30days':
          fromDate = subDays(new Date(), 30);
          break;
        case '90days':
          fromDate = subDays(new Date(), 90);
          break;
        default:
          fromDate = subDays(new Date(), 7);
      }
      
      // Use type assertion to handle the type mismatch until types are regenerated
      const { data, error } = await supabase
        .from('analytics_events' as any)
        .select('*')
        .gte('created_at', fromDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertion to ensure compatibility
      setAnalyticsData(data as unknown as AnalyticsEvent[] || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data when time range changes
  useEffect(() => {
    if (isAdmin) {
      fetchAnalyticsData();
    }
  }, [timeRange, isAdmin]);

  // Calculate analytics metrics
  const calculateMetrics = () => {
    const pageViews = analyticsData.filter(event => event.event_name === 'page_view').length;
    const uniqueUsers = new Set(analyticsData.filter(event => event.user_id).map(event => event.user_id)).size;
    const searchCount = analyticsData.filter(event => event.event_name === 'search').length;
    const topPages = analyticsData.reduce((acc, event) => {
      const path = event.page_path;
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort pages by view count
    const sortedPages = Object.entries(topPages)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5);

    return {
      pageViews,
      uniqueUsers,
      searchCount,
      topPages: sortedPages
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    // Group by day
    const dailyData = analyticsData.reduce((acc, event) => {
      const date = new Date(event.created_at);
      const day = format(date, 'yyyy-MM-dd');
      
      if (!acc[day]) {
        acc[day] = {
          date: day,
          pageViews: 0,
          actions: 0,
          searches: 0,
          errors: 0
        };
      }
      
      if (event.event_name === 'page_view') {
        acc[day].pageViews += 1;
      } else if (event.event_name.startsWith('action_')) {
        acc[day].actions += 1;
      } else if (event.event_name === 'search') {
        acc[day].searches += 1;
      } else if (event.event_name.startsWith('error_')) {
        acc[day].errors += 1;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    // Convert to array sorted by date
    return Object.values(dailyData).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // If not admin or loading
  if (!isAdmin) {
    return null;
  }

  const metrics = calculateMetrics();
  const chartData = prepareChartData();

  return (
    <AppLayout>
      <Helmet>
        <title>Analytics Dashboard | VakilGPT</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track and analyze user activity on your website</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">Last 24 Hours</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={fetchAnalyticsData} 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Refresh'
              )}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="pages">
                <LineChart className="h-4 w-4 mr-2" />
                Page Views
              </TabsTrigger>
              <TabsTrigger value="events">
                <BarChart2 className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Page Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-blue-500 mr-2" />
                      <div className="text-2xl font-bold">{metrics.pageViews}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Unique Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-2xl font-bold">{metrics.uniqueUsers}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Search Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Search className="h-5 w-5 text-purple-500 mr-2" />
                      <div className="text-2xl font-bold">{metrics.searchCount}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Last Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <div className="text-md font-medium">
                        {analyticsData.length > 0 
                          ? format(new Date(analyticsData[0].created_at), 'MMM d, h:mm a')
                          : 'No data'
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Over Time</CardTitle>
                    <CardDescription>Page views and events over the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="pageViews" stroke="#3b82f6" name="Page Views" />
                          <Line type="monotone" dataKey="actions" stroke="#10b981" name="Actions" />
                          <Line type="monotone" dataKey="searches" stroke="#8b5cf6" name="Searches" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                    <CardDescription>Most viewed pages on your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.topPages.map(([path, count]) => ({
                          page: path.length > 20 ? path.substring(0, 20) + '...' : path,
                          views: count,
                          fullPath: path
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="page" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name, props) => [value, 'Views']}
                            labelFormatter={(label, payload) => {
                              if (payload && payload.length) {
                                return payload[0].payload.fullPath;
                              }
                              return label;
                            }}
                          />
                          <Bar dataKey="views" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest events recorded in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData.slice(0, 10).map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.event_name}</TableCell>
                          <TableCell>{event.page_path}</TableCell>
                          <TableCell>{format(new Date(event.created_at), 'MMM d, h:mm a')}</TableCell>
                          <TableCell>{event.user_id ? event.user_id.substring(0, 8) + '...' : 'Anonymous'}</TableCell>
                        </TableRow>
                      ))}
                      {analyticsData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No analytics data available for the selected time period
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pages">
              <Card>
                <CardHeader>
                  <CardTitle>Page Views Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of page views</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    Detailed page view analytics coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Events Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of user events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    Detailed event analytics coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default AnalyticsDashboard;
