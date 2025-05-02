
import React, { useState } from 'react';
import { BaseCalculator } from '@/components/practice-area-tools/base';
import { Calculator } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const MaintenanceCalculator = () => {
  const [applicableAct, setApplicableAct] = useState('hindu');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(1);
  const [expenses, setExpenses] = useState<number>(0);
  const [employmentStatus, setEmploymentStatus] = useState('unemployed');
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  
  const handleCalculate = () => {
    // Basic calculation logic based on Indian family law principles
    let basePercentage = 0;
    let finalAmount = 0;
    let calculationExplanation = '';
    
    switch (applicableAct) {
      case 'hindu':
        basePercentage = 25; // Approx guideline under Hindu Marriage Act
        calculationExplanation = 'Under Hindu Marriage Act, maintenance is typically 25-30% of the spouse\'s income';
        break;
      case 'muslim':
        basePercentage = 20; // Approx guideline under Muslim Personal Law
        calculationExplanation = 'Under Muslim Personal Law, maintenance (or Nafqah) is calculated based on status and reasonable needs';
        break;
      case 'christian':
        basePercentage = 25; // Under Indian Divorce Act
        calculationExplanation = 'Under Indian Divorce Act applicable to Christians, maintenance is based on standard of living and income';
        break;
      case 'crpc125':
        basePercentage = 20; // Under Section 125 CrPC
        calculationExplanation = 'Under Section 125 of CrPC, maintenance is based on income and reasonable necessities';
        break;
      default:
        basePercentage = 20;
    }
    
    // Adjustments based on number of dependents
    const dependentAdjustment = dependents > 1 ? (dependents - 1) * 5 : 0;
    basePercentage += dependentAdjustment;
    
    // Cap at reasonable percentage
    if (basePercentage > 50) basePercentage = 50;
    
    // Employment status adjustment
    if (employmentStatus === 'employed') {
      basePercentage = Math.max(basePercentage - 10, 10); // Reduce but maintain minimum
      calculationExplanation += '\nAdjusted downward since recipient is employed';
    } else {
      calculationExplanation += '\nNo employment adjustment since recipient is unemployed/homemaker';
    }
    
    // Calculate base amount
    finalAmount = (monthlyIncome * basePercentage) / 100;
    
    // Expenses consideration (if valid expenses provided)
    if (expenses > 0) {
      const expenseAdjustment = Math.min(expenses, finalAmount * 0.3); // Cap expense adjustment
      finalAmount = Math.max(finalAmount - expenseAdjustment, finalAmount * 0.7);
      calculationExplanation += '\nAdjusted for necessary expenses of paying spouse';
    }
    
    // Ensure minimum maintenance
    if (monthlyIncome > 0) {
      finalAmount = Math.max(finalAmount, 3000); // Minimum maintenance amount
    }
    
    setCalculatedAmount(finalAmount);
    setExplanation(calculationExplanation + `\n\nFinal calculation: ${basePercentage}% of ${monthlyIncome} = ₹${finalAmount.toFixed(2)}`);
  };
  
  const renderResults = () => {
    if (calculatedAmount === null) return null;
    
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 flex justify-between items-center">
            <h3 className="font-medium font-playfair text-blue-800 dark:text-blue-300">Estimated Monthly Maintenance</h3>
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{calculatedAmount.toFixed(2)}</span>
          </div>
        </Card>
        
        <div className="rounded-lg overflow-hidden border">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border-b">
            <h4 className="font-medium font-playfair text-sm">Calculation Basis</h4>
          </div>
          <div className="p-3">
            <p className="whitespace-pre-line text-sm text-muted-foreground">{explanation}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground italic">
              Note: This is an estimate based on general principles. Actual court orders may vary based on specific circumstances.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <BaseCalculator
      title="Maintenance Calculator"
      description="Calculate maintenance amounts based on income, needs, and applicable personal law"
      icon={<Calculator className="h-5 w-5 text-blue-600" />}
      onCalculate={handleCalculate}
      results={renderResults()}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label 
            htmlFor="applicable-act" 
            className="font-medium font-playfair text-base"
          >
            Applicable Law
          </Label>
          <Select 
            value={applicableAct} 
            onValueChange={setApplicableAct}
          >
            <SelectTrigger 
              className={cn("w-full font-playfair transition-all", 
                applicableAct && "border-blue-300 dark:border-blue-600")} 
              id="applicable-act"
            >
              <SelectValue placeholder="Select Applicable Law" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hindu">Hindu Marriage Act</SelectItem>
              <SelectItem value="muslim">Muslim Personal Law</SelectItem>
              <SelectItem value="christian">Indian Divorce Act (Christians)</SelectItem>
              <SelectItem value="crpc125">Section 125 CrPC (General)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="monthly-income" className="font-medium">Monthly Income of Paying Spouse (₹)</Label>
            <Input 
              id="monthly-income"
              type="number" 
              value={monthlyIncome.toString()} 
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              min="0"
              className="font-playfair"
              placeholder="Enter monthly income"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dependents" className="font-medium">Number of Dependents</Label>
            <Input 
              id="dependents"
              type="number" 
              value={dependents.toString()} 
              onChange={(e) => setDependents(Number(e.target.value))}
              min="1"
              max="10"
              className="font-playfair"
              placeholder="Enter number of dependents"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expenses" className="font-medium">Essential Monthly Expenses of Paying Spouse (₹)</Label>
          <Input 
            id="expenses"
            type="number" 
            value={expenses.toString()} 
            onChange={(e) => setExpenses(Number(e.target.value))}
            min="0"
            className="font-playfair"
            placeholder="Enter monthly expenses"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="font-medium">Employment Status of Recipient</Label>
          <RadioGroup 
            value={employmentStatus} 
            onValueChange={setEmploymentStatus}
            className="flex flex-col space-y-1 pt-2"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3 bg-background">
              <RadioGroupItem value="unemployed" id="unemployed" />
              <Label htmlFor="unemployed" className="font-playfair">Unemployed/Homemaker</Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3 bg-background">
              <RadioGroupItem value="employed" id="employed" />
              <Label htmlFor="employed" className="font-playfair">Employed</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </BaseCalculator>
  );
};

export default MaintenanceCalculator;
