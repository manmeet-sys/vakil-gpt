
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Briefcase, Calendar, FilePlus, Filter, Inbox, Plus, Search, User, Users, Clock } from 'lucide-react';
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
import { toast } from 'sonner';
import CaseDetails from '@/components/case-management/CaseDetails';
import NewCaseForm from '@/components/case-management/NewCaseForm';
import ClientsList from '@/components/case-management/ClientsList';
import UpcomingHearings from '@/components/case-management/UpcomingHearings';

type Court = {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
};

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
  documents: any[] | null;
  created_at: string;
  updated_at: string;
};

const CaseManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active-cases');

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
        
        setCases(data || []);
        setFilteredCases(data || []);
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

  const handleCaseClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowNewCaseForm(false);
  };

  const handleCreateNew = () => {
    setSelectedCase(null);
    setShowNewCaseForm(true);
  };

  const handleCaseCreated = (newCase: Case) => {
    setCases((prev) => [newCase, ...prev]);
    setShowNewCaseForm(false);
    setSelectedCase(newCase);
    toast.success('New case created successfully!');
  };

  const handleCaseUpdated = (updatedCase: Case) => {
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

  return (
    <AppLayout>
      <Helmet>
        <title>Case Management | VakilGPT</title>
      </Helmet>
      
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all your legal cases efficiently</p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Create New Case
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left side - Cases list */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Case Directory</CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search cases..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-2">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active-cases">Active Cases</TabsTrigger>
                    <TabsTrigger value="closed-cases">Closed Cases</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active-cases" className="mt-0">
                    <div className="overflow-y-auto max-h-[70vh]">
                      {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading cases...</div>
                      ) : filteredCases.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
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
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {caseItem.case_title || "Untitled Case"}
                                  </p>
                                  <p className="text-sm text-gray-500">
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
                                  className="text-xs"
                                >
                                  {caseItem.status || "draft"}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <User className="h-3 w-3 mr-1" />
                                <span>{caseItem.client_name || "No client"}</span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <Briefcase className="h-3 w-3 mr-1" />
                                <span>{caseItem.court_name || "No court"}</span>
                              </div>
                              {caseItem.hearing_date && (
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
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
                    <div className="overflow-y-auto max-h-[70vh]">
                      {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading cases...</div>
                      ) : filteredCases.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
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
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {caseItem.case_title || "Untitled Case"}
                                  </p>
                                  <p className="text-sm text-gray-500">
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
                              <div className="mt-2 flex items-center text-xs text-gray-500">
                                <User className="h-3 w-3 mr-1" />
                                <span>{caseItem.client_name || "No client"}</span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <Briefcase className="h-3 w-3 mr-1" />
                                <span>{caseItem.court_name || "No court"}</span>
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
          </div>
          
          {/* Right side - Case details or form */}
          <div className="lg:col-span-2">
            {showNewCaseForm ? (
              <NewCaseForm onCaseCreated={handleCaseCreated} onCancel={() => setShowNewCaseForm(false)} />
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CaseManagementPage;
