
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { 
  Calendar, Plus, Clock, Bell, MoreHorizontal, ChevronLeft, 
  ChevronRight, AlertCircle, CheckCircle, CalendarDays,
  Filter, Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const DeadlineManagementPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCourt, setFilterCourt] = useState<string>('all');
  
  // Fields for new deadline
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCourtJurisdiction, setNewCourtJurisdiction] = useState('');
  const [isNewDeadlineDialogOpen, setIsNewDeadlineDialogOpen] = useState(false);

  const handleAddDeadline = () => {
    if (!newTitle || !selectedDate || !newType || !newPriority) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }

    toast({
      title: "Deadline added",
      description: `New deadline "${newTitle}" set for ${format(selectedDate, 'dd MMM yyyy')}`,
    });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewType('');
    setNewPriority('');
    setNewCaseNumber('');
    setNewCourtJurisdiction('');
    setSelectedDate(new Date());
    setReminderDate(undefined);
    setIsNewDeadlineDialogOpen(false);
  };

  const deadlineTypes = [
    { value: 'filing', label: 'Court Filing' },
    { value: 'hearing', label: 'Court Hearing' },
    { value: 'document', label: 'Document Submission' },
    { value: 'meeting', label: 'Client Meeting' },
    { value: 'legal-research', label: 'Legal Research' },
    { value: 'client-followup', label: 'Client Follow-up' },
    { value: 'settlement', label: 'Settlement Discussion' },
    { value: 'statute', label: 'Statute of Limitations' },
  ];

  const courtJurisdictions = [
    { value: 'supreme-court', label: 'Supreme Court of India' },
    { value: 'delhi-hc', label: 'Delhi High Court' },
    { value: 'bombay-hc', label: 'Bombay High Court' },
    { value: 'calcutta-hc', label: 'Calcutta High Court' },
    { value: 'madras-hc', label: 'Madras High Court' },
    { value: 'district-delhi', label: 'District Court, Delhi' },
    { value: 'district-mumbai', label: 'District Court, Mumbai' },
    { value: 'district-bangalore', label: 'District Court, Bangalore' },
  ];

  // Sample deadlines data
  const deadlines = [
    {
      id: 'd1',
      title: 'File Reply in Smith v. Jones',
      description: 'Submit the reply to the plaintiff\'s arguments',
      date: new Date('2025-04-15'),
      type: 'filing',
      typeName: 'Court Filing',
      priority: 'high',
      court: 'Delhi High Court',
      caseNumber: 'CS/123/2024',
      status: 'pending',
      reminderDate: new Date('2025-04-10'),
    },
    {
      id: 'd2',
      title: 'Client Meeting - ABC Corp.',
      description: 'Discuss the ongoing trademark infringement case',
      date: new Date('2025-04-10'),
      type: 'meeting',
      typeName: 'Client Meeting',
      priority: 'medium',
      court: null,
      caseNumber: null,
      status: 'pending',
      reminderDate: new Date('2025-04-08'),
    },
    {
      id: 'd3',
      title: 'Supreme Court Hearing - Kumar Case',
      description: 'Final hearing in the property dispute',
      date: new Date('2025-04-20'),
      type: 'hearing',
      typeName: 'Court Hearing',
      priority: 'high',
      court: 'Supreme Court of India',
      caseNumber: 'SLP/789/2023',
      status: 'pending',
      reminderDate: new Date('2025-04-17'),
    },
    {
      id: 'd4',
      title: 'Submit Expert Testimony',
      description: 'Submit the expert witness testimony for the medical negligence case',
      date: new Date('2025-04-05'),
      type: 'document',
      typeName: 'Document Submission',
      priority: 'high',
      court: 'Bombay High Court',
      caseNumber: 'WP/456/2024',
      status: 'completed',
      reminderDate: new Date('2025-04-02'),
      completedDate: new Date('2025-04-04'),
    },
  ];
  
  // Filter deadlines
  const filteredDeadlines = deadlines.filter(deadline => {
    // Filter by status
    if (filterStatus !== 'all' && deadline.status !== filterStatus) {
      return false;
    }
    
    // Filter by type
    if (filterType !== 'all' && deadline.type !== filterType) {
      return false;
    }
    
    // Filter by court
    if (filterCourt !== 'all' && deadline.court !== filterCourt) {
      return false;
    }
    
    return true;
  });
  
  // Sort deadlines by date
  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => 
    a.date.getTime() - b.date.getTime()
  );

  // Function to group deadlines by date
  const groupDeadlinesByDate = () => {
    const grouped: Record<string, typeof deadlines> = {};
    
    sortedDeadlines.forEach(deadline => {
      const dateKey = format(deadline.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(deadline);
    });
    
    return grouped;
  };

  const groupedDeadlines = groupDeadlinesByDate();

  const handleDeadlineCompletion = (id: string, completed: boolean) => {
    toast({
      title: completed ? "Deadline completed" : "Deadline marked as pending",
      description: completed 
        ? "The deadline has been marked as completed."
        : "The deadline has been reopened.",
    });
  };

  return (
    <LegalToolLayout
      title="Legal Deadline Management" 
      description="Smart calendar system with automatic deadline calculations for Indian legal procedures"
      icon={<Calendar className="h-6 w-6 text-purple-600" />}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Select value={view} onValueChange={(value) => setView(value as 'month' | 'week' | 'day')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline">Today</Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Deadline Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {deadlineTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Court</Label>
                    <Select value={filterCourt} onValueChange={setFilterCourt}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by court" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courts</SelectItem>
                        {courtJurisdictions.map(court => (
                          <SelectItem key={court.value} value={court.label}>
                            {court.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterType('all');
                      setFilterCourt('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Dialog open={isNewDeadlineDialogOpen} onOpenChange={setIsNewDeadlineDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Deadline
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Legal Deadline</DialogTitle>
                  <DialogDescription>
                    Create a new deadline with automatic notifications and reminders.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        placeholder="Enter deadline title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Enter additional details"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deadline-date">Deadline Date <span className="text-red-500">*</span></Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reminder-date">Set Reminder</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Bell className="mr-2 h-4 w-4" />
                              {reminderDate ? format(reminderDate, 'PPP') : <span>Reminder date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={reminderDate}
                              onSelect={setReminderDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Deadline Type <span className="text-red-500">*</span></Label>
                        <Select value={newType} onValueChange={setNewType}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {deadlineTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
                        <Select value={newPriority} onValueChange={setNewPriority}>
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="case-number">Case Number</Label>
                        <Input
                          id="case-number"
                          placeholder="e.g. CS/123/2024"
                          value={newCaseNumber}
                          onChange={(e) => setNewCaseNumber(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="court">Court Jurisdiction</Label>
                        <Select value={newCourtJurisdiction} onValueChange={setNewCourtJurisdiction}>
                          <SelectTrigger id="court">
                            <SelectValue placeholder="Select Court" />
                          </SelectTrigger>
                          <SelectContent>
                            {courtJurisdictions.map(court => (
                              <SelectItem key={court.value} value={court.value}>
                                {court.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewDeadlineDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDeadline}>
                    Add Deadline
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="calendar">
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="list">
              <Clock className="h-4 w-4 mr-2" />
              Deadlines
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="h-4 w-4 mr-2" />
              Reminders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Legal Calendar - {format(new Date(), 'MMMM yyyy')}</CardTitle>
                <CardDescription>
                  View and manage upcoming deadlines across all your cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    Calendar view will display your deadlines and court dates here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Legal Deadlines</CardTitle>
                <CardDescription>
                  All your upcoming filings, hearings and legal tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedDeadlines).map(([dateKey, deadlinesForDate]) => (
                    <div key={dateKey}>
                      <div className="flex items-center mb-2">
                        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium">
                            {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {deadlinesForDate.map((deadline) => (
                          <div 
                            key={deadline.id}
                            className={`border rounded-lg p-4 ${
                              deadline.status === 'completed' 
                                ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700' 
                                : deadline.priority === 'high'
                                ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10'
                                : deadline.priority === 'medium'
                                ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-900/10'
                                : 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <Checkbox 
                                  id={`deadline-${deadline.id}`}
                                  checked={deadline.status === 'completed'}
                                  onCheckedChange={(checked) => {
                                    handleDeadlineCompletion(deadline.id, checked === true);
                                  }}
                                  className="mt-1"
                                />
                                
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <Label 
                                      htmlFor={`deadline-${deadline.id}`}
                                      className={`font-medium ${
                                        deadline.status === 'completed' 
                                          ? 'line-through text-gray-500 dark:text-gray-400' 
                                          : ''
                                      }`}
                                    >
                                      {deadline.title}
                                    </Label>
                                    
                                    <Badge 
                                      variant="outline" 
                                      className={`
                                        ${deadline.priority === 'high' 
                                          ? 'text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' 
                                          : deadline.priority === 'medium'
                                          ? 'text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                                          : 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                        }
                                      `}
                                    >
                                      {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)} Priority
                                    </Badge>
                                    
                                    <Badge variant="secondary">
                                      {deadline.typeName}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {deadline.description}
                                  </p>
                                  
                                  {(deadline.court || deadline.caseNumber) && (
                                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                                      {deadline.court && (
                                        <span className="inline-flex items-center">
                                          <Popover>
                                            <PopoverTrigger className="underline">
                                              {deadline.court}
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-0">
                                              <div className="p-4">
                                                <h4 className="font-medium">Court Details</h4>
                                                <p className="text-sm mt-1">
                                                  Address and contact information for {deadline.court} will appear here.
                                                </p>
                                              </div>
                                            </PopoverContent>
                                          </Popover>
                                        </span>
                                      )}
                                      
                                      {deadline.court && deadline.caseNumber && (
                                        <span className="mx-2">•</span>
                                      )}
                                      
                                      {deadline.caseNumber && (
                                        <span>Case: {deadline.caseNumber}</span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {deadline.reminderDate && (
                                    <div className="flex items-center mt-2 text-xs">
                                      <Bell className="h-3 w-3 mr-1 text-purple-500 dark:text-purple-400" />
                                      <span className="text-purple-600 dark:text-purple-400">
                                        Reminder set for {format(deadline.reminderDate, 'PPP')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Change Date</DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {deadline.status === 'completed'
                                      ? 'Mark as Pending'
                                      : 'Mark as Completed'
                                    }
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(groupedDeadlines).length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No deadlines found</h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        No deadlines match your current filters. Try changing the filters or add a new deadline.
                      </p>
                      <Button className="mt-4" onClick={() => setIsNewDeadlineDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Your First Deadline
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => setIsNewDeadlineDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Deadline
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                <CardDescription>
                  Notifications and alerts for your approaching deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedDeadlines
                    .filter(deadline => deadline.reminderDate && deadline.status !== 'completed')
                    .slice(0, 3)
                    .map(deadline => (
                      <div 
                        key={deadline.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10"
                      >
                        <div className="mt-1 p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
                          <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{deadline.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Reminder set for {format(deadline.reminderDate, 'EEEE, MMMM d, yyyy')}
                          </p>
                          <div className="flex items-center mt-2">
                            <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                            <span className="text-sm text-red-600 dark:text-red-400">
                              Deadline on {format(deadline.date, 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  
                  {sortedDeadlines.filter(deadline => deadline.reminderDate && deadline.status !== 'completed').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium">No upcoming reminders</h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        You have no upcoming reminders at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" onClick={() => setActiveTab('list')}>
                  View All Deadlines
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default DeadlineManagementPage;
