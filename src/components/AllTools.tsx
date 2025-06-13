
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileButton } from '@/components/ui/mobile-button';
import { Badge } from '@/components/ui/badge';
import { RichText } from '@/components/ui/rich-text';
import { 
  ArrowRight, 
  BookOpen, 
  Gavel, 
  Scale, 
  Briefcase, 
  Shield, 
  FileText,
  TrendingUp,
  Users,
  Building2,
  Calculator,
  Clock,
  Star,
  Zap,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

interface AllToolsProps {
  viewMode?: 'grid' | 'list';
  searchQuery?: string;
  selectedCategory?: string;
}

const AllTools: React.FC<AllToolsProps> = ({ 
  viewMode = 'grid', 
  searchQuery = '', 
  selectedCategory = 'all' 
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteTools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allTools = [
    {
      id: 'contract-analysis',
      title: 'Contract Analysis',
      description: 'AI-powered contract review and analysis tool that identifies key clauses, potential risks, and suggests improvements for better legal protection.',
      category: 'contract',
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      path: '/tools/contract-analysis',
      isNew: false,
      isPopular: true,
      features: ['Risk Assessment', 'Clause Analysis', 'Legal Recommendations']
    },
    {
      id: 'legal-research',
      title: 'Legal Research Assistant',
      description: 'Comprehensive legal research tool that searches through Indian law databases, case precedents, and legal documents to provide relevant insights.',
      category: 'research',
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
      path: '/tools/legal-research',
      isNew: true,
      isPopular: false,
      features: ['Case Law Search', 'Statute Analysis', 'Precedent Finding']
    },
    {
      id: 'compliance-checker',
      title: 'Compliance Checker',
      description: 'Automated compliance verification tool that ensures your business operations meet all relevant Indian regulatory requirements and standards.',
      category: 'compliance',
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      path: '/tools/compliance-checker',
      isNew: false,
      isPopular: true,
      features: ['Regulatory Compliance', 'Risk Mitigation', 'Automated Checks']
    },
    {
      id: 'litigation-predictor',
      title: 'Litigation Outcome Predictor',
      description: 'Advanced AI tool that analyzes case details and predicts potential litigation outcomes based on historical data and legal precedents.',
      category: 'analytics',
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      path: '/tools/litigation-predictor',
      isNew: true,
      isPopular: false,
      features: ['Outcome Prediction', 'Risk Analysis', 'Strategic Planning']
    },
    {
      id: 'document-drafting',
      title: 'Smart Document Drafting',
      description: 'Intelligent document creation tool that generates legally sound documents, contracts, and agreements tailored to Indian legal requirements.',
      category: 'contract',
      icon: <Briefcase className="h-5 w-5 text-red-600" />,
      path: '/tools/document-drafting',
      isNew: false,
      isPopular: true,
      features: ['Template Library', 'Custom Drafting', 'Legal Compliance']
    },
    {
      id: 'ma-due-diligence',
      title: 'M&A Due Diligence',
      description: 'Comprehensive due diligence tool for mergers and acquisitions, providing detailed analysis of financial, legal, and operational aspects.',
      category: 'analytics',
      icon: <Building2 className="h-5 w-5 text-indigo-600" />,
      path: '/tools/ma-due-diligence',
      isNew: false,
      isPopular: false,
      features: ['Financial Analysis', 'Risk Assessment', 'Compliance Review']
    }
  ];

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteTools', JSON.stringify(newFavorites));
  };

  const handleToolClick = (path: string, toolTitle: string) => {
    // Track recently viewed tools
    const recentTools = JSON.parse(localStorage.getItem('recentlyViewedTools') || '[]');
    const updatedRecent = [toolTitle, ...recentTools.filter((t: string) => t !== toolTitle)].slice(0, 5);
    localStorage.setItem('recentlyViewedTools', JSON.stringify(updatedRecent));
    
    navigate(path);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(typography.heading.h2, "text-xl md:text-2xl")}>
            All Legal Tools
          </h2>
          <p className={cn(typography.body.small, "mt-1")}>
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${selectedCategory}-${searchQuery}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
              : "space-y-4"
          )}
        >
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={itemVariants}
              layout
              className="group"
            >
              <Card className={cn(
                "h-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm",
                "shadow-sm hover:shadow-lg transition-all duration-300",
                "rounded-2xl overflow-hidden",
                "hover:border-gray-300 dark:hover:border-gray-700",
                "cursor-pointer transform hover:scale-[1.02]"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                      {tool.icon}
                    </div>
                    <div className="flex gap-2">
                      <MobileButton
                        variant="ghost"
                        mobileSize="sm"
                        className="p-2 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                      >
                        <Star className={cn(
                          "h-4 w-4",
                          favorites.includes(tool.id) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-400"
                        )} />
                      </MobileButton>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className={cn(typography.heading.h4, "text-base md:text-lg leading-tight")}>
                        {tool.title}
                      </CardTitle>
                      {tool.isNew && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          New
                        </Badge>
                      )}
                      {tool.isPopular && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <RichText 
                    content={tool.description}
                    variant="compact"
                    className="mb-4"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <MobileButton
                      variant="ghost"
                      fullWidthOnMobile
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-0 h-auto justify-start group-hover:translate-x-1 transition-transform"
                      onClick={() => handleToolClick(tool.path, tool.title)}
                    >
                      <span className="font-medium">Explore Tool</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </MobileButton>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className={cn(typography.heading.h3, "mb-2")}>No tools found</h3>
          <p className={cn(typography.body.small, "text-gray-500")}>
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AllTools;
