import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarClock, FileText, IndianRupee, User, Bell, Shield, Settings, ChevronRight, BookOpen, Gavel, Activity, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  bar_number: string | null;
  enrollment_date: string | null;
  jurisdiction: string | null;
}

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, userProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "Advocate",
    role: "Advocate",
    barNumber: "",
    enrollmentDate: "",
    jurisdiction: "",
    stats: {
      casesWon: 0,
      totalCases: 0,
      documentsCreated: 0,
      upcomingDeadlines: 0
    },
    avatarUrl: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (userProfile) {
      setProfile({
        name: userProfile.full_name || "Advocate",
        role: "Advocate",
        barNumber: userProfile.bar_number || "",
        enrollmentDate: userProfile.enrollment_date || "",
        jurisdiction: userProfile.jurisdiction || "",
        stats: {
          casesWon: 87,
          totalCases: 124,
          documentsCreated: 394,
          upcomingDeadlines: 8
        },
        avatarUrl: userProfile.avatar_url
      });
      setIsLoading(false);
    } else {
      const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return;
          }

          if (data) {
            const profileData = data as UserProfile;
            setProfile({
              name: profileData.full_name || "Advocate",
              role: "Advocate",
              barNumber: profileData.bar_number || "",
              enrollmentDate: profileData.enrollment_date || "",
              jurisdiction: profileData.jurisdiction || "",
              stats: {
                casesWon: 87,
                totalCases: 124,
                documentsCreated: 394,
                upcomingDeadlines: 8
              },
              avatarUrl: profileData.avatar_url
            });
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [user, userProfile]);

  const recentCases = [
    { id: 1, title: "State of Karnataka vs. Reddy", type: "Criminal", court: "Karnataka High Court", date: "28/03/2025", status: "Active" },
    { id: 2, title: "Mehta Industries vs. GST Authority", type: "Tax", court: "CESTAT Bangalore", date: "15/04/2025", status: "Pending" },
    { id: 3, title: "Sharma vs. Patel Property Dispute", type: "Civil", court: "Bangalore Civil Court", date: "10/05/2025", status: "Scheduled" }
  ];

  const legalTools = [
    { id: 1, name: "Court Filing Automation", icon: <FileText className="h-5 w-5" />, path: "/court-filing", description: "Automate court filing process for Indian courts" },
    { id: 2, name: "Deadline Management", icon: <CalendarClock className="h-5 w-5" />, path: "/deadline-management", description: "Smart calendar and deadline tracking for Indian legal proceedings" },
    { id: 3, name: "Billing & Time Tracking", icon: <IndianRupee className="h-5 w-5" />, path: "/billing-tracking", description: "Track billable hours and manage invoices" }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Advocate Profile | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
              {profile.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                  {getInitials(profile.name)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              <div className="flex flex-col md:flex-row items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-300">
                <Badge variant="outline" className="font-medium bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800/50">
                  {profile.role}
                </Badge>
                {profile.jurisdiction && (
                  <>
                    <span className="hidden md:block text-gray-400">•</span>
                    <span>{profile.jurisdiction}</span>
                  </>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cases Won</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.casesWon}</p>
                  <div className="mt-1">
                    <Progress value={(profile.stats.casesWon / profile.stats.totalCases) * 100} className="h-1.5" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Cases</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.totalCases}</p>
                  <div className="mt-1">
                    <Progress value={100} className="h-1.5" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.documentsCreated}</p>
                  <div className="mt-1">
                    <Progress value={80} className="h-1.5" />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-100 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Deadlines</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.upcomingDeadlines}</p>
                  <div className="mt-1">
                    <Progress value={40} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="rounded-full" 
                onClick={() => navigate('/profile-edit')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="rounded-full" 
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm backdrop-blur-sm overflow-hidden rounded-2xl mb-6">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                <CardTitle className="text-lg font-semibold">Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {profile.barNumber && (
                    <li className="px-6 py-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Bar Enrollment</span>
                      <span className="text-sm text-gray-900 dark:text-white">{profile.barNumber}</span>
                    </li>
                  )}
                  {profile.enrollmentDate && (
                    <li className="px-6 py-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrollment Date</span>
                      <span className="text-sm text-gray-900 dark:text-white">{profile.enrollmentDate}</span>
                    </li>
                  )}
                  {user?.email && (
                    <li className="px-6 py-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                      <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
                    </li>
                  )}
                  {profile.jurisdiction && (
                    <li className="px-6 py-4 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Jurisdiction</span>
                      <span className="text-sm text-gray-900 dark:text-white">{profile.jurisdiction}</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm backdrop-blur-sm overflow-hidden rounded-2xl">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                <CardTitle className="text-lg font-semibold">Legal Practice Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {legalTools.map((tool) => (
                    <li key={tool.id}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left rounded-none h-auto p-4"
                        onClick={() => navigate(tool.path)}
                      >
                        <div className="flex items-center w-full">
                          <div className="p-2 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 mr-3">
                            {tool.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{tool.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{tool.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2" />
                        </div>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="dashboard" value={activeSection} onValueChange={setActiveSection} className="w-full">
              <TabsList className="flex w-full rounded-xl p-1 bg-gray-100 dark:bg-gray-800 mb-6">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="cases" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
                >
                  Cases
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-lg"
                >
                  Activity
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Gavel className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Upcoming Hearings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                      {recentCases.map((caseItem) => (
                        <li key={caseItem.id} className="px-6 py-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">{caseItem.title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {caseItem.court} • {caseItem.type}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{caseItem.date}</span>
                              <Badge 
                                variant={caseItem.status === "Active" ? "default" : 
                                        caseItem.status === "Pending" ? "outline" : "secondary"}
                                className="mt-1"
                              >
                                {caseItem.status}
                              </Badge>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm rounded-2xl backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Pending Filings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">5</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Documents awaiting submission</p>
                      <Button 
                        className="w-full mt-4 rounded-xl bg-blue-500 hover:bg-blue-600" 
                        onClick={() => navigate('/court-filing')}
                      >
                        View Filings
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm rounded-2xl backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                      <CardTitle className="text-lg font-semibold flex items-center">
                        <CalendarClock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Upcoming Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 py-4">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">8</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tasks due this week</p>
                      <Button 
                        className="w-full mt-4 rounded-xl bg-blue-500 hover:bg-blue-600" 
                        onClick={() => navigate('/deadline-management')}
                      >
                        Manage Deadlines
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="cases">
                <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm rounded-2xl backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Your Active Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Manage your ongoing cases and legal matters
                    </p>
                    <div className="border rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <div className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
                          Case management coming soon
                        </h3>
                        <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400">
                          We're developing a comprehensive case management system to help you track 
                          all your legal matters in one place.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/30 shadow-sm rounded-2xl backdrop-blur-sm overflow-hidden">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50 px-6">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Track your recent actions and updates
                    </p>
                    <div className="border rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                      <div className="p-8 text-center">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
                          Activity tracking coming soon
                        </h3>
                        <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400">
                          We're working on an activity log to help you keep track of all your interactions 
                          and changes across the platform.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProfilePage;
