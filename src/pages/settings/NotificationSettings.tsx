
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Bell, Mail, Calendar, MessageSquare, FileText } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      enabled: true,
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'app',
      title: 'In-App Notifications',
      description: 'Receive notifications within the application',
      enabled: true,
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: 'deadlines',
      title: 'Deadline Reminders',
      description: 'Get notified about upcoming case deadlines',
      enabled: true,
      icon: <Calendar className="h-5 w-5" />
    },
    {
      id: 'messages',
      title: 'Client Messages',
      description: 'Receive notifications when clients send messages',
      enabled: true,
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 'documents',
      title: 'Document Updates',
      description: 'Get notified when documents are updated or shared',
      enabled: false,
      icon: <FileText className="h-5 w-5" />
    }
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
    
    // In a real app, this would be persisted to a backend
    toast.success(`Setting updated successfully`);
  };

  const saveSettings = () => {
    // In a real app, this would be persisted to a backend
    toast.success('Notification preferences saved successfully');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <CardTitle>Notification Settings</CardTitle>
        </div>
        <CardDescription>
          Control how you receive notifications and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {settings.map(setting => (
            <div key={setting.id} className="flex items-start justify-between space-x-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                  {setting.icon}
                </div>
                <div className="flex-1">
                  <Label 
                    htmlFor={`notification-${setting.id}`} 
                    className="font-medium"
                  >
                    {setting.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
              </div>
              <Switch 
                id={`notification-${setting.id}`}
                checked={setting.enabled}
                onCheckedChange={() => toggleSetting(setting.id)}
              />
            </div>
          ))}
          
          <div className="pt-4 flex justify-end">
            <Button onClick={saveSettings}>Save Preferences</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
