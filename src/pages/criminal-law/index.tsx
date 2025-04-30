
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Gavel, Library, BookOpen, Scale, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';

const CriminalLawPage = () => {
  const criminalLawTools = [
    {
      id: 'bnscode',
      title: 'BNS Code Assistant',
      description: 'Look up specific sections of the Bharatiya Nyaya Sanhita (BNS) and compare with older IPC provisions',
      icon: <Library className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Access the new Bharatiya Nyaya Sanhita provisions, with section-wise comparison to previous IPC sections</p>
          <div className="mt-3">
            <a href="/sentencing-predictor" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Go to BNS Assistant
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'sentencing',
      title: 'Sentencing Predictor',
      description: 'Predict potential sentencing outcomes based on case details and precedents',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">AI-powered analysis of potential sentences based on Indian criminal law and precedents</p>
          <div className="mt-3">
            <a href="/sentencing-predictor" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Open Sentencing Predictor
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'pleabargain',
      title: 'Plea Bargain Assistant',
      description: 'Analyze plea bargain possibilities under Bharatiya Nagarik Suraksha Sanhita (BNSS)',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Explore plea bargaining options under BNSS provisions for your criminal defense strategy</p>
          <div className="mt-3">
            <a href="/plea-bargain" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Open Plea Bargain Assistant
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
  ];
  
  const criminalLawUpdates = [
    {
      title: 'BNS Sections 108-111 Implementation',
      date: '2024-04-15',
      description: 'New guidelines for sections 108-111 of BNS regarding offenses against public tranquility have been implemented nationwide.'
    },
    {
      title: 'BNSS Digital Evidence Rules',
      date: '2024-04-01',
      description: 'Updated procedural rules for digital evidence collection and preservation under the Bharatiya Nagarik Suraksha Sanhita have been released.'
    },
    {
      title: 'Supreme Court: BNS Interpretation',
      date: '2024-03-22',
      description: 'Landmark judgment in Sharma v. Union of India provides clarification on the interpretation of criminal intent under the new BNS provisions.'
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
    }
  ];
  
  return (
    <LegalToolLayout
      title="Criminal Law Practice Tools"
      description="Specialized tools for criminal law practice including BNS provisions, sentencing prediction, and defense strategy assistance"
      icon={<Gavel className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <PracticeAreaTools
        practiceArea="Criminal Law Practice"
        description="Tools and resources for Indian criminal law practice under BNS, BNSS, and BSA codes"
        icon={<Gavel className="h-5 w-5 text-blue-600" />}
        tools={criminalLawTools}
        lawUpdates={criminalLawUpdates}
        keyLegalPrinciples={criminalLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CriminalLawPage;
