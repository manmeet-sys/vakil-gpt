
import React, { useState } from 'react';
import { FileText, Pen, Copy, Download, Sparkles, MessageCircle, HelpCircle, Users, FileSearch, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
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
import { performanceMonitor } from '@/utils/performance-monitoring';

const LegalDocumentDraftingPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'prompt' | 'collaborative' | 'contract'>('form');
  const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);
  
  const handleDraftGenerated = (title: string, type: string, content: string) => {
    console.log("Document draft generated:", { title, type, contentLength: content?.length });
    performanceMonitor.measure('DocumentDrafting', 'updateState', () => {
      setDocumentTitle(title);
      setDocumentType(type);
      setDraftContent(content);
      toast.success('Document draft generated successfully!');
    });
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
    // This would be used if we want to incorporate the analysis directly into the document
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
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

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
              <h1 className="text-2xl md:text-3xl font-playfair font-bold flex items-center gap-2 mb-1">
                <FileText className="h-7 w-7 text-legal-accent" />
                <span>Indian Legal Document & Contract Drafting</span>
              </h1>
              <p className="text-legal-muted dark:text-gray-400 text-sm md:text-base">
                Draft professional legal documents and contracts compliant with Indian laws and judicial requirements
              </p>
            </div>
            <div className="flex items-center gap-2">
              <GeminiFlashAnalyzer onAnalysisComplete={handleAdvancedAnalysis} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded">
                      <HelpCircle className="h-3 w-3" />
                      Quick Tips
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/50">
                    <ul className="text-xs space-y-1 text-amber-800 dark:text-amber-200">
                      <li>• Use the "Structured Form" for guided document creation</li>
                      <li>• Use "Contract Review" to analyze existing contracts</li>
                      <li>• The "Collaborative" tab enables multiple editors</li>
                      <li>• Upload existing PDFs to extract text</li>
                      <li>• The AI can generate documents from detailed prompts</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="mb-6">
            <Tabs 
              defaultValue="form" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'form' | 'prompt' | 'collaborative' | 'contract')}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md grid-cols-4 mb-6 bg-gray-100 dark:bg-slate-800/50 p-1 rounded-xl">
                <TabsTrigger 
                  value="form" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
                >
                  <Pen className="h-4 w-4" />
                  <span className="hidden sm:inline">Structured</span> Form
                </TabsTrigger>
                <TabsTrigger 
                  value="contract" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
                >
                  <FileSearch className="h-4 w-4" />
                  <span className="hidden sm:inline">Contract</span> Review
                </TabsTrigger>
                <TabsTrigger 
                  value="prompt" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">AI</span> Prompt
                </TabsTrigger>
                <TabsTrigger 
                  value="collaborative" 
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 rounded-lg"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Collaborative</span> Edit
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="contract">
                <div className="bg-white dark:bg-slate-900/50 border border-legal-border dark:border-legal-slate/20 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-medium mb-4 flex items-center gap-2 font-playfair">
                    <FileSearch className="h-5 w-5 text-legal-accent" />
                    Contract Review & Analysis
                  </h2>
                  <p className="mb-6 text-legal-muted dark:text-gray-400">
                    Upload an existing contract to review terms, identify risks, ensure compliance with Indian laws, 
                    and receive customized improvement suggestions.
                  </p>
                  
                  <iframe 
                    src="/contract-drafting" 
                    className="w-full h-[800px] border-0 rounded"
                    title="Contract Review Tool"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {activeTab !== 'contract' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column - Form/Prompt */}
              <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
                {/* Document Generation (Form, Prompt, or Collaborative based on activeTab) */}
                {activeTab === 'form' ? (
                  <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md p-6">
                    <DocumentDraftingForm onDraftGenerated={handleDraftGenerated} />
                  </div>
                ) : activeTab === 'prompt' ? (
                  <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md p-6">
                    <PromptBasedGenerator onDraftGenerated={handleDraftGenerated} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md p-6 space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 font-playfair">
                      <Users className="h-4 w-4 text-blue-500" />
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
                )}
              </motion.div>
              
              {/* Right column - Document Preview or Collaborative Editor */}
              <motion.div className="lg:col-span-7" variants={itemVariants}>
                {activeTab === 'collaborative' ? (
                  <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md overflow-hidden">
                    <CollaborativeEditor 
                      documentId="123456"
                      initialContent={draftContent || "Start collaborating on your legal document here..."}
                      onChange={setDraftContent}
                      title={documentTitle || "Collaborative Document"}
                      documentType={documentType || "Legal Draft"}
                    />
                  </div>
                ) : (
                  <DocumentPreview 
                    title={documentTitle}
                    type={documentType}
                    content={draftContent}
                    onCopy={handleCopyContent}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </motion.div>
            </div>
          )}
          
          <motion.div 
            className="mt-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/20 rounded-md p-4"
            variants={itemVariants}
          >
            <h3 className="flex items-center gap-2 text-lg font-medium mb-2 font-playfair text-blue-800 dark:text-blue-300">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>India-Specific Legal Drafting Tips</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">Affidavits in Indian Courts</h4>
                <p className="text-legal-muted dark:text-gray-400">Always include proper verification clause as per Indian Evidence Act and ensure compliance with local stamp duty requirements.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">High Court vs. Supreme Court</h4>
                <p className="text-legal-muted dark:text-gray-400">Use Article 226 for High Court writs and Article 32 for Supreme Court writs. Citation format also differs between courts.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">Proper Court Addressing</h4>
                <p className="text-legal-muted dark:text-gray-400">Address Supreme Court as "Hon'ble Supreme Court of India" and High Courts as "Hon'ble High Court of [State]".</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">BNS Act Compliance</h4>
                <p className="text-legal-muted dark:text-gray-400">Update your legal documents to reflect the new Bharatiya Nyaya Sanhita (BNS) codes that replaced the Indian Penal Code.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">Local Jurisdiction Rules</h4>
                <p className="text-legal-muted dark:text-gray-400">Different High Courts have different rules for formatting and filing. Check the latest court rules before finalizing documents.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm border border-blue-100 dark:border-blue-900/20">
                <h4 className="font-semibold mb-1 text-blue-700 dark:text-blue-400">Contract Stamp Duty</h4>
                <p className="text-legal-muted dark:text-gray-400">Remember that stamp duty varies by state in India. Contracts must be properly stamped according to the applicable state's stamp duty laws.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
