
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Loader2, Upload, User, ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAnalytics } from '@/hooks/use-analytics';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  bar_number: string | null;
  enrollment_date: string | null;
  jurisdiction: string | null;
}

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  bar_number: z.string().optional(),
  enrollment_date: z.string().optional(),
  jurisdiction: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { logPageView, logAction } = useAnalytics();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      bar_number: '',
      enrollment_date: '',
      jurisdiction: '',
    },
  });

  useEffect(() => {
    if (!user) return;

    logPageView({ page: 'profile-edit' });

    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          const profileData = data as UserProfile;
          form.reset({
            full_name: profileData.full_name || '',
            bar_number: profileData.bar_number || '',
            enrollment_date: profileData.enrollment_date || '',
            jurisdiction: profileData.jurisdiction || '',
          });
          setAvatarUrl(profileData.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, form, logPageView]);

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  };

  const completeUploadProgress = () => {
    setUploadProgress(100);
    setTimeout(() => {
      setUploadProgress(0);
    }, 500);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          bar_number: values.bar_number,
          enrollment_date: values.enrollment_date,
          jurisdiction: values.jurisdiction,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      logAction('profile_update', {
        fields_updated: Object.keys(form.formState.dirtyFields)
      });

      await refreshProfile();

      toast.success('Profile updated successfully');
      navigate('/user-profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingAvatar(true);
    
    // Start progress animation
    const stopProgressAnimation = simulateUploadProgress();
    
    try {
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('avatars');

      if (bucketError && bucketError.message.includes('not found')) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2,
        });
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      logAction('avatar_update', {
        file_size: file.size,
        file_type: file.type
      });
      
      // Complete progress animation
      completeUploadProgress();

      setAvatarUrl(avatarUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setTimeout(() => {
        setUploadingAvatar(false);
      }, 500);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };
  
  return (
    <AppLayout>
      <Helmet>
        <title>Edit Profile | VakilGPT</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <BackButton to="/user-profile" label="Back to Profile" />
          <h1 className="text-2xl font-bold ml-4">Edit Your Profile</h1>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-lg border border-indigo-100 dark:border-indigo-800/30 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/20">
              <CardTitle className="text-indigo-900 dark:text-indigo-100">Profile Information</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-10 mb-8">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <div className="relative mb-6 group">
                        <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-lg">
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-3xl">
                              {form.watch("full_name") ? getInitials(form.watch("full_name")) : <User />}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        {uploadingAvatar && (
                          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                            <div className="w-4/5">
                              <Progress value={uploadProgress} className="h-2 bg-white/20" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-indigo-600 text-white p-2 rounded-full shadow-md cursor-pointer">
                            <Upload className="h-4 w-4" />
                            <input 
                              type="file" 
                              id="avatar" 
                              accept="image/*" 
                              onChange={handleAvatarUpload} 
                              disabled={uploadingAvatar}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('avatar')?.click()}
                          disabled={uploadingAvatar}
                          className="w-full border-dashed border-indigo-300 dark:border-indigo-700 pointer-events-auto"
                        >
                          {uploadingAvatar ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                          )}
                          Change Photo
                        </Button>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Upload a square image (max 2MB)
                        </p>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Full Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your full name" 
                                    {...field} 
                                    className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="bar_number"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700 dark:text-gray-300">Bar Enrollment Number</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="E.g., KAR/123/2015" 
                                      {...field} 
                                      className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="enrollment_date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700 dark:text-gray-300">Enrollment Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date"
                                      placeholder="E.g., 15/05/2015" 
                                      {...field} 
                                      className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500 pointer-events-auto"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="jurisdiction"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700 dark:text-gray-300">Primary Jurisdiction</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="E.g., Karnataka High Court" 
                                    {...field} 
                                    className="bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800/30 focus-visible:ring-indigo-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 mt-4">
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                              Your profile information is used to enhance AI-powered legal tools.
                            </AlertDescription>
                          </Alert>
                        </form>
                      </Form>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="bg-gray-50 dark:bg-gray-800/20 py-4 px-6 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/user-profile')}
                className="border-gray-300 dark:border-gray-700"
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading || !form.formState.isDirty}
                className="bg-indigo-600 hover:bg-indigo-700 text-white pointer-events-auto"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ProfileEditPage;
