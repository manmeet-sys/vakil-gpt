
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Save, Check, Plus, Trash2, FileEdit, AlertTriangle, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define the schema for the form
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  associatedCase: z.string(),
  deadlineDate: z.date({
    required_error: "A deadline date is required.",
  }),
  deadlineTime: z.string().optional(),
  deadlineType: z.string({
    required_error: "Please select a deadline type.",
  }),
  priority: z.string({
    required_error: "Please select a priority level.",
  }),
  notifyDaysBefore: z.string(),
  jurisdiction: z.string().optional(),
  description: z.string().optional(),
  courtFilingRequired: z.boolean().default(false),
  enableReminders: z.boolean().default(true),
});

// Define options for the dropdowns
const DEADLINE_TYPES = [
  "Statute of Limitations",
  "Filing Deadline",
  "Response Due",
  "Hearing Date",
  "Court Appearance",
  "Client Meeting",
  "Document Production",
  "Settlement Conference",
  "Trial Date",
  "Appeal Deadline",
  "Mediation",
  "Deposition",
  "Other"
];

const PRIORITIES = [
  "Urgent",
  "High",
  "Medium",
  "Low"
];

const NOTIFICATION_OPTIONS = [
  "1 day before",
  "2 days before",
  "3 days before",
  "1 week before",
  "2 weeks before",
  "1 month before"
];

const JURISDICTIONS = [
  "Supreme Court of India",
  "Delhi High Court",
  "Bombay High Court",
  "Calcutta High Court",
  "Madras High Court",
  "Karnataka High Court",
  "Allahabad High Court",
  "Gujarat High Court",
  "District Court",
  "Other"
];

// Mock case data - replace with actual data
const CASES = [
  { id: '1', title: 'Singh vs State of Punjab' },
  { id: '2', title: 'Mehta & Co. Tax Appeal' },
  { id: '3', title: 'Sharma Property Dispute' },
  { id: '4', title: 'Patel Trademark Infringement' },
  { id: '5', title: 'Kumar Corporate Restructuring' },
  { id: 'none', title: 'None' }
];

// Helper function to get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-500';
    case 'High':
      return 'bg-orange-500';
    case 'Medium':
      return 'bg-blue-500';
    case 'Low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper function to calculate if a deadline is approaching
