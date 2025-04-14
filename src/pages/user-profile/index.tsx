
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  Gavel, 
  MapPin, 
  Phone, 
  FileText,
  Edit,
  Users,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

const UserProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [cases, setCases] = useState<number>(0);
  const [clients, setClients] = useState<number>(0);
  const [deadlines, setDeadlines] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        setProfile(profileData);
        
        // Fetch cases count
        const { count: casesCount, error: casesError } = await supabase
          .from('court_filings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (casesError) throw casesError;
        
        setCases(casesCount || 0);
        
        // Fetch clients count
        const { count: clientsCount, error: clientsError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (clientsError) throw clientsError;
        
        setClients(clientsCount || 0);
        
        // Fetch upcoming deadlines count
        const today = new Date().toISOString();
        const { count: deadlinesCount, error: deadlinesError } = await supabase
          .from('deadlines')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .gte('due_date', today);
        
        if (deadlinesError) throw deadlinesError;
        
        setDeadlines(deadlinesCount || 0);
        
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditProfile = () => {
    navigate('/profile-edit');
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Advocate Profile | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main profile card */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-4 text-center">
                <div className="mb-4 flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl font-bold">
                  {profile?.full_name || 'Advocate'}
                </CardTitle>
                <CardDescription>
                  {user?.email}
                </CardDescription>
                <div className="mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    <Gavel className="mr-1 h-3 w-3" />
                    Advocate
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 py-4">
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  {profile?.bar_number && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Bar Council Number</p>
                        <p className="font-medium">{profile.bar_number}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile?.enrollment_date && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Date</p>
                        <p className="font-medium">{profile.enrollment_date}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile?.jurisdiction && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Jurisdiction</p>
                        <p className="font-medium">{profile.jurisdiction}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.created_at ? format(new Date(user.created_at), 'PP') : 'N/A'}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleEditProfile} className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Dashboard area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Practice Dashboard</CardTitle>
                <CardDescription>Overview of your legal practice and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Cases</p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{cases}</p>
                        </div>
                        <Briefcase className="h-8 w-8 text-blue-500 dark:text-blue-400 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Active Clients</p>
                          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{clients}</p>
                        </div>
                        <Users className="h-8 w-8 text-amber-500 dark:text-amber-400 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Pending Deadlines</p>
                          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{deadlines}</p>
                        </div>
                        <Clock className="h-8 w-8 text-purple-500 dark:text-purple-400 opacity-70" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Practice Management</CardTitle>
                <CardDescription>Manage your legal practice workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 justify-start border-dashed" 
                    onClick={() => navigate('/case-management')}
                  >
                    <div className="flex flex-col items-start mr-3">
                      <Briefcase className="h-8 w-8 text-blue-500 mb-1" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Case Management</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage your legal cases</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 justify-start border-dashed" 
                    onClick={() => navigate('/deadline-management')}
                  >
                    <div className="flex flex-col items-start mr-3">
                      <Calendar className="h-8 w-8 text-amber-500 mb-1" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Deadline Tracking</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage important dates and deadlines</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 justify-start border-dashed" 
                    onClick={() => navigate('/case-management')}
                  >
                    <div className="flex flex-col items-start mr-3">
                      <Users className="h-8 w-8 text-green-500 mb-1" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Client Management</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Maintain your client database</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 justify-start border-dashed" 
                    onClick={() => navigate('/court-filing')}
                  >
                    <div className="flex flex-col items-start mr-3">
                      <FileText className="h-8 w-8 text-purple-500 mb-1" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">Court Filings</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Track court documents and filings</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserProfilePage;
