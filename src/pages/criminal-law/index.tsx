
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Gavel, Library, BookOpen, Scale, AlertTriangle, FileText, Search, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BNSCodeAssistant,
  SentencingPredictorTool,
  PleaBargainAssistant,
  CriminalCaseLawResearch
} from '@/components/practice-area-tools/criminal-law';

const CriminalLawPage = () => {
  const criminalLawUpdates = [
    {
      title: 'BNS Sections 108-111 Implementation',
      date: '2024-04-15',
      description: 'New guidelines for sections 108-111 of BNS regarding offenses against public tranquility have been implemented nationwide.',
      source: 'Ministry of Home Affairs'
    },
    {
      title: 'BNSS Digital Evidence Rules',
      date: '2024-04-01',
      description: 'Updated procedural rules for digital evidence collection and preservation under the Bharatiya Nagarik Suraksha Sanhita have been released.',
      source: 'Law Commission of India'
    },
    {
      title: 'Supreme Court: BNS Interpretation',
      date: '2024-03-22',
      description: 'Landmark judgment in Sharma v. Union of India provides clarification on the interpretation of criminal intent under the new BNS provisions.',
      source: 'Supreme Court of India'
    },
    {
      title: 'Video Conferencing for Remand Extended',
      date: '2024-03-10',
      description: 'Supreme Court extends provisions allowing video conferencing for remand proceedings under the BNSS for another year.',
      source: 'Supreme Court Order dated 10.03.2024'
    }
  ];
  
  const criminalLegalPrinciples = [
    {
      title: 'Presumption of Innocence',
      description: 'Every person accused of a crime is presumed innocent until proven guilty beyond reasonable doubt.',
      source: 'Article 21, Constitution of India'
    },
    {
      title: 'Mens Rea Requirement',
      description: 'Criminal liability generally requires both a prohibited act (actus reus) and a guilty mind (mens rea).',
      source: 'Section 34, BNS 2023'
    },
    {
      title: 'Protection Against Self-Incrimination',
      description: 'No person accused of an offense shall be compelled to be a witness against themselves.',
      source: 'Article 20(3), Constitution of India'
    },
    {
      title: 'Double Jeopardy',
      description: 'No person shall be prosecuted and punished for the same offense more than once.',
      source: 'Article 20(2), Constitution of India'
    },
    {
      title: 'Proportionality in Sentencing',
      description: 'Punishment must be proportionate to the gravity of the offense and the culpability of the offender.',
      source: 'Bachan Singh v. State of Punjab (1980)'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Criminal Law Practice Tools"
      description="Specialized tools for criminal defense and prosecution under BNS, BNSS, and BSA codes"
      icon={<Gavel className="w-6 h-6 text-blue-600" />}
    >
      <PracticeAreaHeader
        title="Criminal Law Practice"
        description="Tools and resources for Indian criminal law practice under BNS, BNSS, and BSA codes"
        icon={<Gavel className="h-6 w-6 text-blue-600" />}
      />
      
      <div className="mb-8">
        <Tabs defaultValue="bns" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="bns">BNS Code Assistant</TabsTrigger>
            <TabsTrigger value="sentencing">Sentencing Predictor</TabsTrigger>
            <TabsTrigger value="plea-bargain">Plea Bargain</TabsTrigger>
            <TabsTrigger value="case-law">Case Law Research</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bns" className="mt-0">
            <BNSCodeAssistant />
          </TabsContent>
          
          <TabsContent value="sentencing" className="mt-0">
            <SentencingPredictorTool />
          </TabsContent>
          
          <TabsContent value="plea-bargain" className="mt-0">
            <PleaBargainAssistant />
          </TabsContent>
          
          <TabsContent value="case-law" className="mt-0">
            <CriminalCaseLawResearch />
          </TabsContent>
        </Tabs>
      </div>
      
      <LegalUpdatesSection
        lawUpdates={criminalLawUpdates}
        keyLegalPrinciples={criminalLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CriminalLawPage;
