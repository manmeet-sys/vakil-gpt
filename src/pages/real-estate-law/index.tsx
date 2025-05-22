
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Building, BookOpen } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RealEstateLawPage = () => {
  return (
    <LegalToolLayout
      title="Real Estate Law Tools"
      description="AI-powered assistance for real estate law practice in India"
      icon={<Building className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <div className="flex space-x-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Indian Real Estate Law Framework</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              These tools incorporate the Real Estate (Regulation and Development) Act, 2016 (RERA), the Transfer of Property Act, 
              the Registration Act, and relevant case law from Indian courts.
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer className="mt-6">
        <Card className="shadow-sm dark:bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Real Estate Law Practice Tools</CardTitle>
            <CardDescription>
              Specialized AI tools for real estate law practice in India
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Our real estate law tools are being enhanced with additional features. 
              Please check back soon for updates.
            </p>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </LegalToolLayout>
  );
};

export default RealEstateLawPage;
