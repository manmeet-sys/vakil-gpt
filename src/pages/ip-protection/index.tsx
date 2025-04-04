
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import RefinedIPProtectionTool from '@/components/RefinedIPProtectionTool';

const IPProtectionPage = () => {
  return (
    <LegalToolLayout
      title="Indian IP Protection Suite"
      description="Access official Indian government resources for intellectual property protection, drafting assistance, and monitoring tools."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <RefinedIPProtectionTool />
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
