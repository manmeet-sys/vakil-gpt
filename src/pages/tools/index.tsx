
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import ExploreToolsSection from '@/components/ExploreToolsSection';
import ToolCategory from '@/components/ToolsCategories';
import AllTools from '@/components/AllTools';
import { Badge } from '@/components/ui/badge';
import { MobileInput } from '@/components/ui/mobile-input';
import { MobileButton } from '@/components/ui/mobile-button';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Settings, History, Star, Filter, Grid, List, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { typography } from '@/lib/typography';

const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  
  // Track recently viewed tools with better mobile support
  const [recentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentlyViewedTools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    { id: 'all', name: 'All Tools', icon: Grid },
    { id: 'contract', name: 'Contract Tools', icon: Star },
    { id: 'compliance', name: 'Compliance', icon: Settings },
    { id: 'research', name: 'Research', icon: Search },
    { id: 'analytics', name: 'Analytics', icon: Zap }
  ];

  const navigateToSettings = () => {
    navigate('/settings');
    toast.info('Accessing settings page');
  };

  // Animation variants for mobile-first approach
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <OptimizedAppLayout>
      <Helmet>
        <title>Legal Tools | VakilGPT</title>
        <meta name="description" content="Explore our comprehensive suite of legal tools designed for legal professionals in India" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Header Section - Mobile Optimized */}
          <motion.div 
            className="max-w-4xl mx-auto mb-8 md:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className={cn(typography.heading.h1, "text-3xl md:text-4xl lg:text-5xl mb-4")}>
                Legal Tools
                <span className="block text-lg md:text-xl font-normal text-gray-600 dark:text-gray-400 mt-2">
                  Comprehensive suite of AI-powered legal tools
                </span>
              </h1>
            </motion.div>
            
            {/* Mobile-First Search and Controls */}
            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <MobileInput
                  type="text" 
                  placeholder="Search for legal tools..." 
                  className="pl-12 pr-4 h-14 md:h-12 text-base rounded-2xl border-gray-200 dark:border-gray-700 shadow-sm focus:shadow-md transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Category Filters - Mobile Scrollable */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:justify-center scrollbar-hide">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <MobileButton
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      mobileSize="sm"
                      className={cn(
                        "flex items-center gap-2 whitespace-nowrap shrink-0",
                        "rounded-full px-4 py-2",
                        selectedCategory === category.id 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </MobileButton>
                  );
                })}
              </div>
              
              {/* View Mode and Settings - Mobile Layout */}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <MobileButton
                    variant={viewMode === 'grid' ? "default" : "outline"}
                    mobileSize="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-full"
                  >
                    <Grid className="h-4 w-4" />
                  </MobileButton>
                  <MobileButton
                    variant={viewMode === 'list' ? "default" : "outline"}
                    mobileSize="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-full"
                  >
                    <List className="h-4 w-4" />
                  </MobileButton>
                </div>
                
                <MobileButton 
                  variant="outline" 
                  mobileSize="sm"
                  className="flex items-center gap-2 rounded-full" 
                  onClick={navigateToSettings}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </MobileButton>
              </div>
              
              {/* Recent Tools - Mobile Friendly */}
              <AnimatePresence>
                {recentTools.length > 0 && !searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <History className="h-4 w-4 text-gray-500" />
                      <span className={cn(typography.ui.label, "text-sm text-gray-600 dark:text-gray-400")}>
                        Recent tools
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentTools.slice(0, 5).map((tool, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-full px-3 py-1"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
          
          {/* Main Content - Enhanced Mobile Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 md:space-y-16"
          >
            <motion.div variants={itemVariants}>
              <ExploreToolsSection />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <AllTools viewMode={viewMode} searchQuery={searchQuery} selectedCategory={selectedCategory} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </OptimizedAppLayout>
  );
};

export default ToolsPage;
