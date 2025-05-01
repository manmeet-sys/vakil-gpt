
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Briefcase, FileText, Building, FileCheck, Search, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';

const CorporateLawPage = () => {
  const corporateLawTools = [
    {
      id: 'companyformation',
      title: 'Company Formation Assistant',
      description: 'Interactive tool to compare different business structures and generate all required formation documents for your chosen entity type',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      linkPath: '/startup-toolkit',
      linkText: 'Open Formation Assistant'
    },
    {
      id: 'duediligence',
      title: 'Due Diligence Tool',
      description: 'Comprehensive due diligence analysis system for mergers, acquisitions, and investments with customizable checklists',
      icon: <FileCheck className="h-4 w-4 text-blue-600" />,
      linkPath: '/m&a-due-diligence',
      linkText: 'Run Due Diligence'
    },
    {
      id: 'compliancecalendar',
      title: 'Corporate Compliance Calendar',
      description: 'Automated tracking system for all corporate compliance deadlines with customizable reminders and document generation',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      linkPath: '/deadline-management',
      linkText: 'View Compliance Calendar'
    },
    {
      id: 'contractanalysis',
      title: 'Corporate Contract Analyzer',
      description: 'AI-powered tool to analyze corporate agreements and identify key terms, obligations, and potential risks',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      linkPath: '/legal-document-analyzer',
      linkText: 'Analyze Contracts'
    },
  ];
  
  const corporateLawUpdates = [
    {
      title: 'New CSR Rules Notification',
      date: '2024-04-18',
      description: 'Ministry of Corporate Affairs has issued new CSR rules requiring enhanced disclosure and impact assessment for large companies.',
      source: 'MCA Notification dated 18.04.2024'
    },
    {
      title: 'Companies Act Amendment',
      date: '2024-03-25',
      description: 'Amendments to Companies Act provisions on board meetings now allow greater flexibility for virtual meetings and written resolutions.',
      source: 'Companies (Amendment) Act, 2024'
    },
    {
      title: 'SEBI Circular: Related Party Transactions',
      date: '2024-02-15',
      description: 'New SEBI circular provides revised framework for disclosure and approval of related party transactions for listed entities.',
      source: 'SEBI Circular No. SEBI/HO/CFD/CMD1/CIR/P/2024/42'
    },
    {
      title: 'Competition Commission Merger Regulations',
      date: '2024-01-30',
      description: 'Competition Commission of India has issued new regulations for merger control, including digital market considerations.',
      source: 'CCI Notification dated 30.01.2024'
    }
  ];
  
  const corporateLegalPrinciples = [
    {
      title: 'Corporate Veil',
      description: 'A company has a separate legal personality distinct from its members, but courts may pierce the corporate veil in cases of fraud or impropriety.',
      source: 'Salomon v. Salomon & Co Ltd [1897], applied in India in Tata Engineering Locomotive Co. Ltd. v. State of Bihar'
    },
    {
      title: 'Director Fiduciary Duties',
      description: 'Directors owe fiduciary duties to act in good faith, exercise care and diligence, avoid conflicts of interest, and promote the success of the company.',
      source: 'Section 166, Companies Act, 2013'
    },
    {
      title: 'Minority Shareholder Protection',
      description: 'Minority shareholders are protected against oppression and mismanagement through statutory remedies.',
      source: 'Sections 241-244, Companies Act, 2013'
    },
    {
      title: 'Business Judgment Rule',
      description: 'Courts generally defer to business decisions made by directors in good faith and with due care, without substituting their own judgment.',
      source: 'Wishart v. Castlecroft Securities Ltd, applied in Indian jurisprudence'
    },
    {
      title: 'Corporate Governance',
      description: 'Listed companies must adhere to corporate governance requirements including board composition, audit committees, and disclosure practices.',
      source: 'SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Corporate Law Practice Tools"
      description="Specialized tools for corporate law practice including company formation, due diligence, and compliance management"
      icon={<Briefcase className="w-6 h-6 text-blue-600" />}
    >
      <PracticeAreaHeader
        title="Corporate Law Practice"
        description="Tools and resources for Indian corporate and commercial law"
        icon={<Briefcase className="h-6 w-6 text-blue-600" />}
      />
      
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          <span>Corporate Legal Tools</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corporateLawTools.map((tool) => (
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
        lawUpdates={corporateLawUpdates}
        keyLegalPrinciples={corporateLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CorporateLawPage;
