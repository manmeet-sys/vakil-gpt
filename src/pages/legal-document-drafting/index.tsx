
import React, { useState } from 'react';
import { FileText, Pen, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import LegalToolLayout from '@/components/LegalToolLayout';
import DocumentDraftingForm from '@/components/document-drafting/DocumentDraftingForm';
import DocumentPreview from '@/components/document-drafting/DocumentPreview';
import DocumentTemplateList from '@/components/document-drafting/DocumentTemplateList';

const LegalDocumentDraftingPage = () => {
  const [draftContent, setDraftContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  
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
      description="Create professional legal documents with templates and AI assistance"
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <motion.div 
        className="container mx-auto px-4 py-6 max-w-7xl"
        initial="initial"
        animate="animate"
        variants={pageVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Form and Templates */}
          <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
            {/* Document Generation Form */}
            <DocumentDraftingForm onDraftGenerated={handleDraftGenerated} />
            
            {/* Document Templates Section */}
            <DocumentTemplateList onTemplateSelect={(template) => {
              setDocumentTitle(template.title);
              setDocumentType(template.type);
              setDraftContent(template.content);
              toast.success(`${template.title} template loaded!`);
            }} />
          </motion.div>
          
          {/* Right column - Document Preview */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <DocumentPreview 
              title={documentTitle}
              type={documentType}
              content={draftContent}
              onCopy={handleCopyContent}
              onDownload={handleDownloadDocument}
            />
          </motion.div>
        </div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
