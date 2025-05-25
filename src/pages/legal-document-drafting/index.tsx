import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import DocumentDraftingForm from '@/components/document-drafting/DocumentDraftingForm';
import DocumentTemplateSelector from '@/components/document-drafting/DocumentTemplateSelector';
import SearchDocuments from '@/components/document-drafting/SearchDocuments';
import OpenAIFlashAnalyzer from '@/components/OpenAIFlashAnalyzer';

const LegalDocumentDraftingPage = () => {
  const [activeTab, setActiveTab] = useState<string>('form');
  const [documentText, setDocumentText] = useState<string>('');

  const handleAnalysisComplete = (analysis: string) => {
    setDocumentText(analysis);
  };

  const handleSearch = (query: string, type: string, dateRange: string) => {
    console.log('Search triggered:', query, type, dateRange);
    // Implement search logic here
  };

  return (
    <LegalToolLayout
      title="Legal Document Drafting"
      description="Create, search, and analyze legal documents with AI-powered assistance"
      icon={<FileText className="h-6 w-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {activeTab === 'form' && (
              <DocumentDraftingForm onDocumentGenerated={setDocumentText} />
            )}
            {activeTab === 'template' && (
              <DocumentTemplateSelector onDocumentSelected={setDocumentText} />
            )}
            {activeTab === 'search' && (
              <SearchDocuments onSearch={handleSearch} />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('form')}
                  className="space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>New</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('search')}
                  className="space-x-1"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('template')}
                  className="space-x-1"
                >
                  <Filter className="h-4 w-4" />
                  <span>Templates</span>
                </Button>
                <OpenAIFlashAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              </div>
            </div>

            {documentText && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Document Preview</h3>
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-zinc-800">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{documentText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default LegalDocumentDraftingPage;
