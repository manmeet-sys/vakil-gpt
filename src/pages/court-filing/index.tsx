
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { Check, ChevronDown, FileText, Info, Plus, Upload, X, MapPin, Clock, Calendar } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PdfUploader from '@/components/PdfUploader';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  caseTitle: z.string().min(5, { message: "Case title must be at least 5 characters" }),
  caseNumber: z.string().optional(),
  courtType: z.string().min(1, { message: "Court type is required" }),
  jurisdiction: z.string().min(1, { message: "Jurisdiction is required" }),
  filingType: z.string().min(1, { message: "Filing type is required" }),
  filingDate: z.date({ required_error: "Filing date is required" }),
  filingDeadline: z.date({ required_error: "Filing deadline is required" }).optional(),
  clientName: z.string().min(1, { message: "Client name is required" }),
  opposingParty: z.string().min(1, { message: "Opposing party is required" }),
  description: z.string().optional(),
  courtLocation: z.string().optional(),
  filingNotes: z.string().optional(),
});

const indianCourtTypes = [
  "Supreme Court of India",
  "High Court",
  "District Court",
  "Consumer Forum",
  "Debt Recovery Tribunal",
  "National Company Law Tribunal",
  "Income Tax Appellate Tribunal",
  "Family Court",
  "Labor Court"
];

const indianJurisdictions = [
  "Delhi",
  "Mumbai (Maharashtra)",
  "Kolkata (West Bengal)",
  "Chennai (Tamil Nadu)",
  "Bengaluru (Karnataka)",
  "Hyderabad (Telangana)",
  "Ahmedabad (Gujarat)",
  "Chandigarh (Punjab & Haryana)",
  "Lucknow (Uttar Pradesh)",
  "Patna (Bihar)",
  "Guwahati (Assam)",
  "Kochi (Kerala)",
  "Jaipur (Rajasthan)"
];

const filingTypes = [
  "Plaint",
  "Written Statement",
  "Reply",
  "Rejoinder",
  "Application",
  "Counter Affidavit",
  "Review Petition",
  "Writ Petition",
  "Special Leave Petition",
  "Vakalatnama",
  "Miscellaneous Application",
  "Appeal"
];

