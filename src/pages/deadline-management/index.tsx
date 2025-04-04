
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDays, format, isSameDay, isToday, isTomorrow } from 'date-fns';
import { 
  AlertCircle, 
  Bell, 
  Calendar, 
  CalendarCheck, 
  CalendarClock, 
  CalendarDays, 
  Check, 
  ChevronDown, 
  Clock, 
  FileText, 
  Gavel, 
  Pencil, 
  Plus, 
  Trash 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LegalToolLayout from '@/components/LegalToolLayout';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Define deadline type for better type safety
interface Deadline {
  id: number;
  title: string;
  caseReference: string;
  deadlineType: string;
  date: Date;
  time: string;
  description: string;
  priority: string;
  notifyDaysBefore: number;
  enableReminders: boolean;
  courtFilingRequired: boolean;
  jurisdiction: string;
  completed: boolean;
}

// Define the form schema
const deadlineFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  caseReference: z.string().optional(),
  deadlineType: z.string().min(1, { message: "Deadline type is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().optional(),
  description: z.string().optional(),
  priority: z.string().default("medium"),
  notifyDaysBefore: z.coerce.number().int().min(0).default(1),
  enableReminders: z.boolean().default(true),
  courtFilingRequired: z.boolean().default(false),
  jurisdiction: z.string().optional(),
});

// Define deadline types specific to Indian legal system
const deadlineTypes = [
  "Filing Deadline",
  "Reply Deadline",
  "Hearing Date",
  "Document Submission",
  "Evidence Submission",
  "Client Meeting",
  "Statute of Limitations",
  "Court Appearance",
  "Settlement Conference",
  "Appeal Deadline",
  "Payment Due Date",
  "Legal Research Deadline"
];

// Define Indian jurisdictions
const indianJurisdictions = [
  "Supreme Court of India",
  "Delhi High Court",
  "Bombay High Court",
  "Madras High Court",
  "Karnataka High Court",
  "Calcutta High Court",
  "Allahabad High Court",
  "District Courts",
  "Consumer Forum",
  "National Company Law Tribunal",
  "Income Tax Appellate Tribunal",
  "Other"
];

// Mock data for deadlines
const initialDeadlines: Deadline[] = [
  {
    id: 1,
    title: "File Counter-Affidavit in Mehta vs. Sharma",
    caseReference: "CMA/123/2025",
    deadlineType: "Filing Deadline",
    date: addDays(new Date(), 2),
    time: "14:00",
    description: "Counter-affidavit needs to be filed with supporting documents",
    priority: "high",
    notifyDaysBefore: 1,
    enableReminders: true,
    courtFilingRequired: true,
    jurisdiction: "Karnataka High Court",
    completed: false
  },
  {
    id: 2,
    title: "Hearing in State vs. Reddy",
    caseReference: "CRL/789/2025",
    deadlineType: "Hearing Date",
    date: addDays(new Date(), 5),
    time: "10:30",
    description: "Criminal case hearing, bring all case files",
    priority: "high",
    notifyDaysBefore: 2,
    enableReminders: true,
    courtFilingRequired: false,
    jurisdiction: "Bangalore District Court",
    completed: false
  },
  {
    id: 3,
    title: "Submit GST Appeal Documents",
    caseReference: "GST/456/2025",
    deadlineType: "Document Submission",
    date: addDays(new Date(), 1),
    time: "17:00",
    description: "GST appeal documentation needs to be completed and submitted",
    priority: "medium",
    notifyDaysBefore: 1,
    enableReminders: true,
    courtFilingRequired: true,
    jurisdiction: "GST Appellate Tribunal",
    completed: false
  },
  {
    id: 4,
    title: "Client Meeting - Patel Property Dispute",
    caseReference: "CIVIL/234/2025",
    deadlineType: "Client Meeting",
    date: new Date(),
    time: "11:00",
    description: "Review case strategy and discuss settlement options",
    priority: "medium",
    notifyDaysBefore: 1,
    enableReminders: true,
    courtFilingRequired: false,
    jurisdiction: "N/A",
    completed: false
  },
  {
    id: 5,
    title: "File Appeal in Tax Matter",
    caseReference: "IT/567/2025",
    deadlineType: "Appeal Deadline",
    date: addDays(new Date(), -1),
    time: "16:00",
    description: "Last day to file income tax appeal",
    priority: "high",
    notifyDaysBefore: 2,
    enableReminders: true,
    courtFilingRequired: true,
    jurisdiction: "Income Tax Appellate Tribunal",
    completed: true
  }
];

const DeadlineManagementPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [isAddingDeadline, setIsAddingDeadline] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Initialize the form
  const form = useForm<z.infer<typeof deadlineFormSchema>>({
    resolver: zodResolver(deadlineFormSchema),
    defaultValues: {
      title: "",
      caseReference: "",
      deadlineType: "",
      description: "",
      priority: "medium",
      notifyDaysBefore: 1,
      enableReminders: true,
      courtFilingRequired: false,
      jurisdiction: "",
    },
  });
  
  // Helper to get deadline dates with case details
  const getDeadlinesWithDates = () => {
    // Create an array of dates (today + next 6 days)
    const dateRange = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
    
    // Map each date to deadlines occurring on that date
    return dateRange.map(date => ({
      date,
      deadlines: deadlines.filter(d => 
        isSameDay(d.date, date) && 
        (activeTab === "upcoming" ? !d.completed : true)
      )
    }));
  };
  
  // Filter deadlines based on selected date and active tab
  const filteredDeadlines = selectedDate 
    ? deadlines.filter(d => 
        isSameDay(d.date, selectedDate) && 
        (activeTab === "upcoming" ? !d.completed : activeTab === "completed" ? d.completed : true)
      )
    : deadlines.filter(d => 
        activeTab === "upcoming" ? !d.completed : activeTab === "completed" ? d.completed : true
      );
  
  // Reset form for new deadline
  const resetForm = () => {
    form.reset({
      title: "",
      caseReference: "",
      deadlineType: "",
      description: "",
      date: new Date(),
      time: "",
      priority: "medium",
      notifyDaysBefore: 1,
      enableReminders: true,
      courtFilingRequired: false,
      jurisdiction: "",
    });
    setEditingDeadline(null);
  };
  
  // Handle editing a deadline
  const handleEditDeadline = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    form.reset({
      title: deadline.title,
      caseReference: deadline.caseReference || "",
      deadlineType: deadline.deadlineType,
      date: new Date(deadline.date),
      time: deadline.time || "",
      description: deadline.description || "",
      priority: deadline.priority,
      notifyDaysBefore: deadline.notifyDaysBefore,
      enableReminders: deadline.enableReminders,
      courtFilingRequired: deadline.courtFilingRequired,
      jurisdiction: deadline.jurisdiction || "",
    });
    setIsAddingDeadline(true);
  };
  
  // Handle deleting a deadline
  const handleDeleteDeadline = (id: number) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Deadline Deleted",
      description: "The deadline has been successfully deleted.",
    });
  };
  
  // Handle marking a deadline as complete/incomplete
  const handleToggleComplete = (id: number) => {
    setDeadlines(prev => prev.map(d => 
      d.id === id ? { ...d, completed: !d.completed } : d
    ));
    
    const deadline = deadlines.find(d => d.id === id);
    toast({
      title: deadline?.completed ? "Deadline Marked as Incomplete" : "Deadline Marked as Complete",
      description: `${deadline?.title} has been updated.`,
    });
  };
  
  // Form submission handler
  const onSubmit = (data: z.infer<typeof deadlineFormSchema>) => {
    if (editingDeadline) {
      // Update existing deadline
      setDeadlines(prev => prev.map(d => 
        d.id === editingDeadline.id ? { 
          ...d, 
          title: data.title,
          caseReference: data.caseReference || "",
          deadlineType: data.deadlineType,
          date: data.date,
          time: data.time || "",
          description: data.description || "",
          priority: data.priority,
          notifyDaysBefore: data.notifyDaysBefore,
          enableReminders: data.enableReminders,
          courtFilingRequired: data.courtFilingRequired,
          jurisdiction: data.jurisdiction || ""
        } : d
      ));
      
      toast({
        title: "Deadline Updated",
        description: "The deadline has been successfully updated.",
      });
    } else {
      // Add new deadline with all required fields
      const newDeadline: Deadline = {
        id: Math.max(0, ...deadlines.map(d => d.id)) + 1,
        title: data.title,
        caseReference: data.caseReference || "",
        deadlineType: data.deadlineType,
        date: data.date,
        time: data.time || "",
        description: data.description || "",
        priority: data.priority,
        notifyDaysBefore: data.notifyDaysBefore,
        enableReminders: data.enableReminders,
        courtFilingRequired: data.courtFilingRequired,
        jurisdiction: data.jurisdiction || "",
        completed: false
      };
      
      setDeadlines(prev => [...prev, newDeadline]);
      
      toast({
        title: "Deadline Added",
        description: "New deadline has been successfully added.",
      });
    }
    
    resetForm();
    setIsAddingDeadline(false);
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return null;
    }
  };
  
  // Get deadline date display
  const getDeadlineDateDisplay = (date: Date) => {
    if (isToday(date)) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Today</Badge>;
    } else if (isTomorrow(date)) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Tomorrow</Badge>;
    } else if (date < new Date()) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return format(date, "dd MMM yyyy");
  };

  return (
    <LegalToolLayout
      title="Deadline Management"
      description="Track deadlines, court dates, and filing requirements for Indian legal matters"
      icon={<CalendarClock className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar and Upcoming Section */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border p-3 pointer-events-auto"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setIsAddingDeadline(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deadline
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {getDeadlinesWithDates().map(({ date, deadlines: dateDls }) => (
                  <div key={format(date, 'yyyy-MM-dd')} className="mb-1">
                    {dateDls.length > 0 && (
                      <>
                        <div className={`
                          px-4 py-2 text-sm font-medium 
                          ${isToday(date) ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : 
                            isTomorrow(date) ? 'bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' : 
                            'bg-gray-50 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300'}
                        `}>
                          {isToday(date) ? 'Today' : 
                            isTomorrow(date) ? 'Tomorrow' : 
                            format(date, 'EEEE, MMMM d')}
                        </div>
                        
                        <ScrollArea className="max-h-48">
                          {dateDls.map((dl) => (
                            <div 
                              key={dl.id} 
                              className="px-4 py-2 border-b last:border-0 border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                              onClick={() => {
                                setSelectedDate(dl.date);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {dl.deadlineType === "Hearing Date" ? (
                                    <Gavel className="h-4 w-4 text-purple-500 mr-2" />
                                  ) : dl.deadlineType === "Filing Deadline" ? (
                                    <FileText className="h-4 w-4 text-red-500 mr-2" />
                                  ) : (
                                    <Calendar className="h-4 w-4 text-blue-500 mr-2" />
                                  )}
                                  <span className="text-sm truncate max-w-[180px]">{dl.title}</span>
                                </div>
                                {dl.time && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {dl.time}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </>
                    )}
                  </div>
                ))}
                
                {getDeadlinesWithDates().every(({ deadlines: dateDls }) => dateDls.length === 0) && (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No upcoming deadlines for the next 7 days</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Deadlines List Section */}
          <div className="lg:col-span-8">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">
                    {selectedDate ? (
                      <>Deadlines for {format(selectedDate, "d MMMM yyyy")}</>
                    ) : (
                      <>All Deadlines</>
                    )}
                  </CardTitle>
                  <Button onClick={() => setIsAddingDeadline(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Deadline
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    {filteredDeadlines.length > 0 ? (
                      <div className="space-y-4">
                        {filteredDeadlines.map((deadline) => (
                          <Card key={deadline.id} className="overflow-hidden">
                            <div className={`
                              h-1 w-full
                              ${deadline.priority === 'high' ? 'bg-red-500' : 
                                deadline.priority === 'medium' ? 'bg-orange-400' : 
                                'bg-blue-400'}
                            `}></div>
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row md:items-center p-4">
                                <div className="flex-1 md:mr-4">
                                  <div className="flex items-center mb-2">
                                    <Checkbox 
                                      id={`complete-${deadline.id}`} 
                                      checked={deadline.completed}
                                      onCheckedChange={() => handleToggleComplete(deadline.id)}
                                      className="mr-2"
                                    />
                                    <h3 className={`font-semibold text-lg ${deadline.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                                      {deadline.title}
                                    </h3>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {getPriorityBadge(deadline.priority)}
                                    
                                    {deadline.courtFilingRequired && (
                                      <Badge variant="outline" className="border-legal-accent text-legal-accent">
                                        Court Filing Required
                                      </Badge>
                                    )}
                                    
                                    <Badge variant="outline">
                                      {deadline.deadlineType}
                                    </Badge>
                                  </div>
                                  
                                  {deadline.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {deadline.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex flex-wrap text-sm text-gray-500 dark:text-gray-400 gap-4">
                                    {deadline.caseReference && (
                                      <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-1" />
                                        <span>{deadline.caseReference}</span>
                                      </div>
                                    )}
                                    
                                    {deadline.jurisdiction && (
                                      <div className="flex items-center">
                                        <Gavel className="h-4 w-4 mr-1" />
                                        <span>{deadline.jurisdiction}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="mt-3 md:mt-0 md:text-right">
                                  <div className="flex items-center md:justify-end mb-2">
                                    <CalendarDays className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm">
                                      {getDeadlineDateDisplay(deadline.date)}
                                    </span>
                                  </div>
                                  
                                  {deadline.time && (
                                    <div className="flex items-center md:justify-end mb-3">
                                      <Clock className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {deadline.time}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <div className="flex space-x-2 justify-start md:justify-end">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleEditDeadline(deadline)}
                                    >
                                      <Pencil className="h-3.5 w-3.5 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 dark:border-red-900 dark:hover:border-red-800"
                                      onClick={() => handleDeleteDeadline(deadline.id)}
                                    >
                                      <Trash className="h-3.5 w-3.5 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <CalendarClock className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
                          No deadlines found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          {selectedDate
                            ? `No ${activeTab} deadlines for ${format(selectedDate, "d MMMM yyyy")}`
                            : `No ${activeTab} deadlines available`}
                        </p>
                        <Button onClick={() => setIsAddingDeadline(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Deadline
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Dialog for adding or editing deadlines */}
      <Dialog open={isAddingDeadline} onOpenChange={setIsAddingDeadline}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingDeadline ? "Edit Deadline" : "Add New Deadline"}
            </DialogTitle>
            <DialogDescription>
              {editingDeadline
                ? "Update the details for this deadline"
                : "Create a new deadline or important date for your calendar"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select a date</span>
                              )}
                              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (optional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deadlineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select deadline type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deadlineTypes.map((type) => (
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
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="caseReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Reference (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., CRL/123/2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notifyDaysBefore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notify Days Before</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Same day only</SelectItem>
                          <SelectItem value="1">1 day before</SelectItem>
                          <SelectItem value="2">2 days before</SelectItem>
                          <SelectItem value="3">3 days before</SelectItem>
                          <SelectItem value="5">5 days before</SelectItem>
                          <SelectItem value="7">1 week before</SelectItem>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="courtFilingRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Court Filing Required</FormLabel>
                        <FormDescription className="text-xs">
                          Requires document filing with court
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Reminders</FormLabel>
                        <FormDescription className="text-xs">
                          Send notifications for this deadline
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
              
              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction (optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {indianJurisdictions.map((jurisdiction) => (
                          <SelectItem key={jurisdiction} value={jurisdiction}>
                            {jurisdiction}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsAddingDeadline(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDeadline ? "Update Deadline" : "Add Deadline"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </LegalToolLayout>
  );
};

export default DeadlineManagementPage;
