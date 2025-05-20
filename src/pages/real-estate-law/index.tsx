import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Building2, FileText, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LegalToolLayout from '@/components/LegalToolLayout';
import BackButton from '@/components/BackButton';

const RealEstateLawPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('property-analysis');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Property Analysis Form State
  const [propertyType, setPropertyType] = useState('residential');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyDetails, setPropertyDetails] = useState('');
  const [propertyState, setPropertyState] = useState('');
  
  // Document Review Form State
  const [documentType, setDocumentType] = useState('sale-deed');
  const [documentText, setDocumentText] = useState('');
  
  // Dispute Analysis Form State
  const [disputeType, setDisputeType] = useState('boundary');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [partiesInvolved, setPartiesInvolved] = useState('');
  
  const indianStates = [
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'west-bengal', label: 'West Bengal' },
  ];
  
  const propertyTypes = [
    { value: 'residential', label: 'Residential Property' },
    { value: 'commercial', label: 'Commercial Property' },
    { value: 'agricultural', label: 'Agricultural Land' },
    { value: 'industrial', label: 'Industrial Property' },
    { value: 'mixed-use', label: 'Mixed-Use Property' },
  ];
  
  const documentTypes = [
    { value: 'sale-deed', label: 'Sale Deed' },
    { value: 'lease-agreement', label: 'Lease Agreement' },
    { value: 'gift-deed', label: 'Gift Deed' },
    { value: 'mortgage-deed', label: 'Mortgage Deed' },
    { value: 'power-of-attorney', label: 'Power of Attorney' },
    { value: 'agreement-to-sell', label: 'Agreement to Sell' },
    { value: 'conveyance-deed', label: 'Conveyance Deed' },
  ];
  
  const disputeTypes = [
    { value: 'boundary', label: 'Boundary Dispute' },
    { value: 'title', label: 'Title Dispute' },
    { value: 'possession', label: 'Possession Dispute' },
    { value: 'tenant', label: 'Tenant Dispute' },
    { value: 'construction', label: 'Construction Dispute' },
    { value: 'inheritance', label: 'Inheritance Dispute' },
  ];
  
  const analyzeProperty = async () => {
    if (!propertyAddress || !propertyDetails || !propertyState) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const selectedState = indianStates.find(s => s.value === propertyState)?.label || propertyState;
      const selectedType = propertyTypes.find(t => t.value === propertyType)?.label || propertyType;
      
      const prompt = `
        As a real estate legal expert in India, analyze this property based on the following details:
        
        Property Type: ${selectedType}
        Location: ${propertyAddress}
        State: ${selectedState}
        Details: ${propertyDetails}
        
        Please provide a comprehensive analysis including:
        1. Key legal considerations for this type of property in ${selectedState}
        2. Applicable state-specific real estate laws and regulations
        3. Required documentation and registration process
        4. Potential legal risks or issues to be aware of
        5. Tax implications (property tax, stamp duty, etc.)
        6. Recommendations for due diligence
        
        Format your response in a structured manner with clear sections.
      `;
      
      const analysis = await generateOpenAIAnalysis(prompt, "Real Estate Property Analysis");
      
      setAnalysisResult({
        type: 'property',
        content: analysis,
        title: `${selectedType} Analysis - ${selectedState}`,
        date: new Date().toISOString()
      });
      
      toast({
        title: "Analysis Complete",
        description: "Property analysis has been generated successfully"
      });
    } catch (error) {
      console.error("Error analyzing property:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeDocument = async () => {
    if (!documentText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the document text",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const selectedDocType = documentTypes.find(d => d.value === documentType)?.label || documentType;
      
      const prompt = `
        As a real estate legal expert in India, review this ${selectedDocType} document text:
        
        ${documentText.substring(0, 4000)}${documentText.length > 4000 ? '...' : ''}
        
        Please provide a comprehensive analysis including:
        1. Validity and completeness of the document under Indian law
        2. Key terms and conditions and their legal implications
        3. Any missing clauses or potential issues
        4. Compliance with relevant Indian real estate laws and regulations
        5. Registration requirements and stamp duty considerations
        6. Recommendations for improvement or modification
        
        Format your response in a structured manner with clear sections.
      `;
      
      const analysis = await generateOpenAIAnalysis(prompt, "Real Estate Document Review");
      
      setAnalysisResult({
        type: 'document',
        content: analysis,
        title: `${selectedDocType} Review`,
        date: new Date().toISOString()
      });
      
      toast({
        title: "Review Complete",
        description: "Document review has been generated successfully"
      });
    } catch (error) {
      console.error("Error reviewing document:", error);
      toast({
        title: "Review Failed",
        description: "There was an error generating the review",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeDispute = async () => {
    if (!disputeDetails || !partiesInvolved) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const selectedDisputeType = disputeTypes.find(d => d.value === disputeType)?.label || disputeType;
      
      const prompt = `
        As a real estate legal expert in India, analyze this property dispute:
        
        Dispute Type: ${selectedDisputeType}
        Parties Involved: ${partiesInvolved}
        Details: ${disputeDetails}
        
        Please provide a comprehensive analysis including:
        1. Legal framework applicable to this type of dispute in India
        2. Potential remedies and legal recourse available
        3. Relevant case law and precedents from Indian courts
        4. Estimated timeline and process for resolution
        5. Documentation required to support the case
        6. Recommendations for dispute resolution (litigation, mediation, etc.)
        
        Format your response in a structured manner with clear sections.
      `;
      
      const analysis = await generateOpenAIAnalysis(prompt, "Real Estate Dispute Analysis");
      
      setAnalysisResult({
        type: 'dispute',
        content: analysis,
        title: `${selectedDisputeType} Analysis`,
        date: new Date().toISOString()
      });
      
      toast({
        title: "Analysis Complete",
        description: "Dispute analysis has been generated successfully"
      });
    } catch (error) {
      console.error("Error analyzing dispute:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error generating the analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LegalToolLayout
      title="Real Estate Law Assistant"
      description="Analyze property details, review real estate documents, and get insights on property disputes under Indian law"
      icon={<Building2 className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6">
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">Indian Real Estate Law</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            This tool provides analysis based on Indian real estate laws including the Real Estate (Regulation and Development) Act, 2016 (RERA), 
            Transfer of Property Act, 1882, Registration Act, 1908, and relevant state-specific regulations.
          </AlertDescription>
        </Alert>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="property-analysis">Property Analysis</TabsTrigger>
          <TabsTrigger value="document-review">Document Review</TabsTrigger>
          <TabsTrigger value="dispute-analysis">Dispute Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="property-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Property Legal Analysis
              </CardTitle>
              <CardDescription>
                Analyze property details for legal considerations under Indian law
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="property-state">State/UT</Label>
                  <Select value={propertyState} onValueChange={setPropertyState}>
                    <SelectTrigger id="property-state">
                      <SelectValue placeholder="Select state/UT" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map(state => (
                        <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property-address">Property Address/Location</Label>
                <Input
                  id="property-address"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="Enter property address or location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property-details">Property Details</Label>
                <Textarea
                  id="property-details"
                  value={propertyDetails}
                  onChange={(e) => setPropertyDetails(e.target.value)}
                  placeholder="Describe the property including size, features, age, current status, etc."
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={analyzeProperty} 
                disabled={isLoading || !propertyAddress || !propertyDetails || !propertyState}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Property Analysis'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="document-review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Real Estate Document Review
              </CardTitle>
              <CardDescription>
                Review real estate documents for legal validity and compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="document-type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="document-text">Document Text</Label>
                <Textarea
                  id="document-text"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste the document text here for analysis..."
                  className="min-h-[250px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={analyzeDocument} 
                disabled={isLoading || !documentText.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reviewing...
                  </>
                ) : (
                  'Review Document'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="dispute-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Property Dispute Analysis
              </CardTitle>
              <CardDescription>
                Analyze property disputes and get legal insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dispute-type">Dispute Type</Label>
                <Select value={disputeType} onValueChange={setDisputeType}>
                  <SelectTrigger id="dispute-type">
                    <SelectValue placeholder="Select dispute type" />
                  </SelectTrigger>
                  <SelectContent>
                    {disputeTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parties-involved">Parties Involved</Label>
                <Input
                  id="parties-involved"
                  value={partiesInvolved}
                  onChange={(e) => setPartiesInvolved(e.target.value)}
                  placeholder="Describe the parties involved in the dispute"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dispute-details">Dispute Details</Label>
                <Textarea
                  id="dispute-details"
                  value={disputeDetails}
                  onChange={(e) => setDisputeDetails(e.target.value)}
                  placeholder="Describe the dispute in detail including timeline, facts, and current status..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={analyzeDispute} 
                disabled={isLoading || !disputeDetails || !partiesInvolved}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Generate Dispute Analysis'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {analysisResult && (
        <div className="mt-8 space-y-4">
          <Card className="border-blue-200 dark:border-blue-900/30">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-blue-800 dark:text-blue-300">
                  {analysisResult.title}
                </CardTitle>
                <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700">
                  {new Date(analysisResult.date).toLocaleDateString()}
                </Badge>
              </div>
              <CardDescription>
                {analysisResult.type === 'property' && 'Property legal analysis based on Indian real estate laws'}
                {analysisResult.type === 'document' && 'Document review and legal assessment'}
                {analysisResult.type === 'dispute' && 'Property dispute analysis and recommendations'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: analysisResult.content.replace(/\n/g, '<br/>') }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Analysis based on Indian real estate laws and regulations
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(analysisResult.content);
                  toast({
                    title: "Copied",
                    description: "Analysis copied to clipboard"
                  });
                }}
              >
                Copy Analysis
              </Button>
            </CardFooter>
          </Card>
          
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">Legal Disclaimer</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              This analysis is provided for informational purposes only and does not constitute legal advice. 
              Please consult with a qualified legal professional for specific advice regarding your property matters.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </LegalToolLayout>
  );
};

export default RealEstateLawPage;
