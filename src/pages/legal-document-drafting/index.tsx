
import React, { useState, lazy, Suspense } from 'react';
import { 
  FileText, Pen, Copy, Download, Sparkles, MessageCircle, 
  HelpCircle, Users, FileSearch, BookOpen, 
  CheckCircle, PenTool, ClipboardCheck 
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import LegalToolLayout from '@/components/LegalToolLayout';
import DocumentDraftingForm from '@/components/document-drafting/DocumentDraftingForm';
import DocumentPreview from '@/components/document-drafting/DocumentPreview';
import GeminiFlashAnalyzer from '@/components/GeminiFlashAnalyzer';
import PromptBasedGenerator from '@/components/document-drafting/PromptBasedGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CollaborativeEditor from '@/components/document-drafting/CollaborativeEditor';
import PdfUploader from '@/components/PdfUploader';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { runWhenIdle } from '@/utils/performance';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load component for better performance
const ContractReviewTool = lazy(() => 
  import('@/components/document-drafting/ContractReviewTool')
);

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

const LegalDocumentDraftingPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'prompt' | 'collaborative' | 'contract'>('form');
  const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  
  const handleDraftGenerated = (title: string, type: string, content: string) => {
    setDocumentTitle(title);
    setDocumentType(type);
    setDraftContent(content);
    toast.success('Document draft generated successfully!');
  };

  const handleCopyContent = () => {
    if (draftContent) {
      navigator.clipboard.writeText(draftContent);
      toast.success('Document content copied to clipboard!');
    }
  };

  const handleDownloadDocument = () => {
    if (draftContent) {
      const element = document.createElement('a');
      const file = new Blob([draftContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${documentTitle || 'legal-document'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Document downloaded successfully!');
    }
  };

  const handleAdvancedAnalysis = (analysis: string) => {
    toast.success('Advanced analysis generated. You can use this to enhance your document.');
  };

  const handleDocumentUpload = (files: File[], extractedText?: string) => {
    setAttachedDocuments([...attachedDocuments, ...files]);
    
    if (extractedText && !draftContent) {
      setDraftContent(extractedText);
      toast.success('Text extracted from PDF and added to editor');
    }
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocs = [...attachedDocuments];
    updatedDocs.splice(index, 1);
    setAttachedDocuments(updatedDocs);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast.success('Template selected. Click "Generate Document" to apply template.');
  };

  // Preload heavy components when idle
  React.useEffect(() => {
    runWhenIdle(() => {
      import('@/components/document-drafting/ContractReviewTool');
    });
  }, []);

  // Popular document templates
  const popularTemplates = [
    { id: 'legal-notice', name: 'Legal Notice', category: 'notices' },
    { id: 'affidavit', name: 'General Affidavit', category: 'court' },
    { id: 'rental', name: 'Rental Agreement', category: 'contracts' },
    { id: 'poa', name: 'Power of Attorney', category: 'personal' },
    { id: 'will', name: 'Simple Will', category: 'personal' },
    { id: 'nda', name: 'Non-Disclosure Agreement', category: 'contracts' }
  ];

  return (
    <LegalToolLayout
      title="Indian Legal Document & Contract Drafting"
      description="Create professional legal documents and contracts tailored for Indian jurisdiction"
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <BackButton 
          to="/tools" 
          label="Back to Tools" 
          className="mb-6"
        />
        
        <motion.div 
          className="w-full"
          initial="initial"
          animate="animate"
          variants={pageVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-playfair font-bold flex items-center gap-2 mb-1 text-indigo-900 dark:text-indigo-200">
                <FileText className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                <span>Indian Legal Document & Contract Drafting</span>
              </h1>
              <p className="text-legal-muted dark:text-gray-400 text-sm md:text-base">
                Create professional legal documents and contracts compliant with Indian laws and judicial requirements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <GeminiFlashAnalyzer onAnalysisComplete={handleAdvancedAnalysis} />
              <TooltipProvider>
                <Tooltip open={showTips} onOpenChange={setShowTips}>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors"
                      onClick={() => setShowTips(!showTips)}
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      Quick Tips
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    align="end" 
                    className="max-w-xs bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/50 animate-in fade-in-0 zoom-in-95"
                  >
                    <ul className="text-xs space-y-1.5 text-amber-800 dark:text-amber-200">
                      <li className="flex items-start gap-1.5">
                        <span className="inline-block rounded-full bg-amber-200 dark:bg-amber-800 w-4 h-4 text-amber-800 dark:text-amber-200 flex items-center justify-center text-[10px] mt-0.5 font-bold">1</span>
                        Use the "Structured Form" for guided document creation
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="inline-block rounded-full bg-amber-200 dark:bg-amber-800 w-4 h-4 text-amber-800 dark:text-amber-200 flex items-center justify-center text-[10px] mt-0.5 font-bold">2</span>
                        Use "Contract Review" to analyze existing contracts
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="inline-block rounded-full bg-amber-200 dark:bg-amber-800 w-4 h-4 text-amber-800 dark:text-amber-200 flex items-center justify-center text-[10px] mt-0.5 font-bold">3</span>
                        The "Collaborative" tab enables multiple editors
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="inline-block rounded-full bg-amber-200 dark:bg-amber-800 w-4 h-4 text-amber-800 dark:text-amber-200 flex items-center justify-center text-[10px] mt-0.5 font-bold">4</span>
                        Upload existing PDFs to extract text
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Quick Access Templates */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 font-playfair flex items-center gap-2 text-indigo-800 dark:text-indigo-300">
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Quick Access Templates
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {popularTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className={`p-3 bg-white dark:bg-slate-800 border ${
                    selectedTemplate === template.id 
                      ? 'border-indigo-300 dark:border-indigo-500 ring-1 ring-indigo-300 dark:ring-indigo-500' 
                      : 'border-gray-200 dark:border-gray-700'
                  } rounded-lg cursor-pointer transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500 relative`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex flex-col items-center text-center gap-2 py-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedTemplate === template.id
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {template.category === 'notices' && <MessageCircle className="h-5 w-5" />}
                      {template.category === 'court' && <FileText className="h-5 w-5" />}
                      {template.category === 'contracts' && <ClipboardCheck className="h-5 w-5" />}
                      {template.category === 'personal' && <PenTool className="h-5 w-5" />}
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{template.name}</p>
                    <Badge variant="outline" className="text-xs px-2 py-0 h-5 font-normal">{template.category}</Badge>
                    {selectedTemplate === template.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <Tabs 
              defaultValue="form" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'form' | 'prompt' | 'collaborative' | 'contract')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 dark:bg-slate-800/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="form" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg data-[state=active]:shadow-sm transition-all"
                >
                  <Pen className="h-4 w-4" />
                  <span className="hidden sm:inline">Structured</span> Form
                </TabsTrigger>
                <TabsTrigger 
                  value="contract" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg data-[state=active]:shadow-sm transition-all"
                >
                  <FileSearch className="h-4 w-4" />
                  <span className="hidden sm:inline">Contract</span> Review
                </TabsTrigger>
                <TabsTrigger 
                  value="prompt" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg data-[state=active]:shadow-sm transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">AI</span> Prompt
                </TabsTrigger>
                <TabsTrigger 
                  value="collaborative" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg data-[state=active]:shadow-sm transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Collaborative</span> Edit
                </TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                {/* Form Tab Content */}
                <TabsContent value="form" className="animate-in fade-in-50">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
                      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
                        <DocumentDraftingForm 
                          onDraftGenerated={handleDraftGenerated} 
                          selectedTemplate={selectedTemplate}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div className="lg:col-span-7" variants={itemVariants}>
                      <DocumentPreview 
                        title={documentTitle}
                        type={documentType}
                        content={draftContent}
                        onCopy={handleCopyContent}
                        onDownload={handleDownloadDocument}
                      />
                    </motion.div>
                  </div>
                </TabsContent>
                
                {/* Contract Review Tab Content */}
                <TabsContent value="contract" className="animate-in fade-in-50">
                  <motion.div variants={itemVariants}>
                    <div className="bg-white dark:bg-slate-900/50 border border-legal-border dark:border-legal-slate/20 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-xl font-medium mb-2 flex items-center gap-2 font-playfair text-indigo-800 dark:text-indigo-300">
                          <FileSearch className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          Contract Review & Analysis
                        </h2>
                        <p className="text-legal-muted dark:text-gray-400">
                          Upload an existing contract to review terms, identify risks, ensure compliance with Indian laws, 
                          and receive customized improvement suggestions.
                        </p>
                      </div>
                      
                      <div className="h-[700px]">
                        <Suspense fallback={
                          <div className="flex items-center justify-center h-full">
                            <div className="space-y-4 w-full max-w-3xl px-8">
                              <div className="text-center mb-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto"></div>
                                <p className="mt-3 text-gray-500">Loading contract review tool...</p>
                              </div>
                              <Skeleton className="w-full h-10 rounded-md" />
                              <Skeleton className="w-full h-48 rounded-md" />
                              <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="w-full h-32 rounded-md" />
                                <Skeleton className="w-full h-32 rounded-md" />
                              </div>
                            </div>
                          </div>
                        }>
                          <ContractReviewTool />
                        </Suspense>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* AI Prompt Tab Content */}
                <TabsContent value="prompt" className="animate-in fade-in-50">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
                      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
                        <PromptBasedGenerator onDraftGenerated={handleDraftGenerated} />
                      </div>
                    </motion.div>
                    
                    <motion.div className="lg:col-span-7" variants={itemVariants}>
                      <DocumentPreview 
                        title={documentTitle}
                        type={documentType}
                        content={draftContent}
                        onCopy={handleCopyContent}
                        onDownload={handleDownloadDocument}
                      />
                    </motion.div>
                  </div>
                </TabsContent>
                
                {/* Collaborative Tab Content */}
                <TabsContent value="collaborative" className="animate-in fade-in-50">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
                      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2 font-playfair text-indigo-800 dark:text-indigo-300">
                          <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Collaborative Session
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Invite colleagues to work on this document in real-time. Changes will be visible to all participants.
                        </p>
                        <PdfUploader 
                          onUpload={handleDocumentUpload} 
                          onRemove={handleRemoveDocument} 
                          documents={attachedDocuments}
                          documentId="123456"
                          showVersionHistory={true}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div className="lg:col-span-7" variants={itemVariants}>
                      <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                        <CollaborativeEditor 
                          documentId="123456"
                          initialContent={draftContent || "Start collaborating on your legal document here..."}
                          onChange={setDraftContent}
                          title={documentTitle || "Collaborative Document"}
                          documentType={documentType || "Legal Draft"}
                        />
                      </div>
                    </motion.div>
                  </div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </div>
          
          <motion.div 
            className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/20 rounded-lg p-6"
            variants={itemVariants}
          >
            <h3 className="flex items-center gap-2 text-lg font-medium mb-4 font-playfair text-indigo-800 dark:text-indigo-300">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>India-Specific Legal Drafting Tips</span>
            </h3>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {[
                {
                  title: "Affidavits in Indian Courts",
                  content: "Always include proper verification clause as per Indian Evidence Act and ensure compliance with local stamp duty requirements."
                },
                {
                  title: "High Court vs. Supreme Court",
                  content: "Use Article 226 for High Court writs and Article 32 for Supreme Court writs. Citation format also differs between courts."
                },
                {
                  title: "Proper Court Addressing",
                  content: "Address Supreme Court as \"Hon'ble Supreme Court of India\" and High Courts as \"Hon'ble High Court of [State]\"."
                },
                {
                  title: "BNS Act Compliance",
                  content: "Update your legal documents to reflect the new Bharatiya Nyaya Sanhita (BNS) codes that replaced the Indian Penal Code."
                },
                {
                  title: "Local Jurisdiction Rules",
                  content: "Different High Courts have different rules for formatting and filing. Check the latest court rules before finalizing documents."
                },
                {
                  title: "Contract Stamp Duty",
                  content: "Remember that stamp duty varies by state in India. Contracts must be properly stamped according to the applicable state's stamp duty laws."
                }
              ].map((tip, index) => (
                <motion.div 
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden border-indigo-100 dark:border-indigo-900/30 h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 text-indigo-700 dark:text-indigo-400">{tip.title}</h4>
                      <p className="text-legal-muted dark:text-gray-400">{tip.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
