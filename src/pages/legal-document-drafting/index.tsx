
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, Search, Filter, Plus, Layout, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/BackButton';
import DocumentDraftingForm from '@/components/document-drafting/DocumentDraftingForm';
import DocumentTemplateSelector from '@/components/document-drafting/DocumentTemplateSelector';
import SearchDocuments from '@/components/document-drafting/SearchDocuments';
import OpenAIFlashAnalyzer from '@/components/OpenAIFlashAnalyzer';

const LegalDocumentDraftingPage = () => {
  const [activeTab, setActiveTab] = useState<string>('templates');
  const [documentText, setDocumentText] = useState<string>('');

  const handleAnalysisComplete = (analysis: string) => {
    setDocumentText(analysis);
    setActiveTab('form');
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('Template selected:', templateId);
    setActiveTab('form');
  };

  const handleSearch = (query: string, type: string, dateRange: string) => {
    console.log('Search triggered:', query, type, dateRange);
    // Implement search logic here
  };

  return (
    <LegalToolLayout
      title="Legal Document Drafting"
      description="Create, customize, and manage legal documents with our comprehensive template library and AI assistance"
      icon={<FileText className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Documents
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              AI Analyzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Document Templates</h2>
                <p className="text-muted-foreground">
                  Choose from thousands of professionally crafted legal document templates
                </p>
              </div>
            </div>
            <DocumentTemplateSelector onSelect={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="form" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Create New Document</h2>
                <p className="text-muted-foreground">
                  Draft a new legal document from scratch or customize a template
                </p>
              </div>
            </div>
            <DocumentDraftingForm onDocumentGenerated={setDocumentText} />
            
            {documentText && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-zinc-800">
                <h3 className="font-semibold mb-2">Generated Document Preview</h3>
                <div className="max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{documentText}</pre>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Search Documents</h2>
                <p className="text-muted-foreground">
                  Find existing documents and templates in your library
                </p>
              </div>
            </div>
            <SearchDocuments onSearch={handleSearch} />
          </TabsContent>

          <TabsContent value="analyzer" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">AI Document Analyzer</h2>
                <p className="text-muted-foreground">
                  Upload and analyze documents with AI-powered insights
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <OpenAIFlashAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Recent Analyses
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Filter className="h-4 w-4 mr-2" />
                      Analysis History
                    </Button>
                  </div>
                </div>
                
                {documentText && (
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Analysis Complete
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your document analysis is ready. Switch to the "Create New" tab to review and edit.
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => setActiveTab('form')}
                    >
                      Review Analysis
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
