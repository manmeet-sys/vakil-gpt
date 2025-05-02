
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface BaseCalculatorProps {
  title: string;
  description: string;
  icon: ReactNode;
  onCalculate: () => void;
  results: ReactNode;
  children: ReactNode;
  footerContent?: ReactNode;
}

export const BaseCalculator: React.FC<BaseCalculatorProps> = ({
  title,
  description,
  icon,
  onCalculate,
  results,
  children,
  footerContent,
}) => {
  return (
    <Card className="w-full shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2 space-y-1.5">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-lg font-playfair">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        <div className="bg-muted/30 p-5 rounded-lg border border-muted/50">
          {children}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onCalculate}
            className="w-full sm:w-auto font-medium gap-2 transition-all"
            size="lg"
          >
            Calculate
          </Button>
        </div>
        
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border rounded-lg p-5 bg-card shadow-sm border-primary/10"
          >
            {results}
          </motion.div>
        )}
      </CardContent>
      
      {footerContent && (
        <CardFooter className="pt-0 border-t border-muted/20 mt-2 py-4">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};
