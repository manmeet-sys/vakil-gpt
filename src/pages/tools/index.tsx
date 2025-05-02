
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import ExploreToolsSection from '@/components/ExploreToolsSection';
import ToolCategory from '@/components/ToolsCategories';
import AllTools from '@/components/AllTools';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Settings, History, Star, Calculator, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Track recently viewed tools
  const [recentTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recentlyViewedTools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const navigateToSettings = () => {
    navigate('/settings');
    toast.info('Accessing settings page');
  };

  // Function to navigate to emphasized tools
  const navigateToTool = (path: string) => {
    navigate(path);
    toast.info(`Opening ${path.replace('/', '')}`);
  };

  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>Legal Tools | VakilGPT</title>
        <meta name="description" content="Explore our comprehensive suite of legal tools designed for legal professionals in India" />
      </Helmet>
      
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold font-playfair">Legal Tools</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2" 
              onClick={navigateToSettings}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search for tools..." 
              className="pl-10 py-6 pr-4 text-lg rounded-lg border-gray-200 dark:border-gray-700 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {recentTools.length > 0 && !searchQuery && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-gray-700 p-2 shadow-lg z-10">
                <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
                  <History className="h-3 w-3" />
                  <span>Recent tools:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recentTools.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mb-8 flex-wrap">
            <Button variant="outline" className="text-sm flex items-center gap-1.5">
              <Star className="h-4 w-4 text-yellow-500" /> Favorites
            </Button>
            <Button variant="outline" className="text-sm">Contract Tools</Button>
            <Button variant="outline" className="text-sm">Compliance</Button>
            <Button variant="outline" className="text-sm">Research</Button>
            <Button variant="outline" className="text-sm">Documentation</Button>
            <Button variant="outline" className="text-sm">Analytics</Button>
          </div>
        </div>
        
        {/* Highlighted Featured Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Calculator Card */}
            <div 
              onClick={() => navigateToTool('/legal-calculator')}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group border border-amber-200 dark:border-amber-900/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-700/90 z-0"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-white/10 z-0"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-playfair">Legal Calculator</h3>
                    <Badge variant="outline" className="bg-amber-700/30 text-amber-50 border-amber-600/30 mt-1">
                      Featured Tool
                    </Badge>
                  </div>
                </div>
                <p className="text-amber-50 mb-6">Calculate court fees, limitation periods, interest rates for Indian cases with state-specific calculations.</p>
                <motion.div 
                  className="flex items-center text-white font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Open Calculator
                  <svg className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Financial Tools Card */}
            <div 
              onClick={() => navigateToTool('/financial-obligations')}
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group border border-blue-200 dark:border-blue-900/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 z-0"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-white/10 z-0"></div>
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <IndianRupee className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-playfair">Financial Tools</h3>
                    <Badge variant="outline" className="bg-blue-700/30 text-blue-50 border-blue-600/30 mt-1">
                      Enhanced
                    </Badge>
                  </div>
                </div>
                <p className="text-blue-50 mb-6">Track financial obligations, detect fraud patterns, and ensure tax compliance with our specialized Indian legal financial tools.</p>
                <motion.div 
                  className="flex items-center text-white font-medium"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Explore Financial Tools
                  <svg className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ExploreToolsSection />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12"
        >
          <AllTools />
        </motion.div>
      </div>
    </OptimizedAppLayout>
  );
};

export default ToolsPage;
