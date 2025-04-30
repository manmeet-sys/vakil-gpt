
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Heart, Calculator, FileText, Landmark, ArrowRight } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';

const FamilyLawPage = () => {
  const familyLawTools = [
    {
      id: 'maintenancecalculator',
      title: 'Maintenance Calculator',
      description: 'Calculate maintenance amounts based on income, needs, and applicable family law',
      icon: <Calculator className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Estimate maintenance amounts under various personal laws and Section 125 CrPC</p>
          <div className="mt-3">
            <a href="/legal-calculator" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Calculate Maintenance
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'custodyanalyzer',
      title: 'Custody Case Analyzer',
      description: 'Analyze custody cases based on welfare principle and relevant precedents',
      icon: <Landmark className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Evaluate custody factors based on the paramount consideration of child welfare</p>
          <div className="mt-3">
            <a href="/advanced-ai-analysis" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Analyze Custody Case
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'marriagedocuments',
      title: 'Marriage & Divorce Documents',
      description: 'Generate family law documents for different personal laws in India',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Create customized documents for marriage, divorce, maintenance, and custody matters</p>
          <div className="mt-3">
            <a href="/legal-document-drafting" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Draft Family Law Documents
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
  ];
  
  const familyLawUpdates = [
    {
      title: 'Hindu Marriage Act Amendment Bill',
      date: '2024-04-12',
      description: 'New amendment bill proposes changes to grounds for divorce and introduces the concept of irretrievable breakdown of marriage.'
    },
    {
      title: 'Supreme Court on Shared Parenting',
      date: '2024-03-18',
      description: 'Landmark judgment in Sharma v. Sharma establishes guidelines for shared parenting arrangements in custody disputes.'
    },
    {
      title: 'Special Marriage Act Online Registration',
      date: '2024-02-10',
      description: 'Government launches online portal for marriage registration under the Special Marriage Act across all states.'
    }
  ];
  
  const familyLegalPrinciples = [
    {
      title: 'Welfare Principle',
      description: 'The paramount consideration in matters relating to custody and guardianship is the welfare of the minor child.',
      source: 'Gaurav Nagpal v. Sumedha Nagpal (2009) 1 SCC 42'
    },
    {
      title: 'Right to Maintenance',
      description: 'Spouses and dependents have the right to maintenance based on their needs and the paying party\'s ability.',
      source: 'Section 125, Code of Criminal Procedure'
    },
    {
      title: 'Personal Law Application',
      description: 'Family law matters are governed by the applicable personal law based on religion, unless parties choose a secular law.',
      source: 'Article 25, Constitution of India'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Family Law Practice Tools"
      description="Specialized tools for family law practice including maintenance calculation, custody analysis, and document generation"
      icon={<Heart className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
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
