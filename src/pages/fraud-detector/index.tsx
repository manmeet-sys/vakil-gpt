
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import FraudDetectorTool from '@/components/FraudDetectorTool';

const FraudDetectorPage = () => {
  return (
    <LegalToolLayout
      title="Financial Fraud Detector"
      description="Identifies potentially fraudulent financial activities and compliance violations using AI pattern recognition."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <FraudDetectorTool />
    </LegalToolLayout>
  );
};

export default FraudDetectorPage;
