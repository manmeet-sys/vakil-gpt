
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Briefcase, FileText, Building, FileCheck, Search, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';
import { 
  CompanyFormationGenerator, 
  MADueDiligenceGenerator, 
  ComplianceCalendarGenerator, 
  ContractRiskAnalyzer
} from '@/components/practice-area-tools/corporate-law';

const CorporateLawPage = () => {
  const corporateLawTools = [
    {
      id: 'companyformation',
      title: 'Company Formation Document Generator',
      description: 'Generate formation documents for different business entity types in India including Private Limited, LLP, OPC, and more',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      content: <CompanyFormationGenerator />
    },
    {
      id: 'duediligence',
      title: 'M&A Due Diligence Checklist Generator',
      description: 'Create comprehensive due diligence checklists for mergers, acquisitions, and investments with customizable parameters',
      icon: <FileCheck className="h-4 w-4 text-blue-600" />,
      content: <MADueDiligenceGenerator />
    },
    {
      id: 'compliancecalendar',
      title: 'Corporate Compliance Calendar Generator',
      description: 'Generate customized compliance calendars with regulatory deadlines for different types of business entities',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: <ComplianceCalendarGenerator />
    },
    {
      id: 'contractanalysis',
      title: 'Contract Risk Analysis Tool',
      description: 'Analyze contracts for legal risks, liability exposure, unfavorable terms, and potential compliance issues',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      content: <ContractRiskAnalyzer />
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
