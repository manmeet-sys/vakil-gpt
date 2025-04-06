
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import EnhancedIPProtectionTool from '@/components/EnhancedIPProtectionTool';
import BackButton from '@/components/BackButton';

const IPProtectionPage = () => {
  return (
    <LegalToolLayout
      title="Indian IP Protection Suite"
      description="Access official intellectual property resources under Indian law, get drafting assistance, and learn about IP protection strategies."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      <EnhancedIPProtectionTool />
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
