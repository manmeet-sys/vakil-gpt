
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, BookOpen, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PracticeAreaToolsProps {
  practiceArea: string;
  description: string;
  icon: React.ReactNode;
  tools: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }[];
  lawUpdates?: {
    title: string;
    date: string;
    description: string;
  }[];
  keyLegalPrinciples?: {
    title: string;
    description: string;
    source?: string;
  }[];
}

const PracticeAreaTools: React.FC<PracticeAreaToolsProps> = ({
  practiceArea,
  description,
  icon,
  tools,
  lawUpdates = [],
  keyLegalPrinciples = []
}) => {
  const navigate = useNavigate();
  const [activeToolId, setActiveToolId] = useState<string | null>(tools.length > 0 ? tools[0].id : null);
  
  const activeTool = tools.find(tool => tool.id === activeToolId);
  
  return (
    <div className="space-y-8">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-playfair tracking-tight">{practiceArea}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </motion.div>
      
      {/* Tools Navigation */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-playfair font-medium">Practice Tools</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tool Navigation Sidebar */}
          <div className="space-y-3">
            {tools.map((tool) => (
              <Card 
                key={tool.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${activeToolId === tool.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-border'}`}
                onClick={() => setActiveToolId(tool.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-base font-playfair">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <CardDescription className="line-clamp-2 text-xs">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Active Tool Content */}
          <div className="md:col-span-3 bg-card rounded-lg border border-border p-4">
            {activeTool ? activeTool.content : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a tool to get started</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Law Updates Section - Enhanced with motion */}
      {lawUpdates.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-playfair font-medium mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Recent Legal Updates
          </h2>
          <div className="grid gap-4">
            {lawUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-l-4 border-l-blue-500 overflow-hidden">
                  <CardHeader className="pb-2 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-playfair">{update.title}</CardTitle>
                      <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">{update.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-3 px-6">
                    <Button variant="link" className="p-0 h-auto text-xs text-blue-600 flex items-center gap-1">
                      Read more <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
      
      {/* Legal Principles Section - Enhanced with motion */}
      {keyLegalPrinciples.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-playfair font-medium mb-4 flex items-center gap-2">
            <Scale className="h-4 w-4 text-amber-600" />
            Key Legal Principles
          </h2>
          <div className="grid gap-4">
            {keyLegalPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2 bg-amber-50/50 dark:bg-amber-900/10">
                    <CardTitle className="text-base font-playfair">{principle.title}</CardTitle>
                    {principle.source && (
                      <CardDescription className="text-xs italic">{principle.source}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-3">
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default PracticeAreaTools;
