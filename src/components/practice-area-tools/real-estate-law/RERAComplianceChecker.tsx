
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { Building2 } from 'lucide-react';
import { BaseToolProps } from '../types';

interface RERAComplianceCheckerProps extends BaseToolProps {}

const RERAComplianceChecker: React.FC<RERAComplianceCheckerProps> = ({ useAI = false, aiDescription }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysisResult("RERA compliance analysis and recommendations...");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <BaseAnalyzer
      title="RERA Compliance Assistant"
      description="Interactive system to verify Real Estate Regulatory Authority compliance for projects and generate required documentation"
      icon={<Building2 className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult || undefined}
      useAI={useAI}
      aiDescription={aiDescription}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter project details to verify RERA compliance requirements and documentation needs.
        </p>
      </div>
    </BaseAnalyzer>
  );
};

export default RERAComplianceChecker;
