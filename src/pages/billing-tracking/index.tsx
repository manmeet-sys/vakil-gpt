
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee, Plus, Pencil, Trash2 } from 'lucide-react';
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

const timeEntrySchema = z.object({
  client_name: z.string().min(1, { message: 'Client name is required' }),
  activity_type: z.string().min(1, { message: 'Activity type is required' }),
  hours_spent: z.coerce.number().min(0.1, { message: 'Hours must be greater than 0' }),
  date: z.string().min(1, { message: 'Date is required' }),
  description: z.string().optional(),
  hourly_rate: z.coerce.number().optional(),
});

const BillingTrackingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { billingEntries, loading, addBillingEntry, updateBillingEntry, deleteBillingEntry } = useBilling();
  const [isNewEntryDialogOpen, setIsNewEntryDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof timeEntrySchema>>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      client_name: '',
      activity_type: '',
      hours_spent: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      hourly_rate: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof timeEntrySchema>) => {
    try {
      const amount = values.hourly_rate ? values.hourly_rate * values.hours_spent : undefined;
      await addBillingEntry({
        ...values,
        amount,
        matter_id: null,
        invoice_id: null,
      });
      form.reset();
      setIsNewEntryDialogOpen(false);
    } catch (error) {
      console.error('Error submitting time entry:', error);
      toast.error('Failed to add time entry');
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
    'Other'
  ];

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
          <Tabs defaultValue="time-entries" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="time-entries">Time Entries</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="matters">Matters</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>
              
              <Dialog open={isNewEntryDialogOpen} onOpenChange={setIsNewEntryDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Time Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Time Entry</DialogTitle>
                    <DialogDescription>
                      Record your billable time for a client or matter.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="client_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
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
                            <FormLabel>Activity Type</FormLabel>
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
                              <FormLabel>Hours Spent</FormLabel>
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
                              <FormLabel>Hourly Rate (₹)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
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
                            <FormLabel>Date</FormLabel>
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
                      
                      <DialogFooter>
                        <Button variant="outline" type="button" onClick={() => setIsNewEntryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Entry</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
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
                  ) : billingEntries.length === 0 ? (
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
                            <th className="text-center p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billingEntries.map((entry) => (
                            <tr key={entry.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="p-2">{entry.client_name}</td>
                              <td className="p-2">{entry.date ? format(new Date(entry.date), 'dd/MM/yyyy') : 'N/A'}</td>
                              <td className="p-2">{entry.activity_type}</td>
                              <td className="p-2 text-right">{entry.hours_spent}</td>
                              <td className="p-2 text-right">{entry.hourly_rate || 'N/A'}</td>
                              <td className="p-2 text-right">{entry.amount ? `₹${entry.amount.toFixed(2)}` : 'N/A'}</td>
                              <td className="p-2 flex justify-center space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => deleteBillingEntry(entry.id)}
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
              </Card>
            </TabsContent>
            
            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>Clients</CardTitle>
                  <CardDescription>Manage your client information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Client management feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="matters">
              <Card>
                <CardHeader>
                  <CardTitle>Matters</CardTitle>
                  <CardDescription>Manage legal matters and cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Matter management feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Create and manage invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Invoice management feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default BillingTrackingPage;
