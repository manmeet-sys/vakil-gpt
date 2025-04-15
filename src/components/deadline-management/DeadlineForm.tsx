
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  CalendarIcon, 
  Clock, 
  Save, 
  Scale, 
  Award,
  BookOpen,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// Define options for the dropdowns
export const DEADLINE_TYPES = [
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

export const PRIORITIES = [
  "Urgent",
  "High",
  "Medium",
  "Low"
];

export const NOTIFICATION_OPTIONS = [
  "1 day before",
  "2 days before",
  "3 days before",
  "1 week before",
  "2 weeks before",
  "1 month before"
];

export const JURISDICTIONS = [
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

// Helper function to get deadline type icon
export const getDeadlineTypeIcon = (type) => {
  switch (type) {
    case 'Statute of Limitations':
      return <Scale className="h-4 w-4" />;
    case 'Filing Deadline':
      return <BookOpen className="h-4 w-4" />;
    case 'Court Appearance':
      return <Award className="h-4 w-4" />;
    case 'Hearing Date':
      return <Bell className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Form schema
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

interface DeadlineFormProps {
  onDeadlineAdded: () => void;
  currentUserId: string | null;
}

const DeadlineForm: React.FC<DeadlineFormProps> = ({ 
  onDeadlineAdded, 
  currentUserId 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
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
      
      // Convert form values to match the database schema
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
      
      // Show success message
      toast.success("Deadline created successfully!", {
        description: "Your new deadline has been added to your calendar.",
      });
      
      // Reset the form
      form.reset();
      
      // Notify parent component
      onDeadlineAdded();
      
    } catch (error) {
      console.error('Error saving deadline:', error);
      toast.error("Failed to save deadline. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md border border-purple-100 dark:border-purple-900/30">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:to-indigo-900/30 border-b border-purple-100 dark:border-purple-800/20">
        <CardTitle className="text-xl text-purple-900 dark:text-purple-100">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-300" />
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
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                priority === 'Urgent' ? 'bg-red-500' : 
                                priority === 'High' ? 'bg-orange-500' : 
                                priority === 'Medium' ? 'bg-blue-500' : 
                                'bg-green-500'
                              }`}></span>
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
  );
};

export default DeadlineForm;
