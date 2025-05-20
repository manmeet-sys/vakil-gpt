import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';

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

  // Indian jurisdictions with their courts
  const jurisdictions: JurisdictionOption[] = [
    { 
      value: 'delhi', 
      label: 'Delhi',
      courts: ['delhi-hc', 'district-court-delhi', 'delhi-consumer-forum']
    },
    { 
      value: 'maharashtra', 
      label: 'Maharashtra',
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
    { value: 'affidavit', label: 'Affidavit', description: 'Sworn written statement for court proceedings' },
    { value: 'pil', label: 'Public Interest Litigation', description: 'Petition filed for public interest' },
    { value: 'writ_petition', label: 'Writ Petition', description: 'Constitutional remedy under Article 226/32' },
    { value: 'legal_notice', label: 'Legal Notice', description: 'Formal communication before legal proceedings' },
    { value: 'vakalatnama', label: 'Vakalatnama', description: 'Document authorizing lawyer to represent client' },
    { value: 'consumer_complaint', label: 'Consumer Complaint', description: 'Complaint under Consumer Protection Act' },
    { value: 'rental_agreement', label: 'Rental Agreement', description: 'Contract between landlord and tenant' },
    { value: 'will', label: 'Will/Testament', description: 'Legal declaration of distribution of assets' },
    { value: 'mou', label: 'Memorandum of Understanding', description: 'Preliminary agreement between parties' },
    { value: 'reply_notice', label: 'Reply to Legal Notice', description: 'Formal response to a legal notice' },
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
      console.log("Starting document generation...");
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
        
        // Enhance the prompt with specific Indian legal context
        const enhancedPrompt = `Generate a professional Indian legal document (${selectedDocType}) for ${selectedJurisdiction} jurisdiction and ${selectedCourt} based on the following request:
        
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

Document format: Return ONLY the complete document text, no explanations needed.`;

        console.log("Sending enhanced prompt for generation...");
        
        try {
          const generatedContent = await generateOpenAIAnalysis(enhancedPrompt, `Document Draft: ${title} (${selectedDocType} - ${selectedJurisdiction})`);
          console.log("Document generated successfully", { contentLength: generatedContent?.length });
          
          if (!generatedContent || generatedContent.length < 10) {
            throw new Error("Generated content is empty or too short");
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
            else if (title.toLowerCase().includes('affidavit')) finalDocType = 'affidavit';
            else if (title.toLowerCase().includes('petition')) finalDocType = 'writ_petition';
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
              Prompt-Based
            </TabsTrigger>
            <TabsTrigger value="settings">
              <FileText className="h-4 w-4 mr-2" />
              Document Settings
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
              <Label htmlFor="prompt" className="text-sm font-medium">Describe the Document You Need</Label>
              <Textarea
                id="prompt"
                placeholder={examplePrompts[documentType] || "Describe the legal document you need with specific details..."}
                className="min-h-[150px] text-base"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include specific details like names, locations, dates, and the exact legal issue for better results.
              </p>
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
                <span className="font-medium">Tip:</span> Include parties involved, court/jurisdiction, specific laws or sections, and exactly what you want the document to achieve.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="jurisdiction" className="text-sm font-medium">Jurisdiction</Label>
                </div>
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
                <p className="text-xs text-muted-foreground">
                  The state or region where this document will be used
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="court" className="text-sm font-medium">Court/Authority</Label>
                </div>
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
                <p className="text-xs text-muted-foreground">
                  The specific court or authority for this document
                </p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="documentType" className="text-sm font-medium">Document Type</Label>
                </div>
                <Select value={documentType} onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {documentType && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {documentTypes.find(d => d.value === documentType)?.description || ''}
                  </p>
                )}
              </div>
            </div>
            
            <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-sm ml-2">
                Document settings will be used to properly format your legal document according to the specific requirements of the selected jurisdiction and court/authority.
              </AlertDescription>
            </Alert>
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
                Generating Document...
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
