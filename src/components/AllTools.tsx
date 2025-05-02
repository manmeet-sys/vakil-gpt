
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
  Gavel,
  Accessibility,
  Clock,
  Calculator,
  Search,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AllTools = () => {
  // Feature highlighted tools at the top - Legal Calculator and Advanced AI Search
  const highlightedTools = [
    {
      id: "legal-calculator",
      title: "Legal Calculator",
      description: "Calculate court fees, limitation periods, interest rates for legal cases in India",
      icon: <Calculator className="h-5 w-5 text-amber-600" />,
      path: "/legal-calculator",
      badge: "Featured",
      isPopular: true
    },
    {
      id: "advanced-ai-search",
      title: "Advanced AI Search",
      description: "AI-powered search across legal documents with semantic understanding",
      icon: <Search className="h-5 w-5 text-emerald-600" />,
      path: "/advanced-ai-search",
      badge: "New",
      isPopular: true
    },
  ];

  // Practice area tools are now prominently featured at the top
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
    },
    {
      id: "corporate-law",
      title: "Corporate Law",
      description: "Company formation, due diligence, and compliance management tools",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/corporate-law"
    },
    {
      id: "family-law",
      title: "Family Law",
      description: "Maintenance calculation, custody analysis, and family law document generation",
      icon: <Heart className="h-5 w-5 text-blue-600" />,
      path: "/family-law"
    },
    {
      id: "real-estate-law",
      title: "Real Estate Law",
      description: "Title search, RERA compliance, and property document generation tools",
      icon: <Home className="h-5 w-5 text-blue-600" />,
      path: "/real-estate-law"
    }
  ];

  const accessibilityTools = [
    {
      id: "screen-reader",
      title: "Screen Reader Mode",
      description: "Optimized interface for screen reader accessibility",
      icon: <Accessibility className="h-5 w-5 text-blue-600" />,
      path: "/settings?tab=accessibility"
    },
    {
      id: "text-options",
      title: "Text Options",
      description: "Adjust text size, contrast and spacing for better readability",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/settings?tab=accessibility"
    },
    {
      id: "voice-navigation",
      title: "Voice Navigation",
      description: "Navigate and control the application using voice commands",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/settings?tab=accessibility"
    }
  ];

  const researchTools = [
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
      path: "/ai-legal-summarizer",
      badge: "New"
    },
    {
      id: "advanced-ai-search",
      title: "Advanced AI Search",
      description: "Perform advanced AI-powered searches across legal documents",
      icon: <Search className="h-5 w-5 text-blue-600" />,
      path: "/advanced-ai-search",
      badge: "New"
    },
    {
      id: "ai-legal-translator",
      title: "AI Legal Translator",
      description: "Translate legal documents between different languages",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "ai-legal-citation",
      title: "AI Legal Citation Generator",
      description: "Generate legal citations in various formats",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "ai-legal-query",
      title: "AI Legal Query Generator",
      description: "Generate legal queries based on case details",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
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
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "legal-template-library",
      title: "Legal Template Library",
      description: "Access a library of legal document templates for various purposes",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "legal-form-filler",
      title: "Legal Form Filler",
      description: "Fill out legal forms with AI-powered assistance",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "legal-document-automation",
      title: "Legal Document Automation",
      description: "Automate the creation of legal documents with AI-powered workflows",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
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
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      path: "/deadline-management"
    },
    {
      id: "legal-audit",
      title: "Legal Audit",
      description: "Conduct legal audits to identify potential risks and compliance issues",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "regulatory-alerts",
      title: "Regulatory Alerts",
      description: "Receive alerts about changes in laws and regulations",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "policy-generator",
      title: "Policy Generator",
      description: "Generate legal policies for your organization",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment",
      description: "Assess legal risks and develop mitigation strategies",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/tools",
      badge: "Coming Soon"
    },
  ];

  const specializedTools = [
    {
      id: "legal-calculator",
      title: "Legal Calculator",
      description: "Calculate court fees, damages, interest and limitation periods for Indian legal proceedings",
      icon: <Calculator className="h-5 w-5 text-blue-600" />,
      path: "/legal-calculator",
      badge: "Featured"
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
      description: "Access resources for starting and running a business under Indian law",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/startup-toolkit"
    },
    {
      id: "financial-obligations",
      title: "Financial Obligations Monitor",
      description: "Track financial clauses in agreements including loans, royalties, GST payments, and TDS",
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
      path: "/financial-obligations"
    },
    {
      id: "fraud-detector",
      title: "Financial Fraud Detector",
      description: "AI-powered analysis to identify potentially fraudulent financial activities",
      icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
      path: "/fraud-detector"
    },
    {
      id: "tax-compliance",
      title: "Tax Law Advisor",
      description: "Comprehensive tax guidance and compliance analysis for Indian tax laws",
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
      path: "/tax-compliance"
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Highlighted Tools Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-6 rounded-xl shadow-md border border-purple-100 dark:border-purple-900/20">
        <ToolCategory
          title="Highlighted Tools"
          description="Our most powerful and popular legal tools"
          tools={highlightedTools}
          className="mb-2"
        />
      </div>
      
      {/* Specialized Tools */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6 rounded-xl shadow-sm">
        <ToolCategory
          title="Specialized Legal Tools"
          description="Essential calculation and prediction tools for legal professionals"
          tools={specializedTools}
          className="mb-2"
        />
      </div>
      
      {/* Research Tools */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl shadow-sm">
        <ToolCategory
          title="Legal Research & Analysis"
          description="AI-powered tools to research case law, analyze legal issues, and search documents"
          tools={researchTools}
          className="mb-2"
        />
      </div>
      
      {/* Practice Area Tools */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-xl shadow-sm">
        <ToolCategory
          title="Practice-Specific Legal Tools"
          description="Specialized tools and resources for different areas of legal practice"
          tools={practiceAreaTools}
          className="mb-2"
        />
        <div className="mt-4 flex justify-center">
          <Link to="/practice-areas">
            <Button variant="outline" size="lg" className="font-medium">
              Explore All Practice Areas
            </Button>
          </Link>
        </div>
      </div>
      
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
      
      {/* Accessibility Tools */}
      <ToolCategory
        title="Accessibility Features"
        description="Tools to customize your experience for better accessibility"
        tools={accessibilityTools}
      />
    </div>
  );
};

export default AllTools;
