
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Shield, 
  FileText, 
  Scale, 
  MessageSquare,
  FileSearch,
  BookOpen,
  Clipboard,
  BarChart2,
  AlertTriangle,
  Briefcase,
  Handshake,
  Calculator,
  IndianRupee,
  CalendarClock,
  Gavel
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedLogo from '@/components/AnimatedLogo';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const ToolsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const savedScrollPosition = sessionStorage.getItem('scroll_/tools');
    if (savedScrollPosition && location.state?.fromTool) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 100);
    }
  }, [location]);
  
  const navigateToTool = (path: string) => {
    sessionStorage.setItem('scroll_/tools', window.scrollY.toString());
    navigate(path, { state: { fromTool: false } });
  };

  const toolCategories = [
    {
      id: 'user-tools',
      title: 'Advocate Practice Tools',
      description: 'Essential tools for Indian legal professionals to manage cases, deadlines, and finances',
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      tools: [
        { 
          name: 'Billing Tracking', 
          icon: IndianRupee, 
          description: 'Generate and manage GST-compliant invoices with hourly billing and expense tracking', 
          path: '/billing-tracking',
          badge: 'Popular'
        },
        { 
          name: 'Case Management', 
          icon: FileText, 
          description: 'Organize client cases, track court filings, and manage case documents efficiently', 
          path: '/court-filing' 
        },
        { 
          name: 'Deadline Management', 
          icon: CalendarClock, 
          description: 'Never miss critical court dates with automated reminders and calendar integration', 
          path: '/deadline-management',
          badge: 'New'
        }
      ]
    },
    {
      id: 'ai-assistance',
      title: 'AI Legal Assistant',
      description: 'AI-powered tools to assist with Indian legal tasks and research',
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
      tools: [
        { 
          name: 'Legal Chat Bot', 
          icon: MessageSquare, 
          description: 'Chat with an AI legal assistant about Indian law', 
          path: '/chat',
          badge: 'Popular'
        },
        { 
          name: 'Legal Document Analyzer', 
          icon: FileSearch, 
          description: 'Analyze Indian legal documents for key points and risks', 
          path: '/legal-document-analyzer' 
        },
        { 
          name: 'Legal Brief Generation', 
          icon: BookOpen, 
          description: 'Generate legal briefs for Indian courts based on your inputs', 
          path: '/legal-brief-generation' 
        }
      ]
    },
    {
      id: 'legal-research',
      title: 'Indian Legal Research',
      description: 'Tools for researching Indian case law, statutes, and legal knowledge',
      icon: <Scale className="h-6 w-6 text-green-600" />,
      tools: [
        { 
          name: 'Case Law Research', 
          icon: Scale, 
          description: 'Research relevant Indian case law for your legal matters', 
          path: '/case-law-research' 
        },
        { 
          name: 'Statute Tracker', 
          icon: BookOpen, 
          description: 'Track changes and updates to Indian statutes including BNS, BNSS, and BSA', 
          path: '/statute-tracker',
          badge: 'Updated'
        },
        { 
          name: 'Legal Knowledge Base', 
          icon: BookOpen, 
          description: 'Access a comprehensive database of Indian legal information', 
          path: '/knowledge' 
        }
      ]
    },
    {
      id: 'document-automation',
      title: 'Document & Compliance',
      description: 'Tools for Indian legal document creation and regulatory compliance',
      icon: <Clipboard className="h-6 w-6 text-amber-600" />,
      tools: [
        { 
          name: 'Contract Drafting', 
          icon: Clipboard, 
          description: 'Draft and review legal contracts under Indian law', 
          path: '/contract-drafting' 
        },
        { 
          name: 'DPDP Compliance', 
          icon: Shield, 
          description: 'Check compliance with Indian Digital Personal Data Protection Act', 
          path: '/gdpr-compliance',
          badge: 'Critical'
        },
        { 
          name: 'AML Compliance', 
          icon: AlertTriangle, 
          description: 'Anti-Money Laundering compliance tools for India', 
          path: '/aml-compliance' 
        }
      ]
    },
    {
      id: 'risk-assessment',
      title: 'Risk & Criminal Justice',
      description: 'Tools for assessing legal risks and managing criminal cases in India',
      icon: <BarChart2 className="h-6 w-6 text-red-600" />,
      tools: [
        { 
          name: 'Legal Risk Assessment', 
          icon: BarChart2, 
          description: 'Identify and assess legal risks in your business under Indian law', 
          path: '/legal-risk-assessment' 
        },
        { 
          name: 'Litigation Prediction', 
          icon: Scale, 
          description: 'Predictive analytics for Indian litigation outcomes', 
          path: '/litigation-prediction',
          badge: 'AI-Powered'
        },
        { 
          name: 'Legal Due Diligence', 
          icon: FileSearch, 
          description: 'Thorough due diligence reports and analysis for Indian legal context', 
          path: '/legal-due-diligence' 
        },
        { 
          name: 'Plea Bargain Assistant', 
          icon: Gavel, 
          description: 'Analyze plea bargain options under the Bharatiya Nyaya Sanhita', 
          path: '/plea-bargain',
          badge: 'New'
        },
        { 
          name: 'Sentencing Predictor', 
          icon: Scale, 
          description: 'Predict potential sentencing outcomes in Indian criminal cases', 
          path: '/sentencing-predictor' 
        }
      ]
    },
    {
      id: 'business-tools',
      title: 'Business Legal Tools',
      description: 'Legal tools for business operations and transactions in India',
      icon: <Briefcase className="h-6 w-6 text-purple-600" />,
      tools: [
        { 
          name: 'Startup Toolkit', 
          icon: Briefcase, 
          description: 'Essential legal tools for startups in India', 
          path: '/startup-toolkit' 
        },
        { 
          name: 'M&A Due Diligence', 
          icon: Handshake, 
          description: 'Mergers and acquisitions due diligence assistance for Indian companies', 
          path: '/m&a-due-diligence',
          badge: 'Premium'
        },
        { 
          name: 'IP Protection', 
          icon: Shield, 
          description: 'Intellectual property protection strategies under Indian law', 
          path: '/ip-protection' 
        }
      ]
    },
    {
      id: 'financial-legal',
      title: 'Financial Legal Tools',
      description: 'Tools for financial legal matters and compliance in India',
      icon: <Calculator className="h-6 w-6 text-teal-600" />,
      tools: [
        { 
          name: 'Financial Obligations', 
          icon: FileText, 
          description: 'Monitor financial obligations and deadlines under Indian regulations', 
          path: '/financial-obligations' 
        },
        { 
          name: 'Financial Fraud Detector', 
          icon: AlertTriangle, 
          description: 'Detect potential financial fraud according to Indian banking regulations', 
          path: '/fraud-detector',
          badge: 'AI-Powered'
        },
        { 
          name: 'Tax Compliance', 
          icon: Calculator, 
          description: 'Ensure compliance with Indian tax laws and regulations', 
          path: '/tax-compliance' 
        }
      ]
    }
  ];

  const filteredCategories = searchTerm 
    ? toolCategories.map(category => ({
        ...category,
        tools: category.tools.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.tools.length > 0)
    : toolCategories;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getBadgeVariant = (badgeText?: string) => {
    if (!badgeText) return '';
    
    switch (badgeText.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30';
      case 'popular':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/30';
      case 'updated':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/30';
      case 'ai-powered':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30';
      case 'premium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/30';
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Indian Legal Tools | VakilGPT</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero section with search */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 md:p-8 rounded-2xl">
            <div className="text-center md:text-left max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-3">
                Indian Legal Tools Suite
              </h1>
              <p className="text-legal-muted dark:text-gray-300 text-lg">
                Access specialized tools and resources designed for Indian legal practitioners
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <AnimatedLogo className="hidden md:block" />
            </div>
          </div>
        </motion.div>

        {/* Categories tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 flex w-full overflow-x-auto pb-2 no-scrollbar">
            <TabsTrigger value="all" className="min-w-max">All Tools</TabsTrigger>
            {toolCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="min-w-max">
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* All tools tab content */}
          <TabsContent value="all">
            {filteredCategories.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-lg text-muted-foreground">No tools match your search. Try different keywords.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredCategories.map((category) => (
                  <motion.div 
                    key={category.id}
                    variants={itemVariants}
                    className="relative group"
                  >
                    <Card className="h-full border border-legal-border/70 dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="pb-4 bg-gradient-to-r from-legal-light/50 to-transparent dark:from-legal-slate/20 dark:to-transparent">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-white dark:bg-legal-slate/30 shadow-sm">
                            {category.icon}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-semibold text-legal-slate dark:text-white">
                              {category.title}
                            </CardTitle>
                            <CardDescription className="text-legal-muted dark:text-gray-400 line-clamp-2">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <ul className="space-y-3">
                          {category.tools.map((tool) => (
                            <li key={tool.name}>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-left hover:bg-legal-accent/5 dark:hover:bg-legal-accent/10 p-2"
                                onClick={() => navigateToTool(tool.path)}
                              >
                                <div className="flex items-center w-full">
                                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-legal-accent/10 text-legal-accent mr-3">
                                    <tool.icon className="h-5 w-5" />
                                  </div>
                                  <div className="flex-grow mr-2">
                                    <div className="flex items-center">
                                      <span className="font-medium text-legal-slate dark:text-white/90">{tool.name}</span>
                                      {tool.badge && (
                                        <Badge variant="outline" className={`ml-2 text-xs py-0 h-5 ${getBadgeVariant(tool.badge)}`}>
                                          {tool.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    {!isMobile && (
                                      <p className="text-sm text-legal-muted dark:text-gray-400 line-clamp-1">{tool.description}</p>
                                    )}
                                  </div>
                                  <div className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center bg-legal-accent/10 text-legal-accent ml-auto">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </div>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Decorative gradient accent */}
                    <div className="absolute -z-10 inset-0 bg-gradient-to-br from-legal-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </TabsContent>
          
          {/* Individual category tab contents */}
          {toolCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-legal-accent/10">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-legal-slate dark:text-white">{category.title}</h2>
                    <p className="text-legal-muted dark:text-gray-300">{category.description}</p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {category.tools
                  .filter(tool => 
                    !searchTerm || 
                    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((tool) => (
                    <motion.div 
                      key={tool.name}
                      variants={itemVariants}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300 border border-legal-border/70 dark:border-legal-slate/20">
                        <CardHeader className="pb-3 bg-gradient-to-r from-legal-light/50 to-transparent dark:from-legal-slate/20 dark:to-transparent">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-white dark:bg-legal-slate/30 shadow-sm">
                              <tool.icon className="h-5 w-5 text-legal-accent" />
                            </div>
                            <div className="flex items-center">
                              <CardTitle className="text-lg font-semibold text-legal-slate dark:text-white">{tool.name}</CardTitle>
                              {tool.badge && (
                                <Badge variant="outline" className={`ml-2 text-xs py-0 h-5 ${getBadgeVariant(tool.badge)}`}>
                                  {tool.badge}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-6">
                          <p className="text-legal-muted dark:text-gray-400 mb-6">{tool.description}</p>
                          <Button 
                            onClick={() => navigateToTool(tool.path)}
                            className="w-full bg-legal-accent/10 hover:bg-legal-accent/20 text-legal-accent"
                          >
                            Open Tool
                            <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                {category.tools.filter(tool => 
                  !searchTerm || 
                  tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  tool.description.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="col-span-full text-center p-8">
                    <p className="text-lg text-muted-foreground">No tools match your search in this category. Try different keywords.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ToolsPage;
