
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, FileText, BookOpen, Search } from 'lucide-react';
import EnhancedIPProtectionTool from '@/components/EnhancedIPProtectionTool';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';

const IPProtectionPage = () => {
  return (
    <LegalToolLayout
      title="Indian IP Protection Suite"
      description="Access official intellectual property resources under Indian law, get drafting assistance, and learn about IP protection strategies."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <BackToToolsButton className="mb-6" />
      
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30">
          <div className="flex space-x-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-400">Patents & Designs</h3>
              <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                Generate patent applications compliant with Indian Patent Act 1970, including draft specifications and claims.
                Create design applications under the Designs Act 2000 with visual representation guidance.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/30">
          <div className="flex space-x-2">
            <Search className="h-5 w-5 text-purple-600 dark:text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-purple-800 dark:text-purple-400">Trademarks & Copyright</h3>
              <p className="text-sm text-purple-700 dark:text-purple-500 mt-1">
                Conduct trademark availability searches in the Indian Trademarks Registry database. 
                Generate trademark applications under the Trade Marks Act 1999 and copyright registrations
                under the Copyright Act 1957.
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800/30">
          <div className="flex space-x-2">
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-400">Enforcement Strategies</h3>
              <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                Access guidance on IP enforcement including cease and desist templates, remedies under Indian law,
                and specialized IP tribunal procedures for efficient dispute resolution.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-amber-100 dark:bg-amber-800/50 rounded-full">
              <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-amber-800 dark:text-amber-400">Indian IP Protection Framework</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              Our tools are specifically designed for the Indian IP ecosystem, incorporating the latest amendments to IP laws and regulations.
              Get access to templates and generators that comply with the Controller General of Patents, Designs & Trade Marks (CGPDTM) requirements,
              along with guidance on geographical indications and traditional knowledge protection unique to India.
            </p>
          </div>
        </div>
      </div>
      
      <EnhancedIPProtectionTool />
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
