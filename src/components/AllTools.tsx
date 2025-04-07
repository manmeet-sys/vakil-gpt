
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Scale, FileText, Shield, CheckCircle, ClipboardList, 
  Briefcase, Handshake, UserPlus, DollarSign, TrendingUp, Lock, MessageSquare, 
  FileSearch, List, Clipboard, BarChart2, AlertTriangle, Landmark, User,
  CalendarClock, Gavel, Calculator, IndianRupee, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AllTools = () => {
  const toolCategories = [
    {
      id: 'user-tools',
      title: 'Advocate Tools',
      tools: [
        { 
          name: 'Billing Tracking', 
          icon: <IndianRupee className="h-5 w-5" />, 
          path: '/billing-tracking',
          badge: 'Popular'
        },
        { 
          name: 'Case Management', 
          icon: <FileText className="h-5 w-5" />, 
          path: '/court-filing' 
        },
        { 
          name: 'Deadline Management', 
          icon: <CalendarClock className="h-5 w-5" />, 
          path: '/deadline-management',
          badge: 'New'
        }
      ]
    },
    {
      id: 'ai-assistance',
      title: 'AI Legal Assistant',
      tools: [
        { 
          name: 'Legal Chat Bot', 
          icon: <MessageSquare className="h-5 w-5" />, 
          path: '/chat',
          badge: 'Popular'
        },
        { 
          name: 'Legal Document Analyzer', 
          icon: <FileSearch className="h-5 w-5" />, 
          path: '/legal-document-analyzer' 
        },
        { 
          name: 'Legal Brief Generation', 
          icon: <BookOpen className="h-5 w-5" />, 
          path: '/legal-brief-generation' 
        }
      ]
    },
    {
      id: 'legal-research',
      title: 'Indian Legal Research',
      tools: [
        { 
          name: 'Indian Case Law Research', 
          icon: <Scale className="h-5 w-5" />, 
          path: '/case-law-research' 
        },
        { 
          name: 'Statute Tracker (BNS/BNSS/BSA)', 
          icon: <List className="h-5 w-5" />, 
          path: '/statute-tracker',
          badge: 'Updated'
        },
        { 
          name: 'Legal Knowledge Base', 
          icon: <BookOpen className="h-5 w-5" />, 
          path: '/knowledge' 
        }
      ]
    },
    {
      id: 'document-automation',
      title: 'Document & Compliance',
      tools: [
        { 
          name: 'Indian Contract Tools', 
          icon: <Clipboard className="h-5 w-5" />, 
          path: '/contract-drafting' 
        },
        { 
          name: 'DPDP & Data Compliance', 
          icon: <Shield className="h-5 w-5" />, 
          path: '/gdpr-compliance',
          badge: 'Critical'
        },
        { 
          name: 'AML Compliance', 
          icon: <AlertTriangle className="h-5 w-5" />, 
          path: '/aml-compliance' 
        }
      ]
    },
    {
      id: 'risk-assessment',
      title: 'Risk & Criminal Justice',
      tools: [
        { 
          name: 'Legal Risk Assessment', 
          icon: <BarChart2 className="h-5 w-5" />, 
          path: '/legal-risk-assessment' 
        },
        { 
          name: 'Indian Litigation Predictor', 
          icon: <Landmark className="h-5 w-5" />, 
          path: '/litigation-prediction',
          badge: 'AI-Powered'
        },
        { 
          name: 'Legal Due Diligence', 
          icon: <CheckCircle className="h-5 w-5" />, 
          path: '/legal-due-diligence' 
        },
        { 
          name: 'Plea Bargain Assistant', 
          icon: <Gavel className="h-5 w-5" />, 
          path: '/plea-bargain',
          badge: 'New'
        },
        { 
          name: 'Sentencing Predictor', 
          icon: <Scale className="h-5 w-5" />, 
          path: '/sentencing-predictor' 
        }
      ]
    },
    {
      id: 'business-tools',
      title: 'Business Legal Tools',
      tools: [
        { 
          name: 'Startup Legal Toolkit', 
          icon: <Briefcase className="h-5 w-5" />, 
          path: '/startup-toolkit' 
        },
        { 
          name: 'M&A Due Diligence', 
          icon: <Handshake className="h-5 w-5" />, 
          path: '/m&a-due-diligence',
          badge: 'Premium'
        },
        { 
          name: 'IP Protection', 
          icon: <Shield className="h-5 w-5" />, 
          path: '/ip-protection' 
        }
      ]
    },
    {
      id: 'financial-legal',
      title: 'Financial Legal Tools',
      tools: [
        { 
          name: 'Financial Obligations', 
          icon: <FileText className="h-5 w-5" />, 
          path: '/financial-obligations' 
        },
        { 
          name: 'Financial Fraud Detector', 
          icon: <Lock className="h-5 w-5" />, 
          path: '/fraud-detector',
          badge: 'AI-Powered'
        },
        { 
          name: 'Tax Compliance', 
          icon: <Calculator className="h-5 w-5" />, 
          path: '/tax-compliance' 
        }
      ]
    }
  ];

  // Animation variants for staggered animations
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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {toolCategories.map((category) => (
        <motion.div 
          key={category.id}
          variants={itemVariants}
          className="relative group"
        >
          <Card 
            className="p-6 rounded-xl border border-legal-border dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-sm hover:shadow-md transition-all duration-300 h-full"
          >
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-semibold text-legal-slate dark:text-white flex items-center gap-2">
                {category.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <ul className="space-y-3">
                {category.tools.map((tool) => (
                  <li key={tool.name}>
                    <Link 
                      to={tool.path}
                      className="flex items-center justify-between group p-2 -mx-2 rounded-md hover:bg-legal-accent/5 dark:hover:bg-legal-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-legal-accent/10 text-legal-accent">
                          {tool.icon}
                        </div>
                        <span className="text-legal-slate dark:text-white/90 font-medium">{tool.name}</span>
                        {tool.badge && (
                          <Badge variant="outline" className={cn("text-xs py-0 h-5", getBadgeVariant(tool.badge))}>
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-legal-accent/10 text-legal-accent transform transition-transform group-hover:translate-x-1 duration-200">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="p-0 mt-4 pt-4 border-t border-legal-border/20 dark:border-legal-slate/20">
              <Link to="/tools" className="w-full">
                <Button variant="ghost" className="text-legal-accent hover:text-legal-accent/90 hover:bg-legal-accent/10 w-full justify-center group">
                  View All Tools
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1 duration-200" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Decorative gradient element */}
          <div className="absolute -z-10 inset-0 bg-gradient-to-br from-legal-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AllTools;
