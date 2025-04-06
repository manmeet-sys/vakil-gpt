import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scale, FileText, Shield, CheckCircle, ClipboardList, 
  Briefcase, Handshake, UserPlus, DollarSign, TrendingUp, Lock, MessageSquare, 
  FileSearch, List, Clipboard, BarChart2, AlertTriangle, Landmark, User,
  CalendarClock, IndianRupee, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const AllTools = () => {
  const toolCategories = [
    {
      id: 'user-tools',
      title: 'Advocate Tools',
      tools: [
        { name: 'Advocate Profile', icon: <User className="h-5 w-5" />, path: '/user-profile' },
        { name: 'Court Filing Automation', icon: <FileText className="h-5 w-5" />, path: '/court-filing' },
        { name: 'Deadline Management', icon: <CalendarClock className="h-5 w-5" />, path: '/deadline-management' }
      ]
    },
    {
      id: 'ai-assistance',
      title: 'AI Legal Assistant',
      tools: [
        { name: 'Legal Chat Bot', icon: <MessageSquare className="h-5 w-5" />, path: '/chat' },
        { name: 'Legal Document Analyzer', icon: <FileSearch className="h-5 w-5" />, path: '/legal-document-analyzer' },
        { name: 'Legal Brief Generation', icon: <BookOpen className="h-5 w-5" />, path: '/legal-brief-generation' }
      ]
    },
    {
      id: 'legal-research',
      title: 'Indian Legal Research',
      tools: [
        { name: 'Indian Case Law Research', icon: <Scale className="h-5 w-5" />, path: '/case-law-research' },
        { name: 'Statute Tracker (BNS/BNSS/BSA)', icon: <List className="h-5 w-5" />, path: '/statute-tracker' },
        { name: 'Legal Knowledge Base', icon: <BookOpen className="h-5 w-5" />, path: '/knowledge' }
      ]
    },
    {
      id: 'document-automation',
      title: 'Document & Compliance',
      tools: [
        { name: 'Indian Contract Tools', icon: <Clipboard className="h-5 w-5" />, path: '/contract-drafting' },
        { name: 'DPDP & Data Compliance', icon: <Shield className="h-5 w-5" />, path: '/gdpr-compliance' },
        { name: 'AML Compliance', icon: <AlertTriangle className="h-5 w-5" />, path: '/aml-compliance' }
      ]
    },
    {
      id: 'risk-assessment',
      title: 'Risk & Criminal Justice',
      tools: [
        { name: 'Legal Risk Assessment', icon: <BarChart2 className="h-5 w-5" />, path: '/legal-risk-assessment' },
        { name: 'Indian Litigation Predictor', icon: <Landmark className="h-5 w-5" />, path: '/litigation-prediction' },
        { name: 'Legal Due Diligence', icon: <CheckCircle className="h-5 w-5" />, path: '/legal-due-diligence' },
        { name: 'Plea Bargain Assistant', icon: <Gavel className="h-5 w-5" />, path: '/plea-bargain' },
        { name: 'Sentencing Predictor', icon: <Scale className="h-5 w-5" />, path: '/sentencing-predictor' }
      ]
    },
    {
      id: 'business-tools',
      title: 'Business Legal Tools',
      tools: [
        { name: 'Startup Legal Toolkit', icon: <Briefcase className="h-5 w-5" />, path: '/startup-toolkit' },
        { name: 'M&A Due Diligence', icon: <Handshake className="h-5 w-5" />, path: '/m&a-due-diligence' },
        { name: 'IP Protection', icon: <Shield className="h-5 w-5" />, path: '/ip-protection' }
      ]
    },
    {
      id: 'financial-legal',
      title: 'Financial Legal Tools',
      tools: [
        { name: 'Billing Tracking', icon: <IndianRupee className="h-5 w-5" />, path: '/billing-tracking' },
        { name: 'Financial Obligations', icon: <FileText className="h-5 w-5" />, path: '/financial-obligations' },
        { name: 'Financial Fraud Detector', icon: <Lock className="h-5 w-5" />, path: '/fraud-detector' },
        { name: 'Tax Compliance', icon: <FileText className="h-5 w-5" />, path: '/tax-compliance' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {toolCategories.map((category) => (
        <div 
          key={category.id}
          className="p-6 rounded-xl border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold text-legal-slate dark:text-white mb-4">
            {category.title}
          </h3>
          
          <ul className="space-y-3">
            {category.tools.map((tool) => (
              <li key={tool.name}>
                <Link 
                  to={tool.path}
                  className="flex items-center justify-between group p-2 -mx-2 rounded-md hover:bg-legal-accent/5 dark:hover:bg-legal-accent/10 transition-colors"
                >
                  <span className="flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-legal-accent/10 text-legal-accent mr-3">
                      {tool.icon}
                    </span>
                    <span className="text-legal-slate dark:text-white/90">{tool.name}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-legal-muted group-hover:text-legal-accent transition-colors transform group-hover:translate-x-1 duration-200" />
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-4 border-t border-legal-border dark:border-legal-slate/20">
            <Link to="/tools">
              <Button variant="ghost" className="text-legal-accent hover:text-legal-accent/90 hover:bg-legal-accent/10 p-0 h-8">
                View All Tools
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllTools;
