import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
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
  Gavel,
  Search,
  PenLine
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      tools: [
        { 
          name: 'Billing Tracking', 
          icon: IndianRupee, 
          path: '/billing-tracking',
          badge: 'Popular'
        },
        { 
          name: 'Case Management', 
          icon: FileText, 
          path: '/court-filing' 
        },
        { 
          name: 'Deadline Management', 
          icon: CalendarClock, 
          path: '/deadline-management',
          badge: 'New'
        },
        { 
          name: 'Document Drafting', 
          icon: PenLine, 
          path: '/legal-document-drafting',
          badge: 'New'
        }
      ]
    },
    {
      id: 'ai-assistance',
      title: 'AI Legal Assistant',
      icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
      tools: [
        { 
          name: 'Legal Chat Bot', 
          icon: MessageSquare, 
          path: '/chat',
          badge: 'Popular'
        },
        { 
          name: 'Legal Document Analyzer', 
          icon: FileSearch, 
          path: '/legal-document-analyzer' 
        },
        { 
          name: 'Legal Brief Generation', 
          icon: BookOpen, 
          path: '/legal-brief-generation' 
        }
      ]
    },
    {
      id: 'legal-research',
      title: 'Indian Legal Research',
      icon: <Scale className="h-6 w-6 text-green-600" />,
      tools: [
        { 
          name: 'Case Law Research', 
          icon: Scale, 
          path: '/case-law-research' 
        },
        { 
          name: 'Statute Tracker', 
          icon: BookOpen, 
          path: '/statute-tracker',
          badge: 'Updated'
        },
        { 
          name: 'Legal Knowledge Base', 
          icon: BookOpen, 
          path: '/knowledge' 
        }
      ]
    },
    {
      id: 'document-automation',
      title: 'Document & Compliance',
      icon: <Clipboard className="h-6 w-6 text-amber-600" />,
      tools: [
        { 
          name: 'Contract Drafting', 
          icon: Clipboard, 
          path: '/contract-drafting' 
        },
        { 
          name: 'DPDP Compliance', 
          icon: Shield, 
          path: '/dpdp-compliance',
          badge: 'Critical'
        },
        { 
          name: 'AML Compliance', 
          icon: AlertTriangle, 
          path: '/aml-compliance',
          badge: 'Updated'
        }
      ]
    },
    {
      id: 'risk-assessment',
      title: 'Risk & Criminal Justice',
      icon: <BarChart2 className="h-6 w-6 text-red-600" />,
      tools: [
        { 
          name: 'Legal Risk Assessment', 
          icon: BarChart2, 
          path: '/legal-risk-assessment' 
        },
        { 
          name: 'Litigation Prediction', 
          icon: Scale, 
          path: '/litigation-prediction',
          badge: 'AI-Powered'
        },
        { 
          name: 'Legal Due Diligence', 
          icon: FileSearch, 
          path: '/legal-due-diligence' 
        },
        { 
          name: 'Plea Bargain Assistant', 
          icon: Gavel, 
          path: '/plea-bargain',
          badge: 'New'
        },
        { 
          name: 'Sentencing Predictor', 
          icon: Scale, 
          path: '/sentencing-predictor' 
        }
      ]
    },
    {
      id: 'business-tools',
      title: 'Business Legal Tools',
      icon: <Briefcase className="h-6 w-6 text-purple-600" />,
      tools: [
        { 
          name: 'Startup Toolkit', 
          icon: Briefcase, 
          path: '/startup-toolkit' 
        },
        { 
          name: 'M&A Due Diligence', 
          icon: Handshake, 
          path: '/m&a-due-diligence',
          badge: 'Premium'
        },
        { 
          name: 'IP Protection', 
          icon: Shield, 
          path: '/ip-protection' 
        }
      ]
    },
    {
      id: 'financial-legal',
      title: 'Financial Legal Tools',
      icon: <Calculator className="h-6 w-6 text-teal-600" />,
      tools: [
        { 
          name: 'Financial Obligations', 
          icon: FileText, 
          path: '/financial-obligations' 
        },
        { 
          name: 'Financial Fraud Detector', 
          icon: AlertTriangle, 
          path: '/fraud-detector',
          badge: 'AI-Powered'
        },
        { 
          name: 'Tax Compliance', 
          icon: Calculator, 
          path: '/tax-compliance' 
        }
      ]
    }
  ];

  const filteredCategories = searchTerm 
    ? toolCategories.map(category => ({
        ...category,
        tools: category.tools.filter(tool => 
          tool.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.tools.length > 0)
    : toolCategories;

  // Animation variants - optimized for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14
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
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 md:p-8 rounded-2xl shadow-elegant">
            <div className="text-center md:text-left max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-legal-slate dark:text-white mb-3 tracking-tight">
                Indian Legal Tools Suite
              </h1>
              <p className="text-legal-muted dark:text-gray-300 text-lg">
                Access specialized tools for Indian legal practitioners
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search tools..."
                  className="pl-4 pr-10 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <AnimatedLogo className="hidden md:block" />
            </div>
          </div>
        </motion.div>

        {/* Tools grid */}
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
                        <CardTitle className="text-xl font-semibold text-legal-slate dark:text-white truncate">
                          {category.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ul className="space-y-3">
                      {category.tools.map((tool) => (
                        <li key={tool.name}>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-left hover:bg-legal-accent/5 dark:hover:bg-legal-accent/10 p-2 transition-colors duration-200"
                            onClick={() => navigateToTool(tool.path)}
                          >
                            <div className="flex items-center w-full">
                              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-legal-accent/10 text-legal-accent mr-3">
                                <tool.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-grow mr-2 overflow-hidden">
                                <div className="flex items-center flex-wrap gap-1">
                                  <span className="font-medium text-legal-slate dark:text-white/90 truncate max-w-[150px]">{tool.name}</span>
                                  {tool.badge && (
                                    <Badge variant="outline" className={`text-xs py-0 h-5 ${getBadgeVariant(tool.badge)}`}>
                                      {tool.badge}
                                    </Badge>
                                  )}
                                </div>
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
      </div>
    </AppLayout>
  );
};

export default ToolsPage;
