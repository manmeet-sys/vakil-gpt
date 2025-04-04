
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import EnhancedIPProtectionTool from '@/components/EnhancedIPProtectionTool';

const IPProtectionPage = () => {
  return (
    <LegalToolLayout
      title="Indian IP Protection Suite"
      description="Search for trademarks, patents, copyrights, and designs to protect intellectual property under Indian law and monitor for potential infringements."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <EnhancedIPProtectionTool />
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
