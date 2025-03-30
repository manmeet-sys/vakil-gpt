
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Clock, Trash, Edit, Plus, DollarSign, FileText, Download, 
  Calendar, CheckCircle, ArrowUpDown, Save 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

interface TimeEntry {
  id: string;
  date: string;
  client: string;
  matter: string;
  description: string;
  duration: number;
  billable: boolean;
  rate: number;
  invoiced: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  rate: number;
}

interface Invoice {
  id: string;
  clientId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  timeEntries: string[];
}

const BillingTrackingTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('time-tracking');
  
  // Time Tracking State
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('timeEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEntry, setNewEntry] = useState<Omit<TimeEntry, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    client: '',
    matter: '',
    description: '',
    duration: 0,
    billable: true,
    rate: 0,
    invoiced: false
  });
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Clients State
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('billingClients');
    return saved ? JSON.parse(saved) : [];
  });
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    email: '',
    company: '',
    rate: 0
  });
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  // Invoices State
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TimeEntry;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    localStorage.setItem('billingClients', JSON.stringify(clients));
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [timeEntries, clients, invoices]);

  // Timer functionality
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRecording && startTime) {
      interval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, startTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeDecimal = (seconds: number): number => {
    return parseFloat((seconds / 3600).toFixed(2));
  };

  const startTimer = () => {
    setStartTime(Date.now());
    setIsRecording(true);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    if (isRecording && startTime) {
      setIsRecording(false);
      setNewEntry({
        ...newEntry,
        duration: formatTimeDecimal(elapsedTime)
      });
    }
  };

  const handleAddTimeEntry = () => {
    if (!newEntry.client || !newEntry.description || newEntry.duration <= 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields",
      });
      return;
    }

    const selectedClient = clients.find(c => c.id === newEntry.client);
    const entry: TimeEntry = {
      id: Date.now().toString(),
      ...newEntry,
      rate: selectedClient ? selectedClient.rate : newEntry.rate
    };

    setTimeEntries([...timeEntries, entry]);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      client: newEntry.client,
      matter: '',
      description: '',
      duration: 0,
      billable: true,
      rate: selectedClient ? selectedClient.rate : 0,
      invoiced: false
    });
    setElapsedTime(0);

    toast({
      title: "Time Entry Added",
      description: `Added ${formatTimeDecimal(entry.duration)} hours for ${entry.description}`,
    });
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Time entry has been removed",
    });
  };

  const editTimeEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const saveEditedEntry = () => {
    if (!editingEntry) return;
    
    setTimeEntries(
      timeEntries.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      )
    );
    
    setIsEditDialogOpen(false);
    setEditingEntry(null);
    
    toast({
      title: "Entry Updated",
      description: "Time entry has been updated successfully",
    });
  };

  const handleAddClient = () => {
    if (!newClient.name) {
      toast({
        variant: "destructive",
        title: "Client Name Required",
        description: "Please enter a client name",
      });
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      ...newClient
    };

    setClients([...clients, client]);
    setNewClient({
      name: '',
      email: '',
      company: '',
      rate: 0
    });
    setIsClientDialogOpen(false);

    toast({
      title: "Client Added",
      description: `${client.name} has been added to your clients`,
    });
  };

  const deleteClient = (id: string) => {
    // Check if client has time entries
    const hasEntries = timeEntries.some(entry => entry.client === id);
    if (hasEntries) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Client",
        description: "This client has time entries associated with it",
      });
      return;
    }

    setClients(clients.filter(client => client.id !== id));
    toast({
      title: "Client Deleted",
      description: "Client has been removed",
    });
  };

  const editClient = (client: Client) => {
    setEditingClient(client);
    setIsClientDialogOpen(true);
  };

  const saveEditedClient = () => {
    if (!editingClient) return;
    
    setClients(
      clients.map(client => 
        client.id === editingClient.id ? editingClient : client
      )
    );
    
    setIsClientDialogOpen(false);
    setEditingClient(null);
    
    toast({
      title: "Client Updated",
      description: "Client information has been updated successfully",
    });
  };

  const requestSort = (key: keyof TimeEntry) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedEntries = React.useMemo(() => {
    const entriesCopy = [...timeEntries];
    if (sortConfig !== null) {
      entriesCopy.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return entriesCopy;
  }, [timeEntries, sortConfig]);

  const toggleSelectEntry = (id: string) => {
    setSelectedEntries(prev => 
      prev.includes(id) 
        ? prev.filter(entryId => entryId !== id)
        : [...prev, id]
    );
  };

  const calculateInvoiceAmount = () => {
    return timeEntries
      .filter(entry => selectedEntries.includes(entry.id))
      .reduce((sum, entry) => sum + (entry.duration * entry.rate), 0);
  };

  const createInvoice = () => {
    if (selectedEntries.length === 0) {
      toast({
        variant: "destructive",
        title: "No Entries Selected",
        description: "Please select time entries to include in the invoice",
      });
      return;
    }

    if (!newInvoice.clientId) {
      toast({
        variant: "destructive",
        title: "Client Required",
        description: "Please select a client for this invoice",
      });
      return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      clientId: newInvoice.clientId,
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate,
      amount: calculateInvoiceAmount(),
      status: 'draft',
      timeEntries: [...selectedEntries]
    };

    setInvoices([...invoices, invoice]);
    
    // Mark time entries as invoiced
    setTimeEntries(
      timeEntries.map(entry => 
        selectedEntries.includes(entry.id) 
          ? { ...entry, invoiced: true } 
          : entry
      )
    );
    
    setSelectedEntries([]);
    setIsInvoiceDialogOpen(false);
    
    toast({
      title: "Invoice Created",
      description: `Invoice for ${clients.find(c => c.id === newInvoice.clientId)?.name} has been created`,
    });
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(
      invoices.map(invoice => 
        invoice.id === id 
          ? { ...invoice, status } 
          : invoice
      )
    );
    
    toast({
      title: "Invoice Updated",
      description: `Invoice status has been updated to ${status}`,
    });
  };

  const downloadInvoice = (invoice: Invoice) => {
    const client = clients.find(c => c.id === invoice.clientId);
    const entriesText = timeEntries
      .filter(entry => invoice.timeEntries.includes(entry.id))
      .map(entry => `${entry.date} - ${entry.description}: ${entry.duration} hours @ $${entry.rate}/hr = $${(entry.duration * entry.rate).toFixed(2)}`)
      .join('\n');
      
    const invoiceText = `
INVOICE
==============================
Invoice #: ${invoice.id}
Date: ${invoice.date}
Due Date: ${invoice.dueDate}
Status: ${invoice.status.toUpperCase()}

CLIENT
------------------------------
${client?.name}
${client?.company}
${client?.email}

ITEMS
------------------------------
${entriesText}

TOTAL: $${invoice.amount.toFixed(2)}
    `;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Invoice Downloaded",
      description: "Invoice has been downloaded as a text file",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="time-tracking">
            <Clock className="mr-2 h-4 w-4" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="clients">
            <FileText className="mr-2 h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="invoices">
            <DollarSign className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="time-tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Record Time</span>
                {isRecording ? (
                  <span className="text-red-500 animate-pulse flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Recording: {formatTime(elapsedTime)}
                  </span>
                ) : null}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select 
                    value={newEntry.client} 
                    onValueChange={(value) => {
                      const client = clients.find(c => c.id === value);
                      setNewEntry({
                        ...newEntry, 
                        client: value,
                        rate: client ? client.rate : 0
                      });
                    }}
                  >
                    <SelectTrigger id="client" className="mt-1">
                      <SelectValue placeholder="Select client" />
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="matter">Matter/Project</Label>
                  <Input
                    id="matter"
                    value={newEntry.matter}
                    onChange={(e) => setNewEntry({...newEntry, matter: e.target.value})}
                    className="mt-1"
                    placeholder="e.g., Contract Review"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (Hours)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="duration"
                      type="number"
                      step="0.25"
                      min="0"
                      value={newEntry.duration}
                      onChange={(e) => setNewEntry({...newEntry, duration: parseFloat(e.target.value) || 0})}
                      disabled={isRecording}
                    />
                    {isRecording ? (
                      <Button
                        onClick={stopTimer}
                        variant="destructive"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Stop
                      </Button>
                    ) : (
                      <Button
                        onClick={startTimer}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Start Timer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  className="mt-1"
                  placeholder="Describe the work completed"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="rate">Hourly Rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    min="0"
                    value={newEntry.rate}
                    onChange={(e) => setNewEntry({...newEntry, rate: parseFloat(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    id="billable"
                    type="checkbox"
                    checked={newEntry.billable}
                    onChange={(e) => setNewEntry({...newEntry, billable: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <Label htmlFor="billable" className="ml-2">Billable</Label>
                </div>
              </div>
              
              <Button 
                onClick={handleAddTimeEntry} 
                disabled={!newEntry.client || !newEntry.description || newEntry.duration <= 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Time Entry
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {timeEntries.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No time entries yet. Start tracking your time above.
                </div>
              ) : (
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button variant="ghost" size="sm" onClick={() => requestSort('date')}>
                            Date
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>
                          <Button variant="ghost" size="sm" onClick={() => requestSort('duration')}>
                            Hours
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedEntries.map((entry) => {
                        const client = clients.find(c => c.id === entry.client);
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{client?.name || 'Unknown'}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell>{entry.duration.toFixed(2)}</TableCell>
                            <TableCell>${entry.rate}/hr</TableCell>
                            <TableCell>${(entry.duration * entry.rate).toFixed(2)}</TableCell>
                            <TableCell>
                              {entry.invoiced ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                  Invoiced
                                </span>
                              ) : (
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                                  Unbilled
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => toggleSelectEntry(entry.id)}
                                  className={selectedEntries.includes(entry.id) ? "bg-blue-100" : ""}
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={selectedEntries.includes(entry.id)} 
                                    onChange={() => {}} 
                                    className="rounded h-4 w-4"
                                  />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => editTimeEntry(entry)}
                                  disabled={entry.invoiced}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteTimeEntry(entry.id)}
                                  disabled={entry.invoiced}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {selectedEntries.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">
                      {selectedEntries.length} entries selected ({timeEntries
                        .filter(entry => selectedEntries.includes(entry.id))
                        .reduce((sum, entry) => sum + entry.duration, 0).toFixed(2)} hours)
                    </span>
                  </div>
                  <Button
                    onClick={() => setIsInvoiceDialogOpen(true)}
                    variant="default"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Create Invoice
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Clients</span>
                <Button onClick={() => {
                  setEditingClient(null);
                  setIsClientDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No clients yet. Add your first client to get started.
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Default Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.company}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>${client.rate}/hr</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => editClient(client)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => deleteClient(client.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
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
        
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No invoices yet. Create an invoice from your time entries.
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => {
                        const client = clients.find(c => c.id === invoice.clientId);
                        return (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id.substring(0, 8)}</TableCell>
                            <TableCell>{client?.name || 'Unknown'}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.dueDate}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Select 
                                value={invoice.status} 
                                onValueChange={(value: 'draft' | 'sent' | 'paid' | 'overdue') => updateInvoiceStatus(invoice.id, value)}
                              >
                                <SelectTrigger className="h-8 w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="sent">Sent</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="overdue">Overdue</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => downloadInvoice(invoice)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Time Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
          </DialogHeader>
          
          {editingEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingEntry.date}
                    onChange={(e) => setEditingEntry({...editingEntry, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-client">Client</Label>
                  <Select 
                    value={editingEntry.client} 
                    onValueChange={(value) => {
                      const client = clients.find(c => c.id === value);
                      setEditingEntry({
                        ...editingEntry, 
                        client: value,
                        rate: client ? client.rate : editingEntry.rate
                      });
                    }}
                  >
                    <SelectTrigger id="edit-client">
                      <SelectValue placeholder="Select client" />
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
              </div>
              
              <div>
                <Label htmlFor="edit-matter">Matter/Project</Label>
                <Input
                  id="edit-matter"
                  value={editingEntry.matter}
                  onChange={(e) => setEditingEntry({...editingEntry, matter: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingEntry.description}
                  onChange={(e) => setEditingEntry({...editingEntry, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-duration">Duration (Hours)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    step="0.25"
                    min="0"
                    value={editingEntry.duration}
                    onChange={(e) => setEditingEntry({...editingEntry, duration: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rate">Hourly Rate ($)</Label>
                  <Input
                    id="edit-rate"
                    type="number"
                    min="0"
                    value={editingEntry.rate}
                    onChange={(e) => setEditingEntry({...editingEntry, rate: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="edit-billable"
                  type="checkbox"
                  checked={editingEntry.billable}
                  onChange={(e) => setEditingEntry({...editingEntry, billable: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <Label htmlFor="edit-billable">Billable</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedEntry}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add/Edit Client Dialog */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={editingClient ? editingClient.name : newClient.name}
                onChange={(e) => editingClient 
                  ? setEditingClient({...editingClient, name: e.target.value})
                  : setNewClient({...newClient, name: e.target.value})
                }
                placeholder="John Smith"
              />
            </div>
            
            <div>
              <Label htmlFor="client-company">Company</Label>
              <Input
                id="client-company"
                value={editingClient ? editingClient.company : newClient.company}
                onChange={(e) => editingClient 
                  ? setEditingClient({...editingClient, company: e.target.value})
                  : setNewClient({...newClient, company: e.target.value})
                }
                placeholder="ABC Corp"
              />
            </div>
            
            <div>
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                value={editingClient ? editingClient.email : newClient.email}
                onChange={(e) => editingClient 
                  ? setEditingClient({...editingClient, email: e.target.value})
                  : setNewClient({...newClient, email: e.target.value})
                }
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="client-rate">Default Hourly Rate ($)</Label>
              <Input
                id="client-rate"
                type="number"
                min="0"
                value={editingClient ? editingClient.rate : newClient.rate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value) || 0;
                  editingClient 
                    ? setEditingClient({...editingClient, rate})
                    : setNewClient({...newClient, rate});
                }}
                placeholder="150"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>Cancel</Button>
            <Button onClick={editingClient ? saveEditedClient : handleAddClient}>
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="invoice-client">Client</Label>
              <Select 
                value={newInvoice.clientId} 
                onValueChange={(value) => setNewInvoice({...newInvoice, clientId: value})}
              >
                <SelectTrigger id="invoice-client">
                  <SelectValue placeholder="Select client" />
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
            
            <div>
              <Label htmlFor="invoice-due-date">Due Date</Label>
              <Input
                id="invoice-due-date"
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
              />
            </div>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Selected Time Entries</h3>
              
              {selectedEntries.length === 0 ? (
                <p className="text-sm text-gray-500">No entries selected</p>
              ) : (
                <div className="space-y-2">
                  {timeEntries
                    .filter(entry => selectedEntries.includes(entry.id))
                    .map(entry => {
                      const client = clients.find(c => c.id === entry.client);
                      return (
                        <div key={entry.id} className="text-sm flex justify-between">
                          <span>
                            {entry.date} - {entry.description} ({entry.duration} hrs)
                          </span>
                          <span className="font-medium">
                            ${(entry.duration * entry.rate).toFixed(2)}
                          </span>
                        </div>
                      );
                    })
                  }
                  <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                    <span>Total</span>
                    <span>${calculateInvoiceAmount().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInvoiceDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={createInvoice}
              disabled={selectedEntries.length === 0 || !newInvoice.clientId}
            >
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingTrackingTool;
