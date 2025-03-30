
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import IPProtectionTool from '@/components/IPProtectionTool';

const IPProtectionPage = () => {
  return (
    <LegalToolLayout
      title="IP Protection Suite"
      description="Search for trademarks, patents, and copyrights to protect intellectual property and monitor for potential infringements."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <IPProtectionTool />
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
