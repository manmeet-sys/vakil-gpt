
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scale, FileText, Shield, CheckCircle, ClipboardList, 
  Briefcase, Handshake, UserPlus, DollarSign, TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const AllTools = () => {
  const toolCategories = [
    {
      id: 'legal-research',
      title: 'Legal Research & Analysis',
      tools: [
        { name: 'AI Legal Brief Generation', icon: <BookOpen className="h-5 w-5" />, path: '/legal-brief-generation' },
        { name: 'Case Law Research', icon: <Scale className="h-5 w-5" />, path: '/case-law-research' },
        { name: 'Statute Tracker', icon: <FileText className="h-5 w-5" />, path: '/statute-tracker' }
      ]
    },
    {
      id: 'document-automation',
      title: 'Document & Compliance',
      tools: [
        { name: 'Legal Document Analyzer', icon: <ClipboardList className="h-5 w-5" />, path: '/legal-document-analyzer' },
        { name: 'Contract Drafting & Review', icon: <FileText className="h-5 w-5" />, path: '/contract-drafting' },
        { name: 'GDPR Compliance Checker', icon: <Shield className="h-5 w-5" />, path: '/gdpr-compliance' }
      ]
    },
    {
      id: 'financial-legal',
      title: 'Financial Legal Tools',
      tools: [
        { name: 'Due Diligence Reports', icon: <CheckCircle className="h-5 w-5" />, path: '/legal-due-diligence' },
        { name: 'Financial Fraud Detector', icon: <Lock className="h-5 w-5" />, path: '/fraud-detector' },
        { name: 'M&A Analysis', icon: <Briefcase className="h-5 w-5" />, path: '/m&a-due-diligence' }
      ]
    },
    {
      id: 'other-tools',
      title: 'Specialized Solutions',
      tools: [
        { name: 'Legal Risk Assessment', icon: <Shield className="h-5 w-5" />, path: '/legal-risk-assessment' },
        { name: 'Client Management', icon: <UserPlus className="h-5 w-5" />, path: '/virtual-assistant' },
        { name: 'Legal Education', icon: <BookOpen className="h-5 w-5" />, path: '/legal-education' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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
                View All {category.title}
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
