
import React, { useState, useEffect } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Gavel, FileText, Search, Scale, AlertTriangle, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from '@/components/BackButton';
import { BNSCodeAssistant, PleaBargainAssistant, SentencingPredictorTool, CriminalCaseLawResearch } from '@/components/practice-area-tools/criminal-law';
import { SentencingPredictorSkeleton, PleaBargainSkeleton } from '@/components/SkeletonLoaders';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CriminalLawPage = () => {
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Parse URL parameters to determine which tool to show
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tool = urlParams.get('tool');
    if (tool) {
      setSelectedTool(tool);
      setActiveTab("generator");
    }
  }, []);

  const handleToolSelect = (toolId: string) => {
    setIsLoading(true);
    setSelectedTool(toolId);
    
    // Update URL with the selected tool
    const url = new URL(window.location.href);
    url.searchParams.set('tool', toolId);
    window.history.pushState({}, '', url);
    
    setTimeout(() => {
      setActiveTab("generator");
      setIsLoading(false);
    }, 800);
  };
  
  const handleBackToTools = () => {
    setSelectedTool(null);
    setActiveTab("tools");
    
    // Remove tool parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('tool');
    window.history.pushState({}, '', url);
  };

  const criminalLawTools = [
    {
      id: 'bnscode',
      title: 'BNS Code Assistant',
      description: 'Navigate the new Bharatiya Nyaya Sanhita code with section-by-section comparison to the old IPC',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Explore BNS Code'
    },
    {
      id: 'pleabargain',
      title: 'Plea Bargaining Assistant',
      description: 'Strategic tool to analyze plea bargaining options with case outcome predictions',
      icon: <Scale className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Analyze Plea Options'
    },
    {
      id: 'sentencing',
      title: 'Sentencing Predictor',
      description: 'Advanced analysis of sentencing patterns for various offenses under the BNS regime',
      icon: <Gavel className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Predict Sentencing'
    },
    {
      id: 'caselaw',
      title: 'Criminal Case Law Research',
      description: 'Access a database of criminal precedents mapped to BNS provisions with AI-powered search',
      icon: <Search className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Research Cases'
    }
  ];
  
  const criminalLawUpdates = [
    {
      title: 'BNS Code Implementation',
      date: '2024-07-01',
      description: 'The Bharatiya Nyaya Sanhita officially replaces the Indian Penal Code with significant changes to offenses and procedures.',
      source: 'Ministry of Law and Justice, Government of India'
    },
    {
      title: 'New Guidelines for Confession Evidence',
      date: '2024-05-15',
      description: 'Supreme Court issues new guidelines on admissibility of confession evidence under BSA provisions.',
      source: 'Supreme Court of India, Criminal Appeal No. 1458 of 2024'
    },
    {
      title: 'Electronic Evidence Procedures',
      date: '2024-04-08',
      description: 'Enhanced protocols for collection and preservation of digital evidence implemented under BNSS.',
      source: 'Ministry of Home Affairs Circular No. 17/2024'
    },
    {
      title: 'Community Service Sentencing',
      date: '2024-03-22',
      description: 'New community service sentencing options introduced for minor offenses under BNS provisions.',
      source: 'Legal Services Authorities Act Amendment Notification'
    }
  ];
  
  const criminalLegalPrinciples = [
    {
      title: 'Presumption of Innocence',
      description: 'Every person is presumed innocent until proven guilty beyond reasonable doubt.',
      source: 'Article 21 of the Constitution; BNSS Section 385'
    },
    {
      title: 'Double Jeopardy',
      description: 'No person shall be prosecuted and punished for the same offense more than once.',
      source: 'Article 20(2) of the Constitution; BNS Section 76'
    },
    {
      title: 'Mens Rea',
      description: 'Criminal liability generally requires both a guilty act (actus reus) and guilty mind (mens rea).',
      source: 'BNS Sections 21-28'
    },
    {
      title: 'Proportionality of Punishment',
      description: 'Punishment should be proportionate to the gravity of the offense committed.',
      source: 'BNS Sentencing Guidelines, Chapter VIII'
    },
    {
      title: 'Right to Speedy Trial',
      description: 'Accused persons have the right to a trial without undue delay.',
      source: 'Article 21 of the Constitution; BNSS Section 275'
    }
  ];
  
  const renderSelectedTool = () => {
    if (isLoading) {
      switch (selectedTool) {
        case 'sentencing':
          return <SentencingPredictorSkeleton />;
        case 'pleabargain':
          return <PleaBargainSkeleton />;
        default:
          return <div className="animate-pulse p-8 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>;
      }
    }
    
    switch (selectedTool) {
      case 'bnscode':
        return <BNSCodeAssistant useAI={true} aiDescription="AI will compare BNS provisions with old IPC sections and provide case law analysis" />;
      case 'pleabargain':
        return <PleaBargainAssistant useAI={true} aiDescription="AI will analyze case details and provide outcome predictions for different plea options" />;
      case 'sentencing':
        return <SentencingPredictorTool useAI={true} aiDescription="AI will predict likely sentencing outcomes based on case details and precedents" />;
      case 'caselaw':
        return <CriminalCaseLawResearch useAI={true} aiDescription="AI will find relevant case precedents based on your legal issues and BNS sections" />;
      default:
        return null;
    }
  };
  
  return (
    <LegalToolLayout
      title="Criminal Law Practice Tools"
      description="Specialized tools for criminal law practice with BNS code navigation, sentencing prediction, and case law research"
      icon={<Gavel className="w-6 h-6 text-blue-600" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="tools" onClick={() => handleBackToTools()}>Tools</TabsTrigger>
            <TabsTrigger value="generator" disabled={!selectedTool}>
              {selectedTool === 'bnscode' && 'BNS Code Assistant'}
              {selectedTool === 'pleabargain' && 'Plea Bargaining Assistant'}
              {selectedTool === 'sentencing' && 'Sentencing Predictor'}
              {selectedTool === 'caselaw' && 'Case Law Research'}
              {!selectedTool && 'Tool'}
            </TabsTrigger>
          </TabsList>
          
          <BackButton to="/practice-areas" label="Back to Practice Areas" />
        </div>
      
        <TabsContent value="tools" className="mt-0">
          <PracticeAreaHeader
            title="Criminal Law Practice"
            description="Tools and resources for Indian criminal law practice under the new BNS/BNSS/BSA codes"
            icon={<Gavel className="h-6 w-6 text-blue-600" />}
          />
          
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <span>Criminal Law Tools</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criminalLawTools.map((tool) => (
                <PracticeAreaFeature
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  onClick={() => handleToolSelect(tool.id)}
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
        </TabsContent>
        
        <TabsContent value="generator" className="mt-0 space-y-6">
          {renderSelectedTool()}
        </TabsContent>
      </Tabs>
    </LegalToolLayout>
  );
};

export default CriminalLawPage;
