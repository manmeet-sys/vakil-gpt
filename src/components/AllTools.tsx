import React from 'react';
import ToolCategory from './ToolsCategories';
import { 
  FileText, 
  BookOpen, 
  Scale, 
  Briefcase, 
  Heart, 
  Home, 
  FileSearch, 
  File,
  IndianRupee, 
  BarChart2,
  Gavel
} from 'lucide-react';

const AllTools = () => {
  const researchTools = [
    {
      id: "legal-research",
      title: "AI Legal Researcher",
      description: "Research case law, statutes, and legal articles with AI-powered search",
      icon: <FileSearch className="h-5 w-5 text-blue-600" />,
      path: "/legal-research"
    },
    {
      id: "legal-document-analyzer",
      title: "Legal Document Analyzer",
      description: "Analyze legal documents for key clauses, risks, and compliance issues",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-analyzer"
    },
    {
      id: "ai-legal-summarizer",
      title: "AI Legal Summarizer",
      description: "Summarize lengthy legal documents and extract key information",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/ai-legal-summarizer"
    },
    {
      id: "ai-legal-translator",
      title: "AI Legal Translator",
      description: "Translate legal documents between different languages",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/ai-legal-translator"
    },
    {
      id: "ai-legal-citation",
      title: "AI Legal Citation Generator",
      description: "Generate legal citations in various formats",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/ai-legal-citation"
    },
    {
      id: "ai-legal-query",
      title: "AI Legal Query Generator",
      description: "Generate legal queries based on case details",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/ai-legal-query"
    },
  ];

  const documentTools = [
    {
      id: "legal-document-drafting",
      title: "Legal Document Drafting",
      description: "Draft legal documents with AI-powered templates and suggestions",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-drafting"
    },
    {
      id: "legal-brief-generation",
      title: "Legal Brief Generation",
      description: "Generate legal briefs with AI-powered analysis and arguments",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-brief-generation"
    },
    {
      id: "contract-review",
      title: "AI Contract Review",
      description: "Review contracts for risks, compliance issues, and negotiation points",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/contract-review"
    },
    {
      id: "legal-template-library",
      title: "Legal Template Library",
      description: "Access a library of legal document templates for various purposes",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-template-library"
    },
    {
      id: "legal-form-filler",
      title: "Legal Form Filler",
      description: "Fill out legal forms with AI-powered assistance",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-form-filler"
    },
    {
      id: "legal-document-automation",
      title: "Legal Document Automation",
      description: "Automate the creation of legal documents with AI-powered workflows",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-automation"
    },
  ];

  const complianceTools = [
    {
      id: "compliance-assistance",
      title: "Compliance Assistance",
      description: "Ensure compliance with relevant laws and regulations",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/compliance-assistance"
    },
    {
      id: "deadline-management",
      title: "Deadline Management",
      description: "Manage deadlines for legal tasks and filings",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/deadline-management"
    },
    {
      id: "legal-audit",
      title: "Legal Audit",
      description: "Conduct legal audits to identify potential risks and compliance issues",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/legal-audit"
    },
    {
      id: "regulatory-alerts",
      title: "Regulatory Alerts",
      description: "Receive alerts about changes in laws and regulations",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/regulatory-alerts"
    },
    {
      id: "policy-generator",
      title: "Policy Generator",
      description: "Generate legal policies for your organization",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/policy-generator"
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Assess legal risks and develop mitigation strategies",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/risk-assessment"
    },
  ];

  const specializedTools = [
    {
      id: "legal-calculator",
      title: "Legal Calculator",
      description: "Calculate legal fees, damages, and other amounts",
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
      path: "/legal-calculator"
    },
    {
      id: "litigation-prediction",
      title: "Litigation Prediction",
      description: "Predict the outcome of litigation based on case details",
      icon: <BarChart2 className="h-5 w-5 text-blue-600" />,
      path: "/litigation-prediction"
    },
    {
      id: "startup-toolkit",
      title: "Startup Toolkit",
      description: "Access resources for starting and running a business",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/startup-toolkit"
    },
  ];

  // Add a new category for Practice-Specific Tools
  const practiceAreaTools = [
    {
      id: "practice-areas",
      title: "Practice Areas Hub",
      description: "Access specialized tools for different practice areas of Indian law",
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      path: "/practice-areas"
    },
    {
      id: "criminal-law",
      title: "Criminal Law Tools",
      description: "Specialized tools for BNS code, sentencing prediction and defense strategies",
      icon: <Gavel className="h-5 w-5 text-blue-600" />,
      path: "/criminal-law"
    },
    {
      id: "civil-law",
      title: "Civil Law Tools",
      description: "Cause of action analysis, limitation calculator, and relief generator",
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      path: "/civil-law"
    }
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Legal Research & Analysis */}
      <ToolCategory
        title="Legal Research & Analysis"
        description="AI-powered tools to research case law, analyze legal issues, and predict outcomes"
        tools={researchTools}
      />
      
      {/* Add our new Practice Area Tools category */}
      <ToolCategory
        title="Practice-Specific Tools"
        description="Specialized tools and resources for different areas of legal practice"
        tools={practiceAreaTools}
      />
      
      {/* Document Drafting & Management */}
      <ToolCategory
        title="Document Drafting & Management"
        description="Create, customize, and manage legal documents quickly and efficiently"
        tools={documentTools}
      />
      
      {/* Compliance & Risk Management */}
      <ToolCategory
        title="Compliance & Risk Management"
        description="Ensure compliance with laws, manage deadlines, and assess legal risks"
        tools={complianceTools}
      />
      
      {/* Specialized Tools */}
      <ToolCategory
        title="Specialized Tools"
        description="Unique tools for specific legal tasks and calculations"
        tools={specializedTools}
      />
    </div>
  );
};

export default AllTools;
