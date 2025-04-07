
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UserCircle, BarChart3, FileText, Scale, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import ProfileManager from '@/components/ProfileManager';
import BackButton from '@/components/BackButton';
import ClearAnalyticsButton from '@/components/ClearAnalyticsButton';

const UserProfilePage = () => {
  const { user, userProfile } = useAuth();

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
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Hearings</CardTitle>
                  <Scale className="h-4 w-4 text-blue-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Next on 15 April 2025</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Deadlines This Week</CardTitle>
                  <Clock className="h-4 w-4 text-blue-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">3 high priority</p>
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
                    Data updated 7 Apr 2025
                  </p>
                  <ClearAnalyticsButton 
                    onClear={handleClearDashboard} 
                    className="text-xs"
                  />
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>
                    Your most recently updated legal cases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">State vs. Sharma {i}</p>
                          <p className="text-sm text-muted-foreground">Criminal Procedure • Delhi High Court</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Last Updated</p>
                          <p className="text-xs text-muted-foreground">{7-i} Apr 2025</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Showing 3 of 12 active cases
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
