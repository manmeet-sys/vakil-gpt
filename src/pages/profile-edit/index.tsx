import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Loader2, Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// Define the user profile interface with all fields from the database
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

    // Track page view
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

      // Track profile update action
      logAction('profile_update', {
        fields_updated: Object.keys(form.formState.dirtyFields)
      });

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
    try {
      // Check if storage bucket exists, create if not
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('avatars');

      // If the bucket doesn't exist, we'll create it
      if (bucketError && bucketError.message.includes('not found')) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB
        });
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update the user profile with the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Track avatar update
      logAction('avatar_update', {
        file_size: file.size,
        file_type: file.type
      });

      setAvatarUrl(avatarUrl);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
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

  return (
    <AppLayout>
      <Helmet>
        <title>Edit Profile | VakilGPT</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <BackButton to="/user-profile" label="Back to Profile" />

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>

          <Card className="shadow-md">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <Avatar className="h-24 w-24 mb-4">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                          {form.watch("full_name") ? getInitials(form.watch("full_name")) : <User />}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="w-full max-w-xs">
                      <Label htmlFor="avatar" className="block mb-2">Profile Picture</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('avatar')?.click()}
                          disabled={uploadingAvatar}
                          className="w-full"
                        >
                          {uploadingAvatar ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload Photo
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bar_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bar Enrollment Number</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., KAR/123/2015" {...field} />
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
                            <FormLabel>Enrollment Date</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., 15/05/2015" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jurisdiction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Jurisdiction</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g., Karnataka High Court" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate('/user-profile')}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isLoading || !form.formState.isDirty}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfileEditPage;
