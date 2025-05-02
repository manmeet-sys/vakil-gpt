
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { FileText } from 'lucide-react';
import { BaseToolProps } from '../types';

interface BNSCodeAssistantProps extends BaseToolProps {}

const BNSCodeAssistant: React.FC<BNSCodeAssistantProps> = ({ useAI = false, aiDescription }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setAnalysisResult("BNS Code analysis with IPC comparisons...");
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <BaseAnalyzer
      title="BNS Code Assistant"
      description="Navigate the Bharatiya Nyaya Sanhita code with section-by-section comparison to the old IPC"
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult || undefined}
      useAI={useAI}
      aiDescription={aiDescription}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter the section number or legal concept to compare between BNS and IPC.
        </p>
      </div>
    </BaseAnalyzer>
  );
};

export default BNSCodeAssistant;
