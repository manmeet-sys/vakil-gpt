
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO, differenceInDays } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  FileEdit, 
  AlertTriangle, 
  Filter, 
  Bell, 
  CheckCircle2, 
  CalendarDays, 
  BookOpen, 
  Scale, 
  Award,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
import { Toaster } from '@/components/ui/sonner';

// Define the schema for the form - removing associatedCase field
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
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

// Helper function to get priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-500 text-white';
    case 'High':
      return 'bg-orange-500 text-white';
    case 'Medium':
      return 'bg-blue-500 text-white';
    case 'Low':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Helper function to get deadline type icon
const getDeadlineTypeIcon = (type) => {
  switch (type) {
    case 'Statute of Limitations':
      return <Scale className="h-4 w-4" />;
    case 'Filing Deadline':
      return <BookOpen className="h-4 w-4" />;
    case 'Court Appearance':
      return <Award className="h-4 w-4" />;
    case 'Hearing Date':
      return <AlertTriangle className="h-4 w-4" />;
    case 'Client Meeting':
      return <CalendarDays className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Helper function to calculate if a deadline is approaching
const isDeadlineApproaching = (date) => {
  if (!date) return false;
  const today = new Date();
  const deadlineDate = new Date(date);
  const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

// Helper function to format time remaining
const formatTimeRemaining = (dueDate) => {
  if (!dueDate) return "";
  const today = new Date();
  const deadlineDate = new Date(dueDate);
  const days = differenceInDays(deadlineDate, today);
  
  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    return "Today";
  } else if (days === 1) {
    return "Tomorrow";
  } else {
    return `${days} days left`;
  }
};

const DeadlineManagementPage = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [completedCount, setCompletedCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);
  const navigate = useNavigate();

  // Initialize the form with updated defaults (removed associatedCase)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      deadlineType: "",
      priority: "Medium",
      notifyDaysBefore: "3 days before",
      courtFilingRequired: false,
      enableReminders: true,
      deadlineTime: "",
    },
  });

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Fetch deadlines from the database
  useEffect(() => {
    const fetchDeadlines = async () => {
      setIsLoading(true);
      try {
        if (!currentUserId) return;
        
        const { data, error } = await supabase
          .from('deadlines')
          .select('*')
          .eq('user_id', currentUserId)
          .order('due_date', { ascending: true });
        
        if (error) throw error;
        
        // Count completed and urgent deadlines
        const completed = data?.filter(d => d.status === 'completed').length || 0;
        const urgent = data?.filter(d => d.priority === 'Urgent' && d.status !== 'completed').length || 0;
        
        setCompletedCount(completed);
        setUrgentCount(urgent);
        setDeadlines(data || []);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
        toast.error("Failed to load deadlines. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      fetchDeadlines();
    }
  }, [currentUserId]);

  // Filter deadlines by tab and priority
  const filteredDeadlines = deadlines.filter(deadline => {
    if (!deadline.due_date) return false;
    
    const deadlineDate = new Date(deadline.due_date);
    const today = new Date();
    
    // First filter by tab
    let tabFiltered = false;
    if (activeTab === 'upcoming') {
      tabFiltered = deadlineDate >= today && deadline.status !== 'completed';
    } else if (activeTab === 'past') {
      tabFiltered = deadlineDate < today || deadline.status === 'completed';
    } else if (activeTab === 'urgent') {
      tabFiltered = deadline.priority === 'Urgent' && deadline.status !== 'completed';
    } else {
      tabFiltered = true;
    }
    
    // Then filter by priority if not "all"
    if (filterPriority === 'all') {
      return tabFiltered;
    } else {
      return tabFiltered && deadline.priority === filterPriority;
    }
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUserId) {
      toast.error("You must be logged in to create deadlines.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a due date that combines the date and time
      let dueDate = new Date(values.deadlineDate);
      
      if (values.deadlineTime) {
        const [hours, minutes] = values.deadlineTime.split(':');
        dueDate.setHours(parseInt(hours), parseInt(minutes));
      }
      
      // Calculate reminder date from notifyDaysBefore
      let reminderDate = null;
      if (values.enableReminders) {
        reminderDate = new Date(dueDate);
        
        if (values.notifyDaysBefore.includes('day')) {
          const days = parseInt(values.notifyDaysBefore);
          reminderDate.setDate(reminderDate.getDate() - days);
        } else if (values.notifyDaysBefore.includes('week')) {
          const weeks = parseInt(values.notifyDaysBefore);
          reminderDate.setDate(reminderDate.getDate() - (weeks * 7));
        } else if (values.notifyDaysBefore.includes('month')) {
          const months = parseInt(values.notifyDaysBefore);
          reminderDate.setMonth(reminderDate.getMonth() - months);
        }
      }
      
      // Convert form values to match the database schema (removed case_id)
      const deadlineData = {
        title: values.title,
        due_date: dueDate.toISOString(),
        priority: values.priority,
        reminder_date: reminderDate ? reminderDate.toISOString() : null,
        description: values.description || null,
        status: 'pending',
        user_id: currentUserId
      };
      
      // Insert the deadline into the database
      const { data, error } = await supabase
        .from('deadlines')
        .insert(deadlineData)
        .select();
      
      if (error) throw error;
      
      // Update the local state
      setDeadlines(prev => [...prev, ...data]);
      
      // Update counters if needed
      if (values.priority === 'Urgent') {
        setUrgentCount(prev => prev + 1);
      }
      
      // Show success message
      toast.success("Deadline created successfully!", {
        description: "Your new deadline has been added to your calendar.",
        action: {
          label: "View",
          onClick: () => setActiveTab('upcoming')
        }
      });
      
      // Reset the form
      form.reset();
      
    } catch (error) {
      console.error('Error saving deadline:', error);
      toast.error("Failed to save deadline. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle marking a deadline as complete
  const handleMarkComplete = async (deadlineId) => {
    try {
      const { error } = await supabase
        .from('deadlines')
        .update({ status: 'completed' })
        .eq('id', deadlineId);
        
      if (error) throw error;
      
      // Update local state
      setDeadlines(prev => prev.map(d => {
        if (d.id === deadlineId) {
          return { ...d, status: 'completed' };
        }
        return d;
      }));
      
      setCompletedCount(prev => prev + 1);
      
      // If this was an urgent deadline, decrease urgentCount
      const deadline = deadlines.find(d => d.id === deadlineId);
      if (deadline && deadline.priority === 'Urgent') {
        setUrgentCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success("Deadline marked as complete!");
    } catch (error) {
      console.error('Error marking deadline as complete:', error);
      toast.error("Failed to update deadline status.");
    }
  };
  
  // Handle deleting a deadline
  const handleDelete = async (deadlineId) => {
    if (!confirm("Are you sure you want to delete this deadline?")) return;
    
    try {
      const { error } = await supabase
        .from('deadlines')
        .delete()
        .eq('id', deadlineId);
        
      if (error) throw error;
      
      // Find the deadline being deleted
      const deletedDeadline = deadlines.find(d => d.id === deadlineId);
      
      // Update local state
      setDeadlines(prev => prev.filter(d => d.id !== deadlineId));
      
      // Update counters if needed
      if (deletedDeadline) {
        if (deletedDeadline.status === 'completed') {
          setCompletedCount(prev => Math.max(0, prev - 1));
        }
        if (deletedDeadline.priority === 'Urgent' && deletedDeadline.status !== 'completed') {
          setUrgentCount(prev => Math.max(0, prev - 1));
        }
      }
      
      toast.success("Deadline deleted successfully.");
    } catch (error) {
      console.error('Error deleting deadline:', error);
      toast.error("Failed to delete deadline.");
    }
  };
  
  // Get stats for dashboard cards
  const getUpcomingCount = () => {
    return deadlines.filter(d => {
      const deadlineDate = new Date(d.due_date);
      const today = new Date();
      return deadlineDate >= today && d.status !== 'completed';
    }).length;
  };

  return (
    <LegalToolLayout
      title="Deadline Management"
      description="Create and track legal deadlines and court filing dates"
      icon={<Clock className="w-6 h-6 text-white" />}
    >
      <Toaster richColors position="top-right" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-900/30 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Upcoming Deadlines</p>
                <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200">{getUpcomingCount()}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800/40 flex items-center justify-center">
                <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-100 dark:border-orange-900/30 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Urgent Tasks</p>
                <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-200">{urgentCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-800/40 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-900/30 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-300 font-medium">Completed</p>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">{completedCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-900/30 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">All Deadlines</p>
                <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">{deadlines.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Form */}
          <div className="md:col-span-1">
            <Card className="shadow-md border border-purple-100 dark:border-purple-900/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30 border-b border-purple-100 dark:border-purple-800/20">
                <CardTitle className="text-xl text-purple-900 dark:text-purple-100">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    Add New Deadline
                  </div>
                </CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  Enter the details for your new deadline or court date
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 px-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 overflow-y-auto max-h-[70vh] pr-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 dark:text-purple-200">Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="E.g., File appeal in Tax Case" 
                              {...field} 
                              className="cursor-text pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:border-purple-400 focus:ring-purple-400/20"
                            />
                          </FormControl>
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
                            <FormLabel className="text-purple-800 dark:text-purple-200">Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal cursor-pointer pointer-events-auto border-purple-200 dark:border-purple-800/50",
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
                              <PopoverContent className="w-auto p-0 pointer-events-auto z-50" align="start">
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
                            <FormLabel className="text-purple-800 dark:text-purple-200">Time (optional)</FormLabel>
                            <FormControl>
                              <Input 
                                type="time" 
                                {...field} 
                                className="cursor-text pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:border-purple-400 focus:ring-purple-400/20" 
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-purple-500 dark:text-purple-400">
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
                            <FormLabel className="text-purple-800 dark:text-purple-200">Deadline Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="cursor-pointer pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:ring-purple-400/20">
                                  <SelectValue placeholder="Select deadline type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto z-50">
                                {DEADLINE_TYPES.map(type => (
                                  <SelectItem key={type} value={type} className="cursor-pointer">
                                    <div className="flex items-center">
                                      {getDeadlineTypeIcon(type)}
                                      <span className="ml-2">{type}</span>
                                    </div>
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
                            <FormLabel className="text-purple-800 dark:text-purple-200">Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="cursor-pointer pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:ring-purple-400/20">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto z-50">
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
                            <FormLabel className="text-purple-800 dark:text-purple-200">Notify Days Before</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="cursor-pointer pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:ring-purple-400/20">
                                  <SelectValue placeholder="Select notification time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto z-50">
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
                            <FormLabel className="text-purple-800 dark:text-purple-200">Jurisdiction (optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="cursor-pointer pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:ring-purple-400/20">
                                  <SelectValue placeholder="Select jurisdiction" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="pointer-events-auto z-50">
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
                          <FormLabel className="text-purple-800 dark:text-purple-200">Description (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional details about this deadline"
                              className="min-h-[80px] cursor-text pointer-events-auto border-purple-200 dark:border-purple-800/50 focus:border-purple-400 focus:ring-purple-400/20"
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
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md border-purple-200 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-purple-800 dark:text-purple-200">Court Filing Required</FormLabel>
                              <FormDescription className="text-xs text-purple-600 dark:text-purple-300">
                                This deadline requires court filing
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="pointer-events-auto data-[state=checked]:bg-purple-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="enableReminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md border-purple-200 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-900/10">
                            <div className="space-y-0.5">
                              <FormLabel className="text-purple-800 dark:text-purple-200">Enable Reminders</FormLabel>
                              <FormDescription className="text-xs text-purple-600 dark:text-purple-300">
                                Receive notifications for this deadline
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="pointer-events-auto data-[state=checked]:bg-purple-600"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      variant="default"
                      size="lg"
                      className="w-full mt-6 pointer-events-auto shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Save className="mr-2 h-4 w-4" />
                          Save Deadline
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Deadlines list */}
          <div className="md:col-span-2">
            <Card className="shadow-md border border-indigo-100 dark:border-indigo-900/30">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 border-b border-indigo-100 dark:border-indigo-800/20 pb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">Your Deadlines</CardTitle>
                    <CardDescription className="text-indigo-700 dark:text-indigo-300">
                      Track and manage all your legal deadlines
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={activeTab === 'upcoming' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTab('upcoming')}
                      className={`pointer-events-auto ${activeTab === 'upcoming' ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}`}
                    >
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Upcoming
                    </Button>
                    <Button 
                      variant={activeTab === 'urgent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('urgent')}
                      className={`pointer-events-auto ${activeTab === 'urgent' ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}`}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Urgent
                    </Button>
                    <Button 
                      variant={activeTab === 'past' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveTab('past')}
                      className={`pointer-events-auto ${activeTab === 'past' ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}`}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Completed/Past
                    </Button>
                  </div>
                </div>
                
                {/* Filter section */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                    <span className="text-sm text-indigo-600 dark:text-indigo-300">Filter by:</span>
                  </div>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[140px] h-8 text-xs cursor-pointer pointer-events-auto border-indigo-200 dark:border-indigo-800/50">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent className="pointer-events-auto z-50">
                      <SelectItem value="all" className="cursor-pointer">All Priorities</SelectItem>
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
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                  </div>
                ) : filteredDeadlines.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-100 mb-1">No deadlines found</h3>
                    <p className="text-indigo-600 dark:text-indigo-300 mb-4">
                      {activeTab === 'upcoming' ? "You don't have any upcoming deadlines." : 
                       activeTab === 'past' ? "You don't have any past deadlines." : 
                       "You don't have any urgent deadlines."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('upcoming')}
                      className="pointer-events-auto border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300"
                    >
                      View all deadlines
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
                        <TableRow className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/20">
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Priority</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Title</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Deadline</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Time Left</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Status</TableHead>
                          <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDeadlines.map((deadline) => {
                          const approaching = isDeadlineApproaching(deadline.due_date);
                          const timeRemaining = formatTimeRemaining(deadline.due_date);
                          const isPast = new Date(deadline.due_date) < new Date();
                          
                          return (
                            <TableRow 
                              key={deadline.id} 
                              className={cn(
                                "transition-colors border-indigo-100 dark:border-indigo-800/20 cursor-pointer",
                                approaching && deadline.status !== 'completed' ? "bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20" : 
                                isPast && deadline.status !== 'completed' ? "bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20" :
                                deadline.status === 'completed' ? "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20" :
                                "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                              )}
                            >
                              <TableCell>
                                <Badge className={cn("px-2 py-1 text-xs font-medium", getPriorityColor(deadline.priority))}>
                                  {deadline.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium text-indigo-800 dark:text-indigo-200">
                                <div className="flex flex-col">
                                  <span>{deadline.title}</span>
                                  {deadline.description && (
                                    <span className="text-xs text-indigo-500 dark:text-indigo-400 mt-1 line-clamp-1">
                                      {deadline.description}
                                    </span>
                                  )}
                                  {approaching && deadline.status !== 'completed' && (
                                    <Badge variant="outline" className="mt-1 border-red-400 text-red-600 text-xs w-fit">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Approaching
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-indigo-700 dark:text-indigo-300">
                                <div className="flex flex-col">
                                  <span>{deadline.due_date && format(new Date(deadline.due_date), "dd MMM yyyy")}</span>
                                  {deadline.reminder_date && (
                                    <div className="flex items-center mt-1 text-xs text-indigo-500 dark:text-indigo-400">
                                      <Bell className="h-3 w-3 mr-1" />
                                      Reminder: {format(new Date(deadline.reminder_date), "dd MMM")}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-normal text-xs",
                                    deadline.status === 'completed'
                                      ? "border-green-400 text-green-600 dark:border-green-800 dark:text-green-400"
                                      : isPast
                                      ? "border-amber-400 text-amber-600 dark:border-amber-800 dark:text-amber-400"
                                      : approaching
                                      ? "border-red-400 text-red-600 dark:border-red-800 dark:text-red-400"
                                      : "border-blue-400 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                                  )}
                                >
                                  {timeRemaining}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "font-normal",
                                    deadline.status === 'completed' 
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                                      : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                  )}
                                >
                                  {deadline.status === 'completed' ? (
                                    <div className="flex items-center">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completed
                                    </div>
                                  ) : isPast ? 'Overdue' : 'Pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 pointer-events-auto border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                    title="Edit deadline"
                                  >
                                    <FileEdit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  {deadline.status !== 'completed' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 pointer-events-auto border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                                      onClick={() => handleMarkComplete(deadline.id)}
                                      title="Mark as completed"
                                    >
                                      <Check className="h-4 w-4" />
                                      <span className="sr-only">Complete</span>
                                    </Button>
                                  )}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 pointer-events-auto border-red-200 dark:border-red-800/50 text-red-500 hover:text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    onClick={() => handleDelete(deadline.id)}
                                    title="Delete deadline"
                                  >
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
