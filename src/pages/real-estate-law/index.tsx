
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Home, FileText, Search, Building2, ArrowRight } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';

const RealEstateLawPage = () => {
  const realEstateLawTools = [
    {
      id: 'titleanalyzer',
      title: 'Title Search & Analysis',
      description: 'Analyze property documents and identify potential title issues',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Comprehensive title analysis with document checklist and issue spotting</p>
          <div className="mt-3">
            <a href="/legal-document-analyzer" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Analyze Title Documents
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'reradocuments',
      title: 'RERA Compliance Assistant',
      description: 'Generate RERA-compliant documents and check project compliance',
      icon: <Building2 className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Create RERA-compliant agreements and verify project registration details</p>
          <div className="mt-3">
            <a href="/compliance-assistance" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              RERA Compliance Tools
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'propertydocuments',
      title: 'Property Document Generator',
      description: 'Generate various real estate documents including sale deeds and lease agreements',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Create legally sound property documents customized for different states</p>
          <div className="mt-3">
            <a href="/legal-document-drafting" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Generate Property Documents
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
  ];
  
  const realEstateLawUpdates = [
    {
      title: 'RERA Amendment Notification',
      date: '2024-04-20',
      description: 'Central government notifies amendments to RERA rules strengthening penalties for non-compliance by developers.'
    },
    {
      title: 'Digital Property Registration',
      date: '2024-03-05',
      description: 'Several states implement comprehensive digital property registration systems with blockchain verification.'
    },
    {
      title: 'Supreme Court on Force Majeure in Real Estate',
      date: '2024-02-22',
      description: 'Landmark judgment clarifies application of force majeure clauses in real estate agreements post-pandemic.'
    }
  ];
  
  const realEstateLegalPrinciples = [
    {
      title: 'Caveat Emptor',
      description: 'Buyer beware principle requiring property buyers to exercise due diligence before purchase, with exceptions for latent defects.',
      source: 'Section 55, Transfer of Property Act'
    },
    {
      title: 'Specific Performance',
      description: 'Real estate contracts can be specifically enforced subject to the discretionary considerations under the Specific Relief Act.',
      source: 'Section 10, Specific Relief Act'
    },
    {
      title: 'RERA Compliance',
      description: 'Real estate projects must be registered with the regulatory authority and developers must provide accurate project information.',
      source: 'Section 3, Real Estate (Regulation and Development) Act'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Real Estate Law Practice Tools"
      description="Specialized tools for real estate law practice including title analysis, RERA compliance, and property document generation"
      icon={<Home className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <PracticeAreaTools
        practiceArea="Real Estate Law Practice"
        description="Tools and resources for Indian property law and real estate transactions"
        icon={<Home className="h-5 w-5 text-blue-600" />}
        tools={realEstateLawTools}
        lawUpdates={realEstateLawUpdates}
        keyLegalPrinciples={realEstateLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default RealEstateLawPage;
