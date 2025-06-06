
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { TrendingUp, FileText, IndianRupee, Shield } from 'lucide-react';
import MADueDiligenceTool from '@/components/MADueDiligenceTool';
import MADueDiligenceSkeleton from '@/components/SkeletonLoaders/MADueDiligenceSkeleton';
import BackButton from '@/components/BackButton';

const MADueDiligencePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading delay - in a real app, you would remove this
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <LegalToolLayout
      title="Indian M&A Due Diligence"
      description="AI-powered due diligence for mergers and acquisitions in India, analyzing financial statements, contracts, and compliance records according to Indian corporate law requirements."
      icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30">
        <div className="flex space-x-2">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-400">Indian Regulatory Framework</h3>
            <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
              This tool analyzes transactions under key Indian legal frameworks including the Companies Act 2013, 
              Competition Act 2002, SEBI regulations, FEMA provisions, Income Tax Act, and GST implications specific to M&A.
            </p>
          </div>
        </div>
      </div>
      
      {isLoading ? <MADueDiligenceSkeleton /> : <MADueDiligenceTool />}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800/30">
          <div className="flex space-x-2">
            <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400">Indian Financial Compliance</h3>
              <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                Analysis includes RBI compliance requirements, cross-border transaction regulations, 
                and Indian tax implications specific to M&A transactions in various sectors.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/30">
          <div className="flex space-x-2">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-purple-800 dark:text-purple-400">PDF Document Upload</h3>
              <p className="text-sm text-purple-700 dark:text-purple-500 mt-1">
                Upload financial statements, contracts, and other due diligence documents for AI-powered analysis
                according to Indian regulatory standards and sector-specific compliance requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default MADueDiligencePage;
