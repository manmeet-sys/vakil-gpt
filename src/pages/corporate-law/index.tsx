
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Briefcase, FileText, Building, FileCheck, ArrowRight } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';

const CorporateLawPage = () => {
  const corporateLawTools = [
    {
      id: 'companyformation',
      title: 'Company Formation Assistant',
      description: 'Compare different business structures and generate formation documents',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Compare LLP vs Private Limited vs OPC structures and generate required documents</p>
          <div className="mt-3">
            <a href="/startup-toolkit" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Open Formation Assistant
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'duediligence',
      title: 'Due Diligence Tool',
      description: 'Comprehensive due diligence analysis for mergers, acquisitions, and investments',
      icon: <FileCheck className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Generate due diligence checklists, reports, and risk assessments</p>
          <div className="mt-3">
            <a href="/m&a-due-diligence" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              Run Due Diligence
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
    {
      id: 'compliancecalendar',
      title: 'Corporate Compliance Calendar',
      description: 'Track compliance deadlines for various corporate filings and requirements',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">Never miss ROC, MCA, or SEBI filings with custom compliance deadline tracking</p>
          <div className="mt-3">
            <a href="/deadline-management" className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
              View Compliance Calendar
              <ArrowRight className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )
    },
  ];
  
  const corporateLawUpdates = [
    {
      title: 'New CSR Rules Notification',
      date: '2024-04-18',
      description: 'Ministry of Corporate Affairs has issued new CSR rules requiring enhanced disclosure and impact assessment for large companies.'
    },
    {
      title: 'Companies Act Amendment',
      date: '2024-03-25',
      description: 'Amendments to Companies Act provisions on board meetings now allow greater flexibility for virtual meetings and written resolutions.'
    },
    {
      title: 'SEBI Circular: Related Party Transactions',
      date: '2024-02-15',
      description: 'New SEBI circular provides revised framework for disclosure and approval of related party transactions for listed entities.'
    }
  ];
  
  const corporateLegalPrinciples = [
    {
      title: 'Corporate Veil',
      description: 'A company has a separate legal personality distinct from its members, but courts may pierce the corporate veil in cases of fraud or impropriety.',
      source: 'Salomon v. Salomon & Co Ltd [1897]'
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
    }
  ];
  
  return (
    <LegalToolLayout
      title="Corporate Law Practice Tools"
      description="Specialized tools for corporate law practice including company formation, due diligence, and compliance management"
      icon={<Briefcase className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      
      <PracticeAreaTools
        practiceArea="Corporate Law Practice"
        description="Tools and resources for Indian corporate and commercial law"
        icon={<Briefcase className="h-5 w-5 text-blue-600" />}
        tools={corporateLawTools}
        lawUpdates={corporateLawUpdates}
        keyLegalPrinciples={corporateLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CorporateLawPage;
