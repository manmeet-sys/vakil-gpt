
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/use-analytics';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import ClearAnalyticsButton from './ClearAnalyticsButton';
import { UserCog, Upload } from 'lucide-react';

const indianJurisdictions = [
  "Delhi",
  "Mumbai (Maharashtra)",
  "Kolkata (West Bengal)",
  "Chennai (Tamil Nadu)",
  "Bengaluru (Karnataka)",
  "Hyderabad (Telangana)",
  "Ahmedabad (Gujarat)",
  "Chandigarh (Punjab & Haryana)",
  "Lucknow (Uttar Pradesh)",
  "Patna (Bihar)",
  "Guwahati (Assam)",
  "Kochi (Kerala)",
  "Jaipur (Rajasthan)"
];

const ProfileManager: React.FC = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const { updateProfileData } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    bar_number: '',
    enrollment_date: '',
    jurisdiction: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        bar_number: userProfile.bar_number || '',
        enrollment_date: userProfile.enrollment_date || '',
        jurisdiction: userProfile.jurisdiction || ''
      });
      setAvatarUrl(userProfile.avatar_url);
    }
  }, [userProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File is too large', {
          description: 'Please upload an image smaller than 2MB'
        });
        return;
      }
      setAvatarFile(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, jurisdiction: value }));
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, avatarFile, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data: publicURL } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Avatar upload failed');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Upload avatar if a new one was selected
      const newAvatarUrl = avatarFile ? await uploadAvatar() : avatarUrl;
      
      // Update profile data
      const success = await updateProfileData({
        ...formData,
        avatar_url: newAvatarUrl
      });
      
      if (success) {
        toast.success('Profile updated', {
          description: 'Your profile information has been saved'
        });
        // Refresh profile data to reflect changes
        await refreshProfile();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Update failed', {
        description: 'There was a problem updating your profile'
      });
    } finally {
      setIsLoading(false);
      setAvatarFile(null); // Clear the file selection
    }
  };

  const handleReset = () => {
    refreshProfile();
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to manage your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog size={20} />
          Advocate Profile
        </CardTitle>
        <CardDescription>
          Update your profile information for use with legal tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Photo</Label>
            <div className="flex items-end gap-4">
              <div 
                className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCog className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter your full legal name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bar_number">Bar Council Enrollment Number</Label>
            <Input
              id="bar_number"
              name="bar_number"
              value={formData.bar_number}
              onChange={handleInputChange}
              placeholder="e.g., D/123/2020"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollment_date">Enrollment Date</Label>
            <Input
              id="enrollment_date"
              name="enrollment_date"
              type="date"
              value={formData.enrollment_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
            <Select 
              value={formData.jurisdiction} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="jurisdiction">
                <SelectValue placeholder="Select jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {indianJurisdictions.map((jurisdiction) => (
                  <SelectItem key={jurisdiction} value={jurisdiction}>
                    {jurisdiction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          This information will be used across all legal tools
        </p>
        <ClearAnalyticsButton 
          onClear={handleReset} 
          resetProfileData={true}
        />
      </CardFooter>
    </Card>
  );
};

export default ProfileManager;
