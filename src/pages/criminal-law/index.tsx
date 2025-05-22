
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Gavel, Library, BookOpen, Scale, AlertTriangle, FileText, Search, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';

const CriminalLawPage = () => {
  const criminalLawTools = [
    {
      id: 'bnscode',
      title: 'BNS Code Assistant',
      description: 'Navigate and understand the new Bharatiya Nyaya Sanhita with section-wise comparisons to the previous IPC provisions',
      icon: <Library className="h-4 w-4 text-blue-600" />,
      linkPath: '/sentencing-predictor',
      linkText: 'Go to BNS Assistant'
    },
    {
      id: 'sentencing',
      title: 'Sentencing Predictor',
      description: 'AI-powered analysis tool to predict potential sentences based on case details, precedents, and mitigating factors',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      linkPath: '/sentencing-predictor',
      linkText: 'Open Sentencing Predictor'
    },
    {
      id: 'pleabargain',
      title: 'Plea Bargain Assistant',
      description: 'Comprehensive tool to analyze plea bargain possibilities under Bharatiya Nagarik Suraksha Sanhita (BNSS)',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      linkPath: '/plea-bargain',
      linkText: 'Open Plea Bargain Assistant'
    },
    {
      id: 'caselaw',
      title: 'Criminal Case Law Research',
      description: 'Search and analyze criminal case precedents from Supreme Court and High Courts with AI-powered summaries',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      linkPath: '/case-law-research',
      linkText: 'Research Case Law'
    },
  ];
  
  const criminalLawUpdates = [
    {
      title: 'BNS Sections 108-111 Implementation',
      date: '2024-04-15',
      description: 'New guidelines for sections 108-111 of BNS regarding offenses against public tranquility have been implemented nationwide.',
      source: 'Ministry of Home Affairs'
    },
    {
      title: 'BNSS Digital Evidence Rules',
      date: '2024-04-01',
      description: 'Updated procedural rules for digital evidence collection and preservation under the Bharatiya Nagarik Suraksha Sanhita have been released.',
      source: 'Law Commission of India'
    },
    {
      title: 'Supreme Court: BNS Interpretation',
      date: '2024-03-22',
      description: 'Landmark judgment in Sharma v. Union of India provides clarification on the interpretation of criminal intent under the new BNS provisions.',
      source: 'Supreme Court of India'
    },
    {
      title: 'Video Conferencing for Remand Extended',
      date: '2024-03-10',
      description: 'Supreme Court extends provisions allowing video conferencing for remand proceedings under the BNSS for another year.',
      source: 'Supreme Court Order dated 10.03.2024'
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
    },
    {
      title: 'Double Jeopardy',
      description: 'No person shall be prosecuted and punished for the same offense more than once.',
      source: 'Article 20(2), Constitution of India'
    },
    {
      title: 'Proportionality in Sentencing',
      description: 'Punishment must be proportionate to the gravity of the offense and the culpability of the offender.',
      source: 'Bachan Singh v. State of Punjab (1980)'
    }
  ];
  
  return (
    <LegalToolLayout
      title="Criminal Law Practice Tools"
      description="Specialized tools for criminal defense and prosecution under BNS, BNSS, and BSA codes"
      icon={<Gavel className="w-6 h-6 text-blue-600" />}
    >
      <PracticeAreaHeader
        title="Criminal Law Practice"
        description="Tools and resources for Indian criminal law practice under BNS, BNSS, and BSA codes"
        icon={<Gavel className="h-6 w-6 text-blue-600" />}
      />
      
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Criminal Law Practice Tools</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criminalLawTools.map((tool) => (
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
        lawUpdates={criminalLawUpdates}
        keyLegalPrinciples={criminalLegalPrinciples}
      />
    </LegalToolLayout>
  );
};

export default CriminalLawPage;
