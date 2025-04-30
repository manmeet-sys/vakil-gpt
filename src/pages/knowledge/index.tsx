
import React, { useEffect, useState } from 'react';
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from '@/components/ThemeToggle';
import KnowledgeManager from '@/components/KnowledgeManager';
import KnowledgeStats from '@/components/KnowledgeStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

const KnowledgePage = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDashboardCustomizing, setIsDashboardCustomizing] = useState<boolean>(false);
  
  // Ensure page scrolls to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-zinc-900 dark:to-indigo-950/20 transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-zinc-700/50 py-3 px-4 flex items-center justify-between backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">VakilGPT Knowledge Base</h1>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className={`text-xs flex items-center gap-1 ${isDashboardCustomizing ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30' : ''}`}
            onClick={() => setIsDashboardCustomizing(!isDashboardCustomizing)}
          >
            <Settings2 className="h-3 w-3" />
            <span>Customize</span>
          </Button>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 overflow-hidden">
        <div className="w-full max-w-6xl space-y-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Tabs 
              defaultValue="dashboard" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="dashboard" className="text-sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="manager" className="text-sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Manage Knowledge Base
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6 animate-fadeUp">
                <motion.div variants={itemVariants}>
                  <KnowledgeStats isCustomizing={isDashboardCustomizing} />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="manager" className="animate-fadeUp">
                <motion.div variants={itemVariants}>
                  <KnowledgeManager />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgePage;
