
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
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

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-legal-slate dark:text-white">{title}</h3>
        <p className="text-legal-muted dark:text-gray-400">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id} 
            className="border border-legal-border/60 dark:border-legal-slate/20 bg-white dark:bg-legal-slate/10 backdrop-blur-sm rounded-xl hover:shadow-apple-hover transition-all duration-300"
          >
            <CardHeader className="pb-2">
              <div className="w-10 h-10 rounded-full bg-legal-accent/10 flex items-center justify-center mb-2">
                {tool.icon}
              </div>
              <CardTitle className="text-lg font-semibold text-legal-slate dark:text-white">
                {tool.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-legal-muted dark:text-gray-400">
                {tool.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                className="text-legal-accent hover:text-legal-accent/90 hover:bg-legal-accent/10 p-0 h-8"
                onClick={() => handleNavigation(tool.path)}
              >
                Explore Tool
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ToolCategory;
