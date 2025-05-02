
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Gavel, Scale, Briefcase, Heart, Home } from 'lucide-react';
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
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-legal-slate dark:text-white font-playfair">{title}</h3>
        <p className="text-legal-muted dark:text-gray-400">{description}</p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={itemVariants}>
            <Card 
              className="border border-legal-border/60 dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 backdrop-blur-sm rounded-xl hover:shadow-apple-hover transition-all duration-300 h-full"
            >
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-full bg-legal-accent/10 flex items-center justify-center mb-2">
                  {tool.icon}
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-legal-slate dark:text-white font-playfair">
                    {tool.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 ml-2">
                    {tool.isNew && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">New</Badge>
                    )}
                    {tool.isPopular && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Popular</Badge>
                    )}
                    {tool.badge && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">{tool.badge}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-legal-muted dark:text-gray-400 min-h-[40px] line-clamp-3">
                  {tool.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="text-legal-accent hover:text-legal-accent/90 hover:bg-legal-accent/10 p-0 h-8 w-full justify-start"
                  onClick={() => handleNavigation(tool.path)}
                >
                  Explore Tool
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  <span className="sr-only">Explore {tool.title}</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {title === "Legal Research & Analysis" && (
        <div className="pt-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => handleNavigation("/practice-areas")}
          >
            <BookOpen className="h-4 w-4" />
            Browse All Practice Area Tools
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ToolCategory;
