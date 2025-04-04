
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { 
  FileText, Upload, Check, AlertCircle, Search, 
  Calendar, Download, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CourtFilingPage = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [courtJurisdiction, setCourtJurisdiction] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('new-filing');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
    }
  };

  const handleUpload = () => {
    if (!courtJurisdiction || !caseType || !documentType || !fileName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields and select a file.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          toast({
            title: "Upload complete",
            description: "Your document has been uploaded and is being processed for filing.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const courtJurisdictions = [
    { value: 'supreme-court', label: 'Supreme Court of India' },
    { value: 'delhi-hc', label: 'Delhi High Court' },
    { value: 'bombay-hc', label: 'Bombay High Court' },
    { value: 'calcutta-hc', label: 'Calcutta High Court' },
    { value: 'madras-hc', label: 'Madras High Court' },
    { value: 'karnataka-hc', label: 'Karnataka High Court' },
    { value: 'allahabad-hc', label: 'Allahabad High Court' },
    { value: 'district-delhi', label: 'District Court, Delhi' },
    { value: 'district-mumbai', label: 'District Court, Mumbai' },
    { value: 'district-bangalore', label: 'District Court, Bangalore' },
  ];

  const caseTypes = [
    { value: 'civil', label: 'Civil Case' },
    { value: 'criminal', label: 'Criminal Case' },
    { value: 'family', label: 'Family Law Case' },
    { value: 'corporate', label: 'Corporate Law Case' },
    { value: 'tax', label: 'Tax Matter' },
    { value: 'consumer', label: 'Consumer Dispute' },
    { value: 'property', label: 'Property Case' },
    { value: 'arbitration', label: 'Arbitration Matter' },
    { value: 'pil', label: 'Public Interest Litigation' },
  ];

  const documentTypes = [
    { value: 'plaint', label: 'Plaint' },
    { value: 'written-statement', label: 'Written Statement' },
    { value: 'application', label: 'Application' },
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'rejoinder', label: 'Rejoinder' },
    { value: 'vakalatnama', label: 'Vakalatnama' },
    { value: 'evidence', label: 'Evidence' },
    { value: 'petition', label: 'Petition' },
    { value: 'reply', label: 'Reply' },
    { value: 'misc', label: 'Miscellaneous Document' },
  ];

  // Sample data for previous filings
  const previousFilings = [
    {
      id: 'F12345',
      court: 'Delhi High Court',
      caseNumber: 'CS/123/2024',
      documentType: 'Plaint',
      dateSubmitted: '2024-03-12',
      status: 'Accepted',
    },
    {
      id: 'F12346',
      court: 'District Court, Delhi',
      caseNumber: 'CC/456/2024',
      documentType: 'Evidence',
      dateSubmitted: '2024-03-10',
      status: 'Pending Verification',
    },
    {
      id: 'F12347',
      court: 'Supreme Court of India',
      caseNumber: 'SLP/789/2024',
      documentType: 'Affidavit',
      dateSubmitted: '2024-03-05',
      status: 'Rejected',
      rejectionReason: 'Incorrect format'
    },
  ];

  return (
    <LegalToolLayout
      title="Court Filing Automation" 
      description="Automate court document preparation and filing for Indian courts"
      icon={<FileText className="h-6 w-6 text-green-600" />}
    >
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="new-filing">
              <Upload className="h-4 w-4 mr-2" />
              New Filing
            </TabsTrigger>
            <TabsTrigger value="filing-status">
              <Search className="h-4 w-4 mr-2" />
              Filing Status
            </TabsTrigger>
            <TabsTrigger value="filing-history">
              <Calendar className="h-4 w-4 mr-2" />
              Filing History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-filing">
            <Card>
              <CardHeader>
                <CardTitle>New Court Filing</CardTitle>
                <CardDescription>
                  Prepare and submit documents to Indian courts electronically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="jurisdiction">Court Jurisdiction <span className="text-red-500">*</span></Label>
                      <Select value={courtJurisdiction} onValueChange={setCourtJurisdiction}>
                        <SelectTrigger id="jurisdiction">
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="case-type">Case Type <span className="text-red-500">*</span></Label>
                      <Select value={caseType} onValueChange={setCaseType}>
                        <SelectTrigger id="case-type">
                          <SelectValue placeholder="Select Case Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {caseTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="case-number">Case Number (if existing)</Label>
                      <Input
                        id="case-number"
                        placeholder="e.g. CS/123/2024"
                        value={caseNumber}
                        onChange={(e) => setCaseNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type <span className="text-red-500">*</span></Label>
                      <Select value={documentType} onValueChange={setDocumentType}>
                        <SelectTrigger id="document-type">
                          <SelectValue placeholder="Select Document Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map(doc => (
                            <SelectItem key={doc.value} value={doc.value}>
                              {doc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description/Notes</Label>
                      <Textarea
                        id="description"
                        placeholder="Additional information about this filing"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Document <span className="text-red-500">*</span></Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                        <Input
                          type="file"
                          id="document-file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                        />
                        <label 
                          htmlFor="document-file"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium">
                            {fileName ? fileName : "Click to upload document"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {fileSize ? fileSize : "PDF, DOC or DOCX up to 10MB"}
                          </p>
                        </label>
                      </div>
                    </div>
                    
                    {uploading && (
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Uploading...</span>
                          <span className="text-sm">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    {uploadComplete && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-start mt-4">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-300">Document uploaded successfully</p>
                          <p className="text-sm text-green-600 dark:text-green-400">Your document is ready for filing</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save Draft</Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Uploading...
                    </>
                  ) : uploadComplete ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit Filing
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload & File
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="filing-status">
            <Card>
              <CardHeader>
                <CardTitle>Check Filing Status</CardTitle>
                <CardDescription>
                  Track the status of your court filings in Indian courts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <Label htmlFor="filing-id">Filing ID</Label>
                      <Input
                        id="filing-id"
                        placeholder="Enter filing ID"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="case-search">Case Number</Label>
                      <Input
                        id="case-search"
                        placeholder="Enter case number"
                      />
                    </div>
                    <div className="mt-7">
                      <Button>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Search className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Enter a filing ID or case number to check status</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="filing-history">
            <Card>
              <CardHeader>
                <CardTitle>Filing History</CardTitle>
                <CardDescription>
                  View and manage all your previous court filings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previousFilings.map((filing) => (
                    <div 
                      key={filing.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                            <File className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-medium">{filing.id}</h3>
                              <Badge 
                                variant={
                                  filing.status === 'Accepted' ? 'success' : 
                                  filing.status === 'Rejected' ? 'destructive' : 
                                  'secondary'
                                }
                              >
                                {filing.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {filing.court} • {filing.caseNumber}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {filing.documentType} • Filed on {filing.dateSubmitted}
                            </p>
                            {filing.rejectionReason && (
                              <div className="flex items-start mt-2 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                                <span>{filing.rejectionReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 sm:self-start">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Search className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Filing Details - {filing.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Court</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{filing.court}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Case Number</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{filing.caseNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Document Type</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{filing.documentType}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Date Filed</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{filing.dateSubmitted}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Status</p>
                                    <Badge 
                                      variant={
                                        filing.status === 'Accepted' ? 'success' : 
                                        filing.status === 'Rejected' ? 'destructive' : 
                                        'secondary'
                                      }
                                    >
                                      {filing.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default CourtFilingPage;
