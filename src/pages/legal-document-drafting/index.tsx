
import React, { useState } from 'react';
import { FileText, Pen, Copy, Download, Sparkles, MessageCircle, Book, History, HelpCircle, Users, Save } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import LegalToolLayout from '@/components/LegalToolLayout';
import DocumentDraftingForm from '@/components/document-drafting/DocumentDraftingForm';
import DocumentPreview from '@/components/document-drafting/DocumentPreview';
import DocumentTemplateList from '@/components/document-drafting/DocumentTemplateList';
import GeminiFlashAnalyzer from '@/components/GeminiFlashAnalyzer';
import PromptBasedGenerator from '@/components/document-drafting/PromptBasedGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CollaborativeEditor from '@/components/document-drafting/CollaborativeEditor';
import PdfUploader from '@/components/PdfUploader';
import { Button } from '@/components/ui/button';
import DocumentStorage from '@/components/document-drafting/DocumentStorage';
import { DocumentTemplate } from '@/services/documentTemplates';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface SavedDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  tags?: string[];
}

const LegalDocumentDraftingPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'prompt' | 'collaborative'>('form');
  const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);
  const [expandedTemplates, setExpandedTemplates] = useState(false);
  
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
    // This would be used if we want to incorporate the analysis directly into the document
    // For now, we'll just show a toast
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

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setDocumentTitle(template.title);
    setDocumentType(template.type);
    setDraftContent(template.content);
    toast.success(`${template.title} template loaded!`);
  };
  
  const handleLoadSavedDocument = (document: SavedDocument) => {
    setDocumentTitle(document.title);
    setDocumentType(document.type);
    setDraftContent(document.content);
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
      title="Indian Legal Document Drafting"
      description="Create professional legal documents tailored for Indian jurisdiction"
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
              <span>Indian Legal Document Drafting</span>
            </h1>
            <p className="text-legal-muted dark:text-gray-400 text-sm md:text-base">
              Draft professional legal documents compliant with Indian laws and judicial requirements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GeminiFlashAnalyzer onAnalysisComplete={handleAdvancedAnalysis} />
            <DocumentStorage 
              currentDocument={{ title: documentTitle, type: documentType, content: draftContent }}
              onLoadDocument={handleLoadSavedDocument}
            />
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
                    <li>• Use the "Collaborative" tab for multiple editors</li>
                    <li>• Upload existing PDFs to extract text</li>
                    <li>• Save documents in My Documents for easy access</li>
                    <li>• Use templates as starting points for common documents</li>
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
            onValueChange={(value) => setActiveTab(value as 'form' | 'prompt' | 'collaborative')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="form" className="flex items-center gap-2">
                <Pen className="h-4 w-4" />
                <span className="hidden sm:inline">Structured</span> Form
              </TabsTrigger>
              <TabsTrigger value="prompt" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">AI</span> Prompt
              </TabsTrigger>
              <TabsTrigger value="collaborative" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Collaborative</span> Edit
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form/Prompt and Templates */}
          <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
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
            
            {/* Document Templates Section */}
            <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Book className="h-4 w-4 text-blue-500" />
                  Document Templates
                </h3>
              </div>
              
              <DocumentTemplateList onTemplateSelect={handleTemplateSelect} />
            </div>
          </motion.div>
          
          {/* Right column - Document Preview or Collaborative Editor */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
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
                onEdit={() => {
                  if (activeTab !== 'form') setActiveTab('form');
                }}
              />
            )}
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-8 bg-legal-accent/5 border border-legal-accent/20 rounded-md p-4"
          variants={itemVariants}
        >
          <h3 className="flex items-center gap-2 text-lg font-medium mb-2">
            <Sparkles className="h-5 w-5 text-legal-accent" />
            <span>India-Specific Legal Drafting Tips</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Affidavits in Indian Courts</h4>
              <p className="text-legal-muted dark:text-gray-400">Always include proper verification clause as per Indian Evidence Act and ensure compliance with local stamp duty requirements.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">High Court vs. Supreme Court</h4>
              <p className="text-legal-muted dark:text-gray-400">Use Article 226 for High Court writs and Article 32 for Supreme Court writs. Citation format also differs between courts.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Proper Court Addressing</h4>
              <p className="text-legal-muted dark:text-gray-400">Address Supreme Court as "Hon'ble Supreme Court of India" and High Courts as "Hon'ble High Court of [State]".</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">BNS Act Compliance</h4>
              <p className="text-legal-muted dark:text-gray-400">Update your legal documents to reflect the new Bharatiya Nyaya Sanhita (BNS) codes that replaced the Indian Penal Code.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Local Jurisdiction Rules</h4>
              <p className="text-legal-muted dark:text-gray-400">Different High Courts have different rules for formatting and filing. Check the latest court rules before finalizing documents.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded shadow-sm">
              <h4 className="font-semibold mb-1">Vakalatnama Requirements</h4>
              <p className="text-legal-muted dark:text-gray-400">Ensure valid Bar Council enrollment numbers and proper witness attestation as per the Advocates Act, 1961.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
