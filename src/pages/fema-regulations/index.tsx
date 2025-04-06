
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Building } from 'lucide-react';

const FEMARegulationsPage = () => {
  return (
    <LegalToolLayout
      title="FEMA Regulations Navigator"
      description="Comprehensive guide to Foreign Exchange Management Act regulations for Indian businesses engaged in cross-border transactions and investments."
      icon={<Building className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">FEMA Compliance Assistant</h2>
          <p className="text-muted-foreground">
            Navigate the complex requirements of India's Foreign Exchange Management Act for foreign 
            investments, cross-border transactions, and overseas business operations.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">FDI Policy Analyzer</h3>
            <p className="text-sm text-muted-foreground">
              Understand foreign direct investment restrictions and opportunities in various Indian sectors.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">RBI Compliance Checker</h3>
            <p className="text-sm text-muted-foreground">
              Verify compliance with Reserve Bank of India regulations for foreign exchange transactions.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">ODI Regulations</h3>
            <p className="text-sm text-muted-foreground">
              Navigate Overseas Direct Investment rules for Indian entities investing abroad.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">ECB Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              Understand External Commercial Borrowings framework and compliance requirements.
            </p>
          </div>
        </div>
        
        <div className="text-center text-muted-foreground text-sm mt-8">
          This tool is being developed and will be available soon.
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default FEMARegulationsPage;
