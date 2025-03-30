
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar, Calculator, Plus, Trash, FileCheck, X, AlertCircle, Loader2, Search, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface FinancialObligation {
  id: string;
  name: string;
  type: string;
  amount: string;
  dueDate: string;
  frequency: string;
  counterparty: string;
  notes: string;
  status: 'active' | 'pending' | 'completed' | 'defaulted';
  reminderEnabled: boolean;
  reminderDays: number;
}

const FinancialObligationsTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [obligations, setObligations] = useState<FinancialObligation[]>([]);
  const [selectedObligation, setSelectedObligation] = useState<FinancialObligation | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [newObligation, setNewObligation] = useState<Omit<FinancialObligation, 'id'>>({
    name: '',
    type: '',
    amount: '',
    dueDate: '',
    frequency: 'one-time',
    counterparty: '',
    notes: '',
    status: 'active',
    reminderEnabled: true,
    reminderDays: 7
  });
  
  const { toast } = useToast();
  
  // Load saved obligations on initial render
  useEffect(() => {
    const savedObligations = localStorage.getItem('financialObligations');
    if (savedObligations) {
      try {
        setObligations(JSON.parse(savedObligations));
      } catch (error) {
        console.error("Error parsing saved obligations:", error);
      }
    }
  }, []);
  
  // Save obligations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('financialObligations', JSON.stringify(obligations));
  }, [obligations]);
  
  const handleAddObligation = () => {
    if (!newObligation.name || !newObligation.amount || !newObligation.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please provide at least name, amount, and due date",
        variant: "destructive",
      });
      return;
    }
    
    const obligation: FinancialObligation = {
      ...newObligation,
      id: `obligation-${Date.now()}`
    };
    
    setObligations(prev => [...prev, obligation]);
    
    // Reset the form
    setNewObligation({
      name: '',
      type: '',
      amount: '',
      dueDate: '',
      frequency: 'one-time',
      counterparty: '',
      notes: '',
      status: 'active',
      reminderEnabled: true,
      reminderDays: 7
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Obligation Added",
      description: "Financial obligation has been added successfully",
    });
  };
  
  const handleUpdateObligation = (updatedObligation: FinancialObligation) => {
    setObligations(prev => prev.map(item => item.id === updatedObligation.id ? updatedObligation : item));
    
    setSelectedObligation(null);
    
    toast({
      title: "Obligation Updated",
      description: "Financial obligation has been updated successfully",
    });
  };
  
  const handleDeleteObligation = (id: string) => {
    setObligations(prev => prev.filter(item => item.id !== id));
    
    setSelectedObligation(null);
    
    toast({
      title: "Obligation Deleted",
      description: "Financial obligation has been removed",
    });
  };
  
  const handleNewObligationChange = (field: string, value: any) => {
    setNewObligation(prev => ({ ...prev, [field]: value }));
  };
  
  const handleUpdateSelectedObligation = (field: string, value: any) => {
    if (selectedObligation) {
      setSelectedObligation({ ...selectedObligation, [field]: value });
    }
  };
  
  const filteredObligations = obligations.filter(obligation => {
    const matchesSearch = searchTerm === '' || 
      obligation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obligation.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || obligation.type === filterType;
    const matchesStatus = filterStatus === 'all' || obligation.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const sortedObligations = [...filteredObligations].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'amount') {
      return parseFloat(a.amount.replace(/[^0-9.-]+/g, '')) - parseFloat(b.amount.replace(/[^0-9.-]+/g, ''));
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });
  
  const upcomingObligations = sortedObligations.filter(obligation => {
    const dueDate = new Date(obligation.dueDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return dueDate >= today && dueDate <= thirtyDaysFromNow && obligation.status === 'active';
  });
  
  // Calculate total financial impact
  const calculateTotalAmount = (items: FinancialObligation[]) => {
    return items.reduce((total, obligation) => {
      const amount = parseFloat(obligation.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return total + amount;
    }, 0);
  };
  
  const totalActiveAmount = calculateTotalAmount(obligations.filter(o => o.status === 'active'));
  
  // Group obligations by type for chart
  const obligationsByType = obligations.reduce<Record<string, number>>((acc, obligation) => {
    if (obligation.type && obligation.status === 'active') {
      const amount = parseFloat(obligation.amount.replace(/[^0-9.-]+/g, '')) || 0;
      acc[obligation.type] = (acc[obligation.type] || 0) + amount;
    }
    return acc;
  }, {});
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500 hover:bg-blue-600';
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      case 'defaulted': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'defaulted': return 'destructive';
      default: return 'default';
    }
  };
  
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericValue);
  };
  
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const differenceInTime = due.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">
            <Calculator className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="obligations">
            <FileCheck className="mr-2 h-4 w-4" />
            Obligations
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Obligations</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalActiveAmount.toString())}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {obligations.filter(o => o.status === 'active').length} active financial obligations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due in Next 30 Days</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(calculateTotalAmount(upcomingObligations).toString())}
                </div>
                <p className="text-xs text-muted-foreground">
                  {upcomingObligations.length} payments due soon
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Obligation Types</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(obligationsByType).map(([type, amount]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span>{type}:</span>
                      <span className="font-medium">{formatCurrency(amount.toString())}</span>
                    </div>
                  ))}
                  {Object.keys(obligationsByType).length === 0 && (
                    <div className="text-sm text-muted-foreground">No active obligations</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent & Upcoming Obligations</CardTitle>
                <CardDescription>
                  Showing financial obligations due in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingObligations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingObligations.map(obligation => {
                      const daysUntil = getDaysUntilDue(obligation.dueDate);
                      const isUrgent = daysUntil <= 7;
                      
                      return (
                        <div 
                          key={obligation.id} 
                          className={`border rounded-lg p-4 ${isUrgent ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{obligation.name}</h3>
                              <p className="text-sm text-muted-foreground">{obligation.counterparty}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatCurrency(obligation.amount)}</div>
                              <Badge variant={getStatusBadgeVariant(obligation.status)}>
                                {obligation.status.charAt(0).toUpperCase() + obligation.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-sm flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span className={`${isUrgent ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                                Due {new Date(obligation.dueDate).toLocaleDateString()} 
                                {isUrgent && ` (${daysUntil} day${daysUntil === 1 ? '' : 's'})`}
                              </span>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedObligation(obligation)}
                              className="text-xs"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Upcoming Obligations</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any financial obligations due in the next 30 days.
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      Add New Obligation
                    </Button>
                  </div>
                )}
              </CardContent>
              {upcomingObligations.length > 0 && (
                <CardFooter className="border-t px-6 py-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('upcoming')}
                    className="w-full"
                  >
                    View All Upcoming Obligations
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="obligations">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-wrap flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search obligations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="royalty">Royalty</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="tax">Tax</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="defaulted">Defaulted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Add Obligation
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Obligations</CardTitle>
              <CardDescription>
                Manage all financial obligations and payment schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedObligations.length > 0 ? (
                <div className="space-y-4">
                  {sortedObligations.map(obligation => (
                    <div 
                      key={obligation.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{obligation.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {obligation.type && `${obligation.type} | `}
                            {obligation.counterparty}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(obligation.amount)}</div>
                          <Badge variant={getStatusBadgeVariant(obligation.status)}>
                            {obligation.status.charAt(0).toUpperCase() + obligation.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>
                            Due {new Date(obligation.dueDate).toLocaleDateString()} 
                            {obligation.frequency !== 'one-time' && ` (${obligation.frequency})`}
                          </span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedObligation(obligation)}
                          className="text-xs"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Obligations Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 
                      "No obligations match your current filters." : 
                      "You haven't added any financial obligations yet."}
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    Add Your First Obligation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Financial Obligations</CardTitle>
              <CardDescription>
                Obligations due within the next 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingObligations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingObligations.map(obligation => {
                    const daysUntil = getDaysUntilDue(obligation.dueDate);
                    const isUrgent = daysUntil <= 7;
                    
                    return (
                      <div 
                        key={obligation.id} 
                        className={`border rounded-lg p-4 ${isUrgent ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-800'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{obligation.name}</h3>
                              {isUrgent && (
                                <Badge className="ml-2" variant="destructive">
                                  Due Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {obligation.type && `${obligation.type} | `}
                              {obligation.counterparty}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(obligation.amount)}</div>
                            <p className="text-sm text-muted-foreground">
                              {obligation.frequency !== 'one-time' && `${obligation.frequency}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className={`text-sm flex items-center ${isUrgent ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>
                              Due {new Date(obligation.dueDate).toLocaleDateString()} 
                              {` (${daysUntil} day${daysUntil === 1 ? '' : 's'} remaining)`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (selectedObligation) {
                                  const updated = { ...selectedObligation, status: 'completed' as const };
                                  handleUpdateObligation(updated);
                                } else {
                                  const updated = { ...obligation, status: 'completed' as const };
                                  handleUpdateObligation(updated);
                                }
                              }}
                              className="text-xs"
                            >
                              Mark Paid
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedObligation(obligation)}
                              className="text-xs"
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Upcoming Obligations</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any financial obligations due in the next 30 days.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    Add New Obligation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add New Obligation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Financial Obligation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="obligation-name">Obligation Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="obligation-name" 
                  value={newObligation.name}
                  onChange={(e) => handleNewObligationChange('name', e.target.value)}
                  placeholder="e.g. Office Lease Payment"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="obligation-type">Obligation Type</Label>
                <Select 
                  value={newObligation.type} 
                  onValueChange={(value) => handleNewObligationChange('type', value)}
                >
                  <SelectTrigger id="obligation-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loan">Loan</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="royalty">Royalty</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="tax">Tax</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="obligation-amount">Amount <span className="text-red-500">*</span></Label>
                <Input 
                  id="obligation-amount" 
                  value={newObligation.amount}
                  onChange={(e) => handleNewObligationChange('amount', e.target.value)}
                  placeholder="e.g. $5,000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="obligation-due-date">Due Date <span className="text-red-500">*</span></Label>
                <Input 
                  id="obligation-due-date" 
                  type="date"
                  value={newObligation.dueDate}
                  onChange={(e) => handleNewObligationChange('dueDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="obligation-frequency">Payment Frequency</Label>
                <Select 
                  value={newObligation.frequency} 
                  onValueChange={(value) => handleNewObligationChange('frequency', value)}
                >
                  <SelectTrigger id="obligation-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-Time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="obligation-counterparty">Counterparty/Payee</Label>
                <Input 
                  id="obligation-counterparty" 
                  value={newObligation.counterparty}
                  onChange={(e) => handleNewObligationChange('counterparty', e.target.value)}
                  placeholder="e.g. ABC Property Management"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="obligation-notes">Notes</Label>
                <Textarea 
                  id="obligation-notes" 
                  value={newObligation.notes}
                  onChange={(e) => handleNewObligationChange('notes', e.target.value)}
                  placeholder="Additional details about this obligation"
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="reminder-enabled" 
                    checked={newObligation.reminderEnabled}
                    onCheckedChange={(checked) => handleNewObligationChange('reminderEnabled', checked)}
                  />
                  <Label htmlFor="reminder-enabled">Enable payment reminders</Label>
                </div>
              </div>
              
              {newObligation.reminderEnabled && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="reminder-days">Remind me days before due date</Label>
                  <Input 
                    id="reminder-days" 
                    type="number"
                    min="1"
                    max="30"
                    value={newObligation.reminderDays}
                    onChange={(e) => handleNewObligationChange('reminderDays', parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddObligation}
              disabled={!newObligation.name || !newObligation.amount || !newObligation.dueDate}
            >
              Add Obligation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View/Edit Obligation Dialog */}
      {selectedObligation && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedObligation(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Manage Financial Obligation</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Obligation Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedObligation.name}
                    onChange={(e) => handleUpdateSelectedObligation('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Obligation Type</Label>
                  <Select 
                    value={selectedObligation.type} 
                    onValueChange={(value) => handleUpdateSelectedObligation('type', value)}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                      <SelectItem value="royalty">Royalty</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input 
                    id="edit-amount" 
                    value={selectedObligation.amount}
                    onChange={(e) => handleUpdateSelectedObligation('amount', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-due-date">Due Date</Label>
                  <Input 
                    id="edit-due-date" 
                    type="date"
                    value={selectedObligation.dueDate}
                    onChange={(e) => handleUpdateSelectedObligation('dueDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Payment Frequency</Label>
                  <Select 
                    value={selectedObligation.frequency} 
                    onValueChange={(value) => handleUpdateSelectedObligation('frequency', value)}
                  >
                    <SelectTrigger id="edit-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-Time</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedObligation.status} 
                    onValueChange={(value) => handleUpdateSelectedObligation('status', value as any)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="defaulted">Defaulted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-counterparty">Counterparty/Payee</Label>
                  <Input 
                    id="edit-counterparty" 
                    value={selectedObligation.counterparty}
                    onChange={(e) => handleUpdateSelectedObligation('counterparty', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea 
                    id="edit-notes" 
                    value={selectedObligation.notes}
                    onChange={(e) => handleUpdateSelectedObligation('notes', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-reminder-enabled" 
                      checked={selectedObligation.reminderEnabled}
                      onCheckedChange={(checked) => handleUpdateSelectedObligation('reminderEnabled', checked)}
                    />
                    <Label htmlFor="edit-reminder-enabled">Enable payment reminders</Label>
                  </div>
                </div>
                
                {selectedObligation.reminderEnabled && (
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="edit-reminder-days">Remind me days before due date</Label>
                    <Input 
                      id="edit-reminder-days" 
                      type="number"
                      min="1"
                      max="30"
                      value={selectedObligation.reminderDays}
                      onChange={(e) => handleUpdateSelectedObligation('reminderDays', parseInt(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteObligation(selectedObligation.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedObligation(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdateObligation(selectedObligation)}
                  disabled={!selectedObligation.name || !selectedObligation.amount || !selectedObligation.dueDate}
                >
                  Update
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FinancialObligationsTool;
