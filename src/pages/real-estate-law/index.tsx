
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Home, FileText, Search, Building2, FileCheck, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';

const RealEstateLawPage = () => {
  const realEstateLawTools = [
    {
      id: 'titleanalyzer',
      title: 'Title Search & Analysis',
      description: 'Comprehensive tool to analyze property documents, verify ownership chain, and identify potential title defects or encumbrances',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      linkPath: '/legal-document-analyzer',
      linkText: 'Analyze Title Documents'
    },
    {
      id: 'reradocuments',
      title: 'RERA Compliance Assistant',
      description: 'Interactive system to generate RERA-compliant documents and verify project compliance with state-specific requirements',
      icon: <Building2 className="h-4 w-4 text-blue-600" />,
      linkPath: '/compliance-assistance',
      linkText: 'RERA Compliance Tools'
    },
    {
      id: 'propertydocuments',
      title: 'Property Document Generator',
      description: 'Advanced tool to generate legally sound property documents including sale deeds, lease agreements, and conveyance deeds',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      linkPath: '/legal-document-drafting',
      linkText: 'Generate Property Documents'
    },
    {
      id: 'duediligence',
      title: 'Property Due Diligence',
      description: 'Structured workflow for conducting comprehensive due diligence on property transactions with customizable checklists',
      icon: <FileCheck className="h-4 w-4 text-blue-600" />,
      linkPath: '/legal-due-diligence',
      linkText: 'Start Due Diligence'
    },
  ];
  
  const realEstateLawUpdates = [
    {
      title: 'RERA Amendment Notification',
      date: '2024-04-20',
      description: 'Central government notifies amendments to RERA rules strengthening penalties for non-compliance by developers.',
      source: 'Gazette Notification dated 20.04.2024'
    },
    {
      title: 'Digital Property Registration',
      date: '2024-03-05',
      description: 'Several states implement comprehensive digital property registration systems with blockchain verification.',
      source: 'Ministry of Housing and Urban Affairs'
    },
    {
      title: 'Supreme Court on Force Majeure in Real Estate',
      date: '2024-02-22',
      description: 'Landmark judgment clarifies application of force majeure clauses in real estate agreements post-pandemic.',
      source: 'Supreme Court of India, Civil Appeal No. 2225 of 2023'
    },
    {
      title: 'Stamp Duty Rationalization',
      date: '2024-01-15',
      description: 'Maharashtra, Karnataka, and Delhi announce rationalization of stamp duty rates for property transactions.',
      source: 'State Government Notifications'
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
    },
    {
      title: 'Easement Rights',
      description: 'Properties may be subject to easement rights allowing limited use by non-owners for specific purposes.',
      source: 'Sections 4-44, Indian Easements Act, 1882'
    },
    {
      title: 'Constructive Notice',
      description: 'Registration of property documents provides constructive notice to the world at large about rights and interests in property.',
      source: 'Section 50, Registration Act, 1908'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Real Estate Law Practice Tools"
      description="Specialized tools for real estate law practice including title analysis, RERA compliance, and property document generation"
      icon={<Home className="w-6 h-6 text-blue-600" />}
    >
      <PracticeAreaHeader
        title="Real Estate Law Practice"
        description="Tools and resources for Indian property law and real estate transactions"
        icon={<Home className="h-6 w-6 text-blue-600" />}
      />
      
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <span>Real Estate Legal Tools</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realEstateLawTools.map((tool) => (
            <PracticeAreaFeature
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              linkPath={tool.linkPath}
              linkText={tool.linkText}
            />
          ))}
        </div>
      </section>
      
      <LegalUpdatesSection
        lawUpdates={realEstateLawUpdates}
        keyLegalPrinciples={realEstateLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default RealEstateLawPage;