const CourtFilingPage = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [documents, setDocuments] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeadlineWarning, setShowDeadlineWarning] = useState(false);
  const [userFilings, setUserFilings] = useState<any[]>([]);
  const [draftFilings, setDraftFilings] = useState<any[]>([]);
  const [storedFilings, setStoredFilings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseTitle: "",
      caseNumber: "",
      courtType: "",
      jurisdiction: "",
      filingType: "",
      clientName: "",
      opposingParty: "",
      description: "",
      courtLocation: "",
      filingNotes: "",
    },
  });

  // Fetch user's court filings from Supabase
  useEffect(() => {
    const fetchFilings = async () => {
      setIsLoading(true);
      try {
        const { data: filings, error } = await supabase
          .from('court_filings')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }

        if (filings) {
          setUserFilings(filings);
          setDraftFilings(filings.filter(filing => filing.status === 'draft'));
          setStoredFilings(filings.filter(filing => filing.status === 'submitted' || filing.status === 'pending'));
        }
      } catch (error) {
        console.error('Error fetching court filings:', error);
        toast({
          title: "Error",
          description: "Failed to load your filings. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilings();
  }, [activeTab]);

  const handleDocumentsUpload = (files: File[], text?: string) => {
    setDocuments(prev => [...prev, ...files]);
    
    if (text) {
      setExtractedText(text);
      
      if (text.includes('Case No.') || text.includes('Case Number')) {
        const caseNumberMatch = text.match(/Case No\.?\s*([A-Z0-9\/-]+)/i) || 
                               text.match(/Case Number:?\s*([A-Z0-9\/-]+)/i);
        
        if (caseNumberMatch && caseNumberMatch[1]) {
          form.setValue('caseNumber', caseNumberMatch[1].trim());
          toast({
            title: "Case number extracted from PDF",
            description: "The form has been updated with information from the document"
          });
        }
      }
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    if (documents.length === 1) {
      setExtractedText(null);
    }
  };

  const checkDeadlineProximity = (filingDate: Date, deadline?: Date) => {
    if (!deadline) return false;
    
    const diffTime = Math.abs(deadline.getTime() - filingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    if (data.filingDeadline && checkDeadlineProximity(data.filingDate, data.filingDeadline)) {
      setShowDeadlineWarning(true);
      toast({
        title: "Filing Deadline Warning",
        description: "Your filing date is very close to the deadline. Please ensure timely preparation.",
        variant: "destructive"
      });
    }
    
    try {
      // Store filing in Supabase
      const filingData = {
        case_title: data.caseTitle,
        case_number: data.caseNumber || null,
        court_type: data.courtType,
        jurisdiction: data.jurisdiction,
        filing_type: data.filingType,
        filing_date: data.filingDate.toISOString(),
        filing_deadline: data.filingDeadline ? data.filingDeadline.toISOString() : null,
        client_name: data.clientName,
        opposing_party: data.opposingParty,
        description: data.description || null,
        court_name: data.courtLocation || null,
        filing_notes: data.filingNotes || null,
        status: activeTab === "drafts" ? "draft" : "submitted",
        documents: documents.map(doc => ({ name: doc.name, size: doc.size, type: doc.type })),
      };

      const { data: filing, error } = await supabase
        .from('court_filings')
        .insert(filingData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Filing Stored",
        description: "Your court filing details have been stored successfully.",
      });
      
      if (activeTab === "new") {
        form.reset();
        setDocuments([]);
        setShowDeadlineWarning(false);
      }
      
      // Refresh the filings lists
      setActiveTab(filing.status === "draft" ? "drafts" : "stored");
    } catch (error) {
      console.error('Error storing filing:', error);
      toast({
        title: "Error",
        description: "Failed to store filing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFiling = (filing: any) => {
    form.reset({
      caseTitle: filing.case_title || "",
      caseNumber: filing.case_number || "",
      courtType: filing.court_type || "",
      jurisdiction: filing.jurisdiction || "",
      filingType: filing.filing_type || "",
      filingDate: filing.filing_date ? new Date(filing.filing_date) : new Date(),
      filingDeadline: filing.filing_deadline ? new Date(filing.filing_deadline) : undefined,
      clientName: filing.client_name || "",
      opposingParty: filing.opposing_party || "",
      description: filing.description || "",
      courtLocation: filing.court_name || "",
      filingNotes: filing.filing_notes || "",
    });

    setActiveTab("new");
  };

  const handleDeleteFiling = async (id: string) => {
    try {
      const { error } = await supabase
        .from('court_filings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Filing Deleted",
        description: "The filing has been deleted successfully.",
      });

      // Update the filing lists
      setUserFilings(userFilings.filter(filing => filing.id !== id));
      setDraftFilings(draftFilings.filter(filing => filing.id !== id));
      setStoredFilings(storedFilings.filter(filing => filing.id !== id));
    } catch (error) {
      console.error('Error deleting filing:', error);
      toast({
        title: "Error",
        description: "Failed to delete filing. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('court_filings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `The filing status has been updated to ${status}.`,
      });

      // Refresh the filing lists based on the new status
      if (status === 'draft') {
        setActiveTab('drafts');
      } else {
        setActiveTab('stored');
      }
    } catch (error) {
      console.error('Error updating filing status:', error);
      toast({
        title: "Error",
        description: "Failed to update filing status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <LegalToolLayout
      title="Court Filing Assistant"
      description="Manage your court filing process and track deadlines for Indian courts"
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      
      <div className="container mx-auto px-4 py-6">
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-500">Indian Court Filing Assistant</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            This assistant helps you manage court filings with deadline tracking and location details for Indian courts.
            Store important case information and receive alerts for upcoming filing deadlines.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md mx-auto">
            <TabsTrigger value="new">New Filing</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="stored">Stored</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Create New Court Filing</CardTitle>
                <CardDescription>
                  Enter the case details, filing information, and set deadlines for your court filing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="caseTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Case Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Sharma vs. Patel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="caseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Case Number (if existing)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., CMA/123/2025" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="courtType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Court Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select court type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {indianCourtTypes.map((court) => (
                                  <SelectItem key={court} value={court}>
                                    {court}
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
                            <FormLabel>Jurisdiction</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
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
                      
                      <FormField
                        control={form.control}
                        name="filingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filing Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select filing type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {filingTypes.map((type) => (
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
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="courtLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Court Location (Where to File)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  placeholder="Enter specific court location" 
                                  className="pl-10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Specify the exact court/building where filing must be submitted
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="filingDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Filing Date (When to File)</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                    >
                                      <Calendar className="mr-2 h-4 w-4 opacity-70" />
                                      {field.value ? (
                                        format(field.value, "dd MMM yyyy")
                                      ) : (
                                        <span>Select filing date</span>
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
                          name="filingDeadline"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Filing Deadline</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"} ${showDeadlineWarning ? "border-red-400 bg-red-50 dark:bg-red-950/20" : ""}`}
                                    >
                                      <Clock className="mr-2 h-4 w-4 opacity-70" />
                                      {field.value ? (
                                        format(field.value, "dd MMM yyyy")
                                      ) : (
                                        <span>Select deadline</span>
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
                              <FormDescription>
                                Last date by which the filing must be submitted
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full legal name of client" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="opposingParty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opposing Party</FormLabel>
                            <FormControl>
                              <Input placeholder="Full legal name of opposing party" {...field} />
                            </FormControl>
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
                          <FormLabel>Brief Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the filing" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="filingNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Notes & Special Instructions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any special instructions for filing or important notes" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Include any details about where to submit within the court complex, specific counters, or timing restrictions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    
                <PdfUploader 
                  onUpload={handleDocumentsUpload}
                  onRemove={removeDocument}
                  documents={documents}
                />
                
                {extractedText && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Extracted Content</h4>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md text-sm max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">{extractedText}</pre>
                    </div>
                  </div>
                )}
                
                    <div className="flex justify-end space-x-3 pt-4 border-t border-legal-border dark:border-legal-slate/20">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Cancel
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="secondary">
                            Save As <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={async () => {
                            const values = form.getValues();
                            if (!values.caseTitle) {
                              toast({
                                title: "Missing Information",
                                description: "Please enter at least a case title before saving",
                                variant: "destructive"
                              });
                              return;
                            }
                            
                            try {
                              const draftData = {
                                case_title: values.caseTitle,
                                case_number: values.caseNumber || null,
                                court_type: values.courtType || null,
                                jurisdiction: values.jurisdiction || null,
                                filing_type: values.filingType || null,
                                filing_date: new Date().toISOString(),
                                status: "draft"
                              };
                              
                              const { error } = await supabase
                                .from('court_filings')
                                .insert(draftData);
                                
                              if (error) throw error;
                              
                              toast({
                                title: "Saved as Draft",
                                description: "Your filing has been saved as a draft."
                              });
                              
                              setActiveTab("drafts");
                            } catch (error) {
                              console.error('Error saving draft:', error);
                              toast({
                                title: "Error",
                                description: "Failed to save draft. Please try again.",
                                variant: "destructive"
                              });
                            }
                          }}>
                            Save as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async () => {
                            const values = form.getValues();
                            if (!values.caseTitle) {
                              toast({
                                title: "Missing Information",
                                description: "Please enter at least a case title before saving",
                                variant: "destructive"
                              });
                              return;
                            }
                            
                            try {
                              const templateData = {
                                case_title: values.caseTitle,
                                case_number: values.caseNumber || null,
                                court_type: values.courtType || null,
                                jurisdiction: values.jurisdiction || null,
                                filing_type: values.filingType || null,
                                filing_date: new Date().toISOString(),
                                status: "template"
                              };
                              
                              const { error } = await supabase
                                .from('court_filings')
                                .insert(templateData);
                                
                              if (error) throw error;
                              
                              toast({
                                title: "Template Created",
                                description: "Your filing has been saved as a template."
                              });
                            } catch (error) {
                              console.error('Error saving template:', error);
                              toast({
                                title: "Error",
                                description: "Failed to save template. Please try again.",
                                variant: "destructive"
                              });
                            }
                          }}>
                            Save as Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Storing..." : "Store Filing"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drafts">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Draft Filings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Title</TableHead>
                        <TableHead>Court & Jurisdiction</TableHead>
                        <TableHead>Filing Type</TableHead>
                        <TableHead>Filing Date</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {draftFilings.length > 0 ? draftFilings.map((filing) => (
                        <TableRow key={filing.id}>
                          <TableCell className="font-medium">{filing.case_title}</TableCell>
                          <TableCell>{filing.court_type || 'N/A'} - {filing.jurisdiction || 'N/A'}</TableCell>
                          <TableCell>{filing.filing_type || 'N/A'}</TableCell>
                          <TableCell>
                            {filing.filing_date ? format(new Date(filing.filing_date), "dd MMM yyyy") : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {filing.filing_deadline && (
                              <span className={checkDeadlineProximity(
                                new Date(filing.filing_date), 
                                new Date(filing.filing_deadline)
                              ) ? "text-red-600 font-medium" : ""}>
                                {format(new Date(filing.filing_deadline), "dd MMM yyyy")}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-xs truncate max-w-[120px]">
                                {filing.court_name || 'Not specified'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditFiling(filing)}>Edit</Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(filing.id, "submitted")}
                              >
                                Submit
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteFiling(filing.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                            No draft filings available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stored">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Stored Filings</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case Title</TableHead>
                        <TableHead>Court & Jurisdiction</TableHead>
                        <TableHead>Filing Type</TableHead>
                        <TableHead>Filing Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storedFilings.length > 0 ? storedFilings.map((filing) => (
                        <TableRow key={filing.id}>
                          <TableCell className="font-medium">{filing.case_title}</TableCell>
                          <TableCell>{filing.court_type || 'N/A'} - {filing.jurisdiction || 'N/A'}</TableCell>
                          <TableCell>{filing.filing_type || 'N/A'}</TableCell>
                          <TableCell>
                            {filing.filing_date ? format(new Date(filing.filing_date), "dd MMM yyyy") : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" /> 
                              <span className="text-xs truncate max-w-[120px]">
                                {filing.court_name || 'Not specified'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={filing.status === "submitted" ? "default" : "secondary"}
                            >
                              {filing.status === "submitted" ? "Stored" : filing.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditFiling(filing)}>
                                View/Edit
                              </Button>
                              <Button size="sm" variant="outline">Print</Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteFiling(filing.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                            No stored filings available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default CourtFilingPage;
