
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  File, 
  Bell, 
  Shield, 
  Calendar, 
  ChevronRight,
  Search,
  Filter,
  Download,
  BookOpen,
  Gavel,
  Scale,
  Briefcase,
  Heart,
  Home,
  ArrowRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { downloadFile } from '@/utils/documentUtils';
import ClientDocumentUploader from '@/components/client-portal/ClientDocumentUploader';
import CaseStatusUpdates from '@/components/client-portal/CaseStatusUpdates';
import ClientMessageCenter from '@/components/client-portal/ClientMessageCenter';
import { 
  ClientDocument, 
  StatusUpdate, 
  clientPortalRPC 
} from '@/types/client-portal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const ClientPortalPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('practiceAreas');
  const [unreadUpdates, setUnreadUpdates] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Practice areas data
  const practiceAreas = [
    {
      title: "Criminal Law",
      description: "Specialized tools for criminal defense under BNS, BNSS codes",
      icon: <Gavel className="h-10 w-10 text-blue-600" />,
      path: "/criminal-law",
      tools: [
        "Case Law Analysis", 
        "Sentencing Guidelines",
        "BNS Code References"
      ]
    },
    {
      title: "Civil Law",
      description: "Cause of action analysis and relief generation tools",
      icon: <Scale className="h-10 w-10 text-blue-600" />,
      path: "/civil-law",
      tools: [
        "Limitation Calculator", 
        "Relief Clause Generator",
        "Case Precedent Finder"
      ]
    },
    {
      title: "Corporate Law",
      description: "Company formation and compliance management tools",
      icon: <Briefcase className="h-10 w-10 text-blue-600" />,
      path: "/corporate-law",
      tools: [
        "Due Diligence", 
        "Corporate Structure",
        "Compliance Tracking"
      ]
    },
    {
      title: "Family Law",
      description: "Maintenance calculation and custody analysis tools",
      icon: <Heart className="h-10 w-10 text-blue-600" />,
      path: "/family-law",
      tools: [
        "Maintenance Calculator", 
        "Custody Rights",
        "Settlement Templates"
      ]
    },
    {
      title: "Real Estate Law",
      description: "Title search and property document tools",
      icon: <Home className="h-10 w-10 text-blue-600" />,
      path: "/real-estate-law",
      tools: [
        "Title Analysis", 
        "RERA Compliance",
        "Property Documentation"
      ]
    }
  ];
  
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: '/client-portal' } });
      return;
    }
    
    fetchClientData();
    
    // Subscribe to realtime updates for status changes
    const channel = supabase
      .channel('client-portal-updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'case_status_updates',
        filter: `client_id=eq.${user.id}`
      }, payload => {
        const newUpdate = payload.new as StatusUpdate;
        setStatusUpdates(prev => [newUpdate, ...prev]);
        toast.info("You have a new case status update!");
        setUnreadUpdates(prev => prev + 1);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);
  
  const fetchClientData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch client documents using RPC wrapper
      const documentsResponse = await clientPortalRPC(
        'get_client_documents',
        {
          p_client_id: user.id
        }
      );
      
      if (documentsResponse.error) throw documentsResponse.error;
      
      // Fetch status updates using RPC wrapper
      const updatesResponse = await clientPortalRPC(
        'get_client_status_updates',
        {
          p_client_id: user.id
        }
      );
      
      if (updatesResponse.error) throw updatesResponse.error;
      
      // Set the data in state 
      setDocuments(documentsResponse.data || []);
      setStatusUpdates(updatesResponse.data || []);
      
      // Count unread updates
      const updatesData = updatesResponse.data || [];
      const unread = updatesData.filter(update => !update.is_read).length;
      setUnreadUpdates(unread);
    } catch (error: any) {
      console.error('Error fetching client data:', error);
      setError(error.message || 'Failed to load your data');
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const markUpdateAsRead = async (updateId: string) => {
    try {
      // Use RPC wrapper to mark status update as read
      const { error } = await clientPortalRPC(
        'mark_status_update_read',
        {
          p_update_id: updateId
        }
      );
      
      if (error) throw error;
      
      setStatusUpdates(prev => prev.map(update => 
        update.id === updateId ? { ...update, is_read: true } : update
      ));
      
      setUnreadUpdates(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking update as read:', error);
      toast.error('Failed to mark update as read');
    }
  };

  const handleDocumentDownload = async (document: ClientDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('client-documents')
        .download(document.path);
        
      if (error) throw error;
      
      if (data instanceof Blob) {
        const url = URL.createObjectURL(data);
        downloadFile(url, document.name);
        toast.success('Document download started');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };
  
  const handleDocumentFilter = (documents: ClientDocument[]): ClientDocument[] => {
    if (!searchTerm) return documents;
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.status && doc.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredDocuments = handleDocumentFilter(documents);
  
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

  return (
    <AppLayout>
      <Helmet>
        <title>Legal Practice Hub | VakilGPT</title>
      </Helmet>
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <motion.div 
          className="mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-indigo-500" />
                Legal Practice Hub
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Access specialized tools for different practice areas of Indian law
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchClientData}
                disabled={loading}
                className="relative"
              >
                <Bell className="h-4 w-4 mr-2" />
                {loading ? 'Refreshing...' : 'Updates'} 
                {unreadUpdates > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {unreadUpdates}
                  </Badge>
                )}
              </Button>
              
              <Button onClick={() => setActiveTab('upload')}>
                <File className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </motion.div>
          
          <Tabs 
            defaultValue="practiceAreas" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-6">
              <TabsTrigger value="practiceAreas" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Practice Areas</span>
                <span className="sm:hidden">Areas</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
                <span className="sm:hidden">Docs</span>
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
                <File className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="practiceAreas">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Legal Practice Areas</CardTitle>
                  <CardDescription>
                    Explore specialized tools for different areas of Indian legal practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practiceAreas.map((area, idx) => (
                      <Card key={idx} className="overflow-hidden border border-gray-200/60 dark:border-gray-800/60 bg-white dark:bg-zinc-800/70 hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                              {area.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{area.title}</CardTitle>
                              <CardDescription className="text-sm">{area.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="text-sm">
                            <h4 className="font-medium mb-2">Available Tools:</h4>
                            <ul className="space-y-1 list-disc pl-5 text-gray-600 dark:text-gray-400">
                              {area.tools.map((tool, i) => (
                                <li key={i}>{tool}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            onClick={() => navigate(area.path)} 
                            className="w-full"
                            variant="outline"
                          >
                            Explore {area.title} Tools
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Shared Documents</CardTitle>
                  <CardDescription>
                    Access all documents related to your legal matters
                  </CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input 
                        placeholder="Search documents..." 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[1, 2, 3].map(i => (
                            <TableRow key={i}>
                              <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                      <File className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium">No documents found</h3>
                      <p className="text-gray-500 mt-2 mb-4">
                        {searchTerm ? 'No documents match your search criteria' : 'No documents available yet'}
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab('upload')}>
                        Upload Your Document
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDocuments.map(document => (
                            <TableRow key={document.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <File className="h-4 w-4 mr-2 text-blue-500" />
                                  <span>{document.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(document.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    document.status === 'approved' ? 'default' :
                                    document.status === 'rejected' ? 'destructive' :
                                    document.status === 'pending_review' ? 'secondary' :
                                    'outline'
                                  }
                                >
                                  {document.status?.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleDocumentDownload(document)}
                                >
                                  <Download className="h-3 w-3" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="updates">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Status Updates</CardTitle>
                  <CardDescription>
                    Receive the latest updates about your cases
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
                  <CardTitle className="text-lg">Upload Documents</CardTitle>
                  <CardDescription>
                    Securely share documents with your advocate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="text-center py-6">
                      <p>Please login to upload documents</p>
                    </div>
                  ) : (
                    <ClientDocumentUploader 
                      clientId={user.id} 
                      onUploadSuccess={() => {
                        toast.success('Document uploaded successfully');
                        fetchClientData();
                      }}
                    />
                  )}
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
              <CardTitle className="text-lg">Message Center</CardTitle>
              <CardDescription>
                Communicate securely with your legal team
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-6">
                  <p>Please login to access the message center</p>
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

export default ClientPortalPage;
