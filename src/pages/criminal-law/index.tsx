
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Gavel, BookOpen } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CriminalLawPage = () => {
  return (
    <LegalToolLayout
      title="Criminal Law Tools"
      description="AI-powered assistance for criminal law practice in India"
      icon={<Gavel className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <div className="mb-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
        <div className="flex space-x-2">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Indian Criminal Law Framework</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              These tools incorporate the Bharatiya Nyaya Sanhita (BNS) 2023, which has replaced the Indian Penal Code, along with 
              the Criminal Procedure Code and relevant case law from Indian courts.
            </p>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer className="mt-6">
        <Card className="shadow-sm dark:bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Criminal Law Practice Tools</CardTitle>
            <CardDescription>
              Specialized AI tools for criminal law practice in India
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="/sentencing-predictor" className="block p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <h3 className="font-medium">Sentencing Predictor</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Analyze case details to predict likely sentencing outcomes
                </p>
              </a>
              <a href="/plea-bargain" className="block p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <h3 className="font-medium">Plea Bargaining Assistant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Guidance on plea bargaining options under Indian law
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </LegalToolLayout>
  );
};

export default CriminalLawPage;
