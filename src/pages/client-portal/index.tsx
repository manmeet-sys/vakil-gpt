import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { File, FileClock, Bell, FileCheck, Users } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Import our components
import ClientDocumentUploader from '@/components/client-portal/ClientDocumentUploader';
import CaseStatusUpdates from '@/components/client-portal/CaseStatusUpdates';
import ClientMessageCenter from '@/components/client-portal/ClientMessageCenter';
import DocumentList from '@/components/client-portal/DocumentList';
import CaseList from '@/components/client-portal/CaseList';
import PortalHeader from '@/components/client-portal/PortalHeader';
import AdvocateCommunity from '@/components/client-portal/AdvocateCommunity';

// Import our custom hook
import { useClientPortal } from '@/hooks/useClientPortal';

const AdvocatePortalPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('documents');
  const { 
    user,
    loading,
    error,
    documents,
    statusUpdates,
    clientCases,
    unreadUpdates,
    searchTerm,
    setSearchTerm,
    fetchClientData,
    markUpdateAsRead,
    handleDocumentDownload
  } = useClientPortal();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/client-portal' } });
    }
  }, [user, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  if (error) {
    return (
      <AppLayout>
        <div className="container px-4 py-12 max-w-5xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}. Please reload the page or contact support.
            </AlertDescription>
          </Alert>
          <Button onClick={() => fetchClientData()}>Retry</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Helmet>
        <title>Advocate Portal | VakilGPT</title>
      </Helmet>
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <motion.div 
          className="mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <PortalHeader 
            unreadUpdates={unreadUpdates}
            loading={loading}
            onRefresh={fetchClientData}
            onUpload={() => setActiveTab('upload')}
          />
          
          <Tabs 
            defaultValue="documents" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-3xl grid-cols-5 mb-6">
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
                <span className="sm:hidden">Docs</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center gap-1">
                <FileClock className="h-4 w-4" />
                <span className="hidden sm:inline">Cases</span>
                <span className="sm:hidden">Cases</span>
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex items-center gap-1 relative">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Updates</span>
                <span className="sm:hidden">Updates</span>
                {unreadUpdates > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {unreadUpdates}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <FileCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Community</span>
                <span className="sm:hidden">Community</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Shared Documents</CardTitle>
                  <CardDescription>
                    Access documents shared with the advocate community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentList 
                    documents={documents}
                    loading={loading}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onDownload={handleDocumentDownload}
                    onUpload={() => setActiveTab('upload')}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cases">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Case Repository</CardTitle>
                  <CardDescription>
                    Track and share case progress with other advocates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CaseList 
                    cases={clientCases}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="updates">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Status Updates</CardTitle>
                  <CardDescription>
                    Receive the latest updates about shared cases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CaseStatusUpdates 
                    updates={statusUpdates} 
                    loading={loading}
                    onMarkAsRead={markUpdateAsRead}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Documents</CardTitle>
                  <CardDescription>
                    Share documents with the advocate community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="text-center py-6">
                      <p>Please login to share documents</p>
                    </div>
                  ) : (
                    <ClientDocumentUploader 
                      clientId={user.id} 
                      onUploadSuccess={() => {
                        toast.success('Document shared successfully');
                        fetchClientData();
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Advocate Community</CardTitle>
                  <CardDescription>
                    Connect and collaborate with other advocates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdvocateCommunity />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Message Center */}
        <motion.div 
          className="mt-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Advocate Discussion Forum</CardTitle>
              <CardDescription>
                Communicate securely with other advocates in the legal community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-6">
                  <p>Please login to access the discussion forum</p>
                </div>
              ) : (
                <ClientMessageCenter clientId={user.id} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AdvocatePortalPage;
