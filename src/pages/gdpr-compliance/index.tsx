
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, Upload, Check, AlertTriangle, FileText, ChevronDown, ChevronUp, Search, Send, Info } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation: string;
  remediation: string;
  expanded?: boolean;
}

const GDPRCompliancePage = () => {
  const [activeTab, setActiveTab] = useState('document-scan');
  const [documentType, setDocumentType] = useState('privacy-policy');
  const [document, setDocument] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('text');
  const [applicableRegulations, setApplicableRegulations] = useState(['pdpb']);
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

  const handleRegulationChange = (regulation: string) => {
    setApplicableRegulations(prev => 
      prev.includes(regulation) 
        ? prev.filter(r => r !== regulation) 
        : [...prev, regulation]
    );
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
        score: 68,
        issues: [
          {
            id: 'dpdp-1',
            title: 'Inadequate Consent Framework',
            description: 'The document does not clearly specify how user consent is obtained and recorded. India\'s DPDP Act requires explicit, specific, and informed consent for data processing.',
            severity: 'high' as const,
            regulation: 'DPDP Act 2023, Section 7',
            remediation: 'Implement a clear consent mechanism that explicitly states the purpose of data collection, with options for users to provide or withdraw consent.',
            expanded: false
          },
          {
            id: 'dpdp-2',
            title: 'Missing Data Principal Rights',
            description: 'The document does not fully address the rights of data principals (individuals) as required under India\'s data protection laws.',
            severity: 'high' as const,
            regulation: 'DPDP Act 2023, Chapter III',
            remediation: 'Add a comprehensive section on data principal rights including right to access, correction, erasure, and grievance redressal.',
            expanded: false
          },
          {
            id: 'dpdp-3',
            title: 'Inadequate Data Breach Notification Procedure',
            description: 'The document lacks clear procedures for data breach notifications to affected individuals and the Data Protection Board of India.',
            severity: 'medium' as const,
            regulation: 'DPDP Act 2023, Section 9',
            remediation: 'Include a detailed data breach notification protocol with timeframes and procedures.',
            expanded: false
          },
          {
            id: 'dpdp-4',
            title: 'Incomplete Children\'s Data Protection Measures',
            description: 'Special protection measures for processing children\'s data are not adequately addressed.',
            severity: 'medium' as const,
            regulation: 'DPDP Act 2023, Section 10',
            remediation: 'Add specific safeguards for processing children\'s data including age verification and parental consent mechanisms.',
            expanded: false
          },
          {
            id: 'dpdp-5',
            title: 'Vague Cross-Border Data Transfer Mechanism',
            description: 'The document does not clearly specify the mechanisms for transferring data outside India.',
            severity: 'low' as const,
            regulation: 'DPDP Act 2023, Section 17',
            remediation: 'Detail the specific countries where data may be transferred and the legal basis for such transfers.',
            expanded: false
          }
        ],
        compliantSections: [
          'Basic Definitions',
          'Company Contact Information',
          'Security Measures',
          'Cookies Policy'
        ]
      };
      
      setScanResults(mockResults);
      setIsScanning(false);
      
      toast({
        title: "Analysis Complete",
        description: `Document has been analyzed for compliance with ${applicableRegulations.includes('pdpb') ? 'DPDP' : ''} ${applicableRegulations.includes('gdpr') ? 'GDPR' : ''} ${applicableRegulations.includes('other') ? 'other regulations' : ''}`,
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
      description: "Creating a DPDP-compliant version of your document...",
    });
    
    setTimeout(() => {
      const updatedDocument = `PRIVACY POLICY

Last Updated: ${new Date().toISOString().split('T')[0]}

1. INTRODUCTION

This Privacy Policy describes how we collect, use, and process your personal information in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India.

2. DATA FIDUCIARY INFORMATION

[Your Company Name] is the data fiduciary responsible for your personal data. Contact information: [email@example.com]

3. PERSONAL DATA WE PROCESS

We collect and process the following categories of personal data:
- Contact information (name, email, phone number)
- Account information (username, password)
- Transaction data
- Usage data
- Device and browser information

4. PURPOSES AND LEGAL BASIS FOR PROCESSING

We process your personal data for the following specific purposes:
- To provide our services (Legal basis: Consent and Contract)
- To improve our services (Legal basis: Legitimate interest)
- To send marketing communications (Legal basis: Consent)
- To comply with legal obligations (Legal basis: Legal obligation)

5. DATA RETENTION

We will retain your personal data for:
- Account information: For the duration of your account plus 30 days after deletion
- Transaction data: 8 years (as required by Indian tax regulations)
- Marketing preferences: Until you withdraw consent
- Usage data: 24 months

6. YOUR RIGHTS AS A DATA PRINCIPAL

Under the DPDP Act 2023, you have the following rights:
- Right to access information about your personal data
- Right to correction and erasure of your personal data
- Right to grievance redressal
- Right to nominate another person in case of death or incapacity

To exercise these rights, contact us at [privacy@example.com]

7. CROSS-BORDER DATA TRANSFERS

We may transfer personal data to countries outside India that provide an adequate level of protection, in compliance with the conditions prescribed under the DPDP Act.

8. CONSENT

We obtain explicit consent for:
- Processing your personal data for specified purposes
- Marketing communications
- Processing of sensitive personal data

You can withdraw consent at any time by [instructions for withdrawing consent].

9. DATA SECURITY

We implement appropriate technical and organizational measures to protect your data, including:
- Encryption at rest and in transit
- Regular security assessments
- Staff training
- Access controls

10. DATA BREACH NOTIFICATION

In case of a personal data breach that may result in significant harm to you, we will notify the Data Protection Board of India and affected individuals without undue delay.

11. SPECIAL PROVISIONS FOR CHILDREN'S DATA

We implement age verification mechanisms and require verifiable parental consent before processing personal data of children (individuals under 18 years of age).

12. GRIEVANCE REDRESSAL

If you have any concerns or complaints regarding the processing of your personal data, you may contact our Data Protection Officer at [dpo@example.com].

You also have the right to file a complaint with the Data Protection Board of India.

13. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of significant changes by [email/notification in app/website].`;
      
      setDocument(updatedDocument);
      
      toast({
        title: "Document Generated",
        description: "A DPDP-compliant document has been generated. Review and customize as needed.",
      });
    }, 3000);
  };
  
  return (
    <LegalToolLayout
      title="Data Privacy Compliance - DPDP & GDPR"
      description="Review documents and policies for compliance with India's Digital Personal Data Protection Act (DPDP) and other global privacy regulations."
      icon={<Shield className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto">
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>India's Data Protection Framework</AlertTitle>
          <AlertDescription className="text-sm">
            The Digital Personal Data Protection Act, 2023 (DPDP Act) is India's comprehensive data protection law that applies to the processing of digital personal data. Use this tool to ensure your privacy policies and data practices comply with the DPDP Act and other global regulations like GDPR where needed.
          </AlertDescription>
        </Alert>
        
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
                <CardDescription>Analyze your document for compliance with Indian and global privacy regulations</CardDescription>
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
                      <SelectItem value="data-sharing-agreement">Data Sharing Agreement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-2">Applicable Regulations</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={applicableRegulations.includes('pdpb') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRegulationChange('pdpb')}
                      className="rounded-full"
                    >
                      India DPDP Act 2023
                    </Button>
                    <Button
                      type="button"
                      variant={applicableRegulations.includes('gdpr') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRegulationChange('gdpr')}
                      className="rounded-full"
                    >
                      EU GDPR
                    </Button>
                    <Button
                      type="button"
                      variant={applicableRegulations.includes('it-rules') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRegulationChange('it-rules')}
                      className="rounded-full"
                    >
                      IT Rules 2021
                    </Button>
                    <Button
                      type="button"
                      variant={applicableRegulations.includes('other') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleRegulationChange('other')}
                      className="rounded-full"
                    >
                      Other Regulations
                    </Button>
                  </div>
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
                                <h4 className="font-medium flex items-center flex-wrap gap-2">
                                  {issue.title}
                                  <Badge className={`${getSeverityColor(issue.severity)}`}>
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
                      Generate DPDP-Compliant Document
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="knowledge-base" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>India's Data Protection Framework</CardTitle>
                <CardDescription>Essential information about the Digital Personal Data Protection Act, 2023 and other Indian privacy regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Digital Personal Data Protection Act, 2023 (DPDP Act)</h3>
                    <p className="text-legal-muted mt-1">
                      The DPDP Act is India's comprehensive legislation for the protection of digital personal data. It establishes a framework for processing digital personal data based on the principle that individuals should have control over their data.
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Key Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-legal-muted">
                          <li>Lawful processing based on consent and legitimate uses</li>
                          <li>Explicit consent requirements (clear, specific, informed)</li>
                          <li>Data Principal rights (access, correction, erasure)</li>
                          <li>Data breach notification to the Data Protection Board</li>
                          <li>Special protections for children's data</li>
                          <li>Significant Data Fiduciaries to have additional compliance measures</li>
                          <li>Cross-border data transfer restrictions</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Penalties</h4>
                        <p className="text-legal-muted mt-1">
                          Non-compliance with the DPDP Act can result in penalties up to ₹250 crore (approximately $30 million) for certain violations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Information Technology Rules, 2021</h3>
                    <p className="text-legal-muted mt-1">
                      The IT Rules 2021 govern intermediaries (including social media platforms) and impose additional compliance requirements for personal data processing.
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Key Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-legal-muted">
                          <li>Due diligence requirements for intermediaries</li>
                          <li>Grievance redressal mechanism</li>
                          <li>Traceability of first originator of information</li>
                          <li>Compliance officers for significant social media intermediaries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">GDPR Applicability to Indian Entities</h3>
                    <p className="text-legal-muted mt-1">
                      Indian organizations may need to comply with the EU's GDPR if they:
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-legal-muted">
                          <li>Have an establishment in the EU</li>
                          <li>Offer goods or services to EU residents</li>
                          <li>Monitor the behavior of EU residents</li>
                          <li>Process data of EU residents on behalf of other organizations</li>
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
                          A comprehensive document explaining what personal data you collect, how you use it, and the rights of your data principals.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Consent Framework</h4>
                        <p className="text-legal-muted mt-1">
                          Mechanisms to obtain, record, and manage consent for data processing, with clear opt-in procedures.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Data Processing Agreement (DPA)</h4>
                        <p className="text-legal-muted mt-1">
                          Required when sharing personal data with third-party processors.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-legal-border dark:border-legal-slate/20 rounded-md">
                        <h4 className="font-medium">Data Breach Management Plan</h4>
                        <p className="text-legal-muted mt-1">
                          Procedures for handling and reporting data breaches as required by law.
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
                    description: "The comprehensive Indian data protection compliance guide has been downloaded",
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

export default GDPRCompliancePage;
