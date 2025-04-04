
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { TrendingUp } from 'lucide-react';
import MADueDiligenceTool from '@/components/MADueDiligenceTool';

const MADueDiligencePage = () => {
  return (
    <LegalToolLayout
      title="M&A Due Diligence"
      description="AI scans financial statements, contracts, and compliance records to identify potential risks in mergers and acquisitions under Indian corporate law."
      icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
    >
      <MADueDiligenceTool />
    </LegalToolLayout>
  );
};

export default MADueDiligencePage;
