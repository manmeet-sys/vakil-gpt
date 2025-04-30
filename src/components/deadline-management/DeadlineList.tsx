
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  CalendarDays, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Bell, 
  FileEdit, 
  Check, 
  Trash2,
  Clock,
  Shield,
  FileText,
  FileCheck,
  Gavel,
  FileSearch,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Dictionary for mapping deadline types to icons
const deadlineTypeIcons = {
  'Court Filing': FileText,
  'Hearing': Gavel,
  'Client Meeting': Briefcase,
  'Document Submission': FileCheck,
  'Research': FileSearch,
  'Other': Clock,
};

// Import constants from DeadlineForm (assuming these exist in that file)
const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low'];

// Helper function to get the icon for a deadline type
const getDeadlineTypeIcon = (type) => {
  return deadlineTypeIcons[type] || Clock; // Default to Clock if type doesn't match
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
  const days = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
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

// Helper function to get priority color
export const getPriorityColor = (priority) => {
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

interface DeadlineListProps {
  deadlines: any[];
  isLoading: boolean;
  onDeadlineUpdated: () => void;
}

const DeadlineList: React.FC<DeadlineListProps> = ({ 
  deadlines,
  isLoading,
  onDeadlineUpdated
}) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filterPriority, setFilterPriority] = useState('all');

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
    
    // Then filter by priority
    if (filterPriority === 'all') {
      return tabFiltered;
    } else {
      return tabFiltered && deadline.priority === filterPriority;
    }
  });

  // Handle marking a deadline as complete
  const handleMarkComplete = async (deadlineId) => {
    try {
      const { error } = await supabase
        .from('deadlines')
        .update({ status: 'completed' })
        .eq('id', deadlineId);
        
      if (error) throw error;
      
      toast.success("Deadline marked as complete!");
      onDeadlineUpdated();
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
      
      toast.success("Deadline deleted successfully.");
      onDeadlineUpdated();
    } catch (error) {
      console.error('Error deleting deadline:', error);
      toast.error("Failed to delete deadline.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Card className="shadow-lg border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 border-b border-indigo-100 dark:border-indigo-800/20 pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
              Your Deadlines
            </CardTitle>
            <CardDescription className="text-indigo-700 dark:text-indigo-300 ml-7">
              Track and manage all your legal deadlines
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeTab === 'upcoming' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "pointer-events-auto", 
                activeTab === 'upcoming' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
              )}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Upcoming
            </Button>
            <Button 
              variant={activeTab === 'urgent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('urgent')}
              className={cn(
                "pointer-events-auto",
                activeTab === 'urgent' ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
              )}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Urgent
            </Button>
            <Button 
              variant={activeTab === 'past' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('past')}
              className={cn(
                "pointer-events-auto",
                activeTab === 'past' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
              )}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Completed/Past
            </Button>
          </div>
        </div>
        
        {/* Filter section */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            <span className="text-sm text-indigo-600 dark:text-indigo-300">Filter by:</span>
          </div>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px] h-9 text-sm cursor-pointer pointer-events-auto border-indigo-200 dark:border-indigo-800/50 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent className="pointer-events-auto z-50">
              <SelectItem value="all" className="cursor-pointer">All Priorities</SelectItem>
              {PRIORITIES.map(priority => (
                <SelectItem key={priority} value={priority} className="cursor-pointer">
                  <div className="flex items-center">
                    <span className={cn("w-2 h-2 rounded-full mr-2", getPriorityColor(priority))}></span>
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredDeadlines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
              {activeTab === 'upcoming' ? (
                <CalendarDays className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              ) : activeTab === 'urgent' ? (
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              )}
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
              className="pointer-events-auto border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              View all deadlines
            </Button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
                <TableRow className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/20">
                  <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium w-[120px]">Priority</TableHead>
                  <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium">Title</TableHead>
                  <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium hidden md:table-cell">Deadline</TableHead>
                  <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium hidden sm:table-cell">Time Left</TableHead>
                  <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-indigo-700 dark:text-indigo-300 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredDeadlines.map((deadline) => {
                  const approaching = isDeadlineApproaching(deadline.due_date);
                  const timeRemaining = formatTimeRemaining(deadline.due_date);
                  const isPast = new Date(deadline.due_date) < new Date();
                  const DeadlineIcon = getDeadlineTypeIcon(deadline.type);
                  
                  return (
                    <motion.tr 
                      key={deadline.id}
                      variants={itemVariants}
                      className={cn(
                        "transition-all duration-200 border-indigo-100 dark:border-indigo-800/20 cursor-pointer hover:shadow-md",
                        approaching && deadline.status !== 'completed' ? "bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20" : 
                        isPast && deadline.status !== 'completed' ? "bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20" :
                        deadline.status === 'completed' ? "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20" :
                        "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      )}
                    >
                      <TableCell className="align-top">
                        <Badge className={cn("px-2 py-1 text-xs font-medium", getPriorityColor(deadline.priority))}>
                          {deadline.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-indigo-800 dark:text-indigo-200">
                        <div className="flex items-start space-x-2">
                          <span className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <DeadlineIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                          </span>
                          <div>
                            <div className="text-sm md:text-base font-medium line-clamp-1 max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                              {deadline.title || "Untitled"}
                            </div>
                            {deadline.description && (
                              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5 line-clamp-1 max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
                                {deadline.description}
                              </p>
                            )}
                            {/* Show on mobile only */}
                            <div className="sm:hidden mt-1 flex flex-col gap-1">
                              <div className="flex items-center text-xs text-indigo-500">
                                <CalendarDays className="h-3 w-3 mr-1" />
                                <span>{deadline.due_date && format(new Date(deadline.due_date), "dd MMM")}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "font-normal text-xs w-fit",
                                  deadline.status === 'completed'
                                    ? "border-green-400 text-green-600 dark:border-green-800 dark:text-green-400"
                                    : approaching
                                    ? "border-orange-400 text-orange-600 dark:border-orange-800 dark:text-orange-400"
                                    : "border-blue-400 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                                )}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {deadline.status === 'completed' ? "Completed" : timeRemaining}
                              </Badge>
                            </div>
                            {approaching && deadline.status !== 'completed' && (
                              <Badge variant="outline" className="mt-1 border-red-400 text-red-600 text-xs w-fit hidden sm:flex">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Approaching
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-indigo-700 dark:text-indigo-300 text-xs md:text-sm hidden md:table-cell">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                            <span className="whitespace-nowrap">{deadline.due_date && format(new Date(deadline.due_date), "dd MMM yyyy")}</span>
                          </div>
                          {deadline.reminder_date && (
                            <div className="flex items-center mt-1.5 text-xs text-indigo-500 dark:text-indigo-400">
                              <Bell className="h-3 w-3 mr-1" />
                              <span>Reminder: {format(new Date(deadline.reminder_date), "dd MMM")}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal text-xs whitespace-nowrap",
                            deadline.status === 'completed'
                              ? "border-green-400 text-green-600 dark:border-green-800 dark:text-green-400"
                              : isPast
                              ? "border-red-400 text-red-600 dark:border-red-800 dark:text-red-400"
                              : approaching
                              ? "border-orange-400 text-orange-600 dark:border-orange-800 dark:text-orange-400"
                              : "border-blue-400 text-blue-600 dark:border-blue-800 dark:text-blue-400"
                          )}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {timeRemaining}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "font-normal text-xs whitespace-nowrap",
                            deadline.status === 'completed' 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                              : isPast 
                              ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                          )}
                        >
                          {deadline.status === 'completed' ? (
                            <div className="flex items-center">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </div>
                          ) : isPast ? (
                            <div className="flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Pending
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-1 md:space-x-2 justify-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 pointer-events-auto border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                                >
                                  <FileEdit className="h-3.5 w-3.5" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="pointer-events-auto">
                                <p>Edit deadline</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {deadline.status !== 'completed' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 w-7 p-0 pointer-events-auto border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                                    onClick={() => handleMarkComplete(deadline.id)}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span className="sr-only">Complete</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="pointer-events-auto">
                                  <p>Mark as completed</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 pointer-events-auto border-red-200 dark:border-red-800/50 text-red-500 hover:text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                                  onClick={() => handleDelete(deadline.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="pointer-events-auto">
                                <p>Delete deadline</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeadlineList;
