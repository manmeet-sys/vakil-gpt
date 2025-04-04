
import React, { useState, useEffect } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale } from 'lucide-react';
import PleaBargainTool from '@/components/PleaBargainTool';
import PleaBargainSkeleton from '@/components/SkeletonLoaders/PleaBargainSkeleton';

const PleaBargainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading delay - in a real app, you would remove this
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <LegalToolLayout
      title="Indian Plea Bargain Assistant"
      description="AI-powered tool to analyze plea bargain options under the Bharatiya Nyaya Sanhita (BNS), compare potential outcomes, and provide guidance on criminal defense strategies in the Indian legal system."
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      {isLoading ? <PleaBargainSkeleton /> : <PleaBargainTool />}
    </LegalToolLayout>
  );
};

export default PleaBargainPage;
