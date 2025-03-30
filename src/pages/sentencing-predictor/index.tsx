
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale } from 'lucide-react';
import SentencingPredictorTool from '@/components/SentencingPredictorTool';

const SentencingPredictorPage = () => {
  return (
    <LegalToolLayout
      title="AI Sentencing Predictor"
      description="Analyze case specifics to predict sentencing outcomes based on historical data and sentencing guidelines."
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      <SentencingPredictorTool />
    </LegalToolLayout>
  );
};

export default SentencingPredictorPage;
