
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, Layout, Plus, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/BackButton';
import DocumentDraftingForm from '@/components/document-drafting/DocumentDraftingForm';
import DocumentTemplateSelector from '@/components/document-drafting/DocumentTemplateSelector';
import SearchDocuments from '@/components/document-drafting/SearchDocuments';
import PromptBasedGenerator from '@/components/document-drafting/PromptBasedGenerator';
import { motion } from 'framer-motion';

const LegalDocumentDraftingPage = () => {
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [documentText, setDocumentText] = useState<string>('');

  const handleTemplateSelect = (templateId: string) => {
    console.log('Template selected:', templateId);
    setActiveTab('form');
  };

  const handleSearch = (query: string, type: string, dateRange: string) => {
    console.log('Search triggered:', query, type, dateRange);
    // Implement search logic here
  };

  const handleDraftGenerated = (title: string, type: string, content: string) => {
    setDocumentText(content);
    setActiveTab('form');
  };

  return (
    <LegalToolLayout
      title="Legal Document Drafting"
      description="Create, customize, and manage legal documents with our comprehensive template library and AI-powered generation tools"
      icon={<FileText className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />

      <div className="container mx-auto px-4 py-6">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Professional Document Creation
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Generate professional legal documents using our extensive template library or create custom documents with AI assistance. 
              All documents are compliant with Indian legal standards and formatting requirements.
            </p>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
            <TabsTrigger value="templates" className="flex items-center gap-2 text-sm">
              <Layout className="h-4 w-4" />
              Browse Templates
            </TabsTrigger>
            <TabsTrigger value="ai-generator" className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Create Document
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4" />
              Search Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Layout className="h-5 w-5 text-green-600" />
                    Document Templates
                  </CardTitle>
                  <CardDescription className="text-base">
                    Choose from thousands of professionally crafted legal document templates, 
                    organized by category and practice area
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <DocumentTemplateSelector onSelect={handleTemplateSelect} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="ai-generator" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <PromptBasedGenerator onDraftGenerated={handleDraftGenerated} />
            </motion.div>
          </TabsContent>

          <TabsContent value="form" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Plus className="h-5 w-5 text-purple-600" />
                    Document Editor
                  </CardTitle>
                  <CardDescription className="text-base">
                    Create and customize your legal document with our advanced editor
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <DocumentDraftingForm 
                    onDocumentGenerated={setDocumentText}
                    initialContent={documentText}
                  />
                </CardContent>
              </Card>
            </motion.div>
            
            {documentText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                      Document Preview
                    </CardTitle>
                    <CardDescription>
                      Review your generated document before finalizing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg p-4 border">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{documentText}</pre>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Search className="h-5 w-5 text-orange-600" />
                    Search Document Library
                  </CardTitle>
                  <CardDescription className="text-base">
                    Find existing documents and templates in your personal library
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <SearchDocuments onSearch={handleSearch} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
