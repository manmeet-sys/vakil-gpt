
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
import { UserCog, Upload, Shield, Info, Calendar, BadgeCheck, Check, X, AlertCircle, Loader2, Edit, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    bar_number: '',
    enrollment_date: '',
    jurisdiction: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (formData.bar_number && !formData.bar_number.match(/^[A-Z]\/\d+\/\d+$/)) {
      errors.bar_number = 'Format should be like D/123/2020';
    }
    
    const enrollmentDate = new Date(formData.enrollment_date);
    const today = new Date();
    if (formData.enrollment_date && (isNaN(enrollmentDate.getTime()) || enrollmentDate > today)) {
      errors.enrollment_date = 'Please enter a valid past date';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, jurisdiction: value }));
    // Clear validation error
    if (validationErrors.jurisdiction) {
      setValidationErrors(prev => ({ ...prev, jurisdiction: '' }));
    }
  };

  const simulateUploadProgress = () => {
    setIsUploading(true);
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
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;

    const stopSimulation = simulateUploadProgress();
    
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
      
      completeUploadProgress();
      stopSimulation();
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Avatar upload failed');
      stopSimulation();
      setIsUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
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
        setIsEditMode(false);
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

  const handleCancel = () => {
    // Reset form to current profile data
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        bar_number: userProfile.bar_number || '',
        enrollment_date: userProfile.enrollment_date || '',
        jurisdiction: userProfile.jurisdiction || ''
      });
      setAvatarUrl(userProfile.avatar_url);
    }
    
    setIsEditMode(false);
    setValidationErrors({});
    setAvatarFile(null);
    
    toast.info('Editing cancelled');
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const navigateToEditProfile = () => {
    navigate('/profile-edit');
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-md overflow-hidden border-legal-border dark:border-legal-slate/20">
        <CardHeader className="bg-gradient-to-r from-legal-accent/10 to-legal-light dark:from-legal-slate/30 dark:to-legal-slate/10 border-b border-legal-border/20 dark:border-legal-slate/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCog size={20} className="text-legal-accent" />
              <CardTitle>Advocate Profile</CardTitle>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800/30">
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
          <CardDescription className="mt-1 flex items-center">
            <span>Your professional information for use with legal tools</span>
            {!isEditMode && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-3 h-7 px-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={handleEditClick}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isEditMode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:w-1/3 lg:w-1/4">
                  <div 
                    className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden border border-legal-border dark:border-legal-slate/20 mb-4 shadow-sm group"
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
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-5/6">
                          <Progress value={uploadProgress} className="h-2 bg-gray-300" />
                          <p className="text-xs text-white text-center mt-1">Uploading...</p>
                        </div>
                      </div>
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
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed hover:bg-legal-accent/5"
                        disabled={isLoading || isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">Maximum size: 2MB</p>
                  </div>
                </div>

                <div className="space-y-5 md:w-2/3 lg:w-3/4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="full_name" className={cn(validationErrors.full_name && "text-destructive")}>Full Name</Label>
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
                      className={cn(
                        "border-legal-border/30",
                        validationErrors.full_name && "border-destructive focus-visible:ring-destructive"
                      )}
                      disabled={isLoading}
                    />
                    {validationErrors.full_name && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.full_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="bar_number" className={cn(validationErrors.bar_number && "text-destructive")}>Bar Council Enrollment Number</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <BadgeCheck size={14} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Your unique Bar Council registration number (e.g., D/123/2020)</p>
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
                        className={cn(
                          "border-legal-border/30",
                          validationErrors.bar_number && "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={isLoading}
                      />
                      {validationErrors.bar_number && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.bar_number}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="enrollment_date" className={cn(validationErrors.enrollment_date && "text-destructive")}>Enrollment Date</Label>
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
                        className={cn(
                          "border-legal-border/30",
                          validationErrors.enrollment_date && "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={isLoading}
                      />
                      {validationErrors.enrollment_date && (
                        <p className="text-xs text-destructive mt-1">{validationErrors.enrollment_date}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="jurisdiction" className={cn(validationErrors.jurisdiction && "text-destructive")}>Primary Jurisdiction</Label>
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
                      disabled={isLoading}
                    >
                      <SelectTrigger 
                        id="jurisdiction" 
                        className={cn(
                          "border-legal-border/30",
                          validationErrors.jurisdiction && "border-destructive focus-visible:ring-destructive"
                        )}
                      >
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {indianJurisdictions.map((jurisdiction) => (
                          <SelectItem key={jurisdiction} value={jurisdiction}>
                            {jurisdiction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.jurisdiction && (
                      <p className="text-xs text-destructive mt-1">{validationErrors.jurisdiction}</p>
                    )}
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-300 mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Professional Information</AlertTitle>
                <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
                  Your profile information enhances AI-powered legal tools and is kept private for your use only.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-3 pt-4 border-t border-legal-border/10 dark:border-legal-slate/10 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-legal-accent hover:bg-legal-accent/90 text-white gap-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            // View mode (not edit mode)
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:w-1/3 lg:w-1/4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden border border-legal-border dark:border-legal-slate/20 mb-4 shadow-md">
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
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1">
                    Advocate
                  </Badge>
                </div>

                <div className="space-y-4 md:w-2/3 lg:w-3/4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/30">
                      <p className="text-xs text-muted-foreground font-medium">Full Name</p>
                      <p className="font-medium">{formData.full_name || "Not provided"}</p>
                    </div>
                    
                    <div className="space-y-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/30">
                      <p className="text-xs text-muted-foreground font-medium">Bar Council Enrollment</p>
                      <p className="font-medium">{formData.bar_number || "Not provided"}</p>
                    </div>
                    
                    <div className="space-y-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/30">
                      <p className="text-xs text-muted-foreground font-medium">Enrollment Date</p>
                      <p className="font-medium">
                        {formData.enrollment_date 
                          ? new Date(formData.enrollment_date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : "Not provided"}
                      </p>
                    </div>
                    
                    <div className="space-y-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/30">
                      <p className="text-xs text-muted-foreground font-medium">Primary Jurisdiction</p>
                      <p className="font-medium">{formData.jurisdiction || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-300 mt-4">
                <Shield className="h-4 w-4" />
                <AlertTitle className="text-green-800 dark:text-green-300">Privacy Protection</AlertTitle>
                <AlertDescription className="text-sm text-green-700 dark:text-green-300">
                  Your professional profile is stored securely and is only visible to you.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/10 border-t border-legal-border/20 dark:border-legal-slate/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your profile data is private and used only within tools
            </p>
          </div>
          {!isEditMode && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 bg-white dark:bg-gray-800"
              onClick={handleEditClick}
            >
              <Edit className="h-3 w-3" />
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProfileManager;
