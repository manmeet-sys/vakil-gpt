
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  IndianRupee,
  Edit,
  CheckCircle2,
  AlertTriangle,
  BarChart,
  PieChart,
  User,
  FileText,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO, addDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Types
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  category: string;
}

interface Matter {
  id: string;
  clientId: string;
  title: string;
  description: string;
  startDate: string;
  status: 'active' | 'pending' | 'closed';
  courtDetails: string;
  caseNumber: string;
  practiceArea: string;
}

interface TimeEntry {
  id: string;
  matterId: string;
  clientId: string;
  date: string;
  duration: number; // in minutes
  description: string;
  rate: number; // hourly rate in ₹
  billable: boolean;
  invoiced: boolean;
  invoiceId?: string;
}

interface Invoice {
  id: string;
  clientId: string;
  matterId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Demo data generator helpers
const generateId = () => Math.random().toString(36).substring(2, 10);

const practiceAreas = [
  'Constitutional Law', 
  'Criminal Law', 
  'Civil Litigation', 
  'Corporate Law', 
  'Intellectual Property', 
  'Family Law',
  'Real Estate Law',
  'Tax Law',
  'Labor Law',
  'Environmental Law'
];

const indianCourts = [
  'Supreme Court of India',
  'Delhi High Court',
  'Bombay High Court',
  'Calcutta High Court',
  'Madras High Court',
  'District Court, Delhi',
  'National Company Law Tribunal',
  'Consumer Disputes Redressal Forum'
];

// Generate demo data
const generateDemoClients = (): Client[] => {
  return [
    {
      id: generateId(),
      name: 'Sharma Industries Pvt. Ltd.',
      email: 'contact@sharmaindustries.in',
      phone: '+91 98765 43210',
      address: '42, Nehru Place, New Delhi, 110019',
      gstNumber: '07AABCS1429B1Z1',
      category: 'corporate'
    },
    {
      id: generateId(),
      name: 'Patel Enterprises',
      email: 'info@patelenterprises.com',
      phone: '+91 99876 54321',
      address: '15, MG Road, Bangalore, 560001',
      gstNumber: '29AADCP2644H1ZA',
      category: 'corporate'
    },
    {
      id: generateId(),
      name: 'Rahul Verma',
      email: 'rahul.verma@gmail.com',
      phone: '+91 98123 45678',
      address: '78, Jubilee Hills, Hyderabad, 500033',
      gstNumber: '',
      category: 'individual'
    },
    {
      id: generateId(),
      name: 'Mehta Associates',
      email: 'contact@mehtaassociates.co.in',
      phone: '+91 99123 78456',
      address: '234, Park Street, Kolkata, 700017',
      gstNumber: '19AARFM1324G1ZL',
      category: 'corporate'
    },
    {
      id: generateId(),
      name: 'Sunita Gupta',
      email: 'sunita.g@outlook.com',
      phone: '+91 97234 56789',
      address: '56, Bandra West, Mumbai, 400050',
      gstNumber: '',
      category: 'individual'
    }
  ];
};

const generateDemoMatters = (clients: Client[]): Matter[] => {
  const matters: Matter[] = [];
  
  clients.forEach(client => {
    // Add 1-2 matters per client
    const numMatters = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numMatters; i++) {
      const practiceArea = practiceAreas[Math.floor(Math.random() * practiceAreas.length)];
      const court = indianCourts[Math.floor(Math.random() * indianCourts.length)];
      const statuses = ['active', 'pending', 'closed'] as const;
      const status = statuses[Math.floor(Math.random() * 3)];
      
      matters.push({
        id: generateId(),
        clientId: client.id,
        title: `${client.name} - ${practiceArea} Matter`,
        description: `Legal representation for ${client.name} in a ${practiceArea.toLowerCase()} matter.`,
        startDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status,
        courtDetails: court,
        caseNumber: `${Math.floor(Math.random() * 999)}/2023`,
        practiceArea
      });
    }
  });
  
  return matters;
};

