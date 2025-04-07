
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { UserCircle, BarChart3, FileText, Scale, Clock, File, Shield, Settings, Key } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Case {
  id: string;
  title: string;
  court: string;
  category: string;
  updated_at: string;
}

const UserProfilePage = () => {
  const { user, userProfile, signOut } = useAuth();
  const [userCases, setUserCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const navigateToCourtFiling = () => {
    navigate('/court-filing');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <LegalToolLayout
      title="Legal Professional Profile"
      description="Manage your legal professional profile information and view your case dashboard"
      icon={<UserCircle className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6">
        <BackButton to="/tools" label="Back to Tools" />
        
        <div className="mt-8 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row gap-4 items-center md:items-start"
          >
            <Avatar className="h-20 w-20 border-2 border-white shadow-md">
              {userProfile?.avatar_url ? (
                <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name || 'User'} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-legal-accent to-blue-600 text-white text-xl">
                  {userProfile?.full_name ? getInitials(userProfile.full_name) : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {userProfile?.full_name || 'Welcome, Legal Professional'}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                {userProfile?.bar_number && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    Bar: {userProfile.bar_number}
                  </Badge>
                )}
                {userProfile?.jurisdiction && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    {userProfile.jurisdiction}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <Shield size={12} />
                  <span>Private Profile</span>
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">{user?.email}</p>
            </div>
          </motion.div>
        </div>
        
        <Tabs defaultValue="dashboard" className="w-full mt-6">
          <TabsList className="grid grid-cols-3 w-full max-w-3xl mx-auto mb-8">
            <TabsTrigger value="dashboard">Case Dashboard</TabsTrigger>
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="max-w-3xl mx-auto">
              <ProfileManager />
            </div>
          </TabsContent>
          
          <TabsContent value="dashboard">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-800/30">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-legal-accent" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{userCases.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {userCases.length > 0 
                      ? '+' + userCases.length + ' from last month' 
                      : 'No active cases'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-800/30">
                  <CardTitle className="text-sm font-medium">Pending Hearings</CardTitle>
                  <Scale className="h-4 w-4 text-legal-accent" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No upcoming hearings</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-800/30">
                  <CardTitle className="text-sm font-medium">Deadlines This Week</CardTitle>
                  <Clock className="h-4 w-4 text-legal-accent" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No upcoming deadlines</p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Monthly Case Activity</CardTitle>
                      <CardDescription>
                        Your case activity and filing metrics for the past 30 days
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield size={12} />
                      <span>Private Data</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center bg-muted/20">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-blue-300 mx-auto mb-4 opacity-60" />
                    <p className="text-sm text-muted-foreground">Case activity charts will appear here</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={navigateToCourtFiling}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Add Your First Case
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t">
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
              
              <Card className="md:col-span-2 lg:col-span-3 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between bg-gray-50 dark:bg-gray-800/30">
                  <div>
                    <CardTitle>Recent Cases</CardTitle>
                    <CardDescription>
                      Your most recently updated legal cases
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={navigateToCourtFiling}
                    className="bg-white dark:bg-gray-800"
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
                        onClick={navigateToCourtFiling}
                        className="bg-legal-accent hover:bg-legal-accent/90 text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Create Your First Case
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t">
                  <p className="text-sm text-muted-foreground">
                    {userCases.length > 0 
                      ? `Showing ${userCases.length} of ${userCases.length} active cases` 
                      : 'No cases to display'}
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-legal-accent" />
                      <CardTitle>Account Settings</CardTitle>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <Shield size={12} />
                      <span>Private Data</span>
                    </Badge>
                  </div>
                  <CardDescription>
                    Manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm">Account Information</h3>
                      <Separator />
                      <div>
                        <h4 className="text-sm text-muted-foreground">Email Address</h4>
                        <p className="mt-1 font-medium">{user?.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-muted-foreground">Account Created</h4>
                        <p className="mt-1 font-medium">
                          {user?.created_at 
                            ? new Date(user.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })
                            : 'Information not available'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-sm">Account Status</h3>
                      <Separator />
                      <div className="mb-6">
                        <h4 className="text-sm text-muted-foreground mb-1">Current Status</h4>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Authentication</h4>
                          <p className="text-sm text-muted-foreground">Password protected</p>
                        </div>
                        <Key className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <Separator />
                      
                      <div className="pt-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleSignOut}
                          className="mt-2"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-legal-border/20 dark:border-legal-slate/10 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Your account information is private and securely stored
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default UserProfilePage;
