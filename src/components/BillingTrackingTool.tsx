
import React, { useState } from 'react';
import { 
  Calendar, Clock, DollarSign, Plus, Search, Filter, 
  FileText, Download, MoreVertical, User, BarChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import GeminiFlashAnalyzer from './GeminiFlashAnalyzer';

// Placeholder for DatePicker component
const DatePicker = ({ value, onChange, placeholder }: any) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-2.5">
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="date"
        placeholder={placeholder}
        className="pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

const BillingTrackingTool = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('time-tracking');
  const [clients, setClients] = useState([
    { id: 'c1', name: 'ABC Corporation', contactName: 'Rahul Mehta', email: 'rahul@abccorp.in', billingRate: 5000 },
    { id: 'c2', name: 'Singh Enterprises', contactName: 'Harpreet Singh', email: 'harpreet@singhent.in', billingRate: 4000 },
    { id: 'c3', name: 'Tech Solutions Ltd', contactName: 'Priya Sharma', email: 'priya@techsol.in', billingRate: 4500 },
  ]);
  
  const [matters, setMatters] = useState([
    { id: 'm1', clientId: 'c1', name: 'Corporate Restructuring', caseNumber: 'CR-2024-001', court: 'NCLT, Delhi' },
    { id: 'm2', clientId: 'c1', name: 'IP Infringement Case', caseNumber: 'CS/456/2024', court: 'Delhi High Court' },
    { id: 'm3', clientId: 'c2', name: 'Property Dispute', caseNumber: 'CS/789/2024', court: 'Delhi High Court' },
    { id: 'm4', clientId: 'c3', name: 'Software Licensing', caseNumber: 'ARB/123/2024', court: 'Arbitration' },
  ]);
  
  const [timeEntries, setTimeEntries] = useState([
    { 
      id: 't1', 
      matterId: 'm1', 
      date: '2025-04-01', 
      hours: 2.5, 
      description: 'Research on corporate restructuring precedents in Indian law', 
      billable: true, 
      billed: false,
      rate: 5000
    },
    { 
      id: 't2', 
      matterId: 'm2', 
      date: '2025-04-02', 
      hours: 1.5, 
      description: 'Drafting cease and desist letter for IP infringement', 
      billable: true, 
      billed: false,
      rate: 5000
    },
    { 
      id: 't3', 
      matterId: 'm3', 
      date: '2025-04-02', 
      hours: 3.0, 
      description: 'Review of property documents and title deeds', 
      billable: true, 
      billed: false,
      rate: 4000
    },
  ]);
  
  // Form states for dialogs
  const [newTimeEntry, setNewTimeEntry] = useState({
    matterId: '',
    date: '',
    hours: '',
    description: '',
    billable: true,
    rate: ''
  });
  
  const [newClient, setNewClient] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    billingRate: ''
  });
  
  const [newMatter, setNewMatter] = useState({
    clientId: '',
    name: '',
    caseNumber: '',
    court: '',
    description: ''
  });
  
  const [invoiceDetails, setInvoiceDetails] = useState({
    clientId: '',
    startDate: '',
    endDate: '',
    dueDate: '',
    includeEntries: [] as string[],
    notes: ''
  });
  
  // Handle time entry creation
  const handleAddTimeEntry = () => {
    if (!newTimeEntry.matterId || !newTimeEntry.date || !newTimeEntry.hours || !newTimeEntry.description) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }
    
    const matterId = newTimeEntry.matterId;
    const matter = matters.find(m => m.id === matterId);
    if (!matter) return;
    
    const client = clients.find(c => c.id === matter.clientId);
    if (!client) return;
    
    const rate = newTimeEntry.rate ? parseFloat(newTimeEntry.rate) : client.billingRate;
    
    const newEntry = {
      id: `t${timeEntries.length + 1}`,
      matterId,
      date: newTimeEntry.date,
      hours: parseFloat(newTimeEntry.hours),
      description: newTimeEntry.description,
      billable: newTimeEntry.billable,
      billed: false,
      rate
    };
    
    setTimeEntries([...timeEntries, newEntry]);
    
    toast({
      title: "Time entry added",
      description: `Added ${newEntry.hours} hours for ${matter.name}`,
    });
    
    // Reset form
    setNewTimeEntry({
      matterId: '',
      date: '',
      hours: '',
      description: '',
      billable: true,
      rate: ''
    });
  };
  
  // Handle client creation
  const handleAddClient = () => {
    if (!newClient.name || !newClient.contactName || !newClient.email || !newClient.billingRate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }
    
    const newClientObj = {
      id: `c${clients.length + 1}`,
      name: newClient.name,
      contactName: newClient.contactName,
      email: newClient.email,
      billingRate: parseFloat(newClient.billingRate)
    };
    
    setClients([...clients, newClientObj]);
    
    toast({
      title: "Client added",
      description: `Added new client: ${newClient.name}`,
    });
    
    // Reset form
    setNewClient({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      billingRate: ''
    });
  };
  
  // Handle matter creation
  const handleAddMatter = () => {
    if (!newMatter.clientId || !newMatter.name) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }
    
    const newMatterObj = {
      id: `m${matters.length + 1}`,
      clientId: newMatter.clientId,
      name: newMatter.name,
      caseNumber: newMatter.caseNumber,
      court: newMatter.court
    };
    
    setMatters([...matters, newMatterObj]);
    
    toast({
      title: "Matter added",
      description: `Added new matter: ${newMatter.name}`,
    });
    
    // Reset form
    setNewMatter({
      clientId: '',
      name: '',
      caseNumber: '',
      court: '',
      description: ''
    });
  };
  
  // Handle invoice generation
  const handleGenerateInvoice = () => {
    if (!invoiceDetails.clientId || !invoiceDetails.startDate || !invoiceDetails.endDate || !invoiceDetails.dueDate) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }
    
    toast({
      title: "Invoice generated",
      description: "Your invoice has been generated and is ready for download.",
    });
    
    // Reset form
    setInvoiceDetails({
      clientId: '',
      startDate: '',
      endDate: '',
      dueDate: '',
      includeEntries: [],
      notes: ''
    });
  };
  
  // Get client name from client ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  // Get matter name from matter ID
  const getMatterName = (matterId: string) => {
    const matter = matters.find(m => m.id === matterId);
    return matter ? matter.name : 'Unknown Matter';
  };
  
  // Get client ID from matter ID
  const getClientIdFromMatter = (matterId: string) => {
    const matter = matters.find(m => m.id === matterId);
    return matter ? matter.clientId : '';
  };
  
  // Calculate total billable amount
  const calculateTotalBillable = () => {
    return timeEntries
      .filter(entry => entry.billable && !entry.billed)
      .reduce((total, entry) => total + (entry.hours * entry.rate), 0);
  };
  
  // Format amount as Indian currency
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get unbilled time entries for a client
  const getUnbilledEntriesForClient = (clientId: string) => {
    const clientMatters = matters.filter(m => m.clientId === clientId).map(m => m.id);
    return timeEntries.filter(e => 
      clientMatters.includes(e.matterId) && 
      e.billable && 
      !e.billed
    );
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="time-tracking">
            <Clock className="mr-2 h-4 w-4" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="clients">
            <User className="mr-2 h-4 w-4" />
            Clients & Matters
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="time-tracking" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Time Entries</h2>
              <p className="text-muted-foreground">
                Track and manage your billable hours
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Time
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Record Time Entry</DialogTitle>
                  <DialogDescription>
                    Log your time for billing and tracking purposes.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="matter">Matter <span className="text-red-500">*</span></Label>
                      <Select
                        value={newTimeEntry.matterId}
                        onValueChange={(value) => setNewTimeEntry({...newTimeEntry, matterId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a matter" />
                        </SelectTrigger>
                        <SelectContent>
                          {matters.map(matter => (
                            <SelectItem key={matter.id} value={matter.id}>
                              {matter.name} ({getClientName(matter.clientId)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                        <DatePicker
                          value={newTimeEntry.date}
                          onChange={(value: string) => setNewTimeEntry({...newTimeEntry, date: value})}
                          placeholder="Select date"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hours">Hours <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="number"
                            step="0.25"
                            min="0.25"
                            placeholder="Enter hours"
                            className="pl-10"
                            value={newTimeEntry.hours}
                            onChange={(e) => setNewTimeEntry({...newTimeEntry, hours: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                      <Textarea
                        placeholder="Describe the work performed"
                        value={newTimeEntry.description}
                        onChange={(e) => setNewTimeEntry({...newTimeEntry, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rate">Hourly Rate (₹)</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="number"
                            placeholder="Default client rate"
                            className="pl-10"
                            value={newTimeEntry.rate}
                            onChange={(e) => setNewTimeEntry({...newTimeEntry, rate: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-8">
                        <Checkbox
                          id="billable"
                          checked={newTimeEntry.billable}
                          onCheckedChange={(checked) => 
                            setNewTimeEntry({...newTimeEntry, billable: checked === true})
                          }
                        />
                        <Label htmlFor="billable">Billable time</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleAddTimeEntry}>Save Time Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search time entries..." className="pl-8" />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Time Entries</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="filter-client">Client</Label>
                    <Select>
                      <SelectTrigger id="filter-client">
                        <SelectValue placeholder="All Clients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="filter-date-range">Date Range</Label>
                    <Select>
                      <SelectTrigger id="filter-date-range">
                        <SelectValue placeholder="This Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="filter-status">Status</Label>
                    <Select>
                      <SelectTrigger id="filter-status">
                        <SelectValue placeholder="All Entries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Entries</SelectItem>
                        <SelectItem value="billable">Billable Only</SelectItem>
                        <SelectItem value="non-billable">Non-Billable Only</SelectItem>
                        <SelectItem value="billed">Billed</SelectItem>
                        <SelectItem value="unbilled">Unbilled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">Reset Filters</Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Card>
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Time Entries</CardTitle>
                <Badge variant="outline" className="font-normal">
                  Total Unbilled: {formatIndianCurrency(calculateTotalBillable())}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead className="hidden md:table-cell">Matter</TableHead>
                    <TableHead className="hidden md:table-cell">Client</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map(entry => {
                    const clientId = getClientIdFromMatter(entry.matterId);
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.hours.toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">{getMatterName(entry.matterId)}</TableCell>
                        <TableCell className="hidden md:table-cell">{getClientName(clientId)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                        <TableCell className="text-right">
                          {entry.billable ? formatIndianCurrency(entry.hours * entry.rate) : '-'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Entry</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Billed</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {timeEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-gray-500">No time entries found</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="add-time"]')?.click()}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Record Your First Time Entry
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Button variant="outline">Export Time Report</Button>
              <Button variant="outline" onClick={() => setActiveTab('invoices')}>
                Create Invoice
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Clients & Matters</h2>
              <p className="text-muted-foreground">
                Manage your clients and their legal matters
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New Matter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Matter</DialogTitle>
                    <DialogDescription>
                      Create a new legal matter for an existing client.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Client <span className="text-red-500">*</span></Label>
                      <Select
                        value={newMatter.clientId}
                        onValueChange={(value) => setNewMatter({...newMatter, clientId: value})}
                      >
                        <SelectTrigger id="client">
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="matter-name">Matter Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="matter-name"
                        placeholder="Enter matter name"
                        value={newMatter.name}
                        onChange={(e) => setNewMatter({...newMatter, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="case-number">Case Number</Label>
                        <Input
                          id="case-number"
                          placeholder="e.g. CS/123/2024"
                          value={newMatter.caseNumber}
                          onChange={(e) => setNewMatter({...newMatter, caseNumber: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="court">Court/Jurisdiction</Label>
                        <Input
                          id="court"
                          placeholder="e.g. Delhi High Court"
                          value={newMatter.court}
                          onChange={(e) => setNewMatter({...newMatter, court: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="matter-description">Description</Label>
                      <Textarea
                        id="matter-description"
                        placeholder="Enter matter details"
                        value={newMatter.description}
                        onChange={(e) => setNewMatter({...newMatter, description: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddMatter}>Add Matter</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Create a new client to track matters and billing.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client-name">Client Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="client-name"
                        placeholder="Enter client name"
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Contact Person <span className="text-red-500">*</span></Label>
                        <Input
                          id="contact-name"
                          placeholder="Enter contact name"
                          value={newClient.contactName}
                          onChange={(e) => setNewClient({...newClient, contactName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={newClient.email}
                          onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billing-rate">Default Billing Rate (₹/hr) <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <div className="absolute left-3 top-2.5">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="billing-rate"
                            type="number"
                            placeholder="Enter hourly rate"
                            className="pl-10"
                            value={newClient.billingRate}
                            onChange={(e) => setNewClient({...newClient, billingRate: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter client address"
                        value={newClient.address}
                        onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddClient}>Add Client</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {clients.map(client => (
              <Card key={client.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{client.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Client</DropdownMenuItem>
                        <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                        <DropdownMenuItem>View Time Entries</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Archive Client</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>
                    Contact: {client.contactName} • {client.email} • {formatIndianCurrency(client.billingRate)}/hr
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Matters:</h4>
                    <div className="space-y-2">
                      {matters
                        .filter(matter => matter.clientId === client.id)
                        .map(matter => (
                          <div key={matter.id} className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <div>
                              <p className="font-medium">{matter.name}</p>
                              {(matter.caseNumber || matter.court) && (
                                <p className="text-sm text-gray-500">
                                  {matter.caseNumber && `${matter.caseNumber} • `}
                                  {matter.court}
                                </p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        ))
                      }
                      {matters.filter(matter => matter.clientId === client.id).length === 0 && (
                        <p className="text-sm text-gray-500 p-2">No matters yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Matter
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {clients.length === 0 && (
              <Card className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No clients yet</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Add your first client to get started with billing and time tracking.
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Client
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
              <p className="text-muted-foreground">
                Generate and manage client invoices
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Generate New Invoice</DialogTitle>
                  <DialogDescription>
                    Create an invoice from your time entries.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-client">Client <span className="text-red-500">*</span></Label>
                    <Select
                      value={invoiceDetails.clientId}
                      onValueChange={(value) => setInvoiceDetails({...invoiceDetails, clientId: value})}
                    >
                      <SelectTrigger id="invoice-client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date <span className="text-red-500">*</span></Label>
                      <DatePicker
                        value={invoiceDetails.startDate}
                        onChange={(value: string) => setInvoiceDetails({...invoiceDetails, startDate: value})}
                        placeholder="Start date"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date <span className="text-red-500">*</span></Label>
                      <DatePicker
                        value={invoiceDetails.endDate}
                        onChange={(value: string) => setInvoiceDetails({...invoiceDetails, endDate: value})}
                        placeholder="End date"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date <span className="text-red-500">*</span></Label>
                      <DatePicker
                        value={invoiceDetails.dueDate}
                        onChange={(value: string) => setInvoiceDetails({...invoiceDetails, dueDate: value})}
                        placeholder="Due date"
                      />
                    </div>
                  </div>
                  
                  {invoiceDetails.clientId && (
                    <div className="space-y-2 border p-4 rounded-md bg-gray-50 dark:bg-gray-800/50">
                      <Label>Time Entries to Include</Label>
                      <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                        {getUnbilledEntriesForClient(invoiceDetails.clientId).length > 0 ? (
                          getUnbilledEntriesForClient(invoiceDetails.clientId).map(entry => (
                            <div key={entry.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`entry-${entry.id}`}
                                checked={invoiceDetails.includeEntries.includes(entry.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setInvoiceDetails({
                                      ...invoiceDetails,
                                      includeEntries: [...invoiceDetails.includeEntries, entry.id]
                                    });
                                  } else {
                                    setInvoiceDetails({
                                      ...invoiceDetails,
                                      includeEntries: invoiceDetails.includeEntries.filter(id => id !== entry.id)
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={`entry-${entry.id}`} className="text-sm">
                                {entry.date}: {entry.hours}hrs - {getMatterName(entry.matterId)} - {formatIndianCurrency(entry.hours * entry.rate)}
                              </Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No billable time entries for this client.</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Invoice Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter additional notes for the invoice"
                      value={invoiceDetails.notes}
                      onChange={(e) => setInvoiceDetails({...invoiceDetails, notes: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">Preview Invoice</Button>
                  <Button onClick={handleGenerateInvoice}>Generate Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No invoices yet</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Generate your first invoice to bill your clients for your services.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Invoice
            </Button>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
            <p className="text-muted-foreground">
              Analyze your legal practice performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billable Hours</CardTitle>
                <CardDescription>Total billable hours by client</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center border-t">
                <p className="text-gray-500">Chart will appear here</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue</CardTitle>
                <CardDescription>Total revenue by month</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center border-t">
                <p className="text-gray-500">Chart will appear here</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Time Distribution</CardTitle>
                <CardDescription>Hours spent by matter type</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center border-t">
                <p className="text-gray-500">Chart will appear here</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Generate custom reports for specific insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time-by-client">Time by Client</SelectItem>
                      <SelectItem value="time-by-matter">Time by Matter</SelectItem>
                      <SelectItem value="revenue-by-client">Revenue by Client</SelectItem>
                      <SelectItem value="productivity">Productivity Analysis</SelectItem>
                      <SelectItem value="unbilled-time">Unbilled Time Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="this-quarter">This Quarter</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingTrackingTool;
