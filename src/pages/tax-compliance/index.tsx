
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee } from 'lucide-react';
import TaxComplianceTool from '@/components/TaxComplianceTool';

const TaxCompliancePage = () => {
  return (
    <LegalToolLayout
      title="Indian Tax Law & Compliance Advisor"
      description="AI-powered tool providing comprehensive tax guidance and compliance analysis for Indian tax laws including GST, Income Tax, and TDS regulations."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <TaxComplianceTool />
    </LegalToolLayout>
  );
};

export default TaxCompliancePage;
