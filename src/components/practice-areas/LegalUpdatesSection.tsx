
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Gavel, BookOpen } from 'lucide-react';

interface LegalUpdate {
  title: string;
  date: string;
  description: string;
  source?: string;
}

interface LegalPrinciple {
  title: string;
  description: string;
  source: string;
}

interface LegalUpdatesSectionProps {
  lawUpdates: LegalUpdate[];
  keyLegalPrinciples: LegalPrinciple[];
}

const LegalUpdatesSection: React.FC<LegalUpdatesSectionProps> = ({ lawUpdates, keyLegalPrinciples }) => {
  return (
    <Card className="mt-6 border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Legal Resources & Updates
        </CardTitle>
        <CardDescription>
          Recent legal developments and key principles in this practice area
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="updates">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Updates
            </TabsTrigger>
            <TabsTrigger value="principles" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Key Principles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="updates" className="mt-4 space-y-4">
            {lawUpdates.map((update, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                <h4 className="font-medium text-sm">{update.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{update.date}</p>
                <p className="text-sm mt-1">{update.description}</p>
                {update.source && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Source: {update.source}</p>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="principles" className="mt-4 space-y-4">
            {keyLegalPrinciples.map((principle, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                <h4 className="font-medium text-sm">{principle.title}</h4>
                <p className="text-sm mt-1">{principle.description}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Source: {principle.source}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LegalUpdatesSection;
