import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, Upload, Check, AlertTriangle, FileText, ChevronDown, ChevronUp, Search, Send, Info, Copy, Download, Pen } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation: string;
  remediation: string;
  expanded?: boolean;
}

const PrivacyComplianceDocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState('document-editor');
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
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [templateCategory, setTemplateCategory] = useState('standard');
  const [businessType, setBusinessType] = useState('');
  const [dataProcessingPurposes, setDataProcessingPurposes] = useState<string[]>([]);
  const [jurisdictions, setJurisdictions] = useState<string[]>(['india']);
  
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
    setIsGenerating(true);
    toast({
      title: "Generating Compliant Document",
      description: "Creating a compliant version of your document based on selected regulations...",
    });
    
    setTimeout(() => {
      let templateText = '';
      
      // Generate document based on selected type
      switch(documentType) {
        case 'privacy-policy':
          templateText = generatePrivacyPolicyTemplate();
          break;
        case 'terms-of-service':
          templateText = generateTermsOfServiceTemplate();
          break;
        case 'data-processing-agreement':
          templateText = generateDPATemplate();
          break;
        case 'cookie-policy':
          templateText = generateCookiePolicyTemplate();
          break;
        case 'consent-form':
          templateText = generateConsentFormTemplate();
          break;
        default:
          templateText = generatePrivacyPolicyTemplate();
      }
      
      setDocument(templateText);
      setIsGenerating(false);
      setActiveTab('document-editor');
      
      toast({
        title: "Document Generated",
        description: `A compliant ${documentType.replace(/-/g, ' ')} has been generated. Review and customize as needed.`,
      });
    }, 2000);
  };

  const generatePrivacyPolicyTemplate = () => {
    const companyName = '[Your Company Name]';
    const email = '[contact@example.com]';
    const website = '[www.example.com]';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `PRIVACY POLICY

Last Updated: ${currentDate}

1. INTRODUCTION

This Privacy Policy describes how ${companyName} ("we," "our," or "us") collects, uses, and processes your personal information in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India${jurisdictions.includes('gdpr') ? ' and the General Data Protection Regulation (GDPR) of the European Union' : ''}.

2. DATA FIDUCIARY INFORMATION

${companyName} is the data fiduciary responsible for your personal data. 
Contact information: ${email}
Website: ${website}

3. PERSONAL DATA WE PROCESS

We collect and process the following categories of personal data:
- Contact information (name, email, phone number)
- Account information (username, password)
- Transaction data
- Usage data
- Device and browser information
${businessType === 'ecommerce' ? '- Payment information\n- Shipping addresses' : ''}
${businessType === 'healthcare' ? '- Health-related information\n- Medical history' : ''}

4. PURPOSES AND LEGAL BASIS FOR PROCESSING

We process your personal data for the following specific purposes:
${dataProcessingPurposes.includes('service-provision') ? '- To provide our services (Legal basis: Consent and Contract)\n' : ''}
${dataProcessingPurposes.includes('marketing') ? '- To send marketing communications (Legal basis: Consent)\n' : ''}
${dataProcessingPurposes.includes('improvement') ? '- To improve our services (Legal basis: Legitimate interest)\n' : ''}
${dataProcessingPurposes.includes('legal') ? '- To comply with legal obligations (Legal basis: Legal obligation)\n' : ''}

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

${jurisdictions.includes('gdpr') ? 'Under the GDPR, you also have the following additional rights:\n- Right to data portability\n- Right to restriction of processing\n- Right to object to processing\n- Right to withdraw consent\n- Right to lodge a complaint with a supervisory authority\n' : ''}

To exercise these rights, contact us at ${email}

7. CROSS-BORDER DATA TRANSFERS

We may transfer personal data to countries outside India that provide an adequate level of protection, in compliance with the conditions prescribed under the DPDP Act${jurisdictions.includes('gdpr') ? ' and GDPR' : ''}.

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

You also have the right to file a complaint with the Data Protection Board of India${jurisdictions.includes('gdpr') ? ' or your local data protection authority if you are in the European Union' : ''}.

13. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of significant changes by [email/notification in app/website].`;
  };

  const generateTermsOfServiceTemplate = () => {
    const companyName = '[Your Company Name]';
    const email = '[contact@example.com]';
    const website = '[www.example.com]';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `TERMS OF SERVICE

Last Updated: ${currentDate}

1. INTRODUCTION

These Terms of Service ("Terms") govern your access to and use of ${website} and its related services (collectively, the "Services") provided by ${companyName} ("we," "our," or "us").

2. ACCEPTANCE OF TERMS

By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.

3. ELIGIBILITY

You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet all eligibility requirements.

4. USER ACCOUNTS

When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password. You agree to notify us immediately of any unauthorized access to or use of your account.

5. PROHIBITED ACTIVITIES

You agree not to:
- Violate any applicable laws or regulations
- Infringe upon the rights of others
- Use our Services to transmit harmful code or malware
- Attempt to gain unauthorized access to our systems or user accounts
- Use our Services for any illegal or unauthorized purpose

6. INTELLECTUAL PROPERTY RIGHTS

All content, features, and functionality of our Services are owned by ${companyName} and are protected by copyright, trademark, and other intellectual property laws.

7. USER CONTENT

You retain ownership of any content you submit, post, or display on or through our Services. By providing content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute such content.

8. TERMINATION

We may terminate or suspend your access to our Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.

9. DISCLAIMER OF WARRANTIES

OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

10. LIMITATION OF LIABILITY

TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ${companyName} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.

11. GOVERNING LAW

These Terms shall be governed by and construed in accordance with the laws of India${jurisdictions.includes('gdpr') ? ', except for users in the European Union, for whom local consumer protection laws may apply' : ''}.

12. DISPUTE RESOLUTION

Any dispute arising out of or relating to these Terms shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India.

13. CHANGES TO TERMS

We may revise these Terms at any time by posting an updated version. Your continued use of the Services after the changes will constitute your acceptance of the revised Terms.

14. CONTACT US

If you have any questions about these Terms, please contact us at ${email}.`;
  };

  const generateDPATemplate = () => {
    return `DATA PROCESSING AGREEMENT

This Data Processing Agreement ("DPA") is entered into between:
[Your Company Name], a company registered under the laws of [Country], with its registered office at [Address] ("Data Controller" or "Controller")
and
[Service Provider Name], a company registered under the laws of [Country], with its registered office at [Address] ("Data Processor" or "Processor")

1. DEFINITIONS
- "Applicable Data Protection Laws" means all laws and regulations applicable to the Processing of Personal Data, including the Digital Personal Data Protection Act, 2023 (DPDP Act) of India${jurisdictions.includes('gdpr') ? ', the General Data Protection Regulation (EU) 2016/679 (GDPR)' : ''}, and any other applicable data protection or privacy laws.
- "Personal Data" means any information relating to an identified or identifiable natural person.
- "Processing" means any operation performed on Personal Data.
- "Data Principal" means the individual to whom the Personal Data relates.

2. SCOPE AND PURPOSE OF PROCESSING
The Processor shall Process Personal Data only for the purpose of providing the services described in the main agreement between the parties dated [Date] ("Main Agreement") and in accordance with the Controller's documented instructions.

3. DURATION OF PROCESSING
This DPA shall commence on the Effective Date and shall continue until the termination of the Main Agreement.

4. NATURE AND PURPOSE OF PROCESSING
The Processor shall Process Personal Data as necessary to perform the services under the Main Agreement, as further specified in Annex 1 to this DPA.

5. TYPES OF PERSONAL DATA AND CATEGORIES OF DATA PRINCIPALS
The types of Personal Data and categories of Data Principals are specified in Annex 1 to this DPA.

6. OBLIGATIONS OF THE PROCESSOR
The Processor shall:
a) Process Personal Data only on documented instructions from the Controller;
b) Ensure that persons authorized to Process Personal Data have committed to confidentiality;
c) Implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk;
d) Not engage another processor without prior specific or general written authorization of the Controller;
e) Assist the Controller in ensuring compliance with the obligations pursuant to Applicable Data Protection Laws;
f) Delete or return all Personal Data to the Controller after the end of the provision of services;
g) Make available to the Controller all information necessary to demonstrate compliance with the obligations under Applicable Data Protection Laws.

7. RIGHTS OF DATA PRINCIPALS
The Processor shall assist the Controller in responding to requests from Data Principals exercising their rights under Applicable Data Protection Laws.

8. DATA BREACH NOTIFICATION
The Processor shall notify the Controller without undue delay after becoming aware of a personal data breach and provide all relevant information about the breach.

9. DATA PROTECTION IMPACT ASSESSMENT
The Processor shall provide the Controller with all information necessary for the Controller to conduct data protection impact assessments where required by Applicable Data Protection Laws.

10. CROSS-BORDER TRANSFERS
The Processor shall not transfer Personal Data outside of India without the Controller's prior written consent and ensuring adequate safeguards in accordance with Applicable Data Protection Laws.

11. AUDIT RIGHTS
The Controller shall have the right to audit the Processor's compliance with this DPA, including by conducting inspections at the Processor's premises.

12. LIABILITY
The Processor shall be liable for the damage caused by Processing only where it has not complied with obligations under Applicable Data Protection Laws specifically directed to processors or where it has acted outside or contrary to lawful instructions of the Controller.

13. GOVERNING LAW
This DPA shall be governed by the laws of India${jurisdictions.includes('gdpr') ? ' (for data processing activities subject to the DPDP Act) and the laws of the European Union or its Member States (for data processing activities subject to the GDPR)' : ''}.

ANNEX 1
A. Nature and Purpose of Processing: [Describe]
B. Categories of Personal Data: [List]
C. Categories of Data Principals: [List]

Signed by and on behalf of:

[Controller Name] 
Name: ________________________
Title: _________________________
Date: _________________________

[Processor Name]
Name: ________________________
Title: _________________________
Date: _________________________`;
  };

  const generateCookiePolicyTemplate = () => {
    const companyName = '[Your Company Name]';
    const website = '[www.example.com]';
    const email = '[contact@example.com]';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `COOKIE POLICY

Last Updated: ${currentDate}

1. INTRODUCTION

This Cookie Policy explains how ${companyName} ("we," "our," or "us") uses cookies and similar technologies on our website ${website} and its related services (collectively, the "Services").

2. WHAT ARE COOKIES?

Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.

3. TYPES OF COOKIES WE USE

We use the following types of cookies:
- Essential cookies: These are necessary for the website to function properly and cannot be switched off.
- Performance cookies: These help us understand how visitors interact with our website by collecting and reporting information anonymously.
- Functionality cookies: These enable the website to provide enhanced functionality and personalization.
- Targeting cookies: These are set by our advertising partners and may be used to build a profile of your interests.

4. SPECIFIC COOKIES USED ON OUR WEBSITE

| Cookie Name | Purpose | Duration | Type |
|-------------|---------|----------|------|
| [Cookie1] | [Purpose] | [Duration] | [Type] |
| [Cookie2] | [Purpose] | [Duration] | [Type] |
| [Cookie3] | [Purpose] | [Duration] | [Type] |

5. THIRD-PARTY COOKIES

Some cookies are placed by third parties on our website. These third parties may include:
- Analytics providers (such as Google Analytics)
- Advertising networks
- Social media platforms

6. YOUR COOKIE CHOICES

You can manage your cookie preferences in the following ways:
- Through our cookie consent banner when you first visit our website
- By adjusting your browser settings to refuse cookies
- By using our Cookie Preference Center [if applicable]

7. HOW TO DISABLE COOKIES

Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
- Google Chrome: Settings > Privacy and security > Cookies and other site data
- Mozilla Firefox: Options > Privacy & Security > Cookies and Site Data
- Safari: Preferences > Privacy > Cookies and website data
- Microsoft Edge: Settings > Cookies and site permissions > Cookies and site data

8. IMPACT OF DISABLING COOKIES

Please note that if you choose to disable certain cookies, some features of our website may not function properly, and your experience may be affected.

9. UPDATES TO THIS POLICY

We may update this Cookie Policy from time to time. The updated version will be indicated by an updated "Last Updated" date at the top of this policy.

10. CONTACT US

If you have any questions about our use of cookies, please contact us at ${email}.`;
  };

  const generateConsentFormTemplate = () => {
    const companyName = '[Your Company Name]';
    const email = '[contact@example.com]';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `DATA PROCESSING CONSENT FORM

Date: ${currentDate}

1. INTRODUCTION

This Consent Form outlines how ${companyName} ("we," "our," or "us") collects, uses, and processes your personal data. Before providing your consent, please read this form carefully.

2. DATA CONTROLLER INFORMATION

${companyName}
Address: [Company Address]
Contact Email: ${email}
Data Protection Officer: [DPO Name and Contact]

3. PERSONAL DATA TO BE COLLECTED

We will collect and process the following personal data:
[ ] Contact information (name, email address, phone number)
[ ] Identity information (government ID, date of birth)
[ ] Financial information (bank details, payment information)
[ ] Professional information (employment details, qualifications)
[ ] Other: ____________________________

4. PURPOSES OF PROCESSING

We will process your personal data for the following purposes:
[ ] To provide our services/products to you
[ ] To send you marketing communications about our products and services
[ ] To comply with legal obligations
[ ] To improve our services
[ ] Other: ____________________________

5. LEGAL BASIS FOR PROCESSING

We process your personal data based on:
[ ] Your consent
[ ] Performance of a contract with you
[ ] Compliance with a legal obligation
[ ] Our legitimate interests

6. DATA RECIPIENTS

Your personal data may be shared with:
[ ] Our affiliated companies
[ ] Service providers acting as processors
[ ] Relevant public authorities
[ ] Other: ____________________________

7. DATA RETENTION PERIOD

We will retain your personal data for:
[ ] The duration of our relationship plus [X] years
[ ] [X] years as required by applicable law
[ ] Until you withdraw your consent
[ ] Other: ____________________________

8. INTERNATIONAL TRANSFERS

[ ] Your personal data may be transferred to countries outside India. We ensure adequate safeguards are in place in accordance with applicable data protection laws.

9. YOUR RIGHTS

You have the following rights regarding your personal data:
- Right to access and obtain a copy of your data
- Right to rectification of inaccurate data
- Right to erasure (right to be forgotten)
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent at any time

To exercise these rights, please contact us at ${email}.

10. CONSENT DECLARATION

I, [Full Name], have read and understood this Consent Form and hereby:

[ ] GIVE CONSENT to ${companyName} to process my personal data as described in this form.

[ ] DO NOT GIVE CONSENT to ${companyName} to process my personal data.

I understand that I can withdraw my consent at any time by contacting ${email}, without affecting the lawfulness of processing based on consent before its withdrawal.

Signature: _______________________
Date: __________________________`;
  };

  const copyToClipboard = () => {
    if (document) {
      navigator.clipboard.writeText(document)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Document has been copied to your clipboard",
          });
        })
        .catch(err => {
          toast({
            title: "Copy failed",
            description: "Failed to copy document to clipboard",
            variant: "destructive",
          });
          console.error('Failed to copy: ', err);
        });
    }
  };

  const downloadDocument = () => {
    if (document) {
      const element = window.document.createElement('a');
      const file = new Blob([document], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${documentType}-${new Date().toISOString().split('T')[0]}.txt`;
      window.document.body.appendChild(element);
      element.click();
      window.document.body.removeChild(element);
      
      toast({
        title: "Document Downloaded",
        description: "Document has been downloaded successfully",
      });
    }
  };

  const openTemplateDialog = () => {
    setShowTemplateDialog(true);
  };

  return (
    <LegalToolLayout
      title="Privacy & Data Protection Document Generator"
      description="Create, analyze, and optimize privacy policies, terms of service, and other compliance documents for DPDP, GDPR, and global regulations."
      icon={<Shield className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto">
        <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>India's Data Protection Framework</AlertTitle>
          <AlertDescription className="text-sm">
            The Digital Personal Data Protection Act, 2023 (DPDP Act) is India's comprehensive data protection law that applies to the processing of digital personal data. Use this tool to create and ensure your privacy policies and data practices comply with the DPDP Act and other global regulations like GDPR where needed.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="document-editor">
              <Pen className="h-4 w-4 mr-2" />
              Document Editor
            </TabsTrigger>
            <TabsTrigger value="document-scan">
              <Search className="h-4 w-4 mr-2" />
              Compliance Scan
            </TabsTrigger>
            <TabsTrigger value="knowledge-base">
              <FileText className="h-4 w-4 mr-2" />
              Compliance Guide
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="document-editor" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Generator</CardTitle>
                <CardDescription>Create compliant legal documents for your business</CardDescription>
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
                      <SelectItem value="retention-policy">Data Retention Policy</SelectItem>
                      <SelectItem value="breach-notification">Breach Notification Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-2">Applicable Jurisdictions</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={jurisdictions.includes('india') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleJurisdictionChange('india')}
                      className="rounded-full"
                    >
                      India (DPDP Act)
                    </Button>
                    <Button
                      type="button"
                      variant={jurisdictions.includes('gdpr') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleJurisdictionChange('gdpr')}
                      className="rounded-full"
                    >
                      EU (GDPR)
                    </Button>
                    <Button
                      type="button"
                      variant={jurisdictions.includes('usa') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleJurisdictionChange('usa')}
                      className="rounded-full"
                    >
                      USA (CCPA/CPRA)
                    </Button>
                    <Button
                      type="button"
                      variant={jurisdictions.includes('global') ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleJurisdictionChange('global')}
                      className="rounded-full"
                    >
                      Global (All)
                    </Button>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-800 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Document Content</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={openTemplateDialog}>
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadDocument}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="document-text"
                    placeholder="Enter or generate document content here..."
                    className="min-h-[600px] font-mono text-sm"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 py-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setDocument('');
                    toast({
                      title: "Document Reset",
                      description: "The document editor has been cleared",
                    });
                  }}
                >
                  Reset
                </Button>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setActiveTab('document-scan');
                      if (document) {
                        scanDocument();
                      } else {
                        toast({
                          title: "No Document",
                          description: "Please enter document text first",
                          variant: "destructive"
                        });
                      }
                    }}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Scan Compliance
                  </Button>
                  <Button 
                    onClick={generateCompliantDocument}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        Generate Document
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
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
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
              <CardFooter className="flex justify-end border-t border-gray-200 dark:border-gray-800 py-4">
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
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Compliance Level</span>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{scanResults.score}%</span>
                        </div>
                        <Progress value={scanResults.score} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                            Compliance Issues ({scanResults.issues.length})
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
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
                          <div className="text-sm text-gray-500 dark:text-gray-400">
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
                          className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
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
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{issue.regulation}</p>
                              </div>
                            </div>
                            
                            <div>
                              {issue.expanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                          </div>
                          
                          {issue.expanded && (
                            <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-800">
                              <div className="mt-2 space-y-3">
                                <div>
                                  <h5 className="text-sm font-medium">Description:</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{issue.description}</p>
                                </div>
                                
                                <div>
                                  <h5 className="text-sm font-medium">Remediation:</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{issue.remediation}</p>
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
                  <CardFooter className="flex justify-end border-t border-gray-200 dark:border-gray-800 py-4">
                    <Button 
                      onClick={generateCompliantDocument}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
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
                <CardTitle>India's Data Protection Framework</CardTitle>
                <CardDescription>Essential information about the Digital Personal Data Protection Act, 2023 and other Indian privacy regulations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Digital Personal Data Protection Act, 2023 (DPDP Act)</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      The DPDP Act is India's comprehensive legislation for the protection of digital personal data. It establishes a framework for processing digital personal data based on the principle that individuals should have control over their data.
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Key Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-500 dark:text-gray-400">
                          <li>Lawful processing based on consent and legitimate uses</li>
                          <li>Explicit consent requirements (clear, specific, informed)</li>
                          <li>Data Principal rights (access, correction, erasure)</li>
                          <li>Data breach notification to the Data Protection Board</li>
                          <li>Special protections for children's data</li>
                          <li>Significant Data Fiduciaries to have additional compliance measures</li>
                          <li>Cross-border data transfer restrictions</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Penalties</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Non-compliance with the DPDP Act can result in penalties up to ₹250 crore (approximately $30 million) for certain violations.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Information Technology Rules, 2021</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      The IT Rules 2021 govern intermediaries (including social media platforms) and impose additional compliance requirements for personal data processing.
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Key Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-500 dark:text-gray-400">
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
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Indian organizations may need to comply with the EU's GDPR if they:
                    </p>
                    
                    <div className="mt-4 space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-500 dark:text-gray-400">
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
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Privacy Policy</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          A comprehensive document explaining what personal data you collect, how you use it, and the rights of your data principals.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Consent Framework</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Mechanisms to obtain, record, and manage consent for data processing, with clear opt-in procedures.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Data Processing Agreement (DPA)</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Required when sharing personal data with third-party processors.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-md">
                        <h4 className="font-medium">Data Breach Management Plan</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          Procedures for handling and reporting data breaches as required by law.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-gray-200 dark:border-gray-800 py-4">
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

      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Template Setup</DialogTitle>
            <DialogDescription>
              Configure your template with the following options before generating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger id="business-type">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS / Software</SelectItem>
                  <SelectItem value="marketplace">Marketplace / Platform</SelectItem>
                  <SelectItem value="content">Content / Media</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="block">Template Category</Label>
              <RadioGroup value={templateCategory} onValueChange={setTemplateCategory}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic-template" />
                  <Label htmlFor="basic-template" className="font-normal">Basic (Minimal compliance)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard-template" />
                  <Label htmlFor="standard-template" className="font-normal">Standard (Full compliance)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprehensive" id="comprehensive-template" />
                  <Label htmlFor="comprehensive-template" className="font-normal">Comprehensive (Detailed coverage)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="block">Data Processing Purposes</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="service-provision" 
                    checked={dataProcessingPurposes.includes('service-provision')}
                    onChange={() => handleDataPurposeChange('service-provision')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="service-provision" className="font-normal text-sm">Service Provision</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="marketing" 
                    checked={dataProcessingPurposes.includes('marketing')}
                    onChange={() => handleDataPurposeChange('marketing')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="marketing" className="font-normal text-sm">Marketing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="improvement" 
                    checked={dataProcessingPurposes.includes('improvement')}
                    onChange={() => handleDataPurposeChange('improvement')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="improvement" className="font-normal text-sm">Service Improvement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="legal" 
                    checked={dataProcessingPurposes.includes('legal')}
                    onChange={() => handleDataPurposeChange('legal')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="legal" className="font-normal text-sm">Legal Compliance</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                generateCompliantDocument();
                setShowTemplateDialog(false);
              }}
            >
              Generate Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LegalToolLayout>
  );
};

export default PrivacyComplianceDocumentGenerator;
