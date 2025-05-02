
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { FileCheck } from 'lucide-react';
import { BaseToolProps } from '../types';

interface PropertyDueDiligenceProps extends BaseToolProps {}

const PropertyDueDiligence: React.FC<PropertyDueDiligenceProps> = ({ useAI = false, aiDescription }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysisResult("Property due diligence analysis and findings...");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <BaseAnalyzer
      title="Property Due Diligence"
      description="Structured workflow for conducting comprehensive due diligence on property transactions with customizable checklists"
      icon={<FileCheck className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult || undefined}
      useAI={useAI}
      aiDescription={aiDescription}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter property details to conduct comprehensive due diligence analysis.
        </p>
      </div>
    </BaseAnalyzer>
  );
};

export default PropertyDueDiligence;
