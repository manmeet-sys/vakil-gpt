
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, Gavel } from 'lucide-react';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import BackButton from '@/components/BackButton';
import PleaBargainAssistant from '@/components/practice-area-tools/criminal-law/PleaBargainAssistant';

const PleaBargainPage = () => {
  return (
    <LegalToolLayout
      title="Plea Bargaining Assistant"
      description="AI-powered assistance for analyzing plea bargaining options under Indian criminal procedure"
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <div className="flex space-x-2">
          <Gavel className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Indian Plea Bargaining Framework</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              This tool incorporates Chapter XXIA of the Criminal Procedure Code, 1973 (Sections 265A to 265L) 
              which governs plea bargaining in India, along with relevant case law and judicial precedents.
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer className="mt-6">
        <div className="space-y-8">
          <PleaBargainAssistant 
            useAI={true}
            aiDescription="Our AI assistant will analyze case details and provide guidance on plea bargaining options under Indian law."
          />
        </div>
      </ResponsiveContainer>
      
      <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex space-x-2">
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-300">Legal Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              This tool provides guidance based on Indian legal provisions but should not replace professional legal advice.
              Always consult a qualified advocate for specific legal matters related to plea bargaining.
            </p>
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default PleaBargainPage;
