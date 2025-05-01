
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
  Search,
  CalendarClock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const AllTools = () => {
  // Practice Area Tools - Added back with concise descriptions
  const practiceAreaTools = [
    {
      id: "criminal-law",
      title: "Criminal",
      description: "BNS codes and criminal defense tools",
      icon: <Gavel className="h-5 w-5 text-blue-600" />,
      path: "/criminal-law",
      isPopular: true
    },
    {
      id: "civil-law",
      title: "Civil",
      description: "Civil litigation and case management",
      icon: <Scale className="h-5 w-5 text-blue-600" />,
      path: "/civil-law"
    },
    {
      id: "family-law",
      title: "Family",
      description: "Maintenance and custody resources",
      icon: <Heart className="h-5 w-5 text-blue-600" />,
      path: "/family-law"
    },
    {
      id: "real-estate-law",
      title: "Real Estate",
      description: "Property and RERA compliance",
      icon: <Home className="h-5 w-5 text-blue-600" />,
      path: "/real-estate-law",
      isNew: true
    },
    {
      id: "corporate-law",
      title: "Corporate",
      description: "Company and compliance tools",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/corporate-law"
    }
  ];

  // Advocate Tools - More concise descriptions
  const advocateTools = [
    {
      id: "billing-tracking",
      title: "Billing",
      description: "Track hours and generate invoices",
      icon: <IndianRupee className="h-5 w-5 text-blue-600" />,
      path: "/billing-tracking",
      isPopular: true
    },
    {
      id: "deadline-management",
      title: "Deadlines",
      description: "Track court dates and filing deadlines",
      icon: <CalendarClock className="h-5 w-5 text-blue-600" />,
      path: "/deadline-management"
    },
    {
      id: "advocate-portal",
      title: "Adv. Portal",
      description: "Connect with other advocates",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      path: "/client-portal",
      isNew: true
    }
  ];

  // Research Tools - Shorter descriptions
  const researchTools = [
    {
      id: "legal-research",
      title: "AI Research",
      description: "Research laws and precedents",
      icon: <FileSearch className="h-5 w-5 text-blue-600" />,
      path: "/legal-research"
    },
    {
      id: "legal-document-analyzer",
      title: "Doc Analyzer",
      description: "Analyze legal documents",
      icon: <Search className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-analyzer",
      isPopular: true
    },
    {
      id: "ai-legal-summarizer",
      title: "Summarizer",
      description: "Summarize judgments quickly",
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      path: "/ai-legal-summarizer"
    }
  ];

  // Document Tools - Concise descriptions
  const documentTools = [
    {
      id: "legal-document-drafting",
      title: "Doc Drafter",
      description: "Draft legal documents with AI",
      icon: <File className="h-5 w-5 text-blue-600" />,
      path: "/legal-document-drafting",
      isPopular: true
    },
    {
      id: "contract-review",
      title: "Contract Review",
      description: "Review contracts for risks",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/contract-review"
    },
    {
      id: "legal-template-library",
      title: "Templates",
      description: "Access document templates",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/legal-template-library"
    }
  ];

  // Risk Tools - Brief descriptions
  const riskTools = [
    {
      id: "legal-risk-assessment",
      title: "Risk Assessment",
      description: "Identify legal risks",
      icon: <BarChart2 className="h-5 w-5 text-blue-600" />,
      path: "/legal-risk-assessment"
    },
    {
      id: "litigation-prediction",
      title: "Lit Predictor",
      description: "Predict case outcomes",
      icon: <BarChart2 className="h-5 w-5 text-blue-600" />,
      path: "/litigation-prediction",
      badge: "AI"
    },
    {
      id: "compliance-assistance",
      title: "Compliance",
      description: "Ensure regulatory compliance",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: "/compliance-assistance"
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Practice Area Tools - First section */}
      <ToolCategory
        title="Practice Areas"
        description="Specialized tools for different practice areas"
        tools={practiceAreaTools}
      />
      
      {/* Advocate Practice Tools */}
      <ToolCategory
        title="Advocate Efficiency Tools"
        description="Streamline your legal practice workflow"
        tools={advocateTools}
      />
      
      {/* Legal Research & Analysis */}
      <ToolCategory
        title="Research & Analysis"
        description="Research case law and analyze legal issues"
        tools={researchTools}
      />
      
      {/* Document Drafting & Management */}
      <ToolCategory
        title="Document Creation"
        description="Create and customize legal documents"
        tools={documentTools}
      />
      
      {/* Risk & Compliance Management */}
      <ToolCategory
        title="Risk & Compliance"
        description="Assess risks and ensure compliance"
        tools={riskTools}
      />
    </div>
  );
};

export default AllTools;
