
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProfileManager } from '@/components/ProfileManager';

const ProfileSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account information and customize your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileManager />
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
