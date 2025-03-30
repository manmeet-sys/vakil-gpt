
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCategory from '@/components/ToolsCategories';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Scale, FileText, Shield, CheckCircle, ClipboardList, 
  Briefcase, Lock, UserPlus, DollarSign, TrendingUp, Search, 
  Workflow, Calendar, MessageSquare, Clock, FileCheck, Handshake, 
  ArrowLeft
} from 'lucide-react';

const legalResearchTools = [
  {
    id: "legal-brief-generation",
    title: "AI-Powered Legal Brief Generation",
    description: "Summarizes case laws and statutes into structured legal briefs with citation support.",
    icon: <BookOpen className="w-5 h-5 text-legal-accent" />,
    path: "/legal-brief-generation"
  },
  {
    id: "statute-tracker",
    title: "Statute & Regulation Tracker",
    description: "Monitors and updates changes in laws across jurisdictions with customizable alerts.",
    icon: <Scale className="w-5 h-5 text-legal-accent" />,
    path: "/statute-tracker"
  },
  {
    id: "case-law-research",
    title: "Case Law Research",
    description: "Search across jurisdictions with intelligent filtering by court, date, topic, and relevance.",
    icon: <Search className="w-5 h-5 text-legal-accent" />,
    path: "/case-law-research"
  }
];

const documentTools = [
  {
    id: "contract-drafting",
    title: "Contract Drafting & Review",
    description: "AI analyzes contracts, flags risks, and suggests modifications based on best practices.",
    icon: <FileText className="w-5 h-5 text-legal-accent" />,
    path: "/contract-drafting"
  },
  {
    id: "e-signature",
    title: "E-Signature Integration",
    description: "Enables digital execution of contracts via secure e-signature platforms.",
    icon: <FileCheck className="w-5 h-5 text-legal-accent" />,
    path: "/e-signature"
  },
  {
    id: "gdpr-compliance",
    title: "GDPR & Data Privacy Compliance",
    description: "Reviews documents to ensure compliance with data protection laws across jurisdictions.",
    icon: <Shield className="w-5 h-5 text-legal-accent" />,
    path: "/gdpr-compliance"
  },
  {
    id: "legal-document-analyzer",
    title: "Legal Document Analyzer",
    description: "Extract key information from contracts, court filings, and legal opinions with AI.",
    icon: <ClipboardList className="w-5 h-5 text-legal-accent" />,
    path: "/legal-document-analyzer"
  }
];

const litigationTools = [
  {
    id: "litigation-prediction",
    title: "AI-Powered Litigation Prediction",
    description: "Estimates case outcomes using precedent analysis and jurisdiction-specific data.",
    icon: <Scale className="w-5 h-5 text-legal-accent" />,
    path: "/litigation-prediction"
  },
  {
    id: "court-filing",
    title: "Court Filing Automation",
    description: "Auto-fills and submits legal filings as per jurisdiction requirements.",
    icon: <FileText className="w-5 h-5 text-legal-accent" />,
    path: "/court-filing"
  },
  {
    id: "deadline-management",
    title: "Smart Deadline & Calendar Management",
    description: "Tracks legal deadlines and sends automated reminders for critical dates.",
    icon: <Calendar className="w-5 h-5 text-legal-accent" />,
    path: "/deadline-management"
  }
];

const clientManagementTools = [
  {
    id: "legal-chatbot",
    title: "Legal Chatbot for Clients",
    description: "AI assistant for answering legal queries and performing efficient case intake.",
    icon: <MessageSquare className="w-5 h-5 text-legal-accent" />,
    path: "/chat"
  },
  {
    id: "billing-tracking",
    title: "Billing & Time Tracking",
    description: "Logs billable hours, generates invoices, and automates payment processing.",
    icon: <Clock className="w-5 h-5 text-legal-accent" />,
    path: "/billing-tracking"
  },
  {
    id: "virtual-assistant",
    title: "Virtual Legal Assistant",
    description: "Manages document requests, schedules meetings, and sends automated updates.",
    icon: <UserPlus className="w-5 h-5 text-legal-accent" />,
    path: "/virtual-assistant"
  }
];

const businessLawTools = [
  {
    id: "due-diligence",
    title: "AI-Powered Due Diligence Reports",
    description: "Analyzes legal and financial aspects for M&A deals and business transactions.",
    icon: <CheckCircle className="w-5 h-5 text-legal-accent" />,
    path: "/legal-due-diligence"
  },
  {
    id: "ip-protection",
    title: "IP Protection Suite",
    description: "Searches for trademarks, patents, and copyrights to protect intellectual property.",
    icon: <Shield className="w-5 h-5 text-legal-accent" />,
    path: "/ip-protection"
  },
  {
    id: "startup-toolkit",
    title: "Startup & SME Legal Toolkit",
    description: "Offers templates for business agreements, NDAs, and essential contracts.",
    icon: <Briefcase className="w-5 h-5 text-legal-accent" />,
    path: "/startup-toolkit"
  }
];

