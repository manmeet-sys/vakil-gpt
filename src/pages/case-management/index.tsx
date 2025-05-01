import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Helmet } from 'react-helmet-async';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, Calendar, Filter, Plus, Search, User, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast, Toaster } from 'sonner';
import CaseDetails from '@/components/case-management/CaseDetails';
import NewCaseForm from '@/components/case-management/NewCaseForm';
import ClientsList from '@/components/case-management/ClientsList';
import UpcomingHearings from '@/components/case-management/UpcomingHearings';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Case as ClientCase } from '@/types/GlobalTypes';

type Court = {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
};

// Define Case type specifically for this component
export type Case = {
  id: string;
  case_number: string;
  case_title: string;
  client_name: string;
  court_name: string;
  court_type: string;
  filing_type: string;
  status: string;
  jurisdiction: string;
  filing_date: string;
  hearing_date: string | null;
  description: string | null;
  opposing_party: string | null;
  documents: any; 
  created_at: string;
  updated_at: string;
  client_id: string | null;
  user_id: string;
};

// Custom case and client interfaces for this component
interface InternalCase extends Case {
  // No additional properties needed, just creating a distinct type
}

const CaseManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<InternalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<InternalCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<InternalCase | null>(null);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active-cases');
  const [showClientManagement, setShowClientManagement] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchCases = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('court_filings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Cast the data to ensure it matches the Case type
        const casesData = data?.map(item => ({
          ...item,
          documents: item.documents || [] // Ensure documents is always an array
        })) as InternalCase[];
        
        setCases(casesData || []);
        setFilteredCases(casesData || []);
      } catch (error: any) {
        console.error('Error fetching cases:', error.message);
        toast.error('Failed to load cases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [user]);

  useEffect(() => {
    // Filter cases based on search term and status filter
    let filtered = [...cases];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.case_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.court_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    
    // Filter based on active tab
    if (activeTab === 'active-cases') {
      filtered = filtered.filter((c) => c.status !== 'closed' && c.status !== 'archived');
    } else if (activeTab === 'closed-cases') {
      filtered = filtered.filter((c) => c.status === 'closed' || c.status === 'archived');
    }
    
    setFilteredCases(filtered);
  }, [cases, searchTerm, statusFilter, activeTab]);

  useEffect(() => {
    // Check if we came from another component with state
    if (location.state) {
      if (location.state.showClientManagement) {
        setShowClientManagement(true);
        setSelectedCase(null);
        setShowNewCaseForm(false);
      }
      
      if (location.state.selectedClientId) {
        setSelectedClientId(location.state.selectedClientId);
        setShowClientManagement(true);
        setSelectedCase(null);
        setShowNewCaseForm(false);
      }
    }
  }, [location]);

  const handleCaseClick = (caseItem: InternalCase) => {
    setSelectedCase(caseItem);
    setShowNewCaseForm(false);
    setShowClientManagement(false);
  };

  const handleCreateNew = () => {
    setSelectedCase(null);
    setShowNewCaseForm(true);
    setShowClientManagement(false);
  };

  const handleShowClientManagement = () => {
    setSelectedCase(null);
    setShowNewCaseForm(false);
    setShowClientManagement(true);
  };

  const handleCaseCreated = (newCase: InternalCase) => {
    setCases((prev) => [newCase, ...prev]);
    setShowNewCaseForm(false);
    setSelectedCase(newCase);
    toast.success('New case created successfully!');
  };

  const handleCaseUpdated = (updatedCase: InternalCase) => {
    setCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
    setSelectedCase(updatedCase);
    toast.success('Case updated successfully!');
  };

  const handleCaseDeleted = (caseId: string) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    setSelectedCase(null);
    toast.success('Case deleted successfully!');
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Case Management | VakilGPT</title>
      </Helmet>
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <Toaster richColors position="top-right" />
        
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all your legal cases efficiently</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShowClientManagement} className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Clients</span>
              <span className="sm:hidden">Clients</span>
            </Button>
            <Button onClick={handleCreateNew} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New Case</span>
              <span className="sm:hidden">New Case</span>
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left side - Cases list */}
          <motion.div 
            className="lg:col-span-1 space-y-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Case Directory</CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search cases..."
                      className="pl-8 w-full pointer-events-auto"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-2 pointer-events-auto">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="pointer-events-auto">
                      <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('scheduled')}>
                        Scheduled
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('closed')}>
                        Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 pointer-events-auto">
                    <TabsTrigger value="active-cases">Active Cases</TabsTrigger>
                    <TabsTrigger value="closed-cases">Closed Cases</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active-cases" className="mt-0">
                    <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                      {loading ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                          </div>
                          <p className="mt-2">Loading cases...</p>
                        </div>
                      ) : filteredCases.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                          {searchTerm
                            ? "No cases match your search criteria"
                            : "No active cases found. Create a new case to get started."}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {filteredCases.map((caseItem) => (
                            <div
                              key={caseItem.id}
                              className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                                selectedCase?.id === caseItem.id
                                  ? "bg-blue-50 dark:bg-blue-900/20"
                                  : ""
                              }`}
                              onClick={() => handleCaseClick(caseItem)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="truncate pr-2">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {caseItem.case_title || "Untitled Case"}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {caseItem.case_number || "No case number"}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    caseItem.status === "active"
                                      ? "default"
                                      : caseItem.status === "pending"
                                      ? "secondary"
                                      : caseItem.status === "scheduled"
                                      ? "outline"
                                      : "secondary"
                                  }
                                  className="text-xs whitespace-nowrap"
                                >
                                  {caseItem.status || "draft"}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center text-xs text-gray-500 truncate">
                                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{caseItem.client_name || "No client"}</span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500 truncate">
                                <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{caseItem.court_name || "No court"}</span>
                              </div>
                              {caseItem.hearing_date && (
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span>
                                    {new Date(caseItem.hearing_date).toLocaleDateString(
                                      "en-IN"
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="closed-cases" className="mt-0">
                    <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                      {loading ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                          </div>
                          <p className="mt-2">Loading cases...</p>
                        </div>
                      ) : filteredCases.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                          No closed cases found.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {filteredCases.map((caseItem) => (
                            <div
                              key={caseItem.id}
                              className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                                selectedCase?.id === caseItem.id
                                  ? "bg-blue-50 dark:bg-blue-900/20"
                                  : ""
                              }`}
                              onClick={() => handleCaseClick(caseItem)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="truncate pr-2">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {caseItem.case_title || "Untitled Case"}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {caseItem.case_number || "No case number"}
                                  </p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {caseItem.status || "archived"}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center text-xs text-gray-500 truncate">
                                <User className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{caseItem.client_name || "No client"}</span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500 truncate">
                                <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{caseItem.court_name || "No court"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/deadline-management" className="block w-full">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Deadlines
                  </Button>
                </Link>
                <Link to="/user-profile" className="block w-full">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Advocate Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Right side - Case details or form */}
          <motion.div 
            className="lg:col-span-2"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            {showNewCaseForm ? (
              <NewCaseForm onCaseCreated={handleCaseCreated} onCancel={() => setShowNewCaseForm(false)} />
            ) : showClientManagement ? (
              <ClientManagement />
            ) : selectedCase ? (
              <CaseDetails
                caseData={selectedCase}
                onCaseUpdated={handleCaseUpdated}
                onCaseDeleted={handleCaseDeleted}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ClientsList />
                <UpcomingHearings />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

// Enhanced Client Management Component
const ClientManagement = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setClients(data || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error.message);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const clientData = {
        ...formData,
        user_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();
      
      if (error) throw error;
      
      setClients(prev => [...prev, data]);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
      setShowAddForm(false);
      toast.success('Client added successfully');
    } catch (error: any) {
      console.error('Error adding client:', error.message);
      toast.error('Failed to add client');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (error: any) {
      console.error('Error deleting client:', error.message);
      toast.error('Failed to delete client');
    }
  };

  return (
    <Card className="overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <div>
          <CardTitle className="text-xl">Client Management</CardTitle>
          <CardDescription>Manage your clients and their information</CardDescription>
        </div>
        <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {showAddForm && (
          <Card className="mb-6 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Add New Client</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter client's full name"
                      required
                      className="pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="Email address"
                      className="pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      className="pointer-events-auto"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea 
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about the client"
                    className="min-h-[100px] pointer-events-auto"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setShowAddForm(false)} className="pointer-events-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="pointer-events-auto">
                    Save Client
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading clients data...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">No clients found</h3>
            <p className="text-gray-500 mt-2 mb-4">Add your first client to get started</p>
            <Button onClick={() => setShowAddForm(true)} className="pointer-events-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Client Name</TableHead>
                  <TableHead className="w-1/3">Contact</TableHead>
                  <TableHead className="hidden sm:table-cell w-1/3">Address</TableHead>
                  <TableHead className="text-right w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.email && <div className="text-sm truncate max-w-[180px]">{client.email}</div>}
                        {client.phone && <div className="text-sm">{client.phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="truncate max-w-[180px]">{client.address || '—'}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 pointer-events-auto" 
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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
  );
};

export default CaseManagementPage;
