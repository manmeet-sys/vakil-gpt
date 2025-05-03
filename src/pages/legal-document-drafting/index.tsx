
import React, { useState } from 'react';
import { FileText, Pen, Copy, Download, Sparkles, MessageCircle, HelpCircle, Users, Save, FileQuestion, FilePlus, BookOpen } from 'lucide-react';
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
import DocumentStorage from '@/components/document-drafting/DocumentStorage';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  // Document type quick starts
  const documentQuickStarts = [
    { 
      title: "Legal Notice", 
      description: "Create a formal legal notice to initiate proceedings",
      icon: <FileQuestion className="h-5 w-5 text-amber-500" />,
      onClick: () => {
        setDocumentTitle("Legal Notice");
        setDocumentType("Legal Notice");
        setDraftContent(`LEGAL NOTICE\n\nFrom:\n[YOUR NAME]\n[YOUR ADDRESS]\nThrough: [ADVOCATE NAME]\n[ADVOCATE ADDRESS]\n[ENROLLMENT NO.]\n\nTo:\n[RECIPIENT NAME]\n[RECIPIENT ADDRESS]\n\nDate: ${new Date().toLocaleDateString()}\n\nSubject: [SUBJECT MATTER OF NOTICE]\n\nSir/Madam,\n\nUnder instructions from and on behalf of my client [CLIENT NAME], I hereby serve upon you the following legal notice:\n\n1. That my client states that [STATE FACTS OF THE CASE].\n\n2. That [FURTHER FACTS].\n\n3. That [CAUSE OF ACTION].\n\n4. That despite [DETAILS OF PREVIOUS ATTEMPTS TO RESOLVE].\n\n5. That your acts have caused my client [DETAILS OF LOSS/INJURY].\n\n6. That through this legal notice, you are called upon to [DEMAND] within [TIME PERIOD] from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, as advised, at your risk, cost, and consequences.\n\nPlease take note accordingly.\n\nYours faithfully,\n\n[ADVOCATE SIGNATURE]\n[ADVOCATE NAME]\nAdvocate for the Sender`);
        toast.success("Legal Notice template loaded. You can now customize it.");
      }
    },
    { 
      title: "Affidavit", 
      description: "Draft a sworn statement for court or official use",
      icon: <FilePlus className="h-5 w-5 text-blue-500" />,
      onClick: () => {
        setDocumentTitle("Affidavit");
        setDocumentType("Affidavit");
        setDraftContent(`AFFIDAVIT\n\nI, [DEPONENT NAME], son/daughter/wife of [FATHER/HUSBAND NAME], aged about [AGE] years, resident of [COMPLETE ADDRESS], do hereby solemnly affirm and declare as under:\n\n1. That I am the deponent of this affidavit and am fully conversant with the facts and circumstances of this case.\n\n2. That [FACT 1].\n\n3. That [FACT 2].\n\n4. That [FACT 3].\n\n5. That [FACT 4].\n\nVERIFICATION:\n\nI, the deponent above named, do hereby verify that the contents of paragraphs 1 to [LAST PARAGRAPH NUMBER] of this affidavit are true and correct to my knowledge, no part of it is false and nothing material has been concealed therefrom.\n\nVerified at [PLACE] on this ${new Date().toLocaleDateString()}.\n\n[DEPONENT SIGNATURE]\nDEPONENT\n\nIDENTIFIED BY ME:\n\n[ADVOCATE SIGNATURE]\nADVOCATE\nENROLLMENT NO. [NUMBER]`);
        toast.success("Affidavit template loaded. You can now customize it.");
      }
    },
    { 
      title: "Rental Agreement", 
      description: "Create a rental agreement with standard terms",
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      onClick: () => {
        setDocumentTitle("Rental Agreement");
        setDocumentType("Agreement");
        setDraftContent(`RENTAL AGREEMENT\n\nTHIS AGREEMENT is made and executed on this ${new Date().toLocaleDateString()} at [PLACE] by and between:\n\n[LANDLORD NAME], S/o, D/o, W/o [FATHER/HUSBAND NAME], aged about [AGE] years, residing at [ADDRESS], hereinafter called the "LESSOR/LANDLORD" (which expression shall, unless repugnant to the context or meaning thereof, mean and include his/her heirs, legal representatives, executors, administrators and assigns) of the ONE PART;\n\nAND\n\n[TENANT NAME], S/o, D/o, W/o [FATHER/HUSBAND NAME], aged about [AGE] years, residing at [ADDRESS], hereinafter called the "LESSEE/TENANT" (which expression shall, unless repugnant to the context or meaning thereof, mean and include his/her heirs, legal representatives, executors, administrators and assigns) of the OTHER PART.\n\nWHEREAS the LESSOR is the absolute owner and in possession of the premises bearing No. [PROPERTY ADDRESS], hereinafter called the "SCHEDULED PREMISES";\n\nAND WHEREAS the LESSOR has agreed to let out and the LESSEE has agreed to take on rent the SCHEDULED PREMISES for a period of [LEASE DURATION] commencing from [START DATE] and ending on [END DATE];\n\nNOW THIS DEED OF LEASE WITNESSETH AS FOLLOWS:\n\n1. RENT:\n   The LESSEE shall pay to the LESSOR a monthly rent of Rs. [RENT AMOUNT]/- (Rupees [AMOUNT IN WORDS] Only) on or before the [DAY] day of each English calendar month.\n\n2. DEPOSIT:\n   The LESSEE has paid to the LESSOR a sum of Rs. [DEPOSIT AMOUNT]/- (Rupees [AMOUNT IN WORDS] Only) as interest-free refundable security deposit, which shall be refunded by the LESSOR to the LESSEE at the time of vacating the SCHEDULED PREMISES after deducting any dues or damages, if any.\n\n3. TERM:\n   This lease shall be for a period of [LEASE DURATION] commencing from [START DATE] and ending on [END DATE]. The lease may be renewed for a further period with mutual consent of both parties on such terms and conditions as may be agreed upon.\n\n4. MAINTENANCE:\n   (a) The LESSEE shall maintain the SCHEDULED PREMISES in good condition and shall not cause any damage to the SCHEDULED PREMISES.\n   (b) The LESSEE shall carry out minor repairs at his/her own cost and expense.\n   (c) Any major repairs shall be carried out by the LESSOR at his/her cost.\n\n5. PAYMENT OF CHARGES:\n   The LESSEE shall pay all electricity, water, and gas charges as per actual consumption shown in the respective meters and any other taxes or charges levied by any local authority in respect of the SCHEDULED PREMISES during the term of the lease.\n\n6. USE OF PREMISES:\n   The LESSEE shall use the SCHEDULED PREMISES only for residential purposes and not for any commercial, illegal, or immoral purposes.\n\n7. SUB-LETTING:\n   The LESSEE shall not sub-let, assign, or part with possession of the SCHEDULED PREMISES or any part thereof to any person without the prior written consent of the LESSOR.\n\n8. TERMINATION:\n   Either party may terminate this agreement by giving [NOTICE PERIOD] months' prior notice in writing to the other party.\n\n9. JURISDICTION:\n   Any dispute arising out of or in connection with this agreement shall be subject to the exclusive jurisdiction of the courts in [JURISDICTION].\n\nIN WITNESS WHEREOF, the parties hereto have set their hands on the day, month and year first above written.\n\nSigned by the LESSOR\n[LANDLORD NAME]\nin the presence of:\n1. [WITNESS 1 NAME AND ADDRESS]\n2. [WITNESS 2 NAME AND ADDRESS]\n\nSigned by the LESSEE\n[TENANT NAME]\nin the presence of:\n1. [WITNESS 1 NAME AND ADDRESS]\n2. [WITNESS 2 NAME AND ADDRESS]`);
        toast.success("Rental Agreement template loaded. You can now customize it.");
      }
    },
  ];

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
                    <li>• Use quick starts for common document types</li>
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
          {/* Left column - Form/Prompt with Quick Starts */}
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
            
            {/* Quick Start Cards */}
            <Card className="border rounded-lg bg-white dark:bg-gray-950">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FilePlus className="h-4 w-4 text-blue-500" />
                  Quick Start Documents
                </CardTitle>
                <CardDescription>
                  Start with pre-structured document formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentQuickStarts.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={item.onClick}
                      className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors"
                    >
                      {item.icon}
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PDF Uploader Section */}
            {activeTab !== 'collaborative' && (
              <Card className="border rounded-lg bg-white dark:bg-gray-950">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Import Existing Document</CardTitle>
                  <CardDescription>
                    Upload a PDF to extract content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PdfUploader 
                    onUpload={handleDocumentUpload} 
                    onRemove={handleRemoveDocument} 
                    documents={attachedDocuments}
                    documentId="document-import"
                  />
                </CardContent>
              </Card>
            )}
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
