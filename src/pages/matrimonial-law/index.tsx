
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Heart, Scale, FileText, Calculator, Book } from 'lucide-react';
import PracticeAreaTools from '@/components/PracticeAreaTools';
import BackButton from '@/components/BackButton';
import { 
  DivorceAssistant,
  MatrimonialRightsAnalyzer,
  AlimonyCalculator,
  EvidenceOrganizer
} from '@/components/practice-area-tools/matrimonial-law';

const MatrimonialLawPage = () => {
  const matrimonialLawTools = [
    {
      id: 'divorceproceedingassistant',
      title: 'Divorce Proceeding Assistant',
      description: 'Navigate through different types of divorce procedures in India with step-by-step guidance',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      content: <DivorceAssistant />
    },
    {
      id: 'matrimonialrightsanalyzer',
      title: 'Matrimonial Rights Analyzer',
      description: 'Understand legal rights and obligations under different personal laws in Indian marriages',
      icon: <Book className="h-4 w-4 text-blue-600" />,
      content: <MatrimonialRightsAnalyzer />
    },
    {
      id: 'alimonycalculator',
      title: 'Alimony Calculator',
      description: 'Calculate approximate alimony/maintenance amounts based on income, marriage duration, and applicable laws',
      icon: <Calculator className="h-4 w-4 text-blue-600" />,
      content: <AlimonyCalculator />
    },
    {
      id: 'evidenceorganizer',
      title: 'Matrimonial Evidence Organizer',
      description: 'Organize and categorize evidence for matrimonial proceedings by relevance and admissibility',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      content: <EvidenceOrganizer />
    },
  ];
  
  const matrimonialLawUpdates = [
    {
      title: 'Supreme Court on Divorce by Mutual Consent',
      date: '2025-03-15',
      description: 'New judgment streamlines the waiting period in mutual consent divorce cases, allowing courts to waive the 6-month cooling period in certain circumstances where reconciliation is not possible.'
    },
    {
      title: 'Amendment to Hindu Marriage Act',
      date: '2025-02-10',
      description: 'Parliament passes amendments to the Hindu Marriage Act introducing "irretrievable breakdown of marriage" as a new ground for divorce, allowing parties to seek divorce without mutual consent.'
    },
    {
      title: 'High Court on Maintenance Rights',
      date: '2025-01-05',
      description: 'Delhi High Court clarifies that interim maintenance can be granted based on the standard of living the spouse was accustomed to during marriage, not just basic necessities.'
    }
  ];
  
  const matrimonialLegalPrinciples = [
    {
      title: 'Personal Law Applicability',
      description: 'Matrimonial matters are governed by the applicable personal law - Hindu Marriage Act for Hindus, Muslim Personal Law for Muslims, Special Marriage Act for inter-religious marriages, etc.',
      source: 'Constitution of India, Article 25'
    },
    {
      title: 'Maintenance Rights',
      description: 'Spouses have the right to maintenance during and after marriage dissolution. Section 125 CrPC provides a secular remedy applicable across religions for basic maintenance.',
      source: 'Section 125, Code of Criminal Procedure'
    },
    {
      title: 'Child Custody',
      description: 'The paramount consideration in deciding custody matters is the welfare and best interests of the child, not the rights of the parents.',
      source: 'Gaurav Nagpal v. Sumedha Nagpal (2009)'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Matrimonial Law Practice Tools"
      description="Specialized tools for matrimonial and divorce proceedings including maintenance calculation, evidence organization, and rights analysis"
      icon={<Heart className="w-5 h-5 text-purple-600" />}
    >
      <BackButton to="/practice-areas" label="Back to Practice Areas" />
      
      <PracticeAreaTools
        practiceArea="Matrimonial Law Practice"
        description="Tools and resources for Indian matrimonial law across different personal laws"
        icon={<Heart className="h-5 w-5 text-purple-600" />}
        tools={matrimonialLawTools}
        lawUpdates={matrimonialLawUpdates}
        keyLegalPrinciples={matrimonialLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default MatrimonialLawPage;
