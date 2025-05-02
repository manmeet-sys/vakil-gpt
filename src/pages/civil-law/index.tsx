
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, Search } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LimitationPeriodCalculator,
  CauseOfActionAnalyzer,
  CivilReliefGenerator,
  CivilPrecedentSearch
} from '@/components/practice-area-tools/civil-law';

const CivilLawPage = () => {
  const civilLegalPrinciples = [
    {
      title: 'Burden of Proof',
      description: 'The burden of proof in civil cases lies with the plaintiff to establish their case on a preponderance of probabilities.',
      source: 'Section 101, Indian Evidence Act'
    },
    {
      title: 'Specific Performance',
      description: 'Specific performance is a discretionary equitable remedy available when monetary damages are inadequate compensation.',
      source: 'Section 10, Specific Relief Act'
    },
    {
      title: 'Res Judicata',
      description: 'A matter once judicially decided is finally decided and cannot be subject to litigation again between the same parties.',
      source: 'Section 11, Civil Procedure Code'
    },
    {
      title: 'Doctrine of Estoppel',
      description: 'A person is precluded from denying or asserting anything contrary to what has been established as truth by their previous actions or statements.',
      source: 'Section 115, Indian Evidence Act'
    },
    {
      title: 'Limitation Period',
      description: 'Civil actions must be brought within prescribed time limits, beyond which the right to legal remedy is barred.',
      source: 'Limitation Act, 1963'
    }
  ];
  
  const civilLawUpdates = [
    {
      title: 'Commercial Courts Amendment',
      date: '2024-04-10',
      description: 'The Commercial Courts Act has been amended to increase the pecuniary jurisdiction threshold to ₹5 crore.',
      source: 'Commercial Courts (Amendment) Act, 2024'
    },
    {
      title: 'New CPC Rules for Virtual Hearings',
      date: '2024-03-15',
      description: 'The Civil Procedure Code has been updated with comprehensive rules for conducting virtual hearings in civil matters.',
      source: 'Gazette Notification dated 15.03.2024'
    },
    {
      title: 'Supreme Court on Specific Performance',
      date: '2024-02-28',
      description: 'New precedent in Mehta v. Kumar redefines the requirements for specific performance of contracts in property disputes.',
      source: 'Supreme Court of India, Civil Appeal No. 1438 of 2024'
    },
    {
      title: 'E-Filing Mandatory for Commercial Disputes',
      date: '2024-02-10',
      description: 'E-filing has been made mandatory for all commercial disputes across all High Courts and Commercial Courts.',
      source: 'Supreme Court Order dated 10.02.2024'
    }
  ];

  return (
    <LegalToolLayout
      title="Civil Law Practice Tools"
      description="Specialized tools for civil litigation including cause of action analysis, limitation period calculation, and document generation"
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      <PracticeAreaHeader
        title="Civil Law Practice" 
        description="Tools and resources for Indian civil litigation and procedure"
        icon={<Scale className="h-6 w-6 text-blue-600" />}
      />
      
      <div className="mb-8">
        <Tabs defaultValue="limitation" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="limitation">Limitation Calculator</TabsTrigger>
            <TabsTrigger value="cause-of-action">Cause of Action</TabsTrigger>
            <TabsTrigger value="relief-generator">Relief Generator</TabsTrigger>
            <TabsTrigger value="precedent">Precedent Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="limitation" className="mt-0">
            <LimitationPeriodCalculator />
          </TabsContent>
          
          <TabsContent value="cause-of-action" className="mt-0">
            <CauseOfActionAnalyzer />
          </TabsContent>
          
          <TabsContent value="relief-generator" className="mt-0">
            <CivilReliefGenerator />
          </TabsContent>
          
          <TabsContent value="precedent" className="mt-0">
            <CivilPrecedentSearch />
          </TabsContent>
        </Tabs>
      </div>
      
      <LegalUpdatesSection
        lawUpdates={civilLawUpdates}
        keyLegalPrinciples={civilLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CivilLawPage;