const isDeadlineApproaching = (date) => {
  const today = new Date();
  const deadlineDate = new Date(date);
  const diffTime = Math.abs(deadlineDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

const DeadlineManagementPage = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      associatedCase: "none",
      deadlineType: "",
      priority: "Medium",
      notifyDaysBefore: "3 days before",
      courtFilingRequired: false,
      enableReminders: true,
    },
  });

  // Fetch deadlines from the database
  useEffect(() => {
    const fetchDeadlines = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from your database
        const { data, error } = await supabase
          .from('deadlines')
          .select('*')
          .order('deadlineDate', { ascending: true });
        
        if (error) throw error;
        
        setDeadlines(data || []);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
        toast({
          title: "Error",
          description: "Failed to load deadlines. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeadlines();
  }, []);

  // Filter deadlines by tab
  const filteredDeadlines = deadlines.filter(deadline => {
    const deadlineDate = new Date(deadline.deadlineDate);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return deadlineDate >= today;
    } else if (activeTab === 'past') {
      return deadlineDate < today;
    } else if (activeTab === 'urgent') {
      return deadline.priority === 'Urgent' && deadlineDate >= today;
    }
    
    return true;
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the deadline data
      const deadlineData = {
        title: values.title,
        associatedCase: values.associatedCase,
        deadlineDate: values.deadlineDate.toISOString(),
        deadlineTime: values.deadlineTime || null,
        deadlineType: values.deadlineType,
        priority: values.priority,
        notifyDaysBefore: values.notifyDaysBefore,
        jurisdiction: values.jurisdiction || null,
        description: values.description || null,
        courtFilingRequired: values.courtFilingRequired,
        enableReminders: values.enableReminders,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      // Insert the deadline into the database
      const { data, error } = await supabase
        .from('deadlines')
        .insert(deadlineData)
        .select();
      
      if (error) throw error;
      
      // Update the local state
      setDeadlines(prev => [...prev, ...data]);
      
      // Show success message
      toast({
        title: "Deadline created",
        description: "Your deadline has been successfully created.",
      });
      
      // Reset the form
      form.reset();
      
    } catch (error) {
      console.error('Error saving deadline:', error);
      toast({
        title: "Error",
        description: "Failed to save deadline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LegalToolLayout
      title="Deadline Management"
      description="Create and track legal deadlines and court filing dates"
      icon={<Clock className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Form */}
          <div className="md:col-span-1">
            <Card className="shadow-md border border-legal-border dark:border-legal-slate/20">
              <CardHeader className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 dark:from-purple-900/10 dark:to-indigo-900/10">
                <CardTitle className="text-xl">Add New Deadline</CardTitle>
                <CardDescription>Enter the details for your new deadline or court date</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-y-auto max-h-[70vh] pr-2 pb-20">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="E.g., File appeal in Tax Case" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="associatedCase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Associated Case</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a case" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="pointer-events-auto">
                              {CASES.map(caseItem => (
                                <SelectItem key={caseItem.id} value={caseItem.id} className="cursor-pointer">
                                  {caseItem.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="deadlineDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Select a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="deadlineTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time (optional)</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              24-hour format
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="deadlineType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deadline Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select deadline type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto">
                                {DEADLINE_TYPES.map(type => (
                                  <SelectItem key={type} value={type} className="cursor-pointer">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto">
                                {PRIORITIES.map(priority => (
                                  <SelectItem key={priority} value={priority} className="cursor-pointer">
                                    <div className="flex items-center">
                                      <span className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(priority)}`}></span>
                                      {priority}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="notifyDaysBefore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notify Days Before</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select notification time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto">
                                {NOTIFICATION_OPTIONS.map(option => (
                                  <SelectItem key={option} value={option} className="cursor-pointer">
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jurisdiction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jurisdiction (optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select jurisdiction" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto">
                                {JURISDICTIONS.map(jurisdiction => (
                                  <SelectItem key={jurisdiction} value={jurisdiction} className="cursor-pointer">
                                    {jurisdiction}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional details about this deadline"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="courtFilingRequired"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Court Filing Required</FormLabel>
                              <FormDescription className="text-xs">
                                This deadline requires court filing
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="enableReminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                            <div className="space-y-0.5">
                              <FormLabel>Enable Reminders</FormLabel>
                              <FormDescription className="text-xs">
                                Receive notifications for this deadline
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <CardFooter className="px-0 pt-6 flex justify-end gap-2">
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        variant="gradient"
                        size="lg"
                        className="pointer-events-auto shadow-md"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Save Deadline
                          </div>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Deadlines list */}
          <div className="md:col-span-2">
            <Card className="shadow-md border border-legal-border dark:border-legal-slate/20">
              <CardHeader className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/10 dark:to-purple-900/10">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Your Deadlines</CardTitle>
                    <CardDescription>Track and manage all your legal deadlines</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={activeTab === 'upcoming' ? 'advocate' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Upcoming
                    </Button>
                    <Button 
                      variant={activeTab === 'urgent' ? 'advocate' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('urgent')}
                    >
                      Urgent
                    </Button>
                    <Button 
                      variant={activeTab === 'past' ? 'advocate' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('past')}
                    >
                      Past
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                  </div>
                ) : filteredDeadlines.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No deadlines found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {activeTab === 'upcoming' ? "You don't have any upcoming deadlines." : 
                       activeTab === 'past' ? "You don't have any past deadlines." : 
                       "You don't have any urgent deadlines."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('upcoming')}
                    >
                      View all deadlines
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Priority</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Case</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeadlines.map((deadline) => {
                          const caseInfo = CASES.find(c => c.id === deadline.associatedCase);
                          const approaching = isDeadlineApproaching(deadline.deadlineDate);
                          
                          return (
                            <TableRow key={deadline.id} className={approaching ? "bg-red-50 dark:bg-red-900/10" : ""}>
                              <TableCell>
                                <div className="flex items-center">
                                  <span 
                                    className={`w-3 h-3 rounded-full mr-2 ${getPriorityColor(deadline.priority)}`}
                                  ></span>
                                  <span>{deadline.priority}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  {deadline.title}
                                  {approaching && (
                                    <Badge variant="outline" className="mt-1 border-red-400 text-red-600 text-xs">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Approaching
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {deadline.deadlineDate && format(new Date(deadline.deadlineDate), "dd MMM yyyy")}
                                {deadline.deadlineTime && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {deadline.deadlineTime}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-normal">
                                  {deadline.deadlineType}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {caseInfo ? caseInfo.title : 'None'}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <FileEdit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Complete</span>
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default DeadlineManagementPage;
