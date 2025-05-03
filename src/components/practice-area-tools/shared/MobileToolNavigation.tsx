
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { preloadComponents } from '@/utils/performance';

interface ToolNavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  importFunc?: () => Promise<any>; // Optional import function for preloading
}

interface MobileToolNavigationProps {
  currentToolPath: string;
  tools: ToolNavigationItem[];
  categoryName: string;
  showOnDesktop?: boolean;
}

export const MobileToolNavigation: React.FC<MobileToolNavigationProps> = ({
  currentToolPath,
  tools,
  categoryName,
  showOnDesktop = false
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // If we only want to show on mobile and we're not on mobile, don't render
  if (!showOnDesktop && !isMobile) {
    return null;
  }
  
  // Find current tool index
  const currentIndex = tools.findIndex(tool => tool.path === currentToolPath);
  
  // Calculate prev and next tools
  const prevTool = currentIndex > 0 ? tools[currentIndex - 1] : null;
  const nextTool = currentIndex < tools.length - 1 ? tools[currentIndex + 1] : null;
  
  // Preload adjacent tools for better navigation performance
  useEffect(() => {
    if (prevTool?.importFunc || nextTool?.importFunc) {
      const preloadFuncs: (() => Promise<any>)[] = [];
      if (prevTool?.importFunc) preloadFuncs.push(prevTool.importFunc);
      if (nextTool?.importFunc) preloadFuncs.push(nextTool.importFunc);
      
      preloadComponents(preloadFuncs);
    }
  }, [prevTool, nextTool]);
  
  // Handle navigation with preloading
  const handleNavigate = (tool: ToolNavigationItem | null) => {
    if (tool) {
      navigate(tool.path);
    }
  };
  
  return (
    <motion.div 
      className="flex items-center justify-between mt-4 pt-4 border-t border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => prevTool && handleNavigate(prevTool)}
        disabled={!prevTool}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {prevTool && (
          <span className="hidden sm:inline-block">{prevTool.name}</span>
        )}
        <span className="sm:hidden">Previous</span>
      </Button>
      
      <p className="text-sm text-muted-foreground">
        <span className="hidden sm:inline-block">{categoryName} Tools:</span> {currentIndex + 1} of {tools.length}
      </p>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => nextTool && handleNavigate(nextTool)}
        disabled={!nextTool}
        className="flex items-center gap-1"
      >
        {nextTool && (
          <span className="hidden sm:inline-block">{nextTool.name}</span>
        )}
        <span className="sm:hidden">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default MobileToolNavigation;
