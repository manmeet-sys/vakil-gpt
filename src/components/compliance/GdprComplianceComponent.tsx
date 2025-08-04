import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Upload, Check, AlertTriangle, FileText, Download, Pen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '@/components/OpenAIIntegration';

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation: string;
  remediation: string;
  expanded?: boolean;
}

const GdprComplianceComponent = () => {
  const [activeTab, setActiveTab] = useState('document-scanner');
  const [documentType, setDocumentType] = useState('privacy-policy');
  const [document, setDocument] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('text');
  const [applicableRegulations, setApplicableRegulations] = useState(['pdpb']);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scanResults, setScanResults] = useState<{
    score: number;
    issues: ComplianceIssue[];
    compliantSections: string[];
  } | null>(null);
  const [businessType, setBusinessType] = useState('');
  const [dataProcessingPurposes, setDataProcessingPurposes] = useState<string[]>([]);
  const [jurisdictions, setJurisdictions] = useState<string[]>(['india']);

  const { toast: showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleRegulationChange = (regulation: string) => {
    setApplicableRegulations(prev => 
      prev.includes(regulation) 
        ? prev.filter(r => r !== regulation) 
        : [...prev, regulation]
    );
  };

  const handleDataPurposeChange = (purpose: string) => {
    setDataProcessingPurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose) 
        : [...prev, purpose]
    );
  };

  const handleJurisdictionChange = (jurisdiction: string) => {
    setJurisdictions(prev => 
      prev.includes(jurisdiction) 
        ? prev.filter(j => j !== jurisdiction) 
        : [...prev, jurisdiction]
    );
  };

  const scanDocument = async () => {
    if ((uploadMode === 'file' && !documentFile) || (uploadMode === 'text' && !document)) {
      showToast({
        title: "Document Required",
        description: "Please upload a file or enter document text",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      const prompt = `Analyze the following document for GDPR and DPDP compliance. Document content: ${document}. 
      Applicable regulations: ${applicableRegulations.join(', ')}. 
      Provide a compliance score (0-100), identify specific issues with severity levels, and list compliant sections.`;
      
      const aiResponse = await getOpenAIResponse(prompt);
      
      // Mock parsing - in real implementation, parse AI response
      const mockResults = {
        score: 68,
        issues: [
          {
            id: 'dpdp-1',
            title: 'Inadequate Consent Framework',
            description: 'The document does not clearly specify how user consent is obtained and recorded.',
            severity: 'high' as const,
            regulation: 'DPDP Act 2023, Section 7',
            remediation: 'Implement a clear consent mechanism.',
            expanded: false
          }
        ],
        compliantSections: ['Basic Definitions', 'Company Contact Information']
      };
      
      setScanResults(mockResults);
      showToast({
        title: "Analysis Complete",
        description: "Document has been analyzed for compliance",
      });
    } catch (error) {
      showToast({
        title: "Analysis Failed",
        description: "There was an error analyzing the document",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const generateCompliantDocument = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `Generate a compliant ${documentType} for a ${businessType} business operating in ${jurisdictions.join(', ')}. 
      Include GDPR and DPDP compliance requirements. Data processing purposes: ${dataProcessingPurposes.join(', ')}.`;
      
      const aiResponse = await getOpenAIResponse(prompt);
      setDocument(aiResponse);
      setActiveTab('document-scanner');
      
      showToast({
        title: "Document Generated",
        description: `A compliant ${documentType.replace(/-/g, ' ')} has been generated`,
      });
    } catch (error) {
      showToast({
        title: "Generation Failed",
        description: "There was an error generating the document",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">GDPR & DPDP Compliance Checker</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analyze and generate compliant privacy policies, terms of service, and other legal documents for GDPR and India's DPDP Act compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="document-scanner">Document Scanner</TabsTrigger>
          <TabsTrigger value="document-generator">Document Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="document-scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Compliance Scanner</CardTitle>
              <CardDescription>
                Upload or paste your privacy policy, terms of service, or other compliance documents for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Input Method</Label>
                  <RadioGroup
                    value={uploadMode}
                    onValueChange={(value) => setUploadMode(value as 'file' | 'text')}
                    className="flex flex-row space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text">Text Input</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="file" />
                      <Label htmlFor="file">File Upload</Label>
                    </div>
                  </RadioGroup>
                </div>

                {uploadMode === 'text' ? (
                  <div>
                    <Label htmlFor="document-text">Document Text</Label>
                    <Textarea
                      id="document-text"
                      placeholder="Paste your document content here..."
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="document-file">Upload Document</Label>
                    <Input
                      id="document-file"
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                )}

                <div>
                  <Label>Applicable Regulations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['pdpb', 'gdpr', 'ccpa'].map((regulation) => (
                      <Button
                        key={regulation}
                        variant={applicableRegulations.includes(regulation) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRegulationChange(regulation)}
                      >
                        {regulation.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={scanDocument} disabled={isScanning} className="w-full">
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Analyze Document
                    </>
                  )}
                </Button>
              </div>

              {scanResults && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Compliance Score</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={scanResults.score} className="w-32" />
                      <span className="text-sm font-medium">{scanResults.score}%</span>
                    </div>
                  </div>

                  {scanResults.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Issues Found</h4>
                      <div className="space-y-2">
                        {scanResults.issues.map((issue) => (
                          <Alert key={issue.id}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="flex items-center gap-2">
                              {issue.title}
                              <Badge className={getSeverityColor(issue.severity)}>
                                {issue.severity}
                              </Badge>
                            </AlertTitle>
                            <AlertDescription>
                              {issue.description}
                              <div className="mt-2 text-xs text-muted-foreground">
                                <strong>Regulation:</strong> {issue.regulation}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                <strong>Remediation:</strong> {issue.remediation}
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}

                  {scanResults.compliantSections.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Compliant Sections</h4>
                      <div className="flex flex-wrap gap-2">
                        {scanResults.compliantSections.map((section, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="document-generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Compliant Documents</CardTitle>
              <CardDescription>
                Create GDPR and DPDP compliant legal documents tailored to your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy-policy">Privacy Policy</SelectItem>
                      <SelectItem value="terms-of-service">Terms of Service</SelectItem>
                      <SelectItem value="cookie-policy">Cookie Policy</SelectItem>
                      <SelectItem value="data-processing-agreement">Data Processing Agreement</SelectItem>
                      <SelectItem value="consent-form">Consent Form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="business-type">Business Type</Label>
                  <Input
                    id="business-type"
                    placeholder="e.g., SaaS, E-commerce, Healthcare"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Jurisdictions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['india', 'eu', 'us', 'uk'].map((jurisdiction) => (
                    <Button
                      key={jurisdiction}
                      variant={jurisdictions.includes(jurisdiction) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleJurisdictionChange(jurisdiction)}
                    >
                      {jurisdiction.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Data Processing Purposes</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['service-provision', 'marketing', 'analytics', 'improvement', 'legal'].map((purpose) => (
                    <Button
                      key={purpose}
                      variant={dataProcessingPurposes.includes(purpose) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDataPurposeChange(purpose)}
                    >
                      {purpose.replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={generateCompliantDocument} disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Pen className="mr-2 h-4 w-4" />
                    Generate Compliant Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GdprComplianceComponent;