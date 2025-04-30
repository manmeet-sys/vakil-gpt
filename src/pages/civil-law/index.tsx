
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, FilePenLine, FileClock, ArrowRight } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';

const CivilLawPage = () => {
  const civilLawTools = [
    {
      id: 'causeofaction',
      title: 'Cause of Action Analyzer',
      description: 'Analyze potential causes of action under Indian civil laws and relevant statutes',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Identify valid causes of action and required elements based on fact patterns</p>
          <div className="mt-3">
            <a href="/legal-brief-generation" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Use Analyzer
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'limitationperiod',
      title: 'Limitation Period Calculator',
      description: 'Calculate limitation periods for various civil actions under the Limitation Act',
      icon: <FileClock className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Determine filing deadlines based on cause of action and relevant exception provisions</p>
          <div className="mt-3">
            <a href="/deadline-management" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Calculate Limitation
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'reliefgenerator',
      title: 'Civil Relief Generator',
      description: 'Generate appropriate prayers and relief clauses for various civil petitions',
      icon: <FilePenLine className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Create properly formatted prayer clauses for different types of civil remedies</p>
          <div className="mt-3">
            <a href="/legal-document-drafting" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Generate Relief Clauses
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
  ];
  
  const civilLawUpdates = [
    {
      title: 'Commercial Courts Amendment',
      date: '2024-04-10',
      description: 'The Commercial Courts Act has been amended to increase the pecuniary jurisdiction threshold to ₹5 crore.'
    },
    {
      title: 'New CPC Rules for Virtual Hearings',
      date: '2024-03-15',
      description: 'The Civil Procedure Code has been updated with comprehensive rules for conducting virtual hearings in civil matters.'
    },
    {
      title: 'Supreme Court on Specific Performance',
      date: '2024-02-28',
      description: 'New precedent in Mehta v. Kumar redefines the requirements for specific performance of contracts in property disputes.'
    }
  ];
  
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
    }
  ];
  
  return (
    <LegalToolLayout
      title="Civil Law Practice Tools"
      description="Specialized tools for civil litigation including cause of action analysis, limitation period calculation, and document generation"
      icon={<Scale className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <PracticeAreaTools
        practiceArea="Civil Law Practice"
        description="Tools and resources for Indian civil litigation and procedure"
        icon={<Scale className="h-5 w-5 text-blue-600" />}
        tools={civilLawTools}
        lawUpdates={civilLawUpdates}
        keyLegalPrinciples={civilLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CivilLawPage;
