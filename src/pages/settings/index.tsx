
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserCircle, 
  Shield, 
  Bell, 
  Palette, 
  MessageSquare, 
  CheckCircle,
  Accessibility
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import LazyComponent from '@/components/LazyComponent';
import ProfileManager from '@/components/ProfileManager';

const ProfileSettings = React.lazy(() => import('./ProfileSettings'));
const AppearanceSettings = React.lazy(() => import('./AppearanceSettings'));
const SecuritySettings = React.lazy(() => import('./SecuritySettings'));
const NotificationSettings = React.lazy(() => import('./NotificationSettings'));
const AISettings = React.lazy(() => import('./AISettings'));
const AccessibilitySettings = React.lazy(() => import('./AccessibilitySettings'));

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [savePreferences, setSavePreferences] = useState(false);
  
  // Get tab from URL if available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'security', 'notifications', 'appearance', 'ai', 'accessibility'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);
  
  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url);
  }, [activeTab]);

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleTabChange = (value: string) => {
    // Save any pending changes if switching tabs
    if (savePreferences) {
      toast.success("Settings saved successfully");
      setSavePreferences(false);
    }
    setActiveTab(value);
  };

  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>Settings | VakilGPT</title>
      </Helmet>
      
      <div className="container max-w-6xl px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <Card className="sticky top-24">
              <CardContent className="p-3">
                <Tabs 
                  orientation="vertical" 
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <TabsList className="flex flex-col w-full h-auto bg-transparent gap-1">
                    <TabsTrigger 
                      value="profile"
                      className="w-full justify-start py-2 px-3 data-[state=active]:bg-accent"
                    >
                      <UserCircle className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security"
                      className="w-full justify-start py-2 px-3 data-[state=active]:bg-accent"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications"
                      className="w-full justify-start py-2 px-3 data-[state=active]:bg-accent"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appearance"
                      className="w-full justify-start py-2 px-3 data-[state=active]:bg-accent"
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai"
                      className="w-full justify-start py-2 px-3 data-[state=active]:bg-accent"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      AI Settings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="accessibility"
                      className="w-full justify-start py-2 px-3 data-[state=active]:bg-accent"
                    >
                      <Accessibility className="h-4 w-4 mr-2" />
                      Accessibility
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="profile" className="mt-0">
                  <LazyComponent>
                    <ProfileSettings />
                  </LazyComponent>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <LazyComponent>
                    <SecuritySettings />
                  </LazyComponent>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <LazyComponent>
                    <NotificationSettings />
                  </LazyComponent>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <LazyComponent>
                    <AppearanceSettings />
                  </LazyComponent>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0">
                  <LazyComponent>
                    <AISettings />
                  </LazyComponent>
                </TabsContent>
                
                <TabsContent value="accessibility" className="mt-0">
                  <LazyComponent>
                    <AccessibilitySettings />
                  </LazyComponent>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </OptimizedAppLayout>
  );
};

export default SettingsPage;
