
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserCircle, BarChart3, FileText, Scale, Clock, File } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileManager from '@/components/ProfileManager';
import BackButton from '@/components/BackButton';
import ClearAnalyticsButton from '@/components/ClearAnalyticsButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Case {
  id: string;
  title: string;
  court: string;
  category: string;
  updated_at: string;
}

const UserProfilePage = () => {
  const { user, userProfile } = useAuth();
  const [userCases, setUserCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCases();
    }
  }, [user]);

  const fetchUserCases = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would query the user's cases from the database
      // For now, we'll simulate this with a mock empty array
      // In a production app you would use:
      // const { data, error } = await supabase
      //   .from('cases')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('updated_at', { ascending: false })
      //   .limit(3);
      
      // if (error) throw error;
      
      // Simulate an empty dataset for now
      const data: Case[] = [];
      setUserCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearDashboard = () => {
    console.log('Dashboard cleared');
    // In a real app, this would reset the dashboard data
  };

  return (
    <LegalToolLayout
      title="Legal Professional Profile"
      description="Manage your legal professional profile information and view your case dashboard"
      icon={<UserCircle className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6">
        <BackButton to="/tools" label="Back to Tools" />
        
        <Tabs defaultValue="profile" className="w-full mt-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="dashboard">Case Dashboard</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <ProfileManager />
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-blue-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userCases.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {userCases.length > 0 
                      ? '+' + userCases.length + ' from last month' 
                      : 'No active cases'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Hearings</CardTitle>
                  <Scale className="h-4 w-4 text-blue-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No upcoming hearings</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deadlines This Week</CardTitle>
                  <Clock className="h-4 w-4 text-blue-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No upcoming deadlines</p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Monthly Case Activity</CardTitle>
                  <CardDescription>
                    Your case activity and filing metrics for the past 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-muted/20">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-blue-muted mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Case activity charts will appear here</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Data updated {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <ClearAnalyticsButton 
                    onClear={handleClearDashboard} 
                    className="text-xs"
                  />
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Cases</CardTitle>
                    <CardDescription>
                      Your most recently updated legal cases
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // This would navigate to a case creation page in a real app
                      toast.info('Case creation feature would open here');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Case
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-8 flex items-center justify-center">
                      <div className="animate-pulse flex flex-col w-full space-y-4">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      </div>
                    </div>
                  ) : userCases.length > 0 ? (
                    <div className="space-y-4">
                      {userCases.map((caseItem) => (
                        <div key={caseItem.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{caseItem.title}</p>
                            <p className="text-sm text-muted-foreground">{caseItem.category} • {caseItem.court}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Last Updated</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(caseItem.updated_at).toLocaleDateString('en-IN', {
                                day: 'numeric', 
                                month: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <File className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No cases found</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-md">
                        You haven't added any cases yet. Start by creating your first case to track all your legal matters in one place.
                      </p>
                      <Button 
                        onClick={() => {
                          // This would navigate to a case creation page in a real app
                          toast.info('Case creation feature would open here');
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Create Your First Case
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    {userCases.length > 0 
                      ? `Showing ${userCases.length} of ${userCases.length} active cases` 
                      : 'No cases to display'}
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    View and manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Email Address</h3>
                    <p className="mt-1">{user?.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Account Created</h3>
                    <p className="mt-1">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Information not available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Account Status</h3>
                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default UserProfilePage;
