
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { DollarSign } from 'lucide-react';
import TaxComplianceTool from '@/components/TaxComplianceTool';

const TaxCompliancePage = () => {
  return (
    <LegalToolLayout
      title="Tax Law & Compliance Advisor"
      description="AI-powered tool providing tax law guidance and comprehensive risk analysis across multiple jurisdictions."
      icon={<DollarSign className="w-6 h-6 text-blue-600" />}
    >
      <TaxComplianceTool />
    </LegalToolLayout>
  );
};

export default TaxCompliancePage;
