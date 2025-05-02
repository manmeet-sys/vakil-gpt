
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator } from 'lucide-react';

export interface BaseCalculatorProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onCalculate?: () => void;
  results?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const BaseCalculator: React.FC<BaseCalculatorProps> = ({
  title,
  description,
  icon = <Calculator className="h-5 w-5" />,
  children,
  onCalculate,
  results,
  footerContent
}) => {
  const [showResults, setShowResults] = useState(false);
  
  const handleCalculate = () => {
    if (onCalculate) {
      onCalculate();
    }
    setShowResults(true);
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {children}
        </div>
        
        {showResults && results && (
          <>
            <Separator className="my-4" />
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-medium text-sm mb-2">Results</h3>
              {results}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="default"
          onClick={handleCalculate}
          className="w-full sm:w-auto"
        >
          Calculate
        </Button>
        
        {footerContent}
      </CardFooter>
    </Card>
  );
};

export default BaseCalculator;
