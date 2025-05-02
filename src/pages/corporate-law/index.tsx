
import React, { useState, useEffect } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Briefcase, FileText, ClipboardCheck, Building, FileCheck, ArrowRight } from 'lucide-react';
import PracticeAreaHeader from '@/components/practice-areas/PracticeAreaHeader';
import PracticeAreaFeature from '@/components/practice-areas/PracticeAreaFeature';
import LegalUpdatesSection from '@/components/practice-areas/LegalUpdatesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from '@/components/BackButton';
import { CompanyFormationGenerator, ComplianceCalendarGenerator, ContractRiskAnalyzer, MADueDiligenceGenerator } from '@/components/practice-area-tools/corporate-law';
import { CompanyFormationSkeleton, ComplianceCalendarSkeleton, ContractRiskAnalyzerSkeleton, MADueDiligenceSkeleton } from '@/components/SkeletonLoaders';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CorporateLawPage = () => {
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

  const corporateLawTools = [
    {
      id: 'companyformation',
      title: 'Company Formation Generator',
      description: 'Generate all necessary documents for company formation including MOA, AOA and other incorporation documents',
      icon: <Building className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Form a Company'
    },
    {
      id: 'compliancecalendar',
      title: 'Compliance Calendar Generator',
      description: 'Generate customized compliance calendars for companies with automatic reminders for filing deadlines',
      icon: <ClipboardCheck className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Create Compliance Calendar'
    },
    {
      id: 'contractrisk',
      title: 'Contract Risk Analyzer',
      description: 'AI-powered tool to analyze contracts and identify potential risks, liabilities, and compliance issues',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Analyze Contract Risks'
    },
    {
      id: 'duediligence',
      title: 'M&A Due Diligence Tool',
      description: 'Comprehensive due diligence assistant for mergers and acquisitions with customizable checklists',
      icon: <FileCheck className="h-4 w-4 text-blue-600" />,
      linkPath: '#',
      linkText: 'Start Due Diligence'
    }
  ];
  
  const corporateLawUpdates = [
    {
      title: 'Companies Act Amendment',
      date: '2024-06-15',
      description: 'Parliament approves amendments to the Companies Act, 2013 simplifying compliance for small companies.',
      source: 'Ministry of Corporate Affairs'
    },
    {
      title: 'New SEBI Regulations',
      date: '2024-05-10',
      description: 'SEBI introduces new ESG disclosure requirements for listed companies effective from October 2024.',
      source: 'Securities and Exchange Board of India'
    },
    {
      title: 'Digital Contract Execution',
      date: '2024-04-05',
      description: 'Supreme Court upholds validity of digitally executed contracts with blockchain verification.',
      source: 'Supreme Court of India, Civil Appeal No. 3654 of 2024'
    },
    {
      title: 'CSR Policy Update',
      date: '2024-03-12',
      description: 'New Corporate Social Responsibility guidelines released with emphasis on climate change initiatives.',
      source: 'Ministry of Corporate Affairs Notification'
    }
  ];
  
  const corporateLegalPrinciples = [
    {
      title: 'Corporate Veil',
      description: 'A company has a separate legal personality distinct from its shareholders, but courts may pierce the corporate veil in cases of fraud.',
      source: 'Companies Act, 2013, Section 9; Salomon v. Salomon & Co Ltd'
    },
    {
      title: 'Fiduciary Duty',
      description: 'Directors have fiduciary duties to act in the best interests of the company, exercise due care, and avoid conflicts of interest.',
      source: 'Companies Act, 2013, Sections 166, 184, 188'
    },
    {
      title: 'Corporate Governance',
      description: 'The system of rules, practices, and processes by which a company is directed and controlled, with emphasis on transparency and accountability.',
      source: 'SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015'
    },
    {
      title: 'Limited Liability',
      description: "Shareholders' liability is generally limited to their investment in the company, protecting personal assets.",
      source: 'Companies Act, 2013, Section 3(2)'
    },
    {
      title: 'Business Judgment Rule',
      description: 'Directors are generally protected from liability for business decisions made in good faith, even if they lead to losses.',
      source: 'Common Law; Companies Act, 2013, Section 463'
    }
  ];
  
  const renderSelectedTool = () => {
    if (isLoading) {
      switch (selectedTool) {
        case 'companyformation':
          return <CompanyFormationSkeleton />;
        case 'compliancecalendar':
          return <ComplianceCalendarSkeleton />;
        case 'contractrisk':
          return <ContractRiskAnalyzerSkeleton />;
        case 'duediligence':
          return <MADueDiligenceSkeleton />;
        default:
          return null;
      }
    }
    
    switch (selectedTool) {
      case 'companyformation':
        return <CompanyFormationGenerator useAI={true} aiPrompt="Generate legally compliant company formation documents enhanced with industry-specific clauses" />;
      case 'compliancecalendar':
        return <ComplianceCalendarGenerator useAI={true} aiPrompt="Create a customized compliance calendar based on company structure and regulatory requirements" />;
      case 'contractrisk':
        return <ContractRiskAnalyzer useAI={true} aiDescription="AI will analyze contractual terms and identify potential legal risks and compliance issues" />;
      case 'duediligence':
        return <MADueDiligenceGenerator useAI={true} aiDescription="AI will assist in identifying key risk areas and compliance issues during due diligence" />;
      default:
        return null;
    }
  };
  
  return (
    <LegalToolLayout
      title="Corporate Law Practice Tools"
      description="Specialized tools for corporate law practice including company formation, compliance, contract analysis, and due diligence"
      icon={<Briefcase className="w-6 h-6 text-blue-600" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="tools" onClick={() => handleBackToTools()}>Tools</TabsTrigger>
            <TabsTrigger value="generator" disabled={!selectedTool}>
              {selectedTool === 'companyformation' && 'Company Formation'}
              {selectedTool === 'compliancecalendar' && 'Compliance Calendar'}
              {selectedTool === 'contractrisk' && 'Contract Risk Analyzer'}
              {selectedTool === 'duediligence' && 'M&A Due Diligence'}
              {!selectedTool && 'Tool'}
            </TabsTrigger>
          </TabsList>
          
          <BackButton to="/practice-areas" label="Back to Practice Areas" />
        </div>
      
        <TabsContent value="tools" className="mt-0">
          <PracticeAreaHeader
            title="Corporate Law Practice"
            description="Tools and resources for Indian corporate law practice including company formation, compliance, and transactions"
            icon={<Briefcase className="h-6 w-6 text-blue-600" />}
          />
          
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Corporate Law Tools</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {corporateLawTools.map((tool) => (
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
            lawUpdates={corporateLawUpdates}
            keyLegalPrinciples={corporateLegalPrinciples}
          />
        </TabsContent>
        
        <TabsContent value="generator" className="mt-0 space-y-6">
          {renderSelectedTool()}
        </TabsContent>
      </Tabs>
    </LegalToolLayout>
  );
};

export default CorporateLawPage;
