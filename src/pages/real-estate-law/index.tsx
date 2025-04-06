
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { LandPlot } from 'lucide-react';

const RealEstateLawPage = () => {
  return (
    <LegalToolLayout
      title="Indian Real Estate Law Navigator"
      description="Comprehensive legal assistance for property transactions, RERA compliance, and real estate regulations across Indian states."
      icon={<LandPlot className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Real Estate Legal Assistant</h2>
          <p className="text-muted-foreground">
            Navigate the complex legal landscape of Indian real estate transactions, regulations, and compliance requirements 
            with specialized tools for property professionals and individuals.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">RERA Compliance Checker</h3>
            <p className="text-sm text-muted-foreground">
              Verify compliance with the Real Estate (Regulation and Development) Act across different states.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Property Document Analyzer</h3>
            <p className="text-sm text-muted-foreground">
              Review property documents for legal validity and potential issues before transactions.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Stamp Duty Calculator</h3>
            <p className="text-sm text-muted-foreground">
              Calculate accurate stamp duty and registration fees for property transactions across Indian states.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Tenancy Law Navigator</h3>
            <p className="text-sm text-muted-foreground">
              Understand rental laws, regulations, and compliance requirements in different Indian jurisdictions.
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

export default RealEstateLawPage;
