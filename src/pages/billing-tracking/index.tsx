
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee, Plus, Pencil, Trash2, Filter, BarChart, Search, Calendar } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/context/AuthContext';
import { useBilling } from '@/context/BillingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import TimeTrackingStats from '@/components/TimeTrackingStats';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import PDFExportButton from '@/components/PDFExportButton';

const timeEntrySchema = z.object({
  client_name: z.string().min(1, { message: 'Client name is required' }),
  activity_type: z.string().min(1, { message: 'Activity type is required' }),
  hours_spent: z.coerce.number().min(0.1, { message: 'Hours must be greater than 0' }),
  date: z.string().min(1, { message: 'Date is required' }),
  description: z.string().optional(),
  hourly_rate: z.coerce.number().min(1, { message: 'Hourly rate must be greater than 0' }),
});

const BillingTrackingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { billingEntries, loading, addBillingEntry, updateBillingEntry, deleteBillingEntry } = useBilling();
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [viewMode, setViewMode] = useState('list');
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');

  const form = useForm<z.infer<typeof timeEntrySchema>>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      client_name: '',
      activity_type: '',
      hours_spent: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      hourly_rate: 3000,
    },
  });

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    form.reset({
      client_name: entry.client_name || '',
      activity_type: entry.activity_type || '',
      hours_spent: entry.hours_spent || 0,
      date: entry.date ? format(new Date(entry.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      description: entry.description || '',
      hourly_rate: entry.hourly_rate || 3000,
    });
    setIsNewEntryDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof timeEntrySchema>) => {
    try {
      if (editingEntry) {
        await updateBillingEntry(editingEntry.id, {
          client_name: values.client_name,
          activity_type: values.activity_type,
          hours_spent: values.hours_spent,
          date: values.date,
          description: values.description,
          hourly_rate: values.hourly_rate
        });
        toast.success('Time entry updated successfully');
      } else {
        await addBillingEntry({
          client_name: values.client_name,
          activity_type: values.activity_type,
          hours_spent: values.hours_spent,
          date: values.date,
          description: values.description,
          hourly_rate: values.hourly_rate,
          case_id: null,
          invoice_number: null,
          invoice_status: 'unbilled'
        });
        toast.success('Time entry added successfully');
      }
      
      form.reset({
        client_name: '',
        activity_type: '',
        hours_spent: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        hourly_rate: 3000,
      });
      setEditingEntry(null);
      setIsNewEntryDialogOpen(false);
    } catch (error) {
      console.error('Error submitting time entry:', error);
      toast.error('Failed to save time entry');
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteBillingEntry(id);
      toast.success('Time entry deleted successfully');
    } catch (error) {
      console.error('Error deleting time entry:', error);
      toast.error('Failed to delete time entry');
    }
  };

  const activityTypes = [
    'Research',
    'Drafting',
    'Client Meeting',
    'Court Appearance',
    'Mediation',
    'Phone Call',
    'Email Communication',
    'Document Review',
    'Case Planning',
    'Client Consultation',
    'Negotiation',
    'Legal Analysis',
    'Deposition',
    'Travel',
    'Other'
  ];

  const filteredEntries = billingEntries.filter(entry => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (entry.client_name && entry.client_name.toLowerCase().includes(searchLower)) || 
      (entry.activity_type && entry.activity_type.toLowerCase().includes(searchLower)) ||
      (entry.description && entry.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <LegalToolLayout
      title="Indian Legal Billing & Time Tracking"
      description="Comprehensive solution for Indian advocates and law firms to track billable hours, manage clients, and generate GST-compliant invoices."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="container mx-auto mt-6 px-4">
        {!isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                You need to sign in to use the Legal Billing & Time Tracking tool.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Enhanced Header */}
            <div className="flex justify-end mb-4">
              <div className="border rounded-md flex">
                <Button 
                  variant={timePeriod === 'week' ? 'secondary' : 'ghost'} 
                  className="rounded-r-none"
                  onClick={() => setTimePeriod('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={timePeriod === 'month' ? 'secondary' : 'ghost'} 
                  className="rounded-none border-x"
                  onClick={() => setTimePeriod('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={timePeriod === 'year' ? 'secondary' : 'ghost'} 
                  className="rounded-l-none"
                  onClick={() => setTimePeriod('year')}
                >
                  Year
                </Button>
              </div>
            </div>
            
            {/* Time Tracking Stats */}
            <TimeTrackingStats entries={filteredEntries} period={timePeriod} />
            
            {/* Enhanced Controls with PDF Export */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search client or activity..." 
                    className="pl-9 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" title="Filter entries">
                  <Filter className="h-4 w-4" />
                </Button>
                <div className="flex border rounded-md">
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="rounded-r-none"
                    onClick={() => setViewMode('list')}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    List
                  </Button>
                  <Button 
                    variant={viewMode === 'dashboard' ? 'secondary' : 'ghost'} 
                    size="sm"
                    className="rounded-l-none"
                    onClick={() => setViewMode('dashboard')}
                  >
                    <BarChart className="h-4 w-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <PDFExportButton entries={filteredEntries} />
                
                <Dialog open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Time Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>{editingEntry ? 'Edit Time Entry' : 'Add New Time Entry'}</DialogTitle>
                      <DialogDescription>
                        {editingEntry ? 'Modify your billable time record' : 'Record your billable time for a client or matter.'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="client_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter client name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="activity_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Type*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select activity type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {activityTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="hours_spent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hours Spent*</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.1" placeholder="0.0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="hourly_rate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hourly Rate (₹)*</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="3000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date*</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the work performed" 
                                  className="min-h-[100px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter className="mt-6">
                          <Button 
                            variant="outline" 
                            type="button" 
                            onClick={() => {
                              setIsNewEntryDialogOpen(false);
                              setEditingEntry(null);
                              form.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">{editingEntry ? 'Update Entry' : 'Save Entry'}</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Tabs defaultValue="time-entries" className="space-y-4">
              <TabsList>
                <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="time-entries" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Time Entries</CardTitle>
                    <CardDescription>
                      Track and manage your billable time entries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : filteredEntries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No time entries found. Add your first entry to get started.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Client</th>
                              <th className="text-left p-2">Date</th>
                              <th className="text-left p-2">Activity</th>
                              <th className="text-right p-2">Hours</th>
                              <th className="text-right p-2">Rate (₹)</th>
                              <th className="text-right p-2">Amount (₹)</th>
                              <th className="text-center p-2">Status</th>
                              <th className="text-center p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEntries.map((entry) => (
                              <tr key={entry.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="p-2">{entry.client_name || 'N/A'}</td>
                                <td className="p-2">{entry.date ? format(new Date(entry.date), 'dd/MM/yyyy') : 'N/A'}</td>
                                <td className="p-2">
                                  {entry.activity_type}
                                  {entry.description && (
                                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {entry.description}
                                    </div>
                                  )}
                                </td>
                                <td className="p-2 text-right">{entry.hours_spent}</td>
                                <td className="p-2 text-right">{entry.hourly_rate ? `₹${entry.hourly_rate.toLocaleString('en-IN')}` : 'N/A'}</td>
                                <td className="p-2 text-right font-medium">
                                  {typeof entry.hours_spent === 'number' && typeof entry.hourly_rate === 'number' 
                                    ? `₹${(entry.hours_spent * entry.hourly_rate).toLocaleString('en-IN')}`
                                    : 'N/A'
                                  }
                                </td>
                                <td className="p-2 text-center">
                                  <Badge variant={entry.invoice_status === 'billed' ? 'secondary' : 'outline'}>
                                    {entry.invoice_status === 'billed' ? 'Billed' : 'Unbilled'}
                                  </Badge>
                                </td>
                                <td className="p-2 flex justify-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEdit(entry)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => handleDeleteConfirm(entry.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredEntries.length} entries
                    </div>
                    <PDFExportButton entries={filteredEntries} />
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices" className="space-y-4">
                <InvoiceGenerator />
              </TabsContent>
              
              <TabsContent value="clients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Clients</CardTitle>
                    <CardDescription>Manage your client information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-6 border border-dashed rounded-lg">
                      <div className="text-center space-y-2">
                        <p className="text-muted-foreground">Client management feature coming soon</p>
                        <Button variant="outline" size="sm">Request Early Access</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Reports</CardTitle>
                    <CardDescription>Generate detailed financial reports for your practice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center p-6 border border-dashed rounded-lg">
                      <div className="text-center space-y-2">
                        <p className="text-muted-foreground">Advanced reporting features coming soon</p>
                        <Button variant="outline" size="sm">Request Early Access</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default BillingTrackingPage;
