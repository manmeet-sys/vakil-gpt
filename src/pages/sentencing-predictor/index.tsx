
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, BookOpen, Gavel } from 'lucide-react';
import SentencingPredictorTool from '@/components/practice-area-tools/criminal-law/SentencingPredictorTool';
import SentencingPredictorSkeleton from '@/components/SkeletonLoaders/SentencingPredictorSkeleton';
import BackButton from '@/components/BackButton';

const SentencingPredictorPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading delay - in a real app, you would remove this
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <LegalToolLayout
      title="AI Indian Sentencing Predictor"
      description="Analyze case specifics to predict sentencing outcomes based on Indian laws, including Bharatiya Nyaya Sanhita (BNS) provisions and precedents from Indian courts."
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <div className="flex space-x-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Indian Legal Framework</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              This tool incorporates the new Bharatiya Nyaya Sanhita (BNS) 2023, replacing the Indian Penal Code, along with 
              judicial precedents from the Supreme Court of India and various High Courts.
            </p>
          </div>
        </div>
      </div>
      
      {isLoading ? <SentencingPredictorSkeleton /> : <SentencingPredictorTool />}
      
      <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex space-x-2">
          <Gavel className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-300">Indian Legal Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              This prediction tool provides estimates based on historical data and is not a substitute for legal advice. 
              Sentencing outcomes in India vary by jurisdiction, judge, and specific case circumstances. Always consult with a qualified 
              Indian legal practitioner for accurate legal guidance.
            </p>
          </div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default SentencingPredictorPage;
