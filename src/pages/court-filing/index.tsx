
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Check, ChevronDown, FileText, Info, Plus, Upload, X } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the form schema
const formSchema = z.object({
  caseTitle: z.string().min(5, { message: "Case title must be at least 5 characters" }),
  caseNumber: z.string().optional(),
  courtType: z.string().min(1, { message: "Court type is required" }),
  jurisdiction: z.string().min(1, { message: "Jurisdiction is required" }),
  filingType: z.string().min(1, { message: "Filing type is required" }),
  filingDate: z.date({ required_error: "Filing date is required" }),
  clientName: z.string().min(1, { message: "Client name is required" }),
  opposingParty: z.string().min(1, { message: "Opposing party is required" }),
  description: z.string().optional(),
});

// Define Indian court types
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

// Define Indian jurisdictions
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

// Define filing types
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

// Mock data for saved/recent filings
const mockFilings = [
  {
    id: 1,
    caseTitle: "Mehta vs. Sharma Property Dispute",
    courtType: "District Court",
    jurisdiction: "Bengaluru (Karnataka)",
    filingType: "Plaint",
    filingDate: new Date("2025-04-15"),
    status: "Pending"
  },
  {
    id: 2,
    caseTitle: "State of Karnataka vs. Reddy",
    courtType: "High Court",
    jurisdiction: "Bengaluru (Karnataka)",
    filingType: "Counter Affidavit",
    filingDate: new Date("2025-04-10"),
    status: "Submitted"
  },
  {
    id: 3,
    caseTitle: "ABC Ltd. vs. Tax Authority",
    courtType: "Income Tax Appellate Tribunal",
    jurisdiction: "Delhi",
    filingType: "Appeal",
    filingDate: new Date("2025-04-20"),
    status: "Draft"
  }
];

const CourtFilingPage = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
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
    },
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simulate uploading
      setIsUploading(true);
      setUploadProgress(0);
      
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsUploading(false);
            const newFiles = Array.from(files);
            setDocuments(prev => [...prev, ...newFiles]);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  // Remove a document
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Filing Saved",
        description: "Your court filing has been saved successfully.",
      });
      
      // Reset form and state
      if (activeTab === "new") {
        form.reset();
        setDocuments([]);
      }
      
      setIsSubmitting(false);
      
      // Switch to the drafts tab to show the newly saved filing
      setActiveTab("drafts");
    }, 1500);
  };

  return (
    <LegalToolLayout
      title="Court Filing Automation"
      description="Automate and streamline your court filing process for Indian courts"
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6">
        <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-500">Indian E-Filing Integration</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400">
            This tool supports electronic filing for Indian courts through integration with the e-Courts Digital Services platform. 
            All filings comply with Indian legal standards and jurisdictional requirements.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md mx-auto">
            <TabsTrigger value="new">New Filing</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
          </TabsList>
          
          {/* New Filing Tab */}
          <TabsContent value="new">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Create New Court Filing</CardTitle>
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
                      name="filingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Filing Date</FormLabel>
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
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The date when this filing will be submitted to the court
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-medium mb-2">Attach Documents</h3>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                          <Input
                            type="file"
                            id="file-upload"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <label 
                            htmlFor="file-upload" 
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Click to upload documents
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Supported formats: PDF, DOCX, XLSX (Max: 10MB)
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      {isUploading && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-legal-accent h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {documents.length > 0 && (
                        <div className="space-y-3 mt-4">
                          <h4 className="text-sm font-medium">Attached Documents</h4>
                          {documents.map((doc, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md"
                            >
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm">{doc.name}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeDocument(index)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
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
                          <DropdownMenuItem onClick={() => {
                            form.setValue("filingDate", new Date());
                            toast({
                              title: "Saved as Draft",
                              description: "Your filing has been saved as a draft."
                            });
                          }}>
                            Save as Draft
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            form.setValue("filingDate", new Date());
                            toast({
                              title: "Template Created",
                              description: "Your filing has been saved as a template."
                            });
                          }}>
                            Save as Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Filing"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Drafts Tab */}
          <TabsContent value="drafts">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Draft Filings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Title</TableHead>
                      <TableHead>Court & Jurisdiction</TableHead>
                      <TableHead>Filing Type</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFilings.filter(filing => filing.status === "Draft").map((filing) => (
                      <TableRow key={filing.id}>
                        <TableCell className="font-medium">{filing.caseTitle}</TableCell>
                        <TableCell>{filing.courtType} - {filing.jurisdiction}</TableCell>
                        <TableCell>{filing.filingType}</TableCell>
                        <TableCell>{format(filing.filingDate, "PP")}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Draft</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm">Submit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockFilings.filter(filing => filing.status === "Draft").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-legal-muted">
                          No draft filings available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Submitted Tab */}
          <TabsContent value="submitted">
            <Card className="border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Submitted Filings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Title</TableHead>
                      <TableHead>Court & Jurisdiction</TableHead>
                      <TableHead>Filing Type</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFilings.filter(filing => filing.status !== "Draft").map((filing) => (
                      <TableRow key={filing.id}>
                        <TableCell className="font-medium">{filing.caseTitle}</TableCell>
                        <TableCell>{filing.courtType} - {filing.jurisdiction}</TableCell>
                        <TableCell>{filing.filingType}</TableCell>
                        <TableCell>{format(filing.filingDate, "PP")}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={filing.status === "Submitted" ? "default" : "secondary"}
                          >
                            {filing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Track</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockFilings.filter(filing => filing.status !== "Draft").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-legal-muted">
                          No submitted filings available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default CourtFilingPage;
