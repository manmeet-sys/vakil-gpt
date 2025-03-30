
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, Upload, Check, AlertTriangle, FileText, ChevronDown, ChevronUp, Search, Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation: string;
  remediation: string;
  expanded?: boolean;
}

const GdprCompliancePage = () => {
  const [activeTab, setActiveTab] = useState('document-scan');
  const [documentType, setDocumentType] = useState('privacy-policy');
  const [document, setDocument] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('text');
  const [country, setCountry] = useState('eu');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<{
    score: number;
    issues: ComplianceIssue[];
    compliantSections: string[];
  } | null>(null);
  
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };
  
  const scanDocument = () => {
    if ((uploadMode === 'file' && !documentFile) || (uploadMode === 'text' && !document)) {
      toast({
        title: "Document Required",
        description: "Please upload a file or enter document text",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // This would be replaced with actual AI analysis using Gemini or DeepSeek
      const mockResults = {
        score: 72,
        issues: [
          {
            id: 'gdpr-1',
            title: 'Insufficient Consent Mechanism',
            description: 'The document does not clearly specify how user consent is obtained and recorded. GDPR requires explicit, informed consent for data collection.',
            severity: 'high' as const,
            regulation: 'GDPR Article 7',
            remediation: 'Add a detailed section on how consent is obtained, stored, and how users can withdraw consent at any time.',
            expanded: false
          },
          {
            id: 'gdpr-2',
            title: 'Inadequate Data Retention Policy',
            description: 'The document does not specify how long personal data will be stored. GDPR requires clear retention periods.',
            severity: 'medium' as const,
            regulation: 'GDPR Article 5(1)(e)',
            remediation: 'Include specific timeframes for data retention and criteria used to determine those periods.',
            expanded: false
          },
          {
            id: 'gdpr-3',
            title: 'Missing Information on International Data Transfers',
            description: 'The document does not adequately address whether and how data may be transferred to countries outside the EU.',
            severity: 'medium' as const,
            regulation: 'GDPR Articles 44-50',
            remediation: 'Specify if data is transferred internationally, to which countries, and what safeguards are in place.',
            expanded: false
          },
          {
            id: 'gdpr-4',
            title: 'Vague Description of Data Processing Purposes',
            description: 'The purposes for processing personal data are not specific enough to meet GDPR requirements.',
            severity: 'low' as const,
            regulation: 'GDPR Article 5(1)(b)',
            remediation: 'Clearly specify each purpose for which personal data is processed in concrete terms.',
            expanded: false
          }
        ],
        compliantSections: [
          'Right to Access',
          'Right to Rectification',
          'Data Security Measures',
          'Contact Information'
        ]
      };
      
      setScanResults(mockResults);
      setIsScanning(false);
      
      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed for GDPR compliance",
      });
    }, 3000);
  };
  
  const toggleIssueExpanded = (issueId: string) => {
    if (scanResults) {
      const updatedIssues = scanResults.issues.map(issue => 
        issue.id === issueId ? { ...issue, expanded: !issue.expanded } : issue
      );
      setScanResults({ ...scanResults, issues: updatedIssues });
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
  
  const generateCompliantDocument = () => {
    toast({
      title: "Generating Compliant Document",
      description: "Creating a GDPR-compliant version of your document...",
    });
    
    setTimeout(() => {
      const updatedDocument = `PRIVACY POLICY

Last Updated: ${new Date().toISOString().split('T')[0]}

1. INTRODUCTION

This Privacy Policy describes how we collect, use, and process your personal information in accordance with the General Data Protection Regulation (GDPR).

2. DATA CONTROLLER

[Your Company Name] is the data controller responsible for your personal data. Contact information: [email@example.com]

3. PERSONAL DATA WE COLLECT

We collect the following categories of personal data:
- Contact information (name, email, phone number)
- Account information (username, password)
- Transaction data
- Usage data
- Device and browser information

4. PURPOSES AND LEGAL BASIS FOR PROCESSING

We process your personal data for the following specific purposes:
- To provide our services (Legal basis: Contract performance)
- To improve our services (Legal basis: Legitimate interest)
- To send marketing communications (Legal basis: Consent)
- To comply with legal obligations (Legal basis: Legal obligation)

5. DATA RETENTION

We will retain your personal data for:
- Account information: For the duration of your account plus 30 days after deletion
- Transaction data: 7 years (as required by tax regulations)
- Marketing preferences: Until you withdraw consent
- Usage data: 24 months

6. YOUR RIGHTS

Under GDPR, you have the following rights:
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restriction of processing
- Right to data portability
- Right to object to processing
- Rights related to automated decision making and profiling

To exercise these rights, contact us at [privacy@example.com]

7. INTERNATIONAL TRANSFERS

We transfer personal data to the following countries outside the EU:
- United States (covered by EU-US Data Privacy Framework)
- Canada (covered by adequacy decision)

We implement appropriate safeguards including Standard Contractual Clauses for other transfers.

8. CONSENT

We obtain explicit consent for:
- Marketing communications
- Cookie usage (except strictly necessary cookies)
- Processing of special categories of data

You can withdraw consent at any time by [instructions for withdrawing consent].

9. DATA SECURITY

We implement appropriate technical and organizational measures to protect your data, including:
- Encryption at rest and in transit
- Regular security assessments
- Staff training
- Access controls

10. DATA BREACH PROCEDURES

In case of a data breach that risks your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and will inform affected individuals without undue delay.

11. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of significant changes by [email/notification in app/website].

12. CONTACT INFORMATION

If you have questions or concerns, contact us at:
[Your DPO contact information]

You have the right to lodge a complaint with a supervisory authority.`;
      
      setDocument(updatedDocument);
      
      toast({
        title: "Document Generated",
        description: "A GDPR-compliant document has been generated. Review and customize as needed.",
      });
    }, 3000);
  };
  
  return (
    <LegalToolLayout
      title="GDPR & Data Privacy Compliance"
      description="Review documents and policies for compliance with GDPR and other privacy regulations, identify potential issues, and generate compliant document templates."
      icon={<Shield className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="document-scan">
              <Search className="h-4 w-4 mr-2" />
              Compliance Scan
            </TabsTrigger>
            <TabsTrigger value="knowledge-base">
              <FileText className="h-4 w-4 mr-2" />
              Compliance Guide
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="document-scan" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Compliance Check</CardTitle>
                <CardDescription>Analyze your document for compliance with privacy regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger id="document-type">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy-policy">Privacy Policy</SelectItem>
                      <SelectItem value="terms-of-service">Terms of Service</SelectItem>
                      <SelectItem value="data-processing-agreement">Data Processing Agreement</SelectItem>
                      <SelectItem value="cookie-policy">Cookie Policy</SelectItem>
                      <SelectItem value="consent-form">Consent Form</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="jurisdiction">
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eu">European Union (GDPR)</SelectItem>
                      <SelectItem value="uk">United Kingdom (UK GDPR)</SelectItem>
                      <SelectItem value="us-ca">California (CCPA/CPRA)</SelectItem>
                      <SelectItem value="us-va">Virginia (VCDPA)</SelectItem>
                      <SelectItem value="us-co">Colorado (CPA)</SelectItem>
                      <SelectItem value="us-ct">Connecticut (CTDPA)</SelectItem>
                      <SelectItem value="us-ut">Utah (UCPA)</SelectItem>
                      <SelectItem value="canada">Canada (PIPEDA)</SelectItem>
                      <SelectItem value="brazil">Brazil (LGPD)</SelectItem>
                      <SelectItem value="australia">Australia (Privacy Act)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Document Source</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      type="button"
                      variant={uploadMode === 'file' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('file')}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === 'text' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('text')}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Paste Text
                    </Button>
                  </div>
                </div>
                
                {uploadMode === 'file' ? (
                  <div>
                    <Label htmlFor="document-upload">Upload Document (PDF, DOCX, TXT)*</Label>
                    <div className="mt-1 flex items-center">
                      <Input 
                        id="document-upload" 
                        type="file" 
                        accept=".pdf,.docx,.doc,.txt" 
                        onChange={handleFileChange}
                      />
                    </div>
                    {documentFile && (
                      <p className="text-sm text-legal-muted mt-2">
                        Selected: {documentFile.name} ({Math.round(documentFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="document-text">Document Text*</Label>
                    <Textarea
                      id="document-text"
                      placeholder="Enter the document text here..."
                      className="min-h-64"
                      value={document}
                      onChange={(e) => setDocument(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                <Button 
                  onClick={scanDocument}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>Analyzing Document...</>
                  ) : (
                    <>
                      Analyze for Compliance
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {scanResults && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Compliance Score</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${
                          scanResults.score >= 80 ? 'text-green-600 dark:text-green-400' : 
                          scanResults.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {scanResults.score}/100
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-legal-muted">Compliance Level</span>
                          <span className="text-sm font-medium text-legal-muted">{scanResults.score}%</span>
                        </div>
                        <Progress value={scanResults.score} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                            Compliance Issues ({scanResults.issues.length})
                          </h3>
                          <div className="text-sm text-legal-muted">
                            {scanResults.issues.length === 0 ? (
                              <p>No compliance issues detected!</p>
                            ) : (
                              <p>The document has {scanResults.issues.length} compliance issues that need attention.</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <Check className="h-4 w-4 mr-1 text-green-500" />
                            Compliant Sections ({scanResults.compliantSections.length})
                          </h3>
                          <div className="text-sm text-legal-muted">
                            <p>The document has {scanResults.compliantSections.length} sections that meet compliance standards.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Issues</CardTitle>
                    <CardDescription>
                      {scanResults.issues.length === 0
                        ? "No compliance issues detected in your document."
                        : `The following ${scanResults.issues.length} issues require attention:`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scanResults.issues.map((issue) => (
                        <div 
                          key={issue.id} 
                          className="border border-legal-border dark:border-legal-slate/20 rounded-md overflow-hidden"
                        >
                          <div 
                            className="p-4 flex items-start justify-between cursor-pointer"
                            onClick={() => toggleIssueExpanded(issue.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-1 rounded-full ${
                                issue.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20' : 
                                issue.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' : 
                                'bg-blue-100 dark:bg-blue-900/20'
                              }`}>
                                <AlertTriangle className={`h-4 w-4 ${
                                  issue.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                                  issue.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' : 
                                  'text-blue-600 dark:text-blue-400'
                                }`} />
                              </div>
                              <div>
                                <h4 className="font-medium flex items-center">
                                  {issue.title}
                                  <Badge className={`ml-2 ${getSeverityColor(issue.severity)}`}>
                                    {issue.severity.toUpperCase()}
                                  </Badge>
                                </h4>
                                <p className="text-sm text-legal-muted mt-1">{issue.regulation}</p>
                              </div>
                            </div>
                            
                            <div>
                              {issue.expanded ? (
                                <ChevronUp className="h-5 w-5 text-legal-muted" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-legal-muted" />
                              )}
                            </div>
                          </div>
                          
                          {issue.expanded && (
                            <div className="px-4 pb-4 pt-0 border-t border-legal-border dark:border-legal-slate/20">
                              <div className="mt-2 space-y-3">
                                <div>
                                  <h5 className="text-sm font-medium">Description:</h5>
                                  <p className="text-sm text-legal-muted">{issue.description}</p>
                                </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium">Remediation:</h5>
                                  <p className="text-sm text-legal-muted">{issue.remediation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Compliant Sections</CardTitle>
                    <CardDescription>
                      These sections meet compliance requirements:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {scanResults.compliantSections.map((section, index) => (
                        <div 
                          key={index} 
                          className="flex items-center p-2 rounded-md bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300"
                        >
                          <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                    <Button 
                      onClick={generateCompliantDocument}
                    >
                      Generate Compliant Document
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="knowledge-base" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Privacy Compliance Guide</CardTitle>
                <CardDescription>Essential information about GDPR and other privacy regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">General Data Protection Regulation (GDPR)</h3>
                    <p className="text-legal-muted mt-1">
                      The GDPR is a comprehensive data protection law that applies to all organizations processing the personal data of EU residents, regardless of where the organization is located.
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Key Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-legal-muted">
                          <li>Legal basis for processing (consent, contract, legitimate interest, etc.)</li>
                          <li>Enhanced consent requirements (explicit, specific, informed)</li>
                          <li>Data subject rights (access, erasure, portability, etc.)</li>
                          <li>Data breach notification (72 hours)</li>
                          <li>Privacy by design and by default</li>
                          <li>Data Protection Impact Assessments (DPIAs)</li>
                          <li>Appointment of Data Protection Officers (DPOs) in some cases</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Fines and Penalties</h4>
                        <p className="text-legal-muted mt-1">
                          GDPR violations can result in fines up to €20 million or 4% of global annual revenue, whichever is higher.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">California Consumer Privacy Act (CCPA) & California Privacy Rights Act (CPRA)</h3>
                    <p className="text-legal-muted mt-1">
                      The CCPA/CPRA grants California residents specific rights regarding their personal information and imposes obligations on businesses that collect it.
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Key Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-legal-muted">
                          <li>Right to know what personal information is collected</li>
                          <li>Right to delete personal information</li>
                          <li>Right to opt-out of the sale of personal information</li>
                          <li>Right to non-discrimination for exercising rights</li>
                          <li>Special protections for minors under 16</li>
                          <li>Annual privacy policy updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Essential Documents for Compliance</h3>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Privacy Policy</h4>
                        <p className="text-legal-muted mt-1">
                          A comprehensive document explaining what personal data you collect, how you use it, and the rights of your users.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Cookie Policy</h4>
                        <p className="text-legal-muted mt-1">
                          Details about what cookies you use, their purpose, and how users can control them.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Data Processing Agreement (DPA)</h4>
                        <p className="text-legal-muted mt-1">
                          Required when sharing personal data with third-party processors.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Consent Forms</h4>
                        <p className="text-legal-muted mt-1">
                          Used to obtain explicit consent for specific processing activities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                <Button onClick={() => {
                  toast({
                    title: "Guide Downloaded",
                    description: "The comprehensive GDPR compliance guide has been downloaded",
                  });
                }}>
                  Download Full Compliance Guide
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default GdprCompliancePage;
