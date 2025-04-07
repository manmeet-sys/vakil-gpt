
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
import { UserCog, Upload, Shield, Info, Calendar, BadgeCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

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
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Authentication Required</h3>
            <p className="text-muted-foreground mt-2">Please sign in to manage your profile</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md overflow-hidden border-legal-border dark:border-legal-slate/20">
      <CardHeader className="bg-legal-accent/5 border-b border-legal-border/20 dark:border-legal-slate/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog size={20} className="text-legal-accent" />
            <CardTitle>Advocate Profile</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                  <Shield size={12} />
                  <span>Private Data</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">This profile information is private and only visible to you</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Keep your professional information updated for use with legal tools
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:w-1/3">
              <div 
                className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-legal-border dark:border-legal-slate/20 mb-4 shadow-sm"
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCog className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="w-full">
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
                    className="w-full border-dashed"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Maximum size: 2MB</p>
              </div>
            </div>

            <div className="space-y-4 md:w-2/3">
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="full_name">Full Name</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Your name as registered with the Bar Council</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter your full legal name"
                  className="border-legal-border/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="bar_number">Bar Council Enrollment Number</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BadgeCheck size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Your unique Bar Council registration number</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="bar_number"
                  name="bar_number"
                  value={formData.bar_number}
                  onChange={handleInputChange}
                  placeholder="e.g., D/123/2020"
                  className="border-legal-border/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="enrollment_date">Enrollment Date</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Calendar size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Date when you were enrolled with the Bar Council</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="enrollment_date"
                  name="enrollment_date"
                  type="date"
                  value={formData.enrollment_date}
                  onChange={handleInputChange}
                  className="border-legal-border/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={14} className="text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">The main jurisdiction where you practice</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select 
                  value={formData.jurisdiction} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="jurisdiction" className="border-legal-border/30">
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
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-legal-border/10 dark:border-legal-slate/10 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-legal-accent hover:bg-legal-accent/90 text-white"
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/10 border-t border-legal-border/20 dark:border-legal-slate/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Your profile data is private and used only within tools
          </p>
        </div>
        <ClearAnalyticsButton 
          onClear={handleReset} 
          resetProfileData={true}
        />
      </CardFooter>
    </Card>
  );
};

export default ProfileManager;
