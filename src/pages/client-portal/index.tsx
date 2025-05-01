import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { downloadFile } from '@/utils/documentUtils';
import { 
  File, 
  FileClock, 
  FileCheck, 
  Bell, 
  User, 
  Shield, 
  Clock, 
  Calendar, 
  ChevronRight,
  Search,
  Filter,
  Download
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
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ClientDocumentUploader from '@/components/client-portal/ClientDocumentUploader';
import CaseStatusUpdates from '@/components/client-portal/CaseStatusUpdates';
import ClientMessageCenter from '@/components/client-portal/ClientMessageCenter';
import { ClientDocument, StatusUpdate, ClientPortalRPCTypes } from '@/types/ClientPortalTypes';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

// Types for client portal data
interface ClientCase {
  id: string;
  case_title: string;
  case_number: string;
  status: string;
  court_name: string;
  filing_date?: string;
  hearing_date?: string | null;
  progress: number;
}

const ClientPortalPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  const [unreadUpdates, setUnreadUpdates] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
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
      
      // Fetch client documents using RPC function
      const documentsResponse = await supabase.rpc(
        'get_client_documents',
        {
          p_client_id: user.id
        }
      );
      
      if (documentsResponse.error) throw documentsResponse.error;
      
      // Fetch status updates using RPC function
      const updatesResponse = await supabase.rpc(
        'get_client_status_updates',
        {
          p_client_id: user.id
        }
      );
      
      if (updatesResponse.error) throw updatesResponse.error;
      
      // Count unread updates
      const updatesData = updatesResponse.data as StatusUpdate[];
      const unread = updatesData ? 
        updatesData.filter(update => !update.is_read).length : 0;
      
      // Fetch cases
      const casesResponse = await supabase
        .from('court_filings')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (casesResponse.error) throw casesResponse.error;
      
      // Transform case data to include progress
      const transformedCases = casesResponse.data?.map(caseItem => ({
        ...caseItem,
        progress: calculateCaseProgress(caseItem.status || 'draft')
      })) as ClientCase[];
      
      setDocuments(documentsResponse.data as ClientDocument[] || []);
      setStatusUpdates(updatesResponse.data as StatusUpdate[] || []);
      setClientCases(transformedCases || []);
      setUnreadUpdates(unread);
    } catch (error: any) {
      console.error('Error fetching client data:', error);
      setError(error.message || 'Failed to load your data');
      toast.error('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const calculateCaseProgress = (status: string): number => {
    switch (status) {
      case 'draft': return 10;
      case 'filed': return 30;
      case 'pending': return 50;
      case 'scheduled': return 70;
      case 'active': return 80;
      case 'closed': return 100;
      default: return 0;
    }
  };
  
  const markUpdateAsRead = async (updateId: string) => {
    try {
      // Use RPC function to mark status update as read
      const { error } = await supabase.rpc(
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
      
      // Create a download link using our utility function
      const url = URL.createObjectURL(data);
      downloadFile(url, document.name);
      
      toast.success('Document download started');
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

  const renderDocumentsSkeletons = () => (
    <>
      {[1, 2, 3].map(i => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderCaseSkeletons = () => (
    <>
      {[1, 2].map(i => (
        <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <Skeleton className="h-5 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-5 w-24 mt-2 md:mt-0" />
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      ))}
    </>
  );

  return (
    <AppLayout>
      <Helmet>
        <title>Client Portal | VakilGPT</title>
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
                <Shield className="h-6 w-6 text-indigo-500" />
                Client Portal
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Securely access your case documents and updates
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
            defaultValue="documents" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-6">
              <TabsTrigger value="documents" className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
                <span className="sm:hidden">Docs</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center gap-1">
                <FileClock className="h-4 w-4" />
                <span className="hidden sm:inline">My Cases</span>
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
                <span className="hidden sm:inline">Upload</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
            </TabsList>
            
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSearchTerm('')}>
                          All Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchTerm('pdf')}>
                          PDF Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchTerm('shared')}>
                          Shared With Me
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSearchTerm('approved')}>
                          Approved Documents
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                          {renderDocumentsSkeletons()}
                        </TableBody>
                      </Table>
                    </div>
                  ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                      <File className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium">No documents found</h3>
                      <p className="text-gray-500 mt-2 mb-4">
                        {searchTerm ? 'No documents match your search criteria' : 'Your advocate hasn\'t shared any documents yet'}
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
            
            <TabsContent value="cases">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">My Cases</CardTitle>
                  <CardDescription>
                    Track the progress of your legal cases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-6">
                      {renderCaseSkeletons()}
                    </div>
                  ) : clientCases.length === 0 ? (
                    <div className="text-center py-12">
                      <FileClock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium">No cases found</h3>
                      <p className="text-gray-500 mt-2">
                        You don't have any active cases at the moment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {clientCases.map(caseItem => (
                        <div key={caseItem.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{caseItem.case_title || 'Untitled Case'}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {caseItem.case_number || 'No case number'} • {caseItem.court_name || 'No court assigned'}
                              </p>
                            </div>
                            <Badge className="mt-2 md:mt-0">
                              {caseItem.status || 'Draft'}
                            </Badge>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Case Progress</span>
                              <span>{caseItem.progress}%</span>
                            </div>
                            <Progress value={caseItem.progress} className="h-2" />
                          </div>
                          
                          {(caseItem.filing_date || caseItem.hearing_date) && (
                            <div className="mt-4 flex flex-col sm:flex-row gap-4 text-sm">
                              {caseItem.filing_date && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  <span className="text-gray-500 dark:text-gray-400">Filed: </span>
                                  <span className="ml-1">{new Date(caseItem.filing_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {caseItem.hearing_date && (
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                  <span className="text-gray-500 dark:text-gray-400">Next Hearing: </span>
                                  <span className="ml-1">{new Date(caseItem.hearing_date).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs"
                              onClick={() => toast.info(`Case details for ${caseItem.case_title || 'this case'} will be available soon.`)}
                            >
                              View Case Details
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
