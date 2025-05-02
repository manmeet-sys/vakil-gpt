
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { Search } from 'lucide-react';
import { BaseToolProps } from '../types';

interface CriminalCaseLawResearchProps extends BaseToolProps {}

const CriminalCaseLawResearch: React.FC<CriminalCaseLawResearchProps> = ({ useAI = false, aiDescription }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysisResult("Relevant criminal case precedents and analysis...");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <BaseAnalyzer
      title="Criminal Case Law Research"
      description="Access a database of criminal precedents mapped to BNS provisions with AI-powered search"
      icon={<Search className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult || undefined}
      useAI={useAI}
      aiDescription={aiDescription}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter legal issues or BNS sections to find relevant criminal case precedents.
        </p>
      </div>
    </BaseAnalyzer>
  );
};

export default CriminalCaseLawResearch;
