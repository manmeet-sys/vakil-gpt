
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { Search } from 'lucide-react';
import { BaseToolProps } from '../types';

interface TitleSearchAssistantProps extends BaseToolProps {}

const TitleSearchAssistant: React.FC<TitleSearchAssistantProps> = ({ useAI = false, aiDescription }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysisResult("Property title analysis and chain of title verification...");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <BaseAnalyzer
      title="Title Search Assistant"
      description="Comprehensive tool to analyze property documents, verify ownership chain, and identify potential title defects"
      icon={<Search className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult || undefined}
      useAI={useAI}
      aiDescription={aiDescription}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter property details to analyze title documents and ownership history.
        </p>
      </div>
    </BaseAnalyzer>
  );
};

export default TitleSearchAssistant;
