
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BarChart2 } from 'lucide-react';
import LitigationPredictionTool from '@/components/LitigationPredictionTool';
import BackButton from '@/components/BackButton';

const LitigationPredictionPage = () => {
  return (
    <LegalToolLayout
      title="Indian Litigation Predictor"
      description="AI-powered litigation outcome prediction based on Indian case law, statutes, and judicial trends"
      icon={<BarChart2 className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      <LitigationPredictionTool />
    </LegalToolLayout>
  );
};

export default LitigationPredictionPage;
