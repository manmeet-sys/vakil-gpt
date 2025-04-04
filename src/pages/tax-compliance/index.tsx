
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee } from 'lucide-react';
import TaxComplianceTool from '@/components/TaxComplianceTool';

const TaxCompliancePage = () => {
  return (
    <LegalToolLayout
      title="Tax Law & Compliance Advisor"
      description="AI-powered tool providing tax law guidance and comprehensive risk analysis for Indian tax laws and regulations."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <TaxComplianceTool />
    </LegalToolLayout>
  );
};

export default TaxCompliancePage;
