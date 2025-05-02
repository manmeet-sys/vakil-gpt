
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Heart, Calculator, FileText, Scale, Book } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';
import { 
  MaintenanceCalculator,
  ChildCustodyAnalyzer, 
  FamilySettlementGenerator, 
  PropertyDivisionAssistant 
} from '@/components/practice-area-tools/family-law';

const FamilyLawPage = () => {
  const familyLawTools = [
    {
      id: 'maintenancecalculator',
      title: 'Maintenance Calculator',
      description: 'Calculate maintenance amounts based on income, needs, and applicable family law',
      icon: <Calculator className="h-4 w-4 text-blue-600" />,
      content: <MaintenanceCalculator />
    },
    {
      id: 'custodyanalyzer',
      title: 'Child Custody Analyzer',
      description: 'Analyze custody cases based on welfare principle and relevant factors',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      content: <ChildCustodyAnalyzer />
    },
    {
      id: 'familysettlement',
      title: 'Family Settlement Generator',
      description: 'Generate family law documents for different personal laws in India',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: <FamilySettlementGenerator />
    },
    {
      id: 'propertydivision',
      title: 'Property Division Assistant',
      description: 'Calculate equitable division of matrimonial assets and liabilities',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      content: <PropertyDivisionAssistant />
    },
  ];
  
  const familyLawUpdates = [
    {
      title: 'Hindu Marriage Act Amendment Bill',
      date: '2024-04-12',
      description: 'New amendment bill proposes changes to grounds for divorce and introduces the concept of irretrievable breakdown of marriage, offering a no-fault divorce option after separation of three years.'
    },
    {
      title: 'Supreme Court on Shared Parenting',
      date: '2024-03-18',
      description: 'Landmark judgment in Sharma v. Sharma establishes guidelines for shared parenting arrangements in custody disputes, emphasizing digital communication platforms for non-custodial parents.'
    },
    {
      title: 'Special Marriage Act Online Registration',
      date: '2024-02-10',
      description: 'Government launches online portal for marriage registration under the Special Marriage Act across all states, making interfaith and intercaste marriages more accessible.'
    }
  ];
  
  const familyLegalPrinciples = [
    {
      title: 'Welfare Principle',
      description: 'The paramount consideration in matters relating to custody and guardianship is the welfare of the minor child. Courts prioritize the child\'s best interests over parental rights.',
      source: 'Gaurav Nagpal v. Sumedha Nagpal (2009) 1 SCC 42'
    },
    {
      title: 'Right to Maintenance',
      description: 'Spouses and dependents have the right to maintenance based on their needs and the paying party\'s ability. This applies across all personal laws with varying formulations.',
      source: 'Section 125, Code of Criminal Procedure'
    },
    {
      title: 'Personal Law Application',
      description: 'Family law matters are governed by the applicable personal law based on religion, unless parties choose a secular law. This constitutional protection extends to marriage, divorce, and succession.',
      source: 'Article 25, Constitution of India'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Family Law Practice Tools"
      description="Specialized tools for family law practice including maintenance calculation, custody analysis, and document generation"
      icon={<Heart className="w-5 h-5 text-blue-600" />}
    >
      <BackButton to="/practice-areas" label="Back to Practice Areas" />
      
      <PracticeAreaTools
        practiceArea="Family Law Practice"
        description="Tools and resources for Indian family law across different personal laws"
        icon={<Heart className="h-5 w-5 text-blue-600" />}
        tools={familyLawTools}
        lawUpdates={familyLawUpdates}
        keyLegalPrinciples={familyLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default FamilyLawPage;
