
import React, { useState, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { designSystem } from '@/lib/design-system-standards';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

export interface PracticeAreaToolLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon: ReactNode;
  tabs?: Array<{
    id: string;
    label: string;
    content: ReactNode;
  }>;
  defaultTab?: string;
  backTo?: string;
  backLabel?: string;
  isLoading?: boolean;
  isAIEnabled?: boolean;
}

const PracticeAreaToolLayout: React.FC<PracticeAreaToolLayoutProps> = ({
  children,
  title,
  description,
  icon,
  tabs,
  defaultTab,
  backTo = "/tools",
  backLabel = "Back to Tools",
  isLoading = false,
  isAIEnabled = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>(defaultTab || (tabs && tabs[0]?.id) || 'main');
  
  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Store current scroll position for the destination page
      const scrollPosition = window.scrollY.toString();
      sessionStorage.setItem(`scroll_${backTo}`, scrollPosition);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [backTo]);

  const handleBack = () => {
    // Store current scroll position for the destination page
    const scrollPosition = window.scrollY.toString();
    sessionStorage.setItem(`scroll_${backTo}`, scrollPosition);
    
    // Navigate back to the specified route
    navigate(backTo, { 
      state: { 
        fromTool: true,
        scrollPosition
      } 
    });
  };

  // Restore scroll position when navigating to this page
  useEffect(() => {
    if (location.state?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(location.state.scrollPosition));
      }, 0);
    }
  }, [location.state]);

  return (
    <ResponsiveContainer 
      className="flex flex-col space-y-6"
      containerSize="lg"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          className="w-fit mb-2 flex items-center gap-2 hover:bg-legal-accent/10 shadow-sm"
          onClick={handleBack}
          aria-label={backLabel}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{backLabel}</span>
        </Button>
        
        <div className="flex items-start gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={designSystem.typography.headings.h3}>
                {title}
              </h1>
              {isAIEnabled && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50">
                  AI Enhanced
                </Badge>
              )}
            </div>
            {description && (
              <p className={`${designSystem.typography.body.default} max-w-3xl mt-1`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Main content area */}
      {tabs ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : `grid-cols-${Math.min(tabs.length, 4)}`}`}>
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent 
                key={tab.id} 
                value={tab.id}
                className="pt-6"
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </ResponsiveContainer>
  );
};

export default PracticeAreaToolLayout;
