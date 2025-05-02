
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
  footerContent?: ReactNode; // Add optional footerContent prop
}

export const BaseCalculator: React.FC<BaseCalculatorProps> = ({
  title,
  description,
  icon,
  onCalculate,
  results,
  children,
  footerContent, // Add footerContent to the destructuring
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-lg font-playfair">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="bg-muted/30 p-4 rounded-md">
          {children}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={onCalculate}
            className="w-full sm:w-auto"
          >
            Calculate
          </Button>
        </div>
        
        {results && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-md p-4 bg-card"
          >
            {results}
          </motion.div>
        )}
      </CardContent>
      
      {/* Render footer content if provided */}
      {footerContent && (
        <CardFooter className="pt-0">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};
