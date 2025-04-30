import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/AppLayout';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
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
  Filter
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
import { ClientDocument, StatusUpdate as ClientStatusUpdate } from '@/types/ClientPortalTypes';

// Types for client portal data
interface Document {
  id: string;
  name: string;
  created_at: string;
  size: number;
  type: string;
  status: 'shared' | 'pending_review' | 'approved' | 'rejected';
  shared_by?: string;
  case_id?: string;
  notes?: string;
}

// Local interface for status updates (avoid conflict with imported type)
interface StatusUpdate {
  id: string;
  message: string;
  created_at: string;
  case_id: string;
  case_title: string;
  status: string;
  is_read: boolean;
  client_id: string; // Added to match the imported type
}

interface ClientCase {
  id: string;
  case_title: string;
  case_number: string;
  status: string;
  court_name: string;
  filing_date?: string;
  hearing_date?: string;
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
        setStatusUpdates(prev => [payload.new as StatusUpdate, ...prev]);
        toast.info("You have a new case status update!");
        setUnreadUpdates(prev => prev + 1);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);
  
  const fetchClientData = async () => {
    try {
      setLoading(true);
      
      // Fetch client documents using RPC function
      const { data: documentsData, error: documentsError } = await supabase.rpc('get_client_documents', {
        p_client_id: user?.id || ''
      });
      
      if (documentsError) throw documentsError;
      
      // Fetch status updates using RPC function
      const { data: updatesData, error: updatesError } = await supabase.rpc('get_client_status_updates', {
        p_client_id: user?.id || ''
      });
      
      if (updatesError) throw updatesError;
      
      // Count unread updates
      const unread = updatesData?.filter((update: StatusUpdate) => !update.is_read).length || 0;
      
      // Fetch cases
      const { data: casesData, error: casesError } = await supabase
        .from('court_filings')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (casesError) throw casesError;
      
      // Transform case data to include progress
      const transformedCases = casesData?.map(caseItem => ({
        ...caseItem,
        progress: calculateCaseProgress(caseItem.status || 'draft')
      })) as ClientCase[];
      
      setDocuments(documentsData || []);
      setStatusUpdates(updatesData || []);
      setClientCases(transformedCases || []);
      setUnreadUpdates(unread);
    } catch (error) {
      console.error('Error fetching client data:', error);
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
      const { error } = await supabase.rpc('mark_status_update_read', {
        p_update_id: updateId
      });
      
      if (error) throw error;
      
      setStatusUpdates(prev => prev.map(update => 
        update.id === updateId ? { ...update, is_read: true } : update
      ));
      
      setUnreadUpdates(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking update as read:', error);
    }
  };
  
  const handleDocumentFilter = (documents: Document[]) => {
    if (!searchTerm) return documents;
    
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Button variant="outline" onClick={() => fetchClientData()}>
                <Bell className="h-4 w-4 mr-2" />
                Updates {unreadUpdates > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
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
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="cases" className="flex items-center gap-1">
                <FileClock className="h-4 w-4" />
                <span>My Cases</span>
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex items-center gap-1 relative">
                <Bell className="h-4 w-4" />
                <span>Updates</span>
                {unreadUpdates > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {unreadUpdates}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <FileCheck className="h-4 w-4" />
                <span>Upload</span>
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
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-4 text-gray-500">Loading your documents...</p>
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
                                  {document.status.replace('_', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
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
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-4 text-gray-500">Loading your cases...</p>
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
                              <h3 className="font-semibold text-lg">{caseItem.case_title}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {caseItem.case_number} • {caseItem.court_name}
                              </p>
                            </div>
                            <Badge className="mt-2 md:mt-0">
                              {caseItem.status}
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
                            <Button size="sm" variant="outline" className="text-xs">
                              View Case Details
                              <ChevronRight className="h-3 w-3 ml-1" />
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
                    updates={statusUpdates as ClientStatusUpdate[]} 
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
                  <ClientDocumentUploader 
                    clientId={user?.id || ''} 
                    onUploadSuccess={() => {
                      toast.success('Document uploaded successfully');
                      fetchClientData();
                    }}
                  />
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
              <ClientMessageCenter clientId={user?.id || ''} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ClientPortalPage;
