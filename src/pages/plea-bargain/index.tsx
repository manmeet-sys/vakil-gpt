
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scales } from 'lucide-react';
import PleaBargainTool from '@/components/PleaBargainTool';

const PleaBargainPage = () => {
  return (
    <LegalToolLayout
      title="Plea Bargain Assistant"
      description="AI-powered tool to analyze plea bargain options, compare potential outcomes, and provide guidance on criminal defense strategies."
      icon={<Scales className="w-6 h-6 text-blue-600" />}
    >
      <PleaBargainTool />
    </LegalToolLayout>
  );
};

export default PleaBargainPage;
