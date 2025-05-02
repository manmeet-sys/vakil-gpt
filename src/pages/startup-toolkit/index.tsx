
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Briefcase, FileText, IndianRupee, Shield } from 'lucide-react';
import StartupToolkitTool from '@/components/StartupToolkitTool';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';

const StartupToolkitPage = () => {
  return (
    <LegalToolLayout
      title="Indian Startup Legal Toolkit"
      description="Comprehensive legal resources for startups operating in India, including entity formation, compliance, funding, and IP protection."
      icon={<Briefcase className="w-6 h-6 text-blue-600" />}
    >
      <BackToToolsButton className="mb-6" />
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30">
          <div className="flex space-x-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-400">Entity Formation</h3>
              <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                Generate legal documents for Private Limited, LLP, OPC, or Partnership formation under Companies Act 2013 and LLP Act 2008.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800/30">
          <div className="flex space-x-2">
            <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400">Funding & FEMA Compliance</h3>
              <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                Analyze funding documents and ensure compliance with FEMA regulations, RBI guidelines and SEBI rules for startups.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/30">
          <div className="flex space-x-2">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-purple-800 dark:text-purple-400">Regulatory Compliance</h3>
              <p className="text-sm text-purple-700 dark:text-purple-500 mt-1">
                Stay compliant with GST, DPDP Act 2023, labor laws, and sector-specific regulations relevant to Indian startups.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <StartupToolkitTool />
    </LegalToolLayout>
  );
};

export default StartupToolkitPage;
