
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee } from 'lucide-react';

const GSTCompliancePage = () => {
  return (
    <LegalToolLayout
      title="Indian GST Compliance Advisor"
      description="AI-powered tool providing comprehensive guidance on Goods and Services Tax compliance, filings, and regulations in India."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">GST Compliance Assistant</h2>
          <p className="text-muted-foreground">
            This tool helps you navigate the complex Indian GST landscape, ensuring your business 
            remains compliant with all filing requirements and tax regulations.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">GST Filing Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Track important GST filing deadlines and get reminders for GSTR-1, GSTR-3B, and other returns.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">HSN Code Lookup</h3>
            <p className="text-sm text-muted-foreground">
              Find the correct Harmonized System of Nomenclature (HSN) codes for your products and services.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Input Tax Credit Calculator</h3>
            <p className="text-sm text-muted-foreground">
              Calculate available input tax credits and optimize your GST payments.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">E-Invoicing Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Understand e-invoicing requirements and implement compliant systems.
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

export default GSTCompliancePage;
