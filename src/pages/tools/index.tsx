
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
import { Search, Settings, History, Star } from 'lucide-react';
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

  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>Legal Tools | VakilGPT</title>
        <meta name="description" content="Explore our comprehensive suite of legal tools designed for legal professionals in India" />
      </Helmet>
      
      <div className="container px-4 sm:px-6">
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Legal Tools</h1>
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
