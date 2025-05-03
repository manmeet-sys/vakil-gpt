
import React, { useState } from 'react';
import { FileText, Pen, Copy, Download, Sparkles, MessageCircle, HelpCircle, Users, BookText } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'prompt' | 'collaborative' | 'form'>('prompt');
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
      title="Legal Document Drafting"
      description="Create professional legal documents and contracts tailored for Indian jurisdiction"
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <motion.div 
        className="container mx-auto px-4 py-6 max-w-7xl"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <FileText className="h-6 w-6 text-legal-accent" />
              <span>Legal Document Drafting</span>
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
                <TooltipContent className="max-w-xs">
                  <ul className="text-xs space-y-1">
                    <li>• Use the "AI Prompt" tab for quick document generation</li>
                    <li>• Select "Collaborative" for team editing capabilities</li>
                    <li>• Upload existing PDFs to extract text</li>
                    <li>• Choose "Highly Detailed" option for comprehensive contracts</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs 
            defaultValue="prompt" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'prompt' | 'collaborative' | 'form')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span> Prompt
              </TabsTrigger>
              <TabsTrigger value="form" className="flex items-center gap-2">
                <Pen className="h-4 w-4" />
                <span className="hidden sm:inline">Form</span> Based
              </TabsTrigger>
              <TabsTrigger value="collaborative" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Collaborative</span> Edit
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Form/Prompt */}
          <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
            {/* Document Generation (Form, Prompt, or Collaborative based on activeTab) */}
            {activeTab === 'form' ? (
              <DocumentDraftingForm onDraftGenerated={handleDraftGenerated} />
            ) : activeTab === 'prompt' ? (
              <PromptBasedGenerator onDraftGenerated={handleDraftGenerated} />
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
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
              <CollaborativeEditor 
                documentId="123456"
                initialContent={draftContent || "Start collaborating on your legal document here..."}
                onChange={setDraftContent}
                title={documentTitle || "Collaborative Document"}
                documentType={documentType || "Legal Draft"}
              />
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
        
        <motion.div 
          className="mt-8 bg-legal-accent/5 border border-legal-accent/20 rounded-md p-4"
          variants={itemVariants}
        >
          <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
            <BookText className="h-5 w-5 text-legal-accent" />
            <span>Indian Legal Document Guide</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Contracts & Agreements</h4>
              <p className="text-legal-muted dark:text-gray-400">Include clear definitions, parties' information, payment terms, dispute resolution clauses and proper stamp duty provisions as required under Indian Contract Act.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Court Documents</h4>
              <p className="text-legal-muted dark:text-gray-400">Follow proper format with correct citation styles, court name, case number format, and include appropriate verification clauses as per Civil/Criminal Procedure Codes.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Criminal Law Updates</h4>
              <p className="text-legal-muted dark:text-gray-400">Reference the new Bharatiya Nyaya Sanhita (BNS) codes that replaced the Indian Penal Code, with appropriate section numbers for relevant offences.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">New Evidence Rules</h4>
              <p className="text-legal-muted dark:text-gray-400">All affidavits and evidence should comply with Bharatiya Sakshya Adhiniyam (BSA) requirements that replaced the Indian Evidence Act.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">E-Filing Requirements</h4>
              <p className="text-legal-muted dark:text-gray-400">Format documents according to the e-filing standards of respective courts with proper pagination, bookmarks and OCR compliance.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Legal Notices</h4>
              <p className="text-legal-muted dark:text-gray-400">Include proper notice period as per relevant law, clear demands/reliefs sought, and reference to applicable statutory provisions with proper party addresses.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
