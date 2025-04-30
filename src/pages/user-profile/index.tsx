
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
  FileText,
  Edit,
  Users,
  Clock,
  Shield,
  BadgeCheck
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Helper function to get initials
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'A';
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Advocate Profile | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {loading ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main profile card */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="overflow-hidden shadow-lg border border-indigo-100 dark:border-indigo-800/30">
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <CardContent className="pt-0 relative pb-6">
                  <div className="-mt-12 mb-4 flex justify-center">
                    <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800 shadow-md">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                      {profile?.full_name || 'Advocate'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 break-words text-sm">
                      {user?.email}
                    </p>
                    <div className="mt-3 flex justify-center">
                      <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30 px-3 py-1">
                        <Gavel className="mr-1 h-3 w-3" />
                        Advocate
                      </Badge>
                    </div>
                  </div>
                
                  <Separator className="my-6" />
                  
                  <div className="space-y-5">
                    {profile?.bar_number && (
                      <div className="flex items-center px-1">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                          <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Bar Council Number</p>
                          <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.bar_number}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile?.enrollment_date && (
                      <div className="flex items-center px-1">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Date</p>
                          <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.enrollment_date}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile?.jurisdiction && (
                      <div className="flex items-center px-1">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Jurisdiction</p>
                          <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.jurisdiction}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BadgeCheck className="h-4 w-4 text-green-500 mr-2" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Information</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <span>Member since: </span>
                      <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                        {user?.created_at ? format(new Date(user.created_at), 'PP') : 'N/A'}
                      </span>
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 dark:bg-gray-800/20 py-4 px-6">
                  <Button 
                    onClick={handleEditProfile} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Dashboard area */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <Card className="shadow-md border border-indigo-100 dark:border-indigo-800/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/20 pb-4">
                  <CardTitle className="text-indigo-900 dark:text-indigo-100">Practice Dashboard</CardTitle>
                  <CardDescription className="text-indigo-700 dark:text-indigo-300">
                    Overview of your legal practice and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-none shadow-md bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Active Cases</p>
                            <div className="flex items-baseline">
                              <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100 mt-1">{cases}</p>
                              <p className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">total</p>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-indigo-200 dark:bg-indigo-700/40 flex items-center justify-center shadow-inner">
                            <Briefcase className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30 overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Active Clients</p>
                            <div className="flex items-baseline">
                              <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-1">{clients}</p>
                              <p className="text-xs text-amber-600 dark:text-amber-400 ml-2">total</p>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-700/40 flex items-center justify-center shadow-inner">
                            <Users className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Pending Deadlines</p>
                            <div className="flex items-baseline">
                              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{deadlines}</p>
                              <p className="text-xs text-purple-600 dark:text-purple-400 ml-2">upcoming</p>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-700/40 flex items-center justify-center shadow-inner">
                            <Clock className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border border-indigo-100 dark:border-indigo-800/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/20 pb-4">
                  <CardTitle className="text-indigo-900 dark:text-indigo-100">Practice Management</CardTitle>
                  <CardDescription className="text-indigo-700 dark:text-indigo-300">
                    Manage your legal practice workflow
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <Button 
                        variant="outline" 
                        className="h-auto min-h-[96px] w-full justify-start border-2 border-blue-200 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all duration-200 group-hover:shadow-md" 
                        onClick={() => navigate('/case-management')}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center p-1">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-200 dark:bg-blue-800/30 flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 group-hover:bg-blue-300 dark:group-hover:bg-blue-700/40 transition-colors">
                            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">Case Management</h3>
                            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">Track and manage your legal cases</p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <Button 
                        variant="outline" 
                        className="h-auto min-h-[96px] w-full justify-start border-2 border-purple-200 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all duration-200 group-hover:shadow-md" 
                        onClick={() => navigate('/deadline-management')}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center p-1">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-200 dark:bg-purple-800/30 flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 group-hover:bg-purple-300 dark:group-hover:bg-purple-700/40 transition-colors">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-purple-900 dark:text-purple-100 text-sm sm:text-base">Deadline Tracking</h3>
                            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">Manage important dates and deadlines</p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <Button 
                        variant="outline" 
                        className="h-auto min-h-[96px] w-full justify-start border-2 border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all duration-200 group-hover:shadow-md" 
                        onClick={() => navigate('/case-management')}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center p-1">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-200 dark:bg-green-800/30 flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 group-hover:bg-green-300 dark:group-hover:bg-green-700/40 transition-colors">
                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-green-900 dark:text-green-100 text-sm sm:text-base">Client Management</h3>
                            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Maintain your client database</p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <Button 
                        variant="outline" 
                        className="h-auto min-h-[96px] w-full justify-start border-2 border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all duration-200 group-hover:shadow-md" 
                        onClick={() => navigate('/court-filing')}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center p-1">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-200 dark:bg-amber-800/30 flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 group-hover:bg-amber-300 dark:group-hover:bg-amber-700/40 transition-colors">
                            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-amber-900 dark:text-amber-100 text-sm sm:text-base">Court Filings</h3>
                            <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">Track court documents and filings</p>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default UserProfilePage;