const criminalLawTools = [
  {
    id: "sentencing-predictor",
    title: "AI Sentencing Predictor",
    description: "Analyzes past case outcomes to estimate potential sentencing based on similar cases.",
    icon: <Scale className="w-5 h-5 text-legal-accent" />,
    path: "/sentencing-predictor"
  },
  {
    id: "plea-bargain",
    title: "Plea Bargain Analyzer",
    description: "Suggests optimal plea strategies based on historical data and case specifics.",
    icon: <Handshake className="w-5 h-5 text-legal-accent" />,
    path: "/plea-bargain"
  }
];

const financialTools = [
  {
    id: "aml-compliance",
    title: "AML & KYC Compliance Checker",
    description: "Ensures businesses meet anti-money laundering and Know Your Customer requirements.",
    icon: <Shield className="w-5 h-5 text-legal-accent" />,
    path: "/aml-compliance"
  },
  {
    id: "tax-compliance",
    title: "Tax Law & Compliance Advisor",
    description: "AI-powered tool providing tax law guidance and comprehensive risk analysis.",
    icon: <DollarSign className="w-5 h-5 text-legal-accent" />,
    path: "/tax-compliance"
  },
  {
    id: "regulatory-reporting",
    title: "Regulatory Reporting Automation",
    description: "Generates financial reports to comply with various regulatory authorities.",
    icon: <FileText className="w-5 h-5 text-legal-accent" />,
    path: "/regulatory-reporting"
  },
  {
    id: "m&a-due-diligence",
    title: "M&A Due Diligence",
    description: "AI scans financial statements, contracts, and compliance records for risks in M&A.",
    icon: <TrendingUp className="w-5 h-5 text-legal-accent" />,
    path: "/m&a-due-diligence"
  },
  {
    id: "financial-obligations",
    title: "Financial Obligations Monitor",
    description: "Tracks financial clauses in agreements including loans, royalties, and liabilities.",
    icon: <Clock className="w-5 h-5 text-legal-accent" />,
    path: "/financial-obligations"
  },
  {
    id: "fraud-detector",
    title: "Financial Fraud Detector",
    description: "Identifies potentially fraudulent financial activities and compliance violations.",
    icon: <Lock className="w-5 h-5 text-legal-accent" />,
    path: "/fraud-detector"
  }
];

const ToolsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Animation for UI elements
    const inViewObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          inViewObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('.fade-up-element');
    elements.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10');
      el.classList.remove('animate-fade-up');
      inViewObserver.observe(el);
    });
    
    return () => {
      elements.forEach(el => inViewObserver.unobserve(el));
    };
  }, []);

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4 pl-0 text-legal-muted hover:text-legal-accent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-legal-slate dark:text-white mb-4 fade-up-element">
            Legal & Financial Tools
          </h1>
          <p className="text-lg text-legal-muted dark:text-gray-400 max-w-3xl fade-up-element">
            Explore our comprehensive suite of AI-powered tools designed for legal professionals, 
            businesses, and individuals seeking efficient legal and financial solutions.
          </p>
        </div>
        
        <div className="space-y-16">
          <ToolCategory 
            title="Legal Research & Analysis" 
            description="Advanced tools to streamline legal research and produce comprehensive analysis."
            tools={legalResearchTools}
            className="fade-up-element"
          />
          
          <ToolCategory 
            title="Document Automation & Compliance" 
            description="AI-powered tools for drafting, reviewing, and ensuring compliance of legal documents."
            tools={documentTools}
            className="fade-up-element"
          />
          
          <ToolCategory 
            title="Litigation & Case Management" 
            description="Solutions for predicting outcomes, managing court filings, and tracking critical deadlines."
            tools={litigationTools}
            className="fade-up-element"
          />
          
          <ToolCategory 
            title="Client & Firm Management" 
            description="Tools to enhance client communication, streamline billing, and automate administrative tasks."
            tools={clientManagementTools}
            className="fade-up-element"
          />
          
          <ToolCategory 
            title="Business & Contract Law" 
            description="Specialized tools for due diligence, intellectual property, and startup legal needs."
            tools={businessLawTools}
            className="fade-up-element"
          />
          
          <ToolCategory 
            title="Criminal & Civil Law" 
            description="Tools for case outcome prediction and optimizing legal strategies."
            tools={criminalLawTools}
            className="fade-up-element"
          />
          
          <ToolCategory 
            title="Financial Legal Tools" 
            description="Advanced solutions for financial compliance, risk management, and fraud detection."
            tools={financialTools}
            className="fade-up-element"
          />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ToolsPage;
