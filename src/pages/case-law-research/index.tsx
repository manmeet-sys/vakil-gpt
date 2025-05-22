
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Search, BookOpen, Scale } from 'lucide-react';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import BackButton from '@/components/BackButton';
import CriminalCaseLawResearch from '@/components/practice-area-tools/criminal-law/CriminalCaseLawResearch';

const CaseLawResearchPage = () => {
  return (
    <LegalToolLayout
      title="Case Law Research"
      description="Search and analyze Indian case law using AI-powered legal research tools"
      icon={<Search className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <div className="flex space-x-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Indian Legal Research</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              This tool provides access to India's extensive case law database, including Supreme Court,
              High Courts, and tribunal decisions. Leverage AI to find relevant precedents and legal principles.
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer className="mt-6">
        <div className="space-y-8">
          <CriminalCaseLawResearch 
            useAI={true}
            aiDescription="Our AI will analyze your query and find the most relevant cases, extracting key legal principles and precedents from Indian courts."
          />
        </div>
      </ResponsiveContainer>
      
      <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex space-x-2">
          <Scale className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-300">Legal Research Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              While our AI-powered case law research tool strives for accuracy, it should not replace thorough legal research.
              Always verify cases and principles with original sources before relying on them in legal proceedings.
            </p>
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default CaseLawResearchPage;
