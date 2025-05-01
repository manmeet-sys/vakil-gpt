
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
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const AllTools = () => {
  // Practice area tools - featured prominently at the top
  const practiceAreaTools = [
    {
      id: "criminal-law",
      title: "Criminal Law",
      description: "BNS code tools, sentencing prediction, defense strategies",
      icon: <Gavel className="h-5 w-5 text-blue-600" />,
      path: "/criminal-law",
      isPopular: true
    },
    {
      id: "civil-law",
      title: "Civil Law",
      description: "Cause of action analysis, limitation calculator, relief generator",
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      path: "/civil-law"
    },
    {
      id: "corporate-law",
      title: "Corporate Law",
      description: "Company formation, due diligence, compliance management",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/corporate-law"
    },
    {
      id: "family-law",
      title: "Family Law",
      description: "Maintenance calculation, custody analysis, document generation",
      icon: <Heart className="h-5 w-5 text-blue-600" />,
      path: "/family-law"
    },
    {
      id: "real-estate-law",
      title: "Real Estate Law",
      description: "Title search, RERA compliance, property document generation",
      icon: <Home className="h-5 w-5 text-blue-600" />,
      path: "/real-estate-law",
      isNew: true
    }
  ];

  const advocateTools = [
    {
      id: "billing-tracking",
      title: "Billing Tracker",
      description: "Track billable hours, generate invoices, and manage payments",
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
      path: "/billing-tracking",
      isPopular: true
    },
    {
      id: "deadline-management",
      title: "Deadline Manager",
      description: "Track filing deadlines, court dates, and other time-sensitive tasks",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/deadline-management"
    },
    {
      id: "advocate-portal",
      title: "Advocate Portal",
      description: "Connect with other advocates, share insights, and discuss cases",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/client-portal",
      isNew: true
    }
  ];

  const researchTools = [
    {
      id: "legal-research",
      title: "AI Legal Researcher",
      description: "Research case law, statutes, and legal articles with AI",
      icon: <FileSearch className="h-5 w-5 text-blue-600" />,
      path: "/legal-research"
    },
    {
      id: "legal-document-analyzer",
      title: "Legal Document Analyzer",
      description: "Analyze documents for key clauses, risks, and compliance issues",
      icon: <Search className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-analyzer",
      isPopular: true
    },
    {
      id: "ai-legal-summarizer",
      title: "Case Law Summarizer",
      description: "Get concise summaries of lengthy judgments and legal documents",
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      path: "/ai-legal-summarizer"
    }
  ];

  const documentTools = [
    {
      id: "legal-document-drafting",
      title: "Document Drafter",
      description: "Draft legal documents with AI-powered templates and suggestions",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-drafting",
      isPopular: true
    },
    {
      id: "contract-review",
      title: "Contract Reviewer",
      description: "Review contracts for risks, compliance issues, and negotiation points",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/contract-review"
    },
    {
      id: "legal-template-library",
      title: "Template Library",
      description: "Access a library of legal document templates for various purposes",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/legal-template-library"
    }
  ];

  const riskTools = [
    {
      id: "legal-risk-assessment",
      title: "Risk Assessor",
      description: "Identify legal risks in business operations and transactions",
      icon: <BarChart2 className="h-5 w-5 text-blue-600" />,
      path: "/legal-risk-assessment"
    },
    {
      id: "litigation-prediction",
      title: "Litigation Predictor",
      description: "Predict litigation outcomes based on case details and precedents",
      icon: <BarChart2 className="h-5 w-5 text-blue-600" />,
      path: "/litigation-prediction",
      badge: "AI-Powered"
    },
    {
      id: "compliance-assistance",
      title: "Compliance Assistant",
      description: "Navigate complex regulatory requirements and ensure compliance",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/compliance-assistance"
    }
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Featured Practice Areas Section - New prominent hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-xl shadow-sm mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-legal-slate dark:text-white flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" />
            Practice-Specific Legal Tools
          </h2>
          <p className="text-legal-muted dark:text-gray-400 mt-1">
            Specialized tools and resources tailored for different areas of Indian legal practice
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {practiceAreaTools.map((tool) => (
            <Card 
              key={tool.id}
              className="border border-blue-100 dark:border-blue-900/20 hover:shadow-md transition-all duration-200"
            >
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-blue-900/20 shadow-sm">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {tool.title}
                    {tool.isNew && <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 rounded-full">New</span>}
                    {tool.isPopular && <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 rounded-full">Popular</span>}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-legal-muted dark:text-gray-400 text-sm mb-4">{tool.description}</p>
                <Link to={tool.path} className="text-blue-600 dark:text-blue-400 text-sm font-medium inline-flex items-center hover:underline">
                  Explore Tools
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        
        <div className="mt-6 flex justify-center">
          <Link to="/practice-areas">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse All Practice Areas
              <BookOpen className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Advocate Practice Tools */}
      <ToolCategory
        title="Advocate Efficiency Tools"
        description="Essential tools to streamline your legal practice workflow"
        tools={advocateTools}
      />
      
      {/* Legal Research & Analysis */}
      <ToolCategory
        title="Research & Analysis Tools"
        description="AI-powered tools to research case law and analyze legal issues"
        tools={researchTools}
      />
      
      {/* Document Drafting & Management */}
      <ToolCategory
        title="Document Creation & Management"
        description="Create and customize legal documents efficiently"
        tools={documentTools}
      />
      
      {/* Risk & Compliance Management */}
      <ToolCategory
        title="Risk & Compliance Tools"
        description="Assess legal risks and ensure regulatory compliance"
        tools={riskTools}
      />
    </div>
  );
};

export default AllTools;
