
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { FileWarning } from 'lucide-react';
import { BaseToolProps } from '../types';

interface ContractRiskAnalyzerProps extends BaseToolProps {}

const ContractRiskAnalyzer: React.FC<ContractRiskAnalyzerProps> = ({ useAI = false, aiDescription }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysisResult("This contract contains several high risk clauses...");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <BaseAnalyzer
      title="Contract Risk Analyzer"
      description="AI-powered tool to analyze contracts and identify potential risks, liabilities, and compliance issues"
      icon={<FileWarning className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult || undefined}
      useAI={useAI}
      aiDescription={aiDescription}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload or paste your contract to analyze potential risks and compliance issues.
        </p>
      </div>
    </BaseAnalyzer>
  );
};

export default ContractRiskAnalyzer;
