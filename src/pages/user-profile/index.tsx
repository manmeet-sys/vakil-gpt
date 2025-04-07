
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileManager from '@/components/ProfileManager';
import BackButton from '@/components/BackButton';

const UserProfilePage = () => {
  const { user, userProfile } = useAuth();

  return (
    <LegalToolLayout
      title="Legal Professional Profile"
      description="Manage your legal professional profile information"
      icon={<UserCircle className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6">
        <BackButton to="/tools" label="Back to Tools" />
        
        <Tabs defaultValue="profile" className="w-full mt-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="max-w-2xl mx-auto">
              <ProfileManager />
            </div>
          </TabsContent>
          
          <TabsContent value="account">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    View and manage your account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Email Address</h3>
                    <p className="mt-1">{user?.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Account Created</h3>
                    <p className="mt-1">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Information not available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">Account Status</h3>
                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default UserProfilePage;
