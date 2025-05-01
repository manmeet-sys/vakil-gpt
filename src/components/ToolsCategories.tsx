
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface ToolCategoryProps {
  title: string;
  description: string;
  tools: Tool[];
  className?: string;
}

const ToolCategory = ({
  title,
  description,
  tools,
  className
}: ToolCategoryProps) => {
  // Safe navigation with fallback for when component is rendered outside Router context
  let navigate: (path: string) => void;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    // Fallback navigation function if not within Router context
    navigate = (path: string) => {
      window.location.href = path;
    };
  }

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  // Animation variants
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
    hidden: { opacity: 0, y: 10 },
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
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-legal-slate dark:text-white">{title}</h3>
        <p className="text-legal-muted dark:text-gray-400 text-sm">{description}</p>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={itemVariants}>
            <Card 
              className="border border-legal-border/60 dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 shadow-sm hover:shadow-md transition-all duration-300 h-full"
              onClick={() => handleNavigation(tool.path)}
            >
              <CardHeader className="pb-1 pt-3 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-legal-accent/10 flex items-center justify-center">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-sm font-semibold text-legal-slate dark:text-white">
                      {tool.title}
                    </CardTitle>
                  </div>
                  <div className="flex">
                    {tool.isNew && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-1 py-0">New</Badge>
                    )}
                    {tool.isPopular && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] px-1 py-0 ml-1">Popular</Badge>
                    )}
                    {tool.badge && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] px-1 py-0 ml-1">{tool.badge}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 py-1">
                <CardDescription className="text-xs text-legal-muted dark:text-gray-400 line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="px-3 pt-0 pb-2">
                <Button 
                  variant="ghost" 
                  className="text-legal-accent hover:text-legal-accent/90 hover:bg-legal-accent/10 p-0 h-6 w-full justify-start text-xs"
                >
                  Explore
                  <ArrowRight className="ml-1 h-3 w-3" />
                  <span className="sr-only">Explore {tool.title}</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ToolCategory;