const generateDemoTimeEntries = (matters: Matter[], clients: Client[]): TimeEntry[] => {
  const timeEntries: TimeEntry[] = [];
  
  matters.forEach(matter => {
    // Add 2-5 time entries per matter
    const numEntries = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numEntries; i++) {
      const date = new Date(Date.now() - Math.random() * 5000000000);
      const duration = (Math.floor(Math.random() * 4) + 1) * 30; // 30-150 minutes in 30-min increments
      const billable = Math.random() > 0.2; // 80% chance of being billable
      const invoiced = billable && Math.random() > 0.5; // 50% chance of being invoiced if billable
      
      timeEntries.push({
        id: generateId(),
        matterId: matter.id,
        clientId: matter.clientId,
        date: date.toISOString(),
        duration,
        description: [
          'Client consultation',
          'Document review',
          'Court appearance',
          'Legal research',
          'Drafting pleadings',
          'Settlement negotiation',
          'Case strategy meeting'
        ][Math.floor(Math.random() * 7)],
        rate: [2500, 3500, 4500, 5000, 6000][Math.floor(Math.random() * 5)], // Hourly rates in ₹
        billable,
        invoiced
      });
    }
  });
  
  return timeEntries;
};

const generateDemoInvoices = (timeEntries: TimeEntry[], clients: Client[], matters: Matter[]): Invoice[] => {
  const invoices: Invoice[] = [];
  const invoicedEntries = timeEntries.filter(entry => entry.invoiced);
  
  // Group time entries by client and matter
  const entriesByClientAndMatter: Record<string, TimeEntry[]> = {};
  
  invoicedEntries.forEach(entry => {
    const key = `${entry.clientId}-${entry.matterId}`;
    if (!entriesByClientAndMatter[key]) {
      entriesByClientAndMatter[key] = [];
    }
    entriesByClientAndMatter[key].push(entry);
  });
  
  // Create invoices for each group
  Object.entries(entriesByClientAndMatter).forEach(([key, entries]) => {
    if (entries.length === 0) return;
    
    const [clientId, matterId] = key.split('-');
    const invoiceId = generateId();
    const issueDate = new Date(Date.now() - Math.random() * 3000000000);
    const dueDate = addDays(issueDate, 15);
    
    const items: InvoiceItem[] = entries.map(entry => ({
      id: generateId(),
      description: `${entry.description} - ${format(parseISO(entry.date), 'dd/MM/yyyy')}`,
      quantity: entry.duration / 60, // Convert minutes to hours
      rate: entry.rate,
      amount: (entry.duration / 60) * entry.rate
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstRate = 18; // 18% GST
    const gstAmount = subtotal * (gstRate / 100);
    const total = subtotal + gstAmount;
    
    const statuses = ['draft', 'sent', 'paid', 'overdue'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    invoices.push({
      id: invoiceId,
      clientId,
      matterId,
      invoiceNumber: `INV-${Math.floor(Math.random() * 1000) + 1000}`,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      items,
      subtotal,
      gstRate,
      gstAmount,
      total,
      status,
      notes: 'Payment to be made by NEFT/RTGS. Bank details are mentioned in the attached document.'
    });
    
    // Update time entries with invoice ID
    entries.forEach(entry => {
      const index = timeEntries.findIndex(te => te.id === entry.id);
      if (index >= 0) {
        timeEntries[index].invoiceId = invoiceId;
      }
    });
  });
  
  return invoices;
};

const BillingTrackingTool = () => {
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [matterFormOpen, setMatterFormOpen] = useState(false);
  const [timeEntryFormOpen, setTimeEntryFormOpen] = useState(false);
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  const [selectedTimeEntry, setSelectedTimeEntry] = useState<TimeEntry | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const [newClient, setNewClient] = useState<Partial<Client>>({});
  const [newMatter, setNewMatter] = useState<Partial<Matter>>({});
  const [newTimeEntry, setNewTimeEntry] = useState<Partial<TimeEntry>>({});
  
  // Initialize with demo data
  useEffect(() => {
    const demoClients = generateDemoClients();
    const demoMatters = generateDemoMatters(demoClients);
    const demoTimeEntries = generateDemoTimeEntries(demoMatters, demoClients);
    const demoInvoices = generateDemoInvoices(demoTimeEntries, demoClients, demoMatters);
    
    setClients(demoClients);
    setMatters(demoMatters);
    setTimeEntries(demoTimeEntries);
    setInvoices(demoInvoices);
  }, []);
  
  // Derived data
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMatters = matters.filter(matter => {
    const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          matter.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || matter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const filteredTimeEntries = timeEntries.filter(entry => {
    const matter = matters.find(m => m.id === entry.matterId);
    const client = clients.find(c => c.id === entry.clientId);
    
    const matchesSearch = 
      (matter?.title.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      (client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBillableFilter = statusFilter === 'all' || 
                                (statusFilter === 'billable' && entry.billable) ||
                                (statusFilter === 'non-billable' && !entry.billable) ||
                                (statusFilter === 'invoiced' && entry.invoiced) ||
                                (statusFilter === 'uninvoiced' && entry.billable && !entry.invoiced);
    
    return matchesSearch && matchesBillableFilter;
  });
  
  const filteredInvoices = invoices.filter(invoice => {
    const client = clients.find(c => c.id === invoice.clientId);
    const matter = matters.find(m => m.id === invoice.matterId);
    
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (matter?.title.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatusFilter = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatusFilter;
  });
  
  // Total billed/unbilled amounts
  const totalBilled = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalUnbilled = timeEntries
    .filter(entry => entry.billable && !entry.invoiced)
    .reduce((sum, entry) => sum + (entry.duration / 60) * entry.rate, 0);
  
  // Client operations
  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the client name and email.",
        variant: "destructive",
      });
      return;
    }
    
    const client: Client = {
      id: generateId(),
      name: newClient.name || '',
      email: newClient.email || '',
      phone: newClient.phone || '',
      address: newClient.address || '',
      gstNumber: newClient.gstNumber || '',
      category: newClient.category || 'corporate'
    };
    
    setClients([...clients, client]);
    setNewClient({});
    setClientFormOpen(false);
    
    toast({
      title: "Client Added",
      description: `${client.name} has been added successfully.`,
    });
  };
  
  const handleDeleteClient = (id: string) => {
    // Check if client has matters
    const clientMatters = matters.filter(m => m.clientId === id);
    if (clientMatters.length > 0) {
      toast({
        title: "Cannot Delete Client",
        description: "This client has active matters. Please close or delete the matters first.",
        variant: "destructive",
      });
      return;
    }
    
    setClients(clients.filter(c => c.id !== id));
    toast({
      title: "Client Deleted",
      description: "The client has been deleted successfully.",
    });
  };
  
  // Matter operations
  const handleAddMatter = () => {
    if (!newMatter.clientId || !newMatter.title || !newMatter.startDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const matter: Matter = {
      id: generateId(),
      clientId: newMatter.clientId || '',
      title: newMatter.title || '',
      description: newMatter.description || '',
      startDate: newMatter.startDate || new Date().toISOString(),
      status: newMatter.status as 'active' | 'pending' | 'closed' || 'active',
      courtDetails: newMatter.courtDetails || '',
      caseNumber: newMatter.caseNumber || '',
      practiceArea: newMatter.practiceArea || ''
    };
    
    setMatters([...matters, matter]);
    setNewMatter({});
    setMatterFormOpen(false);
    
    toast({
      title: "Matter Added",
      description: `${matter.title} has been added successfully.`,
    });
  };
  
  const handleDeleteMatter = (id: string) => {
    // Check if matter has time entries
    const matterEntries = timeEntries.filter(te => te.matterId === id);
    if (matterEntries.length > 0) {
      toast({
        title: "Cannot Delete Matter",
        description: "This matter has time entries. Please delete the time entries first.",
        variant: "destructive",
      });
      return;
    }
    
    setMatters(matters.filter(m => m.id !== id));
    toast({
      title: "Matter Deleted",
      description: "The matter has been deleted successfully.",
    });
  };
  
  // Time entry operations
  const handleAddTimeEntry = () => {
    if (!newTimeEntry.matterId || !newTimeEntry.date || !newTimeEntry.duration || !newTimeEntry.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const matter = matters.find(m => m.id === newTimeEntry.matterId);
    if (!matter) {
      toast({
        title: "Invalid Matter",
        description: "Please select a valid matter.",
        variant: "destructive",
      });
      return;
    }
    
    const timeEntry: TimeEntry = {
      id: generateId(),
      matterId: newTimeEntry.matterId || '',
      clientId: matter.clientId,
      date: newTimeEntry.date || new Date().toISOString(),
      duration: Number(newTimeEntry.duration) || 0,
      description: newTimeEntry.description || '',
      rate: Number(newTimeEntry.rate) || 0,
      billable: newTimeEntry.billable || false,
      invoiced: false
    };
    
    setTimeEntries([...timeEntries, timeEntry]);
    setNewTimeEntry({});
    setTimeEntryFormOpen(false);
    
    toast({
      title: "Time Entry Added",
      description: `${timeEntry.duration} minutes have been recorded.`,
    });
  };
  
  const handleDeleteTimeEntry = (id: string) => {
    const entry = timeEntries.find(te => te.id === id);
    if (entry?.invoiced) {
      toast({
        title: "Cannot Delete Time Entry",
        description: "This time entry has been invoiced. Please delete the invoice first.",
        variant: "destructive",
      });
      return;
    }
    
    setTimeEntries(timeEntries.filter(te => te.id !== id));
    toast({
      title: "Time Entry Deleted",
      description: "The time entry has been deleted successfully.",
    });
  };
  
  // Invoice operations
  const handleCreateInvoice = (clientId: string, matterId: string) => {
    const unbilledEntries = timeEntries.filter(
      entry => entry.clientId === clientId && entry.matterId === matterId && entry.billable && !entry.invoiced
    );
    
    if (unbilledEntries.length === 0) {
      toast({
        title: "No Unbilled Entries",
        description: "There are no unbilled time entries for this matter.",
        variant: "destructive",
      });
      return;
    }
    
    const client = clients.find(c => c.id === clientId);
    const matter = matters.find(m => m.id === matterId);
    
    if (!client || !matter) {
      toast({
        title: "Invalid Client or Matter",
        description: "Please select a valid client and matter.",
        variant: "destructive",
      });
      return;
    }
    
    const invoiceId = generateId();
    const issueDate = new Date();
    const dueDate = addDays(issueDate, 15);
    
    const items: InvoiceItem[] = unbilledEntries.map(entry => ({
      id: generateId(),
      description: `${entry.description} - ${format(parseISO(entry.date), 'dd/MM/yyyy')}`,
      quantity: entry.duration / 60, // Convert minutes to hours
      rate: entry.rate,
      amount: (entry.duration / 60) * entry.rate
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstRate = client.gstNumber ? 18 : 0; // Apply GST only if client has GST number
    const gstAmount = subtotal * (gstRate / 100);
    const total = subtotal + gstAmount;
    
    const invoice: Invoice = {
      id: invoiceId,
      clientId,
      matterId,
      invoiceNumber: `INV-${Math.floor(1000 + invoices.length + 1)}`,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      items,
      subtotal,
      gstRate,
      gstAmount,
      total,
      status: 'draft',
      notes: 'Payment to be made by NEFT/RTGS. Bank details are mentioned in the attached document.'
    };
    
    setInvoices([...invoices, invoice]);
    
    // Mark time entries as invoiced
    const updatedTimeEntries = timeEntries.map(entry => {
      if (unbilledEntries.some(ue => ue.id === entry.id)) {
        return { ...entry, invoiced: true, invoiceId };
      }
      return entry;
    });
    
    setTimeEntries(updatedTimeEntries);
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${invoice.invoiceNumber} has been created successfully.`,
    });
  };
  
  const handleDeleteInvoice = (id: string) => {
    // Update time entries to mark them as uninvoiced
    const updatedTimeEntries = timeEntries.map(entry => {
      if (entry.invoiceId === id) {
        return { ...entry, invoiced: false, invoiceId: undefined };
      }
      return entry;
    });
    
    setTimeEntries(updatedTimeEntries);
    setInvoices(invoices.filter(inv => inv.id !== id));
    
    toast({
      title: "Invoice Deleted",
      description: "The invoice has been deleted successfully.",
    });
  };
  
  const handleUpdateInvoiceStatus = (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue') => {
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === id) {
        return { ...invoice, status };
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    
    toast({
      title: "Invoice Updated",
      description: `Invoice status changed to ${status}.`,
    });
  };
  
  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getClientById = (id: string) => clients.find(client => client.id === id);
  const getMatterById = (id: string) => matters.find(matter => matter.id === id);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Render functions
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
          <CardDescription>Summary of billed and unbilled amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Total Billed</span>
              <span className="text-lg font-semibold">{formatCurrency(totalBilled)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Unbilled Work</span>
              <span className="text-lg font-semibold">{formatCurrency(totalUnbilled)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">Potential Revenue</span>
              <span className="text-lg font-semibold">{formatCurrency(totalBilled + totalUnbilled)}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-2">Invoice Status</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {invoices.filter(i => i.status === 'paid').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {invoices.filter(i => i.status === 'overdue').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {invoices.filter(i => i.status === 'sent').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {invoices.filter(i => i.status === 'draft').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Draft</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Activities</CardTitle>
          <CardDescription>Your latest time entries and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map(entry => {
                const matter = getMatterById(entry.matterId);
                const client = getClientById(entry.clientId);
                
                return (
                  <div key={entry.id} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{matter?.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{client?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDuration(entry.duration)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(parseISO(entry.date), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mt-1">{entry.description}</p>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Matter Status</CardTitle>
          <CardDescription>Overview of your legal matters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {matters.filter(m => m.status === 'active').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {matters.filter(m => m.status === 'pending').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {matters.filter(m => m.status === 'closed').length}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Closed</p>
              </div>
            </div>
            
            <h4 className="font-medium mb-2 mt-4">Practice Areas</h4>
            <div className="space-y-2">
              {practiceAreas.slice(0, 5).map(area => {
                const count = matters.filter(m => m.practiceArea === area).length;
                if (count === 0) return null;
                
                return (
                  <div key={area} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderClients = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search clients..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="ml-4" onClick={() => setClientFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
      
      <div className="bg-white dark:bg-zinc-800/90 overflow-hidden shadow rounded-lg">
        <div className="min-w-full align-middle overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  GST Number
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {client.category === 'corporate' ? 'Corporate' : 'Individual'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{client.email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{client.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {client.gstNumber || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Open menu</span>
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                          <User className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No clients found. Add a new client to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Client Form Dialog */}
      <Dialog open={clientFormOpen} onOpenChange={setClientFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter client details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Full Name / Company Name *</Label>
              <Input
                id="name"
                value={newClient.name || ''}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email || ''}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={newClient.address || ''}
                onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gstNumber">GST Number (if applicable)</Label>
                <Input
                  id="gstNumber"
                  value={newClient.gstNumber || ''}
                  onChange={(e) => setNewClient({ ...newClient, gstNumber: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Client Type</Label>
                <Select
                  value={newClient.category || 'corporate'}
                  onValueChange={(value) => setNewClient({ ...newClient, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClient}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Client Details Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        {selectedClient && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedClient.name}</DialogTitle>
              <DialogDescription>
                Client details and related matters
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h4>
                  <p className="mt-1">{selectedClient.email}</p>
                  <p>{selectedClient.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h4>
                  <p className="mt-1">{selectedClient.address}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">GST Number</h4>
                <p className="mt-1">{selectedClient.gstNumber || 'N/A'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Related Matters</h4>
                {matters.filter(m => m.clientId === selectedClient.id).length > 0 ? (
                  <div className="space-y-2">
                    {matters.filter(m => m.clientId === selectedClient.id).map(matter => (
                      <div key={matter.id} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-md">
                        <div className="flex justify-between">
                          <p className="font-medium">{matter.title}</p>
                          <Badge className={getStatusColor(matter.status)}>
                            {matter.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {matter.courtDetails} - {matter.caseNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No matters found for this client.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedClient(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
  
  const renderMatters = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search matters..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="ml-4" onClick={() => setMatterFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Matter
        </Button>
      </div>
      
      <div className="bg-white dark:bg-zinc-800/90 overflow-hidden shadow rounded-lg">
        <div className="min-w-full align-middle overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Matter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Court Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMatters.map((matter) => {
                const client = getClientById(matter.clientId);
                
                return (
                  <tr key={matter.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{matter.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {format(parseISO(matter.startDate), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{client?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{matter.courtDetails}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{matter.caseNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(matter.status)}>
                        {matter.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedMatter(matter)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteMatter(matter.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Matter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filteredMatters.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No matters found. Add a new matter to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Matter Form Dialog */}
      <Dialog open={matterFormOpen} onOpenChange={setMatterFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Matter</DialogTitle>
            <DialogDescription>
              Enter matter details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select
                value={newMatter.clientId}
                onValueChange={(value) => setNewMatter({ ...newMatter, clientId: value })}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Matter Title *</Label>
              <Input
                id="title"
                value={newMatter.title || ''}
                onChange={(e) => setNewMatter({ ...newMatter, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMatter.description || ''}
                onChange={(e) => setNewMatter({ ...newMatter, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newMatter.startDate ? new Date(newMatter.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewMatter({ ...newMatter, startDate: new Date(e.target.value).toISOString() })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newMatter.status || 'active'}
                  onValueChange={(value) => setNewMatter({ ...newMatter, status: value as 'active' | 'pending' | 'closed' })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="courtDetails">Court</Label>
                <Select
                  value={newMatter.courtDetails}
                  onValueChange={(value) => setNewMatter({ ...newMatter, courtDetails: value })}
                >
                  <SelectTrigger id="courtDetails">
                    <SelectValue placeholder="Select court" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianCourts.map((court) => (
                      <SelectItem key={court} value={court}>
                        {court}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caseNumber">Case Number</Label>
                <Input
                  id="caseNumber"
                  value={newMatter.caseNumber || ''}
                  onChange={(e) => setNewMatter({ ...newMatter, caseNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="practiceArea">Practice Area</Label>
              <Select
                value={newMatter.practiceArea}
                onValueChange={(value) => setNewMatter({ ...newMatter, practiceArea: value })}
              >
                <SelectTrigger id="practiceArea">
                  <SelectValue placeholder="Select practice area" />
                </SelectTrigger>
                <SelectContent>
                  {practiceAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatterFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMatter}>Add Matter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Matter Details Dialog */}
      <Dialog open={!!selectedMatter} onOpenChange={(open) => !open && setSelectedMatter(null)}>
        {selectedMatter && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedMatter.title}</DialogTitle>
              <DialogDescription>
                Matter details and related time entries
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</h4>
                  <p className="mt-1">{getClientById(selectedMatter.clientId)?.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                  <Badge className={`mt-1 ${getStatusColor(selectedMatter.status)}`}>
                    {selectedMatter.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                <p className="mt-1">{selectedMatter.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Court</h4>
                  <p className="mt-1">{selectedMatter.courtDetails}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Case Number</h4>
                  <p className="mt-1">{selectedMatter.caseNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Practice Area</h4>
                  <p className="mt-1">{selectedMatter.practiceArea}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</h4>
                  <p className="mt-1">{format(parseISO(selectedMatter.startDate), 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Entries</h4>
                  <Button size="sm" variant="outline" onClick={() => {
                    setTimeEntryFormOpen(true);
                    setNewTimeEntry({ matterId: selectedMatter.id });
                  }}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Time
                  </Button>
                </div>
                
                {timeEntries.filter(te => te.matterId === selectedMatter.id).length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {timeEntries
                      .filter(te => te.matterId === selectedMatter.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(entry => (
                        <div key={entry.id} className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-md flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              <span className="text-sm">{formatDuration(entry.duration)}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {format(parseISO(entry.date), 'dd/MM/yyyy')}
                              </span>
                            </div>
                            <p className="text-sm">{entry.description}</p>
                          </div>
                          <Badge className={entry.billable ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}>
                            {entry.billable ? (entry.invoiced ? 'Invoiced' : 'Billable') : 'Non-billable'}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No time entries found for this matter.</p>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoices</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateInvoice(selectedMatter.clientId, selectedMatter.id)}
                    disabled={!timeEntries.some(
                      entry => entry.matterId === selectedMatter.id && entry.billable && !entry.invoiced
                    )}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Generate Invoice
                  </Button>
                </div>
                
                {invoices.filter(inv => inv.matterId === selectedMatter.id).length > 0 ? (
                  <div className="space-y-2">
                    {invoices
                      .filter(inv => inv.matterId === selectedMatter.id)
                      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
                      .map(invoice => (
                        <div key={invoice.id} className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-md flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1 text-gray-500" />
                              <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {format(parseISO(invoice.issueDate), 'dd/MM/yyyy')}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{formatCurrency(invoice.total)}</p>
                          </div>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No invoices found for this matter.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMatter(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
  
  const renderTimeEntries = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search time entries..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entries</SelectItem>
              <SelectItem value="billable">Billable</SelectItem>
              <SelectItem value="non-billable">Non-billable</SelectItem>
              <SelectItem value="invoiced">Invoiced</SelectItem>
              <SelectItem value="uninvoiced">Uninvoiced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="ml-4" onClick={() => setTimeEntryFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Time
        </Button>
      </div>
      
      <div className="bg-white dark:bg-zinc-800/90 overflow-hidden shadow rounded-lg">
        <div className="min-w-full align-middle overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Matter & Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTimeEntries.map((entry) => {
                const matter = getMatterById(entry.matterId);
                const client = getClientById(entry.clientId);
                const amount = (entry.duration / 60) * entry.rate;
                
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {format(parseISO(entry.date), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{matter?.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDuration(entry.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatCurrency(amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          entry.billable
                            ? entry.invoiced
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }
                      >
                        {entry.billable ? (entry.invoiced ? 'Invoiced' : 'Billable') : 'Non-billable'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={entry.invoiced}
                        onClick={() => handleDeleteTimeEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredTimeEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No time entries found. Add a new time entry to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Time Entry Form Dialog */}
      <Dialog open={timeEntryFormOpen} onOpenChange={setTimeEntryFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Time Entry</DialogTitle>
            <DialogDescription>
              Record your billable or non-billable time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="matterId">Matter *</Label>
              <Select
                value={newTimeEntry.matterId}
                onValueChange={(value) => setNewTimeEntry({ ...newTimeEntry, matterId: value })}
              >
                <SelectTrigger id="matterId">
                  <SelectValue placeholder="Select a matter" />
                </SelectTrigger>
                <SelectContent>
                  {matters.map((matter) => (
                    <SelectItem key={matter.id} value={matter.id}>
                      {matter.title} ({getClientById(matter.clientId)?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTimeEntry.date ? new Date(newTimeEntry.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, date: new Date(e.target.value).toISOString() })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  step="1"
                  value={newTimeEntry.duration || ''}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, duration: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newTimeEntry.description || ''}
                onChange={(e) => setNewTimeEntry({ ...newTimeEntry, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rate">Hourly Rate (₹) *</Label>
                <Input
                  id="rate"
                  type="number"
                  min="0"
                  step="100"
                  value={newTimeEntry.rate || ''}
                  onChange={(e) => setNewTimeEntry({ ...newTimeEntry, rate: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center gap-2 pt-8">
                <Checkbox
                  id="billable"
                  checked={newTimeEntry.billable || false}
                  onCheckedChange={(checked) => 
                    setNewTimeEntry({ ...newTimeEntry, billable: checked as boolean })
                  }
                />
                <Label htmlFor="billable" className="cursor-pointer">Billable</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTimeEntryFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTimeEntry}>Add Time Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
  
  const renderInvoices = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search invoices..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white dark:bg-zinc-800/90 overflow-hidden shadow rounded-lg">
        <div className="min-w-full align-middle overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client & Matter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice) => {
                const client = getClientById(invoice.clientId);
                const matter = getMatterById(invoice.matterId);
                
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{invoice.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{client?.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{matter?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {format(parseISO(invoice.issueDate), 'dd/MM/yyyy')}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Due: {format(parseISO(invoice.dueDate), 'dd/MM/yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUpdateInvoiceStatus(invoice.id, 'draft')}
                            disabled={invoice.status === 'draft'}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Mark as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateInvoiceStatus(invoice.id, 'sent')}
                            disabled={invoice.status === 'sent'}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Mark as Sent
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateInvoiceStatus(invoice.id, 'paid')}
                            disabled={invoice.status === 'paid'}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateInvoiceStatus(invoice.id, 'overdue')}
                            disabled={invoice.status === 'overdue'}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Mark as Overdue
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No invoices found. Create an invoice from the time entries or matters section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Invoice Details Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        {selectedInvoice && (
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Invoice #{selectedInvoice.invoiceNumber}</span>
                <Badge className={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Invoice details and line items
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">From</h4>
                  <p className="font-medium">Your Law Firm</p>
                  <p className="text-sm">123 Legal Street</p>
                  <p className="text-sm">New Delhi, 110001</p>
                  <p className="text-sm">GSTIN: 07AADCS1234A1Z5</p>
                  <p className="text-sm mt-2">contact@yourlawfirm.com</p>
                  <p className="text-sm">+91 98765 43210</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bill To</h4>
                  <p className="font-medium">{getClientById(selectedInvoice.clientId)?.name}</p>
                  <p className="text-sm">{getClientById(selectedInvoice.clientId)?.address}</p>
                  {getClientById(selectedInvoice.clientId)?.gstNumber && (
                    <p className="text-sm">GSTIN: {getClientById(selectedInvoice.clientId)?.gstNumber}</p>
                  )}
                  <p className="text-sm mt-2">{getClientById(selectedInvoice.clientId)?.email}</p>
                  <p className="text-sm">{getClientById(selectedInvoice.clientId)?.phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Invoice Details</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Invoice Number:</span>
                      <span className="text-sm">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Issue Date:</span>
                      <span className="text-sm">{format(parseISO(selectedInvoice.issueDate), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Due Date:</span>
                      <span className="text-sm">{format(parseISO(selectedInvoice.dueDate), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Matter</h4>
                  <p className="text-sm font-medium">{getMatterById(selectedInvoice.matterId)?.title}</p>
                  <p className="text-sm">{getMatterById(selectedInvoice.matterId)?.caseNumber}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Line Items</h4>
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-zinc-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Description
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Quantity (hours)
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Rate (₹)
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Amount (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                            {item.quantity.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                            {formatCurrency(item.rate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                          Subtotal
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                          {formatCurrency(selectedInvoice.subtotal)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                          GST ({selectedInvoice.gstRate}%)
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                          {formatCurrency(selectedInvoice.gstAmount)}
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                        <td colSpan={3} className="px-4 py-3 text-base font-bold text-gray-900 dark:text-gray-100 text-right">
                          Total
                        </td>
                        <td className="px-4 py-3 text-base font-bold text-gray-900 dark:text-gray-100 text-right">
                          {formatCurrency(selectedInvoice.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h4>
                <p className="text-sm bg-gray-50 dark:bg-zinc-800 p-3 rounded">
                  {selectedInvoice.notes}
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </DialogClose>
              <Button disabled>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <span>Update Status</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'draft')}
                    disabled={selectedInvoice.status === 'draft'}
                  >
                    Mark as Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'sent')}
                    disabled={selectedInvoice.status === 'sent'}
                  >
                    Mark as Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'paid')}
                    disabled={selectedInvoice.status === 'paid'}
                  >
                    Mark as Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateInvoiceStatus(selectedInvoice.id, 'overdue')}
                    disabled={selectedInvoice.status === 'overdue'}
                  >
                    Mark as Overdue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
  
  return (
    <div>
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-100 dark:bg-zinc-800">
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="matters" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Matters
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Time Entries
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center">
              <IndianRupee className="h-4 w-4 mr-2" />
              Invoices
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mt-4">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'clients' && renderClients()}
        {activeTab === 'matters' && renderMatters()}
        {activeTab === 'time' && renderTimeEntries()}
        {activeTab === 'invoices' && renderInvoices()}
      </div>
    </div>
  );
};

export default BillingTrackingTool;
