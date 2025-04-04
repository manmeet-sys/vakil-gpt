
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, Clock, FileText, Calendar, LogOut, 
  Settings, ChevronRight, Briefcase, Building 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      // Redirect to login if not logged in
      navigate('/auth');
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access your profile.",
      });
    }
    
    setLoading(false);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!userData) {
    return null; // Will redirect in useEffect
  }

  const userTools = [
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Time & Billing",
      description: "Track billable hours and manage client invoices",
      path: "/billing-tracking"
    },
    {
      icon: <FileText className="h-6 w-6 text-green-600" />,
      title: "Court Filing",
      description: "Automated court document preparation and filing",
      path: "/court-filing"
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      title: "Deadline Management",
      description: "Smart calendar with legal deadline tracking",
      path: "/deadline-management"
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>My Legal Profile | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{userData.name}</CardTitle>
              <CardDescription>{userData.email}</CardDescription>
              <div className="flex items-center mt-2">
                <Briefcase className="h-4 w-4 mr-1 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{userData.role}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="my-4" />
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/tools')}>
                  <Building className="mr-2 h-4 w-4" />
                  All Legal Tools
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log out of VakilGPT?</DialogTitle>
                      <DialogDescription>
                        You'll need to log back in to access your legal tools and data.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Legal Tools</CardTitle>
                <CardDescription>
                  Access your personalized legal tools and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTools.map((tool) => (
                    <Card 
                      key={tool.title} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(tool.path)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                            {tool.icon}
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-medium text-lg">{tool.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tool.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/tools')}>
                  View All Tools
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="font-medium">Recorded 2.5 hours</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Client: ABC Corporation</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Just now</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="font-medium">Filed motion document</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Case: Smith v. Jones</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 mr-3">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <p className="font-medium">Added court deadline</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Case: R v. Kumar</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
