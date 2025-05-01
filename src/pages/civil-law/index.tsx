
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Scale, FileText, FilePenLine, FileClock, Search, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';

const CivilLawPage = () => {
  const civilLawTools = [
    {
      id: 'causeofaction',
      title: 'Cause of Action Analyzer',
      description: 'Comprehensive tool to analyze potential causes of action under Indian civil laws with elements and requirements for each',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      linkPath: '/legal-brief-generation',
      linkText: 'Use Analyzer'
    },
    {
      id: 'limitationperiod',
      title: 'Limitation Period Calculator',
      description: 'Interactive tool to calculate precise limitation periods for various civil actions with consideration for exceptions and extensions',
      icon: <FileClock className="h-4 w-4 text-blue-600" />,
      linkPath: '/deadline-management',
      linkText: 'Calculate Limitation'
    },
    {
      id: 'reliefgenerator',
      title: 'Civil Relief Generator',
      description: 'Advanced tool to generate properly formatted prayers and relief clauses for various civil petitions and applications',
      icon: <FilePenLine className="h-4 w-4 text-blue-600" />,
      linkPath: '/legal-document-drafting',
      linkText: 'Generate Relief Clauses'
    },
    {
      id: 'precedentsearch',
      title: 'Civil Case Precedent Search',
      description: 'Search engine for civil case precedents with AI-powered analysis and summaries of relevant judgments',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      linkPath: '/case-law-research',
      linkText: 'Search Precedents'
    },
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
      
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Civil Litigation Tools</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {civilLawTools.map((tool) => (
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
        lawUpdates={civilLawUpdates}
        keyLegalPrinciples={civilLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CivilLawPage;
