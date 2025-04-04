
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import EnhancedIPProtectionTool from '@/components/EnhancedIPProtectionTool';

const IPProtectionPage = () => {
  return (
    <LegalToolLayout
      title="Indian IP Protection Suite"
      description="Access official intellectual property resources under Indian law, get drafting assistance, and learn about IP protection strategies."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <EnhancedIPProtectionTool />
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
