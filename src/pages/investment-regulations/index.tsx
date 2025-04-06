
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Calculator } from 'lucide-react';

const InvestmentRegulationsPage = () => {
  return (
    <LegalToolLayout
      title="Indian Investment Regulations Guide"
      description="Navigate SEBI regulations, securities laws, and investment compliance requirements for the Indian financial markets."
      icon={<Calculator className="w-6 h-6 text-blue-600" />}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Investment Regulations Assistant</h2>
          <p className="text-muted-foreground">
            Understand and navigate the complex regulatory framework governing investments, securities, 
            and financial markets in India with our specialized legal tools.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">SEBI Compliance Guide</h3>
            <p className="text-sm text-muted-foreground">
              Navigate Securities and Exchange Board of India regulations for market participants.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">PMS and AIF Regulations</h3>
            <p className="text-sm text-muted-foreground">
              Understand compliance requirements for Portfolio Management Services and Alternative Investment Funds.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Disclosure Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Track mandatory disclosures for listed companies and significant shareholders.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Insider Trading Prevention</h3>
            <p className="text-sm text-muted-foreground">
              Implement systems to prevent insider trading violations and ensure compliance.
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

export default InvestmentRegulationsPage;
