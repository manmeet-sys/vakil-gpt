
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import AMLComplianceTool from '@/components/AMLComplianceTool';

const AMLCompliancePage = () => {
  return (
    <LegalToolLayout
      title="AML & KYC Compliance Checker"
      description="Ensure businesses meet anti-money laundering and Know Your Customer requirements with comprehensive automated checks."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <AMLComplianceTool />
    </LegalToolLayout>
  );
};

export default AMLCompliancePage;
