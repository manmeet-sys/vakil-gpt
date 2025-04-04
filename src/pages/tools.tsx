
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Scale, FileText, Shield, CheckCircle, ClipboardList, 
  Briefcase, Handshake, UserPlus, DollarSign, TrendingUp, Lock, MessageSquare, 
  FileSearch, List, Clipboard, BarChart2, AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';
import AnimatedLogo from '@/components/AnimatedLogo';

const ToolsPage = () => {
  const navigate = useNavigate();
  
  const toolCategories = [
    {
      id: 'ai-assistance',
      title: 'AI Legal Assistant',
      description: 'AI-powered tools to assist with legal tasks and research',
      tools: [
        { name: 'Legal Chat Bot', icon: MessageSquare, description: 'Chat with an AI legal assistant about Indian law', path: '/chat' },
        { name: 'Legal Document Analyzer', icon: FileSearch, description: 'Analyze legal documents for key points and risks', path: '/legal-document-analyzer' },
        { name: 'Legal Brief Generation', icon: BookOpen, description: 'Generate legal briefs and memos based on your inputs', path: '/legal-brief-generation' }
      ]
    },
    {
      id: 'legal-research',
      title: 'Legal Research',
      description: 'Tools for researching case law, statutes, and legal knowledge',
      tools: [
        { name: 'Case Law Research', icon: Scale, description: 'Research relevant case law for your legal matters', path: '/case-law-research' },
        { name: 'Statute Tracker', icon: List, description: 'Track changes and updates to relevant statutes', path: '/statute-tracker' },
        { name: 'Legal Knowledge Base', icon: BookOpen, description: 'Access a comprehensive database of legal information', path: '/knowledge' }
      ]
    },
    {
      id: 'document-automation',
      title: 'Document & Compliance',
      description: 'Tools for document creation and regulatory compliance',
      tools: [
        { name: 'Contract Drafting', icon: Clipboard, description: 'Draft and review legal contracts', path: '/contract-drafting' },
        { name: 'GDPR Compliance', icon: Shield, description: 'Check compliance with data protection regulations', path: '/gdpr-compliance' },
        { name: 'AML Compliance', icon: AlertTriangle, description: 'Anti-Money Laundering compliance tools', path: '/aml-compliance' }
      ]
    },
    {
      id: 'risk-assessment',
      title: 'Risk Management',
      description: 'Tools for assessing and managing legal risks',
      tools: [
        { name: 'Legal Risk Assessment', icon: BarChart2, description: 'Identify and assess legal risks in your business', path: '/legal-risk-assessment' },
        { name: 'Litigation Prediction', icon: TrendingUp, description: 'Predictive analytics for litigation outcomes', path: '/litigation-prediction' },
        { name: 'Legal Due Diligence', icon: CheckCircle, description: 'Thorough due diligence reports and analysis', path: '/legal-due-diligence' }
      ]
    },
    {
      id: 'business-tools',
      title: 'Business Legal Tools',
      description: 'Legal tools for business operations and transactions',
      tools: [
        { name: 'Startup Toolkit', icon: Briefcase, description: 'Essential legal tools for startups', path: '/startup-toolkit' },
        { name: 'M&A Due Diligence', icon: Handshake, description: 'Mergers and acquisitions due diligence assistance', path: '/m&a-due-diligence' },
        { name: 'IP Protection', icon: Shield, description: 'Intellectual property protection strategies', path: '/ip-protection' }
      ]
    },
    {
      id: 'financial-legal',
      title: 'Financial Legal Tools',
      description: 'Tools for financial legal matters and compliance',
      tools: [
        { name: 'Billing Tracking', icon: DollarSign, description: 'Track and manage legal billing', path: '/billing-tracking' },
        { name: 'Financial Obligations', icon: FileText, description: 'Monitor financial obligations and deadlines', path: '/financial-obligations' },
        { name: 'Financial Fraud Detector', icon: Lock, description: 'Detect potential financial fraud', path: '/fraud-detector' }
      ]
    }
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>Legal Tools | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-legal-slate mb-2">Legal Tools</h1>
            <p className="text-legal-muted">Access specialized legal tools for various aspects of law and practice</p>
          </div>
          <AnimatedLogo />
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="ai-assistance">AI Assistant</TabsTrigger>
            <TabsTrigger value="legal-research">Research</TabsTrigger>
            <TabsTrigger value="document-automation">Documents</TabsTrigger>
            <TabsTrigger value="risk-assessment">Risk</TabsTrigger>
            <TabsTrigger value="business-tools">Business</TabsTrigger>
            <TabsTrigger value="financial-legal">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.tools.map((tool) => (
                        <li key={tool.name}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-left"
                            onClick={() => navigate(tool.path)}
                          >
                            <span className="flex items-center">
                              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-legal-accent/10 text-legal-accent mr-3">
                                <tool.icon className="h-5 w-5" />
                              </span>
                              <span>{tool.name}</span>
                            </span>
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {toolCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool) => (
                  <Card key={tool.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-legal-accent/10 text-legal-accent">
                          <tool.icon className="h-5 w-5" />
                        </span>
                        <CardTitle className="text-xl">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-legal-muted mb-4">{tool.description}</p>
                      <Button 
                        onClick={() => navigate(tool.path)}
                        className="w-full bg-legal-accent/10 text-legal-accent hover:bg-legal-accent/20"
                      >
                        Open Tool
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ToolsPage;
