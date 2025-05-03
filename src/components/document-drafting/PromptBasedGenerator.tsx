
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2, FileText, Globe, Scale, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { generateGeminiAnalysis } from '@/utils/aiAnalysis';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { performanceMonitor } from '@/utils/performance-monitoring';
import { v4 as uuidv4 } from 'uuid';

type PromptBasedGeneratorProps = {
  onDraftGenerated: (title: string, type: string, content: string) => void;
};

interface JurisdictionOption {
  value: string;
  label: string;
  courts: string[];
}

const PromptBasedGenerator: React.FC<PromptBasedGeneratorProps> = ({ onDraftGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [jurisdiction, setJurisdiction] = useState<string>('delhi');
  const [court, setCourt] = useState<string>('delhi-hc');
  const [documentType, setDocumentType] = useState<string>('affidavit');
  const [generationError, setGenerationError] = useState<string>('');
  const [generationSessionId, setGenerationSessionId] = useState<string>('');
  const [documentLength, setDocumentLength] = useState<'standard' | 'comprehensive' | 'detailed'>('comprehensive');

  // Indian jurisdictions with their courts
  const jurisdictions: JurisdictionOption[] = [
    { 
      value: 'delhi', 
      label: 'Delhi',
      courts: ['delhi-hc', 'district-court-delhi', 'delhi-consumer-forum']
    },
    { 
      value: 'maharashtra', 
      label: 'Mumbai/Maharashtra',
      courts: ['bombay-hc', 'district-court-maharashtra', 'maharashtra-consumer-forum']
    },
    { 
      value: 'karnataka', 
      label: 'Karnataka',
      courts: ['karnataka-hc', 'district-court-karnataka', 'karnataka-consumer-forum']
    },
    { 
      value: 'tamil-nadu', 
      label: 'Tamil Nadu',
      courts: ['madras-hc', 'district-court-tamil-nadu', 'tamil-nadu-consumer-forum']
    },
    { 
      value: 'west-bengal', 
      label: 'West Bengal',
      courts: ['calcutta-hc', 'district-court-west-bengal', 'west-bengal-consumer-forum']
    },
    { 
      value: 'uttar-pradesh', 
      label: 'Uttar Pradesh',
      courts: ['allahabad-hc', 'district-court-uttar-pradesh', 'uttar-pradesh-consumer-forum']
    },
    { 
      value: 'supreme-court', 
      label: 'Supreme Court of India',
      courts: ['supreme-court']
    }
  ];

  // Document types with context-aware descriptions
  const documentTypes = [
    { value: 'contract', label: 'Contract/Agreement', description: 'Legal agreement between two or more parties' },
    { value: 'affidavit', label: 'Affidavit', description: 'Sworn written statement for court proceedings' },
    { value: 'pil', label: 'Public Interest Litigation', description: 'Petition filed for public interest' },
    { value: 'writ_petition', label: 'Writ Petition', description: 'Constitutional remedy under Article 226/32' },
    { value: 'legal_notice', label: 'Legal Notice', description: 'Formal communication before legal proceedings' },
    { value: 'vakalatnama', label: 'Vakalatnama', description: 'Document authorizing lawyer to represent client' },
    { value: 'consumer_complaint', label: 'Consumer Complaint', description: 'Complaint under Consumer Protection Act' },
    { value: 'rental_agreement', label: 'Rental Agreement', description: 'Contract between landlord and tenant' },
    { value: 'employment_agreement', label: 'Employment Agreement', description: 'Contract between employer and employee' },
    { value: 'service_agreement', label: 'Service Agreement', description: 'Contract for providing services' },
    { value: 'will', label: 'Will/Testament', description: 'Legal declaration of distribution of assets' },
    { value: 'mou', label: 'Memorandum of Understanding', description: 'Preliminary agreement between parties' },
    { value: 'reply_notice', label: 'Reply to Legal Notice', description: 'Formal response to a legal notice' },
  ];
  
  // Contract types - specific for contract documents
  const contractTypes = [
    { value: 'employment', label: 'Employment Contract', description: 'Agreement between employer and employee' },
    { value: 'service', label: 'Service Agreement', description: 'Agreement for providing professional services' },
    { value: 'sale', label: 'Sale Agreement', description: 'Agreement for sale of goods or property' },
    { value: 'lease', label: 'Lease Agreement', description: 'Agreement for leasing property or equipment' },
    { value: 'nda', label: 'Non-Disclosure Agreement', description: 'Confidentiality agreement' },
    { value: 'partnership', label: 'Partnership Deed', description: 'Agreement forming business partnership' },
    { value: 'joint_venture', label: 'Joint Venture Agreement', description: 'Agreement between businesses for joint project' },
    { value: 'consultancy', label: 'Consultancy Agreement', description: 'Agreement for consulting services' },
    { value: 'distribution', label: 'Distribution Agreement', description: 'Agreement for product distribution' },
    { value: 'franchise', label: 'Franchise Agreement', description: 'Agreement between franchisor and franchisee' },
  ];
  
  // Court mapping for each jurisdiction
  const courtsMap: Record<string, { value: string, label: string }[]> = {
    'delhi': [
      { value: 'delhi-hc', label: 'Delhi High Court' },
      { value: 'district-court-delhi', label: 'District Courts, Delhi' },
      { value: 'delhi-consumer-forum', label: 'Consumer Forum, Delhi' }
    ],
    'maharashtra': [
      { value: 'bombay-hc', label: 'Bombay High Court' },
      { value: 'district-court-maharashtra', label: 'District Courts, Maharashtra' },
      { value: 'maharashtra-consumer-forum', label: 'Consumer Forum, Maharashtra' }
    ],
    'karnataka': [
      { value: 'karnataka-hc', label: 'Karnataka High Court' },
      { value: 'district-court-karnataka', label: 'District Courts, Karnataka' },
      { value: 'karnataka-consumer-forum', label: 'Consumer Forum, Karnataka' }
    ],
    'tamil-nadu': [
      { value: 'madras-hc', label: 'Madras High Court' },
      { value: 'district-court-tamil-nadu', label: 'District Courts, Tamil Nadu' },
      { value: 'tamil-nadu-consumer-forum', label: 'Consumer Forum, Tamil Nadu' }
    ],
    'west-bengal': [
      { value: 'calcutta-hc', label: 'Calcutta High Court' },
      { value: 'district-court-west-bengal', label: 'District Courts, West Bengal' },
      { value: 'west-bengal-consumer-forum', label: 'Consumer Forum, West Bengal' }
    ],
    'uttar-pradesh': [
      { value: 'allahabad-hc', label: 'Allahabad High Court' },
      { value: 'district-court-uttar-pradesh', label: 'District Courts, Uttar Pradesh' },
      { value: 'uttar-pradesh-consumer-forum', label: 'Consumer Forum, Uttar Pradesh' }
    ],
    'supreme-court': [
      { value: 'supreme-court', label: 'Supreme Court of India' }
    ]
  };

  // Example prompts for different document types
  const examplePrompts: Record<string, string> = {
    'contract': "Draft a comprehensive service agreement between ABC Tech Solutions Pvt. Ltd. and XYZ Corporation for providing IT infrastructure management services for 2 years with a monthly retainer of Rs. 2,50,000.",
    'employment_agreement': "Draft an employment agreement for a Senior Software Engineer position with a salary of Rs. 18 lakhs per annum, 1-year term, standard non-compete and intellectual property clauses, with Bangalore jurisdiction.",
    'service_agreement': "Draft a comprehensive service agreement between a web development company and a client for creating an e-commerce website with milestone-based payments totaling Rs. 5,00,000 over 3 months.",
    'affidavit': "Draft an affidavit for a property dispute in Delhi High Court regarding unauthorized construction by my neighbor on my property boundary. My name is Rajesh Kumar and the neighbor is Sunil Sharma.",
    'pil': "Draft a PIL for filing in the Supreme Court regarding air pollution in Delhi NCR caused by stubble burning in neighboring states, seeking urgent intervention.",
    'writ_petition': "Draft a writ petition under Article 226 for the High Court of Karnataka challenging the denial of environmental clearance for my eco-tourism project in Western Ghats.",
    'legal_notice': "Draft a legal notice to ABC Builders for delay in possession of my flat in their 'Green Valley' project in Mumbai by 3 years despite full payment.",
    'vakalatnama': "Draft a vakalatnama for appointing Mr. Anil Desai, Advocate (Bar Council No. MH/1234/2010) to represent me in a divorce matter in Family Court, Bandra, Mumbai.",
    'consumer_complaint': "Draft a consumer complaint against XYZ Electronics for refusing to replace my defective laptop within warranty period of 2 years. I purchased it for Rs. 75,000 six months ago.",
    'rental_agreement': "Draft a residential rental agreement for an apartment in Bangalore (Koramangala) with monthly rent of Rs. 25,000, maintenance of Rs. 3,000, and security deposit of Rs. 1,50,000 for 11 months.",
    'will': "Draft a simple will for distributing my assets among my wife (60%), son (20%), and daughter (20%). Assets include a house in Chennai, fixed deposits, and shares.",
    'mou': "Draft an MOU between my company (ABC Consulting) and XYZ Technologies for a joint IT services project with revenue sharing of 60:40 for 2 years.",
    'reply_notice': "Draft a reply to a legal notice received from my landlord threatening eviction for alleged non-payment of rent, which I have actually paid with UPI transactions as proof."
  };
  
  // Initialize a new session ID for tracking generation
  useEffect(() => {
    setGenerationSessionId(uuidv4());
  }, []);

  const handleGenerateDocument = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate a document');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      console.log(`Starting document generation... (Session ID: ${generationSessionId})`);
      const startTime = Date.now();
      
      // Track performance using our monitor
      return await performanceMonitor.measureAsync('PromptBasedGenerator', 'generateDocument', async () => {
        // Save the prompt to recent prompts list for reuse
        setRecentPrompts(prev => {
          const newPrompts = [prompt, ...prev.filter(p => p !== prompt)].slice(0, 5);
          localStorage.setItem('recentDocumentPrompts', JSON.stringify(newPrompts));
          return newPrompts;
        });

        // Get selected jurisdiction and court labels for context
        const selectedJurisdiction = jurisdictions.find(j => j.value === jurisdiction)?.label || 'Delhi';
        const selectedCourt = courtsMap[jurisdiction]?.find(c => c.value === court)?.label || 'Delhi High Court';
        const selectedDocType = documentTypes.find(d => d.value === documentType)?.label || 'Affidavit';
        
        // Determine if this is a contract type document
        const isContract = documentType === 'contract' || 
                          documentType === 'rental_agreement' || 
                          documentType === 'employment_agreement' ||
                          documentType === 'service_agreement' ||
                          documentType === 'mou';
        
        // Set appropriate detail level based on document type and user selection
        let detailLevel = '';
        if (documentLength === 'detailed') {
          detailLevel = "extremely detailed and comprehensive";
        } else if (documentLength === 'comprehensive') {
          detailLevel = "comprehensive";
        } else {
          detailLevel = "standard";
        }
        
        // Extra content specifications based on document type
        let contentSpecifications = '';
        if (isContract) {
          contentSpecifications = `
          For this contract document:
          1. Include a detailed preamble with complete party information
          2. Add a comprehensive definitions section for all key terms
          3. Include clear recitals/whereas clauses explaining the background and purpose
          4. Provide detailed clauses covering scope, payment terms, term, termination
          5. Include thorough representations and warranties from all parties
          6. Add comprehensive confidentiality, indemnification, and force majeure provisions
          7. Include detailed dispute resolution mechanism with arbitration clause
          8. Specify jurisdiction and governing law explicitly
          9. Add detailed notice provisions with complete contact information placeholders
          10. Include standard boilerplate clauses (severability, waiver, entire agreement)
          11. Format with proper clause and sub-clause numbering (1.1, 1.2, etc.)
          12. Include signature blocks with witness lines
          13. The document should be a minimum of 3000 words to ensure all necessary elements are included
          `;
        } else if (documentType === 'affidavit') {
          contentSpecifications = `
          For this affidavit:
          1. Include proper verification clause as per Indian Evidence Act
          2. Format with numbered paragraphs
          3. Include reference to local stamp duty requirements
          4. Add proper deponent details
          `;
        } else if (documentType === 'writ_petition' || documentType === 'pil') {
          contentSpecifications = `
          For this petition:
          1. Include proper citation format for the court
          2. Format with proper grounds section using alphabetical listing (a), (b), etc.
          3. Include prayer section with specific reliefs sought
          4. Reference relevant constitutional articles and case law
          `;
        }
        
        // Enhance the prompt with specific Indian legal context
        const enhancedPrompt = `Generate a ${detailLevel} Indian legal document (${selectedDocType}) for ${selectedJurisdiction} jurisdiction and ${selectedCourt} based on the following request:
        
"${prompt}"

Create a complete and properly formatted legal document that:
1. Follows all Indian legal drafting standards and conventions specific to ${selectedJurisdiction} jurisdiction
2. Includes all necessary sections and clauses required by ${selectedCourt}
3. Uses appropriate legal language for Indian jurisdiction with correct honorifics and references
4. References relevant Indian laws, provisions, and precedents applicable in ${selectedJurisdiction}
5. Follows proper legal formatting with correct paragraphs, numbering, and structure as per ${selectedCourt} requirements
6. Is compliant with current Indian legal requirements including the latest laws like BNS, BNSS, and BSA where applicable
7. Uses correct Indian date formats (DD/MM/YYYY) and Rupee (₹) notation for any monetary values
8. Includes appropriate sworn statements, declarations, or verification clauses as required by Indian law
9. Uses standard Indian legal closing formulations and signature blocks
${contentSpecifications}

Document format: Return ONLY the complete document text, no explanations needed.`;

        console.log(`Sending enhanced prompt for ${isContract ? 'contract' : 'document'} generation... Length: ${enhancedPrompt.length}`);
        
        try {
          const generatedContent = await generateGeminiAnalysis(enhancedPrompt, `Document Draft: ${title} (${selectedDocType} - ${selectedJurisdiction})`);
          console.log("Document generated successfully", { 
            contentLength: generatedContent?.length,
            sessionId: generationSessionId,
            documentType: documentType,
            isContract
          });
          
          if (!generatedContent || generatedContent.length < 100) {
            throw new Error("Generated content is too short or empty");
          }
          
          // Auto-detect document type if not explicitly set
          let finalDocType = documentType;
          if (finalDocType === 'other' || !finalDocType) {
            const lowerPrompt = prompt.toLowerCase();
            if (lowerPrompt.includes('affidavit')) finalDocType = 'affidavit';
            else if (lowerPrompt.includes('pil') || lowerPrompt.includes('public interest')) finalDocType = 'pil';
            else if (lowerPrompt.includes('writ')) finalDocType = 'writ_petition';
            else if (lowerPrompt.includes('notice') && !lowerPrompt.includes('reply')) finalDocType = 'legal_notice';
            else if (lowerPrompt.includes('reply') && lowerPrompt.includes('notice')) finalDocType = 'reply_notice';
            else if (lowerPrompt.includes('vakalatnama')) finalDocType = 'vakalatnama';
            else if (lowerPrompt.includes('complaint') && lowerPrompt.includes('consumer')) finalDocType = 'consumer_complaint';
            else if ((lowerPrompt.includes('rent') || lowerPrompt.includes('lease')) && 
                    (lowerPrompt.includes('agreement') || lowerPrompt.includes('contract'))) finalDocType = 'rental_agreement';
            else if (lowerPrompt.includes('will') || lowerPrompt.includes('testament')) finalDocType = 'will';
            else if (lowerPrompt.includes('mou') || lowerPrompt.includes('memorandum of understanding')) finalDocType = 'mou';
            else if (lowerPrompt.includes('contract') || lowerPrompt.includes('agreement')) finalDocType = 'contract';
            else if (title.toLowerCase().includes('affidavit')) finalDocType = 'affidavit';
            else if (title.toLowerCase().includes('petition')) finalDocType = 'writ_petition';
            else if (title.toLowerCase().includes('contract') || title.toLowerCase().includes('agreement')) finalDocType = 'contract';
          }
          
          console.log(`Generation completed in ${Date.now() - startTime}ms`);
          onDraftGenerated(title, finalDocType, generatedContent);
          toast.success('Legal document generated successfully');
        } catch (genError) {
          console.error('Error in AI generation:', genError);
          setGenerationError('Failed to generate document with AI. Please try with different inputs or check your connection.');
          toast.error('Failed to generate document with AI. Please try again.');
          throw genError;
        }
      });
    } catch (error) {
      console.error('Error handling document generation:', error);
      // Error already handled in the inner try-catch
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle jurisdiction change
  const handleJurisdictionChange = (value: string) => {
    setJurisdiction(value);
    // Set default court for the selected jurisdiction
    const defaultCourt = jurisdictions.find(j => j.value === value)?.courts[0] || '';
    setCourt(defaultCourt);
  };

  // Handle document type change
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    // Set example prompt for the selected document type
    if (examplePrompts[value] && !prompt) {
      setPrompt(examplePrompts[value]);
    }
  };

  // Load recent prompts from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedPrompts = localStorage.getItem('recentDocumentPrompts');
      if (savedPrompts) {
        setRecentPrompts(JSON.parse(savedPrompts));
      }
    } catch (error) {
      console.error('Error loading recent prompts:', error);
    }
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-800 dark:text-white">AI-Powered Indian Legal Document Generation</CardTitle>
            <CardDescription className="text-slate-600 dark:text-gray-400">
              Describe the document you need, and AI will draft it according to Indian legal standards
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="prompt">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="prompt">
              <MessageSquare className="h-4 w-4 mr-2" />
              Prompt & Settings
            </TabsTrigger>
            <TabsTrigger value="settings">
              <FileText className="h-4 w-4 mr-2" />
              Document Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
              <Input 
                id="title"
                placeholder="Enter a title for your document" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document-type" className="text-sm font-medium">Document Type</Label>
              <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                <SelectTrigger id="document-type">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <div className="mb-1 px-2 text-xs text-muted-foreground">Contracts & Agreements</div>
                  {documentTypes
                    .filter(type => type.value === 'contract' || 
                                    type.value === 'rental_agreement' ||
                                    type.value === 'employment_agreement' ||
                                    type.value === 'service_agreement' ||
                                    type.value === 'mou')
                    .map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))
                  }
                  <div className="mb-1 mt-2 px-2 text-xs text-muted-foreground">Legal Proceedings</div>
                  {documentTypes
                    .filter(type => type.value !== 'contract' && 
                                    type.value !== 'rental_agreement' &&
                                    type.value !== 'employment_agreement' &&
                                    type.value !== 'service_agreement' &&
                                    type.value !== 'mou')
                    .map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              
              {documentType && (
                <p className="text-xs text-muted-foreground mt-1">
                  {documentTypes.find(d => d.value === documentType)?.description || ''}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-medium">Describe the Document You Need</Label>
              <Textarea
                id="prompt"
                placeholder={examplePrompts[documentType] || "Describe the legal document you need with specific details..."}
                className="min-h-[150px] text-base"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include specific details like names, locations, dates, amounts, and the exact legal issue for better results.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <div className="space-y-2">
                <Label htmlFor="document-length" className="text-sm font-medium flex items-center gap-1">
                  Document Detail Level
                  <Info className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Select value={documentLength} onValueChange={(val) => setDocumentLength(val as 'standard' | 'comprehensive' | 'detailed')}>
                  <SelectTrigger id="document-length">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="detailed">Highly Detailed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {documentLength === 'detailed' 
                    ? 'Creates an extremely detailed document with extensive clauses and provisions' 
                    : documentLength === 'comprehensive' 
                      ? 'Creates a well-balanced document with all necessary sections' 
                      : 'Creates a streamlined document with essential elements'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jurisdiction" className="text-sm font-medium flex items-center gap-1">
                  Jurisdiction
                  <Globe className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Select value={jurisdiction} onValueChange={handleJurisdictionChange}>
                  <SelectTrigger id="jurisdiction">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map(j => (
                      <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="court" className="text-sm font-medium flex items-center gap-1">
                  Court/Authority
                  <Scale className="h-3 w-3 text-muted-foreground" />
                </Label>
                <Select value={court} onValueChange={setCourt}>
                  <SelectTrigger id="court">
                    <SelectValue placeholder="Select court or authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {courtsMap[jurisdiction]?.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {recentPrompts.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recent Prompts</Label>
                <div className="flex flex-wrap gap-2">
                  {recentPrompts.map((recentPrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs truncate max-w-full"
                      onClick={() => setPrompt(recentPrompt)}
                    >
                      {recentPrompt.length > 30 ? `${recentPrompt.substring(0, 30)}...` : recentPrompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <AlertDescription className="text-sm">
                <span className="font-medium">Pro Tip:</span> For contracts, include all parties, payment terms, duration, and specific obligations. For court documents, mention the relevant laws, case details, and specific reliefs sought.
              </AlertDescription>
            </Alert>

            {generationError && (
              <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-sm ml-2 text-red-700 dark:text-red-400">
                  {generationError}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            {documentType === 'contract' || 
             documentType === 'rental_agreement' || 
             documentType === 'employment_agreement' || 
             documentType === 'service_agreement' || 
             documentType === 'mou' ? (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-md p-4">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Contract Best Practices</h3>
                  <ul className="list-disc pl-5 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <li>Clearly identify all parties with complete legal names and addresses</li>
                    <li>Define all key terms to avoid ambiguity</li>
                    <li>Specify payment terms including amounts, schedules, and methods</li>
                    <li>Include detailed scope of work/services</li>
                    <li>Add termination clauses with notice periods</li>
                    <li>Include dispute resolution mechanisms</li>
                    <li>Specify governing law and jurisdiction</li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Party Details</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Include full legal names, registered addresses, and authorized signatories in your prompt.
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Contract Term & Value</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Specify the contract duration and monetary values clearly for more accurate generation.
                    </p>
                  </div>
                </div>
              </div>
            ) : documentType === 'affidavit' || documentType === 'vakalatnama' ? (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-md p-4">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Court Document Best Practices</h3>
                  <ul className="list-disc pl-5 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <li>Include proper court name and jurisdiction</li>
                    <li>Use correct format for citing case numbers</li>
                    <li>Follow proper verification requirements</li>
                    <li>Include appropriate stamp duty references</li>
                    <li>Use formal legal language throughout</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-md p-4">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Document Best Practices</h3>
                  <ul className="list-disc pl-5 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <li>Provide specific details related to your case or scenario</li>
                    <li>Include relevant dates, names, and locations</li>
                    <li>Mention any specific laws or sections that apply</li>
                    <li>Be clear about the outcome or relief you are seeking</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          <Button
            onClick={handleGenerateDocument}
            disabled={isGenerating || !prompt.trim() || !title.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Document... {isGenerating && documentLength === 'detailed' ? '(This may take a minute for detailed documents)' : ''}
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Document
              </>
            )}
          </Button>
        </motion.div>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          The AI will draft a legal document based on Indian laws, standards, and formats appropriate for your selected jurisdiction
        </p>
      </CardContent>
    </Card>
  );
};

export default PromptBasedGenerator;
